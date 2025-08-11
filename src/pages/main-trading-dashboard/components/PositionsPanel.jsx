import React from 'react';
import Icon from '../../../components/AppIcon';

const PositionsPanel = () => {
  const activePositions = [
    {
      id: 1,
      symbol: "AAPL",
      side: "LONG",
      quantity: 100,
      entryPrice: 185.50,
      currentPrice: 187.25,
      pnl: 175.00,
      pnlPercent: 0.94,
      confidence: 87
    },
    {
      id: 2,
      symbol: "TSLA",
      side: "SHORT",
      quantity: 50,
      entryPrice: 245.80,
      currentPrice: 242.15,
      pnl: 182.50,
      pnlPercent: 1.49,
      confidence: 91
    },
    {
      id: 3,
      symbol: "NVDA",
      side: "LONG",
      quantity: 25,
      entryPrice: 875.20,
      currentPrice: 868.45,
      pnl: -168.75,
      pnlPercent: -0.77,
      confidence: 82
    }
  ];

  const watchlist = [
    { symbol: "SPY", price: 445.67, change: 2.34, changePercent: 0.53 },
    { symbol: "QQQ", price: 378.92, change: -1.45, changePercent: -0.38 },
    { symbol: "MSFT", price: 412.88, change: 5.67, changePercent: 1.39 },
    { symbol: "GOOGL", price: 142.35, change: -0.89, changePercent: -0.62 }
  ];

  const portfolioSummary = {
    totalValue: 125750.00,
    dayPnl: 1247.50,
    dayPnlPercent: 1.00,
    totalPnl: 8950.00,
    totalPnlPercent: 7.66,
    buyingPower: 45230.00
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Portfolio Summary</h3>
          <Icon name="TrendingUp" size={20} className="text-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-semibold text-foreground">
              ${portfolioSummary?.totalValue?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Day P&L</p>
            <p className={`text-lg font-semibold ${portfolioSummary?.dayPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              ${portfolioSummary?.dayPnl >= 0 ? '+' : ''}${portfolioSummary?.dayPnl?.toLocaleString()}
              <span className="text-sm ml-1">
                ({portfolioSummary?.dayPnlPercent >= 0 ? '+' : ''}{portfolioSummary?.dayPnlPercent?.toFixed(2)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total P&L</p>
            <p className={`text-sm font-medium ${portfolioSummary?.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              ${portfolioSummary?.totalPnl >= 0 ? '+' : ''}${portfolioSummary?.totalPnl?.toLocaleString()}
              <span className="text-xs ml-1">
                ({portfolioSummary?.totalPnlPercent >= 0 ? '+' : ''}{portfolioSummary?.totalPnlPercent?.toFixed(2)}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buying Power</p>
            <p className="text-sm font-medium text-foreground">
              ${portfolioSummary?.buyingPower?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {/* Active Positions */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Positions</h3>
          <span className="text-xs text-muted-foreground">{activePositions?.length} positions</span>
        </div>
        <div className="space-y-3">
          {activePositions?.map((position) => (
            <div key={position?.id} className="p-3 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">{position?.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    position?.side === 'LONG' ?'bg-profit/20 text-profit' :'bg-loss/20 text-loss'
                  }`}>
                    {position?.side}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Brain" size={12} className="text-primary" />
                  <span className="text-xs text-muted-foreground">{position?.confidence}%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Qty</p>
                  <p className="font-medium text-foreground">{position?.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entry</p>
                  <p className="font-medium text-foreground">${position?.entryPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium text-foreground">${position?.currentPrice}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">P&L</span>
                  <span className={`text-sm font-semibold ${position?.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    ${position?.pnl >= 0 ? '+' : ''}${position?.pnl?.toFixed(2)}
                    <span className="text-xs ml-1">
                      ({position?.pnlPercent >= 0 ? '+' : ''}{position?.pnlPercent?.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Watchlist */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors">
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {watchlist?.map((item) => (
            <div key={item?.symbol} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded-md transition-colors">
              <div>
                <span className="font-medium text-foreground">{item?.symbol}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">${item?.price}</p>
                <p className={`text-xs ${item?.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {item?.change >= 0 ? '+' : ''}{item?.change?.toFixed(2)} ({item?.changePercent >= 0 ? '+' : ''}{item?.changePercent?.toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PositionsPanel;