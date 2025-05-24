
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Driver = {
  id?: string;
  name: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  status: 'active' | 'inactive';
  performance: 'excellent' | 'good' | 'average' | 'poor';
  assignedVehicle: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useFirebaseDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for drivers
  useEffect(() => {
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const driverData: Driver[] = [];
        snapshot.forEach((doc) => {
          driverData.push({
            id: doc.id,
            ...doc.data()
          } as Driver);
        });
        setDrivers(driverData);
        setLoading(false);
        setError(null);
        console.log('Drivers loaded:', driverData.length);
      },
      (err) => {
        console.error('Error fetching drivers:', err);
        setError('Failed to fetch drivers');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new driver
  const addDriver = async (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'drivers'), {
        ...driver,
        createdAt: now,
        updatedAt: now
      });
      console.log('Driver added successfully');
    } catch (err) {
      console.error('Error adding driver:', err);
      throw new Error('Failed to add driver');
    }
  };

  // Update a driver
  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      const driverRef = doc(db, 'drivers', id);
      await updateDoc(driverRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Driver updated successfully');
    } catch (err) {
      console.error('Error updating driver:', err);
      throw new Error('Failed to update driver');
    }
  };

  // Delete a driver
  const deleteDriver = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'drivers', id));
      console.log('Driver deleted successfully');
    } catch (err) {
      console.error('Error deleting driver:', err);
      throw new Error('Failed to delete driver');
    }
  };

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver
  };
}
