document.addEventListener('DOMContentLoaded', () => {
    const productCarousel = document.getElementById('productCarousel');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevSlideButton = document.getElementById('prevSlide');
    const nextSlideButton = document.getElementById('nextSlide');
    const slideIndicatorsContainer = document.getElementById('slideIndicators');
    const wear3DButton = document.getElementById('wear3DButton');
    const wear3DContainer = document.getElementById('wear3DContainer');
    const closeWear3D = document.getElementById('closeWear3D');
    const webcamFeed = document.getElementById('webcamFeed');
    const wear3DImageOverlay = document.getElementById('wear3DImageOverlay');
    const overlayOpacity = document.getElementById('overlayOpacity');
    const addToCartButton = document.querySelector('.add-to-cart');
    const cartCountElement = document.getElementById('cartCount');
    const productTitleElement = document.getElementById('productTitle');
    const productPriceElement = document.getElementById('productPrice');

    let counter = 0;
    let slideInterval;
    const slideSpeed = 3000;
    let isDragging = false;
    let startX;
    let scrollLeft;
    let slideWidth = carouselSlides.length > 0 ? carouselSlides[0].offsetWidth : 0;

    // Initialize slide indicators
    function initializeSlideIndicators() {
        carouselSlides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.addEventListener('click', () => {
                counter = index;
                slideTo(counter);
                updateSlideIndicators();
                resetSlideInterval();
            });
            slideIndicatorsContainer.appendChild(indicator);
        });
        updateSlideIndicators();
    }

    function updateSlideIndicators() {
        const indicators = slideIndicatorsContainer.querySelectorAll('span');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === counter) {
                indicator.classList.add('active');
            }
        });
    }

    // Get the width of a single slide
    function getSlideWidth() {
        return carouselSlides[0].offsetWidth;
    }

    // Function to move the carousel to a specific slide
    function slideTo(index) {
        productCarousel.style.transform = `translateX(${-slideWidth * index}px)`;
    }

    // Next slide
    function nextSlide() {
        counter++;
        if (counter === carouselSlides.length) {
            counter = 0; // Loop back to the first slide
        }
        slideTo(counter);
        updateSlideIndicators();
        resetSlideInterval();
    }

    // Previous slide
    function prevSlide() {
        counter--;
        if (counter < 0) {
            counter = carouselSlides.length - 1; // Loop to the last slide
        }
        slideTo(counter);
        updateSlideIndicators();
        resetSlideInterval();
    }

    // Automatic sliding functionality
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, slideSpeed);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    async function enableWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            webcamFeed.srcObject = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    function updateCartCount() {
        const cart = localStorage.getItem('cart');
        if (cartCountElement) {
            const itemCount = cart ? JSON.parse(cart).reduce((total, item) => total + item.quantity, 0) : 0;
            cartCountElement.textContent = itemCount;
        }
    }

    // Event listeners
    if (productCarousel) {
        nextSlideButton.addEventListener('click', nextSlide);
        prevSlideButton.addEventListener('click', prevSlide);

        productCarousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - productCarousel.offsetLeft;
            scrollLeft = productCarousel.scrollLeft;
            clearInterval(slideInterval);
            productCarousel.style.cursor = 'grabbing';
        });

        productCarousel.addEventListener('mouseleave', () => {
            isDragging = false;
            startSlideInterval();
            productCarousel.style.cursor = 'grab';
        });

        productCarousel.addEventListener('mouseup', () => {
            isDragging = false;
            startSlideInterval();
            productCarousel.style.cursor = 'grab';
        });

        productCarousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.pageX - productCarousel.offsetLeft;
            const walk = (x - startX) * 1;
            productCarousel.scrollLeft = scrollLeft - walk;
        });

        productCarousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - productCarousel.offsetLeft;
            scrollLeft = productCarousel.scrollLeft;
            clearInterval(slideInterval);
        });

        productCarousel.addEventListener('touchend', () => {
            isDragging = false;
            startSlideInterval();
        });

        productCarousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - productCarousel.offsetLeft;
            const walk = (x - startX) * 1;
            productCarousel.scrollLeft = scrollLeft - walk;
        });

        initializeSlideIndicators();
        slideTo(counter);
        startSlideInterval();
    }

    if (wear3DButton && wear3DContainer && closeWear3D && wear3DImageOverlay && overlayOpacity && productCarousel) {
        wear3DButton.addEventListener('click', () => {
            const currentProductImage = carouselSlides[counter].querySelector('img').src;
            wear3DImageOverlay.src = currentProductImage;
            wear3DContainer.classList.add('active');
            enableWebcam();
            clearInterval(slideInterval);
        });

        closeWear3D.addEventListener('click', () => {
            wear3DContainer.classList.remove('active');
            setTimeout(() => {
                wear3DContainer.style.display = 'none';
                if (webcamFeed.srcObject) {
                    webcamFeed.srcObject.getVideoTracks().forEach(track => track.stop());
                    webcamFeed.srcObject = null;
                }
                startSlideInterval();
            }, 300);
            wear3DContainer.style.display = 'flex';
        });

        overlayOpacity.addEventListener('input', () => {
            wear3DImageOverlay.style.opacity = overlayOpacity.value;
        });
    }

    window.addEventListener('resize', () => {
        if (carouselSlides.length > 0) {
            slideWidth = getSlideWidth();
            slideTo(counter);
        }
    });

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productName = productTitleElement.textContent;
            const productPrice = parseFloat(productPriceElement.textContent.replace('$', ''));
            let productImage = '';

            if (carouselSlides.length > 0) {
                const currentImageElement = carouselSlides[counter].querySelector('img');
                if (currentImageElement) {
                    productImage = currentImageElement.src;
                }
            } else {
                productImage = this.dataset.image || '';
            }

            if (productImage) {
                const cartItem = {
                    id: Math.random().toString(36).substring(7),
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };

                let cart = localStorage.getItem('cart');
                cart = cart ? JSON.parse(cart) : [];

                const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.name === productName);

                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity++;
                } else {
                    cart.push(cartItem);
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${productName} added to cart!`);
                updateCartCount();
            } else {
                alert('Could not get product image.');
            }
        });
    } else {
        console.error("Add to Cart button element not found.");
    }

    updateCartCount(); // Initial call
});
