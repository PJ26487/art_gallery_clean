// Product data
const products = [
    {
        name: "Abstract Harmony",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1579546929518-9e396a3c809a?w=500&h=500&fit=crop",
        description: "A vibrant abstract piece that captures the essence of modern art."
    },
    {
        name: "Mountain Serenity",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
        description: "A breathtaking landscape capturing the majesty of mountain ranges."
    },
    {
        name: "Urban Dreams",
        price: 279.99,
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&h=500&fit=crop",
        description: "Contemporary urban art that reflects the energy of city life."
    },
    {
        name: "Color Symphony",
        price: 329.99,
        image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&h=500&fit=crop",
        description: "A harmonious blend of colors creating a visual symphony."
    },
    {
        name: "Ocean Waves",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1579546929518-9e396a3c809a?w=500&h=500&fit=crop",
        description: "Capturing the raw power and beauty of ocean waves in motion."
    },
    {
        name: "Desert Mirage",
        price: 289.99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
        description: "A surreal depiction of desert landscapes and mirages."
    },
    {
        name: "City Lights",
        price: 359.99,
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&h=500&fit=crop",
        description: "The vibrant energy of city nightlife captured in stunning detail."
    },
    {
        name: "Forest Dreams",
        price: 319.99,
        image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&h=500&fit=crop",
        description: "A mystical journey through enchanted forest landscapes."
    },
    {
        name: "Sunset Serenade",
        price: 379.99,
        image: "https://images.unsplash.com/photo-1579546929518-9e396a3c809a?w=500&h=500&fit=crop",
        description: "The magical colors of sunset painted with masterful strokes."
    },
    {
        name: "Winter Wonderland",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
        description: "A serene winter landscape that captures the quiet beauty of snow."
    },
    {
        name: "Spring Blossoms",
        price: 329.99,
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&h=500&fit=crop",
        description: "The vibrant colors of spring flowers in full bloom."
    },
    {
        name: "Summer Breeze",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&h=500&fit=crop",
        description: "The warmth and energy of summer captured in vibrant colors."
    },
    {
        name: "Autumn Leaves",
        price: 289.99,
        image: "https://images.unsplash.com/photo-1579546929518-9e396a3c809a?w=500&h=500&fit=crop",
        description: "The rich colors of autumn foliage in a stunning composition."
    },
    {
        name: "Starry Night",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
        description: "A mesmerizing depiction of the night sky filled with stars."
    },
    {
        name: "Morning Mist",
        price: 319.99,
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&h=500&fit=crop",
        description: "The ethereal beauty of morning mist over tranquil landscapes."
    },
    {
        name: "Rainbow Dreams",
        price: 359.99,
        image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&h=500&fit=crop",
        description: "A vibrant celebration of colors in a dreamlike composition."
    },
    {
        name: "Mountain Peak",
        price: 379.99,
        image: "https://images.unsplash.com/photo-1579546929518-9e396a3c809a?w=500&h=500&fit=crop",
        description: "The majestic beauty of mountain peaks reaching for the sky."
    },
    {
        name: "Ocean Depths",
        price: 329.99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
        description: "The mysterious beauty of the ocean's depths revealed."
    },
    {
        name: "Desert Storm",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=500&h=500&fit=crop",
        description: "The raw power of nature in a desert storm captured on canvas."
    }
];

// Function to generate product cards
function generateProductCards() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="product-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </a>
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <p class="description">${product.description}</p>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(this)">-</button>
                <input type="number" class="quantity-input" value="1" min="1">
                <button class="quantity-btn" onclick="increaseQuantity(this)">+</button>
            </div>
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price}, this)">Add to Cart</button>
        </div>
    `).join('');
    
    // Call observeElements from script.js *after* cards are added to the DOM
    if (typeof observeElements === 'function') {
        observeElements();
    } else {
        console.warn('observeElements function not found. Animations might not apply correctly.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', generateProductCards); 