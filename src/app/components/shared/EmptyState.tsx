import { motion } from 'motion/react';
import { FileQuestion, SearchX, Inbox, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'inbox' | 'error';
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  variant = 'default' 
}: EmptyStateProps) {
  const defaultIcons = {
    default: <FileQuestion className="w-16 h-16 text-muted-foreground" />,
    search: <SearchX className="w-16 h-16 text-muted-foreground" />,
    inbox: <Inbox className="w-16 h-16 text-muted-foreground" />,
    error: <AlertCircle className="w-16 h-16 text-destructive" />
  };

  const iconToRender = icon || defaultIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          delay: 0.1 
        }}
        className="mb-4"
      >
        {iconToRender}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground max-w-sm mb-6"
        >
          {description}
        </motion.p>
      )}
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Pre-configured empty states
export function NoResultsFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      variant="search"
      title="ไม่พบข้อมูลที่ค้นหา"
      description="ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองของคุณ"
      action={onReset ? {
        label: 'ล้างตัวกรอง',
        onClick: onReset
      } : undefined}
    />
  );
}

export function EmptyInbox() {
  return (
    <EmptyState
      variant="inbox"
      title="ไม่มีงานในคิว"
      description="คุณได้ทำงานทั้งหมดเสร็จเรียบร้อยแล้ว สุดยอด! 🎉"
    />
  );
}

export function ErrorState({ 
  title = 'เกิดข้อผิดพลาด',
  description = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
  onRetry 
}: { 
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={description}
      action={onRetry ? {
        label: 'ลองอีกครั้ง',
        onClick: onRetry
      } : undefined}
    />
  );
}
