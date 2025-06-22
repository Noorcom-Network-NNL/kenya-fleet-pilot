
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useOrganizations } from '@/hooks/useOrganizations';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const SUPER_ADMIN_EMAIL = 'admin@noorcomfleet.co.ke';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { currentOrganization, loading: orgLoading } = useOrganizations();
  const location = useLocation();

  console.log('ProtectedRoute - authLoading:', authLoading, 'currentUser:', currentUser);
  console.log('ProtectedRoute - usersLoading:', usersLoading, 'users count:', users.length);
  console.log('ProtectedRoute - orgLoading:', orgLoading, 'currentOrganization:', currentOrganization);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is the super admin
  if (currentUser.email === SUPER_ADMIN_EMAIL) {
    console.log('Super admin detected, granting access:', currentUser.email);
    return <>{children}</>;
  }

  // Wait for users and organizations to load before making authorization decisions
  if (usersLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if user exists in any organization's user list
  const authorizedUser = users.find(user => user.email === currentUser.email);
  
  if (!authorizedUser) {
    console.log('User not found in organization users, redirecting to login');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              Your account is not authorized to access this system. Please contact your organization administrator to get proper access.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-noorcom-600 text-white py-2 px-4 rounded hover:bg-noorcom-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if user's account is active
  if (authorizedUser.status === 'inactive') {
    console.log('User account is inactive');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Inactive</h2>
            <p className="text-gray-600 mb-4">
              Your account has been deactivated. Please contact your organization administrator to reactivate your account.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-noorcom-600 text-white py-2 px-4 rounded hover:bg-noorcom-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  console.log('User authenticated and authorized:', authorizedUser);
  return <>{children}</>;
}
