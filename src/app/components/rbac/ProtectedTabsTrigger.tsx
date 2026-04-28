import { ReactNode } from 'react';
import { TabsTrigger } from '../ui/tabs';
import { Permission } from '../../lib/permissions';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ShieldAlert, Lock } from 'lucide-react';
import { cn } from '../ui/utils';

interface ProtectedTabsTriggerProps {
  value: string;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  showTooltip?: boolean;
  tooltipMessage?: string;
  children: ReactNode;
  className?: string;
}

/**
 * ProtectedTabsTrigger - Tab trigger that disables based on permissions with helpful tooltip
 * 
 * Usage:
 * <ProtectedTabsTrigger value="approval" permission="approval:approve">
 *   <BadgeCheck className="w-4 h-4" />
 *   อนุมัติ
 * </ProtectedTabsTrigger>
 */
export function ProtectedTabsTrigger({
  value,
  permission,
  permissions,
  requireAll = false,
  showTooltip = true,
  tooltipMessage,
  children,
  className,
}: ProtectedTabsTriggerProps) {
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

  const defaultTooltipMessage = tooltipMessage || 
    `ต้องการสิทธิ์: ${requiredPermissionText}\nบทบาทปัจจุบัน: ${roleName}\n\nติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์`;

  if (!hasAccess && showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <TabsTrigger 
                value={value} 
                disabled={true}
                className={cn(
                  'cursor-not-allowed opacity-50 relative',
                  className
                )}
              >
                <div className="flex items-center gap-2 relative">
                  {children}
                  <Lock className="w-3 h-3 text-gray-400 absolute -top-1 -right-1" />
                </div>
              </TabsTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="max-w-xs bg-red-50 border-red-200"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-900">ไม่มีสิทธิ์เข้าถึง Tab นี้</p>
                <p className="text-red-700 mt-1 whitespace-pre-line">{defaultTooltipMessage}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TabsTrigger value={value} className={className}>
      {children}
    </TabsTrigger>
  );
}
