import { llmClient } from './llmClient.js';
import { dbService } from '../services/dbService.js';
import { inventoryAgent } from './inventoryAgent.js';
import { crmAgent } from './crmAgent.js';
import { strategyAgent } from './strategyAgent.js';
import { marketingAgent } from './marketingAgent.js';

export class OrchestratorAgent {
  constructor() {
    this.name = 'Orchestrator Agent (Dili)';
    this.code = 'AGENT_SUPERVISOR';
    this.role = 'Task Decomposition, Swarm Routing & Context Synthesis';
  }

  async handleUserQuery(query, { language = 'en', history = [] } = {}) {
    const qLower = query.toLowerCase();
    const stats = dbService.getStats();
    const employees = dbService.getEmployees();
    const activeProvider = llmClient.getActiveProvider();

    // Log the incoming supervisor event
    dbService.addLog({
      type: 'SUPERVISOR_QUERY_ROUTED',
      agent: this.name,
      detail: `Operator query: "${query.slice(0, 80)}..." [Language: ${language}]. Routing to swarm.`,
      severity: 'INFO'
    });

    // Subagent delegation heuristics
    let delegate = null;
    let delegatedResponse = null;

    if (qLower.includes('inventory') || qLower.includes('stock') || qLower.includes('least') || qLower.includes('most') || qLower.includes('product') || qLower.includes('butter') || qLower.includes('barcode')) {
      delegate = inventoryAgent;
      delegatedResponse = await inventoryAgent.analyzeInventory();
    } else if (qLower.includes('marketing') || qLower.includes('instagram') || qLower.includes('post') || qLower.includes('whatsapp') || qLower.includes('campaign') || qLower.includes('banner')) {
      delegate = marketingAgent;
      delegatedResponse = await marketingAgent.generateCampaign({});
    } else if (qLower.includes('customer') || qLower.includes('crm') || qLower.includes('churn') || qLower.includes('upsell') || qLower.includes('retention')) {
      delegate = crmAgent;
      delegatedResponse = await crmAgent.analyzeCustomers();
    } else if (qLower.includes('team') || qLower.includes('employee') || qLower.includes('division') || qLower.includes('hire') || qLower.includes('expand team') || qLower.includes('workforce') || qLower.includes('pooja') || qLower.includes('kiran')) {
      delegate = { name: 'Workforce Coordination Agent (Worka)', code: 'AGENT_WORKFORCE' };
      delegatedResponse = {
        totalHeadcount: employees.length,
        divisions: [
          { name: "POS Checkout & Customer Billing", lead: "Pooja Sharma", staffCount: 2, currentEfficiency: "96%", recommendation: "Add 1 weekend part-time cashier to reduce queue wait time by 40%." },
          { name: "Electronics & High-Margin Floor Sales", lead: "Rahul Varma", staffCount: 1, currentEfficiency: "88%", recommendation: "Realign shift to 17:30 - 21:30 during peak Cyber Towers commuter footfall." },
          { name: "Inventory Inward & Cold-Chain Storage", lead: "Sunita Devi", staffCount: 1, currentEfficiency: "94%", recommendation: "Automate barcode threshold syncing with supplier POs." }
        ],
        expansionPlan: "Hire 1 Delivery Runner for 30-min WhatsApp quick commerce in Madhapur + 1 Weekend Billing Associate.",
        coordinationProtocol: "Daily 07:45 AM stock-to-counter sync; instant alert from Inventory to Cashier when SKU is under 15 units."
      };
    } else if (qLower.includes('strategy') || qLower.includes('expand') || qLower.includes('scaling') || qLower.includes('board') || qLower.includes('revenue') || qLower.includes('roadmap')) {
      delegate = strategyAgent;
      const invData = await inventoryAgent.analyzeInventory();
      const crmData = await crmAgent.analyzeCustomers();
      delegatedResponse = await strategyAgent.synthesizeStrategy({ inventoryData: invData, crmData });
    }

    // Language instructions
    const langInstructions = {
      en: 'Respond in professional, clean English.',
      te: 'Respond fluently in Telugu (తెలుగు) script with warm business acumen suitable for a retail entrepreneur in Hyderabad.',
      hi: 'Respond fluently in Hindi (हिन्दी) script with respectful, clear business guidance.',
      ta: 'Respond fluently in Tamil (தமிழ்) script with precise business recommendations.',
      kn: 'Respond fluently in Kannada (ಕನ್ನಡ) script.',
      es: 'Respond fluently in Spanish (Español).'
    };

    const targetLangPrompt = langInstructions[language] || langInstructions.en;

    const systemPrompt = `You are Diligent, the central AI Chief Operating Officer and Virtual Consultant for retail SMBs.
You oversee Sri Balaji Smart Retail & Tech Mart in Madhapur, Hyderabad.
You have access to live telemetry: products, sales ledgers, stock alerts, employee performance across divisions, and marketing tools.

FORMATTING REQUIREMENTS:
- Structure your response cleanly using markdown headings (##, ###), bullet points, and bold metric callouts.
- When referencing amounts, format in Indian Rupees (₹).
- Keep responses articulate, highly actionable, and avoid conversational filler.
- ${targetLangPrompt}`;

    // Format recent chat history if provided
    let historyContext = '';
    if (Array.isArray(history) && history.length > 0) {
      historyContext = '\nRecent Chat History:\n' + history.slice(-4).map(h => `${h.sender === 'user' ? 'Operator' : 'Diligent'}: ${h.text}`).join('\n') + '\n';
    }

    const userPrompt = `${historyContext}Operator Query: "${query}"
Context Stats:
- Store: ${stats.businessName} (${stats.location})
- Monthly Sales: ₹${stats.totalSalesMonth.toLocaleString('en-IN')} across ${stats.totalUnitsSold} units
- Top Selling SKU: ${stats.topSeller?.name} (${stats.topSeller?.unitsSoldThisMonth} units/mo)
- Least Selling SKU: ${stats.leastSeller?.name} (${stats.leastSeller?.unitsSoldThisMonth} units/mo)
- Trapped Dead Stock Capital: ₹${stats.deadStockValue.toLocaleString('en-IN')}
- Active Divisions: POS Checkout, Floor Sales, Inventory Inward
${delegate ? `Subagent [${delegate.name}] Synthesis: ${JSON.stringify(delegatedResponse)}` : ''}

Provide a well-structured executive analysis and concrete next steps.`;

    const response = await llmClient.complete({ systemPrompt, userPrompt });

    let finalAnswer = response.text;
    if (!finalAnswer) {
      if (delegate && delegatedResponse) {
        if (delegate.code === 'AGENT_INVENTORY') {
          finalAnswer = `### 📦 Live Inventory Assessment\n\n- **Top Performer:** **${stats.topSeller?.name}** with ${stats.topSeller?.unitsSoldThisMonth} units billed this month.\n- **Stagnant Capital:** **${stats.leastSeller?.name}** has only sold ${stats.leastSeller?.unitsSoldThisMonth} units, locking up **₹${stats.deadStockValue.toLocaleString('en-IN')}** in working capital.\n- **Critical Stockout Risk:** **Amul Butter 500g** is down to **8 units** (safety threshold: 20).\n\n**Action Item:** Place a replenishment purchase order for 120 units of Amul Butter immediately and bundle the stagnant stock at 25% off.`;
        } else if (delegate.code === 'AGENT_WORKFORCE') {
          finalAnswer = `### 👥 Team Divisions & Coordination Directive\n\nOur store operates across **3 core divisions** with **4 total staff members**:\n\n1. **POS & Billing Division** (Lead: Pooja Sharma)\n   - *Performance:* 265 transactions billed, ₹2,48,500 monthly sales (96% efficiency).\n   - *Recommendation:* Hire 1 weekend part-time billing cashier to eliminate peak-hour queue abandonments.\n\n2. **Electronics & Floor Sales Division** (Lead: Rahul Varma)\n   - *Performance:* Average basket size ₹1,427, 31% upsell conversion.\n   - *Recommendation:* Realign shift to 17:30 - 21:30 to intercept tech workers returning from Cyber Towers.\n\n3. **Inventory Inward & Warehouse** (Lead: Sunita Devi)\n   - *Performance:* 99% attendance, 100% PO inward reconciliation.\n   - *Coordination Protocol:* Establish real-time barcode threshold alert: when counter stock falls under 10 units, Sunita receives automatic shelf-restock notification.`;
        } else if (delegate.code === 'AGENT_MARKETING') {
          finalAnswer = `### 📢 Multi-Channel Campaign: Madhapur Flash Clearance\n\nOur Web & Marketing Agent has prepared an omni-channel release:\n\n- **Instagram Post:** Targeted at HITEC City tech professionals featuring the Nordic Smart LED Desk Lamp at ₹1,874 (25% off).\n- **WhatsApp VIP Broadcast:** Ready-to-send template for Gold/Platinum members with 30-minute delivery in Madhapur.\n- **Headless CMS Banner:** Dynamic homepage banner pre-configured for instant activation.`;
        } else if (delegate.code === 'AGENT_CRM') {
          finalAnswer = `### 👥 Customer Health & Retention Intelligence\n\n- **Store Retention Rate:** 78% healthy repeat rate.\n- **High-Value Concentration:** Platinum members like Ananya Rao (₹58,900 LTV) account for 28% of grocery volume.\n- **Churn Hazard:** Meera Joshi exhibits a **0.64 churn risk score** due to a 20-day lapse in visits.\n\n**Intervention:** Dispatch an automated WhatsApp 10% confectionery coupon valid for 72 hours.`;
        } else if (delegate.code === 'AGENT_STRATEGY') {
          finalAnswer = `### 🏛️ Virtual Board of Directors: SMB Scaling Roadmap\n\nTo transition from ₹15L/month to ₹35L/month GMV:\n\n1. **Day 30 (Liquidation):** Free up **₹1,15,000** by clearing stagnant lamps and copper jugs at 25% off.\n2. **Day 60 (Reinvestment):** Channel recovered liquidity into bulk procurement of boAt audio (43% margin) and launch 30-min WhatsApp delivery.\n3. **Day 90 (Expansion):** Pilot micro-fulfillment hub in Kondapur to serve corporate IT snack orders.\n\n*Projected Gross Revenue Gain:* **+28.5%**`;
        }
      } else {
        finalAnswer = `### 👋 Welcome to Diligent\n\nI am your Autonomous Business Consultant overseeing **${stats.businessName}** in Madhapur, Hyderabad.\n\n- **Current Monthly Sales:** ₹${stats.totalSalesMonth.toLocaleString('en-IN')}\n- **Monitored Inventory Capital:** ₹${stats.totalInventoryValue.toLocaleString('en-IN')}\n- **Trapped Dead Stock:** ₹${stats.deadStockValue.toLocaleString('en-IN')}\n- **Store Associates:** 4 staff across 3 divisions\n\nAll specialized teammates (Dili, Indy, Cera, Strat, Maya, Worka, Lex) are synchronized. What would you like to review?`;
      }
    }

    return {
      query,
      answer: finalAnswer,
      delegatedAgent: delegate ? delegate.name : 'Chief Orchestrator (Dili)',
      subagentPayload: delegatedResponse,
      llmProvider: activeProvider,
      language,
      timestamp: new Date().toISOString()
    };
  }
}

export const orchestratorAgent = new OrchestratorAgent();
