'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from './usePermissions';
import { Permission } from './types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PermissionRequirement {
  action: Permission['action'];
  resource: Permission['resource'];
}

export function withPermissions(
  WrappedComponent: React.ComponentType,
  requiredPermissions: PermissionRequirement[]
) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const { hasPermission, loading } = usePermissions();

    useEffect(() => {
      if (!loading) {
        const hasAllPermissions = requiredPermissions.every(
          ({ action, resource }) => hasPermission(action, resource)
        );

        if (!hasAllPermissions) {
          router.push('/unauthorized');
        }
      }
    }, [loading, router]);

    if (loading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };
} 