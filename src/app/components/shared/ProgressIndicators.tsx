import { motion } from 'motion/react';
import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ProgressSteps({ steps, orientation = 'horizontal', className = '' }: ProgressStepsProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn(
      'flex',
      isHorizontal ? 'flex-row items-center justify-between' : 'flex-col space-y-4',
      className
    )}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            'flex',
            isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-start gap-4'
          )}
        >
          {/* Step indicator */}
          <div className={cn('flex items-center', isHorizontal ? 'flex-col' : 'flex-row gap-4')}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors relative z-10',
                step.status === 'completed' && 'bg-green-500 text-white',
                step.status === 'current' && 'bg-blue-600 text-white',
                step.status === 'pending' && 'bg-gray-200 text-gray-400'
              )}
            >
              {step.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : step.status === 'current' ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </motion.div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
                animate={{ scaleX: 1, scaleY: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                className={cn(
                  'bg-gray-200',
                  isHorizontal 
                    ? 'h-0.5 flex-1 origin-left' 
                    : 'w-0.5 h-full ml-5 origin-top'
                )}
                style={{
                  background: step.status === 'completed' 
                    ? 'linear-gradient(to right, #10b981, #d1d5db)' 
                    : '#e5e7eb'
                }}
              />
            )}
          </div>

          {/* Step content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className={cn(
              isHorizontal ? 'mt-2 text-center' : 'flex-1 pb-6'
            )}
          >
            <p className={cn(
              'font-medium text-sm',
              step.status === 'completed' && 'text-green-600',
              step.status === 'current' && 'text-blue-600',
              step.status === 'pending' && 'text-gray-400'
            )}>
              {step.label}
            </p>
            {step.date && (
              <p className="text-xs text-gray-500 mt-1">{step.date}</p>
            )}
            {step.description && !isHorizontal && (
              <p className="text-xs text-gray-600 mt-1">{step.description}</p>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user?: string;
}

interface StatusTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function StatusTimeline({ events, className = '' }: StatusTimelineProps) {
  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-4"
        >
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
              className={cn(
                'w-3 h-3 rounded-full',
                getColorClasses(event.type)
              )}
            />
            {index < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{event.title}</p>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                )}
                {event.user && (
                  <p className="text-xs text-gray-500 mt-1">โดย {event.user}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{event.time}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  label,
  showValue = true,
  className = ''
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold"
            style={{ color }}
          >
            {value}%
          </motion.span>
        )}
        {label && (
          <span className="text-xs text-gray-600 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}
