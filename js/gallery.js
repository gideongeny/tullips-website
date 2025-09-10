// Simple Photo Gallery - All Photos in One Gallery
class SimplePhotoGallery {
    constructor() {
        this.gallery = document.getElementById('gallery-grid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.photosPerPage = 12;
        this.currentPage = 0;
        this.allPhotos = [];
        
        if (!this.gallery) {
            console.error('Gallery element not found!');
            return;
        }
        
        if (!this.loadMoreBtn) {
            console.error('Load More button not found!');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.loadPhotos();
        this.setupEventListeners();
    }
    
    loadPhotos() {
        // Simulate loading photos from the images/photos folder
        this.allPhotos = this.getPhotosFromFolder();
        this.renderPhotos();
    }
    
    getPhotosFromFolder() {
        // Simulate reading photos from the folder
        const photos = [];
        const photoCount = 94; // Total number of photos (18-117, missing some numbers)
        
        // Create array of actual photo numbers based on your files
        const photoNumbers = [
            18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
            61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
            101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 114, 115, 116, 117
        ];
        
        photoNumbers.forEach((num, index) => {
            const photoNumber = num.toString().padStart(4, '0');
            photos.push({
                id: index + 1,
                src: `images/photos/IMG-20250901-WA${photoNumber}.jpg`,
                alt: `Tullips Creative Green Spaces - Photo ${index + 1}`,
                title: `Beautiful Creation ${index + 1}`
            });
        });
        
        return photos;
    }
    
    renderPhotos() {
        const startIndex = this.currentPage * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        const photosToShow = this.allPhotos.slice(startIndex, endIndex);
        
        photosToShow.forEach(photo => {
            const photoElement = this.createPhotoElement(photo);
            this.gallery.appendChild(photoElement);
        });
        
        this.updateLoadMoreButton();
    }
    
    loadMorePhotos() {
        this.currentPage++;
        this.renderPhotos();
    }
    
    createPhotoElement(photo) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'gallery-item';
        const base = photo.src.replace('.jpg', '');
        const avifSet = `${base}-w400.avif 400w, ${base}-w800.avif 800w, ${base}-w1200.avif 1200w`;
        const webpSet = `${base}-w400.webp 400w, ${base}-w800.webp 800w, ${base}-w1200.webp 1200w`;
        const jpgSet = `${photo.src} 800w`;
        photoDiv.innerHTML = `
            <div class="photo-container">
                <picture>
                    <source type="image/avif" srcset="${avifSet}">
                    <source type="image/webp" srcset="${webpSet}">
                    <img src="${photo.src}" srcset="${jpgSet}" alt="${photo.alt}" class="photo-image" loading="lazy" decoding="async" width="800" height="534" sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw">
                </picture>
                <div class="photo-overlay">
                    <div class="photo-actions">
                        <button class="photo-action-btn favorite-btn" data-photo-id="${photo.id}" title="Add to Favorites">
                            ❤️
                        </button>
                        <button class="photo-action-btn share-btn" data-photo-id="${photo.id}" title="Share">
                            📤
                        </button>
                        <button class="photo-action-btn enlarge-btn" data-photo-id="${photo.id}" title="Enlarge">
                            🔍
                        </button>
                    </div>
                    <div class="photo-info">
                        <h4>${photo.title}</h4>
                    </div>
                </div>
            </div>
        `;
        
        this.addPhotoEventListeners(photoDiv, photo);
        return photoDiv;
    }
    
    addPhotoEventListeners(photoDiv, photo) {
        const favoriteBtn = photoDiv.querySelector('.favorite-btn');
        const shareBtn = photoDiv.querySelector('.share-btn');
        const enlargeBtn = photoDiv.querySelector('.enlarge-btn');
        const photoImage = photoDiv.querySelector('.photo-image');
        
        // Accessibility labels & button types
        favoriteBtn.setAttribute('aria-label', 'Add to favorites');
        shareBtn.setAttribute('aria-label', 'Share photo');
        enlargeBtn.setAttribute('aria-label', 'View larger');
        favoriteBtn.setAttribute('type', 'button');
        shareBtn.setAttribute('type', 'button');
        enlargeBtn.setAttribute('type', 'button');
        
        // Favorite functionality
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(photo.id, favoriteBtn);
        });
        
