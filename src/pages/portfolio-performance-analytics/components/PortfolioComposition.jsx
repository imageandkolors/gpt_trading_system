import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const PortfolioComposition = ({ positions, sectorAllocation, riskMetrics }) => {
  const [activeView, setActiveView] = useState('positions');

  const viewOptions = [
    { label: 'Positions', value: 'positions', icon: 'PieChart' },
    { label: 'Sectors', value: 'sectors', icon: 'Building' },
    { label: 'Risk', value: 'risk', icon: 'Shield' }
  ];

  const COLORS = [
    'var(--color-primary)',
    'var(--color-accent)',
    'var(--color-warning)',
    'var(--color-secondary)',
    '#8B5CF6',
    '#F59E0B',
    '#EF4444',
    '#10B981'
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            Value: {formatCurrency(data?.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Weight: {formatPercentage(data?.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getChartData = () => {
    switch (activeView) {
      case 'sectors':
        return sectorAllocation;
      case 'risk':
        return riskMetrics;
      default:
        return positions?.slice(0, 8); // Top 8 positions
    }
  };

  const chartData = getChartData();

  return (
    <div className="trading-card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Portfolio Composition</h2>
        <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
          {viewOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setActiveView(option?.value)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                activeView === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={option?.icon} size={14} />
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend and Details */}
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {chartData?.map((item, index) => (
            <div key={item?.name} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{item?.name}</p>
                  {item?.symbol && (
                    <p className="text-xs text-muted-foreground">{item?.symbol}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(item?.value)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(item?.percentage)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Risk Concentration Alert */}
      {activeView === 'positions' && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Risk Concentration</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Top 3 positions represent {formatPercentage(
              positions?.slice(0, 3)?.reduce((sum, pos) => sum + pos?.percentage, 0)
            )} of portfolio. Consider diversification if concentration exceeds 60%.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioComposition;