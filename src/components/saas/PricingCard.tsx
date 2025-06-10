
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  maxVehicles: number;
  maxUsers: number;
  popular?: boolean;
  buttonText: string;
  stripePriceId?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
  currentPlan?: string;
  loading?: boolean;
}

export function PricingCard({ plan, onSelect, currentPlan, loading }: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id;

  return (
    <Card className={`relative ${plan.popular ? 'border-noorcom-500 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-noorcom-500' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-noorcom-500 text-white flex items-center gap-1">
            <Star className="h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-gray-500">/{plan.period}</span>
        </div>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Includes:</div>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Max Vehicles:</span>
            <span className="font-medium">{plan.maxVehicles === -1 ? 'Unlimited' : plan.maxVehicles}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Max Users:</span>
            <span className="font-medium">{plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}</span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          onClick={() => onSelect(plan)}
          disabled={loading || isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
