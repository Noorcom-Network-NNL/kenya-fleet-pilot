import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  Car,
  Fuel,
  Wrench,
  Route
} from 'lucide-react';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  totalVehicles: number;
  monthlyRevenue: number;
  recentActivities: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalUsers: 0,
    totalVehicles: 0,
    monthlyRevenue: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get organization stats
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('id, subscription_status, created_at');

      if (orgsError) throw orgsError;

      // Get user stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, status');

      if (profilesError) throw profilesError;

      // Get vehicle stats
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id');

      if (vehiclesError) throw vehiclesError;

      // Get recent billing events
      const { data: billingEvents, error: billingError } = await supabase
        .from('billing_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (billingError) throw billingError;

      // Calculate monthly revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = billingEvents
        ?.filter(event => {
          const eventDate = new Date(event.created_at);
          return eventDate.getMonth() === currentMonth && 
                 eventDate.getFullYear() === currentYear &&
                 event.event_type === 'payment_success';
        })
        .reduce((sum, event) => sum + (event.amount || 0), 0) || 0;

      setStats({
        totalOrganizations: orgs?.length || 0,
        activeOrganizations: orgs?.filter(org => org.subscription_status === 'active').length || 0,
        totalUsers: profiles?.length || 0,
        totalVehicles: vehicles?.length || 0,
        monthlyRevenue: monthlyRevenue / 100, // Convert from cents
        recentActivities: billingEvents || []
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeOrganizations} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Fleet vehicles managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Billing Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent billing events
                </p>
              ) : (
                stats.recentActivities.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.event_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {event.amount && (
                      <div className="text-right">
                        <p className="font-medium">
                          ${(event.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.currency?.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span>Active Organizations</span>
                </div>
                <span className="font-medium">{stats.activeOrganizations}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Growth Rate</span>
                </div>
                <span className="font-medium text-green-600">+12%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>Avg Users/Org</span>
                </div>
                <span className="font-medium">
                  {stats.totalOrganizations > 0 ? Math.round(stats.totalUsers / stats.totalOrganizations) : 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-orange-500" />
                  <span>Avg Vehicles/Org</span>
                </div>
                <span className="font-medium">
                  {stats.totalOrganizations > 0 ? Math.round(stats.totalVehicles / stats.totalOrganizations) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}