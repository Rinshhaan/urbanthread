document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartCountElement = document.getElementById('cartCount'); // For navbar cart count

    function updateCartCount() {
        const cart = localStorage.getItem('cart');
        const itemCount = cart ? JSON.parse(cart).reduce((total, item) => total + item.quantity, 0) : 0;
        if (cartCountElement) {
            cartCountElement.textContent = itemCount;
        }
    }

    function displayCart() {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTotalElement.textContent = '$0.00';
            updateCartCount(); // Update cart count when cart is empty
            return;
        } else {
            emptyCartMessage.style.display = 'none';
        }

        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('item-image');
            const image = document.createElement('img');
            image.src = item.image;
            image.alt = item.name;
            imageDiv.appendChild(image);

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('item-details');
            const namePara = document.createElement('p');
            namePara.classList.add('item-name');
            namePara.textContent = item.name;
            const pricePara = document.createElement('p');
            pricePara.classList.add('item-price');
            pricePara.textContent = `$${item.price.toFixed(2)}`;

            detailsDiv.appendChild(namePara);
            detailsDiv.appendChild(pricePara);

            const quantityControlsDiv = document.createElement('div');
            quantityControlsDiv.classList.add('item-quantity-controls');
            const decreaseButton = document.createElement('button');
            decreaseButton.classList.add('quantity-button');
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => updateQuantity(index, item.quantity - 1));
            const quantitySpan = document.createElement('span');
            quantitySpan.classList.add('item-quantity');
            quantitySpan.textContent = item.quantity;
            const increaseButton = document.createElement('button');
            increaseButton.classList.add('quantity-button');
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => updateQuantity(index, item.quantity + 1));

            quantityControlsDiv.appendChild(decreaseButton);
            quantityControlsDiv.appendChild(quantitySpan);
            quantityControlsDiv.appendChild(increaseButton);

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            removeButton.addEventListener('click', () => removeItem(index));

            cartItemDiv.appendChild(imageDiv);
            cartItemDiv.appendChild(detailsDiv);
            cartItemDiv.appendChild(quantityControlsDiv);
            cartItemDiv.appendChild(removeButton);

            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        updateCartCount(); // Update cart count after displaying items
    }
    

    function updateQuantity(itemIndex, newQuantity) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount(); // Update cart count after quantity change
    }

    function removeItem(itemIndex) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount(); // Update cart count after removing item
    }

    displayCart(); // Initial display of cart items on page load
    updateCartCount(); // Initial update of cart count in navbar
});