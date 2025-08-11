import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MarketDataPanel = () => {
  const [marketData, setMarketData] = useState({
    SPY: { price: 445.67, change: 2.34, changePercent: 0.53, volume: "125.4M" },
    QQQ: { price: 378.92, change: -1.45, changePercent: -0.38, volume: "89.2M" },
    DIA: { price: 348.15, change: 1.89, changePercent: 0.55, volume: "12.8M" },
    IWM: { price: 198.44, change: -0.67, changePercent: -0.34, volume: "45.6M" }
  });

  const [technicalIndicators, setTechnicalIndicators] = useState({
    VWAP: { value: 445.23, signal: "NEUTRAL", color: "text-muted-foreground" },
    EMA21: { value: 443.89, signal: "SUPPORT", color: "text-profit" },
    EMA50: { value: 441.56, signal: "SUPPORT", color: "text-profit" },
    EMA200: { value: 438.12, signal: "SUPPORT", color: "text-profit" },
    RSI: { value: 58.4, signal: "NEUTRAL", color: "text-muted-foreground" },
    ATR: { value: 4.23, signal: "NORMAL", color: "text-muted-foreground" }
  });

  const [recentTrades, setRecentTrades] = useState([
    {
      id: 1,
      symbol: "AAPL",
      action: "BUY",
      quantity: 100,
      price: 187.25,
      time: "14:18:45",
      status: "FILLED",
      pnl: null
    },
    {
      id: 2,
      symbol: "TSLA",
      action: "SELL",
      quantity: 50,
      price: 242.15,
      time: "14:15:32",
      status: "FILLED",
      pnl: 182.50
    },
    {
      id: 3,
      symbol: "NVDA",
      action: "BUY",
      quantity: 25,
      price: 875.20,
      time: "14:12:18",
      status: "PARTIAL",
      pnl: null
    },
    {
      id: 4,
      symbol: "MSFT",
      action: "SELL",
      quantity: 75,
      price: 412.88,
      time: "14:08:56",
      status: "FILLED",
      pnl: -45.30
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated)?.forEach(symbol => {
          const change = (Math.random() - 0.5) * 2;
          updated[symbol] = {
            ...updated?.[symbol],
            price: Math.max(0, updated?.[symbol]?.price + change),
            change: updated?.[symbol]?.change + change,
            changePercent: ((updated?.[symbol]?.change + change) / updated?.[symbol]?.price) * 100
          };
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'FILLED': return 'text-profit';
      case 'PARTIAL': return 'text-warning';
      case 'PENDING': return 'text-muted-foreground';
      case 'CANCELLED': return 'text-loss';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'FILLED': return 'CheckCircle';
      case 'PARTIAL': return 'Clock';
      case 'PENDING': return 'Loader';
      case 'CANCELLED': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Market Overview</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-profit rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="space-y-3">
          {Object.entries(marketData)?.map(([symbol, data]) => (
            <div key={symbol} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-foreground">{symbol}</span>
                <span className="text-xs text-muted-foreground">{data?.volume}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${data?.price?.toFixed(2)}</p>
                <p className={`text-xs ${data?.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {data?.change >= 0 ? '+' : ''}{data?.change?.toFixed(2)} ({data?.changePercent >= 0 ? '+' : ''}{data?.changePercent?.toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Technical Indicators */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Technical Indicators</h3>
          <span className="text-xs text-muted-foreground">SPY 1H</span>
        </div>
        <div className="space-y-3">
          {Object.entries(technicalIndicators)?.map(([indicator, data]) => (
            <div key={indicator} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">{indicator}</span>
                <span className={`text-xs px-2 py-1 rounded-full bg-muted/20 ${data?.color}`}>
                  {data?.signal}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {typeof data?.value === 'number' ? data?.value?.toFixed(2) : data?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Trades */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Trades</h3>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentTrades?.map((trade) => (
            <div key={trade?.id} className="p-3 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">{trade?.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trade?.action === 'BUY' ?'bg-profit/20 text-profit' :'bg-loss/20 text-loss'
                  }`}>
                    {trade?.action}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(trade?.status)} 
                    size={12} 
                    className={getStatusColor(trade?.status)}
                  />
                  <span className={`text-xs ${getStatusColor(trade?.status)}`}>
                    {trade?.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Qty</p>
                  <p className="font-medium text-foreground">{trade?.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium text-foreground">${trade?.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{trade?.time}</p>
                </div>
              </div>
              {trade?.pnl !== null && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">P&L</span>
                    <span className={`text-xs font-medium ${trade?.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ${trade?.pnl >= 0 ? '+' : ''}{trade?.pnl?.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Market Status */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Market Status</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-profit rounded-full"></div>
            <span className="text-xs text-profit">OPEN</span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Market Hours</span>
            <span className="text-foreground">9:30 AM - 4:00 PM EST</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next Close</span>
            <span className="text-foreground">4:00 PM EST</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Time to Close</span>
            <span className="text-foreground">1h 42m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDataPanel;