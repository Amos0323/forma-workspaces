import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const rows = [];
const conditions = ['closed','open','comparison','evening'];
try {
  for (let round=0; round<3; round++) for (let j=0; j<conditions.length; j++) {
    const condition=conditions[(j+round)%conditions.length];
    const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    await page.addInitScript(() => {
      window.auditLayout = { cls:0, allShifts:0, longTasks:[] };
      new PerformanceObserver(list => list.getEntries().forEach(e => { window.auditLayout.allShifts+=e.value; if(!e.hadRecentInput)window.auditLayout.cls+=e.value; })).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list => list.getEntries().forEach(e => window.auditLayout.longTasks.push(e.duration))).observe({type:'longtask',buffered:true});
    });
    await page.goto('http://localhost:3000/experience');
    await page.getByRole('button',{name:'Enter 3D showroom'}).click();
    await page.locator('canvas[data-materials]').waitFor();
    if(condition!=='closed') await page.getByRole('button',{name:'Customise interior'}).click();
    if(condition==='comparison') {
      await page.getByRole('button',{name:'Save Design A'}).click();
      await page.getByRole('button',{name:'Save Design B'}).click();
      await page.getByRole('button',{name:'Compare designs'}).click();
    }
    if(condition==='evening') await page.getByRole('button',{name:'Warm Evening',exact:true}).click();
    await page.waitForTimeout(700);
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('Performance.enable'); await cdp.send('HeapProfiler.collectGarbage');
    const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
    const before=await metrics();
    const sample=await page.evaluate(async()=>{
      const canvas=document.querySelector('canvas'), root=document.querySelector('.showroom');
      const initialFrames=Number(canvas.dataset.frames), commits=Number(root.dataset.reactCommits), sceneCommits=Number(canvas.dataset.sceneCommits);
      window.auditLayout.longTasks=[];
      let last=performance.now(); const start=last, intervals=[];
      await new Promise(resolve=>{function frame(now){intervals.push(now-last);last=now;
        // Opposing immediate keys return to exactly the same camera pose every frame.
        for(const key of ['ArrowRight','ArrowLeft']) canvas.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));
        if(now-start<4000)requestAnimationFrame(frame);else resolve();
      }requestAnimationFrame(frame);});
      const elapsed=performance.now()-start; intervals.sort((a,b)=>a-b);
      const gl=canvas.getContext('webgl2'), ext=gl.getExtension('WEBGL_debug_renderer_info');
      return { elapsedMs:elapsed, fps:(Number(canvas.dataset.frames)-initialFrames)/elapsed*1000, medianFrameMs:intervals[Math.floor(intervals.length*.5)], p95FrameMs:intervals[Math.floor(intervals.length*.95)], reactCommits:Number(root.dataset.reactCommits)-commits, sceneCommits:Number(canvas.dataset.sceneCommits)-sceneCommits, renderer:ext&&gl.getParameter(ext.UNMASKED_RENDERER_WEBGL), resolution:[canvas.width,canvas.height], scene:{...canvas.dataset}, layout:{...window.auditLayout} };
    });
    const after=await metrics();
    sample.mainThread={};
    for(const key of ['ScriptDuration','TaskDuration','LayoutDuration','RecalcStyleDuration','LayoutCount','RecalcStyleCount']) sample.mainThread[key]=after[key]-before[key];
    sample.heapBytes=after.JSHeapUsedSize;
    await page.waitForTimeout(500); const f=await page.locator('canvas').getAttribute('data-frames'); await page.waitForTimeout(1000);
    sample.idleFrames=Number(await page.locator('canvas').getAttribute('data-frames'))-Number(f);
    rows.push({round:round+1,condition,...sample}); console.log(round+1,condition,sample.fps.toFixed(1),sample.reactCommits,'commits');
    await writeFile('docs/phase4-performance-samples.json', JSON.stringify(rows,null,2)+'\n');
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await page.goto('http://localhost:3000/experience'); await page.getByRole('button',{name:'Enter 3D showroom'}).click(); await page.locator('canvas[data-materials]').waitFor();
  await page.getByRole('button',{name:'Customise interior'}).click();
  const cdp=await page.context().newCDPSession(page); await cdp.send('Performance.enable');
  const actions=[];
  for(const name of ['Coastal Minimal','Presentation','Save Design A','Save Design B','Compare designs','Download PNG']) {
    const first=Number(await page.locator('.showroom').getAttribute('data-react-commits'));
    const before=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
    const started=performance.now(); const download=name==='Download PNG'?page.waitForEvent('download'):null;
    await page.getByRole('button',{name,exact:!name.startsWith('Save Design')}).click(); if(download) await download;
    await page.waitForTimeout(200);
    const after=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
    actions.push({name,wallMs:performance.now()-started,scriptMs:(after.ScriptDuration-before.ScriptDuration)*1000,taskMs:(after.TaskDuration-before.TaskDuration)*1000,reactCommits:Number(await page.locator('.showroom').getAttribute('data-react-commits'))-first,heapBytes:after.JSHeapUsedSize});
  }
  await writeFile('docs/phase4-performance.json',JSON.stringify({protocol:'Production, Chromium, SwiftShader, 1440x900, DPR1, reduced motion, 4-second opposing-key fixed-pose loop, 700ms warmup, forced GC before each sample, rotating condition order; no concurrent browser work. Action wall times include automation and 200ms settling.',rows,actions},null,2)+'\n');
} finally { await browser.close(); }
