// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const projectType = document.getElementById('projectType').value;

            // Basic validation
            if (!name || !email || !phone || !message) {
                alert('Lütfen tüm zorunlu alanları doldurunuz.');
                return;
            }

            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            alert('Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.');

            // Reset the form
            contactForm.reset();
        });
    }
});