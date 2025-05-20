
import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter } from "lucide-react";

const driverData = [
  { 
    id: 1, 
    name: "John Mwangi",
    phone: "+254 712 345678",
    license: "D123456789", 
    licenseExpiry: "15 Dec 2023",
    status: "active",
    performance: "excellent",
    assignedVehicle: "KBZ 123A"
  },
  { 
    id: 2, 
    name: "Sarah Wanjiku",
    phone: "+254 723 456789",
    license: "D987654321", 
    licenseExpiry: "23 Mar 2024",
    status: "inactive",
    performance: "good",
    assignedVehicle: "KCY 456B"
  },
  { 
    id: 3, 
    name: "David Kariuki",
    phone: "+254 734 567890",
    license: "D456789123", 
    licenseExpiry: "08 Jul 2024",
    status: "active",
    performance: "excellent",
    assignedVehicle: "KDA 789C"
  },
  { 
    id: 4, 
    name: "Mary Akinyi",
    phone: "+254 745 678901",
    license: "D234567891", 
    licenseExpiry: "30 May 2024",
    status: "active",
    performance: "average",
    assignedVehicle: "KBD 321D"
  },
  { 
    id: 5, 
    name: "Peter Omondi",
    phone: "+254 756 789012",
    license: "D345678912", 
    licenseExpiry: "01 Apr 2023",
    status: "inactive",
    performance: "poor",
    assignedVehicle: "-"
  },
];

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
  return (
    <MainLayout title="Driver Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">All Drivers</h2>
          <p className="text-sm text-gray-500">Manage and monitor your fleet drivers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
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
              {driverData.map((driver) => (
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
                  <TableCell>{driver.assignedVehicle}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Drivers;
