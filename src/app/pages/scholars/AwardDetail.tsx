import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, GraduationCap, Award, FileText, Mail, Phone, MapPin, Calendar,
  Building, Globe, ClipboardList, FileCheck, BookOpen,
  Send, Edit, ChevronLeft, Plane, Wallet, Briefcase, Upload,
  Stethoscope, CheckCircle, Heart, Home, Save, X, Plus,
  FileBarChart, Stamp, ChevronRight, FilePlus, Clock, Download, AlertTriangle, Check, Calculator, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { PageHeader } from '../../components/shared/PageHeader';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DatePicker } from '../../components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { Label } from '../../components/ui/label';

const tabs = [
  { id: 'overview', label: 'ข้อมูลทุน', icon: Award },
  { id: 'place-of-study', label: 'สถานที่ศึกษา', icon: Building },
  { id: 'contracts', label: 'สัญญา & ค้ำประกัน', icon: FileCheck },
  { id: 'progress', label: 'ผลการศึกษา', icon: BookOpen },
  { id: 'finance', label: 'การเงิน & เบิกจ่าย', icon: Wallet },
  { id: 'requests', label: 'รายการคำขอ', icon: ClipboardList },
  { id: 'health', label: 'สุขภาพ (กาย/จิต)', icon: Stethoscope },
  { id: 'bond', label: 'ชดใช้ทุน', icon: Briefcase },
  { id: 'workplace', label: 'สถานที่ทำงาน', icon: MapPin },
  { id: 'documents', label: 'เอกสาร', icon: FileText },
];

const lifecycleSteps = [
  { 
    id: 'pre', 
    label: 'ก่อนเดินทาง', 
    icon: Plane, 
    status: 'completed',
    subSteps: ['เตรียมตัวสอบ', 'ปฐมนิเทศ', 'ทำสัญญา', 'เตรียมตัวเดินทาง']
  },
  { 
    id: 'during', 
    label: 'ระหว่างศึกษา', 
    icon: BookOpen, 
    status: 'active',
    subSteps: ['รายงานตัวสถานศึกษา', 'รายงานผลความก้าวหน้า', 'แจ้งสำเร็จการศึกษา']
  },
  { 
    id: 'post', 
    label: 'สำเร็จการศึกษา', 
    icon: GraduationCap, 
    status: 'pending',
    subSteps: ['สำเร็จการศึกษา', 'รายงานตัวกลับไทย', 'เริ่มต้นชดใช้ทุน']
  }
];

