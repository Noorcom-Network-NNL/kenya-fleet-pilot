
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { OrganizationBasicInfo } from './OrganizationBasicInfo';
import { AdminUserForm } from './AdminUserForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface CreateOrganizationDialogProps {
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
}

export function CreateOrganizationDialog({
  showCreateDialog,
  setShowCreateDialog
}: CreateOrganizationDialogProps) {
  const { loading, handleCreateOrganization } = useCreateOrganization();
  const isMobile = useIsMobile();
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
        <Button className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Organization</span>
          <span className="sm:hidden">Add Org</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-md'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Organization</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={onCreateOrganization} 
              disabled={!isFormValid || loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
