import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Permission, ROLES, hasPermission, hasAnyPermission, hasAllPermissions } from '../lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  // Get user's permissions based on their role
  const userPermissions = useMemo(() => {
    if (!user?.role) return [];
    return ROLES[user.role as keyof typeof ROLES]?.permissions || [];
  }, [user?.role]);

  // Check single permission
  const can = (permission: Permission): boolean => {
    return hasPermission(userPermissions, permission);
  };

  // Check if user has ANY of the permissions
  const canAny = (permissions: Permission[]): boolean => {
    return hasAnyPermission(userPermissions, permissions);
  };

  // Check if user has ALL permissions
  const canAll = (permissions: Permission[]): boolean => {
    return hasAllPermissions(userPermissions, permissions);
  };

  // Get user's role info
  const roleInfo = useMemo(() => {
    if (!user?.role) return null;
    return ROLES[user.role as keyof typeof ROLES] || null;
  }, [user?.role]);

  return {
    can,
    canAny,
    canAll,
    permissions: userPermissions,
    roleInfo,
    roleName: roleInfo?.nameLocal || user?.role || 'ไม่ทราบบทบาท',
  };
}
