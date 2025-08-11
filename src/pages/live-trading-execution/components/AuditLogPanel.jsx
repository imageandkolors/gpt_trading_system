import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AuditLogPanel = ({ auditLogs }) => {
  const [filteredLogs, setFilteredLogs] = useState(auditLogs);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    dateRange: 'today'
  });

  const logTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'order', label: 'Order Events' },
    { value: 'execution', label: 'Executions' },
    { value: 'system', label: 'System Events' },
    { value: 'error', label: 'Errors' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...auditLogs];

    // Search filter
    if (currentFilters?.search) {
      filtered = filtered?.filter(log => 
        log?.message?.toLowerCase()?.includes(currentFilters?.search?.toLowerCase()) ||
        log?.symbol?.toLowerCase()?.includes(currentFilters?.search?.toLowerCase())
      );
    }

    // Type filter
    if (currentFilters?.type !== 'all') {
      filtered = filtered?.filter(log => log?.type === currentFilters?.type);
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (currentFilters?.dateRange !== 'all') {
      filtered = filtered?.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (currentFilters?.dateRange) {
          case 'today':
            return logDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return logDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return logDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'order': return 'ShoppingCart';
      case 'execution': return 'Zap';
      case 'system': return 'Settings';
      case 'error': return 'AlertCircle';
      default: return 'Info';
    }
  };

  const getLogColor = (type, level) => {
    if (level === 'error') return 'text-destructive';
    if (level === 'warning') return 'text-warning';
    if (level === 'success') return 'text-success';
    
    switch (type) {
      case 'order': return 'text-primary';
      case 'execution': return 'text-success';
      case 'system': return 'text-muted-foreground';
      case 'error': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Level', 'Symbol', 'Message']?.join(','),
      ...filteredLogs?.map(log => [
        log?.timestamp,
        log?.type,
        log?.level,
        log?.symbol || '',
        `"${log?.message}"`
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Audit Log</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              iconName="Download"
              iconSize={14}
            >
              Export
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
      {/* Filters */}
      <div className="p-4 border-b border-border bg-muted/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search logs..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            iconName="Search"
          />
          <Select
            options={logTypes}
            value={filters?.type}
            onChange={(value) => handleFilterChange('type', value)}
            placeholder="Filter by type"
          />
          <Select
            options={dateRanges}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Date range"
          />
        </div>
      </div>
      {/* Log Entries */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-2">
          {filteredLogs?.map((log) => (
            <div
              key={log?.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors duration-150"
            >
              <Icon
                name={getLogIcon(log?.type)}
                size={16}
                className={`mt-0.5 ${getLogColor(log?.type, log?.level)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {log?.type}
                    </span>
                    {log?.symbol && (
                      <span className="text-xs font-medium text-foreground bg-muted/30 px-2 py-0.5 rounded">
                        {log?.symbol}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTimestamp(log?.timestamp)}
                  </span>
                </div>
                <p className={`text-sm ${getLogColor(log?.type, log?.level)}`}>
                  {log?.message}
                </p>
                {log?.details && (
                  <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground font-mono">
                    {JSON.stringify(log?.details, null, 2)}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredLogs?.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No log entries found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Log Statistics */}
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">{filteredLogs?.length}</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-success">
              {filteredLogs?.filter(log => log?.level === 'success')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-warning">
              {filteredLogs?.filter(log => log?.level === 'warning')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-destructive">
              {filteredLogs?.filter(log => log?.level === 'error')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPanel;