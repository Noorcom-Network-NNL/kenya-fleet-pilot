
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
import { Plus, Search, Filter, Loader2, Wrench } from "lucide-react";
import { useFirebaseMaintenance } from "@/hooks/useFirebaseMaintenance";
import { AddMaintenanceForm } from "@/components/maintenance/AddMaintenanceForm";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    case "in_progress":
      return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "routine":
      return <Badge variant="outline">Routine</Badge>;
    case "repair":
      return <Badge className="bg-red-100 text-red-800">Repair</Badge>;
    case "inspection":
      return <Badge className="bg-purple-100 text-purple-800">Inspection</Badge>;
    case "oil_change":
      return <Badge className="bg-blue-100 text-blue-800">Oil Change</Badge>;
    case "tire_change":
      return <Badge className="bg-orange-100 text-orange-800">Tire Change</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const Maintenance = () => {
  const { maintenanceRecords, loading, error } = useFirebaseMaintenance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (error) {
    return (
      <MainLayout title="Maintenance Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading maintenance records: {error}</p>
            <p className="text-gray-500">Please check your Firebase configuration</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Maintenance Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Maintenance Records</h2>
          <p className="text-sm text-gray-500">Track and manage vehicle maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <AddMaintenanceForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search maintenance records..." 
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
            <span className="ml-2">Loading maintenance records...</span>
          </div>
        ) : maintenanceRecords.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No maintenance records found</p>
              <p className="text-gray-500 text-sm">Add your first maintenance record to get started</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Service Provider</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="bg-noorcom-100 rounded-md p-1">
                          <Wrench className="h-4 w-4 text-noorcom-600" />
                        </div>
                        {record.vehicleRegNumber}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(record.type)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {record.description}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.scheduledDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>KES {record.cost.toLocaleString()}</TableCell>
                    <TableCell>{record.serviceProvider}</TableCell>
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

export default Maintenance;
