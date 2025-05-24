
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseMaintenance, MaintenanceRecord } from '@/hooks/useFirebaseMaintenance';
import { useFirebaseVehicles } from '@/hooks/useFirebaseVehicles';
import { useToast } from '@/hooks/use-toast';

export function AddMaintenanceForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addMaintenanceRecord } = useFirebaseMaintenance();
  const { vehicles } = useFirebaseVehicles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    vehicleRegNumber: '',
    type: 'routine' as MaintenanceRecord['type'],
    description: '',
    cost: 0,
    mileage: 0,
    serviceProvider: '',
    status: 'scheduled' as MaintenanceRecord['status'],
    scheduledDate: new Date().toISOString().split('T')[0],
    nextServiceMileage: 0,
    notes: ''
  });

  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    setFormData(prev => ({
      ...prev,
      vehicleId,
      vehicleRegNumber: selectedVehicle?.regNumber || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addMaintenanceRecord({
        ...formData,
        scheduledDate: new Date(formData.scheduledDate),
        nextServiceMileage: formData.nextServiceMileage || undefined
      });
      
      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });
      
      // Reset form
      setFormData({
        vehicleId: '',
        vehicleRegNumber: '',
        type: 'routine',
        description: '',
        cost: 0,
        mileage: 0,
        serviceProvider: '',
        status: 'scheduled',
        scheduledDate: new Date().toISOString().split('T')[0],
        nextServiceMileage: 0,
        notes: ''
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add maintenance record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Maintenance Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={formData.vehicleId} onValueChange={handleVehicleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id!}>
                      {vehicle.regNumber} - {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Maintenance Type</Label>
              <Select value={formData.type} onValueChange={(value: MaintenanceRecord['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Service</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="oil_change">Oil Change</SelectItem>
                  <SelectItem value="tire_change">Tire Change</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of maintenance work"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cost">Cost (KES)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Current Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                value={formData.serviceProvider}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceProvider: e.target.value }))}
                placeholder="Garage/Service center name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: MaintenanceRecord['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="nextServiceMileage">Next Service Mileage (Optional)</Label>
              <Input
                id="nextServiceMileage"
                type="number"
                value={formData.nextServiceMileage}
                onChange={(e) => setFormData(prev => ({ ...prev, nextServiceMileage: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 50000"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the maintenance"
                rows={3}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading || !formData.vehicleId} className="w-full">
            {loading ? 'Adding...' : 'Add Maintenance Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
