(() => {
    'use strict';

    // Shopify-ready defaults. A production host can override these fields by
    // defining window.LUNAWAKE_DEPOSIT_CONFIG before this script loads.
    const defaults = {
        depositAmount: '$9',
        campaignState: 'reservation_open',
        pricingUnlocked: true,
        launchListCount: '2,000+',
        coach: {
            includedDays: 30,
            value: '$19.99',
            availability: 'Starts when the campaign ends — before LunaWake ships.'
        },
        shopifyProductUrl: '',
        launchListUrl: 'https://prelaunch.lunawake.ai/',
        supportUrl: 'mailto:info@lunawake.ai',
        finishes: {
            amber: {
                name: 'Amber',
                detail: 'Burnished amber that warms the room before the light comes on.',
                code: 'LW / AMBER',
                hex: '#b9673b',
                src: 'images/luna-latest/finish-amber-1440.webp?v=2026-08-05d',
                srcset: 'images/luna-latest/finish-amber-720.webp?v=2026-08-05d 720w, images/luna-latest/finish-amber-1440.webp?v=2026-08-05d 1440w'
            },
            stone: {
                name: 'Stone',
                detail: 'A pale mineral neutral that keeps the room feeling open and quiet.',
                code: 'LW / STONE',
                hex: '#a9aaa6',
                src: 'images/luna-latest/finish-stone-1440.webp?v=2026-08-05d',
                srcset: 'images/luna-latest/finish-stone-720.webp?v=2026-08-05d 720w, images/luna-latest/finish-stone-1440.webp?v=2026-08-05d 1440w'
            },
            charcoal: {
                name: 'Charcoal',
                detail: 'Deep charcoal with a grounded, architectural presence.',
                code: 'LW / CHARCOAL',
                hex: '#242321',
                src: 'images/luna-latest/finish-charcoal-1440.webp?v=2026-08-05d',
                srcset: 'images/luna-latest/finish-charcoal-720.webp?v=2026-08-05d 720w, images/luna-latest/finish-charcoal-1440.webp?v=2026-08-05d 1440w'
            }
        },
        priceWindows: [
            { id: 'founding', amount: '$229', savings: '$90', displayDeadline: 'Sep 6 · 11:59pm ET', startAt: '', endAt: '2026-09-06T23:59:59-04:00', timezone: 'America/New_York', status: 'current' },
            { id: 'super-early', amount: '$269', savings: '$50', displayDeadline: 'Sep 20 · 11:59pm ET', startAt: '2026-09-07T00:00:00-04:00', endAt: '2026-09-20T23:59:59-04:00', timezone: 'America/New_York', status: 'current' },
            { id: 'early', amount: '$319', savings: '$0', displayDeadline: 'Sep 21 · launch day', startAt: '2026-09-21T00:00:00-04:00', endAt: '', timezone: 'America/New_York', status: 'current' }
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
    const reservationCard = document.querySelector('.deposit-reorg-reservation-card');
    const mobileCta = document.querySelector('[data-mobile-cta]');
    const checkoutStatus = document.querySelector('[data-checkout-status]');
    const priceCards = Array.from(document.querySelectorAll('[data-price-window]'));
    const supportLinks = Array.from(document.querySelectorAll('.deposit-reorg-trust__email, .deposit-reorg-faq__support'));
    const secondaryLinks = Array.from(document.querySelectorAll('.shopify-deposit-secondary-cta'));
    const finishOptionsHost = document.querySelector('[data-deposit-finish-options]');
    if (finishOptionsHost) {
        finishOptionsHost.textContent = '';
        Object.entries(config.finishes).forEach(([slug, finish]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.depositFinish = slug;
            button.setAttribute('aria-pressed', 'false');
            const swatch = document.createElement('i');
            swatch.className = 'shopify-deposit-finish-swatch';
            swatch.setAttribute('aria-hidden', 'true');
            if (finish.hex) swatch.style.background = finish.hex;
            button.append(swatch, document.createTextNode(finish.name));
            finishOptionsHost.append(button);
        });
    }
    const finishButtons = Array.from(document.querySelectorAll('[data-deposit-finish]'));
    const finishName = document.querySelector('[data-deposit-finish-name]');
    const coachSection = document.querySelector('[data-coach-section]');
    const launchListCountNodes = Array.from(document.querySelectorAll('[data-launch-list-count]'));
    const checkoutMessage = checkoutStatus?.querySelector('[data-checkout-message]') || checkoutStatus;
    const previewLinks = Array.from(document.querySelectorAll('[data-preview-link]'));
    const query = new URLSearchParams(window.location.search);
    const source = query.get('source') || query.get('utm_source') || query.get('traffic_source') || '';
    const audienceParam = (query.get('audience') || '').toLowerCase();
    const audience = audienceParam === 'lead' ? 'lead' : audienceParam === 'ad' ? 'new' : 'new_or_unknown';
    const marketingContext = Object.fromEntries(Array.from(query.entries()).filter(([key]) => key === 'source' || key.startsWith('utm_') || ['angle', 'creative', 'placement'].includes(key)));
    const savedFinish = (() => {
        try {
            const raw = window.localStorage.getItem('lunawake-finish-poll') || null;
            // Votes stored by the retired five-color poll: same hex under a different name.
            return raw ? ({ moonstone: 'stone', midnight: 'charcoal' }[raw] || raw) : null;
        } catch (error) { return null; }
    })();
    const state = { submitting: false, finish: savedFinish };

    const checkoutState = () => {
        if (config.campaignState === 'kickstarter_live') return 'closed';
        if (config.campaignState === 'campaign_failed' || config.campaignState === 'campaign_success') return 'ended';
        return Boolean(config.shopifyProductUrl) && config.campaignState === 'reservation_open' ? 'live' : 'preview';
    };
    const isCheckoutReady = () => checkoutState() === 'live';
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
        if (!windowConfig?.endAt) return 'before the next price window';
        const date = new Date(windowConfig.endAt);
        if (Number.isNaN(date.getTime())) return 'before the next price window';
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
    const savingsText = (windowConfig) => {
        if (!config.pricingUnlocked) return 'Savings shown when price unlocks';
        if (moneyValue(windowConfig?.savings) <= 0) return 'Launch-day price';
        return `Save ${windowConfig.savings} vs. launch day`;
    };
    const priceDeltaLabel = (windowConfig) => {
        const active = currentWindow();
        const delta = moneyValue(windowConfig?.amount) - moneyValue(active?.amount);
        if (!config.pricingUnlocked || !Number.isFinite(delta) || delta <= 0) return 'Price rises later';
        return `+$${delta} after current`;
    };
    const ctaLabel = (slot = '') => {
        if (checkoutState() === 'preview') return slot === 'mobile' ? 'Notify me when it opens' : 'Get notified when reservations open';
        return `Reserve ${config.depositAmount}`;
    };

    // The static HTML carries the live-state copy. In preview, the promise
    // ("Due today $9") must not outrun the action ("Get notified"), so these
    // strings rewrite the payment language into honest waitlist language.
    const STATE_COPY = {
        preview: {
            // Pre-test data (n=437): the strongest differentiator for the
            // 25-44 wearable-user segment is "nothing to wear" — keep it in
            // the preview lede, and keep the gold amount span in the heading.
            'hero-heading': 'Be first when reservations open.',
            'hero-lede': 'Nothing to wear, nothing to charge — it reads your night from the bedside and shapes the room around your sleep.',
            'card-due-label': 'Reservation deposit',
            'card-reward-label': 'Your $9 locks this price',
            'card-deadline': 'Reservations open soon. The founding price holds until <b data-current-deadline></b><b data-countdown-days hidden></b>.',
            'price-headline': `${config.depositAmount} will lock<br><strong>${currentWindow()?.amount || '$229'}</strong>.`,
            // The deadline lives in the card and the timeline row; stating it a
            // third time here read as manufactured urgency in design review.
            'price-deadline': 'The launch list hears first when reservations open.',
            'window-chip-founding': 'At open',
            'trust-order': 'One email on Sep 21 completes the <b data-current-reward>$229</b> order',
            'steps-lede': `When reservations open — <span data-deposit-amount>${config.depositAmount}</span> holds your price. Sep 21 — one personal order link completes your order.`,
            'step1-time': 'At open',
            'step1-body': `We email you the moment reservations open. Your ${config.depositAmount} will be refundable any time, for any reason.`,
            'final-heading': 'Save your spot<br>on the launch list.',
            'final-lede': `<strong><span data-launch-list-count>${config.launchListCount}</span> people are already on the list.</strong> Leave your email and we will tell you the moment the ${config.depositAmount} reservation opens.`,
            'sticky-label': '<span class="deposit-reorg-sticky__desktop-label">Reservations open soon</span><span class="deposit-reorg-sticky__compact-label">Open soon</span>'
        }
    };
    // Must run before updatePriceCards() so the deadline/countdown spans it
    // injects get filled; must not run again after, or the fills are lost.
    const updateStateCopy = () => {
        const copy = STATE_COPY[checkoutState()];
        document.querySelectorAll('[data-state-copy]').forEach((element) => {
            if (element.dataset.defaultCopy === undefined) element.dataset.defaultCopy = element.innerHTML;
            const next = (copy && copy[element.dataset.stateCopy]) ?? element.dataset.defaultCopy;
            if (element.innerHTML !== next) element.innerHTML = next;
        });
    };

    const track = (eventName, extra = {}) => {
        const activeWindow = currentWindow();
        const payload = {
            event: eventName,
            page: 'deposit',
            deposit_amount: config.depositAmount,
            campaign_state: config.campaignState,
            pricing_unlocked: config.pricingUnlocked,
            audience,
            traffic_source: source,
            campaign: query.get('campaign') || query.get('utm_campaign') || '',
            creative: query.get('creative') || query.get('utm_content') || '',
            checkout_state: checkoutState(),
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
        if (activeWindow) {
            target.searchParams.set('price_window', activeWindow.id);
            target.searchParams.set('reward_price', activeWindow.amount);
        }
        return target.toString();
    };

    const updateButtons = () => {
        const stateName = checkoutState();
        const ready = stateName === 'live';
        const actionable = stateName === 'live' || stateName === 'preview';

        reserveButtons.forEach((button) => {
            const disabled = !actionable || state.submitting;
            button.disabled = disabled;
            button.setAttribute('aria-disabled', String(disabled));
            button.innerHTML = state.submitting
                ? stateName === 'preview' ? 'Taking you to the launch list…' : 'Opening secure checkout…'
                : stateName === 'closed'
                    ? 'Reservations are closed'
                    : stateName === 'ended'
                        ? 'Reservation window has ended'
                        : `${ctaLabel(button.dataset.ctaSlot)} <span aria-hidden="true">→</span>`;
        });

        if (!checkoutStatus) return;
        if (checkoutMessage) checkoutMessage.textContent = stateName === 'live'
            ? `Secure checkout — ${config.depositAmount} today, refundable any time.`
            : stateName === 'preview'
                ? '2,000+ people are already on the launch list — we’ll email you at open.'
                : stateName === 'closed'
                ? 'Launch is live. New reservations are no longer accepted; existing customers should check their email for the order link.'
                : 'This reservation window has ended.';
        // In preview the primary button already goes to the launch list, so the
        // card link would be a second identical ask; keep it as the escape
        // hatch for closed/ended only.
        previewLinks.forEach((link) => {
            link.hidden = stateName === 'preview' || stateName === 'live';
            link.setAttribute('href', withTracking(config.launchListUrl, {
                utm_source: 'deposit-page',
                utm_medium: link.dataset.ctaSlot === 'header' ? 'header' : 'reservation-card',
                utm_campaign: 'deposit_launch_v1',
                utm_content: 'not-ready'
            }));
        });
        secondaryLinks.forEach((link) => {
            link.hidden = stateName === 'preview';
        });
        checkoutStatus.classList.toggle('is-ready', ready);
        checkoutStatus.dataset.checkoutState = stateName;
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
            if (savings) savings.textContent = savingsText(windowConfig);
            if (deadline) deadline.textContent = deadlineText(windowConfig);
            if (urgency) urgency.textContent = urgencyLabel(windowConfig);
            if (delta) delta.textContent = priceDeltaLabel(windowConfig);
            const status = windowStatus(windowConfig);
            card.classList.toggle('is-current', status === 'current');
            card.classList.toggle('is-upcoming', status === 'upcoming');
            card.classList.toggle('is-ended', status === 'ended');
        });
        const activeWindow = currentWindow();
        const reward = activeWindow?.amount || config.priceWindows[0]?.amount || '';
        document.querySelectorAll('[data-current-reward]').forEach((element) => {
            element.textContent = config.pricingUnlocked ? reward : 'Price unlocking soon';
        });
        document.querySelectorAll('[data-deposit-amount]').forEach((element) => {
            element.textContent = config.depositAmount;
        });
        launchListCountNodes.forEach((element) => {
            element.textContent = config.launchListCount;
        });
        const launchWindow = config.priceWindows.find((item) => item.id === 'early') || config.priceWindows[config.priceWindows.length - 1];
        document.querySelectorAll('[data-launch-price]').forEach((element) => {
            element.textContent = priceText(launchWindow || {});
        });
        const remaining = daysLeft(activeWindow);
        document.querySelectorAll('[data-current-deadline]').forEach((element) => {
            element.textContent = deadlineText(activeWindow);
        });
        document.querySelectorAll('[data-countdown-days]').forEach((element) => {
            element.hidden = remaining === null;
            element.textContent = remaining === null ? '' : remaining === 0 ? ' — ends today' : ` — ${remaining} day${remaining === 1 ? '' : 's'} left`;
        });
    };

    const finishImage = document.querySelector('[data-deposit-finish-image]');
    const finishCode = document.querySelector('[data-deposit-finish-code]');
    const finishSizes = '(max-width: 900px) 100vw, 60vw';
    let finishRenderGen = 0;
    let finishRenderPending = false;
    const switchFinishRender = (finish) => {
        if (!finishImage || !finish || !finish.src) return;
        // Dedupe only when idle: with a swap in flight the DOM src is stale, so "last click wins" must run.
        if (!finishRenderPending && finishImage.dataset.finishSrc === finish.src) return;
        const gen = ++finishRenderGen;
        finishRenderPending = true;
        const apply = () => {
            if (gen !== finishRenderGen) return;
            finishImage.classList.add('is-fading');
            window.setTimeout(() => {
                if (gen !== finishRenderGen) { finishImage.classList.remove('is-fading'); return; }
                if (finish.srcset) finishImage.srcset = finish.srcset; else finishImage.removeAttribute('srcset');
                finishImage.sizes = finishSizes;
                finishImage.src = finish.src;
                finishImage.alt = `LunaWake in the ${finish.name} finish`;
                finishImage.dataset.finishSrc = finish.src;
                if (finishCode) finishCode.textContent = finish.code || '';
                finishImage.classList.remove('is-fading');
                finishRenderPending = false;
            }, 180);
        };
        // Preload off-DOM so the swap lands on a decoded frame; a failed load keeps the current render.
        const loader = new Image();
        loader.onload = apply;
        if (finish.srcset) loader.srcset = finish.srcset;
        loader.sizes = finishSizes;
        loader.src = finish.src;
        if (loader.complete) { loader.onload = null; apply(); }
    };

    const updateFinish = (finishId = state.finish) => {
        const selectedFinishId = finishId && config.finishes[finishId] ? finishId : null;
        const finish = selectedFinishId ? config.finishes[selectedFinishId] : null;
        state.finish = finishButtons.length ? selectedFinishId : null;
        finishButtons.forEach((button) => {
            const selected = button.dataset.depositFinish === state.finish;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        if (finish) switchFinishRender(finish);
        if (finishName) finishName.textContent = finish ? `${finish.name} — good eye. ${finish.detail || 'Thanks.'}` : 'No vote yet — pick the one you\'d want on your nightstand.';
    };

    const updateSource = () => {
        if (source) document.body.dataset.trafficSource = source;
        document.body.dataset.trafficAudience = audience;
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
        report.addEventListener('scroll', () => {
            report.classList.toggle('is-scrolled', report.scrollTop > 12);
        }, { passive: true });
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

    const observeReservationCard = () => {
        if (!mobileCta || !('IntersectionObserver' in window)) return;
        // The sticky bar should yield whenever an equivalent action is already
        // on screen — the reservation card, or the final section's own CTA
        // (otherwise two identical amber buttons stack at the page end). The
        // card can exceed 55% of a phone viewport, so the threshold must stay
        // low enough to be reachable on small screens.
        const targets = [reservationCard, document.querySelector('[data-reserve-button][data-cta-slot="final"]')].filter(Boolean);
        if (!targets.length) return;
        const visible = new Set();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            mobileCta.classList.toggle('is-card-visible', visible.size > 0);
        }, { threshold: 0.15 });
        targets.forEach((target) => observer.observe(target));
    };

    // bfcache restore (iOS back button after a CTA navigation): the page
    // comes back with every reserve button disabled mid-"Taking you…".
    // Reset the submitting flag so the primary CTA works again.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && state.submitting) {
            state.submitting = false;
            updateButtons();
        }
    });

    const supportAddress = (url) => {
        const value = String(url || '');
        if (!value.toLowerCase().startsWith('mailto:')) return '';
        return decodeURIComponent(value.slice(7).split('?')[0]);
    };

    const attemptCheckout = (button) => {
        const ctaSlot = button?.dataset.ctaSlot || 'unknown';
        const stateName = checkoutState();
        if (stateName === 'preview') {
            state.submitting = true;
            updateButtons();
            track('deposit_cta_click', {
                destination: 'launch_list',
                checkout_state: stateName,
                cta_slot: ctaSlot,
                reason: 'shopify_product_url_missing'
            });
            window.location.assign(withTracking(config.launchListUrl, {
                utm_source: 'deposit-page',
                utm_medium: 'reservation-cta',
                utm_campaign: 'deposit_launch_v1',
                utm_content: ctaSlot
            }));
            return;
        }
        if (stateName !== 'live') {
            if (checkoutMessage) checkoutMessage.textContent = stateName === 'closed'
                ? 'Reservations are closed. Join the launch list for the next opening.'
                : 'This reservation window has ended. Join the launch list for the next opening.';
            track('deposit_cta_blocked', {
                reason: `checkout_state_${stateName}`,
                checkout_state: stateName,
                cta_slot: ctaSlot
            });
            return;
        }
        state.submitting = true;
        updateButtons();
        track('deposit_cta_click', { destination: 'shopify_checkout', checkout_state: stateName, cta_slot: ctaSlot });
        window.location.assign(withTracking(config.shopifyProductUrl));
    };

    reserveButtons.forEach((button) => button.addEventListener('click', () => attemptCheckout(button)));
    finishButtons.forEach((button) => button.addEventListener('click', () => {
        updateFinish(button.dataset.depositFinish);
        try { window.localStorage.setItem('lunawake-finish-poll', state.finish || ''); } catch (error) { /* local preference is optional */ }
        track('deposit_finish_vote', { finish: state.finish, cta_slot: 'finish_poll' });
    }));
    supportLinks.forEach((link) => link.setAttribute('href', config.supportUrl));
    previewLinks.forEach((link) => link.addEventListener('click', () => track('deposit_waitlist_click', {
        destination: 'launch_list',
        checkout_state: checkoutState(),
        cta_slot: link.dataset.ctaSlot || 'reservation-card'
    })));
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
    document.querySelectorAll('[data-year]').forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });

    updateStateCopy();
    updatePriceCards();
    updateFinish();
    updateSource();
    updateCoachCopy();
    initializeCoachReport();
    updateButtons();
    observeCtaSlots();
    observeReservationCard();
    observeCoachSection();
    track('deposit_cta_view', { cta_slot: 'page' });
})();
