import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Info, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'งานใกล้เกิน SLA',
    message: 'APP-2026-001 เหลือเวลาอีก 2 ชั่วโมง',
    time: '5 นาทีที่แล้ว',
    read: false,
    actionUrl: '/applications/APP-2026-001'
  },
  {
    id: '2',
    type: 'success',
    title: 'การอนุมัติสำเร็จ',
    message: 'APP-2026-045 ได้รับการอนุมัติแล้ว',
    time: '1 ชั่วโมงที่แล้ว',
    read: false,
    actionUrl: '/applications/APP-2026-045'
  },
  {
    id: '3',
    type: 'info',
    title: 'เอกสารใหม่เข้ามา',
    message: 'ผู้สมัคร APP-2026-023 อัปโหลดเอกสารเพิ่มเติม',
    time: '2 ชั่วโมงที่แล้ว',
    read: true,
    actionUrl: '/applications/APP-2026-023'
  },
  {
    id: '4',
    type: 'info',
    title: 'ได้รับมอบหมายงานใหม่',
    message: 'คุณได้รับมอบหมายให้ตรวจสอบ APP-2026-067',
    time: '3 ชั่วโมงที่แล้ว',
    read: true,
    actionUrl: '/applications/APP-2026-067'
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute right-0 top-12 w-96 bg-card rounded-lg shadow-xl border z-50"
            >
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">การแจ้งเตือน</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {unreadCount} ข้อความใหม่
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleMarkAllAsRead}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      อ่านทั้งหมด
                    </Button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="max-h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">ไม่มีการแจ้งเตือน</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-4 hover:bg-muted/50 transition-colors cursor-pointer group',
                          !notification.read && 'bg-blue-50/30'
                        )}
                        onClick={() => {
                          handleMarkAsRead(notification.id);
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </span>
                              {notification.actionUrl && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <>
                  <Separator />
                  <div className="p-3 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={handleClearAll}
                    >
                      ล้างทั้งหมด
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/notifications');
                      }}
                    >
                      ดูทั้งหมด
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}