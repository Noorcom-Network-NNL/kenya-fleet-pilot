
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { OrganizationUserAuth } from './OrganizationUserAuth';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useOrganizationCustomization } from '@/hooks/useOrganizationCustomization';
import { Loader2 } from 'lucide-react';

export function OrganizationLoginPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { organizations, loading } = useOrganizations();
  const [targetOrganization, setTargetOrganization] = useState(null);
  const { customization } = useOrganizationCustomization(targetOrganization?.id);

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
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: customization.primaryColor ? `${customization.primaryColor}10` : undefined 
      }}
    >
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          {customization.logoUrl ? (
            <div className="flex justify-center mb-4">
              <img 
                src={customization.logoUrl} 
                alt={targetOrganization.name}
                className="h-12 w-auto"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: customization.primaryColor || '#6366f1' }}
              >
                {targetOrganization.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{targetOrganization.name}</h1>
          <p className="text-gray-600">
            {customization.welcomeMessage || 'Fleet Management System'}
          </p>
        </div>
        <OrganizationUserAuth preselectedOrg={targetOrganization} customization={customization} />
      </div>
    </div>
  );
}
