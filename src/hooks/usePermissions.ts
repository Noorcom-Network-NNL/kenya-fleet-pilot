import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AdminRole = 'super_admin' | 'admin';

export interface Permission {
  action: string;
  superAdmin: boolean;
  orgAdmin: boolean;
}

// Permission matrix based on the specification
const PERMISSIONS: Permission[] = [
  { action: 'manage_platform_settings', superAdmin: true, orgAdmin: false },
  { action: 'view_all_organizations', superAdmin: true, orgAdmin: false },
  { action: 'manage_all_users_orgs', superAdmin: true, orgAdmin: false },
  { action: 'access_billing_all_orgs', superAdmin: true, orgAdmin: false },
  { action: 'create_edit_org_users', superAdmin: false, orgAdmin: true },
  { action: 'access_org_dashboards', superAdmin: false, orgAdmin: true },
  { action: 'assign_roles_within_org', superAdmin: false, orgAdmin: true },
];

export function usePermissions() {
  const [userRole, setUserRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setUserRole(null);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (adminError || !adminData) {
        setUserRole(null);
        return;
      }

      setUserRole(adminData.role as AdminRole);
      
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (action: string): boolean => {
    if (!userRole) return false;

    const permission = PERMISSIONS.find(p => p.action === action);
    if (!permission) return false;

    if (userRole === 'super_admin') {
      return permission.superAdmin;
    }
    
    if (userRole === 'admin') {
      return permission.orgAdmin;
    }

    return false;
  };

  const isSuperAdmin = (): boolean => {
    return userRole === 'super_admin';
  };

  const isOrgAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isAnyAdmin = (): boolean => {
    return userRole === 'super_admin' || userRole === 'admin';
  };

  return {
    userRole,
    loading,
    hasPermission,
    isSuperAdmin,
    isOrgAdmin,
    isAnyAdmin,
    checkUserRole
  };
}