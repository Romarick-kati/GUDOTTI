let workers = [];
let editingWorkerId = null;

// Sample data
const sampleWorkers = [
    {
        id: 1,
        name: "John Smith",
        role: "Farm Manager",
        department: "Administration",
        phone: "(555) 123-4567",
        email: "john.smith@farm.com",
        salary: 45000,
        hireDate: "2023-01-15",
        status: "Active"
    },
    {
        id: 2,
        name: "Maria Garcia",
        role: "Field Worker",
        department: "Crop Production",
        phone: "(555) 234-5678",
        email: "maria.garcia@farm.com",
        salary: 28000,
        hireDate: "2023-03-10",
        status: "Active"
    },
    {
        id: 3,
        name: "David Johnson",
        role: "Equipment Operator",
        department: "Equipment",
        phone: "(555) 345-6789",
        email: "david.johnson@farm.com",
        salary: 35000,
        hireDate: "2023-02-20",
        status: "On Leave"
    }
];

// Initialize with sample data
workers = [...sampleWorkers];

function showTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Update content based on tab
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'workers') {
        displayWorkers();
    }
}

function updateDashboard() {
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter(w => w.status === 'Active').length;
    const departments = [...new Set(workers.map(w => w.department))].length;
    const avgSalary = workers.length > 0 ? 
        Math.round(workers.reduce((sum, w) => sum + w.salary, 0) / workers.length) : 0;

    // Animate numbers
    animateNumber('totalWorkers', totalWorkers);
    animateNumber('activeWorkers', activeWorkers);
    animateNumber('totalDepartments', departments);
    document.getElementById('avgSalary').textContent = `$${avgSalary.toLocaleString()}`;

    // Show recent workers (last 3)
    const recentWorkers = workers.slice(-3);
    displayWorkersInContainer('recentWorkers', recentWorkers);
}

function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const startNumber = 0;
    const duration = 1000;
    const increment = targetNumber / (duration / 16);
    let currentNumber = startNumber;

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber);
    }, 16);
}

function displayWorkers() {
    displayWorkersInContainer('workersGrid', workers);
}

function displayWorkersInContainer(containerId, workersToDisplay) {
    const container = document.getElementById(containerId);
    const emptyState = document.getElementById('emptyState');

    if (workersToDisplay.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = workersToDisplay.map(worker => `
        <div class="worker-card">
            <div class="worker-header">
                <div class="worker-avatar">${worker.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="worker-info">
                    <h3>${worker.name}</h3>
                    <span class="worker-role">${worker.role}</span>
                </div>
            </div>
            <div class="worker-details">
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${worker.department}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${worker.phone}</span>
                </div>
                