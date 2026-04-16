import React, { useState, useEffect } from 'react';
import { 
  Send, Clock, CheckCircle, XCircle, MessageSquare,
  Search, Filter, RefreshCw, Plus, Phone, Users,
  Calendar, Bell, AlertTriangle, Settings, ChevronDown,
  Play, Pause, Trash2, Eye, Copy, Star
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const mockSMSLogs = [
  { id: '1', recipient: '+256701234567', patient: 'Sarah Nakato', message: 'Reminder: Your appointment with Dr. James Okello is tomorrow at 10:00 AM.', type: 'appointment', status: 'delivered', sentAt: '2026-04-13 08:00', deliveredAt: '2026-04-13 08:01' },
  { id: '2', recipient: '+256702345678', patient: 'Peter Ochieng', message: 'Your lab results are ready. Please visit the clinic to collect them.', type: 'lab', status: 'delivered', sentAt: '2026-04-12 14:30', deliveredAt: '2026-04-12 14:31' },
  { id: '3', recipient: '+256703456789', patient: 'Mary Kagaba', message: 'Payment reminder: Invoice #INV-005 of UGX 18,500 is overdue.', type: 'billing', status: 'delivered', sentAt: '2026-04-11 09:00', deliveredAt: '2026-04-11 09:00' },
  { id: '4', recipient: '+256704567890', patient: 'James Wekesa', message: 'Thank you for choosing SmartCare Clinic. We value your feedback.', type: 'marketing', status: 'delivered', sentAt: '2026-04-10 11:00', deliveredAt: '2026-04-10 11:01' },
  { id: '5', recipient: '+256705678901', patient: 'Grace Nabisere', message: 'Your prescription is ready for pickup at our pharmacy.', type: 'pharmacy', status: 'pending', sentAt: '2026-04-13 07:30', deliveredAt: null },
  { id: '6', recipient: '+256706789012', patient: 'John Sserugo', message: 'Health tip: Remember to take your medication as prescribed.', type: 'health', status: 'delivered', sentAt: '2026-04-09 08:00', deliveredAt: '2026-04-09 08:01' },
  { id: '7', recipient: '+256707890123', patient: 'Alice Nansikombi', message: 'Your appointment has been confirmed for April 15th at 2:00 PM.', type: 'appointment', status: 'failed', sentAt: '2026-04-08 10:00', deliveredAt: null },
];

const templates = [
  { id: '1', name: 'Appointment Reminder', template: 'Reminder: Your appointment with {doctor} is tomorrow at {time}.', category: 'appointment' },
  { id: '2', name: 'Lab Results Ready', template: 'Your lab results are ready. Please visit the clinic to collect them.', category: 'lab' },
  { id: '3', name: 'Payment Reminder', template: 'Payment reminder: Invoice #{invoice} of UGX {amount} is overdue.', category: 'billing' },
  { id: '4', name: 'Prescription Ready', template: 'Your prescription is ready for pickup at our pharmacy.', category: 'pharmacy' },
  { id: '5', name: 'Follow-up', template: 'It has been {days} days since your last visit. Please schedule a follow-up appointment.', category: 'health' },
  { id: '6', name: 'Welcome Message', template: 'Welcome to {clinic}! Thank you for choosing us for your healthcare needs.', category: 'marketing' },
];

const scheduledMessages = [
  { id: '1', recipient: '+256701234567', patient: 'Sarah Nakato', message: 'Reminder: Your follow-up appointment is in 3 days.', scheduledFor: '2026-04-16 08:00', status: 'scheduled' },
  { id: '2', recipient: '+256702345678', patient: 'Peter Ochieng', message: 'Health tip: Stay hydrated! Drink at least 8 glasses of water daily.', scheduledFor: '2026-04-15 09:00', status: 'scheduled' },
];

export function SMSPage() {
  const { isDark, input, textMuted, getBadge } = useTheme();
  const [activeTab, setActiveTab] = useState('compose');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '', patient: '', message: '', type: 'general'
  });

  useEffect(() => {
    setTimeout(() => {
      setLogs(mockSMSLogs);
      setLoading(false);
    }, 300);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.recipient.includes(searchTerm) ||
      log.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    sentToday: logs.length,
    delivered: logs.filter(l => l.status === 'delivered').length,
    pending: logs.filter(l => l.status === 'pending').length,
    failed: logs.filter(l => l.status === 'failed').length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      delivered: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      scheduled: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeBadge = (type) => {
    const styles = {
      appointment: 'bg-blue-100 text-blue-700',
      lab: 'bg-purple-100 text-purple-700',
      billing: 'bg-orange-100 text-orange-700',
      pharmacy: 'bg-teal-100 text-teal-700',
      health: 'bg-green-100 text-green-700',
      marketing: 'bg-pink-100 text-pink-700',
      general: 'bg-gray-100 text-gray-700',
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const handleSend = () => {
    const newLog = {
      id: String(Date.now()),
      ...formData,
      status: 'pending',
      sentAt: new Date().toISOString(),
      deliveredAt: null,
    };
    setLogs([newLog, ...logs]);
    setShowComposeModal(false);
    setFormData({ recipient: '', patient: '', message: '', type: 'general' });
  };

  const handleSelectTemplate = (template) => {
    setFormData({ ...formData, message: template.template });
    setShowTemplateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>SMS Center</h1>
          <p className={cn(textMuted, "mt-1")}>Send and manage patient communications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors", isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-gray-200 text-gray-700 hover:bg-gray-50")}
          >
            <Copy size={18} />
            Templates
          </button>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
          >
            <Send size={18} />
            Compose SMS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Sent Today</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.sentToday}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
              <Send size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Delivered</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.delivered}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-200/50 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-200/50 flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Failed</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{stats.failed}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-200/50 flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl shadow-sm overflow-hidden", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
        <div className={cn("border-b overflow-x-auto", isDark ? "border-slate-800" : "border-gray-100")}>
          <div className="flex min-w-max">
            {['compose', 'logs', 'scheduled', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn("flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors capitalize",
                  activeTab === tab
                    ? "border-blue-600 text-blue-600 bg-blue-500/10"
                    : cn("border-transparent", isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"))}
              >
                {tab === 'compose' && <MessageSquare size={18} />}
                {tab === 'logs' && <Clock size={18} />}
                {tab === 'scheduled' && <Calendar size={18} />}
                {tab === 'settings' && <Settings size={18} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'compose' && (
            <div className="max-w-2xl mx-auto">
              <div className={cn("rounded-2xl p-8", isDark ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30" : "bg-gradient-to-br from-blue-50 to-indigo-50")}>
                <h3 className={cn("text-lg font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>Quick Compose</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Recipient Phone</label>
                    <input
                      type="text"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      placeholder="+256701234567"
                      value={formData.recipient}
                      onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Patient Name (Optional)</label>
                    <input
                      type="text"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      placeholder="Search patient..."
                      value={formData.patient}
                      onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Message</label>
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Use Template
                      </button>
                    </div>
                    <textarea
                      className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                      rows={5}
                      placeholder="Type your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                    <p className={cn("text-xs text-right", textMuted)}>{formData.message.length}/160 characters</p>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!formData.recipient || !formData.message}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    Send SMS
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-gray-400")} size={20} />
                  <input
                    type="text"
                    placeholder="Search by phone or patient..."
                    className={cn("w-full pl-12 pr-4 py-3 rounded-xl", input)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={cn("px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200")}
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className={cn("text-center py-12", textMuted)}>
                    No SMS logs found
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className={cn("p-4 rounded-xl transition-colors", isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100")}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", isDark ? "bg-blue-900/50" : "bg-blue-100")}>
                            <Phone size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
                          </div>
                          <div>
                            <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{log.patient}</p>
                            <p className={cn("text-sm", textMuted)}>{log.recipient}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(log.type)}`}>
                            {log.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                      <p className={cn("text-sm mb-2 ml-13", isDark ? "text-slate-300" : "text-gray-600")}>{log.message}</p>
                      <div className={cn("flex items-center justify-between text-xs", textMuted)}>
                        <span>Sent: {new Date(log.sentAt).toLocaleString()}</span>
                        {log.deliveredAt && <span>Delivered: {new Date(log.deliveredAt).toLocaleString()}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-4">
              {scheduledMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className={cn("mx-auto mb-4", isDark ? "text-slate-600" : "text-gray-300")} />
                  <p className={textMuted}>No scheduled messages</p>
                </div>
              ) : (
                scheduledMessages.map((msg) => (
                  <div key={msg.id} className={cn("p-4 rounded-xl border", isDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-100")}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{msg.patient}</p>
                        <p className={cn("text-sm", textMuted)}>{msg.recipient}</p>
                      </div>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-700")}>
                        {msg.status}
                      </span>
                    </div>
                    <p className={cn("text-sm mb-2", isDark ? "text-slate-300" : "text-gray-600")}>{msg.message}</p>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs", textMuted)}>Scheduled: {new Date(msg.scheduledFor).toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button className={cn("p-1.5 rounded-lg transition-colors", isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-100")}>
                          <Play size={16} />
                        </button>
                        <button className={cn("p-1.5 rounded-lg transition-colors", isDark ? "text-yellow-400 hover:bg-yellow-900/30" : "text-yellow-600 hover:bg-yellow-100")}>
                          <Pause size={16} />
                        </button>
                        <button className={cn("p-1.5 rounded-lg transition-colors", isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-100")}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className={cn("rounded-2xl p-6", isDark ? "bg-slate-800" : "bg-gray-50")}>
                <h3 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>SMS Provider Settings</h3>
                <div className="space-y-4">
                  <div className={cn("flex items-center justify-between p-4 rounded-xl", isDark ? "bg-slate-900" : "bg-white")}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-yellow-400 flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>MTN Uganda</p>
                        <p className={cn("text-xs", textMuted)}>Active</p>
                      </div>
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")}>Connected</span>
                  </div>
                  <div className={cn("flex items-center justify-between p-4 rounded-xl", isDark ? "bg-slate-900" : "bg-white")}>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Airtel Uganda</p>
                        <p className={cn("text-xs", textMuted)}>Not connected</p>
                      </div>
                    </div>
                    <button className={cn("px-3 py-1.5 text-sm rounded-lg transition-colors", isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50")}>
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              <div className={cn("rounded-2xl p-6", isDark ? "bg-slate-800" : "bg-gray-50")}>
                <h3 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-gray-900")}>Auto Reminders</h3>
                <div className="space-y-3">
                  <label className={cn("flex items-center justify-between p-4 rounded-xl cursor-pointer", isDark ? "bg-slate-900" : "bg-white")}>
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-blue-600" />
                      <span className={isDark ? "text-slate-300" : "text-gray-700"}>Appointment Reminders</span>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded" />
                  </label>
                  <label className={cn("flex items-center justify-between p-4 rounded-xl cursor-pointer", isDark ? "bg-slate-900" : "bg-white")}>
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} className="text-orange-600" />
                      <span className={isDark ? "text-slate-300" : "text-gray-700"}>Overdue Payment Alerts</span>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded" />
                  </label>
                  <label className={cn("flex items-center justify-between p-4 rounded-xl cursor-pointer", isDark ? "bg-slate-900" : "bg-white")}>
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-purple-600" />
                      <span className={isDark ? "text-slate-300" : "text-gray-700"}>Lab Results Ready</span>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowComposeModal(false)}>
          <div className={cn("rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl", isDark ? "bg-slate-900" : "bg-white")} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Compose SMS</h2>
              <button onClick={() => setShowComposeModal(false)} className={cn("p-2 rounded-xl transition-colors", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                <XCircle size={20} className={textMuted} />
              </button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Recipient</label>
                <input
                  type="text"
                  className={cn("w-full px-4 py-3 rounded-xl", input)}
                  placeholder="+256701234567"
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Type</label>
                <select
                  className={cn("w-full px-4 py-3 rounded-xl", input)}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="general">General</option>
                  <option value="appointment">Appointment</option>
                  <option value="billing">Billing</option>
                  <option value="lab">Lab Results</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Message</label>
                <textarea
                  className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                  rows={4}
                  placeholder="Type your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSend}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  <Send size={18} className="inline mr-2" />
                  Send Now
                </button>
                <button onClick={() => setShowComposeModal(false)} className={cn("flex-1 px-4 py-3 rounded-xl font-medium transition-all", isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-gray-200 text-gray-700 hover:bg-gray-50")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTemplateModal(false)}>
          <div className={cn("rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto", isDark ? "bg-slate-900" : "bg-white")} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>SMS Templates</h2>
              <button onClick={() => setShowTemplateModal(false)} className={cn("p-2 rounded-xl transition-colors", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                <XCircle size={20} className={textMuted} />
              </button>
            </div>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={cn("p-4 rounded-xl cursor-pointer transition-colors", isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{template.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-gray-600")}>{template.template}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
