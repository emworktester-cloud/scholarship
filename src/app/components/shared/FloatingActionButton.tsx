import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, X, FileText, Users, Award, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FABAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainAction?: () => void;
  mainLabel?: string;
}

export function FloatingActionButton({ 
  actions = [], 
  mainAction,
  mainLabel = 'เพิ่ม' 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    if (actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (mainAction) {
      mainAction();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    delay: index * 0.05
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: {
                    delay: (actions.length - index - 1) * 0.05
                  }
                }}
                className="flex items-center justify-end gap-3"
              >
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap"
                >
                  {action.label}
                </motion.span>
                <Button
                  size="icon"
                  className={cn(
                    'w-12 h-12 rounded-full shadow-lg',
                    action.color || 'bg-blue-600 hover:bg-blue-700'
                  )}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          onClick={handleMainClick}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-7 h-7" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Label tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {mainLabel}
        </motion.div>
      )}
    </div>
  );
}

// Pre-configured FABs
export function ApplicationFAB({ onNewApplication }: { onNewApplication: () => void }) {
  const actions: FABAction[] = [
    {
      icon: FileText,
      label: 'สร้างใบสมัครใหม่',
      onClick: onNewApplication,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Users,
      label: 'เพิ่มผู้สมัครเข้ากลุ่ม',
      onClick: () => console.log('Add to group'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: Award,
      label: 'สร้างทุนใหม่',
      onClick: () => console.log('Create award'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return <FloatingActionButton actions={actions} mainLabel="การดำเนินการ" />;
}
