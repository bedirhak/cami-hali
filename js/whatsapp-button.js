// WhatsApp Float Button Configuration
const whatsappConfig = {
    phoneNumber: '902364621111', // 0236 462 11 11 formatted for WhatsApp
    message: 'Merhaba! Halı ürünleriniz hakkında bilgi almak istiyorum.', // Default message
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    marginBottom: '20px',
    marginRight: '20px',
    showOnMobile: true,
    showOnDesktop: true,
    animationType: 'bounce' // bounce, pulse, shake, none
};

class WhatsAppButton {
    constructor(config = whatsappConfig) {
        this.config = config;
        this.button = null;
        this.isVisible = false;

        this.init();
    }

    init() {
        this.createButton();
        this.addStyles();
        this.attachEvents();
        this.showButton();
    }

    createButton() {
        // Create button container
        this.button = document.createElement('div');
        this.button.className = 'whatsapp-float-button';
        this.button.id = 'whatsapp-button';

        // Create button content
        this.button.innerHTML = `
            <div class="whatsapp-button-content">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.088z"/>
                </svg>
                <span class="whatsapp-tooltip">WhatsApp ile iletişime geç</span>
            </div>
        `;

        // Add click event
        this.button.addEventListener('click', () => this.openWhatsApp());

        // Append to body
        document.body.appendChild(this.button);
    }

    addStyles() {
        // Check if styles already exist
        if (document.getElementById('whatsapp-button-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'whatsapp-button-styles';
        style.textContent = `
            .whatsapp-float-button {
                position: fixed;
                ${this.config.position.includes('bottom') ? 'bottom' : 'top'}: ${this.config.marginBottom};
                ${this.config.position.includes('right') ? 'right' : 'left'}: ${this.config.marginRight};
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                border-radius: 50%;
                box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transform: scale(0);
                animation: ${this.config.animationType} 2s infinite;
            }

            .whatsapp-float-button.visible {
                opacity: 1;
                transform: scale(1);
            }

            .whatsapp-float-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
            }

            .whatsapp-float-button:active {
                transform: scale(0.95);
            }

            .whatsapp-button-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .whatsapp-tooltip {
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .whatsapp-tooltip::after {
                content: '';
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border: 6px solid transparent;
                border-left-color: rgba(0, 0, 0, 0.8);
            }

            .whatsapp-float-button:hover .whatsapp-tooltip {
                opacity: 1;
                visibility: visible;
            }

            /* Animations */
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: scale(1);
                }
                40%, 43% {
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(1.02);
                }
                90% {
                    transform: scale(1.01);
                }
            }

            @keyframes pulse {
                0% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                }
                50% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.8);
                }
                100% {
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
                }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                20%, 40%, 60%, 80% { transform: translateX(2px); }
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .whatsapp-float-button {
                    width: 55px;
                    height: 55px;
                    bottom: 15px;
                    right: 15px;
                }

                .whatsapp-tooltip {
                    display: none;
                }
            }

            /* Hide on very small screens if configured */
            @media (max-width: 480px) {
                .whatsapp-float-button {
                    ${!this.config.showOnMobile ? 'display: none;' : ''}
                }
            }

            /* Hide on desktop if configured */
            @media (min-width: 769px) {
                .whatsapp-float-button {
                    ${!this.config.showOnDesktop ? 'display: none;' : ''}
                }
            }
        `;

        document.head.appendChild(style);
    }

    attachEvents() {
        // Show/hide on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Hide while scrolling
            if (this.button) {
                this.button.style.opacity = '0.7';
            }

            scrollTimeout = setTimeout(() => {
                if (this.button) {
                    this.button.style.opacity = '1';
                }
            }, 150);
        });

        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.hideButton();
            } else {
                this.showButton();
            }
        });
    }

    openWhatsApp() {
        const phoneNumber = this.config.phoneNumber;
        const message = encodeURIComponent(this.config.message);
        const url = `https://wa.me/${phoneNumber}?text=${message}`;

        // Add click animation
        this.button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.button.style.transform = 'scale(1)';
        }, 100);

        // Open WhatsApp
        window.open(url, '_blank');

        // Track event (if analytics available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'WhatsApp',
                event_label: 'Float Button Click'
            });
        }
    }

    showButton() {
        if (this.button) {
            setTimeout(() => {
                this.button.classList.add('visible');
                this.isVisible = true;
            }, 1000); // Show after 1 second
        }
    }

    hideButton() {
        if (this.button) {
            this.button.classList.remove('visible');
            this.isVisible = false;
        }
    }

    // Public methods for customization
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.destroy();
        this.init();
    }

    updateMessage(newMessage) {
        this.config.message = newMessage;
    }

    updatePhoneNumber(newNumber) {
        this.config.phoneNumber = newNumber;
    }

    destroy() {
        if (this.button) {
            this.button.remove();
        }
        const styles = document.getElementById('whatsapp-button-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Initialize WhatsApp button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for page to load
    setTimeout(() => {
        const whatsappButton = new WhatsAppButton(whatsappConfig);

        // Make it globally accessible
        window.whatsappButton = whatsappButton;
    }, 500);
});

// Export for external use
window.WhatsAppButton = WhatsAppButton;

// Helper functions for easy customization
window.updateWhatsAppMessage = function (message) {
    if (window.whatsappButton) {
        window.whatsappButton.updateMessage(message);
    }
};

window.updateWhatsAppNumber = function (number) {
    if (window.whatsappButton) {
        window.whatsappButton.updatePhoneNumber(number);
    }
};