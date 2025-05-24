
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: Date;
}

export function useFirebaseUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as User[];
      
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'users'), {
        ...userData,
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
