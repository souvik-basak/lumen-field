import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVenueStore } from '../../store/useVenueStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Route Guard.
 * Protects staff routes and redirects unauthorized users.
 */
export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const user = useVenueStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Save the attempted location to redirect back after login if needed
    return <Navigate to="/fan" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.email !== 'admin@stadium.com') {
    return <Navigate to="/fan" replace />;
  }

  return <>{children}</>;
}
