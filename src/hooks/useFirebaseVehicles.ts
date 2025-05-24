
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

export type Vehicle = {
  id?: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'idle' | 'issue';
  driver: string;
  fuelLevel: number;
  insurance: string;
  nextService: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useFirebaseVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for vehicles
  useEffect(() => {
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const vehicleData: Vehicle[] = [];
        snapshot.forEach((doc) => {
          vehicleData.push({
            id: doc.id,
            ...doc.data()
          } as Vehicle);
        });
        setVehicles(vehicleData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new vehicle
  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        createdAt: now,
        updatedAt: now
      });
      console.log('Vehicle added successfully');
    } catch (err) {
      console.error('Error adding vehicle:', err);
      throw new Error('Failed to add vehicle');
    }
  };

  // Update a vehicle
  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const vehicleRef = doc(db, 'vehicles', id);
      await updateDoc(vehicleRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Vehicle updated successfully');
    } catch (err) {
      console.error('Error updating vehicle:', err);
      throw new Error('Failed to update vehicle');
    }
  };

  // Delete a vehicle
  const deleteVehicle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      console.log('Vehicle deleted successfully');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      throw new Error('Failed to delete vehicle');
    }
  };

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
}
