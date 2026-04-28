import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database, Plus, Search, Upload, Download, Award, Settings,
  GraduationCap, Building, Users, MapPin, Scale, FileText,
  ChevronRight, Landmark, Globe, BookOpen, Tag, Edit, Trash2
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

// Sub-module components
import { ScholarRegistry } from './master-data/ScholarRegistry';
import { ScholarshipSources } from './master-data/ScholarshipSources';
import { GovernmentOrgs } from './master-data/GovernmentOrgs';
import { ProvincesDistricts } from './master-data/ProvincesDistricts';
import { RepaymentConditions } from './master-data/RepaymentConditions';
import { OtherMasterData } from './master-data/OtherMasterData';

// Internal menu structure
const masterDataMenu = [
  {
    group: 'ข้อมูลนักเรียนทุน',
    items: [
      { id: 'scholar-registry', label: 'ทะเบียนประวัตินักเรียนทุน', icon: Users, description: 'ข้อมูลส่วนบุคคล ครอบครัว การศึกษา สุขภาพ สัญญา', badge: '1,247' },
      { id: 'scholarship-sources', label: 'แหล่งทุน/ข้อมูลการรับทุน', icon: Award, description: 'แหล่งทุน ชื่อทุน ประเภททุน หน่วยงานต้นสังกัด', badge: '28' },
      { id: 'repayment', label: 'เงื่อนไขชดใช้ทุน', icon: Scale, description: 'เงื่อนไขการชดใช้ทุน การติดตาม', badge: '6' },
    ],
  },
  {
    group: 'หน่วยงานและตำแหน่ง',
    items: [
      { id: 'gov-orgs', label: 'หน่วยงาน/ตำแหน่งข้าราชการ', icon: Building, description: 'หน่วยงานราชการ ตำแหน่ง ระดับข้าราชการ', badge: '128' },
      { id: 'provinces', label: 'จังหวัด/อำเภอ/ประเทศ', icon: MapPin, description: 'จังหวัด อำเภอ ตำบล ประเทศ', badge: '77' },
    ],
  },
  {
    group: 'ข้อมูลการศึกษา',
    items: [
      { id: 'scholarships', label: 'ประเภททุน', icon: GraduationCap, description: 'ประเภททุนการศึกษาในระบบ', badge: '9' },
      { id: 'universities', label: 'สถาบันการศึกษา', icon: Landmark, description: 'มหาวิทยาลัย สถาบันต่างประเทศ', badge: '245' },
      { id: 'departments', label: 'สาขาวิชา', icon: BookOpen, description: 'สาขาและหมวดหมู่วิชา', badge: '128' },
    ],
  },
  {
    group: 'ข้อมูลระบบ',
    items: [
      { id: 'statuses', label: 'สถานะระบบ', icon: Settings, description: 'สถานะต่างๆ ที่ใช้ในระบบ', badge: '11' },
      { id: 'other', label: 'ข้อมูลอ้างอิงอื่นๆ', icon: Database, description: 'ระดับการศึกษา สกุลเงิน ภาษา เอกสาร', badge: '58' },
    ],
  },
];

