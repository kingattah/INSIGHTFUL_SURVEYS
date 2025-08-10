# Insightful - Tech Survey Platform

A professional tech survey platform that delivers actionable data and drives innovation through comprehensive surveys and data-driven solutions.

## Features

### Survey System
- **Company Selection**: Choose from multiple companies to take surveys
- **Dynamic Questions**: Support for multiple choice and text input questions
- **Progress Tracking**: Visual progress bar and navigation controls
- **User Information Collection**: Comprehensive user data collection
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin System
- **Secure Login**: Admin authentication with username/password
- **Dashboard Overview**: Real-time statistics and data visualization
- **Survey Data Management**: View, filter, and search survey responses
- **CSV Export**: Download filtered data in CSV format
- **Company Filtering**: Filter responses by company, date, and search terms

## Admin Access

### Login Credentials
- **Username**: `admin`
- **Password**: `insightful2024`

### Access Points
- Navigate to `/admin.html` from any page
- Use the "Admin" link in the main navigation

## Data Storage

### CSV Backend
- Survey responses are stored in a structured format
- Data includes user information, company details, and survey responses
- Supports up to 50 survey questions per response
- Automatic timestamp and metadata tracking

### Data Fields
- Timestamp, Company ID, Company Name
- Survey ID, Survey Title
- Full Name, Position, Email, Phone
- Question 1-50 responses

## File Structure

```
NETWEB/
├── index.html              # Main homepage
├── companies.html          # Company selection page
├── survey.html            # Survey interface
├── admin.html             # Admin login page
├── dashboard.html         # Admin dashboard
├── script.js              # Main JavaScript functionality
├── survey.js              # Survey management system
├── admin.js               # Admin authentication
├── dashboard.js           # Dashboard functionality
├── styles.css             # Main stylesheet
├── data/
│   └── survey_responses.csv  # CSV data storage
└── img/                   # Company logos and images
```

## Usage

### For Survey Participants
1. Visit the homepage and navigate to Companies
2. Select your company from the list
3. Fill out the user information form
4. Complete the survey questions
5. Submit your responses

### For Administrators
1. Navigate to the Admin page
2. Login with admin credentials
3. View dashboard statistics and overview
4. Filter and search survey responses
5. Export data to CSV format
6. View detailed response information

## Technical Details

### Frontend Technologies
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid and Flexbox
- Font Awesome icons for enhanced UI
- AOS (Animate On Scroll) for animations

### Data Management
- LocalStorage for client-side data persistence
- CSV format for data export
- JSON structure for internal data handling
- Session-based authentication for admin access

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Progressive enhancement approach

## Security Features

- Admin authentication system
- Session-based access control
- Secure credential validation
- Protected admin routes

## Future Enhancements

- Database integration for production use
- Real-time data synchronization
- Advanced analytics and reporting
- User role management
- API endpoints for external integrations

## Getting Started

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Navigate through the application
4. Access admin features via `/admin.html`

## Support

For technical support or questions about the platform, please refer to the documentation or contact the development team.

---

© 2024 Insightful. All rights reserved.
