import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHero from './pages/admin/AdminHero';
import AdminSobre from './pages/admin/AdminSobre';
import AdminLinks from './pages/admin/AdminLinks';
import AdminBlog from './pages/admin/AdminBlog';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminAvailability from './pages/admin/AdminAvailability';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/agendamento" element={<BookingPage />} />
      
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Pages */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/hero" element={
        <ProtectedRoute>
          <AdminHero />
        </ProtectedRoute>
      } />
      <Route path="/admin/sobre" element={
        <ProtectedRoute>
          <AdminSobre />
        </ProtectedRoute>
      } />
      <Route path="/admin/links" element={
        <ProtectedRoute>
          <AdminLinks />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog" element={
        <ProtectedRoute>
          <AdminBlog />
        </ProtectedRoute>
      } />
      <Route path="/admin/faq" element={
        <ProtectedRoute>
          <AdminFAQ />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute>
          <AdminAppointments />
        </ProtectedRoute>
      } />
      <Route path="/admin/availability" element={
        <ProtectedRoute>
          <AdminAvailability />
        </ProtectedRoute>
      } />
      <Route path="/admin/gallery" element={
        <ProtectedRoute>
          <AdminGallery />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      } />
      
      {/* 404 Page */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App