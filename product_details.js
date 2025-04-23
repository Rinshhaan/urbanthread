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

let counter = 0;
let slideInterval;
const slideSpeed = 3000; // Time in milliseconds between automatic slides
let isDragging = false;
let startX;
let scrollLeft;

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

let slideWidth = getSlideWidth();

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

// Initialize automatic sliding
startSlideInterval();

// Event listeners for manual navigation
nextSlideButton.addEventListener('click', nextSlide);
prevSlideButton.addEventListener('click', prevSlide);

// Touch and mouse drag functionality
productCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - productCarousel.offsetLeft;
    scrollLeft = productCarousel.scrollLeft;
    clearInterval(slideInterval); // Stop automatic sliding on interaction
    productCarousel.style.cursor = 'grabbing';
});

productCarousel.addEventListener('mouseleave', () => {
    isDragging = false;
    startSlideInterval(); // Restart automatic sliding after interaction
    productCarousel.style.cursor = 'grab';
});

productCarousel.addEventListener('mouseup', () => {
    isDragging = false;
    startSlideInterval(); // Restart automatic sliding after interaction
    productCarousel.style.cursor = 'grab';
});

productCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - productCarousel.offsetLeft;
    const walk = (x - startX) * 1; //scroll-fast
    productCarousel.scrollLeft = scrollLeft - walk;
});

productCarousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - productCarousel.offsetLeft;
    scrollLeft = productCarousel.scrollLeft;
    clearInterval(slideInterval); // Stop automatic sliding on interaction
});

productCarousel.addEventListener('touchend', () => {
    isDragging = false;
    startSlideInterval(); // Restart automatic sliding after interaction
});

productCarousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - productCarousel.offsetLeft;
    const walk = (x - startX) * 1;
    productCarousel.scrollLeft = scrollLeft - walk;
});

// Enhanced Try On UI
async function enableWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        webcamFeed.srcObject = stream;
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

wear3DButton.addEventListener('click', () => {
    const currentProductImage = carouselSlides[counter].querySelector('img').src;
    wear3DImageOverlay.src = currentProductImage;
    wear3DContainer.classList.add('active'); // Add active class to trigger animation
    enableWebcam();
    clearInterval(slideInterval);
});

closeWear3D.addEventListener('click', () => {
    wear3DContainer.classList.remove('active'); // Remove active class to trigger animation
    setTimeout(() => {
        wear3DContainer.style.display = 'none'; // Hide after fade out
        if (webcamFeed.srcObject) {
            webcamFeed.srcObject.getVideoTracks().forEach(track => track.stop());
            webcamFeed.srcObject = null;
        }
        startSlideInterval();
    }, 300); // Match the CSS transition duration
    wear3DContainer.style.display = 'flex'; // Ensure it's displayed before removing active class
});

overlayOpacity.addEventListener('input', () => {
    wear3DImageOverlay.style.opacity = overlayOpacity.value;
});

// Update slideWidth on window resize
window.addEventListener('resize', () => {
    slideWidth = getSlideWidth();
    slideTo(counter);
});




document.addEventListener('DOMContentLoaded', () => {
    // ... (rest of your DOM element selections) ...

    const addToCartButton = document.querySelector('.add-to-cart');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productName = document.getElementById('productTitle').textContent;
            const productPrice = parseFloat(document.getElementById('productPrice').textContent.replace('$', ''));
            let productImage = '';

            const productCarousel = document.getElementById('productCarousel');
            const carouselSlides = productCarousel ? productCarousel.querySelectorAll('.carousel-slide') : [];
            const currentSlideIndex = 0; // Assuming the first image is initially shown

            if (carouselSlides.length > 0) {
                const currentImageElement = carouselSlides[currentSlideIndex].querySelector('img');
                if (currentImageElement) {
                    productImage = currentImageElement.src;
                }
            } else {
                productImage = this.dataset.image || ''; // Fallback to data-image attribute
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
                updateCartCount(); // Make sure this function is defined and working
            } else {
                alert('Could not get product image.');
            }
        });
    } else {
        console.error("Add to Cart button element not found.");
    }

    function updateCartCount() {
        const cart = localStorage.getItem('cart');
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const itemCount = cart ? JSON.parse(cart).reduce((total, item) => total + item.quantity, 0) : 0;
            cartCountElement.textContent = itemCount;
        }
    }

    updateCartCount(); // Initial call
});


// Initialize carousel and indicators
initializeSlideIndicators();
slideTo(counter);