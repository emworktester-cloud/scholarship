import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Search, Plus, Edit, Trash2, Eye, UserPlus, FileText, Heart,
  GraduationCap, Shield, Phone, Mail, MapPin, Calendar, ChevronRight,
  ChevronDown, Filter, Download, Upload, RefreshCw, X, User, Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

// Mock data for scholars
const scholars = [
  {
    id: 'SCH-2025-001',
    prefix: 'นาย',
    firstName: 'สมชาย',
    lastName: 'วงศ์สุวรรณ',
    firstNameEn: 'Somchai',
    lastNameEn: 'Wongsuwan',
    idCard: '1-1001-XXXXX-XX-X',
    birthDate: '15/03/2538',
    gender: 'ชาย',
    email: 'somchai.w@example.com',
    phone: '081-234-5678',
    status: 'กำลังศึกษา',
    scholarships: [
      { name: 'ทุน ก.พ. ปริญญาโท', country: 'สหราชอาณาจักร', level: 'ปริญญาโท', year: 2567 },
      { name: 'ทุน ก.พ. ปริญญาเอก', country: 'สหรัฐอเมริกา', level: 'ปริญญาเอก', year: 2569 },
    ],
    organization: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',
    photo: null,
  },
  {
    id: 'SCH-2025-002',
    prefix: 'นางสาว',
    firstName: 'สุภาพร',
    lastName: 'เจริญศรี',
    firstNameEn: 'Supaporn',
    lastNameEn: 'Charoensri',
    idCard: '1-1002-XXXXX-XX-X',
    birthDate: '22/07/2537',
    gender: 'หญิง',
    email: 'supaporn.c@example.com',
    phone: '089-876-5432',
    status: 'กำลังศึกษา',
    scholarships: [
      { name: 'ทุนพัฒนาบุคลากรภาครัฐ', country: 'ญี่ปุ่น', level: 'ปริญญาเอก', year: 2568 },
    ],
    organization: 'สำนักงานพัฒนาวิทยาศาสตร์ฯ (สวทช.)',
    photo: null,
  },
  {
    id: 'SCH-2025-003',
    prefix: 'นาย',
    firstName: 'วีรพงษ์',
    lastName: 'ธนาพรรณ',
    firstNameEn: 'Weerapong',
    lastNameEn: 'Thanaphan',
    idCard: '1-1003-XXXXX-XX-X',
    birthDate: '05/01/2536',
    gender: 'ชาย',
    email: 'weerapong.t@example.com',
    phone: '092-111-2233',
    status: 'สำเร็จการศึกษา',
    scholarships: [
      { name: 'ทุนรัฐบาลกระทรวงวิทย์', country: 'เยอรมนี', level: 'ปริญญาโท', year: 2565 },
    ],
    organization: 'กรมวิทยาศาสตร์บริการ',
    photo: null,
  },
  {
    id: 'SCH-2025-004',
    prefix: 'นางสาว',
    firstName: 'ปิยะมาศ',
    lastName: 'แสงอรุณ',
    firstNameEn: 'Piyamat',
    lastNameEn: 'Saengarun',
    idCard: '1-1004-XXXXX-XX-X',
    birthDate: '18/09/2539',
    gender: 'หญิง',
    email: 'piyamat.s@example.com',
    phone: '086-444-5566',
    status: 'รอรายงานตัว',
    scholarships: [
      { name: 'ทุน ก.พ. ปริญญาเอก', country: 'ออสเตรเลีย', level: 'ปริญญาเอก', year: 2569 },
    ],
    organization: 'สำนักงาน ก.พ.',
    photo: null,
  },
  {
    id: 'SCH-2025-005',
    prefix: 'นาย',
    firstName: 'ธนากร',
    lastName: 'พิทักษ์ธรรม',
    firstNameEn: 'Thanakorn',
    lastNameEn: 'Pitaktham',
    idCard: '1-1005-XXXXX-XX-X',
    birthDate: '30/11/2535',
    gender: 'ชาย',
    email: 'thanakorn.p@example.com',
    phone: '095-777-8899',
    status: 'ระงับทุน',
    scholarships: [
      { name: 'ทุนพัฒนาข้าราชการ', country: 'สหรัฐอเมริกา', level: 'ปริญญาโท', year: 2566 },
      { name: 'ทุนวิจัยระยะสั้น', country: 'แคนาดา', level: 'วิจัย', year: 2567 },
    ],
    organization: 'กระทรวงการคลัง',
    photo: null,
  },
];