// Legacy data for the original tabs that are still simple enough to keep inline
const scholarshipTypes = [
  { id: 1, name: 'ทุนการศึกษาระดับปริญญาเอก', code: 'PHD', status: 'active', description: 'ทุนสำหรับศึกษาระดับปริญญาเอก', updatedDate: '15 ม.ค. 2026', updatedBy: 'admin' },
  { id: 2, name: 'ทุนการศึกษาระดับปริญญาโท', code: 'MASTER', status: 'active', description: 'ทุนสำหรับศึกษาระดับปริญญาโท', updatedDate: '15 ม.ค. 2026', updatedBy: 'admin' },
  { id: 3, name: 'ทุนวิจัย', code: 'RESEARCH', status: 'active', description: 'ทุนสำหรับการวิจัย', updatedDate: '15 ม.ค. 2026', updatedBy: 'admin' },
  { id: 4, name: 'ทุนฝึกอบรม', code: 'TRAINING', status: 'active', description: 'ทุนสำหรับการฝึกอบรม', updatedDate: '15 ม.ค. 2026', updatedBy: 'admin' },
  { id: 5, name: 'ทุนพัฒนาบุคลากร', code: 'DEV', status: 'active', description: 'ทุนพัฒนาบุคลากรภาครัฐ', updatedDate: '10 ม.ค. 2026', updatedBy: 'admin' },
  { id: 6, name: 'ทุนโครงการพิเศษ', code: 'SPECIAL', status: 'active', description: 'ทุนโครงการพิเศษตามนโยบาย', updatedDate: '10 ม.ค. 2026', updatedBy: 'admin' },
  { id: 7, name: 'ทุนแลกเปลี่ยน', code: 'EXCHANGE', status: 'active', description: 'ทุนแลกเปลี่ยนนักศึกษา', updatedDate: '05 ม.ค. 2026', updatedBy: 'admin' },
  { id: 8, name: 'ทุนดุษฎีบัณฑิต', code: 'POSTDOC', status: 'active', description: 'ทุนหลังปริญญาเอก', updatedDate: '05 ม.ค. 2026', updatedBy: 'admin' },
  { id: 9, name: 'ทุนวิจัยหลังปริญญา', code: 'POSTGRAD', status: 'inactive', description: 'ทุนวิจัยหลังปริญญา (เลิกใช้แล้ว)', updatedDate: '01 ม.ค. 2025', updatedBy: 'admin' },
];

const statuses = [
  { id: 1, name: 'ร่าง', code: 'DRAFT', color: '#9ca3af', description: 'สถานะร่าง', order: 1 },
  { id: 2, name: 'ส่งแล้ว', code: 'SUBMITTED', color: '#3b82f6', description: 'ส่งใบสมัครแล้ว', order: 2 },
  { id: 3, name: 'รอตรวจเอกสาร', code: 'CHECKING', color: '#f59e0b', description: 'รอเจ้าหน้าที่ตรวจ', order: 3 },
  { id: 4, name: 'ขอข้อมูลเพิ่ม', code: 'REQUESTING', color: '#f97316', description: 'ขอข้อมูลเพิ่มจากผู้สมัคร', order: 4 },
  { id: 5, name: 'รอพิจารณา', code: 'REVIEWING', color: '#8b5cf6', description: 'รอคณะกรรมการพิจารณา', order: 5 },
  { id: 6, name: 'รออนุมัติ', code: 'APPROVING', color: '#6366f1', description: 'รอผู้มีอำนาจอนุมัติ', order: 6 },
  { id: 7, name: 'อนุมัติ', code: 'APPROVED', color: '#10b981', description: 'อนุมัติแล้ว', order: 7 },
  { id: 8, name: 'ไม่อนุมัติ', code: 'REJECTED', color: '#ef4444', description: 'ไม่อนุมัติ', order: 8 },
  { id: 9, name: 'ติดตามผล', code: 'TRACKING', color: '#06b6d4', description: 'ติดตามระหว่างศึกษา', order: 9 },
  { id: 10, name: 'ระงับ', code: 'SUSPENDED', color: '#dc2626', description: 'ระงับทุน', order: 10 },
  { id: 11, name: 'ปิดทุน', code: 'CLOSED', color: '#64748b', description: 'ปิดทุนแล้ว', order: 11 },
];

const universities = [
  { id: 1, name: 'Stanford University', country: 'สหรัฐอเมริกา', ranking: 3, verified: true },
  { id: 2, name: 'MIT', country: 'สหรัฐอเมริกา', ranking: 1, verified: true },
  { id: 3, name: 'University of Oxford', country: 'สหราชอาณาจักร', ranking: 2, verified: true },
  { id: 4, name: 'University of Cambridge', country: 'สหราชอาณาจักร', ranking: 4, verified: true },
  { id: 5, name: 'ETH Zurich', country: 'สวิตเซอร์แลนด์', ranking: 7, verified: true },
  { id: 6, name: 'University of Tokyo', country: 'ญี่ปุ่น', ranking: 12, verified: true },
  { id: 7, name: 'National University of Singapore', country: 'สิงคโปร์', ranking: 8, verified: true },
  { id: 8, name: 'University of Melbourne', country: 'ออสเตรเลีย', ranking: 14, verified: true },
];

