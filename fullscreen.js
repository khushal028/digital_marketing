// Fullscreen Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Fullscreen API helper functions
    const fullscreenAPI = {
        enter: function(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) { /* Safari */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE11 */
                element.msRequestFullscreen();
            }
        },
        exit: function() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        },
        isFullscreen: function() {
            return !!(document.fullscreenElement || 
                     document.webkitFullscreenElement || 
                     document.msFullscreenElement);
        },
        getElement: function() {
            return document.fullscreenElement || 
                   document.webkitFullscreenElement || 
                   document.msFullscreenElement;
        }
    };

    // Update fullscreen button icon
    function updateFullscreenButton() {
        const isFullscreen = fullscreenAPI.isFullscreen();
        const fullscreenButtons = document.querySelectorAll('.fullscreen-toggle i');
        
        fullscreenButtons.forEach(icon => {
            if (isFullscreen) {
                icon.classList.remove('bi-arrows-fullscreen');
                icon.classList.add('bi-arrows-angle-contract');
            } else {
                icon.classList.remove('bi-arrows-angle-contract');
                icon.classList.add('bi-arrows-fullscreen');
            }
        });

        // Update button titles
        const fullscreenToggles = document.querySelectorAll('.fullscreen-toggle');
        fullscreenToggles.forEach(button => {
            button.title = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
        });

        // Add fullscreen class to body for styling
        if (isFullscreen) {
            document.body.classList.add('fullscreen-mode');
        } else {
            document.body.classList.remove('fullscreen-mode');
        }
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        if (fullscreenAPI.isFullscreen()) {
            fullscreenAPI.exit();
        } else {
            fullscreenAPI.enter(document.documentElement);
        }
    }

    // Add event listeners to fullscreen buttons
    const fullscreenButtons = document.querySelectorAll('#fullscreenToggle, #fullscreenToggleMobile');
    fullscreenButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFullscreen();
        });
    });

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('msfullscreenchange', updateFullscreenButton);

    // Keyboard shortcut (F11)
    document.addEventListener('keydown', function(e) {
        // F11 key
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        // Escape key to exit fullscreen
        if (e.key === 'Escape' && fullscreenAPI.isFullscreen()) {
            fullscreenAPI.exit();
        }
    });

    // Initialize button state
    updateFullscreenButton();

    // Handle fullscreen errors gracefully
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('fullscreen')) {
            console.warn('Fullscreen API error:', e.message);
        }
    });

    // Auto-hide cursor in fullscreen after inactivity
    let cursorTimer;
    function hideCursor() {
        document.body.style.cursor = 'none';
    }
    
    function showCursor() {
        document.body.style.cursor = 'auto';
        if (cursorTimer) {
            clearTimeout(cursorTimer);
        }
        if (fullscreenAPI.isFullscreen()) {
            cursorTimer = setTimeout(hideCursor, 3000);
        }
    }

    // Mouse movement events for cursor auto-hide
    document.addEventListener('mousemove', showCursor);
    document.addEventListener('mousedown', showCursor);
    document.addEventListener('keydown', showCursor);

    // Listen for fullscreen changes to manage cursor
    const fullscreenChangeHandler = function() {
        if (fullscreenAPI.isFullscreen()) {
            showCursor(); // Start cursor auto-hide in fullscreen
        } else {
            showCursor(); // Show cursor when exiting fullscreen
            if (cursorTimer) {
                clearTimeout(cursorTimer);
            }
        }
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('msfullscreenchange', fullscreenChangeHandler);

    // Add visual feedback for fullscreen toggle
    fullscreenButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});
