'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase/config';
import { Permission, UserRole, DEFAULT_ROLE_PERMISSIONS } from './types';

export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profile?.role) {
          setUserRole(profile.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  const hasPermission = (action: Permission['action'], resource: Permission['resource']): boolean => {
    const permissions = DEFAULT_ROLE_PERMISSIONS[userRole];
    return permissions.some(p => p.action === action && p.resource === resource);
  };

  const can = {
    createAlert: () => hasPermission('create', 'alerts'),
    readAlert: () => hasPermission('read', 'alerts'),
    updateAlert: () => hasPermission('update', 'alerts'),
    deleteAlert: () => hasPermission('delete', 'alerts'),
    createZone: () => hasPermission('create', 'zones'),
    readZone: () => hasPermission('read', 'zones'),
    updateZone: () => hasPermission('update', 'zones'),
    deleteZone: () => hasPermission('delete', 'zones'),
    manageUsers: () => hasPermission('create', 'users'),
    viewAnalytics: () => hasPermission('read', 'analytics'),
  };

  return {
    userRole,
    loading,
    hasPermission,
    can,
  };
} 