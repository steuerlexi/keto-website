// Apple-Style JavaScript for Keto Website
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const backToTopBtn = document.getElementById('backToTop');
    const faqItems = document.querySelectorAll('.faq-item');
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        // Also close any open dropdowns
        dropdownItems.forEach(item => {
            item.classList.remove('dropdown-open');
        });
    }

    // Dropdown menu toggle for mobile
    function initDropdowns() {
        // Check if it's a touch device
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');

            if (isTouchDevice) {
                // On touch devices, toggle dropdown on click
                link.addEventListener('click', function(e) {
                    // Only if mobile menu is active or screen is small
                    if (window.innerWidth <= 1024 || navMenu.classList.contains('active')) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Close other open dropdowns
                        dropdownItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('dropdown-open');
                            }
                        });

                        // Toggle current dropdown
                        item.classList.toggle('dropdown-open');
                    }
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item-dropdown')) {
                dropdownItems.forEach(item => {
                    item.classList.remove('dropdown-open');
                });
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                // Close all dropdowns when returning to desktop
                dropdownItems.forEach(item => {
                    item.classList.remove('dropdown-open');
                });
            }
        });
    }

    // Smooth scroll for anchor links
    function handleSmoothScroll(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();
            }
        }
    }

    // Active nav link based on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // FAQ Accordion
    function toggleFaq() {
        const item = this.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    }

    // Back to top button
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        scrollElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Parallax effect for hero
    function handleParallax() {
        const hero = document.querySelector('.hero');
        if (hero && !window.matchMedia('(pointer: coarse)').matches) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = rate + 'px';
        }
    }

    // Event Listeners
    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        handleBackToTop();
        updateActiveNavLink();
        handleParallax();
    }, { passive: true });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', toggleFaq);
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Keyboard accessibility for FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFaq.call(this);
                }
            });
        }
    });

    // Initialize
    initScrollAnimations();
    initDropdowns();
    handleHeaderScroll();
    handleBackToTop();

    // Preload animation for page load
    document.body.classList.add('loaded');
});
