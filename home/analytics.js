let charts = {};
let currentTimeframe = 'week';

// Sample data
const farmData = {
    week: {
        yields: [85, 92, 78, 96, 88, 94, 101],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [8500, 9200, 7800, 9600, 8800, 9400, 10100],
        performance: [88, 91, 85, 94, 89, 92, 95]
    },
    month: {
        yields: [920, 850, 1100, 980],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        revenue: [45000, 42000, 52000, 48000],
        performance: [89, 87, 93, 91]
    },
    year: {
        yields: [8500, 9200, 10100, 11500, 12000, 10800, 9900, 10500, 11200, 9800, 8900, 9600],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [180000, 195000, 220000, 235000, 250000, 245000, 230000, 240000, 255000, 220000, 200000, 210000],
        performance: [85, 87, 90, 92, 94, 91, 88, 90, 93, 89, 86, 88]
    }
};

const activities = [
    { icon: '🌱', text: 'New crop planted in Field A', time: '2 hours ago', bg: '#e8f5e8' },
    { icon: '💧', text: 'Irrigation system activated', time: '4 hours ago', bg: '#e3f2fd' },
    { icon: '🚜', text: 'Harvesting completed in Field B', time: '6 hours ago', bg: '#fff3e0' },
    { icon: '📊', text: 'Weekly report generated', time: '8 hours ago', bg: '#f3e5f5' },
    { icon: '🔧', text: 'Machinery maintenance scheduled', time: '1 day ago', bg: '#fce4ec' },
    { icon: '📈', text: 'Yield increased by 12%', time: '2 days ago', bg: '#e8f5e8' }
];

function initCharts() {
    // Yield Chart
    const yieldCtx = document.getElementById('yieldChart').getContext('2d');
    charts.yield = new Chart(yieldCtx, {
        type: 'line',
        data: {
            labels: farmData[currentTimeframe].labels,
            datasets: [{
                label: 'Yield (tons)',
                data: farmData[currentTimeframe].yields,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 2000, easing: 'easeInOutQuart' },
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                x: { grid: { color: 'rgba(0,0,0,0.1)' } }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Crops', 'Livestock', 'Equipment', 'Other'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 2000, easing: 'easeInOutQuart' },
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    charts.performance = new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: farmData[currentTimeframe].labels,
            datasets: [{
                label: 'Performance %',
                data: farmData[currentTimeframe].performance,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: '#3498db',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 2000, easing: 'easeInOutQuart' },
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.1)' } },
                x: { grid: { color: 'rgba(0,0,0,0.1)' } }
            }
        }
    });
}

function switchTimeframe(btn, timeframe) {
    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTimeframe = timeframe;
    updateCharts();
}

function updateCharts() {
    const data = farmData[currentTimeframe];
    
    charts.yield.data.labels = data.labels;
    charts.yield.data.datasets[0].data = data.yields;
    charts.yield.update('active');

    charts.performance.data.labels = data.labels;
    charts.performance.data.datasets[0].data = data.performance;
    charts.performance.update('active');
}

function animateCard(card) {
    card.classList.add('pulse');
    setTimeout(() => card.classList.remove('pulse'), 1000);
    
    // Simulate real-time data update
    const valueEl = card.querySelector('.metric-value');
    const currentValue = parseInt(valueEl.textContent) || 0;
    const newValue = currentValue + Math.floor(Math.random() * 5) + 1;
    
    let counter = currentValue;
    const increment = Math.ceil((newValue - currentValue) / 20);
    const timer = setInterval(() => {
        counter += increment;
        if (counter >= newValue) {
            counter = newValue;
            clearInterval(timer);
        }
        valueEl.textContent = counter.toLocaleString();
    }, 50);
}

function refreshData() {
    // Animate refresh
    document.querySelectorAll('.metric-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                animateCard(card);
                card.style.transform = 'rotateY(0deg)';
            }, 300);
        }, index * 100);
    });

    // Update charts with new data
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            chart.data.datasets[0].data = chart.data.datasets[0].data.map(val => 
                val + (Math.random() - 0.5) * 10
            );
            chart.update('active');
        });
    }, 800);
}

function populateActivities() {
    const feed = document.getElementById('activityFeed');
    activities.forEach((activity, index) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon" style="background: ${activity.bg}">
                    ${activity.icon}
                </div>
                <div>
                    <div style="font-weight: 500; margin-bottom: 5px;">${activity.text}</div>
                    <div style="color: #7f8c8d; font-size: 0.9rem;">${activity.time}</div>
                </div>
            `;
            feed.appendChild(item);
        }, index * 200);
    });
}

// Auto-refresh metrics
setInterval(() => {
    document.querySelectorAll('.metric-value').forEach(el => {
        if (Math.random() > 0.7) { // 30% chance to update
            const parent = el.closest('.metric-card');
            animateCard(parent);
        }
    });
}, 10000);

// Initialize everything when page loads
window.onload = function() {
    initCharts();
    populateActivities();
    
    // Add staggered animation to metric cards
    document.querySelectorAll('.metric-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'slideIn 0.8s ease-out forwards';
    });
};