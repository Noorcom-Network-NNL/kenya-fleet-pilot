
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';

interface CreateOrgFormData {
  name: string;
  slug: string;
  adminName: string;
  adminEmail: string;
}

interface CreateOrganizationFormProps {
  onClose: () => void;
}

export function CreateOrganizationForm({ onClose }: CreateOrganizationFormProps) {
  const { createOrganization } = useOrganizations();
  const { addUser } = useFirebaseUsers();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateOrgFormData>();

  const nameValue = watch('name');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      // First create the organization
      const organizationData = {
        name: data.name,
        slug: data.slug,
        subscriptionTier: 'free' as const,
        subscriptionStatus: 'trial' as const,
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management']
      };
      
      const orgId = await createOrganization(organizationData);
      
      // Then create the default admin user for the organization
      if (orgId) {
        const adminUserData = {
          name: data.adminName,
          email: data.adminEmail,
          role: 'Fleet Admin' as const,
          status: 'active' as const,
          lastLogin: 'Never',
          organizationId: orgId
        };
        
        await addUser(adminUserData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating organization and admin user:', error);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Organization</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Organization name is required' })}
            placeholder="Enter organization name"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            {...register('slug', { required: 'URL slug is required' })}
            placeholder="organization-slug"
          />
          {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Users will access: https://yourapp.com/org/{watch('slug')}
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Default Admin User</h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                {...register('adminName', { required: 'Admin name is required' })}
                placeholder="Enter admin full name"
              />
              {errors.adminName && <p className="text-sm text-red-600">{errors.adminName.message}</p>}
            </div>

            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                {...register('adminEmail', { 
                  required: 'Admin email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="admin@company.com"
              />
              {errors.adminEmail && <p className="text-sm text-red-600">{errors.adminEmail.message}</p>}
              <p className="text-xs text-gray-500 mt-1">
                This user will be able to invite other users and manage the fleet
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Organization
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
