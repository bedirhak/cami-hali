

// Slider configuration - DÜZENLEMEK İÇİN SADECE BU KISMI DEĞİŞTİRİN
const sliderConfig = {
    // Slider görsellerini buradan değiştirebilirsiniz
    images: [
        'assets/images/slider/slider1.jpg',
        'assets/images/slider/slider2.jpg',
        'assets/images/slider/slider1.jpg',
        'assets/images/slider/slider1.jpg'
    ],
    // Otomatik geçiş süresi (milisaniye)
    autoSlideDelay: 5000,
    // Varsayılan gösterilecek slide (0 = ilk slide)
    defaultSlide: 0,
    // Geçiş efekti süresi (milisaniye)
    transitionDuration: 800,
    // Overlay opaklığı (0-1 arası)
    overlayOpacity: 0.5,
    // Resimlerin yüklenememesi durumunda alternatif resimler kullanılsın mı?
    useFallbackImages: false,
    // Dinamik olarak slides oluştur
    dynamicSlides: true
};

class HeroSlider {
    constructor(config = sliderConfig) {
        this.config = config;
        this.currentSlide = config.defaultSlide || 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.sliderContainer = document.querySelector('.slider-container') || document.querySelector('.slider-wrapper');
        this.prevBtn = document.querySelector('.prev-btn') || document.querySelector('.nav-prev');
        this.nextBtn = document.querySelector('.next-btn') || document.querySelector('.nav-next');
        this.autoSlideInterval = null;
        this.autoSlideDelay = config.autoSlideDelay || 5000;

        // Slider yükleniyor durumu
        this.isLoading = true;

        this.init();
    }

    init() {
        // Slider boş ise çık
        if (!this.sliderContainer) {
            return;
        }

        // Slider'a yükleniyor sınıfı ekle
        this.sliderContainer.classList.add('loading');

        // Görselleri ayarla (Yeni özellik)
        this.setupSlides();

        // Event dinleyicileri ayarla
        this.setupEventListeners();

        // Otomatik geçişi başlat
        this.startAutoSlide();

        // Hover durumunda durdur
        this.setupHoverPause();
    }

    // YENİ METOD: Slider görsellerini oluştur
    setupSlides() {
        // Get the container for slides
        const slidesContainer = document.querySelector('.slider-images');
        if (!slidesContainer) {
            return;
        }

        // Force dynamic slides
        if (this.config.dynamicSlides) {
            // Clear existing slides
            slidesContainer.innerHTML = '';

            // Create new slides from configuration
            this.config.images.forEach((imageSrc, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide slide-' + (index + 1) + (index === this.currentSlide ? ' active' : '');
                slide.style.backgroundImage = `url('${imageSrc}')`;

                // CSS transition
                slide.style.transition = `opacity ${this.config.transitionDuration || 800}ms ease`;

                // Add overlay if configured
                if (this.config.overlayOpacity > 0) {
                    const overlay = document.createElement('div');
                    overlay.className = 'slide-overlay';
                    overlay.style.opacity = this.config.overlayOpacity;
                    slide.appendChild(overlay);
                }

                slidesContainer.appendChild(slide);
            });

            // Update slides reference
            this.slides = document.querySelectorAll('.slide');

            // Update indicators
            this.updateIndicators();
        } else {
            // Using existing slides, just test the images
            this.testExistingSlideImages();
        }
    }

