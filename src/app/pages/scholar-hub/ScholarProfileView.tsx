import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, GraduationCap, Award, FileText, Heart, Shield,
  Mail, Phone, MapPin, Calendar, Building, Globe,
  ChevronRight, ArrowLeft, Camera, Stethoscope, Swords,
  ClipboardList, FileCheck, CalendarClock, BookOpen,
  AlertTriangle, Send, Eye, Edit, Clock, CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

// ===== Types reflecting existing granular DB schema =====
interface ScholarProfile {
  id: string;
  first_name: string;
  last_name: string;
  citizen_id: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  avatar_url: string | null;
  address_json: {
    line1: string;
    district: string;
    province: string;
    postal_code: string;
  };
  emergency_contact_json: {
    name: string;
    relation: string;
    phone: string;
  };
  // Award/Scholarship fields (from awards table)
  award: {
    scholarship_source: string;
    scholarship_name: string;
    scholarship_type: string;
    degree_level: string;
    field_of_study: string;
    university: string;
    country: string;
    start_date: string;
    end_date: string;
    total_budget: number;
  };
  // Status fields
  current_status: string;
  lifecycle_phase: string;
  completeness: number;
  // Health & military
  health_check_date: string | null;
  health_check_result: string | null;
  military_exemption: boolean;
  military_expiry: string | null;
}

// ===== Mock data =====
const mockScholar: ScholarProfile = {
  id: 'SCH-2569-001',
  first_name: 'พรพิมล',
  last_name: 'สุขใจ',
  citizen_id: '1-1234-56789-01-2',
  email: 'pornpimon@example.com',
  phone_number: '081-234-5678',
  date_of_birth: '15 มิ.ย. 2540',
  gender: 'หญิง',
  nationality: 'ไทย',
  avatar_url: null,
  address_json: {
    line1: '123/45 ซอยลาดพร้าว 87',
    district: 'บางกะปิ',
    province: 'กรุงเทพมหานคร',
    postal_code: '10240',
  },
  emergency_contact_json: {
    name: 'นายสมชาย สุขใจ',
    relation: 'บิดา',
    phone: '089-876-5432',
  },
  award: {
    scholarship_source: 'สำนักงาน ก.พ.',
    scholarship_name: 'ทุนรัฐบาล (ก.พ.) ระดับปริญญาเอก',
    scholarship_type: 'ทุน ก.พ.',
    degree_level: 'ปริญญาเอก',
    field_of_study: 'วิศวกรรมคอมพิวเตอร์',
    university: 'Stanford University',
    country: 'สหรัฐอเมริกา',
    start_date: 'ส.ค. 2569',
    end_date: 'ก.ค. 2573',
    total_budget: 5000000,
  },
  current_status: 'กำลังดำเนินการ',
  lifecycle_phase: 'ก่อนเดินทาง',
  completeness: 72,
  health_check_date: '10 ม.ค. 2569',
  health_check_result: 'ผ่าน',
  military_exemption: false,
  military_expiry: null,
};

// ===== Contextual e-Form Actions (Bridge to Workspace) =====
const contextualActions = [
  { id: 'EF-06', label: 'ขอขยายเวลาการศึกษา', icon: CalendarClock, formType: 'EXTENSION', color: 'text-blue-600' },
  { id: 'EF-04', label: 'ส่งรายงานผลการศึกษา', icon: BookOpen, formType: 'STUDY_REPORT', color: 'text-indigo-600' },
  { id: 'EF-09', label: 'ขอเปลี่ยนสาขา/สถาบัน', icon: Edit, formType: 'CHANGE_MAJOR', color: 'text-amber-600' },
  { id: 'EF-12', label: 'ขอกลับไทยชั่วคราว', icon: Globe, formType: 'TEMP_RETURN', color: 'text-green-600' },
  { id: 'EF-16', label: 'รายงาน Watch List', icon: AlertTriangle, formType: 'WATCH_LIST', color: 'text-red-600' },
];

// ===== Section Navigation =====
const sections = [
  { id: 'personal', label: 'ข้อมูลส่วนบุคคล', icon: User },
  { id: 'scholarship', label: 'ข้อมูลทุน', icon: Award },
  { id: 'contract', label: 'สัญญา', icon: FileCheck },
  { id: 'health', label: 'สุขภาพ', icon: Stethoscope },
  { id: 'military', label: 'ผ่อนผันทหาร', icon: Shield },
  { id: 'documents', label: 'เอกสาร', icon: FileText },
];

