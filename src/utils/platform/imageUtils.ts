export function getCDNImageUrl(url: string) {
  if (!url) return '';
  if (url.includes('cloudflare-ipfs.com')) {
    return url.replace(
      'cloudflare-ipfs.com/ipfs',
      'd31h13bdjwgzxs.cloudfront.net'
    );
  }
  return `https://worker.snapshot.org/mirror?img=${encodeURIComponent(url)}`;
}
