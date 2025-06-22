
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { User, UserPlus, Edit, Trash2, Eye, Loader2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';
import { AddUserForm } from './AddUserForm';
import { RolePermissionsManager } from './RolePermissionsManager';

export function UserManagement() {
  const { users, loading, deleteUser } = useFirebaseUsers();
  const { currentOrganization } = useOrganizations();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Fleet Admin": return "bg-red-100 text-red-800";
      case "Fleet Manager": return "bg-blue-100 text-blue-800";
      case "Driver": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Fleet Admin": return "🔑";
      case "Fleet Manager": return "👨‍💼";
      case "Driver": return "🚗";
      case "Viewer": return "👀";
      default: return "👤";
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      await deleteUser(id);
    }
  };

  const handleEditUser = (userId: string) => {
    setEditingUser(userId);
    // TODO: Implement edit user functionality
    toast({
      title: "Edit User",
      description: "Edit user functionality will be implemented soon",
    });
  };

  const handleViewUser = (userId: string) => {
    // TODO: Implement view user details functionality
    toast({
      title: "View User",
      description: "User details view will be implemented soon",
    });
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
            Manage users for {currentOrganization?.name || 'your organization'}
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
            Active Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">No users found</p>
              <p className="text-sm text-gray-400 mb-4">Add your first user to get started</p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add First User
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <Badge className={getRoleColor(user.role)}>
                          <span className="mr-1">{getRoleIcon(user.role)}</span>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-400">Last login: {user.lastLogin}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Manager */}
      <RolePermissionsManager />
    </div>
  );
}
