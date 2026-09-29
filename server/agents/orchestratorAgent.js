import { llmClient } from './llmClient.js';
import { dbService } from '../services/dbService.js';
import { inventoryAgent } from './inventoryAgent.js';
import { crmAgent } from './crmAgent.js';
import { strategyAgent } from './strategyAgent.js';
import { marketingAgent } from './marketingAgent.js';

export class OrchestratorAgent {
  constructor() {
    this.name = 'Orchestrator Agent (Supervisor)';
    this.code = 'AGENT_SUPERVISOR';
    this.role = 'Task Decomposition, Swarm Routing & Context Synthesis';
  }

  async handleUserQuery(query) {
    const qLower = query.toLowerCase();
    const stats = dbService.getStats();
    const activeProvider = llmClient.getActiveProvider();

    // Log the incoming supervisor event
    dbService.addLog({
      type: 'SUPERVISOR_QUERY_ROUTED',
      agent: this.name,
      detail: `Received operator query: "${query}". Intent classifier initiated.`,
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
    } else if (qLower.includes('strategy') || qLower.includes('expand') || qLower.includes('scaling') || qLower.includes('board') || qLower.includes('revenue') || qLower.includes('roadmap')) {
      delegate = strategyAgent;
      const invData = await inventoryAgent.analyzeInventory();
      const crmData = await crmAgent.analyzeCustomers();
      delegatedResponse = await strategyAgent.synthesizeStrategy({ inventoryData: invData, crmData });
    }

    const systemPrompt = `You are Diligent, the central AI Orchestrator and Chief Autonomous Officer for Indian SMBs.
You oversee Sri Balaji Smart Retail & Tech Mart in Madhapur, Hyderabad.
You have access to real-time telemetry: products, sales ledgers, stock alerts, employee performance, and marketing tools.
Respond with high authority, crisp numbers, business acumen, and warmth. Always reference actionable next steps.`;

    const userPrompt = `Operator Query: "${query}"
Context Stats:
- Store: ${stats.businessName} (${stats.location})
- Top Selling SKU: ${stats.topSeller?.name} (${stats.topSeller?.unitsSoldThisMonth} units/mo)
- Least Selling SKU: ${stats.leastSeller?.name} (${stats.leastSeller?.unitsSoldThisMonth} units/mo)
- Top Employee: ${stats.topEmployee?.name} (₹${stats.topEmployee?.salesGeneratedThisMonth.toLocaleString('en-IN')})
- Trapped Dead Stock Capital: ₹${stats.deadStockValue.toLocaleString('en-IN')}
${delegate ? `Subagent [${delegate.name}] Output: ${JSON.stringify(delegatedResponse)}` : ''}

Provide a direct, conversational executive answer summarizing the situation and recommending a concrete action.`;

    const response = await llmClient.complete({ systemPrompt, userPrompt });

    let finalAnswer = response.text;
    if (!finalAnswer) {
      if (delegate && delegatedResponse) {
        if (delegate.code === 'AGENT_INVENTORY') {
          finalAnswer = `Here is our live inventory assessment: Our top performing product is the **${stats.topSeller?.name}** with ${stats.topSeller?.unitsSoldThisMonth} units sold this month. Conversely, **${stats.leastSeller?.name}** is our slowest mover (only ${stats.leastSeller?.unitsSoldThisMonth} units sold), locking up ₹${stats.deadStockValue.toLocaleString('en-IN')} in working capital. Additionally, **Amul Butter 500g** is at a critical 8 units (min threshold 20). I recommend initiating an instant reorder and bundling the slow-moving stock immediately.`;
        } else if (delegate.code === 'AGENT_MARKETING') {
          finalAnswer = `Our Web & Marketing Agent has prepared a targeted multi-channel campaign: "Madhapur Tech & Festive Flash Clearance". It features an Instagram post with high-converting local hashtags, a 15-second Reels script for our store associate, and a direct WhatsApp Broadcast to move stagnant inventory with an exclusive 25% member perk.`;
        } else if (delegate.code === 'AGENT_CRM') {
          finalAnswer = `Sales & CRM telemetry shows customer retention at 78%. While our Platinum accounts like Ananya Rao are thriving (₹58,900 lifetime spend), customer Meera Joshi is at high churn risk (0.64). I recommend dispatching an automated WhatsApp discount on confectionery and training front-line staff on our boAt companion upsell script.`;
        } else if (delegate.code === 'AGENT_STRATEGY') {
          finalAnswer = `The Virtual Board of Directors recommends a 3-stage scaling roadmap: In 30 days, liquidate ₹1.15L in stagnant Nordic Lamps and Copper Jugs to fund bulk procurement of boAt audio and Amul dairy. In 60 days, launch localized 30-min WhatsApp quick delivery in Madhapur. In 90 days, pilot our second depot in Kondapur. This is projected to boost gross revenue by +28.5%.`;
        }
      } else {
        finalAnswer = `Hello Akhil! Diligent is actively monitoring Sri Balaji Smart Retail. We are currently tracking ₹${stats.totalSalesMonth.toLocaleString('en-IN')} in monthly revenue, 10 catalog SKUs, and 4 store associates. Our top mover is **${stats.topSeller?.name}**, while **${stats.leastSeller?.name}** is our slowest mover. All subagents (Inventory, CRM, Strategy, Marketing) are standing by. What would you like to inspect or execute?`;
      }
    }

    return {
      query,
      answer: finalAnswer,
      delegatedAgent: delegate ? delegate.name : null,
      subagentPayload: delegatedResponse,
      llmProvider: activeProvider,
      timestamp: new Date().toISOString()
    };
  }
}

export const orchestratorAgent = new OrchestratorAgent();
