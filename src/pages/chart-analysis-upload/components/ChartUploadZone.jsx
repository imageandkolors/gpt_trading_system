import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChartUploadZone = ({ onFileUpload, isProcessing, uploadedChart }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const supportedFormats = ['PNG', 'JPG', 'JPEG', 'WEBP'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    
    if (!validTypes?.includes(file?.type)) {
      throw new Error(`Unsupported file format. Please upload ${supportedFormats.join(', ')} files only.`);
    }
    
    if (file?.size > maxFileSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }
    
    return true;
  };

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    
    // Validate file type
    if (!file?.type?.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, JPEG, WEBP)');
      return;
    }
    
    // Validate file size (max 10MB for better OpenAI Vision API performance)
    if (file?.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }
    
    setUploadError(null);
    
    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e?.target?.result;
      setPreviewUrl(imageData);
      
      // Convert to format suitable for OpenAI Vision API
      const chartData = {
        file: file,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        imageData: imageData,
        timestamp: new Date()?.toISOString()
      };
      
      onFileUpload?.(chartData);
    };
    
    reader.onerror = () => {
      setUploadError('Error reading file. Please try again.');
    };
    
    reader?.readAsDataURL(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files || []);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e?.target?.files || []);
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  }, [handleFileSelect]);

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const clearUpload = () => {
    setPreviewUrl(null);
    setUploadError(null);
    onFileUpload?.(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadedChart && previewUrl && !isProcessing) {
    return (
      <div className="trading-card h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Uploaded Chart</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearUpload} iconName="X">
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={openFileDialog} iconName="Upload">
              Upload New
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {/* Chart Preview */}
          <div className="relative bg-muted/20 rounded-lg p-4 border border-border/50">
            <img 
              src={previewUrl} 
              alt="Uploaded chart" 
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            
            {/* Chart Info Overlay */}
            <div className="mt-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border/30">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File: </span>
                  <span className="text-foreground font-medium">{uploadedChart?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size: </span>
                  <span className="text-foreground font-medium">
                    {(uploadedChart?.size / 1024)?.toFixed(1)} KB
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <span className="text-foreground font-medium">{uploadedChart?.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded: </span>
                  <span className="text-foreground font-medium">
                    {new Date(uploadedChart.timestamp)?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Status */}
          <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-profit rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Chart Ready for Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Eye" size={14} className="text-primary" />
                <span>OpenAI Vision Compatible</span>
              </div>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="trading-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Upload Trading Chart</h3>
          <p className="text-sm text-muted-foreground">
            Upload your chart for AI-powered technical analysis
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Brain" size={14} className="text-primary" />
          <span>GPT-4 Vision Ready</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : uploadError
            ? 'border-destructive bg-destructive/5' :'border-border hover:border-primary hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Processing Chart</h4>
              <p className="text-sm text-muted-foreground">Preparing image for AI analysis...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {isDragOver ? 'Drop your chart here' : 'Upload Chart Image'}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to select • PNG, JPG, JPEG, WEBP • Max 10MB
              </p>
              <Button variant="outline" size="sm" iconName="Upload" iconPosition="left">
                Choose File
              </Button>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="absolute inset-x-0 bottom-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mx-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-destructive" />
                <span className="text-sm text-destructive">{uploadError}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Guidelines */}
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">For Best Results</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={14} className="text-profit" />
              <span>Clear, high-resolution images</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={14} className="text-profit" />
              <span>Visible timeframe and symbol</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={14} className="text-profit" />
              <span>Technical indicators shown</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={14} className="text-profit" />
              <span>Complete candlestick patterns</span>
            </div>
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} className="text-primary" />
            <span className="font-semibold text-foreground">AI Analysis Features</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Pattern recognition (engulfing, doji, hammer, etc.)</div>
            <div>• Support and resistance identification</div>
            <div>• Trend analysis and strength assessment</div>
            <div>• Trade setup recommendations with risk/reward ratios</div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ChartUploadZone;