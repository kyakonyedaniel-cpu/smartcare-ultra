import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, 
  User, AlertCircle, Clock, Activity, Pill, 
  FileText, TestTube, Stethoscope, Edit, Printer,
  ChevronRight, Heart, Thermometer, Droplet, Wind
} from 'lucide-react';

const mockPatient = {
  id: '1',
  patientNumber: 'PT-001',
  firstName: 'Sarah',
  lastName: 'Nakato',
  gender: 'FEMALE',
  dateOfBirth: '1992-05-15',
  age: 33,
  phone: '+256701234567',
  email: 'sarah@email.com',
  address: 'Kampala, Uganda',
  emergencyContact: '+256772345678',
  bloodType: 'O+',
  allergies: ['Penicillin', 'Sulfa drugs'],
  conditions: ['Hypertension', 'Type 2 Diabetes'],
  insurance: 'JUBILEE Insurance - Policy #JUB-2024-5678',
  registeredAt: '2026-01-15',
  lastVisit: '2026-04-10'
};

const mockMedicalHistory = [
  { id: 1, date: '2026-04-10', type: 'consultation', doctor: 'Dr. James Okello', diagnosis: 'Upper Respiratory Infection', notes: 'Patient presented with cough and mild fever. Prescribed rest and antibiotics.', status: 'completed' },
  { id: 2, date: '2026-03-22', type: 'lab', doctor: 'Dr. Faith Akello', diagnosis: 'Blood Glucose Test', notes: 'Fasting blood glucose: 126 mg/dL (slightly elevated). Advised diet modification.', status: 'completed' },
  { id: 3, date: '2026-02-14', type: 'consultation', doctor: 'Dr. James Okello', diagnosis: 'Annual Checkup', notes: 'Routine checkup. Blood pressure normal. Continue current medications.', status: 'completed' },
  { id: 4, date: '2026-01-08', type: 'consultation', doctor: 'Dr. James Okello', diagnosis: 'Hypertension Follow-up', notes: 'BP controlled with Amlodipine 5mg. Continue same dosage.', status: 'completed' },
];

const mockPrescriptions = [
  { id: 1, date: '2026-04-10', medication: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily', duration: '7 days', prescribedBy: 'Dr. James Okello', status: 'active' },
  { id: 2, date: '2026-04-10', medication: 'Paracetamol 500mg', dosage: '1 tablet 4x daily', duration: '5 days', prescribedBy: 'Dr. James Okello', status: 'active' },
  { id: 3, date: '2026-02-14', medication: 'Metformin 500mg', dosage: '1 tablet 2x daily', duration: 'Ongoing', prescribedBy: 'Dr. James Okello', status: 'completed' },
  { id: 4, date: '2026-01-08', medication: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: 'Ongoing', prescribedBy: 'Dr. James Okello', status: 'active' },
];

const mockLabResults = [
  { id: 1, date: '2026-03-22', test: 'Fasting Blood Glucose', result: '126 mg/dL', reference: '70-100 mg/dL', status: 'high' },
  { id: 2, date: '2026-03-22', test: 'HbA1c', result: '6.2%', reference: '<5.7%', status: 'high' },
  { id: 3, date: '2026-02-14', test: 'Complete Blood Count', result: 'Normal', reference: '', status: 'normal' },
  { id: 4, date: '2026-02-14', test: 'Lipid Profile', result: 'Normal', reference: '', status: 'normal' },
  { id: 5, date: '2026-01-08', test: 'Blood Pressure', result: '130/85 mmHg', reference: '<120/80 mmHg', status: 'normal' },
];

const mockAppointments = [
  { id: 1, date: '2026-04-15', time: '10:00 AM', type: 'Follow-up', doctor: 'Dr. James Okello', status: 'scheduled' },
  { id: 2, date: '2026-04-10', time: '09:00 AM', type: 'Consultation', doctor: 'Dr. James Okello', status: 'completed' },
  { id: 3, date: '2026-03-22', time: '11:30 AM', type: 'Lab Test', doctor: 'Dr. Faith Akello', status: 'completed' },
  { id: 4, date: '2026-02-14', time: '10:00 AM', type: 'Checkup', doctor: 'Dr. James Okello', status: 'completed' },
];

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'history', label: 'Medical History', icon: Clock },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'lab', label: 'Lab Results', icon: TestTube },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
];

export function PatientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPatient(mockPatient);
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient not found</p>
        <button onClick={() => navigate('/patients')} className="mt-4 text-blue-600 hover:underline">
          Back to Patients
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      active: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-purple-100 text-purple-700',
      pending: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
      normal: 'bg-green-100 text-green-700',
      low: 'bg-orange-100 text-orange-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Patients</span>
        </button>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit size={18} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25">
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className={`h-24 w-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl ${
              patient.gender === 'MALE' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'
            }`}>
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
                <p className="text-gray-500">{patient.patientNumber} • {patient.gender === 'MALE' ? 'Male' : 'Female'}, {patient.age} years old</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{patient.bloodType}</span>
                {patient.allergies.length > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <AlertCircle size={14} /> Allergies
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Phone size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{patient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Mail size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <MapPin size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{patient.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Medical Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Blood Type</p>
                <p className="font-medium text-gray-900">{patient.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertCircle size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Allergies</p>
                <p className="font-medium text-gray-900">{patient.allergies.join(', ') || 'None recorded'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Activity size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Conditions</p>
                <p className="font-medium text-gray-900">{patient.conditions.join(', ') || 'None recorded'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Insurance & Registration</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FileText size={18} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Insurance</p>
                <p className="font-medium text-gray-900 text-sm">{patient.insurance || 'Self-pay'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <Calendar size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Registered</p>
                <p className="font-medium text-gray-900">{new Date(patient.registeredAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Clock size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Visit</p>
                <p className="font-medium text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Total Visits</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">12</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill size={18} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Prescriptions</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">8</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TestTube size={18} className="text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">Lab Tests</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">5</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">Invoices</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">4</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockMedicalHistory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        item.type === 'consultation' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {item.type === 'consultation' ? (
                          <Stethoscope size={18} className="text-blue-600" />
                        ) : (
                          <TestTube size={18} className="text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.diagnosis}</p>
                        <p className="text-sm text-gray-500">{item.doctor} • {new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {mockMedicalHistory.map((item, index) => (
                <div key={item.id} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0">
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] bg-white border-2 border-blue-500 rounded-full"></div>
                  <div className="p-4 bg-gray-50 rounded-xl ml-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{item.diagnosis}</p>
                        <p className="text-sm text-gray-500">{item.doctor}</p>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {mockPrescriptions.map((rx) => (
                  <div key={rx.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Pill size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{rx.medication}</p>
                          <p className="text-sm text-gray-500">{rx.prescribedBy}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(rx.status)}`}>
                        {rx.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Dosage</p>
                        <p className="font-medium text-gray-900">{rx.dosage}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">{rx.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{new Date(rx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Test</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Result</th>
                      <th className="pb-3 pr-4">Reference</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockLabResults.map((lab) => (
                      <tr key={lab.id} className="hover:bg-gray-50">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <TestTube size={16} className="text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900">{lab.test}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-gray-600">{new Date(lab.date).toLocaleDateString()}</td>
                        <td className="py-4 pr-4 font-semibold text-gray-900">{lab.result}</td>
                        <td className="py-4 pr-4 text-gray-500">{lab.reference || '-'}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(lab.status)}`}>
                            {lab.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {mockAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600 font-medium">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-blue-700">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{apt.type}</p>
                    <p className="text-sm text-gray-500">{apt.doctor} • {apt.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
