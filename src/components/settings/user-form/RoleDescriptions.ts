
export const roleDescriptions = {
  'Fleet Admin': {
    description: 'Full system access with all administrative privileges',
    permissions: ['Manage vehicles', 'User management', 'System settings', 'All reports', 'Billing access'],
    color: 'bg-red-100 text-red-800',
    icon: '🔑'
  },
  'Fleet Manager': {
    description: 'Operations management with vehicle and trip oversight',
    permissions: ['Vehicle management', 'Trip planning', 'Maintenance scheduling', 'Operational reports', 'Driver management'],
    color: 'bg-blue-100 text-blue-800',
    icon: '👨‍💼'
  },
  'Driver': {
    description: 'Limited access for drivers to manage their assignments',
    permissions: ['View assigned vehicle', 'Report issues', 'Update trip status', 'Basic tracking'],
    color: 'bg-green-100 text-green-800',
    icon: '🚗'
  },
  'Viewer': {
    description: 'Read-only access to dashboards and reports',
    permissions: ['View dashboard', 'View reports', 'Basic tracking', 'No editing rights'],
    color: 'bg-gray-100 text-gray-800',
    icon: '👀'
  }
};

export type UserRole = keyof typeof roleDescriptions;
