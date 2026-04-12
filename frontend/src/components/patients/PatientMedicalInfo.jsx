import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function PatientMedicalInfo({ patient = {} }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle size={18} />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
          <p className="text-lg font-semibold">{patient.bloodType || 'Not recorded'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Allergies</label>
          <p className="text-sm">{patient.allergies || 'None recorded'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Medical Conditions</label>
          <p className="text-sm">{patient.medicalConditions || 'None recorded'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Notes</label>
          <p className="text-sm text-muted-foreground">{patient.notes || 'No notes'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
