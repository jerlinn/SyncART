// Critical CSS extraction v2: per-element matches() against every rule,
// run at mobile + desktop viewports, media conditions preserved.
const { webkit } = require('playwright-webkit');

const PAGE_JS = () => {
  const vh = window.innerHeight;
  // above-fold elements (+ html/body always)
  const els = [document.documentElement, document.body];
  const hidden = [];
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { hidden.push(el); continue; }
    if (r.top < vh + 100 && r.bottom > -100) els.push(el);
  }
  const stripPseudo = (sel) => sel
    .replace(/::?(before|after|placeholder|selection|marker|backdrop|first-line|first-letter)/g, '')
    .replace(/:(hover|focus|focus-visible|focus-within|active|visited)/g, '')
    .trim();
  const matchesAny = (sel, set) => {
    for (const part of sel.split(',')) {
      const t = stripPseudo(part.trim());
      if (!t) return true;
      let ok = false;
      try { ok = set.some(el => el.matches && el.matches(t)); }
      catch { return true; } // unparsable after strip -> keep (safe)
      if (ok) return true;
    }
    return false;
  };
  const out = [];
  const skipped = {};
  let idx = 0;
  const sheet = [...document.styleSheets].find(s => s.href && s.href.includes('styles.css'));
  const walk = (rules, wrap) => {
    for (const rule of rules) {
      if (rule.type === 1) {
        idx++;
        if (matchesAny(rule.selectorText, els)) out.push({ wrap, css: rule.cssText, i: idx });
        else if (/display:\s*none/.test(rule.cssText) && matchesAny(rule.selectorText, hidden)) out.push({ wrap, css: rule.cssText, i: idx });
      } else if (rule.type === 4) { // @media
        walk(rule.cssRules, (wrap ? wrap + ' and ' : '') + '@media ' + rule.conditionText);
      } else if (rule.type === 12) { // @supports
        walk(rule.cssRules, (wrap ? wrap + ' and ' : '') + '@supports ' + rule.conditionText);
      } else if (rule.type === 7) { // @keyframes
        idx++;
        out.push({ wrap: null, css: rule.cssText, i: idx });
      } else {
        skipped[rule.type] = (skipped[rule.type] || 0) + 1;
      }
    }
  };
  walk(sheet.cssRules, null);
  return { out, skipped, total: sheet.cssRules.length };
};

(async () => {
  const browser = await webkit.launch();
  const results = [];
  for (const vp of [{ width: 390, height: 900 }, { width: 1512, height: 982 }]) {
    const page = await browser.newPage({ viewport: vp });
    await page.goto('http://localhost:8080/', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const r = await page.evaluate(PAGE_JS);
    console.error(`vp ${vp.width}: rules=${r.out.length}/${r.total} skippedTypes=${JSON.stringify(r.skipped)}`);
    results.push(r.out);
    await page.close();
  }
  await browser.close();
  // merge runs, preserve ORIGINAL sheet order (cascade correctness)
  const seen = new Map();
  for (const item of results.flat()) {
    const key = item.i + '|' + (item.wrap || '') + '|' + item.css;
    if (!seen.has(key)) seen.set(key, item);
  }
  const ordered = [...seen.values()].sort((a, b) => a.i - b.i);
  let css = '';
  for (const item of ordered) {
    if (!item.wrap) { css += item.css + '\n'; continue; }
    const parts = item.wrap.split(' and @');
    let open = '', close = '';
    for (let p of parts) {
      if (!p.startsWith('@')) p = '@' + p;
      open += p + '{'; close += '}';
    }
    css += open + item.css + close + '\n';
  }
  require('fs').writeFileSync(process.argv[2] || 'critical2.css', css);
  console.error('total unique rules:', seen.size, 'bytes:', css.length);
})();
