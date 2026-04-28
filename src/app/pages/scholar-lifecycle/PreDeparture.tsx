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
} from 'lucide-react';
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

// ===== Section definitions for the phase =====
const sections = [
  { id: 'personal', label: '1. ข้อมูลส่วนบุคคล', icon: User, desc: 'ประวัติส่วนตัว รูปถ่าย การศึกษา ช่องทางติดต่อ ผลภาษาอังกฤษ' },
  { id: 'scholarship', label: '2. ข้อมูลการรับทุน', icon: Award, desc: 'แหล่งทุน ชื่อทุน ประเภท ปี ระดับ สาขา สังกัด ประเทศ ระยะเวลา' },
  { id: 'contract', label: '3. สัญญารับทุนและค้ำประกัน', icon: FileCheck, desc: 'สัญญา เงื่อนไขชดใช้ทุน Upload file สัญญา' },
  { id: 'health', label: '4. ผลการตรวจสุขภาพ', icon: Stethoscope, desc: 'ผลตรวจสุขภาพตามที่ ก.พ. กำหนด (อายุ 1 ปี)' },
  { id: 'military', label: '5. การผ่อนผันทหาร', icon: Shield, desc: 'ผ่อนผันทหาร แจ้งเตือนรายปี/ก่อน 6 เดือน' },
  { id: 'documents', label: '6. เอกสารต่างๆ', icon: FolderOpen, desc: 'หนังสือรับรอง วีซ่า CAS/COE/JW/DS ตั๋ว พาสปอร์ต' },
];

