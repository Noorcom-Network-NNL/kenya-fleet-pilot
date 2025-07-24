import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateOrganizationDialog({ open, onOpenChange, onSuccess }: CreateOrganizationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    subscriptionTier: 'free' as 'free' | 'basic' | 'premium' | 'enterprise',
    maxVehicles: 5,
    maxUsers: 3,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.ownerEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          slug: formData.slug,
          owner_email: formData.ownerEmail,
          subscription_tier: formData.subscriptionTier,
          subscription_status: 'trial',
          max_vehicles: formData.maxVehicles,
          max_users: formData.maxUsers,
          owner_id: crypto.randomUUID(), // Temporary UUID since we don't have the actual user
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
        })
        .select()
        .single();

      if (orgError) throw orgError;

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      // Reset form
      setFormData({
        name: '',
        slug: '',
        ownerEmail: '',
        subscriptionTier: 'free',
        maxVehicles: 5,
        maxUsers: 3,
      });

      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="organization-slug"
              required
            />
            <p className="text-xs text-muted-foreground">
              URL will be: /{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Owner Email *</Label>
            <Input
              id="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
              placeholder="owner@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionTier">Subscription Tier</Label>
            <Select
              value={formData.subscriptionTier}
              onValueChange={(value: 'free' | 'basic' | 'premium' | 'enterprise') =>
                setFormData(prev => ({ ...prev, subscriptionTier: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free (Trial)</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxVehicles">Max Vehicles</Label>
              <Input
                id="maxVehicles"
                type="number"
                min="1"
                value={formData.maxVehicles}
                onChange={(e) => setFormData(prev => ({ ...prev, maxVehicles: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsers">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                min="1"
                value={formData.maxUsers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) || 1 }))}
              />
            </div>
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
              Create Organization
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}