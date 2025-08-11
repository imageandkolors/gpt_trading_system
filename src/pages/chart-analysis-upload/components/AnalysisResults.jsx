import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import tradingAIService from '../../../services/openaiService';

const AnalysisResults = ({ analysisData, isAnalyzing, chartImage }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [error, setError] = useState(null);

  // Process chart with OpenAI when chartImage is provided
  useEffect(() => {
    if (chartImage && !isAnalyzing) {
      analyzeChartWithAI(chartImage);
    }
  }, [chartImage, isAnalyzing]);

  const analyzeChartWithAI = async (imageData) => {
    try {
      setIsProcessingAI(true);
      setError(null);
      
      // Convert image data to appropriate format for OpenAI
      const imageUrl = imageData?.startsWith('data:') ? imageData : `data:image/png;base64,${imageData}`;
      
      const analysis = await tradingAIService?.analyzeChartImage(imageUrl);
      setAiAnalysis(analysis);
      
    } catch (error) {
      console.error('Error analyzing chart with AI:', error);
      setError('Failed to analyze chart with AI. Please check your OpenAI API key.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const retryAnalysis = () => {
    if (chartImage) {
      analyzeChartWithAI(chartImage);
    }
  };

  // Use AI analysis if available, otherwise fall back to mock data
  const displayData = aiAnalysis || analysisData;

  if (isAnalyzing || isProcessingAI) {
    return (
      <div className="trading-card h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {isProcessingAI ? 'AI Processing Chart...' : 'Analyzing Chart...'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isProcessingAI ? 'Using GPT-4 Vision to analyze technical patterns' : 'Processing uploaded image and extracting data'}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                {isProcessingAI && (
                  <>
                    <Icon name="Eye" size={14} className="text-primary" />
                    <span>OpenAI Vision API</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trading-card h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Icon name="AlertTriangle" size={48} className="text-destructive mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Analysis Error</h3>
              <p className="text-sm text-muted-foreground max-w-md">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryAnalysis}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Retry Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="trading-card h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Ready for Analysis</h3>
              <p className="text-sm text-muted-foreground">Upload a chart to get AI-powered technical analysis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trading-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Chart Analysis Results</h3>
          <p className="text-sm text-muted-foreground">AI-powered technical analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          {aiAnalysis && (
            <div className="flex items-center space-x-1 text-xs text-primary">
              <Icon name="Brain" size={14} />
              <span>GPT-4 Vision</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={retryAnalysis} iconName="RefreshCw" />
        </div>
      </div>
      <div className="space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(100%-100px)]">
        {/* Symbol and Timeframe */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Symbol</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{displayData?.symbol || 'Unknown'}</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Timeframe</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{displayData?.timeframe || '4H'}</p>
          </div>
        </div>

        {/* Overall Bias and Trend */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-foreground">Market Bias</h4>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              (displayData?.overall_bias || displayData?.trend_direction)?.toLowerCase()?.includes('bull') 
                ? 'bg-profit/20 text-profit' : (displayData?.overall_bias || displayData?.trend_direction)?.toLowerCase()?.includes('bear')
                ? 'bg-loss/20 text-loss' :'bg-warning/20 text-warning'
            }`}>
              {displayData?.overall_bias || displayData?.trend_direction || 'Neutral'}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {displayData?.risk_assessment || 'Market showing mixed signals with moderate volatility.'}
          </p>
        </div>

        {/* Patterns Detected */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-3">Patterns Detected</h4>
          <div className="space-y-3">
            {(displayData?.patterns_detected || displayData?.patterns || [])?.map((pattern, index) => (
              <div key={index} className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={pattern?.bullish || pattern?.name?.toLowerCase()?.includes('bull') ? 'TrendingUp' : 'TrendingDown'} 
                      size={16} 
                      className={pattern?.bullish || pattern?.name?.toLowerCase()?.includes('bull') ? 'text-profit' : 'text-loss'} 
                    />
                    <span className="font-medium text-foreground">{pattern?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <span className={`text-xs font-medium ${
                      (pattern?.confidence || 0) >= 80 ? 'text-profit' :
                      (pattern?.confidence || 0) >= 60 ? 'text-warning' : 'text-loss'
                    }`}>
                      {pattern?.confidence || 0}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pattern?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support and Resistance Levels */}
        {displayData?.support_resistance && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Key Levels</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="ArrowDown" size={16} className="text-profit" />
                  <span className="font-medium text-foreground">Support Levels</span>
                </div>
                <div className="space-y-1">
                  {displayData?.support_resistance?.support_levels?.map((level, index) => (
                    <div key={index} className="text-sm font-mono text-profit">${level}</div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="ArrowUp" size={16} className="text-loss" />
                  <span className="font-medium text-foreground">Resistance Levels</span>
                </div>
                <div className="space-y-1">
                  {displayData?.support_resistance?.resistance_levels?.map((level, index) => (
                    <div key={index} className="text-sm font-mono text-loss">${level}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trade Setup */}
        {displayData?.trade_setup && (
          <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-foreground">Recommended Trade Setup</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                (displayData?.trade_setup?.confidence || 0) >= 80 ? 'bg-profit/20 text-profit' :
                (displayData?.trade_setup?.confidence || 0) >= 60 ? 'bg-warning/20 text-warning' : 'bg-loss/20 text-loss'
              }`}>
                {displayData?.trade_setup?.confidence || 0}% Confidence
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-muted-foreground">Setup Type</span>
                <p className="font-medium text-foreground">{displayData?.trade_setup?.setup_type}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Risk/Reward</span>
                <p className="font-medium text-profit">{displayData?.trade_setup?.risk_reward || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Entry Zone: </span>
                <span className="font-mono text-primary">${displayData?.trade_setup?.entry_zone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stop Loss: </span>
                <span className="font-mono text-loss">${displayData?.trade_setup?.stop_loss}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Take Profit 1: </span>
                <span className="font-mono text-profit">${displayData?.trade_setup?.take_profit_1}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Take Profit 2: </span>
                <span className="font-mono text-profit">${displayData?.trade_setup?.take_profit_2}</span>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Scores */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-3">Analysis Confidence</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">Primary Direction</span>
                <span className="text-sm font-medium text-profit">
                  {displayData?.confidence?.primary || displayData?.trade_setup?.confidence || 87}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-profit h-2 rounded-full transition-all duration-300" 
                  style={{width: `${displayData?.confidence?.primary || displayData?.trade_setup?.confidence || 87}%`}}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">Opposite Direction</span>
                <span className="text-sm font-medium text-loss">
                  {displayData?.confidence?.opposite || 23}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-loss h-2 rounded-full transition-all duration-300" 
                  style={{width: `${displayData?.confidence?.opposite || 23}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;