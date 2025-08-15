// 区域1：The 4 Pillars of Intelligent Daily Living
const featurePanels1 = document.querySelectorAll('.feature-panel-1');
const tabButtons1 = document.querySelectorAll('.tab-btn-1');
let currentActiveIndex1 = 0;
let autoSwitchInterval1 = null;
let isPaused1 = false;

// 区域1参数设置
const SWITCH_INTERVAL_1 = 2600; // 展示时间
const FADE_DURATION_1 = 400;    // 动画时间

// 区域1：更新激活状态
function updateActiveStates1(index) {
    tabButtons1.forEach(btn => btn.classList.remove('active'));
    tabButtons1[index].classList.add('active');
    
    featurePanels1.forEach((panel, i) => {
        if (panel.classList.contains('active')) {
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.classList.remove('active');
                panel.style.position = 'absolute';
                
                featurePanels1[index].style.position = 'relative';
                featurePanels1[index].classList.add('active');
                requestAnimationFrame(() => {
                    featurePanels1[index].style.opacity = '1';
                });
            }, FADE_DURATION_1);
        }
    });
}

// 区域1：切换到下一张
function switchToNextPanel1() {
    if (isPaused1) return;
    
    let nextIndex = (currentActiveIndex1 + 1) % featurePanels1.length;
    updateActiveStates1(nextIndex);
    currentActiveIndex1 = nextIndex;
}

// 区域1：启动自动切换
function startAutoSwitch1() {
    if (autoSwitchInterval1) clearInterval(autoSwitchInterval1);
    autoSwitchInterval1 = setInterval(switchToNextPanel1, SWITCH_INTERVAL_1);
}

// 区域1：手动点击事件
tabButtons1.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateActiveStates1(index);
        currentActiveIndex1 = index;
        startAutoSwitch1();
    });
});

// 区域1：鼠标悬停暂停
featurePanels1.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
        isPaused1 = true;
    });
    
    panel.addEventListener('mouseleave', () => {
        isPaused1 = false;
    });
});

// 区域1：初始化
featurePanels1.forEach((panel, i) => {
    if (i === 0) {
        panel.style.position = 'relative';
        panel.style.opacity = '1';
        panel.classList.add('active');
    } else {
        panel.style.position = 'absolute';
        panel.style.opacity = '0';
    }
});
startAutoSwitch1();


// 区域2：Intelligent Mood Soundscapes
const featurePanels2 = document.querySelectorAll('.feature-panel-2');
const tabButtons2 = document.querySelectorAll('.tab-btn-2');
let currentActiveIndex2 = 0;
let autoSwitchInterval2 = null;
let isPaused2 = false;

// 区域2参数设置（可独立调整）
const SWITCH_INTERVAL_2 = 2600; // 展示时间
const FADE_DURATION_2 = 400;    // 动画时间

// 区域2：更新激活状态
function updateActiveStates2(index) {
    tabButtons2.forEach(btn => btn.classList.remove('active'));
    tabButtons2[index].classList.add('active');
    
    featurePanels2.forEach((panel, i) => {
        if (panel.classList.contains('active')) {
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.classList.remove('active');
                panel.style.position = 'absolute';
                
                featurePanels2[index].style.position = 'relative';
                featurePanels2[index].classList.add('active');
                requestAnimationFrame(() => {
                    featurePanels2[index].style.opacity = '1';
                });
            }, FADE_DURATION_2);
        }
    });
}

// 区域2：切换到下一张
function switchToNextPanel2() {
    if (isPaused2) return;
    
    let nextIndex = (currentActiveIndex2 + 1) % featurePanels2.length;
    updateActiveStates2(nextIndex);
    currentActiveIndex2 = nextIndex;
}

// 区域2：启动自动切换
function startAutoSwitch2() {
    if (autoSwitchInterval2) clearInterval(autoSwitchInterval2);
    autoSwitchInterval2 = setInterval(switchToNextPanel2, SWITCH_INTERVAL_2);
}

// 区域2：手动点击事件
tabButtons2.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateActiveStates2(index);
        currentActiveIndex2 = index;
        startAutoSwitch2();
    });
});

// 区域2：鼠标悬停暂停
featurePanels2.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
        isPaused2 = true;
    });
    
    panel.addEventListener('mouseleave', () => {
        isPaused2 = false;
    });
});

// 区域2：初始化
featurePanels2.forEach((panel, i) => {
    if (i === 0) {
        panel.style.position = 'relative';
        panel.style.opacity = '1';
        panel.classList.add('active');
    } else {
        panel.style.position = 'absolute';
        panel.style.opacity = '0';
    }
});
startAutoSwitch2();


// 添加样式（区分两个区域的动画）
const style = document.createElement('style');
style.textContent = `
    .feature-content {
        position: relative;
        margin-top: 40px;
        margin-bottom: 40px;
        min-height: 400px;
    }
    
    /* 区域1样式 */
    .feature-panel-1 {
        opacity: 0;
        transition: opacity ${FADE_DURATION_1}ms ease;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .feature-panel-1.active {
        opacity: 1;
    }
    
    /* 区域2样式 */
    .feature-panel-2 {
        opacity: 0;
        transition: opacity ${FADE_DURATION_2}ms ease;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .feature-panel-2.active {
        opacity: 1;
    }
    
    .feature-panel img {
        width: 100%;
        height: auto;
        display: block;
    }
`;
document.head.appendChild(style);
