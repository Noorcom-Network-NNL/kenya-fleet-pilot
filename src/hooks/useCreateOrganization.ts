
import { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useCreateOrganization() {
  const { createOrganization } = useOrganizations();
  const { addUser } = useFirebaseUsers();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleCreateOrganization = async (
    newOrgName: string,
    adminName: string,
    adminEmail: string,
    adminPassword: string
  ) => {
    if (!newOrgName.trim() || !adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including the admin password",
        variant: "destructive",
      });
      return false;
    }

    if (adminPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password should be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      // Check if email already exists BEFORE creating organization
      console.log('Checking if email exists:', adminEmail);
      const emailExists = await checkEmailExists(adminEmail);
      
      if (emailExists) {
        console.log('Email already exists, aborting organization creation');
        toast({
          title: "Email Already Registered",
          description: `The email ${adminEmail} is already registered. Please use a different email address for the admin user.`,
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }

      console.log('Email is available, proceeding with user creation');
      
      // Create Firebase Auth user FIRST, before creating organization
      let userCreated = false;
      try {
        await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        userCreated = true;
        console.log('Firebase user created successfully');
      } catch (authError: any) {
        console.error('Failed to create Firebase user:', authError);
        
        let errorMessage = "Failed to create admin user";
        
        if (authError.code === 'auth/email-already-in-use') {
          errorMessage = `The email ${adminEmail} is already registered. Please use a different email address.`;
        } else if (authError.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters long.";
        } else if (authError.code === 'auth/invalid-email') {
          errorMessage = "Please enter a valid email address.";
        }
        
        toast({
          title: "Error Creating Admin User",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }

      // Only create organization if user was created successfully
      if (userCreated) {
        console.log('Creating organization after successful user creation');
        const slug = newOrgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        const orgId = await createOrganization({
          name: newOrgName,
          slug,
          subscriptionTier: 'free',
          subscriptionStatus: 'trial',
          maxVehicles: 5,
          maxUsers: 3,
          features: ['basic_tracking', 'fuel_management']
        });
        
        if (orgId) {
          // Create user record in Firestore
          const adminUserData = {
            name: adminName,
            email: adminEmail,
            role: 'Fleet Admin' as const,
            status: 'active' as const,
            lastLogin: 'Never',
            organizationId: orgId
          };
          
          await addUser(adminUserData);
          
          toast({
            title: "Organization Created Successfully",
            description: `${newOrgName} created successfully! Admin can now log in at /${slug}/login`,
          });
          
          return true;
        }
      }
    } catch (error) {
      console.error('Error in organization creation process:', error);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    
    return false;
  };

  return {
    loading,
    handleCreateOrganization
  };
}
