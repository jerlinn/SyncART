(() => {
    'use strict';

    // Shopify-ready defaults. A production host can override these fields by
    // defining window.LUNAWAKE_DEPOSIT_CONFIG before this script loads.
    const defaults = {
        depositAmount: '$9',
        campaignState: 'reservation_open',
        pricingUnlocked: true,
        retailPrice: '$379',
        priceAnchor: '',
        priceAnchorEnabled: false,
        coach: {
            includedDays: 30,
            value: '$19.99',
            availability: 'Available after a valid Kickstarter pledge and campaign success — before LunaWake ships.'
        },
        shopifyProductUrl: '',
        supportUrl: 'mailto:info@lunawake.ai',
        finishes: {
            stone: { name: 'Stone', src: 'images/luna-latest/finish-stone-1440.webp' },
            charcoal: { name: 'Charcoal', src: 'images/luna-latest/finish-charcoal-1440.webp' },
            amber: { name: 'Amber', src: 'images/luna-latest/finish-amber-1440.webp' }
        },
        priceWindows: [
            { id: 'founding', amount: '$229', savings: '$150', displayDeadline: 'Aug 24, 2026 PT', startAt: '', endAt: '2026-08-24T23:59:59-07:00', timezone: 'America/Los_Angeles', status: 'current', ctaLabel: 'Current price', label: 'Founding Kickstarter price' },
            { id: 'super-early', amount: '$269', savings: '$110', displayDeadline: 'Sep 7, 2026 PT', startAt: '2026-08-25T00:00:00-07:00', endAt: '2026-09-07T23:59:59-07:00', timezone: 'America/Los_Angeles', status: 'current', ctaLabel: 'Next price', label: 'Next Kickstarter price' },
            { id: 'early', amount: '$319', savings: '$60', displayDeadline: 'Sep 21, 2026 PT · launch day', startAt: '2026-09-08T00:00:00-07:00', endAt: '2026-09-21T23:59:59-07:00', timezone: 'America/Los_Angeles', status: 'current', ctaLabel: 'Launch-day price', label: 'Launch-day Kickstarter price' }
        ]
    };

    const runtimeConfig = window.LUNAWAKE_DEPOSIT_CONFIG || {};
    const config = {
        ...defaults,
        ...runtimeConfig,
        coach: { ...defaults.coach, ...(runtimeConfig.coach || {}) },
        priceWindows: Array.isArray(runtimeConfig.priceWindows) ? runtimeConfig.priceWindows : defaults.priceWindows,
        finishes: { ...defaults.finishes, ...(runtimeConfig.finishes || {}) }
    };

    const reserveButtons = Array.from(document.querySelectorAll('[data-reserve-button]'));
    const checkoutStatus = document.querySelector('[data-checkout-status]');
    const priceCards = Array.from(document.querySelectorAll('[data-price-window]'));
    const supportLinks = Array.from(document.querySelectorAll('.shopify-deposit-support'));
    const secondaryLinks = Array.from(document.querySelectorAll('.shopify-deposit-secondary-cta'));
    const finishButtons = Array.from(document.querySelectorAll('[data-deposit-finish]'));
    const finishImage = document.querySelector('[data-finish-image]');
    const finishName = document.querySelector('[data-deposit-finish-name]');
    const audienceMessage = document.querySelector('[data-audience-message]');
    const coldExplainer = document.querySelector('[data-cold-explainer]');
    const coachSection = document.querySelector('[data-coach-section]');
    const launchDateNodes = Array.from(document.querySelectorAll('[data-launch-date]'));
    const heroRewards = Array.from(document.querySelectorAll('[data-hero-reward]'));
    const heroSavings = document.querySelector('[data-hero-savings]');
    const headerReward = document.querySelector('[data-header-reward]');
    const checkoutMessage = checkoutStatus?.querySelector('[data-checkout-message]') || checkoutStatus;
    const previewLinks = Array.from(document.querySelectorAll('[data-preview-link], [data-header-preview-link]'));
    const headerReserveButton = document.querySelector('[data-header-reserve-button]');
    const headerPreviewLink = document.querySelector('[data-header-preview-link]');
    const query = new URLSearchParams(window.location.search);
    const source = query.get('source') || query.get('utm_source') || query.get('traffic_source') || '';
    const audienceParam = (query.get('audience') || '').toLowerCase();
    const audience = audienceParam === 'lead' ? 'lead' : audienceParam === 'ad' ? 'new' : 'new_or_unknown';
    const marketingContext = Object.fromEntries(Array.from(query.entries()).filter(([key]) => key === 'source' || key.startsWith('utm_') || ['angle', 'creative', 'placement'].includes(key)));
    const state = { submitting: false, finish: null };

    const isCheckoutReady = () => Boolean(config.shopifyProductUrl) && config.campaignState === 'reservation_open';
    const priceText = (windowConfig) => config.pricingUnlocked ? windowConfig.amount : 'Price unlocking soon';
    const windowStatus = (windowConfig) => {
        const now = Date.now();
        const start = windowConfig.startAt ? Date.parse(windowConfig.startAt) : NaN;
        const end = windowConfig.endAt ? Date.parse(windowConfig.endAt) : NaN;
        if (!Number.isNaN(start) && now < start) return 'upcoming';
        if (!Number.isNaN(end) && now >= end) return 'ended';
        return windowConfig.status;
    };
    const currentWindow = () => config.priceWindows.find((item) => windowStatus(item) === 'current') || config.priceWindows.find((item) => windowStatus(item) !== 'ended') || config.priceWindows[0];
    const moneyValue = (value) => Number(String(value || '').replace(/[^0-9.-]/g, ''));
    const calendarDayValue = (date, timezone) => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone || 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(date);
        const value = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
        return Date.UTC(value('year'), value('month') - 1, value('day'));
    };
    const daysLeft = (windowConfig) => {
        if (!windowConfig?.endAt) return null;
        const end = Date.parse(windowConfig.endAt);
        if (Number.isNaN(end)) return null;
        const timezone = windowConfig.timezone || 'America/Los_Angeles';
        return Math.max(0, Math.ceil((calendarDayValue(new Date(end), timezone) - calendarDayValue(new Date(), timezone)) / 86400000));
    };
    const deadlineText = (windowConfig) => {
        if (windowConfig?.displayDeadline) return windowConfig.displayDeadline;
        if (!windowConfig?.endAt) return 'Current window';
        const date = new Date(windowConfig.endAt);
        if (Number.isNaN(date.getTime())) return 'Current window';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: windowConfig.timezone || 'America/Los_Angeles',
            timeZoneName: 'short'
        }).format(date);
    };
    const urgencyLabel = (windowConfig) => {
        if (!config.pricingUnlocked) return 'Price unlocks when this window opens';
        const remaining = daysLeft(windowConfig);
        if (remaining === null) return windowStatus(windowConfig) === 'current' ? 'while this window is open' : 'after the current window';
        return `${remaining} day${remaining === 1 ? '' : 's'} left`;
    };
    const priceDeltaLabel = (windowConfig) => {
        const active = currentWindow();
        const delta = moneyValue(windowConfig?.amount) - moneyValue(active?.amount);
        if (!config.pricingUnlocked || !Number.isFinite(delta) || delta <= 0) return 'Price rises later';
        return `+$${delta} after current`;
    };
    const ctaLabel = () => `Reserve ${config.depositAmount}`;

    const track = (eventName, extra = {}) => {
        const activeWindow = currentWindow();
        const payload = {
            event: eventName,
            page: 'deposit',
            deposit_amount: config.depositAmount,
            campaign_state: config.campaignState,
            pricing_unlocked: config.pricingUnlocked,
            finish: state.finish,
            audience,
            traffic_source: source,
            campaign: query.get('campaign') || query.get('utm_campaign') || '',
            creative: query.get('creative') || query.get('utm_content') || '',
            price_window: activeWindow?.id || '',
            reward_price: activeWindow?.amount || '',
            ...marketingContext,
            ...extra
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
        if (typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('lunawake:deposit', { detail: payload }));
        }
    };

    const withTracking = (url, extraParams = {}) => {
        if (!url) return url;
        const target = new URL(url, window.location.href);
        Object.entries(marketingContext).forEach(([key, value]) => target.searchParams.set(key, value));
        if (audienceParam) target.searchParams.set('audience', audienceParam);
        Object.entries(extraParams).forEach(([key, value]) => target.searchParams.set(key, value));
        const activeWindow = currentWindow();
        if (state.finish) target.searchParams.set('finish', state.finish);
        if (activeWindow) {
            target.searchParams.set('price_window', activeWindow.id);
            target.searchParams.set('reward_price', activeWindow.amount);
        }
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
                        : ready
                            ? `${ctaLabel(button.dataset.ctaSlot)} <span aria-hidden="true">→</span>`
                            : 'Reservation opens soon';
        });

        if (headerReserveButton) headerReserveButton.hidden = !ready && !campaignClosed && !unavailable;
        if (headerPreviewLink) headerPreviewLink.hidden = ready || campaignClosed || unavailable;

        if (!checkoutStatus) return;
        if (checkoutMessage) checkoutMessage.textContent = ready
            ? `You will continue to Shopify Checkout for ${config.depositAmount}.`
            : campaignClosed
                ? 'Kickstarter is live. New deposits are no longer accepted; existing deposit users should check their email for the private link.'
                    : unavailable
                        ? 'This reservation window is closed.'
                    : 'Checkout is opening soon. Join the launch list for launch updates.';
        previewLinks.forEach((link) => {
            link.hidden = ready || campaignClosed || unavailable;
        });
        checkoutStatus.classList.toggle('is-ready', ready);
    };

    const updatePriceCards = () => {
        priceCards.forEach((card) => {
            const windowConfig = config.priceWindows.find((item) => item.id === card.dataset.priceWindow);
            if (!windowConfig) return;
            const amount = card.querySelector('[data-price-amount]');
            const savings = card.querySelector('[data-price-savings]');
            const deadline = card.querySelector('[data-price-deadline]');
            const urgency = card.querySelector('[data-price-urgency]');
            const delta = card.querySelector('[data-price-delta]');
            if (amount) amount.textContent = priceText(windowConfig);
            if (savings) savings.textContent = config.pricingUnlocked ? `Save ${windowConfig.savings}` : 'Savings shown when price unlocks';
            if (deadline) deadline.textContent = deadlineText(windowConfig);
            if (urgency) urgency.textContent = urgencyLabel(windowConfig);
            if (delta) delta.textContent = priceDeltaLabel(windowConfig);
            const status = windowStatus(windowConfig);
            card.classList.toggle('is-current', status === 'current');
            card.classList.toggle('is-upcoming', status === 'upcoming');
            card.classList.toggle('is-ended', status === 'ended');
        });
        document.querySelectorAll('[data-retail-price]').forEach((element) => {
            element.textContent = config.retailPrice;
        });
        const anchor = document.querySelector('.shopify-deposit-price-context');
        if (anchor) anchor.hidden = !config.priceAnchorEnabled;
        const activeWindow = currentWindow();
        const reward = activeWindow?.amount || config.priceWindows[0]?.amount || '';
        const savings = activeWindow?.savings || '';
        heroRewards.forEach((element) => {
            element.textContent = priceText(activeWindow || {});
        });
        if (heroSavings) heroSavings.textContent = config.pricingUnlocked && savings ? String(savings).replace(/^Save\s+/i, '') : 'more';
        document.querySelectorAll('[data-card-savings]').forEach((element) => {
            element.textContent = config.pricingUnlocked && savings ? String(savings).replace(/^Save\s+/i, '') : 'more';
        });
        document.querySelectorAll('[data-current-reward], [data-mobile-reward]').forEach((element) => {
            element.textContent = config.pricingUnlocked ? reward : 'Price unlocking soon';
        });
        if (headerReward) headerReward.textContent = config.pricingUnlocked ? reward : 'the current';
        document.querySelectorAll('[data-current-savings]').forEach((element) => {
            element.textContent = config.pricingUnlocked && savings ? `Save ${savings}` : 'current launch window';
        });
        document.querySelectorAll('[data-deposit-amount]').forEach((element) => {
            element.textContent = config.depositAmount;
        });
        const launchWindow = config.priceWindows.find((item) => item.id === 'early') || config.priceWindows[config.priceWindows.length - 1];
        launchDateNodes.forEach((element) => {
            element.textContent = launchWindow?.displayDeadline || 'Kickstarter launch';
        });
        document.querySelectorAll('[data-final-savings]').forEach((element) => {
            element.textContent = config.pricingUnlocked && savings ? String(savings).replace(/^Save\s+/i, '') : 'more';
        });
        const remaining = daysLeft(activeWindow);
        document.querySelectorAll('[data-current-deadline]').forEach((element) => {
            element.textContent = deadlineText(activeWindow);
        });
        document.querySelectorAll('[data-countdown-days]').forEach((element) => {
            element.textContent = remaining === null
                ? 'Current window open'
                : remaining === 0
                    ? 'Ends today'
                    : `${remaining} day${remaining === 1 ? '' : 's'} left`;
        });
    };

    const updateFinish = (finishId = state.finish) => {
        const selectedFinishId = config.finishes[finishId] ? finishId : 'stone';
        const finish = config.finishes[selectedFinishId];
        state.finish = finishButtons.length ? selectedFinishId : null;
        finishButtons.forEach((button) => {
            const selected = button.dataset.depositFinish === state.finish;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        if (finishImage && finishButtons.length) {
            finishImage.src = finish.src;
            finishImage.alt = `LunaWake in the ${finish.name} finish`;
        }
        if (finishName) finishName.textContent = finish.name;
    };

    const updateSource = () => {
        if (source) document.body.dataset.trafficSource = source;
        document.body.dataset.trafficAudience = audience;
        if (!audienceMessage) return;
        if (audience === 'lead') {
            audienceMessage.hidden = false;
            audienceMessage.textContent = 'You are already on the launch list — no second form needed.';
            if (coldExplainer) coldExplainer.hidden = true;
            return;
        }
        audienceMessage.hidden = true;
        if (coldExplainer) coldExplainer.hidden = false;
    };

    const updateCoachCopy = () => {
        document.querySelectorAll('[data-coach-days]').forEach((element) => {
            element.textContent = String(config.coach.includedDays);
        });
        document.querySelectorAll('[data-coach-value]').forEach((element) => {
            element.textContent = config.coach.value;
        });
        document.querySelectorAll('[data-coach-availability]').forEach((element) => {
            element.textContent = config.coach.availability;
        });
    };

    const positionCoachReport = () => {
        const report = document.querySelector('[data-coach-report]');
        if (!report || report.dataset.reportStart !== 'reflection') return;
        const endOffset = Number(report.dataset.reportEndOffset || 0);
        const maxScroll = Math.max(0, report.scrollHeight - report.clientHeight);
        report.scrollTop = Math.max(0, maxScroll - (Number.isFinite(endOffset) ? endOffset : 0));
    };

    const initializeCoachReport = () => {
        const report = document.querySelector('[data-coach-report]');
        if (!report) return;
        const image = report.querySelector('img');
        if (image && !image.complete) image.addEventListener('load', positionCoachReport, { once: true });
        positionCoachReport();
        window.requestAnimationFrame(() => {
            positionCoachReport();
            window.setTimeout(positionCoachReport, 120);
            window.setTimeout(positionCoachReport, 1000);
        });
    };

    const observeCoachSection = () => {
        if (!coachSection) return;
        const recordView = () => track('deposit_coach_view', {
            section: 'coach_value',
            coach_days: config.coach.includedDays,
            coach_value: config.coach.value
        });
        if (!('IntersectionObserver' in window)) {
            recordView();
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            recordView();
            observer.disconnect();
        }, { threshold: 0.35 });
        observer.observe(coachSection);
    };

    const observeCtaSlots = () => {
        if (!reserveButtons.length) return;
        const viewedSlots = new Set();
        const recordView = (button) => {
            const ctaSlot = button.dataset.ctaSlot || 'unknown';
            if (viewedSlots.has(ctaSlot)) return;
            viewedSlots.add(ctaSlot);
            track('deposit_cta_slot_view', { cta_slot: ctaSlot });
        };
        if (!('IntersectionObserver' in window)) {
            reserveButtons.forEach(recordView);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                recordView(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        reserveButtons.forEach((button) => observer.observe(button));
    };

    const supportAddress = (url) => {
        const value = String(url || '');
        if (!value.toLowerCase().startsWith('mailto:')) return '';
        return decodeURIComponent(value.slice(7).split('?')[0]);
    };

    const attemptCheckout = (button) => {
        const ctaSlot = button?.dataset.ctaSlot || 'unknown';
        if (!isCheckoutReady()) {
            if (checkoutMessage) checkoutMessage.textContent = 'Checkout is opening soon. Join the launch list for launch updates.';
            track('deposit_cta_blocked', {
                reason: config.shopifyProductUrl ? `campaign_state_${config.campaignState}` : 'shopify_product_url_missing',
                cta_slot: ctaSlot
            });
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
    document.querySelectorAll('[data-support-email]').forEach((element) => {
        element.textContent = supportAddress(config.supportUrl) || 'Open support center';
    });
    secondaryLinks.forEach((link) => {
        link.setAttribute('href', withTracking(link.href, {
            utm_source: 'deposit-page',
            utm_medium: 'footer-exit',
            utm_campaign: 'deposit_launch_v1',
            utm_content: 'not-ready'
        }));
    });
    if (headerPreviewLink) {
        headerPreviewLink.setAttribute('href', withTracking(headerPreviewLink.href, {
            utm_source: 'deposit-page',
            utm_medium: 'header',
            utm_campaign: 'deposit_launch_v1',
            utm_content: 'not-ready'
        }));
        headerPreviewLink.addEventListener('click', () => track('deposit_waitlist_click', {
            destination: 'launch_list',
            cta_slot: 'header'
        }));
    }
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });

    updatePriceCards();
    updateFinish();
    updateSource();
    updateCoachCopy();
    initializeCoachReport();
    updateButtons();
    observeCtaSlots();
    observeCoachSection();
    track('deposit_cta_view', { cta_slot: 'page' });
})();
