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
    console.log('Setting up fuel records listener...');
    const fuelRef = collection(db, 'fuel_records');
    const q = query(fuelRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Fuel records snapshot received, docs count:', snapshot.size);
        const fuelData: FuelRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Processing fuel record doc:', doc.id, data);
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
        console.log('Fuel records loaded successfully:', fuelData.length);
      },
      (err) => {
        console.error('Error in fuel records listener:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        setError('Failed to fetch fuel records: ' + err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up fuel records listener');
      unsubscribe();
    };
  }, []);

  // Add a new fuel record
  const addFuelRecord = async (record: Omit<FuelRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('=== STARTING addFuelRecord ===');
    console.log('Database instance:', db);
    console.log('Record to add:', record);
    
    try {
      const now = new Date();
      
      // Clean the record to remove undefined values
      const cleanRecord: {
        vehicleId: string;
        vehicleRegNumber: string;
        driverId: string;
        driverName: string;
        fuelAmount: number;
        fuelCost: number;
        pricePerLiter: number;
        odometer: number;
        fuelStation: string;
        date: Date;
        createdAt: Date;
        updatedAt: Date;
        receiptNumber?: string;
      } = {
        vehicleId: record.vehicleId,
        vehicleRegNumber: record.vehicleRegNumber,
        driverId: record.driverId,
        driverName: record.driverName,
        fuelAmount: record.fuelAmount,
        fuelCost: record.fuelCost,
        pricePerLiter: record.pricePerLiter,
        odometer: record.odometer,
        fuelStation: record.fuelStation,
        date: record.date,
        createdAt: now,
        updatedAt: now
      };

      // Only add receiptNumber if it's not empty/undefined
      if (record.receiptNumber && record.receiptNumber.trim() !== '') {
        cleanRecord.receiptNumber = record.receiptNumber.trim();
      }
      
      console.log('Adding cleaned record:', cleanRecord);
      console.log('Collection path: fuel_records');
      
      const fuelRef = collection(db, 'fuel_records');
      console.log('Collection reference created:', fuelRef);
      
      const docRef = await addDoc(fuelRef, cleanRecord);
      console.log('Document added successfully with ID:', docRef.id);
      console.log('=== addFuelRecord COMPLETED SUCCESSFULLY ===');
      
    } catch (err: any) {
      console.error('=== ERROR IN addFuelRecord ===');
      console.error('Error type:', typeof err);
      console.error('Error constructor:', err.constructor.name);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error object:', err);
      console.error('Error stack:', err.stack);
      
      // Provide more specific error messages
      if (err.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your Firebase security rules.');
      } else if (err.code === 'unavailable') {
        throw new Error('Database is temporarily unavailable. Please try again.');
      } else if (err.code === 'network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(`Failed to add fuel record: ${err.message || 'Unknown error'}`);
      }
    }
  };

  // Delete a fuel record
  const deleteFuelRecord = async (id: string) => {
    console.log('=== STARTING deleteFuelRecord ===');
    console.log('Record ID to delete:', id);
    
    try {
      await deleteDoc(doc(db, 'fuel_records', id));
      console.log('Fuel record deleted successfully');
    } catch (err: any) {
      console.error('=== ERROR IN deleteFuelRecord ===');
      console.error('Error:', err);
      
      if (err.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your Firebase security rules.');
      } else if (err.code === 'not-found') {
        throw new Error('Fuel record not found.');
      } else {
        throw new Error(`Failed to delete fuel record: ${err.message || 'Unknown error'}`);
      }
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
    deleteFuelRecord,
    getFuelRecordsByVehicle
  };
}
