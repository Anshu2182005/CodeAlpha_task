document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump behavior

            const targetId = this.getAttribute('href'); // Get the href (e.g., "#about")
            const targetElement = document.querySelector(targetId); // Get the section element

            if (targetElement) {
                // Scroll smoothly to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Optional: Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // 2. Highlight Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]'); // Ensure this selects the new gallery section too
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add 'active' class to the corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // 3. Fade-in Animations for Sections on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the element is visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // For nested elements to animate, remove this unobserve and handle child animations with separate logic
                // Or ensure child animations are tied to parent's 'is-visible' state
                // fadeObserver.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. Update Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});