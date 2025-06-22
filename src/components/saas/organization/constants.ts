
export const pricingPlans = [
  { id: 'free', name: 'Free Trial', maxVehicles: 5, maxUsers: 3 },
  { id: 'basic', name: 'Basic', maxVehicles: 25, maxUsers: 10 },
  { id: 'premium', name: 'Premium', maxVehicles: 100, maxUsers: 50 },
  { id: 'enterprise', name: 'Enterprise', maxVehicles: -1, maxUsers: 150 }
];

export const getSubscriptionBadgeColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'trial': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
