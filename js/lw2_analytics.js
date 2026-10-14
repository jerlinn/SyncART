/* Cookieless website analytics. Shopify retains its official consent integration. */
(() => {
    'use strict';
    const storageKey = 'lunawake.analytics-disabled.v1';
    const production = ['hellolunawake.com', 'www.hellolunawake.com'].includes(location.hostname);
    const privacyControl = navigator.globalPrivacyControl === true;
    function isDisabled() {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) return saved === 'true';
            // Keep a previous visitor's explicit refusal, even after the banner is removed.
            const legacy = JSON.parse(localStorage.getItem('lunawake.analytics-consent.v1'));
            return legacy && legacy.value === 'denied';
        } catch (_) { return false; }
    }
    let disabled = isDisabled();
    let started = false;

    const footer = document.querySelector('.lw2-footer-bottom');
    if (footer) {
        const control = document.createElement('button');
        control.type = 'button';
        control.className = 'lw2-analytics-control';
        const label = () => {
            control.textContent = privacyControl ? 'Analytics off (browser preference)' :
                (disabled ? 'Turn on analytics' : 'Turn off analytics');
        };
        control.disabled = privacyControl;
        label();
        control.addEventListener('click', () => {
            disabled = !disabled;
            try { localStorage.setItem(storageKey, String(disabled)); } catch (_) { /* Page-only preference. */ }
            label();
            if (disabled && started) {
                window.clarity('stop');
                started = false;
            } else if (!disabled) startAnalytics();
        });
        footer.appendChild(control);
    }

    function startAnalytics() {
        if (!production || disabled || privacyControl || started) return;
        started = true;
        if (document.getElementById('lw2-clarity')) {
            // Resume an explicitly re-enabled, already loaded instance in cookieless mode.
            window.clarity('start');
            window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
            return;
        }
        window.clarity = window.clarity || function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        window.clarity('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
        const script = document.createElement('script');
        script.id = 'lw2-clarity';
        script.async = true;
        script.src = 'https://www.clarity.ms/tag/yi1tshme1g';
        script.onload = () => { if (disabled) window.clarity('stop'); };
        document.head.appendChild(script);
    }

    if (production) {
        // Remove identifiers from the former opt-in installation before loading Clarity.
        for (const name of ['_clck', '_clsk']) {
            for (const domain of ['', location.hostname, 'hellolunawake.com']) {
                document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' +
                    (domain ? '; Domain=' + domain : '');
            }
        }
        try { sessionStorage.removeItem('_cltk'); } catch (_) { /* Storage unavailable. */ }
    }
    window.addEventListener('storage', (event) => {
        if (event.key === storageKey || event.key === null) location.reload();
    });
    // Project Settings > Setup > Cookies must stay OFF to avoid cookies at startup.
    startAnalytics();
})();
