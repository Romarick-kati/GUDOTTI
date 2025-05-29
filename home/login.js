// Notification System Class
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.soundEnabled = true;
        this.sound = document.getElementById('notificationSound');
    }

    // Create notification element
    createNotification(title, message, type = 'info', duration = this.defaultDuration, persistent = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const icon = iconMap[type] || iconMap.info;
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">×</button>
            ${!persistent ? '<div class="notification-progress"></div>' : ''}
        `;

        // Add event listeners
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));

        // Auto-dismiss functionality
        if (!persistent && duration > 0) {
            const progressBar = notification.querySelector('.notification-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transitionDuration = `${duration}ms`;
                
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 100);
            }

            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        // Click to dismiss
        notification.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close')) {
                this.removeNotification(notification);
            }
        });

        return notification;
    }

    // Show notification
    show(title, message, type = 'info', duration = this.defaultDuration, persistent = false) {
        // Remove oldest notification if at max capacity
        if (this.notifications.length >= this.maxNotifications) {
            this.removeNotification(this.notifications[0]);
        }

        const notification = this.createNotification(title, message, type, duration, persistent);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Play sound
        if (this.soundEnabled && this.sound) {
            this.sound.currentTime = 0;
            this.sound.play().catch(() => {}); // Ignore audio play errors
        }

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        return notification;
    }

    // Remove notification
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 400);
    }

    // Clear all notifications
    clearAll() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }

    // Quick methods for different types
    success(title, message, duration, persistent) {
        return this.show(title, message, 'success', duration, persistent);
    }

    error(title, message, duration, persistent) {
        return this.show(title, message, 'error', duration, persistent);
    }

    warning(title, message, duration, persistent) {
        return this.show(title, message, 'warning', duration, persistent);
    }

    info(title, message, duration, persistent) {
        return this.show(title, message, 'info', duration, persistent);
    }
}

// Initialize notification system
const notify = new NotificationSystem();

// Farm Login System
class FarmLoginSystem {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupInitialState();
    }

    initializeElements() {
        // Form elements
        this.loginForm = document.getElementById('loginForm');
        this.loginBtn = document.getElementById('loginBtn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.usernameInput = document.getElementById('username');
        this.messageDiv = document.getElementById('message');
        this.formInputs = document.querySelectorAll('.form-input');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.forgotPasswordLink = document.getElementById('forgotPassword');
        this.guestLoginLink = document.getElementById('guestLogin');
        this.loginContainer = document.querySelector('.login-container');

        // Demo credentials
        this.validCredentials = {
            'farmer': 'farm123',
            'admin': 'admin123',
            'guest': 'guest123'
        };
    }

    bindEvents() {
        // Form submission
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Input focus effects
        this.formInputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });

        // Password toggle
        this.passwordToggle.addEventListener('click', () => this.togglePassword());

        // Forgot password
        this.forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));

        // Guest login
        this.guestLoginLink.addEventListener('click', (e) => this.handleGuestLogin(e));

        // Remember me
        this.rememberMeCheckbox.addEventListener('change', (e) => this.handleRememberMe(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Page visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    setupInitialState() {
        // Welcome notification
        setTimeout(() => {
            notify.info(
                'Welcome to FarmSync! 🌱',
                'Please enter your credentials to access the farm management dashboard.',
                6000
            );
        }, 1000);

        // Auto-focus username field
        setTimeout(() => {
            this.usernameInput.focus();
            notify.info(
                'Getting Started',
                'Demo credentials: farmer/farm123 or admin/admin123',
                8000
            );
        }, 2000);

        // Load remembered credentials
        this.loadRememberedCredentials();

        // Setup periodic tips
        this.setupPeriodicTips();
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();

        // Validation
        if (!username || !password) {
            this.showValidationError('Please fill in all fields');
            notify.error(
                'Validation Error',
                'Both username and password are required.',
                4000
            );
            return;
        }

        // Start loading
        this.setLoadingState(true);
        notify.info('Authenticating...', 'Please wait while we verify your credentials.', 2000);

        // Simulate authentication delay
        setTimeout(() => {
            this.authenticateUser(username, password);
        }, 2000);
    }

    authenticateUser(username, password) {