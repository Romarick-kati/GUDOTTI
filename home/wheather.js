  // Weather data
  const weatherData = {
    current: {
        temperature: 24,
        condition: 'Partly Cloudy',
        humidity: 68,
        windSpeed: 12,
        windDirection: 'NE',
        pressure: 1013,
        visibility: 10,
        uvIndex: 6,
        feelsLike: 26,
        dewPoint: 18
    },
    forecast: [
        { day: 'Today', high: 28, low: 18, condition: 'Partly Cloudy', icon: 'partlyCloudy', rain: 20 },
        { day: 'Tomorrow', high: 25, low: 16, condition: 'Light Rain', icon: 'rain', rain: 80 },
        { day: 'Saturday', high: 22, low: 14, condition: 'Rainy', icon: 'rain', rain: 90 },
        { day: 'Sunday', high: 26, low: 17, condition: 'Sunny', icon: 'sunny', rain: 10 },
        { day: 'Monday', high: 29, low: 19, condition: 'Sunny', icon: 'sunny', rain: 5 },
        { day: 'Tuesday', high: 31, low: 21, condition: 'Hot', icon: 'sunny', rain: 0 },
        { day: 'Wednesday', high: 27, low: 18, condition: 'Cloudy', icon: 'cloudy', rain: 30 }
    ],
    insights: [
        {
            type: 'warning',
            title: 'Heavy Rain Expected',
            message: 'Rain forecast for Saturday may delay harvesting. Consider moving equipment to covered areas.',
            priority: 'high'
        },
        {
            type: 'info',
            title: 'Ideal Planting Conditions',
            message: 'Next week shows perfect conditions for planting summer crops with moderate temperatures and good soil moisture.',
            priority: 'medium'
        },
        {
            type: 'alert',
            title: 'UV Index High',
            message: 'UV levels will be high today. Ensure adequate protection for outdoor workers.',
            priority: 'medium'
        }
    ]
};

// Initialize the page
function initializePage() {
    updateLastUpdated();
    renderForecast();
    renderInsights();
    simulateDataUpdates();
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
}

