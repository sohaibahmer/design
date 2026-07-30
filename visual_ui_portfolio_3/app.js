/* ==========================================================================
   PROJECT 03 &bull; YOUTUBE MEDIA DOWNLOADER & STREAM PARSER ENGINE
   Designer: Sohaib Ahmer (NID Postgraduate Alumnus)
   Features: Parsing Skeleton Loader Animation & Real-Time Stream Downloader
   ========================================================================== */

const BACKEND_API = 'http://localhost:4000';

document.addEventListener('DOMContentLoaded', () => {
  initYouTubeDownloaderEngine();
});

function initYouTubeDownloaderEngine() {
  const urlInput = document.getElementById('yt-url-input');
  const btnClear = document.getElementById('btn-clear-input');
  const btnPaste = document.getElementById('btn-paste-clipboard');
  const btnParse = document.getElementById('btn-parse-link');
  const parsingLoader = document.getElementById('parsing-loader-box');
  const resultCard = document.getElementById('parsed-result-card');

  const videoThumb = document.getElementById('res-video-thumb');
  const videoTitle = document.getElementById('res-video-title');
  const channelName = document.getElementById('res-channel-name');
  const viewsCount = document.getElementById('res-views-count');
  const videoDuration = document.getElementById('res-video-duration');

  const tabVideo = document.getElementById('tab-video');
  const tabAudio = document.getElementById('tab-audio');
  const formatsContainer = document.getElementById('formats-list-container');

  const btnDownload = document.getElementById('btn-download-now');
  const downloadLabel = document.getElementById('download-btn-label');
  const progressBox = document.getElementById('download-progress-box');
  const progressFill = document.getElementById('progress-fill-bar');
  const progressStatus = document.getElementById('progress-status-msg');
  const progressSpeed = document.getElementById('progress-speed-msg');

  let currentTab = 'video';
  let selectedFormat = null;
  let currentParsedData = null;

  // 1. INPUT LISTENERS & AUTOMATIC PASTE PARSING
  urlInput.addEventListener('paste', () => {
    btnClear.classList.add('active');
    setTimeout(parseYouTubeLink, 120);
  });

  urlInput.addEventListener('input', () => {
    if (urlInput.value.trim().length > 0) {
      btnClear.classList.add('active');
    } else {
      btnClear.classList.remove('active');
      parsingLoader.classList.remove('active');
      resultCard.classList.remove('active');
    }
  });

  btnClear.addEventListener('click', () => {
    urlInput.value = '';
    btnClear.classList.remove('active');
    parsingLoader.classList.remove('active');
    resultCard.classList.remove('active');
    progressBox.classList.remove('active');
    urlInput.focus();
  });

  btnPaste.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          urlInput.value = text;
          btnClear.classList.add('active');
          parseYouTubeLink();
        } else {
          alert('Clipboard is empty! Copy a YouTube link first.');
        }
      } else {
        urlInput.focus();
        urlInput.select();
        document.execCommand('paste');
        setTimeout(parseYouTubeLink, 150);
      }
    } catch (err) {
      urlInput.focus();
      urlInput.select();
    }
  });

  btnParse.addEventListener('click', parseYouTubeLink);

  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') parseYouTubeLink();
  });

  // 2. FETCH REAL YOUTUBE METADATA WITH PARSING ANIMATION
  async function parseYouTubeLink() {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) return;

    btnParse.textContent = 'Go...';
    btnParse.style.opacity = '0.7';

    // Show parsing animation & hide previous results
    resultCard.classList.remove('active');
    parsingLoader.classList.add('active');

    try {
      const response = await fetch(`${BACKEND_API}/api/info?url=${encodeURIComponent(rawUrl)}`);
      
      if (!response.ok) {
        throw new Error('Could not parse YouTube video metadata');
      }

      const data = await response.json();
      currentParsedData = data;

      videoThumb.src = data.thumb;
      videoTitle.textContent = data.title;
      channelName.textContent = data.channel;
      viewsCount.textContent = data.views;
      videoDuration.textContent = data.duration;

      // Hide loader & reveal result card
      parsingLoader.classList.remove('active');
      resultCard.classList.add('active');
      renderAllAvailableFormats();

    } catch (err) {
      console.warn('Backend server error:', err);
      parsingLoader.classList.remove('active');
      alert('Could not connect to backend server at http://localhost:4000. Please ensure node server.js is running!');
    } finally {
      btnParse.textContent = 'Go';
      btnParse.style.opacity = '1';
    }
  }

  // 3. FORMAT TAB SWITCHERS
  tabVideo.addEventListener('click', () => {
    currentTab = 'video';
    tabVideo.classList.add('active');
    tabAudio.classList.remove('active');
    renderAllAvailableFormats();
  });

  tabAudio.addEventListener('click', () => {
    currentTab = 'audio';
    tabAudio.classList.add('active');
    tabVideo.classList.remove('active');
    renderAllAvailableFormats();
  });

  function renderAllAvailableFormats() {
    if (!currentParsedData) return;
    formatsContainer.innerHTML = '';

    const list = currentTab === 'video' 
      ? (currentParsedData.videoFormats || []) 
      : (currentParsedData.audioFormats || []);

    if (list.length === 0) {
      formatsContainer.innerHTML = '<div style="padding:16px; color:var(--text-tertiary);">No formats available for this tab.</div>';
      return;
    }

    list.forEach((item, index) => {
      const isDef = index === 0;
      const row = document.createElement('div');
      row.className = `format-row-item ${isDef ? 'selected' : ''}`;
      if (isDef) selectedFormat = item;

      row.innerHTML = `
        <div class="format-quality-label">
          <input type="radio" name="format-select" ${isDef ? 'checked' : ''} />
          <span>${item.quality}</span>
          <span class="quality-badge">${item.ext}</span>
        </div>
        <div class="format-size-label">
          ${item.fps || 'HD'} &bull; ${item.size || 'Stream'}
        </div>
      `;

      row.addEventListener('click', () => {
        document.querySelectorAll('.format-row-item').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        row.querySelector('input').checked = true;
        selectedFormat = item;
        updateDownloadLabel();
      });

      formatsContainer.appendChild(row);
    });

    updateDownloadLabel();
  }

  function updateDownloadLabel() {
    if (selectedFormat) {
      downloadLabel.textContent = `Download ${selectedFormat.ext.toUpperCase()} (${selectedFormat.quality} • ${selectedFormat.size})`;
    }
  }

  // 4. REAL-TIME CHUNKED PROGRESS STREAM READER ENGINE
  btnDownload.addEventListener('click', async () => {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl || !selectedFormat) return;

    btnDownload.disabled = true;
    btnDownload.style.opacity = '0.6';
    progressBox.classList.add('active');
    progressFill.style.width = '0%';
    progressStatus.textContent = 'Connecting to real YouTube video stream...';
    progressSpeed.textContent = 'Connecting...';

    const formatIdParam = selectedFormat && selectedFormat.format_id ? `&format_id=${encodeURIComponent(selectedFormat.format_id)}` : '';
    const downloadApiUrl = `${BACKEND_API}/api/download?url=${encodeURIComponent(rawUrl)}&type=${currentTab}${formatIdParam}`;

    try {
      const response = await fetch(downloadApiUrl);
      if (!response.ok) throw new Error('Stream download failed');

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : (selectedFormat.filesize || 20 * 1024 * 1024);

      const reader = response.body.getReader();
      const chunks = [];
      let receivedBytes = 0;
      let startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;

        const elapsedTime = (Date.now() - startTime) / 1000;
        const currentSpeedMB = elapsedTime > 0 ? (receivedBytes / (1024 * 1024) / elapsedTime).toFixed(1) : '24.5';
        
        let percent = Math.min(100, Math.round((receivedBytes / (totalBytes || 1)) * 100));
        if (!contentLength && percent > 95) percent = 95;

        const receivedMB = (receivedBytes / (1024 * 1024)).toFixed(1);
        const totalMB = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) : '?';

        progressFill.style.width = `${percent}%`;
        progressStatus.textContent = `Downloading ${selectedFormat.ext.toUpperCase()} stream... ${receivedMB} MB / ${totalMB} MB (${percent}%)`;
        progressSpeed.textContent = `${currentSpeedMB} MB/s`;
      }

      progressFill.style.width = '100%';
      progressStatus.textContent = `Download Complete! Saving file to Downloads...`;
      progressSpeed.textContent = 'Complete';

      const mimeType = selectedFormat.ext === '.mp3' ? 'audio/mpeg' : 'video/mp4';
      const fileBlob = new Blob(chunks, { type: mimeType });
      const blobUrl = URL.createObjectURL(fileBlob);

      const cleanTitle = currentParsedData ? currentParsedData.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 45) : 'YouTube_Download';
      const filename = `${cleanTitle}_[${currentParsedData ? currentParsedData.id : 'video'}]${selectedFormat.ext}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        btnDownload.disabled = false;
        btnDownload.style.opacity = '1';
      }, 1500);

    } catch (err) {
      console.warn('Real-time fetch stream error, falling back to direct location:', err);
      window.location.href = downloadApiUrl;
      setTimeout(() => {
        btnDownload.disabled = false;
        btnDownload.style.opacity = '1';
      }, 2000);
    }
  });
}
