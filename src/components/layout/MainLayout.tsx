
import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
