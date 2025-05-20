
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
import { Car, Plus, Search, Filter } from "lucide-react";

const vehicleData = [
  { 
    id: 1, 
    regNumber: "KBZ 123A", 
    make: "Toyota", 
    model: "Hilux", 
    year: 2021, 
    status: "active",
    insurance: "Valid until 15 Dec 2023",
    nextService: "10,000 km (2,000 remaining)" 
  },
  { 
    id: 2, 
    regNumber: "KCY 456B", 
    make: "Isuzu", 
    model: "D-Max", 
    year: 2020, 
    status: "maintenance",
    insurance: "Valid until 23 Mar 2024",
    nextService: "Due now" 
  },
  { 
    id: 3, 
    regNumber: "KDA 789C", 
    make: "Mitsubishi", 
    model: "Pajero", 
    year: 2022, 
    status: "active",
    insurance: "Valid until 08 Jul 2024",
    nextService: "15,000 km (4,500 remaining)" 
  },
  { 
    id: 4, 
    regNumber: "KBD 321D", 
    make: "Nissan", 
    model: "Navara", 
    year: 2019, 
    status: "idle",
    insurance: "Valid until 30 May 2024",
    nextService: "12,000 km (1,200 remaining)" 
  },
  { 
    id: 5, 
    regNumber: "KCA 654E", 
    make: "Toyota", 
    model: "Land Cruiser", 
    year: 2018, 
    status: "issue",
    insurance: "Expired on 01 Apr 2023",
    nextService: "Due now" 
  },
  { 
    id: 6, 
    regNumber: "KDL 987F", 
    make: "Ford", 
    model: "Ranger", 
    year: 2021, 
    status: "active",
    insurance: "Valid until 12 Nov 2023",
    nextService: "20,000 km (8,500 remaining)" 
  },
];

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
  return (
    <MainLayout title="Vehicle Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">All Vehicles</h2>
          <p className="text-sm text-gray-500">Manage and monitor your fleet vehicles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleData.map((vehicle) => (
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
                  <TableCell className={vehicle.insurance.includes("Expired") ? "text-red-600" : ""}>
                    {vehicle.insurance}
                  </TableCell>
                  <TableCell className={vehicle.nextService.includes("Due") ? "text-red-600" : ""}>
                    {vehicle.nextService}
                  </TableCell>
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

export default Vehicles;
