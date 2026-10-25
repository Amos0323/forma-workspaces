import { firefox } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const started = Date.now();
const executable = firefox.executablePath().split(/[\\/]/).slice(-3).join('/');
const record = result => writeFileSync('docs/phase3c-firefox-launch.json', JSON.stringify({ ...result, elapsedMs: Date.now() - started, executable }, null, 2) + '\n');
const watchdog = setTimeout(() => { record({ verified: false, result: 'Launch or cleanup exceeded 30 seconds' }); process.exit(2); }, 30000);
try {
  const browser = await firefox.launch({ timeout: 15000 });
  const page = await browser.newPage();
  await page.goto('about:blank');
  record({ verified: true, version: browser.version() });
  await browser.close();
} catch (error) {
  record({ verified: false, error: String(error).split('\n')[0] });
} finally { clearTimeout(watchdog); }
