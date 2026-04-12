import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Activity } from 'lucide-react';

export function PatientTimeline({ activities = [] }) {
  const mockActivities = [
    { id: 1, type: 'consultation', date: new Date(), description: 'General consultation with Dr. James' },
    { id: 2, type: 'prescription', date: new Date(Date.now() - 86400000), description: 'Prescribed Amoxicillin 250mg' },
    { id: 3, type: 'payment', date: new Date(Date.now() - 172800000), description: 'Payment of UGX 50,000 received' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity size={18} />
          Medical Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(activities.length > 0 ? activities : mockActivities).map((activity, idx) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'consultation' ? 'bg-blue-500' :
                  activity.type === 'prescription' ? 'bg-purple-500' :
                  'bg-green-500'
                }`} />
                {idx < (activities.length > 0 ? activities : mockActivities).length - 1 && (
                  <div className="w-0.5 h-12 bg-muted mt-2" />
                )}
              </div>
              <div className="pb-4">
                <p className="font-medium text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.date.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
