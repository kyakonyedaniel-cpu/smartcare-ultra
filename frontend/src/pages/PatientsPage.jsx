import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState([
    { id: 1, patientNumber: 'P001', firstName: 'Sarah', lastName: 'Nakato', gender: 'Female', phone: '+256 700 123 456', email: 'sarah@example.com', dob: '1985-03-15', createdAt: new Date() },
    { id: 2, patientNumber: 'P002', firstName: 'John', lastName: 'Ochieng', gender: 'Male', phone: '+256 701 234 567', email: 'john@example.com', dob: '1990-07-22', createdAt: new Date() },
    { id: 3, patientNumber: 'P003', firstName: 'Maria', lastName: 'Ssali', gender: 'Female', phone: '+256 702 345 678', email: 'maria@example.com', dob: '1992-11-10', createdAt: new Date() }
  ]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', phone: '', email: '', dob: '', address: ''
  });

  const filteredPatients = patients.filter(p => 
    p.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPatient) {
      setPatients(patients.map(p => p.id === selectedPatient.id ? {...p, ...formData} : p));
    } else {
      setPatients([...patients, {
        id: Date.now(),
        patientNumber: `P${String(patients.length + 1).padStart(3, '0')}`,
        ...formData,
        createdAt: new Date()
      }]);
    }
    setShowAddModal(false);
    setFormData({ firstName: '', lastName: '', gender: '', phone: '', email: '', dob: '', address: '' });
    setSelectedPatient(null);
  };

  const openEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData(patient);
    setShowAddModal(true);
  };

  const deletePatient = (id) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground mt-1">Manage patient records and medical history</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={(open) => {
            setShowAddModal(open);
            if (!open) setSelectedPatient(null);
          }}>
            <DialogTrigger asChild>
              <Button><Plus size={16} className="mr-2" /> Add Patient</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Enter first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Enter last name" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+256 700 123 456" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="patient@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street address" />
                </div>
                <Button type="submit" className="w-full">{selectedPatient ? 'Update Patient' : 'Add Patient'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or phone..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {search ? 'No patients found matching your search' : 'No patients yet. Add one to get started.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm font-semibold">{patient.patientNumber}</TableCell>
                        <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.dob || '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{patient.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(patient)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deletePatient(patient.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
