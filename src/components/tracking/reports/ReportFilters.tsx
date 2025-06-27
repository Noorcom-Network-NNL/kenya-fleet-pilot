
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportFiltersProps {
  dateFrom?: Date;
  dateTo?: Date;
  selectedVehicle: string;
  selectedDriver: string;
  selectedStatus: string;
  selectedPurpose: string;
  vehicles: string[];
  drivers: string[];
  statuses: string[];
  purposes: string[];
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onVehicleChange: (value: string) => void;
  onDriverChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ReportFilters({
  dateFrom,
  dateTo,
  selectedVehicle,
  selectedDriver,
  selectedStatus,
  selectedPurpose,
  vehicles,
  drivers,
  statuses,
  purposes,
  onDateFromChange,
  onDateToChange,
  onVehicleChange,
  onDriverChange,
  onStatusChange,
  onPurposeChange,
  onClearFilters
}: ReportFiltersProps) {
  const hasActiveFilters = dateFrom || dateTo || selectedVehicle !== 'all' || selectedDriver !== 'all' || selectedStatus !== 'all' || selectedPurpose !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Options
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {[dateFrom, dateTo, selectedVehicle !== 'all' ? 1 : 0, selectedDriver !== 'all' ? 1 : 0, selectedStatus !== 'all' ? 1 : 0, selectedPurpose !== 'all' ? 1 : 0].filter(Boolean).length} active
            </Badge>
          )}
        </Label>
        <Button variant="outline" size="sm" onClick={onClearFilters} disabled={!hasActiveFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear All Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={onDateFromChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={onDateToChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Vehicle Filter */}
        <div className="space-y-2">
          <Label>Vehicle</Label>
          <Select value={selectedVehicle} onValueChange={onVehicleChange}>
            <SelectTrigger>
              <SelectValue placeholder="All vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles ({vehicles.length})</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Driver Filter */}
        <div className="space-y-2">
          <Label>Driver</Label>
          <Select value={selectedDriver} onValueChange={onDriverChange}>
            <SelectTrigger>
              <SelectValue placeholder="All drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers ({drivers.length})</SelectItem>
              {drivers.map(driver => (
                <SelectItem key={driver} value={driver}>{driver}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses ({statuses.length})</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purpose Filter */}
        <div className="space-y-2">
          <Label>Purpose</Label>
          <Select value={selectedPurpose} onValueChange={onPurposeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All purposes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes ({purposes.length})</SelectItem>
              {purposes.map(purpose => (
                <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
