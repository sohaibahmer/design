# Enflix Cloud-Native DRM & HLS Video Transcoding Pipeline

> Production-grade media pipeline for short-vertical drama streaming platforms in India. Features automated multi-bitrate FFmpeg encoding (HEVC/H.264), CENC Multi-DRM packaging (Widevine & FairPlay), self-hosted Cloud Run DRM license server, and Cloudflare Worker signed URL edge distribution.

---

## 📐 System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       Raw Video Upload (GCS Bucket)     │
                               └────────────────────┬────────────────────┘
                                                    │ (Event Trigger)
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   FFmpeg Transcoder (Container / Run)   │
                               │   - HEVC 1080p (2.5M), H.264 1080p/720p│
                               │   - fMP4 HLS 4-sec segments             │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   CENC DRM Packager (Shaka Packager)    │
                               │   - Widevine PSSH (UUID: edef8ba9-...)  │
                               │   - FairPlay SKD (UUID: 94ce8607-...)  │
                               │   - HLS master.m3u8 Header Injection    │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │      Cloudflare R2 + Workers CDN        │
                               │   - HMAC-SHA256 Signed URL Validation   │
                               │   - Edge Caching (BOM-01 Mumbai Node)   │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                       ┌──────────────────────────────────────────────────────────┐
                       │                   Native Mobile Players                  │
                       │   Android: ExoPlayer (Widevine L1/L3)                    │
                       │   iOS: AVPlayer (FairPlay AVContentKeySession)           │
                       └────────────────────────────┬─────────────────────────────┘
                                                    │ (License Challenge)
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   DRM License Server (GCP Cloud Run)    │
                               │   - Validates JWT Subscription Token    │
                               │   - Serves Widevine Protobuf & CKC keys │
                               └─────────────────────────────────────────┘
```

---

## 🌟 Key Engineering Features

1. **Multi-Bitrate HLS Ladder Tuning (Mobile Networks):**
   - Transcodes raw vertical video into **1080p (3.2 Mbps)**, **720p (1.8 Mbps)**, and **480p (800 Kbps)**.
   - Uses **Fragmented MP4 (`fmp4`)** for seamless Common Encryption (CENC) and adaptive bitrate switching over 3G/4G/5G mobile networks in India.
2. **CENC Multi-DRM Security:**
   - Implements **Widevine CENC (Modular DRM)** for Android & Web.
   - Implements **FairPlay Streaming (`cbcs` / `skd://`)** for iOS AVPlayer integration.
   - Constructs binary **Widevine PSSH (Protection System Specific Header)** boxes and injects DRM metadata into HLS `#EXT-X-KEY` tags.
3. **Cloud Run DRM License & Key Management Server:**
   - Node.js/TypeScript microservice verifying user subscription tiers (`VIP`, `PREMIUM`, `FREE`).
   - High-throughput key issuance (< 45ms latency) returning Widevine Protobuf challenges, FairPlay CKC key payloads, and Clearkey JSON specs.
4. **Cloudflare Worker Edge Distribution & Signed URLs:**
   - Protects media playlists and segments from hotlinking using **HMAC-SHA256 Signed URLs** (`?exp=...&sig=...`).
   - Configures optimized edge caching headers (`Cache-Control: public, max-age=31536000`).

---

## 🛠️ Tech Stack

* **Transcoding & Packaging:** FFmpeg (8.1+), Shaka Packager / CENC, fMP4 HLS.
* **DRM Specs:** ISO/IEC 23001-7 (CENC), Widevine Modular, FairPlay Streaming (`cbcs`), Clearkey EME.
* **Backend Microservice:** Node.js, TypeScript, Express, JWT, Docker.
* **Cloud & Edge:** GCP Cloud Run, Cloud Storage, Cloudflare Workers, Cloudflare R2.
* **Player Integrations:** Shaka Player (Web), ExoPlayer (Android Kotlin), AVPlayer (iOS Swift).

---

## 🚀 Quick Start & CLI Pipeline Execution

### Prerequisites
* Node.js v18+ and `ffmpeg` installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/drm-video-pipeline.git
cd drm-video-pipeline
npm install
```

### 2. Run the Full Encoding & DRM Pipeline
```bash
npm run transcode
```
*Outputs: Synthetic vertical 9:16 video ingestion, 3-tier fMP4 HLS encoding, CENC key generation, Widevine/FairPlay manifest injection, and edge signed URL generation.*

### 3. Start the Production DRM License Server
```bash
npm run server
```
Server runs on `http://127.0.0.1:8080`.

---

## 🧪 API Endpoints & Verification

### 1. Fetch HLS Master Playlist
```bash
curl -i http://127.0.0.1:8080/streams/master.m3u8
```

### 2. Request DRM Key (Clearkey Spec)
```bash
curl -i "http://127.0.0.1:8080/api/v1/drm/clearkey/key?kid=73e1dc84427b57ef5f5a888792bab85a"
```
**Response:**
```json
{
  "keys": [
    {
      "kty": "oct",
      "kid": "BFR2Tyk_4Ea_9CqPWKr0GQ",
      "k": "AtacaQpdxkuGsuelFK2NwQ"
    }
  ],
  "type": "temporary"
}
```

### 3. Request Widevine License (Cloud Run Service)
```bash
curl -X POST http://127.0.0.1:8080/api/v1/drm/widevine/license \
  -H "Authorization: Bearer demo_vip_token" \
  -H "Content-Type: application/octet-stream"
```

---

## 🐳 Production Deployment (GCP Cloud Run)

### Build Docker Image
```bash
docker build -t gcr.io/enflix-prod/drm-license-server:latest .
```

### Deploy to Cloud Run
```bash
gcloud run deploy drm-license-server \
  --image gcr.io/enflix-prod/drm-license-server:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```
