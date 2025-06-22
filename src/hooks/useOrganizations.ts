
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { Organization, CreateOrganizationData } from '@/types/organization';
import { OrganizationService } from '@/services/organizationService';

const SUPER_ADMIN_EMAIL = 'admin@noorcomfleet.co.ke';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('useOrganizations effect triggered');
    console.log('Current user:', currentUser);

    if (!currentUser) {
      console.log('No current user, setting loading to false');
      setLoading(false);
      return;
    }

    if (!db) {
      console.error('Firebase db is not initialized');
      toast({
        title: "Configuration Error",
        description: "Database connection not configured properly",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = OrganizationService.subscribeToUserOrganizations(
        currentUser.uid,
        (orgsData) => {
          setOrganizations(orgsData);
          
          // Only set current organization for non-super admin users
          if (currentUser.email !== SUPER_ADMIN_EMAIL && orgsData.length > 0 && !currentOrganization) {
            console.log('Setting current organization to first in list for regular user');
            setCurrentOrganization(orgsData[0]);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Firestore error details:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          let errorMessage = "Failed to fetch organizations";
          
          if (error.code === 'permission-denied') {
            errorMessage = "Permission denied. Please check your account access.";
          } else if (error.code === 'unavailable') {
            errorMessage = "Database temporarily unavailable. Please try again.";
          } else if (error.code === 'failed-precondition') {
            errorMessage = "Database index missing. Please contact support.";
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          setLoading(false);
        }
      );

      return () => {
        console.log('Cleaning up Firestore listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize organization data",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [currentUser, toast, currentOrganization]);

  const createOrganization = async (orgData: CreateOrganizationData) => {
    if (!currentUser) throw new Error('User not authenticated');

    const isSuperAdmin = currentUser.email === SUPER_ADMIN_EMAIL;

    try {
      const orgId = await OrganizationService.createOrganization(
        orgData,
        currentUser.uid,
        currentUser.email || ''
      );
      
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      
      // Don't switch context for super admin - they should stay in management view
      if (!isSuperAdmin) {
        // For regular users, they might want to switch to the new org
        console.log('Regular user created organization, allowing context switch');
      } else {
        console.log('Super admin created organization, maintaining management context');
      }
      
      return orgId;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrganization = async (id: string, orgData: Partial<Organization>) => {
    try {
      await OrganizationService.updateOrganization(id, orgData);
      
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      await OrganizationService.deleteOrganization(id);
      
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  // Custom setCurrentOrganization that respects super admin context
  const handleSetCurrentOrganization = (org: Organization | null) => {
    const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;
    
    if (isSuperAdmin) {
      console.log('Super admin attempting to switch organization context - preventing');
      // Super admins should not switch organization context
      return;
    }
    
    console.log('Setting current organization for regular user:', org?.name);
    setCurrentOrganization(org);
  };

  return {
    organizations,
    currentOrganization,
    setCurrentOrganization: handleSetCurrentOrganization,
    loading,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
