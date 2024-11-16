document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navRight = document.querySelector('.nav-right');

    mobileMenuBtn?.addEventListener('click', () => {
        navRight?.classList.toggle('active');
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn?.contains(e.target) && !navRight?.contains(e.target)) {
            navRight?.classList.remove('active');
        }
    });
}); 