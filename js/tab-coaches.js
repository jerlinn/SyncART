document.addEventListener('DOMContentLoaded', function() {
    const profileBtns = document.querySelectorAll('.profile-selector .profile-btn');
    const tabContents = document.querySelectorAll('.profile-selector .tab-content');
    const demoContents = document.querySelectorAll('.demo-content');

    function switchTab(tabId) {
        // Remove active class from all buttons and contents
        profileBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.blur(); // Remove focus outline
        });
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Hide all demo contents and show the selected one
        demoContents.forEach(content => {
            if (content.getAttribute('data-tab') === tabId) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        // Add active class to selected button and content
        const selectedBtn = document.querySelector(`.profile-btn[data-tab="${tabId}"]`);
        const selectedContent = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
        
        if (selectedBtn && selectedContent) {
            selectedBtn.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    // Add click event listeners to all profile buttons
    profileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});
