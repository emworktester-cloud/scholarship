import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#3b82f6',
  delay = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {Icon && (
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                className="text-3xl font-bold"
                style={{ color }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.1, duration: 0.3 }}
              >
                {value}
              </motion.div>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {trend && (
              <div
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
