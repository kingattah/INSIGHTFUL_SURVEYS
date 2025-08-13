// Survey functionality
class SurveyManager {
    constructor() {
        this.currentCompany = null;
        this.currentSurvey = null;
        this.currentQuestionIndex = -1; // Start at -1 for user info step
        this.responses = {};
        this.totalQuestions = 0;
        this.userInfo = {};
        
        this.init();
    }
    
    init() {
        // Show loading state
        this.showLoading();
        
        // Check if user came from company selection
        const companyData = sessionStorage.getItem('currentCompany');
        if (!companyData) {
            this.showError('No institution selected. Please go back to survey page.');
            return;
        }
        
        try {
            this.currentCompany = JSON.parse(companyData);
            this.currentSurvey = this.currentCompany.surveys[0]; // Get first survey
            this.totalQuestions = this.currentSurvey.questions.length;
            
            this.setupSurvey();
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
            
            // Hide loading
            this.hideLoading();
        } catch (error) {
            console.error('Error parsing company data:', error);
            this.showError('Error loading survey. Please try again.');
            this.hideLoading();
        }
    }
    
    showLoading() {
        const surveyContent = document.getElementById('surveyContent');
        surveyContent.innerHTML = `
            <div class="survey-loading">
                <div class="loading-spinner"></div>
                <p>Loading survey...</p>
            </div>
        `;
    }
    
    hideLoading() {
        // Loading will be replaced when renderQuestion is called
    }
    
    setupSurvey() {
        // Update company info
        document.getElementById('companyName').textContent = this.currentCompany.name;
        document.getElementById('surveyTitle').textContent = this.currentSurvey.title;
        
        // Update company logo if available
        this.updateCompanyLogo();
        
        // Setup navigation buttons
        this.setupNavigation();
        
        // Setup mobile navigation
        this.setupMobileNav();
    }
    
