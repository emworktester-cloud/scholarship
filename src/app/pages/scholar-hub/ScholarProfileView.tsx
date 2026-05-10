import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, GraduationCap, Award, FileText, Heart, Shield, Mail, Phone, MapPin, Calendar,
  Building, Globe, ChevronRight, Stethoscope, ClipboardList, FileCheck, CalendarClock,
  BookOpen, AlertTriangle, Send, Eye, Edit, Clock, CheckCircle, Camera, Upload,
  Plane, Wallet, Briefcase, DollarSign,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

// ===== TypeScript interfaces preserving all granular DB fields =====
interface AddressJson { line1: string; district: string; province: string; postal_code: string; }
interface EmergencyJson { name: string; relation: string; phone: string; }
interface AwardData {
  scholarship_source: string; scholarship_name: string; scholarship_type: string;
  degree_level: string; field_of_study: string; university: string; country: string;
  start_date: string; end_date: string; total_budget: number;
}
interface TravelDocJson { passport_number: string; passport_expiry: string; visa_type: string; visa_expiry: string; }
interface FinancialJson { bank_name: string; account_number: string; account_name: string; branch: string; }
interface AcademicProgressJson { current_gpax: number | string; advisor_name: string; advisor_email: string; thesis_topic: string | null; next_report_due: string; }
interface BondJson { graduation_date: string; bond_status: string; bond_start_date: string; bond_end_date: string; workplace_department: string; workplace_ministry: string; }

interface ScholarProfile {
  id: string; first_name: string; last_name: string; citizen_id: string;
  email: string; phone_number: string; date_of_birth: string; gender: string;
  nationality: string; avatar_url: string | null;
  address_json: AddressJson; emergency_contact_json: EmergencyJson; award: AwardData;
  travel_doc_json: TravelDocJson; financial_json: FinancialJson;
  academic_progress_json: AcademicProgressJson; bond_json: BondJson;
  current_status: string; lifecycle_phase: string; completeness: number;
  health_check_date: string | null; health_check_result: string | null;
  military_exemption: boolean; military_expiry: string | null;
}

const mockScholar: ScholarProfile = {
  id: 'SCH-2569-001', first_name: 'พรพิมล', last_name: 'สุขใจ',
  citizen_id: '1-1234-56789-01-2', email: 'pornpimon@example.com',
  phone_number: '081-234-5678', date_of_birth: '15/06/2540',
  gender: 'หญิง', nationality: 'ไทย', avatar_url: null,
  address_json: { line1: '123/45 ซอยลาดพร้าว 87', district: 'บางกะปิ', province: 'กรุงเทพมหานคร', postal_code: '10240' },
  emergency_contact_json: { name: 'นายสมชาย สุขใจ', relation: 'บิดา', phone: '089-876-5432' },
  award: {
    scholarship_source: 'สำนักงาน ก.พ.', scholarship_name: 'ทุนรัฐบาล (ก.พ.) ระดับปริญญาเอก',
    scholarship_type: 'ทุน ก.พ.', degree_level: 'ปริญญาเอก', field_of_study: 'วิศวกรรมคอมพิวเตอร์',
    university: 'Stanford University', country: 'สหรัฐอเมริกา',
    start_date: 'ส.ค. 2569', end_date: 'ก.ค. 2573', total_budget: 5000000,
  },
  travel_doc_json: { passport_number: 'AA1234567', passport_expiry: '20/01/2575', visa_type: 'F-1 Student', visa_expiry: '15/08/2573' },
  financial_json: { bank_name: 'ธนาคารกรุงไทย', account_number: '123-4-56789-0', account_name: 'นางสาวพรพิมล สุขใจ', branch: 'สาขาเซ็นทรัลพลาซา แกรนด์ พระราม 9' },
  academic_progress_json: { current_gpax: 3.85, advisor_name: 'Prof. John Doe', advisor_email: 'johndoe@stanford.edu', thesis_topic: 'AI in Healthcare', next_report_due: '30/11/2569' },
  bond_json: { graduation_date: '-', bond_status: 'กำลังศึกษา', bond_start_date: '-', bond_end_date: '-', workplace_department: '-', workplace_ministry: '-' },
  current_status: 'กำลังดำเนินการ', lifecycle_phase: 'ก่อนเดินทาง', completeness: 72,
  health_check_date: '10/01/2569', health_check_result: 'ผ่าน',
  military_exemption: false, military_expiry: null,
};

