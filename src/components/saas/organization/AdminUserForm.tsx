
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface AdminUserFormProps {
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  showPassword: boolean;
  orgName: string;
  onAdminNameChange: (value: string) => void;
  onAdminEmailChange: (value: string) => void;
  onAdminPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
}

export function AdminUserForm({
  adminName,
  adminEmail,
  adminPassword,
  showPassword,
  orgName,
  onAdminNameChange,
  onAdminEmailChange,
  onAdminPasswordChange,
  onToggleShowPassword
}: AdminUserFormProps) {
  const slug = orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3">Default Admin User</h4>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="adminName">Admin Name</Label>
          <Input
            id="adminName"
            value={adminName}
            onChange={(e) => onAdminNameChange(e.target.value)}
            placeholder="Enter admin full name"
          />
        </div>

        <div>
          <Label htmlFor="adminEmail">Admin Email</Label>
          <Input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => onAdminEmailChange(e.target.value)}
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
              onChange={(e) => onAdminPasswordChange(e.target.value)}
              placeholder="Enter admin password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={onToggleShowPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This user will be able to log in at /{slug}/login
          </p>
        </div>
      </div>
    </div>
  );
}