// Render forecast items
function renderForecast() {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';

    weatherData.forecast.forEach((day, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item interactive';
        forecastItem.onclick = () => showForecastDetails(day);
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-condition">
                ${getWeatherIcon(day.icon)}
                <span>${day.condition}</span>
            </div>
            <div class="forecast-temps">
                <div class="rain-chance">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    ${day.rain}%
                </div>
                <div class="temp-high">${day.high}°</div>
                <div class="temp-low">${day.low}°</div>
            </div>
        `;
        
        container.appendChild(forecastItem);
    });
}

// Render farming insights
function renderInsights() {
    const container = document.getElementById('insightsContainer');
    container.innerHTML = '';

    weatherData.insights.forEach((insight, index) => {
        const insightItem = document.createElement('div');
        insightItem.className = `insight-item insight-${insight.priority} interactive`;
        insightItem.onclick = () => showInsightDetails(insight);
        
        insightItem.innerHTML = `
            <div class="insight-header">
                ${getAlertIcon(insight.type)}
                <div class="insight-title">${insight.title}</div>
            </div>
            <div class="insight-message">${insight.message}</div>
        `;
        
        container.appendChild(insightItem);
    });
}

// Get weather icon SVG
function getWeatherIcon(iconType) {
    const icons = {
        sunny: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
        rain: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
            <line x1="16" y1="13" x2="16" y2="21"/>
            <line x1="8" y1="13" x2="8" y2="21"/>
            <line x1="12" y1="15" x2="12" y2="23"/>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
        </svg>`,
        cloudy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>`,
        partlyCloudy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>`
    };
    return icons[iconType] || icons.sunny;
}

// Get alert icon SVG
function getAlertIcon(type) {
    const color = type === 'warning' ? '#ea580c' : type === 'alert' ? '#dc2626' : '#3b82f6';
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`;
}

// Highlight metric card
function highlightMetric(metric) {
    // Remove previous highlights
    document.querySelectorAll('.metric-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.zIndex = '';
    });

    // Highlight selected metric
    const metricCard = document.querySelector(`.metric-card.${metric}`);
    if (metricCard) {
        metricCard.style.transform = 'translateY(-10px) scale(1.05)';
        metricCard.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
        metricCard.style.zIndex = '10';
        
        // Create ripple effect
        createRippleEffect(metricCard);
        
        // Reset after 2 seconds
        setTimeout(() => {
            metricCard.style.transform = '';
            metricCard.style.boxShadow = '';
            metricCard.style.zIndex = '';
        }, 2000);
    }
}

// Create ripple effect
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Show forecast details
function showForecastDetails(day) {
    const modal = createModal(`
        <h3 style="margin-bottom: 16px; color: #1f2937; font-size: 1.5rem;">${day.day} - ${day.condition}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div style="text-align: center; padding: 16px; background: #fef2f2; border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #dc2626;">${day.high}°C</div>
                <div style="color: #6b7280;">High</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #eff6ff; border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #2563eb;">${day.low}°C</div>
                <div style="color: #6b7280;">Low</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            ${getWeatherIcon(day.icon)}
            <span style="margin-left: 12px; font-size: 1.2rem; color: #4b5563;">${day.condition}</span>
        </div>
        <div style="text-align: center; color: #3b82f6; font-size: 1.1rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-right: 8px;">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            ${day.rain}% chance of rain
        </div>
    `);
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
}

// Show insight details
function showInsightDetails(insight) {
    const modal = createModal(`
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
            ${getAlertIcon(insight.type)}
            <h3 style="margin-left: 12px; color: #1f2937; font-size: 1.5rem;">${insight.title}</h3>
        </div>
        <p style="color: #4b5563; line-height: 1.6; font-size: 1.1rem; margin-bottom: 20px;">${insight.message}</p>
        <div style="padding: 16px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <strong style="color: #1f2937;">Priority:</strong> 
            <span style="color: ${insight.priority === 'high' ? '#dc2626' : insight.priority === 'medium' ? '#d97706' : '#2563eb'}; text-transform: capitalize;">
                ${insight.priority}
            </span>
        </div>
    `);
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
}

// Create modal
function createModal(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = content + `
        <button onclick="this.closest('.modal').remove()" style="
            margin-top: 20px;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.2s ease;
            width: 100%;
        " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Close
        </button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    return modal;
}

// Simulate real-time data updates
function simulateDataUpdates() {
    setInterval(() => {
        // Simulate slight temperature changes
        const tempChange = (Math.random() - 0.5) * 2;
        weatherData.current.temperature = Math.round(weatherData.current.temperature + tempChange);
        document.getElementById('currentTemp').textContent = `${weatherData.current.temperature}°C`;
        document.getElementById('feelsLike').textContent = `Feels like ${weatherData.current.temperature + 2}°C`;
        
        // Update humidity
        weatherData.current.humidity += Math.round((Math.random() - 0.5) * 5);
        weatherData.current.humidity = Math.max(30, Math.min(95, weatherData.current.humidity));
        document.getElementById('humidity').textContent = `${weatherData.current.humidity}%`;
        
        // Update wind speed
        weatherData.current.windSpeed += Math.round((Math.random() - 0.5) * 3);
        weatherData.current.windSpeed = Math.max(0, Math.min(30, weatherData.current.windSpeed));
        document.getElementById('windSpeed').textContent = `${weatherData.current.windSpeed} km/h`;
        
        // Update timestamp
        updateLastUpdated();
        
        // Add pulse animation to updated elements
        const updatedElements = ['currentTemp', 'humidity', 'windSpeed'];
        updatedElements.forEach(id => {
            const element = document.getElementById(id);
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'pulse 0.5s ease-in-out';
            }, 10);
        });
        
    }, 30000); // Update every 30 seconds
}

// Add smooth scrolling for mobile
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle window resize for responsive animations
window.addEventListener('resize', () => {
    // Reset any transforms on resize
    document.querySelectorAll('.metric-card').forEach(card => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.zIndex = '';
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
    }
    
    if (e.key >= '1' && e.key <= '5') {
        // Quick access to metric cards
        const metrics = ['humidity', 'wind', 'pressure', 'visibility', 'uv'];
        const index = parseInt(e.key) - 1;
        if (metrics[index]) {
            highlightMetric(metrics[index]);
        }
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.forecast-item, .insight-item, .metric-card').forEach(el => {
        observer.observe(el);
    });
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right - could add navigation functionality
            console.log('Swipe right detected');
        } else {
            // Swipe left - could add navigation functionality  
            console.log('Swipe left detected');
        }
    }
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Add performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Weather dashboard loaded in ${Math.round(loadTime)}ms`);
});
