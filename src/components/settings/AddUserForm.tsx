
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { BasicInfoFields } from './user-form/BasicInfoFields';
import { RoleSelector } from './user-form/RoleSelector';
import { StatusSelector } from './user-form/StatusSelector';
import { useAddUserForm } from './user-form/useAddUserForm';

interface AddUserFormProps {
  onClose: () => void;
}

export function AddUserForm({ onClose }: AddUserFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, setValue, watch, formState: { errors, isSubmitting }, onSubmit } = useAddUserForm(onClose);

  const selectedRole = watch('role');

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <BasicInfoFields 
          register={register}
          errors={errors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <Separator />

        {/* Role Selection */}
        <RoleSelector 
          setValue={setValue}
          selectedRole={selectedRole}
          errors={errors}
        />

        <Separator />

        {/* Status */}
        <StatusSelector setValue={setValue} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding User...' : 'Add User'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
