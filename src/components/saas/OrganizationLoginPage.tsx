
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { OrganizationUserAuth } from './OrganizationUserAuth';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Loader2 } from 'lucide-react';

export function OrganizationLoginPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { organizations, loading } = useOrganizations();
  const [targetOrganization, setTargetOrganization] = useState(null);

  useEffect(() => {
    if (!loading && organizations.length > 0 && orgSlug) {
      const org = organizations.find(o => o.slug === orgSlug);
      setTargetOrganization(org);
    }
  }, [organizations, loading, orgSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!targetOrganization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600 mb-4">
            The organization "{orgSlug}" could not be found.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-noorcom-600 text-white py-2 px-4 rounded hover:bg-noorcom-700 transition-colors"
          >
            Go to Main Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{targetOrganization.name}</h1>
          <p className="text-gray-600">Fleet Management System</p>
        </div>
        <OrganizationUserAuth preselectedOrg={targetOrganization} />
      </div>
    </div>
  );
}
