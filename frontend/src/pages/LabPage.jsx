import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { 
  FlaskConical, TestTube, Plus, Search, Filter, User,
  Clock, CheckCircle, AlertCircle, X, ChevronRight,
  FileText, Calendar, Droplet, Activity
} from 'lucide-react';

const mockLabOrders = [
  { id: '1', patient: 'Sarah Nakato', patientId: '1', test: 'Complete Blood Count (CBC)', category: 'Blood', status: 'completed', orderedAt: '2026-04-15 10:00', collectedAt: '2026-04-15 10:30', resultsAt: '2026-04-15 14:00', results: { wbc: '7.5', rbc: '4.8', hb: '14.2', hct: '42%', plt: '250' } },
  { id: '2', patient: 'Peter Ochieng', patientId: '2', test: 'Fasting Blood Glucose', category: 'Blood', status: 'collected', orderedAt: '2026-04-16 09:00', collectedAt: '2026-04-16 09:15', resultsAt: null, results: null },
  { id: '3', patient: 'Mary Kagaba', patientId: '3', test: 'Urinalysis', category: 'Urine', status: 'pending', orderedAt: '2026-04-16 11:00', collectedAt: null, resultsAt: null, results: null },
  { id: '4', patient: 'James Wekesa', patientId: '4', test: 'Chest X-Ray', category: 'X-Ray', status: 'completed', orderedAt: '2026-04-14 14:00', collectedAt: '2026-04-14 15:00', resultsAt: '2026-04-14 17:00', results: 'Normal chest radiograph' },
  { id: '5', patient: 'Grace Nabisere', patientId: '5', test: 'Typhoid Rapid Test', category: 'Blood', status: 'collected', orderedAt: '2026-04-16 08:30', collectedAt: '2026-04-16 08:45', resultsAt: null, results: null },
];

const testCategories = [
  { id: 'blood', name: 'Blood Tests', icon: Droplet, tests: ['CBC', 'Blood Glucose', 'Typhoid', 'Malaria', 'HIV', 'Hepatitis B'] },
  { id: 'urine', name: 'Urine Tests', icon: FlaskConical, tests: ['Urinalysis', 'Urine Culture'] },
  { id: 'stool', name: 'Stool Tests', icon: TestTube, tests: ['Stool Microscopy', 'Occult Blood'] },
  { id: 'xray', name: 'X-Ray', icon: Activity, tests: ['Chest X-Ray', 'Abdominal X-Ray', 'Bone X-Ray'] },
  { id: 'ultrasound', name: 'Ultrasound', icon: Activity, tests: ['Abdominal Ultrasound', 'Pelvic Ultrasound', 'Obstetric Ultrasound'] },
];

const pendingOrders = mockLabOrders.filter(o => o.status === 'pending');
const collectedOrders = mockLabOrders.filter(o => o.status === 'collected');
const completedOrders = mockLabOrders.filter(o => o.status === 'completed');

