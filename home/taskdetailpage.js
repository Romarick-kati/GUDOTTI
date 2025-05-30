function goBack() {
    const container = document.querySelector('.container');
    container.style.animation = 'slideDown 0.5s ease-in forwards';
    setTimeout(() => {
        showModal('Navigation', 'Redirecting to task list...');
    }, 500);
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentWidth = parseInt(progressBar.style.width);
    const newWidth = Math.min(currentWidth + 10, 100);
    
    progressBar.style.width = newWidth + '%';
    
    if (newWidth === 100) {
        progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #2E7D32)';
        showModal('Task Complete!', 'Congratulations! The irrigation task has been completed successfully.');
    } else {
        showModal('Progress Updated', `Task progress updated to ${newWidth}%`);
    }
}

function addNote() {
    showModal('Add Note', 'Note functionality would open a text editor here.');
}

function reportIssue() {
    showModal('Report Issue', 'Issue reporting form would be displayed here.');
}

function showModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Animate progress bar on load
window.addEventListener('load', function() {
    setTimeout(() => {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.transition = 'width 2s ease-out';
    }, 1000);
});

// Add slide down animation for going back
const slideDownKeyframes = `
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(50px);
        }
    }
`;

const style = document.createElement('style');
style.textContent = slideDownKeyframes;
document.head.appendChild(style);

// Simulate real-time updates
setInterval(() => {
    const timeElements = document.querySelectorAll('.timeline-item');
    if (timeElements.length > 0) {
        const lastItem = timeElements[timeElements.length - 1];
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Update the current activity time randomly
        if (Math.random() > 0.8) {
            lastItem.innerHTML = `<strong>${timeString}</strong> - Current: Monitoring water pressure in sector C`;
        }
    }
}, 10000);

// Add hover effects to cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click animations to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});