// One Page Layout Final Fixes
document.addEventListener('DOMContentLoaded', function() {
    
    // Fix for section visibility and proper scrolling
    function fixSectionHeights() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            // Ensure each section has proper ID
            if (!section.id) {
                console.warn('Section without ID found:', section);
                return;
            }
            
            // Add proper scroll margin for fixed navbar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            section.style.scrollMarginTop = `${navbarHeight + 20}px`;
        });
    }

    // Initialize section fixes
    fixSectionHeights();

    // Re-fix on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(fixSectionHeights, 250);
    });

    // Ensure smooth scrolling works in all browsers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading state removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Fix for mobile menu closing on link click
    const mobileNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                if (navbarToggler) {
                    navbarToggler.click();
                }
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });

    // Print-friendly adjustments
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
});