const contextualActions = [
  { id: 'EF-06', label: 'ขอขยายเวลาศึกษา', icon: CalendarClock, formType: 'EXTENSION', color: 'text-blue-600' },
  { id: 'EF-04', label: 'ส่งรายงานผลการศึกษา', icon: BookOpen, formType: 'STUDY_REPORT', color: 'text-indigo-600' },
  { id: 'EF-09', label: 'ขอเปลี่ยนสาขา/สถาบัน', icon: Edit, formType: 'CHANGE_MAJOR', color: 'text-amber-600' },
  { id: 'EF-12', label: 'ขอกลับไทยชั่วคราว', icon: Globe, formType: 'TEMP_RETURN', color: 'text-green-600' },
  { id: 'EF-16', label: 'รายงาน Watch List', icon: AlertTriangle, formType: 'WATCH_LIST', color: 'text-red-600' },
  { id: 'EDIT', label: 'ขอแก้ไขข้อมูล', icon: Edit, formType: 'EDIT_PROFILE', color: 'text-gray-600' },
];

const sections = [
  { id: 'personal', label: 'ข้อมูลส่วนบุคคล', icon: User },
  { id: 'scholarship', label: 'ข้อมูลทุน', icon: Award },
  { id: 'travel', label: 'เอกสารเดินทาง', icon: Plane },
  { id: 'financial', label: 'ข้อมูลการเงิน', icon: Wallet },
  { id: 'academic', label: 'ผลการศึกษา', icon: BookOpen },
  { id: 'bond', label: 'ชดใช้ทุน/ทำงาน', icon: Briefcase },
  { id: 'health', label: 'สุขภาพ', icon: Stethoscope },
  { id: 'military', label: 'ผ่อนผันทหาร', icon: Shield },
  { id: 'contract', label: 'สัญญา', icon: FileCheck },
  { id: 'documents', label: 'คลังเอกสาร', icon: FileText },
];

const Field = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
  <div className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
    {Icon && <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5"><Icon className="w-4 h-4 text-gray-400" /></div>}
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-[13px] font-medium text-gray-800">{value}</div>
    </div>
  </div>
);

