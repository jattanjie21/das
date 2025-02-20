export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  resource: 'alerts' | 'zones' | 'users' | 'analytics';
}

export interface RolePermissions {
  admin: Permission[];
  operator: Permission[];
  viewer: Permission[];
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    { action: 'create', resource: 'alerts' },
    { action: 'read', resource: 'alerts' },
    { action: 'update', resource: 'alerts' },
    { action: 'delete', resource: 'alerts' },
    { action: 'create', resource: 'zones' },
    { action: 'read', resource: 'zones' },
    { action: 'update', resource: 'zones' },
    { action: 'delete', resource: 'zones' },
    { action: 'create', resource: 'users' },
    { action: 'read', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'delete', resource: 'users' },
    { action: 'read', resource: 'analytics' },
  ],
  operator: [
    { action: 'create', resource: 'alerts' },
    { action: 'read', resource: 'alerts' },
    { action: 'update', resource: 'alerts' },
    { action: 'read', resource: 'zones' },
    { action: 'update', resource: 'zones' },
    { action: 'read', resource: 'analytics' },
  ],
  viewer: [
    { action: 'read', resource: 'alerts' },
    { action: 'read', resource: 'zones' },
    { action: 'read', resource: 'analytics' },
  ],
}; 