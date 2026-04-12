import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2 } from 'lucide-react';

export function PatientMedicalHistory({ patient = {} }) {
  const [showEdit, setShowEdit] = useState(false);
  const [medicalData, setMedicalData] = useState({
    bloodType: patient.bloodType || '',
    allergies: patient.allergies || '',
    medicalConditions: patient.medicalConditions || '',
  });

  const handleSave = () => {
    console.log('[v0] Saving medical data:', medicalData);
    setShowEdit(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medical History</CardTitle>
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit2 size={14} className="mr-2" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Medical Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Input 
                  value={medicalData.bloodType}
                  onChange={(e) => setMedicalData({...medicalData, bloodType: e.target.value})}
                  placeholder="e.g., O+, A-, B+"
                />
              </div>
              <div className="space-y-2">
                <Label>Allergies</Label>
                <Input 
                  value={medicalData.allergies}
                  onChange={(e) => setMedicalData({...medicalData, allergies: e.target.value})}
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>
              <div className="space-y-2">
                <Label>Medical Conditions</Label>
                <Input 
                  value={medicalData.medicalConditions}
                  onChange={(e) => setMedicalData({...medicalData, medicalConditions: e.target.value})}
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>
              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase">Blood Type</p>
            <p className="text-xl font-bold mt-1">{medicalData.bloodType || '-'}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase">Allergies</p>
            <p className="text-sm font-medium mt-1">{medicalData.allergies || 'None'}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase">Conditions</p>
            <p className="text-sm font-medium mt-1">{medicalData.medicalConditions || 'None'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