export default function ScholarProfileView() {
  const [activeSection, setActiveSection] = useState('personal');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const s = mockScholar;

  const openFormModal = (formType: string) => { setSelectedFormType(formType); setFormModalOpen(true); };
  const handleSubmitForm = () => {
    toast.success('คำร้องถูกส่งเข้าระบบพื้นที่ปฏิบัติงานเรียบร้อย', { description: `ประเภท: ${selectedFormType} → รอการอนุมัติ` });
    setFormModalOpen(false);
  };
  const fmt = (n: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(n);

  return (
    <div className="min-h-full bg-white">
      {/* ===== ส่วนหัวโปรไฟล์ ===== */}
      <div className="border-b border-gray-100">
        <div className="px-8 py-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-gray-100">
                <AvatarFallback className="bg-gray-900 text-white text-xl font-bold">{s.first_name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{s.first_name} {s.last_name}</h1>
                <Badge variant="outline" className="font-mono text-xs">{s.id}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{s.award.scholarship_name} • {s.award.university}</p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200">{s.lifecycle_phase}</Badge>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200">{s.current_status}</Badge>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${s.completeness}%` }} />
                  </div>
                  <span className="text-xs font-medium">{s.completeness}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* ===== เมนูด้านซ้าย ===== */}
        <div className="w-56 border-r border-gray-100 shrink-0">
          <div className="py-4 px-3">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.15em] px-3 mb-3">ข้อมูลโปรไฟล์</p>
            <div className="space-y-0.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                    className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] transition-all',
                      activeSection === sec.id ? 'bg-gray-900 text-white font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    )}>
                    <Icon className={cn('w-4 h-4', activeSection === sec.id ? 'text-white' : 'text-gray-400')} />
                    {sec.label}
                  </button>
                );
              })}
            </div>
            <Separator className="my-4" />
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.15em] px-3 mb-3">ส่งคำร้อง (e-Form)</p>
            <div className="space-y-0.5">
              {contextualActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.id} onClick={() => openFormModal(a.formType)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all group">
                    <Icon className={cn('w-3.5 h-3.5', a.color)} />
                    <span className="flex-1 text-left truncate">{a.label}</span>
                    <Send className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== เนื้อหาหลัก ===== */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="p-8 max-w-4xl">

              {activeSection === 'personal' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ข้อมูลส่วนบุคคล</h2><p className="text-sm text-gray-400 mt-0.5">ประวัติส่วนตัว ที่อยู่ ผู้ติดต่อฉุกเฉิน</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="ชื่อ-นามสกุล" value={`${s.first_name} ${s.last_name}`} icon={User} />
                  <Field label="เลขบัตรประชาชน" value={s.citizen_id} icon={ClipboardList} />
                  <Field label="วัน/เดือน/ปีเกิด" value={s.date_of_birth} icon={Calendar} />
                  <Field label="เพศ" value={s.gender} icon={User} />
                  <Field label="สัญชาติ" value={s.nationality} icon={Globe} />
                  <Field label="อีเมล" value={s.email} icon={Mail} />
                  <Field label="โทรศัพท์" value={s.phone_number} icon={Phone} />
                  <Field label="ที่อยู่" value={`${s.address_json.line1} ${s.address_json.district} ${s.address_json.province} ${s.address_json.postal_code}`} icon={MapPin} />
                </div>
                <Separator />
                <div><h3 className="text-sm font-bold text-gray-700 mb-3">ผู้ติดต่อฉุกเฉิน</h3>
                  <div className="grid grid-cols-3 gap-x-12">
                    <Field label="ชื่อ" value={s.emergency_contact_json.name} />
                    <Field label="ความสัมพันธ์" value={s.emergency_contact_json.relation} />
                    <Field label="โทรศัพท์" value={s.emergency_contact_json.phone} icon={Phone} />
                  </div>
                </div>
              </div>)}

              {activeSection === 'scholarship' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ข้อมูลการรับทุน</h2><p className="text-sm text-gray-400 mt-0.5">แหล่งทุน สาขา สถาบัน ระยะเวลา</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="แหล่งทุน" value={s.award.scholarship_source} icon={Building} />
                  <Field label="ชื่อทุน" value={s.award.scholarship_name} icon={Award} />
                  <Field label="ประเภททุน" value={s.award.scholarship_type} icon={Award} />
                  <Field label="ระดับการศึกษา" value={s.award.degree_level} icon={GraduationCap} />
                  <Field label="สาขาวิชา" value={s.award.field_of_study} icon={BookOpen} />
                  <Field label="มหาวิทยาลัย" value={s.award.university} icon={Building} />
                  <Field label="ประเทศ" value={s.award.country} icon={Globe} />
                  <Field label="วงเงินทุนรวม" value={<span className="text-emerald-700 font-bold">{fmt(s.award.total_budget)}</span>} icon={Award} />
                  <Field label="เริ่มศึกษา" value={s.award.start_date} icon={Calendar} />
                  <Field label="สิ้นสุด" value={s.award.end_date} icon={Calendar} />
                </div>
              </div>)}

              {activeSection === 'travel' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">เอกสารเดินทาง (Visa & Passport)</h2><p className="text-sm text-gray-400 mt-0.5">ข้อมูลหนังสือเดินทางและวีซ่าเพื่อการศึกษาต่างประเทศ</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="หมายเลข Passport" value={s.travel_doc_json.passport_number} icon={ClipboardList} />
                  <Field label="วันหมดอายุ Passport" value={s.travel_doc_json.passport_expiry} icon={Calendar} />
                  <Field label="ประเภท Visa" value={s.travel_doc_json.visa_type} icon={FileText} />
                  <Field label="วันหมดอายุ Visa" value={s.travel_doc_json.visa_expiry} icon={Calendar} />
                </div>
              </div>)}

              {activeSection === 'financial' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ข้อมูลการเงิน (บัญชีรับเงินทุน)</h2><p className="text-sm text-gray-400 mt-0.5">บัญชีธนาคารสำหรับรับโอนเงินงวด</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="ธนาคาร" value={s.financial_json.bank_name} icon={Building} />
                  <Field label="สาขา" value={s.financial_json.branch} icon={MapPin} />
                  <Field label="ชื่อบัญชี" value={s.financial_json.account_name} icon={User} />
                  <Field label="เลขที่บัญชี" value={<span className="font-mono text-blue-700">{s.financial_json.account_number}</span>} icon={Wallet} />
                </div>
              </div>)}

              {activeSection === 'academic' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ผลการศึกษา (ระหว่างศึกษา)</h2><p className="text-sm text-gray-400 mt-0.5">การติดตามผลการเรียนและอาจารย์ที่ปรึกษา</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="GPAX ปัจจุบัน" value={<span className="text-lg font-bold text-gray-900">{s.academic_progress_json.current_gpax}</span>} icon={Award} />
                  <Field label="กำหนดส่งรายงานครั้งต่อไป" value={s.academic_progress_json.next_report_due} icon={CalendarClock} />
                  <Field label="ชื่ออาจารย์ที่ปรึกษา" value={s.academic_progress_json.advisor_name} icon={User} />
                  <Field label="อีเมลอาจารย์ที่ปรึกษา" value={s.academic_progress_json.advisor_email} icon={Mail} />
                </div>
                <Separator />
                <div>
                  <Field label="หัวข้อวิทยานิพนธ์ (Thesis Topic)" value={s.academic_progress_json.thesis_topic || 'ยังไม่ระบุ'} icon={BookOpen} />
                </div>
              </div>)}

              {activeSection === 'bond' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ข้อมูลการชดใช้ทุน (หลังสำเร็จการศึกษา)</h2><p className="text-sm text-gray-400 mt-0.5">การปฏิบัติราชการหรือทำงานชดใช้ทุน</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="สถานะชดใช้ทุน" value={<Badge className="bg-amber-50 text-amber-700 border border-amber-200">{s.bond_json.bond_status}</Badge>} icon={CheckCircle} />
                  <Field label="วันที่จบการศึกษา" value={s.bond_json.graduation_date} icon={GraduationCap} />
                  <Field label="กระทรวง/ต้นสังกัด" value={s.bond_json.workplace_ministry} icon={Building} />
                  <Field label="กรม/หน่วยงานย่อย" value={s.bond_json.workplace_department} icon={Building} />
                  <Field label="วันที่เริ่มชดใช้ทุน" value={s.bond_json.bond_start_date} icon={Calendar} />
                  <Field label="วันที่สิ้นสุดชดใช้ทุน" value={s.bond_json.bond_end_date} icon={Calendar} />
                </div>
              </div>)}

              {activeSection === 'health' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ผลการตรวจสุขภาพ</h2><p className="text-sm text-gray-400 mt-0.5">ผลตรวจสุขภาพตามที่ ก.พ. กำหนด</p></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="วันที่ตรวจ" value={s.health_check_date || 'ยังไม่ได้ตรวจ'} icon={Calendar} />
                  <Field label="ผลตรวจ" value={s.health_check_result ? <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">{s.health_check_result}</Badge> : <Badge variant="outline" className="text-gray-400">รอผลตรวจ</Badge>} icon={Stethoscope} />
                </div>
              </div>)}

              {activeSection === 'military' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">การผ่อนผันทหาร</h2></div>
                <div className="grid grid-cols-2 gap-x-12">
                  <Field label="สถานะ" value={s.military_exemption ? <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">ผ่อนผันแล้ว</Badge> : <Badge variant="outline" className="text-gray-400">ไม่เกี่ยวข้อง</Badge>} icon={Shield} />
                  <Field label="วันหมดอายุ" value={s.military_expiry || 'ไม่ระบุ'} icon={Calendar} />
                </div>
              </div>)}

              {activeSection === 'contract' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">สัญญารับทุนและค้ำประกัน</h2></div>
                <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                  <FileCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p className="text-sm font-medium">ยังไม่มีข้อมูลสัญญา</p><p className="text-xs mt-1">กรุณาอัปโหลดไฟล์สัญญารับทุน</p>
                </div>
              </div>)}

              {activeSection === 'documents' && (<div className="space-y-6">
                <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">คลังเอกสาร</h2><p className="text-sm text-gray-400 mt-0.5">อัปโหลดและจัดการเอกสาร รูปภาพ</p></div>
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p className="text-sm font-medium text-gray-500">ลากไฟล์มาวาง หรือคลิกเพื่ออัปโหลด</p><p className="text-xs mt-1">รองรับ PDF, JPG, PNG (ไม่เกิน 10MB)</p>
                </div>
              </div>)}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== Modal สร้างคำร้อง e-Form (Bridge → Workspace) ===== */}
      <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-600" />ส่งคำร้อง e-Form</DialogTitle>
            <DialogDescription>คำร้องนี้จะถูกส่งเข้าพื้นที่ปฏิบัติงาน (Workspace) เพื่อรอการอนุมัติ — ไม่บันทึกตรงลงฐานข้อมูล</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
              <p className="text-sm text-blue-800"><strong>ประเภทคำร้อง:</strong> {selectedFormType}</p>
              <p className="text-xs text-blue-600 mt-1">ผู้รับทุน: {s.first_name} {s.last_name} ({s.id})</p>
            </div>
            {/* จุดเชื่อมต่อ: แสดง FormBuilder ที่มีอยู่ตรงนี้ */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">{"<FormBuilder type=\"" + (selectedFormType || '') + "\" />"}</p>
              <p className="text-xs mt-1">คอมโพเนนต์ FormBuilder จาก Sub-Module 5.1 จะถูกแสดงตรงนี้</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSubmitForm} className="bg-gray-900 hover:bg-gray-800 text-white"><Send className="w-4 h-4 mr-2" />ส่งคำร้อง → พื้นที่ปฏิบัติงาน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
