import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Shield,
  ShieldCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateAdminUserDialog } from '@/components/admin/CreateAdminUserDialog';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      loadAdminUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      loadAdminUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = adminUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return ShieldCheck;
      case 'admin': return Shield;
      case 'support': return Users;
      default: return Users;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Users</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search admin users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <RoleIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.email}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {!user.active && (
                          <Badge variant="destructive">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
                      <p>Updated: {new Date(user.updated_at).toLocaleDateString()}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.id, user.active)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          {user.active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteUser(user.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {user.permissions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No admin users found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No users match your search.' : 'Get started by adding your first admin user.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin User
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateAdminUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadAdminUsers}
      />
    </div>
  );
}