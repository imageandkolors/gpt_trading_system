import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Two-Factor Auth',
      description: 'Multi-layer protection'
    },
    {
      icon: 'Eye',
      title: 'Biometric Login',
      description: 'Touch ID & Face ID'
    },
    {
      icon: 'Server',
      title: 'Secure Infrastructure',
      description: 'SOC 2 Type II compliant'
    }
  ];

  const complianceBadges = [
    {
      name: 'SEC Registered',
      icon: 'CheckCircle',
      color: 'text-online'
    },
    {
      name: 'FINRA Member',
      icon: 'CheckCircle',
      color: 'text-online'
    },
    {
      name: 'SIPC Protected',
      icon: 'Shield',
      color: 'text-primary'
    },
    {
      name: 'SSL Secured',
      icon: 'Lock',
      color: 'text-accent'
    }
  ];

  const stats = [
    { label: 'Active Traders', value: '50K+' },
    { label: 'Daily Volume', value: '$2.8B' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'AI Accuracy', value: '87%' }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Enterprise Security</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
                <p className="text-xs text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Badges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Regulatory Compliance</h3>
        <div className="grid grid-cols-2 gap-3">
          {complianceBadges?.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-surface rounded-lg border border-border">
              <Icon name={badge?.icon} size={16} className={badge?.color} />
              <span className="text-sm font-medium text-foreground">{badge?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Platform Stats */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary mb-1">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Award" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Industry Recognition</span>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={12} className="text-warning" />
            <span>Best AI Trading Platform 2024</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Trophy" size={12} className="text-accent" />
            <span>FinTech Innovation Award Winner</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={12} className="text-primary" />
            <span>Trusted by 50,000+ Professional Traders</span>
          </div>
        </div>
      </div>
      {/* Footer Note */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your funds are protected by SIPC insurance up to $500,000
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          © {new Date()?.getFullYear()} GPT Trading System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;