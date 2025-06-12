
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteUserFormData {
  email: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
}

interface InviteUserFormProps {
  onClose: () => void;
}

export function InviteUserForm({ onClose }: InviteUserFormProps) {
  const { addUser } = useFirebaseUsers();
  const { currentOrganization } = useOrganizations();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InviteUserFormData>({
    defaultValues: {
      role: 'Viewer'
    }
  });

  const [inviteUrl, setInviteUrl] = React.useState<string>('');
  const [copied, setCopied] = React.useState(false);

  const generateInviteUrl = (email: string, role: string) => {
    if (!currentOrganization) return '';
    
    const baseUrl = window.location.origin;
    const inviteToken = btoa(`${email}:${role}:${currentOrganization.id}:${Date.now()}`);
    return `${baseUrl}/invite/${inviteToken}`;
  };

  const handleCopyUrl = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = async (data: InviteUserFormData) => {
    if (!currentOrganization) return;

    // Generate invite URL
    const url = generateInviteUrl(data.email, data.role);
    setInviteUrl(url);

    // For now, we'll also add the user to the database
    // In a real app, you'd send an email with the invite URL
    const userData = {
      name: data.email.split('@')[0], // Use email prefix as temporary name
      email: data.email,
      role: data.role,
      status: 'inactive' as const,
      lastLogin: 'Never',
      organizationId: currentOrganization.id
    };
    
    await addUser(userData);
    
    toast({
      title: "Invitation Created",
      description: "Share the invite URL with the user to give them access",
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite User to {currentOrganization?.name}</DialogTitle>
      </DialogHeader>
      
      {!inviteUrl ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="user@company.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => setValue('role', value as any)} defaultValue="Viewer">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fleet Admin">Fleet Admin</SelectItem>
                <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Invitation
            </Button>
          </DialogFooter>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Invitation Created!</h4>
            <p className="text-sm text-green-700">
              Share this URL with the user to give them access to your organization:
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Invitation URL</Label>
            <div className="flex gap-2">
              <Input 
                value={inviteUrl} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyUrl}
                className="flex items-center gap-2"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onClose}>
              Done
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}
