import express from 'express';
import { orchestratorAgent } from '../agents/orchestratorAgent.js';
import { swarmEngine } from '../agents/swarmEngine.js';
import { marketingAgent } from '../agents/marketingAgent.js';
import { inventoryAgent } from '../agents/inventoryAgent.js';
import { crmAgent } from '../agents/crmAgent.js';
import { strategyAgent } from '../agents/strategyAgent.js';
import { llmClient } from '../agents/llmClient.js';
import { dbService } from '../services/dbService.js';

const router = express.Router();

// Agent system status and agent roster
router.get('/status', (req, res) => {
  const provider = llmClient.getActiveProvider();
  res.json({
    success: true,
    activeProvider: provider,
    agents: [
      {
        id: 'supervisor',
        name: 'Orchestrator Agent (Supervisor)',
        role: 'Task Routing, Context Synthesis & Edge Coordination',
        status: 'ACTIVE_LISTENING',
        icon: 'Bot'
      },
      {
        id: 'inventory',
        name: 'Billing & Inventory Agent',
        role: 'Real-time Stock Velocity, Barcode Ingestion & Reorder Forecasting',
        status: 'MONITORING_TELEMETRY',
        icon: 'Package'
      },
      {
        id: 'crm',
        name: 'Sales & CRM Agent',
        role: 'Customer Profiling, Lifetime Value & Retention Intelligence',
        status: 'ANALYZING_BEHAVIOR',
        icon: 'Users'
      },
      {
        id: 'strategy',
        name: 'Strategy & Scaling Agent',
        role: 'Virtual Board of Directors, Capital Allocation & SMB Expansion Architect',
        status: 'STRATEGIC_READY',
        icon: 'TrendingUp'
      },
      {
        id: 'marketing',
        name: 'Web & Marketing Agent',
        role: 'Headless CMS Automation, Campaign Copywriting & Social Media Generation',
        status: 'CONTENT_READY',
        icon: 'Megaphone'
      }
    ]
  });
});

// Natural Language Chat with Orchestrator
router.post('/chat', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query string is required.' });
    }
    const result = await orchestratorAgent.handleUserQuery(query);
    res.json({ success: true, result });
  } catch (err) {
    console.error('Agent chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Swarm Consensus Session (Virtual Board of Directors)
router.post('/consensus', async (req, res) => {
  try {
    const { focusProductSku } = req.body || {};
    const consensusPack = await swarmEngine.runConsensusMeeting({ focusProductSku });
    res.json({ success: true, consensusPack });
  } catch (err) {
    console.error('Consensus error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Marketing Content Generation
router.post('/marketing/generate', async (req, res) => {
  try {
    const { focusType, targetSku } = req.body || {};
    const campaign = await marketingAgent.generateCampaign({ focusType, targetSku });
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Human-in-the-Loop Safeguard Action Execution
router.post('/action/execute', (req, res) => {
  try {
    const { actionId, actionTitle, agent } = req.body;
    const business = dbService.getBusiness();

    if (!business.termsAccepted) {
      return res.status(403).json({
        success: false,
        error: 'Legal Disclaimer & Liability Waiver must be accepted before executing autonomous agent recommendations.'
      });
    }

    const logEntry = dbService.addLog({
      type: 'SAFEGUARD_ACTION_EXECUTED',
      agent: agent || 'Merchant Operator',
      detail: `Operator authorized action: "${actionTitle || actionId}". Executed via human-in-the-loop review.`,
      severity: 'COMPLIANCE'
    });
    dbService.saveData();

    res.json({
      success: true,
      message: `Action '${actionTitle || actionId}' executed successfully. Audit logged under ${logEntry.id}.`,
      logEntry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
