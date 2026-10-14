import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../js/lw2_analytics.js', import.meta.url), 'utf8');
const key = 'lunawake.analytics-disabled.v1';
function page({ disabled = null, legacy = null, hostname = 'hellolunawake.com', gpc = false, blocked = false } = {}) {
    const store = new Map([[key, disabled], ['lunawake.analytics-consent.v1', legacy]]);
    const scripts = [], cookies = [], footer = [], calls = [], events = {};
    let reloads = 0;
    const window = { addEventListener(name, fn) { events[name] = fn; }, clarity(...args) { calls.push(args); } };
    const document = {
        createElement(tag) { return { tag, events: {}, addEventListener(n, fn) { this.events[n] = fn; } }; },
        getElementById(id) { return scripts.find(s => s.id === id); },
        head: { appendChild(node) { scripts.push(node); } },
        querySelector() { return { appendChild(node) { footer.push(node); } }; },
        set cookie(value) { cookies.push(value); },
    };
    runInNewContext(source, { window, document, navigator: { globalPrivacyControl: gpc },
        location: { hostname, reload() { reloads++; } }, sessionStorage: { removeItem() {} },
        localStorage: {
            getItem(k) { if (blocked) throw Error('blocked'); return store.get(k) ?? null; },
            setItem(k, v) { if (blocked) throw Error('blocked'); store.set(k, v); },
        } });
    return { scripts, cookies, store, calls, control: footer[0], events, get reloads() { return reloads; } };
}
test('default uses existing project with both storage permissions denied and no popup', () => {
    const p = page();
    assert.equal(p.scripts.length, 1);
    assert.equal(p.scripts[0].src, 'https://www.clarity.ms/tag/yi1tshme1g');
    assert.deepEqual(JSON.parse(JSON.stringify(p.calls[0])),
        ['consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' }]);
    assert.equal(p.control.textContent, 'Turn off analytics');
    assert.ok(!source.includes('innerHTML'));
});
test('old opt-in never grants cookie access; old refusal and browser opt-out are respected', () => {
    assert.equal(page({ legacy: JSON.stringify({ value: 'granted' }) }).calls[0][1].analytics_Storage, 'denied');
    assert.equal(page({ legacy: JSON.stringify({ value: 'denied' }) }).scripts.length, 0);
    assert.equal(page({ disabled: 'true' }).scripts.length, 0);
    const p = page({ gpc: true });
    assert.equal(p.scripts.length, 0);
    assert.equal(p.control.disabled, true);
});
test('footer opt-out stops collection and persists, re-enabling stays cookieless without duplicate tag', () => {
    const p = page();
    p.control.events.click();
    assert.equal(p.calls.at(-1)[0], 'stop');
    assert.equal(p.store.get(key), 'true');
    assert.equal(page({ disabled: p.store.get(key) }).scripts.length, 0);
    p.control.events.click();
    assert.equal(p.store.get(key), 'false');
    assert.equal(p.scripts.length, 1);
    assert.equal(p.calls.at(-1)[1].analytics_Storage, 'denied');
});
test('a refused visit can explicitly re-enable cookieless analytics', () => {
    const p = page({ legacy: JSON.stringify({ value: 'denied' }) });
    p.control.events.click();
    assert.equal(p.scripts.length, 1);
    assert.equal(p.calls[0][1].analytics_Storage, 'denied');
});
test('old identifiers are expired, no persistent cookies are created', () => {
    const p = page();
    assert.ok(p.cookies.some(c => c.startsWith('_clck=; Max-Age=0')));
    assert.ok(p.cookies.some(c => c.startsWith('_clsk=; Max-Age=0')));
    assert.ok(p.cookies.every(c => c.includes('Max-Age=0')));
});
test('unavailable storage does not break collection or page-only opt-out', () => {
    const p = page({ blocked: true });
    assert.equal(p.scripts.length, 1);
    p.control.events.click();
    assert.equal(p.calls.at(-1)[0], 'stop');
});
test('an opt-out during tag loading queues stop; changes in another tab reload', () => {
    const p = page();
    p.control.events.click();
    p.scripts[0].onload();
    assert.equal(p.calls.at(-1)[0], 'stop');
    p.events.storage({ key });
    assert.equal(p.reloads, 1);
});
test('previews never send analytics or touch cookies', () => {
    for (const hostname of ['127.0.0.1', 'localhost', 'jerlinn.github.io']) {
        const p = page({ hostname });
        assert.equal(p.scripts.length, 0);
        assert.equal(p.cookies.length, 0);
    }
});
test('public pages have updated script and no popup assets', () => {
    for (const name of ['index', 'about', 'science', 'support', 'privacy', 'terms', 'press', '_article-template']) {
        const html = readFileSync(new URL('../' + name + '.html', import.meta.url), 'utf8');
        assert.equal((html.match(/src="\/js\/lw2_analytics.js\?v=2026-10-14b/g) || []).length, 1);
        assert.ok(!html.includes('cookie-consent.css'));
    }
});
