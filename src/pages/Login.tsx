
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm 
        onToggleMode={() => setIsSignup(!isSignup)}
        isSignup={isSignup}
      />
    </div>
  );
};

export default Login;