const formCategories = [
  {
    phase: 'ระยะก่อนเดินทางไปศึกษา',
    forms: [
      { id: 'PRE-01', name: 'ขอหนังสือนำตรวจสุขภาพทางร่างกายและสุขภาพทางจิตวิทยา', desc: 'ยื่นคำร้องขอหนังสือนำเพื่อเข้ารับการตรวจสุขภาพ' },
      { id: 'PRE-02', name: 'ขอหนังสือรับรองการเป็นนักเรียนทุน', desc: 'ขอหนังสือรับรองสถานะการเป็นนักเรียนทุน' },
      { id: 'PRE-03', name: 'ขอหนังสือรับรองทางการเงิน', desc: 'ขอเอกสารรับรองฐานะทางการเงินจากต้นสังกัด' },
      { id: 'PRE-04', name: 'ขอหนังสือรับรองเพื่อประกอบการขอวีซ่า', desc: 'เอกสารสนับสนุนประกอบการขอวีซ่านักเรียน' },
      { id: 'PRE-05', name: 'ขอหนังสืออนุมัติตัวบุคคล', desc: 'ขอหนังสือรับรองและอนุมัติตัวบุคคลเดินทาง' },
      { id: 'PRE-06', name: 'ขอรายงานตัวไปศึกษา', desc: 'รายงานตัวก่อนการเดินทางไปศึกษา' },
      { id: 'PRE-07', name: 'การเรียนภาษาท้องถิ่นของนักเรียนทุนฯ', desc: 'ขอเรียนภาษาท้องถิ่นเพิ่มเติมก่อนเข้าศึกษา' },
      { id: 'PRE-08', name: 'การเรียนภาษาอังกฤษ (เชิงวิชาการ) ควบคู่กับการเรียนฯ', desc: 'ขอเรียนภาษาอังกฤษเชิงวิชาการควบคู่ระดับป.โทขึ้นไป' },
      { id: 'PRE-09', name: 'ขอเบิกค่าใช้จ่ายก่อนเดินทาง', desc: 'คำร้องเบิกจ่ายค่าใช้จ่ายที่เกิดขึ้นก่อนเดินทาง' },
      { id: 'PRE-10', name: 'ขอให้จัดซื้อตั๋วโดยสารเครื่องบิน', desc: 'ให้ทางราชการดำเนินการจัดซื้อตั๋วเครื่องบิน' },
      { id: 'PRE-11', name: 'ขอเบิกค่าตั๋วโดยสารเครื่องบิน (กรณีซื้อตั๋วเครื่องบินเอง)', desc: 'ขอเบิกค่าตั๋วเครื่องบินคืนในกรณีสำรองจ่ายเอง' },
      { id: 'PRE-12', name: 'ขอให้ชำระค่าใช้จ่ายก่อนได้รับวีซ่า', desc: 'ขออนุมัติจ่ายค่าธรรมเนียมต่างๆ ก่อนได้วีซ่า' }
    ]
  },
  {
    phase: 'ระยะระหว่างศึกษาในต่างประเทศ',
    forms: [
      { id: 'DUR-01', name: 'ขอหนังสือรับรองทางการเงิน (F/S)', desc: 'ขอหนังสือรับรองทางการเงินสถานะนักเรียนทุน' },
      { id: 'DUR-02', name: 'ขอหนังสือรับรองเพื่อประกอบการขอวีซ่า', desc: 'เอกสารสนับสนุนการขอวีซ่าขณะกำลังศึกษา' },
      { id: 'DUR-03', name: 'ขอหนังสือรับรองเพื่อประกอบการขอ Re-entry วีซ่า', desc: 'เอกสารรับรองเพื่อขอ Re-entry วีซ่า' },
      { id: 'DUR-04', name: 'ขอรายงานตัวกลับประเทศไทย', desc: 'รายงานตัวกลับประเทศไทยช่วงปิดภาคเรียน' },
      { id: 'DUR-05', name: 'กิจกรรมการพัฒนาเสริมสร้างประสบการณ์', desc: 'ขอฝึกงาน/แลกเปลี่ยน/เรียนภาษาเพิ่มเติม' },
      { id: 'DUR-06', name: 'ขอลงทะเบียนเรียนภาคฤดูร้อน', desc: 'คำร้องขอลงทะเบียนเรียนซัมเมอร์' },
      { id: 'DUR-07', name: 'ขออนุมัติไปร่วมประชุมหรือสัมมนาทางวิชาการ', desc: 'คำร้องขออนุมัติไปเข้าร่วมสัมมนา/นำเสนอผลงาน' },
      { id: 'DUR-08', name: 'ขอศึกษาต่อในระดับที่สูงขึ้น ตามโครงการที่ราชการกำหนด', desc: 'คำขอเรียนต่อตามโครงการปกติ' },
      { id: 'DUR-09', name: 'ขอศึกษาต่อในระดับที่สูงขึ้น นอกเหนือโครงการที่ราชการกำหนด (แหล่งทุนอื่น)', desc: 'ขอเรียนต่อโดยใช้ทุนส่วนตัว/แหล่งทุนอื่น' },
      { id: 'DUR-10', name: 'การเรียนภาษาท้องถิ่นของนักเรียนทุนฯ', desc: 'สำหรับประเทศที่ไม่ใช้ภาษาอังกฤษ' },
      { id: 'DUR-11', name: 'การเรียนภาษาอังกฤษ (เชิงวิชาการ) ควบคู่กับการเรียนฯ', desc: 'เรียนเพิ่มเติมสำหรับ ป.โทขึ้นไป' },
      { id: 'DUR-12', name: 'การพิจารณาหลักสูตรกรณีศึกษาต่อสูงขึ้น และหลักสูตรไม่ตรงตามประกาศทุน', desc: 'ยื่นเปลี่ยนหลักสูตรที่ไม่ตรงตามเงื่อนไขเดิม' },
      { id: 'DUR-13', name: 'ขอสอบแก้ตัว', desc: 'คำร้องขอสอบแก้ตัววิชาที่ไม่ผ่าน' },
      { id: 'DUR-14', name: 'การพักการศึกษาชั่วคราว', desc: 'ขอลาพักการศึกษาไม่เกิน 1 ปี' },
      { id: 'DUR-15', name: 'การพักการศึกษาชั่วคราว เกิน 1 ปี', desc: 'ขอลาพักการศึกษา (กรณีพิเศษ)' },
      { id: 'DUR-16', name: 'การยุติการศึกษาในต่างประเทศ', desc: 'แจ้งความประสงค์ยุติการเรียน/ยกเลิกทุน' },
      { id: 'DUR-17', name: 'ขอเก็บข้อมูลเพื่อประกอบการทำวิทยานิพนธ์นอกประเทศที่ศึกษา', desc: 'ขอเดินทางเก็บข้อมูลงานวิจัย' },
      { id: 'DUR-18', name: 'การกลับมาเยี่ยมบ้านชั่วคราว', desc: 'แจ้งการกลับเยี่ยมบ้านชั่วคราว' },
      { id: 'DUR-19', name: 'การขอไปทัศนศึกษานอกประเทศที่ศึกษาโดยไม่กลับประเทศไทย', desc: 'คำขอเดินทางนอกประเทศระหว่างเรียน' },
      { id: 'DUR-20', name: 'การย้ายสถานศึกษา', desc: 'คำขอโอนย้ายมหาวิทยาลัย' },
      { id: 'DUR-21', name: 'การขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา กรณีทุน ก.พ.', desc: 'คำขอเปลี่ยนวิชาเอก (ทุน ก.พ.)' },
      { id: 'DUR-22', name: 'การขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา กรณีแหล่งทุนอื่น', desc: 'คำขอเปลี่ยนวิชาเอก (ทุนอื่น)' },
      { id: 'DUR-23', name: 'การขอย้ายประเทศศึกษา กรณีทุน ก.พ.', desc: 'ขอย้ายไปศึกษาที่ประเทศอื่น' },
      { id: 'DUR-24', name: 'การขอย้ายประเทศศึกษา กรณีแหล่งทุนอื่น', desc: 'ขอย้ายประเทศสำหรับทุนประเภทอื่น' },
      { id: 'DUR-25', name: 'ของดรับทุนรัฐบาลบางส่วน', desc: 'คำร้องของดรับทุนในบางรายการ' },
      { id: 'DUR-26', name: 'ของดรับทุนรัฐบาลทั้งจำนวน', desc: 'คำร้องของดรับเงินทุนทั้งหมด' },
      { id: 'DUR-27', name: 'การขอลาออกจากการเป็นนักเรียนทุนของรัฐบาล', desc: 'แจ้งลาออกจากทุนรัฐบาล' },
      { id: 'DUR-28', name: 'การขยายระยะเวลาศึกษาด้วยทุนรัฐบาลตามหลักเกณฑ์', desc: 'ขอขยายเวลาโดยยังรับเงินทุนรัฐบาล' },
      { id: 'DUR-29', name: 'การขยายระยะเวลาศึกษาด้วยทุนส่วนตัว', desc: 'ขอขยายเวลาโดยใช้ทุนส่วนตัว (ไม่เกิน 2 ปี)' },
      { id: 'DUR-30', name: 'การขยายระยะเวลาศึกษาด้วยทุนส่วนตัวเกิน 2 ปี', desc: 'ขอขยายเวลาด้วยทุนส่วนตัวเป็นกรณีพิเศษ' }
    ]
  },
  {
    phase: 'ระยะสำเร็จการศึกษา',
    forms: [
      { id: 'POST-01', name: 'ขอรายงานตัวกลับประเทศไทย', desc: 'รายงานตัวทันทีเมื่อกลับถึงประเทศไทย' },
      { id: 'POST-02', name: 'ขอสำเร็จ/เสร็จสิ้นการศึกษา', desc: 'ส่งเอกสารรับรองการจบการศึกษา (Transcript/Degree)' },
      { id: 'POST-03', name: 'ขอฝึกอบรมวิจัยหลังสำเร็จการศึกษาระดับปริญญาเอก (Post-Doctoral) กรณีทุน ก.พ.', desc: 'ขอทำ Post-Doc สำหรับนักเรียนทุน ก.พ.' },
      { id: 'POST-04', name: 'ขอฝึกอบรมวิจัยหลังสำเร็จการศึกษาระดับปริญญาเอก (Post-Doctoral) กรณีแหล่งทุนอื่น', desc: 'ขอทำ Post-Doc สำหรับทุนอื่นๆ' },
      { id: 'POST-05', name: 'ขออนุมัติฝึกงานหลังสำเร็จการศึกษา กรณีทุน ก.พ.', desc: 'ขออนุญาตทำงาน/ฝึกงานตาม OPT' },
      { id: 'POST-06', name: 'ขออนุมัติฝึกงานหลังสำเร็จการศึกษา กรณีแหล่งทุนอื่น', desc: 'ขอฝึกงานหลังเรียนจบสำหรับทุนอื่น' },
      { id: 'POST-07', name: 'ขอผ่อนผันอยู่ในต่างประเทศเพื่อศึกษา/ฝึกงานเพื่อสอบใบประกอบวิชาชีพ', desc: 'ผ่อนผันอยู่ต่างประเทศเพื่อทำ Board/ฝึกงานวิชาชีพ' },
      { id: 'POST-08', name: 'การขออนุมัติศึกษาต่อสูงขึ้นด้วยทุนรัฐบาลหลังสำเร็จการศึกษาระดับปริญญาตรี (ทุนเล่าเรียนหลวง)', desc: 'ขออนุมัติเรียนต่อ ป.โท-เอก' }
    ]
  }
];

