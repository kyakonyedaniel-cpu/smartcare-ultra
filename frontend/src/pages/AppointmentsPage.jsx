import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Plus, ChevronLeft, ChevronRight, 
  X, Video, Phone, Home, Filter, MoreVertical, CheckCircle,
  AlertCircle, XCircle
} from 'lucide-react';

const mockAppointments = [
  { id: '1', patient: 'Sarah Nakato', patientId: '1', time: '09:00', duration: 30, type: 'Consultation', status: 'completed', doctor: 'Dr. James Okello', notes: 'Follow-up on hypertension medication' },
  { id: '2', patient: 'Peter Ochieng', patientId: '2', time: '09:30', duration: 30, type: 'Checkup', status: 'in-progress', doctor: 'Dr. James Okello', notes: 'Annual physical examination' },
  { id: '3', patient: 'Mary Kagaba', patientId: '3', time: '10:00', duration: 45, type: 'Consultation', status: 'scheduled', doctor: 'Dr. James Okello', notes: 'New patient intake' },
  { id: '4', patient: 'James Wekesa', patientId: '4', time: '10:30', duration: 30, type: 'Follow-up', status: 'scheduled', doctor: 'Dr. Faith Akello', notes: 'Lab results review' },
  { id: '5', patient: 'Grace Nabisere', patientId: '5', time: '11:00', duration: 30, type: 'Consultation', status: 'scheduled', doctor: 'Dr. James Okello', notes: 'Diabetes management' },
  { id: '6', patient: 'John Sserugo', patientId: '6', time: '11:30', duration: 60, type: 'Lab Test', status: 'scheduled', doctor: 'Dr. Faith Akello', notes: 'Blood glucose and HbA1c' },
  { id: '7', patient: 'Alice Nansikombi', patientId: '7', time: '14:00', duration: 30, type: 'Checkup', status: 'scheduled', doctor: 'Dr. James Okello', notes: 'Prenatal checkup' },
  { id: '8', patient: 'Robert Mukasa', patientId: '8', time: '15:00', duration: 30, type: 'Follow-up', status: 'scheduled', doctor: 'Dr. James Okello', notes: 'Post-surgery follow-up' },
];

const timeSlots = [];
for (let h = 8; h <= 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}

const appointmentTypes = [
  { id: 'consultation', label: 'Consultation', color: 'bg-blue-500', icon: User },
  { id: 'checkup', label: 'Checkup', color: 'bg-green-500', icon: CheckCircle },
  { id: 'follow-up', label: 'Follow-up', color: 'bg-purple-500', icon: Clock },
  { id: 'lab', label: 'Lab Test', color: 'bg-orange-500', icon: AlertCircle },
  { id: 'telehealth', label: 'Telehealth', color: 'bg-teal-500', icon: Video },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    patient: '', type: 'consultation', date: '', time: '09:00', duration: 30, doctor: '', notes: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 300);
  }, []);

  const getDaysInWeek = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getAppointmentsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date || currentDate).toISOString().split('T')[0];
      return aptDate === dateStr || apt.date === undefined;
    }).filter(apt => filterStatus === 'all' || apt.status === filterStatus);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeStyle = (type) => {
    const found = appointmentTypes.find(t => t.id === type);
    return found ? found.color : 'bg-gray-500';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: String(Date.now()),
      ...formData,
      status: 'scheduled',
    };
    setAppointments([...appointments, newAppointment]);
    setShowAddModal(false);
    setFormData({ patient: '', type: 'consultation', date: '', time: '09:00', duration: 30, doctor: '', notes: '' });
  };

  const stats = {
    today: appointments.filter(a => a.status !== 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">
            {viewMode === 'week' 
              ? `Week of ${getDaysInWeek()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Appointment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Today's Total</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{stats.today}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.completed}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-200/50 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Scheduled</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{stats.scheduled}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-200/50 flex items-center justify-center">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">{stats.inProgress}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-200/50 flex items-center justify-center">
              <AlertCircle size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {viewMode === 'week' ? (
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Time
                </div>
                {getDaysInWeek().map((day, i) => (
                  <div
                    key={i}
                    className={`p-4 text-center border-l border-gray-100 ${
                      isToday(day) ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {weekDays[day.getDay()]}
                    </p>
                    <p className={`text-lg font-bold mt-1 ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                {timeSlots.map((slot) => (
                  <div key={slot} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <div className="p-3 text-sm font-medium text-gray-500 bg-gray-50/50">
                      {slot}
                    </div>
                    {getDaysInWeek().map((day, dayIndex) => {
                      const dayAppointments = appointments.filter(apt => 
                        apt.time === slot && (
                          !apt.date || new Date(apt.date).toDateString() === day.toDateString()
                        )
                      );
                      return (
                        <div
                          key={dayIndex}
                          className={`min-h-[60px] p-2 border-l border-gray-100 ${
                            isToday(day) ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {dayAppointments.slice(0, 2).map((apt) => (
                            <div
                              key={apt.id}
                              onClick={() => setSelectedAppointment(apt)}
                              className={`p-2 rounded-lg mb-1 cursor-pointer text-white text-xs ${getTypeStyle(apt.type)} hover:opacity-90 transition-opacity`}
                            >
                              <p className="font-semibold truncate">{apt.patient}</p>
                              <p className="opacity-80 truncate">{apt.type}</p>
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <p className="text-xs text-gray-500 pl-2">+{dayAppointments.length - 2} more</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                {day}
              </div>
            ))}
            {getMonthDays().map((day, i) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isToday(day) ? 'bg-blue-50' : ''}`}
                >
                  <p className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday(day) ? 'w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center' : ''}`}>
                    {day.getDate()}
                  </p>
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className={`p-1 rounded mb-1 cursor-pointer text-white text-xs truncate ${getTypeStyle(apt.type)} hover:opacity-90 transition-opacity`}
                    >
                      {apt.time} {apt.patient.split(' ')[0]}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <p className="text-xs text-gray-500 pl-1">+{dayAppointments.length - 3} more</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Appointment</h2>
                <p className="text-sm text-gray-500 mt-1">Schedule a new patient appointment</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Patient</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.patient}
                  onChange={e => setFormData({...formData, patient: e.target.value})}
                  placeholder="Search or enter patient name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {appointmentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Doctor</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.doctor}
                  onChange={e => setFormData({...formData, doctor: e.target.value})}
                >
                  <option value="">Select doctor</option>
                  <option value="Dr. James Okello">Dr. James Okello</option>
                  <option value="Dr. Faith Akello">Dr. Faith Akello</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any notes or instructions..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25">
                  Schedule Appointment
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold ${
                  selectedAppointment.type === 'consultation' ? 'bg-blue-500' :
                  selectedAppointment.type === 'checkup' ? 'bg-green-500' :
                  selectedAppointment.type === 'follow-up' ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedAppointment.patient}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.time}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.duration} min</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Doctor</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.doctor}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                Start Session
              </button>
              <button className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                <Phone size={18} />
              </button>
              <button className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                <Video size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
