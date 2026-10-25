import { chromium, devices } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const results = { browser: browser.version(), views: [] };
try {
  for (const [name, options] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', devices['iPhone 13']]]) {
    const page = await browser.newPage({ ...options, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://localhost:3000/experience');
    await page.getByRole('button', { name: 'Enter 3D showroom' }).click();
    await page.locator('canvas[data-materials]').waitFor();
    await page.waitForTimeout(500);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/design/phase4/${name}-3d.png` });
    await page.getByRole('button', { name: 'Customise interior' }).click();
    await page.getByRole('button', { name: 'Save Design A' }).click();
    await page.getByRole('button', { name: 'Urban Executive', exact: true }).click();
    await page.getByRole('button', { name: 'Gather sofa', exact: true }).click();
    await page.getByRole('button', { name: 'Save Design B' }).click();
    await page.getByRole('button', { name: 'Compare designs' }).click();
    await page.locator('.comparison-head').scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const container = document.querySelector('dialog[open]') || document.querySelector('.showroom-panel');
      const heading = document.querySelector('.comparison-head');
      const sticky = container.querySelector('.config-heading');
      container.scrollTop += heading.getBoundingClientRect().top - sticky.getBoundingClientRect().bottom - 18;
    });
    await page.screenshot({ path: `docs/design/phase4/${name}-comparison.png` });
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG' }).click();
    await (await download).saveAs(`docs/design/phase4/${name}-board.png`);
    results.views.push({ name, errors, renderer: await page.locator('canvas').evaluate(canvas => ({ ...canvas.dataset })) });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile('docs/phase4-visual-verification.json', JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results));
