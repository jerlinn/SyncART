(() => {
    // Keep the reservation CTA consistent across the static site while the
    // launch-list link remains available as a secondary path in notices,
    // inline links, and footer navigation.
    document.querySelectorAll('a[href="https://prelaunch.lunawake.ai/"]').forEach((link) => {
        if (!link.matches('.lw2-nav-cta, .lw2-mobile-cta, .lw2-button')) return;
        link.href = 'deposit.html';
        const navLabel = link.querySelector('.lw2-nav-cta-label');
        if (navLabel) {
            navLabel.textContent = 'Reserve yours';
            return;
        }
        Array.from(link.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.textContent = 'Reserve yours ';
        });
    });

    const header = document.querySelector('[data-header]');
    const menu = document.querySelector('[data-menu-toggle]');
    const mobile = document.querySelector('#lw2-mobile-menu');
    if (!header || !menu || !mobile) return;

    let lastFocusedElement = menu;

    // The panel keeps [hidden] for assistive tech but only takes it back once
    // the exit transition has run, so opening and closing stay interruptible:
    // re-opening mid-exit re-targets from the panel's current opacity.
    let panelHideTimer = 0;
    let panelOpenFrame = 0;
    const setPanelVisible = (visible) => {
        window.clearTimeout(panelHideTimer);
        window.cancelAnimationFrame(panelOpenFrame);
        if (visible) {
            mobile.hidden = false;
            panelOpenFrame = window.requestAnimationFrame(() => {
                panelOpenFrame = 0;
                if (!mobile.hidden) mobile.classList.add('is-open');
            });
            return;
        }
        panelOpenFrame = 0;
        mobile.classList.remove('is-open');
        const exitMs = (parseFloat(window.getComputedStyle(mobile).transitionDuration) || 0) * 1000;
        panelHideTimer = window.setTimeout(() => {
            if (!mobile.classList.contains('is-open')) mobile.hidden = true;
        }, exitMs);
    };

    const setMenu = (open, { restoreFocus = false } = {}) => {
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        const menuLabel = menu.querySelector('.lw2-menu-label');
        if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
        header.classList.toggle('is-menu-open', open);
        document.body.classList.toggle('lw2-menu-open', open);
        setPanelVisible(open);

        if (open) {
            lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : menu;
        } else if (restoreFocus) {
            lastFocusedElement?.focus?.({ preventScroll: true });
        }
    };

    menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        setMenu(open, { restoreFocus: !open });
    });
    mobile.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
            setMenu(false, { restoreFocus: true });
        }
    });
    document.addEventListener('click', (event) => {
        if (menu.getAttribute('aria-expanded') !== 'true' || header.contains(event.target)) return;
        setMenu(false);
    });

    // Asymmetric thresholds: a single 16px trip point flickers the whole header
    // material when the user rests near it. Enter high, leave low.
    const SCROLLED_ENTER = 24;
    const SCROLLED_EXIT = 6;
    let isScrolled = false;
    let scrollTicking = false;

    const updateHeaderState = () => {
        const next = isScrolled ? window.scrollY > SCROLLED_EXIT : window.scrollY > SCROLLED_ENTER;
        if (next === isScrolled) return;
        isScrolled = next;
        header.classList.toggle('is-scrolled', next);
    };

    updateHeaderState();
    window.addEventListener('scroll', () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            scrollTicking = false;
            updateHeaderState();
        });
    }, { passive: true });
})();