export default function ScholarProfileView() {
  const [activeSection, setActiveSection] = useState('personal');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const scholar = mockScholar;

  const openFormModal = (formType: string) => {
    setSelectedFormType(formType);
    setFormModalOpen(true);
  };

  const handleSubmitForm = () => {
    toast.success('คำร้องถูกส่งเข้าระบบ Workspace เรียบร้อย', {
      description: `e-Form ${selectedFormType} → รอการอนุมัติ`,
    });
    setFormModalOpen(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);

  // ===== Data Field renderer =====
  const DataField = ({ label, value, icon: Icon }: { label: string; value: string | React.ReactNode; icon?: React.ElementType }) => (
    <div className="flex items-start gap-3 py-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <div className="text-sm font-medium text-gray-800 mt-0.5">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-white">
      {/* Profile Header — Clean, Minimal */}
      <div className="border-b border-gray-100">
        <div className="px-8 py-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-gray-100">
                <AvatarFallback className="bg-gray-900 text-white text-xl font-bold">
                  {scholar.first_name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
            </div>

            {/* Name & Key Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {scholar.first_name} {scholar.last_name}
                </h1>
                <Badge variant="outline" className="font-mono text-xs">{scholar.id}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {scholar.award.scholarship_name} • {scholar.award.university}
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                  {scholar.lifecycle_phase}
                </Badge>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  {scholar.current_status}
                </Badge>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all"
                      style={{ width: `${scholar.completeness}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{scholar.completeness}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1.5" /> ดูไทม์ไลน์
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1.5" /> แก้ไข
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar — Section Navigation */}
        <div className="w-56 border-r border-gray-100 shrink-0">
          <div className="py-4 px-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] px-3 mb-3">
              ข้อมูลโปรไฟล์
            </p>
            <div className="space-y-0.5">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all',
                      active
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-gray-400')} />
                    {section.label}
                  </button>
                );
              })}
            </div>

            <Separator className="my-5" />

            {/* Contextual e-Form Actions — THE BRIDGE */}
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] px-3 mb-3">
              ส่งคำร้อง (e-Form)
            </p>
            <div className="space-y-1">
              {contextualActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => openFormModal(action.formType)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all group"
                  >
                    <Icon className={cn('w-3.5 h-3.5', action.color)} />
                    <span className="flex-1 text-left truncate">{action.label}</span>
                    <Send className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="p-8"
            >
              {/* Section: Personal */}
              {activeSection === 'personal' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">ข้อมูลส่วนบุคคล</h2>
                    <p className="text-sm text-gray-400">ประวัติส่วนตัว รูปถ่าย การศึกษา ช่องทางติดต่อ</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <DataField label="ชื่อ-นามสกุล" value={`${scholar.first_name} ${scholar.last_name}`} icon={User} />
                    <DataField label="เลขบัตรประชาชน" value={scholar.citizen_id} icon={ClipboardList} />
                    <DataField label="วัน/เดือน/ปีเกิด" value={scholar.date_of_birth} icon={Calendar} />
                    <DataField label="เพศ" value={scholar.gender} icon={User} />
                    <DataField label="สัญชาติ" value={scholar.nationality} icon={Globe} />
                    <DataField label="อีเมล" value={scholar.email} icon={Mail} />
                    <DataField label="โทรศัพท์" value={scholar.phone_number} icon={Phone} />
                    <DataField label="ที่อยู่" value={`${scholar.address_json.line1} ${scholar.address_json.district} ${scholar.address_json.province} ${scholar.address_json.postal_code}`} icon={MapPin} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4">ผู้ติดต่อฉุกเฉิน</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
                      <DataField label="ชื่อ" value={scholar.emergency_contact_json.name} />
                      <DataField label="ความสัมพันธ์" value={scholar.emergency_contact_json.relation} />
                      <DataField label="โทรศัพท์" value={scholar.emergency_contact_json.phone} icon={Phone} />
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Scholarship */}
              {activeSection === 'scholarship' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">ข้อมูลการรับทุน</h2>
                    <p className="text-sm text-gray-400">แหล่งทุน ชื่อทุน ประเภท ปี ระดับ สาขา สังกัด ประเทศ ระยะเวลา</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <DataField label="แหล่งทุน" value={scholar.award.scholarship_source} icon={Building} />
                    <DataField label="ชื่อทุน" value={scholar.award.scholarship_name} icon={Award} />
                    <DataField label="ประเภททุน" value={scholar.award.scholarship_type} icon={Award} />
                    <DataField label="ระดับการศึกษา" value={scholar.award.degree_level} icon={GraduationCap} />
                    <DataField label="สาขาวิชา" value={scholar.award.field_of_study} icon={BookOpen} />
                    <DataField label="มหาวิทยาลัย" value={scholar.award.university} icon={Building} />
                    <DataField label="ประเทศ" value={scholar.award.country} icon={Globe} />
                    <DataField label="วงเงินทุนรวม" value={<span className="text-green-700 font-bold">{formatCurrency(scholar.award.total_budget)}</span>} icon={Award} />
                    <DataField label="เริ่มศึกษา" value={scholar.award.start_date} icon={Calendar} />
                    <DataField label="สิ้นสุด" value={scholar.award.end_date} icon={Calendar} />
                  </div>
                </div>
              )}

              {/* Section: Health */}
              {activeSection === 'health' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">ผลการตรวจสุขภาพ</h2>
                    <p className="text-sm text-gray-400">ผลตรวจสุขภาพตามที่ ก.พ. กำหนด (อายุ 1 ปี)</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <DataField label="วันที่ตรวจ" value={scholar.health_check_date || 'ยังไม่ได้ตรวจ'} icon={Calendar} />
                    <DataField
                      label="ผลตรวจ"
                      value={
                        scholar.health_check_result ? (
                          <Badge className="bg-green-50 text-green-700 border border-green-200">{scholar.health_check_result}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">รอผลตรวจ</Badge>
                        )
                      }
                      icon={Stethoscope}
                    />
                  </div>
                </div>
              )}

              {/* Section: Military */}
              {activeSection === 'military' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">การผ่อนผันทหาร</h2>
                    <p className="text-sm text-gray-400">ข้อมูลการผ่อนผันทหาร แจ้งเตือนรายปี</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <DataField
                      label="สถานะผ่อนผัน"
                      value={
                        scholar.military_exemption ? (
                          <Badge className="bg-green-50 text-green-700 border border-green-200">ผ่อนผันแล้ว</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">ไม่มีข้อมูล / ไม่เกี่ยวข้อง</Badge>
                        )
                      }
                      icon={Shield}
                    />
                    <DataField label="วันหมดอายุ" value={scholar.military_expiry || 'ไม่ระบุ'} icon={Calendar} />
                  </div>
                </div>
              )}

              {/* Section: Contract */}
              {activeSection === 'contract' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">สัญญารับทุนและค้ำประกัน</h2>
                    <p className="text-sm text-gray-400">สัญญา เงื่อนไขชดใช้ทุน Upload ไฟล์สัญญา</p>
                  </div>
                  <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                    <FileCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">ยังไม่มีข้อมูลสัญญา</p>
                    <p className="text-xs mt-1">กรุณาอัปโหลดไฟล์สัญญารับทุน</p>
                  </div>
                </div>
              )}

              {/* Section: Documents */}
              {activeSection === 'documents' && (
                <div className="max-w-4xl space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">เอกสารต่างๆ</h2>
                    <p className="text-sm text-gray-400">หนังสือรับรอง วีซ่า CAS/COE ตั๋ว พาสปอร์ต</p>
                  </div>
                  <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">ลากไฟล์มาวาง หรือคลิกเพื่ออัปโหลด</p>
                    <p className="text-xs mt-1">รองรับ PDF, JPG, PNG (ไม่เกิน 10MB)</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== FormBuilder Bridge Modal ===== */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              ส่งคำร้อง e-Form
            </DialogTitle>
            <DialogDescription>
              คำร้องนี้จะถูกส่งเข้าระบบ Workspace เพื่อรอการอนุมัติ (ไม่บันทึกตรงลง Database)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
              <p className="text-sm text-blue-800">
                <strong>ประเภทคำร้อง:</strong> {selectedFormType}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                ผู้รับทุน: {scholar.first_name} {scholar.last_name} ({scholar.id})
              </p>
            </div>
            {/* 
              INTEGRATION POINT: Render <FormBuilder type={selectedFormType} /> here.
              The existing FormBuilder component from /pages/FormBuilder.tsx can be 
              imported and rendered in read/write mode inside this modal.
            */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {"<FormBuilder type=\"" + (selectedFormType || '') + "\" />"}
              </p>
              <p className="text-xs mt-1">
                คอมโพเนนต์ FormBuilder ที่มีอยู่จะถูก Render ตรงนี้
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmitForm} className="bg-gray-900 hover:bg-gray-800 text-white">
              <Send className="w-4 h-4 mr-2" />
              ส่งคำร้อง → Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
