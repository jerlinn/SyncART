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

        // 添加点击事件处理
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    };

    // 初始化移动端菜单
    initMobileMenu();

    // 其他现有的初始化代码...
    const tabBtns = document.querySelectorAll('.tab-btn');
    const featurePanels = document.querySelectorAll('.feature-panel');
    
    // ... 保持其他代码不变 ...
}); 