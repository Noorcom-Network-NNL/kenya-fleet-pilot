import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Plus, Zap } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface QuickSetupData {
  orgName: string;
  subdomain: string;
  plan: 'free' | 'basic' | 'premium';
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

const quickPlans = [
  { id: 'free', name: 'Starter (Free)', vehicles: 5, users: 3 },
  { id: 'basic', name: 'Professional ($49/mo)', vehicles: 25, users: 10 },
  { id: 'premium', name: 'Business ($99/mo)', vehicles: 100, users: 25 }
];

export function QuickOrgSetup() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuickSetupData>({
    orgName: '',
    subdomain: '',
    plan: 'free',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  const { createOrganization } = useOrganizations();
  const { login } = useAuth();
  const { toast } = useToast();

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20);
  };

  const handleOrgNameChange = (name: string) => {
    setData(prev => ({
      ...prev,
      orgName: name,
      subdomain: generateSubdomain(name)
    }));
  };

  const isValid = () => {
    return data.orgName && 
           data.subdomain && 
           data.adminName && 
           data.adminEmail && 
           data.adminPassword.length >= 6;
  };

  const handleCreate = async () => {
    if (!isValid()) return;

    setLoading(true);
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.adminEmail, data.adminPassword);
      
      const selectedPlan = quickPlans.find(p => p.id === data.plan)!;
      
      // Create organization
      await createOrganization({
        name: data.orgName,
        slug: data.subdomain,
        subscriptionTier: data.plan,
        subscriptionStatus: data.plan === 'free' ? 'trial' : 'active',
        maxVehicles: selectedPlan.vehicles,
        maxUsers: selectedPlan.users,
        features: data.plan === 'free' ? ['basic_tracking'] : ['advanced_tracking', 'reports', 'maintenance']
      });

      // Login the user
      await login(data.adminEmail, data.adminPassword);

      toast({
        title: "Organization Created!",
        description: `${data.orgName} is ready! Access it at ${data.subdomain}.noorcomfleet.com`,
      });

      setOpen(false);
      setData({
        orgName: '',
        subdomain: '',
        plan: 'free',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
      });

    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Quick Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Quick Organization Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Organization Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Organization Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quickOrgName">Organization Name</Label>
                  <Input
                    id="quickOrgName"
                    value={data.orgName}
                    onChange={(e) => handleOrgNameChange(e.target.value)}
                    placeholder="ABC Fleet Co"
                  />
                </div>
                
                <div>
                  <Label htmlFor="quickSubdomain">Fleet URL</Label>
                  <div className="flex">
                    <Input
                      id="quickSubdomain"
                      value={data.subdomain}
                      onChange={(e) => setData({...data, subdomain: e.target.value.toLowerCase()})}
                      placeholder="abc-fleet"
                      className="rounded-r-none"
                    />
                    <div className="bg-muted px-2 py-2 border border-l-0 rounded-r-md text-xs">
                      .noorcomfleet.com
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Plan</Label>
                <Select onValueChange={(value) => setData({...data, plan: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {quickPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.vehicles} vehicles, {plan.users} users
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Admin User */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Admin User</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="quickAdminName">Full Name</Label>
                  <Input
                    id="quickAdminName"
                    value={data.adminName}
                    onChange={(e) => setData({...data, adminName: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quickAdminEmail">Email</Label>
                    <Input
                      id="quickAdminEmail"
                      type="email"
                      value={data.adminEmail}
                      onChange={(e) => setData({...data, adminEmail: e.target.value})}
                      placeholder="admin@company.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quickAdminPassword">Password</Label>
                    <Input
                      id="quickAdminPassword"
                      type="password"
                      value={data.adminPassword}
                      onChange={(e) => setData({...data, adminPassword: e.target.value})}
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!isValid() || loading}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}