document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navRight = document.querySelector('.nav-right');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const featurePanels = document.querySelectorAll('.feature-panel');

    mobileMenuBtn?.addEventListener('click', () => {
        navRight?.classList.toggle('active');
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn?.contains(e.target) && !navRight?.contains(e.target)) {
            navRight?.classList.remove('active');
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active类
            tabBtns.forEach(b => b.classList.remove('active'));
            featurePanels.forEach(p => p.classList.remove('active'));

            // 添加active类到当前选中的tab
            btn.classList.add('active');
            const targetPanel = document.getElementById(btn.dataset.tab);
            targetPanel.classList.add('active');
        });
    });

    // Feature tabs 处理
    const featureTabBtns = document.querySelectorAll('.feature-nav .tab-btn');
    const featureFeaturePanels = document.querySelectorAll('.feature-panel');

    featureTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active类
            featureTabBtns.forEach(b => b.classList.remove('active'));
            featureFeaturePanels.forEach(p => p.classList.remove('active'));

            // 添加active类到当前选中的tab和panel
            btn.classList.add('active');
            const targetPanel = document.getElementById(btn.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}); 