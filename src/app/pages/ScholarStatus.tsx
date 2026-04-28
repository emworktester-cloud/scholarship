import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity, Award, Heart, FileSearch, FileCheck,
  ChevronRight, Users,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Badge } from '../components/ui/badge';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { cn } from '../components/ui/utils';

import { PhysicalStatus } from './scholar-status/PhysicalStatus';
import { ScholarStatusMatrix } from './scholar-status/ScholarStatusMatrix';
import { MaritalStatus } from './scholar-status/MaritalStatus';
import { ProcessingStatus } from './scholar-status/ProcessingStatus';
import { RecordsAndRequests } from './scholar-status/RecordsAndRequests';

const sections = [
  {
    group: '7.2 สถานะนักเรียนทุน',
    items: [
      { id: 'physical', label: '7.2.1 สถานภาพทางกาย', icon: Activity, description: 'ปกติ, พิการทางการมองเห็น, ได้ยิน/สื่อสาร, เคลื่อนไหว', badge: '8 ประเภท', color: 'text-green-600' },
      { id: 'scholar-status', label: '7.2.2 สถานะ นทร.', icon: Award, description: 'สถานะ 11 รายการ แยกตามระยะ (ก่อนเดินทาง/ระหว่างศึกษา/สำเร็จ)', badge: '11 สถานะ', color: 'text-blue-600' },
      { id: 'marital', label: '7.2.3 สถานภาพสมรส', icon: Heart, description: 'โสด, สมรส, หย่า, หม้าย', badge: '4 ประเภท', color: 'text-pink-600' },
      { id: 'processing', label: '7.2.4 สถานะการดำเนินการ', icon: FileSearch, description: '9 สถานะ: ยังไม่ส่ง → ส่งแล้ว → ดำเนินการ → อนุมัติ/ไม่อนุมัติ', badge: '9 สถานะ', color: 'text-purple-600' },
    ],
  },
  {
    group: '7.3 การดำเนินการบันทึก/คำขอ',
    items: [
      { id: 'records-requests', label: '7.3 รับทราบ/อนุญาต/อนุมัติ', icon: FileCheck, description: 'รับทราบ (7.3.1), อนุญาต (7.3.2), อนุมัติ (7.3.3)', badge: '3 ประเภท', color: 'text-amber-600' },
    ],
  },
];

export default function ScholarStatus() {
  const [activeSection, setActiveSection] = useState('physical');

  const renderContent = () => {
    switch (activeSection) {
      case 'physical': return <PhysicalStatus />;
      case 'scholar-status': return <ScholarStatusMatrix />;
      case 'marital': return <MaritalStatus />;
      case 'processing': return <ProcessingStatus />;
      case 'records-requests': return <RecordsAndRequests />;
      default: return <PhysicalStatus />;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="สถานะนักเรียนทุนและการดำเนินการ"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'สถานะนักเรียนทุน' }]}
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="สถานะนักเรียนทุน"
          moduleName="scholar-status"
          defaultExpanded={false}
          permissions={[
            { permission: 'status:view', label: 'ดูสถานะ', description: 'ดูสถานะนักเรียนทุนทุกประเภท', uiLocation: 'ทุก Tab' },
            { permission: 'status:physical', label: 'จัดการสถานภาพทางกาย', description: 'บันทึก/แก้ไขสถานภาพทางกาย', uiLocation: '7.2.1' },
            { permission: 'status:scholar', label: 'เปลี่ยนสถานะ นทร.', description: 'เปลี่ยนสถานะนักเรียนทุน 11 รายการ', uiLocation: '7.2.2' },
            { permission: 'status:marital', label: 'จัดการสถานภาพสมรส', description: 'บันทึก/แก้ไขสถานภาพสมรส', uiLocation: '7.2.3' },
            { permission: 'status:processing', label: 'ดูสถานะดำเนินการ', description: 'ดูสถานะการดำเนินการบันทึก/คำขอ', uiLocation: '7.2.4' },
            { permission: 'status:acknowledge', label: 'รับทราบ', description: 'ดำเนินการรับทราบเรื่องที่รายงาน', uiLocation: '7.3.1' },
            { permission: 'status:permit', label: 'อนุญาต', description: 'อนุญาตตามระเบียบที่กำหนด', uiLocation: '7.3.2' },
            { permission: 'status:approve', label: 'อนุมัติ', description: 'อนุมัติตามระเบียบที่กำหนด', uiLocation: '7.3.3' },
          ]}
        />

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-72 shrink-0 space-y-4">
            {sections.map((group) => (
              <div key={group.group}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{group.group}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                            : 'hover:bg-gray-100 text-gray-700'
                        )}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isActive ? 'bg-white/20' : 'bg-white border shadow-sm'
                        )}>
                          <ItemIcon className={cn('w-4 h-4', isActive ? 'text-white' : item.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-semibold truncate', isActive ? '' : '')}>{item.label}</p>
                          <p className={cn('text-[9px] truncate', isActive ? 'text-white/70' : 'text-gray-400')}>{item.description}</p>
                        </div>
                        <Badge className={cn(
                          'text-[8px] shrink-0',
                          isActive ? 'bg-white/20 text-white border-white/30' : 'bg-gray-100 text-gray-500'
                        )}>
                          {item.badge}
                        </Badge>
                        {isActive && <ChevronRight className="w-4 h-4 text-white/60 shrink-0" />}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
