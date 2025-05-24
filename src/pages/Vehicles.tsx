
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Car, Plus, Search, Filter, Loader2 } from "lucide-react";
import { useFirebaseVehicles } from "@/hooks/useFirebaseVehicles";
import { AddVehicleForm } from "@/components/vehicles/AddVehicleForm";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "maintenance":
      return <Badge className="bg-amber-100 text-amber-800">Maintenance</Badge>;
    case "idle":
      return <Badge className="bg-blue-100 text-blue-800">Idle</Badge>;
    case "issue":
      return <Badge className="bg-red-100 text-red-800">Issue</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Vehicles = () => {
  const { vehicles, loading, error } = useFirebaseVehicles();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (error) {
    return (
      <MainLayout title="Vehicle Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading vehicles: {error}</p>
            <p className="text-gray-500">Please check your Firebase configuration</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Vehicle Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">All Vehicles</h2>
          <p className="text-sm text-gray-500">Manage and monitor your fleet vehicles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddVehicleForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search vehicles..." 
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading vehicles...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No vehicles found</p>
              <p className="text-gray-500 text-sm">Add your first vehicle to get started</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-noorcom-100 rounded-md p-1">
                          <Car className="h-4 w-4 text-noorcom-600" />
                        </div>
                        {vehicle.regNumber}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>{vehicle.driver}</TableCell>
                    <TableCell className={vehicle.insurance.includes("Expired") ? "text-red-600" : ""}>
                      {vehicle.insurance || "Not specified"}
                    </TableCell>
                    <TableCell className={vehicle.nextService.includes("Due") ? "text-red-600" : ""}>
                      {vehicle.nextService || "Not specified"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Vehicles;
