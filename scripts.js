document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单处理
    const initMobileMenu = () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navRight = document.querySelector('.nav-right');
        
        if (!mobileMenuBtn || !navRight) return;

        // 清除可能存在的旧事件监听器
        const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
        
        // 添加新的事件监听器
        newMobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            navRight.classList.toggle('active');
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!newMobileMenuBtn.contains(e.target) && !navRight.contains(e.target)) {
                navRight.classList.remove('active');
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