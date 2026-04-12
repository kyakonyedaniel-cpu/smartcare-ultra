import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Mail, Phone, MapPin, Users } from 'lucide-react';

export function PatientProfileCard({ patient = {} }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <UserCircle size={40} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{patient.firstName} {patient.lastName}</h3>
            <p className="text-sm text-muted-foreground">Patient #{patient.patientNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Gender</label>
            <p className="font-medium">{patient.gender || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Date of Birth</label>
            <p className="font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not recorded'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{patient.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{patient.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="font-medium text-sm">{patient.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <Users size={16} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Emergency Contact</p>
              <p className="font-medium">{patient.emergencyContact || 'Not provided'}</p>
              <p className="text-sm text-muted-foreground">{patient.emergencyPhone || ''}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
