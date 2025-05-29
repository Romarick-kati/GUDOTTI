 // Add floating animation delays
 document.addEventListener('DOMContentLoaded', function() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.5}s`;
    });

    // Add input focus animations
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });

        // Add typing effect
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#6B8E23';
                this.style.boxShadow = '0 0 15px rgba(107, 142, 35, 0.2)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                this.style.boxShadow = 'none';
            }
        });
    });
});

// Logo click animation
document.querySelector('.logo').addEventListener('click', function() {
    this.style.animation = 'none';
    setTimeout(() => {
        this.style.animation = 'logoFloat 3s ease-in-out infinite';
    }, 100);
    
    // Add a fun rotation
    this.style.transform = 'rotate(720deg) scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'rotate(0deg) scale(1)';
    }, 600);
});

// Form submission with animations
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    // Add loading animation to button
    const btn = document.querySelector('.register-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Creating Account...';
    btn.style.background = '#1B5E20';
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMsg = document.getElementById('successMessage');
        successMsg.classList.add('show');
        
        // Reset form with animation
        this.style.opacity = '0.5';
        this.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.reset();
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
            btn.innerHTML = originalText;
            btn.style.background = '#2E7D32';
            
            // Hide success message
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 3000);
        }, 1000);
    }, 2000);
});

// Parallax effect on mouse move
document.addEventListener('mousemove', function(e) {
    const container = document.querySelector('.register-container');
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    container.style.transform = `translateX(${(x - 50) * 0.05}px) translateY(${(y - 50) * 0.05}px)`;
    
    // Move floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 0.02;
        el.style.transform = `translateX(${(x - 50) * speed}px) translateY(${(y - 50) * speed}px)`;
    });
});

// Show login message
function showLoginMessage() {
    alert('This would redirect to the login page. Integration with login system can be implemented.');
}

// Add random sparkle effects
setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.color = 'rgba(255, 255, 255, 0.6)';
    sparkle.style.fontSize = '12px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}, 3000);

// Add sparkle animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
    }
`;
document.head.appendChild(style);
