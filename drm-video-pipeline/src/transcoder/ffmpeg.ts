import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface VideoProfile {
  name: string;
  resolution: string; // e.g., "1080p", "720p", "480p"
  width: number;
  height: number;
  videoBitrate: string; // e.g., "3200k"
  audioBitrate: string; // e.g., "128k"
  codec: 'hevc' | 'h264' | 'av1';
}

export interface TranscodeOptions {
  inputPath: string;
  outputDir: string;
  segmentDuration?: number; // default: 4 seconds
  profiles?: VideoProfile[];
}

export const DEFAULT_PROFILES: VideoProfile[] = [
  {
    name: 'h264_1080p',
    resolution: '1080p',
    width: 1080,
    height: 1920, // Vertical 9:16 format
    videoBitrate: '3200k',
    audioBitrate: '128k',
    codec: 'h264',
  },
  {
    name: 'h264_720p',
    resolution: '720p',
    width: 720,
    height: 1280,
    videoBitrate: '1800k',
    audioBitrate: '128k',
    codec: 'h264',
  },
  {
    name: 'h264_480p',
    resolution: '480p',
    width: 480,
    height: 854,
    videoBitrate: '800k',
    audioBitrate: '96k',
    codec: 'h264',
  },
];

export class FFmpegTranscoder {
  /**
   * Generates FFmpeg CLI arguments for HLS encoding with multiple bitrate variants
   */
  public static buildFFmpegArgs(options: TranscodeOptions): string[] {
    const { inputPath, outputDir, segmentDuration = 4, profiles = DEFAULT_PROFILES } = options;

    const args: string[] = [
      '-y',
      '-i', inputPath,
      '-hide_banner',
      '-loglevel', 'info',
    ];

    // Build filter_complex for scaling video into multiple variants & converting to yuv420p for mobile compatibility
    const filterComplex = profiles
      .map((p, i) => `[0:v]scale=${p.width}:${p.height},format=yuv420p[v${i}]`)
      .join(';');

    args.push('-filter_complex', filterComplex);

    // Map video and audio streams for each profile
    profiles.forEach((profile, idx) => {
      args.push('-map', `[v${idx}]`);
      args.push('-map', '0:a?');

      // Codec settings
      if (profile.codec === 'hevc') {
        args.push(`-c:v:${idx}`, 'libx265', `-preset:${idx}`, 'fast', `-tag:v:${idx}`, 'hvc1');
      } else if (profile.codec === 'av1') {
        args.push(`-c:v:${idx}`, 'libsvtav1', `-preset:${idx}`, '8');
      } else {
        args.push(`-c:v:${idx}`, 'libx264', `-preset:${idx}`, 'fast', `-profile:v:${idx}`, 'main');
      }

      args.push(`-b:v:${idx}`, profile.videoBitrate);
      args.push(`-c:a:${idx}`, 'aac', `-b:a:${idx}`, profile.audioBitrate);
    });

    // Output HLS configuration
    const varStreamMap = profiles
      .map((p, i) => `v:${i},a:${i},name:${p.name}`)
      .join(' ');

    args.push(
      '-f', 'hls',
      '-hls_time', segmentDuration.toString(),
      '-hls_playlist_type', 'vod',
      '-hls_segment_type', 'fmp4', // Fragmented MP4 for CENC DRM compatibility
      '-hls_flags', 'single_file+independent_segments',
      '-master_pl_name', 'master.m3u8',
      '-var_stream_map', varStreamMap,
      path.join(outputDir, 'stream_%v.m3u8')
    );

    return args;
  }

  /**
   * Executes FFmpeg process synchronously or with progress logging
   */
  public static async execute(options: TranscodeOptions): Promise<string> {
    const args = this.buildFFmpegArgs(options);
    console.log('[Transcoder] Executing FFmpeg command:');
    console.log(`ffmpeg ${args.join(' ')}\n`);

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);
      let stderrOutput = '';

      ffmpeg.stderr.on('data', (data: Buffer) => {
        const str = data.toString();
        stderrOutput += str;
        if (str.includes('frame=') || str.includes('time=')) {
          process.stdout.write(`\r[FFmpeg Progress] ${str.trim().slice(0, 100)}`);
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('\n[Transcoder] HLS Transcoding completed successfully!');
          resolve(path.join(options.outputDir, 'master.m3u8'));
        } else {
          console.error(`\n[FFmpeg Error Details]:\n${stderrOutput}`);
          reject(new Error(`FFmpeg exited with error code ${code}`));
        }
      });

      ffmpeg.on('error', (err) => {
        reject(err);
      });
    });
  }
}
