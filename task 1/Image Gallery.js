document.addEventListener('DOMContentLoaded', () => {
    const imageGrid = document.getElementById('imageGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.close-btn');
    const imagesBtn = document.getElementById('imagesBtn');
    const albumsBtn = document.getElementById('albumsBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Sample image data with categories
    const images = [
        { src: '/task 1/img/nature 1.jpg', category: 'nature' },
        { src: '/task 1/img/city1.jpg', category: 'city' },
        { src: '/task 1/img/abs1.jpg', category: 'abstract' },
        { src: '/task 1/img/nature 2.jpg', category: 'nature' },
        { src: '/task 1/img/city2.jpg', category: 'city' },
        { src: '/task 1/img/abs2.jpg', category: 'abstract' },
        { src: '/task 1/img/nature 3.jpg', category: 'nature' },
        { src: '/task 1/img/city3.jpg', category: 'city' },
        { src: '/task 1/img/abs3.jpg', category: 'abstract' },
        { src: '/task 1/img/nature 4.jpg', category: 'nature' },
        { src: '/task 1/img/city4.jpg', category: 'city' },
        { src: '/task 1/img/abs4.jpg', category: 'abstract' },
    ];

    let currentSlideIndex = 0;
    let filteredImages = [...images]; // Initialize with all images

    // Function to load images into the gallery based on filter
    function loadImages(category = 'all') {
        imageGrid.innerHTML = ''; // Clear existing images
        filteredImages = images;

        if (category !== 'all') {
            filteredImages = images.filter(img => img.category === category);
        }

        if (filteredImages.length === 0) {
            imageGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #777;">No images found for this category.</p>';
            return;
        }

        filteredImages.forEach((imgData, index) => {
            const imgThumbnail = document.createElement('div');
            imgThumbnail.classList.add('img-thumbnail');
            imgThumbnail.dataset.index = index; // Store index within the filteredImages array
            imgThumbnail.dataset.category = imgData.category; // Store category for filtering

            const imgElement = document.createElement('img');
            imgElement.src = imgData.src;
            imgElement.alt = `Gallery Image ${index + 1} (${imgData.category})`;

            imgThumbnail.appendChild(imgElement);
            imageGrid.appendChild(imgThumbnail);

            imgThumbnail.addEventListener('click', () => {
                openLightbox(index);
            });
        });
    }

    // Function to open the lightbox
    function openLightbox(index) {
        if (filteredImages.length === 0) return; // Prevent opening if no images
        lightbox.style.display = 'block';
        currentSlideIndex = index;
        lightboxImage.src = filteredImages[currentSlideIndex].src;
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    // Function to navigate slides
    window.plusSlides = function(n) {
        if (filteredImages.length === 0) return;
        currentSlideIndex += n;
        if (currentSlideIndex >= filteredImages.length) {
            currentSlideIndex = 0;
        }
        if (currentSlideIndex < 0) {
            currentSlideIndex = filteredImages.length - 1;
        }
        lightboxImage.src = filteredImages[currentSlideIndex].src;
    };

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (event) => {
        if (lightbox.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                plusSlides(-1);
            } else if (event.key === 'ArrowRight') {
                plusSlides(1);
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const category = button.dataset.category;
            loadImages(category); // Load images based on the selected category
        });
    });

    // Initial load of images (all categories)
    loadImages('all');
});