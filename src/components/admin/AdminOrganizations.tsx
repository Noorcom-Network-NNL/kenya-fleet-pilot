import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  MoreHorizontal,
  Building2,
  Users,
  Car,
  Palette
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateOrganizationDialog } from '@/components/admin/CreateOrganizationDialog';
import { OrganizationDetailsDialog } from '@/components/admin/OrganizationDetailsDialog';
import { OrganizationBrandingDialog } from '@/components/saas/organization/OrganizationBrandingDialog';

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
}

export function AdminOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showBrandingDialog, setShowBrandingDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.owner_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Organizations</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {org.logo_url ? (
                    <img
                      src={org.logo_url}
                      alt={`${org.name} logo`}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: org.primary_color || '#3b82f6' }}
                    >
                      {org.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">/{org.slug}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedOrg(org);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedOrg(org);
                        setShowBrandingDialog(true);
                      }}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Manage Branding
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getTierColor(org.subscription_tier)}>
                  {org.subscription_tier}
                </Badge>
                <Badge className={getSubscriptionStatusColor(org.subscription_status)}>
                  {org.subscription_status}
                </Badge>
                {org.white_label_enabled && (
                  <Badge variant="outline">
                    White Label
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{org.owner_email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Vehicles:</span>
                  <span className="font-medium">{org.max_vehicles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Users:</span>
                  <span className="font-medium">{org.max_users}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(org.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No organizations match your search.' : 'Get started by creating your first organization.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadOrganizations}
      />

      <OrganizationDetailsDialog
        organization={selectedOrg}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      {selectedOrg && (
        <OrganizationBrandingDialog
          organization={selectedOrg}
          open={showBrandingDialog}
          onOpenChange={setShowBrandingDialog}
          onSuccess={loadOrganizations}
        />
      )}
    </div>
  );
}