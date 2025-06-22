
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { Loader2, Building, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function OrganizationUserAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { organizations } = useOrganizations();
  const { users } = useFirebaseUsers();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get users for the selected organization
  const orgUsers = users.filter(user => user.organizationId === selectedOrgId);
  const selectedUser = orgUsers.find(user => user.email === email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !selectedOrgId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check if user exists in the selected organization
    if (!selectedUser) {
      toast({
        title: "User Not Found",
        description: "This email address is not registered with the selected organization. Please contact your administrator.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled in AuthContext
    }
    setLoading(false);
  };

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
        <CardTitle className="text-2xl">Organization Login</CardTitle>
        <p className="text-gray-600">
          Select your organization and sign in to access your fleet
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select onValueChange={setSelectedOrgId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your organization">
                  {selectedOrgId && organizations.find(org => org.id === selectedOrgId) && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {organizations.find(org => org.id === selectedOrgId)?.name}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {org.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            {selectedOrgId && email && !selectedUser && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>This email is not registered with the selected organization</span>
              </div>
            )}
            {selectedUser && (
              <p className="text-sm text-green-600">
                Found: {selectedUser.name} ({selectedUser.role})
              </p>
            )}
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
            disabled={loading || !selectedUser}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
