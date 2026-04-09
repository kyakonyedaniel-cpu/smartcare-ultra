import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users, CreditCard, Bell } from 'lucide-react';

export function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your clinic settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:border-primary">
            <CardContent className="pt-6 text-center">
              <Building2 className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="font-medium">Clinic Info</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary">
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="font-medium">Users & Roles</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary">
            <CardContent className="pt-6 text-center">
              <CreditCard className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="font-medium">Subscription</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary">
            <CardContent className="pt-6 text-center">
              <Bell className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="font-medium">Notifications</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
            <CardDescription>Update your clinic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input defaultValue="Demo Health Center" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+256701234567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="Kampala Road, Kampala" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="demo@clinic.com" type="email" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}