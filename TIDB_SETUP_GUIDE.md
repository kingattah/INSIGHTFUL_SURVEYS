# 🚀 TiDB Cloud Setup Guide for Insightful Survey Platform

## Overview
This guide will help you set up the Insightful Survey Platform with real TiDB Cloud database integration. The application now includes a Node.js backend that connects directly to your TiDB Cloud database.

## 📋 Prerequisites

- Node.js 16+ installed on your system
- TiDB Cloud account with database credentials
- Git or direct file access to the project

## 🔧 Step 1: Install Dependencies

Open a terminal in your project directory and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `mysql2` - MySQL/TiDB driver
- `cors` - Cross-origin resource sharing
- `nodemon` - Development server (dev dependency)

## 🗄️ Step 2: Verify TiDB Cloud Configuration

Your `db-config.js` file should already contain the correct TiDB Cloud credentials:

```javascript
const DB_CONFIG = {
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '41Yk2q1TqK25RYB.root',
    password: 'NHT0xk5HDUxUJtSQ',
    database: 'test',
    ssl: { rejectUnauthorized: true }
};
```

## 🚀 Step 3: Start the Backend Server

Run the Node.js backend server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see output like:
```
🚀 Starting Insightful Survey Server...
✅ TiDB Cloud connection established successfully
✅ Survey responses table ready
✅ Server running on http://localhost:3000
📊 TiDB Cloud connected successfully
🔗 API endpoints available at http://localhost:3000/api/
```

## 🌐 Step 4: Test the Application

### Option A: Use the Debug Console
1. Open `debug_tidb.html` in your browser
2. Click "Test Connection" to verify TiDB Cloud connectivity
3. Submit a test survey to verify data saving
4. Check the console log for detailed information

### Option B: Use the Main Application
1. Open `index.html` in your browser
2. Navigate to the Survey section
3. Complete a survey to test data persistence
4. Check the admin dashboard for data

## 📊 API Endpoints

The backend provides these REST API endpoints:

- `GET /api/health` - Server and database health check
- `GET /api/test-connection` - Test TiDB Cloud connection
- `POST /api/survey` - Save survey response
- `GET /api/surveys` - Get all survey responses
- `GET /api/surveys/company/:id` - Get responses by company
- `GET /api/statistics` - Get survey statistics

## 🔍 Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Verify TiDB Cloud credentials in `db-config.js`
   - Check if your TiDB Cloud instance is running
   - Ensure your IP is whitelisted in TiDB Cloud

2. **"Port 3000 already in use"**
   - Change the port in `server.js` (line 8)
   - Or stop other services using port 3000

3. **"CORS error"**
   - The backend includes CORS middleware
   - Ensure you're accessing via `http://localhost:3000`

4. **"Table not found"**
   - The server automatically creates the `survey_responses` table
   - Check server logs for table creation messages

### Debug Steps:

1. **Check server logs** for connection errors
2. **Verify TiDB Cloud status** in your dashboard
3. **Test connection manually** using the debug console
4. **Check browser console** for frontend errors

## 📱 Testing the Full Flow

1. **Start the backend server** (`npm start`)
2. **Open the debug console** (`debug_tidb.html`)
3. **Test the connection** using the "Test Connection" button
4. **Submit a test survey** using the form
5. **Check the admin dashboard** to see the data
6. **Export data to CSV** to verify data integrity

## 🔒 Security Notes

- Database credentials are stored in `db-config.js`
- In production, use environment variables
- The backend includes basic CORS protection
- Consider adding authentication for production use

## 📈 Performance Tips

- The backend uses connection pooling for better performance
- Survey responses are cached in localStorage as backup
- Database queries are optimized with proper indexing
- The server handles graceful shutdowns

## 🎯 Next Steps

Once everything is working:

1. **Customize the survey questions** in `script.js`
2. **Add more companies** to the selection interface
3. **Implement user authentication** for survey participants
4. **Add advanced analytics** and reporting features
5. **Deploy to production** with proper security measures

## 📞 Need Help?

- Check the browser console for error messages
- Review the server logs for backend issues
- Verify TiDB Cloud connectivity in your dashboard
- Test individual API endpoints using tools like Postman

---

**Your TiDB Cloud-powered survey platform is now ready! 🎉**

The application will automatically fall back to localStorage if the database is unavailable, ensuring it always works for testing and development. 