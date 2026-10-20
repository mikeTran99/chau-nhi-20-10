import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };

export function createPreviewServer() {
  return createServer((request, response) => {
    serve(request, response).catch(() => {
      if (!response.headersSent) { response.writeHead(500); response.end('Preview unavailable'); }
      else response.destroy();
    });
  });
}

async function serve(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  let path;
  try { path = decodeURIComponent(request.url.split('?')[0]); }
  catch { response.writeHead(400); response.end(); return; }
  if (path.includes('\\') || path.split('/').includes('..') || path.includes('\0')) { response.writeHead(403); response.end(); return; }
  const name = path === '/' ? 'index.html' : path.slice(1);
  const allowed = ['index.html', 'styles.css', 'app.js'].includes(name) || /^(?:img|assets)\/[a-zA-Z0-9_.-]+\.(?:jpg|jpeg|png|webp|svg|mp4)$/.test(name);
  const file = resolve(root, name);
  if (!allowed || !file.startsWith(root + sep)) { response.writeHead(404); response.end(); return; }
  let info;
  try { info = await stat(file); }
  catch { response.writeHead(404); response.end(); return; }
  if (!info.isFile()) { response.writeHead(404); response.end(); return; }
  let start = 0;
  let end = info.size - 1;
  const headers = { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
  if (request.headers.range) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
    if (!range || (!range[1] && !range[2])) { response.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); response.end(); return; }
    if (!range[1]) start = Math.max(0, info.size - Number(range[2]));
    else { start = Number(range[1]); if (range[2]) end = Math.min(end, Number(range[2])); }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size || Number(range[2]) === 0 && !range[1]) {
      response.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); response.end(); return;
    }
    headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length'] = end - start + 1;
  response.writeHead(request.headers.range ? 206 : 200, headers);
  if (request.method === 'HEAD') { response.end(); return; }
  const stream = createReadStream(file, { start, end });
  stream.on('error', () => response.destroy());
  response.on('close', () => stream.destroy());
  stream.pipe(response);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 2026);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535');
  const server = createPreviewServer();
  server.on('error', error => { console.error(`Preview could not start: ${error.code}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Châu Nhi preview: http://127.0.0.1:${port}`));
}
