# Supabase Setup Guide for Insightful Survey System

## 🚀 What is Supabase?

Supabase is an open-source alternative to Firebase that provides:
- **PostgreSQL Database** (real-time, secure)
- **Authentication** (user management)
- **Real-time subscriptions**
- **Auto-generated APIs**
- **Dashboard** for data management
- **Generous free tier** (500MB database, 50,000 monthly active users)

## 📋 Prerequisites

- GitHub account
- Basic understanding of databases
- Your survey system files ready

## 🛠️ Step-by-Step Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New Project"**

### 2. Create New Project

1. **Choose organization** (create one if needed)
2. **Project name**: `insightful-surveys` (or your preferred name)
3. **Database password**: Create a strong password (save it!)
4. **Region**: Choose closest to your users
5. Click **"Create new project"**

### 3. Wait for Setup

- Database setup takes 1-2 minutes
- You'll see a success message when ready

### 4. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://yourproject.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 5. Update Configuration

1. Open `supabase-config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://yourproject.supabase.co', // Your actual project URL
    anonKey: 'your-actual-anon-key-here', // Your actual anon key
    serviceRoleKey: 'your-service-role-key-here' // Your actual service role key
};
```

### 6. Create Database Table

1. Go to **Table Editor** in Supabase dashboard
2. Click **"New table"**
3. Use this SQL to create the table:

```sql
CREATE TABLE survey_responses (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_responses_timestamp ON survey_responses(timestamp);
CREATE INDEX idx_survey_responses_company_id ON survey_responses(company_id);
CREATE INDEX idx_survey_responses_email ON survey_responses(email);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for now - you can restrict this later)
CREATE POLICY "Allow all operations" ON survey_responses FOR ALL USING (true);
```

### 7. Test Your Setup

1. **Start your local server** (if using one)
2. **Open the survey page** in your browser
3. **Complete a test survey**
4. **Check Supabase dashboard** to see if data appears

## 🔧 Troubleshooting

### Common Issues:

#### 1. **"Supabase not initialized" error**
- Check if `supabase-config.js` is loaded before other scripts
- Verify your credentials are correct
- Check browser console for errors

#### 2. **CORS errors**
- Supabase handles CORS automatically
- If you see CORS errors, check your credentials

#### 3. **"Table doesn't exist" error**
- Make sure you created the table in Supabase
- Check the table name matches exactly
- Verify the SQL executed successfully

#### 4. **Data not saving**
- Check browser console for errors
- Verify Supabase client is initialized
- Check if fallback to localStorage is working

## 📊 Monitoring Your Data

### Supabase Dashboard Features:

1. **Table Editor**: View, edit, delete data
2. **SQL Editor**: Run custom queries
3. **Logs**: Monitor API calls and errors
4. **API**: Auto-generated REST and GraphQL APIs
5. **Authentication**: User management (if needed later)

### Useful Queries:

```sql
-- Get total responses
SELECT COUNT(*) FROM survey_responses;

-- Get responses by company
SELECT * FROM survey_responses WHERE company_id = 'school';

-- Get recent responses
SELECT * FROM survey_responses ORDER BY timestamp DESC LIMIT 10;

-- Get statistics
SELECT 
    COUNT(*) as total_responses,
    COUNT(DISTINCT company_id) as unique_companies,
    COUNT(DISTINCT email) as unique_users
FROM survey_responses;
```

## 🚀 Next Steps

### Immediate Benefits:
- ✅ **Real-time data** across all users
- ✅ **Persistent storage** (no more localStorage limitations)
- ✅ **Professional database** with SQL capabilities
- ✅ **Scalable** for production use

### Future Enhancements:
- 🔐 **User authentication** for survey takers
- 📧 **Email notifications** when surveys are completed
- 📊 **Advanced analytics** and reporting
- 🔄 **Real-time updates** in admin dashboard
- 📱 **Mobile app** integration

## 💰 Pricing

### Free Tier (Perfect for development):
- **500MB database**
- **50,000 monthly active users**
- **2GB bandwidth**
- **Unlimited API calls**

### Pro Tier ($25/month):
- **8GB database**
- **100,000 monthly active users**
- **250GB bandwidth**
- **Priority support**

## 🆘 Need Help?

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Community Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] Credentials copied to `supabase-config.js`
- [ ] Database table created
- [ ] Survey data saving to Supabase
- [ ] Admin dashboard loading from Supabase
- [ ] Fallback to localStorage working
- [ ] No console errors

---

**🎉 Congratulations!** You now have a production-ready survey system with a real database! 