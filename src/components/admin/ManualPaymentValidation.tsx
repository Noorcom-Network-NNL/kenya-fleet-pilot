import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Check, 
  X, 
  Eye, 
  MoreHorizontal,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

interface PaymentRecord {
  id: string;
  organization_id: string;
  amount: number;
  currency: string;
  payment_method: 'mpesa' | 'cash' | 'bank_transfer' | 'other';
  reference_number?: string;
  notes?: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted_by: string;
  submitted_at: string;
  verified_by?: string;
  verified_at?: string;
  organization?: {
    name: string;
    slug: string;
  };
}

interface PaymentStats {
  totalPending: number;
  totalVerified: number;
  totalRejected: number;
  monthlyRevenue: number;
}

export function ManualPaymentValidation() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPending: 0,
    totalVerified: 0,
    totalRejected: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    organizationId: '',
    amount: '',
    currency: 'USD',
    paymentMethod: 'mpesa' as 'mpesa' | 'cash' | 'bank_transfer' | 'other',
    referenceNumber: '',
    notes: '',
  });
  const [organizations, setOrganizations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
    loadOrganizations();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      // Since we don't have the payments table yet, let's create mock data
      // In real implementation, this would query the manual_payments table
      const mockPayments: PaymentRecord[] = [
        {
          id: '1',
          organization_id: '1',
          amount: 5000,
          currency: 'KES',
          payment_method: 'mpesa',
          reference_number: 'QG12345678',
          notes: 'Monthly subscription payment',
          status: 'pending',
          submitted_by: 'client@demo.co.ke',
          submitted_at: new Date().toISOString(),
          organization: { name: 'Demo Organization', slug: 'demo' }
        },
        {
          id: '2',
          organization_id: '2',
          amount: 10000,
          currency: 'KES',
          payment_method: 'cash',
          notes: 'Cash payment for premium plan',
          status: 'verified',
          submitted_by: 'admin@system.com',
          submitted_at: new Date(Date.now() - 86400000).toISOString(),
          verified_by: 'super@admin.com',
          verified_at: new Date(Date.now() - 3600000).toISOString(),
          organization: { name: 'Another Org', slug: 'another' }
        }
      ];

      setPayments(mockPayments);

      // Calculate stats
      const pending = mockPayments.filter(p => p.status === 'pending').length;
      const verified = mockPayments.filter(p => p.status === 'verified').length;
      const rejected = mockPayments.filter(p => p.status === 'rejected').length;
      const monthlyRevenue = mockPayments
        .filter(p => p.status === 'verified')
        .reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalPending: pending,
        totalVerified: verified,
        totalRejected: rejected,
        monthlyRevenue,
      });

    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const validatePayment = async (paymentId: string, status: 'verified' | 'rejected') => {
    try {
      // TODO: Update payment status in database
      toast({
        title: "Success",
        description: `Payment ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
      });
      loadPayments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const addManualPayment = async () => {
    try {
      if (!newPayment.organizationId || !newPayment.amount) {
        toast({
          title: "Validation Error",
          description: "Please fill in required fields",
          variant: "destructive",
        });
        return;
      }

      // TODO: Add to database
      toast({
        title: "Success",
        description: "Payment record added successfully",
      });

      setNewPayment({
        organizationId: '',
        amount: '',
        currency: 'USD',
        paymentMethod: 'mpesa',
        referenceNumber: '',
        notes: '',
      });
      setShowAddPayment(false);
      loadPayments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment record",
        variant: "destructive",
      });
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.submitted_by.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa': return '📱';
      case 'cash': return '💵';
      case 'bank_transfer': return '🏦';
      default: return '💳';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manual Payment Validation</h1>
        <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Manual Payment Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Organization *</Label>
                <Select
                  value={newPayment.organizationId}
                  onValueChange={(value) => setNewPayment(prev => ({ ...prev, organizationId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={newPayment.currency}
                    onValueChange={(value) => setNewPayment(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={newPayment.paymentMethod}
                  onValueChange={(value: 'mpesa' | 'cash' | 'bank_transfer' | 'other') => 
                    setNewPayment(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input
                  value={newPayment.referenceNumber}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, referenceNumber: e.target.value }))}
                  placeholder="Transaction reference"
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddPayment(false)}>
                  Cancel
                </Button>
                <Button onClick={addManualPayment}>
                  Add Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Validation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalVerified}</div>
            <p className="text-xs text-muted-foreground">Approved payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalRejected}</div>
            <p className="text-xs text-muted-foreground">Declined payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Records */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {getPaymentMethodIcon(payment.payment_method)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{payment.organization?.name || 'Unknown Organization'}</h3>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.payment_method.replace('_', ' ').toUpperCase()}
                      {payment.reference_number && ` • ${payment.reference_number}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {payment.submitted_by} • {new Date(payment.submitted_at).toLocaleDateString()}
                    </p>
                    {payment.notes && (
                      <p className="text-sm mt-1">{payment.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </p>
                    {payment.verified_at && (
                      <p className="text-xs text-muted-foreground">
                        Verified {new Date(payment.verified_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {payment.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => validatePayment(payment.id, 'verified')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => validatePayment(payment.id, 'rejected')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payment records found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 'No payments match your filters.' : 'No payment records yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}