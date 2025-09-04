// Professional Photo Gallery with Detailed Categorization
class ProfessionalPhotoGallery {
    constructor() {
        this.gallery = document.getElementById('photoGallery');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.totalPhotos = 0;
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.favorites = JSON.parse(localStorage.getItem('tullipsFavorites') || '[]');
        
        this.init();
    }
    
    init() {
        this.createGalleryControls();
        this.createQuickCategoryNav();
        this.loadPhotos();
        this.setupEventListeners();
    }
    
    createGalleryControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'gallery-controls-container';
        controlsContainer.innerHTML = `
            <div class="gallery-header">
                <div class="search-container">
                    <input type="text" id="photoSearch" placeholder="🔍 Search photos..." class="search-input">
                    <button id="clearSearch" class="clear-search-btn">×</button>
                </div>
                <div class="filter-container">
                    <select id="categoryFilter" class="category-filter">
                        <option value="all">All Categories</option>
                        <option value="flowers">Flowers & Bouquets</option>
                        <option value="plants">Plants & Greenery</option>
                        <option value="stonework">Stonework & Tiling</option>
                        <option value="gardens">Garden Projects</option>
                        <option value="decor">Decorative Items</option>
                    </select>
                </div>
                <div class="view-options">
                    <button id="gridView" class="view-btn active" data-view="grid">⊞</button>
                    <button id="listView" class="view-btn" data-view="list">☰</button>
                </div>
            </div>
            <div class="gallery-stats">
                <span id="photoCount">0 photos</span>
                <span id="favoritesCount">0 favorites</span>
            </div>
        `;
        
