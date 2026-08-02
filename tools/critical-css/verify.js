// Compare above-fold computed styles + geometry between full page and critical-only page.
const { webkit } = require('playwright-webkit');

const COLLECT = () => {
  const vh = window.innerHeight;
  const props = ['display','position','fontSize','fontFamily','fontWeight','lineHeight','letterSpacing',
    'color','backgroundColor','opacity','objectFit','objectPosition','textTransform','borderRadius',
    'paddingTop','paddingLeft','marginTop','marginLeft','zIndex','overflow','visibility'];
  const path = (el) => {
    const bits = [];
    while (el && el !== document.body) {
      bits.unshift(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0,2).join('.') : '') + ':' + [...el.parentNode.children].indexOf(el));
      el = el.parentNode;
    }
    return bits.join('>');
  };
  const out = {};
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!(r.top < vh && r.bottom > 0 && (r.width > 0 || r.height > 0))) continue;
    const cs = getComputedStyle(el);
    const rec = { rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] };
    for (const p of props) rec[p] = cs[p];
    out[path(el)] = rec;
  }
  return out;
};

(async () => {
  const browser = await webkit.launch();
  let fails = 0;
  for (const vp of [{ width: 390, height: 844 }, { width: 1512, height: 982 }]) {
    const grab = async (url) => {
      const page = await browser.newPage({ viewport: vp });
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(900);
      const d = await page.evaluate(COLLECT);
      await page.close();
      return d;
    };
    const full = await grab('http://localhost:8080/');
    const crit = await grab('http://localhost:8080/crit-test.html');
    let diffs = 0;
    for (const [k, fv] of Object.entries(full)) {
      const cv = crit[k];
      if (!cv) { console.log(`[${vp.width}] MISSING-EL ${k}`); diffs++; continue; }
      for (const [p, val] of Object.entries(fv)) {
        const other = cv[p];
        if (p === 'rect') {
          const d = val.map((v, i) => Math.abs(v - other[i]));
          if (Math.max(...d) > 2) { console.log(`[${vp.width}] RECT ${k} full=${val} crit=${other}`); diffs++; }
        } else if (String(val) !== String(other)) {
          console.log(`[${vp.width}] ${p} ${k} full=${val} crit=${other}`); diffs++;
        }
        if (diffs > 40) break;
      }
      if (diffs > 40) break;
    }
    console.log(`[${vp.width}] elements=${Object.keys(full).length} diffs=${diffs}`);
    fails += diffs;
  }
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
