import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('the complete Vietnamese gift and letter are readable without JavaScript', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const content of ['lang="vi"', 'Nguyễn Hoàng Châu Nhi', 'Trần Lê Minh Trung', '20.10.2026', 'Phụ nữ Việt Nam', 'Châu Nhi của anh', 'Cảm ơn em']) assert.ok(html.includes(content), content);
  for (const id of ['home', 'memories', 'gallery', 'letter', 'forever']) assert.ok(html.includes(`id="${id}"`), id);
});

test('the album contains all 17 original photos exactly once, with real files', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const gallery = [...html.matchAll(/data-photo="(\d+)"[\s\S]*?<img[^>]+src="([^"]+)"/g)];
  assert.equal(gallery.length, 17);
  assert.equal(new Set(gallery.map(item => item[2])).size, 17);
  const originals = (await readdir(new URL('img/', root))).filter(name => name.endsWith('.jpg')).sort();
  assert.deepEqual(gallery.map(item => item[2]), originals.map(name => `img/${name}`));
  await Promise.all(gallery.map(item => access(new URL(item[2], root))));
});

test('essential interactions have named, accessible controls', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  for (const id of ['open-gift', 'skip-intro', 'sound-toggle', 'motion-toggle', 'photo-dialog', 'photo-prev', 'photo-next', 'photo-close', 'hug-button', 'final-message']) assert.ok(html.includes(`id="${id}"`), id);
  assert.match(html, /<dialog[^>]+aria-labelledby="photo-caption"/);
  assert.match(html, /id="final-message"[^>]+aria-live="polite"/);
});
