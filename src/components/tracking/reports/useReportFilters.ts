import { useState, useMemo } from 'react';
import { getTripDate, normalizeDate } from './exportUtils';

export function useReportFilters(tripRecords: any[]) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const vehicles = [...new Set(tripRecords.map(trip => trip.vehicleRegNumber))].filter(Boolean);
    const drivers = [...new Set(tripRecords.map(trip => trip.driverName))].filter(Boolean);
    const statuses = [...new Set(tripRecords.map(trip => trip.status))].filter(Boolean);
    const purposes = [...new Set(tripRecords.map(trip => trip.purpose))].filter(Boolean);
    
    return { vehicles, drivers, statuses, purposes };
  }, [tripRecords]);

  // Filter trip records based on selected criteria
  const filteredRecords = useMemo(() => {
    return tripRecords.filter(trip => {
      try {
        const tripDate = getTripDate(trip);
        const normalizedTripDate = normalizeDate(tripDate);
        
        // Date range filter
        if (dateFrom) {
          const normalizedFromDate = normalizeDate(dateFrom);
          if (normalizedTripDate < normalizedFromDate) {
            return false;
          }
        }
        
        if (dateTo) {
          const normalizedToDate = normalizeDate(dateTo);
          if (normalizedTripDate > normalizedToDate) {
            return false;
          }
        }
        
        // Other filters
        if (selectedVehicle !== 'all' && trip.vehicleRegNumber !== selectedVehicle) return false;
        if (selectedDriver !== 'all' && trip.driverName !== selectedDriver) return false;
        if (selectedStatus !== 'all' && trip.status !== selectedStatus) return false;
        if (selectedPurpose !== 'all' && trip.purpose !== selectedPurpose) return false;
        
        return true;
      } catch (error) {
        console.error('Error filtering trip:', trip.id, error);
        return false;
      }
    });
  }, [tripRecords, dateFrom, dateTo, selectedVehicle, selectedDriver, selectedStatus, selectedPurpose]);

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedVehicle('all');
    setSelectedDriver('all');
    setSelectedStatus('all');
    setSelectedPurpose('all');
  };

  const hasActiveFilters = dateFrom || dateTo || selectedVehicle !== 'all' || selectedDriver !== 'all' || selectedStatus !== 'all' || selectedPurpose !== 'all';

  return {
    dateFrom,
    dateTo,
    selectedVehicle,
    selectedDriver,
    selectedStatus,
    selectedPurpose,
    filterOptions,
    filteredRecords,
    hasActiveFilters,
    setDateFrom,
    setDateTo,
    setSelectedVehicle,
    setSelectedDriver,
    setSelectedStatus,
    setSelectedPurpose,
    clearFilters
  };
}
