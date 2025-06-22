
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/types/organization';
import { pricingPlans } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlanManagementDialogProps {
  showPlanDialog: boolean;
  setShowPlanDialog: (show: boolean) => void;
  selectedOrgForPlan: Organization | null;
  setSelectedOrgForPlan: (org: Organization | null) => void;
  onPlanUpdate: (planId: string) => void;
}

export function PlanManagementDialog({
  showPlanDialog,
  setShowPlanDialog,
  selectedOrgForPlan,
  setSelectedOrgForPlan,
  onPlanUpdate
}: PlanManagementDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-2xl'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl truncate">
            Manage Plan - {selectedOrgForPlan?.name}
          </DialogTitle>
        </DialogHeader>
        {selectedOrgForPlan && (
          <div className="space-y-4">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedOrgForPlan.subscriptionTier === plan.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onPlanUpdate(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-medium truncate">{plan.name}</h3>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div className="truncate">Vehicles: {plan.maxVehicles === -1 ? 'Unlimited' : plan.maxVehicles}</div>
                        <div className="truncate">Users: {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}</div>
                      </div>
                      {selectedOrgForPlan.subscriptionTier === plan.id && (
                        <Badge className="mt-2">Current Plan</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
