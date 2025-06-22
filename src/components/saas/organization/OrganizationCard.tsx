
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, Crown, BarChart3, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Organization } from '@/types/organization';
import { getSubscriptionBadgeColor } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrganizationCardProps {
  org: Organization;
  currentOrganization: Organization | null;
  onManagePlan: (org: Organization) => void;
  onViewMetrics: (org: Organization) => void;
  onSwitchTo: (org: Organization) => void;
  onDelete: (orgId: string, orgName: string) => void;
}

export function OrganizationCard({
  org,
  currentOrganization,
  onManagePlan,
  onViewMetrics,
  onSwitchTo,
  onDelete
}: OrganizationCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{org.name}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              <Badge className={getSubscriptionBadgeColor(org.subscriptionStatus)}>
                {org.subscriptionStatus}
              </Badge>
              <span className="text-sm text-gray-500 truncate">/{org.slug}</span>
              <span className="text-sm text-gray-500 truncate">
                {org.subscriptionTier} plan
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Max {org.maxUsers} users</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Created {org.createdAt.toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onManagePlan(org)}>
                  <Crown className="h-4 w-4 mr-2" />
                  Manage Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewMetrics(org)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Metrics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSwitchTo(org)}>
                  <Building className="h-4 w-4 mr-2" />
                  {currentOrganization?.id === org.id ? "Current" : "Switch To"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(org.id, org.name)}
                  className="text-red-600 focus:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManagePlan(org)}
                className="flex items-center gap-2"
              >
                <Crown className="h-4 w-4" />
                <span className="hidden xl:inline">Manage Plan</span>
                <span className="xl:hidden">Plan</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewMetrics(org)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden xl:inline">Metrics</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSwitchTo(org)}
                className={currentOrganization?.id === org.id ? "bg-blue-50 border-blue-200" : ""}
              >
                {currentOrganization?.id === org.id ? "Current" : "Switch"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(org.id, org.name)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