    // YENİ METOD: Mevcut slide resimleri test et
    testExistingSlideImages() {
        if (!this.slides.length) return;

        this.slides.forEach((slide, index) => {
            const bgImage = window.getComputedStyle(slide).backgroundImage;
            const imageUrl = bgImage.slice(5, -2); // Remove url(" and ")

            if (imageUrl && imageUrl !== 'none') {
                const testImg = new Image();

                testImg.onerror = () => {

                    // Use fallback image if enabled
                    if (this.config.useFallbackImages && fallbackImages[index]) {
                        slide.style.backgroundImage = `url('${fallbackImages[index]}')`;
                    }
                };

                testImg.src = imageUrl;
            }
        });
    }    // YENİ METOD: Göstergeleri güncelle
    updateIndicators() {
        const indicatorsContainer = document.querySelector('.slider-indicators');
        if (!indicatorsContainer) {
            return;
        }

        // Mevcut göstergeleri temizle
        indicatorsContainer.innerHTML = '';

        // Yeni göstergeler oluştur (slides sayısı kadar)
        if (this.slides && this.slides.length > 0) {
            for (let i = 0; i < this.slides.length; i++) {
                const indicator = document.createElement('span');
                indicator.className = 'indicator' + (i === this.currentSlide ? ' active' : '');
                indicator.setAttribute('data-slide', (i + 1).toString());

                // Tıklama olayı ekle
                indicator.addEventListener('click', () => {
                    this.goToSlide(i);
                    this.resetAutoSlide();
                });

                indicatorsContainer.appendChild(indicator);
            }

            // Gösterge referansını güncelle
            this.indicators = document.querySelectorAll('.indicator');
        }
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
        if (!this.sliderContainer) return;

        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        this.sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.sliderContainer.addEventListener('touchend', (e) => {
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
        if (!this.sliderContainer) return;

        this.sliderContainer.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        this.sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    goToSlide(index) {
        if (!this.slides.length) return;

        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');

        if (this.indicators.length > this.currentSlide) {
            this.indicators[this.currentSlide].classList.remove('active');
        }

        // Update current slide index
        this.currentSlide = index;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');

        if (this.indicators.length > this.currentSlide) {
            this.indicators[this.currentSlide].classList.add('active');
        }

        // Add animation class for smooth transition
        this.addTransitionEffect();
    }

    nextSlide() {
        if (!this.slides.length) return;
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (!this.slides.length) return;
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
        if (!this.slides.length) return;

        // Add a subtle zoom effect to the active slide
        const activeSlide = this.slides[this.currentSlide];
        if (!activeSlide) return;

        activeSlide.style.transform = 'scale(1.02)';

        setTimeout(() => {
            activeSlide.style.transform = 'scale(1)';
        }, 1000);
    }

    // YENİ METOD: Slider görsellerini programatik olarak değiştirme
    updateImages(newImages) {
        if (!Array.isArray(newImages) || newImages.length === 0) return;

        // Konfigürasyonu güncelle
        this.config.images = newImages;

        // Dinamik slide oluştur
        this.config.dynamicSlides = true;

        // Görüntüleri yeniden oluştur
        this.setupSlides();

        // İlk slide'a git
        this.goToSlide(0);
    }

    // YENİ METOD: Özellikleri güncelleme
    updateConfig(newConfig) {
        // Konfigürasyonu birleştir
        this.config = { ...this.config, ...newConfig };

        // Otomatik geçiş süresini güncelle
        if (newConfig.autoSlideDelay) {
            this.autoSlideDelay = newConfig.autoSlideDelay;
            this.resetAutoSlide();
        }

        // Görselleri güncelle
        if (newConfig.images) {
            this.updateImages(newConfig.images);
        }
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
    constructor(config = sliderConfig) {
        this.config = config;
        this.images = [];
        this.loadedCount = 0;
        this.failedCount = 0;
        this.totalImages = 0;

        this.init();
    }

    init() {
        // Konfigürasyon görsellerini kullan
        if (this.config && Array.isArray(this.config.images) && this.config.images.length > 0) {
            this.totalImages = this.config.images.length;

            // Konfigürasyon görsellerini ön yükle
            this.config.images.forEach((src, index) => {
                this.preloadImage(src, index);
            });

            return;
        }

        // Alternatif olarak DOM'dan görsel bul
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
            this.failedCount++;
            this.loadedCount++;

            // Use fallback image if enabled
            if (this.config.useFallbackImages && fallbackImages[index]) {
                // Update slides with fallback image
                const slides = document.querySelectorAll('.slide');
                if (slides[index]) {
                    slides[index].style.backgroundImage = `url('${fallbackImages[index]}')`;
                }

                // Also update the configuration
                if (this.config.images[index]) {
                    this.config.images[index] = fallbackImages[index];
                }
            }

            this.checkAllLoaded();
        };

        img.src = src;
        this.images[index] = img;
    } checkAllLoaded() {
        if (this.loadedCount === this.totalImages) {
            // Log failure stats


            // All images loaded, show slider
            const sliders = document.querySelectorAll('.hero-slider, .slider-container, .slider-wrapper');
            sliders.forEach(slider => slider?.classList.add('loaded'));

            // Remove loading class
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                if (el.classList.contains('slider-container') ||
                    el.classList.contains('slider-wrapper') ||
                    el.classList.contains('hero-slider')) {
                    el.classList.remove('loading');
                }
            });

            // Trigger custom event
            document.dispatchEvent(new CustomEvent('sliderImagesLoaded', {
                detail: {
                    totalImages: this.totalImages,
                    failedImages: this.failedCount,
                    usingFallback: this.failedCount > 0 && this.config.useFallbackImages
                }
            }));
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
        });

        // Monitor slider initialization
        document.addEventListener('sliderImagesLoaded', () => {
            const initTime = performance.now() - this.startTime;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    new PerformanceMonitor();

    // Preload images with the config
    new ImagePreloader(sliderConfig);

    // Initialize slider with the config
    const slider = new HeroSlider(sliderConfig);

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

    // Global erişim için slider nesnesini kaydet
    window.camiHaliSlider = slider;
});

// Export for potential external use
window.CamiHaliSlider = {
    HeroSlider,
    AnimationObserver,
    ImagePreloader,
    PerformanceMonitor,

    // Slider görsellerini güncelleme yardımcı fonksiyonu
    updateSliderImages: function (newImages) {
        if (window.camiHaliSlider) {
            window.camiHaliSlider.updateImages(newImages);
        }
    },

    // Tüm slider ayarlarını güncelleme
    updateSliderConfig: function (newConfig) {
        if (window.camiHaliSlider) {
            window.camiHaliSlider.updateConfig(newConfig);
        }
    }
};