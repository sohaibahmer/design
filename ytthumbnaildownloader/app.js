/* ==========================================================================
   PROJECT 03 • YOUTUBE THUMBNAIL DOWNLOADER
   Frontend-only thumbnail discovery and download utility
   ========================================================================== */

const THUMBNAIL_VARIANTS = [
  { key: 'maxresdefault', label: 'Maximum Resolution', width: 1280, height: 720 },
  { key: 'sddefault', label: 'Standard Definition', width: 640, height: 480 },
  { key: 'hqdefault', label: 'High Quality', width: 480, height: 360 },
  { key: 'mqdefault', label: 'Medium Quality', width: 320, height: 180 },
  { key: 'default', label: 'Default', width: 120, height: 90 }
];

const IMAGE_FORMATS = [
  { extension: 'jpg', mimeType: 'image/jpeg', path: 'vi' },
  { extension: 'webp', mimeType: 'image/webp', path: 'vi_webp' }
];

document.addEventListener('DOMContentLoaded', initThumbnailDownloader);

function extractYouTubeId(value) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    let videoId = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0];
    } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(hostname)) {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else {
        const segments = url.pathname.split('/').filter(Boolean);
        if (['shorts', 'embed', 'live'].includes(segments[0])) videoId = segments[1];
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId || '') ? videoId : null;
  } catch {
    return /^[a-zA-Z0-9_-]{11}$/.test(value.trim()) ? value.trim() : null;
  }
}

function getThumbnailUrl(videoId, variant, format) {
  return `https://i.ytimg.com/${format.path}/${videoId}/${variant.key}.${format.extension}`;
}

function loadThumbnail(url, minimumWidth, minimumHeight) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const isPlaceholder = image.naturalWidth < minimumWidth || image.naturalHeight < minimumHeight;
      resolve(isPlaceholder ? null : {
        url,
        actualWidth: image.naturalWidth,
        actualHeight: image.naturalHeight
      });
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

async function discoverThumbnails(videoId) {
  const checks = [];

  THUMBNAIL_VARIANTS.forEach(variant => {
    IMAGE_FORMATS.forEach(format => {
      const minimumWidth = Math.max(100, Math.floor(variant.width * 0.75));
      const minimumHeight = Math.max(80, Math.floor(variant.height * 0.75));
      checks.push(
        loadThumbnail(
          getThumbnailUrl(videoId, variant, format),
          minimumWidth,
          minimumHeight
        ).then(result => result && ({ ...variant, ...format, ...result }))
      );
    });
  });

  const results = await Promise.all(checks);
  return results
    .filter(Boolean)
    .sort((a, b) => (b.actualWidth * b.actualHeight) - (a.actualWidth * a.actualHeight)
      || a.extension.localeCompare(b.extension));
}

async function getVideoMetadata(videoUrl, videoId) {
  const fallback = {
    title: `YouTube Video ${videoId}`,
    author: 'YouTube Creator'
  };

  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
    if (!response.ok) return fallback;
    const data = await response.json();
    return {
      title: data.title || fallback.title,
      author: data.author_name || fallback.author
    };
  } catch {
    return fallback;
  }
}

