(() => {
    const header = document.querySelector('[data-header]');
    const menu = document.querySelector('.lw2-menu');
    const mobile = document.querySelector('#lw2-mobile-menu');

    const setMenu = (open) => {
        if (!menu || !mobile) return;
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        mobile.hidden = !open;
    };

    menu?.addEventListener('click', () => {
        setMenu(menu.getAttribute('aria-expanded') !== 'true');
    });
    mobile?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 16), { passive: true });
})();
