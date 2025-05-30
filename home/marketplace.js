const products = [
    {
        id: 1,
        name: "Organic Tomato Seeds",
        description: "High-yield organic tomato seeds perfect for greenhouse and outdoor cultivation.",
        price: 15.99,
        category: "seeds",
        rating: 4.8,
        icon: "🍅",
        badge: "Organic"
    },
    {
        id: 2,
        name: "Professional Pruning Shears",
        description: "Durable steel pruning shears with ergonomic grip for precision cutting.",
        price: 45.00,
        category: "tools",
        rating: 4.6,
        icon: "✂️",
        badge: "Best Seller"
    },
    {
        id: 3,
        name: "Bio-Fertilizer Concentrate",
        description: "Eco-friendly fertilizer concentrate that boosts plant growth naturally.",
        price: 28.50,
        category: "fertilizers",
        rating: 4.7,
        icon: "🌿",
        badge: "Eco-Friendly"
    },
    {
        id: 4,
        name: "Smart Irrigation Controller",
        description: "IoT-enabled irrigation system with weather monitoring and mobile app control.",
        price: 299.99,
        category: "equipment",
        rating: 4.9,
        icon: "💧",
        badge: "Smart Tech"
    },
    {
        id: 5,
        name: "Free-Range Chickens",
        description: "Healthy laying hens, perfect for small to medium farms. Price per bird.",
        price: 25.00,
        category: "livestock",
        rating: 4.5,
        icon: "🐔",
        badge: "Live Stock"
    },
    {
        id: 6,
        name: "Farm Consultation Service",
        description: "Professional agricultural consultation to optimize your farm's productivity.",
        price: 150.00,
        category: "services",
        rating: 4.8,
        icon: "👨‍🌾",
        badge: "Expert"
    },
    {
        id: 7,
        name: "Corn Seed Variety Pack",
        description: "Mixed variety pack of sweet corn seeds for diverse harvest options.",
        price: 22.75,
        category: "seeds",
        rating: 4.4,
        icon: "🌽",
        badge: "Variety"
    },
    {
        id: 8,
        name: "Heavy-Duty Tractor Plow",
        description: "Professional-grade plow attachment suitable for large tractors.",
        price: 1250.00,
        category: "equipment",
        rating: 4.7,
        icon: "🚜",
        badge: "Heavy Duty"
    },
    {
        id: 9,
        name: "Greenhouse Thermometer",
        description: "Digital min/max thermometer with humidity sensor for greenhouse monitoring.",
        price: 35.99,
        category: "tools",
        rating: 4.3,
        icon: "🌡️",
        badge: "Digital"
    }
];

let cart = [];
let filteredProducts = [...products];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');

// Initialize the marketplace
function init() {
    renderProducts();
    setupEventListeners();
    updateCartUI();
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    applyFilters();
}

// Apply filters and sorting
function applyFilters() {
    let filtered = [...filteredProducts];

    // Category filter
    const category = categoryFilter.value;
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }

    // Price filter
    const priceRange = priceFilter.value;
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        filtered = filtered.filter(product => {
            if (max) {
                return product.price >= parseFloat(min) && product.price <= parseFloat(max);
            } else {
                return product.price >= parseFloat(min);
            }
        });
    }

    // Sorting
    const sortBy = sortFilter.value;
    switch (sortBy) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }

    renderProducts(filtered);
}

// Render products
function renderProducts(productsToRender = products) {
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" style="animation-delay: ${Math.random() * 0.5}s">
            <div class="product-image">
                <span style="font-size: 4rem;">${product.icon}</span>
                <div class="product-badge">${product.badge}</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div style="margin-bottom: 15px; color: #666;">
                    ⭐ ${product.rating}/5.0 rating
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="viewDetails(${product.id})">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showAddToCartAnimation();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Show add to cart animation
function showAddToCartAnimation() {
    cartCount.style.animation = 'none';
    setTimeout(() => {
        cartCount.style.animation = 'pulse 0.6s ease-out';
    }, 10);
}

// Open cart modal
function openCart() {
    cartModal.style.display = 'block';
    renderCartItems();
}

// Close cart modal
function closeCart() {
    cartModal.style.display = 'none';
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-item">Your cart is empty</div>';
        totalPrice.textContent = 'Total: $0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" 
                        style="background: #ff4444; color: white; border: none; 
                               border-radius: 50%; width: 25px; height: 25px; 
                               cursor: pointer; font-size: 14px;">×</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `Total: $${total.toFixed(2)}`;
}

// View product details
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.name}\n\n${product.description}\n\nPrice: $${product.price}\nRating: ${product.rating}/5.0\nCategory: ${product.category}`);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nOrder Summary:\n${cart.map(item => `${item.name} x${item.quantity}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`);
    
    // Clear cart
    cart = [];
    updateCartUI();
    closeCart();
}

// Initialize the marketplace when page loads
document.addEventListener('DOMContentLoaded', init);