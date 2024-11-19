document.addEventListener('DOMContentLoaded', function() {
    // FAQ 手风琴效果
    const initFAQAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.toggle');
            
            // 默认展开第一条
            if (index === 0) {
                answer.style.display = 'block';
                toggle.style.transform = 'rotate(180deg)';
                item.classList.add('active');
            } else {
                answer.style.display = 'none';
            }
            
            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                
                // 关闭所有其他打开的FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.toggle');
                        otherAnswer.style.display = 'none';
                        otherToggle.style.transform = 'rotate(0deg)';
                        otherItem.classList.remove('active');
                    }
                });
                
                // 切换当前FAQ的状态
                answer.style.display = isOpen ? 'none' : 'block';
                toggle.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                item.classList.toggle('active');
            });
        });
    };

    // 初始化FAQ手风琴效果
    initFAQAccordion();
}); 