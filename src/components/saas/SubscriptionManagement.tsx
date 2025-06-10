
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingCard, PricingPlan } from './PricingCard';
import { Crown, Calendar, Users, Car, AlertTriangle } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { format } from 'date-fns';

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    period: 'month',
    description: '14-day free trial',
    features: ['Basic vehicle tracking', 'Up to 5 vehicles', 'Basic reporting', 'Email support'],
    maxVehicles: 5,
    maxUsers: 3,
    buttonText: 'Current Trial'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Perfect for small fleets',
    features: ['Real-time tracking', 'Fuel management', 'Driver management', 'Basic analytics', 'Email support'],
    maxVehicles: 25,
    maxUsers: 10,
    buttonText: 'Upgrade to Basic',
    stripePriceId: 'price_basic_monthly'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    period: 'month',
    description: 'Best for growing businesses',
    features: ['Everything in Basic', 'Advanced analytics', 'Maintenance scheduling', 'Geofencing', 'Priority support'],
    maxVehicles: 100,
    maxUsers: 50,
    popular: true,
    buttonText: 'Upgrade to Premium',
    stripePriceId: 'price_premium_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large organizations',
    features: ['Everything in Premium', 'Custom integrations', 'API access', 'Dedicated support', 'Custom reporting'],
    maxVehicles: -1,
    maxUsers: -1,
    buttonText: 'Contact Sales',
    stripePriceId: 'price_enterprise_monthly'
  }
];

export function SubscriptionManagement() {
  const [loading, setLoading] = useState(false);
  const { currentOrganization, updateOrganization } = useOrganizations();

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      if (plan.id === 'enterprise') {
        // Handle enterprise contact
        window.open('mailto:sales@noorcomfleet.co.ke?subject=Enterprise Plan Inquiry', '_blank');
      } else {
        // For now, just update the organization tier
        // In a real implementation, you'd integrate with Stripe
        await updateOrganization(currentOrganization.id, {
          subscriptionTier: plan.id as any,
          subscriptionStatus: 'active',
          maxVehicles: plan.maxVehicles,
          maxUsers: plan.maxUsers
        });
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isTrialExpiring = currentOrganization?.trialEndsAt && 
    new Date(currentOrganization.trialEndsAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // 3 days

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentOrganization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Plan</div>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{currentOrganization.subscriptionTier}</span>
                  {getStatusBadge(currentOrganization.subscriptionStatus)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Vehicles</div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span>{currentOrganization.maxVehicles === -1 ? 'Unlimited' : `0 / ${currentOrganization.maxVehicles}`}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Users</div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{currentOrganization.maxUsers === -1 ? 'Unlimited' : `0 / ${currentOrganization.maxUsers}`}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  {currentOrganization.subscriptionStatus === 'trial' ? 'Trial Ends' : 'Next Billing'}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {currentOrganization.trialEndsAt ? 
                      format(currentOrganization.trialEndsAt, 'MMM dd, yyyy') : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {isTrialExpiring && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  Your trial expires soon! Upgrade to continue using all features.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
          <p className="text-gray-600">Select the plan that best fits your fleet management needs</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSelect={handlePlanSelect}
                currentPlan={currentOrganization?.subscriptionTier}
                loading={loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  <th className="text-center p-3">Free</th>
                  <th className="text-center p-3">Basic</th>
                  <th className="text-center p-3">Premium</th>
                  <th className="text-center p-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Real-time Tracking</td>
                  <td className="text-center p-3">✓</td>
                  <td className="text-center p-3">✓</td>
                  <td className="text-center p-3">✓</td>
                  <td className="text-center p-3">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Advanced Analytics</td>
                  <td className="text-center p-3">-</td>
                  <td className="text-center p-3">-</td>
                  <td className="text-center p-3">✓</td>
                  <td className="text-center p-3">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">API Access</td>
                  <td className="text-center p-3">-</td>
                  <td className="text-center p-3">-</td>
                  <td className="text-center p-3">-</td>
                  <td className="text-center p-3">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
