import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store';
import { cn } from '@/lib/utils';
import {
  Building2, Clock, Bell, Palette, Database, Sun, Moon, Save,
  Download, Upload, Trash2, Mail, MessageSquare, ToggleLeft, ToggleRight
} from 'lucide-react';

const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function SettingsPage() {
  const { isDark, card, input, textMuted, getBadge } = useTheme();
  const { theme, setTheme, toggleTheme } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('clinic');
  const [clinicInfo, setClinicInfo] = useState({
    name: 'SmartCare Ultra Clinic',
    address: 'Kampala Road, Plot 45',
    phone: '+256 700 123 456',
    email: 'info@smartcare.ug',
    logo: null
  });
  
  const [workingHours, setWorkingHours] = useState({
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '08:00',
    endTime: '18:00',
    saturdayStart: '09:00',
    saturdayEnd: '14:00'
  });
  
  const [notifications, setNotifications] = useState({
    smsEnabled: true,
    emailEnabled: true,
    appointmentReminders: true,
    labResultsAlerts: true,
    paymentNotifications: true,
    marketingEmails: false
  });

  const tabs = [
    { id: 'clinic', label: 'Clinic Information', icon: Building2 },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  const handleSaveClinic = () => {
    alert('Clinic information saved!');
  };

  const handleExportData = () => {
    alert('Exporting data...');
  };

  const handleBackup = () => {
    alert('Backup created!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Settings</h1>
          <p className={cn("mt-1", textMuted)}>Manage your clinic configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={cn("rounded-2xl p-4 shadow-sm border", card)}>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : isDark
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'clinic' && (
            <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
              <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Building2 size={24} />
                Clinic Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className={cn("h-24 w-24 rounded-xl flex items-center justify-center text-3xl", isDark ? "bg-slate-800" : "bg-gray-100")}>
                    🏥
                  </div>
                  <div>
                    <button className={cn("px-4 py-2 rounded-lg text-sm font-medium border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}>
                      Change Logo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Clinic Name</label>
                    <input
                      type="text"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={clinicInfo.name}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Phone Number</label>
                    <input
                      type="tel"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={clinicInfo.phone}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Address</label>
                  <input
                    type="text"
                    className={cn("w-full px-4 py-3 rounded-xl", input)}
                    value={clinicInfo.address}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Email Address</label>
                  <input
                    type="email"
                    className={cn("w-full px-4 py-3 rounded-xl", input)}
                    value={clinicInfo.email}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleSaveClinic}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
              <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Clock size={24} />
                Working Hours
              </h2>

              <div className="space-y-6">
                <div>
                  <label className={cn("text-sm font-medium mb-3 block", isDark ? "text-slate-300" : "text-gray-700")}>Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {workingDays.map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          const newDays = workingHours.days.includes(day)
                            ? workingHours.days.filter(d => d !== day)
                            : [...workingHours.days, day];
                          setWorkingHours({ ...workingHours, days: newDays });
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          workingHours.days.includes(day)
                            ? "bg-blue-600 text-white"
                            : isDark
                              ? "bg-slate-800 text-slate-400"
                              : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Weekday Start Time</label>
                    <input
                      type="time"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={workingHours.startTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Weekday End Time</label>
                    <input
                      type="time"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={workingHours.endTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Saturday Start</label>
                    <input
                      type="time"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={workingHours.saturdayStart}
                      onChange={(e) => setWorkingHours({ ...workingHours, saturdayStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Saturday End</label>
                    <input
                      type="time"
                      className={cn("w-full px-4 py-3 rounded-xl", input)}
                      value={workingHours.saturdayEnd}
                      onChange={(e) => setWorkingHours({ ...workingHours, saturdayEnd: e.target.value })}
                    />
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                  <Save size={18} />
                  Save Hours
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
              <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Bell size={24} />
                Notification Settings
              </h2>

              <div className="space-y-6">
                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <h3 className={cn("font-medium mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <MessageSquare size={18} />
                    SMS Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'appointmentReminders', label: 'Appointment Reminders' },
                      { key: 'labResultsAlerts', label: 'Lab Results Alerts' },
                      { key: 'paymentNotifications', label: 'Payment Notifications' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className={cn(textMuted)}>{item.label}</span>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                          className={notifications[item.key] ? "text-blue-600" : (isDark ? "text-slate-500" : "text-gray-400")}
                        >
                          {notifications[item.key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <h3 className={cn("font-medium mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <Mail size={18} />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailEnabled', label: 'Enable Email Notifications' },
                      { key: 'marketingEmails', label: 'Marketing & Updates' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className={cn(textMuted)}>{item.label}</span>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                          className={notifications[item.key] ? "text-blue-600" : (isDark ? "text-slate-500" : "text-gray-400")}
                        >
                          {notifications[item.key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
              <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Palette size={24} />
                Theme Selection
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all",
                      theme === 'light'
                        ? "border-blue-600 bg-blue-50"
                        : isDark
                          ? "border-slate-700 hover:border-slate-600"
                          : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className={cn("h-16 rounded-xl mb-3 flex items-center justify-center", isDark ? "bg-slate-800" : "bg-white border")}>
                      <Sun size={32} className={theme === 'light' ? "text-yellow-500" : (isDark ? "text-slate-400" : "text-gray-400")} />
                    </div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Light Mode</p>
                    <p className={cn("text-sm", textMuted)}>Bright and clean</p>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all",
                      theme === 'dark'
                        ? "border-blue-600 bg-blue-50"
                        : isDark
                          ? "border-slate-700 hover:border-slate-600"
                          : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className={cn("h-16 rounded-xl mb-3 flex items-center justify-center", isDark ? "bg-slate-800" : "bg-slate-900 border")}>
                      <Moon size={32} className={theme === 'dark' ? "text-blue-400" : (isDark ? "text-slate-400" : "text-gray-400")} />
                    </div>
                    <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Dark Mode</p>
                    <p className={cn("text-sm", textMuted)}>Easy on the eyes</p>
                  </button>
                </div>

                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>Auto Theme Toggle</p>
                      <p className={cn("text-sm", textMuted)}>Switch between light and dark automatically</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={theme === 'dark' ? "text-blue-600" : (isDark ? "text-slate-500" : "text-gray-400")}
                    >
                      {theme === 'dark' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
              <h2 className={cn("text-xl font-bold mb-6 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Database size={24} />
                Data Management
              </h2>

              <div className="space-y-6">
                <div className={cn("p-6 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <h3 className={cn("font-medium mb-4", isDark ? "text-white" : "text-gray-900")}>Export Data</h3>
                  <p className={cn("text-sm mb-4", textMuted)}>Download your clinic data in various formats</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleExportData}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}
                    >
                      <Download size={16} />
                      Export CSV
                    </button>
                    <button
                      onClick={handleExportData}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}
                    >
                      <Download size={16} />
                      Export PDF
                    </button>
                    <button
                      onClick={handleExportData}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}
                    >
                      <Download size={16} />
                      Export JSON
                    </button>
                  </div>
                </div>

                <div className={cn("p-6 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <h3 className={cn("font-medium mb-4", isDark ? "text-white" : "text-gray-900")}>Backup & Restore</h3>
                  <p className={cn("text-sm mb-4", textMuted)}>Create backups or restore from previous backups</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleBackup}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Database size={16} />
                      Create Backup
                    </button>
                    <button
                      onClick={() => alert('Restore functionality')}
                      className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}
                    >
                      <Upload size={16} />
                      Restore
                    </button>
                  </div>
                </div>

                <div className={cn("p-6 rounded-xl border border-red-200 bg-red-50")}>
                  <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                  <p className={cn("text-sm mb-4", textMuted)}>Permanently delete data. This action cannot be undone.</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Trash2 size={16} />
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}