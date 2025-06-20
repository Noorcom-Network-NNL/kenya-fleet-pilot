import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { User, UserPlus, Edit, Trash2, Shield, Eye, Loader2, Building, Link, Copy } from 'lucide-react';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';
import { AddUserForm } from './AddUserForm';
import { CreateOrganizationForm } from '@/components/saas/CreateOrganizationForm';
import { InviteUserForm } from '@/components/saas/InviteUserForm';

export function UserManagement() {
  const { users, loading, deleteUser } = useFirebaseUsers();
  const { currentOrganization, organizations } = useOrganizations();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCreateOrgDialog, setShowCreateOrgDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Fleet Admin": return "bg-red-100 text-red-800";
      case "Fleet Manager": return "bg-blue-100 text-blue-800";
      case "Driver": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const copyOrganizationUrl = async () => {
    if (currentOrganization) {
      const orgUrl = `${window.location.origin}/org/${currentOrganization.slug}`;
      await navigator.clipboard.writeText(orgUrl);
      toast({
        title: "Copied!",
        description: "Organization URL copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">Current Organization</h4>
                <p className="text-sm text-gray-500">
                  {currentOrganization ? currentOrganization.name : 'No organization selected'}
                </p>
                {currentOrganization && (
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      /{currentOrganization.slug}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyOrganizationUrl}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <Dialog open={showCreateOrgDialog} onOpenChange={setShowCreateOrgDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Create Organization
                  </Button>
                </DialogTrigger>
                <CreateOrganizationForm onClose={() => setShowCreateOrgDialog(false)} />
              </Dialog>
            </div>

            {currentOrganization && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-blue-900">Organization Details</h5>
                    <div className="text-sm text-blue-700 space-y-1 mt-2">
                      <div>Subscription: {currentOrganization.subscriptionTier} ({currentOrganization.subscriptionStatus})</div>
                      <div>Max Vehicles: {currentOrganization.maxVehicles}</div>
                      <div>Max Users: {currentOrganization.maxUsers}</div>
                      <div>Current Users: {users.length}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={currentOrganization.subscriptionStatus === 'trial' ? 'secondary' : 'default'}>
                      {currentOrganization.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {organizations.length > 1 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">All Your Organizations</h5>
                <div className="grid gap-2">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{org.name}</span>
                        <Badge className="ml-2" variant={org.id === currentOrganization?.id ? 'default' : 'secondary'}>
                          {org.id === currentOrganization?.id ? 'Current' : 'Available'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        /{org.slug}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">
            Manage users for {currentOrganization?.name || 'your organization'} 
            {currentOrganization && ` (${users.length}/${currentOrganization.maxUsers} users)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <InviteUserForm onClose={() => setShowInviteDialog(false)} />
          </Dialog>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                disabled={currentOrganization && users.length >= currentOrganization.maxUsers}
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <AddUserForm onClose={() => setShowAddDialog(false)} />
          </Dialog>
        </div>
      </div>

      {currentOrganization && users.length >= currentOrganization.maxUsers && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            You've reached the maximum number of users ({currentOrganization.maxUsers}) for your current plan. 
            Upgrade your subscription to add more users.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No users found</p>
              <p className="text-sm text-gray-400">Add your first user to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">Last login: {user.lastLogin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions - keeping existing code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-red-600">Fleet Admin</h4>
                <p className="text-sm text-gray-500 mt-1">Full system access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• Manage all vehicles</li>
                  <li>• User management</li>
                  <li>• System settings</li>
                  <li>• All reports</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600">Fleet Manager</h4>
                <p className="text-sm text-gray-500 mt-1">Operations management</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• Vehicle management</li>
                  <li>• Trip management</li>
                  <li>• Maintenance scheduling</li>
                  <li>• Operational reports</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600">Driver</h4>
                <p className="text-sm text-gray-500 mt-1">Limited driver access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• View assigned vehicle</li>
                  <li>• Report issues</li>
                  <li>• Update trip status</li>
                  <li>• Basic tracking</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-600">Viewer</h4>
                <p className="text-sm text-gray-500 mt-1">Read-only access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• View dashboard</li>
                  <li>• View reports</li>
                  <li>• Basic tracking</li>
                  <li>• No editing rights</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
