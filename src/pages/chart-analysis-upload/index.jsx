import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ChartUploadZone from './components/ChartUploadZone';
import AnalysisResults from './components/AnalysisResults';
import VoiceControls from './components/VoiceControls';
import HistoricalMatches from './components/HistoricalMatches';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ChartAnalysisUpload = () => {
  const [uploadedChart, setUploadedChart] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [activeSection, setActiveSection] = useState('upload');

  const sections = [
    { id: 'upload', label: 'Chart Upload', icon: 'Upload' },
    { id: 'analysis', label: 'Analysis Results', icon: 'BarChart3' },
    { id: 'voice', label: 'Voice Controls', icon: 'Mic' },
    { id: 'history', label: 'Historical Matches', icon: 'History' }
  ];

  useEffect(() => {
    // Auto-switch to analysis when chart is uploaded and processed
    if (uploadedChart && !isProcessing && !isAnalyzing) {
      setActiveSection('analysis');
    }
  }, [uploadedChart, isProcessing, isAnalyzing]);

  const handleFileUpload = async (chartData) => {
    if (!chartData) {
      setUploadedChart(null);
      setAnalysisData(null);
      setActiveSection('upload');
      return;
    }

    setUploadedChart(chartData);
    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsProcessing(false);
      // Don't auto-start analyzing here, let the AnalysisResults component handle it
    }, 2000);
  };

  const handleVoiceCommand = (command) => {
    console.log('Voice command:', command);
    
    if (command === 'start_recording') {
      setIsVoiceListening(true);
      setVoiceTranscript('');
    } else if (command === 'stop_recording') {
      setIsVoiceListening(false);
    } else {
      // Handle specific voice commands
      setVoiceTranscript(command);
      
      // Auto-trigger analysis if chart is uploaded
      if (uploadedChart && command?.toLowerCase()?.includes('analyze')) {
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          setActiveSection('analysis');
        }, 2000);
      }
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new_analysis':
        setUploadedChart(null);
        setAnalysisData(null);
        setActiveSection('upload');
        break;
      case 'voice_command': setActiveSection('voice');
        break;
      case 'view_history': setActiveSection('history');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Chart Analysis & Upload</h1>
                <p className="text-muted-foreground">
                  Upload trading charts for AI-powered technical analysis and pattern recognition
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('new_analysis')}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  New Analysis
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction('voice_command')}
                  iconName="Mic"
                  iconPosition="left"
                  iconSize={16}
                >
                  Voice Command
                </Button>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${uploadedChart ? 'bg-accent' : 'bg-muted'}`}></div>
                <span className="text-muted-foreground">Chart Uploaded</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${analysisData ? 'bg-accent' : isAnalyzing ? 'bg-warning animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-muted-foreground">AI Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isVoiceListening ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-muted-foreground">Voice Ready</span>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-muted/20 p-1 rounded-lg w-fit">
              {sections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeSection === section?.id
                      ? 'text-primary bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Icon name={section?.icon} size={16} />
                  <span>{section?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Content (60% on desktop) */}
            <div className="lg:col-span-2">
              {activeSection === 'upload' && (
                <div className="h-[600px]">
                  <ChartUploadZone
                    onFileUpload={handleFileUpload}
                    isProcessing={isProcessing}
                    uploadedChart={uploadedChart}
                  />
                </div>
              )}
              
              {activeSection === 'analysis' && (
                <div className="h-[600px]">
                  <AnalysisResults
                    analysisData={analysisData}
                    isAnalyzing={isAnalyzing}
                    chartImage={uploadedChart?.imageData}
                  />
                </div>
              )}
              
              {activeSection === 'voice' && (
                <div className="h-[600px]">
                  <VoiceControls
                    onVoiceCommand={handleVoiceCommand}
                    isListening={isVoiceListening}
                    transcript={voiceTranscript}
                  />
                </div>
              )}
              
              {activeSection === 'history' && (
                <div className="h-[600px] overflow-hidden">
                  <HistoricalMatches matches={[]} />
                </div>
              )}
            </div>

            {/* Secondary Content (40% on desktop) */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Analysis Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Charts Analyzed Today</span>
                    <span className="text-lg font-semibold text-foreground">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-lg font-semibold text-accent">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Confidence</span>
                    <span className="text-lg font-semibold text-primary">82%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing Time</span>
                    <span className="text-lg font-semibold text-foreground">2.3s</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Chart analyzed', symbol: 'BTCUSD', time: '2 min ago', status: 'success' },
                    { action: 'Pattern detected', symbol: 'ETHUSD', time: '15 min ago', status: 'success' },
                    { action: 'Voice command', symbol: 'SOLUSD', time: '32 min ago', status: 'info' },
                    { action: 'Analysis failed', symbol: 'ADAUSD', time: '1 hour ago', status: 'error' }
                  ]?.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background/50">
                      <div className={`w-2 h-2 rounded-full ${
                        activity?.status === 'success' ? 'bg-accent' :
                        activity?.status === 'error'? 'bg-destructive' : 'bg-primary'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity?.action}</p>
                        <p className="text-xs text-muted-foreground">{activity?.symbol} • {activity?.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleQuickAction('new_analysis')}
                    iconName="Upload"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Upload New Chart
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleQuickAction('voice_command')}
                    iconName="Mic"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Start Voice Analysis
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleQuickAction('view_history')}
                    iconName="History"
                    iconPosition="left"
                    iconSize={16}
                  >
                    View Pattern History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChartAnalysisUpload;