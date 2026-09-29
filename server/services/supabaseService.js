import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    // Connection string keys
    this.databaseUrl = process.env.DATABASE_URL || ''; // Transaction pooler (port 6543)
    this.sessionPoolerUrl = process.env.SESSION_POOLER_URL || ''; // Session pooler (port 5432)
    this.directUrl = process.env.DIRECT_URL || ''; // Direct connection (port 5432)

    this.client = null;
    this.pgPool = null;

    // 1. Initialize Supabase JS Client (for Auth, Storage, REST)
    const effectiveKey = this.supabaseServiceKey || this.supabaseAnonKey;
    if (this.supabaseUrl && effectiveKey) {
      try {
        this.client = createClient(this.supabaseUrl, effectiveKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        });
        console.log(`[Supabase] REST & Auth client initialized successfully (${this.supabaseUrl})`);
      } catch (err) {
        console.warn('[Supabase] Warning initializing REST client:', err.message);
      }
    } else {
      console.log('[Supabase] REST API credentials not detected. Operating in resilient local storage mode.');
    }

    // 2. Initialize PostgreSQL Pooler (for high-concurrency database queries)
    const effectiveDbUrl = this.databaseUrl || this.sessionPoolerUrl || this.directUrl;
    if (effectiveDbUrl) {
      try {
        this.pgPool = new Pool({
          connectionString: effectiveDbUrl,
          ssl: { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000
        });

        // Test Postgres connection asynchronously
        this.pgPool.query('SELECT NOW() as current_time', (err, res) => {
          if (err) {
            console.warn('[Supabase Postgres] Note: Pool connection ping notice:', err.message);
          } else {
            console.log('[Supabase Postgres] Cloud PostgreSQL connected successfully at:', res.rows[0]?.current_time);
          }
        });
      } catch (poolErr) {
        console.warn('[Supabase Postgres] Pooler init notice:', poolErr.message);
      }
    } else {
      console.log('[Supabase Postgres] DATABASE_URL / DIRECT_URL not set in env. Ready for pooler integration.');
    }
  }

  isConfigured() {
    return Boolean(this.client || this.pgPool);
  }

  getStatus() {
    return {
      configured: this.isConfigured(),
      hasClient: Boolean(this.client),
      hasPostgresPool: Boolean(this.pgPool),
      supabaseUrl: this.supabaseUrl ? this.supabaseUrl.replace(/https:\/\/(.{4}).*(\..*)/, 'https://$1***$2') : null,
      poolerType: this.databaseUrl ? 'Transaction Pooler (Port 6543)' : this.directUrl ? 'Direct / Session Pooler' : 'None',
      mode: this.isConfigured() ? 'CLOUD_SUPABASE' : 'RESILIENT_LOCAL_FALLBACK'
    };
  }

  // Register user into Supabase Auth and public.users table
  async register({ email, password, name, businessName, category, location, revenueTier }) {
    if (!this.client) return null;

    try {
      // 1. Register with Supabase Auth
      const { data: authData, error: authError } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            business_name: businessName,
            category,
            location,
            revenue_tier: revenueTier
          }
        }
      });

      const userId = authData?.user?.id || `usr_${Date.now()}`;

      // 2. Upsert profile into public.users table
      const { data, error } = await this.client
        .from('users')
        .upsert([
          {
            id: userId,
            email,
            name,
            business_name: businessName,
            category,
            location,
            revenue_tier: revenueTier,
            created_at: new Date().toISOString()
          }
        ], { onConflict: 'email' })
        .select()
        .single();

      if (error) {
        console.warn('[Supabase] public.users upsert warning:', error.message);
      }

      return {
        id: userId,
        email,
        name,
        businessName,
        category,
        location,
        revenueTier,
        authProvider: 'Supabase'
      };
    } catch (err) {
      console.warn('[Supabase] Register notice (falling back):', err.message);
      return null;
    }
  }

  // Login user via Supabase Auth
  async login({ email, password }) {
    if (!this.client) return null;

    try {
      const { data: authData, error: authError } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData?.user) {
        console.warn('[Supabase] Auth login notice:', authError?.message);
        return null;
      }

      const user = authData.user;
      
      // Attempt to load full profile from users table
      let profile = null;
      try {
        const { data } = await this.client
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = data;
      } catch (pe) {
        // Ignore table read error, fallback to user metadata
      }

      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || 'Store Founder',
        businessName: profile?.business_name || user.user_metadata?.business_name || 'Sri Balaji Smart Retail',
        category: profile?.category || user.user_metadata?.category || 'Retail',
        location: profile?.location || user.user_metadata?.location || 'Hyderabad, Telangana',
        revenueTier: profile?.revenue_tier || user.user_metadata?.revenue_tier || '₹15L - ₹35L / month',
        authProvider: 'Supabase'
      };
    } catch (err) {
      console.warn('[Supabase] Login notice:', err.message);
      return null;
    }
  }

  // Save conversation message to persistent cloud memory
  async saveChatMessage({ userId = 'usr_001', sessionId = 'sess_default', title, sender, text, delegatedAgent, language = 'en' }) {
    if (!this.client) return null;

    try {
      const { data, error } = await this.client
        .from('chat_history')
        .insert([
          {
            user_id: userId,
            session_id: sessionId,
            title: title || 'Executive Operations Consultation',
            sender,
            text,
            delegated_agent: delegatedAgent || 'Orchestrator',
            language,
            created_at: new Date().toISOString()
          }
        ]);

      return data;
    } catch (err) {
      console.warn('[Supabase] Save chat history warning:', err.message);
      return null;
    }
  }

  // Retrieve chat session history
  async getChatHistory(sessionId = 'sess_default') {
    if (!this.client) return null;

    try {
      const { data, error } = await this.client
        .from('chat_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  // Record audit log entry in Supabase
  async logAudit({ type, agent, detail, severity = 'INFO' }) {
    if (!this.client) return null;

    try {
      const { data } = await this.client
        .from('audit_logs')
        .insert([
          {
            type,
            agent,
            detail,
            severity,
            timestamp: new Date().toISOString()
          }
        ]);
      return data;
    } catch (err) {
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();
