import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface DRMKeyConfig {
  assetId: string;
  keyId: string;   // 32-char hex (128-bit KID)
  key: string;     // 32-char hex (128-bit AES Key)
  iv?: string;     // 32-char hex (128-bit IV)
}

export interface DRMSystemMetadata {
  widevineSystemId: string;
  fairplaySystemId: string;
  clearkeySystemId: string;
  psshWidevine?: string;
  fairplaySkdUri?: string;
}

export const DRM_SYSTEM_IDS = {
  WIDEVINE: 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed',
  FAIRPLAY: '94ce8607-077e-4174-825f-4722197dce80',
  CLEARKEY: 'e2719d58-a985-b3c9-781a-b030af78d30e',
};

export class CENCKeyGenerator {
  /**
   * Generates a deterministic or random 128-bit Key ID and AES Key for an asset
   */
  public static generateKeys(assetId: string, masterSecret: string = 'enflix-secret-master-key'): DRMKeyConfig {
    const kid = crypto.createHmac('sha256', masterSecret)
      .update(`kid:${assetId}`)
      .digest('hex')
      .slice(0, 32);

    const key = crypto.createHmac('sha256', masterSecret)
      .update(`key:${assetId}`)
      .digest('hex')
      .slice(0, 32);

    const iv = crypto.randomBytes(16).toString('hex');

    return { assetId, keyId: kid, key, iv };
  }

  /**
   * Constructs Widevine PSSH (Protection System Specific Header) box in Base64
   */
  public static generateWidevinePSSH(keyIdHex: string): string {
    const keyIdBuffer = Buffer.from(keyIdHex, 'hex');
    // Widevine Protobuf Header payload: [0x12, 0x10, ...keyId...]
    const widevineHeader = Buffer.concat([
      Buffer.from([0x12, 0x10]),
      keyIdBuffer
    ]);

    const systemIdBuffer = Buffer.from(DRM_SYSTEM_IDS.WIDEVINE.replace(/-/g, ''), 'hex');
    const psshSize = 32 + widevineHeader.length;
    
    const psshBox = Buffer.alloc(psshSize);
    psshBox.writeUInt32BE(psshSize, 0); // Box Size
    psshBox.write('pssh', 4);            // Box Type
    psshBox.writeUInt32BE(0, 8);         // Version 0, Flags 0
    systemIdBuffer.copy(psshBox, 12);    // System ID
    psshBox.writeUInt32BE(widevineHeader.length, 28); // Data Size
    widevineHeader.copy(psshBox, 32);     // Data Payload

    return psshBox.toString('base64');
  }
}

export class ManifestDRMInjector {
  /**
   * Injects Widevine, FairPlay, and Clearkey DRM tags into HLS playlists (.m3u8)
   */
  public static injectDRMHeaders(
    playlistPath: string,
    keys: DRMKeyConfig,
    serverBaseUrl: string
  ): void {
    if (!fs.existsSync(playlistPath)) return;

    let content = fs.readFileSync(playlistPath, 'utf8');

    const widevinePssh = CENCKeyGenerator.generateWidevinePSSH(keys.keyId);
    const fairplaySkdUri = `skd://${new URL(serverBaseUrl).host}/api/v1/drm/fairplay/key?assetId=${keys.assetId}`;
    const clearkeyLicenseUri = `${serverBaseUrl}/api/v1/drm/clearkey/key?kid=${keys.keyId}`;

    const drmTags = [
      '# --- ENFLIX MULTI-DRM ENCRYPTION METADATA ---',
      `# EXT-X-KEY:METHOD=SAMPLE-AES,KEYFORMAT="urn:uuid:${DRM_SYSTEM_IDS.WIDEVINE}",KEYFORMATVERSIONS="1",URI="data:text/plain;base64,${widevinePssh}",KEYID=0x${keys.keyId}`,
      `# EXT-X-KEY:METHOD=SAMPLE-AES,KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1",URI="${fairplaySkdUri}",KEYID=0x${keys.keyId}`,
      `# EXT-X-KEY:METHOD=AES-128,URI="${clearkeyLicenseUri}",IV=0x${keys.iv}`,
      '# --------------------------------------------'
    ].join('\n');

    // Inject after #EXTM3U
    if (content.includes('#EXTM3U')) {
      content = content.replace('#EXTM3U', `#EXTM3U\n${drmTags}`);
    } else {
      content = `${drmTags}\n${content}`;
    }

    fs.writeFileSync(playlistPath, content, 'utf8');
    console.log(`[DRM Injector] Injected CENC/Widevine/FairPlay metadata into ${path.basename(playlistPath)}`);
  }
}
