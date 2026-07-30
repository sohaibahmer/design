import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { CENCKeyGenerator, ManifestDRMInjector } from '../packager/cenc-packager';
import { FFmpegTranscoder } from '../transcoder/ffmpeg';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'enflix-jwt-secret-key-2026';

const PUBLIC_DIR = path.join(__dirname, '../../public');
const STREAMS_DIR = path.join(PUBLIC_DIR, 'streams');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

if (!fs.existsSync(STREAMS_DIR)) fs.mkdirSync(STREAMS_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Configure file upload storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB limit
});

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.raw({ type: ['application/octet-stream', 'application/x-www-form-urlencoded'], limit: '5mb' }));

// Middleware for subscriber tier authorization
export interface AuthUser {
  userId: string;
  tier: 'FREE' | 'PREMIUM' | 'VIP';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authorizeSubscriber(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || (req.query.token as string);
  
  if (!authHeader) {
    req.user = { userId: 'demo-user-123', tier: 'VIP' };
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired DRM subscription token' });
  }
}

// ------------------- VIDEO UPLOAD & TRANSCODE ENDPOINT -------------------
app.post('/api/v1/upload', upload.single('video'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No video file uploaded' });
    return;
  }

  console.log(`\n[Upload API] Received video file: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    const assetId = `asset_${Date.now()}`;

    // Step 1: Transcode uploaded video to HLS multi-bitrate ladder
    console.log('[Upload API] Step 1: Transcoding uploaded video with FFmpeg...');
    const masterPlaylistPath = await FFmpegTranscoder.execute({
      inputPath: req.file.path,
      outputDir: STREAMS_DIR,
      segmentDuration: 4
    });

    // Step 2: CENC Key Generation & Manifest DRM injection
    console.log('[Upload API] Step 2: Injecting CENC DRM metadata...');
    const drmKeys = CENCKeyGenerator.generateKeys(assetId);
    ManifestDRMInjector.injectDRMHeaders(masterPlaylistPath, drmKeys, `http://${req.headers.host}`);

    console.log('[Upload API] Processing complete! Stream ready for playback.\n');

    res.json({
      success: true,
      message: 'Video successfully transcoded and DRM protected!',
      assetId,
      streamUrl: `/streams/master.m3u8?t=${Date.now()}`,
      drmKeys: {
        keyId: drmKeys.keyId,
        iv: drmKeys.iv
      }
    });
  } catch (err: any) {
    console.error('[Upload API Error]:', err);
    res.status(500).json({ error: 'Transcoding failed', details: err.message });
  }
});

// ------------------- AUTH ENDPOINT -------------------
app.post('/api/v1/auth/token', (req: Request, res: Response) => {
  const { userId = 'user_001', tier = 'VIP' } = req.body;
  const token = jwt.sign({ userId, tier }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, tier, expiresIn: '24h' });
});

// ------------------- DRM LICENSE ENDPOINTS -------------------
app.post('/api/v1/drm/widevine/license', authorizeSubscriber, (req: Request, res: Response) => {
  console.log(`[DRM Server] Widevine License Request from User: ${req.user?.userId} (Tier: ${req.user?.tier})`);
  
  if (req.user?.tier === 'FREE') {
    res.status(403).json({ error: 'Widevine HD stream requires PREMIUM or VIP tier' });
    return;
  }

  const mockLicenseResponse = Buffer.concat([
    Buffer.from([0x08, 0x01, 0x12, 0x10]),
    Buffer.from(crypto.randomUUID().replace(/-/g, ''), 'hex')
  ]);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(mockLicenseResponse);
});

app.post('/api/v1/drm/fairplay/license', authorizeSubscriber, (req: Request, res: Response) => {
  console.log(`[DRM Server] FairPlay SPC License Request for User: ${req.user?.userId}`);
  const assetId = (req.query.assetId as string) || 'default-asset';
  const keys = CENCKeyGenerator.generateKeys(assetId);

  const ckcPayload = Buffer.concat([
    Buffer.from('ENFLIX_FAIRPLAY_CKC_V1:'),
    Buffer.from(keys.key, 'hex')
  ]);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(ckcPayload);
});

app.get('/api/v1/drm/clearkey/key', (req: Request, res: Response) => {
  const kidHex = (req.query.kid as string) || 'default_kid';
  const assetId = (req.query.assetId as string) || 'sample-video-01';

  const keys = CENCKeyGenerator.generateKeys(assetId);

  const kidB64Url = Buffer.from(keys.keyId, 'hex').toString('base64url');
  const keyB64Url = Buffer.from(keys.key, 'hex').toString('base64url');

  res.json({
    keys: [
      {
        kty: 'oct',
        kid: kidB64Url,
        k: keyB64Url
      }
    ],
    type: 'temporary'
  });
});

// ------------------- HLS MEDIA STREAMING -------------------
app.use('/streams', cors(), express.static(STREAMS_DIR));
app.use(express.static(PUBLIC_DIR));

const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT || '8080', 10);

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 ENFLIX DRM License Server running on http://${HOST}:${PORT}`);
  console.log(`📹 HLS Streams served at: http://${HOST}:${PORT}/streams/master.m3u8`);
  console.log(`🔐 Widevine Endpoint: http://${HOST}:${PORT}/api/v1/drm/widevine/license`);
  console.log(`🍎 FairPlay Endpoint: http://${HOST}:${PORT}/api/v1/drm/fairplay/license`);
  console.log(`====================================================`);
});

export default app;
