// Dashboard data management and visualization
class DashboardManager {
    constructor() {
        this.surveyData = [];
        this.filteredData = [];
        this.companies = [];
        this.currentFilters = {
            company: 'all',
            date: '',
            search: ''
        };
        
        this.init();
    }
    
    init() {
        console.log('DashboardManager init started');
        // Check authentication
        if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
            console.log('Admin not authenticated, redirecting to admin.html');
            window.location.href = 'admin.html';
            return;
        }
        
        console.log('Admin authenticated, proceeding with initialization');
        // Set admin username
        const adminUsername = sessionStorage.getItem('adminUsername') || 'Admin';
        document.getElementById('adminUsername').textContent = adminUsername;
        
        this.setupEventListeners();
        this.setupMobileNav();
        this.loadSurveyData();
        console.log('DashboardManager init completed');
    }
    
    setupEventListeners() {
        // Company filter chips
        document.getElementById('companyFilter').addEventListener('click', (e) => {
            if (e.target.classList.contains('company-chip')) {
                this.handleCompanyFilter(e.target.dataset.company);
            }
        });
        
        // Filter controls
        document.getElementById('companySelect').addEventListener('change', (e) => {
            this.currentFilters.company = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('dateFilter').addEventListener('change', (e) => {
            this.currentFilters.date = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.applyFilters();
        });
        
        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });
        

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
    
    async loadSurveyData() {
        console.log('Loading survey data...');
        try {
            // Clear any existing sample data to ensure clean state
            this.clearSampleData();
            
            // Load data from localStorage only - no random data generation
            this.surveyData = this.getStoredSurveyData();
            console.log('Stored survey data:', this.surveyData.length, 'items');
            
            if (this.surveyData.length === 0) {
                console.log('No stored data found. Dashboard will show empty state.');
                // Don't create sample data - just show empty dashboard
                this.showInfo('No survey responses found. Data will appear here once users complete surveys.');
            } else {
                console.log(`Loaded ${this.surveyData.length} existing survey responses`);
            }
            
            this.updateStatistics();
            this.updateCompanyFilters();
            this.applyFilters();
            console.log('Survey data loading completed');
            
        } catch (error) {
            console.error('Error loading survey data:', error);
            this.showError('Failed to load survey data. Please try again.');
        }
    }
    
    getStoredSurveyData() {
        try {
            const stored = localStorage.getItem('surveyResponses');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error parsing stored data:', error);
            return [];
        }
    }
    
    // Sample data generation method removed to prevent random data creation
    // createSampleData() {
    //     // This method has been removed to stop random data generation
    //     // In a real application, data should come from actual survey submissions
    //     // or be loaded from a database/API
    // }
    
    clearSampleData() {
        // Clear any existing sample data from localStorage
        // This ensures the dashboard starts with a clean state
        try {
            const stored = localStorage.getItem('surveyResponses');
            if (stored) {
                const data = JSON.parse(stored);
                // Check if the data looks like sample data (contains "Sample User" or similar patterns)
                const isSampleData = data.some(item => 
                    item.full_name && item.full_name.includes('Sample User') ||
                    item.email && item.email.includes('@example.com')
                );
                
                if (isSampleData) {
                    console.log('Detected sample data, clearing localStorage');
                    localStorage.removeItem('surveyResponses');
                    this.surveyData = [];
                }
            }
        } catch (error) {
            console.error('Error clearing sample data:', error);
        }
    }
    

    
    updateStatistics() {
        const totalResponses = this.surveyData.length;
        const uniqueCompanies = new Set(this.surveyData.map(item => item.company_id)).size;
        
        // Calculate this month's responses
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const thisMonthResponses = this.surveyData.filter(item => 
            new Date(item.timestamp) >= monthStart
        ).length;
        
        // Calculate completion rate (assuming all stored responses are complete)
        const completionRate = totalResponses > 0 ? 100 : 0;
        
        // Get total questions from the data structure
        let totalQuestions = 50; // Default
        if (this.surveyData.length > 0) {
            const sampleResponse = this.surveyData[0];
            const questionKeys = Object.keys(sampleResponse).filter(key => key.startsWith('question_'));
            totalQuestions = questionKeys.length;
        }
        
        // Update UI
        document.getElementById('totalResponses').textContent = totalResponses;
        document.getElementById('totalCompanies').textContent = uniqueCompanies;
        document.getElementById('thisMonth').textContent = thisMonthResponses;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
        document.getElementById('totalQuestions').textContent = totalQuestions;
    }
    
    updateCompanyFilters() {
        const companyFilter = document.getElementById('companyFilter');
        const companySelect = document.getElementById('companySelect');
        
        // Get unique companies
        const uniqueCompanies = [...new Set(this.surveyData.map(item => item.company_id))];
        this.companies = uniqueCompanies.map(id => {
            const sample = this.surveyData.find(item => item.company_id === id);
            return { id, name: sample.company_name };
        });
        
        // Update company filter chips
        companyFilter.innerHTML = `
            <button class="company-chip active" data-company="all">All Companies</button>
            ${this.companies.map(company => 
                `<button class="company-chip" data-company="${company.id}">${company.name}</button>`
            ).join('')}
        `;
        
        // Update company select dropdown
        companySelect.innerHTML = `
            <option value="">All Companies</option>
            ${this.companies.map(company => 
                `<option value="${company.id}">${company.name}</option>`
            ).join('')}
        `;
    }
    
    handleCompanyFilter(companyId) {
        // Update active chip
        document.querySelectorAll('.company-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update company select
        document.getElementById('companySelect').value = companyId;
        
        // Apply filter
        this.currentFilters.company = companyId;
        this.applyFilters();
    }
    
    applyFilters() {
        console.log('Applying filters...');
        console.log('Current filters:', this.currentFilters);
        console.log('Total survey data:', this.surveyData.length);
        
        this.filteredData = this.surveyData.filter(item => {
            // Company filter
            if (this.currentFilters.company !== 'all' && item.company_id !== this.currentFilters.company) {
                return false;
            }
            
            // Date filter
            if (this.currentFilters.date) {
                const itemDate = new Date(item.timestamp);
                const today = new Date();
                
                switch (this.currentFilters.date) {
                    case 'today':
                        if (itemDate.toDateString() !== today.toDateString()) return false;
                        break;
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        if (itemDate < weekAgo) return false;
                        break;
                    case 'month':
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        if (itemDate < monthAgo) return false;
                        break;
                }
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchableFields = [
                    item.full_name,
                    item.company_name,
                    item.position,
                    item.email,
                    item.phone
                ];
                
                if (!searchableFields.some(field => 
                    field && field.toLowerCase().includes(searchTerm)
                )) {
                    return false;
                }
            }
            
            return true;
        });
        
        console.log('Filtered data:', this.filteredData.length, 'items');
        this.renderDataTable();
        console.log('Filters applied and table rendered');
    }
    
    renderDataTable() {
        try {
            console.log('Rendering data table with:', this.filteredData.length, 'items');
            
            const tableBody = document.getElementById('tableBody');
            if (!tableBody) {
                console.error('Table body element not found!');
                return;
            }
            
            if (this.filteredData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="no-data">
                            <i class="fas fa-inbox" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                            <p>No survey responses found matching your criteria.</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            const tableRows = this.filteredData.map(item => {
                const date = new Date(item.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${item.company_name}</td>
                        <td>${item.full_name}</td>
                        <td>${item.position}</td>
                        <td>${item.email}</td>
                        <td>${item.phone}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-sm view-btn" onclick="dashboardManager.viewResponse('${item.timestamp}')" title="View Response">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn btn-danger btn-sm delete-btn" onclick="dashboardManager.deleteResponse('${item.timestamp}')" title="Delete Response">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = tableRows.join('');
            console.log('Table rendered with', tableRows.length, 'rows');
            
            // Verify buttons are present
            const buttons = tableBody.querySelectorAll('.btn');
            console.log('Found', buttons.length, 'buttons in the table');
            
        } catch (error) {
            console.error('Error rendering data table:', error);
            this.showError('Error rendering the data table. Please refresh the page.');
        }
    }
    
    viewResponse(timestamp) {
        console.log('Attempting to view response with timestamp:', timestamp);
        const response = this.surveyData.find(item => item.timestamp === timestamp);
        if (response) {
            console.log('Found response to view:', response);
            console.log('Response object structure:', {
                timestamp: response.timestamp,
                full_name: response.full_name,
                company_name: response.company_name,
                question_count: Object.keys(response).filter(key => key.startsWith('question_')).length,
                all_keys: Object.keys(response)
            });
            this.showResponseModal(response);
        } else {
            console.log('Response not found for timestamp:', timestamp);
        }
    }
    
    deleteResponse(timestamp) {
        console.log('Attempting to delete response with timestamp:', timestamp);
        const response = this.surveyData.find(item => item.timestamp === timestamp);
        if (response) {
            console.log('Found response to delete:', response);
            // Show confirmation dialog
            if (confirm(`Are you sure you want to delete the response from ${response.full_name} (${response.company_name})? This action cannot be undone.`)) {
                console.log('User confirmed deletion');
                // Remove from surveyData array
                this.surveyData = this.surveyData.filter(item => item.timestamp !== timestamp);
                
                // Update localStorage
                localStorage.setItem('surveyResponses', JSON.stringify(this.surveyData));
                
                // Reapply filters and update display
                this.applyFilters();
                this.updateStatistics();
                this.updateCompanyFilters();
                
                // Show success message
                this.showSuccess('Response deleted successfully!');
                console.log('Response deleted successfully');
            } else {
                console.log('User cancelled deletion');
            }
        } else {
            console.log('Response not found for timestamp:', timestamp);
        }
    }
    
    showResponseModal(response) {
        // Create and show a modal with detailed response data
        const modal = document.createElement('div');
        modal.className = 'response-modal';
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
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: var(--text-primary);">Survey Response Details</h2>
                <button onclick="this.closest('.response-modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Respondent Information</h3>
                <p><strong>Name:</strong> ${response.full_name}</p>
                <p><strong>Position:</strong> ${response.position}</p>
                <p><strong>Company:</strong> ${response.company_name}</p>
                <p><strong>Email:</strong> ${response.email}</p>
                <p><strong>Phone:</strong> ${response.phone}</p>
                <p><strong>Date:</strong> ${new Date(response.timestamp).toLocaleString()}</p>
            </div>
            
            <div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Survey Responses</h3>
                ${this.generateQuestionResponses(response)}
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    generateQuestionResponses(response) {
        console.log('Generating question responses for:', response);
        console.log('Response object keys:', Object.keys(response));
        
        let html = '';
        let questionCount = 0;
        let totalQuestions = 0;
        let missingQuestions = [];
        
        // Generate responses for up to 50 questions
        for (let i = 1; i <= 50; i++) {
            const questionKey = `question_${i}`;
            const responseValue = response[questionKey];
            totalQuestions++;
            
            console.log(`Question ${i}:`, questionKey, '=', responseValue);
            
            if (responseValue && responseValue.trim() !== '') {
                questionCount++;
                html += `
                    <div style="margin-bottom: 1rem; padding: 1rem; background: #f9fafb; border-radius: 8px;">
                        <p style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">Question ${i}</p>
                        <p style="margin: 0; color: var(--text-secondary);">${responseValue}</p>
                    </div>
                `;
            } else {
                missingQuestions.push(i);
            }
        }
        
        console.log(`Total questions processed: ${totalQuestions}`);
        console.log(`Questions with responses: ${questionCount}`);
        console.log(`Questions without responses: ${totalQuestions - questionCount}`);
        console.log(`Missing question numbers:`, missingQuestions);
        
        // If no questions have responses, show a message
        if (html === '') {
            html = '<p style="color: #6b7280; font-style: italic;">No responses provided for any questions.</p>';
        }
        
        // Add a detailed summary at the top
        const summaryHtml = `
            <div style="margin-bottom: 1rem; padding: 1rem; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #0288d1;">
                <p style="margin: 0; font-weight: 600; color: #0277bd;">
                    <i class="fas fa-info-circle"></i> 
                    Summary: ${questionCount} out of ${totalQuestions} questions answered
                </p>
                ${missingQuestions.length > 0 ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #0277bd;">Missing responses for questions: ${missingQuestions.join(', ')}</p>` : ''}
            </div>
        `;
        
        return summaryHtml + html;
    }
    
    exportToCSV() {
        if (this.filteredData.length === 0) {
            this.showError('No data to export. Please adjust your filters.');
            return;
        }
        
        // Create CSV content with dynamic headers for up to 50 questions
        const headers = [
            'Timestamp', 'Company ID', 'Company Name', 'Survey ID', 'Survey Title',
            'Full Name', 'Position', 'Email', 'Phone'
        ];
        
        // Add headers for up to 50 questions
        for (let i = 1; i <= 50; i++) {
            headers.push(`Question ${i}`);
        }
        
        const csvContent = [
            headers.join(','),
            ...this.filteredData.map(item => {
                const row = [
                    item.timestamp,
                    item.company_id,
                    `"${item.company_name}"`,
                    item.survey_id,
                    `"${item.survey_title}"`,
                    `"${item.full_name}"`,
                    `"${item.position}"`,
                    item.email,
                    item.phone
                ];
                
                // Add responses for up to 50 questions
                for (let i = 1; i <= 50; i++) {
                    const questionKey = `question_${i}`;
                    row.push(`"${item[questionKey] || ''}"`);
                }
                
                return row.join(',');
            })
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `survey_responses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #ef4444;
            padding: 1rem;
            border-radius: 10px;
            z-index: 10001;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    showSuccess(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #16a34a;
            padding: 1rem;
            border-radius: 10px;
            z-index: 10001;
            max-width: 300px;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
    
    showInfo(message) {
        // Create a temporary info message
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            padding: 1rem;
            border-radius: 10px;
            z-index: 10001;
            max-width: 300px;
        `;
        infoDiv.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;
        
        document.body.appendChild(infoDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (infoDiv.parentNode) {
                infoDiv.parentNode.removeChild(infoDiv);
            }
        }, 5000);
    }
    

    
    
    
    logout() {
        // Clear admin session
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminUsername');
        
        // Redirect to admin login page
        window.location.href = 'admin.html';
    }
}

// Initialize dashboard when page loads
let dashboardManager;
document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
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
