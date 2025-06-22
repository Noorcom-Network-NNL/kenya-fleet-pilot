
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Organization } from '@/types/organization';
import { CalendarDays, CreditCard, Mail, Phone, Building, User, Crown, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSubscriptionBadgeColor } from './constants';

interface ClientDetailsDialogProps {
  showClientDialog: boolean;
  setShowClientDialog: (show: boolean) => void;
  selectedOrgForClient: Organization | null;
}

export function ClientDetailsDialog({
  showClientDialog,
  setShowClientDialog,
  selectedOrgForClient
}: ClientDetailsDialogProps) {
  const isMobile = useIsMobile();

  if (!selectedOrgForClient) return null;

  // Calculate next expiry date (30 days from subscription start for demo)
  const getNextExpiryDate = (org: Organization) => {
    if (org.subscriptionEndsAt) {
      return org.subscriptionEndsAt;
    }
    // Demo calculation: 30 days from creation
    const expiryDate = new Date(org.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
  };

  const generatePaymentReference = (org: Organization) => {
    return `PAY-${org.id.slice(0, 8).toUpperCase()}-${org.createdAt.getFullYear()}`;
  };

  const nextExpiryDate = getNextExpiryDate(selectedOrgForClient);
  const paymentReference = generatePaymentReference(selectedOrgForClient);

  return (
    <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-4xl'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Building className="h-5 w-5" />
            Client Details - {selectedOrgForClient.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Organization Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Organization Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Organization Name:</span>
                    <span>{selectedOrgForClient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Slug:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">/{selectedOrgForClient.slug}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge className={getSubscriptionBadgeColor(selectedOrgForClient.subscriptionStatus)}>
                      {selectedOrgForClient.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Current Plan:</span>
                    <span className="capitalize">{selectedOrgForClient.subscriptionTier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Max Vehicles:</span>
                    <span>{selectedOrgForClient.maxVehicles === -1 ? 'Unlimited' : selectedOrgForClient.maxVehicles}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Max Users:</span>
                    <span>{selectedOrgForClient.maxUsers === -1 ? 'Unlimited' : selectedOrgForClient.maxUsers}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Owner Email:</span>
                    <span>{selectedOrgForClient.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span className="text-gray-600">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Company Address:</span>
                    <span className="text-gray-600">123 Business St, City, State 12345</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscription & Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Plan Activated:</span>
                      <span>{selectedOrgForClient.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Next Expiry:</span>
                      <span className={nextExpiryDate < new Date() ? 'text-red-600' : 'text-green-600'}>
                        {nextExpiryDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Payment Reference:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{paymentReference}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Payment Method:</span>
                      <span className="text-gray-600">**** **** **** 1234</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment History Table */}
                <div>
                  <h4 className="font-medium mb-3">Recent Payments</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{selectedOrgForClient.createdAt.toLocaleDateString()}</TableCell>
                          <TableCell>$49.99</TableCell>
                          <TableCell>
                            <code className="text-xs">{paymentReference}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Paid
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {selectedOrgForClient.subscriptionTier !== 'free' && (
                          <TableRow>
                            <TableCell>
                              {new Date(selectedOrgForClient.createdAt.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </TableCell>
                            <TableCell>$49.99</TableCell>
                            <TableCell>
                              <code className="text-xs">PAY-{selectedOrgForClient.id.slice(0, 8).toUpperCase()}-PREV</code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Paid
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <h4 className="font-medium mb-2">Included Features</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedOrgForClient.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Limits</h4>
                  <div className="space-y-1 text-sm">
                    <div>Vehicles: 0 / {selectedOrgForClient.maxVehicles === -1 ? '∞' : selectedOrgForClient.maxVehicles}</div>
                    <div>Users: 1 / {selectedOrgForClient.maxUsers === -1 ? '∞' : selectedOrgForClient.maxUsers}</div>
                    <div>Storage: 2.1 GB / 10 GB</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
