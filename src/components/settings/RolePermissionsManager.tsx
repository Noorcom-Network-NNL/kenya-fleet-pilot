
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Edit, Save, X } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface RolePermissions {
  [key: string]: Permission[];
}

const defaultPermissions: RolePermissions = {
  'Fleet Admin': [
    { id: 'manage_vehicles', name: 'Manage all vehicles', description: 'Create, edit, delete vehicles', enabled: true },
    { id: 'user_management', name: 'User management', description: 'Add, edit, remove users', enabled: true },
    { id: 'system_settings', name: 'System settings', description: 'Configure system-wide settings', enabled: true },
    { id: 'all_reports', name: 'All reports', description: 'Access to all system reports', enabled: true },
    { id: 'billing', name: 'Billing & Subscription', description: 'Manage billing and subscriptions', enabled: true },
  ],
  'Fleet Manager': [
    { id: 'vehicle_management', name: 'Vehicle management', description: 'Manage assigned vehicles', enabled: true },
    { id: 'trip_management', name: 'Trip management', description: 'Plan and monitor trips', enabled: true },
    { id: 'maintenance_scheduling', name: 'Maintenance scheduling', description: 'Schedule vehicle maintenance', enabled: true },
    { id: 'operational_reports', name: 'Operational reports', description: 'View operational analytics', enabled: true },
    { id: 'driver_management', name: 'Driver management', description: 'Manage drivers and assignments', enabled: true },
  ],
  'Driver': [
    { id: 'view_assigned_vehicle', name: 'View assigned vehicle', description: 'See details of assigned vehicle', enabled: true },
    { id: 'report_issues', name: 'Report issues', description: 'Report vehicle or trip issues', enabled: true },
    { id: 'update_trip_status', name: 'Update trip status', description: 'Update current trip progress', enabled: true },
    { id: 'basic_tracking', name: 'Basic tracking', description: 'View basic location tracking', enabled: true },
    { id: 'fuel_logging', name: 'Fuel logging', description: 'Log fuel consumption and refills', enabled: false },
  ],
  'Viewer': [
    { id: 'view_dashboard', name: 'View dashboard', description: 'Access to main dashboard', enabled: true },
    { id: 'view_reports', name: 'View reports', description: 'Read-only access to reports', enabled: true },
    { id: 'basic_tracking_view', name: 'Basic tracking', description: 'View vehicle locations', enabled: true },
    { id: 'no_editing', name: 'No editing rights', description: 'Cannot modify any data', enabled: true },
  ],
};

export function RolePermissionsManager() {
  const [permissions, setPermissions] = useState<RolePermissions>(defaultPermissions);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Fleet Admin": return "text-red-600 border-red-200 bg-red-50";
      case "Fleet Manager": return "text-blue-600 border-blue-200 bg-blue-50";
      case "Driver": return "text-green-600 border-green-200 bg-green-50";
      case "Viewer": return "text-gray-600 border-gray-200 bg-gray-50";
      default: return "text-gray-600 border-gray-200 bg-gray-50";
    }
  };

  const togglePermission = (role: string, permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: prev[role].map(perm => 
        perm.id === permissionId 
          ? { ...perm, enabled: !perm.enabled }
          : perm
      )
    }));
  };

  const saveRolePermissions = (role: string) => {
    console.log(`Saving permissions for ${role}:`, permissions[role]);
    setEditingRole(null);
    // Here you would typically save to your backend/database
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(permissions).map(([role, rolePermissions]) => (
            <div key={role} className={`p-4 border rounded-lg ${getRoleColor(role)}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{role}</h4>
                  <p className="text-sm opacity-75">
                    {rolePermissions.filter(p => p.enabled).length} of {rolePermissions.length} permissions enabled
                  </p>
                </div>
                <div className="flex gap-2">
                  {editingRole === role ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => saveRolePermissions(role)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingRole(null)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingRole(role)}
                      className="opacity-75 hover:opacity-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {rolePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{permission.name}</span>
                        {permission.enabled && (
                          <Badge variant="secondary" className="text-xs">Enabled</Badge>
                        )}
                      </div>
                      <p className="text-xs opacity-75">{permission.description}</p>
                    </div>
                    {editingRole === role && (
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={() => togglePermission(role, permission.id)}
                        className="ml-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
