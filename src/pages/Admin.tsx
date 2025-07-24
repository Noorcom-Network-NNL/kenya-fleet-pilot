import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminOrganizations } from '@/components/admin/AdminOrganizations';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminBilling } from '@/components/admin/AdminBilling';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, isLoading, user } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin panel. Please contact your system administrator.
            </p>
            <p className="text-sm text-muted-foreground">
              User: {user?.email || 'Not logged in'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'organizations':
        return <AdminOrganizations />;
      case 'users':
        return <AdminUsers />;
      case 'billing':
        return <AdminBilling />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}