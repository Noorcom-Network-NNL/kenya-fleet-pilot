import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

export function OrganizationRedirect() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  
  // Redirect /demo to /demo/login
  if (orgSlug) {
    return <Navigate to={`/${orgSlug}/login`} replace />;
  }
  
  return <Navigate to="/login" replace />;
}