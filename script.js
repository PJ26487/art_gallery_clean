// ===== Cart Persistence =====
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Initialize full cart items array

// Function to update cart count display AND save full state to localStorage
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    // Save both count and items to localStorage
    localStorage.setItem('cartCount', cartCount);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log(`[script.js] Cart state updated: Count=${cartCount}`);
}

// ===== Cart Interaction Functions =====

// Add to cart animation
function addToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => {
            cartIcon.classList.remove('bounce');
        }, 1000);
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification first to prevent stacking
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger fade in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10); // Shorter delay

    // Start fade out timer
    setTimeout(() => {
        notification.classList.remove('show');
        // Remove from DOM after fade out
        setTimeout(() => {
            if (document.body.contains(notification)) {
                 document.body.removeChild(notification);
            }
        }, 500); // Matches transition duration
    }, 3000); // Notification visible duration
}

// Quantity control functions
function increaseQuantity(button) {
    // Find the quantity input related to the button clicked
    const quantityInput = button.closest('.quantity-controls')?.querySelector('.quantity-input');
    if (quantityInput) {
        let currentVal = parseInt(quantityInput.value);
        if (isNaN(currentVal)) currentVal = 0;
        quantityInput.value = currentVal + 1;
    }
}

function decreaseQuantity(button) {
    // Find the quantity input related to the button clicked
    const quantityInput = button.closest('.quantity-controls')?.querySelector('.quantity-input');
    if (quantityInput) {
        let currentVal = parseInt(quantityInput.value);
        // Allow decreasing down to 1
        if (!isNaN(currentVal) && currentVal > 1) {
            quantityInput.value = currentVal - 1;
        }
    }
}

// Add to cart function (handles quantity)
function addToCart(productName, price, buttonOrElement) {
    let quantity = 1;
    // Find quantity input relative to the button/element clicked
    const quantityControlsContainer = buttonOrElement?.closest('.product-card, .product-info');
    const quantityInput = quantityControlsContainer?.querySelector('.quantity-input');

    if (quantityInput) {
        quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1; // Default to 1 if parsing fails or value is invalid
        }
    }

    let productImage = '';
    let productDescription = '';
    // Safely check if 'products' array exists (defined in products.js)
    if (typeof window.products !== 'undefined' && Array.isArray(window.products)) {
        const productDetails = window.products.find(p => p.name === productName);
        if (productDetails) {
            productImage = productDetails.image || '';
            productDescription = productDetails.description || '';
        }
    } else {
         // Log warning only if we expect products array to be present
         if (window.location.pathname.includes('products.html')) {
            console.warn("[script.js] 'products' array not found. Cannot add image/description to cart item.");
         }
    }

    for (let i = 0; i < quantity; i++) {
        cartCount++;
        // Define item object separately
        const newItem = {
            name: productName,
            price: parseFloat(price || 0),
            image: productImage,
            description: productDescription
        };
        // Push the variable
        cartItems.push(newItem);
    }

    updateCartCount(); // Update count, items array, and localStorage
    addToCartAnimation();
    showNotification(`${quantity} ${productName}(s) added to cart!`);
}

// Function to remove an item from the cart (used by checkout.js)
function removeItem(index) {
    if (typeof cartItems !== 'undefined' && Array.isArray(cartItems) && index >= 0 && index < cartItems.length) {
        console.log(`[script.js] Removing item at index: ${index}`);
        cartItems.splice(index, 1);
        cartCount = cartItems.length; // Recalculate count based on modified array

        updateCartCount(); // Update count display and save new state to localStorage

        // If displayCartItems function exists (on checkout page), call it to refresh view
        if (typeof displayCartItems === 'function') {
            console.log("[script.js] Calling displayCartItems() to refresh checkout view.");
            displayCartItems();
        }
    } else {
        console.error(`[script.js] Invalid index (${index}) or cartItems array not available for removal.`);
    }
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault(); // Prevent default only for valid hash links
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                     console.warn(`[script.js] Smooth scroll target not found: ${targetId}`);
                }
            } catch (error) {
                 console.error(`[script.js] Invalid selector for smooth scroll: ${targetId}`, error);
            }
        } 
        // Allow default behavior for non-hash links or links like href="#"
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1 // Trigger when 10% is visible
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            obs.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Function to find and observe elements that need animating
function observeElements() {
    // Include product-card for the products page
    const elementsToAnimate = document.querySelectorAll('.offer-card, .artist-card, .product-card');
    console.log(`[script.js] Found ${elementsToAnimate.length} elements to observe for animation.`);
    elementsToAnimate.forEach(element => {
        // Check if already animated to avoid re-observing needlessly
        if (!element.classList.contains('animate')) {
            observer.observe(element);
        }
    });
}

// ===== Mobile Menu Toggle =====
function setupMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) {
        console.warn("[script.js] Nav element not found for mobile menu setup.");
        return;
    }

    // Avoid adding multiple buttons
    let mobileMenuButton = nav.querySelector('.mobile-menu-button');
    if (!mobileMenuButton) {
        mobileMenuButton = document.createElement('button');
        mobileMenuButton.classList.add('mobile-menu-button');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuButton.setAttribute('aria-label', 'Toggle menu');
        mobileMenuButton.type = 'button'; // Good practice for buttons
        nav.appendChild(mobileMenuButton);

        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            mobileMenuButton.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                console.log("[script.js] Mobile menu toggled.");
            });
        } else {
             console.warn("[script.js] .nav-links element not found for mobile menu button.");
        }
    } 
}

