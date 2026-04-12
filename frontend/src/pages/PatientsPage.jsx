import React, { useState, useEffect } from 'react';

const mockPatients = [
  { id: '1', patientNumber: 'PT-001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701234567', email: 'sarah@email.com', address: 'Kampala', createdAt: '2026-04-01' },
  { id: '2', patientNumber: 'PT-002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702345678', email: 'peter@email.com', address: 'Entebbe', createdAt: '2026-04-02' },
  { id: '3', patientNumber: 'PT-003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703456789', email: 'mary@email.com', address: 'Jinja', createdAt: '2026-04-03' },
];

export function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'MALE', phone: '', email: '', address: ''
  });

  useEffect(() => {
    setPatients(mockPatients);
    setLoading(false);
  }, []);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Patients ({patients.length})</h1>
      
      <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
      >
        + Add Patient
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient #</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border">
                <td className="p-2 border">{p.patientNumber}</td>
                <td className="p-2 border">{p.firstName} {p.lastName}</td>
                <td className="p-2 border">{p.gender}</td>
                <td className="p-2 border">{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <select
                className="w-full p-2 border rounded"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-2 border rounded"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-2 border rounded"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
                  Add
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded">
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
