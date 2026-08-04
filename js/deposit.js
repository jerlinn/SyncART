(() => {
    'use strict';

    // Shopify-ready configuration. Keep this as the single source of truth
    // for the local preview and map the same fields to Shopify metafields.
    const config = {
        depositAmount: '$9',
        campaignState: 'reservation_open',
        pricingUnlocked: false,
        retailPrice: '$379',
        priceAnchor: '$300–$400',
        priceAnchorEnabled: true,
        shopifyProductUrl: '',
        supportUrl: 'mailto:info@lunawake.ai',
        finishes: {
            amber: { name: 'Amber', src: 'images/luna-latest/finish-amber-1440.webp' },
            stone: { name: 'Stone', src: 'images/luna-latest/finish-stone-1440.webp' },
            charcoal: { name: 'Charcoal', src: 'images/luna-latest/finish-charcoal-1440.webp' }
        },
        priceWindows: [
            { id: 'founding', amount: '$229', savings: '$150', displayDeadline: 'Aug 24', startAt: '', endAt: '', timezone: 'America/Los_Angeles', status: 'current', label: 'Best launch pricing' },
            { id: 'super-early', amount: '$269', savings: '$110', displayDeadline: 'Sep 7', startAt: '', endAt: '', timezone: 'America/Los_Angeles', status: 'upcoming', label: 'Next pricing window' },
            { id: 'early', amount: '$319', savings: '$60', displayDeadline: 'Sep 21 · launch day', startAt: '', endAt: '', timezone: 'America/Los_Angeles', status: 'upcoming', label: 'Launch-day pricing' }
        ]
    };

    const reserveButtons = Array.from(document.querySelectorAll('[data-reserve-button]'));
    const checkoutStatus = document.querySelector('[data-checkout-status]');
    const priceCards = Array.from(document.querySelectorAll('[data-price-window]'));
    const supportLinks = Array.from(document.querySelectorAll('.shopify-deposit-support'));
    const finishButtons = Array.from(document.querySelectorAll('[data-deposit-finish]'));
    const finishImage = document.querySelector('[data-finish-image]');
    const finishName = document.querySelector('[data-deposit-finish-name]');
    const audienceMessage = document.querySelector('[data-audience-message]');
    const query = new URLSearchParams(window.location.search);
    const source = query.get('source') || query.get('utm_source');
    const marketingContext = Object.fromEntries(Array.from(query.entries()).filter(([key]) => key === 'source' || key.startsWith('utm_') || key === 'angle' || key === 'creative'));
    const audienceSignals = [query.get('source'), query.get('utm_source'), query.get('utm_medium')].filter(Boolean).join(' ').toLowerCase();
    const isLeadTraffic = /edm|email|group|lead|crm|community/.test(audienceSignals);
    const state = { submitting: false, finish: 'amber' };

    const isCheckoutReady = () => Boolean(config.shopifyProductUrl) && config.campaignState === 'reservation_open';
    const priceText = (windowConfig) => config.pricingUnlocked ? windowConfig.amount : 'Price unlocking soon';

    const track = (eventName, extra = {}) => {
        const payload = {
            event: eventName,
            page: 'deposit',
            deposit_amount: config.depositAmount,
            campaign_state: config.campaignState,
            pricing_unlocked: config.pricingUnlocked,
            finish: state.finish,
            audience: isLeadTraffic ? 'lead' : 'new_or_unknown',
            ...marketingContext,
            ...extra
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
        if (typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('lunawake:deposit', { detail: payload }));
        }
    };

    const withTracking = (url) => {
        if (!url) return url;
        const target = new URL(url, window.location.href);
        Object.entries(marketingContext).forEach(([key, value]) => target.searchParams.set(key, value));
        return target.toString();
    };

    const updateButtons = () => {
        const ready = isCheckoutReady();
        const campaignClosed = config.campaignState === 'kickstarter_live';
        const unavailable = config.campaignState === 'campaign_failed' || config.campaignState === 'campaign_success';

        reserveButtons.forEach((button) => {
            button.disabled = !ready || state.submitting;
            button.setAttribute('aria-disabled', String(!ready || state.submitting));
            button.innerHTML = state.submitting
                ? 'Opening Shopify Checkout…'
                : campaignClosed
                    ? 'Reservations are closed'
                    : unavailable
                        ? 'Reservation window has ended'
                        : `Reserve for ${config.depositAmount} <span aria-hidden="true">→</span>`;
        });

        if (!checkoutStatus) return;
        checkoutStatus.textContent = ready
            ? `You will continue to Shopify Checkout for ${config.depositAmount}.`
            : campaignClosed
                ? 'Kickstarter is live. New deposits are no longer accepted; existing deposit users should check their email for the private link.'
                    : unavailable
                        ? 'This reservation window is closed.'
                    : 'Preview only: Shopify checkout is being connected before launch.';
        checkoutStatus.classList.toggle('is-ready', ready);
    };

    const updatePriceCards = () => {
        priceCards.forEach((card) => {
            const windowConfig = config.priceWindows.find((item) => item.id === card.dataset.priceWindow);
            if (!windowConfig) return;
            const amount = card.querySelector('[data-price-amount]');
            const savings = card.querySelector('[data-price-savings]');
            const deadline = card.querySelector('[data-price-deadline]');
            if (amount) amount.textContent = priceText(windowConfig);
            if (savings) savings.textContent = config.pricingUnlocked ? `Save ${windowConfig.savings} vs retail` : 'Savings shown when price unlocks';
            if (deadline && windowConfig.displayDeadline) deadline.textContent = windowConfig.displayDeadline;
            card.classList.toggle('is-current', windowConfig.status === 'current');
            card.classList.toggle('is-upcoming', windowConfig.status === 'upcoming');
            card.classList.toggle('is-ended', windowConfig.status === 'ended');
        });
        document.querySelectorAll('[data-retail-price]').forEach((element) => {
            element.textContent = config.retailPrice;
        });
        document.querySelectorAll('[data-price-anchor]').forEach((element) => {
            element.textContent = config.priceAnchor;
        });
        const anchor = document.querySelector('.shopify-deposit-price-context');
        if (anchor) anchor.hidden = !config.priceAnchorEnabled;
    };

    const updateFinish = (finishId = state.finish) => {
        const finish = config.finishes[finishId] || config.finishes.amber;
        state.finish = config.finishes[finishId] ? finishId : 'amber';
        finishButtons.forEach((button) => {
            const selected = button.dataset.depositFinish === state.finish;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        if (finishImage) {
            finishImage.src = finish.src;
            finishImage.alt = `LunaWake in the ${finish.name} finish`;
        }
        if (finishName) finishName.textContent = finish.name;
    };

    const updateSource = () => {
        if (source) document.body.dataset.trafficSource = source;
        document.body.dataset.trafficAudience = isLeadTraffic ? 'lead' : 'new-or-unknown';
        if (!audienceMessage) return;
        audienceMessage.hidden = false;
        audienceMessage.textContent = isLeadTraffic
            ? 'You are already on the LunaWake launch list — no second form. Reserve here using the email you want to use on Kickstarter.'
            : 'New to LunaWake? You can reserve directly here — no prior registration required.';
    };

    const attemptCheckout = (button) => {
        const ctaSlot = button?.dataset.ctaSlot || 'unknown';
        if (!isCheckoutReady()) {
            if (checkoutStatus) checkoutStatus.textContent = 'Preview only: Shopify checkout is being connected before launch.';
            track('deposit_cta_blocked', { reason: 'shopify_product_url_missing', cta_slot: ctaSlot });
            return;
        }
        state.submitting = true;
        updateButtons();
        track('deposit_cta_click', { destination: 'shopify_checkout', cta_slot: ctaSlot });
        window.location.assign(withTracking(config.shopifyProductUrl));
    };

    reserveButtons.forEach((button) => button.addEventListener('click', () => attemptCheckout(button)));
    finishButtons.forEach((button) => button.addEventListener('click', () => updateFinish(button.dataset.depositFinish)));
    supportLinks.forEach((link) => link.setAttribute('href', config.supportUrl));
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });

    updatePriceCards();
    updateFinish();
    updateSource();
    updateButtons();
    track('deposit_cta_view');
})();
