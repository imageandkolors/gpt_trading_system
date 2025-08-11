import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PerformanceMetrics from './components/PerformanceMetrics';
import PerformanceChart from './components/PerformanceChart';
import PortfolioComposition from './components/PortfolioComposition';
import RecentTrades from './components/RecentTrades';
import TradeHistoryTable from './components/TradeHistoryTable';
import RiskAnalytics from './components/RiskAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PortfolioPerformanceAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock performance metrics data
  const performanceMetrics = [
    {
      id: 'total-return',
      type: 'return',
      label: 'Total Return',
      value: 24.67,
      change: 2.34,
      benchmark: 18.45,
      description: 'Cumulative portfolio return for selected period'
    },
    {
      id: 'sharpe-ratio',
      type: 'sharpe',
      label: 'Sharpe Ratio',
      value: 1.85,
      change: 0.12,
      benchmark: 1.42,
      description: 'Risk-adjusted return measurement'
    },
    {
      id: 'max-drawdown',
      type: 'drawdown',
      label: 'Max Drawdown',
      value: -8.34,
      change: 1.23,
      benchmark: -12.67,
      description: 'Largest peak-to-trough decline'
    },
    {
      id: 'win-rate',
      type: 'winRate',
      label: 'Win Rate',
      value: 68.5,
      change: -1.2,
      benchmark: 55.8,
      description: 'Percentage of profitable trades'
    }
  ];

  // Mock performance chart data
  const performanceData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    const baseReturn = Math.random() * 2 - 1;
    return {
      date: date?.toISOString()?.split('T')?.[0],
      cumulativeReturn: 15 + (i * 0.5) + (Math.random() * 4 - 2),
      dailyReturn: baseReturn,
      drawdown: Math.min(0, baseReturn - 1)
    };
  });

  const benchmarkData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date?.setDate(date?.getDate() - (29 - i));
    const baseReturn = Math.random() * 1.5 - 0.75;
    return {
      date: date?.toISOString()?.split('T')?.[0],
      cumulativeReturn: 12 + (i * 0.3) + (Math.random() * 3 - 1.5),
      dailyReturn: baseReturn,
      drawdown: Math.min(0, baseReturn - 0.5)
    };
  });

  // Mock portfolio composition data
  const portfolioPositions = [
    { name: 'AAPL', symbol: 'AAPL', value: 125000, percentage: 25.0 },
    { name: 'MSFT', symbol: 'MSFT', value: 100000, percentage: 20.0 },
    { name: 'GOOGL', symbol: 'GOOGL', value: 87500, percentage: 17.5 },
    { name: 'TSLA', symbol: 'TSLA', value: 62500, percentage: 12.5 },
    { name: 'NVDA', symbol: 'NVDA', value: 50000, percentage: 10.0 },
    { name: 'AMZN', symbol: 'AMZN', value: 37500, percentage: 7.5 },
    { name: 'META', symbol: 'META', value: 25000, percentage: 5.0 },
    { name: 'NFLX', symbol: 'NFLX', value: 12500, percentage: 2.5 }
  ];

  const sectorAllocation = [
    { name: 'Technology', value: 300000, percentage: 60.0 },
    { name: 'Consumer Discretionary', value: 100000, percentage: 20.0 },
    { name: 'Communication Services', value: 50000, percentage: 10.0 },
    { name: 'Healthcare', value: 30000, percentage: 6.0 },
    { name: 'Financials', value: 20000, percentage: 4.0 }
  ];

  const riskMetrics = [
    { name: 'High Risk', value: 150000, percentage: 30.0 },
    { name: 'Medium Risk', value: 250000, percentage: 50.0 },
    { name: 'Low Risk', value: 100000, percentage: 20.0 }
  ];

  // Mock recent trades data
  const recentTrades = [
    {
      id: 'trade-001',
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 100,
      entryPrice: 175.50,
      exitPrice: 182.30,
      pnl: 680,
      pnlPercentage: 3.87,
      entryTime: '2025-01-10T09:30:00Z',
      exitTime: '2025-01-10T15:45:00Z',
      status: 'closed',
      isAiTrade: true,
      confidence: 87,
      pattern: 'VWAP Rejection'
    },
    {
      id: 'trade-002',
      symbol: 'TSLA',
      side: 'SELL',
      quantity: 50,
      entryPrice: 245.80,
      exitPrice: 238.90,
      pnl: 345,
      pnlPercentage: 2.81,
      entryTime: '2025-01-10T10:15:00Z',
      exitTime: '2025-01-10T14:20:00Z',
      status: 'closed',
      isAiTrade: true,
      confidence: 92,
      pattern: 'Engulfing Pattern'
    },
    {
      id: 'trade-003',
      symbol: 'MSFT',
      side: 'BUY',
      quantity: 75,
      entryPrice: 420.15,
      exitPrice: 415.80,
      pnl: -326.25,
      pnlPercentage: -1.04,
      entryTime: '2025-01-09T11:00:00Z',
      exitTime: '2025-01-09T16:00:00Z',
      status: 'closed',
      isAiTrade: false,
      pattern: 'Manual Trade'
    },
    {
      id: 'trade-004',
      symbol: 'GOOGL',
      side: 'BUY',
      quantity: 25,
      entryPrice: 165.40,
      exitPrice: null,
      pnl: 125,
      pnlPercentage: 3.02,
      entryTime: '2025-01-11T09:45:00Z',
      exitTime: null,
      status: 'open',
      isAiTrade: true,
      confidence: 78,
      pattern: 'Shelf Breakout'
    }
  ];

  const aiMetrics = [
    { label: 'AI Win Rate', value: 74.2 },
    { label: 'Avg Confidence', value: 83.5 },
    { label: 'AI P&L', value: 12450 },
    { label: 'Pattern Success', value: 68.9 }
  ];

  // Mock comprehensive trade history
  const tradeHistory = Array.from({ length: 150 }, (_, i) => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX'];
    const patterns = ['VWAP Rejection', 'Engulfing Pattern', 'Shelf Breakout', 'Support Bounce', 'Resistance Break'];
    const sides = ['BUY', 'SELL'];
    const statuses = ['closed', 'closed', 'closed', 'open', 'cancelled'];
    
    const symbol = symbols?.[Math.floor(Math.random() * symbols?.length)];
    const side = sides?.[Math.floor(Math.random() * sides?.length)];
    const status = statuses?.[Math.floor(Math.random() * statuses?.length)];
    const isAiTrade = Math.random() > 0.3;
    const entryPrice = 100 + Math.random() * 400;
    const exitPrice = status === 'closed' ? entryPrice * (0.95 + Math.random() * 0.1) : null;
    const quantity = Math.floor(Math.random() * 200) + 10;
    const pnl = exitPrice ? (exitPrice - entryPrice) * quantity : Math.random() * 1000 - 500;
    const pnlPercentage = exitPrice ? ((exitPrice - entryPrice) / entryPrice) * 100 : (Math.random() - 0.5) * 10;
    
    const entryDate = new Date();
    entryDate?.setDate(entryDate?.getDate() - Math.floor(Math.random() * 90));
    
    return {
      id: `trade-${String(i + 1)?.padStart(3, '0')}`,
      symbol,
      side,
      quantity,
      entryPrice,
      exitPrice,
      pnl,
      pnlPercentage,
      entryTime: entryDate?.toISOString(),
      exitTime: status === 'closed' ? new Date(entryDate.getTime() + Math.random() * 86400000)?.toISOString() : null,
      status,
      isAiTrade,
      confidence: isAiTrade ? Math.floor(Math.random() * 30) + 70 : null,
      pattern: isAiTrade ? patterns?.[Math.floor(Math.random() * patterns?.length)] : null
    };
  });

  // Mock risk analytics data
  const riskAnalyticsData = {
    overview: [
      { label: 'Value at Risk (95%)', type: 'var', value: 3.2, description: 'Maximum expected loss over 1 day' },
      { label: 'Portfolio Beta', type: 'beta', value: 1.15, description: 'Sensitivity to market movements' },
      { label: 'Volatility (30d)', type: 'volatility', value: 18.5, description: 'Standard deviation of returns' },
      { label: 'Tracking Error', type: 'tracking', value: 4.8, description: 'Deviation from benchmark' }
    ],
    varDistribution: [
      { range: '0-1%', frequency: 45 },
      { range: '1-2%', frequency: 32 },
      { range: '2-3%', frequency: 15 },
      { range: '3-4%', frequency: 6 },
      { range: '4%+', frequency: 2 }
    ],
    concentration: [
      { category: 'Single Position', risk: 25.0 },
      { category: 'Sector Concentration', risk: 60.0 },
      { category: 'Geographic Risk', risk: 15.0 },
      { category: 'Currency Risk', risk: 5.0 }
    ]
  };

  const correlationData = {
    assets: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'],
    matrix: [
      [1.00, 0.65, 0.58, 0.42, 0.71],
      [0.65, 1.00, 0.72, 0.38, 0.69],
      [0.58, 0.72, 1.00, 0.35, 0.63],
      [0.42, 0.38, 0.35, 1.00, 0.45],
      [0.71, 0.69, 0.63, 0.45, 1.00]
    ],
    highCorrelations: [
      { assets: ['MSFT', 'GOOGL'], correlation: 0.72 },
      { assets: ['AAPL', 'NVDA'], correlation: 0.71 },
      { assets: ['MSFT', 'NVDA'], correlation: 0.69 }
    ],
    diversificationScore: 72
  };

  const volatilityData = {
    trends: [
      { period: '1W', volatility: 12.5 },
      { period: '2W', volatility: 15.8 },
      { period: '1M', volatility: 18.5 },
      { period: '3M', volatility: 22.1 },
      { period: '6M', volatility: 19.7 },
      { period: '1Y', volatility: 24.3 }
    ],
    byAsset: [
      { symbol: 'TSLA', volatility: 35.2 },
      { symbol: 'NVDA', volatility: 28.7 },
      { symbol: 'META', volatility: 25.1 },
      { symbol: 'AAPL', volatility: 18.9 },
      { symbol: 'MSFT', volatility: 16.4 },
      { symbol: 'GOOGL', volatility: 15.8 }
    ],
    riskReturn: [
      { symbol: 'AAPL', risk: 18.9, return: 24.5 },
      { symbol: 'MSFT', risk: 16.4, return: 22.1 },
      { symbol: 'GOOGL', risk: 15.8, return: 19.8 },
      { symbol: 'TSLA', risk: 35.2, return: 45.2 },
      { symbol: 'NVDA', risk: 28.7, return: 38.9 }
    ]
  };

  const periodOptions = [
    { label: '1 Week', value: '1W' },
    { label: '1 Month', value: '1M' },
    { label: '3 Months', value: '3M' },
    { label: '6 Months', value: '6M' },
    { label: '1 Year', value: '1Y' },
    { label: 'All Time', value: 'ALL' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const handleExportReport = () => {
    console.log('Exporting comprehensive portfolio report...');
    // Implementation would generate PDF/Excel report
  };

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive performance tracking and risk assessment for professional trading evaluation
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Period Selector */}
              <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
                {periodOptions?.map((period) => (
                  <button
                    key={period?.value}
                    onClick={() => setSelectedPeriod(period?.value)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      selectedPeriod === period?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {period?.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                loading={refreshing}
                onClick={handleRefresh}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleExportReport}
                iconName="FileText"
                iconPosition="left"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Last Updated Info */}
          <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Last updated: {lastUpdated?.toLocaleString()}</span>
            <div className="flex items-center space-x-1 ml-4">
              <div className="w-2 h-2 bg-profit rounded-full animate-pulse" />
              <span>Live data</span>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics metrics={performanceMetrics} period={selectedPeriod} />

          {/* Performance Chart */}
          <div className="mb-8">
            <PerformanceChart data={performanceData} benchmarkData={benchmarkData} />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Portfolio Composition */}
            <div className="lg:col-span-1">
              <PortfolioComposition 
                positions={portfolioPositions}
                sectorAllocation={sectorAllocation}
                riskMetrics={riskMetrics}
              />
            </div>

            {/* Recent Trades */}
            <div className="lg:col-span-2">
              <RecentTrades trades={recentTrades} aiMetrics={aiMetrics} />
            </div>
          </div>

          {/* Risk Analytics */}
          <div className="mb-8">
            <RiskAnalytics 
              riskMetrics={riskAnalyticsData}
              correlationData={correlationData}
              volatilityData={volatilityData}
            />
          </div>

          {/* Trade History Table */}
          <TradeHistoryTable trades={tradeHistory} />
        </div>
      </main>
    </div>
  );
};

export default PortfolioPerformanceAnalytics;