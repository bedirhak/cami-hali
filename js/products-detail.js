/**
 * products-detail.js
 * 
 * Bu script, ürün detay sayfasındaki görsel zoom özelliğini kontrol eder.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Image modal için gerekli HTML'i oluştur
    const modalHTML = `
        <div class="image-modal" id="imageModal">
            <div class="modal-content">
                <span class="modal-close" id="modalClose">&times;</span>
                <button class="modal-nav modal-prev" id="modalPrev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="modal-nav modal-next" id="modalNext">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <img class="modal-image" id="modalImage" src="" alt="">
                <div class="modal-counter" id="modalCounter">
                    <span id="currentIndex">1</span> / <span id="totalImages">1</span>
                </div>
            </div>
        </div>
    `;

    // Modal'ı body'ye ekle
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Modal elementlerini al
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const currentIndexSpan = document.getElementById('currentIndex');
    const totalImagesSpan = document.getElementById('totalImages');

    // Tüm ürün resimlerini al ve dizi oluştur
    const productImages = document.querySelectorAll('.product-image img');
    const imageData = Array.from(productImages).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    let currentImageIndex = 0;

    // Toplam resim sayısını göster
    totalImagesSpan.textContent = imageData.length;

    // Resim güncelleme fonksiyonu
    function updateModalImage(index) {
        if (index >= 0 && index < imageData.length) {
            currentImageIndex = index;
            modalImage.src = imageData[index].src;
            modalImage.alt = imageData[index].alt;
            currentIndexSpan.textContent = index + 1;

            // Navigation butonlarının durumunu güncelle
            modalPrev.style.opacity = index === 0 ? '0.5' : '1';
            modalNext.style.opacity = index === imageData.length - 1 ? '0.5' : '1';
        }
    }

    // Her ürün resmine click event listener ekle
    productImages.forEach(function (img, index) {
        img.parentElement.addEventListener('click', function () {
            // Tıklanan resmin index'ini bul ve modal'ı aç
            currentImageIndex = index;
            updateModalImage(currentImageIndex);

            // Modal'ı göster
            modal.classList.add('active');

            // Body scroll'unu kapat
            document.body.style.overflow = 'hidden';
        });
    });

    // Navigation fonksiyonları
    function showPrevImage() {
        if (currentImageIndex > 0) {
            updateModalImage(currentImageIndex - 1);
        }
    }

    function showNextImage() {
        if (currentImageIndex < imageData.length - 1) {
            updateModalImage(currentImageIndex + 1);
        }
    }

    // Modal kapatma fonksiyonu
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigation butonları
    modalPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showPrevImage();
    });

    modalNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showNextImage();
    });

    // Close butonuna tıklama
    modalClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
    });

    // Modal arka planına tıklama
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    showNextImage();
                    break;
            }
        }
    });

    // Modal content'e tıklamayı engelle (resme tıklayınca kapanmasın)
    const modalContent = document.querySelector('.modal-content');
    modalContent.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});