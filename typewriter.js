document.addEventListener('DOMContentLoaded', () => {
    // Wait for SVG to load
    const svgObject = document.querySelector('.quote-svg-overlay');
    
    svgObject.addEventListener('load', () => {
        const svgDoc = svgObject.contentDocument;
        if (!svgDoc) return;
        
        const quoteDate = svgDoc.getElementById('quote-date');
        const quoteText = svgDoc.getElementById('quote-text');
        const cursor = svgDoc.getElementById('cursor');
        
        if (!quoteText || !cursor) return;
        
        const fullText = "   Trust the rhythm of your persistence. Today rewards those who iterate.";
        let isAnimating = false;
        let currentLength = 0;
        let targetLength = 0;
        let typewriterTimeout = null;
        
        // Clear the text content
        quoteText.textContent = '';
        cursor.style.opacity = '1';
        
        // Initialize Intersection Observer for the SVG object
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleRatio = entry.intersectionRatio;
                    
                    // Start animation when element is at least 20% visible
                    if (visibleRatio > 0.2 && currentLength === 0) {
                        targetLength = fullText.length;
                        if (!isAnimating) {
                            startTypewriter();
                        }
                    }
                    
                    // Hide cursor when text is fully visible
                    if (visibleRatio >= 0.95 && currentLength >= fullText.length) {
                        setTimeout(() => {
                            cursor.style.opacity = '0';
                        }, 500);
                    }
                } else {
                    // Only reset if element is completely out of view
                    if (entry.intersectionRatio === 0) {
                        resetTypewriter();
                    }
                }
            });
        }, {
            threshold: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1.0]
        });
        
        // Start observing the SVG object
        observer.observe(svgObject);
        
        function getTypingDelay() {
            // Base delays adjusted for smoother animation
            const minDelay = 40;
            const maxDelay = 120;
            
            // Calculate progress
            const progress = currentLength / fullText.length;
            
            // Smooth easing function
            const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const speedFactor = ease(progress);
            
            // Add slight randomness (±5ms)
            const randomness = Math.random() * 10 - 5;
            
            // Calculate final delay
            return Math.max(minDelay, maxDelay - (speedFactor * (maxDelay - minDelay)) + randomness);
        }
        
        function startTypewriter() {
            if (currentLength >= targetLength) {
                isAnimating = false;
                return;
            }
            
            isAnimating = true;
            
            function typeNextChar() {
                if (!isAnimating) return;
                
                if (currentLength < targetLength) {
                    currentLength++;
                    quoteText.textContent = fullText.slice(0, currentLength);
                    
                    const delay = getTypingDelay();
                    typewriterTimeout = setTimeout(typeNextChar, delay);
                } else {
                    isAnimating = false;
                    
                    if (currentLength >= fullText.length) {
                        setTimeout(() => {
                            cursor.style.opacity = '0';
                        }, 500);
                    }
                }
            }
            
            if (typewriterTimeout) {
                clearTimeout(typewriterTimeout);
            }
            
            typeNextChar();
        }
        
        function resetTypewriter() {
            if (typewriterTimeout) {
                clearTimeout(typewriterTimeout);
            }
            isAnimating = false;
            currentLength = 0;
            targetLength = 0;
            quoteText.textContent = '';
            cursor.style.opacity = '1';
        }
        
        // Set initial date
        if (quoteDate) {
            const now = new Date();
            quoteDate.textContent = now.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
            });
        }
    });
});
