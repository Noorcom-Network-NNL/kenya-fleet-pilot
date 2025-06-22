import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirebaseFuel } from "@/hooks/useFirebaseFuel";
import { useFirebaseVehicles } from "@/hooks/useFirebaseVehicles";
import { useFirebaseDrivers } from "@/hooks/useFirebaseDrivers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AddFuelRecordForm() {
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    fuelAmount: "",
    pricePerLiter: "",
    odometer: "",
    fuelStation: "",
    receiptNumber: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const { addFuelRecord } = useFirebaseFuel();
  const { vehicles } = useFirebaseVehicles();
  const { drivers } = useFirebaseDrivers();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FUEL RECORD SUBMISSION STARTED ===');
    console.log('Form data:', formData);
    console.log('Available vehicles:', vehicles.length);
    console.log('Available drivers:', drivers.length);
    
    // Validation
    if (!formData.vehicleId || !formData.driverId) {
      console.log('Validation failed: Missing vehicle or driver');
      toast({
        title: "Validation Error",
        description: "Please select both vehicle and driver",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fuelAmount || !formData.pricePerLiter || !formData.odometer || !formData.fuelStation) {
      console.log('Validation failed: Missing required fields');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const fuelAmount = parseFloat(formData.fuelAmount);
    const pricePerLiter = parseFloat(formData.pricePerLiter);
    const odometer = parseInt(formData.odometer);

    console.log('Parsed values:', { fuelAmount, pricePerLiter, odometer });

    // Additional validation
    if (isNaN(fuelAmount) || fuelAmount <= 0 || fuelAmount > 500) {
      console.log('Validation failed: Invalid fuel amount');
      toast({
        title: "Validation Error",
        description: "Fuel amount must be between 0.1 and 500 liters",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(pricePerLiter) || pricePerLiter <= 0 || pricePerLiter > 1000) {
      console.log('Validation failed: Invalid price per liter');
      toast({
        title: "Validation Error",
        description: "Price per liter must be between 0.01 and 1000 KES",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(odometer) || odometer < 0 || odometer > 9999999) {
      console.log('Validation failed: Invalid odometer');
      toast({
        title: "Validation Error",
        description: "Please enter a valid odometer reading",
        variant: "destructive",
      });
      return;
    }

    console.log('All validations passed');
    setLoading(true);

    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      const selectedDriver = drivers.find(d => d.id === formData.driverId);

      console.log('Looking for vehicle with ID:', formData.vehicleId);
      console.log('Looking for driver with ID:', formData.driverId);
      console.log('Found vehicle:', selectedVehicle);
      console.log('Found driver:', selectedDriver);

      if (!selectedVehicle) {
        console.error('Vehicle not found with ID:', formData.vehicleId);
        throw new Error("Selected vehicle not found. Please refresh the page and try again.");
      }

      if (!selectedDriver) {
        console.error('Driver not found with ID:', formData.driverId);
        throw new Error("Selected driver not found. Please refresh the page and try again.");
      }

      const fuelCost = fuelAmount * pricePerLiter;
      const recordData = {
        vehicleId: formData.vehicleId,
        vehicleRegNumber: selectedVehicle.regNumber,
        driverId: formData.driverId,
        driverName: selectedDriver.name,
        fuelAmount,
        fuelCost,
        pricePerLiter,
        odometer,
        fuelStation: formData.fuelStation.trim(),
        receiptNumber: formData.receiptNumber?.trim() || undefined,
        date: new Date(formData.date)
      };

      console.log('=== FINAL RECORD DATA ===');
      console.log(JSON.stringify(recordData, null, 2));
      console.log('=== CALLING addFuelRecord ===');
      
      await addFuelRecord(recordData);

      console.log('=== RECORD ADDED SUCCESSFULLY ===');

      // Reset form
      setFormData({
        vehicleId: "",
        driverId: "",
        fuelAmount: "",
        pricePerLiter: "",
        odometer: "",
        fuelStation: "",
        receiptNumber: "",
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Success",
        description: "Fuel record added successfully",
      });

    } catch (error: any) {
      console.error('=== ERROR OCCURRED ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Full error object:', error);
      console.error('Error stack:', error?.stack);
      
      toast({
        title: "Error",
        description: error?.message || "Failed to add fuel record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('=== SUBMISSION PROCESS COMPLETED ===');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicle">Vehicle *</Label>
          <Select value={formData.vehicleId} onValueChange={(value) => setFormData({...formData, vehicleId: value})}>
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
          <Label htmlFor="driver">Driver *</Label>
          <Select value={formData.driverId} onValueChange={(value) => setFormData({...formData, driverId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id!}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fuelAmount">Fuel Amount (Liters) *</Label>
          <Input
            type="number"
            step="0.1"
            min="0.1"
            max="500"
            value={formData.fuelAmount}
            onChange={(e) => setFormData({...formData, fuelAmount: e.target.value})}
            placeholder="e.g., 50.5"
            required
          />
        </div>

        <div>
          <Label htmlFor="pricePerLiter">Price per Liter (KES) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            max="1000"
            value={formData.pricePerLiter}
            onChange={(e) => setFormData({...formData, pricePerLiter: e.target.value})}
            placeholder="e.g., 123.50"
            required
          />
        </div>

        <div>
          <Label htmlFor="odometer">Odometer Reading (km) *</Label>
          <Input
            type="number"
            min="0"
            max="9999999"
            value={formData.odometer}
            onChange={(e) => setFormData({...formData, odometer: e.target.value})}
            placeholder="e.g., 58000"
            required
          />
        </div>

        <div>
          <Label htmlFor="fuelStation">Fuel Station *</Label>
          <Input
            value={formData.fuelStation}
            onChange={(e) => setFormData({...formData, fuelStation: e.target.value})}
            placeholder="e.g., Total Petrol Station"
            required
          />
        </div>

        <div>
          <Label htmlFor="receiptNumber">Receipt Number (Optional)</Label>
          <Input
            value={formData.receiptNumber}
            onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
            placeholder="e.g., RCP123456"
          />
        </div>

        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
      </div>

      {/* Display calculated total cost */}
      {formData.fuelAmount && formData.pricePerLiter && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Total Cost: KES {(parseFloat(formData.fuelAmount || '0') * parseFloat(formData.pricePerLiter || '0')).toFixed(2)}</strong>
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Fuel Record
        </Button>
      </div>
    </form>
  );
}