const statusColors: Record<string, string> = {
  'กำลังศึกษา': 'bg-blue-100 text-blue-700',
  'สำเร็จการศึกษา': 'bg-green-100 text-green-700',
  'รอรายงานตัว': 'bg-amber-100 text-amber-700',
  'ระงับทุน': 'bg-red-100 text-red-700',
  'ปิดทุน': 'bg-gray-100 text-gray-700',
  'รอชดใช้ทุน': 'bg-purple-100 text-purple-700',
};

export function ScholarRegistry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<typeof scholars[0] | null>(null);
  const [detailTab, setDetailTab] = useState('personal');
  const [addStep, setAddStep] = useState(1);

  const filteredScholars = scholars.filter(s => {
    const matchSearch = searchQuery === '' ||
      `${s.firstName} ${s.lastName} ${s.firstNameEn} ${s.lastNameEn} ${s.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openDetail = (scholar: typeof scholars[0]) => {
    setSelectedScholar(scholar);
    setDetailTab('personal');
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'นักเรียนทุนทั้งหมด', value: 1247, icon: Users, color: 'blue' },
          { label: 'กำลังศึกษา', value: 438, icon: GraduationCap, color: 'cyan' },
          { label: 'สำเร็จการศึกษา', value: 689, icon: Shield, color: 'green' },
          { label: 'รอรายงานตัว/ระงับ', value: 120, icon: Calendar, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-l-4" style={{ borderLeftColor: `var(--color-${stat.color}-500, #3b82f6)` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              ทะเบียนประวัตินักเรียนทุน
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info('นำเข้าข้อมูลนักเรียนทุน')}>
                <Upload className="w-4 h-4 mr-1" /> นำเข้า
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออกข้อมูลนักเรียนทุน')}>
                <Download className="w-4 h-4 mr-1" /> ส่งออก
              </Button>
              <Dialog open={addDialogOpen} onOpenChange={(open) => { setAddDialogOpen(open); if (!open) setAddStep(1); }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-1" /> เพิ่มนักเรียนทุน
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
                  {/* Add Dialog - Gradient Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-white text-lg">เพิ่มทะเบียนนักเรียนทุนใหม่</DialogTitle>
                        <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลส่วนบุคคลเบื้องต้น สามารถเพิ่มรายละเอียดเพิ่มเติมได้ภายหลัง</DialogDescription>
                      </div>
                    </div>
                    {/* Step Indicators */}
                    <div className="flex items-center gap-3 mt-4">
                      {[
                        { step: 1, label: 'ข้อมูลส่วนตัว' },
                        { step: 2, label: 'ข้อมูลการติดต่อ' },
                        { step: 3, label: 'ห���่วยงาน' },
                      ].map((s, i) => (
                        <div key={s.step} className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            addStep === s.step ? 'bg-white text-blue-700' :
                            addStep > s.step ? 'bg-blue-400 text-white' : 'bg-blue-500/50 text-blue-200'
                          }`}>
                            {addStep > s.step ? '\u2713' : s.step}
                          </div>
                          <span className={`text-xs ${addStep === s.step ? 'text-white font-medium' : 'text-blue-200'}`}>{s.label}</span>
                          {i < 2 && <ChevronRight className="w-4 h-4 text-blue-300" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Dialog Body */}
                  <div className="px-6 py-5 space-y-5 max-h-[55vh] overflow-y-auto">
                    {addStep === 1 && (
                      <div className="space-y-5">
                        <SectionHeader icon={User} title="ข้อมูลส่วนบุคคล" subtitle="กรอกชื่อ-นามสกุล และข้อมูลพื้นฐาน" />
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-600">คำนำหน้า <span className="text-red-500">*</span></Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="นาย">นาย</SelectItem>
                                <SelectItem value="นาง">นาง</SelectItem>
                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">ชื่อ (ไทย) <span className="text-red-500">*</span></Label>
                            <Input placeholder="ชื่อ" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">นามสกุล (ไทย) <span className="text-red-500">*</span></Label>
                            <Input placeholder="นามสกุล" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">ชื่อ (อังกฤษ) <span className="text-red-500">*</span></Label>
                            <Input placeholder="First Name" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">นามสกุล (อังกฤษ) <span className="text-red-500">*</span></Label>
                            <Input placeholder="Last Name" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">เลขบัตรประชาชน <span className="text-red-500">*</span></Label>
                            <Input placeholder="X-XXXX-XXXXX-XX-X" />
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-600">วันเกิด</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">เพศ</Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">ชาย</SelectItem>
                                <SelectItem value="female">หญิง</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                    {addStep === 2 && (
                      <div className="space-y-5">
                        <SectionHeader icon={Phone} title="ข้อมูลการติดต่อ" subtitle="ช่องทางการติดต่อนักเรียนทุน" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-600">โทรศัพท์</Label>
                            <Input placeholder="0XX-XXX-XXXX" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">อีเมล <span className="text-red-500">*</span></Label>
                            <Input placeholder="email@example.com" type="email" />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-gray-600">ที่อยู่ปัจจุบัน</Label>
                            <Textarea placeholder="ที่อยู่ปัจจุบันในประเทศไทย" rows={2} />
                          </div>
                        </div>
                      </div>
                    )}
                    {addStep === 3 && (
                      <div className="space-y-5">
                        <SectionHeader icon={Briefcase} title="หน่วยงานต้นสังกัด" subtitle="เลือกหน่วยงานที่สังกัด" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-600">หน่วยงานต้นสังกัด <span className="text-red-500">*</span></Label>
                            <Select>
                              <SelectTrigger><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">สำนักงาน ก.พ.</SelectItem>
                                <SelectItem value="2">กระทรวงดิจิทัลฯ</SelectItem>
                                <SelectItem value="3">สวทช.</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600">ตำแหน่ง</Label>
                            <Input placeholder="ตำแหน่งในหน่วยงาน" />
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">สรุปข้อมูลก่อนบันทึก</p>
                          <p className="text-xs text-blue-600">กรุณาตรวจสอบข้อมูลทั้งหมดก่อนกดบันทึก หากต้องการแก้ไขสามารถกดย้อนกลับได้</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Dialog Footer */}
                  <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="text-xs text-gray-400">ขั้นตอน {addStep} จาก 3</div>
                    <div className="flex gap-2">
                      {addStep > 1 && (
                        <Button variant="outline" onClick={() => setAddStep(addStep - 1)}>ย้อนกลับ</Button>
                      )}
                      <Button variant="outline" onClick={() => { setAddDialogOpen(false); setAddStep(1); }}>ยกเลิก</Button>
                      {addStep < 3 ? (
                        <Button onClick={() => setAddStep(addStep + 1)} className="bg-blue-600 hover:bg-blue-700">
                          ถัดไป <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button onClick={() => { setAddDialogOpen(false); setAddStep(1); toast.success('เพิ่มทะเบียนนักเรียนทุนใหม่เรียบร้อย'); }} className="bg-green-600 hover:bg-green-700">
                          บันทึก
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาชื่อ นามสกุล รหัสนักเรียนทุน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="สถานะทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="กำลังศึกษา">กำลังศึกษา</SelectItem>
                  <SelectItem value="สำเร็จการศึกษา">สำเร็จการศึกษา</SelectItem>
                  <SelectItem value="รอรายงานตัว">รอรายงานตัว</SelectItem>
                  <SelectItem value="ระงับทุน">ระงับทุน</SelectItem>
                  <SelectItem value="ปิดทุน">ปิดทุน</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">รหัส</TableHead>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>หน่วยงานต้นสังกัด</TableHead>
                    <TableHead>ทุนที่รับ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="w-[120px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScholars.map((scholar, index) => (
                    <motion.tr
                      key={scholar.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="hover:bg-blue-50/50 cursor-pointer"
                      onClick={() => openDetail(scholar)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{scholar.id}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs">
                            {scholar.firstName[0]}
                          </div>
                          <div>
                            <p className="font-medium">{scholar.prefix}{scholar.firstName} {scholar.lastName}</p>
                            <p className="text-xs text-gray-500">{scholar.firstNameEn} {scholar.lastNameEn}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{scholar.organization}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {scholar.scholarships.map((s, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {s.level}
                              </Badge>
                              <span className="text-xs text-gray-500">{s.country}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[scholar.status] || 'bg-gray-100 text-gray-700'}>
                          {scholar.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" onClick={() => openDetail(scholar)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>แสดง {filteredScholars.length} จาก 1,247 รายการ</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" disabled>ก่อนหน้า</Button>
                <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700">1</Button>
                <Button size="sm" variant="outline">2</Button>
                <Button size="sm" variant="outline">3</Button>
                <Button size="sm" variant="outline">...</Button>
                <Button size="sm" variant="outline">125</Button>
                <Button size="sm" variant="outline">ถัดไป</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog - Redesigned */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-5xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          {selectedScholar && (
            <>
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                    {selectedScholar.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-white text-xl">
                      {selectedScholar.prefix}{selectedScholar.firstName} {selectedScholar.lastName}
                    </DialogTitle>
                    <p className="text-blue-100 text-sm mt-0.5">
                      {selectedScholar.id} | {selectedScholar.firstNameEn} {selectedScholar.lastNameEn}
                    </p>
                  </div>
                  <Badge className={`${statusColors[selectedScholar.status]} shadow-lg text-sm px-3 py-1`}>
                    {selectedScholar.status}
                  </Badge>
                </div>
                <DialogDescription className="sr-only">รายละเอียดข้อมูลนักเรียนทุน</DialogDescription>
              </div>

              {/* Custom Tab Navigation */}
              <div className="border-b bg-gray-50/80">
                <div className="flex overflow-x-auto px-2 pt-2 gap-1">
                  {[
                    { value: 'personal', label: 'ข้อมูลส่วนบุคคล', icon: User },
                    { value: 'family', label: 'ครอบครัว/คู่สมรส', icon: Heart },
                    { value: 'education', label: 'ประวัติการศึกษา', icon: GraduationCap },
                    { value: 'scholarships', label: 'ประวัติรับทุน', icon: Briefcase },
                    { value: 'health', label: 'สุขภาพ', icon: Heart },
                    { value: 'contract', label: 'สัญญา/ผู้ค้ำ', icon: FileText },
                    { value: 'namechange', label: 'เปลี่ยนชื่อ', icon: RefreshCw },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setDetailTab(tab.value)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all whitespace-nowrap border border-b-0 ${
                        detailTab === tab.value
                          ? 'bg-white text-blue-700 border-gray-200 shadow-sm relative z-10 -mb-px'
                          : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                {detailTab === 'personal' && (
                  <div className="space-y-5">
                    <SectionHeader icon={User} title="ข้อมูลส่วนบุคคล" subtitle="ข้อมูลทั่วไปและเอกสารระบุตัวตน" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                      <InfoCard label="เลขบัตรประชาชน" value={selectedScholar.idCard} icon={Shield} />
                      <InfoCard label="วันเกิด" value={selectedScholar.birthDate} icon={Calendar} />
                      <InfoCard label="เพศ" value={selectedScholar.gender} icon={User} />
                    </div>
                    <Separator />
                    <SectionHeader icon={Phone} title="ข้อมูลการติดต่อ" subtitle="ช่องทางการสื่อสารและที่อยู่" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                      <InfoCard label="อีเมล" value={selectedScholar.email} icon={Mail} />
                      <InfoCard label="โทรศัพท์" value={selectedScholar.phone} icon={Phone} />
                      <InfoCard label="หน่วยงานต้นสังกัด" value={selectedScholar.organization} icon={Briefcase} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">ที่อยู่ปัจจุบัน</p>
                        </div>
                        <p className="text-sm text-gray-800">123 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กทม. 10900</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">ที่อยู่ต่างประเทศ</p>
                        </div>
                        <p className="text-sm text-gray-800">456 Oxford Rd, London, UK</p>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'family' && (
                  <div className="space-y-5">
                    <SectionHeader icon={Heart} title="ข้อมูลคู่สมรส" subtitle="ข้อมูลสถานภาพสมรส" />
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        <InfoCard label="ชื่อ-นามสกุล" value="- ไม่มีข้อมูล -" muted />
                        <InfoCard label="อาชีพ" value="- ไม่มีข้อมูล -" muted />
                      </div>
                    </div>

                    <SectionHeader icon={Users} title="ข้อมูลครอบครัว (บิดา-มารดา)" subtitle="ข้อมูลผู้ปกครอง" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-blue-800">บิดา</span>
                        </div>
                        <div className="space-y-2">
                          <InfoCard label="ชื่อ-นามสกุล" value="นายสมศักดิ์ วงศ์สุวรรณ" />
                          <InfoCard label="อาชีพ" value="ข้าราชการบำนาญ" />
                        </div>
                      </div>
                      <div className="p-5 bg-pink-50/50 rounded-xl border border-pink-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-pink-600" />
                          </div>
                          <span className="text-sm font-medium text-pink-800">มารดา</span>
                        </div>
                        <div className="space-y-2">
                          <InfoCard label="ชื่อ-นามสกุล" value="นางสมหญิง วงศ์สุวรรณ" />
                          <InfoCard label="อาชีพ" value="แม่บ้าน" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'education' && (
                  <div className="space-y-5">
                    <SectionHeader icon={GraduationCap} title="ประวัติการศึกษา" subtitle="ข้อมูลสถาบันการศึกษาทุกระดับ" />
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>ระดับ</TableHead>
                            <TableHead>สถาบัน</TableHead>
                            <TableHead>สาขา</TableHead>
                            <TableHead>ประเทศ</TableHead>
                            <TableHead>ปีที่จบ</TableHead>
                            <TableHead>GPA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-blue-50/30">
                            <TableCell><Badge variant="outline" className="bg-gray-50">ปริญญาตรี</Badge></TableCell>
                            <TableCell className="font-medium">จุฬาลงกรณ์มหาวิทยาลัย</TableCell>
                            <TableCell>วิศวกรรมคอมพิวเตอร์</TableCell>
                            <TableCell>ไทย</TableCell>
                            <TableCell>2560</TableCell>
                            <TableCell><span className="font-medium text-green-700">3.85</span></TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-blue-50/30">
                            <TableCell><Badge variant="outline" className="bg-gray-50">ปริญญาโท</Badge></TableCell>
                            <TableCell className="font-medium">University of Oxford</TableCell>
                            <TableCell>Computer Science</TableCell>
                            <TableCell>สหราชอาณาจักร</TableCell>
                            <TableCell>2563</TableCell>
                            <TableCell><span className="font-medium text-green-700">Distinction</span></TableCell>
                          </TableRow>
                          <TableRow className="bg-blue-50/40 hover:bg-blue-50/60">
                            <TableCell><Badge className="bg-blue-100 text-blue-700 border border-blue-200">ปริญญาเอก</Badge></TableCell>
                            <TableCell className="font-medium">Stanford University</TableCell>
                            <TableCell>Artificial Intelligence</TableCell>
                            <TableCell>สหรัฐอเมริกา</TableCell>
                            <TableCell><Badge className="bg-amber-100 text-amber-700">กำลังศึกษา</Badge></TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {detailTab === 'scholarships' && (
                  <div className="space-y-5">
                    <SectionHeader icon={Briefcase} title="ประวัติรับทุน" subtitle="รองรับ 1 นักเรียนทุน ต่อหลายทุน และ 1 ระดับการศึกษาสามารถศึกษาได้หลายประเทศ" />
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>ชื่อทุน</TableHead>
                            <TableHead>ประเภท</TableHead>
                            <TableHead>ระดับ</TableHead>
                            <TableHead>ประเทศ</TableHead>
                            <TableHead>ปี พ.ศ.</TableHead>
                            <TableHead>สถานะ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedScholar.scholarships.map((s, i) => (
                            <TableRow key={i} className="hover:bg-blue-50/30">
                              <TableCell className="font-medium">{s.name}</TableCell>
                              <TableCell><Badge variant="outline" className="bg-gray-50">ทุนรัฐบาล</Badge></TableCell>
                              <TableCell>{s.level}</TableCell>
                              <TableCell>{s.country}</TableCell>
                              <TableCell>{s.year}</TableCell>
                              <TableCell><Badge className="bg-blue-100 text-blue-700 border border-blue-200">กำลังศึกษา</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {detailTab === 'health' && (
                  <div className="space-y-5">
                    <SectionHeader icon={Heart} title="ข้อมูลสุขภาพ" subtitle="ข้อมูลสุขภาพและประกัน" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoBox label="หมู่โลหิต" value="O" highlight />
                      <InfoBox label="โรคประจำตัว" value="ไม่มี" />
                      <InfoBox label="อาการแพ้" value="ไม่มี" />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <p className="text-xs text-green-700 font-medium uppercase tracking-wide">ประกันสุขภาพ</p>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">ประกันสุขภาพจากทุน</p>
                        <p className="text-xs text-gray-500 mt-1">มีผลถึง 31/12/2570</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-amber-600" />
                          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">ผู้ติดต่อฉุกเฉิน</p>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">นางสมหญิง วงศ์สุวรรณ (มารดา)</p>
                        <p className="text-xs text-gray-500 mt-1">โทร. 089-111-2233</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">โรงพยาบาลที่รักษาตัว</p>
                      </div>
                      <p className="text-sm text-gray-800 font-medium">โรงพยาบาลจุฬาลงกรณ์</p>
                    </div>
                  </div>
                )}

                {detailTab === 'contract' && (
                  <div className="space-y-5">
                    <SectionHeader icon={FileText} title="สัญญารับทุน" subtitle="ข้อมูลสัญญาและเงื่อนไขการรับทุน" />
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>เลขสัญญา</TableHead>
                            <TableHead>ชื่อทุน</TableHead>
                            <TableHead>วันลงนาม</TableHead>
                            <TableHead>ระยะชดใช้</TableHead>
                            <TableHead>สถานะ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-blue-50/30">
                            <TableCell><Badge variant="outline" className="font-mono bg-gray-50">CTR-2567-0045</Badge></TableCell>
                            <TableCell className="font-medium">ทุน ก.พ. ปริญญาโท</TableCell>
                            <TableCell>15/06/2567</TableCell>
                            <TableCell>2 เท่าของระยะเวลารับทุน</TableCell>
                            <TableCell><Badge className="bg-green-100 text-green-700 border border-green-200">มีผลบังคับ</Badge></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <SectionHeader icon={Shield} title="ผู้ค้ำประกัน" subtitle="รายชื่อผู้ค้ำประกันตามสัญญา" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">1</div>
                          <span className="text-sm font-medium text-gray-700">ผู้ค้ำประกันคนที่ 1</span>
                        </div>
                        <div className="space-y-2">
                          <InfoCard label="ชื่อ-นามสกุล" value="นายสมศักดิ์ วงศ์สุวรรณ (บิดา)" />
                          <InfoCard label="ความสัมพันธ์" value="บิดา" />
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">2</div>
                          <span className="text-sm font-medium text-gray-700">ผู้ค้ำประกันคนที่ 2</span>
                        </div>
                        <div className="space-y-2">
                          <InfoCard label="ชื่อ-นามสกุล" value="นางสาวสมใจ วงศ์สุวรรณ (พี่สาว)" />
                          <InfoCard label="ความสัมพันธ์" value="พี่น้อง" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'namechange' && (
                  <div className="space-y-5">
                    <SectionHeader icon={RefreshCw} title="ประวัติการเปลี่ยนชื่อ" subtitle="บันทึกการเปลี่ยนชื่อ-นามสกุล" />
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>วันที่เปลี่ยน</TableHead>
                            <TableHead>ชื่อเดิม</TableHead>
                            <TableHead>ชื่อใหม่</TableHead>
                            <TableHead>เหตุผล</TableHead>
                            <TableHead>เอกสาร</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-blue-50/30">
                            <TableCell>10/06/2565</TableCell>
                            <TableCell className="text-gray-500">สมชาย ทองดี</TableCell>
                            <TableCell className="font-medium">สมชาย วงศ์สุวรรณ</TableCell>
                            <TableCell>เปลี่ยนนามสกุลตามบิดา</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <FileText className="w-3 h-3 mr-1" /> ดูเอกสาร
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>

              {/* Dialog Footer */}
              <div className="border-t bg-gray-50 px-6 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-400">อัปเดตล่าสุด: 24/02/2569 เวลา 14:30 น.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDetailDialogOpen(false)}>ปิด</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-1" /> แก้ไขข้อมูล
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Helper Components =====

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pb-2">
      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
        <Icon className="w-[18px] h-[18px] text-blue-600" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon, muted }: { label: string; value: string; icon?: React.ElementType; muted?: boolean }) {
  return (
    <div className="py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="w-3 h-3 text-gray-400" />}
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-sm ${muted ? 'text-gray-400 italic' : 'text-gray-800 font-medium'}`}>{value}</p>
    </div>
  );
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-red-700' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
