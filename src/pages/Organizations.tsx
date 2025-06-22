
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationSelector } from "@/components/saas/OrganizationSelector";

const Organizations = () => {
  return (
    <MainLayout title="Organizations">
      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationSelector />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Organizations;
