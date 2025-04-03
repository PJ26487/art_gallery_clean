// Function to display cart items
function displayCartItems() {
    // Read the LATEST cart items from localStorage *inside* the function
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.querySelector('.checkout-button');
    
    if (!cartItemsList || !cartTotalElement || !checkoutButton) {
        console.error("Checkout page elements not found.");
        return;
    }
    
    cartItemsList.innerHTML = ''; // Clear previous items
    let totalCost = 0;

    if (currentCartItems.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotalElement.textContent = 'Total: $0.00';
        checkoutButton.disabled = true;
        checkoutButton.style.opacity = 0.5;
        checkoutButton.style.cursor = 'not-allowed';
    } else {
        currentCartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            // IMPORTANT: Use the global removeItem function directly
            itemElement.innerHTML = ` 
                <img src="${item.image || ''}" alt="${item.name || 'Product'}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80x80?text=No+Image'">
                <div class="item-details">
                    <h3>${item.name || 'Unknown Item'}</h3>
                    <p>$${item.price ? item.price.toFixed(2) : '0.00'}</p>
                </div>
                <button class="remove-item-btn" onclick="removeItem(${index})">Remove</button>
            `;
            cartItemsList.appendChild(itemElement);
            totalCost += item.price || 0;
        });

        cartTotalElement.textContent = `Total: $${totalCost.toFixed(2)}`;
        checkoutButton.disabled = false;
        checkoutButton.style.opacity = 1;
        checkoutButton.style.cursor = 'pointer';
    }
    console.log("Cart items displayed.");
}

// Remove the wrapper function - no longer needed
/*
function removeItemFromCheckout(index) {
    if (typeof removeItem === 'function') {
        removeItem(index); 
        // Refresh handled by the global removeItem calling displayCartItems
    } else {
        console.error('Global removeItem function not found.');
    }
}
*/

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Checkout page DOM loaded, displaying cart items.");
    displayCartItems();
    // Cart count display is handled by the global script.js now
});

// Note: CSS for remove button is now included in script.js 