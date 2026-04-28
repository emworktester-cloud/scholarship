import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  BarChart3, Inbox, GraduationCap, Landmark, Database, Shield,
  ChevronDown, LayoutDashboard, TrendingUp, Download,
  ClipboardList, Pen, Plane, BookOpen, Award, FileText,
  DollarSign, Wallet, GitBranch, UserCog, Plug, Clock,
  FolderArchive, Camera, Calculator, FileCheck, Truck,
  Globe, ShieldCheck, ScrollText,
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SubItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface SubGroup {
  id: string;
  label: string;
  items: SubItem[];
}

interface MegaModule {
  id: string;
  thaiLabel: string;
  icon: React.ElementType;
  groups: SubGroup[];
}

const megaModules: MegaModule[] = [
  {
    id: 'analytics', thaiLabel: 'แดชบอร์ด & รายงาน', icon: BarChart3,
    groups: [
      { id: '1.1', label: '1.1 แดชบอร์ดผู้บริหาร', items: [
        { label: 'แดชบอร์ดรวม', path: '/analytics', icon: LayoutDashboard },
      ]},
      { id: '1.2', label: '1.2 วิเคราะห์ & แนวโน้ม', items: [
        { label: 'ภาพรวมรายงาน', path: '/analytics/reports', icon: BarChart3 },
        { label: 'ความก้าวหน้า นทร.', path: '/analytics/progress', icon: TrendingUp },
        { label: 'วิเคราะห์แนวโน้ม', path: '/analytics/trends', icon: TrendingUp },
      ]},
      { id: '1.3', label: '1.3 ส่งออก & ตรวจสอบ', items: [
        { label: 'ส่งออกรายงาน', path: '/analytics/export', icon: Download },
      ]},
    ],
  },
  {
    id: 'workspace', thaiLabel: 'พื้นที่ปฏิบัติงาน', icon: Inbox,
    groups: [
      { id: '2.1', label: '2.1 คิวงานของฉัน', items: [
        { label: 'งานรอดำเนินการ', path: '/workspace', icon: ClipboardList, badge: '12' },
        { label: 'คำร้องทั้งหมด', path: '/workspace/all', icon: Inbox },
      ]},
      { id: '2.2', label: '2.2 ลายเซ็นอิเล็กทรอนิกส์', items: [
        { label: 'ลงนามเอกสาร', path: '/workspace/e-sign', icon: Pen },
      ]},
    ],
  },
  {
    id: 'scholar-hub', thaiLabel: 'ทะเบียนนักเรียนทุน', icon: GraduationCap,
    groups: [
      { id: '3.1', label: '3.1 ข้อมูลส่วนบุคคล & สุขภาพ', items: [
        { label: 'ระยะก่อนเดินทาง', path: '/scholar-hub', icon: Plane },
        { label: 'ระยะระหว่างศึกษา', path: '/scholar-hub/during-study', icon: BookOpen },
        { label: 'ระยะสำเร็จการศึกษา', path: '/scholar-hub/post-graduation', icon: Award },
        { label: 'โปรไฟล์ นทร.', path: '/scholar-hub/profile', icon: GraduationCap },
      ]},
      { id: '3.2', label: '3.2 ทุน & ประวัติการศึกษา', items: [
        { label: 'ติดตามผลการศึกษา', path: '/scholar-hub/tracking', icon: TrendingUp },
      ]},
      { id: '3.3', label: '3.3 คลังเอกสาร & รูปภาพ', items: [
        { label: 'คลังเอกสาร', path: '/scholar-hub/documents', icon: FolderArchive },
        { label: 'จัดการรูปภาพ', path: '/scholar-hub/photos', icon: Camera },
      ]},
      { id: '3.4', label: '3.4 ชดใช้ทุน & จัดสรรสังกัด', items: [
        { label: 'คำนวณชดใช้ทุน', path: '/scholar-hub/bond-calc', icon: Calculator },
      ]},
    ],
  },
  {
    id: 'finance', thaiLabel: 'สัญญาและการเงิน', icon: Landmark,
    groups: [
      { id: '4.1', label: '4.1 สัญญา & ผู้ค้ำประกัน', items: [
        { label: 'ทะเบียนสัญญา', path: '/finance', icon: FileCheck },
        { label: 'ข้อมูลผู้ค้ำประกัน', path: '/finance/guarantor', icon: UserCog },
      ]},
      { id: '4.2', label: '4.2 การจ่ายเงิน & โลจิสติกส์', items: [
        { label: 'แผนการจ่ายเงิน', path: '/finance/payment', icon: DollarSign },
        { label: 'งบประมาณ', path: '/finance/budget', icon: Wallet },
        { label: 'จัดส่งเอกสาร/ของ', path: '/finance/logistics', icon: Truck },
      ]},
    ],
  },
  {
    id: 'master-data', thaiLabel: 'ข้อมูลหลัก & เวิร์กโฟลว์', icon: Database,
    groups: [
      { id: '5.1', label: '5.1 ตัวสร้างแบบฟอร์ม & Workflow', items: [
        { label: 'ตัวสร้าง Workflow', path: '/master-data/workflows', icon: GitBranch },
        { label: 'ตัวสร้างแบบฟอร์ม', path: '/master-data/forms', icon: FileText },
      ]},
      { id: '5.2', label: '5.2 ตารางข้อมูลอ้างอิง', items: [
        { label: 'ข้อมูลหลักทั้งหมด', path: '/master-data', icon: Database },
      ]},
    ],
  },
  {
    id: 'admin', thaiLabel: 'ระบบและความปลอดภัย', icon: Shield,
    groups: [
      { id: '6.1', label: '6.1 สิทธิ์ผู้ใช้ & โซนภูมิศาสตร์', items: [
        { label: 'จัดการบัญชีผู้ใช้', path: '/admin', icon: UserCog },
        { label: 'RBAC & โซนภูมิศาสตร์', path: '/admin/security', icon: ShieldCheck },
      ]},
      { id: '6.2', label: '6.2 เชื่อมต่อระบบภายนอก', items: [
        { label: 'API & Webhooks', path: '/admin/api', icon: Plug },
      ]},
      { id: '6.3', label: '6.3 PDPA & บันทึกระบบ', items: [
        { label: 'PDPA/คุกกี้', path: '/admin/cookie', icon: ScrollText },
        { label: 'บันทึกการใช้งาน', path: '/admin/audit', icon: Clock },
      ]},
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const mod of megaModules) {
      const isActive = mod.groups.some((g) =>
        g.items.some((item) =>
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path))
        )
      );
      initial[mod.id] = isActive;
    }
    if (!Object.values(initial).some(Boolean)) initial['analytics'] = true;
    return initial;
  });

  const toggleModule = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemActive = (path: string) => {
    if (location.pathname === path) return true;
    const roots = ['/', '/analytics', '/workspace', '/scholar-hub', '/finance', '/master-data', '/admin'];
    if (roots.includes(path)) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar-scroll w-[264px] h-full bg-[#1e3a8a] text-white overflow-y-auto">
      {/* หัวเมนู */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-bold text-sky-200/70 uppercase tracking-[0.2em]">
          เมนูหลัก
        </p>
      </div>

      <nav className="px-3 pb-8 space-y-0.5">
        {megaModules.map((mod) => {
          const ModIcon = mod.icon;
          const isExp = expanded[mod.id];
          const hasActive = mod.groups.some((g) =>
            g.items.some((item) => isItemActive(item.path))
          );

          return (
            <div key={mod.id} className="mb-0.5">
              {/* หัวโมดูล */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                  'hover:bg-white/10',
                  hasActive && 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                    hasActive
                      ? 'bg-[#3b82f6] shadow-lg'
                      : 'bg-white/10 group-hover:bg-white/15'
                  )}
                >
                  <ModIcon className="w-4 h-4 text-white" />
                </div>
                <span
                  className={cn(
                    'text-[13px] font-semibold flex-1 text-left truncate tracking-tight',
                    hasActive ? 'text-white' : 'text-white/90'
                  )}
                >
                  {mod.thaiLabel}
                </span>
                <motion.div
                  animate={{ rotate: isExp ? 180 : 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                </motion.div>
              </button>

              {/* รายการย่อย */}
              <AnimatePresence initial={false}>
                {isExp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.12, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[22px] pl-3.5 border-l border-white/10 mt-1 mb-2">
                      {mod.groups.map((group) => (
                        <div key={group.id} className="mb-1">
                          <p className="text-[10px] font-bold text-sky-200/60 uppercase tracking-wider px-3 py-1.5">
                            {group.label}
                          </p>
                          <div className="space-y-px">
                            {group.items.map((item) => {
                              const ItemIcon = item.icon;
                              const active = isItemActive(item.path);
                              return (
                                <Link key={item.path} to={item.path}>
                                  <div
                                    className={cn(
                                      'flex items-center gap-2.5 px-3 py-[7px] rounded-lg transition-all duration-100',
                                      'text-[12px]',
                                      active
                                        ? 'bg-[#3b82f6] text-white font-medium shadow-lg'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                    )}
                                  >
                                    <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge && (
                                      <span
                                        className={cn(
                                          'text-[10px] font-bold min-w-[20px] text-center px-1.5 py-0.5 rounded-full leading-none',
                                          active
                                            ? 'bg-white/25 text-white'
                                            : 'bg-red-500/80 text-white'
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
                        </div>
                      ))}
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