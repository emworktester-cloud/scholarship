import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload, FileText, User, Eye, CheckCircle, Clock, AlertTriangle,
  ChevronRight, Search, Plus, Send, Bell, Flag, MapPin,
  GraduationCap, BookOpen, Calendar, Globe, Building,
  Plane, ArrowRightLeft, Pause, XCircle, FileCheck,
  MessageSquare, Shield, Activity, HeartPulse, Wallet,
  Timer, FolderOpen, Brain, Laptop, ClipboardList,
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
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
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
  { id: 'WL-001', scholarId: 'SCH-008', scholarName: 'นายธนกฤต ประสบผล', country: 'สหรัฐอเมริกา', category: 'academic', severity: 'high', description: 'GPA ต่ำกว่าเกณฑ์ 2 ภาคการศึกษาติดต่อกัน ต้องปรับปรุง', reportedBy: 'สนร. วอชิงตัน', reportedDate: '20 ก.พ. 2569', status: 'active' },
  { id: 'WL-002', scholarId: 'SCH-012', scholarName: 'น.ส.ปิยะดา เก่งกล้า', country: 'ญี่ปุ่น', category: 'health-mental', severity: 'medium', description: 'มีอาการเครียดสะสมจากการเรียน ได้รับคำปรึกษาจากนักจิตวิทยา', reportedBy: 'สนร. โตเกียว', reportedDate: '18 ก.พ. 2569', status: 'monitoring' },
  { id: 'WL-003', scholarId: 'SCH-025', scholarName: 'นายภาคิน แข็งแรง', country: 'สหราชอาณาจักร', category: 'finance', severity: 'low', description: 'เบิกค่าครองชีพเกินสิทธิ 2 เดือน — อยู่ระหว่างหักคืน', reportedBy: 'สนร. ลอนดอน', reportedDate: '15 ก.พ. 2569', status: 'monitoring' },
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
  { id: 'AR-001', scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-001', semester: 'Fall 2568', gpa: '3.85', cumGpa: '3.80', status: 'approved', submittedDate: '10 ก.พ. 2569' },
  { id: 'AR-002', scholarName: 'นายวิชัย สมบูรณ์', scholarId: 'SCH-002', semester: 'Fall 2568', gpa: '3.42', cumGpa: '3.55', status: 'reviewed', submittedDate: '12 ก.พ. 2569' },
  { id: 'AR-003', scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-008', semester: 'Fall 2568', gpa: '2.15', cumGpa: '2.65', status: 'flagged', submittedDate: '15 ก.พ. 2569' },
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

export default function DuringStudy() {
  const [activeTab, setActiveTab] = useState('scholars');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);
  const [selectedScholar, setSelectedScholar] = useState<any>(null);

  // Mock data for scholars in during-study phase
  const duringStudyScholars = [
    { id: 'SCH-001', name: 'น.ส.พรพิมล สุขใจ', degree: 'M.Sc. Data Science', university: 'MIT', country: 'สหรัฐอเมริกา', gpa: '3.85', status: 'ปกติ', nextReport: '15 พ.ค. 2569' },
    { id: 'SCH-008', name: 'นายธนกฤต ประสบผล', degree: 'Ph.D. Economics', university: 'Harvard University', country: 'สหรัฐอเมริกา', gpa: '2.15', status: 'ต้องเฝ้าระวัง', nextReport: '15 พ.ค. 2569' },
    { id: 'SCH-012', name: 'น.ส.ปิยะดา เก่งกล้า', degree: 'M.A. Design', university: 'University of Tokyo', country: 'ญี่ปุ่น', gpa: '3.42', status: 'เฝ้าระวัง', nextReport: '30 เม.ย. 2569' },
    { id: 'SCH-025', name: 'นายภาคิน แข็งแรง', degree: 'B.Eng. Mechanical', university: 'Imperial College', country: 'สหราชอาณาจักร', gpa: '3.20', status: 'ปกติ', nextReport: '30 พ.ค. 2569' },
  ];

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="scholars"><User className="w-3.5 h-3.5 mr-1" />รายชื่อผู้รับทุน</TabsTrigger>
          <TabsTrigger value="arrival"><MapPin className="w-3.5 h-3.5 mr-1" />รายงานตัว/ติดตาม</TabsTrigger>
          <TabsTrigger value="reports"><ClipboardList className="w-3.5 h-3.5 mr-1" />รายงานผลการศึกษา</TabsTrigger>
          <TabsTrigger value="requests"><Send className="w-3.5 h-3.5 mr-1" />คำขออนุมัติ/อนุญาต</TabsTrigger>
          <TabsTrigger value="watchlist"><Flag className="w-3.5 h-3.5 mr-1" />Watch List<Badge className="ml-1 bg-red-500 text-white text-[8px] px-1.5">{watchListItems.filter(w => w.status === 'active').length}</Badge></TabsTrigger>
        </TabsList>

        {/* ===== Tab 0: Scholars List ===== */}
        <TabsContent value="scholars" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2"><User className="w-5 h-5 text-blue-600" />รายชื่อผู้รับทุน (ระหว่างศึกษา)</CardTitle>
                  <CardDescription>แสดงรายชื่อนักเรียนทุนที่อยู่ระหว่างการศึกษาในปัจจุบัน</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="ค้นหาชื่อ/รหัส..." className="w-56 pl-9 bg-white" />
                  </div>
                  <Select><SelectTrigger className="w-32 bg-white"><SelectValue placeholder="ระดับศึกษา" /></SelectTrigger><SelectContent><SelectItem value="ba">ปริญญาตรี</SelectItem><SelectItem value="ma">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select>
                  <Select><SelectTrigger className="w-32 bg-white"><SelectValue placeholder="ประเทศ" /></SelectTrigger><SelectContent><SelectItem value="us">สหรัฐอเมริกา</SelectItem><SelectItem value="uk">สหราชอาณาจักร</SelectItem><SelectItem value="jp">ญี่ปุ่น</SelectItem></SelectContent></Select>
                  <Select><SelectTrigger className="w-32 bg-white"><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="normal">ปกติ</SelectItem><SelectItem value="watch">เฝ้าระวัง</SelectItem><SelectItem value="critical">ต้องเฝ้าระวัง</SelectItem></SelectContent></Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 py-3 rounded-tl-lg">รหัสนักเรียนทุน / ชื่อ-สกุล</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3">ระดับการศึกษา / สถานศึกษา</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3">ประเทศ</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3">เกรดเฉลี่ยล่าสุด</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3">กำหนดส่งรายงาน</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3">สถานะ</TableHead>
                    <TableHead className="font-semibold text-slate-700 py-3 text-right rounded-tr-lg">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duringStudyScholars.map(s => (
                    <TableRow key={s.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => { setSelectedScholar(s); toast.info(`ดูรายละเอียด: ${s.name}`); }}>
                      <TableCell>
                        <p className="text-sm font-semibold text-blue-900">{s.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{s.id}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-gray-700">{s.degree}</p>
                        <p className="text-[10px] text-gray-500">{s.university}</p>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">{s.country}</TableCell>
                      <TableCell className={`text-xs font-semibold ${parseFloat(s.gpa) < 2.5 ? 'text-red-600' : 'text-green-600'}`}>{s.gpa}</TableCell>
                      <TableCell className="text-xs text-gray-500">{s.nextReport}</TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] ${s.status === 'ปกติ' ? 'bg-green-100 text-green-700 border-green-200' : s.status === 'ต้องเฝ้าระวัง' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'} border`}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-xs" onClick={(e) => { e.stopPropagation(); setSelectedScholar(s); toast.info(`เปิดหน้ารายละเอียด ${s.name}`); }}>
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          ดูข้อมูล
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Tab 1: Arrival & Monitoring ===== */}
        <TabsContent value="arrival" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" />การรายงานตัวเมื่อเดินทางถึง (ต่างประเทศ)</CardTitle>
              <CardDescription>นทร. จัดส่งเอกสารรายงานตัวถึง สนร. หรือ สอท. เมื่อเดินทางถึงประเทศที่ศึกษา</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">วันที่เดินทางถึง</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label className="text-xs">สนร./สอท. ที่รายงานตัว</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="washington">สนร. วอชิงตัน</SelectItem><SelectItem value="london">สนร. ลอนดอน</SelectItem><SelectItem value="tokyo">สนร. โตเกียว</SelectItem><SelectItem value="canberra">สนร. แคนเบอร์รา</SelectItem><SelectItem value="paris">สนร. ปารีส</SelectItem><SelectItem value="beijing">สนร. ปักกิ่ง</SelectItem><SelectItem value="embassy">สอท.</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">สถานะการรายงานตัว</Label><Select><SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="reported">รายงานตัวแล้ว</SelectItem><SelectItem value="pending">รอรายงานตัว</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">ที่อยู่ปัจจุบัน (ต่างประเทศ)</Label><Textarea placeholder="ที่อยู่" className="min-h-[50px]" /></div>
              <FileUploadArea label="อัปโหลดเอกสารรายงานตัว" accept=".pdf,.jpg,.png" />
            </CardContent>
          </Card>

          {/* สนร. Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Eye className="w-5 h-5 text-green-600" />การติดตามการศึกษาและความเป็นอยู่ (โดย สนร.)</CardTitle>
              <CardDescription>สนร. ติดตามการศึกษาและความเป็นอยู่ของ นทร. แล้วส่งรายงานแจ้ง ศกศ.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: '25 ก.พ. 2569', reporter: 'สนร. วอชิงตัน', type: 'รายงานประจำเดือน', summary: 'นทร. 12 ราย สถานะปกติ GPA เฉลี่ยรวม 3.45' },
                  { date: '15 ก.พ. 2569', reporter: 'สนร. ลอนดอน', type: 'รายงานกรณีพิเศษ', summary: 'นทร. 1 ราย มีปัญหาด้านการเงิน — อยู่ระหว่างดำเนินการ' },
                  { date: '1 ก.พ. 2569', reporter: 'สนร. โตเกียว', type: 'รายงานประจำเดือน', summary: 'นทร. 8 ราย สถานะปกติ ไม่มีปัญหา' },
                ].map((report, i) => (
                  <div key={i} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium">{report.type} — {report.reporter}</p>
                        <p className="text-[10px] text-gray-500">{report.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{report.date}</span>
                      <Button size="sm" variant="ghost"><Eye className="w-3.5 h-3.5" /></Button>
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
                  <CardDescription>นทร. รายงานผลการศึกษาแต่ละภาคเรียน ผ่าน สนร./สอท./สำนักงาน ก.พ.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('สร้างรายงานผลการศึกษาใหม่')}><Plus className="w-4 h-4 mr-1" />บันทึกผล</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
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
                        <TableCell><Button size="sm" variant="ghost"><Eye className="w-3.5 h-3.5" /></Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
              <CardDescription>นทร. ยื่นคำขอผ่าน สนร./สอท./สำนักงาน ก.พ. ระบบตรวจสอบ พิจารณา และแจ้งผล</CardDescription>
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
                  <CardDescription>กรณี นทร. ประสบปัญหาต่างๆ ที่ สนร. รายงาน — แบ่งตามประเภทปัญหา</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info('เพิ่มรายการ Watch List')}><Plus className="w-4 h-4 mr-1" />เพิ่มรายการ</Button>
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
                            <Button size="sm" variant="outline" onClick={() => toast.info(`ดูรายละเอียด ${item.scholarName}`)}><Eye className="w-3.5 h-3.5 mr-1" />ดูรายละเอียด</Button>
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

      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        {selectedRequestType && (
          <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
              <DialogTitle className="text-white text-lg flex items-center gap-2">
                <selectedRequestType.icon className="w-5 h-5" />
                {selectedRequestType.label}
              </DialogTitle>
              <DialogDescription className="text-purple-100 mt-1">{selectedRequestType.description} — ยื่นผ่าน สนร./สอท./สำนักงาน ก.พ.</DialogDescription>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">นักเรียนทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="sch001">SCH-001 น.ส.พรพิมล สุขใจ</SelectItem><SelectItem value="sch002">SCH-002 นายวิชัย สมบูรณ์</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">หน่วยงานที่ยื่น</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="snr">สนร.</SelectItem><SelectItem value="sot">สอท.</SelectItem><SelectItem value="ocsc">สำนักงาน ก.พ.</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">เหตุผลประกอบคำขอ <span className="text-red-500">*</span></Label><Textarea placeholder="ระบุเหตุผล..." className="min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">วันที่ยื่นคำขอ</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label className="text-xs">วันที่ต้องการ</Label><Input type="date" /></div>
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
