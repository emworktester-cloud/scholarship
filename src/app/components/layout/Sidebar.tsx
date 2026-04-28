import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  BarChart3,
  Inbox,
  GraduationCap,
  Landmark,
  Database,
  Shield,
  ChevronDown,
  LayoutDashboard,
  UserCheck,
  Users,
  TrendingUp,
  FileBarChart,
  History,
  Download,
  ClipboardList,
  Search,
  Bell,
  Send,
  Plane,
  BookOpen,
  Award,
  Activity,
  FileText,
  DollarSign,
  Wallet,
  Receipt,
  Building,
  MapPin,
  Scale,
  GitBranch,
  Settings,
  UserCog,
  Key,
  Plug,
  Cookie,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SubItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface MegaModule {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;      // accent color class for active state
  borderColor: string; // left border accent
  items: SubItem[];
}

const megaModules: MegaModule[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: 'text-violet-600',
    borderColor: 'border-l-violet-500',
    items: [
      { label: 'แดชบอร์ด', path: '/analytics', icon: LayoutDashboard },
      { label: 'ภาพรวมรายงาน', path: '/analytics/reports', icon: FileBarChart },
      { label: 'ความก้าวหน้า นทร.', path: '/analytics/reports/progress', icon: TrendingUp },
      { label: 'วิเคราะห์แนวโน้ม', path: '/analytics/reports/trends', icon: Activity },
      { label: 'ประวัติรายบุคคล', path: '/analytics/reports/individual', icon: History },
      { label: 'ส่งออกข้อมูล', path: '/analytics/reports/export', icon: Download },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: Inbox,
    color: 'text-blue-600',
    borderColor: 'border-l-blue-500',
    items: [
      { label: 'คิวงานของฉัน', path: '/workspace', icon: ClipboardList, badge: '12' },
      { label: 'คำร้องทั้งหมด', path: '/workspace/all', icon: Inbox },
      { label: 'ส่งประชาสัมพันธ์', path: '/workspace/broadcast', icon: Send },
    ],
  },
  {
    id: 'scholar-hub',
    label: 'Scholar Hub',
    icon: GraduationCap,
    color: 'text-emerald-600',
    borderColor: 'border-l-emerald-500',
    items: [
      { label: 'ก่อนเดินทาง', path: '/scholar-hub', icon: Plane },
      { label: 'ระหว่างศึกษา', path: '/scholar-hub/during-study', icon: BookOpen },
      { label: 'สำเร็จการศึกษา', path: '/scholar-hub/post-graduation', icon: Award },
      { label: 'ติดตามผลการศึกษา', path: '/scholar-hub/tracking', icon: TrendingUp },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Bond',
    icon: Landmark,
    color: 'text-amber-600',
    borderColor: 'border-l-amber-500',
    items: [
      { label: 'ทุน/สัญญา', path: '/finance', icon: FileText },
      { label: 'การจ่ายเงิน', path: '/finance/payment', icon: DollarSign },
      { label: 'งบประมาณ', path: '/finance/budget', icon: Wallet },
      { label: 'ติดตามงวดเงิน', path: '/finance/installments', icon: Receipt },
    ],
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: Database,
    color: 'text-cyan-600',
    borderColor: 'border-l-cyan-500',
    items: [
      { label: 'ข้อมูลหลัก', path: '/master-data', icon: Database },
      { label: 'หน่วยงาน', path: '/master-data/gov-orgs', icon: Building },
      { label: 'จังหวัด/อำเภอ', path: '/master-data/provinces', icon: MapPin },
      { label: 'เงื่อนไขชดใช้', path: '/master-data/repayment', icon: Scale },
      { label: 'Workflows', path: '/master-data/workflows', icon: GitBranch },
      { label: 'Form Builder', path: '/master-data/forms', icon: FileText },
    ],
  },
  {
    id: 'admin',
    label: 'System Admin',
    icon: Shield,
    color: 'text-rose-600',
    borderColor: 'border-l-rose-500',
    items: [
      { label: 'จัดการบัญชีผู้ใช้', path: '/admin', icon: UserCog },
      { label: 'ความปลอดภัย/RBAC', path: '/admin/security', icon: Shield },
      { label: 'API/การเชื่อมต่อ', path: '/admin/api', icon: Plug },
      { label: 'Cookie/PDPA', path: '/admin/cookie', icon: Cookie },
      { label: 'Audit Log', path: '/admin/audit', icon: Clock },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand the module that contains the current path
    const initial: Record<string, boolean> = {};
    for (const mod of megaModules) {
      const isActive = mod.items.some(
        (item) =>
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path))
      );
      initial[mod.id] = isActive;
    }
    // If nothing is active, expand the first module
    if (!Object.values(initial).some(Boolean)) {
      initial['analytics'] = true;
    }
    return initial;
  });

  const toggleModule = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemActive = (path: string) => {
    if (path === '/analytics' && location.pathname === '/analytics') return true;
    if (path === '/workspace' && location.pathname === '/workspace') return true;
    if (path === '/scholar-hub' && location.pathname === '/scholar-hub') return true;
    if (path === '/finance' && location.pathname === '/finance') return true;
    if (path === '/master-data' && location.pathname === '/master-data') return true;
    if (path === '/admin' && location.pathname === '/admin') return true;
    // For sub-paths, check startsWith but not the root
    if (path !== '/analytics' && path !== '/workspace' && path !== '/scholar-hub' && path !== '/finance' && path !== '/master-data' && path !== '/admin') {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  return (
    <aside className="sidebar-scroll w-[260px] h-full bg-white border-r border-gray-100 overflow-y-auto">
      {/* Logo / Brand area */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em]">
          Navigation
        </p>
      </div>

      <nav className="px-3 pb-6 space-y-1">
        {megaModules.map((mod) => {
          const ModIcon = mod.icon;
          const isExpanded = expanded[mod.id];
          const hasActiveChild = mod.items.some((item) => isItemActive(item.path));

          return (
            <div key={mod.id}>
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                  'hover:bg-gray-50',
                  hasActiveChild && 'bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                    hasActiveChild
                      ? `bg-gray-900 text-white`
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  )}
                >
                  <ModIcon className="w-4 h-4" />
                </div>
                <span
                  className={cn(
                    'text-[13px] font-semibold flex-1 text-left tracking-tight',
                    hasActiveChild ? 'text-gray-900' : 'text-gray-600'
                  )}
                >
                  {mod.label}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-colors',
                      hasActiveChild ? 'text-gray-500' : 'text-gray-300'
                    )}
                  />
                </motion.div>
              </button>

              {/* Sub-items */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[22px] pl-4 border-l border-gray-100 mt-1 mb-2 space-y-0.5">
                      {mod.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = isItemActive(item.path);

                        return (
                          <Link key={item.path} to={item.path}>
                            <div
                              className={cn(
                                'flex items-center gap-2.5 px-3 py-[7px] rounded-md transition-all duration-100',
                                'text-[12.5px]',
                                active
                                  ? `bg-gray-900 text-white font-medium shadow-sm`
                                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                              )}
                            >
                              <ItemIcon
                                className={cn(
                                  'w-3.5 h-3.5 shrink-0',
                                  active ? 'text-white' : 'text-gray-400'
                                )}
                              />
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
                                    active
                                      ? 'bg-white/20 text-white'
                                      : 'bg-blue-100 text-blue-700'
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}