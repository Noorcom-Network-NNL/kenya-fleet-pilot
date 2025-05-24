
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseVehicles, Vehicle } from '@/hooks/useFirebaseVehicles';
import { useToast } from '@/hooks/use-toast';

export function AddVehicleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addVehicle } = useFirebaseVehicles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    regNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active' as Vehicle['status'],
    driver: '',
    fuelLevel: 100,
    insurance: '',
    nextService: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addVehicle(formData);
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      
      // Reset form
      setFormData({
        regNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        status: 'active',
        driver: '',
        fuelLevel: 100,
        insurance: '',
        nextService: ''
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regNumber">Registration Number</Label>
              <Input
                id="regNumber"
                value={formData.regNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, regNumber: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="driver">Driver</Label>
              <Input
                id="driver"
                value={formData.driver}
                onChange={(e) => setFormData(prev => ({ ...prev, driver: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Vehicle['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                value={formData.insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
                placeholder="e.g., Valid until 15 Dec 2024"
              />
            </div>
            
            <div>
              <Label htmlFor="nextService">Next Service</Label>
              <Input
                id="nextService"
                value={formData.nextService}
                onChange={(e) => setFormData(prev => ({ ...prev, nextService: e.target.value }))}
                placeholder="e.g., 10,000 km (2,000 remaining)"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
