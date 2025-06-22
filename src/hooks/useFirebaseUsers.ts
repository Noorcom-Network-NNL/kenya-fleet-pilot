
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useOrganizations } from '@/hooks/useOrganizations';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: Date;
  organizationId?: string;
}

export function useFirebaseUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentOrganization } = useOrganizations();

  useEffect(() => {
    console.log('useFirebaseUsers effect triggered');
    console.log('Current organization:', currentOrganization);

    if (!currentOrganization) {
      console.log('No current organization, setting empty users');
      setUsers([]);
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
      // Simplified query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, 'users'), 
        where('organizationId', '==', currentOrganization.id)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Users snapshot received, docs count:', snapshot.docs.length);
        
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as User[];
        
        // Sort by createdAt in JavaScript instead of using Firestore orderBy
        usersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        console.log('Processed users:', usersData);
        setUsers(usersData);
        setLoading(false);
      }, (error) => {
        console.error('Firestore error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = "Failed to fetch users";
        
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
        console.log('Cleaning up users Firestore listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up users Firestore listener:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize users data",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast, currentOrganization]);

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!currentOrganization) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding user:', userData);
      await addDoc(collection(db, 'users'), {
        ...userData,
        organizationId: currentOrganization.id,
        createdAt: new Date(),
      });
      
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      console.log('Updating user:', id, userData);
      await updateDoc(doc(db, 'users', id), userData);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      console.log('Deleting user:', id);
      await deleteDoc(doc(db, 'users', id));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
  };
}
