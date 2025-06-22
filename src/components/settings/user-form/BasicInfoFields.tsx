
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

interface BasicInfoFieldsProps {
  register: UseFormRegister<AddUserFormData>;
  errors: FieldErrors<AddUserFormData>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export function BasicInfoFields({ register, errors, showPassword, setShowPassword }: BasicInfoFieldsProps) {
  return (
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
  );
}
