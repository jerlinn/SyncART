document.addEventListener('DOMContentLoaded', () => {
    // Get all feature panels and nav buttons
    const featurePanels = document.querySelectorAll('.feature-panel');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const featuresSection = document.querySelector('.features');
    
    let currentActiveIndex = 0;
    let autoSwitchInterval = null;
    let isPaused = false;

    // Function to update active states with fade effect
    function updateActiveStates(index) {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabButtons[index].classList.add('active');
        
        // Handle panel transition
        featurePanels.forEach((panel, i) => {
            if (panel.classList.contains('active')) {
                // Fade out current panel
                panel.style.opacity = '0';
                setTimeout(() => {
                    panel.classList.remove('active');
                    panel.style.position = 'absolute';
                    
                    // Fade in new panel
                    featurePanels[index].style.position = 'relative';
                    featurePanels[index].classList.add('active');
                    requestAnimationFrame(() => {
                        featurePanels[index].style.opacity = '1';
                    });
                }, 400); // Match fade-out duration
            }
        });
    }

    // Function to switch to next panel
    function switchToNextPanel() {
        if (isPaused) return;
        
        let nextIndex = (currentActiveIndex + 1) % featurePanels.length;
        updateActiveStates(nextIndex);
        currentActiveIndex = nextIndex;
    }

    // Start auto-switching
    function startAutoSwitch() {
        if (autoSwitchInterval) clearInterval(autoSwitchInterval);
        autoSwitchInterval = setInterval(switchToNextPanel, 3000);
    }

    // Handle manual tab clicks
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            updateActiveStates(index);
            currentActiveIndex = index;
            // Reset interval after manual click
            startAutoSwitch();
        });
    });

    // Pause on hover
    featurePanels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        panel.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    });

    // Initialize
    featurePanels.forEach((panel, i) => {
        if (i === 0) {
            panel.style.position = 'relative';
            panel.style.opacity = '1';
            panel.classList.add('active');
        } else {
            panel.style.position = 'absolute';
            panel.style.opacity = '0';
        }
    });
    startAutoSwitch();

    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        .feature-content {
            position: relative;
            margin-top: 40px;
            margin-bottom: 40px;
            min-height: 400px;
        }
        .feature-panel {
            opacity: 0;
            transition: opacity 400ms ease;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .feature-panel.active {
            opacity: 1;
        }
        .feature-panel img {
            width: 100%;
            height: auto;
            display: block;
        }
    `;
    document.head.appendChild(style);
});
