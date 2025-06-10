
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled';
  maxVehicles: number;
  maxUsers: number;
  features: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: Date;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'organizations'), 
      where('ownerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orgsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        trialEndsAt: doc.data().trialEndsAt?.toDate(),
        subscriptionEndsAt: doc.data().subscriptionEndsAt?.toDate(),
      })) as Organization[];
      
      setOrganizations(orgsData);
      if (orgsData.length > 0 && !currentOrganization) {
        setCurrentOrganization(orgsData[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt' | 'ownerId' | 'ownerEmail'>) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial

      await addDoc(collection(db, 'organizations'), {
        ...orgData,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management'],
        createdAt: new Date(),
        trialEndsAt,
      });
      
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const updateOrganization = async (id: string, orgData: Partial<Organization>) => {
    try {
      await updateDoc(doc(db, 'organizations', id), orgData);
      
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
      await deleteDoc(doc(db, 'organizations', id));
      
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

  return {
    organizations,
    currentOrganization,
    setCurrentOrganization,
    loading,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
