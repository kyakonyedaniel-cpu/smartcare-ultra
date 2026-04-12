import React, { useState, useEffect } from 'react';

const mockPatients = [
  { id: '1', patientNumber: 'PT-001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701234567', email: 'sarah@email.com', address: 'Kampala', createdAt: '2026-04-01' },
  { id: '2', patientNumber: 'PT-002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702345678', email: 'peter@email.com', address: 'Entebbe', createdAt: '2026-04-02' },
  { id: '3', patientNumber: 'PT-003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703456789', email: 'mary@email.com', address: 'Jinja', createdAt: '2026-04-03' },
  { id: '4', patientNumber: 'PT-004', firstName: 'James', lastName: 'Wekesa', gender: 'MALE', phone: '+256704567890', email: 'james@email.com', address: 'Mbarara', createdAt: '2026-04-04' },
  { id: '5', patientNumber: 'PT-005', firstName: 'Grace', lastName: 'Nabisere', gender: 'FEMALE', phone: '+256705678901', email: 'grace@email.com', address: 'Gulu', createdAt: '2026-04-05' },
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
    setPatients(mockPatients);
    setLoading(false);
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
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-gray-500">{filteredPatients.length} total patients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Patient
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, patient number, or phone..."
          className="w-full max-w-md px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-semibold">Patient #</th>
              <th className="text-left p-3 font-semibold">Full Name</th>
              <th className="text-left p-3 font-semibold">Gender</th>
              <th className="text-left p-3 font-semibold">Phone</th>
              <th className="text-left p-3 font-semibold">Email</th>
              <th className="text-left p-3 font-semibold">Address</th>
              <th className="text-left p-3 font-semibold">Registered</th>
              <th className="text-left p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-8">Loading...</td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  {searchTerm ? 'No patients match your search.' : 'No patients found.'}
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, index) => (
                <tr key={patient.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                  <td className="p-3">{patient.address || '-'}</td>
                  <td className="p-3">{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => viewPatient(patient)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Patient</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+256..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Patient
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Patient Number:</span>
                <span>{selectedPatient.patientNumber}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Full Name:</span>
                <span>{selectedPatient.firstName} {selectedPatient.lastName}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Gender:</span>
                <span>{selectedPatient.gender}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Phone:</span>
                <span>{selectedPatient.phone || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Email:</span>
                <span>{selectedPatient.email || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Address:</span>
                <span>{selectedPatient.address || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Registered:</span>
                <span>{selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className="w-full mt-6 px-4 py-2 border rounded hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
