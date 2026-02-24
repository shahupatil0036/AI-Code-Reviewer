import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from './context/ThemeContext';
import { ReviewProvider } from './context/ReviewContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

const hasClerkKey = CLERK_PUBLISHABLE_KEY.startsWith('pk_');

/**
 * ProtectedRoute that works with or without Clerk.
 * Without a valid Clerk key, routes are accessible directly (demo mode).
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!hasClerkKey) {
    return <>{children}</>;
  }
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AppContent: React.FC = () => (
  <ThemeProvider>
    <ReviewProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 animate-page-enter">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ScrollToTop />
        </div>
      </ToastProvider>
    </ReviewProvider>
  </ThemeProvider>
);

const App: React.FC = () => {
  // Only wrap with ClerkProvider if a valid publishable key is configured
  if (hasClerkKey) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AppContent />
      </ClerkProvider>
    );
  }

  // Demo mode — no Clerk auth, everything accessible
  return <AppContent />;
};

export default App;
