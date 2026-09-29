import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import TeammatesShowcase from './components/TeammatesShowcase';
import OperatingJourney from './components/OperatingJourney';
import BoardroomView from './components/BoardroomView';
import InventoryTerminal from './components/InventoryTerminal';
import TeamDivisionsView from './components/TeamDivisionsView';
import MarketingStudio from './components/MarketingStudio';
import LegalModal from './components/LegalModal';
import SafeguardModal from './components/SafeguardModal';
import AuthModal from './components/AuthModal';
import FloatingCopilot from './components/FloatingCopilot';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('diligent_theme') || 'light');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'teammates' | 'loop' | 'inventory' | 'divisions' | 'marketing'
  
  // Auth & Profile state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('diligent_user');
      return saved ? JSON.parse(saved) : {
        name: 'Akhil Chiluvari',
        email: 'akhil@diligent.ai',
        businessName: 'Sri Balaji Smart Retail & Tech Mart',
        location: 'Madhapur, Hyderabad'
      };
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Store data state
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

  // Consensus & Marketing state
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
      text: "### 👋 Namaste!\n\nI am **Diligent**, your Autonomous Business Consultant powered by **Groq 120B**.\n\nI am connected to your live POS barcode scans, inventory velocity, and team division rosters. How can I help you scale today?",
      time: 'Just now'
    }
  ]);
  const [isChatWaiting, setIsChatWaiting] = useState(false);

  // Safeguard modal state
  const [selectedSafeguardAction, setSelectedSafeguardAction] = useState(null);
  const [isSafeguardOpen, setIsSafeguardOpen] = useState(false);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('diligent_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('diligent_user', JSON.stringify(user));
    refreshAllData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('diligent_user');
  };

  // Open Copilot with context
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

      const legalRes = await fetch('/api/legal/terms');
      const legalJson = await legalRes.json();
      if (legalJson.success) setLegalData(legalJson.legal);
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Consensus session
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

  // POS Sale recording
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

  // Marketing generation
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

  // Copilot query handling with multilingual support
  const handleSendMessage = async (queryText, { language = 'en' } = {}) => {
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
        body: JSON.stringify({ query: queryText, language })
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
        text: `### ⚠️ Connection Notice\n\nCould not reach supervisor agent: ${err.message}`,
        time: 'Just now'
      }]);
    } finally {
      setIsChatWaiting(false);
    }
  };

  // Legal waiver acceptance
  const handleAcceptTerms = async () => {
    const res = await fetch('/api/legal/accept', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setTermsAccepted(true);
      refreshAllData();
    }
  };

  // Safeguard action execution
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dark Navy Pill Navigation Header (Exact Reference Match: Image 1) */}
      <Navbar
        business={{ name: currentUser?.businessName || stats?.businessName }}
        termsAccepted={termsAccepted}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px 80px 20px', width: '100%', flex: 1 }}>
        {/* VIEW: OVERVIEW (Hero + Key Metrics + Teammates + Journey Loop + Boardroom) */}
        {activeTab === 'overview' && (
          <>
            <HeroSection
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onNavigateToLoop={() => setActiveTab('loop')}
              onTriggerConsensus={handleTriggerConsensus}
              stats={stats}
            />

            <StatsBar
              stats={stats}
              onNavigateToMarketing={() => setActiveTab('marketing')}
              onNavigateToInventory={() => setActiveTab('inventory')}
              onOpenCopilotWithContext={handleOpenCopilotWithContext}
            />

            {/* Seven Teammates Showcase (Exact Match: Image 3) */}
            <TeammatesShowcase
              onOpenCopilotWithContext={handleOpenCopilotWithContext}
              stats={stats}
            />

            {/* Operating Journey (Exact Match: Image 2) */}
            <OperatingJourney
              onOpenCopilotWithContext={handleOpenCopilotWithContext}
              onTriggerConsensus={handleTriggerConsensus}
            />

            {/* Virtual Boardroom Consensus Directive */}
            <BoardroomView
              consensusData={consensusData}
              onTriggerConsensus={handleTriggerConsensus}
              isRunning={isConsensusRunning}
              onExecuteAction={handleOpenSafeguard}
              onOpenCopilotWithContext={handleOpenCopilotWithContext}
            />
          </>
        )}

        {/* VIEW: TEAMMATES */}
        {activeTab === 'teammates' && (
          <TeammatesShowcase
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
            stats={stats}
          />
        )}

        {/* VIEW: OPERATING LOOP */}
        {activeTab === 'loop' && (
          <OperatingJourney
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
            onTriggerConsensus={handleTriggerConsensus}
          />
        )}

        {/* VIEW: INVENTORY & POS BARCODE */}
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

        {/* VIEW: TEAM DIVISIONS & COORDINATION PROTOCOLS */}
        {activeTab === 'divisions' && (
          <TeamDivisionsView
            employees={employees}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}

        {/* VIEW: MARKETING CMS */}
        {activeTab === 'marketing' && (
          <MarketingStudio
            campaignData={campaignData || consensusData?.marketingReport}
            onGenerateCampaign={handleGenerateCampaign}
            products={products}
            isGenerating={isGeneratingCampaign}
            onOpenCopilotWithContext={handleOpenCopilotWithContext}
          />
        )}
      </main>

      {/* Floating Contextual Copilot Drawer (Bottom Right - Flagship Feature) */}
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

      {/* Clean Minimalist Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 20px',
        color: 'var(--text-tertiary)',
        fontSize: '0.82rem',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-serif-headline" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Diligent.
            </span>
            <span>• Autonomous Multi-Agent Operational Engine for SMB Scaling</span>
          </div>
          <div>
            Powered by Groq 120B Parameter LPU Architecture • Hack with Hyderabad 3.0 at Microsoft IDC
          </div>
        </div>
      </footer>

      {/* Authentication & Business Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

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
