import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';


const PerformanceChart = ({ data, benchmarkData }) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('performance');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const timeframes = [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'ALL', value: 'ALL' }
  ];

  const chartTypes = [
    { label: 'Performance', value: 'performance', icon: 'TrendingUp' },
    { label: 'Drawdown', value: 'drawdown', icon: 'TrendingDown' },
    { label: 'Returns', value: 'returns', icon: 'BarChart3' }
  ];

  const formatTooltipValue = (value, name) => {
    if (name === 'Portfolio' || name === 'Benchmark') {
      return [`${value?.toFixed(2)}%`, name];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem) => {
    const date = new Date(tickItem);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChartData = () => {
    switch (chartType) {
      case 'drawdown':
        return data?.map(item => ({
          ...item,
          portfolio: item?.drawdown,
          benchmark: benchmarkData?.find(b => b?.date === item?.date)?.drawdown || 0
        }));
      case 'returns':
        return data?.map(item => ({
          ...item,
          portfolio: item?.dailyReturn,
          benchmark: benchmarkData?.find(b => b?.date === item?.date)?.dailyReturn || 0
        }));
      default:
        return data?.map(item => ({
          ...item,
          portfolio: item?.cumulativeReturn,
          benchmark: benchmarkData?.find(b => b?.date === item?.date)?.cumulativeReturn || 0
        }));
    }
  };

  const chartData = getChartData();

  return (
    <div className="trading-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-foreground">Performance Analysis</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                showBenchmark ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="GitCompare" size={14} />
              <span>vs Benchmark</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
            {chartTypes?.map((type) => (
              <button
                key={type?.value}
                onClick={() => setChartType(type?.value)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                  chartType === type?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={14} />
                <span>{type?.label}</span>
              </button>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-1 bg-muted/20 rounded-lg p-1">
            {timeframes?.map((tf) => (
              <button
                key={tf?.value}
                onClick={() => setTimeframe(tf?.value)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  timeframe === tf?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'returns' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value?.toFixed(1)}%`}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => new Date(label)?.toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="portfolio"
                name="Portfolio"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              {showBenchmark && (
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="var(--color-secondary)"
                  fill="var(--color-secondary)"
                  fillOpacity={0.05}
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value?.toFixed(1)}%`}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => new Date(label)?.toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="Portfolio"
                stroke={chartType === 'drawdown' ? 'var(--color-loss)' : 'var(--color-primary)'}
                strokeWidth={2}
                dot={false}
              />
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="var(--color-secondary)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;