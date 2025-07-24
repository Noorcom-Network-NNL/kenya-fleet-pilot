import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  Car, 
  Fuel, 
  Wrench, 
  Route,
  Calendar,
  Mail,
  Globe
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  subscription_status: string;
  max_vehicles: number;
  max_users: number;
  owner_email: string;
  created_at: string;
  white_label_enabled: boolean;
  primary_color?: string;
  logo_url?: string;
  custom_domain?: string;
}

interface OrganizationStats {
  totalUsers: number;
  totalVehicles: number;
  totalDrivers: number;
  fuelRecords: number;
  maintenanceRecords: number;
  tripRecords: number;
}

interface OrganizationDetailsDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationDetailsDialog({ organization, open, onOpenChange }: OrganizationDetailsDialogProps) {
  const [stats, setStats] = useState<OrganizationStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalDrivers: 0,
    fuelRecords: 0,
    maintenanceRecords: 0,
    tripRecords: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (organization && open) {
      loadOrganizationStats();
    }
  }, [organization, open]);

  const loadOrganizationStats = async () => {
    if (!organization) return;

    try {
      setLoading(true);

      // Get all stats in parallel
      const [
        { data: users },
        { data: vehicles },
        { data: drivers },
        { data: fuelRecords },
        { data: maintenanceRecords },
        { data: tripRecords }
      ] = await Promise.all([
        supabase.from('profiles').select('id').eq('organization_id', organization.id),
        supabase.from('vehicles').select('id').eq('organization_id', organization.id),
        supabase.from('drivers').select('id').eq('organization_id', organization.id),
        supabase.from('fuel_records').select('id').eq('organization_id', organization.id),
        supabase.from('maintenance_records').select('id').eq('organization_id', organization.id),
        supabase.from('trip_records').select('id').eq('organization_id', organization.id),
      ]);

      setStats({
        totalUsers: users?.length || 0,
        totalVehicles: vehicles?.length || 0,
        totalDrivers: drivers?.length || 0,
        fuelRecords: fuelRecords?.length || 0,
        maintenanceRecords: maintenanceRecords?.length || 0,
        tripRecords: tripRecords?.length || 0,
      });

    } catch (error) {
      console.error('Error loading organization stats:', error);
      toast({
        title: "Error",
        description: "Failed to load organization statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!organization) return null;

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      case 'free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {organization.logo_url ? (
              <img
                src={organization.logo_url}
                alt={`${organization.name} logo`}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: organization.primary_color || '#3b82f6' }}
              >
                {organization.name.charAt(0)}
              </div>
            )}
            {organization.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{organization.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="font-medium">/{organization.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {organization.owner_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(organization.created_at).toLocaleDateString()}
                  </p>
                </div>
                {organization.custom_domain && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Custom Domain</p>
                    <p className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {organization.custom_domain}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className={getTierColor(organization.subscription_tier)}>
                  {organization.subscription_tier}
                </Badge>
                <Badge className={getSubscriptionStatusColor(organization.subscription_status)}>
                  {organization.subscription_status}
                </Badge>
                {organization.white_label_enabled && (
                  <Badge variant="outline">
                    White Label Enabled
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Car className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{organization.max_vehicles}</p>
                  <p className="text-sm text-muted-foreground">Max Vehicles</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{organization.max_users}</p>
                  <p className="text-sm text-muted-foreground">Max Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                    <p className="text-xs text-green-600">
                      {stats.totalUsers}/{organization.max_users}
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Car className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-xl font-bold">{stats.totalVehicles}</p>
                    <p className="text-xs text-muted-foreground">Vehicles</p>
                    <p className="text-xs text-green-600">
                      {stats.totalVehicles}/{organization.max_vehicles}
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-xl font-bold">{stats.totalDrivers}</p>
                    <p className="text-xs text-muted-foreground">Drivers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Fuel className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-xl font-bold">{stats.fuelRecords}</p>
                    <p className="text-xs text-muted-foreground">Fuel Records</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Wrench className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <p className="text-xl font-bold">{stats.maintenanceRecords}</p>
                    <p className="text-xs text-muted-foreground">Maintenance</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Route className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                    <p className="text-xl font-bold">{stats.tripRecords}</p>
                    <p className="text-xs text-muted-foreground">Trips</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}