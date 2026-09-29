import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import BoardroomView from './components/BoardroomView';
import InventoryTerminal from './components/InventoryTerminal';
import MarketingStudio from './components/MarketingStudio';
import WorkforceView from './components/WorkforceView';
import CopilotChat from './components/CopilotChat';
import AuditLogsView from './components/AuditLogsView';
import LegalModal from './components/LegalModal';
import SafeguardModal from './components/SafeguardModal';
import { Users, Package, Megaphone, Terminal, Bot, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('boardroom');
  const [stats, setStats] = useState(null);
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [leastSellers, setLeastSellers] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [legalData, setLegalData] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);

  // Agent Swarm states
  const [consensusData, setConsensusData] = useState(null);
  const [isConsensusRunning, setIsConsensusRunning] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I am Diligent, your Autonomous Business Consultant. I'm connected to your real-time POS barcode scans, inventory ledgers, and employee metrics. What would you like to review today?",
      time: 'Just now'
    }
  ]);
  const [isChatWaiting, setIsChatWaiting] = useState(false);

  // Safeguard state
  const [selectedSafeguardAction, setSelectedSafeguardAction] = useState(null);
  const [isSafeguardOpen, setIsSafeguardOpen] = useState(false);

  // Initial Data Fetch
  const refreshAllData = async () => {
    try {
      // 1. Stats
      const statsRes = await fetch('/api/dashboard/stats');
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        setStats(statsJson.stats);
        setTermsAccepted(statsJson.stats.termsAccepted);
        if (!statsJson.stats.termsAccepted) {
          setIsLegalModalOpen(true);
        }
      }

      // 2. Products
      const prodRes = await fetch('/api/products');
      const prodJson = await prodRes.json();
      if (prodJson.success) {
        setProducts(prodJson.products);
        setTopSellers(prodJson.topSellers);
        setLeastSellers(prodJson.leastSellers);
        setLowStock(prodJson.lowStock);
      }

      // 3. Employees
      const empRes = await fetch('/api/employees');
      const empJson = await empRes.json();
      if (empJson.success) setEmployees(empJson.employees);

      // 4. Logs
      const logsRes = await fetch('/api/logs?limit=30');
      const logsJson = await logsRes.json();
      if (logsJson.success) setLogs(logsJson.logs);

      // 5. Agent Provider
      const agentRes = await fetch('/api/agents/status');
      const agentJson = await agentRes.json();
      if (agentJson.success) setActiveProvider(agentJson.activeProvider);

      // 6. Legal Terms
      const legalRes = await fetch('/api/legal/terms');
      const legalJson = await legalRes.json();
      if (legalJson.success) setLegalData(legalJson.legal);

    } catch (err) {
      console.error('Failed fetching data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Trigger Swarm Consensus
  const handleTriggerConsensus = async () => {
    setIsConsensusRunning(true);
    try {
      const res = await fetch('/api/agents/consensus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setConsensusData(data.consensusPack);
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConsensusRunning(false);
    }
  };

  // Run initial consensus once on mount if empty
  useEffect(() => {
    if (!consensusData && !isConsensusRunning) {
      handleTriggerConsensus();
    }
  }, []);

  // Scan Sale via POS simulator
  const handleScanSale = async (payload) => {
    const res = await fetch('/api/sales/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      refreshAllData();
    }
    return data;
  };

  // Generate Marketing Campaign
  const handleGenerateCampaign = async ({ focusType, targetSku }) => {
    setIsGeneratingCampaign(true);
    try {
      const res = await fetch('/api/agents/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusType, targetSku })
      });
      const data = await res.json();
      if (data.success) {
        setCampaignData(data.campaign);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  // Chat message send
  const handleSendMessage = async (queryText) => {
    const userMsg = {
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatWaiting(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      if (data.success) {
        const botMsg = {
          sender: 'bot',
          text: data.result.answer,
          delegatedAgent: data.result.delegatedAgent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botMsg]);
        refreshAllData();
      }
    } catch (err) {
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: `Error connecting to supervisor: ${err.message}`,
        time: 'Just now'
      }]);
    } finally {
      setIsChatWaiting(false);
    }
  };

  // Accept Legal Terms
  const handleAcceptTerms = async () => {
    const res = await fetch('/api/legal/accept', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setTermsAccepted(true);
      refreshAllData();
    }
  };

  // Safeguard Action Execution
  const handleOpenSafeguard = (actionItem) => {
    setSelectedSafeguardAction(actionItem);
    setIsSafeguardOpen(true);
  };

  const handleConfirmSafeguard = async (actionItem) => {
    const res = await fetch('/api/agents/action/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionId: actionItem.id,
        actionTitle: actionItem.title,
        agent: actionItem.agent
      })
    });
    const data = await res.json();
    if (data.success) {
      refreshAllData();
    }
  };

  const navigationTabs = [
    { id: 'boardroom', label: 'Virtual Board of Directors', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory & Barcode Scanner', icon: Package },
    { id: 'marketing', label: 'AI Marketing Studio', icon: Megaphone },
    { id: 'workforce', label: 'Workforce & Productivity', icon: Users },
    { id: 'copilot', label: 'Diligent Copilot (Chat)', icon: Bot },
    { id: 'telemetry', label: 'Live Telemetry & Logs', icon: Terminal }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navbar */}
      <Navbar
        business={{ name: stats?.businessName }}
        termsAccepted={termsAccepted}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        activeProvider={activeProvider}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px 24px', width: '100%', flex: 1 }}>
        {/* Top KPI Metrics Bar */}
        <StatsBar
          stats={stats}
          onNavigateToMarketing={() => setActiveTab('marketing')}
          onNavigateToInventory={() => setActiveTab('inventory')}
        />

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          marginBottom: '28px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {navigationTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'boardroom' && (
          <BoardroomView
            consensusData={consensusData}
            onTriggerConsensus={handleTriggerConsensus}
            isRunning={isConsensusRunning}
            onExecuteAction={handleOpenSafeguard}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTerminal
            products={products}
            topSellers={topSellers}
            leastSellers={leastSellers}
            lowStock={lowStock}
            onScanSale={handleScanSale}
            employees={employees}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingStudio
            campaignData={campaignData || consensusData?.marketingReport}
            onGenerateCampaign={handleGenerateCampaign}
            products={products}
            isGenerating={isGeneratingCampaign}
          />
        )}

        {activeTab === 'workforce' && (
          <WorkforceView employees={employees} />
        )}

        {activeTab === 'copilot' && (
          <CopilotChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isWaiting={isChatWaiting}
          />
        )}

        {activeTab === 'telemetry' && (
          <AuditLogsView logs={logs} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        backgroundColor: 'rgba(10, 14, 23, 0.9)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>Diligent AI</strong> • Multi-Agent Operational Engine for SMBs • Microsoft Hack with Hyderabad 3.0
          </div>
          <div>
            Built with xAI Grok / Groq LPU Inference & Edge Architecture • Hybrid Cloud-Edge Swarm
          </div>
        </div>
      </footer>

      {/* Legal & Liability Gateway Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        termsAccepted={termsAccepted}
        onAcceptTerms={handleAcceptTerms}
        legalData={legalData}
      />

      {/* Human-in-the-Loop Safeguard Action Execution Modal */}
      <SafeguardModal
        isOpen={isSafeguardOpen}
        onClose={() => setIsSafeguardOpen(false)}
        actionItem={selectedSafeguardAction}
        onConfirmAction={handleConfirmSafeguard}
        termsAccepted={termsAccepted}
      />
    </div>
  );
}
