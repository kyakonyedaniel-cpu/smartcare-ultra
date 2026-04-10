import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Calendar, Pill, BarChart, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    { icon: Users, title: 'Patient Management', desc: 'Complete patient records with medical history' },
    { icon: Calendar, title: 'Appointments', desc: 'Smart scheduling and queue management' },
    { icon: Pill, title: 'Pharmacy', desc: 'Inventory tracking with expiry alerts' },
    { icon: BarChart, title: 'Analytics', desc: 'Real-time reports and business insights' },
    { icon: Shield, title: 'Multi-tenant Security', desc: 'Strict data isolation per clinic' },
    { icon: Zap, title: 'POS System', desc: 'Fast point-of-sale with receipts' },
  ];

  const plans = [
    { name: 'Free Trial', price: 'Free', period: '14 days', features: ['Up to 50 patients', '1 branch', '2 users', 'Basic features'] },
    { name: 'Starter', price: 'UGX 150K', period: '/month', features: ['200 patients', '2 branches', '5 users', 'Reports', 'Support'] },
    { name: 'Professional', price: 'UGX 350K', period: '/month', features: ['1000 patients', '5 branches', '20 users', 'SMS', 'Advanced reports'] },
    { name: 'Enterprise', price: 'UGX 750K', period: '/month', features: ['Unlimited patients', 'Unlimited branches', 'Unlimited users', 'Priority support', 'Custom features'] },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SmartCare Ultra</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Clinic & Pharmacy Management<br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete SaaS platform for clinics, drug shops, and healthcare businesses in Uganda. 
            Manage patients, inventory, appointments, and finances all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="text-lg">Start Free Trial</Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg">Watch Demo</Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="mb-2">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">Choose the plan that fits your clinic</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <Card key={i} className={i === 2 ? 'border-primary' : ''}>
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">{plan.price}</div>
                  <p className="text-muted-foreground">{plan.period}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className="w-full mt-4" variant={i === 2 ? 'default' : 'outline'}>
                      Choose {plan.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Clinic?</h2>
          <p className="text-muted-foreground mb-8">Join hundreds of clinics already using SmartCare Ultra</p>
          <Link to="/register">
            <Button size="lg" className="text-lg">Start Your Free Trial</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-bold">SmartCare Ultra</span>
              </div>
              <p className="text-sm text-muted-foreground">The complete healthcare management platform for Uganda.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Demo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 SmartCare Ultra. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}