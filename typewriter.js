document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.querySelector('.quote-text');
    const textSpan = quoteText.querySelector('.text');
    const cursor = quoteText.querySelector('.cursor');
    const fullText = textSpan.textContent;
    let isAnimating = false;
    let currentLength = 0;
    let targetLength = 0;
    let typewriterTimeout = null;
    
    // Clear the text content but keep the element
    textSpan.textContent = '';
    cursor.style.display = 'inline';
    
    // Initialize Intersection Observer for the quote text
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const visibleRatio = entry.intersectionRatio;
                const newTargetLength = Math.floor(fullText.length * visibleRatio);
                
                // Update target length and continue animation if needed
                if (newTargetLength > targetLength) {
                    targetLength = newTargetLength;
                    if (!isAnimating) {
                        startTypewriter();
                    }
                }
                
                // Hide cursor when text is fully visible
                if (visibleRatio >= 0.99 && currentLength >= fullText.length) {
                    setTimeout(() => {
                        cursor.style.display = 'none';
                    }, 500);
                }
            } else {
                resetTypewriter();
            }
        });
    }, {
        threshold: Array.from({ length: 20 }, (_, i) => i / 19) // Reduced number of thresholds
    });

    // Start observing the quote text
    observer.observe(quoteText);

    function getTypingDelay() {
        // Slower base delays
        const minDelay = 60;  
        const maxDelay = 150; 
        
        // Calculate progress
        const progress = currentLength / targetLength;
        
        // Modified acceleration curve for smoother speed changes
        const speedFactor = Math.sin(progress * Math.PI) * 0.6 + 0.4; 
        
        // Add slight randomness (±10ms)
        const randomness = Math.random() * 20 - 10;
        
        // Calculate final delay with more emphasis on slower speeds
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
                textSpan.textContent = fullText.slice(0, currentLength);
                
                const delay = getTypingDelay();
                typewriterTimeout = setTimeout(typeNextChar, delay);
            } else {
                isAnimating = false;
                
                if (currentLength >= fullText.length) {
                    setTimeout(() => {
                        cursor.style.display = 'none';
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
        textSpan.textContent = '';
        cursor.style.display = 'inline';
    }
});
