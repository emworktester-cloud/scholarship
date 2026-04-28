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
               <CardTitle className="text-lg text-gray-900 flex items-center justify-between w-full">
                 <div className="flex items-center gap-2">
                   {(() => {
                     const s = sections.find(x => x.id === expandedSection);
                     if (!s) return null;
                     const Icon = s.icon;
                     return <><Icon className="w-5 h-5 text-blue-600" />{s.label.split('. ')[1]}</>;
                   })()}
                 </div>
                 {/* Edit Button */}
                 {expandedSection !== 'documents' && (
                   <Button 
                     size="sm" 
                     variant={editModes[expandedSection] ? "default" : "outline"}
                     onClick={() => toggleEditMode(expandedSection)}
                     className={cn(
                       "h-8 text-xs", 
                       editModes[expandedSection] ? "bg-blue-600 hover:bg-blue-700" : "bg-white"
                     )}
                   >
                     {editModes[expandedSection] ? (
                       <><CheckCircle className="w-3.5 h-3.5 mr-1.5" />บันทึกข้อมูล</>
                     ) : (
                       <><Edit className="w-3.5 h-3.5 mr-1.5" />แก้ไขข้อมูล</>
                     )}
                   </Button>
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
            <div className="flex gap-6">
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
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันเกิด</Label><Input type="date" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="1997-06-15" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">เพศ</Label><Select defaultValue="female"><SelectTrigger className="border-gray-300 focus:ring-blue-500"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="male">ชาย</SelectItem><SelectItem value="female">หญิง</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สัญชาติ</Label><Input defaultValue="ไทย" className="border-gray-300 focus-visible:ring-blue-500" /></div>
                  </>
                ) : (
                  <>
                    <FieldView label="คำนำหน้า" value="นางสาว" />
                    <FieldView label="ชื่อ (ไทย)" value="พรพิมล" />
                    <FieldView label="นามสกุล (ไทย)" value="สุขใจ" />
                    <FieldView label="ชื่อ (อังกฤษ)" value="Pornpimon" />
                    <FieldView label="นามสกุล (อังกฤษ)" value="Sukjai" />
                    <FieldView label="เลขบัตรประชาชน" value="1-1234-56789-01-2" />
                    <FieldView label="วัน/เดือน/ปีเกิด" value="15 มิ.ย. 2540" />
                    <FieldView label="เพศ" value="หญิง" />
                    <FieldView label="สัญชาติ" value="ไทย" />
                  </>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Education History */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800"><GraduationCap className="w-4 h-4 text-blue-600" />ประวัติการศึกษา</h4>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระดับการศึกษาล่าสุด</Label><Select defaultValue="bachelor"><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="bachelor">ปริญญาตรี</SelectItem><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถาบัน</Label><Input placeholder="ชื่อสถาบัน" className="border-gray-300" defaultValue="จุฬาลงกรณ์มหาวิทยาลัย" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">สาขาวิชา</Label><Input placeholder="สาขา" className="border-gray-300" defaultValue="วิศวกรรมคอมพิวเตอร์" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">GPA</Label><Input placeholder="0.00" type="number" step="0.01" className="border-gray-300" defaultValue="3.85" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ปีที่จบ (พ.ศ.)</Label><Input placeholder="พ.ศ." className="border-gray-300" defaultValue="2562" /></div>
                  </>
                ) : (
                  <>
                    <FieldView label="ระดับการศึกษาล่าสุด" value="ปริญญาตรี" />
                    <FieldView label="สถาบัน" value="จุฬาลงกรณ์มหาวิทยาลัย" />
                    <FieldView label="สาขาวิชา" value="วิศวกรรมคอมพิวเตอร์" />
                    <FieldView label="GPA" value="3.85" />
                    <FieldView label="ปีที่จบ (พ.ศ.)" value="2562" />
                  </>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800"><Phone className="w-4 h-4 text-green-600" />ช่องทางการติดต่อ</h4>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">โทรศัพท์มือถือ</Label><Input placeholder="08x-xxx-xxxx" className="border-gray-300" defaultValue="081-234-5678" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">อีเมลส่วนตัว</Label><Input placeholder="email@example.com" type="email" className="border-gray-300" defaultValue="pornpimon@example.com" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">LINE ID</Label><Input placeholder="LINE ID" className="border-gray-300" defaultValue="pornpimon.s" /></div>
                    <div className="col-span-3 space-y-1.5"><Label className="text-xs text-gray-700">ที่อยู่ปัจจุบัน</Label><Textarea placeholder="ที่อยู่" className="min-h-[60px] border-gray-300" defaultValue="123/45 ซอยลาดพร้าว 87 บางกะปิ กรุงเทพมหานคร 10240" /></div>
                  </>
                ) : (
                  <>
                    <FieldView label="โทรศัพท์มือถือ" value="081-234-5678" />
                    <FieldView label="อีเมลส่วนตัว" value="pornpimon@example.com" />
                    <FieldView label="LINE ID" value="pornpimon.s" />
                    <div className="col-span-3"><FieldView label="ที่อยู่ปัจจุบัน" value="123/45 ซอยลาดพร้าว 87 บางกะปิ กรุงเทพมหานคร 10240" /></div>
                  </>
                )}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* English Score */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800"><Languages className="w-4 h-4 text-purple-600" />ผลคะแนนภาษาอังกฤษ</h4>
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                {editModes['personal'] ? (
                  <>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ประเภทการสอบ</Label><Select defaultValue="ielts"><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="ielts">IELTS</SelectItem><SelectItem value="toefl">TOEFL iBT</SelectItem><SelectItem value="toeic">TOEIC</SelectItem><SelectItem value="other">อื่นๆ</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">คะแนนรวม</Label><Input placeholder="คะแนน" type="number" step="0.5" className="border-gray-300" defaultValue="7.5" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่สอบ</Label><Input type="date" className="border-gray-300" defaultValue="2025-01-10" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันหมดอายุ</Label><Input type="date" className="border-gray-300" defaultValue="2027-01-10" /></div>
                  </>
                ) : (
                  <>
                    <FieldView label="ประเภทการสอบ" value="IELTS" />
                    <FieldView label="คะแนนรวม" value="7.5" />
                    <FieldView label="วันที่สอบ" value="10 ม.ค. 2568" />
                    <FieldView label="วันหมดอายุ" value="10 ม.ค. 2570" />
                  </>
                )}
              </div>
              {editModes['personal'] && <FileUploadArea label="อัปโหลดผลคะแนน" accept=".pdf,.jpg,.png" />}
            </div>
                 </motion.div>
               )}

               {expandedSection === 'scholarship' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
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
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่เริ่มรับทุน</Label><Input type="date" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="2026-08-01" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่สิ้นสุดรับทุน</Label><Input type="date" className="border-gray-300 focus-visible:ring-blue-500" defaultValue="2030-07-31" /></div>
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
                  <FieldView label="วันที่เริ่มรับทุน" value="1 ส.ค. 2569" />
                  <FieldView label="วันที่สิ้นสุดรับทุน" value="31 ก.ค. 2573" />
                </>
              )}
            </div>
                 </motion.div>
               )}

               {expandedSection === 'contract' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
                <CardContent className="p-5">
                  <h5 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" />สัญญารับทุน</h5>
                  {editModes['contract'] ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">เลขที่สัญญา</Label><Input placeholder="สญ./xxxx" className="border-gray-300 focus-visible:ring-indigo-500 bg-white" defaultValue="สญ. 1234/2569" /></div>
                      <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ลงนาม</Label><Input type="date" className="border-gray-300 focus-visible:ring-indigo-500 bg-white" defaultValue="2026-04-15" /></div>
                      <FileUploadArea label="อัปโหลดสัญญารับทุน" accept=".pdf" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <FieldView label="เลขที่สัญญา" value="สญ. 1234/2569" />
                      <FieldView label="วันที่ลงนาม" value="15 เม.ย. 2569" />
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
                    <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ตัวคูณชดใช้ทุน</Label><Select defaultValue="2"><SelectTrigger className="border-gray-300"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">×1 เท่า</SelectItem><SelectItem value="2">×2 เท่า</SelectItem><SelectItem value="3">×3 เท่า</SelectItem></SelectContent></Select></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">ระยะเวลาชดใช้ (วัน)</Label><Input placeholder="คำนวณอัตโนมัติ" readOnly className="bg-gray-100 text-gray-600 border-gray-300" defaultValue="2920" /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-gray-700">หมายเหตุเงื่อนไขพิเศษ</Label><Input placeholder="ถ้ามี" className="border-gray-300" /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
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
            
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              {editModes['health'] ? (
                <>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ตรวจสุขภาพ</Label><Input type="date" className="border-gray-300" defaultValue="2026-03-20" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">สถานพยาบาล</Label><Input placeholder="ชื่อโรงพยาบาล" className="border-gray-300" defaultValue="โรงพยาบาลศิริราช" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่หมดอายุ</Label><Input type="date" className="bg-gray-100 text-gray-500 border-gray-300" readOnly defaultValue="2027-03-20" /></div>
                </>
              ) : (
                <>
                  <FieldView label="วันที่ตรวจสุขภาพ" value="20 มี.ค. 2569" />
                  <FieldView label="สถานพยาบาล" value="โรงพยาบาลศิริราช" />
                  <FieldView label="วันที่หมดอายุ" value={<span className="text-amber-600 font-medium">20 มี.ค. 2570</span>} />
                </>
              )}
            </div>

            <Separator className="bg-gray-100" />

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-800">รายการตรวจสอบผลสุขภาพ</Label>
              <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-3 gap-x-6 gap-y-4 pt-2">
              {editModes['military'] ? (
                <>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">ครั้งที่ผ่อนผัน</Label><Select><SelectTrigger className="border-gray-300"><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="1">ครั้งที่ 1 (ครั้งแรก)</SelectItem><SelectItem value="2">ครั้งที่ 2</SelectItem><SelectItem value="3">ครั้งที่ 3</SelectItem><SelectItem value="4">ครั้งที่ 4+</SelectItem></SelectContent></Select></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ได้รับอนุมัติผ่อนผัน</Label><Input type="date" className="border-gray-300" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-gray-700">วันที่ครบกำหนด</Label><Input type="date" className="border-gray-300" /></div>
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

// Shared field view component for View Mode
function FieldView({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-[13px] font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}
