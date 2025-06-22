
import { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function useCreateOrganization() {
  const [loading, setLoading] = useState(false);
  const { createOrganization } = useOrganizations();
  const { toast } = useToast();

  const handleCreateOrganization = async (
    orgName: string, 
    adminName: string, 
    adminEmail: string, 
    adminPassword: string
  ) => {
    setLoading(true);
    
    try {
      // First create the organization
      const orgId = await createOrganization({
        name: orgName,
        slug: orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        subscriptionTier: 'free' as const,
        subscriptionStatus: 'trial' as const,
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management']
      });

      // Then create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      
      // Add the admin user to the users collection
      await addDoc(collection(db, 'users'), {
        name: adminName,
        email: adminEmail,
        role: 'Fleet Admin' as const,
        status: 'active' as const,
        lastLogin: 'Never',
        organizationId: orgId,
        createdAt: new Date(),
      });

      toast({
        title: "Organization Created Successfully",
        description: `${orgName} has been created with admin user ${adminName}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error creating organization:', error);
      
      let errorMessage = "Failed to create organization. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please use a different email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreateOrganization
  };
}