export default function AwardDetail() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Dialog States
  const [eformSelectionDialogOpen, setEformSelectionDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<any>(null);
  const [activeEformTab, setActiveEformTab] = useState(formCategories[0].phase);
  
  const [addContractOpen, setAddContractOpen] = useState(false);
  const [addProgressOpen, setAddProgressOpen] = useState(false);
  const [addFinanceOpen, setAddFinanceOpen] = useState(false);
  const [addHealthOpen, setAddHealthOpen] = useState(false);
  const [editThesisOpen, setEditThesisOpen] = useState(false);

  // Compact Field View (like PreDeparture)
  const FieldView = ({ label, value, span = 1, className }: { label: string; value: React.ReactNode; span?: number; className?: string }) => (
    <div className={cn("space-y-1", span > 1 && `col-span-${span}`, className)}>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="text-[13px] font-medium text-gray-900 min-h-[20px]">
        {value || <span className="text-gray-300">-</span>}
      </div>
    </div>
  );

  const EditField = ({ label, defaultValue, type = 'text', span = 1 }: { label: string, defaultValue?: string, type?: string, span?: number }) => (
    <div className={cn("space-y-1.5", span > 1 && `col-span-${span}`)}>
      <label className="text-xs text-gray-700">{label}</label>
      {type === 'date' ? (
        <DatePicker defaultValue={defaultValue} />
      ) : type === 'textarea' ? (
        <Textarea defaultValue={defaultValue} className="min-h-[60px] border-gray-300 focus-visible:ring-indigo-500 text-sm" />
      ) : (
        <Input defaultValue={defaultValue} className="h-9 border-gray-300 focus-visible:ring-indigo-500 text-sm" />
      )}
    </div>
  );
  const getThemeProps = (phase: string) => {
    if (phase === 'ระยะก่อนเดินทางไปศึกษา') return {
      tabActive: 'border-blue-500 text-blue-700 bg-blue-50/80',
      tabHover: 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50/50',
      badgeActive: 'bg-blue-200 text-blue-800',
      cardHover: 'hover:border-blue-400 hover:shadow-blue-100',
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white',
      titleHover: 'group-hover:text-blue-700'
    };
    if (phase === 'ระยะระหว่างศึกษาในต่างประเทศ') return {
      tabActive: 'border-emerald-500 text-emerald-700 bg-emerald-50/80',
      tabHover: 'border-transparent text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50',
      badgeActive: 'bg-emerald-200 text-emerald-800',
      cardHover: 'hover:border-emerald-400 hover:shadow-emerald-100',
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white',
      titleHover: 'group-hover:text-emerald-700'
    };
    return {
      tabActive: 'border-amber-500 text-amber-700 bg-amber-50/80',
      tabHover: 'border-transparent text-gray-500 hover:text-amber-600 hover:bg-amber-50/50',
      badgeActive: 'bg-amber-200 text-amber-800',
      cardHover: 'hover:border-amber-400 hover:shadow-amber-100',
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white',
      titleHover: 'group-hover:text-amber-700'
    };
  };


  return (
    <div className="min-h-full pb-10">
      <PageHeader
        title="ทุนรัฐบาล (ก.พ.) พัฒนา"
        breadcrumbs={[
          { label: 'แดชบอร์ด', path: '/' },
          { label: 'รายการนักเรียนทุน', path: '/scholars' },
          { label: 'พรพิมล สุขใจ', path: `/scholars/${personId}` },
          { label: 'รายละเอียดทุน' },
        ]}
      />

      {/* Premium Award Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-[13px] font-semibold text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> พรพิมล สุขใจ <span className="text-gray-300 font-normal">|</span> <span className="font-mono text-gray-400">SCH-2569-001</span></p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 leading-none">ทุนรัฐบาล (ก.พ.) พัฒนา</h2>
                    <Badge variant="outline" className="font-mono text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">AWD-002</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-medium">
                  <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">ป.เอก วิศวกรรมคอมพิวเตอร์</span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-gray-400" /> Stanford University</span>
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-gray-400" /> สหรัฐอเมริกา</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate(`/scholars/${personId}`)} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> กลับ
              </Button>
            </div>
          </div>

          {/* Redesigned Lifecycle Stepper */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative flex justify-between">
              <div className="absolute left-10 right-10 top-5 h-1 bg-gray-100 rounded-full -z-10" />
              {/* Animated Progress Bar */}
              <motion.div 
                className="absolute left-10 top-5 h-1 bg-indigo-500 rounded-full -z-10"
                initial={{ width: '0%' }}
                animate={{ width: '50%' }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {lifecycleSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';
                return (
                  <div key={step.id} className="flex flex-col items-center z-10 w-32 relative group">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={cn('w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors',
                        isCompleted ? 'bg-indigo-600 border-indigo-100 text-white shadow-md' :
                        isActive ? 'bg-white border-indigo-600 text-indigo-600 shadow-md ring-4 ring-indigo-50' :
                        'bg-white border-gray-200 text-gray-300'
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    
                    <div className="text-center mt-3">
                      <p className={cn("text-xs font-bold", isActive ? 'text-indigo-700' : isCompleted ? 'text-gray-900' : 'text-gray-400')}>{step.label}</p>
                      <div className="mt-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity absolute w-32 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-xl border border-gray-100 z-50">
                        {step.subSteps.map((sub, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600 text-left">
                            <div className={cn("w-1.5 h-1.5 rounded-full", isCompleted ? "bg-emerald-500" : isActive && i === 1 ? "bg-indigo-500 animate-pulse" : "bg-gray-200")} />
                            <span className={isActive && i === 1 ? "font-bold text-indigo-700" : ""}>{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* Vertical Tab Navigation (Compact) */}
        <div className="w-full lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 space-y-0.5 lg:sticky lg:top-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">หมวดหมู่ข้อมูล</p>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                  className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left',
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                    : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
                  )}>
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400')} />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              <Card className="border-0 shadow-sm border border-gray-200/60 overflow-hidden rounded-2xl">
                <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                      {(() => { const s = tabs.find(x => x.id === activeTab); if (!s) return null; const Icon = s.icon; return <Icon className="w-4 h-4 text-indigo-600" />; })()}
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-900">{tabs.find(x => x.id === activeTab)?.label}</CardTitle>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab !== 'requests' && (
                      ['overview', 'place-of-study', 'bond', 'workplace'].includes(activeTab) && (
                        !isEditing ? (
                          <Button size="sm" onClick={() => setIsEditing(true)} variant="outline" className="gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 h-8 text-xs bg-white shadow-sm">
                            <Edit className="w-3.5 h-3.5" /> แก้ไขข้อมูล
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setIsEditing(false)} variant="outline" className="gap-1.5 text-gray-600 h-8 text-xs"><X className="w-3.5 h-3.5" /> ยกเลิก</Button>
                            <Button size="sm" onClick={() => { setIsEditing(false); toast.success('บันทึกข้อมูลเรียบร้อยแล้ว'); }} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs shadow-sm"><Save className="w-3.5 h-3.5" /> บันทึก</Button>
                          </div>
                        )
                      )
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 pt-0 bg-slate-50/30">
                  
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {isEditing ? (
                           <>
                             <EditField label="แหล่งทุน" defaultValue="สำนักงาน ก.พ." />
                             <EditField label="ชื่อทุน" defaultValue="ทุนรัฐบาล (ก.พ.) พัฒนา" />
                             <EditField label="ประเภททุน" defaultValue="ทุน ก.พ." />
                             <EditField label="ระดับการศึกษา" defaultValue="Doctorate (ป.เอก)" />
                             <EditField label="สาขาวิชา" defaultValue="Computer Engineering" />
                             <EditField label="ประเทศ" defaultValue="สหรัฐอเมริกา" />
                           </>
                        ) : (
                           <>
                             <FieldView label="แหล่งทุน" value="สำนักงาน ก.พ." />
                             <FieldView label="ชื่อทุน" value="ทุนรัฐบาล (ก.พ.) พัฒนา" />
                             <FieldView label="ประเภททุน" value="ทุน ก.พ." />
                             <FieldView label="ระดับการศึกษา (Plan of Study)" value="Doctorate (ป.เอก)" />
                             <FieldView label="สาขาวิชา (Subject Group)" value="Computer Engineering" />
                             <FieldView label="ระยะเวลาทุนรัฐบาล" value="5 ปี (27/08/2569 – 26/08/2574)" />
                             <FieldView label="Arrival Date" value="28/08/2569" />
                             <FieldView label="Current Location" value={<Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-2 text-[10px]">US</Badge>} />
                             <FieldView label="SCHOLARSHIP / FILE NO." value="CSK / G5832" />
                             <FieldView label="ต้นสังกัด" value="ตามความต้องการของ ศกศ. ก.พ." span={2} />
                           </>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                          <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400" /> ประวัติการขยายเวลา</h4>
                          <p className="text-[13px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">ไม่มีประวัติการขยายเวลา</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                          <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-gray-400" /> หมายเหตุ (Remarks)</h4>
                          {isEditing ? (
                            <Textarea defaultValue="อัพเดท Bio ล่าสุดเรื่องย้ายมหาลัย" className="min-h-[60px] text-sm" />
                          ) : (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[13px] font-medium text-amber-900">อัพเดท Bio ล่าสุดเรื่องย้ายมหาลัย</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'place-of-study' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2"><Building className="w-4 h-4 text-indigo-500" /> สถานศึกษา (Place of Study)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pl-1">
                          {isEditing ? (
                            <>
                              <EditField label="มหาวิทยาลัย" defaultValue="Stanford University" />
                              <EditField label="Degree" defaultValue="Ph.D." />
                              <EditField label="Subject" defaultValue="Computer Science" />
                              <EditField label="เริ่มศึกษา" defaultValue="2026-09-25" type="date" />
                              <EditField label="สิ้นสุด" defaultValue="2029-06-26" type="date" />
                            </>
                          ) : (
                            <>
                              <FieldView label="มหาวิทยาลัย" value="Stanford University" />
                              <FieldView label="ระยะเวลาศึกษา" value="25/09/2569 – 26/06/2572" />
                              <FieldView label="Degree" value="Ph.D." />
                              <FieldView label="Subject" value="Computer Science" />
                              <FieldView label="Supervisor" value="-" />
                              <FieldView label="สถานะนักเรียน" value={<Badge className="bg-emerald-50 text-emerald-700 px-2 border border-emerald-200 text-[10px]">กำลังศึกษา</Badge>} />
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2"><Home className="w-4 h-4 text-emerald-500" /> ที่อยู่ปัจจุบันในต่างประเทศ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pl-1">
                          {isEditing ? (
                            <>
                              <EditField label="ที่อยู่" defaultValue="450 Serra Mall, Stanford, CA 94305" span={2} />
                              <EditField label="โทรศัพท์มือถือ" defaultValue="+1 650 123 4567" />
                              <EditField label="E-mail" defaultValue="pornpimon@stanford.edu" />
                            </>
                          ) : (
                            <>
                              <FieldView label="ที่อยู่" value="450 Serra Mall, Stanford, CA 94305" span={2} />
                              <FieldView label="โทรศัพท์มือถือ" value="+1 650 123 4567" />
                              <FieldView label="E-mail" value="pornpimon@stanford.edu" />
                              <FieldView label="อัปเดตเมื่อ" value="26/09/2569" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'contracts' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">สัญญาและค้ำประกัน</h3>
                          <p className="text-xs text-gray-500 mt-1">ข้อมูลสัญญารับทุนและรายละเอียดการค้ำประกัน</p>
                        </div>
                        {user?.role !== 'oea' && (
                          <Button size="sm" onClick={() => setAddContractOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-8 text-xs">
                            <Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มสัญญา
                          </Button>
                        )}
                      </div>
                      {[
                        { title: 'สัญญารับทุนเพื่อการศึกษา', no: 'CT-2569-001', date: '15/05/2569', type: 'ทุน', amt: '-', cond: 'ทำงานชดใช้ 2 เท่าของเวลาที่ศึกษา หรือชดใช้เงิน 2 เท่า' },
                        { title: 'สัญญาค้ำประกัน (คนที่ 1)', no: 'GT-2569-001', date: '15/05/2569', type: 'ค้ำประกัน', name: 'นายสมชาย สุขใจ (บิดา)', amt: '5,000,000 บาท', cond: '-' }
                      ].map((contract, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-3 p-4 bg-gray-50/50 border-b border-gray-100 relative">
                            <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{contract.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">สัญญาเลขที่ {contract.no} • ลงนามเมื่อ {contract.date}</p>
                              <div className="flex items-center gap-1.5 mt-2">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-[11px] font-medium text-indigo-600 hover:underline cursor-pointer">Document_{contract.no}.pdf</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px]">มีผลบังคับใช้</Badge>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="w-7 h-7 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => setAddContractOpen(true)}><Edit className="w-3.5 h-3.5" /></Button>
                                <Button size="icon" variant="ghost" className="w-7 h-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => toast.success('ลบข้อมูลเรียบร้อยแล้ว')}><Trash2 className="w-3.5 h-3.5" /></Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                            {isEditing ? (
                              <>
                                {contract.type === 'ค้ำประกัน' && <EditField label="ผู้ค้ำประกัน" defaultValue={contract.name} />}
                                {contract.type === 'ค้ำประกัน' && <EditField label="วงเงินค้ำประกัน" defaultValue={contract.amt} />}
                                <EditField label="เงื่อนไข" defaultValue={contract.cond} span={contract.type === 'ทุน' ? 3 : 1} />
                              </>
                            ) : (
                              <>
                                {contract.type === 'ค้ำประกัน' && <FieldView label="ผู้ค้ำประกัน" value={contract.name} />}
                                {contract.type === 'ค้ำประกัน' && <FieldView label="วงเงินค้ำประกัน" value={<span className="text-gray-900 font-bold">{contract.amt}</span>} />}
                                <FieldView label="เงื่อนไขการชดใช้" value={contract.cond} span={contract.type === 'ทุน' ? 3 : 1} />
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'progress' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-500" /> รายงานความก้าวหน้า (Study Progress)</h4>
                           <Button size="sm" onClick={() => setAddProgressOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มรายงาน</Button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { date: '24/02/2569', term: 'Fall 2026', gpa: '3.85', note: 'ผลการศึกษาผ่านตามเกณฑ์ ได้ A ทุกวิชา', file: 'Transcript_Fall2026.pdf', status: 'ปกติ' },
                            { date: '03/09/2568', term: 'Spring 2026', gpa: '-', note: 'ลงทะเบียนครบถ้วน เริ่มทำวิจัยร่วมกับ Advisor', file: 'Enrollment_Spring2026.pdf', status: 'ปกติ' },
                          ].map((r, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-all group hover:border-indigo-200">
                              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                                <span className="text-[10px] font-bold text-indigo-600 leading-none mb-1">{r.term.split(' ')[0]}</span>
                                <span className="text-xs font-bold text-gray-800 leading-none">{r.term.split(' ')[1]}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">{r.status}</Badge>
                                  <span className="text-[11px] text-gray-500">รายงานเมื่อ {r.date}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                  <p className="text-[13px] font-semibold text-gray-900">ผลการเรียน: <span className="text-indigo-600">{r.gpa}</span></p>
                                </div>
                                <p className="text-[13px] text-gray-600 mt-1">หมายเหตุ: {r.note}</p>
                                <div className="flex items-center gap-1.5 mt-3">
                                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-[11px] font-medium text-indigo-600 hover:underline cursor-pointer">{r.file}</span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-indigo-500 hover:text-indigo-700" onClick={() => setAddProgressOpen(true)}><Edit className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 text-red-500 hover:text-red-700" onClick={() => toast.success('ลบข้อมูลเรียบร้อยแล้ว')}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative group">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> วิทยานิพนธ์ (Thesis)</h4>
                            <Button size="icon" variant="ghost" className="w-7 h-7 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => setEditThesisOpen(true)}><Edit className="w-3.5 h-3.5" /></Button>
                          </div>
                          <div className="space-y-5">
                             <FieldView label="หัวข้อวิทยานิพนธ์" value="AI Models for Education" />
                             <FieldView label="Submission Date" value="-" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'finance' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">ประวัติการเบิกจ่ายการเงิน</h3>
                          <p className="text-xs text-gray-500 mt-1">รายการเงินทุน ค่าใช้จ่ายรายเดือน และค่าธรรมเนียมการศึกษา</p>
                        </div>
                        <Button size="sm" onClick={() => setAddFinanceOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มรายการเบิกจ่าย</Button>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-500">
                            <tr>
                              <th className="px-4 py-3">วันที่อนุมัติ</th>
                              <th className="px-4 py-3">รายการ</th>
                              <th className="px-4 py-3 text-right">จำนวนเงิน (บาท)</th>
                              <th className="px-4 py-3 text-center">สถานะ</th>
                              <th className="px-4 py-3 text-right">จัดการ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { date: '01/09/2569', desc: 'ค่าใช้จ่ายประจำเดือน (ก.ย.)', amt: '15,000.00 ฿', status: 'โอนสำเร็จ' },
                              { date: '15/08/2569', desc: 'ค่าธรรมเนียมการศึกษา Fall 2026', amt: '124,500.00 ฿', status: 'โอนสำเร็จ' },
                              { date: '10/08/2569', desc: 'ค่าตั๋วเครื่องบินไปศึกษาต่อ', amt: '32,000.00 ฿', status: 'โอนสำเร็จ' },
                            ].map((tx, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-4 py-3 text-gray-500">{tx.date}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{tx.desc}</td>
                                <td className="px-4 py-3 text-right font-bold text-gray-700">{tx.amt}</td>
                                <td className="px-4 py-3 text-center">
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">{tx.status}</Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end">
                                    <Button size="icon" variant="ghost" className="w-6 h-6 text-indigo-500 hover:text-indigo-700" onClick={() => setAddFinanceOpen(true)}><Edit className="w-3.5 h-3.5" /></Button>
                                    <Button size="icon" variant="ghost" className="w-6 h-6 text-red-500 hover:text-red-700" onClick={() => toast.success('ลบข้อมูลเรียบร้อยแล้ว')}><Trash2 className="w-3.5 h-3.5" /></Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'requests' && (
                    <div className="space-y-6">
                      {/* Section: Pending Requests */}
                      <div>
                        <div className="mb-3">
                          <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            คำขอที่รออนุมัติ
                          </h4>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-left text-[13px]">
                            <thead className="bg-slate-50 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-500">
                              <tr>
                                <th className="px-4 py-3">รหัสคำขอ</th>
                                <th className="px-4 py-3">ประเภทคำขอ</th>
                                <th className="px-4 py-3">วันที่ส่ง</th>
                                <th className="px-4 py-3 text-right">สถานะ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-mono text-gray-500 text-xs">REQ-2026-001</td>
                                <td className="px-4 py-4 font-medium">คำขออนุมัติการเดินทาง</td>
                                <td className="px-4 py-4 text-gray-500">01/08/2569</td>
                                <td className="px-4 py-4 text-right">
                                  <Button size="sm" onClick={() => navigate('/applications/REQ-2026-001')} className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] h-6 px-3 border border-amber-200 shadow-sm">
                                    รอตรวจสอบ
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Section: Recent Requests */}
                      <div>
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-500" />
                            คำขอล่าสุด
                          </h4>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                          <table className="w-full text-left text-[13px]">
                            <thead className="bg-slate-50 border-b border-gray-100 text-[11px] uppercase font-bold text-gray-500">
                              <tr>
                                <th className="px-4 py-3">รหัสคำขอ</th>
                                <th className="px-4 py-3">ประเภทคำขอ</th>
                                <th className="px-4 py-3">วันที่ส่ง</th>
                                <th className="px-4 py-3 text-right">สถานะ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-mono text-gray-500 text-xs">REQ-2025-089</td>
                                <td className="px-4 py-4 font-medium">ขอหนังสือรับรองเพื่อประกอบการขอวีซ่า</td>
                                <td className="px-4 py-4 text-gray-500">15/06/2568</td>
                                <td className="px-4 py-4 text-right">
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">อนุมัติแล้ว</Badge>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-mono text-gray-500 text-xs">REQ-2025-012</td>
                                <td className="px-4 py-4 font-medium">ขอให้ชำระค่าใช้จ่ายก่อนได้รับวีซ่า</td>
                                <td className="px-4 py-4 text-gray-500">10/02/2568</td>
                                <td className="px-4 py-4 text-right">
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">อนุมัติแล้ว</Badge>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'health' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">ประวัติสุขภาพ (กาย/จิต)</h3>
                          <p className="text-xs text-gray-500 mt-1">รายงานผลตรวจสุขภาพและประวัติการรักษาพยาบาล</p>
                        </div>
                        <Button size="sm" onClick={() => setAddHealthOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มประวัติ</Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { title: 'ผลตรวจร่างกายประจำปี', date: '20/03/2569', hosp: 'รพ. ศิริราช', note: 'สุขภาพแข็งแรงดี ไม่มีโรคประจำตัว' },
                          { title: 'ประเมินสุขภาพจิตเบื้องต้น', date: '20/03/2569', hosp: 'คลินิกจิตเวช', note: 'ปกติ ไม่มีความเครียดสะสม' },
                        ].map((h, i) => (
                          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:shadow-md hover:border-indigo-200 transition-all">
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50">
                              <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500 shrink-0">
                                <Heart className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{h.title}</h4>
                                <p className="text-[11px] text-gray-500 mt-0.5">{h.date}</p>
                              </div>
                              <div className="flex items-center">
                                <Button size="icon" variant="ghost" className="w-6 h-6 text-indigo-500 hover:text-indigo-700" onClick={() => setAddHealthOpen(true)}><Edit className="w-3.5 h-3.5" /></Button>
                                <Button size="icon" variant="ghost" className="w-6 h-6 text-red-500 hover:text-red-700" onClick={() => toast.success('ลบข้อมูลเรียบร้อยแล้ว')}><Trash2 className="w-3.5 h-3.5" /></Button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {isEditing ? (
                                <>
                                  <EditField label="สถานพยาบาล" defaultValue={h.hosp} />
                                  <EditField label="ผล/ข้อความ" defaultValue={h.note} type="textarea" />
                                </>
                              ) : (
                                <>
                                  <FieldView label="สถานพยาบาล" value={h.hosp} />
                                  <FieldView label="ผลการประเมิน" value={h.note} />
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'bond' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2"><Calculator className="w-4 h-4 text-amber-500" /> การคำนวณวันชดใช้ทุน</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">ระยะเวลารับทุน</p>
                            <p className="text-xl font-bold text-amber-900">1,460 <span className="text-xs font-normal">วัน</span></p>
                          </div>
                          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-1">ตัวคูณ (ตามสัญญา)</p>
                            <p className="text-xl font-bold text-amber-900">×2</p>
                          </div>
                          <div className="col-span-2 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 text-center">
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">รวมต้องปฏิบัติงานชดใช้ทุน</p>
                            <p className="text-2xl font-bold text-emerald-700">2,920 <span className="text-xs font-normal">วัน</span> <span className="text-sm text-emerald-600 font-medium">(8 ปี)</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">รายละเอียดเพิ่มเติม</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                           {isEditing ? (
                             <>
                               <EditField label="วันเริ่มรับทุน" defaultValue="" type="date" />
                               <EditField label="วันสิ้นสุดรับทุน (โดยประมาณ)" defaultValue="" type="date" />
                               <EditField label="เงื่อนไขพิเศษเพิ่มเติม" defaultValue="หากไม่ชดใช้ด้วยเวลา ต้องชดใช้เป็นเงิน 2 เท่าของเงินทุนทั้งหมด" span={2} type="textarea" />
                             </>
                           ) : (
                             <>
                               <FieldView label="วันเริ่มรับทุน" value="27/08/2569" />
                               <FieldView label="วันสิ้นสุดรับทุน (โดยประมาณ)" value="26/08/2574" />
                               <FieldView label="เงื่อนไขพิเศษเพิ่มเติม" value="หากไม่ชดใช้ด้วยเวลา ต้องชดใช้เป็นเงิน 2 เท่าของเงินทุนทั้งหมด" span={2} />
                             </>
                           )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'workplace' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                         <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                         <div>
                           <h4 className="text-sm font-bold text-blue-900">สถานที่ปฏิบัติงานชดใช้ทุน (จัดสรรสังกัด)</h4>
                           <p className="text-[11px] text-blue-700 mt-1">ข้อมูลส่วนนี้จะสมบูรณ์เมื่อนักเรียนทุนสำเร็จการศึกษาและได้รับการจัดสรรสังกัดเพื่อเริ่มปฏิบัติราชการแล้ว</p>
                         </div>
                      </div>
                      
                      <div className={cn("bg-white border border-gray-100 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6", !isEditing && "opacity-60")}>
                        {isEditing ? (
                          <>
                            <EditField label="หน่วยงาน/ส่วนราชการ" defaultValue="-" />
                            <EditField label="ตำแหน่งที่บรรจุ" defaultValue="-" />
                            <EditField label="วันเริ่มปฏิบัติราชการ" defaultValue="" type="date" />
                            <EditField label="คำสั่งกระทรวง/กรม" defaultValue="-" />
                          </>
                        ) : (
                          <>
                            <FieldView label="หน่วยงาน/ส่วนราชการ" value="-" />
                            <FieldView label="ตำแหน่งที่บรรจุ" value="-" />
                            <FieldView label="วันเริ่มปฏิบัติราชการ" value="-" />
                            <FieldView label="คำสั่งกระทรวง/กรม" value="-" />
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">คลังเอกสารนักเรียนทุน</h3>
                          <p className="text-xs text-gray-500 mt-1">เอกสารทั้งหมดที่เกี่ยวข้องตลอดอายุการรับทุน</p>
                        </div>
                      </div>
                      {[
                        { cat: 'สัญญารับทุนและค้ำประกัน', files: 2 },
                        { cat: 'หนังสือรับรองการเป็นนักเรียนทุน', files: 1 },
                        { cat: 'หนังสือเดินทางและวีซ่า', files: 2 },
                        { cat: 'รายงานผลการศึกษา (Transcript)', files: 0 },
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                              <FileText className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-gray-800">{doc.cat}</p>
                              <p className="text-[11px] text-gray-500">{doc.files} ไฟล์เอกสาร</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {doc.files > 0 && <Badge className="bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-200 font-medium px-2 py-0.5"><Check className="w-3 h-3 mr-1" />มีเอกสาร</Badge>}
                            <Button size="sm" variant="outline" className="h-8 text-xs"><Upload className="w-3.5 h-3.5 mr-1" />อัปโหลด</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* e-Form Selection Dialog */}
      <Dialog open={eformSelectionDialogOpen} onOpenChange={setEformSelectionDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0 max-h-[85vh] flex flex-col border-0 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-6 text-white relative shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <DialogTitle className="text-white text-lg flex items-center gap-2 relative z-10">
              <FilePlus className="w-5 h-5" />
              เลือกประเภทคำขอ e-Form
            </DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1.5 relative z-10">กรุณาเลือกประเภทแบบฟอร์มที่ต้องการทำรายการ โดยแบ่งหมวดหมู่ตามระยะการศึกษา</DialogDescription>
          </div>
          <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto min-h-0">
            {/* Tabs Header */}
            <div className="flex justify-center gap-1.5 mb-6 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar">
              {formCategories.map((cat) => {
                const theme = getThemeProps(cat.phase);
                return (
                  <button
                    key={cat.phase}
                    onClick={() => setActiveEformTab(cat.phase)}
                    className={cn(
                      "whitespace-nowrap px-4 py-2.5 rounded-t-xl text-[13px] font-bold transition-all border-b-[3px] flex items-center gap-2 relative -mb-[2px]",
                      activeEformTab === cat.phase ? theme.tabActive : theme.tabHover
                    )}
                  >
                    {cat.phase}
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors",
                      activeEformTab === cat.phase ? theme.badgeActive : "bg-gray-200 text-gray-600"
                    )}>
                      {cat.forms.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {formCategories.filter(c => c.phase === activeEformTab).map((cat) => {
                const theme = getThemeProps(cat.phase);
                return (
                  <div key={cat.phase} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cat.forms.map((form) => (
                        <div 
                          key={form.id} 
                          className={cn("p-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all group flex items-start gap-3", theme.cardHover)}
                          onClick={() => {
                            setEformSelectionDialogOpen(false);
                            setSelectedRequestType(form);
                            setRequestDialogOpen(true);
                          }}
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors", theme.iconBg)}>
                            <Send className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn("text-sm font-bold text-gray-900 transition-colors", theme.titleHover)}>{form.name}</p>
                              <Badge variant="outline" className="text-[9px] font-mono text-gray-400 border-gray-200 px-1.5 py-0 shrink-0">{form.id}</Badge>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{form.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-gray-100 bg-white px-6 py-4 flex justify-end gap-2 shrink-0">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setEformSelectionDialogOpen(false)}>ยกเลิก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Request Form Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        {selectedRequestType && (
          <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-6 text-white relative shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <DialogTitle className="text-white text-lg flex items-center gap-2 relative z-10">
                <Send className="w-5 h-5" />
                {selectedRequestType.name}
              </DialogTitle>
              <DialogDescription className="text-indigo-100 mt-1.5 relative z-10">กรอกข้อมูลและแนบเอกสารเพื่อยื่นคำขอไปยังหน่วยงานที่ดูแล</DialogDescription>
            </div>
            <div className="px-6 py-6 space-y-5 bg-white flex-1 overflow-y-auto min-h-0">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                 <User className="w-5 h-5 text-blue-500 shrink-0" />
                 <div>
                   <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">ผู้ยื่นคำขอ</p>
                   <p className="text-[13px] font-bold text-blue-900">SCH-2569-001 • พรพิมล สุขใจ</p>
                 </div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">เหตุผลความจำเป็น <span className="text-red-500">*</span></Label><Textarea placeholder="ระบุเหตุผลประกอบการพิจารณา..." className="min-h-[100px] border border-gray-300 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">เอกสารแนบประกอบพิจารณา</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-300 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-[13px] font-medium text-gray-700">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                  <p className="text-[10px] text-gray-500 mt-1">รองรับ PDF, JPG, PNG (ไม่เกิน 5MB)</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2 shrink-0">
              <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setRequestDialogOpen(false)}>ยกเลิก</Button>
              <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setRequestDialogOpen(false); toast.success(`ส่งคำขอ "${selectedRequestType.name}" เรียบร้อยแล้ว`); }}>
                <Send className="w-3.5 h-3.5 mr-1.5" />ส่งคำขอ
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Add Contract Dialog */}
      <Dialog open={addContractOpen} onOpenChange={setAddContractOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5" /> เพิ่มสัญญา / ค้ำประกัน
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเภทสัญญา <span className="text-red-500">*</span></Label>
              <Select defaultValue="ทุน">
                <SelectTrigger className="h-9 border border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ทุน">สัญญารับทุน</SelectItem><SelectItem value="ค้ำประกัน">สัญญาค้ำประกัน</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">เลขที่สัญญา <span className="text-red-500">*</span></Label><Input placeholder="เช่น CT-2569-002" className="h-9 border border-gray-300 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ลงนาม</Label><DatePicker /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">ชื่อผู้ทำสัญญา / ผู้ค้ำประกัน</Label><Input placeholder="ระบุชื่อ-นามสกุล..." className="h-9 border border-gray-300 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">เงื่อนไขเพิ่มเติม</Label><Textarea placeholder="ระบุเงื่อนไข..." className="min-h-[60px] border border-gray-300 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">เอกสารแนบสัญญา/ค้ำประกัน</Label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-[11px] font-medium text-gray-600">อัปโหลดไฟล์ PDF/JPG</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setAddContractOpen(false)}>ยกเลิก</Button>
            <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setAddContractOpen(false); toast.success('เพิ่มสัญญาเรียบร้อยแล้ว'); }}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Progress Dialog */}
      <Dialog open={addProgressOpen} onOpenChange={setAddProgressOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> เพิ่มรายงานความก้าวหน้า
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">ภาคเรียน (Term) <span className="text-red-500">*</span></Label><Input placeholder="เช่น Fall 2026" className="h-9 border border-gray-300 text-sm" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">ผลการเรียน</Label><Input placeholder="เช่น GPA, ระดับผลการเรียน" className="h-9 border border-gray-300 text-sm" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานะผลการเรียน <span className="text-red-500">*</span></Label>
              <Select defaultValue="ปกติ">
                <SelectTrigger className="h-9 border border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ปกติ">ปกติ (ผ่านเกณฑ์)</SelectItem><SelectItem value="เฝ้าระวัง">เฝ้าระวัง (ตํ่ากว่าเกณฑ์)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">หมายเหตุ</Label><Textarea placeholder="ระบุความคืบหน้า..." className="min-h-[60px] border border-gray-300 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">ไฟล์ผลการเรียน (Transcript)</Label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-[11px] font-medium text-gray-600">อัปโหลดไฟล์ PDF/JPG</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setAddProgressOpen(false)}>ยกเลิก</Button>
            <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setAddProgressOpen(false); toast.success('เพิ่มรายงานความก้าวหน้าเรียบร้อยแล้ว'); }}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Finance Dialog */}
      <Dialog open={addFinanceOpen} onOpenChange={setAddFinanceOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5" /> เพิ่มรายการเบิกจ่าย
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">รายการเบิกจ่าย <span className="text-red-500">*</span></Label><Input placeholder="ระบุรายการ..." className="h-9 border border-gray-300 text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่อนุมัติ</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">จำนวนเงิน (บาท) <span className="text-red-500">*</span></Label><Input type="number" placeholder="0.00" className="h-9 border border-gray-300 text-sm" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานะ</Label>
              <Select defaultValue="รอดำเนินการ">
                <SelectTrigger className="h-9 border border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="รอดำเนินการ">รอดำเนินการ</SelectItem><SelectItem value="โอนสำเร็จ">โอนสำเร็จ</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setAddFinanceOpen(false)}>ยกเลิก</Button>
            <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setAddFinanceOpen(false); toast.success('เพิ่มรายการเบิกจ่ายเรียบร้อยแล้ว'); }}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Health Dialog */}
      <Dialog open={addHealthOpen} onOpenChange={setAddHealthOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Stethoscope className="w-5 h-5" /> เพิ่มประวัติสุขภาพ
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเภทผลการตรวจ <span className="text-red-500">*</span></Label>
              <Select defaultValue="สุขภาพกาย">
                <SelectTrigger className="h-9 border border-gray-300 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="สุขภาพกาย">สุขภาพกาย</SelectItem>
                  <SelectItem value="สุขภาพจิต">สุขภาพจิต</SelectItem>
                  <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">หัวข้อการตรวจ/ประเมิน <span className="text-red-500">*</span></Label><Input placeholder="ระบุหัวข้อ..." className="h-9 border border-gray-300 text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ตรวจ</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานพยาบาล</Label><Input placeholder="ชื่อโรงพยาบาล/คลินิก" className="h-9 border border-gray-300 text-sm" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">ผลการประเมิน / หมายเหตุ</Label><Textarea placeholder="ระบุผล..." className="min-h-[80px] border border-gray-300 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">เอกสารใบรับรองแพทย์</Label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-[11px] font-medium text-gray-600">อัปโหลดไฟล์ PDF/JPG</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setAddHealthOpen(false)}>ยกเลิก</Button>
            <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setAddHealthOpen(false); toast.success('เพิ่มประวัติสุขภาพเรียบร้อยแล้ว'); }}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Thesis Dialog */}
      <Dialog open={editThesisOpen} onOpenChange={setEditThesisOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" /> แก้ไขข้อมูลวิทยานิพนธ์
            </DialogTitle>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">หัวข้อวิทยานิพนธ์ <span className="text-red-500">*</span></Label><Textarea placeholder="ระบุหัวข้อวิทยานิพนธ์..." defaultValue="AI Models for Education" className="min-h-[80px] border border-gray-300 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-gray-700">Submission Date</Label><DatePicker /></div>
          </div>
          <div className="border-t border-gray-100 bg-slate-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" className="text-xs h-9 px-5" onClick={() => setEditThesisOpen(false)}>ยกเลิก</Button>
            <Button className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => { setEditThesisOpen(false); toast.success('บันทึกข้อมูลวิทยานิพนธ์เรียบร้อยแล้ว'); }}>
              <Save className="w-3.5 h-3.5 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
