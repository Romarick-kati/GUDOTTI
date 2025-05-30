let inventory = [];
let currentFilter = 'all';
let editingId = null;

// Sample data
const sampleData = [
    { id: 1, name: 'Corn Seeds', category: 'seeds', quantity: 50, unit: 'bags', price: 25.50, supplier: 'AgriCorp', location: 'Warehouse A', notes: 'High yield variety' },
    { id: 2, name: 'NPK Fertilizer', category: 'fertilizers', quantity: 25, unit: 'bags', price: 45.00, supplier: 'FarmSupply Co', location: 'Storage Room', notes: '20-20-20 formula' },
    { id: 3, name: 'John Deere Tractor', category: 'equipment', quantity: 1, unit: 'units', price: 35000, supplier: 'John Deere', location: 'Equipment Shed', notes: 'Model 5055E' },
    { id: 4, name: 'Holstein Cows', category: 'livestock', quantity: 15, unit: 'units', price: 1500, supplier: 'Local Farm', location: 'Pasture 1', notes: 'Dairy cattle' },
    { id: 5, name: 'Tomato Seeds', category: 'seeds', quantity: 8, unit: 'kg', price: 12.75, supplier: 'SeedMart', location: 'Cold Storage', notes: 'Cherry variety' },
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    inventory = [...sampleData];
    renderInventory();
    updateStats();
});

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const filteredItems = currentFilter === 'all' 
        ? inventory 
        : inventory.filter(item => item.category === currentFilter);

    grid.innerHTML = '';

    filteredItems.forEach(item => {
        const itemElement = createInventoryItem(item);
        grid.appendChild(itemElement);
    });

    // Add animation delay for staggered effect
    const items = grid.querySelectorAll('.inventory-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'slideUp 0.5s ease forwards';
    });
}

function createInventoryItem(item) {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    
    const quantityClass = getQuantityClass(item.quantity, item.category);
    const categoryIcon = getCategoryIcon(item.category);
    const totalValue = (item.quantity * (item.price || 0)).toFixed(2);

    div.innerHTML = `
        <div class="item-header">
            <div class="item-name">${categoryIcon} ${item.name}</div>
            <div class="item-actions">
                <button class="action-btn edit-btn" onclick="editItem(${item.id})" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})" title="Delete">🗑️</button>
            </div>
        </div>
        <div class="item-details">
            <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value ${quantityClass}">${item.quantity} ${item.unit}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Price/Unit:</span>
                <span class="detail-value">$${(item.price || 0).toFixed(2)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Value:</span>
                <span class="detail-value">$${totalValue}</span>
            </div>
            ${item.supplier ? `
            <div class="detail-row">
                <span class="detail-label">Supplier:</span>
                <span class="detail-value">${item.supplier}</span>
            </div>` : ''}
            ${item.location ? `
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${item.location}</span>
            </div>` : ''}
        </div>
    `;

    return div;
}

function getCategoryIcon(category) {
    const icons = {
        seeds: '🌱',
        fertilizers: '🧪',
        equipment: '🚜',
        livestock: '🐄'
    };
    return icons[category] || '📦';
}

function getQuantityClass(quantity, category) {
    const thresholds = {
        seeds: { low: 10, medium: 30 },
        fertilizers: { low: 15, medium: 40 },
        equipment: { low: 1, medium: 3 },
        livestock: { low: 5, medium: 20 }
    };

    const threshold = thresholds[category] || { low: 10, medium: 30 };
    
    if (quantity <= threshold.low) return 'quantity-low';
    if (quantity <= threshold.medium) return 'quantity-medium';
    return 'quantity-high';
}

function updateStats() {
    const stats = {
        seeds: 0,
        fertilizers: 0,
        equipment: 0,
        livestock: 0,
        lowStock: 0
    };

    inventory.forEach(item => {
        stats[item.category]++;
        
        const thresholds = {
            seeds: 10,
            fertilizers: 15,
            equipment: 1,
            livestock: 5
        };

        if (item.quantity <= (thresholds[item.category] || 10)) {
            stats.lowStock++;
        }
    });

    document.getElementById('seeds-count').textContent = stats.seeds;
    document.getElementById('fertilizers-count').textContent = stats.fertilizers;
    document.getElementById('equipment-count').textContent = stats.equipment;
    document.getElementById('livestock-count').textContent = stats.livestock;
    document.getElementById('low-stock-count').textContent = stats.lowStock;

    // Add pulse animation to low stock if > 0
    const lowStockElement = document.getElementById('low-stock-count');
    if (stats.lowStock > 0) {
        lowStockElement.parentElement.classList.add('pulse');
    } else {
        lowStockElement.parentElement.classList.remove('pulse');
    }
}

function filterByCategory(category) {
    currentFilter = category;
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (category === 'all') {
        document.querySelector('.tab').classList.add('active');
    } else {
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.textContent.toLowerCase().includes(category)) {
                tab.classList.add('active');
            }
        });
    }

    renderInventory();
}

function openAddModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Add New Item';
    document.getElementById('item-form').reset();
    document.getElementById('item-modal').style.display = 'block';
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Item';
    
    // Populate form
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-unit').value = item.unit;
    document.getElementById('item-price').value = item.price || '';
    document.getElementById('item-supplier').value = item.supplier || '';
    document.getElementById('item-location').value = item.location || '';
    document.getElementById('item-notes').value = item.notes || '';

    document.getElementById('item-modal').style.display = 'block';
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        renderInventory();
        updateStats();
    }
}

function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
    editingId = null;
}

// Form submission
document.getElementById('item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        quantity: parseInt(document.getElementById('item-quantity').value),
        unit: document.getElementById('item-unit').value,
        price: parseFloat(document.getElementById('item-price').value) || 0,
        supplier: document.getElementById('item-supplier').value,
        location: document.getElementById('item-location').value,
        notes: document.getElementById('item-notes').value
    };

    if (editingId) {
        // Update existing item
        const index = inventory.findIndex(item => item.id === editingId);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...formData };
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now(),
            ...formData
        };
        inventory.push(newItem);
    }

    renderInventory();
    updateStats();
    closeModal();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('item-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Add CSS animation for slideUp
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);