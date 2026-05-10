import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import {
  Upload, Download, FileText, User, GraduationCap, Award,
  FileCheck, Heart, Shield, FolderOpen, Plus, Search,
  ChevronDown, ChevronUp, ChevronRight, Eye, Edit, Trash2, CheckCircle,
  Clock, AlertTriangle, Camera, Globe, Phone, Mail,
  Building, BookOpen, Calendar, MapPin, Languages,
  Stethoscope, Swords, Plane, Stamp, FileImage,
  ClipboardList, CreditCard, Fingerprint, Info, X,
  ArrowRightLeft
, Send, XCircle, Pause, GraduationCap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { DatePicker } from '../../components/ui/date-picker';
import { CountryFlag } from '../../components/ui/country-flag';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { FilterCombobox } from '../../components/ui/filter-combobox';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '../../components/ui/accordion';
import { toast } from 'sonner';

// ===== Mock scholars data =====
interface Scholar {
  id: string;
  name: string;
  status: string;
  phase: string;
  completeness: number;
  scholarshipType: string;
  destination: string;
}

const scholars: Scholar[] = [
  { id: 'SCH-2569-001', name: 'น.ส.พรพิมล สุขใจ', status: 'กำลังดำเนินการ', phase: 'ก่อนเดินทาง', completeness: 72, scholarshipType: 'ทุน ก.พ.', destination: 'สหรัฐอเมริกา' },
  { id: 'SCH-2569-002', name: 'นายวิชัย สมบูรณ์', status: 'รอเอกสารเพิ่ม', phase: 'ก่อนเดินทาง', completeness: 45, scholarshipType: 'ทุนกระทรวงวิทย์', destination: 'สหราชอาณาจักร' },
  { id: 'SCH-2569-003', name: 'น.ส.นภา รักเรียน', status: 'ครบถ้วน', phase: 'ก่อนเดินทาง', completeness: 100, scholarshipType: 'ทุน ก.พ.', destination: 'ออสเตรเลีย' },
  { id: 'SCH-2569-004', name: 'นายสมศักดิ์ มุ่งมั่น', status: 'กำลังดำเนินการ', phase: 'ก่อนเดินทาง', completeness: 60, scholarshipType: 'ทุน กต.', destination: 'ฝรั่งเศส' },
];


// ===== Request types pre departure =====
interface RequestType {
  id: string;
  label: string;
  icon: any;
  description: string;
  category: string;
}

const requestTypes: RequestType[] = [
  { id: 'delay', label: 'ขอเลื่อนกำหนดการเดินทาง', icon: Calendar, description: 'เลื่อนวันเดินทางจากที่แจ้งไว้เดิม', category: 'การเดินทาง' },
  { id: 'change-country', label: 'ขอเปลี่ยนประเทศที่ศึกษา', icon: MapPin, description: 'เปลี่ยนประเทศปลายทางจากที่ได้รับอนุมัติเดิม', category: 'การศึกษา' },
  { id: 'change-major', label: 'ขอเปลี่ยนสาขาวิชา', icon: BookOpen, description: 'เปลี่ยนสาขา/หลักสูตรที่จะศึกษา', category: 'การศึกษา' },
  { id: 'resign', label: 'ขอสละสิทธิ์รับทุน', icon: XCircle, description: 'ขอยกเลิกและสละสิทธิ์รับทุน', category: 'สิ้นสุด' },
];

// ===== Section definitions for the phase =====
const sections = [
  { id: 'personal', label: '1. ข้อมูลส่วนบุคคล', icon: User, desc: 'ประวัติส่วนตัว รูปถ่าย การศึกษา ช่องทางติดต่อ ผลภาษาอังกฤษ' },
  { id: 'scholarship', label: '2. ข้อมูลการรับทุน', icon: Award, desc: 'แหล่งทุน ชื่อทุน ประเภท ปี ระดับ สาขา สังกัด ประเทศ ระยะเวลา' },
  { id: 'contract', label: '3. สัญญารับทุนและค้ำประกัน', icon: FileCheck, desc: 'สัญญา เงื่อนไขชดใช้ทุน Upload file สัญญา' },
  { id: 'health', label: '4. ผลการตรวจสุขภาพ', icon: Stethoscope, desc: 'ผลตรวจสุขภาพตามที่ ก.พ. กำหนด (อายุ 1 ปี)' },
  { id: 'military', label: '5. การผ่อนผันทหาร', icon: Shield, desc: 'ผ่อนผันทหาร แจ้งเตือนรายปี/ก่อน 6 เดือน' },
  { id: 'documents', label: '6. เอกสารต่างๆ', icon: FolderOpen, desc: 'หนังสือรับรอง วีซ่า CAS/COE/JW/DS ตั๋ว พาสปอร์ต' },
  { id: 'transition', label: '7. การเปลี่ยนระยะ', icon: ArrowRightLeft, desc: 'ย้ายข้อมูลไประยะที่ 2 (ระหว่างศึกษา)' },
];

export default function PreDeparture() {
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importPreviewDialogOpen, setImportPreviewDialogOpen] = useState(false);
  const [addScholarOpen, setAddScholarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('personal');
  const [transitionDialogOpen, setTransitionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('scholars');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);


  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtered scholars
  const filteredScholars = scholars.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
    if (filterType !== 'all') {
      if (filterType === 'ocsc' && s.scholarshipType !== 'ทุน ก.พ.') return false;
      if (filterType === 'ministry' && !s.scholarshipType.includes('ทุนกระทรวง')) return false;
      if (filterType === 'mfa' && s.scholarshipType !== 'ทุน กต.') return false;
    }
    if (filterCountry !== 'all') {
      if (filterCountry === 'us' && s.destination !== 'สหรัฐอเมริกา') return false;
      if (filterCountry === 'uk' && s.destination !== 'สหราชอาณาจักร') return false;
      if (filterCountry === 'au' && s.destination !== 'ออสเตรเลีย') return false;
      if (filterCountry === 'fr' && s.destination !== 'ฝรั่งเศส') return false;
      if (filterCountry === 'jp' && s.destination !== 'ญี่ปุ่น') return false;
    }
    if (filterStatus !== 'all') {
      if (filterStatus === 'processing' && s.status !== 'กำลังดำเนินการ') return false;
      if (filterStatus === 'waiting' && s.status !== 'รอเอกสารเพิ่ม') return false;
      if (filterStatus === 'ready' && s.status !== 'ครบถ้วน') return false;
    }
    return true;
  });
  
  // Track edit mode for each section
  const [editModes, setEditModes] = useState<Record<string, boolean>>({});

  const toggleEditMode = (sectionId: string) => {
    setEditModes(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div className="space-y-6">
      {/* Phase Description */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">ระยะที่ 1: ก่อนเดินทางไปศึกษา</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                ตั้งแต่วันที่ผู้ได้รับทุนได้รับการประกาศรายชื่อเป็นผู้มีสิทธิได้รับทุนรัฐบาล จนถึงก่อนวันออกเดินทางไปศึกษาในประเทศ/ต่างประเทศ
                ครอบคลุมเอกสาร การอนุมัติ อนุญาต และประสานงานที่จำเป็นต่อการเดินทาง
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions & Filters */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 gap-3">
        <div className="flex gap-2 items-center flex-1 w-full flex-wrap">
          {selectedScholar ? (
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition-all" onClick={() => setSelectedScholar(null)}>
              <ChevronDown className="w-4 h-4 mr-1.5 rotate-90 text-gray-500" />
              กลับไปหน้ารายชื่อ
            </Button>
          ) : (
            <>
              <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="ค้นหาชื่อ/รหัส..." className="w-full xl:w-64 pl-9 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <FilterCombobox
                className="w-full sm:w-[180px]"
                placeholder="ประเภททุน"
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "ocsc", label: "ทุน ก.พ." },
                  { value: "ministry", label: "ทุนกระทรวง" },
                  { value: "mfa", label: "ทุน กต." }
                ]}
              />
              <FilterCombobox
                className="w-full sm:w-[180px]"
                placeholder="ประเทศ"
                value={filterCountry}
                onChange={setFilterCountry}
                options={[
                  { value: "us", label: "สหรัฐอเมริกา" },
                  { value: "uk", label: "สหราชอาณาจักร" },
                  { value: "au", label: "ออสเตรเลีย" },
                  { value: "fr", label: "ฝรั่งเศส" },
                  { value: "jp", label: "ญี่ปุ่น" }
                ]}
              />
              <FilterCombobox
                className="w-full sm:w-[180px]"
                placeholder="สถานะ"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "processing", label: "กำลังดำเนินการ" },
                  { value: "waiting", label: "รอเอกสารเพิ่ม" },
                  { value: "ready", label: "ครบถ้วน" }
                ]}
              />
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0" onClick={() => setImportDialogOpen(true)}><Upload className="w-4 h-4 mr-1.5" />นำเข้า Excel</Button>
          <Button onClick={() => setAddScholarOpen(true)}><Plus className="w-4 h-4 mr-1.5" />บันทึกรายบุคคล</Button>
        </div>
      </div>

      {!selectedScholar ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="scholars"><User className="w-3.5 h-3.5 mr-1" />รายชื่อผู้รับทุน</TabsTrigger>
            <TabsTrigger value="requests"><Send className="w-3.5 h-3.5 mr-1" />คำขอ e-Form</TabsTrigger>
          </TabsList>

          <TabsContent value="scholars" className="space-y-4">
          <Card className="overflow-hidden border-0 shadow-lg shadow-blue-900/5">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              รายชื่อผู้รับทุน (ก่อนเดินทาง)
            </CardTitle>
            <CardDescription className="text-xs text-blue-100">แสดงรายชื่อผู้รับทุนที่อยู่ระหว่างเตรียมตัวก่อนออกเดินทาง • {filteredScholars.length}/{scholars.length} ราย</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><Table>
              <TableHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-slate-700 py-3.5">รหัส / ชื่อ-สกุล</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">ประเภททุน</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">ประเทศปลายทาง</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">ความสมบูรณ์</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">สถานะ</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholars.map((s, idx) => (
                  <TableRow key={s.id} className={cn(
                    "group transition-all duration-200 cursor-pointer border-b border-gray-100",
                    idx % 2 === 0 ? "bg-white hover:bg-blue-50/60" : "bg-slate-50/40 hover:bg-blue-50/60"
                  )} onClick={() => setSelectedScholar(s)}>
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 font-medium">{s.scholarshipType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <CountryFlag countryName={s.destination} />
                        <span className="text-xs text-gray-700">{s.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full transition-all",
                            s.completeness === 100 ? "bg-gradient-to-r from-emerald-400 to-green-500" :
                            s.completeness >= 60 ? "bg-gradient-to-r from-blue-400 to-indigo-500" :
                            "bg-gradient-to-r from-amber-400 to-orange-500"
                          )} style={{ width: `${s.completeness}%` }} />
                        </div>
                        <span className={cn(
                          "text-xs font-bold",
                          s.completeness === 100 ? "text-emerald-600" : s.completeness >= 60 ? "text-blue-600" : "text-amber-600"
                        )}>{s.completeness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[10px] font-medium border shadow-sm",
                        s.completeness === 100 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        s.status === 'รอเอกสารเพิ่ม' ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {s.completeness === 100 && <CheckCircle className="w-3 h-3 mr-1" />}
                        {s.status === 'รอเอกสารเพิ่ม' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {s.status === 'กำลังดำเนินการ' && <Clock className="w-3 h-3 mr-1" />}
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg px-2" onClick={(e) => { e.stopPropagation(); setSelectedScholar(s); }}>
                          <Eye className="w-4 h-4 mr-1.5" />
                          <span className="text-xs">ดูรายละเอียด</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">

      {/* Progress Overview */}
      {selectedScholar && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">{selectedScholar.name.slice(0, 2)}</AvatarFallback></Avatar>
                  <div>
                    <h4 className="font-semibold text-sm">{selectedScholar.name}</h4>
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[9px] font-mono">{selectedScholar.id}</Badge>
                      <Badge className={`text-[9px] ${selectedScholar.completeness === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} border`}>
                        {selectedScholar.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ความสมบูรณ์ข้อมูล</p>
                  <p className="text-xl font-bold text-blue-700">{selectedScholar.completeness}%</p>
                </div>
              </div>
              <Progress value={selectedScholar.completeness} className="h-2" />
              {selectedScholar.completeness < 100 && (
                <div className="mt-3 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    <span className="font-semibold">คำแนะนำ:</span> กรุณาตรวจสอบและกรอกข้อมูลในส่วนที่ยังว่างอยู่ เพื่อให้ประวัติสมบูรณ์ 100%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start mt-4">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar whitespace-nowrap lg:whitespace-normal px-1">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setExpandedSection(sec.id)}
                className={cn(
                  "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm transition-all text-left w-auto lg:w-full border shrink-0",
                  expandedSection === sec.id
                    ? "bg-blue-600 text-white shadow-md border-transparent font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-gray-300"
                )}
              >
                <sec.icon className={cn("w-5 h-5", expandedSection === sec.id ? "text-white" : "text-gray-400")} />
                <div className="flex-1 min-w-0">
                   <p className="truncate">{sec.label.split('. ')[1]}</p>
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", expandedSection === sec.id ? "text-white" : "text-gray-300")} />
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Card className="border shadow-sm border-gray-200">
             <CardHeader className="bg-gray-50/80 border-b border-gray-200 pb-4">
               <CardTitle className="text-lg text-gray-900 flex items-center justify-between w-full">
                 <div className="flex items-center gap-2">
                   {(() => {
                     const s = sections.find(x => x.id === expandedSection);
                     if (!s) return null;
                     const Icon = s.icon;
                     return <><Icon className="w-5 h-5 text-blue-600" />{s.label.split('. ')[1]}</>;
                   })()}
                 </div>
                 {/* Edit Actions */}
                 {expandedSection !== 'documents' && (
                   <div className="flex gap-2">
                     {editModes[expandedSection] ? (
                       <>
                         <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-8 text-xs text-gray-600 border-gray-300 shadow-sm transition-all">
                           <X className="w-3.5 h-3.5 mr-1.5" />ยกเลิก
                         </Button>
                         <Button size="sm" onClick={() => { toast.success('บันทึกข้อมูลเรียบร้อย'); toggleEditMode(expandedSection); }} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0 transition-all">
                           <CheckCircle className="w-3.5 h-3.5 mr-1.5" />บันทึกข้อมูล
                         </Button>
                       </>
                     ) : (
                       <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-white shadow-sm transition-all">
                         <Edit className="w-3.5 h-3.5 mr-1.5 text-blue-600" />แก้ไขข้อมูล
                       </Button>
                     )}
                   </div>
                 )}
               </CardTitle>
               <CardDescription>
                 {sections.find(x => x.id === expandedSection)?.desc}
               </CardDescription>
             </CardHeader>
             <CardContent className="p-6">
               <div className="space-y-4">
               {expandedSection === 'personal' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Photo + Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 tracking-tight">ข้อมูลส่วนบุคคล</h4>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0">
                <div className={cn("w-32 h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50 transition-colors", editModes['personal'] ? "border-gray-300 cursor-pointer hover:border-blue-400" : "border-gray-200")} onClick={() => editModes['personal'] && toast.info('เลือกรูปถ่าย')}>
                  <Camera className="w-8 h-8 text-gray-300 mb-1" />
                  <p className="text-[10px] text-gray-400">รูปถ่ายนักเรียนทุน</p>
                  {editModes['personal'] && <p className="text-[8px] text-gray-300">JPG, PNG</p>}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">คำนำหน้า</Label><Select><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="mr">นาย</SelectItem><SelectItem value="ms">นางสาว</SelectItem><SelectItem value="mrs">นาง</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ชื่อ (ไทย)</Label><Input placeholder="ชื่อ" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="พรพิมล" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">นามสกุล (ไทย)</Label><Input placeholder="นามสกุล" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="สุขใจ" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ชื่อ (อังกฤษ)</Label><Input placeholder="First Name" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="Pornpimon" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">นามสกุล (อังกฤษ)</Label><Input placeholder="Last Name" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="Sukjai" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">เลขบัตรประชาชน</Label><Input placeholder="x-xxxx-xxxxx-xx-x" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="1-1234-56789-01-2" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันเกิด</Label><DatePicker className="border-gray-300 focus-visible:ring-blue-500" defaultValue="1997-06-15" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">เพศ</Label><Select defaultValue="female"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="male">ชาย</SelectItem><SelectItem value="female">หญิง</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สัญชาติ</Label><Input defaultValue="ไทย" className="border-gray-300 focus-visible:ring-blue-500" /></div>
                    </div>
                    {/* Move Edit Actions to bottom */}
                    {expandedSection !== 'documents' && (
                      <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                        {editModes[expandedSection] ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs text-gray-600 border-gray-300 shadow-sm transition-all">
                              <X className="w-4 h-4 mr-1.5" />ยกเลิก
                            </Button>
                            <Button size="sm" onClick={() => { toast.success('บันทึกข้อมูลเรียบร้อย'); toggleEditMode(expandedSection); }} className="h-9 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0 transition-all">
                              <CheckCircle className="w-4 h-4 mr-1.5" />บันทึกข้อมูล
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-white shadow-sm transition-all">
                            <Edit className="w-4 h-4 mr-1.5 text-blue-600" />แก้ไขข้อมูล
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                      <FieldView label="ชื่อ-นามสกุล (ไทย)" value="น.ส. พรพิมล สุขใจ" className="text-blue-900" />
                      <FieldView label="ชื่อ-นามสกุล (อังกฤษ)" value="Ms. Pornpimon Sukjai" />
                      <FieldView label="เลขประจำตัวประชาชน" value="1-1234-56789-01-2" />
                      <FieldView label="วัน/เดือน/ปีเกิด (อายุ)" value="15/06/2540 (28 ปี)" />
                      <FieldView label="เพศ" value="หญิง" />
                      <FieldView label="สัญชาติ" value="ไทย" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Education History */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 tracking-tight">ประวัติการศึกษา</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระดับการศึกษาล่าสุด</Label><Select defaultValue="bachelor"><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="bachelor">ปริญญาตรี</SelectItem><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถาบัน</Label><Input placeholder="ชื่อสถาบัน" className="border-gray-300" defaultValue="จุฬาลงกรณ์มหาวิทยาลัย" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สาขาวิชา</Label><Input placeholder="สาขา" className="border-gray-300" defaultValue="วิศวกรรมคอมพิวเตอร์" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">GPA</Label><Input placeholder="0.00" type="number" step="0.01" className="border-gray-300" defaultValue="3.85" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ปีที่จบ (พ.ศ.)</Label><Input placeholder="พ.ศ." className="border-gray-300" defaultValue="2562" /></div>
                    </div>
                    {/* Move Edit Actions to bottom */}
                    {expandedSection !== 'documents' && (
                      <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                        {editModes[expandedSection] ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs text-gray-600 border-gray-300 shadow-sm transition-all">
                              <X className="w-4 h-4 mr-1.5" />ยกเลิก
                            </Button>
                            <Button size="sm" onClick={() => { toast.success('บันทึกข้อมูลเรียบร้อย'); toggleEditMode(expandedSection); }} className="h-9 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0 transition-all">
                              <CheckCircle className="w-4 h-4 mr-1.5" />บันทึกข้อมูล
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-white shadow-sm transition-all">
                            <Edit className="w-4 h-4 mr-1.5 text-blue-600" />แก้ไขข้อมูล
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                      <FieldView label="ระดับการศึกษาล่าสุด" value="ปริญญาตรี" />
                      <FieldView label="สถาบัน" value="จุฬาลงกรณ์มหาวิทยาลัย" />
                      <FieldView label="สาขาวิชา" value="วิศวกรรมคอมพิวเตอร์" />
                      <FieldView label="GPA" value="3.85" />
                      <FieldView label="ปีที่จบ (พ.ศ.)" value="2562" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Contact */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 tracking-tight">ช่องทางการติดต่อ</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">โทรศัพท์มือถือ</Label><Input placeholder="08x-xxx-xxxx" className="border-gray-300" defaultValue="081-234-5678" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">อีเมลส่วนตัว</Label><Input placeholder="email@example.com" type="email" className="border-gray-300" defaultValue="pornpimon@example.com" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">LINE ID</Label><Input placeholder="LINE ID" className="border-gray-300" defaultValue="pornpimon.s" /></div>
                    <div className="col-span-3 space-y-1.5"><Label className="text-xs text-gray-700">ที่อยู่ปัจจุบัน</Label><Textarea placeholder="ที่อยู่" className="min-h-[60px] border-gray-300" defaultValue="123/45 ซอยลาดพร้าว 87 บางกะปิ กรุงเทพมหานคร 10240" /></div>
                    </div>
                    {/* Move Edit Actions to bottom */}
                    {expandedSection !== 'documents' && (
                      <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                        {editModes[expandedSection] ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs text-gray-600 border-gray-300 shadow-sm transition-all">
                              <X className="w-4 h-4 mr-1.5" />ยกเลิก
                            </Button>
                            <Button size="sm" onClick={() => { toast.success('บันทึกข้อมูลเรียบร้อย'); toggleEditMode(expandedSection); }} className="h-9 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0 transition-all">
                              <CheckCircle className="w-4 h-4 mr-1.5" />บันทึกข้อมูล
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-white shadow-sm transition-all">
                            <Edit className="w-4 h-4 mr-1.5 text-blue-600" />แก้ไขข้อมูล
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                      <FieldView label="โทรศัพท์มือถือ" value="081-234-5678" />
                      <FieldView label="อีเมลส่วนตัว" value="pornpimon@example.com" />
                      <FieldView label="LINE ID" value="pornpimon.s" />
                      <FieldView label="ที่อยู่ปัจจุบัน" value="123/45 ซอยลาดพร้าว 87 บางกะปิ กรุงเทพมหานคร 10240" className="col-span-2" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* English Score */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 tracking-tight">ผลคะแนนภาษาอังกฤษ</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเภทการสอบ</Label><Select defaultValue="ielts"><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ielts">IELTS</SelectItem><SelectItem value="toefl">TOEFL iBT</SelectItem><SelectItem value="toeic">TOEIC</SelectItem><SelectItem value="other">อื่นๆ</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">คะแนนรวม</Label><Input placeholder="คะแนน" type="number" step="0.5" className="border-gray-300" defaultValue="7.5" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่สอบ</Label><DatePicker className="border-gray-300" defaultValue="2025-01-10" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันหมดอายุ</Label><DatePicker className="border-gray-300" defaultValue="2027-01-10" /></div>
                    </div>
                    {/* Move Edit Actions to bottom */}
                    {expandedSection !== 'documents' && (
                      <div className="flex justify-end gap-2 pt-6 border-t mt-6">
                        {editModes[expandedSection] ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs text-gray-600 border-gray-300 shadow-sm transition-all">
                              <X className="w-4 h-4 mr-1.5" />ยกเลิก
                            </Button>
                            <Button size="sm" onClick={() => { toast.success('บันทึกข้อมูลเรียบร้อย'); toggleEditMode(expandedSection); }} className="h-9 px-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-0 transition-all">
                              <CheckCircle className="w-4 h-4 mr-1.5" />บันทึกข้อมูล
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toggleEditMode(expandedSection)} className="h-9 px-4 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-white shadow-sm transition-all">
                            <Edit className="w-4 h-4 mr-1.5 text-blue-600" />แก้ไขข้อมูล
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
                      <FieldView label="ประเภทการสอบ" value="IELTS" />
                      <FieldView label="คะแนนรวม" value={<span className="text-lg font-bold text-purple-700">7.5</span>} />
                      <FieldView label="วันที่สอบ" value="10/01/2568" />
                      <FieldView label="วันหมดอายุ" value="10/01/2570" />
                    </div>
                  </div>
                )}
              </div>
              {editModes['personal'] && <FileUploadArea label="อัปโหลดผลคะแนน" accept=".pdf,.jpg,.png" />}
            </div>
                 </motion.div>
               )}

               {expandedSection === 'scholarship' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 tracking-tight">ข้อมูลการรับทุน</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {editModes['scholarship'] ? (
                <>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">แหล่งทุน <span className="text-red-500">*</span></Label><Select defaultValue="ocsc"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือกแหล่งทุน" /></SelectTrigger><SelectContent><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem><SelectItem value="china">ทุนรัฐบาลจีน</SelectItem><SelectItem value="mext">ทุน MEXT</SelectItem><SelectItem value="other">อื่นๆ</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ชื่อทุน <span className="text-red-500">*</span></Label><Input placeholder="ชื่อทุน" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="ทุนรัฐบาล (ก.พ.) ระดับปริญญาเอก" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเภททุน <span className="text-red-500">*</span></Label><Select defaultValue="study"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="study">ศึกษาต่อ</SelectItem><SelectItem value="training">ฝึกอบรม</SelectItem><SelectItem value="research">วิจัย</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ปีที่ได้รับทุน (พ.ศ.) <span className="text-red-500">*</span></Label><Input placeholder="2569" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="2569" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระดับการศึกษาที่ได้รับทุนจัดสรร</Label><Select defaultValue="phd"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem><SelectItem value="training">ฝึกอบรม</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สาขาที่ทุนกำหนด</Label><Input placeholder="สาขาวิชา" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="วิศวกรรมคอมพิวเตอร์" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สังกัด/หน่วยงานต้นสังกัด</Label><Input placeholder="หน่วยงาน" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="สำนักงาน ก.พ." /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานศึกษา</Label><Input placeholder="ชื่อมหาวิทยาลัย" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="Stanford University" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สาขาวิชา (ที่ศึกษา)</Label><Input placeholder="สาขาวิชา" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="Computer Science" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเทศ <span className="text-red-500">*</span></Label><Select defaultValue="us"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือกประเทศ" /></SelectTrigger><SelectContent><SelectItem value="us">สหรัฐอเมริกา</SelectItem><SelectItem value="uk">สหราชอาณาจักร</SelectItem><SelectItem value="jp">ญี่ปุ่น</SelectItem><SelectItem value="au">ออสเตรเลีย</SelectItem><SelectItem value="de">เยอรมนี</SelectItem><SelectItem value="fr">ฝรั่งเศส</SelectItem><SelectItem value="cn">จีน</SelectItem><SelectItem value="th">ไทย</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">เมือง/รัฐ</Label><Input placeholder="เมือง/รัฐ" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="California" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระยะเวลารับทุน</Label><Select defaultValue="4"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="1">1 ปี</SelectItem><SelectItem value="2">2 ปี</SelectItem><SelectItem value="3">3 ปี</SelectItem><SelectItem value="4">4 ปี</SelectItem><SelectItem value="5">5 ปี</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่เริ่มรับทุน</Label><DatePicker className="border-gray-300 focus-visible:ring-blue-500" defaultValue="2026-08-01" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่สิ้นสุดรับทุน</Label><DatePicker className="border-gray-300 focus-visible:ring-blue-500" defaultValue="2030-07-31" /></div>
                </>
              ) : (
                <>
                  <FieldView label="แหล่งทุน" value="ทุน ก.พ." />
                  <FieldView label="ชื่อทุน" value="ทุนรัฐบาล (ก.พ.) ระดับปริญญาเอก" />
                  <FieldView label="ประเภททุน" value="ศึกษาต่อ" />
                  <FieldView label="ปีที่ได้รับทุน (พ.ศ.)" value="2569" />
                  <FieldView label="ระดับการศึกษาที่ได้รับทุนจัดสรร" value="ปริญญาเอก" />
                  <FieldView label="สาขาที่ทุนกำหนด" value="วิศวกรรมคอมพิวเตอร์" />
                  <FieldView label="สังกัด/หน่วยงานต้นสังกัด" value="สำนักงาน ก.พ." />
                  <FieldView label="สถานศึกษา" value="Stanford University" />
                  <FieldView label="สาขาวิชา (ที่ศึกษา)" value="Computer Science" />
                  <FieldView label="ประเทศ" value="สหรัฐอเมริกา" />
                  <FieldView label="เมือง/รัฐ" value="California" />
                  <FieldView label="ระยะเวลารับทุน" value="4 ปี" />
                  <FieldView label="วันที่เริ่มรับทุน" value="01/08/2569" />
                  <FieldView label="วันที่สิ้นสุดรับทุน" value="31/07/2573" />
                </>
              )}
            </div>
            </div>
                 </motion.div>
               )}

               {expandedSection === 'contract' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
                <CardContent className="p-5">
                  <h5 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" />สัญญารับทุน</h5>
                  {editModes['contract'] ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">เลขที่สัญญา</Label><Input placeholder="สญ./xxxx" className="border-gray-300 focus-visible:ring-indigo-500 bg-white" defaultValue="สญ. 1234/2569" /></div>
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ลงนาม</Label><DatePicker className="border-gray-300 focus-visible:ring-indigo-500 bg-white" defaultValue="2026-04-15" /></div>
                      <FileUploadArea label="อัปโหลดสัญญารับทุน" accept=".pdf" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldView label="เลขที่สัญญา" value="สญ. 1234/2569" />
                      <FieldView label="วันที่ลงนาม" value="15/04/2569" />
                      <div className="col-span-2">
                         <div className="mt-2 border border-indigo-200 rounded-lg p-3 bg-white flex items-center gap-3 cursor-pointer hover:border-indigo-400">
                           <FileText className="w-5 h-5 text-indigo-500" />
                           <div className="flex-1">
                             <p className="text-sm font-medium text-gray-800">สัญญา_1234_2569.pdf</p>
                             <p className="text-xs text-gray-500">2.4 MB</p>
                           </div>
                           <Button size="sm" variant="ghost" className="h-8 text-indigo-600 hover:text-indigo-800"><Download className="w-4 h-4" /></Button>
                         </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="border-purple-100 bg-purple-50/50 shadow-sm">
                <CardContent className="p-5">
                  <h5 className="text-sm font-semibold text-purple-800 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-purple-600" />สัญญาค้ำประกัน</h5>
                  {editModes['contract'] ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">ชื่อผู้ค้ำประกัน</Label><Input placeholder="ชื่อ-นามสกุล" className="border-gray-300 focus-visible:ring-purple-500 bg-white" defaultValue="นายสมชาย สุขใจ" /></div>
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">ความสัมพันธ์</Label><Input placeholder="เช่น บิดา มารดา" className="border-gray-300 focus-visible:ring-purple-500 bg-white" defaultValue="บิดา" /></div>
                      <FileUploadArea label="อัปโหลดสัญญาค้ำประกัน" accept=".pdf" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldView label="ชื่อผู้ค้ำประกัน" value="นายสมชาย สุขใจ" />
                      <FieldView label="ความสัมพันธ์" value="บิดา" />
                      <div className="col-span-2">
                         <div className="mt-2 border border-purple-200 rounded-lg p-3 bg-white flex items-center gap-3 cursor-pointer hover:border-purple-400">
                           <Shield className="w-5 h-5 text-purple-500" />
                           <div className="flex-1">
                             <p className="text-sm font-medium text-gray-800">ค้ำประกัน_นายสมชาย.pdf</p>
                             <p className="text-xs text-gray-500">1.8 MB</p>
                           </div>
                           <Button size="sm" variant="ghost" className="h-8 text-purple-600 hover:text-purple-800"><Download className="w-4 h-4" /></Button>
                         </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card className="border-amber-100 shadow-sm">
              <CardContent className="p-5">
                <h5 className="text-sm font-semibold mb-4 flex items-center gap-2 text-amber-800"><Clock className="w-4 h-4 text-amber-600" />เงื่อนไขระยะเวลาชดใช้ทุน</h5>
                {editModes['contract'] ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ตัวคูณชดใช้ทุน</Label><Select defaultValue="2"><SelectTrigger className="border-gray-300"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">×1 เท่า</SelectItem><SelectItem value="2">×2 เท่า</SelectItem><SelectItem value="3">×3 เท่า</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระยะเวลาชดใช้ (วัน)</Label><Input placeholder="คำนวณอัตโนมัติ" readOnly className="bg-gray-100 text-gray-600 border-gray-300" defaultValue="2920" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">หมายเหตุเงื่อนไขพิเศษ</Label><Input placeholder="ถ้ามี" className="border-gray-300" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FieldView label="ตัวคูณชดใช้ทุน" value="×2 เท่า" />
                    <FieldView label="ระยะเวลาชดใช้ (วัน)" value="2,920 วัน (8 ปี)" />
                    <FieldView label="หมายเหตุเงื่อนไขพิเศษ" value="-" />
                  </div>
                )}
              </CardContent>
            </Card>
                 </motion.div>
               )}

               {expandedSection === 'health' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-700 leading-relaxed">ผลการตรวจสุขภาพมีอายุ <strong>1 ปี</strong> นับจากวันที่ตรวจ — ระบบจะแจ้งเตือนเมื่อใกล้หมดอายุ</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {editModes['health'] ? (
                <>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ตรวจสุขภาพ</Label><DatePicker className="border-gray-300" defaultValue="2026-03-20" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานพยาบาล</Label><Input placeholder="ชื่อโรงพยาบาล" className="border-gray-300" defaultValue="โรงพยาบาลศิริราช" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่หมดอายุ</Label><DatePicker disabled className="bg-gray-100 text-gray-500 border-gray-300" defaultValue="2027-03-20" /></div>
                </>
              ) : (
                <>
                  <FieldView label="วันที่ตรวจสุขภาพ" value="20/03/2569" />
                  <FieldView label="สถานพยาบาล" value="โรงพยาบาลศิริราช" />
                  <FieldView label="วันที่หมดอายุ" value={<span className="text-amber-600 font-medium">20/03/2570</span>} />
                </>
              )}
            </div>

            <Separator className="bg-gray-100" />

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-800">รายการตรวจสอบผลสุขภาพ</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'ตรวจร่างกายทั่วไป', result: 'pass' },
                  { name: 'ตรวจสายตา', result: 'pass' },
                  { name: 'ตรวจการได้ยิน', result: 'pass' },
                  { name: 'เอกซเรย์ปอด', result: 'pass' },
                  { name: 'ตรวจเลือดทั่วไป (CBC)', result: 'pass' },
                  { name: 'ตรวจปัสสาวะ', result: 'pass' },
                  { name: 'ตรวจ HIV (ถ้ามี)', result: 'pending' },
                  { name: 'ตรวจสุขภาพจิต', result: 'pass' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      {editModes['health'] && <Checkbox id={`health-${i}`} defaultChecked={item.result !== 'pending'} />}
                      <Label htmlFor={`health-${i}`} className={cn("text-sm cursor-pointer", editModes['health'] ? "font-normal" : "font-medium text-gray-700")}>{item.name}</Label>
                    </div>
                    {editModes['health'] ? (
                      <Select defaultValue={item.result}><SelectTrigger className="w-24 h-8 border-gray-300 text-xs"><SelectValue placeholder="ผล" /></SelectTrigger><SelectContent><SelectItem value="pass">ผ่าน</SelectItem><SelectItem value="fail">ไม่ผ่าน</SelectItem><SelectItem value="pending">รอผล</SelectItem></SelectContent></Select>
                    ) : (
                      <Badge variant="outline" className={cn("text-[10px]", item.result === 'pass' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500")}>
                        {item.result === 'pass' ? 'ผ่าน' : 'รอผล'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {editModes['health'] ? (
              <div className="space-y-1.5 pt-2"><Label className="text-xs text-gray-700">หมายเหตุ/ข้อความเพิ่มเติม</Label><Textarea placeholder="พิมพ์ข้อความเพิ่มเติมเกี่ยวกับผลตรวจสุขภาพ..." className="min-h-[60px] border-gray-300" defaultValue="สุขภาพแข็งแรงดี ไม่มีโรคประจำตัว" /></div>
            ) : (
              <div className="pt-2">
                <FieldView label="หมายเหตุ/ข้อความเพิ่มเติม" value="สุขภาพแข็งแรงดี ไม่มีโรคประจำตัว" />
              </div>
            )}

            {editModes['health'] && <FileUploadArea label="อัปโหลดผลตรวจสุขภาพ" accept=".pdf,.jpg,.png" />}
                 </motion.div>
               )}

               {expandedSection === 'military' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Label className="text-sm font-semibold text-gray-800">เข้าข่ายต้องผ่อนผันทหาร</Label>
              {editModes['military'] ? (
                <Switch defaultChecked={false} />
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-500">ไม่เกี่ยวข้อง</Badge>
              )}
              <Badge variant="outline" className="text-[10px] text-gray-500">เฉพาะเพศชาย</Badge>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
              <div className="flex items-start gap-2.5"><Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><div className="text-xs text-green-800">
                <p className="font-semibold mb-1">เงื่อนไขการแจ้งเตือน (อัตโนมัติ):</p>
                <ul className="space-y-1 text-green-700/80">
                  <li>• <strong>ผ่อนผันครั้งแรก:</strong> ระบบแจ้งเตือนการต่ออายุผ่อนผันเป็นรายปี</li>
                  <li>• <strong>ผ่อนผันครั้งต่อไป:</strong> ระบบแจ้งเตือนล่วงหน้าก่อนถึงวันครบกำหนดอย่างน้อย 6 เดือน</li>
                </ul>
              </div></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-2">
              {editModes['military'] ? (
                <>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ครั้งที่ผ่อนผัน</Label><Select><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="1">ครั้งที่ 1 (ครั้งแรก)</SelectItem><SelectItem value="2">ครั้งที่ 2</SelectItem><SelectItem value="3">ครั้งที่ 3</SelectItem><SelectItem value="4">ครั้งที่ 4+</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ได้รับอนุมัติผ่อนผัน</Label><DatePicker className="border-gray-300" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ครบกำหนด</Label><DatePicker className="border-gray-300" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สัสดีจังหวัด</Label><Input placeholder="จังหวัด" className="border-gray-300" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">เลขที่หนังสือผ่อนผัน</Label><Input placeholder="เลขที่" className="border-gray-300" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานะ</Label><Select><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="active">อยู่ระหว่างผ่อนผัน</SelectItem><SelectItem value="expired">ครบกำหนดแล้ว</SelectItem><SelectItem value="exempted">พ้นเกณฑ์แล้ว</SelectItem></SelectContent></Select></div>
                </>
              ) : (
                <>
                  <FieldView label="ครั้งที่ผ่อนผัน" value="-" />
                  <FieldView label="วันที่ได้รับอนุมัติผ่อนผัน" value="-" />
                  <FieldView label="วันที่ครบกำหนด" value="-" />
                  <FieldView label="สัสดีจังหวัด" value="-" />
                  <FieldView label="เลขที่หนังสือผ่อนผัน" value="-" />
                  <FieldView label="สถานะ" value="-" />
                </>
              )}
            </div>

            {editModes['military'] && <FileUploadArea label="อัปโหลดเอกสารผ่อนผันทหาร" accept=".pdf,.jpg,.png" />}
                 </motion.div>
               )}

               {expandedSection === 'documents' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[
              { cat: 'หนังสือรับรองทางการเงิน', icon: CreditCard, files: 0 },
              { cat: 'หนังสือรับรองการเป็นนักเรียนทุน', icon: Award, files: 1 },
              { cat: 'หนังสือรับรองวีซ่า', icon: Stamp, files: 0 },
              { cat: 'เอกสารประกอบการยื่นวีซ่า', icon: FileText, files: 2 },
              { cat: 'CAS (Confirmation of Acceptance for Studies)', icon: FileCheck, files: 0 },
              { cat: 'COE (Certificate of Eligibility)', icon: FileCheck, files: 0 },
              { cat: 'JW (สำหรับจีน)', icon: FileCheck, files: 0 },
              { cat: 'DS (สำหรับสหรัฐอเมริกา)', icon: FileCheck, files: 0 },
              { cat: 'ตั๋วโดยสาร (เครื่องบิน)', icon: Plane, files: 0 },
              { cat: 'หนังสือเดินทาง (พาสปอร์ต)', icon: Globe, files: 1 },
              { cat: 'วีซ่า', icon: Fingerprint, files: 0 },
              { cat: 'เอกสารเกี่ยวกับการเดินทางอื่นๆ', icon: FolderOpen, files: 0 },
            ].map((doc, i) => {
              const DocIcon = doc.icon;
              return (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <DocIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">{doc.cat}</p>
                      <p className="text-[10px] text-gray-400">{doc.files} ไฟล์ • รองรับ .jpg .pdf .png</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.files > 0 && <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><CheckCircle className="w-3 h-3 mr-0.5" />{doc.files} ไฟล์</Badge>}
                    <Button size="sm" variant="outline" onClick={() => toast.info(`อัปโหลดเอกสาร: ${doc.cat}`)}><Upload className="w-3.5 h-3.5 mr-1" />อัปโหลด</Button>
                  </div>
                </div>
              );
            })}
                 </motion.div>
               )}

               {expandedSection === 'transition' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                       <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-indigo-900">ย้ายข้อมูลไประยะที่ 2 (ระหว่างศึกษา)</h4>
                       <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                         เมื่อนักเรียนทุนทำเรื่องแจ้งกำหนดการเดินทางและได้รับอนุมัติเรียบร้อยแล้ว คุณสามารถย้ายข้อมูลของนักเรียนทุนไประยะที่ 2 ได้
                         เพื่อเข้าสู่กระบวนการรายงานตัวและติดตามผลการศึกษาต่อไป
                       </p>
                       <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => setTransitionDialogOpen(true)}>
                         ย้ายไประยะที่ 2
                       </Button>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800">
                       <Clock className="w-4 h-4 text-gray-500" />
                       ประวัติการเปลี่ยนระยะ (Transition Log)
                     </h4>
                     <div className="space-y-3">
                       <div className="p-3 border rounded-lg bg-gray-50 flex items-start gap-3 opacity-70">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle className="w-4 h-4 text-emerald-600" />
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-800">เริ่มระยะที่ 1 (ก่อนเดินทาง)</p>
                           <p className="text-xs text-gray-500 mt-0.5">ดำเนินการเมื่อ: 10/01/2569 09:30 น. โดย สมศรี ใจดี (จนท. ก.พ.)</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>


        </div>
      )}

      {/* Transition Dialog */}
      <Dialog open={transitionDialogOpen} onOpenChange={setTransitionDialogOpen}>
        <DialogContent className="sm:max-w-md p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              ยืนยันการย้ายระยะ (Transition)
            </DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">
              ยืนยันการย้ายข้อมูล {selectedScholar?.name} ไประยะที่ 2
            </DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <p>เมื่อยืนยันการย้ายระยะแล้ว ข้อมูลของนักเรียนทุนรายนี้จะ:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ถูกนำออกจากหน้ารายการ <strong>"ระยะที่ 1 (ก่อนเดินทาง)"</strong></li>
              <li>ไปปรากฏในหน้ารายการ <strong>"ระยะที่ 2 (ระหว่างศึกษา)"</strong> เพื่อดำเนินการต่อไป</li>
            </ul>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 mt-4 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>สามารถย้ายข้อมูลกลับมาระยะที่ 1 ได้ในภายหลัง หากเกิดข้อผิดพลาด</p>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTransitionDialogOpen(false)}>ยกเลิก</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => {
              setTransitionDialogOpen(false);
              setSelectedScholar(null);
              toast.success(`ย้ายข้อมูล ${selectedScholar?.name} ไประยะที่ 2 เรียบร้อยแล้ว`, {
                description: 'ดำเนินการโดย สมศรี ใจดี (10/05/2569 14:00 น.)'
              });
            }}>
              ยืนยันการย้ายระยะ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Excel Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Upload className="w-5 h-5" />นำเข้าข้อมูลจาก Template Excel</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">อัปโหลดไฟล์ .xlsx ตาม Template ที่กำหนด</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => toast.info('เลือกไฟล์...')}>
              <Upload className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">ลากไฟล์ Excel มาวางที่นี่ หรือ คลิกเพื่อเลือก</p>
              <p className="text-[10px] text-gray-400 mt-1">รองรับ .xlsx ขนาดไม่เกิน 10MB</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast.success('ดาวน์โหลด Template Excel')}><Download className="w-4 h-4 mr-2" />ดาวน์โหลด Template Excel</Button>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>ยกเลิก</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setImportDialogOpen(false); setImportPreviewDialogOpen(true); }}>นำเข้า</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Individual Dialog */}
      <Dialog open={addScholarOpen} onOpenChange={setAddScholarOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><User className="w-5 h-5" />บันทึกข้อมูลนักเรียนทุนใหม่</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">เพิ่มประวัติส่วนบุคคลและข้อมูลรับทุน</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {/* ข้อมูลส่วนตัว */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800"><User className="w-4 h-4 text-blue-600" />ข้อมูลส่วนบุคคล</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="col-span-3 space-y-1.5"><Label className="text-xs">คำนำหน้า <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="mr">นาย</SelectItem><SelectItem value="ms">นางสาว</SelectItem><SelectItem value="mrs">นาง</SelectItem></SelectContent></Select></div>
                <div className="col-span-4 space-y-1.5"><Label className="text-xs">ชื่อ (ไทย) <span className="text-red-500">*</span></Label><Input placeholder="ชื่อ" /></div>
                <div className="col-span-5 space-y-1.5"><Label className="text-xs">นามสกุล (ไทย) <span className="text-red-500">*</span></Label><Input placeholder="นามสกุล" /></div>
                
                <div className="col-span-3 space-y-1.5"><Label className="text-xs">Prefix</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="mr">Mr.</SelectItem><SelectItem value="ms">Ms.</SelectItem><SelectItem value="mrs">Mrs.</SelectItem></SelectContent></Select></div>
                <div className="col-span-4 space-y-1.5"><Label className="text-xs">First Name</Label><Input placeholder="First Name" /></div>
                <div className="col-span-5 space-y-1.5"><Label className="text-xs">Last Name</Label><Input placeholder="Last Name" /></div>
                
                <div className="col-span-6 space-y-1.5"><Label className="text-xs">เลขประจำตัวประชาชน <span className="text-red-500">*</span></Label><Input placeholder="x-xxxx-xxxxx-xx-x" /></div>
                <div className="col-span-6 space-y-1.5"><Label className="text-xs">อีเมลติดต่อ <span className="text-red-500">*</span></Label><Input type="email" placeholder="email@example.com" /></div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* ข้อมูลทุน */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800"><Award className="w-4 h-4 text-indigo-600" />ข้อมูลการรับทุน</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">แหล่งทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">ระดับการศึกษา <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="bachelor">ปริญญาตรี</SelectItem><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">ประเทศเป้าหมาย <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="us">สหรัฐอเมริกา</SelectItem><SelectItem value="uk">สหราชอาณาจักร</SelectItem><SelectItem value="jp">ญี่ปุ่น</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">ปีที่ได้รับทุน (พ.ศ.) <span className="text-red-500">*</span></Label><Input placeholder="พ.ศ." defaultValue="2569" /></div>
              </div>
            </div>

          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddScholarOpen(false)}>ยกเลิก</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setAddScholarOpen(false); toast.success('บันทึกข้อมูลนักเรียนทุนใหม่เรียบร้อย'); }}>บันทึกข้อมูล</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Preview Full-screen Dialog */}
      <Dialog open={importPreviewDialogOpen} onOpenChange={setImportPreviewDialogOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-none sm:w-screen sm:h-screen w-screen h-screen max-h-[100vh] m-0 p-0 sm:p-0 rounded-none border-0 flex flex-col  max-h-[85vh] overflow-y-auto  bg-gray-50">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between shadow-md z-10 shrink-0">
            <div>
              <DialogTitle className="text-white text-xl flex items-center gap-2"><Upload className="w-6 h-6" />ตรวจสอบข้อมูลนำเข้าจาก Excel</DialogTitle>
              <DialogDescription className="text-emerald-100 mt-1">ระบบตรวจพบข้อมูลซ้ำซ้อน 1 รายการ กรุณาตรวจสอบก่อนยืนยันนำเข้า</DialogDescription>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 px-4 backdrop-blur-sm">
              <div className="text-center"><p className="text-[10px] text-emerald-200 uppercase">พร้อมนำเข้า</p><p className="text-xl font-bold text-white">3</p></div>
              <div className="w-px h-8 bg-white/20 mx-2"></div>
              <div className="text-center"><p className="text-[10px] text-rose-300 uppercase">พบข้อมูลซ้ำ</p><p className="text-xl font-bold text-rose-400">1</p></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="overflow-x-auto flex-1 relative">
                <div className="overflow-x-auto"><Table className="whitespace-nowrap">
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="w-[100px] text-center font-bold">สถานะ</TableHead>
                      <TableHead className="font-bold">เลขบัตรประชาชน</TableHead>
                      <TableHead className="font-bold">รหัส นทร.</TableHead>
                      <TableHead className="font-bold">ชื่อ-นามสกุล</TableHead>
                      <TableHead className="font-bold">ประเภททุน</TableHead>
                      <TableHead className="font-bold">ประเทศเป้าหมาย</TableHead>
                      <TableHead className="font-bold">สถานศึกษา</TableHead>
                      <TableHead className="font-bold">อีเมลติดต่อ</TableHead>
                      <TableHead className="font-bold">วันที่อนุมัติทุน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { citizenId: '1-1002-00341-22-1', scholarId: 'SCH-041', name: 'นายภูวิช แจ่มใส', type: 'ทุน ก.พ.', country: 'สหรัฐอเมริกา', university: 'MIT', email: 'phuwich@example.com', approvedDate: '15/05/2568', isDuplicate: false },
                      { citizenId: '3-1001-55521-11-2', scholarId: 'SCH-042', name: 'น.ส.มาลินี สุขขี', type: 'ทุนกระทรวง', country: 'สหราชอาณาจักร', university: 'Oxford', email: 'malinee@example.com', approvedDate: '15/05/2568', isDuplicate: false },
                      { citizenId: '1-2005-44211-99-9', scholarId: 'SCH-001', name: 'น.ส.พรพิมล สุขใจ', type: 'ทุน ก.พ.', country: 'สหรัฐอเมริกา', university: 'MIT', email: 'pornpa@example.com', approvedDate: '10/05/2568', isDuplicate: true },
                      { citizenId: '5-9999-12345-67-8', scholarId: 'SCH-043', name: 'นายธนาทร รักษา', type: 'ทุน กต.', country: 'ฝรั่งเศส', university: 'Sorbonne', email: 'thanat@example.com', approvedDate: '20/05/2568', isDuplicate: false },
                    ].map((row, idx) => (
                      <TableRow key={idx} className={row.isDuplicate ? 'bg-rose-50/50 hover:bg-rose-50/80' : ''}>
                        <TableCell className="text-center">
                          {row.isDuplicate ? (
                            <Badge className="bg-rose-100 text-rose-700 border-rose-200"><AlertTriangle className="w-3 h-3 mr-1" />ข้อมูลซ้ำ</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />พร้อม</Badge>
                          )}
                        </TableCell>
                        <TableCell className={cn("font-mono text-sm", row.isDuplicate && "text-rose-600 font-bold")}>{row.citizenId}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.scholarId}</TableCell>
                        <TableCell className="text-sm font-medium">{row.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.type}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.country}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.university}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.email}</TableCell>
                        <TableCell className="text-sm text-gray-600">{row.approvedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-t p-4 flex justify-end gap-3 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <Button variant="outline" size="lg" onClick={() => setImportPreviewDialogOpen(false)}>ยกเลิกการนำเข้า</Button>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-md text-white" onClick={() => { setImportPreviewDialogOpen(false); toast.success('นำเข้าข้อมูลสำเร็จ 3 รายการ (ข้ามรายการซ้ำ 1 รายการ)'); }}>
              <CheckCircle className="w-4 h-4 mr-2" />
              ยืนยันการนำเข้าข้อมูล (ข้ามรายการซ้ำ)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Shared upload component
function FileUploadArea({ label, accept }: { label: string; accept: string }) {
  return (
    <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toast.info(`อัปโหลด: ${label}`)}>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Upload className="w-4 h-4 text-gray-400" />
        <span>{label}</span>
        <Badge variant="outline" className="text-[8px] ml-auto">{accept}</Badge>
      </div>
    </div>
  );
}

// Shared field view component for View Mode
function FieldView({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-[13px] font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}
