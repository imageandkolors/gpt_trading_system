import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderEntryPanel = ({ aiRecommendations, onPlaceOrder }) => {
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    side: 'BUY',
    type: 'MARKET',
    quantity: '',
    price: '',
    stopLoss: '',
    takeProfit1: '',
    takeProfit2: '',
    riskAmount: ''
  });

  const [positionSize, setPositionSize] = useState({
    accountBalance: 100000,
    riskPercentage: 2,
    calculatedShares: 0,
    riskAmount: 0
  });

  const orderTypes = [
    { value: 'MARKET', label: 'Market Order' },
    { value: 'LIMIT', label: 'Limit Order' },
    { value: 'STOP', label: 'Stop Order' },
    { value: 'STOP_LIMIT', label: 'Stop Limit Order' }
  ];

  const sideOptions = [
    { value: 'BUY', label: 'Buy / Long' },
    { value: 'SELL', label: 'Sell / Short' }
  ];

  const handleInputChange = (field, value) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate position size when relevant fields change
    if (field === 'price' || field === 'stopLoss' || field === 'symbol') {
      calculatePositionSize(field === 'price' ? value : orderForm?.price, 
                          field === 'stopLoss' ? value : orderForm?.stopLoss);
    }
  };

  const calculatePositionSize = (entryPrice, stopLoss) => {
    if (!entryPrice || !stopLoss) return;

    const riskAmount = (positionSize?.accountBalance * positionSize?.riskPercentage) / 100;
    const riskPerShare = Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss));
    const calculatedShares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;

    setPositionSize(prev => ({
      ...prev,
      calculatedShares,
      riskAmount
    }));

    setOrderForm(prev => ({
      ...prev,
      quantity: calculatedShares?.toString(),
      riskAmount: riskAmount?.toFixed(2)
    }));
  };

  const handleApplyRecommendation = (recommendation) => {
    setOrderForm({
      ...orderForm,
      symbol: recommendation?.symbol,
      side: recommendation?.side,
      price: recommendation?.entryPrice?.toString(),
      stopLoss: recommendation?.stopLoss?.toString(),
      takeProfit1: recommendation?.takeProfit1?.toString(),
      takeProfit2: recommendation?.takeProfit2?.toString()
    });

    calculatePositionSize(recommendation?.entryPrice, recommendation?.stopLoss);
  };

  const handleSubmitOrder = () => {
    const order = {
      ...orderForm,
      quantity: parseInt(orderForm?.quantity),
      price: parseFloat(orderForm?.price),
      stopLoss: parseFloat(orderForm?.stopLoss),
      takeProfit1: parseFloat(orderForm?.takeProfit1),
      takeProfit2: parseFloat(orderForm?.takeProfit2),
      timestamp: new Date()
    };

    onPlaceOrder(order);
  };

  const isFormValid = () => {
    return orderForm?.symbol && orderForm?.quantity && 
           (orderForm?.type === 'MARKET' || orderForm?.price);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Order Entry</h3>
      </div>
      <div className="p-4 space-y-6">
        {/* AI Recommendations */}
        {aiRecommendations?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">AI Recommendations</h4>
            {aiRecommendations?.map((rec) => (
              <div key={rec?.id} className="bg-muted/20 rounded-lg p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{rec?.symbol}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rec?.side === 'BUY' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                    }`}>
                      {rec?.side}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Zap" size={12} className="text-primary" />
                      <span className="text-xs text-primary font-medium">{rec?.confidence}%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyRecommendation(rec)}
                    iconName="ArrowRight"
                    iconSize={14}
                  >
                    Apply
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Entry: ${rec?.entryPrice?.toFixed(2)}</span>
                  <span>Stop: ${rec?.stopLoss?.toFixed(2)}</span>
                  <span>TP1: ${rec?.takeProfit1?.toFixed(2)}</span>
                  <span>TP2: ${rec?.takeProfit2?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Symbol"
              type="text"
              placeholder="e.g., AAPL"
              value={orderForm?.symbol}
              onChange={(e) => handleInputChange('symbol', e?.target?.value?.toUpperCase())}
              required
            />
            <Select
              label="Side"
              options={sideOptions}
              value={orderForm?.side}
              onChange={(value) => handleInputChange('side', value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Order Type"
              options={orderTypes}
              value={orderForm?.type}
              onChange={(value) => handleInputChange('type', value)}
            />
            <Input
              label="Quantity"
              type="number"
              placeholder="Shares"
              value={orderForm?.quantity}
              onChange={(e) => handleInputChange('quantity', e?.target?.value)}
              required
            />
          </div>

          {orderForm?.type !== 'MARKET' && (
            <Input
              label="Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={orderForm?.price}
              onChange={(e) => handleInputChange('price', e?.target?.value)}
              required
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stop Loss"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={orderForm?.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e?.target?.value)}
            />
            <Input
              label="Take Profit 1 (80%)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={orderForm?.takeProfit1}
              onChange={(e) => handleInputChange('takeProfit1', e?.target?.value)}
            />
          </div>

          <Input
            label="Take Profit 2 (20%)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={orderForm?.takeProfit2}
            onChange={(e) => handleInputChange('takeProfit2', e?.target?.value)}
          />
        </div>

        {/* Position Size Calculator */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Position Size Calculator</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
              <p className="text-sm font-mono text-foreground">${positionSize?.accountBalance?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Risk Percentage</p>
              <p className="text-sm font-mono text-foreground">{positionSize?.riskPercentage}%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Risk Amount</p>
              <p className="text-sm font-mono text-success">${positionSize?.riskAmount?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Calculated Shares</p>
              <p className="text-sm font-mono text-foreground">{positionSize?.calculatedShares?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Risk Assessment</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• Maximum risk per trade: ${positionSize?.riskAmount?.toFixed(2)}</p>
            <p>• Risk-to-reward ratio: Calculate based on take profit levels</p>
            <p>• Position size: {positionSize?.calculatedShares?.toLocaleString()} shares</p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={handleSubmitOrder}
          disabled={!isFormValid()}
          iconName="Send"
          iconSize={16}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderEntryPanel;