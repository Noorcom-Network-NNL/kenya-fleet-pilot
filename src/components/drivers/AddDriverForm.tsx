
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseDrivers, Driver } from '@/hooks/useFirebaseDrivers';
import { useToast } from '@/hooks/use-toast';

export function AddDriverForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addDriver } = useFirebaseDrivers();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
    licenseExpiry: '',
    status: 'active' as Driver['status'],
    performance: 'good' as Driver['performance'],
    assignedVehicle: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDriver(formData);
      toast({
        title: "Success",
        description: "Driver added successfully",
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        license: '',
        licenseExpiry: '',
        status: 'active',
        performance: 'good',
        assignedVehicle: ''
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Driver</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+254 712 345678"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={formData.license}
                onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="licenseExpiry">License Expiry</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Driver['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="performance">Performance</Label>
              <Select value={formData.performance} onValueChange={(value: Driver['performance']) => setFormData(prev => ({ ...prev, performance: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="assignedVehicle">Assigned Vehicle (Optional)</Label>
              <Input
                id="assignedVehicle"
                value={formData.assignedVehicle}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedVehicle: e.target.value }))}
                placeholder="e.g., KBZ 123A"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