export default function PreDeparture() {
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addScholarOpen, setAddScholarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('personal');

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center flex-1">
          {selectedScholar ? (
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => setSelectedScholar(null)}>
              <ChevronDown className="w-4 h-4 mr-1 rotate-90" />
              กลับไปหน้ารายชื่อ
            </Button>
          ) : (
            <>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="ค้นหาชื่อ/รหัส..." className="w-64 pl-9 bg-white" />
              </div>
              <FilterCombobox
                className="w-40"
                placeholder="ประเภททุน"
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "ocsc", label: "ทุน ก.พ." },
                  { value: "ministry", label: "ทุนกระทรวง" }
                ]}
              />
              <FilterCombobox
                className="w-40"
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
                className="w-40"
                placeholder="สถานะ"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "processing", label: "กำลังดำเนินการ" },
                  { value: "waiting", label: "รอเอกสาร" },
                  { value: "ready", label: "พร้อมเดินทาง" }
                ]}
              />
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white" onClick={() => setImportDialogOpen(true)}><Upload className="w-4 h-4 mr-1.5" />นำเข้า Excel</Button>
          <Button onClick={() => setAddScholarOpen(true)}><Plus className="w-4 h-4 mr-1.5" />บันทึกรายบุคคล</Button>
        </div>
      </div>

      {!selectedScholar ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              รายชื่อผู้รับทุน (ก่อนเดินทาง)
            </CardTitle>
            <CardDescription className="text-xs">แสดงรายชื่อผู้รับทุนที่อยู่ระหว่างเตรียมตัวก่อนออกเดินทาง</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700 py-3 rounded-tl-lg">รหัสนักเรียนทุน / ชื่อ-สกุล</TableHead>
                  <TableHead className="font-semibold text-slate-700 py-3">ประเภททุน</TableHead>
                  <TableHead className="font-semibold text-slate-700 py-3">ประเทศปลายทาง</TableHead>
                  <TableHead className="font-semibold text-slate-700 py-3">ความสมบูรณ์</TableHead>
                  <TableHead className="font-semibold text-slate-700 py-3">สถานะ</TableHead>
                  <TableHead className="font-semibold text-slate-700 py-3 text-right rounded-tr-lg">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholars.map(s => (
                  <TableRow key={s.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => setSelectedScholar(s)}>
                    <TableCell>
                      <p className="text-sm font-semibold text-blue-900">{s.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{s.id}</p>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700">{s.scholarshipType}</TableCell>
                    <TableCell className="text-xs text-gray-700">{s.destination}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={s.completeness} className="h-1.5 w-16" />
                        <span className="text-[10px] text-gray-500">{s.completeness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] ${s.completeness === 100 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'} border`}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="text-xs" onClick={(e) => { e.stopPropagation(); setSelectedScholar(s); }}>
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        รายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <div className="flex gap-2 mt-2 flex-wrap">
                {sections.map(sec => (
                  <Badge key={sec.id} variant="outline" className="text-[9px] cursor-pointer hover:bg-blue-50" onClick={() => setExpandedSection(sec.id)}>
                    <sec.icon className="w-3 h-3 mr-0.5" />{sec.label.split('. ')[1]}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 md:sticky md:top-4">
          <nav className="flex flex-col gap-1">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setExpandedSection(sec.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left w-full border",
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
               <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                 {(() => {
                   const s = sections.find(x => x.id === expandedSection);
                   if (!s) return null;
                   const Icon = s.icon;
                   return <><Icon className="w-5 h-5 text-blue-600" />{s.label.split('. ')[1]}</>;
                 })()}
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
            <div className="flex gap-6">
              <div className="shrink-0">
                <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => toast.info('เลือกรูปถ่าย')}>
                  <Camera className="w-8 h-8 text-gray-300 mb-1" />
                  <p className="text-[10px] text-gray-400">รูปถ่ายนักเรียนทุน</p>
                  <p className="text-[8px] text-gray-300">JPG, PNG</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">คำนำหน้า</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="mr">นาย</SelectItem><SelectItem value="ms">นางสาว</SelectItem><SelectItem value="mrs">นาง</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">ชื่อ (ไทย)</Label><Input placeholder="ชื่อ" /></div>
                <div className="space-y-1.5"><Label className="text-xs">นามสกุล (ไทย)</Label><Input placeholder="นามสกุล" /></div>
                <div className="space-y-1.5"><Label className="text-xs">ชื่อ (อังกฤษ)</Label><Input placeholder="First Name" /></div>
                <div className="space-y-1.5"><Label className="text-xs">นามสกุล (อังกฤษ)</Label><Input placeholder="Last Name" /></div>
                <div className="space-y-1.5"><Label className="text-xs">เลขบัตรประชาชน</Label><Input placeholder="x-xxxx-xxxxx-xx-x" /></div>
                <div className="space-y-1.5"><Label className="text-xs">วันเกิด</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label className="text-xs">เพศ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="male">ชาย</SelectItem><SelectItem value="female">หญิง</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">สัญชาติ</Label><Input defaultValue="ไทย" /></div>
              </div>
            </div>

            <Separator />

            {/* Education History */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-600" />ประวัติการศึกษา</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">ระดับการศึกษาล่าสุด</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="bachelor">ปริญญาตรี</SelectItem><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">สถาบัน</Label><Input placeholder="ชื่อสถาบัน" /></div>
                <div className="space-y-1.5"><Label className="text-xs">สาขาวิชา</Label><Input placeholder="สาขา" /></div>
                <div className="space-y-1.5"><Label className="text-xs">GPA</Label><Input placeholder="0.00" type="number" step="0.01" /></div>
                <div className="space-y-1.5"><Label className="text-xs">ปีที่จบ</Label><Input placeholder="พ.ศ." /></div>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" />ช่องทางการติดต่อ</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">โทรศัพท์มือถือ</Label><Input placeholder="08x-xxx-xxxx" /></div>
                <div className="space-y-1.5"><Label className="text-xs">อีเมลส่วนตัว</Label><Input placeholder="email@example.com" type="email" /></div>
                <div className="space-y-1.5"><Label className="text-xs">LINE ID</Label><Input placeholder="LINE ID" /></div>
                <div className="col-span-3 space-y-1.5"><Label className="text-xs">ที่อยู่ปัจจุบัน</Label><Textarea placeholder="ที่อยู่" className="min-h-[60px]" /></div>
              </div>
            </div>

            <Separator />

            {/* English Score */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Languages className="w-4 h-4 text-purple-600" />ผลคะแนนภาษาอังกฤษ</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">ประเภทการสอบ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ielts">IELTS</SelectItem><SelectItem value="toefl">TOEFL iBT</SelectItem><SelectItem value="toeic">TOEIC</SelectItem><SelectItem value="other">อื่นๆ</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label className="text-xs">คะแนนรวม</Label><Input placeholder="คะแนน" type="number" /></div>
                <div className="space-y-1.5"><Label className="text-xs">วันที่สอบ</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label className="text-xs">วันหมดอายุ</Label><Input type="date" /></div>
              </div>
              <FileUploadArea label="อัปโหลดผลคะแนน" accept=".pdf,.jpg,.png" />
            </div>
                 </motion.div>
               )}

               {expandedSection === 'scholarship' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">แหล่งทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือกแหล่งทุน" /></SelectTrigger><SelectContent><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem><SelectItem value="china">ทุนรัฐบาลจีน</SelectItem><SelectItem value="mext">ทุน MEXT</SelectItem><SelectItem value="other">อื่นๆ</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ชื่อทุน <span className="text-red-500">*</span></Label><Input placeholder="ชื่อทุน" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ประเภททุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="study">ศึกษาต่อ</SelectItem><SelectItem value="training">ฝึกอบรม</SelectItem><SelectItem value="research">วิจัย</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ปีที่ได้รับทุน (พ.ศ.) <span className="text-red-500">*</span></Label><Input placeholder="2569" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ระดับการศึกษาที่ได้รับทุนจัดสรร</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem><SelectItem value="training">ฝึกอบรม</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">สาขาที่ทุนกำหนด</Label><Input placeholder="สาขาวิชา" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สังกัด/หน่วยงานต้นสังกัด</Label><Input placeholder="หน่วยงาน" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สถานศึกษา</Label><Input placeholder="ชื่อมหาวิทยาลัย" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สาขาวิชา (ที่ศึกษา)</Label><Input placeholder="สาขาวิชา" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ประเทศ <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือกประเทศ" /></SelectTrigger><SelectContent><SelectItem value="us">สหรัฐอเมริกา</SelectItem><SelectItem value="uk">สหราชอาณาจักร</SelectItem><SelectItem value="jp">ญี่ปุ่น</SelectItem><SelectItem value="au">ออสเตรเลีย</SelectItem><SelectItem value="de">เยอรมนี</SelectItem><SelectItem value="fr">ฝรั่งเศส</SelectItem><SelectItem value="cn">จีน</SelectItem><SelectItem value="th">ไทย</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">เมือง/รัฐ</Label><Input placeholder="เมือง/รัฐ" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ระยะเวลารับทุน</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="1">1 ปี</SelectItem><SelectItem value="2">2 ปี</SelectItem><SelectItem value="3">3 ปี</SelectItem><SelectItem value="4">4 ปี</SelectItem><SelectItem value="5">5 ปี</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่เริ่มรับทุน</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่สิ้นสุดรับทุน</Label><Input type="date" /></div>
            </div>
                 </motion.div>
               )}

               {expandedSection === 'contract' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-indigo-200 bg-indigo-50">
                <CardContent className="p-4">
                  <h5 className="text-xs font-semibold text-indigo-700 mb-3 flex items-center gap-1.5"><FileText className="w-4 h-4" />สัญญารับทุน</h5>
                  <div className="space-y-2">
                    <div className="space-y-1.5"><Label className="text-xs">เลขที่สัญญา</Label><Input placeholder="สญ./xxxx" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">วันที่ลงนาม</Label><Input type="date" /></div>
                    <FileUploadArea label="อัปโหลดสัญญารับทุน" accept=".pdf" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <h5 className="text-xs font-semibold text-purple-700 mb-3 flex items-center gap-1.5"><Shield className="w-4 h-4" />สัญญาค้ำประกัน</h5>
                  <div className="space-y-2">
                    <div className="space-y-1.5"><Label className="text-xs">ชื่อผู้ค้ำประกัน</Label><Input placeholder="ชื่อ-นามสกุล" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">ความสัมพันธ์</Label><Input placeholder="เช่น บิดา มารดา" /></div>
                    <FileUploadArea label="อัปโหลดสัญญาค้ำประกัน" accept=".pdf" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="p-4">
                <h5 className="text-xs font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" />เงื่อนไขระยะเวลาชดใช้ทุน</h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">ตัวคูณชดใช้ทุน</Label><Select defaultValue="2"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">×1 เท่า</SelectItem><SelectItem value="2">×2 เท่า</SelectItem><SelectItem value="3">×3 เท่า</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs">ระยะเวลาชดใช้ (วัน)</Label><Input placeholder="คำนวณอัตโนมัติ" readOnly className="bg-gray-50" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">หมายเหตุเงื่อนไขพิเศษ</Label><Input placeholder="ถ้ามี" /></div>
                </div>
              </CardContent>
            </Card>
                 </motion.div>
               )}

               {expandedSection === 'health' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-700">ผลการตรวจสุขภาพมีอายุ <strong>1 ปี</strong> นับจากวันที่ตรวจ — ระบบจะแจ้งเตือนเมื่อใกล้หมดอายุ</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">วันที่ตรวจสุขภาพ</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สถานพยาบาล</Label><Input placeholder="ชื่อโรงพยาบาล" /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่หมดอายุ</Label><Input type="date" className="bg-gray-50" readOnly /></div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">รายการตรวจสอบผลสุขภาพ</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'ตรวจร่างกายทั่วไป', 'ตรวจสายตา', 'ตรวจการได้ยิน', 'เอกซเรย์ปอด',
                  'ตรวจเลือดทั่วไป (CBC)', 'ตรวจปัสสาวะ', 'ตรวจ HIV (ถ้ามี)', 'ตรวจสุขภาพจิต',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Checkbox id={`health-${i}`} />
                    <Label htmlFor={`health-${i}`} className="text-xs font-normal cursor-pointer flex-1">{item}</Label>
                    <Select><SelectTrigger className="w-20 h-7"><SelectValue placeholder="ผล" /></SelectTrigger><SelectContent><SelectItem value="pass">ผ่าน</SelectItem><SelectItem value="fail">ไม่ผ่าน</SelectItem><SelectItem value="pending">รอผล</SelectItem></SelectContent></Select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5"><Label className="text-xs">หมายเหตุ/ข้อความเพิ่มเติม</Label><Textarea placeholder="พิมพ์ข้อความเพิ่มเติมเกี่ยวกับผลตรวจสุขภาพ..." className="min-h-[60px]" /></div>

            <FileUploadArea label="อัปโหลดผลตรวจสุขภาพ" accept=".pdf,.jpg,.png" />
                 </motion.div>
               )}

               {expandedSection === 'military' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Label className="text-xs">เข้าข่ายต้องผ่อนผันทหาร</Label>
              <Switch />
              <Badge variant="outline" className="text-[9px]">เฉพาะเพศชาย</Badge>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2"><Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><div className="text-xs text-green-700">
                <p className="font-semibold mb-1">เงื่อนไขการแจ้งเตือน:</p>
                <ul className="space-y-0.5 text-[11px]">
                  <li>• <strong>ผ่อนผันครั้งแรก:</strong> ระบบแจ้งเตือนการผ่อนผันเป็นรายปี</li>
                  <li>• <strong>ผ่อนผันครั้งต่อไป:</strong> ระบบแจ้งเตือนก่อนถึงวันครบกำหนดอย่างน้อย 6 เดือน</li>
                </ul>
              </div></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">ครั้งที่ผ่อนผัน</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="1">ครั้งที่ 1 (ครั้งแรก)</SelectItem><SelectItem value="2">ครั้งที่ 2</SelectItem><SelectItem value="3">ครั้งที่ 3</SelectItem><SelectItem value="4">ครั้งที่ 4+</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่ได้รับอนุมัติผ่อนผัน</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่ครบกำหนด</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สัสดีจังหวัด</Label><Input placeholder="จังหวัด" /></div>
              <div className="space-y-1.5"><Label className="text-xs">เลขที่หนังสือผ่อนผัน</Label><Input placeholder="เลขที่" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สถานะ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="active">อยู่ระหว่างผ่อนผัน</SelectItem><SelectItem value="expired">ครบกำหนดแล้ว</SelectItem><SelectItem value="exempted">พ้นเกณฑ์แล้ว</SelectItem></SelectContent></Select></div>
            </div>

            <FileUploadArea label="อัปโหลดเอกสารผ่อนผันทหาร" accept=".pdf,.jpg,.png" />
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
               </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Save */}
      {selectedScholar && (
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setSelectedScholar(null)}>ยกเลิก</Button>
          <Button onClick={() => { toast.success('บันทึกข้อมูลระยะก่อนเดินทางเรียบร้อย'); setSelectedScholar(null); }}>บันทึกข้อมูล</Button>
        </div>
      )}
      
        </div>
      )}

      {/* Import Excel Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
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
            <Button onClick={() => { setImportDialogOpen(false); toast.success('นำเข้าข้อมูลเรียบร้อย 4 รายการ'); }}>นำเข้า</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Individual Dialog */}
      <Dialog open={addScholarOpen} onOpenChange={setAddScholarOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Plus className="w-5 h-5" />บันทึกผู้รับทุนรายบุคคล</DialogTitle>
            <DialogDescription className="text-green-100 mt-1">สร้างรายการผู้รับทุนใหม่ในระบบ</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">ชื่อ-นามสกุล (ไทย) <span className="text-red-500">*</span></Label><Input placeholder="ชื่อ-นามสกุล" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ชื่อ-นามสกุล (อังกฤษ)</Label><Input placeholder="Full Name" /></div>
              <div className="space-y-1.5"><Label className="text-xs">เลขบัตรประชาชน <span className="text-red-500">*</span></Label><Input placeholder="x-xxxx-xxxxx-xx-x" /></div>
              <div className="space-y-1.5"><Label className="text-xs">แหล่งทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ปีที่ได้รับทุน</Label><Input placeholder="พ.ศ." /></div>
              <div className="space-y-1.5"><Label className="text-xs">ระดับการศึกษา</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddScholarOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setAddScholarOpen(false); toast.success('สร้างรายการผู้รับทุนใหม่เรียบร้อย'); }}>สร้างรายการ</Button>
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
