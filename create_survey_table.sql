-- SQL Script to Create survey_responses Table in Supabase
-- Copy this entire script and run it in your Supabase SQL Editor

-- Create the survey_responses table
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

-- Verify the table was created
SELECT 'Table survey_responses created successfully!' as status; 