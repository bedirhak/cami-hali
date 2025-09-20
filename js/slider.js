// Slider functionality for Kutsal Halı website

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.nav-prev');
        this.nextBtn = document.querySelector('.nav-next');
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Set up event listeners
        this.setupEventListeners();

        // Start automatic sliding
        this.startAutoSlide();

        // Pause on hover
        this.setupHoverPause();
    }

    setupEventListeners() {
        // Navigation arrows
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoSlide();
            });
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoSlide();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoSlide();
            }
        });

        // Touch/swipe support for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;

        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const distance = startX - endX;

            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
                this.resetAutoSlide();
            }
        }, { passive: true });
    }

    setupHoverPause() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;

        sliderContainer.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    goToSlide(index) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Update current slide index
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');

        // Add animation class for smooth transition
        this.addTransitionEffect();
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    addTransitionEffect() {
        // Add a subtle zoom effect to the active slide
        const activeSlide = this.slides[this.currentSlide];
        activeSlide.style.transform = 'scale(1.02)';

        setTimeout(() => {
            activeSlide.style.transform = 'scale(1)';
        }, 1000);
    }
}

// Intersection Observer for fade-in animations
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );

            // Observe elements with animation classes
            const animatedElements = document.querySelectorAll(
                '.fade-in, .slide-in-left, .slide-in-right, .slide-in-up'
            );

            animatedElements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Preload slider images for better performance
class ImagePreloader {
    constructor() {
        this.images = [];
        this.loadedCount = 0;
        this.totalImages = 0;

        this.init();
    }

    init() {
        // Get all slider background images
        const slides = document.querySelectorAll('.slide');
        this.totalImages = slides.length;

        slides.forEach((slide, index) => {
            const bgImage = window.getComputedStyle(slide).backgroundImage;
            const imageUrl = bgImage.slice(5, -2); // Remove url(" and ")

            if (imageUrl && imageUrl !== 'none') {
                this.preloadImage(imageUrl, index);
            }
        });
    }

    preloadImage(src, index) {
        const img = new Image();

        img.onload = () => {
            this.loadedCount++;
            this.checkAllLoaded();
        };

        img.onerror = () => {
            console.warn(`Failed to load slider image: ${src}`);
            this.loadedCount++;
            this.checkAllLoaded();
        };

        img.src = src;
        this.images[index] = img;
    }

    checkAllLoaded() {
        if (this.loadedCount === this.totalImages) {
            // All images loaded, show slider
            document.querySelector('.hero-slider')?.classList.add('loaded');

            // Trigger custom event
            document.dispatchEvent(new CustomEvent('sliderImagesLoaded'));
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Monitor load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });

        // Monitor slider initialization
        document.addEventListener('sliderImagesLoaded', () => {
            const initTime = performance.now() - this.startTime;
            console.log(`Slider initialized in ${initTime.toFixed(2)}ms`);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    new PerformanceMonitor();

    // Preload images
    new ImagePreloader();

    // Initialize slider
    new HeroSlider();

    // Initialize animations
    new AnimationObserver();

    // Add loading state management
    const body = document.body;
    body.classList.add('loading');

    window.addEventListener('load', () => {
        // Remove loading state
        setTimeout(() => {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }, 500);
    });
});

// Export for potential external use
window.CamiHaliSlider = {
    HeroSlider,
    AnimationObserver,
    ImagePreloader,
    PerformanceMonitor
};