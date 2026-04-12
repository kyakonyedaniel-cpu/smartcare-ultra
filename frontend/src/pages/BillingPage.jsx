import React, { useState, useEffect } from 'react';

const plans = [
  { 
    id: 'free', 
    name: 'Free Trial', 
    priceMonthly: 0, 
    priceYearly: 0, 
    maxUsers: 1, 
    maxPatients: 20, 
    features: ['Basic Patient Management', 'Simple POS', '1 Branch', 'Email Support'],
    isPopular: false,
    trialDays: 14
  },
  { 
    id: 'starter', 
    name: 'Starter', 
    priceMonthly: 99000, 
    priceYearly: 990000, 
    maxUsers: 3, 
    maxPatients: 200, 
    features: ['All Free features', 'Basic Reports', 'SMS Notifications', '3 Branches', 'Email & Chat Support'],
    isPopular: true
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    priceMonthly: 249000, 
    priceYearly: 2490000, 
    maxUsers: 10, 
    maxPatients: 1000, 
    features: ['All Starter features', 'Advanced Reports', 'API Access', '10 Branches', 'Priority Support', 'Custom Branding'],
    isPopular: false
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise', 
    priceMonthly: 599000, 
    priceYearly: 5990000, 
    maxUsers: -1, 
    maxPatients: -1, 
    features: ['All Pro features', 'Unlimited Everything', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'White Label'],
    isPopular: false
  },
];

const mockPayments = [
  { id: '1', amount: 249000, method: 'MTN_MOMO', status: 'COMPLETED', date: '2026-04-01', description: 'Professional Plan - Monthly' },
  { id: '2', amount: 249000, method: 'AIRTEL_MONEY', status: 'COMPLETED', date: '2026-03-01', description: 'Professional Plan - Monthly' },
  { id: '3', amount: 249000, method: 'MTN_MOMO', status: 'COMPLETED', date: '2026-02-01', description: 'Professional Plan - Monthly' },
];

export function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('MTN_MOMO');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount);
  };

  const currentPlanDetails = plans.find(p => p.id === currentPlan);
  const trialDaysLeft = 14;
  const nextBillingDate = 'May 1, 2026';

  const initiatePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newPayment = {
      id: String(Date.now()),
      amount: selectedPlan.priceMonthly,
      method: paymentMethod,
      status: 'PENDING',
      date: new Date().toISOString(),
      description: `${selectedPlan.name} Plan - ${billingCycle}`
    };
    setPayments([newPayment, ...payments]);
    setProcessing(false);
    setShowPaymentModal(false);
    alert(`Payment initiated! Reference: PAY-${Date.now().toString(36).toUpperCase()}\n\nDial *165# for MTN or *185# for Airtel and enter the reference.`);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-500">Manage your subscription and payments</p>
        </div>

        {currentPlan === 'free' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">Trial Period Active</p>
                <p className="text-sm text-orange-600">{trialDaysLeft} days remaining in your free trial</p>
              </div>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Current Plan</h2>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div>
                  <p className="text-2xl font-bold text-blue-900">{currentPlanDetails?.name}</p>
                  <p className="text-blue-700">
                    {formatCurrency(currentPlanDetails?.priceMonthly || 0)}/month
                  </p>
                </div>
                <div className="text-right">
                  {currentPlan !== 'free' && (
                    <>
                      <p className="text-sm text-blue-600">Next billing: {nextBillingDate}</p>
                      <p className="text-sm text-blue-600">{currentPlanDetails?.maxUsers} users included</p>
                    </>
                  )}
                  {currentPlan === 'free' && (
                    <p className="text-sm text-orange-600">{trialDaysLeft} days left</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Available Plans</h2>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-4 py-2 rounded-md ${billingCycle === 'MONTHLY' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`px-4 py-2 rounded-md ${billingCycle === 'YEARLY' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  Yearly <span className="text-green-400 ml-1">Save 17%</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-4 ${plan.isPopular ? 'border-blue-500 ring-2 ring-blue-200' : ''} ${currentPlan === plan.id ? 'bg-blue-50' : ''}`}
                  >
                    {plan.isPopular && (
                      <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded-full mb-2">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-2xl font-bold mt-2">
                      {formatCurrency(billingCycle === 'YEARLY' ? plan.priceYearly : plan.priceMonthly)}
                      <span className="text-sm font-normal text-gray-500">/{billingCycle === 'YEARLY' ? 'year' : 'mo'}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>{plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers} Users</li>
                      <li>{plan.maxPatients === -1 ? 'Unlimited' : plan.maxPatients} Patients</li>
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    {currentPlan !== plan.id ? (
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPaymentModal(true);
                        }}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {plan.priceMonthly === 0 ? 'Downgrade' : 'Upgrade'}
                      </button>
                    ) : (
                      <button disabled className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                        Current Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <input type="radio" name="method" value="MTN_MOMO" checked={paymentMethod === 'MTN_MOMO'} onChange={() => setPaymentMethod('MTN_MOMO')} />
                  <div>
                    <p className="font-medium">MTN Mobile Money</p>
                    <p className="text-sm text-gray-500">Pay with MTN MoMo</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <input type="radio" name="method" value="AIRTEL_MONEY" checked={paymentMethod === 'AIRTEL_MONEY'} onChange={() => setPaymentMethod('AIRTEL_MONEY')} />
                  <div>
                    <p className="font-medium">Airtel Money</p>
                    <p className="text-sm text-gray-500">Pay with Airtel Money</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment History</h2>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : payments.length === 0 ? (
                <p className="text-center text-gray-500">No payments yet</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-500">{payment.description}</p>
                        <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="font-medium">{selectedPlan.name} Plan</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(billingCycle === 'YEARLY' ? selectedPlan.priceYearly : selectedPlan.priceMonthly)}
              </p>
              <p className="text-sm text-gray-500">per {billingCycle === 'YEARLY' ? 'year' : 'month'}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="MTN_MOMO">MTN Mobile Money</option>
                  <option value="AIRTEL_MONEY">Airtel Money</option>
                </select>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800">Payment Instructions:</p>
                <p className="text-blue-600 mt-1">
                  {paymentMethod === 'MTN_MOMO' 
                    ? 'Dial *165# → Select Payment → Enter reference after clicking Pay'
                    : 'Dial *185# → Select Payment → Enter reference after clicking Pay'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={initiatePayment}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {processing ? 'Processing...' : 'Initiate Payment'}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
