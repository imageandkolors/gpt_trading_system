import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ChartAnalysisWorkspace = () => {
  const [uploadedChart, setUploadedChart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const mockAnalysisResults = {
    symbol: "AAPL",
    timeframe: "1H",
    confidence: {
      primary: 89,
      opposite: 25
    },
    patterns: [
      {
        type: "VWAP Rejection",
        confidence: 92,
        description: "Strong rejection at VWAP resistance level with high volume confirmation"
      },
      {
        type: "Engulfing Pattern",
        confidence: 85,
        description: "Bullish engulfing pattern formed at key support level"
      }
    ],
    technicalIndicators: {
      vwap: { value: 187.45, signal: "RESISTANCE" },
      ema21: { value: 186.20, signal: "SUPPORT" },
      rsi: { value: 68.5, signal: "NEUTRAL" },
      volume: { value: "Above Average", signal: "BULLISH" }
    },
    tradeRecommendation: {
      action: "BUY",
      entry: 186.50,
      stopLoss: 184.20,
      takeProfit1: 189.80,
      takeProfit2: 192.50,
      riskReward: 2.4
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileUpload(files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedChart(e?.target?.result);
        simulateAnalysis();
      };
      reader?.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults(mockAnalysisResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearChart = () => {
    setUploadedChart(null);
    setAnalysisResults(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Upload Area */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Chart Analysis</h3>
          {uploadedChart && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChart}
              iconName="X"
              iconSize={16}
            >
              Clear
            </Button>
          )}
        </div>

        {!uploadedChart ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop your chart here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PNG, JPG, JPEG, WEBP formats
                </p>
                <Button
                  variant="primary"
                  onClick={() => fileInputRef?.current?.click()}
                  iconName="FolderOpen"
                  iconSize={16}
                >
                  Browse Files
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-muted/20 rounded-lg overflow-hidden">
              <Image
                src={uploadedChart}
                alt="Uploaded trading chart"
                className="w-full h-64 object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin">
                      <Icon name="Brain" size={24} className="text-primary" />
                    </div>
                    <span className="text-foreground font-medium">Analyzing chart...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Analysis Results */}
      {analysisResults && (
        <div className="trading-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">AI Analysis Results</h3>
            <div className="flex items-center space-x-2">
              <Icon name="Brain" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                {analysisResults?.symbol} • {analysisResults?.timeframe}
              </span>
            </div>
          </div>

          {/* Confidence Scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-profit/10 rounded-lg border border-profit/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Primary Confidence</span>
                <Icon name="TrendingUp" size={16} className="text-profit" />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-profit">
                  {analysisResults?.confidence?.primary}%
                </span>
                <span className="text-xs text-muted-foreground mb-1">≥85% required</span>
              </div>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Opposite Confidence</span>
                <Icon name="TrendingDown" size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {analysisResults?.confidence?.opposite}%
                </span>
                <span className="text-xs text-muted-foreground mb-1">≤30% required</span>
              </div>
            </div>
          </div>

          {/* Detected Patterns */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">Detected Patterns</h4>
            <div className="space-y-3">
              {analysisResults?.patterns?.map((pattern, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{pattern?.type}</span>
                    <span className="text-sm text-primary font-medium">{pattern?.confidence}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern?.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Recommendation */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Trade Recommendation</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                analysisResults?.tradeRecommendation?.action === 'BUY' ?'bg-profit/20 text-profit' :'bg-loss/20 text-loss'
              }`}>
                {analysisResults?.tradeRecommendation?.action}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Entry Price</p>
                <p className="font-medium text-foreground">${analysisResults?.tradeRecommendation?.entry}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stop Loss</p>
                <p className="font-medium text-foreground">${analysisResults?.tradeRecommendation?.stopLoss}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Take Profit 1</p>
                <p className="font-medium text-foreground">${analysisResults?.tradeRecommendation?.takeProfit1}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Take Profit 2</p>
                <p className="font-medium text-foreground">${analysisResults?.tradeRecommendation?.takeProfit2}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk/Reward Ratio</span>
                <span className="text-sm font-semibold text-profit">
                  1:{analysisResults?.tradeRecommendation?.riskReward}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartAnalysisWorkspace;