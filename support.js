document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion Implementation
    const initFAQAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.toggle');
            
            // Expand the first item by default
            if (index === 0) {
                answer.style.display = 'block';
                toggle.style.transform = 'rotate(180deg)';
                item.classList.add('active');
            } else {
                answer.style.display = 'none';
            }
            
            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                
                // Close all other open FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.toggle');
                        otherAnswer.style.display = 'none';
                        otherToggle.style.transform = 'rotate(0deg)';
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ state
                answer.style.display = isOpen ? 'none' : 'block';
                toggle.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                item.classList.toggle('active');
            });
        });
    };

    // Initialize FAQ accordion functionality
    initFAQAccordion();
}); 