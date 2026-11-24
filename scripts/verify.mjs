import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function assertFileNonEmpty(relPath) {
  const fullPath = path.join(rootDir, relPath);
  assert.ok(fs.existsSync(fullPath), `Missing required file: ${relPath}`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 0, `File is empty: ${relPath}`);
}

assertFileNonEmpty('public/Shreyas_Bhavsar_Resume.pdf');
assertFileNonEmpty('public/assets/idd-traffic-frame.png');
assertFileNonEmpty('public/assets/sar-port-query.png');
assertFileNonEmpty('public/assets/optical-port-match.png');
assertFileNonEmpty('dist/index.html');
assertFileNonEmpty('vercel.json');

const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
const headerKeys = vercelConfig.headers?.[0]?.headers?.map((h) => h.key) ?? [];
assert.ok(headerKeys.includes('Content-Security-Policy'), 'vercel.json missing Content-Security-Policy');
assert.ok(headerKeys.includes('X-Content-Type-Options'), 'vercel.json missing X-Content-Type-Options');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert.ok(!indexHtml.includes('fonts.googleapis.com'), 'index.html must not link external Google Fonts');

const resumeSource = fs.readFileSync(path.join(rootDir, 'src/data/resume.ts'), 'utf8');
for (const expected of [
  '8.98/10',
  '0.443',
  '1.8 ms',
  '24,050',
  'shreyasbhavsar387@gmail.com',
  'https://github.com/kiyo387',
  'https://www.linkedin.com/in/shreyas-bhavsar-053b8440a/',
]) {
  assert.ok(resumeSource.includes(expected), `resume.ts missing ground-truth token: ${expected}`);
}
assert.ok(!resumeSource.includes('+91 8329641785'), 'Plain-text phone number must not be exposed in resume.ts');

const srcFiles = [];
function collectFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full);
    } else if (/\.(ts|tsx|css)$/.test(entry.name)) {
      srcFiles.push(full);
    }
  }
}
collectFiles(path.join(rootDir, 'src'));

const emojiRegex = /[\u{1F300}-\u{1FAFF}]/u;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(rootDir, file);
  assert.ok(!content.includes('transition-all'), `Forbidden transition-all found in ${rel}`);
  assert.ok(!content.includes('will-change: all'), `Forbidden will-change: all found in ${rel}`);
  assert.ok(!emojiRegex.test(content), `Forbidden emoji found in ${rel}`);
  if (content.includes('target="_blank"')) {
    assert.ok(
      content.includes('rel="noopener noreferrer"'),
      `target="_blank" without rel="noopener noreferrer" in ${rel}`
    );
  }
}

console.log(`Verification passed across ${srcFiles.length} source files, security config, and 4 public assets.`);
