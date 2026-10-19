const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ...['main', 'model', 'storage', 'i18n', 'ui'].map(name => [`/src/${name}.js`, [`src/${name}.js`, 'text/javascript']])
]);

function createAppServer() {
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
    let entry;
    try { entry = files.get(new URL(request.url, 'http://127.0.0.1').pathname); }
    catch { response.writeHead(400); response.end('Bad request'); return; }
    if (!entry) { response.writeHead(404); response.end('Not found'); return; }
    try {
      const body = await fs.readFile(path.join(root, entry[0]));
      response.writeHead(200, { 'Content-Type': `${entry[1]}; charset=utf-8`, 'Content-Length': body.length });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}

if (require.main === module) {
  const server = createAppServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? 'Address 127.0.0.1:4173 is already in use. Keep this address and resolve the port conflict before starting again.' : `Could not start: ${error.code}`);
    process.exitCode = 1;
  });
  server.listen(4173, '127.0.0.1', () => console.log('Hackathon Copilot: http://127.0.0.1:4173/'));
}

module.exports = { createAppServer };
