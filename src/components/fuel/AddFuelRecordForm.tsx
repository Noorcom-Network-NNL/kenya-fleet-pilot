
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
    setLoading(true);

    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      const selectedDriver = drivers.find(d => d.id === formData.driverId);

      if (!selectedVehicle || !selectedDriver) {
        throw new Error("Please select both vehicle and driver");
      }

      const fuelAmount = parseFloat(formData.fuelAmount);
      const pricePerLiter = parseFloat(formData.pricePerLiter);
      const fuelCost = fuelAmount * pricePerLiter;

      await addFuelRecord({
        vehicleId: formData.vehicleId,
        vehicleRegNumber: selectedVehicle.regNumber,
        driverId: formData.driverId,
        driverName: selectedDriver.name,
        fuelAmount,
        fuelCost,
        pricePerLiter,
        odometer: parseInt(formData.odometer),
        fuelStation: formData.fuelStation,
        receiptNumber: formData.receiptNumber || undefined,
        date: new Date(formData.date)
      });

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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicle">Vehicle</Label>
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
          <Label htmlFor="driver">Driver</Label>
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
          <Label htmlFor="fuelAmount">Fuel Amount (Liters)</Label>
          <Input
            type="number"
            step="0.1"
            value={formData.fuelAmount}
            onChange={(e) => setFormData({...formData, fuelAmount: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="pricePerLiter">Price per Liter</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.pricePerLiter}
            onChange={(e) => setFormData({...formData, pricePerLiter: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="odometer">Odometer Reading (km)</Label>
          <Input
            type="number"
            value={formData.odometer}
            onChange={(e) => setFormData({...formData, odometer: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="fuelStation">Fuel Station</Label>
          <Input
            value={formData.fuelStation}
            onChange={(e) => setFormData({...formData, fuelStation: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="receiptNumber">Receipt Number (Optional)</Label>
          <Input
            value={formData.receiptNumber}
            onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Fuel Record
        </Button>
      </div>
    </form>
  );
}