        // Share functionality
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sharePhoto(photo);
        });
        
        // Enlarge functionality
        enlargeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openLightbox(photo);
        });
        
        // Click to enlarge
        photoImage.addEventListener('click', () => {
            this.openLightbox(photo);
        });
        
        // Check if photo is already favorited
        this.checkFavoriteStatus(photo.id, favoriteBtn);
    }
    
    toggleFavorite(photoId, btn) {
        const favorites = JSON.parse(localStorage.getItem('tullipsFavorites') || '[]');
        const index = favorites.indexOf(photoId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            btn.innerHTML = '🤍';
            btn.setAttribute('aria-pressed', 'false');
            this.showNotification('Removed from favorites', 'info');
        } else {
            favorites.push(photoId);
            btn.innerHTML = '❤️';
            btn.setAttribute('aria-pressed', 'true');
            this.showNotification('Added to favorites!', 'success');
        }
        
        localStorage.setItem('tullipsFavorites', JSON.stringify(favorites));
    }
    
    checkFavoriteStatus(photoId, btn) {
        const favorites = JSON.parse(localStorage.getItem('tullipsFavorites') || '[]');
        if (favorites.includes(photoId)) {
            btn.innerHTML = '❤️';
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.setAttribute('aria-pressed', 'false');
        }
    }
    
    sharePhoto(photo) {
        if (navigator.share) {
            navigator.share({
                title: photo.title,
                text: 'Check out this beautiful creation from Tullips Creative Green Spaces!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
    }
    
    openLightbox(photo) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">×</button>
                <img src="${photo.src}" alt="${photo.alt}" class="lightbox-image">
                <div class="lightbox-info">
                    <h3>${photo.title}</h3>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            lightbox.classList.add('show');
        }, 10);
        
        // Close lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });
        
        // ESC key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    closeLightbox(lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
    
    updateLoadMoreButton() {
        const totalPages = Math.ceil(this.allPhotos.length / this.photosPerPage);
        
        if (this.currentPage >= totalPages - 1) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'block';
            this.loadMoreBtn.textContent = `Load More Photos (${this.allPhotos.length - (this.currentPage + 1) * this.photosPerPage} remaining)`;
        }
    }
    
    setupEventListeners() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMorePhotos();
            });
        } else {
            console.error('Load More button not found!');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }
}

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.nav = document.getElementById('mainNav');
        this.init();
    }
    
    init() {
        if (this.menuToggle && this.nav) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            const navLinks = this.nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        const isOpen = this.nav.classList.contains('active');
        this.menuToggle.innerHTML = isOpen ? '✕' : '☰';
        this.menuToggle.setAttribute('aria-expanded', String(isOpen));
        this.menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
    
    closeMenu() {
        this.nav.classList.remove('active');
        this.menuToggle.innerHTML = '☰';
    }
}

// Initialize gallery and mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SimplePhotoGallery();
    new MobileMenu();
    // Contact form validation + WhatsApp deep link
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) { return; } // bot detected
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');
            const consent = document.getElementById('consent');

            let valid = true;
            const setError = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text || ''; };

            if (!name.value || name.value.trim().length < 2) { setError('nameError', 'Please enter your name.'); valid = false; } else { setError('nameError'); }
            const phoneRegex = /^[+0-9\s-]{7,}$/;
            if (!phone.value || !phoneRegex.test(phone.value.trim())) { setError('phoneError', 'Enter a valid phone/WhatsApp number.'); valid = false; } else { setError('phoneError'); }
            if (!message.value || message.value.trim().length < 3) { setError('messageError', 'Please enter a brief message.'); valid = false; } else { setError('messageError'); }
            if (!consent.checked) { setError('consentError', 'Please agree to be contacted.'); valid = false; } else { setError('consentError'); }

            if (!valid) return;

            // Normalize phone to international format if possible (basic)
            let raw = phone.value.replace(/\D/g, '');
            if (raw.startsWith('0')) raw = '254' + raw.substring(1);
            if (!raw.startsWith('254') && !raw.startsWith('1') && !raw.startsWith('2') && !raw.startsWith('44') && !raw.startsWith('+')) {
                // leave as-is; WhatsApp will attempt to handle
            }

            const waMsg = `Hello Tullips,%0AName: ${encodeURIComponent(name.value.trim())}%0APhone: ${encodeURIComponent(phone.value.trim())}%0AMessage: ${encodeURIComponent(message.value.trim())}`;
            const waUrl = `https://wa.me/254722801509?text=${waMsg}`;
            window.open(waUrl, '_blank');
        });

        const emailLink = document.getElementById('emailFallback');
        if (emailLink) {
            emailLink.addEventListener('click', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const message = document.getElementById('message').value.trim();
                const subject = encodeURIComponent('New enquiry from Tullips website');
                const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`);
                window.location.href = `mailto:tullips@example.com?subject=${subject}&body=${body}`;
            });
        }
    }
});