export function LabPage() {
  const { isDark, card, input, textMuted, getBadge } = useTheme();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const stats = {
    pending: pendingOrders.length,
    collected: collectedOrders.length,
    completed: completedOrders.length,
    today: mockLabOrders.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Lab Module</h1>
          <p className={cn("mt-1", textMuted)}>Manage lab tests and results</p>
        </div>
        <button
          onClick={() => setShowNewOrderModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
        >
          <Plus size={18} />
          New Test Order
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Today's Orders</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.today}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-blue-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"}>
              <FlaskConical size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Pending</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-yellow-400" : "text-yellow-600")}>{stats.pending}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-yellow-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center"}>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Collected</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-purple-400" : "text-purple-600")}>{stats.collected}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-purple-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center"}>
              <Droplet size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Completed</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-green-400" : "text-green-600")}>{stats.completed}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-green-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"}>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
        <div className={cn("border-b overflow-x-auto", isDark ? "border-slate-800" : "border-gray-100")}>
          <div className="flex min-w-max">
            {[
              { id: 'orders', label: 'Test Orders', icon: FlaskConical },
              { id: 'categories', name: 'test-categories', label: 'Test Categories', icon: Filter },
              { id: 'results', label: 'Results', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent",
                  isDark ? "text-slate-400" : "text-gray-500"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by patient name or test..."
                  className={cn("w-full pl-12 pr-4 py-3 rounded-xl", input)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? "bg-slate-800" : "bg-gray-50"}>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Patient</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Test</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Category</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Ordered</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Status</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockLabOrders.map((order) => (
                      <tr key={order.id} className={isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={isDark ? "h-8 w-8 rounded-lg bg-blue-900/30 flex items-center justify-center" : "h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"}>
                              <User size={16} className="text-blue-600" />
                            </div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{order.patient}</p>
                          </div>
                        </td>
                        <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-gray-600")}>{order.test}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                            order.category === 'Blood' ? (isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") :
                            order.category === 'Urine' ? (isDark ? "bg-yellow-900/50 text-yellow-400" : "bg-yellow-100 text-yellow-700") :
                            order.category === 'X-Ray' ? (isDark ? "bg-purple-900/50 text-purple-400" : "bg-purple-100 text-purple-700") :
                            (isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-700")
                          )}>
                            {order.category}
                          </span>
                        </td>
                        <td className={cn("px-4 py-3 text-sm", textMuted)}>{new Date(order.orderedAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", getBadge(order.status))}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {order.status === 'collected' && (
                            <button 
                              onClick={() => setShowResultsModal(order)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Enter Results
                            </button>
                          )}
                          {order.status === 'completed' && (
                            <button 
                              onClick={() => setShowResultsModal(order)}
                              className="text-sm text-green-600 hover:underline"
                            >
                              View Results
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <span className={cn("text-sm", textMuted)}>Awaiting sample</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCategories.map((cat) => (
                <div key={cat.id} className={cn("p-5 rounded-xl border", isDark ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100")}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={isDark ? "h-10 w-10 rounded-lg bg-blue-900/30 flex items-center justify-center" : "h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"}>
                      <cat.icon size={20} className="text-blue-600" />
                    </div>
                    <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{cat.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {cat.tests.map((test, i) => (
                      <div key={i} className={cn("text-sm py-2 px-3 rounded-lg", isDark ? "bg-slate-700/50 text-slate-300" : "bg-white text-gray-600")}>
                        {test}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <div key={order.id} className={cn("p-4 rounded-xl border", isDark ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100")}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={isDark ? "h-10 w-10 rounded-lg bg-green-900/30 flex items-center justify-center" : "h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center"}>
                        <CheckCircle size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{order.patient}</p>
                        <p className={cn("text-sm", textMuted)}>{order.test}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs", textMuted)}>{order.resultsAt}</span>
                  </div>
                  {order.results && typeof order.results === 'object' ? (
                    <div className={cn("grid grid-cols-2 md:grid-cols-5 gap-3 p-3 rounded-lg", isDark ? "bg-slate-700/50" : "bg-white")}>
                      {Object.entries(order.results).map(([key, value]) => (
                        <div key={key}>
                          <p className={cn("text-xs uppercase", textMuted)}>{key}</p>
                          <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-600")}>{order.results}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewOrderModal(false)}>
          <div className={cn("rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto", isDark ? "bg-slate-900" : "bg-white")} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>New Test Order</h2>
              <button onClick={() => setShowNewOrderModal(false)} className={cn("p-2 rounded-xl", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                <X size={20} className={textMuted} />
              </button>
            </div>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Patient</label>
                <select className={cn("w-full px-4 py-3 rounded-xl", input)}>
                  <option value="">Select patient...</option>
                  <option>Sarah Nakato (PT-001)</option>
                  <option>Peter Ochieng (PT-002)</option>
                  <option>Mary Kagaba (PT-003)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Test Category</label>
                <select className={cn("w-full px-4 py-3 rounded-xl", input)} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Select category...</option>
                  {testCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Test Type</label>
                <select className={cn("w-full px-4 py-3 rounded-xl", input)}>
                  <option value="">Select test...</option>
                  {selectedCategory && testCategories.find(c => c.id === selectedCategory)?.tests.map((test, i) => (
                    <option key={i} value={test}>{test}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Notes</label>
                <textarea className={cn("w-full px-4 py-3 rounded-xl resize-none", input)} rows={3} placeholder="Any special instructions..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Create Order</button>
                <button type="button" onClick={() => setShowNewOrderModal(false)} className={cn("flex-1 px-4 py-3 rounded-xl font-medium border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}