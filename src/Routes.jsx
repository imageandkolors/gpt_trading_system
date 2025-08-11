import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AuthenticationLogin from './pages/authentication-login';
import MainTradingDashboard from './pages/main-trading-dashboard';
import LiveTradingExecution from './pages/live-trading-execution';
import ChartAnalysisUpload from './pages/chart-analysis-upload';
import PortfolioPerformanceAnalytics from './pages/portfolio-performance-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AuthenticationLogin />} />
        <Route path="/authentication-login" element={<AuthenticationLogin />} />
        <Route path="/main-trading-dashboard" element={<MainTradingDashboard />} />
        <Route path="/live-trading-execution" element={<LiveTradingExecution />} />
        <Route path="/chart-analysis-upload" element={<ChartAnalysisUpload />} />
        <Route path="/portfolio-performance-analytics" element={<PortfolioPerformanceAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
