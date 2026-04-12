import React, { useState, useEffect } from 'react';
import { patients as patientsApi } from '@/lib/api';

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
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'MALE', phone: '', email: '', address: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data } = await patientsApi.getAll({});
      setPatients(data.length > 0 ? data : mockPatients);
    } catch (err) {
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

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
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">Manage patient records ({filteredPatients.length} patients)</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
          >
            <span>+</span> Add Patient
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">&#128269;</span>
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPatients.length} of {patients.length} patients
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Patient #</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Gender</th>
                <th className="text-left p-3 font-medium">Phone</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Registered</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8">Loading...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-muted-foreground">
                    {searchTerm ? 'No patients match your search.' : 'No patients found. Add your first patient!'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className={`border-t hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-3 font-medium">{patient.patientNumber}</td>
                    <td className="p-3">{patient.firstName} {patient.lastName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        patient.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {patient.gender}
                      </span>
                    </td>
                    <td className="p-3">{patient.phone || '-'}</td>
                    <td className="p-3">{patient.email || '-'}</td>
                    <td className="p-3">{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => viewPatient(patient)}
                        className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 mr-2"
                      >
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md border shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded">
                <span>&#10005;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+256..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Add Patient
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-md hover:bg-muted">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowViewModal(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-lg border shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-muted rounded">
                <span>&#10005;</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Patient #:</span>
                <span>{selectedPatient.patientNumber}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Name:</span>
                <span>{selectedPatient.firstName} {selectedPatient.lastName}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Gender:</span>
                <span>{selectedPatient.gender}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Phone:</span>
                <span>{selectedPatient.phone || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Email:</span>
                <span>{selectedPatient.email || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Address:</span>
                <span>{selectedPatient.address || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded">
                <span className="font-medium">Registered:</span>
                <span>{selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowViewModal(false)} className="flex-1 px-4 py-2 border rounded-md hover:bg-muted">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
