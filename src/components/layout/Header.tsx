
import React from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header({ title }: { title: string }) {
  const companySettings = useCompanySettings();
  const isMobile = useIsMobile();

  return (
    <header className={`bg-white border-b border-gray-200 px-3 sm:px-6 py-4 flex items-center justify-between ${isMobile ? 'ml-0' : ''}`}>
      <div className={`flex items-center gap-4 min-w-0 ${isMobile ? 'ml-12' : ''}`}>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-noorcom-800 truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{companySettings.companyName}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {!isMobile && (
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search..." 
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-noorcom-500"
            />
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="relative flex-shrink-0">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
