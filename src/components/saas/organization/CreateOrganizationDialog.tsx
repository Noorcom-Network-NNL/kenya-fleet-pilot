
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Plus, Eye, EyeOff } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface CreateOrganizationDialogProps {
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
}

export function CreateOrganizationDialog({
  showCreateDialog,
  setShowCreateDialog
}: CreateOrganizationDialogProps) {
  const { createOrganization } = useOrganizations();
  const { addUser } = useFirebaseUsers();
  const { toast } = useToast();
  const [newOrgName, setNewOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including the admin password",
        variant: "destructive",
      });
      return;
    }

    if (adminPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password should be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const slug = newOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const orgId = await createOrganization({
        name: newOrgName,
        slug,
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management']
      });
      
      if (orgId) {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
          
          const adminUserData = {
            name: adminName,
            email: adminEmail,
            role: 'Fleet Admin' as const,
            status: 'active' as const,
            lastLogin: 'Never',
            organizationId: orgId
          };
          
          await addUser(adminUserData);
          
          toast({
            title: "Organization Created",
            description: `${newOrgName} created successfully! Admin can now log in at /${slug}/login`,
          });
        } catch (authError: any) {
          console.error('Error creating admin user:', authError);
          let errorMessage = "Failed to create admin user";
          
          if (authError.code === 'auth/email-already-in-use') {
            errorMessage = "This email address is already registered.";
          } else if (authError.code === 'auth/weak-password') {
            errorMessage = "Password should be at least 6 characters long.";
          } else if (authError.code === 'auth/invalid-email') {
            errorMessage = "Please enter a valid email address.";
          }
          
          toast({
            title: "Error Creating Admin User",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
      
      setNewOrgName('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Default Admin User</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Enter admin full name"
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@company.com"
                />
              </div>

              <div>
                <Label htmlFor="adminPassword">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This user will be able to log in at /{newOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/login
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrganization} 
              disabled={!newOrgName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword.trim() || loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
