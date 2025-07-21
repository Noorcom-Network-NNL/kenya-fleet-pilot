
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OrganizationLoginPage } from "@/components/saas/OrganizationLoginPage";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Fuel from "./pages/Fuel";
import Maintenance from "./pages/Maintenance";
import Tracking from "./pages/Tracking";
import Organizations from "./pages/Organizations";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Login from "./pages/Login";
import SaasLanding from "./pages/SaasLanding";
import SaasOnboarding from "./pages/SaasOnboarding";
import InviteAccept from "./pages/InviteAccept";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<SaasLanding />} />
            <Route path="/onboarding" element={<SaasOnboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/invite/:token" element={<InviteAccept />} />
            <Route path="/:orgSlug/login" element={<OrganizationLoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            } />
            <Route path="/drivers" element={
              <ProtectedRoute>
                <Drivers />
              </ProtectedRoute>
            } />
            <Route path="/fuel" element={
              <ProtectedRoute>
                <Fuel />
              </ProtectedRoute>
            } />
            <Route path="/maintenance" element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            } />
            <Route path="/organizations" element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
