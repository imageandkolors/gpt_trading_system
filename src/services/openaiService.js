import OpenAI from 'openai';

/**
 * Initialize OpenAI client with API key from environment variables
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Trading-specific AI assistant for market analysis and decision making
 */
class TradingAIService {
  constructor() {
    this.systemPrompt = `You are an expert trading AI assistant with deep knowledge of technical analysis, market patterns, and risk management. 
    
Your capabilities include:
- Analyzing trading charts and identifying patterns
- Providing confidence-based trading recommendations
- Explaining technical analysis in clear, actionable terms
- Calculating risk/reward ratios and position sizing
- Monitoring market conditions and providing real-time insights

Always provide structured responses with confidence scores and clear reasoning. 
Be conservative with risk and always emphasize proper risk management principles.`;
  }

  /**
   * Process voice commands for trading operations
   * @param {string} voiceInput - The user's voice input
   * @returns {Promise<Object>} Structured response with AI analysis
   */
  async processVoiceCommand(voiceInput) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { 
            role: 'user', 
            content: `Voice command: "${voiceInput}". Provide a trading assistant response.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'trading_voice_response',
            schema: {
              type: 'object',
              properties: {
                response: { type: 'string' },
                confidence: { type: 'number' },
                action_required: { type: 'boolean' },
                trade_recommendation: {
                  type: 'object',
                  properties: {
                    symbol: { type: 'string' },
                    direction: { type: 'string' },
                    entry_price: { type: 'number' },
                    stop_loss: { type: 'number' },
                    take_profit: { type: 'array', items: { type: 'number' } },
                    risk_reward_ratio: { type: 'number' }
                  }
                },
                market_analysis: {
                  type: 'object',
                  properties: {
                    trend: { type: 'string' },
                    volatility: { type: 'string' },
                    sentiment: { type: 'string' }
                  }
                }
              },
              required: ['response', 'confidence', 'action_required'],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.3,
        max_tokens: 1000,
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw new Error('Failed to process voice command');
    }
  }

  /**
   * Analyze uploaded chart images using OpenAI Vision API
   * @param {string} imageUrl - URL or base64 data of the chart image
   * @returns {Promise<Object>} Detailed chart analysis
   */
  async analyzeChartImage(imageUrl) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert technical analyst. Analyze trading charts and identify:
            - Chart patterns (engulfing, doji, hammer, etc.)
            - Support/resistance levels
            - Trend direction and strength
            - Technical indicators (VWAP, EMA, RSI if visible)
            - Trading opportunities with confidence scores
            
            Provide structured analysis with specific entry/exit levels and risk management recommendations.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this trading chart and provide detailed technical analysis with trading recommendations.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'chart_analysis_response',
            schema: {
              type: 'object',
              properties: {
                symbol: { type: 'string' },
                timeframe: { type: 'string' },
                trend_direction: { type: 'string' },
                patterns_detected: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      confidence: { type: 'number' },
                      description: { type: 'string' },
                      bullish: { type: 'boolean' }
                    }
                  }
                },
                support_resistance: {
                  type: 'object',
                  properties: {
                    support_levels: { type: 'array', items: { type: 'number' } },
                    resistance_levels: { type: 'array', items: { type: 'number' } }
                  }
                },
                trade_setup: {
                  type: 'object',
                  properties: {
                    setup_type: { type: 'string' },
                    entry_zone: { type: 'number' },
                    stop_loss: { type: 'number' },
                    take_profit_1: { type: 'number' },
                    take_profit_2: { type: 'number' },
                    risk_reward: { type: 'number' },
                    confidence: { type: 'number' }
                  }
                },
                overall_bias: { type: 'string' },
                risk_assessment: { type: 'string' }
              },
              required: ['symbol', 'timeframe', 'trend_direction', 'patterns_detected', 'overall_bias'],
              additionalProperties: false,
            },
          },
        },
        max_tokens: 1500,
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error analyzing chart image:', error);
      throw new Error('Failed to analyze chart image');
    }
  }

  /**
   * Generate market analysis and trade validation
   * @param {Object} marketData - Current market data
   * @param {Object} tradeParams - Proposed trade parameters
   * @returns {Promise<Object>} Trade validation and analysis
   */
  async validateTradeSetup(marketData, tradeParams) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: `Validate this trade setup:
            
            Market Data: ${JSON.stringify(marketData)}
            Trade Parameters: ${JSON.stringify(tradeParams)}
            
            Provide detailed validation with confidence scores and risk assessment.`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'trade_validation_response',
            schema: {
              type: 'object',
              properties: {
                validation_result: { type: 'string' },
                confidence_primary: { type: 'number' },
                confidence_opposite: { type: 'number' },
                risk_level: { type: 'string' },
                recommended_position_size: { type: 'number' },
                key_factors: { type: 'array', items: { type: 'string' } },
                warnings: { type: 'array', items: { type: 'string' } },
                approval_status: { type: 'boolean' },
                reasoning: { type: 'string' }
              },
              required: ['validation_result', 'confidence_primary', 'confidence_opposite', 'approval_status'],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.2,
        max_tokens: 800,
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error validating trade setup:', error);
      throw new Error('Failed to validate trade setup');
    }
  }

  /**
   * Generate real-time market commentary
   * @param {string} query - Market query or request
   * @returns {Promise<string>} AI-generated market commentary
   */
  async getMarketCommentary(query) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4.1',
        messages: [
          { 
            role: 'system', 
            content: `You are a professional trading analyst providing real-time market commentary. 
            Be concise, accurate, and actionable. Focus on current market conditions and trading opportunities.` 
          },
          { role: 'user', content: query },
        ],
        temperature: 0.4,
        max_tokens: 300,
      });

      return response?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error('Error generating market commentary:', error);
      throw new Error('Failed to generate market commentary');
    }
  }

  /**
   * Convert text to speech using browser's SpeechSynthesis API
   * @param {string} text - Text to convert to speech
   * @param {Object} options - Voice options
   */
  async textToSpeech(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Convert speech to text using browser's SpeechRecognition API
   * @param {Object} options - Recognition options
   * @returns {Promise<string>} Transcribed text
   */
  async speechToText(options = {}) {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || true;
      recognition.lang = options.lang || 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        resolve(transcript);
      };

      recognition.onerror = (error) => reject(error);
      recognition.onend = () => {
        if (!options.continuous) {
          recognition.stop();
        }
      };

      recognition.start();
    });
  }
}

// Export singleton instance
const tradingAIService = new TradingAIService();
export default tradingAIService;

// Export individual functions for direct use
export const {
  processVoiceCommand,
  analyzeChartImage,
  validateTradeSetup,
  getMarketCommentary,
  textToSpeech,
  speechToText
} = tradingAIService;