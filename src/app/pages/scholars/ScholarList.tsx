import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Users, GraduationCap, Award, Plane, BookOpen,
  ChevronRight, SlidersHorizontal, X, Eye,
  UserCheck, AlertCircle, FileText, CheckCircle, Activity,
  Upload, Download, AlertTriangle, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/shared/PageHeader';
import { CountryFlag } from '../../components/ui/country-flag';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../components/ui/utils';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { toast } from 'sonner';

// ===== Types =====
interface ScholarAwardSummary {
  awardId: string;
  scholarshipName: string;
  yearReceived: string;
  startDate: string;
  endDate: string;
  degreeLevel: string;
  country: string;
  university: string;
  currentPhase: 'ก่อนเดินทาง' | 'ระหว่างศึกษา' | 'สำเร็จการศึกษา';
  status: 'active' | 'completed' | 'paused' | 'terminated';
}

interface ScholarListItem {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  workGroup: string;
  awards: ScholarAwardSummary[];
}

// ===== Mock Data =====
const mockScholars: ScholarListItem[] = [
  { id: 'SCH-2569-001', title: 'น.ส.', firstName: 'พรพิมล', lastName: 'สุขใจ', workGroup: 'นทร.1',
    awards: [
      { awardId: 'AWD-001', scholarshipName: 'ทุนเล่าเรียนหลวง', yearReceived: '2563', startDate: 'ส.ค. 2563', endDate: 'มิ.ย. 2567', degreeLevel: 'ป.ตรี', country: 'สหราชอาณาจักร', university: 'Imperial College London', currentPhase: 'สำเร็จการศึกษา', status: 'completed' },
      { awardId: 'AWD-002', scholarshipName: 'ทุนรัฐบาล (ก.พ.) พัฒนา', yearReceived: '2569', startDate: 'ส.ค. 2569', endDate: 'ก.ค. 2573', degreeLevel: 'ป.เอก', country: 'สหรัฐอเมริกา', university: 'Stanford University', currentPhase: 'ก่อนเดินทาง', status: 'active' },
    ],
  },
  { id: 'SCH-2569-002', title: 'นาย', firstName: 'ธนวัฒน์', lastName: 'เจริญศรี', workGroup: 'นทร.1',
    awards: [{ awardId: 'AWD-003', scholarshipName: 'ทุนรัฐบาล (ก.พ.) ทั่วไป', yearReceived: '2568', startDate: 'ส.ค. 2568', endDate: 'พ.ค. 2570', degreeLevel: 'ป.โท', country: 'ญี่ปุ่น', university: 'University of Tokyo', currentPhase: 'ระหว่างศึกษา', status: 'active' }],
  },
  { id: 'SCH-2569-003', title: 'น.ส.', firstName: 'สิริกัญญา', lastName: 'วงศ์ประดิษฐ์', workGroup: 'นทร.2',
    awards: [{ awardId: 'AWD-004', scholarshipName: 'ทุน KOSEN', yearReceived: '2569', startDate: 'ต.ค. 2569', endDate: 'มี.ค. 2573', degreeLevel: 'ป.ตรี', country: 'ญี่ปุ่น', university: 'National Institute of Technology', currentPhase: 'ก่อนเดินทาง', status: 'active' }],
  },
  { id: 'SCH-2569-004', title: 'นาย', firstName: 'ปรัชญา', lastName: 'คงทอง', workGroup: 'นทร.1',
    awards: [{ awardId: 'AWD-005', scholarshipName: 'ทุน UCAS', yearReceived: '2569', startDate: 'ก.ย. 2569', endDate: 'มิ.ย. 2573', degreeLevel: 'ป.ตรี', country: 'สหราชอาณาจักร', university: 'University of Oxford', currentPhase: 'ก่อนเดินทาง', status: 'active' }],
  },
  { id: 'SCH-2569-005', title: 'น.ส.', firstName: 'ณิชา', lastName: 'ศิริมงคล', workGroup: 'นทร.3',
    awards: [{ awardId: 'AWD-006', scholarshipName: 'ทุน สป.อว. เรียนดี', yearReceived: '2567', startDate: 'ต.ค. 2567', endDate: 'ก.ย. 2569', degreeLevel: 'ป.โท', country: 'เยอรมนี', university: 'TU Munich', currentPhase: 'ระหว่างศึกษา', status: 'active' }],
  },
  { id: 'SCH-2569-006', title: 'นาย', firstName: 'กิตติพงศ์', lastName: 'แสงอรุณ', workGroup: 'นทร.1',
    awards: [{ awardId: 'AWD-007', scholarshipName: 'ทุนเฉลิมพระเกียรติ', yearReceived: '2562', startDate: 'ส.ค. 2562', endDate: 'พ.ค. 2566', degreeLevel: 'ป.เอก', country: 'สหรัฐอเมริกา', university: 'MIT', currentPhase: 'สำเร็จการศึกษา', status: 'completed' }],
  },
  { id: 'SCH-2569-007', title: 'นาย', firstName: 'อภิชาติ', lastName: 'พงศ์ไพศาล', workGroup: 'นทร.4',
    awards: [{ awardId: 'AWD-008', scholarshipName: 'ทุนฝึกอบรม', yearReceived: '2568', startDate: 'ม.ค. 2568', endDate: 'ธ.ค. 2568', degreeLevel: 'ฝึกอบรม', country: 'ฝรั่งเศส', university: 'École Polytechnique', currentPhase: 'ระหว่างศึกษา', status: 'active' }],
  },
  { id: 'SCH-2569-008', title: 'นาย', firstName: 'วรินทร์', lastName: 'สุทธิวงศ์', workGroup: 'นทร.1',
    awards: [
      { awardId: 'AWD-009', scholarshipName: 'ทุน ป.โดดเด่น', yearReceived: '2569', startDate: 'ก.ย. 2569', endDate: 'มิ.ย. 2573', degreeLevel: 'ป.เอก', country: 'สหรัฐอเมริกา', university: 'Caltech', currentPhase: 'ก่อนเดินทาง', status: 'active' },
      { awardId: 'AWD-010', scholarshipName: 'ทุนฝึกอบรม', yearReceived: '2562', startDate: 'ม.ค. 2562', endDate: 'มิ.ย. 2562', degreeLevel: 'ฝึกอบรม', country: 'สวิตเซอร์แลนด์', university: 'ETH Zurich', currentPhase: 'สำเร็จการศึกษา', status: 'completed' },
    ],
  },
];

