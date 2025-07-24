import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  Palette,
  Shield
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { usePermissions } from '@/hooks/usePermissions';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Menu items with their required permissions
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { id: 'organizations', label: 'Organizations', icon: Building2, permission: 'view_all_organizations' },
  { id: 'users', label: 'Admin Users', icon: Users, permission: 'manage_all_users_orgs' },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard, permission: 'access_billing_all_orgs' },
  { id: 'settings', label: 'System Settings', icon: Settings, permission: 'manage_platform_settings' },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { hasPermission, isSuperAdmin, userRole } = usePermissions();

  const getAvailableMenuItems = () => {
    return menuItems.filter(item => {
      // Dashboard is always available to any admin
      if (!item.permission) return true;
      
      // Check specific permission
      return hasPermission(item.permission);
    });
  };

  const availableMenuItems = getAvailableMenuItems();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">
              {isSuperAdmin() ? 'Super Admin' : 'Organization Admin'}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* White Label section only for Super Admins */}
        {isSuperAdmin() && (
          <SidebarGroup>
            <SidebarGroupLabel>White Label</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onTabChange('branding')}
                    isActive={activeTab === 'branding'}
                    className="w-full"
                  >
                    <Palette className="h-4 w-4" />
                    <span>Branding Manager</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}