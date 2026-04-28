import { ReactNode } from 'react';
import { Permission } from '../../lib/permissions';
import { usePermissions } from '../../hooks/usePermissions';
import { Alert, AlertDescription } from '../ui/alert';
import { ShieldAlert } from 'lucide-react';

interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showFeedback?: boolean;
  children: ReactNode;
}

/**
 * PermissionGate - Wrapper component that shows/hides content based on permissions
 * 
 * Usage:
 * <PermissionGate permission="applications:edit">
 *   <Button>Edit</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  fallback,
  showFeedback = false,
  children,
}: PermissionGateProps) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    // No permission specified, allow access
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showFeedback) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          คุณไม่มีสิทธิ์เข้าถึงส่วนนี้
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
