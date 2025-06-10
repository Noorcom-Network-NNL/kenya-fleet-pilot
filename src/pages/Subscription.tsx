
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SubscriptionManagement } from "@/components/saas/SubscriptionManagement";

const Subscription = () => {
  return (
    <MainLayout title="Subscription & Billing">
      <SubscriptionManagement />
    </MainLayout>
  );
};

export default Subscription;
