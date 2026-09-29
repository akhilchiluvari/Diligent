import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import BoardroomView from './components/BoardroomView';
import InventoryTerminal from './components/InventoryTerminal';
import MarketingStudio from './components/MarketingStudio';
import WorkforceView from './components/WorkforceView';
import AuditLogsView from './components/AuditLogsView';
import LegalModal from './components/LegalModal';
import SafeguardModal from './components/SafeguardModal';
import FloatingCopilot from './components/FloatingCopilot';
import { Users, Package, Megaphone, Terminal, TrendingUp, Sparkles } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('diligent_theme') || 'dark');
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

  // Floating Contextual Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [attachedContext, setAttachedContext] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I am Diligent, your Autonomous Business Consultant powered by Groq 120B. I monitor your live POS barcodes, stock turnover, and associate productivity. How can I help you scale today?",
      time: 'Just now'
    }
  ]);
  const [isChatWaiting, setIsChatWaiting] = useState(false);

  // Safeguard modal state
  const [selectedSafeguardAction, setSelectedSafeguardAction] = useState(null);
  const [isSafeguardOpen, setIsSafeguardOpen] = useState(false);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diligent_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Open Copilot with context from any item or tab
  const handleOpenCopilotWithContext = (contextObj) => {
    setAttachedContext(contextObj);
    setIsCopilotOpen(true);
  };

  const handleClearContext = () => {
    setAttachedContext(null);
  };

  // Data fetching
  const refreshAllData = async () => {
    try {
      const statsRes = await fetch('/api/dashboard/stats');
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        setStats(statsJson.stats);
        setTermsAccepted(statsJson.stats.termsAccepted);
        if (!statsJson.stats.termsAccepted) {
          setIsLegalModalOpen(true);
        }
      }

      const prodRes = await fetch('/api/products');
      const prodJson = await prodRes.json();
      if (prodJson.success) {
        setProducts(prodJson.products);
        setTopSellers(prodJson.topSellers);
        setLeastSellers(prodJson.leastSellers);
        setLowStock(prodJson.lowStock);
      }

      const empRes = await fetch('/api/employees');
      const empJson = await empRes.json();
      if (empJson.success) setEmployees(empJson.employees);

      const logsRes = await fetch('/api/logs?limit=30');
      const logsJson = await logsRes.json();
      if (logsJson.success) setLogs(logsJson.logs);

      const agentRes = await fetch('/api/agents/status');
      const agentJson = await agentRes.json();
      if (agentJson.success) setActiveProvider(agentJson.activeProvider);

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

  // Swarm Consensus
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

  useEffect(() => {
    if (!consensusData && !isConsensusRunning) {
      handleTriggerConsensus();
    }
  }, []);

  // Scan Sale
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

  // Marketing Campaign Generation
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

  // Copilot message sending
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

  // Accept Terms
  const handleAcceptTerms = async () => {
    const res = await fetch('/api/legal/accept', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setTermsAccepted(true);
      refreshAllData();
    }
  };

  // Safeguard confirmation
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
    { id: 'boardroom', label: 'Virtual Boardroom', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory & POS', icon: Package },
    { id: 'marketing', label: 'AI Marketing', icon: Megaphone },
    { id: 'workforce', label: 'Workforce CRM', icon: Users },
    { id: 'telemetry', label: 'Live Logs', icon: Terminal }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        business={{ name: stats?.businessName }}
        termsAccepted={termsAccepted}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        activeProvider={activeProvider}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px 24px', width: '100%', flex: 1 }}>
        {/* KPI Metrics */}
        <StatsBar
          stats={stats}
          onNavigateToMarketing={() => setActiveTab('marketing')}
          onNavigateToInventory={() => setActiveTab('inventory')}
          onOpenCopilotWithContext={handleOpenCopilotWithContext}
        />

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '24px',
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
                  gap: '7px',
                  padding: '7px 16px',
                  borderRadius: '7px',
                  border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Views */}
        {activeTab === 'boardroom' && (
          <BoardroomView
            consensusData={consensusData}
            onTriggerConsensus={handleTriggerConsensus}
            isRunning={isConsensusRunning}
            onExecuteAction={handleOpenSafeguard}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
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
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingStudio
            campaignData={campaignData || consensusData?.marketingReport}
            onGenerateCampaign={handleGenerateCampaign}
            products={products}
            isGenerating={isGeneratingCampaign}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {activeTab === 'workforce' && (
          <WorkforceView
            employees={employees}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {activeTab === 'telemetry' && (
          <AuditLogsView logs={logs} />
        )}
      </main>

      {/* Flagship Floating Contextual Copilot (Bottom Right) */}
      <FloatingCopilot
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        onClose={() => setIsCopilotOpen(false)}
        activeTab={activeTab}
        attachedContext={attachedContext}
        onClearContext={handleClearContext}
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        isWaiting={isChatWaiting}
        onExecuteAction={handleOpenSafeguard}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        color: 'var(--text-tertiary)',
        fontSize: '0.78rem',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>Diligent</strong> • Multi-Agent Operational Engine for SMBs • Microsoft Hack with Hyderabad 3.0
          </div>
          <div>
            Powered by Groq 120B Parameter LPU Architecture
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        termsAccepted={termsAccepted}
        onAcceptTerms={handleAcceptTerms}
        legalData={legalData}
      />

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
