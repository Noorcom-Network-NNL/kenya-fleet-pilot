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
import { Plus, Search, Filter, Loader2, MapPin, Navigation, Eye } from "lucide-react";
import { useFirebaseTrips } from "@/hooks/useFirebaseTrips";
import { AddTripForm } from "@/components/trips/AddTripForm";
import { RealTimeTracker } from "@/components/tracking/RealTimeTracker";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ongoing":
      return <Badge className="bg-blue-100 text-blue-800">Ongoing</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPurposeBadge = (purpose: string) => {
  switch (purpose) {
    case "business":
      return <Badge className="bg-purple-100 text-purple-800">Business</Badge>;
    case "personal":
      return <Badge className="bg-gray-100 text-gray-800">Personal</Badge>;
    case "maintenance":
      return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
    case "delivery":
      return <Badge className="bg-blue-100 text-blue-800">Delivery</Badge>;
    default:
      return <Badge variant="outline">{purpose}</Badge>;
  }
};

const Tracking = () => {
  const { tripRecords, loading, error } = useFirebaseTrips();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);

  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip);
    setIsTrackingDialogOpen(true);
  };

  if (error) {
    return (
      <MainLayout title="Vehicle Tracking">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading trip records: {error}</p>
            <p className="text-gray-500">Please check your Firebase configuration</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Vehicle Tracking">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Trip Records</h2>
          <p className="text-sm text-gray-500">Track vehicle journeys and monitor fleet activity</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Start Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddTripForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Real-time Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          {selectedTrip && (
            <RealTimeTracker 
              tripRecord={selectedTrip} 
              onClose={() => setIsTrackingDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search trip records..." 
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
            <span className="ml-2">Loading trip records...</span>
          </div>
        ) : tripRecords.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No trip records found</p>
              <p className="text-gray-500 text-sm">Start your first trip to begin tracking</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripRecords.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-noorcom-100 rounded-md p-1">
                          <MapPin className="h-4 w-4 text-noorcom-600" />
                        </div>
                        {trip.vehicleRegNumber}
                      </div>
                    </TableCell>
                    <TableCell>{trip.driverName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{trip.startLocation}</div>
                        <div className="text-gray-500">→ {trip.endLocation}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPurposeBadge(trip.purpose)}</TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                    <TableCell>
                      {trip.startTime.toLocaleDateString()} {trip.startTime.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {trip.distance ? `${trip.distance} km` : '-'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewTrip(trip)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Track Live
                      </Button>
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

export default Tracking;
