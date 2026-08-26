import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { FloatingAI } from './components/FloatingAI';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import BudgetPlanner from './pages/BudgetPlanner';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import PackingAssistant from './pages/PackingAssistant';
import Weather from './pages/Weather';
import TravelJournal from './pages/TravelJournal';
import SafetyCenter from './pages/SafetyCenter';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

// Route Protection Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-sm font-semibold tracking-wider text-textSecondary uppercase font-sora animate-pulse">
          Syncing with Atlas...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Layout Wrapper
const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Hide navigation on landing and auth pages
  const hideShell = ['/', '/auth'].includes(location.pathname);

  return (
    <div className="min-h-screen flex bg-background">
      {!hideShell && <Sidebar />}
      
      <main className={`flex-1 min-h-screen pb-20 lg:pb-6 ${!hideShell ? 'lg:pl-64' : ''}`}>
        <div className={!hideShell ? 'max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
            <Route path="/hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
            <Route path="/restaurants" element={<ProtectedRoute><Restaurants /></ProtectedRoute>} />
            <Route path="/packing" element={<ProtectedRoute><PackingAssistant /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><TravelJournal /></ProtectedRoute>} />
            <Route path="/safety" element={<ProtectedRoute><SafetyCenter /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Fallback redirection */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
          </Routes>
        </div>
      </main>

      {!hideShell && <BottomNav />}
      {!hideShell && <FloatingAI />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#161B33',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
export default App;