const phaseColor: Record<string, string> = { 'ก่อนเดินทาง': 'text-blue-700 bg-blue-100 border-blue-200', 'ระหว่างศึกษา': 'text-emerald-700 bg-emerald-100 border-emerald-200', 'สำเร็จการศึกษา': 'text-amber-700 bg-amber-100 border-amber-200' };
const workGroups = ['ทั้งหมด', 'นทร.1', 'นทร.2', 'นทร.3', 'นทร.4'];
const phaseFilters = ['ทั้งหมด', 'ก่อนเดินทาง', 'ระหว่างศึกษา', 'สำเร็จการศึกษา'];

export default function ScholarList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ทั้งหมด');
  const [selectedPhase, setSelectedPhase] = useState('ทั้งหมด');
  const [selectedYear, setSelectedYear] = useState('ทั้งหมด');
  const [showFilters, setShowFilters] = useState(false);

  // Import Excel Dialogs
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importPreviewDialogOpen, setImportPreviewDialogOpen] = useState(false);

  const filtered = mockScholars.filter((s) => {
    // RBAC Filtering for OCSC (OEA_OFFICER)
    if (user?.role === 'oea' && user?.region) {
      const hasAwardInRegion = s.awards.some(a => a.country === user.region);
      if (!hasAwardInRegion) return false;
    }

    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.firstName.includes(q) || s.lastName.includes(q) || s.id.toLowerCase().includes(q) || s.workGroup.toLowerCase().includes(q) ||
      s.awards.some(a => a.scholarshipName.includes(q) || a.university.toLowerCase().includes(q) || a.yearReceived.includes(q));
    const matchGroup = selectedGroup === 'ทั้งหมด' || s.workGroup === selectedGroup;
    const matchPhase = selectedPhase === 'ทั้งหมด' || s.awards.some(a => a.currentPhase === selectedPhase);
    const matchYear = selectedYear === 'ทั้งหมด' || s.awards.some(a => a.yearReceived === selectedYear);
    return matchSearch && matchGroup && matchPhase && matchYear;
  });

  const allAwards = mockScholars.flatMap(s => s.awards);

  return (
    <div className="min-h-full">
      <PageHeader title="รายการนักเรียนทุน" breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'รายการนักเรียนทุน' }]} />
      <div className="p-8 space-y-8">

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">จัดการรายชื่อนักเรียนทุน</h2>
            <p className="text-sm text-gray-500 mt-1">ภาพรวมของนักเรียนทุนทุกระยะ และจัดการข้อมูลต่างๆ</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm">
              <Upload className="w-4 h-4" /> นำเข้าข้อมูล (Excel)
            </Button>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="w-4 h-4" /> เพิ่มนักเรียนทุน
            </Button>
          </div>
        </div>

        {/* Premium Stats Cards (Matching Tracking Page Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card onClick={() => setSelectedPhase('ทั้งหมด')} className={cn("border-2 overflow-hidden relative transition-all duration-300 group cursor-pointer", selectedPhase === 'ทั้งหมด' ? "border-indigo-500 shadow-md bg-indigo-50/50" : "border-transparent bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl")}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700">นักเรียนทุนทั้งหมด</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-indigo-800 bg-clip-text text-transparent mt-1">{mockScholars.length}</p>
                    <p className="text-xs text-indigo-600 mt-1">คน (ทุกสถานะ)</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card onClick={() => setSelectedPhase('ก่อนเดินทาง')} className={cn("border-2 overflow-hidden relative transition-all duration-300 group cursor-pointer", selectedPhase === 'ก่อนเดินทาง' ? "border-blue-500 shadow-md bg-blue-50/50" : "border-transparent bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl")}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">ระยะก่อนเดินทาง</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mt-1">
                      {allAwards.filter(a => a.currentPhase === 'ก่อนเดินทาง' && a.status === 'active').length}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">เตรียมความพร้อม</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Plane className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card onClick={() => setSelectedPhase('ระหว่างศึกษา')} className={cn("border-2 overflow-hidden relative transition-all duration-300 group cursor-pointer", selectedPhase === 'ระหว่างศึกษา' ? "border-emerald-500 shadow-md bg-emerald-50/50" : "border-transparent bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl")}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">ระยะระหว่างศึกษา</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-800 bg-clip-text text-transparent mt-1">
                      {allAwards.filter(a => a.currentPhase === 'ระหว่างศึกษา' && a.status === 'active').length}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">กำลังศึกษา</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card onClick={() => setSelectedPhase('สำเร็จการศึกษา')} className={cn("border-2 overflow-hidden relative transition-all duration-300 group cursor-pointer", selectedPhase === 'สำเร็จการศึกษา' ? "border-amber-500 shadow-md bg-amber-50/50" : "border-transparent bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl")}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-700">สำเร็จการศึกษา</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-amber-600 to-amber-800 bg-clip-text text-transparent mt-1">
                      {allAwards.filter(a => a.currentPhase === 'สำเร็จการศึกษา').length}
                    </p>
                    <p className="text-xs text-amber-700 font-medium mt-1">รอชดใช้ทุน/รายงานตัว</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search + Filters Container */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ค้นหาชื่อ, รหัส, ทุน, มหาวิทยาลัย, หรือปีที่ได้รับทุน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-200 p-1 rounded-full transition-colors"><X className="w-3.5 h-3.5 text-gray-500" /></button>}
            </div>
            <Button variant={showFilters ? 'default' : 'outline'} size="sm" onClick={() => setShowFilters(!showFilters)} className={cn('gap-2 h-[42px] px-5 font-medium transition-all shadow-sm')}>
              <SlidersHorizontal className="w-4 h-4" /> ตัวกรอง
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0, y: -10 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -10 }} className="flex gap-8 p-5 bg-white border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">กลุ่มงานผู้ดูแล</p>
                <div className="flex flex-wrap gap-2">{workGroups.map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)} className={cn('px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all border', selectedGroup === g ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700')}>{g}</button>
                ))}</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ระยะการศึกษา</p>
                <div className="flex flex-wrap gap-2">{phaseFilters.map(p => (
                  <button key={p} onClick={() => setSelectedPhase(p)} className={cn('px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all border', selectedPhase === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-700')}>{p}</button>
                ))}</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ปีที่ได้รับทุน</p>
                <div className="flex flex-wrap gap-2">{['ทั้งหมด', '2569', '2568', '2567', '2566', '2565'].map(y => (
                  <button key={y} onClick={() => setSelectedYear(y)} className={cn('px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all border', selectedYear === y ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700')}>{y}</button>
                ))}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Area */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-gray-300">
                <th className="text-[12px] font-bold text-gray-700 uppercase tracking-wider px-6 py-4 w-[280px]">ข้อมูลนักเรียนทุน</th>
                <th className="text-[12px] font-bold text-gray-700 uppercase tracking-wider px-6 py-4">ทุนที่ได้รับ</th>
                <th className="text-[12px] font-bold text-gray-700 uppercase tracking-wider px-6 py-4 w-[140px] text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => navigate(`/scholars/${s.id}`)}
                  className="group cursor-pointer hover:bg-blue-50/60 transition-colors bg-white">
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0 shadow-sm">
                        {s.firstName.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-tight mb-1">{s.title} {s.firstName} {s.lastName}</p>
                        <Badge variant="outline" className="text-[10px] text-gray-500 font-mono bg-gray-50/50 mb-1 block w-fit">{s.id}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {s.awards.map((a, idx) => {
                        return (
                          <div key={a.awardId} className="flex flex-col xl:flex-row xl:items-center gap-x-2 py-0.5 text-[13.5px] text-gray-700">
                            <div className="flex-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                              <span 
                                className="font-bold text-gray-900 flex items-center gap-1.5 hover:text-indigo-600 hover:underline cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); navigate(`/scholars/${s.id}/awards/${a.awardId}`); }}
                              >
                                <CountryFlag countryName={a.country} />
                                {a.scholarshipName}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="font-medium text-gray-800">{a.degreeLevel}</span>
                              <span className="text-gray-300">•</span>
                              <span>{a.university} ({a.country})</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 flex items-center gap-1.5">
                                ({a.startDate} - {a.endDate})
                                {a.status === 'active' ? (
                                  <Badge className={cn('text-[10px] font-semibold border px-2 py-0 ml-1', phaseColor[a.currentPhase])}>
                                    {a.currentPhase}
                                  </Badge>
                                ) : (
                                  <Badge className="text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0 ml-1">
                                    เสร็จสิ้น
                                  </Badge>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white transition-colors gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> ดูข้อมูล
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-900">ไม่พบข้อมูลนักเรียนทุน</p>
              <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
            </div>
          )}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">แสดงผล <strong>{filtered.length}</strong> จากทั้งหมด <strong>{mockScholars.length}</strong> รายการ</p>
          </div>
        </div>
      </div>

      {/* Import Excel Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 max-h-[85vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Upload className="w-5 h-5" />นำเข้าข้อมูลจาก Template Excel</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">อัปโหลดไฟล์ .xlsx ตาม Template ที่กำหนดเพื่อนำเข้าข้อมูลนักเรียนทุน</DialogDescription>
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

      {/* Import Preview Full-screen Dialog */}
      <Dialog open={importPreviewDialogOpen} onOpenChange={setImportPreviewDialogOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-none sm:w-screen sm:h-screen w-screen h-screen max-h-[100vh] m-0 p-0 sm:p-0 rounded-none border-0 flex flex-col overflow-y-auto bg-gray-50">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between shadow-md z-10 shrink-0">
            <div>
              <DialogTitle className="text-white text-xl flex items-center gap-2"><Upload className="w-6 h-6" />ตรวจสอบข้อมูลนำเข้าจาก Excel</DialogTitle>
              <DialogDescription className="text-emerald-100 mt-1">ระบบตรวจพบข้อมูลซ้ำซ้อน 1 รายการ กรุณาตรวจสอบก่อนยืนยันนำเข้า</DialogDescription>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 px-4 backdrop-blur-sm">
              <div className="text-center"><p className="text-[10px] text-emerald-200 uppercase">พร้อมนำเข้า</p><p className="text-xl font-bold text-white">3</p></div>
              <div className="w-px h-8 bg-white/20 mx-2" />
              <div className="text-center"><p className="text-[10px] text-rose-300 uppercase">พบข้อมูลซ้ำ</p><p className="text-xl font-bold text-rose-400">1</p></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="overflow-x-auto flex-1 relative">
                <Table className="whitespace-nowrap">
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
                </Table>
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
