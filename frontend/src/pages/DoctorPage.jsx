import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { 
  Stethoscope, FileText, Pill, Search, Plus, User, 
  Calendar, Clock, CheckCircle, AlertCircle, X, Save,
  ChevronRight, Activity, Heart, Thermometer, Droplet,
  ClipboardList, FlaskConical, MessageSquare, Send
} from 'lucide-react';

const patients = [
  { id: '1', name: 'Sarah Nakato', age: 33, gender: 'F', chiefComplaint: 'Persistent cough and fever', visitType: 'Follow-up', status: 'waiting', avatar: 'SN' },
  { id: '2', name: 'Peter Ochieng', age: 45, gender: 'M', chiefComplaint: 'Chest pain and shortness of breath', visitType: 'Consultation', status: 'in-progress', avatar: 'PO' },
  { id: '3', name: 'Mary Kagaba', age: 28, gender: 'F', chiefComplaint: 'Annual checkup', visitType: 'Checkup', status: 'waiting', avatar: 'MK' },
  { id: '4', name: 'James Wekesa', age: 52, gender: 'M', chiefComplaint: 'Diabetes follow-up', visitType: 'Follow-up', status: 'completed', avatar: 'JW' },
  { id: '5', name: 'Grace Nabisere', age: 40, gender: 'F', chiefComplaint: 'Headache and dizziness', visitType: 'Consultation', status: 'waiting', avatar: 'GN' },
];

const consultations = [
  { id: '1', patient: 'James Wekesa', diagnosis: 'Type 2 Diabetes - Controlled', date: '2026-04-15', doctor: 'Dr. Okello' },
  { id: '2', patient: 'Peter Ochieng', diagnosis: 'Acute Bronchitis', date: '2026-04-14', doctor: 'Dr. Okello' },
  { id: '3', patient: 'Sarah Nakato', diagnosis: 'Upper Respiratory Infection', date: '2026-04-13', doctor: 'Dr. Akello' },
];

