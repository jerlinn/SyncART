document.addEventListener('DOMContentLoaded', () => {
    const svgObject = document.querySelector('.quote-svg-overlay');
    
    svgObject.addEventListener('load', () => {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;
        
        const quoteText = svgDoc.getElementById('quote-text');
        const cursor = svgDoc.getElementById('cursor');
        
        if (!quoteText) return;
        
        const text = "Trust the rhythm of your persistence.";
        let isAnimating = false;
        
        // 创建 tspan 元素
        function createTspans() {
            // 清空现有内容
            while (quoteText.firstChild) {
                quoteText.removeChild(quoteText.firstChild);
            }
            
            // 为每个字符创建 tspan
            const tspans = text.split('').map(char => {
                const tspan = svgDoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
                tspan.textContent = char;
                tspan.style.opacity = '0';
                return tspan;
            });
            
            // 添加所有 tspan
            tspans.forEach(tspan => quoteText.appendChild(tspan));
            
            // 添加光标
            const cursorTspan = svgDoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
            cursorTspan.textContent = '●';
            cursorTspan.id = 'cursor';
            cursorTspan.style.opacity = '1';
            quoteText.appendChild(cursorTspan);
            
            return tspans;
        }
        
        // 创建初始 tspan 元素
        const textElements = createTspans();
        
        function animate() {
            if (isAnimating) return;
            isAnimating = true;
            
            // 隐藏所有文字
            textElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.1s';
            });
            
            // 设置光标
            const cursor = svgDoc.getElementById('cursor');
            if (cursor) {
                cursor.style.opacity = '1';
                cursor.style.transition = 'opacity 0.5s';
            }
            
            // 计算延迟时间
            const getDelay = (index, total) => {
                const progress = index / total;
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                return 50 + (1 - ease) * 100;
            };
            
            let currentIndex = 0;
            function showNextChar() {
                if (currentIndex < textElements.length) {
                    const element = textElements[currentIndex];
                    element.style.opacity = '1';
                    
                    const delay = getDelay(currentIndex, textElements.length);
                    currentIndex++;
                    
                    setTimeout(showNextChar, delay);
                } else {
                    if (cursor) {
                        cursor.style.opacity = '0';
                    }
                    
                    // 3秒后重新开始动画
                    setTimeout(() => {
                        isAnimating = false;
                        animate();
                    }, 3000);
                }
            }
            
            showNextChar();
        }
        
        // 使用 Intersection Observer 来控制动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    animate();
                } else if (!entry.isIntersecting) {
                    // 重置动画状态
                    isAnimating = false;
                    textElements.forEach(el => {
                        el.style.opacity = '0';
                    });
                    const cursor = svgDoc.getElementById('cursor');
                    if (cursor) {
                        cursor.style.opacity = '1';
                    }
                }
            });
        }, { threshold: [0, 0.2] });
        
        observer.observe(svgObject);
        
        // 设置日期
        const quoteDate = svgDoc.getElementById('quote-date');
        if (quoteDate) {
            const now = new Date();
            quoteDate.textContent = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    });
});