function initThumbnailDownloader() {
  const urlInput = document.getElementById('yt-url-input');
  const btnClear = document.getElementById('btn-clear-input');
  const btnParse = document.getElementById('btn-parse-link');
  const parsingLoader = document.getElementById('parsing-loader-box');
  const resultCard = document.getElementById('parsed-result-card');
  const videoThumb = document.getElementById('res-video-thumb');
  const videoTitle = document.getElementById('res-video-title');
  const channelName = document.getElementById('res-channel-name');
  const viewsCount = document.getElementById('res-views-count');
  const qualityTag = document.getElementById('res-quality-tag');
  const formatsContainer = document.getElementById('formats-list-container');
  const thumbnailCount = document.getElementById('thumbnail-count');
  const btnPreview = document.getElementById('btn-preview-now');
  const previewLabel = document.getElementById('preview-btn-label');
  const btnDownload = document.getElementById('btn-download-now');
  const downloadLabel = document.getElementById('download-btn-label');
  const progressBox = document.getElementById('download-progress-box');
  const progressFill = document.getElementById('progress-fill-bar');
  const progressStatus = document.getElementById('progress-status-msg');
  const progressSpeed = document.getElementById('progress-speed-msg');
  const previewModal = document.getElementById('thumbnail-preview-modal');
  const previewModalImage = document.getElementById('preview-modal-image');
  const previewModalMeta = document.getElementById('preview-modal-meta');
  const btnClosePreview = document.getElementById('btn-close-preview');

  let selectedThumbnail = null;
  let currentVideoId = null;
  let currentTitle = 'YouTube_Thumbnail';

  function syncInputState() {
    btnClear.classList.toggle('active', urlInput.value.trim().length > 0);
  }

  syncInputState();
  window.addEventListener('pageshow', syncInputState);
  setTimeout(syncInputState, 0);

  function resetResults() {
    resultCard.classList.remove('active');
    parsingLoader.classList.remove('active');
    progressBox.classList.remove('active');
    selectedThumbnail = null;
    currentVideoId = null;
  }

  urlInput.addEventListener('input', () => {
    btnClear.classList.toggle('active', urlInput.value.trim().length > 0);
    if (!urlInput.value.trim()) resetResults();
  });

  urlInput.addEventListener('paste', () => {
    btnClear.classList.add('active');
    setTimeout(parseYouTubeLink, 100);
  });

  urlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') parseYouTubeLink();
  });

  btnClear.addEventListener('click', () => {
    urlInput.value = '';
    btnClear.classList.remove('active');
    resetResults();
    urlInput.focus();
  });

  btnParse.addEventListener('click', parseYouTubeLink);

  async function parseYouTubeLink() {
    const rawUrl = urlInput.value.trim();
    const videoId = extractYouTubeId(rawUrl);

    if (!videoId) {
      alert('Please enter a valid YouTube video link.');
      return;
    }

    btnParse.disabled = true;
    btnParse.textContent = 'Finding...';
    resultCard.classList.remove('active');
    progressBox.classList.remove('active');
    parsingLoader.classList.add('active');

    try {
      const [thumbnails, metadata] = await Promise.all([
        discoverThumbnails(videoId),
        getVideoMetadata(rawUrl, videoId)
      ]);

      if (!thumbnails.length) throw new Error('No public thumbnails were found');

      currentVideoId = videoId;
      currentTitle = metadata.title;
      selectedThumbnail = thumbnails[0];

      videoThumb.src = selectedThumbnail.url;
      videoTitle.textContent = metadata.title;
      channelName.textContent = `📺 ${metadata.author}`;
      viewsCount.textContent = `🖼️ ${thumbnails.length} image options`;
      qualityTag.textContent = `✨ Up to ${selectedThumbnail.actualWidth}×${selectedThumbnail.actualHeight}`;
      thumbnailCount.textContent = `${thumbnails.length} available`;

      renderThumbnailOptions(thumbnails);
      parsingLoader.classList.remove('active');
      resultCard.classList.add('active');
    } catch (error) {
      console.error('Thumbnail discovery failed:', error);
      parsingLoader.classList.remove('active');
      alert('Could not find thumbnails for this video. Check that the video is public and try again.');
    } finally {
      btnParse.disabled = false;
      btnParse.textContent = 'Go';
    }
  }

  function renderThumbnailOptions(thumbnails) {
    formatsContainer.replaceChildren();

    thumbnails.forEach((thumbnail, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `format-row-item thumbnail-option ${index === 0 ? 'selected' : ''}`;

      const preview = document.createElement('img');
      preview.className = 'thumbnail-option-image';
      preview.src = thumbnail.url;
      preview.alt = `${thumbnail.label} ${thumbnail.extension.toUpperCase()} thumbnail`;
      preview.loading = 'lazy';

      const copy = document.createElement('span');
      copy.className = 'thumbnail-option-copy';

      const title = document.createElement('span');
      title.className = 'format-quality-label';
      title.textContent = thumbnail.label;

      const badge = document.createElement('span');
      badge.className = 'quality-badge';
      badge.textContent = thumbnail.extension;
      title.appendChild(badge);

      const dimensions = document.createElement('span');
      dimensions.className = 'format-size-label';
      dimensions.textContent = `${thumbnail.actualWidth} × ${thumbnail.actualHeight}`;

      copy.append(title, dimensions);
      row.append(preview, copy);

      row.addEventListener('click', () => {
        formatsContainer.querySelectorAll('.format-row-item').forEach(item => item.classList.remove('selected'));
        row.classList.add('selected');
        selectedThumbnail = thumbnail;
        videoThumb.src = thumbnail.url;
        updateDownloadLabel();
      });

      formatsContainer.appendChild(row);
    });

    updateDownloadLabel();
  }

  function updateDownloadLabel() {
    if (!selectedThumbnail) return;
    previewLabel.textContent = `Preview ${selectedThumbnail.actualWidth}×${selectedThumbnail.actualHeight}`;
    downloadLabel.textContent = `Download ${selectedThumbnail.actualWidth}×${selectedThumbnail.actualHeight} ${selectedThumbnail.extension.toUpperCase()}`;
  }

  btnPreview.addEventListener('click', () => {
    if (!selectedThumbnail) return;
    previewModalImage.src = selectedThumbnail.url;
    previewModalMeta.textContent = `${selectedThumbnail.actualWidth}×${selectedThumbnail.actualHeight} • ${selectedThumbnail.extension.toUpperCase()}`;
    previewModal.showModal();
  });

  btnClosePreview.addEventListener('click', () => previewModal.close());
  previewModal.addEventListener('click', event => {
    if (event.target === previewModal) previewModal.close();
  });

  btnDownload.addEventListener('click', async () => {
    if (!selectedThumbnail || !currentVideoId) return;

    btnDownload.disabled = true;
    btnDownload.style.opacity = '0.65';
    progressBox.classList.add('active');
    progressFill.style.width = '35%';
    progressStatus.textContent = 'Fetching the selected thumbnail...';
    progressSpeed.textContent = selectedThumbnail.extension.toUpperCase();

    try {
      const response = await fetch(selectedThumbnail.url);
      if (!response.ok) throw new Error(`Image request failed with ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const safeTitle = currentTitle.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 55) || 'YouTube_Thumbnail';
      const filename = `${safeTitle}_${currentVideoId}_${selectedThumbnail.actualWidth}x${selectedThumbnail.actualHeight}.${selectedThumbnail.extension}`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      progressFill.style.width = '100%';
      progressStatus.textContent = 'Thumbnail downloaded successfully.';
      progressSpeed.textContent = `${selectedThumbnail.actualWidth}×${selectedThumbnail.actualHeight}`;
      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    } catch (error) {
      console.error('Thumbnail download failed:', error);
      progressFill.style.width = '0%';
      progressStatus.textContent = 'Download failed. Please try another format.';
      progressSpeed.textContent = 'Error';
    } finally {
      btnDownload.disabled = false;
      btnDownload.style.opacity = '1';
    }
  });
}
