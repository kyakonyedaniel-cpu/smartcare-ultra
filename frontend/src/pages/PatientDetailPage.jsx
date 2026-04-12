import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientProfileCard } from '@/components/patients/PatientProfileCard';
import { PatientMedicalHistory } from '@/components/patients/PatientMedicalHistory';
import { PatientTimeline } from '@/components/patients/PatientTimeline';
import { PatientMedicalInfo } from '@/components/patients/PatientMedicalInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Prescription, FileText, CreditCard } from 'lucide-react';

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  
  // Mock patient data - in real app this would come from API
  const [patient] = useState({
    id: patientId || '1',
    patientNumber: 'PT-001234',
    firstName: 'Sarah',
    lastName: 'Nakato',
    gender: 'FEMALE',
    dateOfBirth: '1990-05-15',
    phone: '+256701234567',
    email: 'sarah.nakato@email.com',
    address: 'Plot 15 Kampala Road, Kampala',
    emergencyContact: 'John Nakato (Spouse)',
    emergencyPhone: '+256702345678',
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    medicalConditions: 'Type 2 Diabetes, Hypertension',
    notes: 'Patient is compliant with medication. Follow-up required monthly.',
  });

  const stats = [
    { label: 'Total Visits', value: '12', icon: FileText, color: 'blue' },
    { label: 'Prescriptions', value: '8', icon: Prescription, color: 'purple' },
    { label: 'Account Balance', value: 'UGX 25,000', icon: CreditCard, color: 'green' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Patient Profile</h1>
            <p className="text-muted-foreground">View and manage patient information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'purple' ? 'bg-purple-100' :
                    'bg-green-100'
                  }`}>
                    <stat.icon size={20} className={
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-green-600'
                    } />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PatientMedicalHistory patient={patient} />
            <PatientTimeline />
          </div>
          
          <div className="space-y-6">
            <PatientProfileCard patient={patient} />
            <PatientMedicalInfo patient={patient} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
