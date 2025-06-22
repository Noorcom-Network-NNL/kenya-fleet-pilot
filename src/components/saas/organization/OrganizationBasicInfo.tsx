
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrganizationBasicInfoProps {
  orgName: string;
  onOrgNameChange: (value: string) => void;
}

export function OrganizationBasicInfo({ orgName, onOrgNameChange }: OrganizationBasicInfoProps) {
  return (
    <div>
      <Label htmlFor="orgName">Organization Name</Label>
      <Input
        id="orgName"
        value={orgName}
        onChange={(e) => onOrgNameChange(e.target.value)}
        placeholder="Enter organization name"
      />
    </div>
  );
}
