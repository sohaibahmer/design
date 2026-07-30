import crypto from 'crypto';

export interface EdgeRequest {
  url: string;
  headers: Record<string, string>;
}

export class CloudflareWorkerEdgeSimulator {
  private static SIGNING_SECRET = 'enflix-cloudflare-r2-edge-secret';

  /**
   * Generates a signed URL token for edge delivery via Cloudflare R2 / Workers
   */
  public static generateSignedUrl(baseUrl: string, videoId: string, ttlSeconds: number = 3600): string {
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const dataToSign = `${videoId}:${exp}`;
    
    const signature = crypto.createHmac('sha256', this.SIGNING_SECRET)
      .update(dataToSign)
      .digest('hex');

    const url = new URL(baseUrl);
    url.searchParams.set('exp', exp.toString());
    url.searchParams.set('sig', signature);
    return url.toString();
  }

  /**
   * Simulates Cloudflare Worker edge request handling logic
   */
  public static handleRequest(request: EdgeRequest, videoId: string): { status: number; headers: Record<string, string>; body?: string } {
    const url = new URL(request.url);
    const expStr = url.searchParams.get('exp');
    const sig = url.searchParams.get('sig');

    // 1. Verify Signed URL presence
    if (!expStr || !sig) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Access Denied: Missing signed URL token signature' })
      };
    }

    // 2. Check Expiration
    const exp = parseInt(expStr, 10);
    if (Date.now() / 1000 > exp) {
      return {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Access Denied: Signed URL token has expired' })
      };
    }

    // 3. Verify Signature
    const expectedSig = crypto.createHmac('sha256', this.SIGNING_SECRET)
      .update(`${videoId}:${exp}`)
      .digest('hex');

    if (sig !== expectedSig) {
      return {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Access Denied: Invalid signature token' })
      };
    }

    // 4. Return Edge CDN Headers optimized for Indian Mobile Networks
    return {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-CDN-Edge-Location': 'BOM-01 (Mumbai Edge)',
        'X-Content-Type-Options': 'nosniff'
      }
    };
  }
}
