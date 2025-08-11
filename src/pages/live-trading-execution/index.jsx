import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ActiveOrdersTable from './components/ActiveOrdersTable';
import PositionMonitor from './components/PositionMonitor';
import OrderEntryPanel from './components/OrderEntryPanel';
import MarketDepthPanel from './components/MarketDepthPanel';
import AuditLogPanel from './components/AuditLogPanel';

import Button from '../../components/ui/Button';

const LiveTradingExecution = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: '99.8%',
    latency: 12,
    ordersProcessed: 1247,
    lastUpdate: new Date()
  });

  // Mock data initialization
  useEffect(() => {
    // Initialize active orders
    const mockOrders = [
      {
        id: 'ORD001',
        symbol: 'AAPL',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 100,
        price: 175.50,
        filled: 0,
        status: 'pending',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 'ORD002',
        symbol: 'MSFT',
        side: 'SELL',
        type: 'MARKET',
        quantity: 50,
        price: 0,
        filled: 25,
        status: 'partial',
        timestamp: new Date(Date.now() - 600000)
      },
      {
        id: 'ORD003',
        symbol: 'GOOGL',
        side: 'BUY',
        type: 'STOP_LIMIT',
        quantity: 25,
        price: 2850.00,
        filled: 25,
        status: 'filled',
        timestamp: new Date(Date.now() - 900000)
      }
    ];

    // Initialize positions
    const mockPositions = [
      {
        id: 'POS001',
        symbol: 'AAPL',
        side: 'LONG',
        quantity: 200,
        entryPrice: 172.30,
        currentPrice: 175.85,
        stopLoss: 168.50,
        risk: 760.00,
        status: 'active',
        entryTime: new Date(Date.now() - 3600000),
        takeProfit: {
          tp1: 178.50,
          tp2: 182.00,
          tp1Filled: false,
          tp2Filled: false
        }
      },
      {
        id: 'POS002',
        symbol: 'TSLA',
        side: 'LONG',
        quantity: 50,
        entryPrice: 245.80,
        currentPrice: 251.20,
        stopLoss: 240.00,
        risk: 290.00,
        status: 'active',
        entryTime: new Date(Date.now() - 7200000),
        takeProfit: {
          tp1: 255.00,
          tp2: 265.00,
          tp1Filled: true,
          tp2Filled: false
        }
      }
    ];

    // Initialize audit logs
    const mockAuditLogs = [
      {
        id: 'LOG001',
        timestamp: new Date(Date.now() - 120000),
        type: 'execution',
        level: 'success',
        symbol: 'AAPL',
        message: 'Order ORD001 partially filled: 50 shares at $175.50',
        details: { orderId: 'ORD001', fillPrice: 175.50, fillQuantity: 50 }
      },
      {
        id: 'LOG002',
        timestamp: new Date(Date.now() - 300000),
        type: 'order',
        level: 'info',
        symbol: 'MSFT',
        message: 'New limit order placed: BUY 100 MSFT at $415.25',
        details: { orderId: 'ORD004', orderType: 'LIMIT' }
      },
      {
        id: 'LOG003',
        timestamp: new Date(Date.now() - 450000),
        type: 'system',
        level: 'warning',
        message: 'High latency detected on QuantConnect connection: 45ms',
        details: { broker: 'QuantConnect', latency: 45 }
      },
      {
        id: 'LOG004',
        timestamp: new Date(Date.now() - 600000),
        type: 'execution',
        level: 'success',
        symbol: 'TSLA',
        message: 'Take Profit 1 executed: 40 shares at $255.00',
        details: { positionId: 'POS002', tpLevel: 1, fillPrice: 255.00 }
      },
      {
        id: 'LOG005',
        timestamp: new Date(Date.now() - 750000),
        type: 'error',
        level: 'error',
        message: 'Order rejection: Insufficient buying power for NVDA order',
        details: { orderId: 'ORD005', reason: 'insufficient_funds' }
      }
    ];

    setActiveOrders(mockOrders);
    setPositions(mockPositions);
    setAuditLogs(mockAuditLogs);
  }, []);

  // Mock AI recommendations
  const aiRecommendations = [
    {
      id: 'REC001',
      symbol: 'NVDA',
      side: 'BUY',
      confidence: 87,
      entryPrice: 875.50,
      stopLoss: 860.00,
      takeProfit1: 895.00,
      takeProfit2: 920.00,
      rationale: 'Strong bullish momentum with VWAP support'
    },
    {
      id: 'REC002',
      symbol: 'AMD',
      side: 'SELL',
      confidence: 92,
      entryPrice: 142.30,
      stopLoss: 148.00,
      takeProfit1: 135.00,
      takeProfit2: 128.00,
      rationale: 'Bearish engulfing pattern with volume confirmation'
    }
  ];

  // Mock market data
  const marketData = {
    'AAPL': {
      bids: [
        { price: 175.48, size: 500 },
        { price: 175.47, size: 300 },
        { price: 175.46, size: 800 },
        { price: 175.45, size: 200 },
        { price: 175.44, size: 600 }
      ],
      asks: [
        { price: 175.52, size: 400 },
        { price: 175.53, size: 700 },
        { price: 175.54, size: 300 },
        { price: 175.55, size: 900 },
        { price: 175.56, size: 250 }
      ]
    },
    'MSFT': {
      bids: [
        { price: 414.98, size: 300 },
        { price: 414.97, size: 500 },
        { price: 414.96, size: 200 },
        { price: 414.95, size: 400 },
        { price: 414.94, size: 600 }
      ],
      asks: [
        { price: 415.02, size: 350 },
        { price: 415.03, size: 450 },
        { price: 415.04, size: 200 },
        { price: 415.05, size: 300 },
        { price: 415.06, size: 500 }
      ]
    }
  };

  // Mock recent executions
  const recentExecutions = [
    {
      id: 'EXE001',
      timestamp: new Date(Date.now() - 30000),
      symbol: 'AAPL',
      side: 'BUY',
      price: 175.50,
      size: 100
    },
    {
      id: 'EXE002',
      timestamp: new Date(Date.now() - 60000),
      symbol: 'MSFT',
      side: 'SELL',
      price: 414.95,
      size: 50
    },
    {
      id: 'EXE003',
      timestamp: new Date(Date.now() - 90000),
      symbol: 'GOOGL',
      side: 'BUY',
      price: 2851.25,
      size: 25
    }
  ];

  // Mock broker status
  const brokerStatus = {
    quantconnect: {
      status: 'connected',
      latency: 12
    },
    interactiveBrokers: {
      status: 'connected',
      latency: 8
    },
    alpaca: {
      status: 'connecting',
      latency: 25
    }
  };

  // Event handlers
  const handleCancelOrder = (orderId) => {
    setActiveOrders(orders => orders?.filter(order => order?.id !== orderId));
    addAuditLog('order', 'info', `Order ${orderId} cancelled by user`);
  };

  const handleModifyOrder = (orderId) => {
    console.log('Modify order:', orderId);
    addAuditLog('order', 'info', `Order ${orderId} modification requested`);
  };

  const handleClosePosition = (positionId) => {
    setPositions(positions => positions?.filter(pos => pos?.id !== positionId));
    addAuditLog('execution', 'success', `Position ${positionId} closed by user`);
  };

  const handleModifyTakeProfit = (positionId) => {
    console.log('Modify take profit:', positionId);
    addAuditLog('order', 'info', `Take profit modification requested for position ${positionId}`);
  };

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...orderData,
      filled: 0,
      status: 'pending',
      timestamp: new Date()
    };
    
    setActiveOrders(orders => [...orders, newOrder]);
    addAuditLog('order', 'success', `New ${orderData?.type} order placed: ${orderData?.side} ${orderData?.quantity} ${orderData?.symbol}`);
  };

  const addAuditLog = (type, level, message, symbol = null, details = null) => {
    const newLog = {
      id: `LOG${Date.now()}`,
      timestamp: new Date(),
      type,
      level,
      symbol,
      message,
      details
    };
    
    setAuditLogs(logs => [newLog, ...logs]);
  };

  const handleEmergencyStop = () => {
    setActiveOrders([]);
    setPositions([]);
    addAuditLog('system', 'warning', 'Emergency stop activated - All orders cancelled and positions closed');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Live Trading Execution</h1>
                <p className="text-muted-foreground mt-2">
                  Real-time order management and position monitoring
                </p>
              </div>
              
              {/* System Health & Emergency Controls */}
              <div className="flex items-center space-x-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{systemHealth?.uptime}</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{systemHealth?.latency}ms</p>
                      <p className="text-xs text-muted-foreground">Latency</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{systemHealth?.ordersProcessed}</p>
                      <p className="text-xs text-muted-foreground">Orders Today</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="destructive"
                  onClick={handleEmergencyStop}
                  iconName="AlertTriangle"
                  iconSize={16}
                >
                  Emergency Stop
                </Button>
              </div>
            </div>
          </div>

          {/* Main Trading Interface */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Panel - Order Entry */}
            <div className="xl:col-span-1">
              <OrderEntryPanel
                aiRecommendations={aiRecommendations}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>

            {/* Center Panel - Orders and Positions */}
            <div className="xl:col-span-2 space-y-6">
              {/* Active Orders */}
              <ActiveOrdersTable
                orders={activeOrders}
                onCancelOrder={handleCancelOrder}
                onModifyOrder={handleModifyOrder}
              />

              {/* Position Monitor */}
              <PositionMonitor
                positions={positions}
                onClosePosition={handleClosePosition}
                onModifyTakeProfit={handleModifyTakeProfit}
              />
            </div>

            {/* Right Panel - Market Data */}
            <div className="xl:col-span-1">
              <MarketDepthPanel
                marketData={marketData}
                recentExecutions={recentExecutions}
                brokerStatus={brokerStatus}
              />
            </div>
          </div>

          {/* Bottom Panel - Audit Log */}
          <div className="mt-8">
            <AuditLogPanel auditLogs={auditLogs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTradingExecution;