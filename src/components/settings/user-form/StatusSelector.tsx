
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormSetValue } from 'react-hook-form';

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

interface StatusSelectorProps {
  setValue: UseFormSetValue<AddUserFormData>;
}

export function StatusSelector({ setValue }: StatusSelectorProps) {
  return (
    <div>
      <Label htmlFor="status">Account Status</Label>
      <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="active">
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select account status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
          </SelectItem>
          <SelectItem value="inactive">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Inactive</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
