/**
 * header-footer.js
 * 
 * Bu script, sayfalara otomatik olarak header ve footer ekler.
 * Sayfanıza header ve footer eklemek için:
 * 1. Sayfaya <div id="header-placeholder"></div> ekleyin (header'ın görünmesini istediğiniz yere)
 * 2. Sayfaya <div id="footer-placeholder"></div> ekleyin (footer'ın görünmesini istediğiniz yere)
 * 3. Bu script'i sayfanın en altına ekleyin: <script src="js/header-footer.js"></script>
 */

document.addEventListener("DOMContentLoaded", function() {
    // Header ve footer için placeholder elementlerini bulalım
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Header HTML içeriği
    const headerHTML = `
    <!-- Header Section -->
    <header class="main-header">
        <!-- Top Bar -->
        <div class="top-bar">
            <div class="container">
                <div class="top-bar-content">
                    <div class="contact-info">
                        <span class="contact-item">
                            <i class="fas fa-phone"></i>
                            <a href="tel:+902121234567">+90 (212) 123 45 67</a>
                        </span>
                        <span class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:info@kutsalhali.com">info@kutsalhali.com</a>
                        </span>
                        <span class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>İstanbul, Türkiye</span>
                        </span>
                    </div>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-link" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-link" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Header -->
        <div class="main-nav">
            <div class="container">
                <div class="nav-content">
                    <!-- Logo -->
                    <div class="logo">
                        <a href="index.html">
                            <img src="assets/images/logo.png" alt="Kutsal Halı" class="logo-img">
                            <div class="logo-text">
                                <h1>Kutsal Halı</h1>
                                <span>Cami Halıları Uzmanı</span>
                            </div>
                        </a>
                    </div>

                    <!-- Navigation Menu -->
                    <nav class="main-menu">
                        <ul class="menu-list">
                            <li class="menu-item">
                                <a href="index.html" class="menu-link">Ana Sayfa</a>
                            </li>
                            <li class="menu-item">
                                <a href="detay.html" class="menu-link">Ürünlerimiz</a>
                            </li>
                            <li class="menu-item">
                                <a href="iletisim.html" class="menu-link">İletişim</a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Mobile Menu Toggle -->
                    <div class="mobile-toggle">
                        <span class="toggle-line"></span>
                        <span class="toggle-line"></span>
                        <span class="toggle-line"></span>
                    </div>

                    <!-- CTA Button -->
                    <div class="header-cta">
                        <a href="iletisim.html" class="cta-button">
                            <i class="fas fa-quote-left"></i>
                            Teklif Al
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;

    // Footer HTML içeriği
    const footerHTML = `
    <!-- Footer Section -->
    <footer class="main-footer">
        <div class="footer-content">
            <div class="container">
                <div class="footer-grid">
                    <!-- Company Info -->
                    <div class="footer-section company-info">
                        <div class="footer-logo">
                            <img src="assets/images/logo-white.png" alt="Kutsal Halı" class="footer-logo-img">
                            <h3>Kutsal Halı</h3>
                        </div>
                        <p class="company-description">
                            25 yıldır cami halıları, seccade ve mihrap halısı üretiminde
                            öncü firmayız. Geleneksel motiflerimizle modern kaliteyi birleştiriyoruz.
                        </p>
                        <div class="company-stats">
                            <div class="stat-item">
                                <span class="stat-number">500+</span>
                                <span class="stat-label">Proje</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">25</span>
                                <span class="stat-label">Yıl Deneyim</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">50+</span>
                                <span class="stat-label">Şehir</span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section quick-links">
                        <h4 class="footer-title">Hızlı Bağlantılar</h4>
                        <ul class="footer-menu">
                            <li><a href="index.html">Ana Sayfa</a></li>
                            <li><a href="detay.html">Ürünlerimiz</a></li>
                            <li><a href="iletisim.html">İletişim</a></li>
                        </ul>
                    </div>

                    <!-- Products -->
                    <div class="footer-section products">
                        <h4 class="footer-title">Ürün Kategorileri</h4>
                        <ul class="footer-menu">
                            <li><a href="cami-hali.html">Cami Halıları</a></li>
                            <li><a href="seccade.html">Seccadeler</a></li>
                            <li><a href="mihrap-hali.html">Mihrap Halıları</a></li>
                            <li><a href="minber-hali.html">Minber Halıları</a></li>
                            <li><a href="ozel-tasarim.html">Özel Tasarım</a></li>
                        </ul>
                    </div>

                    <!-- Contact Info -->
                    <div class="footer-section contact-info">
                        <h4 class="footer-title">İletişim Bilgileri</h4>
                        <div class="contact-details">
                            <div class="contact-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="detail-content">
                                    <p>Merkez Mah. Halıcılar Cad. No:123<br>
                                        Fatih / İstanbul</p>
                                </div>
                            </div>
                            <div class="contact-detail">
                                <i class="fas fa-phone"></i>
                                <div class="detail-content">
                                    <p>+90 (212) 123 45 67<br>
                                        +90 (535) 123 45 67</p>
                                </div>
                            </div>
                            <div class="contact-detail">
                                <i class="fas fa-envelope"></i>
                                <div class="detail-content">
                                    <p>info@kutsalhali.com<br>
                                        satis@kutsalhali.com</p>
                                </div>
                            </div>
                            <div class="contact-detail">
                                <i class="fas fa-clock"></i>
                                <div class="detail-content">
                                    <p>Pazartesi - Cumartesi<br>
                                        09:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <div class="copyright">
                        <p>&copy; 2024 Kutsal Halı. Tüm hakları saklıdır.</p>
                    </div>
                    <div class="footer-social">
                        <a href="#" class="footer-social-link" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" class="footer-social-link" aria-label="WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                    <div class="footer-links">
                        <a href="gizlilik.html">Gizlilik Politikası</a>
                        <a href="kullanim.html">Kullanım Koşulları</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Aktif sayfa linki için CSS classı ekleyelim
    function setActiveLink() {
        // Geçerli sayfa yolunu alalım
        const currentPage = window.location.pathname.split('/').pop();
        
        // Eğer header eklendiyse
        if (headerPlaceholder) {
            // Tüm menü linklerini bulalım
            const menuLinks = headerPlaceholder.querySelectorAll('.menu-item');
            
            // Her link için kontrol edelim
            menuLinks.forEach(menuItem => {
                const link = menuItem.querySelector('a');
                const href = link.getAttribute('href');
                
                // Eğer link geçerli sayfaya eşitse ya da ana sayfa için özel durum
                if (href === currentPage || 
                    (currentPage === '' || currentPage === '/' || currentPage === 'index.html') && href === 'index.html') {
                    menuItem.classList.add('active');
                } else {
                    menuItem.classList.remove('active');
                }
            });
        }
    }

    // Header'ı sayfaya ekleyelim
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        
        // Mobil menü fonksiyonunu ekleyelim
        const mobileToggle = document.querySelector('.mobile-toggle');
        const menuList = document.querySelector('.menu-list');
        
        if (mobileToggle && menuList) {
            mobileToggle.addEventListener('click', function() {
                menuList.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }

    // Footer'ı sayfaya ekleyelim
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }

    // Aktif linki ayarlayalım
    setActiveLink();
});