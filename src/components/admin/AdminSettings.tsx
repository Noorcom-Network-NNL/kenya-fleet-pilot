import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe,
  Palette,
  Bell,
  Save
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'FleetFlow Admin',
    siteDescription: 'Fleet Management System Administration',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxOrganizationsPerUser: 1,
    defaultTrialDays: 14,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@fleetflow.com',
    fromName: 'FleetFlow',
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireMFA: false,
    allowApiAccess: true,
    rateLimitRequests: 1000,
    rateLimitWindow: 60,
  });

  const handleSaveSystemSettings = async () => {
    try {
      setLoading(true);
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "System settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    try {
      setLoading(true);
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Email settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      setLoading(true);
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success",
        description: "Security settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTrialDays">Default Trial Days</Label>
                  <Input
                    id="defaultTrialDays"
                    type="number"
                    value={systemSettings.defaultTrialDays}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultTrialDays: parseInt(e.target.value) || 14 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable access to the system
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationEnabled">Registration Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new organizations to register
                    </p>
                  </div>
                  <Switch
                    id="registrationEnabled"
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailVerificationRequired">Email Verification Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new users
                    </p>
                  </div>
                  <Switch
                    id="emailVerificationRequired"
                    checked={systemSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, emailVerificationRequired: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSystemSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveEmailSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 8 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimitRequests">Rate Limit (requests)</Label>
                  <Input
                    id="rateLimitRequests"
                    type="number"
                    value={securitySettings.rateLimitRequests}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, rateLimitRequests: parseInt(e.target.value) || 1000 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimitWindow">Rate Limit Window (seconds)</Label>
                  <Input
                    id="rateLimitWindow"
                    type="number"
                    value={securitySettings.rateLimitWindow}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, rateLimitWindow: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireMFA">Require Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require MFA for all admin users
                    </p>
                  </div>
                  <Switch
                    id="requireMFA"
                    checked={securitySettings.requireMFA}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireMFA: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowApiAccess">Allow API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable REST API for integrations
                    </p>
                  </div>
                  <Switch
                    id="allowApiAccess"
                    checked={securitySettings.allowApiAccess}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, allowApiAccess: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecuritySettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Database Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      View Database Stats
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">System Maintenance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Update Metrics
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Application Version</p>
                      <p className="text-muted-foreground">v1.0.0</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Database Version</p>
                      <p className="text-muted-foreground">PostgreSQL 15.0</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Last Backup</p>
                      <p className="text-muted-foreground">Never</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Uptime</p>
                      <p className="text-muted-foreground">24h 15m</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}