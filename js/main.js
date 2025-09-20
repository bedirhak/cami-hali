// Main JavaScript file for Kutsal Halı website

// Global utilities and helpers
const Utils = {
    // Smooth scroll to element
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const targetPosition = element.offsetTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Debounce function for performance
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Format phone number for display
    formatPhone(phone) {
        // Turkish phone number formatting
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
        }
        return phone;
    },

    // Format price for display
    formatPrice(price) {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
};

// Mobile navigation handler
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        // Toggle menu on hamburger click
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        }, 250));
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.navMenu.classList.add('active');
        this.hamburger.classList.add('active');
        document.body.classList.add('nav-open');
        this.isOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
        this.isOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Scroll effects handler
class ScrollEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.scrollToTopBtn = document.querySelector('.scroll-to-top');
        this.lastScrollY = window.scrollY;

        this.init();
    }

    init() {
        window.addEventListener('scroll', Utils.debounce(() => {
            this.handleScroll();
        }, 16)); // ~60fps
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Header background on scroll
        if (this.header) {
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }

        // Scroll to top button visibility
        if (this.scrollToTopBtn) {
            if (currentScrollY > 500) {
                this.scrollToTopBtn.classList.add('visible');
            } else {
                this.scrollToTopBtn.classList.remove('visible');
            }
        }

        this.lastScrollY = currentScrollY;
    }
}

// Form handler
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('.contact-form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleSubmit(e, form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    async handleSubmit(e, form) {
        e.preventDefault();

        // Validate all fields
        const isValid = this.validateForm(form);
        if (!isValid) return;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission(form);

            // Show success message
            this.showMessage('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', 'success');

            // Reset form
            form.reset();

        } catch (error) {
            this.showMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Bu alan zorunludur.';
        }

        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Geçerli bir e-posta adresi giriniz.';
            }
        }

        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Geçerli bir telefon numarası giriniz.';
            }
        }

        // Show/hide error message
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');

        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Insert at top of page
        document.body.insertBefore(messageElement, document.body.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);

        // Make it closeable
        messageElement.addEventListener('click', () => {
            messageElement.remove();
        });
    }

    async simulateSubmission(form) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }
}

// Lazy loading for images
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.imageObserver = null;

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );

            this.images.forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                this.loadImage(img);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.imageObserver.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
}

// Accessibility improvements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Skip link functionality

        // Focus management
        this.manageFocus();

        // ARIA labels
        this.enhanceARIA();

        // Keyboard navigation
        this.enhanceKeyboardNav();
    }



    manageFocus() {
        // Focus trap for mobile menu
        const mobileNav = document.querySelector('.nav-menu');
        if (mobileNav) {
            const focusableElements = mobileNav.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                mobileNav.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        }
    }

    enhanceARIA() {
        // Add ARIA labels to buttons without text
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                const classes = button.className;
                if (classes.includes('hamburger')) {
                    button.setAttribute('aria-label', 'Menüyü aç/kapat');
                } else if (classes.includes('nav-prev')) {
                    button.setAttribute('aria-label', 'Önceki slayt');
                } else if (classes.includes('nav-next')) {
                    button.setAttribute('aria-label', 'Sonraki slayt');
                }
            }
        });
    }

    enhanceKeyboardNav() {
        // Improve keyboard navigation for custom elements
        const customElements = document.querySelectorAll('[role="button"]:not(button)');
        customElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    new MobileNav();
    new ScrollEffects();
    new FormHandler();
    new LazyLoader();
    new AccessibilityEnhancer();

    // Scroll to top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.scrollTo('body');
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            Utils.scrollTo(target, 80); // Account for fixed header
        });
    });

    // Contact info click handlers
    const phoneLinks = document.querySelectorAll('.phone-link');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = link.textContent.replace(/\D/g, '');
            window.location.href = `tel:+90${phone}`;
        });
    });

    // Initialize tooltips if any
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });

    // Performance optimization: Preload critical resources
    const criticalImages = [
        'assets/images/hero1.jpg',
        'assets/images/hero2.jpg',
        'assets/images/hero3.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
});



// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];

        }, 100);
    });
}

// Export utilities for potential external use
window.CamiHaliUtils = Utils;