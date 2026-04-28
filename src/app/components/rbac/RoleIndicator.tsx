import { Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ROLES, RoleId } from '../../lib/permissions';
import { cn } from '../ui/utils';

interface RoleIndicatorProps {
  role: RoleId;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const colorClasses = {
  red: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
  green: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
};

/**
 * RoleIndicator - Badge showing user's role with color coding
 */
export function RoleIndicator({
  role,
  size = 'md',
  showIcon = true,
  className,
}: RoleIndicatorProps) {
  const roleInfo = ROLES[role];
  
  if (!roleInfo) {
    return null;
  }

  const colorClass = colorClasses[roleInfo.color as keyof typeof colorClasses] || colorClasses.gray;

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border inline-flex items-center gap-1.5',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {showIcon && <Shield className={cn(
        size === 'sm' && 'w-3 h-3',
        size === 'md' && 'w-3.5 h-3.5',
        size === 'lg' && 'w-4 h-4'
      )} />}
      {roleInfo.nameLocal}
    </Badge>
  );
}
