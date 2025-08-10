// Admin authentication and management
class AdminManager {
    constructor() {
        this.isAuthenticated = false;
        this.adminCredentials = {
            username: 'admin',
            password: 'insightful2024'
        };
        
        this.init();
    }
    
    init() {
        // Check if already authenticated
        if (sessionStorage.getItem('adminAuthenticated') === 'true') {
            this.isAuthenticated = true;
            this.redirectToDashboard();
            return;
        }
        
        this.setupEventListeners();
        this.setupMobileNav();
    }
    
    setupEventListeners() {
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }
    
    setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const spinner = loginBtn.querySelector('.loading-spinner');
        
        // Show loading state
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        loginBtn.disabled = true;
        
        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate credentials
        if (this.validateCredentials(username, password)) {
            this.isAuthenticated = true;
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminUsername', username);
            
            // Show success message briefly
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1000);
        } else {
            this.showMessage('Invalid username or password. Please try again.', 'error');
            
            // Reset form
            document.getElementById('adminLoginForm').reset();
            
            // Reset button state
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }
    
    validateCredentials(username, password) {
        return username === this.adminCredentials.username && 
               password === this.adminCredentials.password;
    }
    
    showMessage(message, type) {
        const errorDiv = document.getElementById('adminError');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorDiv && errorMessage) {
            errorMessage.textContent = message;
            
            if (type === 'success') {
                errorDiv.style.background = '#f0fdf4';
                errorDiv.style.borderColor = '#bbf7d0';
                errorDiv.style.color = '#16a34a';
            } else {
                errorDiv.style.background = '#fef2f2';
                errorDiv.style.borderColor = '#fecaca';
                errorDiv.style.color = '#ef4444';
            }
            
            errorDiv.style.display = 'block';
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
        }
    }
    
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }
    
    static logout() {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'admin.html';
    }
}

// Initialize admin manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminManager();
});

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
}
