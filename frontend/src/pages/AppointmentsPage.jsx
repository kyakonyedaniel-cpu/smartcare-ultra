import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Edit, Trash2, CheckCircle, Clock4 } from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Sarah Nakato', date: '2024-04-15', time: '10:00', type: 'Consultation', doctor: 'Dr. John', status: 'Confirmed' },
    { id: 2, patientName: 'John Ochieng', date: '2024-04-15', time: '11:30', type: 'Follow-up', doctor: 'Dr. Jane', status: 'Confirmed' },
    { id: 3, patientName: 'Maria Ssali', date: '2024-04-15', time: '14:00', type: 'Lab Test', doctor: 'Dr. Peter', status: 'Pending' },
    { id: 4, patientName: 'James Kipchoge', date: '2024-04-16', time: '09:00', type: 'Consultation', doctor: 'Dr. John', status: 'Confirmed' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '', date: '', time: '', type: '', doctor: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments([...appointments, {
      id: Date.now(),
      ...formData,
      status: 'Pending'
    }]);
    setShowModal(false);
    setFormData({ patientName: '', date: '', time: '', type: '', doctor: '' });
  };

  const updateStatus = (id, status) => {
    setAppointments(appointments.map(a => a.id === id ? {...a, status} : a));
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage patient appointments and schedule</p>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button><Plus size={16} className="mr-2" /> Book Appointment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} placeholder="Select or enter patient" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Lab Test">Lab Test</SelectItem>
                        <SelectItem value="Vaccination">Vaccination</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Doctor</Label>
                    <Select value={formData.doctor} onValueChange={v => setFormData({...formData, doctor: v})}>
                      <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. John">Dr. John</SelectItem>
                        <SelectItem value="Dr. Jane">Dr. Jane</SelectItem>
                        <SelectItem value="Dr. Peter">Dr. Peter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Book Appointment</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-3xl font-bold">{appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'Confirmed').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'Pending').length}</p>
                </div>
                <Clock4 className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No appointments scheduled
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((apt) => (
                      <TableRow key={apt.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{apt.patientName}</TableCell>
                        <TableCell>{apt.date}</TableCell>
                        <TableCell className="flex items-center gap-2"><Clock size={14} />{apt.time}</TableCell>
                        <TableCell>{apt.type}</TableCell>
                        <TableCell>{apt.doctor}</TableCell>
                        <TableCell>
                          <Select value={apt.status} onValueChange={v => updateStatus(apt.id, v)}>
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteAppointment(apt.id)}>
                            <Trash2 size={16} />
                          </Button>
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
    </MainLayout>
  );
}