const prescriptions = [
  { id: '1', patient: 'Sarah Nakato', medication: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily', status: 'pending', date: '2026-04-16' },
  { id: '2', patient: 'Peter Ochieng', medication: 'Paracetamol 500mg', dosage: '1 tablet 4x daily', status: 'dispensed', date: '2026-04-15' },
  { id: '3', patient: 'Mary Kagaba', medication: 'Metformin 500mg', dosage: '1 tablet 2x daily', status: 'pending', date: '2026-04-15' },
];

export function DoctorPage() {
  const { isDark, card, input, textMuted, getBadge } = useTheme();
  const [activeTab, setActiveTab] = useState('consultation');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [consultation, setConsultation] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    examination: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    vitals: { temperature: '', bp: '', pulse: '', weight: '' }
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setShowConsultationModal(true);
  };

  const handleSaveConsultation = () => {
    console.log('Saving consultation:', consultation);
    setShowConsultationModal(false);
    setConsultation({
      chiefComplaint: '',
      historyOfPresentIllness: '',
      examination: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      vitals: { temperature: '', bp: '', pulse: '', weight: '' }
    });
    setSelectedPatient(null);
  };

  const stats = {
    todayPatients: patients.filter(p => p.status !== 'completed').length,
    pendingPrescriptions: prescriptions.filter(p => p.status === 'pending').length,
    completedToday: consultations.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Doctor Module</h1>
          <p className={cn("mt-1", textMuted)}>Diagnosis, prescriptions and patient management</p>
        </div>
        <div className="flex gap-3">
          <select className={cn("px-4 py-2.5 rounded-xl text-sm font-medium", input)}>
            <option>Dr. James Okello</option>
            <option>Dr. Faith Akello</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Today's Patients</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.todayPatients}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-blue-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"}>
              <Stethoscope size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Pending Prescriptions</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.pendingPrescriptions}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-purple-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center"}>
              <Pill size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Completed Today</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.completedToday}</p>
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
              { id: 'consultation', label: 'Consultation', icon: Stethoscope },
              { id: 'patients', label: 'Patient Queue', icon: User },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'history', label: 'History', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent hover:text-gray-700",
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
          {activeTab === 'consultation' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patient by name..."
                  className={cn("w-full pl-12 pr-4 py-3 rounded-xl", input)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {filteredPatients.filter(p => p.status !== 'completed').map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handleStartConsultation(patient)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md",
                      isDark ? "bg-slate-800/50 hover:bg-slate-800" : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {patient.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{patient.name}</p>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", getBadge(patient.status === 'in-progress' ? 'active' : 'pending'))}>
                          {patient.status === 'in-progress' ? 'In Progress' : 'Waiting'}
                        </span>
                      </div>
                      <p className={cn("text-sm", textMuted)}>{patient.chiefComplaint}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{patient.visitType}</p>
                      <p className={cn("text-xs", textMuted)}>{patient.age} yrs, {patient.gender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                    <ChevronRight size={20} className={textMuted} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  isDark ? "bg-slate-800/50" : "bg-gray-50"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {patient.avatar}
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{patient.name}</p>
                      <p className={cn("text-sm", textMuted)}>{patient.age} yrs • {patient.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs px-3 py-1 rounded-full", getBadge(patient.status))}>
                      {patient.status}
                    </span>
                    <button
                      onClick={() => handleStartConsultation(patient)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isDark ? "bg-slate-800" : "bg-gray-50"}>
                    <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Patient</th>
                    <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Medication</th>
                    <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Dosage</th>
                    <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Date</th>
                    <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prescriptions.map((rx) => (
                    <tr key={rx.id} className={isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"}>
                      <td className={cn("px-4 py-3 font-medium", isDark ? "text-white" : "text-gray-900")}>{rx.patient}</td>
                      <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-gray-600")}>{rx.medication}</td>
                      <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-gray-600")}>{rx.dosage}</td>
                      <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-gray-600")}>{rx.date}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", getBadge(rx.status))}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {consultations.map((consult) => (
                <div key={consult.id} className={cn(
                  "p-4 rounded-xl border",
                  isDark ? "bg-slate-800/50 border-slate-800" : "bg-gray-50 border-gray-100"
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{consult.patient}</p>
                      <p className={cn("text-sm", textMuted)}>{consult.doctor}</p>
                    </div>
                    <span className={cn("text-xs", textMuted)}>{consult.date}</span>
                  </div>
                  <div className={cn("px-3 py-2 rounded-lg text-sm", isDark ? "bg-slate-700/50" : "bg-white")}>
                    <span className={cn("font-medium", textMuted)}>Diagnosis: </span>
                    <span className={isDark ? "text-slate-300" : "text-gray-700"}>{consult.diagnosis}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showConsultationModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={cn("bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto", isDark ? "bg-slate-900" : "bg-white")}>
            <div className={cn("p-6 border-b sticky top-0 z-10", isDark ? "border-slate-800 bg-slate-900" : "border-gray-100 bg-white")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {selectedPatient.avatar}
                  </div>
                  <div>
                    <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>{selectedPatient.name}</h2>
                    <p className={cn("text-sm", textMuted)}>{selectedPatient.age} yrs, {selectedPatient.gender === 'M' ? 'Male' : 'Female'} • {selectedPatient.chiefComplaint}</p>
                  </div>
                </div>
                <button onClick={() => setShowConsultationModal(false)} className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                  <X size={20} className={textMuted} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer size={16} className="text-red-500" />
                    <span className={cn("text-xs", textMuted)}>Temperature</span>
                  </div>
                  <input
                    type="text"
                    placeholder="37.0°C"
                    className={cn("w-full bg-transparent font-semibold text-lg outline-none", isDark ? "text-white" : "text-gray-900")}
                    value={consultation.vitals.temperature}
                    onChange={(e) => setConsultation({...consultation, vitals: {...consultation.vitals, temperature: e.target.value}})}
                  />
                </div>
                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart size={16} className="text-pink-500" />
                    <span className={cn("text-xs", textMuted)}>Blood Pressure</span>
                  </div>
                  <input
                    type="text"
                    placeholder="120/80"
                    className={cn("w-full bg-transparent font-semibold text-lg outline-none", isDark ? "text-white" : "text-gray-900")}
                    value={consultation.vitals.bp}
                    onChange={(e) => setConsultation({...consultation, vitals: {...consultation.vitals, bp: e.target.value}})}
                  />
                </div>
                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={16} className="text-blue-500" />
                    <span className={cn("text-xs", textMuted)}>Pulse</span>
                  </div>
                  <input
                    type="text"
                    placeholder="72 bpm"
                    className={cn("w-full bg-transparent font-semibold text-lg outline-none", isDark ? "text-white" : "text-gray-900")}
                    value={consultation.vitals.pulse}
                    onChange={(e) => setConsultation({...consultation, vitals: {...consultation.vitals, pulse: e.target.value}})}
                  />
                </div>
                <div className={cn("p-4 rounded-xl", isDark ? "bg-slate-800" : "bg-gray-50")}>
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet size={16} className="text-purple-500" />
                    <span className={cn("text-xs", textMuted)}>Weight</span>
                  </div>
                  <input
                    type="text"
                    placeholder="70 kg"
                    className={cn("w-full bg-transparent font-semibold text-lg outline-none", isDark ? "text-white" : "text-gray-900")}
                    value={consultation.vitals.weight}
                    onChange={(e) => setConsultation({...consultation, vitals: {...consultation.vitals, weight: e.target.value}})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>Chief Complaint</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={2}
                    placeholder="Patient's main concern..."
                    value={consultation.chiefComplaint}
                    onChange={(e) => setConsultation({...consultation, chiefComplaint: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>History of Present Illness</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={3}
                    placeholder="Describe the illness timeline and symptoms..."
                    value={consultation.historyOfPresentIllness}
                    onChange={(e) => setConsultation({...consultation, historyOfPresentIllness: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>Physical Examination</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={3}
                    placeholder="Examination findings..."
                    value={consultation.examination}
                    onChange={(e) => setConsultation({...consultation, examination: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>Diagnosis</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={2}
                    placeholder="Primary diagnosis and any secondary diagnoses..."
                    value={consultation.diagnosis}
                    onChange={(e) => setConsultation({...consultation, diagnosis: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>Treatment Plan</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={3}
                    placeholder="Medications, procedures, follow-up instructions..."
                    value={consultation.treatment}
                    onChange={(e) => setConsultation({...consultation, treatment: e.target.value})}
                  />
                </div>
                <div>
                  <label className={cn("text-sm font-medium mb-2 block", isDark ? "text-slate-300" : "text-gray-700")}>Additional Notes</label>
                  <textarea
                    className={cn("w-full px-4 py-3 rounded-xl resize-none", input)}
                    rows={2}
                    placeholder="Any other relevant information..."
                    value={consultation.notes}
                    onChange={(e) => setConsultation({...consultation, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveConsultation}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                  <Save size={18} />
                  Save Consultation
                </button>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className={cn("flex-1 px-4 py-3 rounded-xl font-medium transition-all", isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-gray-200 text-gray-700 hover:bg-gray-50")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}