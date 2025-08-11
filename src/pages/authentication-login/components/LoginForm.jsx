import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Mock credentials for authentication
  const mockCredentials = {
    email: 'alex.thompson@gpttrading.com',
    password: 'TradingAI2024!',
    twoFactorCode: '123456'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (twoFactorRequired && !twoFactorCode) {
      newErrors.twoFactorCode = 'Two-factor authentication code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check credentials
      if (formData?.email !== mockCredentials?.email || formData?.password !== mockCredentials?.password) {
        setErrors({ 
          general: 'Invalid email or password. Please use: alex.thompson@gpttrading.com / TradingAI2024!' 
        });
        setLoading(false);
        return;
      }
      
      // If 2FA is not yet required, trigger it
      if (!twoFactorRequired) {
        setTwoFactorRequired(true);
        setLoading(false);
        return;
      }
      
      // Validate 2FA code
      if (twoFactorCode !== mockCredentials?.twoFactorCode) {
        setErrors({ 
          twoFactorCode: 'Invalid code. Please use: 123456' 
        });
        setLoading(false);
        return;
      }
      
      // Success - redirect to dashboard
      navigate('/main-trading-dashboard');
      
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/main-trading-dashboard');
    }, 2000);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl mx-auto mb-4">
            <Icon name="TrendingUp" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your GPT Trading account</p>
        </div>

        {/* Error Message */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <span className="text-sm text-destructive">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!twoFactorRequired ? (
            <>
              {/* Email Input */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleInputChange}
                error={errors?.email}
                required
              />

              {/* Password Input */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={errors?.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  name="rememberMe"
                  checked={formData?.rememberMe}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            /* Two-Factor Authentication */
            (<div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              <Input
                label="Authentication Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e?.target?.value)}
                error={errors?.twoFactorCode}
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setTwoFactorRequired(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to login
              </button>
            </div>)
          )}

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={loading}
            iconName="LogIn"
            iconPosition="right"
          >
            {twoFactorRequired ? 'Verify & Sign In' : 'Sign In'}
          </Button>
        </form>

        {/* Biometric Authentication */}
        {!twoFactorRequired && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleBiometricAuth}
                iconName="Fingerprint"
                iconPosition="left"
              >
                Touch ID
              </Button>
              <Button
                variant="outline"
                onClick={handleBiometricAuth}
                iconName="Scan"
                iconPosition="left"
              >
                Face ID
              </Button>
            </div>
          </div>
        )}

        {/* Create Account */}
        {!twoFactorRequired && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={handleCreateAccount}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;