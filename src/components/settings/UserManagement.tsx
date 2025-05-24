import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { User, UserPlus, Edit, Trash2, Shield, Eye } from 'lucide-react';

export function UserManagement() {
  const users = [
    {
      id: 1,
      name: "John Kamau",
      email: "john@noorcomfleet.co.ke",
      role: "Fleet Admin",
      status: "active",
      lastLogin: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Wanjiku",
      email: "sarah@noorcomfleet.co.ke", 
      role: "Fleet Manager",
      status: "active",
      lastLogin: "1 day ago"
    },
    {
      id: 3,
      name: "David Kariuki",
      email: "david@noorcomfleet.co.ke",
      role: "Driver",
      status: "active",
      lastLogin: "3 hours ago"
    },
    {
      id: 4,
      name: "Mary Akinyi",
      email: "mary@noorcomfleet.co.ke",
      role: "Viewer",
      status: "inactive",
      lastLogin: "1 week ago"
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Fleet Admin": return "bg-red-100 text-red-800";
      case "Fleet Manager": return "bg-blue-100 text-blue-800";
      case "Driver": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">Manage users and their access permissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Last login: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-red-600">Fleet Admin</h4>
                <p className="text-sm text-gray-500 mt-1">Full system access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• Manage all vehicles</li>
                  <li>• User management</li>
                  <li>• System settings</li>
                  <li>• All reports</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600">Fleet Manager</h4>
                <p className="text-sm text-gray-500 mt-1">Operations management</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• Vehicle management</li>
                  <li>• Trip management</li>
                  <li>• Maintenance scheduling</li>
                  <li>• Operational reports</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600">Driver</h4>
                <p className="text-sm text-gray-500 mt-1">Limited driver access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• View assigned vehicle</li>
                  <li>• Report issues</li>
                  <li>• Update trip status</li>
                  <li>• Basic tracking</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-600">Viewer</h4>
                <p className="text-sm text-gray-500 mt-1">Read-only access</p>
                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                  <li>• View dashboard</li>
                  <li>• View reports</li>
                  <li>• Basic tracking</li>
                  <li>• No editing rights</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
