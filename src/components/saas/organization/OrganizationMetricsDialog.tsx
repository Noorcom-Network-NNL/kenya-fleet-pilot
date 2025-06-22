
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/types/organization';
import { getSubscriptionBadgeColor } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrganizationMetricsDialogProps {
  showMetricsDialog: boolean;
  setShowMetricsDialog: (show: boolean) => void;
  selectedOrgForMetrics: Organization | null;
}

export function OrganizationMetricsDialog({
  showMetricsDialog,
  setShowMetricsDialog,
  selectedOrgForMetrics
}: OrganizationMetricsDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-2xl'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl truncate">
            {selectedOrgForMetrics?.name} - Metrics & Analytics
          </DialogTitle>
        </DialogHeader>
        {selectedOrgForMetrics && (
          <div className="space-y-6">
            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plan:</span>
                  <Badge variant="outline" className="text-xs">{selectedOrgForMetrics.subscriptionTier}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge className={`text-xs ${getSubscriptionBadgeColor(selectedOrgForMetrics.subscriptionStatus)}`}>
                    {selectedOrgForMetrics.subscriptionStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max Vehicles:</span>
                  <span className="text-sm font-medium">{selectedOrgForMetrics.maxVehicles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max Users:</span>
                  <span className="text-sm font-medium">{selectedOrgForMetrics.maxUsers}</span>
                </div>
                {selectedOrgForMetrics.trialEndsAt && (
                  <div className="flex justify-between">
                    <span className="text-sm">Trial Ends:</span>
                    <span className="text-sm font-medium">{selectedOrgForMetrics.trialEndsAt.toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Enabled Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedOrgForMetrics.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Organization Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm">Owner Email:</span>
                  <span className="text-sm font-medium break-all">{selectedOrgForMetrics.ownerEmail}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm">Login URL:</span>
                  <span className="text-sm text-blue-600 break-all">/{selectedOrgForMetrics.slug}/login</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
