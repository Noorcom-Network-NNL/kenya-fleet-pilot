import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  active: boolean;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setIsAdmin(false);
        setUser(null);
        setAdminUser(null);
        return;
      }

      setUser(user);

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (adminError || !adminData) {
        console.log('No admin access found:', adminError?.message);
        setIsAdmin(false);
        setAdminUser(null);
        return;
      }

      setIsAdmin(true);
      setAdminUser(adminData);
      
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive",
      });
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAdmin,
    isLoading,
    user,
    adminUser,
    checkAdminAccess
  };
}