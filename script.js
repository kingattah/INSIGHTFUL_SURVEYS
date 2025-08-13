// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const scrollProgress = document.querySelector('.scroll-progress');
const contactForm = document.getElementById('contactForm');

// Company and Survey Data with PINs - Educational Institution Only
const companyData = {




    school: {
        name: 'Educational Institution',
        pin: '1111',
        surveys: [
            {
                id: 'school-network-infrastructure',
                title: 'Network Infrastructure Assessment Survey',
                questions: [
                    {
                        question: 'Name of Organization:',
                        type: 'text'
                    },
                    {
                        question: 'What is the purpose of the network infrastructure?',
                        options: ['New office setup', 'Office expansion', 'Network upgrade', 'Remote work enablement', 'Security enhancement', 'Performance improvement'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'How many users will be connected to the network?',
                        options: ['1-25 users', '26-50 users', '51-100 users', '101-200 users', '200+ users'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Are they local, remote, or hybrid?',
                        options: ['All local', 'All remote', 'Hybrid (mix of local and remote)', 'Mostly local', 'Mostly remote'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What types of devices will be connected?',
                        options: ['Desktops only', 'Laptops only', 'Mixed devices (desktops, laptops, phones)', 'IoT devices included', 'Mobile devices only'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'How many devices per user?',
                        options: ['1 device per user', '2 devices per user', '3+ devices per user', 'Varies by user role', 'Unlimited devices'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What services will the network support?',
                        options: ['Basic internet and email', 'Cloud applications (Office 365, etc.)', 'VoIP and video conferencing', 'File sharing and storage', 'All of the above'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What are the expected bandwidth requirements?',
                        options: ['100 Mbps or less', '100 Mbps - 500 Mbps', '500 Mbps - 1 Gbps', '1 Gbps - 10 Gbps', '10 Gbps or higher'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Any special performance concerns?',
                        options: ['Low latency for VoIP', 'High bandwidth for video', 'QoS requirements', 'No special concerns', 'Multiple performance requirements'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What level of network security is required?',
                        options: ['Basic security', 'Standard security', 'High security', 'Enterprise-grade security', 'Maximum security'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Do you need NAC or 2FA?',
                        options: ['No additional security needed', '2FA for remote access only', 'Basic NAC implementation', 'Full NAC and 2FA', 'Advanced security features'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Do you expect growth?',
                        options: ['No growth expected', '10-25% growth', '25-50% growth', '50-100% growth', '100%+ growth'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Should infrastructure be scalable?',
                        options: ['No scalability needed', 'Basic scalability', 'Moderate scalability', 'High scalability', 'Maximum scalability'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'Do you need wired, wireless, or both?',
                        options: ['Wired only', 'Wireless only', 'Both wired and wireless', 'Mostly wired', 'Mostly wireless'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What is the estimated budget?',
                        options: ['Under ₦25,000,000', '₦25,000,000 - ₦50,000,000', '₦50,000,000 - ₦100,000,000', '₦100,000,000 - ₦250,000,000', '₦250,000,000+'],
                        type: 'multiple_choice'
                    },
                    {
                        question: 'What is the project timeline?',
                        options: ['1 month or less', '1-3 months', '3-6 months', '6-12 months', '12+ months'],
                        type: 'multiple_choice'
                    }
                ]
            }
        ]
    }
};


// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Ensure hamburger menu is visible on mobile devices
function ensureHamburgerVisibility() {
    if (window.innerWidth <= 1024) {
        hamburger.style.display = 'flex';
        hamburger.style.visibility = 'visible';
        hamburger.style.opacity = '1';
    }
}

// Call on page load and resize
ensureHamburgerVisibility();
window.addEventListener('resize', ensureHamburgerVisibility);



// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Simple Footer Interactions
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Social link clicked:', link.getAttribute('aria-label'));
        // Add your analytics tracking here
    });
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Animated Statistics Counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Intersection Observer for Statistics Animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.getAttribute('data-target'));
            animateCounter(statNumber, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all stat items
document.querySelectorAll('.stat-item').forEach(stat => {
    statObserver.observe(stat);
});

// Enhanced Floating Card Interactions
document.querySelectorAll('.floating-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.05)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Enhanced Service Card Interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    });
});

// Enhanced Tech Grid Interactions
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.05)';
        item.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.boxShadow = '';
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll progress bar update
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
    
    // Navbar background update
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 16); // ~60fps

// Replace scroll event listeners with throttled version
window.removeEventListener('scroll', () => {});
window.addEventListener('scroll', throttledScrollHandler);

// Add loading animation to elements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .about-text, .about-visual, .contact-info, .contact-form, .testimonial-card, .testimonials-cta');
    
    // Create intersection observer for loading animations
    const loadingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
                loadingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for loading animation
    animateElements.forEach(el => loadingObserver.observe(el));
});

// Enhanced hover effects for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

    // Institution selection functionality for survey page
document.addEventListener('DOMContentLoaded', () => {
    const companySelectBtns = document.querySelectorAll('.company-select-btn');
    
    companySelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const companyCard = this.closest('.company-card');
            const companyId = companyCard.getAttribute('data-company');
            const companyName = companyCard.querySelector('h3').textContent;
            
            // Show PIN verification modal
            showPinModal(companyId, companyName);
        });
    });
});

// PIN Verification Modal
function showPinModal(companyId, companyName) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.pin-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'pin-modal';
    modal.innerHTML = `
        <div class="pin-modal-overlay">
            <div class="pin-modal-content">
                <div class="pin-modal-header">
                    <h3>Enter PIN for ${companyName}</h3>
                    <button class="pin-modal-close">&times;</button>
                </div>
                <div class="pin-modal-body">
                    <p>Please enter the PIN provided by your company to access the survey.</p>
                    <div class="pin-input-group">
                        <input type="password" id="pinInput" placeholder="Enter PIN" maxlength="4" pattern="[0-9]*">
                        <button class="btn btn-primary" id="verifyPinBtn">Verify PIN</button>
                    </div>
                    <div class="pin-error" id="pinError" style="display: none;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Invalid PIN. Please try again.</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .pin-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .pin-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .pin-modal-content {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            position: relative;
            z-index: 10001;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .pin-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .pin-modal-header h3 {
            color: var(--text-primary);
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .pin-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .pin-modal-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .pin-modal-body p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .pin-input-group {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .pin-input-group input {
            flex: 1;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            font-size: 1.1rem;
            text-align: center;
            letter-spacing: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .pin-input-group input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .pin-error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ef4444;
            font-size: 0.9rem;
            padding: 0.75rem;
            background: #fef2f2;
            border-radius: 8px;
            border: 1px solid #fecaca;
        }
        
        .pin-error i {
            font-size: 1rem;
        }
    `;
    
    document.head.appendChild(modalStyles);
    
    // Event listeners
    const closeBtn = modal.querySelector('.pin-modal-close');
    const verifyBtn = modal.querySelector('#verifyPinBtn');
    const pinInput = modal.querySelector('#pinInput');
    const pinError = modal.querySelector('#pinError');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close modal on overlay click
    modal.querySelector('.pin-modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            modal.remove();
        }
    });
    
    // Verify PIN
    verifyBtn.addEventListener('click', () => {
        const enteredPin = pinInput.value;
        const company = companyData[companyId];
        
        if (enteredPin === company.pin) {
            // PIN is correct - redirect to survey
            modal.remove();
            showNotification(`PIN verified! Redirecting to ${companyName} survey...`, 'success');
            
            // Store company info in session storage for survey page
            sessionStorage.setItem('currentCompany', JSON.stringify({
                id: companyId,
                name: company.name,
                surveys: company.surveys
            }));
            
            // Redirect to survey page
            setTimeout(() => {
                window.location.href = 'survey.html';
            }, 1500);
        } else {
            // PIN is incorrect
            pinError.style.display = 'flex';
            pinInput.value = '';
            pinInput.focus();
            
            // Hide error after 3 seconds
            setTimeout(() => {
                pinError.style.display = 'none';
            }, 3000);
        }
    });
    
    // Enter key to verify
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyBtn.click();
        }
    });
    
    // Focus on input
    pinInput.focus();
    
    // Auto-format PIN input (numbers only)
    pinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Simple Footer Interactions
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Social link clicked:', link.getAttribute('aria-label'));
        // Add your analytics tracking here
    });
});
