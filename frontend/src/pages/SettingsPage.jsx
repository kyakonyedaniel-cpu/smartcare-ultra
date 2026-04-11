import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Users, CreditCard, Bell, Plus, Trash2, Edit } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. John Smith', email: 'john@clinic.com', role: 'Doctor', status: 'Active' },
    { id: 2, name: 'Jane Doe', email: 'jane@clinic.com', role: 'Nurse', status: 'Active' },
    { id: 3, name: 'Peter Wilson', email: 'peter@clinic.com', role: 'Pharmacist', status: 'Active' }
  ]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', role: '', password: ''
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaff([...staff, {
      id: Date.now(),
      ...formData,
      status: 'Active'
    }]);
    setShowStaffModal(false);
    setFormData({ name: '', email: '', role: '', password: '' });
  };

  const deleteStaff = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const settingsSections = [
    { id: 'clinic', label: 'Clinic Info', icon: Building2 },
    { id: 'staff', label: 'Staff & Users', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your clinic and system settings</p>
        </div>

        {/* Settings Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.id}
                className={`cursor-pointer transition-all ${activeTab === section.id ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}
                onClick={() => setActiveTab(section.id)}
              >
                <CardContent className="pt-6 text-center">
                  <Icon className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-sm">{section.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Clinic Information Tab */}
        {activeTab === 'clinic' && (
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>Update your clinic details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Clinic Name *</Label>
                  <Input defaultValue="SmartCare Ultra Clinic" />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input defaultValue="MC/2024/001" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="info@smartcareclinic.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+256 700 123 456" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="Plot 123, Kampala Road, Kampala, Uganda" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue="Kampala" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input defaultValue="Uganda" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input placeholder="https://your-clinic.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        )}

        {/* Staff & Users Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staff Members</CardTitle>
                  <CardDescription>Manage clinic staff and their permissions</CardDescription>
                </div>
                <Dialog open={showStaffModal} onOpenChange={setShowStaffModal}>
                  <DialogTrigger asChild>
                    <Button><Plus size={16} className="mr-2" /> Add Staff</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Staff Member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Role *</Label>
                          <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Doctor">Doctor</SelectItem>
                              <SelectItem value="Nurse">Nurse</SelectItem>
                              <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                              <SelectItem value="Receptionist">Receptionist</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Password *</Label>
                          <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Add Staff Member</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((member) => (
                        <TableRow key={member.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell><span className="bg-muted px-2 py-1 rounded text-xs">{member.role}</span></TableCell>
                          <TableCell><span className="text-emerald-600 text-sm font-medium">{member.status}</span></TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteStaff(member.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Roles & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage staff roles and their access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Doctor', 'Nurse', 'Pharmacist', 'Receptionist'].map((role) => (
                    <div key={role} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">{role}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['View Patients', 'Edit Records', 'Manage Prescriptions', 'View Reports', 'Manage Inventory', 'Process Payments'].map((perm) => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked={true} className="w-4 h-4" />
                            <span className="text-sm">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4">Save Permissions</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2">Current Plan: Trial</h4>
                <p className="text-sm text-muted-foreground mb-4">14 days remaining in your trial period</p>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Billing Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select defaultValue="uganda">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uganda">Uganda</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input defaultValue="Kampala" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Payment Method</h4>
                <Select defaultValue="mobile-money">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile-money">Mobile Money (MTN/Airtel)</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Appointment Reminders', description: 'Get reminded about upcoming appointments' },
                { label: 'Low Stock Alerts', description: 'Be notified when drugs are running low' },
                { label: 'Payment Reminders', description: 'Reminders for unpaid invoices' },
                { label: 'System Updates', description: 'Important system updates and maintenance notices' },
                { label: 'Daily Summary', description: 'Receive daily clinic activity summary' },
                { label: 'Revenue Reports', description: 'Weekly revenue and performance reports' }
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked={true} className="w-5 h-5" />
                </div>
              ))}
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
