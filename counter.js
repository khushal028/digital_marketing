// Animated Counter
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    let counted = false;

    const startCounting = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Check if stats section is in viewport
    const checkViewport = () => {
        const statsSection = document.querySelector('.stats');
        const rect = statsSection.getBoundingClientRect();
        const isInViewport = (
            rect.top <= window.innerHeight &&
            rect.bottom >= 0
        );

        if (isInViewport && !counted) {
            startCounting();
            counted = true;
        }
    };

    // Check on scroll
    window.addEventListener('scroll', checkViewport);
    
    // Initial check
    checkViewport();
});
