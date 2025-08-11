import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveOrdersTable = ({ orders, onCancelOrder, onModifyOrder }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders?.map(order => order?.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders?.filter(id => id !== orderId));
    }
  };

  const handleBulkCancel = () => {
    selectedOrders?.forEach(orderId => {
      onCancelOrder(orderId);
    });
    setSelectedOrders([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'filled': return 'text-success';
      case 'partial': return 'text-warning';
      case 'pending': return 'text-muted-foreground';
      case 'cancelled': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'filled': return 'CheckCircle';
      case 'partial': return 'Clock';
      case 'pending': return 'Timer';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Orders</h3>
          <div className="flex items-center space-x-2">
            {selectedOrders?.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkCancel}
                iconName="Trash2"
                iconSize={14}
              >
                Cancel Selected ({selectedOrders?.length})
              </Button>
            )}
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders?.length === orders?.length && orders?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Side
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Filled
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders?.map((order) => (
              <tr key={order?.id} className="hover:bg-muted/20 transition-colors duration-150">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders?.includes(order?.id)}
                    onChange={(e) => handleSelectOrder(order?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{order?.symbol}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order?.side === 'BUY' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                  }`}>
                    {order?.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{order?.type}</td>
                <td className="px-4 py-3 text-sm font-mono text-foreground">{order?.quantity?.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-mono text-foreground">
                  ${order?.price?.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-foreground">
                  {order?.filled?.toLocaleString()} ({((order?.filled / order?.quantity) * 100)?.toFixed(1)}%)
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(order?.status)} 
                      size={14} 
                      className={getStatusColor(order?.status)}
                    />
                    <span className={`text-sm font-medium ${getStatusColor(order?.status)}`}>
                      {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {order?.timestamp?.toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onModifyOrder(order?.id)}
                      iconName="Edit2"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelOrder(order?.id)}
                      iconName="X"
                      iconSize={14}
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active orders</p>
        </div>
      )}
    </div>
  );
};

export default ActiveOrdersTable;