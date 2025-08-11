import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import tradingAIService from '../../../services/openaiService';

const VoiceInteractionPanel = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [systemStatus, setSystemStatus] = useState({
    broker: 'online',
    dataFeed: 'online',
    ai: 'online',
    voice: 'ready'
  });
  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      type: 'user',
      content: 'Analyze the AAPL chart I uploaded',
      timestamp: new Date(Date.now() - 300000),
      confidence: 95
    },
    {
      id: 2,
      type: 'ai',
      content: `I've analyzed your AAPL chart. I detected a strong VWAP rejection pattern with 89% confidence. The stock is showing bullish momentum with an engulfing pattern at the 21 EMA support level. \n\nRecommendation: BUY at $186.50 with stop loss at $184.20 and take profits at $189.80 and $192.50. Risk/reward ratio is 1:2.4.`,
      timestamp: new Date(Date.now() - 280000),
      confidence: 89
    }
  ]);
  const [recognitionRef, setRecognitionRef] = useState(null);

  const audioRef = useRef(null);

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if browser supports speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      setSystemStatus(prev => ({ ...prev, voice: 'ready' }));
    } else {
      setSystemStatus(prev => ({ ...prev, voice: 'unsupported' }));
    }
  }, []);

  const handleStartListening = async () => {
    try {
      setIsListening(true);
      setTranscription('');
      setConfidence(0);
      setSystemStatus(prev => ({ ...prev, voice: 'listening' }));
      
      const transcript = await tradingAIService?.speechToText({
        continuous: false,
        interimResults: true,
        lang: 'en-US'
      });
      
      setTranscription(transcript);
      setConfidence(95);
      setIsListening(false);
      setSystemStatus(prev => ({ ...prev, voice: 'ready' }));
      
      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: transcript,
        timestamp: new Date(),
        confidence: 95
      };
      setConversationHistory(prev => [...prev, userMessage]);
      
      // Process with OpenAI
      await processVoiceCommand(transcript);
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      setSystemStatus(prev => ({ ...prev, voice: 'error' }));
      
      // Show error message
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: 'Sorry, I had trouble understanding that. Please try again.',
        timestamp: new Date(),
        confidence: 0
      };
      setConversationHistory(prev => [...prev, errorMessage]);
    }
  };

  const processVoiceCommand = async (command) => {
    try {
      setIsProcessing(true);
      setSystemStatus(prev => ({ ...prev, ai: 'processing' }));
      
      const aiResponse = await tradingAIService?.processVoiceCommand(command);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse?.response,
        timestamp: new Date(),
        confidence: aiResponse?.confidence,
        metadata: {
          trade_recommendation: aiResponse?.trade_recommendation,
          market_analysis: aiResponse?.market_analysis,
          action_required: aiResponse?.action_required
        }
      };
      
      setConversationHistory(prev => [...prev, assistantMessage]);
      
      // Automatically play response
      if (aiResponse?.response) {
        await handlePlayResponse(aiResponse?.response);
      }
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0
      };
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setSystemStatus(prev => ({ ...prev, ai: 'online' }));
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
    setSystemStatus(prev => ({ ...prev, voice: 'ready' }));
    
    if (recognitionRef) {
      recognitionRef?.stop();
    }
  };

  const handlePlayResponse = async (text) => {
    try {
      setIsPlaying(true);
      await tradingAIService?.textToSpeech(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleQuickCommand = async (command) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: command,
      timestamp: new Date(),
      confidence: 100
    };
    setConversationHistory(prev => [...prev, userMessage]);
    
    // Process command
    await processVoiceCommand(command);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': case 'ready': return 'text-profit';
      case 'offline': case 'error': case 'unsupported': return 'text-loss';
      case 'pending': case 'processing': case 'listening': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': case 'ready': return 'CheckCircle';
      case 'offline': case 'error': case 'unsupported': return 'XCircle';
      case 'pending': case 'processing': case 'listening': return 'Clock';
      default: return 'AlertCircle';
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const mockVoiceCommands = [
    "What\'s the current market status?",
    "Show me my portfolio performance",
    "Analyze the uploaded chart",
    "Execute buy order for 100 shares",
    "Set stop loss at $180",
    "Close all positions"
  ];

  return (
    <div className="space-y-6">
      {/* Voice Controls */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">AI-Powered Voice Trading Interface</h3>
          <div className="flex items-center space-x-2">
            {Object.entries(systemStatus)?.map(([system, status]) => (
              <div key={system} className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(status)} 
                  size={12} 
                  className={getStatusColor(status)}
                />
                <span className="text-xs text-muted-foreground capitalize">{system}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Input Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? handleStopListening : handleStartListening}
            iconName={isListening ? "MicOff" : "Mic"}
            iconSize={20}
            disabled={systemStatus?.voice === 'unsupported' || isProcessing}
          >
            {isListening ? 'Stop Listening' : 'Start Voice Command'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => handlePlayResponse(conversationHistory?.[conversationHistory?.length - 1]?.content || 'Hello, I am your AI trading assistant.')}
            iconName={isPlaying ? "VolumeX" : "Volume2"}
            iconSize={20}
            disabled={isPlaying}
          >
            {isPlaying ? 'Playing...' : 'Play Response'}
          </Button>
        </div>

        {/* Live Transcription */}
        {(isListening || transcription || isProcessing) && (
          <div className="p-4 bg-muted/20 rounded-lg border border-border/50 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {isProcessing ? 'AI Processing' : 'Live Transcription'}
              </span>
              {confidence > 0 && !isProcessing && (
                <span className="text-xs text-primary">Confidence: {confidence}%</span>
              )}
            </div>
            <div className="min-h-[40px] flex items-center">
              {isListening ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Listening...</span>
                </div>
              ) : isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">Processing with GPT...</span>
                </div>
              ) : (
                <p className="text-sm text-foreground">{transcription}</p>
              )}
            </div>
          </div>
        )}

        {/* API Status */}
        <div className="text-xs text-muted-foreground text-center">
          {import.meta.env?.VITE_OPENAI_API_KEY ? 
            '🟢 OpenAI API Connected' : '🔴 OpenAI API Key Required - Check .env file'
          }
        </div>
      </div>
      {/* Conversation History */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Conversation History</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConversationHistory([])}
            iconName="Trash2"
            iconSize={14}
          >
            Clear
          </Button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {conversationHistory?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted/20 border border-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={message?.type === 'user' ? 'User' : 'Brain'} 
                      size={14} 
                      className={message?.type === 'user' ? 'text-primary-foreground' : 'text-primary'}
                    />
                    <span className="text-xs font-medium">
                      {message?.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-70">{message?.confidence}%</span>
                    <span className="text-xs opacity-70">{formatTime(message?.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-line">{message?.content}</p>
                
                {/* Show trade recommendations if available */}
                {message?.metadata?.trade_recommendation && (
                  <div className="mt-2 p-2 bg-background/20 rounded border border-border/30">
                    <div className="text-xs font-medium mb-1">Trade Recommendation:</div>
                    <div className="text-xs space-y-1">
                      <div>Symbol: {message?.metadata?.trade_recommendation?.symbol}</div>
                      <div>Direction: {message?.metadata?.trade_recommendation?.direction}</div>
                      <div>Entry: ${message?.metadata?.trade_recommendation?.entry_price}</div>
                      <div>Stop Loss: ${message?.metadata?.trade_recommendation?.stop_loss}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Commands */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Commands</h3>
          <Icon name="Zap" size={16} className="text-primary" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {mockVoiceCommands?.slice(0, 6)?.map((command, index) => (
            <button
              key={index}
              onClick={() => handleQuickCommand(command)}
              disabled={isProcessing}
              className="p-2 text-xs text-left text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-md transition-colors border border-border/50 disabled:opacity-50"
            >
              "{command}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInteractionPanel;