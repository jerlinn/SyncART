document.addEventListener('DOMContentLoaded', function() {
    // Features Tab 切换处理
    const initFeatureTabs = () => {
        const featureTabBtns = document.querySelectorAll('.feature-nav .tab-btn');
        const featurePanels = document.querySelectorAll('.feature-panel');
        
        if (!featureTabBtns.length || !featurePanels.length) return;

        featureTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有 active 类
                featureTabBtns.forEach(b => b.classList.remove('active'));
                featurePanels.forEach(p => p.classList.remove('active'));

                // 添加 active 类到当前选中的 tab 和对应的 panel
                btn.classList.add('active');
                const targetPanel = document.getElementById(btn.dataset.tab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    };

    // 初始化 Features Tab
    initFeatureTabs();
}); 