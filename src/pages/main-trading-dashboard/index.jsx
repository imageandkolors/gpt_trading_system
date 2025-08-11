import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import PositionsPanel from './components/PositionsPanel';
import ChartAnalysisWorkspace from './components/ChartAnalysisWorkspace';
import MarketDataPanel from './components/MarketDataPanel';
import VoiceInteractionPanel from './components/VoiceInteractionPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MainTradingDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState({
    uptime: '99.8%',
    latency: '12ms',
    dataFeed: 'Active',
    aiEngine: 'Operational'
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleQuickNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-16 md:pt-24">
        {/* Top Status Bar */}
        <div className="bg-card border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm font-medium text-foreground">{formatDate(currentTime)}</p>
                <p className="text-xs text-muted-foreground">Market Hours: 9:30 AM - 4:00 PM EST</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-profit rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live Data</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Uptime: {systemHealth?.uptime}
                </div>
                <div className="text-xs text-muted-foreground">
                  Latency: {systemHealth?.latency}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-mono font-semibold text-foreground">
                  {formatTime(currentTime)}
                </p>
                <p className="text-xs text-muted-foreground">EST</p>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickNavigation('/voice-trading-interface')}
                  iconName="Mic"
                  iconSize={14}
                >
                  Voice Trading
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickNavigation('/live-trading-execution')}
                  iconName="TrendingUp"
                  iconSize={14}
                >
                  Live Execution
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - Positions & Portfolio (25%) */}
            <div className="lg:col-span-1 overflow-y-auto custom-scrollbar">
              <PositionsPanel />
            </div>

            {/* Center Panel - Chart Analysis Workspace (50%) */}
            <div className="lg:col-span-2 overflow-y-auto custom-scrollbar">
              <ChartAnalysisWorkspace />
            </div>

            {/* Right Panel - Market Data & Recent Trades (25%) */}
            <div className="lg:col-span-1 overflow-y-auto custom-scrollbar">
              <MarketDataPanel />
            </div>
          </div>

          {/* Bottom Panel - Voice Interaction */}
          <div className="mt-6">
            <VoiceInteractionPanel />
          </div>
        </div>

        {/* Quick Action Floating Panel */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="flex flex-col space-y-2">
            <Button
              variant="default"
              size="icon"
              onClick={() => handleQuickNavigation('/chart-analysis-upload')}
              className="w-12 h-12 rounded-full shadow-lg"
            >
              <Icon name="Upload" size={20} />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => handleQuickNavigation('/portfolio-performance-analytics')}
              className="w-12 h-12 rounded-full shadow-lg"
            >
              <Icon name="PieChart" size={20} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => console.log('Emergency stop activated')}
              className="w-12 h-12 rounded-full shadow-lg"
            >
              <Icon name="AlertTriangle" size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Quick Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-30">
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickNavigation('/voice-trading-interface')}
              iconName="Mic"
              iconSize={16}
            >
              Voice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickNavigation('/chart-analysis-upload')}
              iconName="Upload"
              iconSize={16}
            >
              Upload
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickNavigation('/live-trading-execution')}
              iconName="TrendingUp"
              iconSize={16}
            >
              Execute
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickNavigation('/portfolio-performance-analytics')}
              iconName="PieChart"
              iconSize={16}
            >
              Portfolio
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainTradingDashboard;