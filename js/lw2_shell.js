(() => {
    const header = document.querySelector('[data-header]');
    const menu = document.querySelector('[data-menu-toggle]');
    const mobile = document.querySelector('#lw2-mobile-menu');
    if (!header || !menu || !mobile) return;

    let lastFocusedElement = menu;

    const setMenu = (open, { restoreFocus = false } = {}) => {
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        const menuLabel = menu.querySelector('.lw2-menu-label');
        if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
        header.classList.toggle('is-menu-open', open);
        mobile.hidden = !open;
        document.body.classList.toggle('lw2-menu-open', open);

        if (open) {
            lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : menu;
            mobile.querySelector('a')?.focus({ preventScroll: true });
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

    const updateHeaderState = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
})();
