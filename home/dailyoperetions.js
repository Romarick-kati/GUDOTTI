let operations = [];
let currentEditId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    loadOperations();
    updateStats();
});

function openForm(operation = null) {
    const overlay = document.getElementById('formOverlay');
    const form = document.getElementById('operationForm');
    const title = document.getElementById('formTitle');
    
    if (operation) {
        title.textContent = 'Edit Operation';
        currentEditId = operation.id;
        populateForm(operation);
    } else {
        title.textContent = 'Add New Operation';
        currentEditId = null;
        form.reset();
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    }
    
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeForm() {
    document.getElementById('formOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEditId = null;
}

function populateForm(operation) {
    const form = document.getElementById('operationForm');
    Object.keys(operation).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = operation[key] || '';
        }
    });
}

function saveOperation(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const operation = {};
    
    for (let [key, value] = formData.entries()) {
        operation[key] = value;
    }
    
    if (currentEditId) {
        operation.id = currentEditId;
        const index = operations.findIndex(op => op.id === currentEditId);
        operations[index] = operation;
    } else {
        operation.id = Date.now().toString();
        operations.push(operation);
    }
    
    saveToStorage();
    renderOperations();
    updateStats();
    closeForm();
}

function deleteOperation(id) {
    if (confirm('Are you sure you want to delete this operation?')) {
        operations = operations.filter(op => op.id !== id);
        saveToStorage();
        renderOperations();
        updateStats();
    }
}

function editOperation(id) {
    const operation = operations.find(op => op.id === id);
    if (operation) {
        openForm(operation);
    }
}

function filterByDate() {
    renderOperations();
}

function filterOperations() {
    renderOperations();
}

function renderOperations() {
    const grid = document.getElementById('operationsGrid');
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let filteredOps = operations.filter(op => {
        const dateMatch = !dateFilter || op.date === dateFilter;
        const statusMatch = statusFilter === 'all' || op.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || op.category === categoryFilter;
        return dateMatch && statusMatch && categoryMatch;
    });

    if (filteredOps.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3>No operations found</h3>
                <p>Try adjusting your filters or add a new operation</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredOps.map(op => `
        <div class="operation-card ${op.status}">
            <div class="card-header">
                <div>
                    <div class="operation-title">${op.operation}</div>
                    <span class="operation-category">${op.category}</span>
                </div>
                <div>
                    <span class="status-badge status-${op.status}">${op.status}</span>
                    <span class="priority-badge priority-${op.priority}">${op.priority}</span>
                </div>
            </div>
            
            <div class="operation-details">
                <div class="detail-row">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <span>${op.date}</span>
                </div>
                ${op.location ? `
                <div class="detail-row">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>${op.location}</span>
                </div>
                ` : ''}
                ${op.operator ? `
                <div class="detail-row">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>${op.operator}</span>
                </div>
                ` : ''}
                ${op.startTime || op.endTime ? `
                <div class="detail-row">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    <span>${op.startTime} ${op.endTime ? '- ' + op.endTime : ''}</span>
                </div>
                ` : ''}
                ${op.cost ? `
                <div class="detail-row">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91 2.28.6 4.18 1.58 4.18 3.91 0 1.82-1.33 2.96-3.12 3.16z"/>
                    </svg>
                    <span>$${parseFloat(op.cost).toFixed(2)}</span>
                </div>
                ` : ''}
            </div>
            
            ${op.description ? `<p style="margin: 10px 0; color: #666; font-size: 14px;">${op.description}</p>` : ''}
            
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editOperation('${op.id}')">
                    ✏️ Edit
                </button>
                <button class="btn btn-secondary" onclick="deleteOperation('${op.id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = operations.length;
    const completed = operations.filter(op => op.status === 'completed').length;
    const inProgress = operations.filter(op => op.status === 'in-progress').length;
    const planned = operations.filter(op => op.status === 'planned').length;

    document.getElementById('totalOperations').textContent = total;
    document.getElementById('completedOperations').textContent = completed;
    document.getElementById('inProgressOperations').textContent = inProgress;
    document.getElementById('plannedOperations').textContent = planned;
}

function saveToStorage() {
    // In a real application, this would save to a database
    // For now, we'll use in-memory storage only
    console.log('Operations saved:', operations);
}

function loadOperations() {
    // In a real application, this would load from a database
    // For demo purposes, we'll start with some sample data
    