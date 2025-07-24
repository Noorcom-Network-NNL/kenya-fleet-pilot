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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Car, Plus, Search, Filter, Loader2, User, Calendar, Fuel, Settings, MoreVertical, Eye, Trash2 } from "lucide-react";
import { useFirebaseVehicles, Vehicle } from "@/hooks/useFirebaseVehicles";
import { AddVehicleForm } from "@/components/vehicles/AddVehicleForm";
import { VehicleExport } from "@/components/vehicles/VehicleExport";
import { useToast } from "@/hooks/use-toast";

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

const VehicleDetailsModal = ({ vehicle, isOpen, onClose }: { vehicle: Vehicle; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Car className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Vehicle Details - {vehicle.regNumber}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Make & Model</p>
                <p className="font-medium">{vehicle.make} {vehicle.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Driver</p>
                <p className="font-medium">{vehicle.driver}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center">
                <div className="w-3 h-3 rounded-full bg-current"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(vehicle.status)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fuel Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        vehicle.fuelLevel > 70 ? "bg-green-500" : 
                        vehicle.fuelLevel > 30 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Insurance</p>
                <p className={`font-medium ${vehicle.insurance?.includes("Expired") ? "text-red-600" : ""}`}>
                  {vehicle.insurance || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Next Service</p>
                <p className={`font-medium ${vehicle.nextService?.includes("Due") ? "text-red-600" : ""}`}>
                  {vehicle.nextService || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Vehicles = () => {
  const { vehicles, loading, error, deleteVehicle } = useFirebaseVehicles();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewDialogOpen(true);
  };

  const handleDeleteVehicle = async (id: string, regNumber: string) => {
    if (window.confirm(`Are you sure you want to delete vehicle "${regNumber}"? This action cannot be undone.`)) {
      try {
        await deleteVehicle(id);
        toast({
          title: "Vehicle Deleted",
          description: `Vehicle ${regNumber} has been deleted successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete vehicle. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-medium truncate">All Vehicles</h2>
          <p className="text-sm text-gray-500 hidden sm:block">Manage and monitor your fleet vehicles</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <VehicleExport vehicles={vehicles} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-sm">
                <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Vehicle</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <AddVehicleForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <div className="relative max-w-full sm:max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search vehicles..." 
              className="pl-10 bg-gray-50 border-gray-200 text-sm sm:text-base"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base flex-shrink-0">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
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
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[800px] px-3 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Registration</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Make & Model</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Year</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Driver</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Insurance</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Next Service</TableHead>
                    <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="bg-noorcom-100 rounded-md p-1 flex-shrink-0">
                            <Car className="h-3 w-3 sm:h-4 sm:w-4 text-noorcom-600" />
                          </div>
                          <span className="text-xs sm:text-sm truncate">{vehicle.regNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">{vehicle.make} {vehicle.model}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{vehicle.year}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell truncate">{vehicle.driver}</TableCell>
                      <TableCell className={`text-xs sm:text-sm hidden xl:table-cell truncate ${vehicle.insurance?.includes("Expired") ? "text-red-600" : ""}`}>
                        {vehicle.insurance || "Not specified"}
                      </TableCell>
                      <TableCell className={`text-xs sm:text-sm hidden xl:table-cell truncate ${vehicle.nextService?.includes("Due") ? "text-red-600" : ""}`}>
                        {vehicle.nextService || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                            <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteVehicle(vehicle.id!, vehicle.regNumber)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Delete Vehicle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default Vehicles;
