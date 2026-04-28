import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { QuickSearch } from '../shared/QuickSearch';
import { useCookieConsent } from '../../contexts/CookieConsentContext';
import { Cookie } from 'lucide-react';
import { toast } from 'sonner';

export function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { hasConsented, setShowPreferences } = useCookieConsent();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for Quick Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(true);
      }

      // Ctrl+B or Cmd+B for Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }

      // Ctrl+/ or Cmd+/ for Keyboard Shortcuts Help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toast.info('แป้นลัด', {
          description: (
            <div className="space-y-1 text-xs">
              <p><strong>Ctrl+K:</strong> ค้นหาด่วน</p>
              <p><strong>Ctrl+B:</strong> เปิด/ปิด Sidebar</p>
              <p><strong>Ctrl+/:</strong> แสดงแป้นลัด</p>
            </div>
          ),
          duration: 5000,
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <Topbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
        <main className="flex-1 overflow-auto bg-gradient-to-br from-sky-50/50 via-blue-50/50 to-emerald-50/50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <QuickSearch isOpen={isQuickSearchOpen} onClose={() => setIsQuickSearchOpen(false)} />
      {/* Cookie Preferences Floating Button */}
      {hasConsented && (
        <button
          onClick={() => setShowPreferences(true)}
          className="fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all group"
          title="ตั้งค่าคุกกี้"
        >
          <Cookie className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
        </button>
      )}
    </div>
  );
}