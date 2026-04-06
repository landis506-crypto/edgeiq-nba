// EdgeIQ ESPN Proxy — Cloudflare Worker
// Deploy free at: https://workers.cloudflare.com
// Free tier: 100,000 requests/day forever. No credit card needed.
//
// SETUP (2 minutes):
// 1. Go to https://workers.cloudflare.com → Sign up free
// 2. Click "Create a Worker"
// 3. Delete the default code, paste this entire file
// 4. Click "Save and Deploy"
// 5. Copy your worker URL (looks like: https://edgeiq-espn.YOUR-NAME.workers.dev)
// 6. Paste that URL into index.html where it says WORKER_URL

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Strip the /api/espn prefix and forward to ESPN
    const espnPath = url.pathname.replace('/api/espn', '');
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba${espnPath}${url.search}`;

    const espnResponse = await fetch(espnUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const data = await espnResponse.text();

    // Return with CORS headers so any browser can call this worker
    return new Response(data, {
      status: espnResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60',
      }
    });
  }
};
