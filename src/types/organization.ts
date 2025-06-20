
export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled';
  maxVehicles: number;
  maxUsers: number;
  features: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: Date;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
}

export type CreateOrganizationData = Omit<Organization, 'id' | 'createdAt' | 'ownerId' | 'ownerEmail'>;
