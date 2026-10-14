/* Consent-gated website analytics. The reservation store uses its Shopify app. */
(() => {
    'use strict';
    const projectId = 'yi1tshme1g';
    const storageKey = 'lunawake.analytics-consent.v1';
    const lifetime = 180 * 24 * 60 * 60 * 1000;
    const production = ['hellolunawake.com', 'www.hellolunawake.com'].includes(location.hostname);
    let started = false;
    let returnFocus;

    function readChoice() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (saved && saved.expires > Date.now() && ['granted', 'denied'].includes(saved.value)) {
                return saved.value;
            }
        } catch (_) { /* Storage can be unavailable in private browsing. */ }
        return null;
    }

    function startAnalytics() {
        if (!production || started) return;
        started = true;
        window.clarity = window.clarity || function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        // Queue the choice before loading the vendor. Advertising stays disabled.
        window.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.clarity.ms/tag/' + projectId;
        document.head.appendChild(script);
    }

    function stopAnalytics() {
        if (!started) return;
        window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
        window.clarity('consent', false);
        for (const name of ['_clck', '_clsk']) {
            for (const domain of ['', location.hostname, 'hellolunawake.com']) {
                document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' +
                    (domain ? '; Domain=' + domain : '');
            }
        }
        // A reload also unloads the recording runtime (denial alone can be cookieless).
        location.reload();
    }

    const panel = document.createElement('section');
    panel.className = 'lw2-cookie-panel';
    panel.setAttribute('aria-label', 'Website analytics choices');
    panel.innerHTML = '<div><strong>Help us improve your visit</strong>' +
        '<p>Allow Microsoft Clarity to use analytics cookies and record page interactions for heatmaps and session replay. ' +
        'Your choice is optional. <a href="/privacy.html#website-analytics">Privacy policy</a></p></div>' +
        '<div class="lw2-cookie-actions"><button type="button" data-choice="denied">Decline</button>' +
        '<button type="button" data-choice="granted">Allow analytics</button></div>';
    panel.hidden = !!readChoice();
    document.body.appendChild(panel);

    panel.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-choice]');
        if (!button) return;
        const value = button.dataset.choice;
        try {
            localStorage.setItem(storageKey, JSON.stringify({ value, expires: Date.now() + lifetime }));
        } catch (_) { /* The choice still applies to this page if persistence is blocked. */ }
        panel.hidden = true;
        if (returnFocus) returnFocus.focus();
        if (value === 'granted') startAnalytics();
        else stopAnalytics();
    });

    const footer = document.querySelector('.lw2-footer-bottom');
    if (footer) {
        const settings = document.createElement('button');
        settings.type = 'button';
        settings.className = 'lw2-cookie-settings';
        settings.textContent = 'Cookie settings';
        settings.addEventListener('click', () => {
            returnFocus = settings;
            panel.hidden = false;
            panel.querySelector('button').focus();
        });
        footer.appendChild(settings);
    }

    window.addEventListener('storage', (event) => {
        if (event.key !== storageKey && event.key !== null) return;
        const choice = readChoice();
        panel.hidden = !!choice;
        if (choice === 'granted') startAnalytics();
        else stopAnalytics();
    });
    if (readChoice() === 'granted') startAnalytics();
})();
