import { chromium } from '@playwright/test';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { routes, visualRoutes } from './audit-routes.mjs';
const require = createRequire(import.meta.url);
const phase = process.argv[2] || 'before';
const results = { pages: [], states: [], layouts: [] };
await mkdir('docs/design/phase4', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await page.addInitScript(() => { window.auditCLS = 0; new PerformanceObserver(list => list.getEntries().forEach(entry => { if (!entry.hadRecentInput) window.auditCLS += entry.value; })).observe({ type: 'layout-shift', buffered: true }); });
const errors = []; page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
async function scan(label) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const audit = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } });
    return { violations: result.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: result.incomplete.map(v => ({ id: v.id, count: v.nodes.length })) };
  });
  return { label, ...audit };
}
try {
  for (const width of [1440,390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto('http://localhost:3000' + route);
      const info = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name="description"]')?.content, og: document.querySelector('meta[property="og:title"]')?.content, canonical: document.querySelector('link[rel="canonical"]')?.href, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > innerWidth, missingAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length, externalLinks: [...document.querySelectorAll('a[target="_blank"]')].map(a => ({ href:a.href, rel:a.rel })) }));
      results.pages.push({ route,width,...info,...await scan(route) });
      if (phase === 'after' && visualRoutes.includes(route)) {
        for (let y = 0, h = await page.locator('body').evaluate(n => n.scrollHeight); y < h; y += 700) { await page.evaluate(y => scrollTo(0,y),y); await page.waitForTimeout(40); }
        await page.evaluate(() => scrollTo(0,0));
        await page.screenshot({ path: `docs/design/phase4/${width}-${route === '/' ? 'home' : route.slice(1).replaceAll('/','-')}.png`, fullPage: true });
      }
      results.pages.at(-1).observedLayoutShift = await page.evaluate(() => window.auditCLS);
      console.log(width, route, results.pages.at(-1).violations.map(v=>v.id).join(','));
    }
  }
  await page.goto('http://localhost:3000/experience');
  await page.getByRole('button',{name:'Customise interior'}).click();
  await page.getByRole('button',{name:'Save Design A'}).click();
  await page.getByRole('button',{name:'Urban Executive',exact:true}).click();
  await page.getByRole('button',{name:'Gather sofa',exact:true}).click();
  await page.getByRole('button',{name:'Save Design B'}).click();
  await page.getByRole('button',{name:'Compare designs'}).click();
  results.states.push(await scan('Mobile comparison dialog'));
  await page.getByRole('button',{name:'Close configurator'}).click();
  await page.getByRole('button',{name:'Menu',exact:false}).click();
  results.states.push(await scan('Mobile navigation'));
  await page.keyboard.press('Escape');
  for (const width of [320,768,1024]) {
    await page.setViewportSize({ width,height:900 });
    for (const route of routes) {
      await page.goto('http://localhost:3000' + route);
      results.layouts.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth)});
    }
  }
  results.errors = errors;
} finally { await browser.close(); await writeFile(`docs/phase4-accessibility-${phase}.json`,JSON.stringify(results,null,2)+'\n'); }