const departments = [
  { id: 1, name: 'วิศวกรรมคอมพิวเตอร์', category: 'วิศวกรรมศาสตร์', active: true },
  { id: 2, name: 'วิศวกรรมไฟฟ้า', category: 'วิศวกรรมศาสตร์', active: true },
  { id: 3, name: 'วิศวกรรมเครื่องกล', category: 'วิศวกรรมศาสตร์', active: true },
  { id: 4, name: 'แพทยศาสตร์', category: 'แพทยศาสตร์', active: true },
  { id: 5, name: 'เศรษฐศาสตร์', category: 'สังคมศาสตร์', active: true },
  { id: 6, name: 'วิทยาการคอมพิวเตอร์', category: 'วิทยาศาสตร์', active: true },
  { id: 7, name: 'ปัญญาประดิษฐ์', category: 'วิทยาศาสตร์', active: true },
  { id: 8, name: 'ชีววิทยา', category: 'วิทยาศาสตร์', active: true },
];

export default function MasterData() {
  const [activeSection, setActiveSection] = useState('scholar-registry');
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'scholar-registry':
        return <ScholarRegistry />;
      case 'scholarship-sources':
        return <ScholarshipSources />;
      case 'repayment':
        return <RepaymentConditions />;
      case 'gov-orgs':
        return <GovernmentOrgs />;
      case 'provinces':
        return <ProvincesDistricts />;
      case 'scholarships':
        return <ScholarshipTypesSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} addDialogOpen={addDialogOpen} setAddDialogOpen={setAddDialogOpen} />;
      case 'universities':
        return <UniversitiesSection />;
      case 'departments':
        return <DepartmentsSection />;
      case 'statuses':
        return <StatusesSection />;
      case 'other':
        return <OtherMasterData />;
      default:
        return <ScholarRegistry />;
    }
  };

  // Find current section info
  const currentItem = masterDataMenu.flatMap(g => g.items).find(i => i.id === activeSection);

  return (
    <div className="min-h-full">
      <PageHeader
        title="ข้อมูลหลัก (Master Data)"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'ข้อมูลหลัก' },
          ...(currentItem ? [{ label: currentItem.label }] : []),
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.info('เปิดหน้านำเข้าข้อมูล')}>
              <Upload className="h-4 w-4" />
              นำเข้า
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.success('ส่งออกข้อมูลหลักเรียบร้อย')}>
              <Download className="h-4 w-4" />
              ส่งออก
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="ข้อมูลอ้างอิง (Master Data)"
          moduleName="master_data"
          defaultExpanded={false}
          permissions={[
            { permission: 'master_data:view', label: 'ดูข้อมูลอ้างอิง', description: 'ดูข้อมูล Master Data ทั้งหมด', uiLocation: 'หน้า Master Data หลัก' },
            { permission: 'master_data:create', label: 'เพิ่มข้อมูลอ้างอิง', description: 'เพิ่มข้อมูลใหม่ในตาราง Master', uiLocation: 'ปุ่ม "เพิ่มข้อมูล"' },
            { permission: 'master_data:edit', label: 'แก้ไขข้อมูลอ้างอิง', description: 'แก้ไขข้อมูล Master Data', uiLocation: 'ปุ่ม "แก้ไข"' },
            { permission: 'master_data:delete', label: 'ลบข้อมูลอ้างอิง', description: 'ลบข้อมูลออกจากตาราง Master', uiLocation: 'ปุ่ม "ลบ"' },
            { permission: 'master_data:import', label: 'นำเข้าข้อมูล', description: 'นำเข้าข้อมูลจากไฟล์ Excel/CSV', uiLocation: 'ปุ่ม "นำเข้า"' },
            { permission: 'master_data:export', label: 'ส่งออกข้อมูล', description: 'ส่งออกข้อมูล Master Data', uiLocation: 'ปุ่ม "ส่งออก"' },
          ]}
        />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6 mt-6">
          {/* Left Sidebar Navigation */}
          <div className="w-[280px] flex-shrink-0">
            <Card className="sticky top-6">
              <CardContent className="p-3">
                <nav className="space-y-4">
                  {masterDataMenu.map((group) => (
                    <div key={group.group}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                        {group.group}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = activeSection === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm',
                                isActive
                                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <item.icon className={cn(
                                'w-4 h-4 flex-shrink-0',
                                isActive ? 'text-blue-600' : 'text-gray-400'
                              )} />
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'truncate',
                                  isActive ? 'font-medium' : ''
                                )}>
                                  {item.label}
                                </p>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs flex-shrink-0',
                                    isActive ? 'border-blue-300 text-blue-600' : 'text-gray-400'
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Inline sub-sections for simpler data ============

function ScholarshipTypesSection({
  searchQuery, setSearchQuery, addDialogOpen, setAddDialogOpen
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (v: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            ประเภททุน (รวม {scholarshipTypes.length} ประเภท)
          </CardTitle>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-2" />เพิ่มประเภททุน</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เพิ่มประเภททุนใหม่</DialogTitle>
                <DialogDescription>กรอกข้อมูลประเภททุนที่ต้องการเพิ่มเข้าระบบ</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>รหัสประเภททุน</Label><Input placeholder="เช่น PHD, MASTER" /></div>
                <div className="space-y-2"><Label>ชื่อประเภททุน</Label><Input placeholder="เช่น ทุนการศึกษาระดับปริญญาเอก" /></div>
                <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea placeholder="รายละเอียดประเภททุน..." /></div>
                <div className="space-y-2">
                  <Label>สถานะ</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>ยกเลิก</Button>
                <Button onClick={() => { setAddDialogOpen(false); toast.success('เพิ่มประเภททุนใหม่เรียบร้อย'); }}>บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="ค้นหาประเภททุน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัส</TableHead>
                  <TableHead>ชื่อประเภททุน</TableHead>
                  <TableHead>คำอธิบาย</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>อัปเดตล่าสุด</TableHead>
                  <TableHead>โดย</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholarshipTypes.map((item) => (
                  <TableRow key={item.id} className="hover:bg-blue-50/50">
                    <TableCell><Badge variant="outline" className="font-mono">{item.code}</Badge></TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className={item.status === 'active' ? 'bg-green-100 text-green-700' : ''}>
                        {item.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{item.updatedDate}</TableCell>
                    <TableCell className="text-sm text-gray-600">{item.updatedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusesSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            สถานะระบบ (รวม {statuses.length} สถานะ)
          </CardTitle>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />เพิ่มสถานะ</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ลำดับ</TableHead>
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อสถานะ</TableHead>
                <TableHead>คำอธิบาย</TableHead>
                <TableHead>สี</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status) => (
                <TableRow key={status.id} className="hover:bg-blue-50/50">
                  <TableCell className="text-center">{status.order}</TableCell>
                  <TableCell><Badge variant="outline" className="font-mono">{status.code}</Badge></TableCell>
                  <TableCell className="font-medium">{status.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{status.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border" style={{ backgroundColor: status.color }} />
                      <span className="text-sm font-mono">{status.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function UniversitiesSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-600" />
            สถาบันการศึกษา ({universities.length} สถาบัน)
          </CardTitle>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />เพิ่มสถาบัน</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="ค้นหาสถาบัน..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="ประเทศ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="us">สหรัฐอเมริกา</SelectItem>
                <SelectItem value="uk">สหราชอาณาจักร</SelectItem>
                <SelectItem value="jp">ญี่ปุ่น</SelectItem>
                <SelectItem value="au">ออสเตรเลีย</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อสถาบัน</TableHead>
                  <TableHead>ประเทศ</TableHead>
                  <TableHead>อันดับโลก</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni, i) => (
                  <motion.tr
                    key={uni.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-blue-50/50"
                  >
                    <TableCell className="font-medium">{uni.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {uni.country}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">อันดับ {uni.ranking}</Badge></TableCell>
                    <TableCell>
                      {uni.verified && (
                        <Badge className="bg-green-100 text-green-700">ยืนยันแล้ว</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost"><Database className="w-4 h-4" /></Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            สาขาวิชา ({departments.length} สาขา)
          </CardTitle>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />เพิ่มสาขาวิชา</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="ค้นหาสาขาวิชา..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="eng">วิศวกรรมศาสตร์</SelectItem>
                <SelectItem value="sci">วิทยาศาสตร์</SelectItem>
                <SelectItem value="med">แพทยศาสตร์</SelectItem>
                <SelectItem value="soc">สังคมศาสตร์</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อสาขา</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept, i) => (
                  <motion.tr
                    key={dept.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-blue-50/50"
                  >
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell><Badge variant="outline">{dept.category}</Badge></TableCell>
                    <TableCell>
                      <Badge className={dept.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                        {dept.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}