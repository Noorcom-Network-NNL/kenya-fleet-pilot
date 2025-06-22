
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrganizationSelector } from "@/components/saas/OrganizationSelector";

const Organizations = () => {
  return (
    <MainLayout title="Organizations">
      <OrganizationSelector />
    </MainLayout>
  );
};

export default Organizations;
