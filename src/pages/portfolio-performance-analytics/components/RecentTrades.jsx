import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTrades = ({ trades, aiMetrics }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filterOptions = [
    { label: 'All Trades', value: 'all' },
    { label: 'Profitable', value: 'profit' },
    { label: 'Losses', value: 'loss' },
    { label: 'AI Trades', value: 'ai' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })?.format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value?.toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredTrades = () => {
    let filtered = trades;
    
    switch (filter) {
      case 'profit':
        filtered = trades?.filter(trade => trade?.pnl > 0);
        break;
      case 'loss':
        filtered = trades?.filter(trade => trade?.pnl < 0);
        break;
      case 'ai':
        filtered = trades?.filter(trade => trade?.isAiTrade);
        break;
      default:
        filtered = trades;
    }

    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'pnl':
          return b?.pnl - a?.pnl;
        case 'confidence':
          return (b?.confidence || 0) - (a?.confidence || 0);
        default:
          return new Date(b.exitTime || b.entryTime) - new Date(a.exitTime || a.entryTime);
      }
    });
  };

  const filteredTrades = getFilteredTrades();

  const getTradeStatusIcon = (status) => {
    switch (status) {
      case 'closed': return 'CheckCircle';
      case 'open': return 'Clock';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getTradeStatusColor = (status) => {
    switch (status) {
      case 'closed': return 'text-success';
      case 'open': return 'text-warning';
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="trading-card h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Recent Trades</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Options */}
          <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
            {filterOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setFilter(option?.value)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  filter === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1 bg-muted/20 border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date">Sort by Date</option>
            <option value="pnl">Sort by P&L</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
        </div>
      </div>
      {/* AI Performance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {aiMetrics?.map((metric) => (
          <div key={metric?.label} className="p-3 bg-muted/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Bot" size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">{metric?.label}</span>
            </div>
            <p className={`text-sm font-semibold ${
              metric?.label?.includes('Rate') || metric?.label?.includes('Confidence')
                ? 'text-foreground'
                : metric?.value >= 0 ? 'text-profit' : 'text-loss'
            }`}>
              {metric?.label?.includes('Rate') || metric?.label?.includes('Confidence')
                ? formatPercentage(metric?.value)
                : formatCurrency(metric?.value)
              }
            </p>
          </div>
        ))}
      </div>
      {/* Trades List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredTrades?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No trades found for the selected filter.</p>
          </div>
        ) : (
          filteredTrades?.map((trade) => (
            <div key={trade?.id} className="p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTradeStatusIcon(trade?.status)} 
                      size={16} 
                      className={getTradeStatusColor(trade?.status)}
                    />
                    <span className="font-medium text-foreground">{trade?.symbol}</span>
                    {trade?.isAiTrade && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-full">
                        <Icon name="Bot" size={12} className="text-primary" />
                        <span className="text-xs text-primary">AI</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${trade?.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatCurrency(trade?.pnl)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(trade?.pnlPercentage)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Side:</span>
                  <p className={`font-medium ${trade?.side === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                    {trade?.side}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <p className="font-medium text-foreground">{trade?.quantity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry:</span>
                  <p className="font-medium text-foreground">{formatCurrency(trade?.entryPrice)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit:</span>
                  <p className="font-medium text-foreground">
                    {trade?.exitPrice ? formatCurrency(trade?.exitPrice) : 'Open'}
                  </p>
                </div>
              </div>

              {trade?.confidence && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">AI Confidence:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            trade?.confidence >= 85 ? 'bg-profit' : 
                            trade?.confidence >= 70 ? 'bg-warning' : 'bg-loss'
                          }`}
                          style={{ width: `${trade?.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {trade?.confidence}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(trade?.exitTime || trade?.entryTime)}
                  </span>
                </div>
              )}

              {trade?.pattern && (
                <div className="mt-2 flex items-center space-x-2">
                  <Icon name="Target" size={12} className="text-accent" />
                  <span className="text-xs text-muted-foreground">Pattern:</span>
                  <span className="text-xs font-medium text-accent">{trade?.pattern}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {filteredTrades?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export trades')}
          >
            Export Trade History
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTrades;