
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useOrganizations } from '@/hooks/useOrganizations';

interface CreateOrgFormData {
  name: string;
  slug: string;
}

interface CreateOrganizationFormProps {
  onClose: () => void;
}

export function CreateOrganizationForm({ onClose }: CreateOrganizationFormProps) {
  const { createOrganization } = useOrganizations();
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
    // Include all required Organization properties
    const organizationData = {
      name: data.name,
      slug: data.slug,
      subscriptionTier: 'free' as const,
      subscriptionStatus: 'trial' as const,
      maxVehicles: 5,
      maxUsers: 3,
      features: ['basic_tracking', 'fuel_management']
    };
    
    await createOrganization(organizationData);
    onClose();
  };

  return (
    <DialogContent>
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
