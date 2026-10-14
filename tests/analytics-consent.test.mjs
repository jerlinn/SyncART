import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/lw2_analytics.js', import.meta.url), 'utf8');
const key = 'lunawake.analytics-consent.v1';
const saved = value => JSON.stringify({ value, expires: Date.now() + 60000 });
function page({ choice = null, hostname = 'hellolunawake.com', blockedStorage = false } = {}) {
    const store = new Map(choice ? [[key, choice]] : []);
    const scripts = [], cookies = [], events = {}, body = [], footer = [];
    let reloads = 0, focused;
    const element = tag => ({
        tag, events: {}, setAttribute() {},
        addEventListener(name, fn) { this.events[name] = fn; },
        focus() { focused = this; },
        querySelector() { return { focus() {} }; },
    });
    const window = { addEventListener(name, fn) { events[name] = fn; } };
    const document = {
        createElement: element,
        head: { appendChild(node) { scripts.push(node); } },
        body: { appendChild(node) { body.push(node); } },
        querySelector() { return { appendChild(node) { footer.push(node); } }; },
        set cookie(value) { cookies.push(value); },
    };
    runInNewContext(source, { window, document, location: { hostname, reload() { reloads++; } }, localStorage: {
        getItem(k) { if (blockedStorage) throw Error('blocked'); return store.get(k) ?? null; },
        setItem(k, v) { if (blockedStorage) throw Error('blocked'); store.set(k, v); },
    } });
    return { scripts, cookies, store, window, panel: body[0], settings: footer[0],
        get reloads() { return reloads; }, get focused() { return focused; },
        choose(value) { body[0].events.click({ target: { closest: () => ({ dataset: { choice: value } }) } }); },
        storage(value) { if (value) store.set(key, value); else store.delete(key); events.storage({ key }); },
    };
}

test('no analytics before choice; rejection survives a new page', () => {
    const p = page();
    assert.equal(p.panel.hidden, false);
    assert.equal(p.scripts.length, 0);
    p.choose('denied');
    assert.equal(p.scripts.length, 0);
    const next = page({ choice: p.store.get(key) });
    assert.equal(next.panel.hidden, true);
    assert.equal(next.scripts.length, 0);
});
test('consent loads existing project once and denies advertising; persists across pages', () => {
    const p = page();
    p.choose('granted'); p.choose('granted');
    assert.equal(p.scripts.length, 1);
    assert.equal(p.scripts[0].src, 'https://www.clarity.ms/tag/yi1tshme1g');
    assert.deepEqual(JSON.parse(JSON.stringify(Array.from(p.window.clarity.q[0]))),
        ['consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' }]);
    const next = page({ choice: p.store.get(key) });
    assert.equal(next.panel.hidden, true);
    assert.equal(next.scripts.length, 1);
});
test('footer reopens choices; revocation clears cookies and unloads recorder', () => {
    const p = page({ choice: saved('granted') });
    p.settings.events.click();
    assert.equal(p.panel.hidden, false);
    p.choose('denied');
    assert.equal(p.focused, p.settings);
    assert.equal(p.reloads, 1);
    assert.ok(p.cookies.some(c => c.startsWith('_clck=; Max-Age=0')));
    assert.ok(p.cookies.some(c => c.startsWith('_clsk=; Max-Age=0')));
    assert.equal(page({ choice: p.store.get(key) }).scripts.length, 0);
});
test('invalid or expired preferences ask again without collecting', () => {
    for (const choice of ['broken', JSON.stringify({ value: 'granted', expires: 0 }), saved('other')]) {
        const p = page({ choice });
        assert.equal(p.scripts.length, 0);
        assert.equal(p.panel.hidden, false);
    }
});
test('unavailable storage does not prevent a choice or record by default', () => {
    const p = page({ blockedStorage: true });
    assert.equal(p.scripts.length, 0);
    p.choose('granted');
    assert.equal(p.scripts.length, 1);
    p.choose('denied');
    assert.equal(p.reloads, 1);
});
test('changes in another tab start or unload recording', () => {
    const p = page();
    p.storage(saved('granted'));
    assert.equal(p.scripts.length, 1);
    p.storage(saved('denied'));
    assert.equal(p.reloads, 1);
});
test('local and preview hosts never send analytics', () => {
    for (const hostname of ['127.0.0.1', 'localhost', 'jerlinn.github.io']) {
        const p = page({ hostname, choice: saved('granted') });
        assert.equal(p.scripts.length, 0);
    }
});
test('all public content pages and future article template load consent assets once', () => {
    for (const name of ['index', 'about', 'science', 'support', 'privacy', 'terms', 'press', '_article-template']) {
        const html = readFileSync(new URL('../' + name + '.html', import.meta.url), 'utf8');
        assert.equal((html.match(/src="\/js\/lw2_analytics.js/g) || []).length, 1);
        assert.equal((html.match(/href="\/cookie-consent.css/g) || []).length, 1);
    }
});
