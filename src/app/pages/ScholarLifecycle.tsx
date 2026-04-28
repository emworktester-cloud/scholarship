import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plane, GraduationCap, Award, ChevronRight,
  UserCheck, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Badge } from '../components/ui/badge';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { cn } from '../components/ui/utils';

import PreDeparture from './scholar-lifecycle/PreDeparture';
import DuringStudy from './scholar-lifecycle/DuringStudy';
import PostGraduation from './scholar-lifecycle/PostGraduation';

const phases = [
  {
    id: 'pre-departure',
    label: 'ระยะก่อนเดินทาง',
    shortLabel: 'ก่อนเดินทาง',
    icon: Plane,
    color: 'text-blue-600',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50 border-blue-200',
    activeGradient: 'from-blue-500 to-indigo-600',
    description: 'ประกาศรายชื่อ → ก่อนออกเดินทาง',
    details: '7 หัวข้อ: นำเข้าข้อมูล, ส่วนบุคคล, การรับทุน, สัญญา, สุขภาพ, ผ่อนผันทหาร, เอกสาร',
    stats: '4 ราย กำลังดำเนินการ',
  },
  {
    id: 'during-study',
    label: 'ระยะระหว่างศึกษา',
    shortLabel: 'ระหว่างศึกษา',
    icon: GraduationCap,
    color: 'text-green-600',
    bg: 'bg-green-500',
    bgLight: 'bg-green-50 border-green-200',
    activeGradient: 'from-green-500 to-emerald-600',
    description: 'เดินทางถึง → สิ้นสุดการศึกษา',
    details: 'รายงานตัว, ติดตามผล, คำขออนุมัติ 12 ประเภท, Watch List',
    stats: '28 ราย ระหว่างศึกษา',
  },
  {
    id: 'post-graduation',
    label: 'ระยะสำเร็จการศึกษา',
    shortLabel: 'สำเร็จการศึกษา',
    icon: Award,
    color: 'text-amber-600',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50 border-amber-200',
    activeGradient: 'from-amber-500 to-orange-600',
    description: 'สำเร็จ/เสร็จสิ้น → ปฏิบัติราชการ',
    details: 'แจ้งสำเร็จ, รายงานตัว, คุณวุฒิ, จัดสรรสังกัด, คำนวณชดใช้',
    stats: '4 ราย สำเร็จการศึกษา',
  },
];

export default function ScholarLifecycle() {
  const [activePhase, setActivePhase] = useState('pre-departure');

  const renderContent = () => {
    switch (activePhase) {
      case 'pre-departure': return <PreDeparture />;
      case 'during-study': return <DuringStudy />;
      case 'post-graduation': return <PostGraduation />;
      default: return <PreDeparture />;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="บันทึกข้อมูลผู้รับทุน"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'บันทึกข้อมูลผู้รับทุน' }]}
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="บันทึกข้อมูลผู้รับทุน"
          moduleName="scholar-lifecycle"
          defaultExpanded={false}
          permissions={[
            { permission: 'lifecycle:import', label: 'นำเข้าข้อมูล', description: 'นำเข้าจาก Template Excel และบันทึกรายบุคคล', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:personal', label: 'จัดการข้อมูลส่วนบุคคล', description: 'ประวัติ รูปถ่าย การศึกษา ติดต่อ ภาษาอังกฤษ', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:scholarship', label: 'จัดการข้อมูลทุน', description: 'แหล่งทุน ประเภท สาขา ระยะเวลา', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:contract', label: 'จัดการสัญญา', description: 'สัญญารับทุน สัญญาค้ำประกัน เงื่อนไขชดใช้', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:health', label: 'จัดการผลสุขภาพ', description: 'บันทึกผลตรวจสุขภาพ', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:military', label: 'จัดการผ่อนผันทหาร', description: 'บันทึกข้อมูลผ่อนผัน แจ้งเตือน', uiLocation: 'ระยะก่อนเดินทาง' },
            { permission: 'lifecycle:documents', label: 'จัดการเอกสาร', description: 'อัปโหลด ดู ดาวน์โหลดเอกสารทุกประเภท', uiLocation: 'ทุกระยะ' },
            { permission: 'lifecycle:tracking', label: 'ติดตามระหว่างศึกษา', description: 'รายงานตัว ผลการศึกษา คำขออนุมัติ Watch List', uiLocation: 'ระยะระหว่างศึกษา' },
            { permission: 'lifecycle:graduation', label: 'จัดการสำเร็จการศึกษา', description: 'แจ้งสำเร็จ รายงานตัว คุณวุฒิ จัดสรรสังกัด', uiLocation: 'ระยะสำเร็จการศึกษา' },
            { permission: 'lifecycle:service-calc', label: 'คำนวณชดใช้ทุน', description: 'คำนวณวันชดใช้ทุนตามสัญญา', uiLocation: 'ระยะสำเร็จการศึกษา' },
          ]}
        />

        {/* Phase Navigation - Compact Style */}
        <div className="flex items-center gap-3">
          {phases.map((phase, i) => {
            const PhaseIcon = phase.icon;
            const isActive = activePhase === phase.id;
            return (
              <div key={phase.id} className="flex items-center flex-1 min-w-0">
                <motion.div
                  className={cn(
                    'flex-1 p-3 rounded-xl border cursor-pointer transition-all',
                    isActive
                      ? `border-transparent bg-gradient-to-r ${phase.activeGradient} text-white shadow-md`
                      : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm`
                  )}
                  onClick={() => setActivePhase(phase.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 shrink-0 rounded-lg flex items-center justify-center border',
                      isActive ? 'bg-white/20 border-white/20' : `${phase.bgLight.split(' ')[0]} border-${phase.color.split('-')[1]}-200`
                    )}>
                      <PhaseIcon className={cn('w-5 h-5', isActive ? 'text-white' : phase.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={cn('text-[10px] font-medium', isActive ? 'text-white/80' : 'text-gray-500')}>ระยะที่ {i + 1}</span>
                        <div className={cn('flex items-center text-[10px]', isActive ? 'text-white/90' : 'text-gray-500')}>
                          <UserCheck className="w-3 h-3 mr-1" />
                          <span>{phase.stats.split(' ')[0]}</span>
                        </div>
                      </div>
                      <p className={cn('text-sm font-semibold truncate', isActive ? 'text-white' : 'text-gray-900')}>{phase.label}</p>
                      <p className={cn('text-[10px] truncate', isActive ? 'text-white/80' : 'text-gray-500')}>{phase.description}</p>
                    </div>
                  </div>
                </motion.div>
                {i < phases.length - 1 && (
                  <div className="mx-2 shrink-0">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
