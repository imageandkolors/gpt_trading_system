import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MarketTicker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tickerData, setTickerData] = useState([]);

  // Mock market data
  const mockMarketData = [
    { symbol: 'SPY', price: 445.67, change: 2.34, changePercent: 0.53, volume: '89.2M' },
    { symbol: 'QQQ', price: 378.92, change: -1.45, changePercent: -0.38, volume: '45.8M' },
    { symbol: 'AAPL', price: 189.43, change: 3.21, changePercent: 1.72, volume: '67.3M' },
    { symbol: 'MSFT', price: 378.85, change: -0.89, changePercent: -0.23, volume: '34.7M' },
    { symbol: 'GOOGL', price: 142.56, change: 1.87, changePercent: 1.33, volume: '28.9M' },
    { symbol: 'TSLA', price: 248.42, change: -4.23, changePercent: -1.67, volume: '156.4M' }
  ];

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time price updates
    const priceInterval = setInterval(() => {
      setTickerData(prevData => {
        if (prevData?.length === 0) return mockMarketData;
        
        return prevData?.map(stock => ({
          ...stock,
          price: stock?.price + (Math.random() - 0.5) * 2,
          change: stock?.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock?.changePercent + (Math.random() - 0.5) * 0.1
        }));
      });
    }, 3000);

    // Initialize with mock data
    setTickerData(mockMarketData);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toFixed(2);
  };

  const formatChange = (change) => {
    return change >= 0 ? `+${change?.toFixed(2)}` : change?.toFixed(2);
  };

  const formatPercent = (percent) => {
    return percent >= 0 ? `+${percent?.toFixed(2)}%` : `${percent?.toFixed(2)}%`;
  };

  return (
    <div className="hidden lg:block w-80 h-full bg-surface border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Market Overview</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-online rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Market Time: {formatTime(currentTime)} EST</span>
        </div>
      </div>
      {/* Market Status */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Market Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-online rounded-full"></div>
            <span className="text-sm text-online">Open</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">NYSE</span>
            <span className="text-online">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">NASDAQ</span>
            <span className="text-online">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pre-Market</span>
            <span className="text-muted-foreground">Closed</span>
          </div>
        </div>
      </div>
      {/* Ticker */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Top Movers</h4>
          
          <div className="space-y-4">
            {tickerData?.map((stock, index) => (
              <div key={stock?.symbol} className="p-3 bg-card rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{stock?.symbol}</span>
                    <div className={`w-1 h-1 rounded-full ${stock?.change >= 0 ? 'bg-profit' : 'bg-loss'}`}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{stock?.volume}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    ${formatPrice(stock?.price)}
                  </span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${stock?.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatChange(stock?.change)}
                    </div>
                    <div className={`text-xs ${stock?.changePercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPercent(stock?.changePercent)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="p-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">AI Trading Benefits</h4>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <Icon name="Brain" size={12} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI-Powered Analysis</p>
                <p className="text-xs text-muted-foreground">Advanced pattern recognition with 85%+ accuracy</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mt-0.5">
                <Icon name="Mic" size={12} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Voice Trading</p>
                <p className="text-xs text-muted-foreground">Execute trades with natural language commands</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center mt-0.5">
                <Icon name="Shield" size={12} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Risk Management</p>
                <p className="text-xs text-muted-foreground">Automated stop-loss and position sizing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mt-0.5">
                <Icon name="Zap" size={12} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Real-time Execution</p>
                <p className="text-xs text-muted-foreground">Lightning-fast order processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;