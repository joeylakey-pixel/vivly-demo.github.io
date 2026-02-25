/* ===========================
   VIVLY LIVING - Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.header');
    const scrollThreshold = 60;
    const isHomepage = !!document.querySelector('.hero');

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else if (isHomepage) {
            // Only remove scrolled style on homepage (transparent hero header)
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger--active');
            mobileNav.classList.toggle('mobile-nav--active');
            document.body.style.overflow = mobileNav.classList.contains('mobile-nav--active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('hamburger--active');
                mobileNav.classList.remove('mobile-nav--active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation slightly
                    setTimeout(() => {
                        entry.target.classList.add('reveal--visible');
                    }, index * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for old browsers
        revealElements.forEach(el => el.classList.add('reveal--visible'));
    }

    // --- Hero Parallax Effect ---
    const hero = document.querySelector('.hero');
    if (hero) {
        // Trigger the zoom-out animation
        requestAnimationFrame(() => {
            hero.classList.add('hero--loaded');
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // --- Contact Form Validation ---
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                field.style.borderColor = '';
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                }
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        field.style.borderColor = '#e74c3c';
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                // Show success feedback
                const btn = this.querySelector('.btn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Message Sent!';
                btn.style.background = '#2A5A45';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    this.reset();
                }, 3000);
            }
        });
    }

    // --- Active Nav Link Highlighting ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('nav__link--active');
        }
    });

    // --- Inner page header (always scrolled style) ---
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) {
        header.classList.add('header--scrolled');
    }
});
