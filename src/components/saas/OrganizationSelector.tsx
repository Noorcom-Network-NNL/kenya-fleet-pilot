
import React, { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useToast } from '@/hooks/use-toast';
import { Organization } from '@/types/organization';
import { OrganizationCard } from './organization/OrganizationCard';
import { CreateOrganizationDialog } from './organization/CreateOrganizationDialog';
import { PlanManagementDialog } from './organization/PlanManagementDialog';
import { OrganizationMetricsDialog } from './organization/OrganizationMetricsDialog';
import { pricingPlans } from './organization/constants';

export function OrganizationSelector() {
  const { organizations, currentOrganization, setCurrentOrganization, deleteOrganization, updateOrganization } = useOrganizations();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedOrgForMetrics, setSelectedOrgForMetrics] = useState<Organization | null>(null);
  const [selectedOrgForPlan, setSelectedOrgForPlan] = useState<Organization | null>(null);

  const handleDeleteOrganization = async (orgId: string, orgName: string) => {
    if (window.confirm(`Are you sure you want to delete "${orgName}"? This action cannot be undone and will remove all associated data.`)) {
      try {
        await deleteOrganization(orgId);
        toast({
          title: "Organization Deleted",
          description: `${orgName} has been successfully deleted.`,
        });
        
        if (currentOrganization?.id === orgId) {
          setCurrentOrganization(null);
        }
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewMetrics = (org: Organization) => {
    setSelectedOrgForMetrics(org);
    setShowMetricsDialog(true);
  };

  const handleManagePlan = (org: Organization) => {
    setSelectedOrgForPlan(org);
    setShowPlanDialog(true);
  };

  const handlePlanUpdate = async (planId: string) => {
    if (!selectedOrgForPlan) return;
    
    const selectedPlan = pricingPlans.find(plan => plan.id === planId);
    if (!selectedPlan) return;

    try {
      await updateOrganization(selectedOrgForPlan.id, {
        subscriptionTier: planId as any,
        subscriptionStatus: planId === 'free' ? 'trial' : 'active',
        maxVehicles: selectedPlan.maxVehicles,
        maxUsers: selectedPlan.maxUsers
      });

      toast({
        title: "Plan Updated",
        description: `${selectedOrgForPlan.name} has been updated to ${selectedPlan.name} plan.`,
      });
      
      setShowPlanDialog(false);
      setSelectedOrgForPlan(null);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update organization plan",
        variant: "destructive",
      });
    }
  };

  if (organizations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Organization Management</h2>
          <CreateOrganizationDialog
            showCreateDialog={showCreateDialog}
            setShowCreateDialog={setShowCreateDialog}
          />
        </div>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Organizations Found</h3>
          <p className="text-gray-600">Use the "Add Organization" button above to create your first organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Organization Management Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Organization Management</h2>
        <CreateOrganizationDialog
          showCreateDialog={showCreateDialog}
          setShowCreateDialog={setShowCreateDialog}
        />
      </div>

      {/* Organizations List */}
      <div className="grid gap-4">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            org={org}
            currentOrganization={currentOrganization}
            onManagePlan={handleManagePlan}
            onViewMetrics={handleViewMetrics}
            onSwitchTo={setCurrentOrganization}
            onDelete={handleDeleteOrganization}
          />
        ))}
      </div>

      {/* Plan Management Dialog */}
      <PlanManagementDialog
        showPlanDialog={showPlanDialog}
        setShowPlanDialog={setShowPlanDialog}
        selectedOrgForPlan={selectedOrgForPlan}
        setSelectedOrgForPlan={setSelectedOrgForPlan}
        onPlanUpdate={handlePlanUpdate}
      />

      {/* Organization Metrics Dialog */}
      <OrganizationMetricsDialog
        showMetricsDialog={showMetricsDialog}
        setShowMetricsDialog={setShowMetricsDialog}
        selectedOrgForMetrics={selectedOrgForMetrics}
      />
    </div>
  );
}
