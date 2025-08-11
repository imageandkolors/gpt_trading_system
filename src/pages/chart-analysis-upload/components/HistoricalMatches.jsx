import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HistoricalMatches = ({ matches }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [sortBy, setSortBy] = useState('similarity');

  const mockMatches = matches || [
    {
      id: 1,
      symbol: 'BTCUSD',
      date: '2024-01-15',
      timeframe: '4H',
      similarity: 94,
      pattern: 'Bullish Engulfing',
      outcome: 'profitable',
      priceMove: '+12.5%',
      duration: '3 days',
      chartUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
      confidence: 89,
      entryPrice: 42500,
      exitPrice: 47800,
      maxDrawdown: '-2.1%'
    },
    {
      id: 2,
      symbol: 'ETHUSD',
      date: '2024-02-08',
      timeframe: '4H',
      similarity: 87,
      pattern: 'VWAP Rejection',
      outcome: 'profitable',
      priceMove: '+8.3%',
      duration: '2 days',
      chartUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=200&fit=crop',
      confidence: 82,
      entryPrice: 2650,
      exitPrice: 2870,
      maxDrawdown: '-1.5%'
    },
    {
      id: 3,
      symbol: 'BTCUSD',
      date: '2024-03-22',
      timeframe: '4H',
      similarity: 82,
      pattern: 'Bullish Engulfing',
      outcome: 'loss',
      priceMove: '-5.2%',
      duration: '1 day',
      chartUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=200&fit=crop',
      confidence: 76,
      entryPrice: 68500,
      exitPrice: 64900,
      maxDrawdown: '-7.8%'
    },
    {
      id: 4,
      symbol: 'SOLUSD',
      date: '2024-04-10',
      timeframe: '4H',
      similarity: 79,
      pattern: 'Support Bounce',
      outcome: 'profitable',
      priceMove: '+15.7%',
      duration: '4 days',
      chartUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',
      confidence: 85,
      entryPrice: 145,
      exitPrice: 168,
      maxDrawdown: '-3.2%'
    }
  ];

  const sortedMatches = [...mockMatches]?.sort((a, b) => {
    switch (sortBy) {
      case 'similarity':
        return b?.similarity - a?.similarity;
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'performance':
        return parseFloat(b?.priceMove) - parseFloat(a?.priceMove);
      default:
        return 0;
    }
  });

  const getOutcomeColor = (outcome) => {
    return outcome === 'profitable' ? 'text-accent' : 'text-destructive';
  };

  const getOutcomeIcon = (outcome) => {
    return outcome === 'profitable' ? 'TrendingUp' : 'TrendingDown';
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 90) return 'text-accent';
    if (similarity >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Historical Pattern Matches</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
            >
              <option value="similarity">Similarity</option>
              <option value="date">Date</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Profitable: {mockMatches?.filter(m => m?.outcome === 'profitable')?.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span className="text-muted-foreground">Loss: {mockMatches?.filter(m => m?.outcome === 'loss')?.length}</span>
          </div>
        </div>
      </div>
      {/* Matches List */}
      <div className="p-6">
        <div className="space-y-4">
          {sortedMatches?.map((match) => (
            <div
              key={match?.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedMatch?.id === match?.id
                  ? 'border-primary bg-primary/5' :'border-border bg-background hover:bg-muted/20'
              }`}
              onClick={() => setSelectedMatch(selectedMatch?.id === match?.id ? null : match)}
            >
              <div className="flex items-center space-x-4">
                {/* Chart Thumbnail */}
                <div className="w-20 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src={match?.chartUrl}
                    alt={`${match?.symbol} chart`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-foreground">{match?.symbol}</span>
                      <span className="text-sm text-muted-foreground">{match?.timeframe}</span>
                      <span className="text-sm text-muted-foreground">{match?.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Icon name={getOutcomeIcon(match?.outcome)} size={16} className={getOutcomeColor(match?.outcome)} />
                        <span className={`text-sm font-medium ${getOutcomeColor(match?.outcome)}`}>
                          {match?.priceMove}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Target" size={16} className={getSimilarityColor(match?.similarity)} />
                        <span className={`text-sm font-medium ${getSimilarityColor(match?.similarity)}`}>
                          {match?.similarity}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Pattern: {match?.pattern}</span>
                    <span>Duration: {match?.duration}</span>
                    <span>Confidence: {match?.confidence}%</span>
                  </div>
                </div>
                
                <Icon 
                  name={selectedMatch?.id === match?.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-muted-foreground" 
                />
              </div>
              
              {/* Expanded Details */}
              {selectedMatch?.id === match?.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Entry Price</span>
                      <p className="text-sm font-mono text-foreground">
                        ${match?.entryPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Exit Price</span>
                      <p className="text-sm font-mono text-foreground">
                        ${match?.exitPrice?.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Max Drawdown</span>
                      <p className="text-sm font-mono text-destructive">
                        {match?.maxDrawdown}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Pattern Match</span>
                      <p className="text-sm text-foreground">
                        {match?.pattern}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      iconSize={14}
                    >
                      View Full Chart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Copy Setup
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            iconName="MoreHorizontal"
            iconPosition="left"
            iconSize={16}
          >
            Load More Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalMatches;