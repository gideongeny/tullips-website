// Simple Photo Gallery - All Photos in One Gallery
class SimplePhotoGallery {
    constructor() {
        this.gallery = document.getElementById('gallery-grid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.photosPerPage = 12;
        this.currentPage = 0;
        this.allPhotos = [];
        
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
        const photoCount = 95; // Total number of photos (18-117, missing some numbers)
        
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
    
    createPhotoElement(photo) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'gallery-item';
        photoDiv.innerHTML = `
            <div class="photo-container">
                <img src="${photo.src}" alt="${photo.alt}" class="photo-image" loading="lazy">
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
            this.showNotification('Removed from favorites', 'info');
        } else {
            favorites.push(photoId);
            btn.innerHTML = '❤️';
            this.showNotification('Added to favorites!', 'success');
        }
        
        localStorage.setItem('tullipsFavorites', JSON.stringify(favorites));
    }
    
    checkFavoriteStatus(photoId, btn) {
        const favorites = JSON.parse(localStorage.getItem('tullipsFavorites') || '[]');
        if (favorites.includes(photoId)) {
            btn.innerHTML = '❤️';
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
        this.loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderPhotos();
        });
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
});
