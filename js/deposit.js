(() => {
    'use strict';

    // Single offer data source for the reservation page. Replace the guarded
    // values with confirmed Shopify URLs before enabling live payments.
    const offer = {
        depositAmount: '$10',
        creditAmount: '$50',
        creditName: 'VIP Launch Credit',
        creditBonus: '+$40 early-access bonus',
        productPriceStatus: 'Final product price announced at launch.',
        refundPolicy: 'Fully refundable before final order; refund cancels the $50 credit.',
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
        const connected = hasCheckout(variant);

        finishButtons.forEach((button) => {
            const active = button.dataset.finish === state.finish;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        if (image) {
            image.src = finish.image;
            image.alt = `LunaWake in the ${finish.label} finish`;
        }
        if (summaryName) summaryName.textContent = finish.label;
        setAllText('[data-deposit-amount]', offer.depositAmount);
        setAllText('[data-credit-amount]', offer.creditAmount);
        setAllText('[data-credit-bonus]', offer.creditBonus);
        setAllText('[data-product-price-status]', offer.productPriceStatus);
        setAllText('[data-refund-policy]', offer.refundPolicy);
        creditFlow?.setAttribute('aria-label', `Pay ${offer.depositAmount} today. Receive ${offer.creditAmount} ${offer.creditName} at final purchase, including a $40 early-access bonus.`);
        if (reserveButton) {
            reserveButton.disabled = !connected || state.submitting;
            reserveButton.setAttribute('aria-disabled', String(!connected || state.submitting));
            reserveButton.innerHTML = state.submitting
                ? 'Opening Shopify Checkout…'
                : `Unlock ${offer.creditAmount} VIP Credit for ${offer.depositAmount} <span aria-hidden="true">→</span>`;
        }
        if (checkoutStatus) {
            checkoutStatus.textContent = connected
                ? 'You will continue to secure Shopify Checkout.'
                : 'This finish is not open for Checkout yet.';
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
