export interface ShareTokenData {
  cat: string;     // enemy category
  tier: string;    // 'free' | 'reading' | 'completion' | 'full'
  serial: string;  // BP-YYYYMMDD-XXXX
  locale: string;  // 'en' | 'zh-TW' | 'zh-Hans'
  rt?: string;     // reading teaser (first ~80 chars)
}

export function encodeShareToken(data: ShareTokenData): string {
  const json = JSON.stringify(data);
  return Buffer.from(json, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeShareToken(token: string): ShareTokenData | null {
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    const data = JSON.parse(json);
    if (!data.cat || !data.tier || !data.serial || !data.locale) return null;
    return data as ShareTokenData;
  } catch {
    return null;
  }
}

export function generateSerial(date: Date, name?: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  let hash = 0;
  const src = name || 'ANON';
  for (let i = 0; i < src.length; i++) {
    hash = ((hash << 5) - hash + src.charCodeAt(i)) | 0;
  }
  const suffix = Math.abs(hash % 10000).toString().padStart(4, '0');
  return `BP-${y}${m}${d}-${suffix}`;
}
