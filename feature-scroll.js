document.addEventListener('DOMContentLoaded', () => {
    // Get all feature panels and nav buttons
    const featurePanels = document.querySelectorAll('.feature-panel');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const featuresSection = document.querySelector('.features');
    
    // Initialize Intersection Observer for the features section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start observing panels when section comes into view
                startObservingPanels();
            } else {
                // Stop observing panels when section is out of view
                stopObservingPanels();
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    // Observe the features section
    sectionObserver.observe(featuresSection);
    
    // Initialize panel observer
    const panelOptions = {
        root: null,
        threshold: 0.7,
        rootMargin: '0px'
    };

    let currentActiveIndex = 0;
    let isScrolling = false;
    let panelObserver = null;

    // Function to start observing panels
    function startObservingPanels() {
        if (panelObserver) return;

        panelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isScrolling) {
                    const index = Array.from(featurePanels).indexOf(entry.target);
                    if (index !== currentActiveIndex) {
                        updateActiveStates(index);
                        currentActiveIndex = index;
                    }
                }
            });
        }, panelOptions);

        // Observe all panels
        featurePanels.forEach(panel => {
            panelObserver.observe(panel);
        });
    }

    // Function to stop observing panels
    function stopObservingPanels() {
        if (panelObserver) {
            panelObserver.disconnect();
            panelObserver = null;
        }
    }

    // Function to update active states
    function updateActiveStates(index) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        featurePanels.forEach(panel => panel.classList.remove('active'));

        tabButtons[index].classList.add('active');
        featurePanels[index].classList.add('active');
    }

    // Handle manual tab clicks
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            isScrolling = true;
            updateActiveStates(index);
            featurePanels[index].scrollIntoView({ behavior: 'smooth' });
            currentActiveIndex = index;

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });
});
