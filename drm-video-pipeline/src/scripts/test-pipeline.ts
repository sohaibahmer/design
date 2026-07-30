import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { FFmpegTranscoder } from '../transcoder/ffmpeg';
import { CENCKeyGenerator, ManifestDRMInjector } from '../packager/cenc-packager';
import { CloudflareWorkerEdgeSimulator } from '../edge/cloudflare-worker';

const PUBLIC_DIR = path.join(__dirname, '../../public');
const STREAMS_DIR = path.join(PUBLIC_DIR, 'streams');
const SAMPLE_MP4 = path.join(PUBLIC_DIR, 'sample_vertical.mp4');

/**
 * Generates a synthetic 9:16 vertical video using FFmpeg for pipeline testing
 */
async function generateSampleVideo(): Promise<string> {
  if (fs.existsSync(SAMPLE_MP4)) {
    console.log(`[Test Pipeline] Using existing sample video: ${SAMPLE_MP4}`);
    return SAMPLE_MP4;
  }

  console.log('[Test Pipeline] Generating 10-second synthetic 9:16 vertical test video with FFmpeg...');

  const args = [
    '-y',
    '-f', 'lavfi', '-i', 'testsrc=duration=10:size=1080x1920:rate=30',
    '-f', 'lavfi', '-i', 'sine=frequency=1000:duration=10',
    '-c:v', 'libx264', '-preset', 'ultrafast',
    '-c:a', 'aac',
    SAMPLE_MP4
  ];

  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args);
    ff.on('close', (code) => {
      if (code === 0) {
        console.log('[Test Pipeline] Synthetic sample video created!');
        resolve(SAMPLE_MP4);
      } else {
        reject(new Error(`Failed to generate sample video (FFmpeg code ${code})`));
      }
    });
  });
}

export async function runPipeline() {
  console.log('===============================================================');
  console.log('🎬 ENFLIX MEDIA PIPELINE: Transcoding, DRM & Edge Distribution');
  console.log('===============================================================\n');

  // Ensure directories exist
  if (!fs.existsSync(STREAMS_DIR)) {
    fs.mkdirSync(STREAMS_DIR, { recursive: true });
  }

  // 1. Generate or fetch input video
  const inputVideo = await generateSampleVideo();
  const assetId = 'drama-ep-01';

  // 2. Step 1: Transcode Video to HLS multi-bitrate ladder (HEVC + H.264)
  console.log('\n--- Step 1: Multi-Bitrate HLS Transcoding ---');
  const masterPlaylistPath = await FFmpegTranscoder.execute({
    inputPath: inputVideo,
    outputDir: STREAMS_DIR,
    segmentDuration: 4
  });

  // 3. Step 2: CENC Keys & DRM Metadata Generation
  console.log('\n--- Step 2: DRM Key Generation (Widevine, FairPlay, Clearkey) ---');
  const drmKeys = CENCKeyGenerator.generateKeys(assetId);
  console.log(`Asset ID:    ${drmKeys.assetId}`);
  console.log(`Key ID (KID): ${drmKeys.keyId}`);
  console.log(`AES Key:     ${drmKeys.key}`);

  // 4. Step 3: Inject DRM Manifest Annotations
  console.log('\n--- Step 3: HLS Manifest DRM Header Injection ---');
  ManifestDRMInjector.injectDRMHeaders(
    masterPlaylistPath,
    drmKeys,
    'http://localhost:3000'
  );

  // 5. Step 4: Edge Distribution Simulation (Cloudflare Worker Signed URL)
  console.log('\n--- Step 4: Cloudflare R2 / Edge Worker Signed URL Token Generation ---');
  const edgeSignedUrl = CloudflareWorkerEdgeSimulator.generateSignedUrl(
    'http://localhost:3000/streams/master.m3u8',
    assetId,
    3600
  );
  console.log(`Signed Edge CDN Stream URL: ${edgeSignedUrl}`);

  console.log('\n===============================================================');
  console.log('🎉 PIPELINE COMPLETED SUCCESSFULLY!');
  console.log('===============================================================\n');
}

if (require.main === module) {
  runPipeline().catch(console.error);
}
