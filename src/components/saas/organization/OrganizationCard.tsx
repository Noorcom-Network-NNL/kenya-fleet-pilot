
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, Crown, BarChart3, Trash2 } from 'lucide-react';
import { Organization } from '@/types/organization';
import { getSubscriptionBadgeColor } from './constants';

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
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{org.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={getSubscriptionBadgeColor(org.subscriptionStatus)}>
                {org.subscriptionStatus}
              </Badge>
              <span className="text-sm text-gray-500">/{org.slug}</span>
              <span className="text-sm text-gray-500">
                {org.subscriptionTier} plan
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {org.maxUsers} users
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {org.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePlan(org)}
            className="flex items-center gap-2"
          >
            <Crown className="h-4 w-4" />
            Manage Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewMetrics(org)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Metrics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitchTo(org)}
            className={currentOrganization?.id === org.id ? "bg-blue-50 border-blue-200" : ""}
          >
            {currentOrganization?.id === org.id ? "Current" : "Switch To"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(org.id, org.name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
