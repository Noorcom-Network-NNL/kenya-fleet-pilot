
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { User, useFirebaseUsers } from '@/hooks/useFirebaseUsers';

interface AddUserFormData {
  name: string;
  email: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

interface AddUserFormProps {
  onClose: () => void;
}

export function AddUserForm({ onClose }: AddUserFormProps) {
  const { addUser } = useFirebaseUsers();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AddUserFormData>({
    defaultValues: {
      role: 'Viewer',
      status: 'active'
    }
  });

  const onSubmit = async (data: AddUserFormData) => {
    const userData: Omit<User, 'id' | 'createdAt'> = {
      ...data,
      lastLogin: 'Never'
    };
    
    await addUser(userData);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setValue('role', value as any)} defaultValue="Viewer">
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fleet Admin">Fleet Admin</SelectItem>
              <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
              <SelectItem value="Driver">Driver</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="active">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add User
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
