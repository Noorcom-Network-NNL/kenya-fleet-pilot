
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { OrganizationUserAuth } from '@/components/saas/OrganizationUserAuth';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [showOrgLogin, setShowOrgLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {showOrgLogin ? (
          <div className="space-y-4">
            <OrganizationUserAuth />
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setShowOrgLogin(false)}
                className="text-sm"
              >
                ← Back to regular login
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <LoginForm 
              onToggleMode={() => {}} // No longer used since signup is disabled
              isSignup={false} // Always login mode
            />
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setShowOrgLogin(true)}
                className="text-sm"
              >
                Login as organization user →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
