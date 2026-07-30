/* ==========================================================================
   REAL YOUTUBE STREAMING BACKEND SERVER (PRODUCTION ROOT SERVER)
   Project: Project 03 YouTube Media Downloader & Full Portfolio Backend
   Tech: Node.js, Express, yt-dlp Direct Pipe with Progressive H.264 MP4 Engine
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const { execFile, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Resolve yt-dlp binary path dynamically for Linux Docker container & macOS
const YTDLP_BIN = fs.existsSync('/usr/local/bin/yt-dlp') 
  ? '/usr/local/bin/yt-dlp' 
  : (fs.existsSync('/opt/homebrew/bin/yt-dlp') ? '/opt/homebrew/bin/yt-dlp' : 'yt-dlp');

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be'
]);

function isValidYouTubeUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function removeDirectory(directory) {
  fs.rm(directory, { recursive: true, force: true }, () => {});
}

app.use(cors());
app.use(express.json());

// Serve static portfolio files
app.use(express.static(__dirname));
app.use('/ytmediadownloader', express.static(path.join(__dirname, 'ytmediadownloader')));

// Health check endpoint for Railway / cloud orchestrators
app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'yt-dlp-ios-embedded-bypass', time: new Date() });
});

app.get('/', (req, res) => {
  res.send('YouTube Downloader & Portfolio Backend API Online');
});

// 1. EXTRACT ALL REAL YOUTUBE FORMATS VIA YT-DLP (IOS/WEB EMBEDDED BYPASS)
app.get('/api/info', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL' });
  }
  if (!isValidYouTubeUrl(videoUrl)) {
    return res.status(400).json({ error: 'Please provide a valid HTTPS YouTube URL' });
  }

  console.log(`[Backend Info] Parsing formats for: ${videoUrl}`);

  execFile(YTDLP_BIN, [
    '--extractor-args', 'youtube:player_client=ios,web_embedded',
    '--no-playlist',
    '--dump-single-json',
    videoUrl
  ], { maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error || !stdout) {
      console.error('yt-dlp info error:', error || stderr);
      return res.status(500).json({ error: 'Failed to parse YouTube video metadata' });
    }

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats || [];

      const videoFormatsMap = new Map();
      const audioFormatsMap = new Map();

      formats.forEach(f => {
        // Prefer H.264 MP4 streams. Video-only streams are merged with M4A on download.
        const isH264Mp4 = f.ext === 'mp4'
          && f.vcodec && f.vcodec !== 'none'
          && /^(avc1|h264)/i.test(f.vcodec);
        if (isH264Mp4 && f.height) {
          const current = videoFormatsMap.get(f.height);
          const hasAudio = f.acodec && f.acodec !== 'none';
          const currentHasAudio = current && current.hasAudio;
          if (!current || (hasAudio && !currentHasAudio) || ((f.tbr || 0) > (current.tbr || 0) && hasAudio === currentHasAudio)) {
            videoFormatsMap.set(f.height, {
              quality: `${f.height}p ${f.fps ? f.fps + 'FPS' : ''}`,
              ext: `.mp4`,
              format_id: f.format_id,
              size: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : (f.filesize_approx ? `~${(f.filesize_approx / (1024 * 1024)).toFixed(1)} MB` : 'Stream'),
              filesize: f.filesize || f.filesize_approx || 0,
              fps: f.fps ? `${f.fps} FPS` : '30 FPS',
              height: f.height,
              hasAudio: Boolean(hasAudio),
              tbr: f.tbr || 0,
              available: true
            });
          }
        }

        // Show the actual source bitrate; the download endpoint converts it to MP3.
        if (f.acodec && f.acodec !== 'none' && f.abr) {
          const abr = Math.round(f.abr);
          if (!audioFormatsMap.has(abr)) {
            audioFormatsMap.set(abr, {
              quality: `${abr} kbps High Quality Audio`,
              ext: `.mp3`,
              format_id: f.format_id,
              size: f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : (f.filesize_approx ? `~${(f.filesize_approx / (1024 * 1024)).toFixed(1)} MB` : 'Stream'),
              filesize: f.filesize || f.filesize_approx || 0,
              fps: `${abr}kbps`,
              abr: abr,
              available: true
            });
          }
        }
      });

      const sortedVideoFormats = Array.from(videoFormatsMap.values())
        .sort((a, b) => b.height - a.height);

      const sortedAudioFormats = Array.from(audioFormatsMap.values())
        .sort((a, b) => b.abr - a.abr);

      res.json({
        id: data.id,
        title: data.title,
        channel: `📺 ${data.uploader || data.channel || 'YouTube Channel'}`,
        views: `👁️ ${(data.view_count || 0).toLocaleString()} Views`,
        duration: data.duration_string || '04:15',
        thumb: data.thumbnail,
        videoFormats: sortedVideoFormats,
        audioFormats: sortedAudioFormats
      });

    } catch (e) {
      console.error('JSON parse error:', e);
      res.status(500).json({ error: 'Failed to process metadata' });
    }
  });
});

// 2. REAL-TIME CHUNKED STREAMING API WITH CONTENT-LENGTH FOR UI PROGRESS BAR
app.get('/api/download', (req, res) => {
  const videoUrl = req.query.url;
  const type = req.query.type || 'video';
  const formatId = req.query.format_id;

  if (!videoUrl) {
    return res.status(400).send('Missing video URL');
  }
  if (!isValidYouTubeUrl(videoUrl)) {
    return res.status(400).send('Please provide a valid HTTPS YouTube URL');
  }
  if (!['video', 'audio'].includes(type)) {
    return res.status(400).send('Invalid media type');
  }
  if (formatId && formatId !== 'undefined' && !/^[a-zA-Z0-9_-]+$/.test(formatId)) {
    return res.status(400).send('Invalid format identifier');
  }

  const timestamp = Date.now();
  const ext = type === 'audio' ? '.mp3' : '.mp4';
  const cleanName = `YouTube_Video_${timestamp}${ext}`;
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-download-'));
  const outputTemplate = path.join(tempDirectory, 'media.%(ext)s');
  const selectedFormat = formatId && formatId !== 'undefined' ? formatId : null;
  const formatArg = type === 'audio'
    ? (selectedFormat ? `${selectedFormat}/bestaudio` : 'bestaudio')
    : (selectedFormat ? `${selectedFormat}+bestaudio[ext=m4a]/${selectedFormat}/best[ext=mp4]` : 'bestvideo[ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/best[ext=mp4]');

  console.log(`Preparing ${type} download: format ${formatArg} for ${videoUrl}`);

  const args = [
    '--extractor-args', 'youtube:player_client=ios,web_embedded',
    '-f', formatArg,
    '--no-playlist',
    '--no-part',
    '-o', outputTemplate
  ];
  if (type === 'audio') {
    args.push('--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0');
  } else {
    args.push('--merge-output-format', 'mp4');
  }
  args.push(videoUrl);

  const ytProcess = spawn(YTDLP_BIN, args);
  let stderr = '';
  ytProcess.stderr.on('data', data => {
    stderr += data.toString();
    if (stderr.length > 8000) stderr = stderr.slice(-8000);
  });

  ytProcess.on('error', (error) => {
    console.error('yt-dlp stream error:', error);
    removeDirectory(tempDirectory);
    if (!res.headersSent) res.status(500).send('Unable to start the media downloader');
  });

  ytProcess.on('close', (code) => {
    if (!fs.existsSync(tempDirectory)) return;
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}: ${stderr}`);
      removeDirectory(tempDirectory);
      if (!res.headersSent) res.status(502).send('YouTube could not prepare this media format');
      return;
    }

    const files = fs.readdirSync(tempDirectory);
    const outputFile = files.find(file => file.endsWith(ext));
    if (!outputFile) {
      console.error(`Expected ${ext} output, found: ${files.join(', ')}`);
      removeDirectory(tempDirectory);
      if (!res.headersSent) res.status(500).send('The converted media file was not created');
      return;
    }

    const outputPath = path.join(tempDirectory, outputFile);
    res.download(outputPath, cleanName, error => {
      removeDirectory(tempDirectory);
      if (error && !res.headersSent) res.status(500).send('Download transfer failed');
    });
  });

  req.on('aborted', () => {
    if (!ytProcess.killed) ytProcess.kill('SIGTERM');
    removeDirectory(tempDirectory);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Real YouTube Downloader Server running on port ${PORT}`);
});
