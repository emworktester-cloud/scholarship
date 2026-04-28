import { motion } from 'motion/react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'text' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-card rounded-lg border p-6 space-y-4 ${className}`}>
            <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-24 animate-pulse" />
              <div className="h-8 bg-muted rounded w-24 animate-pulse" />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`bg-card rounded-lg border overflow-hidden ${className}`}>
            <div className="p-4 border-b space-y-3">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                  <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-full animate-pulse" style={{ width: `${Math.random() * 30 + 70}%` }} />
            ))}
          </div>
        );
      
      case 'avatar':
        return <div className={`h-10 w-10 bg-muted rounded-full animate-pulse ${className}`} />;
      
      case 'button':
        return <div className={`h-10 bg-muted rounded w-24 animate-pulse ${className}`} />;
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {renderSkeleton()}
    </motion.div>
  );
}

// Specific loading components
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
      <LoadingSkeleton variant="table" count={5} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return <LoadingSkeleton variant="table" count={rows} />;
}

export function CardSkeleton() {
  return <LoadingSkeleton variant="card" />;
}
