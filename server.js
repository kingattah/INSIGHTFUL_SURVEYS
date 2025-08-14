const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Database configuration
const dbConfig = {
    host: 'gateway01.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '41Yk2q1TqK25RYB.root',
    password: 'NHT0xk5HDUxUJtSQ',
    database: 'test',
    ssl: {
        rejectUnauthorized: true
    },
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
};

// Create connection pool
let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('✅ TiDB Cloud connection established successfully');
        
        // Create table if it doesn't exist
        await createSurveyTable(connection);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

async function createSurveyTable(connection) {
    try {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS survey_responses (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                company_id VARCHAR(100) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                survey_id VARCHAR(100) NOT NULL,
                survey_title VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                question_1 TEXT,
                question_2 TEXT,
                question_3 TEXT,
                question_4 TEXT,
                question_5 TEXT,
                question_6 TEXT,
                question_7 TEXT,
                question_8 TEXT,
                question_9 TEXT,
                question_10 TEXT,
                question_11 TEXT,
                question_12 TEXT,
                question_13 TEXT,
                question_14 TEXT,
                question_15 TEXT,
                question_16 TEXT,
                question_17 TEXT,
                question_18 TEXT,
                question_19 TEXT,
                question_20 TEXT,
                question_21 TEXT,
                question_22 TEXT,
                question_23 TEXT,
                question_24 TEXT,
                question_25 TEXT,
                question_26 TEXT,
                question_27 TEXT,
                question_28 TEXT,
                question_29 TEXT,
                question_30 TEXT,
                question_31 TEXT,
                question_32 TEXT,
                question_33 TEXT,
                question_34 TEXT,
                question_35 TEXT,
                question_36 TEXT,
                question_37 TEXT,
                question_38 TEXT,
                question_39 TEXT,
                question_40 TEXT,
                question_41 TEXT,
                question_42 TEXT,
                question_43 TEXT,
                question_44 TEXT,
                question_45 TEXT,
                question_46 TEXT,
                question_47 TEXT,
                question_48 TEXT,
                question_49 TEXT,
                question_50 TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableSQL);
        console.log('✅ Survey responses table ready');
        
    } catch (error) {
        console.error('❌ Error creating table:', error.message);
    }
}

// API Routes

// Test database connection
app.get('/api/test-connection', async (req, res) => {
    try {
        if (!pool) {
            return res.json({ success: false, message: 'Database not initialized' });
        }
        
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
        res.json({ 
            success: true, 
            message: 'TiDB Cloud connection test passed',
            config: {
                host: dbConfig.host,
                port: dbConfig.port,
                database: dbConfig.database,
                user: dbConfig.user ? '***configured***' : 'Not configured'
            }
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: 'Connection test failed: ' + error.message 
        });
    }
});

// Save survey response
app.post('/api/survey', async (req, res) => {
    try {
        if (!pool) {
            return res.json({ success: false, message: 'Database not initialized' });
        }
        
        const surveyData = req.body;
        console.log('Saving survey response:', surveyData);
        
        // Prepare data for insertion
        const fields = [
            'company_id', 'company_name', 'survey_id', 'survey_title',
            'full_name', 'position', 'email', 'phone'
        ];
        
        const values = [
            surveyData.company_id || '',
            surveyData.company_name || '',
            surveyData.survey_id || '',
            surveyData.survey_title || '',
            surveyData.full_name || '',
            surveyData.position || '',
            surveyData.email || '',
            surveyData.phone || ''
        ];
        
        // Add question fields
        for (let i = 1; i <= 50; i++) {
            fields.push(`question_${i}`);
            values.push(surveyData[`question_${i}`] || '');
        }
        
        const sql = `INSERT INTO survey_responses (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
        
        const connection = await pool.getConnection();
        const [result] = await connection.execute(sql, values);
        connection.release();
        
        console.log('Survey response saved with ID:', result.insertId);
        
        res.json({ 
            success: true, 
            message: 'Survey response saved successfully to TiDB Cloud',
            id: result.insertId
        });
        
    } catch (error) {
        console.error('Error saving survey response:', error);
        res.json({ 
            success: false, 
            message: 'Failed to save survey response: ' + error.message 
        });
    }
});

// Get all survey responses
app.get('/api/surveys', async (req, res) => {
    try {
        if (!pool) {
            return res.json({ success: false, message: 'Database not initialized', data: [] });
        }
        
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM survey_responses ORDER BY timestamp DESC');
        connection.release();
        
        res.json({ 
            success: true, 
            data: rows,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.json({ 
            success: false, 
            message: 'Failed to fetch survey responses: ' + error.message,
            data: []
        });
    }
});

// Get survey responses by company
app.get('/api/surveys/company/:companyId', async (req, res) => {
    try {
        if (!pool) {
            return res.json({ success: false, message: 'Database not initialized', data: [] });
        }
        
        const { companyId } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM survey_responses WHERE company_id = ? ORDER BY timestamp DESC',
            [companyId]
        );
        connection.release();
        
        res.json({ 
            success: true, 
            data: rows,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching company responses:', error);
        res.json({ 
            success: false, 
            message: 'Failed to fetch company responses: ' + error.message,
            data: []
        });
    }
});

// Get survey statistics
app.get('/api/statistics', async (req, res) => {
    try {
        if (!pool) {
            return res.json({ 
                success: false, 
                message: 'Database not initialized',
                stats: {
                    totalResponses: 0,
                    uniqueCompanies: 0,
                    thisMonth: 0,
                    completionRate: 0
                }
            });
        }
        
        const connection = await pool.getConnection();
        
        // Get total responses
        const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM survey_responses');
        const totalResponses = totalResult[0].total;
        
        // Get unique companies
        const [companiesResult] = await connection.execute('SELECT COUNT(DISTINCT company_id) as unique FROM survey_responses');
        const uniqueCompanies = companiesResult[0].unique;
        
        // Get this month's responses
        const [monthResult] = await connection.execute(`
            SELECT COUNT(*) as monthTotal 
            FROM survey_responses 
            WHERE MONTH(timestamp) = MONTH(CURRENT_DATE()) 
            AND YEAR(timestamp) = YEAR(CURRENT_DATE())
        `);
        const thisMonth = monthResult[0].monthTotal;
        
        connection.release();
        
        const stats = {
            totalResponses,
            uniqueCompanies,
            thisMonth,
            completionRate: totalResponses > 0 ? 100 : 0
        };
        
        res.json({ 
            success: true, 
            stats
        });
        
    } catch (error) {
        console.error('Error calculating statistics:', error);
        res.json({ 
            success: false, 
            message: 'Failed to calculate statistics: ' + error.message,
            stats: {
                totalResponses: 0,
                uniqueCompanies: 0,
                thisMonth: 0,
                completionRate: 0
            }
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: pool ? 'connected' : 'disconnected'
    });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
async function startServer() {
    console.log('🚀 Starting Insightful Survey Server...');
    
    // Initialize database
    const dbReady = await initializeDatabase();
    
    if (dbReady) {
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`📊 TiDB Cloud connected successfully`);
            console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/`);
        });
    } else {
        console.log('⚠️  Server starting without database connection');
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`❌ TiDB Cloud connection failed - using fallback mode`);
        });
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (pool) {
        await pool.end();
        console.log('✅ Database connections closed');
    }
    process.exit(0);
});

startServer().catch(console.error); 