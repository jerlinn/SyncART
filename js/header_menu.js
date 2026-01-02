document.addEventListener('DOMContentLoaded', function() {
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
        const header = document.querySelector('.header');
        header.appendChild(mobileMenu);
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