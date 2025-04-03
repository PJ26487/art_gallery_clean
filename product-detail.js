// Get product details from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productName = decodeURIComponent(urlParams.get('name'));
const productPrice = urlParams.get('price');
const productImage = decodeURIComponent(urlParams.get('image'));
const productDescription = decodeURIComponent(urlParams.get('description'));

// Note: Cart logic (cartCount, cartItems, updateCartCount, addToCartAnimation, showNotification) 
// is now primarily handled in script.js for consistency.

// Initialize product details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate product details
    if (productName && productPrice && productImage && productDescription) {
        document.getElementById('product-title').textContent = productName;
        document.getElementById('product-price').textContent = `$${productPrice}`;
        
        // Handle image display
        const productImageElement = document.getElementById('product-image');
        productImageElement.src = productImage;
        productImageElement.alt = productName;
        productImageElement.onerror = function() {
            console.error('Failed to load image:', productImage);
            // Use a relative path for the placeholder if it exists locally, or keep the external one.
            this.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available'; 
        };
        
        document.getElementById('product-description').textContent = productDescription;
        
        // Update cart count display (using the global function from script.js)
        if (typeof updateCartCount === 'function') {
             updateCartCount();
        }
        
        // Add event listeners for quantity buttons (using global functions)
        const decreaseBtn = document.querySelector('.quantity-btn:nth-child(1)');
        const increaseBtn = document.querySelector('.quantity-btn:nth-child(3)');
        if (decreaseBtn) decreaseBtn.addEventListener('click', () => decreaseQuantity(decreaseBtn));
        if (increaseBtn) increaseBtn.addEventListener('click', () => increaseQuantity(increaseBtn));
        
        // Add event listener for add to cart button (using the global function)
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
             addToCartBtn.addEventListener('click', () => addToCart(productName, productPrice, addToCartBtn));
        }
    } else {
        // Redirect to products page if product details are missing
        console.warn('Product details missing from URL, redirecting to products page.');
        window.location.href = 'products.html';
    }
}); 