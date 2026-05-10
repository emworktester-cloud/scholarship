import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import {
  Upload, FileText, User, CheckCircle, Clock, Eye, Plus,
  GraduationCap, Building, Calendar, Award, Calculator,
  Plane, Send, MapPin, FileCheck, Briefcase, Shield,
  Scale, Info, AlertTriangle, Search, Edit, Trash2, Globe,
  ArrowRightLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
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
import { DatePicker } from '../../components/ui/date-picker';
import { CountryFlag } from '../../components/ui/country-flag';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '../../components/ui/accordion';
import { toast } from 'sonner';

// ===== Mock scholars graduating =====
interface GraduatingScholar {
  id: string;
  name: string;
  scholarshipType: string;
  degree: string;
  country: string;
  completionDate: string;
  returnDate: string;
  status: 'pending-report' | 'reported' | 'qualification-review' | 'assigned' | 'service-started';
  hasAffiliation: boolean;
  affiliationAgency: string;
}

const graduatingScholars: GraduatingScholar[] = [
  { id: 'SCH-001', name: 'น.ส.พรพิมล สุขใจ', scholarshipType: 'ทุน ก.พ.', degree: 'M.Sc. Data Science', country: 'สหรัฐอเมริกา', completionDate: '15/12/2568', returnDate: '05/01/2569', status: 'service-started', hasAffiliation: true, affiliationAgency: 'สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (ETDA)' },
  { id: 'SCH-008', name: 'นายธนกฤต ประสบผล', scholarshipType: 'ทุน ก.พ. (บุคคลทั่วไป)', degree: 'Ph.D. Economics', country: 'สหรัฐอเมริกา', completionDate: '30/09/2568', returnDate: '20/10/2568', status: 'qualification-review', hasAffiliation: false, affiliationAgency: '' },
  { id: 'SCH-012', name: 'น.ส.ปิยะดา เก่งกล้า', scholarshipType: 'ทุนกระทรวง', degree: 'M.A. Design', country: 'ญี่ปุ่น', completionDate: '20/01/2569', returnDate: '10/02/2569', status: 'reported', hasAffiliation: false, affiliationAgency: '' },
  { id: 'SCH-025', name: 'นายภาคิน แข็งแรง', scholarshipType: 'ทุน ก.พ.', degree: 'B.Eng. Mechanical', country: 'สหราชอาณาจักร', completionDate: '28/02/2569', returnDate: '-', status: 'pending-report', hasAffiliation: true, affiliationAgency: 'สำนักงาน ก.พ.' },
];

const statusConfig = {
  'pending-report': { label: 'รอรายงานตัว', bg: 'bg-yellow-100', color: 'text-yellow-700', icon: Clock },
  'reported': { label: 'รายงานตัวแล้ว', bg: 'bg-blue-100', color: 'text-blue-700', icon: CheckCircle },
  'qualification-review': { label: 'พิจารณาคุณวุฒิ', bg: 'bg-purple-100', color: 'text-purple-700', icon: FileCheck },
  'assigned': { label: 'จัดสรรสังกัดแล้ว', bg: 'bg-indigo-100', color: 'text-indigo-700', icon: Building },
  'service-started': { label: 'เริ่มปฏิบัติราชการ', bg: 'bg-green-100', color: 'text-green-700', icon: Briefcase },
};

export default function PostGraduation() {
  const [selectedScholar, setSelectedScholar] = useState<GraduatingScholar | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('completion');
  const [transitionToPrevOpen, setTransitionToPrevOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtered scholars
  const filteredGraduatingScholars = graduatingScholars.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
    if (filterType !== 'all') {
      if (filterType === 'ocsc' && !s.scholarshipType.includes('ก.พ.')) return false;
      if (filterType === 'ministry' && !s.scholarshipType.includes('กต.')) return false;
    }
    if (filterStatus !== 'all') {
      if (filterStatus !== s.status) return false;
    }
    return true;
  });

  const postGradSections = [
    { id: 'completion', label: '1. แจ้งสำเร็จการศึกษา', icon: GraduationCap, desc: 'แจ้งสำเร็จหรือเสร็จสิ้นการศึกษากับ สนร./สอท./ก.พ.' },
    { id: 'report-arrival', label: '2. รายงานตัวกับสำนักงาน ก.พ.', icon: Plane, desc: 'ส่งเอกสารสำเร็จการศึกษา แบบรายงานตัว ตั๋วเครื่องบิน' },
    { id: 'qualification', label: '3. พิจารณาคุณวุฒิ', icon: FileCheck, desc: 'ทุน ก.พ./กต. บุคคลทั่วไป พิจารณาคุณวุฒิก่อนเริ่มงาน' },
    { id: 'affiliation', label: '4. จัดสรรสังกัด', icon: Building, desc: 'จัดสรรสังกัดให้ นทร. ทุนรัฐบาลที่ไม่มีหน่วยงานต้นสังกัด' },
    { id: 'service-calc', label: '5. การคำนวณวันชดใช้ทุน', icon: Calculator, desc: 'คำนวณตามเงื่อนไขสัญญารับทุน' },
    { id: 'upload-all', label: '6. เอกสารประกอบ', icon: Upload, desc: 'รวมเอกสารทั้งหมดของระยะสำเร็จการศึกษา' },
    { id: 'transition', label: '7. การเปลี่ยนระยะ', icon: ArrowRightLeft, desc: 'ย้ายข้อมูลกลับไประยะที่ 2 (ระหว่างศึกษา)' },
  ];

  return (
    <div className="space-y-6">
      {/* Phase Description */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">ระยะที่ 3: สำเร็จการศึกษา</h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                ตั้งแต่วันที่ สนร./สำนักงาน ก.พ. แจ้งวันสิ้นสุดการศึกษา หรือวันที่นักเรียนเดินทางกลับถึงประเทศไทย
                ครอบคลุม การแจ้งสำเร็จ การรายงานตัว การพิจารณาคุณวุฒิ การจัดสรรสังกัด และการคำนวณวันชดใช้ทุน
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 gap-3">
        <div className="flex gap-2 items-center flex-1 w-full flex-wrap">
          {selectedScholar ? (
            <Button variant="ghost" className="text-amber-600 hover:text-amber-800 hover:bg-amber-50" onClick={() => setSelectedScholar(null)}>
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              กลับไปหน้ารายชื่อ
            </Button>
          ) : (
            <>
              <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="ค้นหาชื่อ/รหัส..." className="w-full xl:w-56 pl-9 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <FilterCombobox
                className="w-full sm:w-[180px]"
                placeholder="ประเภททุน"
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "ocsc", label: "ทุน ก.พ." },
                  { value: "ministry", label: "ทุน กต." }
                ]}
              />
              <FilterCombobox
                className="w-full sm:w-[180px]"
                placeholder="สถานะปัจจุบัน"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "pending-report", label: "รอรายงานตัว" },
                  { value: "reported", label: "รายงานตัวแล้ว" },
                  { value: "qualification-review", label: "พิจารณาคุณวุฒิ" },
                  { value: "assigned", label: "จัดสรรสังกัดแล้ว" },
                  { value: "service-started", label: "เริ่มปฏิบัติราชการ" }
                ]}
              />
            </>
          )}
        </div>
        <div className="flex gap-2">

        </div>
      </div>

      {!selectedScholar ? (
        <Card className="overflow-hidden border-0 shadow-lg shadow-amber-900/5">
          <CardHeader className="pb-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <Award className="w-5 h-5" />
              รายชื่อผู้รับทุน (สำเร็จการศึกษา)
            </CardTitle>
            <CardDescription className="text-xs text-amber-100">แสดงรายชื่อผู้รับทุนที่สำเร็จการศึกษาและอยู่ระหว่างดำเนินการชดใช้ทุน • {filteredGraduatingScholars.length}/{graduatingScholars.length} ราย</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><Table>
              <TableHeader className="bg-gradient-to-r from-slate-50 to-amber-50/30 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-slate-700 py-3.5">รหัส / ชื่อ-สกุล</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">ประเภททุน</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">คุณวุฒิที่สำเร็จ / ประเทศ</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">วันที่สำเร็จ</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5">สถานะ</TableHead>
                  <TableHead className="font-bold text-slate-700 py-3.5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGraduatingScholars.map((s, idx) => {
                  const st = statusConfig[s.status];
                  const StIcon = st.icon;
                  return (
                    <TableRow key={s.id} className={cn(
                      "group transition-all duration-200 cursor-pointer border-b border-gray-100",
                      idx % 2 === 0 ? "bg-white hover:bg-amber-50/60" : "bg-slate-50/40 hover:bg-amber-50/60"
                    )} onClick={() => setSelectedScholar(s)}>
                      <TableCell className="py-3.5">
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{s.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-medium">{s.scholarshipType}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-gray-800">{s.degree}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CountryFlag countryName={s.country} width="16px" height="12px" />
                          <span className="text-[10px] text-gray-400">{s.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">{s.completionDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] font-medium border shadow-sm", st.bg, st.color)}>
                          <StIcon className="w-3 h-3 mr-1" />
                          {st.label}
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
                  );
                })}
              </TableBody>
            </Table></div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">

      {/* Scholar Progress Card */}
      {selectedScholar && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">{selectedScholar.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedScholar.name}</h4>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] font-mono bg-gray-50">{selectedScholar.id}</Badge>
                        <Badge variant="outline" className="text-[9px] bg-gray-50">{selectedScholar.scholarshipType}</Badge>
                        <Badge variant="outline" className="text-[9px] bg-gray-50">{selectedScholar.degree}</Badge>
                        <Badge variant="outline" className="text-[9px] bg-gray-50">{selectedScholar.country}</Badge>
                      </div>
                    </div>
                    <Badge className={`text-[10px] px-3 py-1 self-center sm:self-start border shadow-sm ${statusConfig[selectedScholar.status].bg} ${statusConfig[selectedScholar.status].color}`}>
                      {statusConfig[selectedScholar.status].label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Lifecycle Progress */}
              <div className="flex items-center gap-1">
                {Object.entries(statusConfig).map(([key, sc], i) => {
                  const StepIcon = sc.icon;
                  const steps = Object.keys(statusConfig);
                  const currentIdx = steps.indexOf(selectedScholar.status);
                  const thisIdx = steps.indexOf(key);
                  const isCompleted = thisIdx <= currentIdx;
                  const isCurrent = key === selectedScholar.status;
                  return (
                    <div key={key} className="flex items-center flex-1">
                      <div className={`flex flex-col items-center flex-1 ${isCompleted ? '' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-200' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <p className={`text-[9px] mt-1 text-center ${isCurrent ? 'font-bold text-blue-700' : 'text-gray-500'}`}>{sc.label}</p>
                      </div>
                      {i < Object.entries(statusConfig).length - 1 && (
                        <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Data Sections */}
      <div className="flex flex-col lg:flex-row gap-6 items-start mt-4">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-4">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar whitespace-nowrap lg:whitespace-normal px-1">
            {postGradSections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setExpandedSection(sec.id)}
                className={cn(
                  "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm transition-all text-left w-auto lg:w-full border shrink-0",
                  expandedSection === sec.id
                    ? "bg-amber-600 text-white shadow-md border-transparent font-medium"
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
                   const s = postGradSections.find(x => x.id === expandedSection);
                   if (!s) return null;
                   const Icon = s.icon;
                   return <><Icon className="w-5 h-5 text-amber-600" />{s.label.split('. ')[1]}</>;
                 })()}
               </CardTitle>
               <CardDescription className="text-xs">
                 {postGradSections.find(x => x.id === expandedSection)?.desc}
               </CardDescription>
             </CardHeader>
             <CardContent className="p-6">
               <div className="space-y-4">
               {expandedSection === 'completion' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">วันที่สำเร็จการศึกษา</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่สถานศึกษารับรอง</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">แจ้งต่อ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="snr">สนร.</SelectItem><SelectItem value="sot">สอท.</SelectItem><SelectItem value="ocsc">สำนักงาน ก.พ.</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ระดับปริญญาที่สำเร็จ</Label><Input placeholder="Ph.D. / M.Sc. / M.A. ..." /></div>
              <div className="space-y-1.5"><Label className="text-xs">สาขาวิชา</Label><Input placeholder="สาขา" /></div>
              <div className="space-y-1.5"><Label className="text-xs">สถานศึกษา</Label><Input placeholder="ชื่อมหาวิทยาลัย" /></div>
            </div>
            <FileUploadArea label="อัปโหลดหลักฐานสำเร็จการศึกษา" accept=".pdf,.jpg,.png" />
                 </motion.div>
               )}

               {expandedSection === 'report-arrival' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">วันที่เดินทางกลับถึงประเทศไทย</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่รายงานตัว ก.พ.</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">เจ้าหน้าที่รับรายงานตัว</Label><Input placeholder="ชื่อเจ้าหน้าที่" /></div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">เอกสารที่ต้องส่ง</Label>
              {[
                { name: 'หลักฐานการสำเร็จการศึกษา (Degree Certificate / Transcript)', uploaded: false },
                { name: 'แบบรายงานตัวกลับจากต่างประเทศ', uploaded: true },
                { name: 'ตั๋วเครื่องบิน (Boarding Pass / E-Ticket)', uploaded: false },
                { name: 'สำเนาหนังสือเดินทาง (หน้าที่มีตราเข้า-ออก)', uploaded: false },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.uploaded ? <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><CheckCircle className="w-3 h-3 mr-0.5" />อัปโหลดแล้ว</Badge> : <Badge className="bg-gray-100 text-gray-500 text-[9px]">ยังไม่อัปโหลด</Badge>}
                    <Button size="sm" variant="outline" onClick={() => toast.info(`อัปโหลด: ${doc.name}`)}><Upload className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
                 </motion.div>
               )}

               {expandedSection === 'qualification' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <p>เฉพาะ <strong>ทุน ก.พ. และทุน กต. บุคคลทั่วไป</strong> — สำนักงาน ก.พ. จะส่งพิจารณาคุณวุฒิก่อน ให้ นทร. ไปรายงานตัวเข้าปฏิบัติราชการ (เฉพาะ นทร. ที่บรรจุเข้ารับราชการในหน่วยงานข้าราชการพลเรือน)</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">สถานะการพิจารณา</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="pending">รอพิจารณา</SelectItem><SelectItem value="reviewing">อยู่ระหว่างพิจารณา</SelectItem><SelectItem value="approved">พิจารณาเรียบร้อย</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่ส่งพิจารณา</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่ได้รับผล</Label><DatePicker /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">ผลการพิจารณาคุณวุฒิ</Label><Textarea placeholder="รายละเอียดผลพิจารณา..." className="min-h-[60px]" /></div>
            <FileUploadArea label="อัปโหลดเอกสารพิจารณาคุณวุฒิ" accept=".pdf,.jpg,.png" />
                 </motion.div>
               )}

               {expandedSection === 'affiliation' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <p>เฉพาะ <strong>ทุน ก.พ. ที่ไม่มีสังกัด</strong> — สำนักงาน ก.พ. จะจัดสรรสังกัดให้นักเรียนทุนรัฐบาล</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">หน่วยงานที่จัดสรร</Label><Select><SelectTrigger><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger><SelectContent><SelectItem value="etda">สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (ETDA)</SelectItem><SelectItem value="dga">สำนักงานพัฒนารัฐบาลดิจิทัล (DGA)</SelectItem><SelectItem value="nstda">สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.)</SelectItem><SelectItem value="ocsc">สำนักงาน ก.พ.</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ตำแหน่งที่จะบรรจุ</Label><Input placeholder="ตำแหน่ง" /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่เริ่มปฏิบัติราชการ</Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">เลขที่คำสั่งบรรจุ</Label><Input placeholder="เลขที่" /></div>
            </div>
            <FileUploadArea label="อัปโหลดเอกสารจัดสรรสังกัด/คำสั่งบรรจุ" accept=".pdf,.jpg,.png" />
                 </motion.div>
               )}

               {expandedSection === 'service-calc' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-[9px] text-blue-500">วันเริ่มรับทุน</Label>
                <p className="text-sm font-semibold text-blue-700 mt-1">01/08/2563</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-[9px] text-blue-500">วันสิ้นสุดรับทุน</Label>
                <p className="text-sm font-semibold text-blue-700 mt-1">15/12/2568</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Label className="text-[9px] text-purple-500">จำนวนวันรับทุน</Label>
                <p className="text-xl font-bold text-purple-700 mt-1">1,963 <span className="text-xs font-normal">วัน</span></p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Label className="text-[9px] text-amber-500">ตัวคูณ (ตามสัญญา)</Label>
                <p className="text-xl font-bold text-amber-700 mt-1">×2</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center"><p className="text-[9px] text-green-500">วันชดใช้ทุนทั้งหมด</p><p className="text-2xl font-bold text-green-700">3,926 <span className="text-xs font-normal">วัน</span></p><p className="text-[10px] text-green-500">≈ 10.8 ปี</p></div>
                <div className="text-center"><p className="text-[9px] text-green-500">วันเริ่มชดใช้ทุน</p><p className="text-sm font-bold text-green-700 mt-2">05/01/2569</p></div>
                <div className="text-center"><p className="text-[9px] text-green-500">วันสิ้นสุดชดใช้ทุน</p><p className="text-sm font-bold text-green-700 mt-2">22/09/2579</p></div>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">หมายเหตุเงื่อนไขสัญญา</Label><Textarea placeholder="เงื่อนไขพิเศษตามสัญญา..." className="min-h-[50px]" /></div>
                 </motion.div>
               )}

               {expandedSection === 'upload-all' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[
              'หลักฐานสำเร็จการศึกษา (Degree Certificate)',
              'ใบรายงานผลการเรียน (Official Transcript)',
              'แบบรายงานตัวกลับจากต่างประเทศ',
              'ตั๋วเครื่องบิน / Boarding Pass',
              'สำเนาหนังสือเดินทาง',
              'เอกสารพิจารณาคุณวุฒิ',
              'คำสั่งบรรจุ/จัดสรรสังกัด',
              'สัญญาชดใช้ทุน (ลงนามแล้ว)',
              'เอกสารอื่นๆ',
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><span className="text-xs">{doc}</span></div>
                <Button size="sm" variant="outline" onClick={() => toast.info(`อัปโหลด: ${doc}`)}><Upload className="w-3.5 h-3.5 mr-1" />อัปโหลด</Button>
              </div>
            ))}
                 </motion.div>
               )}

               {expandedSection === 'transition' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 opacity-80 hover:opacity-100 transition-opacity">
                     <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                       <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-amber-900">ย้ายข้อมูลกลับไประยะที่ 2 (ระหว่างศึกษา)</h4>
                       <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                         หากพบข้อผิดพลาดหรือนักเรียนทุนมีการแก้ไขข้อมูลการสำเร็จการศึกษา คุณสามารถย้ายข้อมูลกลับไประยะที่ 2 ได้
                       </p>
                       <Button variant="outline" className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-100" onClick={() => setTransitionToPrevOpen(true)}>
                         ย้ายกลับระยะที่ 2
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
                         <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle className="w-4 h-4 text-purple-600" />
                         </div>
                         <div>
                           <p className="text-sm font-medium text-gray-800">เริ่มระยะที่ 3 (หลังจบการศึกษา)</p>
                           <p className="text-xs text-gray-500 mt-0.5">ดำเนินการเมื่อ: 15/12/2568 10:00 น. โดย สมศรี ใจดี (จนท. ก.พ.)</p>
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

      {/* Completion Dialog */}
      <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5" />แจ้งสำเร็จการศึกษา</DialogTitle>
            <DialogDescription className="text-amber-100 mt-1">แจ้งสำเร็จหรือเสร็จสิ้นการศึกษากับ สนร./สอท./สำนักงาน ก.พ.</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">นักเรียนทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent>{graduatingScholars.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่สำเร็จการศึกษา <span className="text-red-500">*</span></Label><DatePicker /></div>
              <div className="space-y-1.5"><Label className="text-xs">ระดับปริญญา</Label><Input placeholder="Ph.D. / M.Sc." /></div>
              <div className="space-y-1.5"><Label className="text-xs">แจ้งต่อ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="snr">สนร.</SelectItem><SelectItem value="sot">สอท.</SelectItem><SelectItem value="ocsc">สำนักงาน ก.พ.</SelectItem></SelectContent></Select></div>
            </div>
            <FileUploadArea label="อัปโหลดหลักฐานสำเร็จการศึกษา" accept=".pdf,.jpg,.png" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCompletionDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setCompletionDialogOpen(false); toast.success('แจ้งสำเร็จการศึกษาเรียบร้อย'); }}>ยืนยัน</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Transition to Prev Dialog */}
      <Dialog open={transitionToPrevOpen} onOpenChange={setTransitionToPrevOpen}>
        <DialogContent className="sm:max-w-md p-0  max-h-[85vh] overflow-y-auto ">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              ยืนยันการย้ายกลับระยะที่ 2
            </DialogTitle>
            <DialogDescription className="text-amber-100 mt-1">
              ยืนยันการย้ายข้อมูล {selectedScholar?.name} กลับไประยะระหว่างศึกษา
            </DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <p>เมื่อยืนยันการย้ายระยะแล้ว ข้อมูลของนักเรียนทุนรายนี้จะ:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ถูกนำออกจากหน้ารายการ <strong>"ระยะที่ 3 (หลังจบการศึกษา)"</strong></li>
              <li>กลับไปปรากฏในหน้ารายการ <strong>"ระยะที่ 2 (ระหว่างศึกษา)"</strong></li>
            </ul>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTransitionToPrevOpen(false)}>ยกเลิก</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
              setTransitionToPrevOpen(false);
              setSelectedScholar(null);
              toast.success(`ย้ายข้อมูล ${selectedScholar?.name} กลับระยะที่ 2 เรียบร้อยแล้ว`, {
                description: 'ดำเนินการโดย สมศรี ใจดี (10/05/2569 14:20 น.)'
              });
            }}>
              ยืนยันการย้ายกลับ
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
