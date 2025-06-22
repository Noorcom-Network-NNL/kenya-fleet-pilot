
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm 
          onToggleMode={() => {}} // No longer used since signup is disabled
          isSignup={false} // Always login mode
        />
      </div>
    </div>
  );
};

export default Login;
