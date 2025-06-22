
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { User, UserPlus, Edit, Trash2, Shield, Eye, Loader2 } from 'lucide-react';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';
import { AddUserForm } from './AddUserForm';

export function UserManagement() {
  const { users, loading, deleteUser } = useFirebaseUsers();
  const { currentOrganization } = useOrganizations();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">
            Manage users for {currentOrganization?.name || 'your organization'} ({users.length} users)
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <AddUserForm onClose={() => setShowAddDialog(false)} />
          </Dialog>
        </div>
      </div>

      {/* Users List */}
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

      {/* Role Permissions */}
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
