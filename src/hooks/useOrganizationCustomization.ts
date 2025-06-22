
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface OrganizationCustomization {
  logoUrl?: string;
  primaryColor?: string;
  welcomeMessage?: string;
}

export function useOrganizationCustomization(orgId?: string) {
  const [customization, setCustomization] = useState<OrganizationCustomization>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (orgId) {
      fetchCustomization(orgId);
    }
  }, [orgId]);

  const fetchCustomization = async (organizationId: string) => {
    try {
      const docRef = doc(db, 'organizationCustomization', organizationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setCustomization(docSnap.data() as OrganizationCustomization);
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
    }
  };

  const updateCustomization = async (organizationId: string, data: Partial<OrganizationCustomization>) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'organizationCustomization', organizationId);
      await setDoc(docRef, { ...customization, ...data }, { merge: true });
      
      setCustomization(prev => ({ ...prev, ...data }));
      
      toast({
        title: "Success",
        description: "Organization branding updated successfully",
      });
    } catch (error) {
      console.error('Error updating customization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization branding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    customization,
    updateCustomization,
    loading
  };
}
