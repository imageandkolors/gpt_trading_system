import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TradeHistoryTable = ({ trades }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'entryTime', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState({
    symbol: '',
    side: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

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

  const formatDateTime = (dateString) => {
    return new Date(dateString)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades?.filter(trade => {
      const matchesSymbol = !filterConfig?.symbol || 
        trade?.symbol?.toLowerCase()?.includes(filterConfig?.symbol?.toLowerCase());
      const matchesSide = !filterConfig?.side || trade?.side === filterConfig?.side;
      const matchesStatus = !filterConfig?.status || trade?.status === filterConfig?.status;
      
      let matchesDateRange = true;
      if (filterConfig?.dateFrom || filterConfig?.dateTo) {
        const tradeDate = new Date(trade.entryTime);
        if (filterConfig?.dateFrom) {
          matchesDateRange = matchesDateRange && tradeDate >= new Date(filterConfig.dateFrom);
        }
        if (filterConfig?.dateTo) {
          matchesDateRange = matchesDateRange && tradeDate <= new Date(filterConfig.dateTo);
        }
      }

      return matchesSymbol && matchesSide && matchesStatus && matchesDateRange;
    });

    // Sort the filtered results
    filtered?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [trades, filterConfig, sortConfig]);

  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedTrades?.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedTrades, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedTrades?.length / pageSize);

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      closed: { color: 'text-success bg-success/10', icon: 'CheckCircle' },
      open: { color: 'text-warning bg-warning/10', icon: 'Clock' },
      cancelled: { color: 'text-muted-foreground bg-muted/10', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.closed;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const clearFilters = () => {
    setFilterConfig({
      symbol: '',
      side: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  const exportData = () => {
    const csvContent = [
      ['Symbol', 'Side', 'Quantity', 'Entry Price', 'Exit Price', 'P&L', 'P&L %', 'Entry Time', 'Exit Time', 'Status', 'Pattern', 'AI Trade', 'Confidence']?.join(','),
      ...filteredAndSortedTrades?.map(trade => [
        trade?.symbol,
        trade?.side,
        trade?.quantity,
        trade?.entryPrice,
        trade?.exitPrice || '',
        trade?.pnl,
        trade?.pnlPercentage,
        trade?.entryTime,
        trade?.exitTime || '',
        trade?.status,
        trade?.pattern || '',
        trade?.isAiTrade ? 'Yes' : 'No',
        trade?.confidence || ''
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade_history_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="trading-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Trade History</h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={exportData}
          >
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by symbol..."
          value={filterConfig?.symbol}
          onChange={(e) => handleFilterChange('symbol', e?.target?.value)}
          className="text-sm"
        />
        
        <select
          value={filterConfig?.side}
          onChange={(e) => handleFilterChange('side', e?.target?.value)}
          className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Sides</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>

        <select
          value={filterConfig?.status}
          onChange={(e) => handleFilterChange('status', e?.target?.value)}
          className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="closed">Closed</option>
          <option value="open">Open</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <Input
          type="date"
          placeholder="From date"
          value={filterConfig?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          className="text-sm"
        />

        <Input
          type="date"
          placeholder="To date"
          value={filterConfig?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          className="text-sm"
        />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center space-x-1">
                  <span>Symbol</span>
                  <Icon name={getSortIcon('symbol')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('side')}
              >
                <div className="flex items-center space-x-1">
                  <span>Side</span>
                  <Icon name={getSortIcon('side')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quantity</span>
                  <Icon name={getSortIcon('quantity')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('entryPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Entry</span>
                  <Icon name={getSortIcon('entryPrice')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('exitPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Exit</span>
                  <Icon name={getSortIcon('exitPrice')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('pnl')}
              >
                <div className="flex items-center space-x-1">
                  <span>P&L</span>
                  <Icon name={getSortIcon('pnl')} size={14} />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => handleSort('entryTime')}
              >
                <div className="flex items-center space-x-1">
                  <span>Entry Time</span>
                  <Icon name={getSortIcon('entryTime')} size={14} />
                </div>
              </th>
              <th>Status</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades?.map((trade) => (
              <tr key={trade?.id} className="hover:bg-muted/10 transition-colors">
                <td>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{trade?.symbol}</span>
                    {trade?.isAiTrade && (
                      <div className="flex items-center space-x-1 px-1 py-0.5 bg-primary/10 rounded text-xs">
                        <Icon name="Bot" size={10} className="text-primary" />
                        <span className="text-primary">AI</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`font-medium ${trade?.side === 'BUY' ? 'text-profit' : 'text-loss'}`}>
                    {trade?.side}
                  </span>
                </td>
                <td className="trading-data">{trade?.quantity}</td>
                <td className="trading-data">{formatCurrency(trade?.entryPrice)}</td>
                <td className="trading-data">
                  {trade?.exitPrice ? formatCurrency(trade?.exitPrice) : '-'}
                </td>
                <td>
                  <div className="text-right">
                    <div className={`font-semibold ${trade?.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatCurrency(trade?.pnl)}
                    </div>
                    <div className={`text-xs ${trade?.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatPercentage(trade?.pnlPercentage)}
                    </div>
                  </div>
                </td>
                <td className="text-xs">{formatDateTime(trade?.entryTime)}</td>
                <td>{getStatusBadge(trade?.status)}</td>
                <td>
                  {trade?.pattern && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={12} className="text-accent" />
                      <span className="text-xs text-accent">{trade?.pattern}</span>
                    </div>
                  )}
                  {trade?.confidence && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            trade?.confidence >= 85 ? 'bg-profit' : 
                            trade?.confidence >= 70 ? 'bg-warning' : 'bg-loss'
                          }`}
                          style={{ width: `${trade?.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{trade?.confidence}%</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedTrades?.length)} of {filteredAndSortedTrades?.length} trades
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e?.target?.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistoryTable;