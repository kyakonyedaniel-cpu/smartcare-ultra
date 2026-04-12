import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, CreditCard, Shield, Zap, BarChart3, Phone, Mail, MapPin, Check, Star, ArrowRight } from 'lucide-react';

const plans = [
  { 
    name: 'Free Trial', 
    price: 0, 
    period: 'forever',
    description: 'Perfect for trying out SmartCare',
    features: ['20 Patients', '1 User', 'Basic Patient Management', 'Simple POS', '1 Branch', 'Email Support'],
    cta: 'Start Free Trial',
    popular: false
  },
  { 
    name: 'Starter', 
    price: 99000, 
    period: 'month',
    description: 'For small clinics getting started',
    features: ['200 Patients', '3 Users', 'Basic Reports', 'SMS Notifications', '3 Branches', 'Email & Chat Support'],
    cta: 'Get Started',
    popular: true
  },
  { 
    name: 'Professional', 
    price: 249000, 
    period: 'month',
    description: 'For growing healthcare businesses',
    features: ['1,000 Patients', '10 Users', 'Advanced Reports', 'API Access', '10 Branches', 'Priority Support', 'Custom Branding'],
    cta: 'Get Started',
    popular: false
  },
  { 
    name: 'Enterprise', 
    price: 599000, 
    period: 'month',
    description: 'For large healthcare organizations',
    features: ['Unlimited Patients', 'Unlimited Users', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'White Label'],
    cta: 'Contact Sales',
    popular: false
  },
];

const features = [
  { icon: Users, title: 'Patient Management', description: 'Complete patient records with history, allergies, and emergency contacts.' },
  { icon: BarChart3, title: 'Smart Reports', description: 'Generate insightful reports on revenue, patients, and inventory.' },
  { icon: CreditCard, title: 'Easy Payments', description: 'Accept MTN MoMo and Airtel Money payments seamlessly.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your data is encrypted and protected with enterprise-grade security.' },
  { icon: Zap, title: 'Fast & Reliable', description: 'Lightning-fast performance with 99.9% uptime guarantee.' },
  { icon: Building2, title: 'Multi-Branch', description: 'Manage multiple clinic branches from a single dashboard.' },
];

const testimonials = [
  { name: 'Dr. Sarah Nakato', role: 'Owner, Nakato Clinic', content: 'SmartCare transformed how we manage our clinic. Patient records are now at our fingertips!', avatar: 'SN' },
  { name: 'James Mukasa', role: 'Manager, Health Plus', content: 'The billing and payment integration with MTN MoMo has increased our collection rate by 40%.', avatar: 'JM' },
  { name: 'Grace Nabisere', role: 'Pharmacist, City Pharmacy', content: 'Inventory management has never been easier. We always know what stock we have.', avatar: 'GN' },
];

export function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your interest! We'll contact you at ${email}`);
    setEmail('');
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">SmartCare</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              #1 Clinic Management in Uganda
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Run Your Clinic
              <span className="text-blue-600"> Smarter </span>
              Not Harder
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              The all-in-one clinic management platform trusted by 150+ healthcare providers in Uganda. 
              Manage patients, billing, inventory, and more - all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <a href="#demo" className="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg border hover:bg-gray-50">
                Watch Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • 14-day free trial</p>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">150+</p>
              <p className="text-gray-600">Clinics</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">45K+</p>
              <p className="text-gray-600">Patients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">UGX 2B+</p>
              <p className="text-gray-600">Processed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">99.9%</p>
              <p className="text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mt-4 text-xl text-gray-600">Powerful features to run your entire clinic operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Choose the plan that fits your clinic</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-2xl p-6 ${plan.popular ? 'bg-blue-600 text-white scale-105 shadow-xl' : 'bg-white border'}`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full mb-4">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`mt-2 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && <span className={`${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>/{plan.period}</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={18} className={plan.popular ? 'text-green-300' : 'text-green-600'} />
                      <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`mt-8 w-full py-3 rounded-lg font-semibold text-center block ${
                    plan.popular 
                      ? 'bg-white text-blue-600 hover:bg-blue-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Healthcare Providers</h2>
            <p className="mt-4 text-xl text-blue-100">See what clinic owners are saying about SmartCare</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600">"{testimonial.content}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-xl text-gray-600">Have questions? We're here to help.</p>
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-gray-600">+256 701 234 567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-gray-600">support@smartcare.ug</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-gray-600">Plot 123, Kampala Road, Uganda</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="you@clinic.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg h-32"
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">SmartCare</span>
              </div>
              <p className="text-gray-400">The all-in-one clinic management platform for Uganda.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 SmartCare Uganda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
