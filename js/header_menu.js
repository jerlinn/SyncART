document.addEventListener('DOMContentLoaded', function() {
    // Header glass appears only after scrolling
    const header = document.querySelector('.header');
    const SCROLL_THRESHOLD = 24;
    const getScrollY = () => {
        return (
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
        );
    };
    const syncHeaderScrollState = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', getScrollY() > SCROLL_THRESHOLD);
    };
    // Initial + restore checks (Safari/iOS may restore scroll after DOMContentLoaded)
    syncHeaderScrollState();
    window.requestAnimationFrame(syncHeaderScrollState);
    window.addEventListener('load', syncHeaderScrollState);
    window.addEventListener('pageshow', syncHeaderScrollState);
    window.addEventListener('resize', syncHeaderScrollState);
    // Passive listener where supported (fallback for older browsers)
    try {
        window.addEventListener('scroll', syncHeaderScrollState, { passive: true });
    } catch (e) {
        window.addEventListener('scroll', syncHeaderScrollState);
    }

    // iOS/Safari: sometimes scroll events are dispatched on document/visualViewport
    try {
        document.addEventListener('scroll', syncHeaderScrollState, { passive: true, capture: true });
    } catch (e) {
        document.addEventListener('scroll', syncHeaderScrollState, true);
    }

    if (window.visualViewport) {
        try {
            window.visualViewport.addEventListener('scroll', syncHeaderScrollState, { passive: true });
        } catch (e) {
            window.visualViewport.addEventListener('scroll', syncHeaderScrollState);
        }
    }

    // Touch scroll fallback (older iOS)
    document.addEventListener('touchmove', syncHeaderScrollState, { passive: true });

    // iOS/mobile reliability: IntersectionObserver sentinel (more robust than scroll events)
    // Adds glass once we've scrolled past SCROLL_THRESHOLD.
    try {
        if (header && 'IntersectionObserver' in window) {
            const sentinel = document.createElement('div');
            sentinel.setAttribute('aria-hidden', 'true');
            sentinel.style.position = 'absolute';
            sentinel.style.top = '0';
            sentinel.style.left = '0';
            sentinel.style.width = '1px';
            sentinel.style.height = '1px';
            sentinel.style.pointerEvents = 'none';
            document.body.prepend(sentinel);

            const io = new IntersectionObserver(
                (entries) => {
                    const entry = entries && entries[0];
                    if (!entry) return;
                    header.classList.toggle('is-scrolled', !entry.isIntersecting);
                },
                {
                    root: null,
                    threshold: 0,
                    rootMargin: `-${SCROLL_THRESHOLD}px 0px 0px 0px`,
                }
            );

            io.observe(sentinel);
        }
    } catch (e) {
        // fall back to scroll listeners
    }

    // 移动端菜单处理
    const initMobileMenu = () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        
        if (!mobileMenuBtn || !navCenter || !navRight) return;

        // 创建移动端菜单容器
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';

        // Backdrop for desktop + mobile (drawer style)
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        
        // 复制导航链接到移动端菜单
        const centerLinks = Array.from(navCenter.querySelectorAll('a')).map(link => link.cloneNode(true));
        const rightLinks = Array.from(navRight.querySelectorAll('a')).map(link => link.cloneNode(true));
        
        // 将所有链接添加到移动端菜单
        [...centerLinks, ...rightLinks].forEach(link => {
            mobileMenu.appendChild(link);
        });
        
        // 将移动端菜单添加到 header
        const headerEl = document.querySelector('.header');
        if (!headerEl) return;
        headerEl.appendChild(mobileMenu);
        document.body.appendChild(backdrop);

        const openMenu = () => {
            mobileMenu.classList.add('active');
            backdrop.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.classList.add('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            backdrop.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        };

        // 添加点击事件处理
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) closeMenu();
            else openMenu();
        });

        // 点击页面其他地方关闭菜单
        backdrop.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Clicking a link closes the menu
        mobileMenu.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.tagName === 'A') closeMenu();
        });

        // A11y attributes
        mobileMenuBtn.setAttribute('aria-label', 'Menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    // 初始化移动端菜单
    initMobileMenu();

    // 其他现有的初始化代码...
    const tabBtns = document.querySelectorAll('.tab-btn');
    const featurePanels = document.querySelectorAll('.feature-panel');
    
    // ... 保持其他代码不变 ...
}); 