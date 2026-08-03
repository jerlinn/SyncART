(() => {
    'use strict';

    // Single offer data source for the reservation page. Replace the guarded
    // values with confirmed Shopify URLs before enabling live payments.
    const offer = {
        pricingUnlocked: true,
        unlockLabel: 'Pricing unlocks Aug 15',
        depositAmount: '$9',
        creditAmount: 'Launch price',
        creditName: 'Kickstarter launch price',
        creditBonus: 'Private Kickstarter offer',
        productPriceStatus: 'Final Kickstarter reward price is configured on the campaign page.',
        refundPolicy: 'Refundable before Kickstarter launch; non-refundable after launch.',
        finishes: {
            amber: { label: 'Amber', image: 'images/luna-latest/finish-amber-1440.webp' },
            stone: { label: 'Stone', image: 'images/luna-latest/finish-stone-1440.webp' },
            charcoal: { label: 'Charcoal', image: 'images/luna-latest/finish-charcoal-1440.webp' }
        },
        variants: {
            amber: { finish: 'amber', available: false, checkoutUrl: '' },
            stone: { finish: 'stone', available: false, checkoutUrl: '' },
            charcoal: { finish: 'charcoal', available: false, checkoutUrl: '' }
        }
    };

    const state = { finish: 'amber', submitting: false };
    const finishButtons = Array.from(document.querySelectorAll('[data-finish]'));
    const reserveButton = document.querySelector('[data-reserve-button]');
    const image = document.querySelector('[data-finish-image]');
    const summaryName = document.querySelector('[data-summary-name]');
    const checkoutStatus = document.querySelector('[data-checkout-status]');
    const creditFlow = document.querySelector('[data-credit-flow]');
    const priceLock = document.querySelector('[data-price-lock]');
    const priceLive = document.querySelector('[data-price-live]');
    const lockStatus = document.querySelector('[data-lock-status]');

    const getFinish = () => offer.finishes[state.finish];
    const getVariant = () => offer.variants[state.finish];
    const hasCheckout = (variant) => Boolean(variant?.available && variant.checkoutUrl);
    const setAllText = (selector, value) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value;
        });
    };

    const update = () => {
        const variant = getVariant();
        const finish = getFinish();
        const connected = offer.pricingUnlocked && hasCheckout(variant);

        if (priceLock) priceLock.hidden = offer.pricingUnlocked;
        if (priceLive) priceLive.hidden = !offer.pricingUnlocked;
        if (lockStatus) lockStatus.textContent = offer.pricingUnlocked
            ? 'Reservations are open.'
            : `${offer.unlockLabel}. Reservations are not open yet.`;

        finishButtons.forEach((button) => {
            const active = button.dataset.finish === state.finish;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        if (image) {
            image.src = offer.pricingUnlocked ? finish.image : 'images/luna-latest/luna-banner-1440.webp';
            image.alt = offer.pricingUnlocked ? `LunaWake in the ${finish.label} finish` : 'LunaWake product preview';
        }
        if (summaryName) summaryName.textContent = offer.pricingUnlocked ? finish.label : 'LunaWake';
        setAllText('[data-deposit-amount]', offer.depositAmount);
        setAllText('[data-credit-amount]', offer.creditAmount);
        setAllText('[data-credit-bonus]', offer.creditBonus);
        setAllText('[data-product-price-status]', offer.productPriceStatus);
        setAllText('[data-refund-policy]', offer.refundPolicy);
        creditFlow?.setAttribute('aria-label', offer.pricingUnlocked
            ? `Pay ${offer.depositAmount} today and receive the ${offer.creditName}.`
            : 'Reservation pricing is not available yet.');
        if (reserveButton) {
            reserveButton.disabled = !connected || state.submitting;
            reserveButton.setAttribute('aria-disabled', String(!connected || state.submitting));
            reserveButton.innerHTML = state.submitting
                ? 'Opening Shopify Checkout…'
                : offer.pricingUnlocked
                    ? `Reserve for ${offer.depositAmount} <span aria-hidden="true">→</span>`
                    : 'Reservations open after pricing unlock';
        }
        if (checkoutStatus) {
            checkoutStatus.textContent = connected
                ? 'You will continue to secure Shopify Checkout.'
                : offer.pricingUnlocked
                    ? 'Reservations are not open for Checkout yet.'
                    : `${offer.unlockLabel}.`;
            checkoutStatus.classList.toggle('is-ready', connected);
        }
    };

    const attemptCheckout = () => {
        const variant = getVariant();
        if (!hasCheckout(variant)) {
            if (checkoutStatus) checkoutStatus.textContent = 'Shopify Checkout is not connected for this finish yet.';
            return;
        }
        state.submitting = true;
        update();
        window.location.assign(variant.checkoutUrl);
    };

    finishButtons.forEach((button) => button.addEventListener('click', () => {
        state.finish = button.dataset.finish;
        update();
    }));
    reserveButton?.addEventListener('click', attemptCheckout);

    update();
})();
