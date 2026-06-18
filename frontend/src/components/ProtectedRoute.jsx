import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-clinic-600 animate-infinite" />
        <span className="text-sm font-medium text-slate-500">Validating clinic session details...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // If authenticated but role not allowed, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
