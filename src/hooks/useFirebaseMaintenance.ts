
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

export type MaintenanceRecord = {
  id?: string;
  vehicleId: string;
  vehicleRegNumber: string;
  type: 'routine' | 'repair' | 'inspection' | 'oil_change' | 'tire_change' | 'other';
  description: string;
  cost: number;
  mileage: number;
  serviceProvider: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate?: Date;
  nextServiceMileage?: number;
  partsReplaced?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function useFirebaseMaintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for maintenance records
  useEffect(() => {
    const maintenanceRef = collection(db, 'maintenance_records');
    const q = query(maintenanceRef, orderBy('scheduledDate', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const maintenanceData: MaintenanceRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          maintenanceData.push({
            id: doc.id,
            ...data,
            scheduledDate: data.scheduledDate?.toDate() || new Date(),
            completedDate: data.completedDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as MaintenanceRecord);
        });
        setMaintenanceRecords(maintenanceData);
        setLoading(false);
        setError(null);
        console.log('Maintenance records loaded:', maintenanceData.length);
      },
      (err) => {
        console.error('Error fetching maintenance records:', err);
        setError('Failed to fetch maintenance records');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add a new maintenance record
  const addMaintenanceRecord = async (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'maintenance_records'), {
        ...record,
        createdAt: now,
        updatedAt: now
      });
      console.log('Maintenance record added successfully');
    } catch (err) {
      console.error('Error adding maintenance record:', err);
      throw new Error('Failed to add maintenance record');
    }
  };

  // Update a maintenance record
  const updateMaintenanceRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    try {
      const maintenanceRef = doc(db, 'maintenance_records', id);
      await updateDoc(maintenanceRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Maintenance record updated successfully');
    } catch (err) {
      console.error('Error updating maintenance record:', err);
      throw new Error('Failed to update maintenance record');
    }
  };

  // Get maintenance records for a specific vehicle
  const getMaintenanceRecordsByVehicle = (vehicleId: string) => {
    return maintenanceRecords.filter(record => record.vehicleId === vehicleId);
  };

  return {
    maintenanceRecords,
    loading,
    error,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    getMaintenanceRecordsByVehicle
  };
}
