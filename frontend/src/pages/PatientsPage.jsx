import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Search, Plus, X, Eye, User } from 'lucide-react';

const mockPatients = [
  { id: '1', patientNumber: 'PT-001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701234567', email: 'sarah@email.com', address: 'Kampala', createdAt: '2026-04-01' },
  { id: '2', patientNumber: 'PT-002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702345678', email: 'peter@email.com', address: 'Entebbe', createdAt: '2026-04-02' },
  { id: '3', patientNumber: 'PT-003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703456789', email: 'mary@email.com', address: 'Jinja', createdAt: '2026-04-03' },
  { id: '4', patientNumber: 'PT-004', firstName: 'James', lastName: 'Wekesa', gender: 'MALE', phone: '+256704567890', email: 'james@email.com', address: 'Mbarara', createdAt: '2026-04-04' },
  { id: '5', patientNumber: 'PT-005', firstName: 'Grace', lastName: 'Nabisere', gender: 'FEMALE', phone: '+256705678901', email: 'grace@email.com', address: 'Gulu', createdAt: '2026-04-05' },
  { id: '6', patientNumber: 'PT-006', firstName: 'John', lastName: 'Sserugo', gender: 'MALE', phone: '+256706789012', email: 'john@email.com', address: 'Kampala', createdAt: '2026-04-06' },
  { id: '7', patientNumber: 'PT-007', firstName: 'Alice', lastName: 'Nansikombi', gender: 'FEMALE', phone: '+256707890123', email: 'alice@email.com', address: 'Wakiso', createdAt: '2026-04-07' },
  { id: '8', patientNumber: 'PT-008', firstName: 'Robert', lastName: 'Mukasa', gender: 'MALE', phone: '+256708901234', email: 'robert@email.com', address: 'Kampala', createdAt: '2026-04-08' },
];

export function PatientsPage() {
  const navigate = useNavigate();
  const { isDark, card, input, textMuted, tableHead, tableRow, tableCell, getBadge } = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'MALE', phone: '', email: '', address: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 300);
  }, []);

  const filteredPatients = patients.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      p.firstName?.toLowerCase().includes(search) ||
      p.lastName?.toLowerCase().includes(search) ||
      p.patientNumber?.toLowerCase().includes(search) ||
      p.phone?.includes(search)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = {
      id: String(Date.now()),
      patientNumber: `PT-${String(patients.length + 1).padStart(3, '0')}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      createdAt: new Date().toISOString()
    };
    setPatients([...patients, newPatient]);
    setShowAddModal(false);
    setFormData({ firstName: '', lastName: '', gender: 'MALE', phone: '', email: '', address: '' });
  };

  const viewPatient = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Patients</h1>
          <p className={cn("mt-1", textMuted)}>{filteredPatients.length} total patients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
        <div className={cn("p-4 md:p-6 border-b", isDark ? "border-slate-800" : "border-gray-100")}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, patient number, or phone..."
                className={cn("w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all", input)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className={cn("px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", input)}>
              <option>All Genders</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className={cn("sticky top-0", tableHead)}>
              <tr>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Patient</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Gender</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Phone</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Email</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Address</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Registered</th>
                <th className={cn("text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider", textMuted)}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7"Name={cn("text-center py-12", textMuted)}>
                    {searchTerm ? 'No patients match your search.' : 'No patients found. Add your first patient!'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className={cn("transition-colors", tableRow)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow ${
                          patient.gender === 'MALE' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'
                        }`}>
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                          <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{patient.firstName} {patient.lastName}</p>
                          <p className={cn("text-sm", textMuted)}>{patient.patientNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${
                        patient.gender === 'MALE' ? (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700') : (isDark ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-100 text-pink-700')
                      }`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td className={cn("px-6 py-4", tableCell)}>{patient.phone || '-'}</td>
                    <td className={cn("px-6 py-4", tableCell)}>{patient.email || '-'}</td>
                    <td className={cn("px-6 py-4", tableCell)}>{patient.address || '-'}</td>
                    <td className={cn("px-6 py-4", tableCell)}>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewPatient(patient)}
                        className={cn("inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors", isDark ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50" : "text-blue-600 bg-blue-50 hover:bg-blue-100")}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className={cn("rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl", isDark ? "bg-slate-900" : "bg-white")} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Add New Patient</h2>
                <p className={cn("text-sm mt-1", textMuted)}>Fill in the patient details below</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className={cn("p-2 rounded-xl transition-colors", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                <X size={20} className={textMuted} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>First Name</label>
                  <input
                    type="text"
                    className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Last Name</label>
                  <input
                    type="text"
                    className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Gender</label>
                <select
                  className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Phone</label>
                <input
                  type="text"
                  className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+256..."
                />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Email</label>
                <input
                  type="email"
                  className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Address</label>
                <input
                  type="text"
                  className={cn("w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", input)}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25">
                  Add Patient
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className={cn("flex-1 px-4 py-3 rounded-xl font-medium transition-all border", isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-700 hover:bg-gray-50")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