    updateCompanyLogo() {
        const logoContainer = document.querySelector('.company-logo-small i');
        if (logoContainer) {
            // For educational institution, keep the icon
            if (this.currentCompany.id === 'school') {
                logoContainer.className = 'fas fa-graduation-cap';
                logoContainer.style.fontSize = '2rem';
                logoContainer.style.color = '#6366f1';
                return;
            }
            
            // Try to load company logo from img folder for other companies
            const img = new Image();
            img.onload = () => {
                logoContainer.style.display = 'none';
                logoContainer.parentNode.appendChild(img);
            };
            img.onerror = () => {
                // Keep the icon if image fails to load
                console.log('Company logo not found, using default icon');
            };
            img.src = `img/${this.currentCompany.id}.png`;
            img.alt = this.currentCompany.name;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 15px;
            `;
        }
    }
    
    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        prevBtn.addEventListener('click', () => this.previousQuestion());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        submitBtn.addEventListener('click', () => this.submitSurvey());
    }
    
    setupMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
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
        
        // Warn user before leaving survey page
        window.addEventListener('beforeunload', (e) => {
            if (Object.keys(this.responses).length > 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved survey responses. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }
    
    renderQuestion() {
        const surveyContent = document.getElementById('surveyContent');
        
        // Show user info form first
        if (this.currentQuestionIndex === -1) {
            this.renderUserInfoForm();
            return;
        }
        
        const question = this.currentSurvey.questions[this.currentQuestionIndex];
        
        if (!question) return;
        
        let questionHTML = `
            <div class="question-container" data-aos="fade-up">
                <div class="question-header">
                    <span class="question-number">Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}</span>
                    <h2 class="question-text">${question.question}</h2>
                </div>
                <div class="question-content">
        `;
        
        if (question.type === 'multiple_choice') {
            questionHTML += this.renderMultipleChoice(question);
        } else if (question.type === 'text') {
            questionHTML += this.renderTextInput(question);
        }
        
        questionHTML += `
                </div>
            </div>
        `;
        
        surveyContent.innerHTML = questionHTML;
        
        // Initialize AOS for new content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Setup option change handlers for multiple choice questions
        if (question.type === 'multiple_choice') {
            this.setupOptionChangeHandlers();
        }
        
        // Load saved response if exists
        this.loadSavedResponse();
    }
    
    renderUserInfoForm() {
        const surveyContent = document.getElementById('surveyContent');
        const userInfoHTML = `
            <div class="user-info-container" data-aos="fade-up">
                <div class="user-info-header">
                    <h2 class="user-info-title">Please provide your information</h2>
                    <p class="user-info-subtitle">We need some basic information before starting the survey</p>
                </div>
                <div class="user-info-form">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="position">Position at Organization *</label>
                        <input type="text" id="position" name="position" placeholder="Enter your position/title" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email address" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required>
                    </div>
                </div>
            </div>
        `;
        
        surveyContent.innerHTML = userInfoHTML;
        
        // Load saved user info if exists
        this.loadSavedUserInfo();
        
        // Initialize AOS for new content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    renderMultipleChoice(question) {
        let html = '<div class="options-container">';
        
        question.options.forEach((option, index) => {
            const optionId = `option_${this.currentQuestionIndex}_${index}`;
            html += `
                <div class="option-item">
                    <input type="radio" id="${optionId}" name="question_${this.currentQuestionIndex}" value="${option}">
                    <label for="${optionId}" class="option-label">
                        <span class="option-radio"></span>
                        <span class="option-text">${option}</span>
                    </label>
                </div>
            `;
        });
        
        // Add "Other" option with text input
        const otherOptionId = `option_${this.currentQuestionIndex}_other`;
        html += `
            <div class="option-item">
                <input type="radio" id="${otherOptionId}" name="question_${this.currentQuestionIndex}" value="other">
                <label for="${otherOptionId}" class="option-label">
                    <span class="option-radio"></span>
                    <span class="option-text">Other (please specify)</span>
                </label>
            </div>
        `;
        
        html += '</div>';
        
        // Add text input for "Other" option
        html += `
            <div class="other-input-container" id="other_input_${this.currentQuestionIndex}" style="display: none;">
                <textarea 
                    id="other_text_${this.currentQuestionIndex}" 
                    placeholder="Please describe your situation..."
                    rows="3"
                    class="other-text-input"
                ></textarea>
            </div>
        `;
        
        return html;
    }
    
    renderTextInput(question) {
        return `
            <div class="text-input-container">
                <textarea 
                    id="text_answer_${this.currentQuestionIndex}" 
                    placeholder="Please provide your answer here..."
                    rows="4"
                    class="text-input"
                ></textarea>
            </div>
        `;
    }
    
    setupOptionChangeHandlers() {
        const radioButtons = document.querySelectorAll(`input[name="question_${this.currentQuestionIndex}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.handleOptionChange());
        });
    }
    
    handleOptionChange() {
        const selectedOption = document.querySelector(`input[name="question_${this.currentQuestionIndex}"]:checked`);
        const otherInputContainer = document.getElementById(`other_input_${this.currentQuestionIndex}`);
        
        if (selectedOption && selectedOption.value === 'other') {
            otherInputContainer.style.display = 'block';
        } else {
            otherInputContainer.style.display = 'none';
        }
    }
    
    loadSavedResponse() {
        const question = this.currentSurvey.questions[this.currentQuestionIndex];
        const savedResponse = this.responses[this.currentQuestionIndex];
        
        if (!savedResponse) return;
        
        if (question.type === 'multiple_choice') {
            if (savedResponse.startsWith('Other:')) {
                // Handle "Other" option
                const otherRadio = document.querySelector(`input[name="question_${this.currentQuestionIndex}"][value="other"]`);
                if (otherRadio) {
                    otherRadio.checked = true;
                    const otherText = document.getElementById(`other_text_${this.currentQuestionIndex}`);
                    const otherInputContainer = document.getElementById(`other_input_${this.currentQuestionIndex}`);
                    if (otherText && otherInputContainer) {
                        otherText.value = savedResponse.replace('Other: ', '');
                        otherInputContainer.style.display = 'block';
                    }
                }
            } else {
                // Handle regular options
                const radioButton = document.querySelector(`input[name="question_${this.currentQuestionIndex}"][value="${savedResponse}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }
        } else if (question.type === 'text') {
            const textarea = document.getElementById(`text_answer_${this.currentQuestionIndex}`);
            if (textarea) {
                textarea.value = savedResponse;
            }
        }
    }
    
    loadSavedUserInfo() {
        if (this.userInfo.fullName) {
            document.getElementById('fullName').value = this.userInfo.fullName;
        }
        if (this.userInfo.position) {
            document.getElementById('position').value = this.userInfo.position;
        }
        if (this.userInfo.email) {
            document.getElementById('email').value = this.userInfo.email;
        }
        if (this.userInfo.phone) {
            document.getElementById('phone').value = this.userInfo.phone;
        }
    }
    
    saveUserInfo() {
        const fullName = document.getElementById('fullName').value.trim();
        const position = document.getElementById('position').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Basic validation
        if (!fullName || !position || !email || !phone) {
            this.showError('Please fill in all required fields.');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            this.showError('Please enter a valid phone number.');
            return false;
        }
        
        this.userInfo = { fullName, position, email, phone };
        return true;
    }
    
    saveCurrentResponse() {
        const question = this.currentSurvey.questions[this.currentQuestionIndex];
        let response = null;
        
        if (question.type === 'multiple_choice') {
            const selectedOption = document.querySelector(`input[name="question_${this.currentQuestionIndex}"]:checked`);
            if (selectedOption) {
                if (selectedOption.value === 'other') {
                    const otherText = document.getElementById(`other_text_${this.currentQuestionIndex}`);
                    if (otherText && otherText.value.trim()) {
                        response = `Other: ${otherText.value.trim()}`;
                    } else {
                        response = 'Other (no description provided)';
                    }
                } else {
                    response = selectedOption.value;
                }
            }
        } else if (question.type === 'text') {
            const textarea = document.getElementById(`text_answer_${this.currentQuestionIndex}`);
            if (textarea) {
                response = textarea.value.trim();
            }
        }
        
        if (response) {
            this.responses[this.currentQuestionIndex] = response;
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex === 0) {
            // Go back to user info step
            this.saveCurrentResponse();
            this.currentQuestionIndex = -1;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        } else if (this.currentQuestionIndex > 0) {
            this.saveCurrentResponse();
            this.currentQuestionIndex--;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    nextQuestion() {
        // If on user info step, validate and save user info first
        if (this.currentQuestionIndex === -1) {
            if (!this.saveUserInfo()) {
                return; // Don't proceed if validation fails
            }
            this.currentQuestionIndex = 0; // Move to first question
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
            return;
        }
        
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.saveCurrentResponse();
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (this.currentQuestionIndex === -1) {
            // User info step
            progressFill.style.width = '0%';
            progressText.textContent = '0% Complete';
        } else {
            // Survey questions
            const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (this.currentQuestionIndex === -1) {
            // User info step
            prevBtn.disabled = true;
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
            nextBtn.textContent = 'Start Survey';
        } else {
            // Survey questions
            prevBtn.disabled = this.currentQuestionIndex === 0;
            
            if (this.currentQuestionIndex === this.totalQuestions - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-flex';
            } else {
                nextBtn.style.display = 'inline-flex';
                submitBtn.style.display = 'none';
            }
            nextBtn.textContent = 'Next';
        }
    }
    
    submitSurvey() {
        this.saveCurrentResponse();
        
        // Check if user info is complete
        if (!this.userInfo.fullName || !this.userInfo.position || !this.userInfo.email || !this.userInfo.phone) {
            this.showError('Please complete your information before submitting the survey.');
            return;
        }
        
        // Check if all questions are answered
        const unansweredQuestions = [];
        const invalidOtherResponses = [];
        
        for (let i = 0; i < this.totalQuestions; i++) {
            if (!this.responses[i]) {
                unansweredQuestions.push(i + 1);
            } else if (this.responses[i] === 'Other (no description provided)') {
                invalidOtherResponses.push(i + 1);
            }
        }
        
        if (unansweredQuestions.length > 0) {
            this.showError(`Please answer questions: ${unansweredQuestions.join(', ')}`);
            return;
        }
        
        if (invalidOtherResponses.length > 0) {
            this.showError(`Please provide a description for questions: ${invalidOtherResponses.join(', ')}`);
            return;
        }
        
        // Save survey response to CSV backend
        this.saveSurveyResponse();
    }
    
    saveSurveyResponse() {
        try {
            // Create survey response object with dynamic question mapping
            const surveyResponse = {
                timestamp: new Date().toISOString(),
                company_id: this.currentCompany.id,
                company_name: this.currentCompany.name,
                survey_id: this.currentSurvey.id || 'network_infrastructure',
                survey_title: this.currentSurvey.title,
                full_name: this.userInfo.fullName,
                position: this.userInfo.position,
                email: this.userInfo.email,
                phone: this.userInfo.phone
            };
            
            // Dynamically add up to 50 questions
            for (let i = 1; i <= 50; i++) {
                const questionKey = `question_${i}`;
                const responseIndex = i - 1;
                surveyResponse[questionKey] = this.responses[responseIndex] || '';
            }
            
            // Get existing responses from localStorage
            const existingResponses = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
            
            // Add new response
            existingResponses.push(surveyResponse);
            
            // Save back to localStorage (simulating CSV backend)
            localStorage.setItem('surveyResponses', JSON.stringify(existingResponses));
            
            // Show completion modal
            this.showCompletionModal();
            
        } catch (error) {
            console.error('Error saving survey response:', error);
            this.showError('Error saving your response. Please try again.');
        }
    }
    
    showCompletionModal() {
        const modal = document.getElementById('completionModal');
        modal.style.display = 'block';
        
        // Add modal styles if not already present
        if (!document.querySelector('#completionModalStyles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'completionModalStyles';
            modalStyles.textContent = `
                .completion-modal {
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
                
                .completion-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                }
                
                .completion-modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 3rem;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    animation: modalSlideIn 0.3s ease;
                }
                
                .completion-icon {
                    font-size: 4rem;
                    color: #10b981;
                    margin-bottom: 1.5rem;
                }
                
                .completion-modal-content h2 {
                    color: var(--text-primary);
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }
                
                .completion-modal-content p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }
                
                .completion-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
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
            `;
            document.head.appendChild(modalStyles);
        }
    }
    
    showError(message) {
        // Remove existing error if any
        const existingError = document.querySelector('.survey-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'survey-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #ef4444;
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        `;
        
        const surveyContent = document.getElementById('surveyContent');
        surveyContent.insertBefore(errorDiv, surveyContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
        
        // Add slide animations
        if (!document.querySelector('#errorAnimations')) {
            const animations = document.createElement('style');
            animations.id = 'errorAnimations';
            animations.textContent = `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(animations);
        }
    }
}

// Initialize survey when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SurveyManager();
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
