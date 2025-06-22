
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/types/organization';
import { getSubscriptionBadgeColor } from './constants';

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
  return (
    <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
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
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <Badge variant="outline">{selectedOrgForMetrics.subscriptionTier}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className={getSubscriptionBadgeColor(selectedOrgForMetrics.subscriptionStatus)}>
                    {selectedOrgForMetrics.subscriptionStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Max Vehicles:</span>
                  <span>{selectedOrgForMetrics.maxVehicles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Users:</span>
                  <span>{selectedOrgForMetrics.maxUsers}</span>
                </div>
                {selectedOrgForMetrics.trialEndsAt && (
                  <div className="flex justify-between">
                    <span>Trial Ends:</span>
                    <span>{selectedOrgForMetrics.trialEndsAt.toLocaleDateString()}</span>
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
                    <Badge key={feature} variant="secondary">
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
                <div className="flex justify-between">
                  <span>Owner Email:</span>
                  <span>{selectedOrgForMetrics.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Login URL:</span>
                  <span className="text-blue-600">/{selectedOrgForMetrics.slug}/login</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
