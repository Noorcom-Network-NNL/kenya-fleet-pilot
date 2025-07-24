
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
    <header className={`bg-white border-b border-gray-200 px-2 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between w-full ${isMobile ? 'ml-0' : ''}`}>
      <div className={`flex items-center gap-2 sm:gap-4 min-w-0 flex-1 ${isMobile ? 'ml-12' : ''}`}>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-noorcom-800 truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">{companySettings.companyName}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        {!isMobile && (
          <div className="relative max-w-xs lg:max-w-md w-full hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search..." 
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-noorcom-500 text-sm"
            />
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="relative flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
}
