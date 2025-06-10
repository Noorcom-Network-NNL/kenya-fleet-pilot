
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Building, Users, Car, Check } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  organizationName: string;
  companySize: string;
  fleetSize: string;
  industry: string;
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    companySize: '',
    fleetSize: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const { createOrganization } = useOrganizations();
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const slug = data.organizationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await createOrganization({
        name: data.organizationName,
        slug,
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        maxVehicles: 5,
        maxUsers: 3,
        features: ['basic_tracking', 'fuel_management']
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Welcome to Noorcom Fleet</CardTitle>
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <Building className="h-12 w-12 mx-auto text-noorcom-600 mb-4" />
                <h3 className="text-xl font-semibold">Let's set up your organization</h3>
                <p className="text-gray-600">Tell us about your company</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={data.organizationName}
                    onChange={(e) => setData({...data, organizationName: e.target.value})}
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={data.industry}
                    onChange={(e) => setData({...data, industry: e.target.value})}
                    placeholder="e.g., Logistics, Transportation, Delivery"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-noorcom-600 mb-4" />
                <h3 className="text-xl font-semibold">Company Size</h3>
                <p className="text-gray-600">How many people work at your company?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {['1-10', '11-50', '51-200', '200+'].map((size) => (
                  <Button
                    key={size}
                    variant={data.companySize === size ? "default" : "outline"}
                    onClick={() => setData({...data, companySize: size})}
                    className="h-16"
                  >
                    {size} employees
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <Car className="h-12 w-12 mx-auto text-noorcom-600 mb-4" />
                <h3 className="text-xl font-semibold">Fleet Size</h3>
                <p className="text-gray-600">How many vehicles do you manage?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {['1-5', '6-25', '26-100', '100+'].map((size) => (
                  <Button
                    key={size}
                    variant={data.fleetSize === size ? "default" : "outline"}
                    onClick={() => setData({...data, fleetSize: size})}
                    className="h-16"
                  >
                    {size} vehicles
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && !data.organizationName) ||
                  (step === 2 && !data.companySize) ||
                  (step === 3 && !data.fleetSize)
                }
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 'Setting up...' : (
                  <>
                    <Check className="h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
