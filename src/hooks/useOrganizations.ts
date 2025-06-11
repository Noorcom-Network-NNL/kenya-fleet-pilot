
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
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
    console.log('useOrganizations effect triggered');
    console.log('Current user:', currentUser);
    console.log('Firebase db instance:', db);

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
      console.log('Setting up Firestore listener for user:', currentUser.uid);
      
      // Use simpler query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, 'organizations'), 
        where('ownerId', '==', currentUser.uid)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Firestore snapshot received, docs count:', snapshot.docs.length);
        
        const orgsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          trialEndsAt: doc.data().trialEndsAt?.toDate(),
          subscriptionEndsAt: doc.data().subscriptionEndsAt?.toDate(),
        })) as Organization[];
        
        // Sort by createdAt in JavaScript instead of using Firestore orderBy
        orgsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        console.log('Processed organizations:', orgsData);
        setOrganizations(orgsData);
        
        if (orgsData.length > 0 && !currentOrganization) {
          console.log('Setting current organization to first in list');
          setCurrentOrganization(orgsData[0]);
        }
        setLoading(false);
      }, (error) => {
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
      });

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
  }, [currentUser, toast]);

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt' | 'ownerId' | 'ownerEmail'>) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      console.log('Creating organization:', orgData);
      
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
      
      console.log('Organization created successfully');
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
