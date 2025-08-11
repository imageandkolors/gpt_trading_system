import React from 'react';
import LoginForm from './components/LoginForm';
import MarketTicker from './components/MarketTicker';
import TrustSignals from './components/TrustSignals';
import BackgroundAnimation from './components/BackgroundAnimation';

const AuthenticationLogin = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Login Form Section */}
              <div className="order-2 lg:order-1">
                <LoginForm />
              </div>
              
              {/* Trust Signals Section */}
              <div className="order-1 lg:order-2 hidden lg:block">
                <div className="max-w-md mx-auto">
                  <TrustSignals />
                </div>
              </div>
            </div>
            
            {/* Mobile Trust Signals */}
            <div className="lg:hidden mt-12">
              <div className="max-w-md mx-auto">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Market Ticker */}
        <MarketTicker />
      </div>
      
      {/* Mobile Market Status Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-online rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Markets Open</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-foreground">
              SPY <span className="text-profit">+0.53%</span>
            </div>
            <div className="text-foreground">
              QQQ <span className="text-loss">-0.38%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLogin;