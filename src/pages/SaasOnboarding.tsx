import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Building, Users, Car, Check, Globe, Mail, Lock } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface OnboardingData {
  // Organization Details
  organizationName: string;
  subdomain: string;
  industry: string;
  companySize: string;
  fleetSize: string;
  
  // Admin User Details
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  
  // Plan Selection
  selectedPlan: 'free' | 'basic' | 'premium' | 'enterprise';
}

const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: 'Free',
    vehicles: 5,
    users: 3,
    features: ['Basic Tracking', 'Fuel Management', '14-day Trial']
  },
  {
    id: 'basic',
    name: 'Professional',
    price: '$49/month',
    vehicles: 25,
    users: 10,
    features: ['Advanced Tracking', 'Maintenance', 'Reports', 'Support']
  },
  {
    id: 'premium',
    name: 'Business',
    price: '$99/month',
    vehicles: 100,
    users: 25,
    features: ['All Features', 'API Access', 'Custom Branding', 'Priority Support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    vehicles: 'Unlimited',
    users: 'Unlimited',
    features: ['White Label', 'Dedicated Support', 'Custom Integrations', 'SLA']
  }
];

export default function SaasOnboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    subdomain: '',
    industry: '',
    companySize: '',
    fleetSize: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    selectedPlan: 'free'
  });
  const [loading, setLoading] = useState(false);
  const { createOrganization } = useOrganizations();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const validateSubdomain = (subdomain: string) => {
    const pattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    return pattern.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 63;
  };

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

  const generateSubdomain = (orgName: string) => {
    return orgName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20);
  };

  const handleOrgNameChange = (name: string) => {
    setData(prev => ({
      ...prev,
      organizationName: name,
      subdomain: generateSubdomain(name)
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create Firebase Auth user for the admin
      const userCredential = await createUserWithEmailAndPassword(auth, data.adminEmail, data.adminPassword);
      
      // Get the selected plan details
      const selectedPlan = plans.find(p => p.id === data.selectedPlan)!;
      
      // Create the organization
      const orgId = await createOrganization({
        name: data.organizationName,
        slug: data.subdomain,
        subscriptionTier: data.selectedPlan,
        subscriptionStatus: data.selectedPlan === 'free' ? 'trial' : 'active',
        maxVehicles: typeof selectedPlan.vehicles === 'number' ? selectedPlan.vehicles : 999999,
        maxUsers: typeof selectedPlan.users === 'number' ? selectedPlan.users : 999999,
        features: selectedPlan.features.map(f => f.toLowerCase().replace(/\s+/g, '_'))
      });

      // Login the newly created user
      await login(data.adminEmail, data.adminPassword);

      toast({
        title: "Welcome to Noorcom Fleet!",
        description: `${data.organizationName} has been successfully set up. You can now access your fleet at ${data.subdomain}.noorcomfleet.com`,
      });

      // Redirect to dashboard
      navigate('/');
      
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      let errorMessage = "Failed to complete setup. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please use a different email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }

      toast({
        title: "Setup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.organizationName && data.subdomain && validateSubdomain(data.subdomain) && data.industry;
      case 2:
        return data.companySize && data.fleetSize;
      case 3:
        return data.adminName && data.adminEmail && data.adminPassword && data.adminPassword.length >= 6;
      case 4:
        return data.selectedPlan;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Noorcom Fleet</CardTitle>
                <p className="text-sm text-muted-foreground">Fleet Management SaaS</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Organization Setup */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <Building className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold">Set up your Fleet Organization</h3>
                <p className="text-muted-foreground">Create your unique fleet management workspace</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={data.organizationName}
                    onChange={(e) => handleOrgNameChange(e.target.value)}
                    placeholder="e.g., ABC Logistics, XYZ Transport"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subdomain">Your Fleet URL *</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={data.subdomain}
                      onChange={(e) => setData({...data, subdomain: e.target.value.toLowerCase()})}
                      placeholder="your-company"
                      className="rounded-r-none"
                    />
                    <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                      .noorcomfleet.com
                    </div>
                  </div>
                  {data.subdomain && !validateSubdomain(data.subdomain) && (
                    <p className="text-sm text-destructive mt-1">
                      Subdomain must be 3-63 characters, start and end with alphanumeric, contain only letters, numbers, and hyphens
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => setData({...data, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                      <SelectItem value="delivery">Delivery Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="field-service">Field Services</SelectItem>
                      <SelectItem value="taxi-ride-share">Taxi & Ride Share</SelectItem>
                      <SelectItem value="waste-management">Waste Management</SelectItem>
                      <SelectItem value="public-transport">Public Transportation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company & Fleet Size */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold">Tell us about your business</h3>
                <p className="text-muted-foreground">This helps us recommend the right plan for you</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Company Size</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['1-10', '11-50', '51-200', '200+'].map((size) => (
                      <Button
                        key={size}
                        variant={data.companySize === size ? "default" : "outline"}
                        onClick={() => setData({...data, companySize: size})}
                        className="h-12"
                      >
                        {size} employees
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Fleet Size</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['1-5', '6-25', '26-100', '100+'].map((size) => (
                      <Button
                        key={size}
                        variant={data.fleetSize === size ? "default" : "outline"}
                        onClick={() => setData({...data, fleetSize: size})}
                        className="h-12"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        {size} vehicles
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Admin User Setup */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold">Create your admin account</h3>
                <p className="text-muted-foreground">This will be your login credentials</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input
                    id="adminName"
                    value={data.adminName}
                    onChange={(e) => setData({...data, adminName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={data.adminEmail}
                    onChange={(e) => setData({...data, adminEmail: e.target.value})}
                    placeholder="admin@yourcompany.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="adminPassword">Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={data.adminPassword}
                    onChange={(e) => setData({...data, adminPassword: e.target.value})}
                    placeholder="Minimum 6 characters"
                  />
                  {data.adminPassword && data.adminPassword.length < 6 && (
                    <p className="text-sm text-destructive mt-1">Password must be at least 6 characters</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Plan Selection */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold">Choose your plan</h3>
                <p className="text-muted-foreground">Start with a free trial, upgrade anytime</p>
              </div>
              
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      data.selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setData({...data, selectedPlan: plan.id as any})}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-lg font-bold text-primary">{plan.price}</p>
                          <p className="text-sm text-muted-foreground">
                            Up to {plan.vehicles} vehicles, {plan.users} users
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          data.selectedPlan === plan.id ? 'bg-primary border-primary' : 'border-muted-foreground'
                        }`} />
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {plan.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={loading || !isStepValid()}
                className="flex items-center gap-2"
              >
                {loading ? 'Setting up...' : (
                  <>
                    <Check className="h-4 w-4" />
                    Launch My Fleet
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