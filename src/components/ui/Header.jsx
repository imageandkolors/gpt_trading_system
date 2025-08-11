import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    broker: 'online',
    dataFeed: 'online',
    ai: 'online'
  });
  const profileRef = useRef(null);
  const emergencyRef = useRef(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/main-trading-dashboard', icon: 'BarChart3' },
    { label: 'Voice Trading', path: '/voice-trading-interface', icon: 'Mic' },
    { label: 'Live Execution', path: '/live-trading-execution', icon: 'TrendingUp' },
    { label: 'Chart Analysis', path: '/chart-analysis-upload', icon: 'LineChart' },
    { label: 'Portfolio', path: '/portfolio-performance-analytics', icon: 'PieChart' }
  ];

  const userProfile = {
    name: 'Alex Thompson',
    email: 'alex.thompson@gpttrading.com',
    role: 'Senior Trader',
    avatar: '/assets/images/avatar.png'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
      if (emergencyRef?.current && !emergencyRef?.current?.contains(event?.target)) {
        setIsEmergencyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleEmergencyStop = () => {
    console.log('Emergency stop activated');
    setIsEmergencyOpen(false);
  };

  const handleLogout = () => {
    navigate('/authentication-login');
    setIsProfileOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-online';
      case 'offline': return 'text-offline';
      case 'pending': return 'text-pending';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'offline': return 'XCircle';
      case 'pending': return 'Clock';
      default: return 'AlertCircle';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">GPT Trading</span>
            <span className="text-xs text-muted-foreground">System</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon 
                name={getStatusIcon(systemStatus?.broker)} 
                size={14} 
                className={getStatusColor(systemStatus?.broker)}
              />
              <span className="text-xs text-muted-foreground">Broker</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getStatusIcon(systemStatus?.dataFeed)} 
                size={14} 
                className={getStatusColor(systemStatus?.dataFeed)}
              />
              <span className="text-xs text-muted-foreground">Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getStatusIcon(systemStatus?.ai)} 
                size={14} 
                className={getStatusColor(systemStatus?.ai)}
              />
              <span className="text-xs text-muted-foreground">AI</span>
            </div>
          </div>

          {/* Emergency Controls */}
          <div className="relative" ref={emergencyRef}>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
              iconName="AlertTriangle"
              iconSize={16}
            >
              Emergency
            </Button>
            
            {isEmergencyOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-60 animate-fade-in">
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Emergency Controls</span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      fullWidth
                      onClick={handleEmergencyStop}
                      iconName="Square"
                      iconSize={14}
                    >
                      Stop All Trades
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => console.log('Close all positions')}
                      iconName="X"
                      iconSize={14}
                    >
                      Close Positions
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {userProfile?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-60 animate-fade-in">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {userProfile?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{userProfile?.name}</p>
                      <p className="text-xs text-muted-foreground">{userProfile?.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => console.log('Account settings')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => console.log('Trading preferences')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                  >
                    <Icon name="Sliders" size={16} />
                    <span>Trading Preferences</span>
                  </button>
                  <button
                    onClick={() => console.log('Security')}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                  >
                    <Icon name="Shield" size={16} />
                    <span>Security</span>
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;