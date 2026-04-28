import { ReactNode } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { Permission } from '../../lib/permissions';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ShieldAlert } from 'lucide-react';

interface ProtectedButtonProps extends ButtonProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  showTooltip?: boolean;
  tooltipMessage?: string;
  children: ReactNode;
}

/**
 * ProtectedButton - Button that disables based on permissions with helpful tooltip
 * 
 * Usage:
 * <ProtectedButton permission="applications:delete" onClick={handleDelete}>
 *   Delete
 * </ProtectedButton>
 */
export function ProtectedButton({
  permission,
  permissions,
  requireAll = false,
  showTooltip = true,
  tooltipMessage,
  children,
  disabled,
  ...props
}: ProtectedButtonProps) {
  const { can, canAny, canAll, roleName } = usePermissions();

  let hasAccess = false;
  let requiredPermissionText = '';

  if (permission) {
    hasAccess = can(permission);
    requiredPermissionText = permission;
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    requiredPermissionText = permissions.join(', ');
  } else {
    hasAccess = true;
  }

  const isDisabled = disabled || !hasAccess;

  const defaultTooltipMessage = tooltipMessage || `ต้องการสิทธิ์: ${requiredPermissionText}\nบทบาทปัจจุบัน: ${roleName}`;

  if (!hasAccess && showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button disabled={true} {...props} className={`${props.className || ''} cursor-not-allowed`}>
                {children}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-red-50 border-red-200">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-900">ไม่มีสิทธิ์การใช้งาน</p>
                <p className="text-red-700 mt-1 whitespace-pre-line">{defaultTooltipMessage}</p>
                <p className="text-red-600 text-xs mt-2">
                  ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เพิ่มเติม
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button disabled={isDisabled} {...props}>
      {children}
    </Button>
  );
}
