
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { OrganizationBasicInfo } from './OrganizationBasicInfo';
import { AdminUserForm } from './AdminUserForm';

interface CreateOrganizationDialogProps {
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
}

export function CreateOrganizationDialog({
  showCreateDialog,
  setShowCreateDialog
}: CreateOrganizationDialogProps) {
  const { loading, handleCreateOrganization } = useCreateOrganization();
  const [newOrgName, setNewOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onCreateOrganization = async () => {
    const success = await handleCreateOrganization(newOrgName, adminName, adminEmail, adminPassword);
    
    if (success) {
      // Reset form and close dialog
      setNewOrgName('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setShowCreateDialog(false);
    }
  };

  const handleCancel = () => {
    setNewOrgName('');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowPassword(false);
    setShowCreateDialog(false);
  };

  const isFormValid = newOrgName.trim() && adminName.trim() && adminEmail.trim() && adminPassword.trim();

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <OrganizationBasicInfo
            orgName={newOrgName}
            onOrgNameChange={setNewOrgName}
          />
          
          <AdminUserForm
            adminName={adminName}
            adminEmail={adminEmail}
            adminPassword={adminPassword}
            showPassword={showPassword}
            orgName={newOrgName}
            onAdminNameChange={setAdminName}
            onAdminEmailChange={setAdminEmail}
            onAdminPasswordChange={setAdminPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={onCreateOrganization} 
              disabled={!isFormValid || loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
