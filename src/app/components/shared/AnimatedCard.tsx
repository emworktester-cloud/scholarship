import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AnimatedCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  headerClassName?: string;
}

export function AnimatedCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  children,
  delay = 0,
  hover = true,
  onClick,
  className = '',
  headerClassName = ''
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay
      }}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(onClick && 'cursor-pointer')}
    >
      <Card 
        className={cn(
          'transition-shadow',
          hover && 'hover:shadow-lg',
          className
        )}
        onClick={onClick}
      >
        {(title || description || Icon) && (
          <CardHeader className={headerClassName}>
            {(title || Icon) && (
              <CardTitle className="flex items-center gap-2">
                {Icon && <Icon className={cn('w-5 h-5', iconColor)} />}
                {title}
              </CardTitle>
            )}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={!title && !description && !Icon ? 'pt-6' : undefined}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  delay?: number;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  borderColor = 'border-l-blue-500',
  trend,
  subtitle,
  delay = 0,
  onClick
}: StatCardProps) {
  return (
    <AnimatedCard
      delay={delay}
      onClick={onClick}
      className={cn('border-l-4', borderColor)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center text-sm mt-2',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <Icon className={cn('w-8 h-8', iconColor)} />
      </div>
    </AnimatedCard>
  );
}

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

export function AnimatedGrid({ children, cols = 4, gap = 6, className = '' }: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = `gap-${gap}`;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={cn('grid grid-cols-1', colsClass[cols], gapClass, className)}
    >
      {children}
    </motion.div>
  );
}
