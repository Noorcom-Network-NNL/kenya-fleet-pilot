
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, Loader2, Users, User, Phone, CreditCard, Calendar, Activity, Car } from "lucide-react";
import { useFirebaseDrivers, Driver } from "@/hooks/useFirebaseDrivers";
import { AddDriverForm } from "@/components/drivers/AddDriverForm";
import { DriverExport } from "@/components/drivers/DriverExport";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPerformanceBadge = (performance: string) => {
  switch (performance) {
    case "excellent":
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    case "good":
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    case "average":
      return <Badge className="bg-amber-100 text-amber-800">Average</Badge>;
    case "poor":
      return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
    default:
      return <Badge>{performance}</Badge>;
  }
};

const Drivers = () => {
  const { drivers, loading, error } = useFirebaseDrivers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };

  if (error) {
    return (
      <MainLayout title="Driver Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading drivers: {error}</p>
            <p className="text-gray-500">Please check your Firebase configuration</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Driver Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">All Drivers</h2>
          <p className="text-sm text-gray-500">Manage and monitor your fleet drivers</p>
        </div>
        <div className="flex items-center gap-3">
          <DriverExport drivers={drivers} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <AddDriverForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search drivers..." 
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
            <span className="ml-2">Loading drivers...</span>
          </div>
        ) : drivers.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No drivers found</p>
              <p className="text-gray-500 text-sm">Add your first driver to get started</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>License Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-noorcom-100 text-noorcom-600">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{driver.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.license}</TableCell>
                    <TableCell className={new Date(driver.licenseExpiry) < new Date() ? "text-red-600" : ""}>
                      {driver.licenseExpiry}
                    </TableCell>
                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                    <TableCell>{getPerformanceBadge(driver.performance)}</TableCell>
                    <TableCell>{driver.assignedVehicle || "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDriver(driver)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Driver Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Driver Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-noorcom-100 text-noorcom-600 text-lg">
                        {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedDriver.name}</h3>
                      <p className="text-gray-600">Driver ID: {selectedDriver.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedDriver.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        {getStatusBadge(selectedDriver.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* License Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    License Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{selectedDriver.license}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">License Expiry</p>
                      <p className={`font-medium ${new Date(selectedDriver.licenseExpiry) < new Date() ? 'text-red-600' : ''}`}>
                        {selectedDriver.licenseExpiry}
                        {new Date(selectedDriver.licenseExpiry) < new Date() && 
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">EXPIRED</span>
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance & Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Performance Rating</p>
                      {getPerformanceBadge(selectedDriver.performance)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Assigned Vehicle</p>
                      <p className="font-medium">
                        {selectedDriver.assignedVehicle || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Drivers;
