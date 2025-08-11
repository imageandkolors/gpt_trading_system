import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import Icon from '../../../components/AppIcon';

const RiskAnalytics = ({ riskMetrics, correlationData, volatilityData }) => {
  const [activeTab, setActiveTab] = useState('risk');

  const tabs = [
    { label: 'Risk Metrics', value: 'risk', icon: 'Shield' },
    { label: 'Correlation', value: 'correlation', icon: 'GitBranch' },
    { label: 'Volatility', value: 'volatility', icon: 'Activity' }
  ];

  const formatPercentage = (value) => {
    return `${value?.toFixed(2)}%`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const getRiskLevel = (value, type) => {
    switch (type) {
      case 'var':
        if (value > 5) return { level: 'High', color: 'text-loss' };
        if (value > 2) return { level: 'Medium', color: 'text-warning' };
        return { level: 'Low', color: 'text-profit' };
      case 'beta':
        if (Math.abs(value - 1) > 0.5) return { level: 'High', color: 'text-loss' };
        if (Math.abs(value - 1) > 0.2) return { level: 'Medium', color: 'text-warning' };
        return { level: 'Low', color: 'text-profit' };
      default:
        return { level: 'Medium', color: 'text-warning' };
    }
  };

  const renderRiskMetrics = () => (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics?.overview?.map((metric) => {
          const risk = getRiskLevel(metric?.value, metric?.type);
          return (
            <div key={metric?.label} className="p-4 bg-muted/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric?.label}</span>
                <Icon name="Info" size={14} className="text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  {metric?.type === 'var' || metric?.type === 'volatility' 
                    ? formatPercentage(metric?.value)
                    : metric?.value?.toFixed(2)
                  }
                </span>
                <span className={`text-xs px-2 py-1 rounded-full bg-opacity-10 ${risk?.color} ${risk?.color?.replace('text-', 'bg-')}/10`}>
                  {risk?.level}
                </span>
              </div>
              {metric?.description && (
                <p className="text-xs text-muted-foreground mt-2">{metric?.description}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Value at Risk Chart */}
      <div className="p-4 bg-muted/10 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Value at Risk Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskMetrics?.varDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="range" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <Bar 
                dataKey="frequency" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Concentration */}
      <div className="p-4 bg-muted/10 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Risk Concentration</h3>
        <div className="space-y-3">
          {riskMetrics?.concentration?.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-sm text-foreground">{item?.category}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item?.risk > 30 ? 'bg-loss' : item?.risk > 15 ? 'bg-warning' : 'bg-profit'
                    }`}
                    style={{ width: `${Math.min(item?.risk, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">
                  {formatPercentage(item?.risk)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCorrelationMatrix = () => (
    <div className="space-y-6">
      <div className="p-4 bg-muted/10 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Asset Correlation Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 text-sm font-medium text-muted-foreground">Asset</th>
                {correlationData?.assets?.map((asset) => (
                  <th key={asset} className="text-center p-2 text-sm font-medium text-muted-foreground">
                    {asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData?.matrix?.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 text-sm font-medium text-foreground">
                    {correlationData?.assets?.[i]}
                  </td>
                  {row?.map((correlation, j) => (
                    <td key={j} className="p-2 text-center">
                      <div 
                        className={`w-12 h-8 rounded text-xs flex items-center justify-center font-medium ${
                          Math.abs(correlation) > 0.7 
                            ? correlation > 0 ? 'bg-loss/20 text-loss' : 'bg-profit/20 text-profit'
                            : Math.abs(correlation) > 0.3
                            ? 'bg-warning/20 text-warning' :'bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        {correlation?.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-muted/10 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">High Correlation Pairs</h3>
          <div className="space-y-3">
            {correlationData?.highCorrelations?.map((pair, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Link" size={16} className="text-warning" />
                  <span className="text-sm text-foreground">{pair?.assets?.join(' - ')}</span>
                </div>
                <span className={`text-sm font-medium ${
                  pair?.correlation > 0 ? 'text-loss' : 'text-profit'
                }`}>
                  {pair?.correlation?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-muted/10 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Diversification Score</h3>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-muted)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray={`${correlationData?.diversificationScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                  {correlationData?.diversificationScore}%
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Portfolio diversification effectiveness
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVolatilityAnalysis = () => (
    <div className="space-y-6">
      <div className="p-4 bg-muted/10 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Volatility Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volatilityData?.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value?.toFixed(2)}%`, 'Volatility']}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <Bar 
                dataKey="volatility" 
                fill="var(--color-accent)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-muted/10 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Volatility by Asset</h3>
          <div className="space-y-3">
            {volatilityData?.byAsset?.map((asset, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{asset?.symbol}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        asset?.volatility > 30 ? 'bg-loss' : 
                        asset?.volatility > 15 ? 'bg-warning' : 'bg-profit'
                      }`}
                      style={{ width: `${Math.min(asset?.volatility * 2, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">
                    {formatPercentage(asset?.volatility)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-muted/10 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk-Return Scatter</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={volatilityData?.riskReturn}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="risk" 
                  name="Risk"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="return" 
                  name="Return"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value?.toFixed(2)}%`, 
                    name === 'risk' ? 'Risk' : 'Return'
                  ]}
                  labelFormatter={(label, payload) => 
                    payload?.[0]?.payload?.symbol || 'Asset'
                  }
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)'
                  }}
                />
                <Scatter 
                  dataKey="return" 
                  fill="var(--color-primary)"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="trading-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Risk Analytics</h2>
        <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.value}
              onClick={() => setActiveTab(tab?.value)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === tab?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'risk' && renderRiskMetrics()}
      {activeTab === 'correlation' && renderCorrelationMatrix()}
      {activeTab === 'volatility' && renderVolatilityAnalysis()}
    </div>
  );
};

export default RiskAnalytics;