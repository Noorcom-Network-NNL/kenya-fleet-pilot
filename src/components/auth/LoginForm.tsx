
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
  isSignup: boolean;
}

export function LoginForm({ onToggleMode, isSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      console.log('Authentication successful, navigating to:', from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Authentication error:', error);
      // Error is handled in AuthContext
    }
    setLoading(false);
  };

  // Always show login form - no signup option for security
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-md bg-noorcom-600 flex items-center justify-center text-white font-bold">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold text-noorcom-800">Noorcom</h1>
            <p className="text-xs text-gray-500">Fleet Management</p>
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <p className="text-gray-600">
          Sign in to your fleet management account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-noorcom-600 hover:bg-noorcom-700"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Account Access</p>
                <p>New accounts must be created by your organization administrator. Contact your admin to get access.</p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
