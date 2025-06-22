
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { User, useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Eye, EyeOff } from 'lucide-react';

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

interface AddUserFormProps {
  onClose: () => void;
}

const roleDescriptions = {
  'Fleet Admin': {
    description: 'Full system access with all administrative privileges',
    permissions: ['Manage vehicles', 'User management', 'System settings', 'All reports', 'Billing access'],
    color: 'bg-red-100 text-red-800',
    icon: '🔑'
  },
  'Fleet Manager': {
    description: 'Operations management with vehicle and trip oversight',
    permissions: ['Vehicle management', 'Trip planning', 'Maintenance scheduling', 'Operational reports', 'Driver management'],
    color: 'bg-blue-100 text-blue-800',
    icon: '👨‍💼'
  },
  'Driver': {
    description: 'Limited access for drivers to manage their assignments',
    permissions: ['View assigned vehicle', 'Report issues', 'Update trip status', 'Basic tracking'],
    color: 'bg-green-100 text-green-800',
    icon: '🚗'
  },
  'Viewer': {
    description: 'Read-only access to dashboards and reports',
    permissions: ['View dashboard', 'View reports', 'Basic tracking', 'No editing rights'],
    color: 'bg-gray-100 text-gray-800',
    icon: '👀'
  }
};

export function AddUserForm({ onClose }: AddUserFormProps) {
  const { addUser } = useFirebaseUsers();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<AddUserFormData>({
    defaultValues: {
      role: 'Viewer',
      status: 'active'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: AddUserFormData) => {
    try {
      // First create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Then add the user to Firestore with the Firebase UID
      const userData: Omit<User, 'id' | 'createdAt'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastLogin: 'Never'
      };
      
      await addUser(userData);
      
      toast({
        title: "User Added Successfully",
        description: `${data.name} has been added with ${data.role} role and can now login with the provided credentials`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = "Failed to add user. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Full name is required' })}
              placeholder="Enter user's full name"
              className="mt-1"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="user@company.com"
              className="mt-1"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
                placeholder="Enter a secure password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              User will use this password to login to the system
            </p>
          </div>
        </div>

        <Separator />

        {/* Role Selection */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">User Role *</Label>
            <Select onValueChange={(value) => setValue('role', value as any)} defaultValue="Viewer">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(([role, info]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
          </div>

          {/* Role Preview */}
          {selectedRole && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={roleDescriptions[selectedRole].color}>
                  <span className="mr-1">{roleDescriptions[selectedRole].icon}</span>
                  {selectedRole}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {roleDescriptions[selectedRole].description}
              </p>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Key Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {roleDescriptions[selectedRole].permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Status */}
        <div>
          <Label htmlFor="status">Account Status</Label>
          <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="active">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select account status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Inactive</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding User...' : 'Add User'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
