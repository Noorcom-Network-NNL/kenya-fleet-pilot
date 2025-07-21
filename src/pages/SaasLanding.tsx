import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Users, 
  MapPin, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe, 
  Check,
  ArrowRight,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your entire fleet in real-time with precise GPS monitoring and route optimization.'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Comprehensive reports on fuel consumption, driver behavior, and fleet performance.'
  },
  {
    icon: Car,
    title: 'Maintenance Management',
    description: 'Automated maintenance scheduling and alerts to keep your fleet running smoothly.'
  },
  {
    icon: Users,
    title: 'Driver Management',
    description: 'Manage driver profiles, track performance, and improve safety across your fleet.'
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with compliance tracking and audit trails.'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Get notified immediately about speeding, unauthorized use, or maintenance needs.'
  }
];

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '14-day trial',
    vehicles: '5',
    users: '3',
    features: [
      'Basic GPS Tracking',
      'Fuel Management',
      'Driver Profiles',
      'Mobile App Access',
      'Email Support'
    ],
    popular: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: '$49',
    period: 'per month',
    vehicles: '25',
    users: '10',
    features: [
      'Advanced Tracking',
      'Maintenance Scheduling',
      'Custom Reports',
      'API Access',
      'Priority Support',
      'Driver Behavior Analysis'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Business',
    price: '$99',
    period: 'per month',
    vehicles: '100',
    users: '25',
    features: [
      'All Professional Features',
      'Custom Branding',
      'White-label Option',
      'Advanced Analytics',
      'Multi-location Support',
      'Dedicated Account Manager'
    ],
    popular: false,
    cta: 'Start Free Trial'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'ABC Logistics',
    content: 'Noorcom Fleet transformed our operations. We reduced fuel costs by 30% and improved delivery times significantly.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    company: 'Urban Transport Co',
    content: 'The real-time tracking and maintenance alerts have been game-changers for our business efficiency.',
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    company: 'Green Delivery Services',
    content: 'Easy to use, powerful features, and excellent support. Exactly what we needed for our growing fleet.',
    rating: 5
  }
];

export default function SaasLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold">Noorcom Fleet</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/onboarding')}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">
            <Globe className="h-3 w-3 mr-1" />
            Trusted by 500+ Fleet Operators
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fleet Management
            <span className="block text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track, manage, and optimize your entire fleet with Noorcom's comprehensive 
            SaaS platform. Join thousands of businesses reducing costs and improving efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/onboarding')} className="flex items-center gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Setup in minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage your fleet
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From real-time tracking to maintenance management, we've got all the tools 
              to keep your fleet running efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your fleet size. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Up to {plan.vehicles} vehicles • {plan.users} users
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/onboarding')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by fleet managers worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say about their experience with Noorcom Fleet.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to optimize your fleet?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using Noorcom Fleet to reduce costs and improve efficiency.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 mx-auto"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-sm mt-4 opacity-75">
            14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="text-xl font-bold">Noorcom Fleet</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Support</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Noorcom Fleet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}