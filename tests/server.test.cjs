const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createAppServer } = require('../scripts/serve.cjs');

test('the local server serves app files and rejects private or unrelated paths', async t => {
  const server = createAppServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const file of ['/', '/styles.css', '/src/main.js', '/src/model.js', '/src/storage.js', '/src/i18n.js', '/src/ui.js']) {
    const response = await fetch(base + file);
    assert.equal(response.status, 200, file);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.ok((await response.text()).length > 0);
  }
  for (const file of ['/devpost/learner-profile.md', '/.git/config', '/.env', '/package.json', '/%2e%2e/.env']) assert.equal((await fetch(base + file)).status, 404, file);
  const post = await fetch(base, { method: 'POST' });
  assert.equal(post.status, 405);
});
