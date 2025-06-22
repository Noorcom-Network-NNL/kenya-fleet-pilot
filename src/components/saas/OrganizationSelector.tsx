
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Plus, Eye, EyeOff, Trash2, BarChart3, Users, Calendar } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function OrganizationSelector() {
  const { organizations, currentOrganization, setCurrentOrganization, createOrganization, deleteOrganization } = useOrganizations();
  const { addUser } = useFirebaseUsers();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);
  const [selectedOrgForMetrics, setSelectedOrgForMetrics] = useState(null);
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
      
      // Then create the Firebase Auth user and add to Firestore
      if (orgId) {
        try {
          // Create Firebase Auth user
          await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
          
          // Add user to Firestore with organization context
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
      
      // Reset form
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

  const handleDeleteOrganization = async (orgId: string, orgName: string) => {
    if (window.confirm(`Are you sure you want to delete "${orgName}"? This action cannot be undone and will remove all associated data.`)) {
      try {
        await deleteOrganization(orgId);
        toast({
          title: "Organization Deleted",
          description: `${orgName} has been successfully deleted.`,
        });
        
        // If the deleted org was the current one, reset current organization
        if (currentOrganization?.id === orgId) {
          setCurrentOrganization(null);
        }
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewMetrics = (org) => {
    setSelectedOrgForMetrics(org);
    setShowMetricsDialog(true);
  };

  const getSubscriptionBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-4">
      {/* Organization Management Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Organization Management</h2>
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
      </div>

      {/* Organizations List */}
      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card key={org.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{org.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={getSubscriptionBadgeColor(org.subscriptionStatus)}>
                      {org.subscriptionStatus}
                    </Badge>
                    <span className="text-sm text-gray-500">/{org.slug}</span>
                    <span className="text-sm text-gray-500">
                      {org.subscriptionTier} plan
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {org.maxUsers} users
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {org.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMetrics(org)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Metrics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentOrganization(org)}
                  className={currentOrganization?.id === org.id ? "bg-blue-50 border-blue-200" : ""}
                >
                  {currentOrganization?.id === org.id ? "Current" : "Switch To"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteOrganization(org.id, org.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Organization Metrics Dialog */}
      <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOrgForMetrics?.name} - Metrics & Analytics
            </DialogTitle>
          </DialogHeader>
          {selectedOrgForMetrics && (
            <div className="space-y-6">
              {/* Subscription Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <Badge variant="outline">{selectedOrgForMetrics.subscriptionTier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getSubscriptionBadgeColor(selectedOrgForMetrics.subscriptionStatus)}>
                      {selectedOrgForMetrics.subscriptionStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Vehicles:</span>
                    <span>{selectedOrgForMetrics.maxVehicles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Users:</span>
                    <span>{selectedOrgForMetrics.maxUsers}</span>
                  </div>
                  {selectedOrgForMetrics.trialEndsAt && (
                    <div className="flex justify-between">
                      <span>Trial Ends:</span>
                      <span>{selectedOrgForMetrics.trialEndsAt.toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Enabled Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrgForMetrics.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Organization Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Owner Email:</span>
                    <span>{selectedOrgForMetrics.ownerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Login URL:</span>
                    <span className="text-blue-600">/{selectedOrgForMetrics.slug}/login</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
