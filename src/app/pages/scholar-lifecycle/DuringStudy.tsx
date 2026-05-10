import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import {
  Upload, FileText, User, Eye, CheckCircle, Clock, AlertTriangle,
  ChevronRight, Search, Plus, Send, Bell, Flag, MapPin,
  GraduationCap, BookOpen, Calendar, Globe, Building,
  Plane, ArrowRightLeft, Pause, XCircle, FileCheck,
  MessageSquare, Shield, Activity, HeartPulse, Wallet,
  Timer, FolderOpen, Brain, Laptop, ClipboardList, Edit, Trash2, Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { FilterCombobox } from '../../components/ui/filter-combobox';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
import { DatePicker } from '../../components/ui/date-picker';
import { CountryFlag } from '../../components/ui/country-flag';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '../../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

// ===== Watch List categories =====
interface WatchListItem {
  id: string;
  scholarId: string;
  scholarName: string;
  country: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  reportedBy: string;
  reportedDate: string;
  status: 'active' | 'monitoring' | 'resolved';
}

const watchListCategories = [
  { id: 'academic', label: 'ปัญหาการศึกษา', icon: GraduationCap, color: 'text-blue-600' },
  { id: 'health-physical', label: 'ปัญหาสุขภาพกาย', icon: HeartPulse, color: 'text-red-600' },
  { id: 'health-mental', label: 'ปัญหาสุขภาพจิต', icon: Brain, color: 'text-purple-600' },
  { id: 'behavior', label: 'ปัญหาพฤติกรรม', icon: Activity, color: 'text-orange-600' },
  { id: 'finance', label: 'ปัญหาเงินเกินสิทธิ', icon: Wallet, color: 'text-amber-600' },
  { id: 'retirement', label: 'ปัญหาใกล้ครบอายุเกษียณ', icon: Timer, color: 'text-gray-600' },
];

const watchListItems: WatchListItem[] = [
  { id: 'WL-001', scholarId: 'SCH-008', scholarName: 'นายธนกฤต ประสบผล', country: 'สหรัฐอเมริกา', category: 'academic', severity: 'high', description: 'GPA ต่ำกว่าเกณฑ์ 2 ภาคการศึกษาติดต่อกัน ต้องปรับปรุง', reportedBy: 'สนร. วอชิงตัน', reportedDate: '20/02/2569', status: 'active' },
  { id: 'WL-002', scholarId: 'SCH-012', scholarName: 'น.ส.ปิยะดา เก่งกล้า', country: 'ญี่ปุ่น', category: 'health-mental', severity: 'medium', description: 'มีอาการเครียดสะสมจากการเรียน ได้รับคำปรึกษาจากนักจิตวิทยา', reportedBy: 'สนร. โตเกียว', reportedDate: '18/02/2569', status: 'monitoring' },
  { id: 'WL-003', scholarId: 'SCH-025', scholarName: 'นายภาคิน แข็งแรง', country: 'สหราชอาณาจักร', category: 'finance', severity: 'low', description: 'เบิกค่าครองชีพเกินสิทธิ 2 เดือน — อยู่ระหว่างหักคืน', reportedBy: 'สนร. ลอนดอน', reportedDate: '15/02/2569', status: 'monitoring' },
];

// ===== Request types during study =====
interface RequestType {
  id: string;
  label: string;
  icon: typeof FileText;
  description: string;
  category: string;
}

const requestTypes: RequestType[] = [
  { id: 'extend', label: 'ขอขยายระยะเวลาศึกษา', icon: Calendar, description: 'ขยายเวลารับทุนเพิ่มเติม', category: 'เวลา' },
  { id: 'conference', label: 'ขออนุมัติไปร่วมประชุม/สัมมนาทางวิชาการ', icon: Laptop, description: 'เข้าร่วม Conference, Seminar, Workshop', category: 'วิชาการ' },
  { id: 'higher-study', label: 'ขอศึกษาต่อในระดับที่สูงขึ้น', icon: GraduationCap, description: 'เช่น จาก ป.โท ไป ป.เอก', category: 'วิชาการ' },
  { id: 'retake', label: 'การสอบแก้ตัว', icon: BookOpen, description: 'ขออนุมัติสอบแก้ตัวรายวิชา', category: 'วิชาการ' },
  { id: 'suspend', label: 'การพักการศึกษาชั่วคราว', icon: Pause, description: 'ขอพักการศึกษาด้วยเหตุผลต่างๆ', category: 'เวลา' },
  { id: 'terminate', label: 'การยุติการศึกษาในต่างประเทศ', icon: XCircle, description: 'ยุติการศึกษาก่อนกำหนด', category: 'สิ้นสุด' },
  { id: 'thesis-outside', label: 'เก็บข้อมูลวิทยานิพนธ์นอกประเทศที่ศึกษา', icon: FileText, description: 'เก็บข้อมูลวิจัยในประเทศอื่น', category: 'วิชาการ' },
  { id: 'home-visit', label: 'กลับมาเยี่ยมบ้านชั่วคราว', icon: Plane, description: 'ขออนุมัติกลับเยี่ยมบ้านระหว่างศึกษา', category: 'การเดินทาง' },
  { id: 'travel-outside', label: 'ขอไปทัศนศึกษานอกประเทศที่ศึกษา', icon: Globe, description: 'เดินทางไปประเทศอื่นโดยไม่กลับไทย', category: 'การเดินทาง' },
  { id: 'transfer-school', label: 'การย้ายสถานศึกษา', icon: ArrowRightLeft, description: 'ย้ายไปสถานศึกษาอื่นในประเทศเดียวกัน', category: 'สถานศึกษา' },
  { id: 'change-major', label: 'ขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา', icon: BookOpen, description: 'เปลี่ยนสาขาวิชา/หลักสูตร', category: 'วิชาการ' },
  { id: 'change-country', label: 'ขอย้ายประเทศศึกษา', icon: MapPin, description: 'ย้ายไปศึกษาในประเทศอื่น', category: 'สถานศึกษา' },
  { id: 'change-address', label: 'คำขอเปลี่ยนที่อยู่', icon: MapPin, description: 'อัปเดตที่อยู่ปัจจุบันในต่างประเทศ', category: 'ข้อมูลส่วนตัว' },
];

// ===== Academic report items =====
interface AcademicReport {
  id: string;
  scholarName: string;
  scholarId: string;
  semester: string;
  gpa: string;
  cumGpa: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'flagged';
  submittedDate: string;
}

const academicReports: AcademicReport[] = [
  { id: 'AR-001', scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-001', semester: 'Fall 2568', gpa: '3.85', cumGpa: '3.80', status: 'approved', submittedDate: '10/02/2569' },
  { id: 'AR-002', scholarName: 'นายวิชัย สมบูรณ์', scholarId: 'SCH-002', semester: 'Fall 2568', gpa: '3.42', cumGpa: '3.55', status: 'reviewed', submittedDate: '12/02/2569' },
  { id: 'AR-003', scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-008', semester: 'Fall 2568', gpa: '2.15', cumGpa: '2.65', status: 'flagged', submittedDate: '15/02/2569' },
];

const reportStatusConfig = {
  submitted: { label: 'ส่งแล้ว', bg: 'bg-blue-100', color: 'text-blue-700' },
  reviewed: { label: 'ตรวจแล้ว', bg: 'bg-yellow-100', color: 'text-yellow-700' },
  approved: { label: 'อนุมัติ', bg: 'bg-green-100', color: 'text-green-700' },
  flagged: { label: 'ต้องเฝ้าระวัง', bg: 'bg-red-100', color: 'text-red-700' },
};

const severityBg = {
  critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-400', low: 'bg-blue-400',
};
const severityLabel = {
  critical: 'วิกฤต', high: 'สูง', medium: 'กลาง', low: 'ต่ำ',
};

// Detail view section IDs
const detailSections = [
  { id: 'report', label: 'รายงานตัวเพื่อไปศึกษา', icon: MapPin },
  { id: 'eform', label: 'คำขอ e-Form', icon: Send },
  { id: 'academic', label: 'ผลการศึกษา/GPAX', icon: ClipboardList },
  { id: 'watchlist', label: 'การเฝ้าระวัง', icon: Flag },
  { id: 'special', label: 'กลุ่มพิเศษ', icon: Shield },
  { id: 'transition', label: 'การเปลี่ยนระยะ (Transition)', icon: ArrowRightLeft },
];

export default function DuringStudy() {
  const [activeTab, setActiveTab] = useState('scholars');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);
  const [selectedScholar, setSelectedScholar] = useState<any>(null);
  const [detailSection, setDetailSection] = useState('report');

  // Dialog States for Add/Edit
  const [arrivalReportDialogOpen, setArrivalReportDialogOpen] = useState(false);
  const [eformSelectionDialogOpen, setEformSelectionDialogOpen] = useState(false);

  const [snrReportDialogOpen, setSnrReportDialogOpen] = useState(false);
  const [editingSnrReport, setEditingSnrReport] = useState<any>(null);
  const [transitionToPrevOpen, setTransitionToPrevOpen] = useState(false);
  const [transitionToNextOpen, setTransitionToNextOpen] = useState(false);

  const [academicDialogOpen, setAcademicDialogOpen] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState<any>(null);

  const [watchListDialogOpen, setWatchListDialogOpen] = useState(false);
  const [editingWatchList, setEditingWatchList] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDegree, setFilterDegree] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const duringStudyScholars = [
    { id: 'SCH-001', name: 'น.ส.พรพิมล สุขใจ', degree: 'M.Sc. Data Science', university: 'MIT', country: 'สหรัฐอเมริกา', gpa: '3.85', status: 'ปกติ', nextReport: '15/05/2569', snr: 'สนร. วอชิงตัน', reportedDate: '20/08/2568', address: '77 Massachusetts Ave, Cambridge, MA 02139', scholarType: 'ทุน ก.พ.' },
    { id: 'SCH-008', name: 'นายธนกฤต ประสบผล', degree: 'Ph.D. Economics', university: 'Harvard University', country: 'สหรัฐอเมริกา', gpa: '2.15', status: 'ต้องเฝ้าระวัง', nextReport: '15/05/2569', snr: 'สนร. วอชิงตัน', reportedDate: '15/08/2568', address: '1805 Cambridge St, Cambridge, MA 02138', scholarType: 'ทุน ก.พ.' },
    { id: 'SCH-012', name: 'น.ส.ปิยะดา เก่งกล้า', degree: 'M.A. Design', university: 'University of Tokyo', country: 'ญี่ปุ่น', gpa: '3.42', status: 'เฝ้าระวัง', nextReport: '30/04/2569', snr: 'สนร. โตเกียว', reportedDate: '01/09/2568', address: '7 Chome-3-1 Hongo, Bunkyo, Tokyo', scholarType: 'ทุนกระทรวง' },
    { id: 'SCH-025', name: 'นายภาคิน แข็งแรง', degree: 'B.Eng. Mechanical', university: 'Imperial College', country: 'สหราชอาณาจักร', gpa: '3.20', status: 'ปกติ', nextReport: '30/05/2569', snr: 'สนร. ลอนดอน', reportedDate: '10/09/2568', address: 'Exhibition Rd, South Kensington, London SW7', scholarType: 'ทุน ก.พ.' },
  ];

  const filteredDuringStudyScholars = duringStudyScholars.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
    if (filterDegree !== 'all') {
      if (filterDegree === 'ba' && !s.degree.startsWith('B.')) return false;
      if (filterDegree === 'ma' && !s.degree.startsWith('M.')) return false;
      if (filterDegree === 'phd' && !s.degree.startsWith('Ph.D')) return false;
    }
    if (filterCountry !== 'all') {
      if (filterCountry === 'us' && s.country !== 'สหรัฐอเมริกา') return false;
      if (filterCountry === 'uk' && s.country !== 'สหราชอาณาจักร') return false;
      if (filterCountry === 'jp' && s.country !== 'ญี่ปุ่น') return false;
    }
    if (filterStatus !== 'all') {
      if (filterStatus === 'normal' && s.status !== 'ปกติ') return false;
      if (filterStatus === 'watch' && s.status !== 'เฝ้าระวัง') return false;
      if (filterStatus === 'critical' && s.status !== 'ต้องเฝ้าระวัง') return false;
    }
    return true;
  });

  // Scholar-specific data lookups
  const scholarWatchItems = selectedScholar ? watchListItems.filter(w => w.scholarId === selectedScholar.id) : [];
  const scholarReports = selectedScholar ? academicReports.filter(r => r.scholarId === selectedScholar.id) : [];
  const scholarRequests = selectedScholar ? [
    { id: 'REQ-101', type: 'กลับมาเยี่ยมบ้านชั่วคราว', date: '10/03/2569', status: 'อนุมัติ' },
    { id: 'REQ-102', type: 'ขออนุมัติไปร่วมประชุม/สัมมนาทางวิชาการ', date: '22/01/2569', status: 'รอพิจารณา' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Phase Description */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900">ระยะที่ 2: ระหว่างศึกษาในประเทศหรือต่างประเทศ</h3>
              <p className="text-xs text-green-700 mt-1 leading-relaxed">
                ตั้งแต่วันเดินทางไปศึกษา จนถึงก่อนวันสิ้นสุดการศึกษา ครอบคลุมการรายงานตัว ติดตามผล รายงานผลการศึกษา
                คำขออนุมัติ/อนุญาตต่างๆ ผ่าน สนร./สอท./สำนักงาน ก.พ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== DETAIL VIEW ===== */}
      {selectedScholar ? (
        <div className="space-y-4">
          {/* Back button + Scholar header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50" onClick={() => { setSelectedScholar(null); setDetailSection('report'); }}>
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />กลับไปหน้ารายชื่อ
            </Button>
          </div>

          {/* Scholar Info Header Card */}
          <Card className="border-0 shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <Avatar className="h-16 w-16 border-2 border-white/30 shadow-md">
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">{selectedScholar.name.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">{selectedScholar.name}</h2>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] font-mono">{selectedScholar.id}</Badge>
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px]">{selectedScholar.scholarshipType || selectedScholar.scholarType}</Badge>
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px]">{selectedScholar.degree}</Badge>
                      </div>
                    </div>
                    <Badge className={cn("text-[11px] px-3 py-1 self-center sm:self-start border shadow-sm", selectedScholar.status === 'ปกติ' ? 'bg-emerald-500 text-white border-emerald-400' : selectedScholar.status === 'ต้องเฝ้าระวัง' ? 'bg-rose-500 text-white border-rose-400' : 'bg-amber-500 text-white border-amber-400')}>
                      {selectedScholar.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-5 gap-y-2 mt-4 text-green-50">
                    <span className="text-xs flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-green-200" />{selectedScholar.country}</span>
                    <span className="text-xs flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-green-200" />{selectedScholar.university}</span>
                    <span className="text-xs font-mono bg-black/10 px-2 py-0.5 rounded">GPA: {selectedScholar.gpa}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sidebar + Content */}
          <div className="grid grid-cols-12 gap-4">
            {/* Sidebar */}
            <div className="col-span-3 space-y-1">
              {detailSections.map(sec => {
                const SIcon = sec.icon;
                const isActive = detailSection === sec.id;
                return (
                  <button key={sec.id} onClick={() => setDetailSection(sec.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all", isActive ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700")}>
                    <SIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                    {sec.id === 'watchlist' && scholarWatchItems.length > 0 && <Badge className="ml-auto bg-red-500 text-white text-[8px] px-1.5">{scholarWatchItems.length}</Badge>}
                  </button>
                );
              })}
            </div>

            {/* Content area */}
            <div className="col-span-9 space-y-4">
              {/* Section: รายงานตัว */}
              {detailSection === 'report' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" />รายงานตัวเพื่อไปศึกษา</CardTitle><CardDescription className="text-xs">ข้อมูลการรายงานตัวผ่าน สนร./สอท.</CardDescription></div>
                      <Button size="sm" variant="outline" onClick={() => setArrivalReportDialogOpen(true)}><Edit className="w-4 h-4 mr-1 text-amber-600" />แก้ไขข้อมูล</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200"><Label className="text-[10px] text-blue-500">สนร./สอท. ที่รายงานตัว</Label><p className="text-sm font-semibold text-blue-700 mt-1">{selectedScholar.snr}</p></div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200"><Label className="text-[10px] text-blue-500">วันที่รายงานตัว</Label><p className="text-sm font-semibold text-blue-700 mt-1">{selectedScholar.reportedDate}</p></div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border"><Label className="text-[10px] text-gray-500">ที่อยู่ปัจจุบัน (ต่างประเทศ)</Label><p className="text-sm mt-1">{selectedScholar.address}</p></div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-xs text-green-700 font-medium">รายงานตัวเรียบร้อยแล้ว</span></div>
                  </CardContent>
                </Card>
              )}

              {/* Section: คำขอ e-Form */}
              {detailSection === 'eform' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div><CardTitle className="text-base flex items-center gap-2"><Send className="w-5 h-5 text-purple-600" />คำขอ e-Form ของ {selectedScholar.name}</CardTitle><CardDescription className="text-xs">คำขอขยายเวลา, พักการศึกษา, เปลี่ยนสาขา, กลับเยี่ยมบ้าน</CardDescription></div>
                      <Button size="sm" onClick={() => setEformSelectionDialogOpen(true)}><Plus className="w-4 h-4 mr-1" />ยื่นคำขอใหม่</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {scholarRequests.length > 0 ? (
                      <div className="space-y-2">
                        {scholarRequests.map(req => (
                          <div key={req.id} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 group">
                            <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-gray-400" /><div><p className="text-xs font-medium">{req.type}</p><p className="text-[10px] text-gray-400">{req.id} • {req.date}</p></div></div>
                            <div className="flex items-center gap-3">
                              <Badge className={cn("text-[9px]", req.status === 'อนุมัติ' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>{req.status}</Badge>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => toast.info(`ดูรายละเอียดคำขอ ${req.id}`)}><Eye className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => toast.info(`แก้ไขคำขอ ${req.id}`)}><Edit className="w-3.5 h-3.5" /></Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400 text-center py-6">ยังไม่มีคำขอ</p>}
                  </CardContent>
                </Card>
              )}

              {/* Section: ผลการศึกษา */}
              {detailSection === 'academic' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-600" />ผลการศึกษา / GPAX</CardTitle>
                      <Button size="sm" onClick={() => setAcademicDialogOpen(true)}><Plus className="w-4 h-4 mr-1" />เพิ่มรายงาน</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center"><Label className="text-[10px] text-blue-500">GPAX ล่าสุด</Label><p className="text-2xl font-bold text-blue-700">{selectedScholar.gpa}</p></div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center"><Label className="text-[10px] text-green-500">กำหนดส่งรายงาน</Label><p className="text-sm font-semibold text-green-700 mt-1">{selectedScholar.nextReport}</p></div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center"><Label className="text-[10px] text-purple-500">สถานศึกษา</Label><p className="text-sm font-semibold text-purple-700 mt-1">{selectedScholar.university}</p></div>
                    </div>
                    {scholarReports.length > 0 ? (
                      <div className="overflow-x-auto"><Table>
                        <TableHeader><TableRow><TableHead>ภาคเรียน</TableHead><TableHead>GPA</TableHead><TableHead>CGPA</TableHead><TableHead>วันที่ส่ง</TableHead><TableHead>สถานะ</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
                        <TableBody>
                          {scholarReports.map(r => { const st = reportStatusConfig[r.status]; return (
                            <TableRow key={r.id} className="group"><TableCell className="text-xs">{r.semester}</TableCell><TableCell className={cn("text-xs font-semibold", parseFloat(r.gpa) < 2.5 && "text-red-600")}>{r.gpa}</TableCell><TableCell className="text-xs font-semibold">{r.cumGpa}</TableCell><TableCell className="text-[10px] text-gray-500">{r.submittedDate}</TableCell><TableCell><Badge className={`text-[9px] ${st.bg} ${st.color} border`}>{st.label}</Badge></TableCell>
                            <TableCell>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => toast.info(`ดูรายงาน ${r.id}`)}><Eye className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => { setEditingAcademic(r); setAcademicDialogOpen(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                              </div>
                            </TableCell>
                            </TableRow>
                          ); })}
                        </TableBody>
                      </Table></div>
                    ) : <p className="text-xs text-gray-400 text-center py-6">ยังไม่มีรายงานผลการศึกษา</p>}
                  </CardContent>
                </Card>
              )}

              {/* Section: การเฝ้าระวัง */}
              {detailSection === 'watchlist' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2"><Flag className="w-5 h-5 text-red-600" />การเฝ้าระวัง</CardTitle>
                      <Button size="sm" onClick={() => setWatchListDialogOpen(true)}><Plus className="w-4 h-4 mr-1" />เพิ่มรายการเฝ้าระวัง</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {scholarWatchItems.length > 0 ? (
                      <div className="space-y-3">
                        {scholarWatchItems.map(item => { const cat = watchListCategories.find(c => c.id === item.category); const CatIcon = cat?.icon || Flag; return (
                          <Card key={item.id} className={cn("border-l-4 group", item.severity === 'high' ? 'border-l-orange-500' : item.severity === 'medium' ? 'border-l-yellow-400' : 'border-l-blue-400')}>
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-start gap-3"><div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", severityBg[item.severity])}><CatIcon className="w-4 h-4 text-white" /></div>
                              <div><p className="text-xs font-medium">{item.description}</p><p className="text-[10px] text-gray-400 mt-1">ประเภท: {cat?.label} • ความรุนแรง: {severityLabel[item.severity]} • {item.reportedDate}</p></div></div>
                            </CardContent>
                          </Card>
                        ); })}
                      </div>
                    ) : <div className="text-center py-8"><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-xs text-gray-400">ไม่มีรายการเฝ้าระวัง</p></div>}
                  </CardContent>
                </Card>
              )}

              {/* Section: กลุ่มพิเศษ */}
              {detailSection === 'special' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div><CardTitle className="text-base flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-600" />กลุ่มพิเศษ</CardTitle><CardDescription className="text-xs">ข้าราชการลาศึกษา / นักเรียนทุนฝาก</CardDescription></div>
                      <Button size="sm" variant="outline" onClick={() => toast.info('แก้ไขข้อมูลกลุ่มพิเศษ')}><Edit className="w-4 h-4 mr-1 text-amber-600" />อัปเดตสถานะ</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <Label className="text-[10px] text-indigo-500">ประเภทกลุ่มพิเศษ</Label>
                        <p className="text-sm font-semibold text-indigo-700 mt-1">ข้าราชการลาศึกษา</p>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <Label className="text-[10px] text-indigo-500">ต้นสังกัด</Label>
                        <p className="text-sm font-semibold text-indigo-700 mt-1">กระทรวงสาธารณสุข</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border mt-4">
                      <Label className="text-[10px] text-gray-500">หมายเหตุเพิ่มเติม</Label>
                      <p className="text-sm mt-1">ส่งแบบฟอร์มแจ้งเพื่อทราบเรียบร้อยแล้วเมื่อ 15/05/2568</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Section: การเปลี่ยนระยะ */}
              {detailSection === 'transition' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div><CardTitle className="text-base flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-indigo-600" />การเปลี่ยนระยะ (Transition)</CardTitle><CardDescription className="text-xs">ย้ายข้อมูลไป ระยะที่ 3 หรือย้อนกลับ ระยะที่ 1</CardDescription></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                   <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                       <GraduationCap className="w-5 h-5 text-purple-600" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-purple-900">ย้ายข้อมูลไประยะที่ 3 (หลังจบการศึกษา)</h4>
                       <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                         เมื่อนักเรียนทุนรายงานผลการศึกษาเทอมสุดท้าย และส่งเอกสารสำเร็จการศึกษาครบถ้วนแล้ว คุณสามารถย้ายข้อมูลไประยะที่ 3
                         เพื่อเข้าสู่กระบวนการรายงานตัวกลับเข้ารับราชการและคำนวณการชดใช้ทุน
                       </p>
                       <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-sm" onClick={() => setTransitionToNextOpen(true)}>
                         จบการศึกษา (ย้ายไประยะที่ 3)
                       </Button>
                     </div>
                   </div>

                   <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 opacity-80 hover:opacity-100 transition-opacity">
                     <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                       <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-amber-900">ย้ายข้อมูลกลับไประยะที่ 1 (ก่อนเดินทาง)</h4>
                       <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                         หากพบข้อผิดพลาดหรือนักเรียนทุนมีการยกเลิกการเดินทาง คุณสามารถย้ายข้อมูลกลับไประยะที่ 1 ได้
                       </p>
                       <Button variant="outline" className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-100" onClick={() => setTransitionToPrevOpen(true)}>
                         ย้ายกลับระยะที่ 1
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
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle className="w-4 h-4 text-indigo-600" />
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-800">เริ่มระยะที่ 2 (ระหว่างศึกษา)</p>
                           <p className="text-xs text-gray-500 mt-0.5">ดำเนินการเมื่อ: 10/05/2569 14:00 น. โดย สมศรี ใจดี (จนท. ก.พ.)</p>
                         </div>
                       </div>
                     </div>
                   </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      ) : (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="scholars"><User className="w-3.5 h-3.5 mr-1" />รายชื่อผู้รับทุน</TabsTrigger>
          <TabsTrigger value="requests"><Send className="w-3.5 h-3.5 mr-1" />คำขอ e-Form</TabsTrigger>
          <TabsTrigger value="watchlist"><Flag className="w-3.5 h-3.5 mr-1" />เฝ้าระวัง<Badge className="ml-1 bg-red-500 text-white text-[8px] px-1.5">{watchListItems.filter(w => w.status === 'active').length}</Badge></TabsTrigger>
          <TabsTrigger value="reports"><ClipboardList className="w-3.5 h-3.5 mr-1" />รายงานผลการศึกษา</TabsTrigger>
          <TabsTrigger value="arrival"><MapPin className="w-3.5 h-3.5 mr-1" />รายงานจาก สนร.</TabsTrigger>
        </TabsList>
        <TabsContent value="scholars" className="space-y-4">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-1">
            <div className="flex gap-2 w-full xl:w-auto flex-wrap">
              <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="ค้นหาชื่อ/รหัส..." className="w-full xl:w-56 pl-9 bg-white border-gray-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <FilterCombobox
                className="w-full sm:w-[180px] bg-white border-gray-200"
                placeholder="ระดับศึกษา"
                value={filterDegree}
                onChange={setFilterDegree}
                options={[
                  { value: "ba", label: "ปริญญาตรี" },
                  { value: "ma", label: "ปริญญาโท" },
                  { value: "phd", label: "ปริญญาเอก" }
                ]}
              />
              <FilterCombobox
                className="w-full sm:w-[180px] bg-white border-gray-200"
                placeholder="ประเทศ"
                value={filterCountry}
                onChange={setFilterCountry}
                options={[
                  { value: "us", label: "สหรัฐอเมริกา" },
                  { value: "uk", label: "สหราชอาณาจักร" },
                  { value: "jp", label: "ญี่ปุ่น" }
                ]}
              />
              <FilterCombobox
                className="w-full sm:w-[180px] bg-white border-gray-200"
                placeholder="สถานะ"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "normal", label: "ปกติ" },
                  { value: "warning", label: "ต้องเฝ้าระวัง" },
                  { value: "special", label: "กลุ่มพิเศษ" }
                ]}
              />
            </div>
          </div>
          <Card className="overflow-hidden border-0 shadow-lg shadow-green-900/5">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-white"><User className="w-5 h-5" />รายชื่อผู้รับทุน (ระหว่างศึกษา)</CardTitle>
                  <CardDescription className="text-xs text-green-100">แสดงรายชื่อนักเรียนทุนที่อยู่ระหว่างการศึกษาในปัจจุบัน • {filteredDuringStudyScholars.length}/{duringStudyScholars.length} ราย</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto"><Table>
                <TableHeader className="bg-gradient-to-r from-slate-50 to-green-50/30 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-slate-700 py-3.5">รหัส / ชื่อ-สกุล</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5">ระดับการศึกษา / สถานศึกษา</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5">ประเทศ</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5">เกรดเฉลี่ยล่าสุด</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5">กำหนดส่งรายงาน</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5">สถานะ</TableHead>
                    <TableHead className="font-bold text-slate-700 py-3.5 text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDuringStudyScholars.map((s, idx) => (
                    <TableRow key={s.id} className={cn(
                      "group transition-all duration-200 cursor-pointer border-b border-gray-100",
                      idx % 2 === 0 ? "bg-white hover:bg-green-50/60" : "bg-slate-50/40 hover:bg-green-50/60"
                    )} onClick={() => { setSelectedScholar(s); toast.info(`ดูรายละเอียด: ${s.name}`); }}>
                      <TableCell className="py-3.5">
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{s.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-gray-800">{s.degree}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Building className="w-3 h-3" />{s.university}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CountryFlag countryName={s.country} />
                          <span className="text-xs text-gray-700">{s.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-sm font-bold px-2 py-0.5 rounded-md",
                          parseFloat(s.gpa) >= 3.5 ? "text-emerald-700 bg-emerald-50" :
                          parseFloat(s.gpa) >= 2.5 ? "text-blue-700 bg-blue-50" :
                          "text-red-700 bg-red-50"
                        )}>{s.gpa}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">{s.nextReport}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-medium border shadow-sm",
                          s.status === 'ปกติ' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          s.status === 'ต้องเฝ้าระวัง' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        )}>
                          {s.status === 'ปกติ' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {s.status === 'ต้องเฝ้าระวัง' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {s.status === 'เฝ้าระวัง' && <Eye className="w-3 h-3 mr-1" />}
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedScholar(s); toast.info(`เปิดหน้ารายละเอียด ${s.name}`); }} title="ดูข้อมูล">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg" onClick={(e) => { e.stopPropagation(); toast.info(`แก้ไขข้อมูล ${s.name}`); }} title="แก้ไข">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 1: Arrival & Monitoring ===== */}
        <TabsContent value="arrival" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" />การรายงานตัวเมื่อเดินทางถึง (ต่างประเทศ)</CardTitle>
              <CardDescription className="text-xs">นทร. จัดส่งเอกสารรายงานตัวถึง สนร. หรือ สอท. เมื่อเดินทางถึงประเทศที่ศึกษา</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">วันที่เดินทางถึง</Label><div className="relative"><Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><Input type="text" placeholder="DD/MM/YYYY" className="pl-9" /></div></div>
                <div className="space-y-1.5"><Label className="text-xs">สนร./สอท. ที่รายงานตัว</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="washington">สนร. วอชิงตัน</SelectItem><SelectItem value="london">สนร. ลอนดอน</SelectItem><SelectItem value="tokyo">สนร. โตเกียว</SelectItem><SelectItem value="canberra">สนร. แคนเบอร์รา</SelectItem><SelectItem value="paris">สนร. ปารีส</SelectItem><SelectItem value="beijing">สนร. ปักกิ่ง</SelectItem><SelectItem value="embassy">สอท.</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">สถานะการรายงานตัว</Label><Select><SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="reported">รายงานตัวแล้ว</SelectItem><SelectItem value="pending">รอรายงานตัว</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">ที่อยู่ปัจจุบัน (ต่างประเทศ)</Label><Textarea placeholder="ที่อยู่" className="min-h-[50px]" /></div>
              <FileUploadArea label="อัปโหลดเอกสารรายงานตัว" accept=".pdf,.jpg,.png" />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => toast.info('ยกเลิก')}>ยกเลิก</Button>
                <Button size="sm" onClick={() => toast.success('บันทึกข้อมูลการรายงานตัวเรียบร้อย')}><Save className="w-4 h-4 mr-1" />บันทึกข้อมูล</Button>
              </div>
            </CardContent>
          </Card>

          {/* สนร. Tracking */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2"><Eye className="w-5 h-5 text-green-600" />การติดตามการศึกษาและความเป็นอยู่ (โดย สนร.)</CardTitle>
                  <CardDescription className="text-xs">สนร. ติดตามการศึกษาและความเป็นอยู่ของ นทร. แล้วส่งรายงานแจ้ง ศกศ.</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingSnrReport(null); setSnrReportDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" />เพิ่มรายงาน</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'snr-1', date: '25/02/2569', reporter: 'สนร. วอชิงตัน', type: 'รายงานประจำเดือน', summary: 'นทร. 12 ราย สถานะปกติ GPA เฉลี่ยรวม 3.45' },
                  { id: 'snr-2', date: '15/02/2569', reporter: 'สนร. ลอนดอน', type: 'รายงานกรณีพิเศษ', summary: 'นทร. 1 ราย มีปัญหาด้านการเงิน — อยู่ระหว่างดำเนินการ' },
                  { id: 'snr-3', date: '01/02/2569', reporter: 'สนร. โตเกียว', type: 'รายงานประจำเดือน', summary: 'นทร. 8 ราย สถานะปกติ ไม่มีปัญหา' },
                ].map((report, i) => (
                  <div key={report.id} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium">{report.type} — {report.reporter}</p>
                        <p className="text-[10px] text-gray-500">{report.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{report.date}</span>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingSnrReport(report); setSnrReportDialogOpen(true); }}><Edit className="w-3.5 h-3.5 text-amber-600" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <FileUploadArea label="อัปโหลดรายงาน สนร./สอท." accept=".pdf,.jpg,.png" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 2: Academic Reports ===== */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-600" />รายงานผลการศึกษา</CardTitle>
                  <CardDescription className="text-xs">นทร. รายงานผลการศึกษาแต่ละภาคเรียน ผ่าน สนร./สอท./สำนักงาน ก.พ.</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingAcademic(null); setAcademicDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" />บันทึกผล</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto"><Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>นักเรียนทุน</TableHead>
                    <TableHead>ภาคเรียน</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>วันที่ส่ง</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academicReports.map(r => {
                    const st = reportStatusConfig[r.status];
                    return (
                      <TableRow key={r.id} className="hover:bg-blue-50/50">
                        <TableCell><p className="text-xs font-medium">{r.scholarName}</p><p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p></TableCell>
                        <TableCell className="text-xs">{r.semester}</TableCell>
                        <TableCell className={`text-xs font-semibold ${parseFloat(r.gpa) < 2.5 ? 'text-red-600' : ''}`}>{r.gpa}</TableCell>
                        <TableCell className="text-xs font-semibold">{r.cumGpa}</TableCell>
                        <TableCell className="text-[10px] text-gray-500">{r.submittedDate}</TableCell>
                        <TableCell><Badge className={`text-[9px] ${st.bg} ${st.color} border`}>{st.label}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setEditingAcademic(r); setAcademicDialogOpen(true); }}><Edit className="w-4 h-4 text-amber-600" /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>
            </CardContent>
          </Card>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-start gap-2">
            <Bell className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p>ระบบจะแจ้งเตือนเมื่อถึงกำหนดส่งรายงานผลการศึกษา และตรวจสอบ/พิจารณาอนุมัติผลโดยอัตโนมัติ</p>
          </div>
        </TabsContent>

        {/* ===== Tab 3: Requests ===== */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Send className="w-5 h-5 text-purple-600" />คำขออนุมัติ/อนุญาตต่างๆ</CardTitle>
              <CardDescription className="text-xs">นทร. ยื่นคำขอผ่าน สนร./สอท./สำนักงาน ก.พ. ระบบตรวจสอบ พิจารณา และแจ้งผล</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {requestTypes.map((rt, i) => {
                  const Icon = rt.icon;
                  return (
                    <motion.div key={rt.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                      <div
                        className="p-3 border rounded-xl hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                        onClick={() => { setSelectedRequestType(rt); setRequestDialogOpen(true); }}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100 flex items-center justify-center transition-colors">
                            <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{rt.label}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{rt.description}</p>
                            <Badge variant="outline" className="text-[8px] mt-1">{rt.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 flex items-start gap-2">
            <Bell className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <p>ระบบแจ้งเตือนการดำเนินการในเรื่องที่เกี่ยวข้องโดยอัตโนมัติ: การขอขยายระยะเวลา, การพักการศึกษา, การย้ายสถานศึกษา ฯลฯ — ทุกหัวข้อสามารถ Upload file ได้ (.pdf .jpg)</p>
          </div>
        </TabsContent>

        {/* ===== Tab 4: Watch List ===== */}
        <TabsContent value="watchlist" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2"><Flag className="w-5 h-5 text-red-600" />กรณีเฝ้าระวัง (Watch List)</CardTitle>
                  <CardDescription className="text-xs">กรณี นทร. ประสบปัญหาต่างๆ ที่ สนร. รายงาน — แบ่งตามประเภทปัญหา</CardDescription>
                </div>
                <Button size="sm" onClick={() => { setEditingWatchList(null); setWatchListDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" />เพิ่มรายการ</Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge variant="outline" className="text-[9px] cursor-pointer hover:bg-blue-50">ทั้งหมด ({watchListItems.length})</Badge>
                {watchListCategories.map(cat => {
                  const CatIcon = cat.icon;
                  const count = watchListItems.filter(w => w.category === cat.id).length;
                  return (
                    <Badge key={cat.id} variant="outline" className="text-[9px] cursor-pointer hover:bg-blue-50">
                      <CatIcon className={`w-3 h-3 mr-0.5 ${cat.color}`} />{cat.label} ({count})
                    </Badge>
                  );
                })}
              </div>

              <div className="space-y-3">
                {watchListItems.map((item, i) => {
                  const cat = watchListCategories.find(c => c.id === item.category);
                  const CatIcon = cat?.icon || Flag;
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className={`border-l-4 ${item.severity === 'critical' ? 'border-l-red-500' : item.severity === 'high' ? 'border-l-orange-500' : item.severity === 'medium' ? 'border-l-yellow-400' : 'border-l-blue-400'} hover:shadow-md transition-all`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl ${severityBg[item.severity]} flex items-center justify-center`}>
                                <CatIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold">{item.scholarName}</p>
                                  <Badge variant="outline" className="text-[8px] font-mono">{item.scholarId}</Badge>
                                  <Badge variant="outline" className="text-[8px]">{item.country}</Badge>
                                </div>
                                <p className="text-xs text-gray-600">{item.description}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                                  <span>ประเภท: {cat?.label}</span>
                                  <span>ความรุนแรง: {severityLabel[item.severity]}</span>
                                  <span>รายงานโดย: {item.reportedBy}</span>
                                  <span>{item.reportedDate}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`text-[9px] ${item.status === 'active' ? 'bg-red-100 text-red-700' : item.status === 'monitoring' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} border`}>
                              {item.status === 'active' ? 'กำลังดำเนินการ' : item.status === 'monitoring' ? 'เฝ้าระวัง' : 'แก้ไขแล้ว'}
                            </Badge>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button size="sm" variant="outline" onClick={() => { setEditingWatchList(item); setWatchListDialogOpen(true); }}><Edit className="w-3.5 h-3.5 mr-1 text-amber-600" />อัปเดตสถานะ</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        {selectedRequestType && (
          <DialogContent className="sm:max-w-xl p-0 gap-0  max-h-[85vh] overflow-y-auto ">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
              <DialogTitle className="text-white text-lg flex items-center gap-2">
                <selectedRequestType.icon className="w-5 h-5" />
                {selectedRequestType.label}
              </DialogTitle>
              <DialogDescription className="text-purple-100 mt-1">{selectedRequestType.description} — ยื่นผ่าน สนร./สอท./สำนักงาน ก.พ.</DialogDescription>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">นักเรียนทุน</Label>
                  {selectedScholar ? (
                    <div className="p-2.5 bg-gray-50 border rounded-md text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {selectedScholar.id} • {selectedScholar.name}
                    </div>
                  ) : (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกนักเรียนทุน" />
                      </SelectTrigger>
                      <SelectContent>
                        {duringStudyScholars.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.id} • {s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-1.5"><Label className="text-xs">หน่วยงานที่ยื่น</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="snr">สนร.</SelectItem><SelectItem value="sot">สอท.</SelectItem><SelectItem value="ocsc">สำนักงาน ก.พ.</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">เหตุผลประกอบคำขอ <span className="text-red-500">*</span></Label><Textarea placeholder="ระบุเหตุผล..." className="min-h-[80px]" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">วันที่ยื่นคำขอ</Label><div className="relative"><Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><Input type="text" placeholder="DD/MM/YYYY" className="pl-9" /></div></div>
                <div className="space-y-1.5"><Label className="text-xs">วันที่ต้องการ</Label><div className="relative"><Calendar className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><Input type="text" placeholder="DD/MM/YYYY" className="pl-9" /></div></div>
              </div>
              <FileUploadArea label="อัปโหลดเอกสารประกอบ" accept=".pdf,.jpg,.png" />
            </div>
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>ยกเลิก</Button>
              <Button onClick={() => { setRequestDialogOpen(false); toast.success(`ส่งคำขอ "${selectedRequestType.label}" เรียบร้อย`); }}><Send className="w-4 h-4 mr-1" />ส่งคำขอ</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* SNR Report Dialog */}
      <Dialog open={snrReportDialogOpen} onOpenChange={setSnrReportDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {editingSnrReport ? 'แก้ไขรายงาน สนร.' : 'เพิ่มรายงาน สนร.'}
            </DialogTitle>
            <DialogDescription className="text-green-100 mt-1">รายงานการติดตามความเป็นอยู่ของ นทร.</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">ประเภทรายงาน <span className="text-red-500">*</span></Label>
                <Select defaultValue={editingSnrReport?.type || 'รายงานประจำเดือน'}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="รายงานประจำเดือน">รายงานประจำเดือน</SelectItem>
                    <SelectItem value="รายงานกรณีพิเศษ">รายงานกรณีพิเศษ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">รายงานโดย สนร./สอท. <span className="text-red-500">*</span></Label>
                <Input defaultValue={editingSnrReport?.reporter || ''} placeholder="เช่น สนร. วอชิงตัน" />
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">วันที่รายงาน <span className="text-red-500">*</span></Label>
              <DatePicker defaultValue={editingSnrReport?.date ? "2026-02-25" : ""} />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">สรุปสาระสำคัญ <span className="text-red-500">*</span></Label>
              <Textarea placeholder="ระบุข้อความสรุปรายงาน..." className="min-h-[80px]" defaultValue={editingSnrReport?.summary || ''} />
            </div>
            <FileUploadArea label="แนบไฟล์รายงาน (PDF)" accept=".pdf" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSnrReportDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setSnrReportDialogOpen(false); toast.success('บันทึกข้อมูลรายงาน สนร. เรียบร้อย'); }}><Save className="w-4 h-4 mr-1" />บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Academic Report Dialog */}
      <Dialog open={academicDialogOpen} onOpenChange={setAcademicDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {editingAcademic ? 'แก้ไขผลการศึกษา' : 'บันทึกผลการศึกษา'}
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">รายงานผลการศึกษาประจำภาคเรียน</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">นักเรียนทุน</Label>
                {selectedScholar ? (
                  <div className="p-2.5 bg-gray-50 border rounded-md text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {selectedScholar.id} • {selectedScholar.name}
                  </div>
                ) : (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกนักเรียนทุน" />
                    </SelectTrigger>
                    <SelectContent>
                      {duringStudyScholars.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.id} • {s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">ภาคเรียน/ปีการศึกษา <span className="text-red-500">*</span></Label>
                <Input defaultValue={editingAcademic?.semester || ''} placeholder="เช่น Fall 2025" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">GPA ภาคเรียนนี้ <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.01" defaultValue={editingAcademic?.gpa || ''} placeholder="0.00" />
              </div>
              <div className="space-y-1.5"><Label className="text-xs">CGPA สะสม <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.01" defaultValue={editingAcademic?.cumGpa || ''} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">สถานะผลการเรียน <span className="text-red-500">*</span></Label>
                <Select defaultValue={editingAcademic?.status || 'normal'}>
                  <SelectTrigger><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">ปกติ (Approved)</SelectItem>
                    <SelectItem value="warning">แจ้งเตือน (Warning)</SelectItem>
                    <SelectItem value="probation">ตกต่ำ (Probation)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <FileUploadArea label="แนบ Transcript (.pdf)" accept=".pdf" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAcademicDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setAcademicDialogOpen(false); toast.success('บันทึกผลการศึกษาเรียบร้อย'); }}><Save className="w-4 h-4 mr-1" />บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watch List Dialog */}
      <Dialog open={watchListDialogOpen} onOpenChange={setWatchListDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Flag className="w-5 h-5" />
              {editingWatchList ? 'อัปเดตสถานะเฝ้าระวัง' : 'เพิ่มรายการเฝ้าระวัง'}
            </DialogTitle>
            <DialogDescription className="text-red-100 mt-1">บันทึกข้อมูลและปรับสถานะกรณีปัญหา นทร.</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">นักเรียนทุน</Label>
                {selectedScholar ? (
                  <div className="p-2.5 bg-gray-50 border rounded-md text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {selectedScholar.id} • {selectedScholar.name}
                  </div>
                ) : (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกนักเรียนทุน" />
                    </SelectTrigger>
                    <SelectContent>
                      {duringStudyScholars.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.id} • {s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-1.5"><Label className="text-xs">ประเภทปัญหา <span className="text-red-500">*</span></Label>
                <Select defaultValue={editingWatchList?.category || ''}>
                  <SelectTrigger><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                  <SelectContent>
                    {watchListCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">ความรุนแรง <span className="text-red-500">*</span></Label>
              <Select defaultValue={editingWatchList?.severity || 'medium'}>
                <SelectTrigger><SelectValue placeholder="เลือกระดับ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">วิกฤต (Critical)</SelectItem>
                  <SelectItem value="high">สูง (High)</SelectItem>
                  <SelectItem value="medium">กลาง (Medium)</SelectItem>
                  <SelectItem value="low">ต่ำ (Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">รายละเอียดเหตุการณ์ <span className="text-red-500">*</span></Label>
              <Textarea placeholder="ระบุรายละเอียดปัญหา..." className="min-h-[80px]" defaultValue={editingWatchList?.description || ''} />
            </div>
            <div className="space-y-1.5"><Label className="text-xs">สถานะการดำเนินการ <span className="text-red-500">*</span></Label>
              <Select defaultValue={editingWatchList?.status || 'active'}>
                <SelectTrigger><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">กำลังดำเนินการแก้ไข</SelectItem>
                  <SelectItem value="monitoring">อยู่ระหว่างติดตาม (เฝ้าระวังต่อ)</SelectItem>
                  <SelectItem value="resolved">แก้ไขปัญหาเรียบร้อยแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FileUploadArea label="แนบเอกสารที่เกี่ยวข้อง (.pdf, .jpg)" accept=".pdf,.jpg,.png" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setWatchListDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setWatchListDialogOpen(false); toast.success('บันทึกข้อมูล Watch List เรียบร้อย'); }} className="bg-red-600 hover:bg-red-700"><Save className="w-4 h-4 mr-1" />บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* e-Form Selection Dialog */}
      <Dialog open={eformSelectionDialogOpen} onOpenChange={setEformSelectionDialogOpen}>
        <DialogContent className="sm:max-w-3xl p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              เลือกประเภทคำขอ e-Form (ระยะระหว่างศึกษา)
            </DialogTitle>
            <DialogDescription className="text-purple-100 mt-1">กรุณาเลือกประเภทคำขอที่ต้องการยื่น เพื่อดำเนินการต่อไป</DialogDescription>
          </div>
          <div className="p-6 bg-slate-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requestTypes.filter(rt => ['extend', 'suspend', 'home-visit', 'thesis-outside', 'change-address', 'change-major'].includes(rt.id)).map((rt) => {
                const Icon = rt.icon;
                return (
                  <div key={rt.id} 
                    className="p-3 border rounded-xl bg-white hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex items-start gap-3"
                    onClick={() => {
                      setEformSelectionDialogOpen(false);
                      setSelectedRequestType(rt);
                      setRequestDialogOpen(true);
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{rt.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{rt.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="border-t bg-white px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEformSelectionDialogOpen(false)}>ยกเลิก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Arrival Report Edit Dialog */}
      <Dialog open={arrivalReportDialogOpen} onOpenChange={setArrivalReportDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              แก้ไขข้อมูลการรายงานตัว
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">อัปเดตข้อมูลการรายงานตัว ณ ประเทศที่ศึกษา</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">สนร./สอท. ที่รายงานตัว <span className="text-red-500">*</span></Label>
                <Select defaultValue={selectedScholar?.snr || ''}>
                  <SelectTrigger><SelectValue placeholder="เลือก สนร./สอท." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="สนร. วอชิงตัน">สนร. วอชิงตัน</SelectItem>
                    <SelectItem value="สนร. ลอนดอน">สนร. ลอนดอน</SelectItem>
                    <SelectItem value="สนร. โตเกียว">สนร. โตเกียว</SelectItem>
                    <SelectItem value="สอท. ปารีส">สอท. ปารีส</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่รายงานตัว <span className="text-red-500">*</span></Label>
                <DatePicker defaultValue={selectedScholar?.reportedDate ? "2025-08-20" : ""} />
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">สถานะการรายงานตัว <span className="text-red-500">*</span></Label>
              <Select defaultValue="reported">
                <SelectTrigger><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">รายงานตัวเรียบร้อยแล้ว</SelectItem>
                  <SelectItem value="pending">รอการตรวจสอบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">ที่อยู่ปัจจุบัน (ต่างประเทศ) <span className="text-red-500">*</span></Label>
              <Textarea placeholder="ระบุที่อยู่..." className="min-h-[80px]" defaultValue={selectedScholar?.address || ''} />
            </div>
            <FileUploadArea label="แนบเอกสารรายงานตัวใหม่ (ถ้ามี)" accept=".pdf,.jpg,.png" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setArrivalReportDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setArrivalReportDialogOpen(false); toast.success('บันทึกข้อมูลรายงานตัวเรียบร้อย'); }}><Save className="w-4 h-4 mr-1" />บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Transition to Prev Dialog */}
      <Dialog open={transitionToPrevOpen} onOpenChange={setTransitionToPrevOpen}>
        <DialogContent className="sm:max-w-md p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              ยืนยันการย้ายกลับระยะที่ 1
            </DialogTitle>
            <DialogDescription className="text-amber-100 mt-1">
              ยืนยันการย้ายข้อมูล {selectedScholar?.name} กลับไประยะก่อนเดินทาง
            </DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <p>เมื่อยืนยันการย้ายระยะแล้ว ข้อมูลของนักเรียนทุนรายนี้จะ:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ถูกนำออกจากหน้ารายการ <strong>"ระยะที่ 2 (ระหว่างศึกษา)"</strong></li>
              <li>กลับไปปรากฏในหน้ารายการ <strong>"ระยะที่ 1 (ก่อนเดินทาง)"</strong></li>
            </ul>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTransitionToPrevOpen(false)}>ยกเลิก</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
              setTransitionToPrevOpen(false);
              setSelectedScholar(null);
              toast.success(`ย้ายข้อมูล ${selectedScholar?.name} กลับระยะที่ 1 เรียบร้อยแล้ว`, {
                description: 'ดำเนินการโดย สมศรี ใจดี (10/05/2569 14:15 น.)'
              });
            }}>
              ยืนยันการย้ายกลับ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transition to Next Dialog */}
      <Dialog open={transitionToNextOpen} onOpenChange={setTransitionToNextOpen}>
        <DialogContent className="sm:max-w-md p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              ยืนยันการจบการศึกษา (ย้ายไประยะที่ 3)
            </DialogTitle>
            <DialogDescription className="text-purple-100 mt-1">
              ยืนยันการย้ายข้อมูล {selectedScholar?.name} ไประยะหลังศึกษา
            </DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <p>เมื่อยืนยันการจบการศึกษา ข้อมูลของนักเรียนทุนรายนี้จะ:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ถูกนำออกจากหน้ารายการ <strong>"ระยะที่ 2 (ระหว่างศึกษา)"</strong></li>
              <li>ไปปรากฏในหน้ารายการ <strong>"ระยะที่ 3 (หลังจบการศึกษา)"</strong> เพื่อรอดำเนินการรายงานตัวเข้าปฏิบัติราชการ</li>
            </ul>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTransitionToNextOpen(false)}>ยกเลิก</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => {
              setTransitionToNextOpen(false);
              setSelectedScholar(null);
              toast.success(`บันทึกจบการศึกษา ${selectedScholar?.name} ไประยะที่ 3 เรียบร้อยแล้ว`, {
                description: 'ดำเนินการโดย สมศรี ใจดี (10/05/2569 14:15 น.)'
              });
            }}>
              ยืนยันจบการศึกษา
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FileUploadArea({ label, accept }: { label: string; accept: string }) {
  return (
    <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toast.info(`อัปโหลด: ${label}`)}>
      <div className="flex items-center gap-2 text-xs text-gray-500"><Upload className="w-4 h-4 text-gray-400" /><span>{label}</span><Badge variant="outline" className="text-[8px] ml-auto">{accept}</Badge></div>
    </div>
  );
}
