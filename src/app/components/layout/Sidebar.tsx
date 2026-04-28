import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  FileText,
  Award,
  DollarSign,
  TrendingUp,
  BarChart3,
  GitBranch,
  Database,
  Settings,
  Plug,
  Shield,
  Clock,
  Inbox,
  AlertCircle,
  Key,
  UserCog,
  BellRing,
  Wrench,
  Cookie,
  ClipboardList,
  Activity,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'แดชบอร์ด', path: '/' },
  { icon: Inbox, label: 'คิวงาน', path: '/applications' },
  { icon: ClipboardList, label: 'บันทึกข้อมูลผู้รับทุน', path: '/scholar-lifecycle' },
  { icon: Activity, label: 'สถานะ นทร./การดำเนินการ', path: '/scholar-status' },
  { icon: Award, label: 'ทุน/สัญญา', path: '/awards' },
  { icon: DollarSign, label: 'การจ่ายเงิน', path: '/payment' },
  { icon: TrendingUp, label: 'ติดตามผลการศึกษา', path: '/tracking' },
  { icon: BarChart3, label: 'รายงาน/ส่งออก', path: '/reports' },
  { icon: GitBranch, label: 'Workflow/แบบฟอร์ม', path: '/workflows' },
  { icon: Database, label: 'ข้อมูลหลัก', path: '/master-data' },
  { icon: BellRing, label: 'แจ้งเตือน/ประชาสัมพันธ์', path: '/notifications' },
  { icon: Wrench, label: 'เครื่องมือสนับสนุน', path: '/support-tools' },
  { icon: Key, label: 'สิทธิ์ของฉัน', path: '/my-permissions', highlight: true },
  { icon: Settings, label: 'การตั้งค่า', path: '/settings' },
  { icon: Plug, label: 'API/การเชื่อมต่อ', path: '/api' },
  { icon: Shield, label: 'ความปลอดภัย/RBAC', path: '/security' },
  { icon: UserCog, label: 'จัดการบัญชีผู้ใช้', path: '/account-admin' },
  { icon: Cookie, label: 'จัดการคุกกี้/PDPA', path: '/cookie-management' },
  { icon: Clock, label: 'Audit Log', path: '/audit' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar-scroll w-[260px] h-full bg-[#1e3a8a] text-white overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:bg-white/10',
                  isActive && 'bg-[#3b82f6] shadow-lg'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}