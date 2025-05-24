
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type FuelRecord = {
  id?: string;
  vehicleId: string;
  vehicleRegNumber: string;
  driverId: string;
  driverName: string;
  fuelAmount: number; // in liters
  fuelCost: number; // total cost
  pricePerLiter: number;
  odometer: number; // current odometer reading
  fuelStation: string;
  receiptNumber?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useFirebaseFuel() {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for fuel records
  useEffect(() => {
    const fuelRef = collection(db, 'fuel_records');
    const q = query(fuelRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fuelData: FuelRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fuelData.push({
            id: doc.id,
            ...data,
            date: data.date?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as FuelRecord);
        });
        setFuelRecords(fuelData);
        setLoading(false);
        setError(null);
        console.log('Fuel records loaded:', fuelData.length);
      },
      (err) => {
        console.error('Error fetching fuel records:', err);
        setError('Failed to fetch fuel records');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new fuel record
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'fuel_records'), {
        ...record,
        createdAt: now,
        updatedAt: now
      });
      console.log('Fuel record added successfully');
    } catch (err) {
      console.error('Error adding fuel record:', err);
      throw new Error('Failed to add fuel record');
    }
  };

  // Get fuel records for a specific vehicle
  const getFuelRecordsByVehicle = (vehicleId: string) => {
    return fuelRecords.filter(record => record.vehicleId === vehicleId);
  };

  return {
    fuelRecords,
    loading,
    error,
    addFuelRecord,
    getFuelRecordsByVehicle
  };
}
