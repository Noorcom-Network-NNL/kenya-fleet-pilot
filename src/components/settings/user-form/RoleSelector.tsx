
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UseFormSetValue, FieldErrors } from 'react-hook-form';
import { roleDescriptions, UserRole } from './RoleDescriptions';

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

interface RoleSelectorProps {
  setValue: UseFormSetValue<AddUserFormData>;
  selectedRole: UserRole;
  errors: FieldErrors<AddUserFormData>;
}

export function RoleSelector({ setValue, selectedRole, errors }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="role">User Role *</Label>
        <Select onValueChange={(value) => setValue('role', value as any)} defaultValue="Viewer">
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleDescriptions).map(([role, info]) => (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <span>{info.icon}</span>
                  <span>{role}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
      </div>

      {/* Role Preview */}
      {selectedRole && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={roleDescriptions[selectedRole].color}>
              <span className="mr-1">{roleDescriptions[selectedRole].icon}</span>
              {selectedRole}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {roleDescriptions[selectedRole].description}
          </p>
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Key Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {roleDescriptions[selectedRole].permissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
