import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualPaymentValidation } from '@/components/admin/ManualPaymentValidation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillingEvent {
  id: string;
  organization_id: string;
  event_type: string;
  stripe_event_id: string;
  amount: number;
  currency: string;
  description: string;
  metadata: any;
  created_at: string;
  organization?: {
    name: string;
    slug: string;
  };
}

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  monthlyTransactions: number;
  averageTransactionValue: number;
}

export function AdminBilling() {
  const [billingEvents, setBillingEvents] = useState<BillingEvent[]>([]);
  const [stats, setStats] = useState<BillingStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    monthlyTransactions: 0,
    averageTransactionValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);

      // Get billing events with organization details
      const { data: events, error: eventsError } = await supabase
        .from('billing_events')
        .select(`
          *,
          organization:organizations(name, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      setBillingEvents(events || []);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const totalRevenue = events
        ?.filter(event => event.event_type === 'payment_success')
        .reduce((sum, event) => sum + (event.amount || 0), 0) || 0;

      const monthlyRevenue = events
        ?.filter(event => {
          const eventDate = new Date(event.created_at);
          return eventDate.getMonth() === currentMonth && 
                 eventDate.getFullYear() === currentYear &&
                 event.event_type === 'payment_success';
        })
        .reduce((sum, event) => sum + (event.amount || 0), 0) || 0;

      const totalTransactions = events?.length || 0;
      const monthlyTransactions = events
        ?.filter(event => {
          const eventDate = new Date(event.created_at);
          return eventDate.getMonth() === currentMonth && 
                 eventDate.getFullYear() === currentYear;
        }).length || 0;

      const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      setStats({
        totalRevenue: totalRevenue / 100, // Convert from cents
        monthlyRevenue: monthlyRevenue / 100,
        totalTransactions,
        monthlyTransactions,
        averageTransactionValue: averageTransactionValue / 100,
      });

    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportBillingData = () => {
    // TODO: Implement CSV export
    toast({
      title: "Export Started",
      description: "Billing data export will be available soon",
    });
  };

  const filteredEvents = billingEvents.filter(event => {
    const matchesSearch = 
      event.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = eventTypeFilter === 'all' || event.event_type === eventTypeFilter;

    return matchesSearch && matchesFilter;
  });

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'payment_success': return 'bg-green-100 text-green-800';
      case 'payment_failed': return 'bg-red-100 text-red-800';
      case 'subscription_created': return 'bg-blue-100 text-blue-800';
      case 'subscription_cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <Button onClick={exportBillingData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="validation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="validation">Payment Validation</TabsTrigger>
          <TabsTrigger value="events">Billing Events</TabsTrigger>
        </TabsList>

        <TabsContent value="validation">
          <ManualPaymentValidation />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyTransactions} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="payment_success">Payment Success</SelectItem>
            <SelectItem value="payment_failed">Payment Failed</SelectItem>
            <SelectItem value="subscription_created">Subscription Created</SelectItem>
            <SelectItem value="subscription_cancelled">Subscription Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Billing Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Billing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No billing events found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || eventTypeFilter !== 'all' ? 'No events match your filters.' : 'No billing events recorded yet.'}
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{event.organization?.name || 'Unknown Organization'}</h3>
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {event.event_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleDateString()} at {new Date(event.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {event.amount && (
                    <div className="text-right">
                      <p className="text-lg font-semibold">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}