
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Organization } from '@/types/organization';
import { CalendarDays, CreditCard, Mail, Phone, Building, User, Crown, Calendar, Edit, Save, X, Users, Eye, EyeOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSubscriptionBadgeColor } from './constants';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';

interface EditableClientDetailsDialogProps {
  showClientDialog: boolean;
  setShowClientDialog: (show: boolean) => void;
  selectedOrgForClient: Organization | null;
  onUpdateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
}

interface EditableClientData {
  ownerEmail: string;
  phone: string;
  address: string;
  paymentReference: string;
  paymentMethod: string;
}

export function EditableClientDetailsDialog({
  showClientDialog,
  setShowClientDialog,
  selectedOrgForClient,
  onUpdateOrganization
}: EditableClientDetailsDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { users } = useFirebaseUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [editData, setEditData] = useState<EditableClientData>({
    ownerEmail: '',
    phone: '',
    address: '',
    paymentReference: '',
    paymentMethod: ''
  });

  React.useEffect(() => {
    if (selectedOrgForClient) {
      setEditData({
        ownerEmail: selectedOrgForClient.ownerEmail,
        phone: '+1 (555) 123-4567', // Default demo data
        address: '123 Business St, City, State 12345', // Default demo data
        paymentReference: generatePaymentReference(selectedOrgForClient),
        paymentMethod: '**** **** **** 1234' // Default demo data
      });
    }
  }, [selectedOrgForClient]);

  if (!selectedOrgForClient) return null;

  const generatePaymentReference = (org: Organization) => {
    return `PAY-${org.id.slice(0, 8).toUpperCase()}-${org.createdAt.getFullYear()}`;
  };

  const getNextExpiryDate = (org: Organization) => {
    if (org.subscriptionEndsAt) {
      return org.subscriptionEndsAt;
    }
    const expiryDate = new Date(org.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate;
  };

  const nextExpiryDate = getNextExpiryDate(selectedOrgForClient);

  // Filter users for the current organization
  const orgUsers = users.filter(user => user.organizationId === selectedOrgForClient.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setEditData({
      ownerEmail: selectedOrgForClient.ownerEmail,
      phone: '+1 (555) 123-4567',
      address: '123 Business St, City, State 12345',
      paymentReference: generatePaymentReference(selectedOrgForClient),
      paymentMethod: '**** **** **** 1234'
    });
  };

  const handleSave = async () => {
    try {
      await onUpdateOrganization(selectedOrgForClient.id, {
        ownerEmail: editData.ownerEmail
      });
      
      toast({
        title: "Success",
        description: "Client details updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client details:', error);
      toast({
        title: "Error",
        description: "Failed to update client details",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof EditableClientData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Mock password data for demo purposes
  const getUserPassword = (userId: string) => {
    return `Pass${userId.slice(0, 4)}!`;
  };

  return (
    <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-4xl'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Client Details - {selectedOrgForClient.name}
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="default" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Owner Email:
                    </Label>
                    {isEditing ? (
                      <Input
                        id="ownerEmail"
                        value={editData.ownerEmail}
                        onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                        type="email"
                      />
                    ) : (
                      <span className="text-sm">{editData.ownerEmail}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      Phone:
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        type="tel"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{editData.phone}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Company Address:
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{editData.address}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Associated Users ({orgUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orgUsers.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">No users found for this organization</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">
                                {showPasswords[user.id] ? getUserPassword(user.id) : '••••••••'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="h-6 w-6 p-0"
                              >
                                {showPasswords[user.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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
                  <div className="space-y-4">
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentReference" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        Payment Reference:
                      </Label>
                      {isEditing ? (
                        <Input
                          id="paymentReference"
                          value={editData.paymentReference}
                          onChange={(e) => handleInputChange('paymentReference', e.target.value)}
                        />
                      ) : (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{editData.paymentReference}</code>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod" className="font-medium">Payment Method:</Label>
                      {isEditing ? (
                        <Input
                          id="paymentMethod"
                          value={editData.paymentMethod}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{editData.paymentMethod}</span>
                      )}
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
                            <code className="text-xs">{editData.paymentReference}</code>
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
                    <div>Users: {orgUsers.length} / {selectedOrgForClient.maxUsers === -1 ? '∞' : selectedOrgForClient.maxUsers}</div>
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