// ===== Dynamic CSS Injection =====
function injectBaseCSS() {
    // Avoid injecting multiple times
    if (document.getElementById('dynamic-styles')) return;

    const style = document.createElement('style');
    style.id = 'dynamic-styles'; // Add an ID to check for existence
    style.textContent = `
        /* Base Animation Styles */
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* Elements that animate */
        .offer-card, .artist-card, .product-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        /* --- Product Card Specific Styles --- */
         .product-card {
             position: relative;
             display: flex; 
             flex-direction: column; 
             justify-content: space-between; 
             height: 100%; 
             background-color: #fff; 
             border-radius: 8px; 
             box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
             overflow: hidden; 
             margin-bottom: 1.5rem; 
         }
         .product-card > *:not(a):not(img) { /* Apply padding to children except link and image */
             padding-left: 1rem;
             padding-right: 1rem;
         }
          .product-card h3 {
             margin-top: 1rem;
             margin-bottom: 0.5rem;
             font-size: 1.1rem;
         }
          .product-card p.price {
             font-weight: bold;
             color: #e74c3c;
             margin-bottom: 0.5rem;
         }
          .product-card p.description {
             font-size: 0.9rem;
             color: #555;
             flex-grow: 1; 
             margin-bottom: 1rem;
             line-height: 1.4;
         }
         .product-card a {
             text-decoration: none;
             color: inherit;
             display: block; 
             padding: 0;
         }
         .product-card img {
             width: 100%;
             height: 200px; 
             object-fit: cover;
             border-radius: 0;
             border-bottom: 1px solid #eee; 
             display: block;
             transition: transform 0.3s ease;
             padding: 0;
         }
         .product-card img:hover {
             transform: scale(1.05);
         }
         .product-card .quantity-controls {
             display: flex;
             align-items: center;
             justify-content: center;
             margin: 0 0 1rem 0; 
             padding: 0 1rem;
         }
         .product-card .quantity-btn {
             background: #f0f0f0;
             color: #333;
             border: 1px solid #ccc;
             width: 30px;
             height: 30px;
             font-size: 1.2rem;
             font-weight: bold;
             cursor: pointer;
             display: flex;
             align-items: center;
             justify-content: center;
             border-radius: 4px;
             line-height: 1;
             transition: background-color 0.2s ease;
         }
         .product-card .quantity-btn:hover {
             background-color: #e0e0e0;
         }
         .product-card .quantity-input {
             width: 45px;
             height: 30px;
             text-align: center;
             margin: 0 0.5rem;
             border: 1px solid #ccc;
             border-radius: 4px;
             -moz-appearance: textfield;
             font-size: 1rem;
         }
         .product-card .quantity-input::-webkit-outer-spin-button,
         .product-card .quantity-input::-webkit-inner-spin-button {
             -webkit-appearance: none;
             margin: 0;
         }
         .product-card .add-to-cart {
             width: calc(100% - 2rem); 
             margin: 0 1rem 1rem 1rem; 
             padding: 0.75rem;
             background: #e74c3c;
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
             font-size: 1rem;
             font-weight: bold;
             text-align: center;
             transition: background 0.3s ease;
         }
         .product-card .add-to-cart:hover {
             background: #c0392b;
         }

        /* --- Notification Styles --- */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2c3e50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateY(150%);
            opacity: 0;
            transition: transform 0.4s ease-out, opacity 0.4s ease-out;
            z-index: 1050;
            font-size: 0.95rem;
        }
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        /* --- Remove Button (Checkout) Styles --- */
        .remove-item-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            cursor: pointer;
            border-radius: 4px;
            transition: background 0.3s ease;
            margin-left: 1rem;
        }
        .remove-item-btn:hover {
            background: #c0392b;
        }

        /* --- Mobile Menu Styles --- */
        .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            color: #2c3e50;
            font-size: 1.5rem;
            cursor: pointer;
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1100;
        }
        @media (max-width: 768px) {
            .nav-links {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #ffffff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                padding: 1rem 0;
                z-index: 1000;
            }
            .nav-links.active {
                display: flex;
            }
            .nav-links li {
                text-align: center;
                margin: 1rem 0;
                width: 100%;
            }
            .nav-links a {
                 display: block;
                 padding: 0.5rem 0;
            }
            .mobile-menu-button {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    console.log("[script.js] DOMContentLoaded event fired - Initializing...");

    try {
        injectBaseCSS();
    } catch (e) {
        console.error("[script.js] Error injecting base CSS:", e);
    }

    try {
        // Use the full updateCartCount function now, which also saves state
        updateCartCount();
    } catch (e) {
        console.error("[script.js] Error updating cart count/state:", e);
    }

    try {
        // Observe elements on all pages (including product cards)
        observeElements();
    } catch (e) {
        console.error("[script.js] Error setting up animation observer:", e);
    }

    try {
        setupMobileMenu();
    } catch (e) {
        console.error("[script.js] Error setting up mobile menu:", e);
    }

    console.log("[script.js] Initialization complete.");
}); 