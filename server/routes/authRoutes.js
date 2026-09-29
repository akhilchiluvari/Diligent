import express from 'express';
import { authService } from '../services/authService.js';
import { dbService } from '../services/dbService.js';

const router = express.Router();

router.post('/register', (req, res) => {
  try {
    const { email, password, name, businessName, category, location, revenueTier } = req.body;
    const user = authService.register({ email, password, name, businessName, category, location, revenueTier });

    // Update active business name in database
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
      detail: `New enterprise merchant registered: "${businessName}" (${email}) in ${location || 'Hyderabad'}.`,
      severity: 'COMPLIANCE'
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = authService.login({ email, password });

    dbService.addLog({
      type: 'MERCHANT_LOGIN',
      agent: 'Auth & Identity Gateway',
      detail: `Operator ${user.name} logged into console for "${user.businessName}".`,
      severity: 'INFO'
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

export default router;
