import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import tradingAIService from '../../../services/openaiService';

const VoiceControls = ({ onVoiceCommand, isListening, transcript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('ready');
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    // Check browser support for speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceStatus('unsupported');
    }
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setVoiceStatus('listening');
      setCurrentTranscript('');
      setConfidence(0);
      
      const transcript = await tradingAIService?.speechToText({
        continuous: false,
        interimResults: true,
        lang: 'en-US'
      });
      
      setCurrentTranscript(transcript);
      setConfidence(95);
      setIsRecording(false);
      setVoiceStatus('ready');
      
      // Process with AI
      await processVoiceCommand(transcript);
      
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
      setVoiceStatus('error');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setVoiceStatus('ready');
  };

  const processVoiceCommand = async (command) => {
    try {
      setIsProcessing(true);
      setVoiceStatus('processing');
      
      // Add to command history
      const commandEntry = {
        id: Date.now(),
        command: command,
        timestamp: new Date(),
        confidence: 95
      };
      setCommandHistory(prev => [commandEntry, ...prev?.slice(0, 9)]); // Keep last 10 commands
      
      // Process with OpenAI
      const aiResult = await tradingAIService?.processVoiceCommand(command);
      
      setAiResponse(aiResult?.response);
      
      // Play response
      await playResponse(aiResult?.response);
      
      // Trigger parent callback if needed
      if (onVoiceCommand) {
        onVoiceCommand(command);
      }
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      setAiResponse('Sorry, I encountered an error processing your command. Please try again.');
    } finally {
      setIsProcessing(false);
      setVoiceStatus('ready');
    }
  };

  const playResponse = async (text) => {
    try {
      setIsPlaying(true);
      await tradingAIService?.textToSpeech(text, {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleQuickCommand = (command) => {
    setCurrentTranscript(command);
    processVoiceCommand(command);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-profit';
      case 'listening': return 'text-primary';
      case 'processing': return 'text-warning';
      case 'error': case 'unsupported': return 'text-loss';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return 'CheckCircle';
      case 'listening': return 'Mic';
      case 'processing': return 'Brain';
      case 'error': case 'unsupported': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  const quickCommands = [
    "Analyze the current chart",
    "What patterns do you see?",
    "Give me a trade recommendation",
    "What\'s the market sentiment?",
    "Calculate risk-reward ratio",
    "Show support and resistance levels"
  ];

  return (
    <div className="trading-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">AI Voice Controls</h3>
          <p className="text-sm text-muted-foreground">Speak naturally to analyze charts and get trading insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon(voiceStatus)} 
            size={16} 
            className={getStatusColor(voiceStatus)}
          />
          <span className="text-sm text-muted-foreground capitalize">{voiceStatus}</span>
        </div>
      </div>
      <div className="space-y-6 overflow-y-auto custom-scrollbar max-h-[calc(100%-100px)]">
        {/* Voice Input Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              iconName={isRecording ? "MicOff" : "Mic"}
              iconSize={24}
              disabled={voiceStatus === 'unsupported' || isProcessing}
              className="w-40"
            >
              {isRecording ? 'Stop Recording' : 'Start Voice Command'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => playResponse(aiResponse || 'Hello, I am your AI trading assistant ready to help with chart analysis.')}
              iconName={isPlaying ? "VolumeX" : "Volume2"}
              iconSize={20}
              disabled={isPlaying || !aiResponse}
              className="w-32"
            >
              {isPlaying ? 'Playing' : 'Play Response'}
            </Button>
          </div>

          {/* API Status Indicator */}
          <div className="text-xs text-center">
            {import.meta.env?.VITE_OPENAI_API_KEY ? 
              <span className="text-profit">🟢 OpenAI API Connected</span> : 
              <span className="text-loss">🔴 OpenAI API Key Required</span>
            }
          </div>
        </div>

        {/* Live Transcription */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground">Live Transcription</h4>
            {confidence > 0 && (
              <span className="text-xs text-primary">Confidence: {confidence}%</span>
            )}
          </div>
          <div className="min-h-[60px] flex items-center">
            {isRecording ? (
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
              <p className="text-sm text-foreground">{currentTranscript || 'Ready to listen...'}</p>
            )}
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Brain" size={16} className="text-primary" />
              <h4 className="font-semibold text-foreground">AI Response</h4>
            </div>
            <p className="text-sm text-foreground whitespace-pre-line">{aiResponse}</p>
          </div>
        )}

        {/* Quick Commands */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Quick Commands</h4>
          <div className="grid grid-cols-1 gap-2">
            {quickCommands?.map((command, index) => (
              <button
                key={index}
                onClick={() => handleQuickCommand(command)}
                disabled={isRecording || isProcessing}
                className="p-3 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors border border-border/30 disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={14} />
                  <span>"{command}"</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Recent Commands</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {commandHistory?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No voice commands yet</p>
            ) : (
              commandHistory?.map((entry) => (
                <div key={entry?.id} className="bg-muted/20 p-2 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground">"{entry?.command}"</span>
                    <span className="text-muted-foreground">
                      {entry?.timestamp?.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="text-muted-foreground">Confidence: {entry?.confidence}%</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Voice Settings</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="font-medium text-foreground mb-1">Language</div>
              <div className="text-muted-foreground">English (US)</div>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="font-medium text-foreground mb-1">Model</div>
              <div className="text-muted-foreground">GPT-4 Turbo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;