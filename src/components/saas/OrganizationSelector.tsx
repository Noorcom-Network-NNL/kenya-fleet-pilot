
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Plus } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';

export function OrganizationSelector() {
  const { organizations, currentOrganization, setCurrentOrganization, createOrganization } = useOrganizations();
  const { addUser } = useFirebaseUsers();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim() || !adminName.trim() || !adminEmail.trim()) return;

    setLoading(true);
    try {
      const slug = newOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // First create the organization
      const orgId = await createOrganization({
        name: newOrgName,
        slug,
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management']
      });
      
      // Then create the admin user for this organization
      if (orgId) {
        const adminUserData = {
          name: adminName,
          email: adminEmail,
          role: 'Fleet Admin' as const,
          status: 'active' as const,
          lastLogin: 'Never',
          organizationId: orgId
        };
        
        await addUser(adminUserData);
      }
      
      // Reset form
      setNewOrgName('');
      setAdminName('');
      setAdminEmail('');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating organization and admin user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (organizations.length === 0) {
    return (
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Create Organization
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
                  <p className="text-xs text-gray-500 mt-1">
                    This user will be able to log in and manage the fleet
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
                disabled={!newOrgName.trim() || !adminName.trim() || !adminEmail.trim() || loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={currentOrganization?.id || ''} 
        onValueChange={(value) => {
          const org = organizations.find(o => o.id === value);
          if (org) setCurrentOrganization(org);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select organization">
            {currentOrganization && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {currentOrganization.name}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
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
                  <p className="text-xs text-gray-500 mt-1">
                    This user will be able to log in and manage the fleet
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
                disabled={!newOrgName.trim() || !adminName.trim() || !adminEmail.trim() || loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
