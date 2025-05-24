
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type TripRecord = {
  id?: string;
  vehicleId: string;
  vehicleRegNumber: string;
  driverId: string;
  driverName: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime?: Date;
  startMileage: number;
  endMileage?: number;
  distance?: number;
  fuelUsed?: number;
  fuelCost?: number;
  purpose: 'business' | 'personal' | 'maintenance' | 'delivery' | 'other';
  status: 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useFirebaseTrips() {
  const [tripRecords, setTripRecords] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for trip records
  useEffect(() => {
    const tripsRef = collection(db, 'trip_records');
    const q = query(tripsRef, orderBy('startTime', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tripData: TripRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          tripData.push({
            id: doc.id,
            ...data,
            startTime: data.startTime?.toDate() || new Date(),
            endTime: data.endTime?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as TripRecord);
        });
        setTripRecords(tripData);
        setLoading(false);
        setError(null);
        console.log('Trip records loaded:', tripData.length);
      },
      (err) => {
        console.error('Error fetching trip records:', err);
        setError('Failed to fetch trip records');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new trip record
  const addTripRecord = async (record: Omit<TripRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'trip_records'), {
        ...record,
        createdAt: now,
        updatedAt: now
      });
      console.log('Trip record added successfully');
    } catch (err) {
      console.error('Error adding trip record:', err);
      throw new Error('Failed to add trip record');
    }
  };

  // Update a trip record (for completing trips)
  const updateTripRecord = async (id: string, updates: Partial<TripRecord>) => {
    try {
      const tripRef = doc(db, 'trip_records', id);
      await updateDoc(tripRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Trip record updated successfully');
    } catch (err) {
      console.error('Error updating trip record:', err);
      throw new Error('Failed to update trip record');
    }
  };

  // Get trips for a specific vehicle
  const getTripsByVehicle = (vehicleId: string) => {
    return tripRecords.filter(trip => trip.vehicleId === vehicleId);
  };

  // Get trips for a specific driver
  const getTripsByDriver = (driverId: string) => {
    return tripRecords.filter(trip => trip.driverId === driverId);
  };

  // Get ongoing trips
  const getOngoingTrips = () => {
    return tripRecords.filter(trip => trip.status === 'ongoing');
  };

  return {
    tripRecords,
    loading,
    error,
    addTripRecord,
    updateTripRecord,
    getTripsByVehicle,
    getTripsByDriver,
    getOngoingTrips
  };
}
