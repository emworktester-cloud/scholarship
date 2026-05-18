import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, GraduationCap, Award, Mail, Phone, MapPin, Calendar,
  Globe, ChevronRight, BookOpen, Edit, Plus, Plane, ChevronLeft,
  Camera, Languages, Stethoscope, Shield, FileCheck, ClipboardList, Save, X, Info, Trash2, Eye, Upload, Building,
  Activity, MessageSquare, PhoneCall, FileText, CheckCircle, Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { PageHeader } from '../../components/shared/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import { CountryFlag } from '../../components/ui/country-flag';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

// ===== Mock Data =====
const mockPerson = {
  id: 'SCH-2569-001', firstName: 'พรพิมล', lastName: 'สุขใจ', firstNameEn: 'Pornpimon', lastNameEn: 'Sukjai',
  citizenId: '1-1234-56789-01-2', email: 'pornpimon@example.com', phone: '081-234-5678',
  dateOfBirth: '15/06/2540', age: 28, gender: 'หญิง', nationality: 'ไทย', lineId: 'pornpimon.s',
  address: '123/45 ซอยลาดพร้าว 87 บางกะปิ กรุงเทพมหานคร 10240',
  emergencyName: 'นายสมชาย สุขใจ', emergencyRelation: 'บิดา', emergencyPhone: '089-876-5432',
  workGroup: 'นทร.1', completeness: 72,
  militaryExemption: false,
  
  educations: [
    { id: 'ED-1', level: 'ปริญญาตรี', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', major: 'วิศวกรรมคอมพิวเตอร์', gpa: '3.85', year: '2562' },
    { id: 'ED-2', level: 'มัธยมศึกษาตอนปลาย', institution: 'โรงเรียนเตรียมอุดมศึกษา', major: 'วิทย์-คณิต', gpa: '3.98', year: '2558' }
  ],
  engTests: [
    { id: 'EN-1', type: 'IELTS', score: '7.5', testDate: '10/01/2568', expiryDate: '10/01/2570' }
  ],
  healthRecords: [
    { id: 'HL-1', date: '20/03/2569', hospital: 'โรงพยาบาลศิริราช', physicalResult: 'ผ่าน', mentalResult: 'ปกติ', staffNote: 'ผลตรวจสุขภาพแข็งแรงสมบูรณ์ดี ไม่มีโรคประจำตัวที่เป็นอุปสรรคต่อการศึกษา', physicalFile: 'HL-1-PHY.pdf', mentalFile: 'HL-1-MEN.pdf' }
  ],

  awards: [
    { id: 'AWD-001', name: 'ทุนเล่าเรียนหลวง', type: 'พระราชทาน', degree: 'ป.ตรี', field: 'ฟิสิกส์ทฤษฎี', university: 'Imperial College London', country: 'สหราชอาณาจักร', start: 'ส.ค. 2563', end: 'มิ.ย. 2567', phase: 'สำเร็จการศึกษา' as const, status: 'completed' as const, completeness: 100, contracts: 2, requests: 3 },
    { id: 'AWD-002', name: 'ทุนรัฐบาล (ก.พ.) พัฒนา', type: 'ทุน ก.พ.', degree: 'ป.เอก', field: 'วิศวกรรมคอมพิวเตอร์', university: 'Stanford University', country: 'สหรัฐอเมริกา', start: 'ส.ค. 2569', end: 'ก.ค. 2573', phase: 'ระหว่างศึกษา' as const, status: 'active' as const, completeness: 68, contracts: 1, requests: 0 },
  ],
};

const phaseConfig: Record<string, { icon: React.ElementType; color: string; bg: string; gradient: string }> = {
  'ก่อนเดินทาง': { icon: Plane, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', gradient: 'from-blue-500 to-indigo-500' },
  'ระหว่างศึกษา': { icon: BookOpen, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', gradient: 'from-emerald-500 to-teal-500' },
  'สำเร็จการศึกษา': { icon: Award, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', gradient: 'from-amber-500 to-orange-500' },
};
const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'กำลังดำเนินการ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

const personalSections = [
  { id: 'basic', label: 'ข้อมูลส่วนบุคคล', icon: User, desc: 'ประวัติส่วนตัว รูปถ่ายนักเรียนทุน' },
  { id: 'education', label: 'ประวัติการศึกษา', icon: GraduationCap, desc: 'การศึกษาก่อนรับทุน' },
  { id: 'contact', label: 'ช่องทางการติดต่อ', icon: Phone, desc: 'โทรศัพท์ อีเมล ที่อยู่ ผู้ติดต่อฉุกเฉิน' },
  { id: 'english', label: 'ผลคะแนนภาษา', icon: Languages, desc: 'IELTS TOEFL และการประเมิน' },
  { id: 'health', label: 'ผลการตรวจสุขภาพ', icon: Stethoscope, desc: 'ข้อมูล รพ. และผลการตรวจ' },
  { id: 'military', label: 'การผ่อนผันทหาร', icon: Shield, desc: 'สถานะทหารและการขอผ่อนผัน' },
];

export default function ScholarProfile() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'awards' | 'contact_history' | 'officer_notes'>('awards');
  const [activeSection, setActiveSection] = useState('basic');
  const [isEditingGlobal, setIsEditingGlobal] = useState(false); // For single-object sections
  const [addAwardOpen, setAddAwardOpen] = useState(false);
  
  // List UI States
  const [listMode, setListMode] = useState<'list' | 'add' | 'edit' | 'view'>('list');
  const [activeItem, setActiveItem] = useState<any>(null);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);

  const p = mockPerson;

  // Reusable Input Field with Border ONLY for Edit Mode.
  const FormField = ({ label, value, disabled = false, tooltip, type = "text", className }: { label: string; value?: string; disabled?: boolean; tooltip?: string; type?: string; className?: string }) => (
    <div className={cn("space-y-1", className)}>
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
        {label}
        {tooltip && (
          <div className="relative group cursor-help">
            <Info className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl z-50 text-center normal-case">
              {tooltip}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </div>
        )}
      </label>
      {disabled ? (
        // VIEW MODE: No borders, just pure data presentation
        <div className="text-[13px] font-medium text-gray-900">{value || <span className="text-gray-300 font-normal">-</span>}</div>
      ) : type === 'date' ? (
        // EDIT MODE: Mock Date Picker
        <div className="relative mt-1">
          <Input type="text" defaultValue={value} placeholder="DD/MM/YYYY" className="border-gray-300 shadow-sm h-9 text-[13px] bg-white focus-visible:ring-blue-500 pl-9" />
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      ) : (
        // EDIT MODE: Standard Input with borders
        <Input 
          type={type} 
          defaultValue={value} 
          className="border-gray-300 shadow-sm h-9 text-[13px] bg-white focus-visible:ring-blue-500 mt-1" 
        />
      )}
    </div>
  );

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setIsEditingGlobal(false);
    setListMode('list');
    setActiveItem(null);
  };

  const isListSection = ['education', 'english', 'health'].includes(activeSection);

  return (
    <div className="min-h-full">
      <PageHeader title={`แฟ้มประวัตินักเรียนทุน`} breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'รายการนักเรียนทุน', path: '/scholars' }, { label: `${p.firstName} ${p.lastName}` }]} />

      <div className="p-8 space-y-6">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/scholars')} className="gap-2 bg-white shadow-sm hover:bg-gray-50 font-semibold text-gray-600 border-gray-300">
            <ChevronLeft className="w-4 h-4" /> กลับสู่หน้ารายการ
          </Button>
        </div>

        {/* Premium Header Card */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg shadow-blue-900/5 bg-gradient-to-br from-indigo-600 to-blue-600">
                  <AvatarFallback className="text-white text-3xl font-bold bg-transparent">{p.firstName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 leading-none">{p.firstName} {p.lastName}</h1>
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-0.5 bg-gray-50">{p.id}</Badge>
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-xs px-2.5 py-0.5 font-semibold">{p.workGroup}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><Mail className="w-4 h-4 text-gray-400" /> {p.email}</span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><Phone className="w-4 h-4 text-gray-400" /> {p.phone}</span>
                    <div 
                      onClick={() => navigate(`/scholars/${p.id}/awards/${p.awards.find(a => a.status === 'active')?.id || p.awards[0]?.id}`)}
                      className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all group"
                    >
                      <Award className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-indigo-700 text-[13px]">ทุนปัจจุบัน: {p.awards.find(a => a.status === 'active')?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {[
            { id: 'awards' as const, label: 'ข้อมูลการรับทุน', icon: Award },
            { id: 'personal' as const, label: 'ข้อมูลส่วนบุคคล', icon: User },
            { id: 'contact_history' as const, label: 'ประวัติการติดต่อ', icon: Activity },
            ...(user?.role === 'oea' ? [{ id: 'officer_notes' as const, label: 'แจ้งข้อมูล (Broadcast)', icon: ClipboardList }] : []),
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold border-b-2 -mb-px transition-all rounded-t-lg',
                  isActive ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50')}>
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-gray-400")} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'officer_notes' && user?.role === 'oea' && (
          <div className="animate-in fade-in duration-300">
            <Card className="border border-indigo-100 shadow-sm bg-white overflow-hidden">
              <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    การแจ้งข้อมูล (Broadcast) ไปยังนักเรียนทุน
                  </h3>
                  <p className="text-xs text-indigo-600/70 mt-0.5">ส่งข้อความแจ้งเตือนหรือข้อมูลสำคัญถึงนักเรียนทุนรายบุคคลผ่านระบบ</p>
                </div>
                <Button onClick={() => setBroadcastDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
                  <Plus className="w-4 h-4" /> แจ้งข้อมูล (Broadcast) ไปยังนักเรียนทุน
                </Button>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  <div className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">OEA</AvatarFallback></Avatar>
                        <span className="text-sm font-semibold text-gray-900">เจ้าหน้าที่ สนร.</span>
                        <span className="text-xs text-gray-400 border-l border-gray-200 pl-2">เมื่อ 2 วันที่แล้ว</span>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-normal">ติดตามผลการเรียน</Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-8">
                      ได้ส่งข้อความแจ้งนักเรียนทุนเบื้องต้นเกี่ยวกับการลงทะเบียนเรียนในเทอมหน้า
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'personal' && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0 sticky top-6">
              <nav className="flex flex-col gap-1.5">
                {personalSections.map(sec => (
                  <button key={sec.id} onClick={() => handleSectionChange(sec.id)}
                    className={cn('w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all border',
                      activeSection === sec.id 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 font-semibold' 
                      : 'bg-white text-gray-600 border-transparent hover:border-gray-200 hover:bg-gray-50 font-medium')}>
                    <sec.icon className={cn('w-5 h-5', activeSection === sec.id ? 'text-white' : 'text-gray-400')} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px]">{sec.label}</p>
                    </div>
                    <ChevronRight className={cn('w-4 h-4', activeSection === sec.id ? 'text-white/70' : 'text-transparent')} />
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 w-full">
              <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-white border-b border-gray-100 px-8 py-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                      {(() => { const s = personalSections.find(x => x.id === activeSection); if (!s) return null; const Icon = s.icon; return <><Icon className="w-6 h-6 text-indigo-600" />{s.label}</>; })()}
                    </CardTitle>
                    {listMode === 'list' && (
                      <CardDescription className="text-sm mt-1">{personalSections.find(x => x.id === activeSection)?.desc}</CardDescription>
                    )}
                  </div>
                  
                  {/* Dynamic Action Buttons */}
                  {!isListSection ? (
                    /* Non-List Sections */
                    !isEditingGlobal ? (
                      <Button onClick={() => setIsEditingGlobal(true)} variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                        <Edit className="w-4 h-4" /> แก้ไขข้อมูล
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={() => setIsEditingGlobal(false)} variant="outline" className="gap-1.5 text-gray-600">
                          <X className="w-4 h-4" /> ยกเลิก
                        </Button>
                        <Button onClick={() => setIsEditingGlobal(false)} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                          <Save className="w-4 h-4" /> บันทึก
                        </Button>
                      </div>
                    )
                  ) : (
                    /* List Sections */
                    listMode === 'list' ? (
                      <Button onClick={() => { setListMode('add'); setActiveItem({}); }} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                        <Plus className="w-4 h-4" /> เพิ่มข้อมูลใหม่
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={() => setListMode('list')} variant="outline" className="gap-1.5 text-gray-600">
                          <X className="w-4 h-4" /> {listMode === 'view' ? 'ปิด' : 'ยกเลิก'}
                        </Button>
                        {listMode !== 'view' && (
                          <Button onClick={() => setListMode('list')} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                            <Save className="w-4 h-4" /> บันทึกข้อมูล
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </CardHeader>

                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={`${activeSection}-${listMode}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

                      {activeSection === 'basic' && (
                        <div className="px-8 pb-8 pt-0 flex flex-col md:flex-row gap-8">
                          <div className="w-40 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 shrink-0 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <Camera className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                            <p className="text-xs font-semibold text-gray-500">อัปโหลดรูปถ่าย</p>
                          </div>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                            <FormField disabled={!isEditingGlobal} label="ชื่อ-นามสกุล (ไทย)" value={`น.ส. ${p.firstName} ${p.lastName}`} />
                            <FormField disabled={!isEditingGlobal} label="ชื่อ-นามสกุล (อังกฤษ)" value={`Ms. ${p.firstNameEn} ${p.lastNameEn}`} />
                            <FormField disabled={!isEditingGlobal} label="เลขประจำตัวประชาชน" value={p.citizenId} />
                            <FormField type={isEditingGlobal ? "date" : "text"} disabled={!isEditingGlobal} label="วัน/เดือน/ปีเกิด" value={p.dateOfBirth} />
                            <FormField disabled={!isEditingGlobal} label="เพศ" value={p.gender} />
                            <FormField disabled={!isEditingGlobal} label="สัญชาติ" value={p.nationality} />
                          </div>
                        </div>
                      )}

                      {activeSection === 'contact' && (
                        <div className="px-8 pb-8 pt-0 space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                            <FormField disabled={!isEditingGlobal} label="โทรศัพท์มือถือ" value={p.phone} />
                            <FormField disabled={!isEditingGlobal} label="อีเมลส่วนตัว" value={p.email} />
                            <FormField disabled={!isEditingGlobal} label="LINE ID" value={p.lineId} />
                            <FormField disabled={!isEditingGlobal} label="ที่อยู่ปัจจุบัน" value={p.address} className="sm:col-span-2 lg:col-span-3" />
                          </div>
                          <div className="pt-8 border-t border-gray-100">
                            <h4 className="text-[14px] font-bold text-gray-900 mb-6 flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> ข้อมูลผู้ติดต่อฉุกเฉิน</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                              <FormField disabled={!isEditingGlobal} label="ชื่อ-นามสกุล" value={p.emergencyName} />
                              <FormField disabled={!isEditingGlobal} label="ความสัมพันธ์" value={p.emergencyRelation} />
                              <FormField disabled={!isEditingGlobal} label="เบอร์โทรศัพท์" value={p.emergencyPhone} />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === 'military' && (
                        <div className="px-8 pb-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          <FormField disabled={!isEditingGlobal} label="สถานะการเกณฑ์ทหาร" value="ไม่เกี่ยวข้อง (เพศหญิง)" />
                          <FormField type={isEditingGlobal ? "date" : "text"} disabled={!isEditingGlobal} label="วันหมดอายุใบผ่อนผัน" value="-" />
                        </div>
                      )}

                      {/* --- CLEAN LIST SECTIONS --- */}
                      
                      {activeSection === 'education' && (
                        listMode === 'list' ? (
                          <div className="w-full">
                            {p.educations.map((ed, i) => (
                              <div key={ed.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-gray-50 transition-colors group", i !== 0 && "border-t border-gray-100")}>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">ระดับการศึกษา</p>
                                    <p className="text-[13px] font-medium text-gray-900">{ed.level}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">สถาบัน / สาขาวิชา</p>
                                    <p className="text-[13px] font-medium text-gray-900">{ed.institution}</p>
                                    <p className="text-[12px] text-gray-600 mt-0.5">{ed.major} (ปีการศึกษา {ed.year}) • ผลการเรียน: {ed.gpa}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start sm:self-center shrink-0">
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(ed); setListMode('view'); }} className="text-gray-500 hover:text-blue-600 gap-1.5"><Eye className="w-4 h-4" /> ดู</Button>
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(ed); setListMode('edit'); }} className="text-gray-500 hover:text-amber-600 gap-1.5"><Edit className="w-4 h-4" /> แก้ไข</Button>
                                </div>
                              </div>
                            ))}
                            {p.educations.length === 0 && <p className="text-center text-gray-400 py-10">ยังไม่มีข้อมูล</p>}
                          </div>
                        ) : (
                          <div className="px-8 pb-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <FormField disabled={listMode === 'view'} label="ระดับการศึกษา" value={activeItem?.level} />
                            <FormField disabled={listMode === 'view'} label="สถาบัน" value={activeItem?.institution} />
                            <FormField disabled={listMode === 'view'} label="สาขาวิชา" value={activeItem?.major} />
                            <FormField disabled={listMode === 'view'} label="ปีที่จบการศึกษา (พ.ศ.)" value={activeItem?.year} />
                            <FormField disabled={listMode === 'view'} label="ผลการเรียน" value={activeItem?.gpa} tooltip="โปรดระบุเกรดเฉลี่ยสะสม (GPA) หรือ ระดับผลการเรียนตามระบบของสถานศึกษา" />
                          </div>
                        )
                      )}

                      {activeSection === 'english' && (
                        listMode === 'list' ? (
                          <div className="w-full">
                            {p.engTests.map((en, i) => (
                              <div key={en.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-gray-50 transition-colors group", i !== 0 && "border-t border-gray-100")}>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">ประเภท</p>
                                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">{en.type}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">คะแนนรวม</p>
                                    <p className="text-[13px] font-bold text-gray-900">{en.score}</p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">วันที่สอบ</p>
                                    <p className="text-[13px] font-medium text-gray-900">{en.testDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">วันหมดอายุ</p>
                                    <p className="text-[13px] font-medium text-gray-900">{en.expiryDate}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start sm:self-center shrink-0">
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(en); setListMode('view'); }} className="text-gray-500 hover:text-blue-600 gap-1.5"><Eye className="w-4 h-4" /> ดู</Button>
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(en); setListMode('edit'); }} className="text-gray-500 hover:text-amber-600 gap-1.5"><Edit className="w-4 h-4" /> แก้ไข</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-8 pb-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <FormField disabled={listMode === 'view'} label="ประเภทการสอบ (Test Type)" value={activeItem?.type} />
                            <FormField disabled={listMode === 'view'} label="คะแนนรวม (Score)" value={activeItem?.score} />
                            <FormField type={listMode === 'edit' ? 'date' : 'text'} disabled={listMode === 'view'} label="วันที่สอบ" value={activeItem?.testDate} />
                            <FormField type={listMode === 'edit' ? 'date' : 'text'} disabled={listMode === 'view'} label="วันที่หมดอายุ" value={activeItem?.expiryDate} />
                          </div>
                        )
                      )}

                      {activeSection === 'health' && (
                        listMode === 'list' ? (
                          <div className="w-full">
                            {p.healthRecords.map((hl, i) => (
                              <div key={hl.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-gray-50 transition-colors group", i !== 0 && "border-t border-gray-100")}>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <p className="text-[13px] font-bold text-gray-900">{hl.date}</p>
                                    <span className="text-gray-300">•</span>
                                    <p className="text-[13px] font-medium text-gray-700">{hl.hospital}</p>
                                  </div>
                                  <div className="flex gap-3 mb-2">
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm text-[11px]">กาย: {hl.physicalResult}</Badge>
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-sm text-[11px]">จิต: {hl.mentalResult}</Badge>
                                  </div>
                                  <p className="text-[12px] text-gray-500">หมายเหตุ: {hl.staffNote}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start sm:self-center shrink-0">
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(hl); setListMode('view'); }} className="text-gray-500 hover:text-blue-600 gap-1.5"><Eye className="w-4 h-4" /> ดู</Button>
                                  <Button variant="ghost" size="sm" onClick={() => { setActiveItem(hl); setListMode('edit'); }} className="text-gray-500 hover:text-amber-600 gap-1.5"><Edit className="w-4 h-4" /> แก้ไข</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-8 pb-8 pt-0 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                              <FormField type={listMode === 'edit' ? 'date' : 'text'} disabled={listMode === 'view'} label="วันที่ตรวจสุขภาพ" value={activeItem?.date} />
                              <FormField disabled={listMode === 'view'} label="สถานพยาบาล" value={activeItem?.hospital} />
                              <FormField disabled={listMode === 'view'} label="ผลตรวจสุขภาพกาย" value={activeItem?.physicalResult} />
                              <FormField disabled={listMode === 'view'} label="ผลตรวจสุขภาพจิต" value={activeItem?.mentalResult} />
                              <FormField disabled={listMode === 'view'} label="หมายเหตุเจ้าหน้าที่" value={activeItem?.staffNote} className="sm:col-span-2" />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">ไฟล์ใบรับรองแพทย์ (กาย)</label>
                                {listMode === 'view' ? (
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FileCheck className="w-5 h-5 text-indigo-500" /> <span className="text-[15px] font-medium text-gray-900">{activeItem?.physicalFile || 'ไม่มีไฟล์แนบ'}</span>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500 font-medium">ลากไฟล์ หรือคลิกเพื่ออัปโหลด</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">ไฟล์ใบรับรองแพทย์ (จิต)</label>
                                {listMode === 'view' ? (
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <FileCheck className="w-5 h-5 text-indigo-500" /> <span className="text-[15px] font-medium text-gray-900">{activeItem?.mentalFile || 'ไม่มีไฟล์แนบ'}</span>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <span className="text-sm text-gray-500 font-medium">ลากไฟล์ หรือคลิกเพื่ออัปโหลด</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}

                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ... (Awards tab stays the same as before, truncated for brevity here but it will be preserved in actual write since this is full replacement) ... */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ประวัติการรับทุน</h2>
                <p className="text-sm text-gray-500 mt-1">คลิกที่การ์ดเพื่อดูรายละเอียดการรับทุน จัดการข้อมูล และทำรายการคำขอ</p>
              </div>
              <Button onClick={() => setAddAwardOpen(true)} className="gap-2 font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-5 h-5" /> เพิ่มข้อมูลการรับทุนใหม่
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {p.awards.map((award, idx) => {
                const phase = phaseConfig[award.phase];
                const stat = statusConfig[award.status];
                const PhaseIcon = phase?.icon || GraduationCap;
                return (
                  <motion.div key={award.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card className={cn('border-2 transition-all cursor-pointer group overflow-hidden bg-white hover:shadow-xl', 
                      award.status === 'active' ? 'border-transparent hover:border-indigo-300 shadow-md' : 'border-gray-200 opacity-90 hover:opacity-100')}
                      onClick={() => navigate(`/scholars/${p.id}/awards/${award.id}`)}>
                      <div className={cn('h-2 bg-gradient-to-r', phase?.gradient)} />
                      <CardContent className="p-6 pt-0">
                        <div className="flex items-start gap-6">
                          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm', phase?.bg)}>
                            <PhaseIcon className={cn('w-8 h-8', phase?.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{award.name}</h3>
                              <Badge variant="outline" className="font-mono text-xs bg-gray-50">{award.id}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium mb-3">
                              <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">{award.type}</Badge>
                              <span className="flex items-center gap-1.5"><CountryFlag countryName={award.country} /> {award.country}</span>
                              <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-gray-400"/> {award.university}</span>
                              <span>• {award.degree} ({award.field})</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge className={cn('text-xs font-bold px-3 py-1 border-0 shadow-sm', phase?.bg, phase?.color)}>{award.phase}</Badge>
                              <Badge className={cn('text-xs font-bold px-3 py-1 border', stat.color)}>
                                <span className={cn('w-2 h-2 rounded-full mr-2 inline-block', stat.dot)} />
                                {stat.label}
                              </Badge>
                              <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                <Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-gray-400" />
                                {award.start} — {award.end}
                              </span>
                            </div>
                          </div>
                          
                          {/* Right Side Stats */}
                          <div className="flex flex-col items-end gap-3 self-center pl-6 border-l border-gray-100">
                            <div className="text-right">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">ข้อมูลในระบบ</p>
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <span className="text-xl font-black text-gray-800">{award.contracts}</span>
                                  <span className="text-xs text-gray-500 flex items-center"><FileCheck className="w-3 h-3 mr-1"/> สัญญา</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-xl font-black text-gray-800">{award.requests}</span>
                                  <span className="text-xs text-gray-500 flex items-center"><ClipboardList className="w-3 h-3 mr-1"/> คำขอ</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'contact_history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ประวัติการติดต่อและกิจกรรม</h2>
                <p className="text-sm text-gray-500 mt-1">บันทึกการติดต่อสื่อสารและการเปลี่ยนแปลงสถานะที่สำคัญของนักเรียนทุน</p>
              </div>
              <Button className="gap-2 font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> บันทึกการติดต่อใหม่
              </Button>
            </div>

            <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="relative pl-8 space-y-10 border-l-2 border-gray-100 before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0">
                  {[
                    { id: 1, date: '15/05/2569 14:30', type: 'email', title: 'ส่งอีเมลแจ้งเตือนการรายงานตัว', detail: 'ระบบส่งอีเมลอัตโนมัติแจ้งเตือนการรายงานตัวรอบ 6 เดือน', staff: 'ระบบอัตโนมัติ', icon: Mail, color: 'text-blue-500 bg-blue-50 border-blue-200' },
                    { id: 2, date: '10/05/2569 09:15', type: 'message', title: 'นักเรียนทุนสอบถามเรื่องการเบิกจ่ายผ่านระบบ', detail: 'ส่งข้อความสอบถามเรื่องเอกสารใบเสร็จค่าเทอมที่ต้องใช้เบิก แนะนำให้ใช้ฉบับจริงหรือสำเนาที่สถานศึกษารับรอง', staff: 'สมหญิง รักงาน', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
                    { id: 3, date: '01/05/2569 11:00', type: 'system', title: 'อัปเดตสถานะเป็น "ระหว่างศึกษา"', detail: 'อัปเดตสถานะทุนเป็นระหว่างศึกษา เนื่องจากถึงกำหนดเดินทางและรายงานตัวเข้าศึกษาแล้ว', staff: 'ระบบอัตโนมัติ', icon: Activity, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
                    { id: 4, date: '28/04/2569 15:45', type: 'document', title: 'รับเอกสารสัญญารับทุน', detail: 'ได้รับสัญญาฉบับจริงพร้อมลายเซ็นผู้ค้ำประกัน ตรวจสอบแล้วถูกต้องครบถ้วน อัปโหลดเข้าระบบเรียบร้อย', staff: 'สมหญิง รักงาน', icon: FileText, color: 'text-amber-500 bg-amber-50 border-amber-200' },
                    { id: 5, date: '20/04/2569 10:30', type: 'meeting', title: 'เข้าร่วมปฐมนิเทศนักเรียนทุน', detail: 'เข้าร่วมรับฟังการชี้แจงกฎระเบียบและข้อบังคับก่อนเดินทางไปศึกษาต่อต่างประเทศ ณ ห้องประชุมชั้น 5', staff: 'เจ้าหน้าที่ สนร.', icon: MessageSquare, color: 'text-purple-500 bg-purple-50 border-purple-200' }
                  ].map((log, idx) => {
                    const LogIcon = log.icon;
                    return (
                      <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative">
                        <div className={cn("absolute -left-[45px] w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white shadow-sm", log.color)}>
                          <LogIcon className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:bg-gray-100/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h4 className="text-[15px] font-bold text-gray-900">{log.title}</h4>
                            <span className="text-[13px] font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200 w-fit">{log.date}</span>
                          </div>
                          <p className="text-[13.5px] text-gray-600 mb-3">{log.detail}</p>
                          <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                            <User className="w-3.5 h-3.5" /> บันทึกโดย: {log.staff}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={addAwardOpen} onOpenChange={setAddAwardOpen}>
        <DialogContent className="sm:max-w-3xl p-0 gap-0 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5 text-white sticky top-0 z-10">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Award className="w-5 h-5" />เพิ่มข้อมูลการรับทุนใหม่</DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">กรอกรายละเอียดทุนการศึกษาใหม่สำหรับนักเรียนทุนรายนี้</DialogDescription>
          </div>
          <div className="p-8 space-y-8 bg-gray-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <FormField type="text" label="ชื่อทุนการศึกษา" value="" />
              <FormField type="text" label="ประเภททุน" value="" />
              <FormField type="text" label="ระดับการศึกษา" value="" />
              <FormField type="text" label="สาขาวิชา" value="" />
              <FormField type="text" label="สถานศึกษา" value="" />
              <FormField type="text" label="ประเทศ" value="" />
              <FormField type="date" label="วันที่เริ่มรับทุน" value="" />
              <FormField type="date" label="วันที่สิ้นสุดรับทุน" value="" />
            </div>
          </div>
          <div className="border-t bg-white px-6 py-4 flex justify-end gap-3 sticky bottom-0 z-10">
            <Button variant="outline" onClick={() => setAddAwardOpen(false)}>ยกเลิก</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => setAddAwardOpen(false)}>บันทึกข้อมูลทุน</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>แจ้งข้อมูล (Broadcast) ไปยังนักเรียนทุน</DialogTitle>
          <DialogDescription>
            ส่งข้อความแจ้งเตือนหรือข้อมูลสำคัญถึงนักเรียนทุนรายบุคคลผ่านระบบ
          </DialogDescription>
          
          <div className="space-y-4 my-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ประเภทการแจ้งข้อมูล</label>
              <Select defaultValue="ติดตามผลการเรียน">
                <SelectTrigger className="border border-gray-300">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ติดตามผลการเรียน">ติดตามผลการเรียน</SelectItem>
                  <SelectItem value="แจ้งเตือนเอกสาร">แจ้งเตือนเรื่องเอกสาร</SelectItem>
                  <SelectItem value="เรื่องการเงิน">เรื่องการเงินและเบิกจ่าย</SelectItem>
                  <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ข้อความ (Message)</label>
              <Textarea 
                placeholder="พิมพ์ข้อความที่ต้องการแจ้งให้นักเรียนทุนทราบ..." 
                className="min-h-[120px] border border-gray-300"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="send-email" defaultChecked />
              <label
                htmlFor="send-email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ส่งสำเนาเข้าอีเมลนักเรียนทุนด้วย
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setBroadcastDialogOpen(false)}>ยกเลิก</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => {
              toast.success('ส่งข้อมูล Broadcast เรียบร้อยแล้ว');
              setBroadcastDialogOpen(false);
            }}>
              <Send className="w-4 h-4 mr-2" /> ส่งข้อความ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
