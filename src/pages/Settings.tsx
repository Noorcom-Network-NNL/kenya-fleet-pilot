
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <MainLayout title="System Settings">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="min-h-[400px]">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <p className="text-gray-500">
                  Configure general system settings and preferences.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="min-h-[400px]">
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <p className="text-gray-500">
                  Configure how and when you receive notifications.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="users">
              <div className="min-h-[400px]">
                <h3 className="text-lg font-medium mb-4">User Management</h3>
                <p className="text-gray-500">
                  Add, edit, and manage users and their permissions.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="integrations">
              <div className="min-h-[400px]">
                <h3 className="text-lg font-medium mb-4">Integrations</h3>
                <p className="text-gray-500">
                  Connect with third-party services and APIs.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Settings;