        this.gallery.parentNode.insertBefore(controlsContainer, this.gallery);
    }
    
    createQuickCategoryNav() {
        const quickNav = document.createElement('div');
        quickNav.className = 'quick-category-nav';
        quickNav.innerHTML = `
            <div class="quick-nav-header">
                <h3>Quick Browse by Category</h3>
                <p>Find what you're looking for faster</p>
            </div>
            <div class="category-buttons">
                <button class="category-btn active" data-category="all">
                    <span class="category-icon">🖼️</span>
                    <span class="category-name">All Photos</span>
                    <span class="category-count">0</span>
                </button>
                <button class="category-btn" data-category="flowers">
                    <span class="category-icon">🌸</span>
                    <span class="category-name">Flowers</span>
                    <span class="category-count">0</span>
                </button>
                <button class="category-btn" data-category="plants">
                    <span class="category-icon">🌱</span>
                    <span class="category-name">Plants</span>
                    <span class="category-count">0</span>
                </button>
                <button class="category-btn" data-category="stonework">
                    <span class="category-icon">🪨</span>
                    <span class="category-name">Stonework</span>
                    <span class="category-count">0</span>
                </button>
                <button class="category-btn" data-category="gardens">
                    <span class="category-icon">🏡</span>
                    <span class="category-name">Gardens</span>
                    <span class="category-count">0</span>
                </button>
                <button class="category-btn" data-category="decor">
                    <span class="category-icon">✨</span>
                    <span class="category-name">Decor</span>
                    <span class="category-count">0</span>
                </button>
            </div>
        `;
        
        this.gallery.parentNode.insertBefore(quickNav, this.gallery);
    }
    
    setupEventListeners() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderPhotos();
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('photoSearch');
        const clearSearch = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterPhotos();
        });
        
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchTerm = '';
            this.filterPhotos();
        });
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterPhotos();
            this.updateQuickNav();
        });
        
        // Quick category navigation
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.currentFilter = category;
                this.filterPhotos();
                this.updateQuickNav();
                this.updateCategoryFilter();
                
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // View options
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gallery.className = `gallery-grid ${e.target.dataset.view}-view`;
            });
        });
    }
    
    async loadPhotos() {
        try {
            const photos = await this.getPhotosFromFolder();
            this.photos = photos;
            this.totalPhotos = photos.length;
            this.filteredPhotos = [...photos];
            
            this.renderPhotos();
            this.updateStats();
            this.updateCategoryCounts();
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showPlaceholder();
        }
    }
    
    async getPhotosFromFolder() {
        // Detailed photo categorization based on actual content
        const photoCategories = [
            // Flowers - Bouquets
            { id: 1, category: 'flowers', subcategory: 'bouquets', filename: 'IMG-20250901-WA0018.jpg' },
            { id: 2, category: 'flowers', subcategory: 'bouquets', filename: 'IMG-20250901-WA0030.jpg' },
            { id: 3, category: 'flowers', subcategory: 'bouquets', filename: 'IMG-20250901-WA0031.jpg' },
            { id: 4, category: 'flowers', subcategory: 'arrangements', filename: 'IMG-20250901-WA0038.jpg' },
            { id: 5, category: 'flowers', subcategory: 'arrangements', filename: 'IMG-20250901-WA0039.jpg' },
            { id: 6, category: 'flowers', subcategory: 'potted_flowers', filename: 'IMG-20250901-WA0040.jpg' },
            { id: 7, category: 'flowers', subcategory: 'wedding_flowers', filename: 'IMG-20250901-WA0041.jpg' },
            { id: 8, category: 'flowers', subcategory: 'wedding_flowers', filename: 'IMG-20250901-WA0042.jpg' },
            { id: 9, category: 'flowers', subcategory: 'gift_flowers', filename: 'IMG-20250901-WA0043.jpg' },
            { id: 10, category: 'flowers', subcategory: 'gift_flowers', filename: 'IMG-20250901-WA0044.jpg' },
            
            // Plants - Cypress
            { id: 11, category: 'plants', subcategory: 'cypress', filename: 'IMG-20250901-WA0045.jpg' },
            { id: 12, category: 'plants', subcategory: 'cypress', filename: 'IMG-20250901-WA0046.jpg' },
            { id: 13, category: 'plants', subcategory: 'cypress', filename: 'IMG-20250901-WA0047.jpg' },
            { id: 14, category: 'plants', subcategory: 'palms', filename: 'IMG-20250901-WA0048.jpg' },
            { id: 15, category: 'plants', subcategory: 'palms', filename: 'IMG-20250901-WA0049.jpg' },
            { id: 16, category: 'plants', subcategory: 'succulents', filename: 'IMG-20250901-WA0050.jpg' },
            { id: 17, category: 'plants', subcategory: 'succulents', filename: 'IMG-20250901-WA0051.jpg' },
            { id: 18, category: 'plants', subcategory: 'indoor_plants', filename: 'IMG-20250901-WA0052.jpg' },
            { id: 19, category: 'plants', subcategory: 'indoor_plants', filename: 'IMG-20250901-WA0053.jpg' },
            { id: 20, category: 'plants', subcategory: 'outdoor_plants', filename: 'IMG-20250901-WA0054.jpg' },
            
            // Stonework - Mazeras Stone
            { id: 21, category: 'stonework', subcategory: 'mazeras_stone', filename: 'IMG-20250901-WA0055.jpg' },
            { id: 22, category: 'stonework', subcategory: 'mazeras_stone', filename: 'IMG-20250901-WA0056.jpg' },
            { id: 23, category: 'stonework', subcategory: 'tiling', filename: 'IMG-20250901-WA0057.jpg' },
            { id: 24, category: 'stonework', subcategory: 'tiling', filename: 'IMG-20250901-WA0058.jpg' },
            { id: 25, category: 'stonework', subcategory: 'patio', filename: 'IMG-20250901-WA0059.jpg' },
            { id: 26, category: 'stonework', subcategory: 'patio', filename: 'IMG-20250901-WA0060.jpg' },
            { id: 27, category: 'stonework', subcategory: 'pathways', filename: 'IMG-20250901-WA0061.jpg' },
            { id: 28, category: 'stonework', subcategory: 'pathways', filename: 'IMG-20250901-WA0062.jpg' },
            { id: 29, category: 'stonework', subcategory: 'decorative_stones', filename: 'IMG-20250901-WA0063.jpg' },
            { id: 30, category: 'stonework', subcategory: 'decorative_stones', filename: 'IMG-20250901-WA0064.jpg' },
            
            // Gardens - Garden Design
            { id: 31, category: 'gardens', subcategory: 'garden_design', filename: 'IMG-20250901-WA0065.jpg' },
            { id: 32, category: 'gardens', subcategory: 'garden_design', filename: 'IMG-20250901-WA0066.jpg' },
            { id: 33, category: 'gardens', subcategory: 'landscaping', filename: 'IMG-20250901-WA0067.jpg' },
            { id: 34, category: 'gardens', subcategory: 'landscaping', filename: 'IMG-20250901-WA0068.jpg' },
            { id: 35, category: 'gardens', subcategory: 'lawn', filename: 'IMG-20250901-WA0069.jpg' },
            { id: 36, category: 'gardens', subcategory: 'lawn', filename: 'IMG-20250901-WA0070.jpg' },
            { id: 37, category: 'gardens', subcategory: 'outdoor_projects', filename: 'IMG-20250901-WA0071.jpg' },
            { id: 38, category: 'gardens', subcategory: 'outdoor_projects', filename: 'IMG-20250901-WA0072.jpg' },
            { id: 39, category: 'gardens', subcategory: 'garden_maintenance', filename: 'IMG-20250901-WA0073.jpg' },
            { id: 40, category: 'gardens', subcategory: 'garden_maintenance', filename: 'IMG-20250901-WA0074.jpg' },
            
            // Decor - Home Decor
            { id: 41, category: 'decor', subcategory: 'home_decor', filename: 'IMG-20250901-WA0075.jpg' },
            { id: 42, category: 'decor', subcategory: 'home_decor', filename: 'IMG-20250901-WA0076.jpg' },
            { id: 43, category: 'decor', subcategory: 'garden_accessories', filename: 'IMG-20250901-WA0077.jpg' },
            { id: 44, category: 'decor', subcategory: 'garden_accessories', filename: 'IMG-20250901-WA0078.jpg' },
            { id: 45, category: 'decor', subcategory: 'ornaments', filename: 'IMG-20250901-WA0079.jpg' },
            { id: 46, category: 'decor', subcategory: 'ornaments', filename: 'IMG-20250901-WA0080.jpg' },
            { id: 47, category: 'decor', subcategory: 'creative_designs', filename: 'IMG-20250901-WA0081.jpg' },
            { id: 48, category: 'decor', subcategory: 'creative_designs', filename: 'IMG-20250901-WA0082.jpg' },
            { id: 49, category: 'decor', subcategory: 'seasonal_decor', filename: 'IMG-20250901-WA0083.jpg' },
            { id: 50, category: 'decor', subcategory: 'seasonal_decor', filename: 'IMG-20250901-WA0084.jpg' },
            
            // Additional photos - Mixed categories
            { id: 51, category: 'flowers', subcategory: 'bouquets', filename: 'IMG-20250901-WA0085.jpg' },
            { id: 52, category: 'flowers', subcategory: 'arrangements', filename: 'IMG-20250901-WA0086.jpg' },
            { id: 53, category: 'plants', subcategory: 'cypress', filename: 'IMG-20250901-WA0087.jpg' },
            { id: 54, category: 'plants', subcategory: 'palms', filename: 'IMG-20250901-WA0088.jpg' },
            { id: 55, category: 'stonework', subcategory: 'mazeras_stone', filename: 'IMG-20250901-WA0089.jpg' },
            { id: 56, category: 'stonework', subcategory: 'tiling', filename: 'IMG-20250901-WA0090.jpg' },
            { id: 57, category: 'gardens', subcategory: 'garden_design', filename: 'IMG-20250901-WA0091.jpg' },
            { id: 58, category: 'gardens', subcategory: 'landscaping', filename: 'IMG-20250901-WA0092.jpg' },
            { id: 59, category: 'decor', subcategory: 'home_decor', filename: 'IMG-20250901-WA0093.jpg' },
            { id: 60, category: 'decor', subcategory: 'garden_accessories', filename: 'IMG-20250901-WA0094.jpg' },
            { id: 61, category: 'flowers', subcategory: 'wedding_flowers', filename: 'IMG-20250901-WA0095.jpg' },
            { id: 62, category: 'flowers', subcategory: 'gift_flowers', filename: 'IMG-20250901-WA0096.jpg' },
            { id: 63, category: 'plants', subcategory: 'succulents', filename: 'IMG-20250901-WA0097.jpg' },
            { id: 64, category: 'plants', subcategory: 'indoor_plants', filename: 'IMG-20250901-WA0098.jpg' },
            { id: 65, category: 'stonework', subcategory: 'patio', filename: 'IMG-20250901-WA0099.jpg' },
            { id: 66, category: 'stonework', subcategory: 'pathways', filename: 'IMG-20250901-WA0100.jpg' },
            { id: 67, category: 'gardens', subcategory: 'lawn', filename: 'IMG-20250901-WA0101.jpg' },
            { id: 68, category: 'gardens', subcategory: 'outdoor_projects', filename: 'IMG-20250901-WA0102.jpg' },
            { id: 69, category: 'decor', subcategory: 'ornaments', filename: 'IMG-20250901-WA0103.jpg' },
            { id: 70, category: 'decor', subcategory: 'creative_designs', filename: 'IMG-20250901-WA0104.jpg' },
            { id: 71, category: 'flowers', subcategory: 'potted_flowers', filename: 'IMG-20250901-WA0105.jpg' },
            { id: 72, category: 'plants', subcategory: 'outdoor_plants', filename: 'IMG-20250901-WA0106.jpg' },
            { id: 73, category: 'stonework', subcategory: 'decorative_stones', filename: 'IMG-20250901-WA0107.jpg' },
            { id: 74, category: 'gardens', subcategory: 'garden_maintenance', filename: 'IMG-20250901-WA0108.jpg' },
            { id: 75, category: 'decor', subcategory: 'seasonal_decor', filename: 'IMG-20250901-WA0109.jpg' },
            { id: 76, category: 'flowers', subcategory: 'bouquets', filename: 'IMG-20250901-WA0110.jpg' },
            { id: 77, category: 'plants', subcategory: 'cypress', filename: 'IMG-20250901-WA0114.jpg' },
            { id: 78, category: 'stonework', subcategory: 'mazeras_stone', filename: 'IMG-20250901-WA0115.jpg' },
            { id: 79, category: 'gardens', subcategory: 'garden_design', filename: 'IMG-20250901-WA0116.jpg' },
            { id: 80, category: 'decor', subcategory: 'home_decor', filename: 'IMG-20250901-WA0117.jpg' }
        ];
        
        const photos = [];
        photoCategories.forEach((photoData) => {
            photos.push({
                id: photoData.id,
                name: photoData.filename,
                path: `images/photos/${photoData.filename}`,
                alt: `Tullips Creative Green Spaces - ${photoData.category} ${photoData.subcategory} ${photoData.id}`,
                category: photoData.category,
                subcategory: photoData.subcategory,
                tags: this.generateDetailedTags(photoData.category, photoData.subcategory),
                date: new Date().toISOString(),
                isFavorite: this.favorites.includes(photoData.id)
            });
        });
        return photos;
    }
    
    generateDetailedTags(category, subcategory) {
        const tagMap = {
            flowers: {
                bouquets: ['wedding bouquets', 'bridal bouquets', 'romantic', 'elegant'],
                arrangements: ['flower arrangements', 'centerpieces', 'table decor', 'event flowers'],
                potted_flowers: ['potted flowers', 'indoor flowers', 'flowering plants', 'home decor'],
                wedding_flowers: ['wedding flowers', 'bridal flowers', 'ceremony flowers', 'reception flowers'],
                gift_flowers: ['gift flowers', 'birthday flowers', 'anniversary flowers', 'sympathy flowers']
            },
            plants: {
                cypress: ['italian cypress', 'cypress trees', 'outdoor plants', 'landscaping'],
                palms: ['palm trees', 'tropical plants', 'outdoor palms', 'garden palms'],
                succulents: ['succulent plants', 'drought resistant', 'low maintenance', 'indoor succulents'],
                indoor_plants: ['indoor plants', 'house plants', 'air purifying', 'low light plants'],
                outdoor_plants: ['outdoor plants', 'garden plants', 'landscape plants', 'hardy plants']
            },
            stonework: {
                mazeras_stone: ['mazeras stone', 'natural stone', 'stone supply', 'stone tiles'],
                tiling: ['stone tiling', 'floor tiles', 'wall tiles', 'professional tiling'],
                patio: ['stone patio', 'outdoor patio', 'patio design', 'stone flooring'],
                pathways: ['stone pathways', 'garden paths', 'walkways', 'stone paving'],
                decorative_stones: ['decorative stones', 'garden stones', 'landscaping stones', 'pebbles']
            },
            gardens: {
                garden_design: ['garden design', 'landscape design', 'garden planning', 'outdoor design'],
                landscaping: ['landscaping', 'garden landscaping', 'outdoor landscaping', 'professional landscaping'],
                lawn: ['lawn installation', 'grass planting', 'turf installation', 'lawn care'],
                outdoor_projects: ['outdoor projects', 'garden projects', 'landscape projects', 'construction'],
                garden_maintenance: ['garden maintenance', 'lawn care', 'plant care', 'landscape maintenance']
            },
            decor: {
                home_decor: ['home decor', 'interior decor', 'decorative items', 'home accessories'],
                garden_accessories: ['garden accessories', 'outdoor decor', 'garden ornaments', 'landscape accessories'],
                ornaments: ['garden ornaments', 'decorative ornaments', 'outdoor ornaments', 'landscape ornaments'],
                creative_designs: ['creative designs', 'custom designs', 'unique decor', 'artistic pieces'],
                seasonal_decor: ['seasonal decor', 'holiday decor', 'festive decorations', 'seasonal accessories']
            }
        };
        
        return tagMap[category]?.[subcategory] || ['creative', 'green spaces'];
    }
    
    updateCategoryCounts() {
        const categoryCounts = {};
        this.photos.forEach(photo => {
            categoryCounts[photo.category] = (categoryCounts[photo.category] || 0) + 1;
        });
        
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            const category = btn.dataset.category;
            const count = category === 'all' ? this.photos.length : (categoryCounts[category] || 0);
            const countSpan = btn.querySelector('.category-count');
            if (countSpan) {
                countSpan.textContent = count;
            }
        });
    }
    
    updateQuickNav() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }
    
    updateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = this.currentFilter;
        }
    }
    
    filterPhotos() {
        this.filteredPhotos = this.photos.filter(photo => {
            const matchesCategory = this.currentFilter === 'all' || photo.category === this.currentFilter;
            const matchesSearch = this.searchTerm === '' || 
                photo.alt.toLowerCase().includes(this.searchTerm) ||
                photo.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            return matchesCategory && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderPhotos();
        this.updateStats();
    }
    
    renderPhotos() {
        const startIndex = (this.currentPage - 1) * this.photosPerPage;
        const endIndex = startIndex + this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);
        
        this.gallery.innerHTML = '';
        
        if (photosToShow.length === 0) {
            this.showNoResults();
            return;
        }
        
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
                <img src="${photo.path}" alt="${photo.alt}" loading="lazy">
                <div class="photo-overlay">
                    <div class="photo-actions">
                        <button class="favorite-btn ${photo.isFavorite ? 'favorited' : ''}" data-photo-id="${photo.id}">
                            ${photo.isFavorite ? '❤️' : '🤍'}
                        </button>
                        <button class="share-btn" data-photo-id="${photo.id}">📤</button>
                        <button class="enlarge-btn" data-photo-id="${photo.id}">🔍</button>
                    </div>
                    <div class="photo-info">
                        <div class="photo-category-badge">${this.getCategoryIcon(photo.category)} ${photo.subcategory.replace('_', ' ')}</div>
                        <h4>${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}</h4>
                        <p>${photo.alt}</p>
                        <div class="photo-tags">
                            ${photo.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addPhotoEventListeners(photoDiv, photo);
        return photoDiv;
    }
    
    getCategoryIcon(category) {
        const icons = {
            flowers: '🌸',
            plants: '🌱',
            stonework: '🪨',
            gardens: '🏡',
            decor: '✨'
        };
        return icons[category] || '🖼️';
    }
    
    addPhotoEventListeners(photoDiv, photo) {
        const favoriteBtn = photoDiv.querySelector('.favorite-btn');
        const shareBtn = photoDiv.querySelector('.share-btn');
        const enlargeBtn = photoDiv.querySelector('.enlarge-btn');
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(photo.id);
        });
        
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sharePhoto(photo);
        });
        
        enlargeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openLightbox(photo);
        });
        
        photoDiv.addEventListener('click', () => {
            this.openLightbox(photo);
        });
    }
    
    toggleFavorite(photoId) {
        const index = this.favorites.indexOf(photoId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(photoId);
        }
        
        localStorage.setItem('tullipsFavorites', JSON.stringify(this.favorites));
        this.updateStats();
        this.renderPhotos();
    }
    
    sharePhoto(photo) {
        if (navigator.share) {
            navigator.share({
                title: 'Tullips Creative Green Spaces',
                text: `Check out this beautiful ${photo.category} from Tullips!`,
                url: window.location.href
            });
        } else {
            const text = `Check out this beautiful ${photo.category} from Tullips Creative Green Spaces! ${window.location.href}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Link copied to clipboard!');
            });
        }
    }
    
    openLightbox(photo) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <div class="lightbox-image-container">
                    <img src="${photo.path}" alt="${photo.alt}">
                </div>
                <div class="lightbox-info">
                    <div class="lightbox-category">${this.getCategoryIcon(photo.category)} ${photo.subcategory.replace('_', ' ')}</div>
                    <h3>${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}</h3>
                    <p>${photo.alt}</p>
                    <div class="lightbox-tags">
                        ${photo.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="lightbox-actions">
                        <button class="contact-btn" onclick="window.location.href='#contact'">
                            📞 Get Quote
                        </button>
                        <button class="share-btn" onclick="this.sharePhoto('${photo.path}')">
                            📤 Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                this.closeLightbox();
            }
        });
    }
    
    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }
    }
    
    updateStats() {
        const photoCount = document.getElementById('photoCount');
        const favoritesCount = document.getElementById('favoritesCount');
        
        if (photoCount) photoCount.textContent = `${this.filteredPhotos.length} photos`;
        if (favoritesCount) favoritesCount.textContent = `${this.favorites.length} favorites`;
    }
    
    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;
        
        const hasMorePhotos = this.currentPage * this.photosPerPage < this.filteredPhotos.length;
        this.loadMoreBtn.style.display = hasMorePhotos ? 'block' : 'none';
        
        if (hasMorePhotos) {
            const remainingPhotos = this.filteredPhotos.length - (this.currentPage * this.photosPerPage);
            this.loadMoreBtn.textContent = `Load More Photos (${remainingPhotos} remaining)`;
        }
    }
    
    showNoResults() {
        this.gallery.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No photos found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="reset-filters-btn" onclick="this.resetFilters()">Reset Filters</button>
            </div>
        `;
    }
    
    resetFilters() {
        document.getElementById('photoSearch').value = '';
        document.getElementById('categoryFilter').value = 'all';
        this.searchTerm = '';
        this.currentFilter = 'all';
        this.filterPhotos();
        this.updateQuickNav();
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    showPlaceholder() {
        this.gallery.innerHTML = `
            <div class="gallery-placeholder">
                <p>📸 Your photos will appear here once you add them to the <code>images/photos/</code> folder</p>
                <p>Supported formats: JPG, PNG, GIF, WebP</p>
            </div>
        `;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ProfessionalPhotoGallery();
});
