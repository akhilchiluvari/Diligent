import assert from 'assert';
import { dbService } from '../services/dbService.js';
import { inventoryAgent } from '../agents/inventoryAgent.js';
import { crmAgent } from '../agents/crmAgent.js';
import { strategyAgent } from '../agents/strategyAgent.js';
import { marketingAgent } from '../agents/marketingAgent.js';
import { orchestratorAgent } from '../agents/orchestratorAgent.js';
import { swarmEngine } from '../agents/swarmEngine.js';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Running Diligent Multi-Agent Platform Test Suite');
  console.log('====================================================\n');

  // Test 1: DB Service & Hard Metrics
  console.log('🧪 Test 1: Verifying Relational DB & Telemetry...');
  const stats = dbService.getStats();
  assert(stats.totalInventoryValue > 0, 'Inventory value must be > 0');
  assert(stats.topSeller !== undefined, 'Top seller must be resolved');
  assert(stats.leastSeller !== undefined, 'Least seller must be resolved');
  console.log(`   ✅ DB verified: ${stats.businessName} | Inventory Value: ₹${stats.totalInventoryValue.toLocaleString('en-IN')}`);
  console.log(`   ✅ Top Mover: ${stats.topSeller.name} | Stagnant SKU: ${stats.leastSeller.name}`);

  // Test 2: Barcode Lookup
  console.log('\n🧪 Test 2: Testing Barcode Scanner Ingestion...');
  const boatProd = dbService.getProductByBarcode('8901030825010');
  assert(boatProd && boatProd.sku === 'ELEC-BOAT-255', 'Barcode lookup failed');
  console.log(`   ✅ Barcode 8901030825010 matched: ${boatProd.name}`);

  // Test 3: Inventory Agent Analysis
  console.log('\n🧪 Test 3: Executing Billing & Inventory Agent...');
  const invReport = await inventoryAgent.analyzeInventory();
  assert(invReport.agent.includes('Inventory'), 'Agent name mismatch');
  assert(invReport.criticalAlerts.length > 0, 'Critical alerts should be populated');
  console.log(`   ✅ Inventory Agent executed: Found ${invReport.criticalAlerts.length} critical alert(s)`);
  console.log(`   ⚠️ Alert sample: "${invReport.criticalAlerts[0]}"`);

  // Test 4: CRM Agent Analysis
  console.log('\n🧪 Test 4: Executing Sales & CRM Agent...');
  const crmReport = await crmAgent.analyzeCustomers();
  assert(crmReport.agent.includes('CRM'), 'Agent name mismatch');
  assert(crmReport.churnAlerts.length > 0, 'Churn alerts should be populated');
  console.log(`   ✅ CRM Agent executed: Customer churn risk analyzed`);

  // Test 5: Strategy Agent Synthesis
  console.log('\n🧪 Test 5: Executing Strategy & Scaling Agent (Virtual Board of Directors)...');
  const stratReport = await strategyAgent.synthesizeStrategy({ inventoryData: invReport, crmData: crmReport });
  assert(stratReport.roadmap30_60_90 !== undefined, 'Roadmap must be generated');
  console.log(`   ✅ Strategy Agent synthesized 30-60-90 Day Scaling Plan`);
  console.log(`   📈 Projected Revenue Boost: ${stratReport.projectedMetrics?.expectedRevenueBoost || '+28%'}`);

  // Test 6: Marketing Agent Content Generation
  console.log('\n🧪 Test 6: Executing Web & Marketing Agent...');
  const mktReport = await marketingAgent.generateCampaign({ focusType: 'DEAD_STOCK_CLEARANCE' });
  assert(mktReport.instagramPost && mktReport.whatsAppBroadcast, 'Marketing copy must be generated');
  console.log(`   ✅ Marketing Agent generated Instagram & WhatsApp campaign for ${mktReport.featuredProduct}`);

  // Test 7: Swarm Consensus Engine
  console.log('\n🧪 Test 7: Triggering Full Swarm Consensus Session...');
  const consensusPack = await swarmEngine.runConsensusMeeting();
  assert(consensusPack.actionableSteps.length >= 4, 'Must have at least 4 actionable steps');
  console.log(`   ✅ Consensus Session ${consensusPack.sessionId} completed in ${consensusPack.executionDurationMs}ms`);
  console.log(`   🎯 Alignment Score: ${consensusPack.consensusAlignmentScore}`);

  // Test 8: Orchestrator Supervisor Query Routing
  console.log('\n🧪 Test 8: Testing Orchestrator Supervisor NL Query Routing...');
  const chatResponse = await orchestratorAgent.handleUserQuery('What is our least sold product and how do we fix it?');
  assert(chatResponse.answer && chatResponse.answer.length > 20, 'Orchestrator answer must be substantial');
  console.log(`   ✅ Orchestrator routed query successfully:`);
  console.log(`   💬 "${chatResponse.answer.slice(0, 140)}..."`);

  console.log('\n====================================================');
  console.log('🎉 ALL MULTI-AGENT ENGINE TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
