
import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function MainLayout({ children, title }: MainLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'w-full' : ''}`}>
        <Header title={title} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
