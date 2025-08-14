// Supabase configuration for Insightful Survey System
// Replace these values with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    url: 'https://ygcrltnevomditzljmas.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY3JsdG5ldm9tZGl0emxqbWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDk2MjYsImV4cCI6MjA3MDcyNTYyNn0.wlZ-Gk3wSntsUBnRxSYLp54CD0kmaUWfPmXvVjKqmIk',
    serviceRoleKey: 'YOUR_SERVICE_ROLE_KEY' // You can get this from Supabase dashboard if needed
};

// Supabase client for browser usage
let supabase = null;

// Initialize Supabase client
async function initSupabase() {
    try {
        // Dynamic import to avoid issues in non-module environments
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        
        supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        console.log('✅ Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return false;
    }
}

// Survey data operations
const SurveyService = {
    // Save survey response
    async saveSurveyResponse(surveyData) {
        try {
            if (!supabase) {
                throw new Error('Supabase not initialized');
            }

            const { data, error } = await supabase
                .from('survey_responses')
                .insert([surveyData])
                .select();

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data[0],
                message: 'Survey response saved successfully'
            };
        } catch (error) {
            console.error('Error saving survey response:', error);
            return {
                success: false,
                message: error.message
            };
        }
    },

    // Get all survey responses
    async getAllResponses() {
        try {
            if (!supabase) {
                throw new Error('Supabase not initialized');
            }

            const { data, error } = await supabase
                .from('survey_responses')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data || [],
                count: data ? data.length : 0
            };
        } catch (error) {
            console.error('Error fetching survey responses:', error);
            return {
                success: false,
                message: error.message,
                data: [],
                count: 0
            };
        }
    },

    // Get responses by company
    async getResponsesByCompany(companyId) {
        try {
            if (!supabase) {
                throw new Error('Supabase not initialized');
            }

            const { data, error } = await supabase
                .from('survey_responses')
                .select('*')
                .eq('company_id', companyId)
                .order('timestamp', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data || [],
                count: data ? data.length : 0
            };
        } catch (error) {
            console.error('Error fetching company responses:', error);
            return {
                success: false,
                message: error.message,
                data: [],
                count: 0
            };
        }
    },

    // Get survey statistics
    async getStatistics() {
        try {
            if (!supabase) {
                throw new Error('Supabase not initialized');
            }

            // Get total responses
            const { count: totalResponses, error: totalError } = await supabase
                .from('survey_responses')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // Get unique companies
            const { data: companies, error: companiesError } = await supabase
                .from('survey_responses')
                .select('company_id')
                .order('company_id');

            if (companiesError) throw companiesError;

            const uniqueCompanies = new Set(companies.map(c => c.company_id)).size;

            // Get this month's responses
            const thisMonth = new Date();
            const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
            
            const { count: thisMonthResponses, error: monthError } = await supabase
                .from('survey_responses')
                .select('*', { count: 'exact', head: true })
                .gte('timestamp', monthStart.toISOString());

            if (monthError) throw monthError;

            return {
                success: true,
                stats: {
                    totalResponses: totalResponses || 0,
                    uniqueCompanies,
                    thisMonth: thisMonthResponses || 0,
                    completionRate: (totalResponses || 0) > 0 ? 100 : 0
                }
            };
        } catch (error) {
            console.error('Error calculating statistics:', error);
            return {
                success: false,
                message: error.message,
                stats: {
                    totalResponses: 0,
                    uniqueCompanies: 0,
                    thisMonth: 0,
                    completionRate: 0
                }
            };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, initSupabase, SurveyService };
} else {
    // Browser environment
    window.SupabaseConfig = SUPABASE_CONFIG;
    window.initSupabase = initSupabase;
    window.SurveyService = SurveyService;
} 