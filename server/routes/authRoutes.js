import express from 'express';
import { authService } from '../services/authService.js';
import { dbService } from '../services/dbService.js';
import { supabaseService } from '../services/supabaseService.js';

const router = express.Router();

// GET /api/auth/status - Check Supabase cloud connectivity vs local gateway
router.get('/status', (req, res) => {
  const status = supabaseService.getStatus();
  res.json({ success: true, ...status });
});

// POST /api/auth/register - Register with Supabase Cloud or Local Resilient Store
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, businessName, category, location, revenueTier } = req.body;
    
    let user = null;
    let provider = 'local';

    // 1. Attempt Supabase Auth registration if configured
    if (supabaseService.isConfigured()) {
      try {
        user = await supabaseService.register({ email, password, name, businessName, category, location, revenueTier });
        if (user) provider = 'supabase';
      } catch (err) {
        console.warn('[AuthRoute] Supabase registration notice, using resilient store:', err.message);
      }
    }

    // 2. Fall back to local store if Supabase not configured or completed
    if (!user) {
      user = authService.register({ email, password, name, businessName, category, location, revenueTier });
      provider = 'local';
    }

    // 3. Sync active business name and telemetry
    if (businessName) {
      const biz = dbService.getBusiness();
      biz.name = businessName;
      if (location) biz.location = location;
      if (category) biz.category = category;
      dbService.saveData();
    }

    dbService.addLog({
      type: 'MERCHANT_REGISTERED',
      agent: 'Auth & Identity Gateway',
      detail: `Enterprise merchant onboarded via ${provider.toUpperCase()}: "${businessName}" (${email}) in ${location || 'Hyderabad'}.`,
      severity: 'COMPLIANCE'
    });

    res.json({ success: true, user, provider });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login - Authenticate via Supabase or Local Resilient Store
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = null;
    let provider = 'local';

    // 1. Attempt Supabase login if configured
    if (supabaseService.isConfigured()) {
      try {
        user = await supabaseService.login({ email, password });
        if (user) provider = 'supabase';
      } catch (err) {
        console.warn('[AuthRoute] Supabase login notice, using resilient store:', err.message);
      }
    }

    // 2. Fall back to local credentials
    if (!user) {
      user = authService.login({ email, password });
      provider = 'local';
    }

    dbService.addLog({
      type: 'MERCHANT_LOGIN',
      agent: 'Auth & Identity Gateway',
      detail: `Operator ${user.name} authenticated via ${provider.toUpperCase()} for "${user.businessName}".`,
      severity: 'INFO'
    });

    res.json({ success: true, user, provider });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

export default router;
