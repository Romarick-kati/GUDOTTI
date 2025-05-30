let products = [
    {
        id: 1,
        name: "John Deere Tractor",
        category: "equipment",
        description: "Heavy-duty farming tractor for large-scale operations",
        quantity: 3,
        price: 45000,
        status: "active",
        icon: "🚜"
    },
    {
        id: 2,
        name: "Organic Fertilizer",
        category: "supplies",
        description: "Natural nutrient-rich fertilizer for sustainable farming",
        quantity: 150,
        price: 25.99,
        status: "active",
        icon: "🌱"
    },
    {
        id: 3,
        name: "Holstein Cattle",
        category: "livestock",
        description: "High-quality dairy cattle known for milk production",
        quantity: 25,
        price: 1500,
        status: "active",
        icon: "🐄"
    },
    {
        id: 4,
        name: "Corn Seeds",
        category: "crops",
        description: "Premium hybrid corn seeds for optimal yield",
        quantity: 8,
        price: 120,
        status: "low",
        icon: "🌽"
    },
    {
        id: 5,
        name: "Irrigation System",
        category: "equipment",
        description: "Automated sprinkler system for efficient water management",
        quantity: 0,
        price: 3500,
        status: "out",
        icon: "💧"
    },
    {
        id: 6,
        name: "Feed Pellets",
        category: "supplies",
        description: "Nutritious feed pellets for livestock",
        quantity: 200,
        price: 18.50,
        status: "active",
        icon: "🥄"
    },
    {
        id: 7,
        name: "Wheat Seeds",
        category: "crops",
        description: "High-yield winter wheat variety",
        quantity: 45,
        price: 85,
        status: "active",
        icon: "🌾"
    },
    {
        id: 8,
        name: "Harvester",
        category: "equipment",
        description: "Combine harvester for grain crops",
        quantity: 1,
        price: 75000,
        status: "active",
        icon: "⚙️"
    }
];

let filteredProducts = [...products];
let currentFilter = 'all';

// DOM elements
const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const addProductBtn = document.getElementById('addProductBtn');
const modal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const productForm = document.getElementById('productForm');
const noResults = document.getElementById('noResults');

// Initialize
renderProducts();
updateStats();

// Event listeners
searchInput.addEventListener('input', handleSearch);
filterButtons.forEach(btn => btn.addEventListener('click', handleFilter));
addProductBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);
productForm.addEventListener('submit', handleAddProduct);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalHandler();
});

function renderProducts() {
    catalogGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        catalogGrid.appendChild(productCard);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const statusClass = `status-${product.status}`;
    const statusText = {
        'active': 'In Stock',
        'low': 'Low Stock',
        'out': 'Out of Stock'
    }[product.status];

    card.innerHTML = `
        <div class="product-header">
            <div class="product-icon">${product.icon}</div>
            <div class="product-status ${statusClass}">${statusText}</div>
        </div>
        <div class="product-title">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-details">
            <div class="detail-item">
                <div class="detail-label">Quantity</div>
                <div class="detail-value">${product.quantity}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Price</div>
                <div class="detail-value">$${product.price.toLocaleString()}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Value</div>
                <div class="detail-value">$${(product.quantity * product.price).toLocaleString()}</div>
            </div>
        </div>
        <div class="product-actions">
            <button class="action-btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
            <button class="action-btn btn-secondary" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
    `;

    // Add click animation
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('action-btn')) {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        }
    });

    return card;
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    applyFilters(searchTerm, currentFilter);
}

function handleFilter(e) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    applyFilters(searchInput.value.toLowerCase(), currentFilter);
}

function applyFilters(searchTerm, filter) {
    filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        const matchesFilter = filter === 'all' || product.category === filter;
        
        return matchesSearch && matchesFilter;
    });
    
    renderProducts();
    updateStats();
}

function updateStats() {
    const totalItems = products.length;
    const activeItems = products.filter(p => p.status === 'active').length;
    const lowStockItems = products.filter(p => p.status === 'low' || p.status === 'out').length;
    
    animateCounter('totalItems', totalItems);
    animateCounter('activeItems', activeItems);
    animateCounter('lowStockItems', lowStockItems);
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
}

function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    productForm.reset();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(productForm);
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        status: parseInt(document.getElementById('productQuantity').value) > 10 ? 'active' : 
               parseInt(document.getElementById('productQuantity').value) > 0 ? 'low' : 'out',
        icon: getCategoryIcon(document.getElementById('productCategory').value)
    };
    
    products.push(newProduct);
    applyFilters(searchInput.value.toLowerCase(), currentFilter);
    closeModalHandler();
    
    // Success animation
    showNotification('Product added successfully!', 'success');
}

function getCategoryIcon(category) {
    const icons = {
        'equipment': '⚙️',
        'supplies': '📦',
        'livestock': '🐄',
        'crops': '🌾'
    };
    return icons[category] || '📦';
}

function editProduct(id) {
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        applyFilters(searchInput.value.toLowerCase(), currentFilter);
        showNotification('Product deleted successfully!', 'success');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e