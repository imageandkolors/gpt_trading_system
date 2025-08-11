import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ metrics, period }) => {
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value?.toFixed(2)}%`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const getMetricIcon = (type) => {
    switch (type) {
      case 'return': return 'TrendingUp';
      case 'sharpe': return 'Target';
      case 'drawdown': return 'TrendingDown';
      case 'winRate': return 'Award';
      default: return 'BarChart3';
    }
  };

  const getMetricColor = (value, type) => {
    if (type === 'drawdown') return value < -10 ? 'text-loss' : 'text-warning';
    return value >= 0 ? 'text-profit' : 'text-loss';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="trading-card trading-card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${metric?.type === 'drawdown' ? 'bg-warning/10' : 'bg-primary/10'}`}>
                <Icon 
                  name={getMetricIcon(metric?.type)} 
                  size={20} 
                  className={metric?.type === 'drawdown' ? 'text-warning' : 'text-primary'}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{metric?.label}</h3>
                <p className="text-xs text-muted-foreground">{period}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold ${getMetricColor(metric?.value, metric?.type)}`}>
                {metric?.type === 'return' || metric?.type === 'drawdown' || metric?.type === 'winRate' 
                  ? formatPercentage(metric?.value)
                  : metric?.value?.toFixed(2)
                }
              </span>
              {metric?.change && (
                <span className={`text-sm flex items-center ${metric?.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  <Icon 
                    name={metric?.change >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                    size={12} 
                    className="mr-1"
                  />
                  {formatPercentage(Math.abs(metric?.change))}
                </span>
              )}
            </div>
            
            {metric?.benchmark && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">vs Benchmark:</span>
                <span className={metric?.value > metric?.benchmark ? 'text-profit' : 'text-loss'}>
                  {formatPercentage(metric?.benchmark)}
                </span>
              </div>
            )}
            
            {metric?.description && (
              <p className="text-xs text-muted-foreground mt-2">{metric?.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;