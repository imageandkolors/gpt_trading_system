import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PositionMonitor = ({ positions, onClosePosition, onModifyTakeProfit }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const calculatePnL = (position) => {
    const currentValue = position?.currentPrice * position?.quantity;
    const entryValue = position?.entryPrice * position?.quantity;
    return currentValue - entryValue;
  };

  const calculatePnLPercentage = (position) => {
    const pnl = calculatePnL(position);
    const entryValue = position?.entryPrice * position?.quantity;
    return (pnl / entryValue) * 100;
  };

  const getPnLColor = (pnl) => {
    return pnl >= 0 ? 'text-success' : 'text-destructive';
  };

  const getTakeProfitProgress = (position) => {
    if (!position?.takeProfit) return 0;
    const totalMove = Math.abs(position?.takeProfit?.tp2 - position?.entryPrice);
    const currentMove = Math.abs(position?.currentPrice - position?.entryPrice);
    return Math.min((currentMove / totalMove) * 100, 100);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Position Monitor</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="destructive"
              size="sm"
              iconName="Square"
              iconSize={14}
            >
              Close All
            </Button>
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
      </div>
      <div className="p-4 space-y-4">
        {positions?.map((position) => {
          const pnl = calculatePnL(position);
          const pnlPercentage = calculatePnLPercentage(position);
          const progress = getTakeProfitProgress(position);

          return (
            <div
              key={position?.id}
              className="bg-muted/20 rounded-lg p-4 border border-border hover:bg-muted/30 transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-foreground">{position?.symbol}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    position?.side === 'LONG' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                  }`}>
                    {position?.side}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {position?.quantity?.toLocaleString()} shares
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModifyTakeProfit(position?.id)}
                    iconName="Target"
                    iconSize={14}
                  >
                    Modify TP
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onClosePosition(position?.id)}
                    iconName="X"
                    iconSize={14}
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
                  <p className="text-sm font-mono text-foreground">${position?.entryPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                  <p className="text-sm font-mono text-foreground">${position?.currentPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
                  <p className={`text-sm font-mono font-semibold ${getPnLColor(pnl)}`}>
                    ${pnl?.toFixed(2)} ({pnlPercentage?.toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Market Value</p>
                  <p className="text-sm font-mono text-foreground">
                    ${(position?.currentPrice * position?.quantity)?.toLocaleString()}
                  </p>
                </div>
              </div>
              {position?.takeProfit && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Take Profit Progress</span>
                    <span className="text-sm text-muted-foreground">{progress?.toFixed(1)}%</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Entry: ${position?.entryPrice?.toFixed(2)}</span>
                      <span>TP1: ${position?.takeProfit?.tp1?.toFixed(2)}</span>
                      <span>TP2: ${position?.takeProfit?.tp2?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">TP1 (80%)</span>
                        <Icon 
                          name={position?.takeProfit?.tp1Filled ? "CheckCircle" : "Circle"} 
                          size={14} 
                          className={position?.takeProfit?.tp1Filled ? "text-success" : "text-muted-foreground"}
                        />
                      </div>
                      <p className="text-sm font-mono text-foreground">${position?.takeProfit?.tp1?.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {(position?.quantity * 0.8)?.toLocaleString()} shares
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">TP2 (20%)</span>
                        <Icon 
                          name={position?.takeProfit?.tp2Filled ? "CheckCircle" : "Circle"} 
                          size={14} 
                          className={position?.takeProfit?.tp2Filled ? "text-success" : "text-muted-foreground"}
                        />
                      </div>
                      <p className="text-sm font-mono text-foreground">${position?.takeProfit?.tp2?.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {(position?.quantity * 0.2)?.toLocaleString()} shares
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Risk: ${position?.risk?.toFixed(2)}</span>
                  <span>Stop Loss: ${position?.stopLoss?.toFixed(2)}</span>
                  <span>Entry Time: {position?.entryTime?.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    position?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                  }`}></div>
                  <span className="text-xs text-muted-foreground capitalize">{position?.status}</span>
                </div>
              </div>
            </div>
          );
        })}

        {positions?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No open positions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionMonitor;