import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1a2b4a] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
