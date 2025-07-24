import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateAdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const availablePermissions = [
  'manage_organizations',
  'manage_users',
  'manage_billing',
  'manage_settings',
  'view_analytics',
  'manage_branding',
  'system_maintenance'
];

export function CreateAdminUserDialog({ open, onOpenChange, onSuccess }: CreateAdminUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'admin' as 'super_admin' | 'admin' | 'support',
    permissions: [] as string[],
    active: true,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // For now, create a placeholder user_id since we're not integrating with auth.users
      // In a real implementation, you'd first create the auth user
      const placeholderUserId = crypto.randomUUID();

      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: placeholderUserId,
          email: formData.email,
          role: formData.role,
          permissions: formData.permissions,
          active: formData.active,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user created successfully",
      });

      // Reset form
      setFormData({
        email: '',
        role: 'admin',
        permissions: [],
        active: true,
      });

      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case 'super_admin':
        return availablePermissions;
      case 'admin':
        return ['manage_organizations', 'manage_users', 'view_analytics', 'manage_branding'];
      case 'support':
        return ['view_analytics'];
      default:
        return [];
    }
  };

  const handleRoleChange = (role: 'super_admin' | 'admin' | 'support') => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: getDefaultPermissions(role)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Admin User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="admin@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.role === 'super_admin' && 'Full system access'}
              {formData.role === 'admin' && 'Manage organizations and users'}
              {formData.role === 'support' && 'View-only access for support'}
            </p>
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={formData.permissions.includes(permission)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={permission}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, active: checked as boolean }))
              }
            />
            <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
              Active (user can log in)
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}