import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MarketDepthPanel = ({ marketData, recentExecutions, brokerStatus }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const getBrokerStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-destructive';
      case 'connecting': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getBrokerStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'disconnected': return 'XCircle';
      case 'connecting': return 'Clock';
      default: return 'AlertCircle';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Broker Status */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Broker Connectivity</h3>
        </div>
        <div className="p-4 space-y-3">
          {Object.entries(brokerStatus)?.map(([broker, status]) => (
            <div key={broker} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getBrokerStatusIcon(status?.status)} 
                  size={16} 
                  className={getBrokerStatusColor(status?.status)}
                />
                <span className="text-sm font-medium text-foreground capitalize">{broker}</span>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getBrokerStatusColor(status?.status)}`}>
                  {status?.status?.charAt(0)?.toUpperCase() + status?.status?.slice(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Latency: {status?.latency}ms
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Market Depth */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Market Depth</h3>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e?.target?.value)}
              className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground"
            >
              <option value="AAPL">AAPL</option>
              <option value="MSFT">MSFT</option>
              <option value="GOOGL">GOOGL</option>
              <option value="TSLA">TSLA</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Bids */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="TrendingDown" size={14} className="text-destructive" />
                <span>Bids</span>
              </h4>
              <div className="space-y-1">
                {marketData?.[selectedSymbol]?.bids?.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 rounded hover:bg-destructive/5">
                    <span className="text-sm font-mono text-destructive">${bid?.price?.toFixed(2)}</span>
                    <span className="text-sm font-mono text-muted-foreground">{bid?.size?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asks */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} className="text-success" />
                <span>Asks</span>
              </h4>
              <div className="space-y-1">
                {marketData?.[selectedSymbol]?.asks?.map((ask, index) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 rounded hover:bg-success/5">
                    <span className="text-sm font-mono text-success">${ask?.price?.toFixed(2)}</span>
                    <span className="text-sm font-mono text-muted-foreground">{ask?.size?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spread Info */}
          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bid-Ask Spread</span>
              <span className="text-sm font-mono text-foreground">
                ${(marketData?.[selectedSymbol]?.asks?.[0]?.price - marketData?.[selectedSymbol]?.bids?.[0]?.price)?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Executions */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Executions</h3>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconSize={14}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
              <span>Time</span>
              <span>Symbol</span>
              <span>Price</span>
              <span>Size</span>
            </div>
            
            {recentExecutions?.map((execution) => (
              <div key={execution?.id} className="grid grid-cols-4 gap-4 py-2 text-sm hover:bg-muted/20 rounded transition-colors duration-150">
                <span className="font-mono text-muted-foreground">
                  {formatTime(execution?.timestamp)}
                </span>
                <span className="font-medium text-foreground">{execution?.symbol}</span>
                <span className={`font-mono ${execution?.side === 'BUY' ? 'text-success' : 'text-destructive'}`}>
                  ${execution?.price?.toFixed(2)}
                </span>
                <span className="font-mono text-foreground">{execution?.size?.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {recentExecutions?.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent executions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDepthPanel;