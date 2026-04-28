import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Download, Calendar, Lock, Filter, Award,
  DollarSign, TrendingUp, Clock, Shield, BarChart3,
  CheckCircle, FileSpreadsheet, Search, Sliders, Users,
  GraduationCap, Globe, BookOpen, Eye, Printer, Hash,
  Briefcase, Building, Target, PieChart as PieChartIcon,
  LineChart as LineChartIcon, AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { toast } from 'sonner';

// Sub-components
import OverviewDashboard from './reports/OverviewDashboard';
import ScholarProgress from './reports/ScholarProgress';
import IndividualHistory from './reports/IndividualHistory';
import TrendAnalysis from './reports/TrendAnalysis';
import ExportAuditTrail from './reports/ExportAuditTrail';

// ===== Custom Report Templates =====
const reportTemplates = [
  { id: 1, name: 'รายงานภาพรวมทุน', description: 'สรุปจำนวนทุน งบประมาณ และสถานะทุนทั้งหมด', category: 'ภาพรวม', icon: Award, color: 'blue', features: ['กราฟสัดส่วนทุนแต่ละประเภท', 'สถิติการอนุมัติ', 'งบประมาณที่ใช้'] },
  { id: 2, name: 'รายงานสถานะใบสมัคร', description: 'ติดตามสถานะใบสมัครทุนในแต่ละขั้นตอน', category: 'คำขอ', icon: FileText, color: 'green', features: ['Funnel การสมัคร', 'อัตราอนุมัติ', 'ระยะเวลาเฉลี่ย'] },
  { id: 3, name: 'รายงานการจ่ายเงิน', description: 'รายงานการจ่ายเงินทุนทั้งหมด แยกตามประเภทและงวด', category: 'การเงิน', icon: DollarSign, color: 'cyan', features: ['จ่ายเงินตามงวด', 'งบประมาณคงเหลือ', 'แผน vs จริง'] },
  { id: 4, name: 'รายงานติดตามผลการศึกษา', description: 'สรุปผลการเรียน GPA และความก้าวหน้าของผู้รับทุน', category: 'ติดตามผล', icon: TrendingUp, color: 'purple', features: ['GPA เฉลี่ย', 'อัตราส่งรายงานตรงเวลา', 'Traffic Light'] },
  { id: 5, name: 'รายงานงานเกิน SLA', description: 'รายการงานที่เกินกำหนดเวลา SLA', category: 'SLA', icon: Clock, color: 'red', features: ['งานล่าช้า', 'สถิติเกิน SLA', 'Escalate'] },
  { id: 6, name: 'รายงานสถานะการชดใช้ทุน', description: 'สรุปการชดใช้ทุนราชการ จำนวนวัน ผู้ชดใช้ครบ/ค้าง', category: 'ชดใช้ทุน', icon: Briefcase, color: 'amber', features: ['จำนวนวันชดใช้', 'สถานะรายบุคคล', 'ผิดสัญญา'] },
  { id: 7, name: 'รายงานแยกตามแหล่งทุน/ประเทศ', description: 'สถิตินักเรียนทุนแยกตามแหล่งทุน ประเทศ สาขาวิชา', category: 'สถิติ', icon: Globe, color: 'indigo', features: ['แยกแหล่งทุน', 'แยกประเทศ', 'แยกสาขา'] },
  { id: 8, name: 'รายงานเชิงวิเคราะห์แนวโน้ม', description: 'แนวโน้มสาขาวิชา อัตราความสำเร็จ การชดใช้ทุน', category: 'วิเคราะห์', icon: BarChart3, color: 'emerald', features: ['แนวโน้มสาขา', 'อัตราสำเร็จ', 'Predictive'] },
];

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: 'text-cyan-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
  red: { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' },
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<(typeof reportTemplates)[0] | null>(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [passwordProtect, setPasswordProtect] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [exportReason, setExportReason] = useState('');

  // Custom report filters
  const [filterYear, setFilterYear] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterServiceStatus, setFilterServiceStatus] = useState('');
  const [filterRequestStatus, setFilterRequestStatus] = useState('');

  const openExportDialog = (template: (typeof reportTemplates)[0]) => {
    setSelectedReport(template);
    setExportDialogOpen(true);
    setExportReason('');
    setPasswordProtect(true);
    setWatermark(true);
  };

  const handleExport = () => {
    if (!exportReason.trim()) {
      toast.error('กรุณาระบุเหตุผลการส่งออก');
      return;
    }
    setExportDialogOpen(false);
    toast.success(`สร้างรายงาน "${selectedReport?.name}" เรียบร้อย`, {
      description: `รูปแบบ: ${exportFormat.toUpperCase()} | รหัสผ่าน: ${passwordProtect ? 'มี' : 'ไม่มี'} | ลายน้ำ: ${watermark ? 'มี' : 'ไม่มี'}`,
    });
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="รายงานและแดชบอร์ด"
        breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'รายงานและแดชบอร์ด' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('พิมพ์หน้ารายงาน')}><Printer className="w-4 h-4 mr-2" />พิมพ์</Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="รายงานและแดชบอร์ด"
          moduleName="reports"
          defaultExpanded={false}
          permissions={[
            { permission: 'reports:view', label: 'ดูรายงาน', description: 'ดูแดชบอร์ดภาพรวมและรายงานทั้งหมด', uiLocation: 'หน้ารายงานหลัก' },
            { permission: 'reports:generate', label: 'สร้างรายงาน', description: 'สร้างรายงานจากเทมเพลตหรือปรับแต่งเอง', uiLocation: 'Tab "รายงานปรับแต่ง"' },
            { permission: 'reports:export', label: 'ส่งออกรายงาน', description: 'ส่งออกเป็น PDF/Excel พร้อมรหัสผ่านและลายน้ำ', uiLocation: 'Dialog ส่งออก' },
            { permission: 'reports:individual', label: 'ดูประวัติรายบุคคล', description: 'ค้นหาและดูประวัตินักเรียนทุนรายบุคคล (PII)', uiLocation: 'Tab "ประวัติรายบุคคล"' },
            { permission: 'reports:trend', label: 'วิเคราะห์แนวโน้ม', description: 'ดูรายงานเชิงวิเคราะห์แนวโน้ม', uiLocation: 'Tab "วิเคราะห์แนวโน้ม"' },
            { permission: 'reports:view_audit', label: 'ดู Audit Trail', description: 'ดูประวัติการเข้าถึงรายงานและการส่งออก', uiLocation: 'Tab "Audit Trail"' },
            { permission: 'reports:schedule', label: 'ตั้งเวลารายงาน', description: 'กำหนดเวลาส่งรายงานอัตโนมัติ', uiLocation: 'ปุ่มตั้งเวลา' },
          ]}
        />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview"><PieChartIcon className="w-4 h-4 mr-1.5" />ภาพรวมสถิติ</TabsTrigger>
            <TabsTrigger value="progress"><GraduationCap className="w-4 h-4 mr-1.5" />ความก้าวหน้า/ชดใช้ทุน</TabsTrigger>
            <TabsTrigger value="custom"><Sliders className="w-4 h-4 mr-1.5" />รายงานปรับแต่ง</TabsTrigger>
            <TabsTrigger value="individual"><Search className="w-4 h-4 mr-1.5" />ประวัติรายบุคคล</TabsTrigger>
            <TabsTrigger value="trend"><LineChartIcon className="w-4 h-4 mr-1.5" />วิเคราะห์แนวโน้ม</TabsTrigger>
            <TabsTrigger value="audit"><Shield className="w-4 h-4 mr-1.5" />Audit Trail</TabsTrigger>
          </TabsList>

          {/* ===== TAB: OVERVIEW ===== */}
          <TabsContent value="overview">
            <OverviewDashboard />
          </TabsContent>

          {/* ===== TAB: SCHOLAR PROGRESS ===== */}
          <TabsContent value="progress">
            <ScholarProgress />
          </TabsContent>

          {/* ===== TAB: CUSTOM REPORTS ===== */}
          <TabsContent value="custom" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'เทมเพลตรายงาน', value: reportTemplates.length, icon: FileText, bg: 'from-blue-50 to-indigo-100', gbg: 'from-blue-500 to-indigo-500' },
                { label: 'ส่งออกเดือนนี้', value: 142, icon: Download, bg: 'from-green-50 to-emerald-100', gbg: 'from-green-500 to-emerald-500' },
                { label: 'รายงานยอดนิยม', value: 'ภาพรวมทุน', icon: BarChart3, bg: 'from-purple-50 to-violet-100', gbg: 'from-purple-500 to-violet-500', isText: true },
                { label: 'มีการเข้ารหัส', value: '89%', icon: Lock, bg: 'from-orange-50 to-amber-100', gbg: 'from-orange-500 to-amber-500' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`border-0 bg-gradient-to-br ${c.bg} hover:shadow-xl transition-all`}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{c.label}</p>
                          <p className={`${(c as any).isText ? 'text-sm font-medium mt-2' : 'text-2xl font-bold mt-1'}`}>{c.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gbg} flex items-center justify-center shadow-lg`}><c.icon className="w-6 h-6 text-white" /></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Filters */}
            <Card className="border-blue-200">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2"><Filter className="w-5 h-5 text-blue-600" />เงื่อนไขรายงานแบบปรับแต่ง</CardTitle>
                <CardDescription>กำหนดเงื่อนไขเพื่อสร้างรายงานตามความต้องการ</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">ปีงบประมาณ</Label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger><SelectValue placeholder="ทุกปี" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกปี</SelectItem><SelectItem value="2569">2569</SelectItem><SelectItem value="2568">2568</SelectItem><SelectItem value="2567">2567</SelectItem><SelectItem value="2566">2566</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">แหล่งทุน</Label>
                    <Select value={filterSource} onValueChange={setFilterSource}>
                      <SelectTrigger><SelectValue placeholder="ทุกแหล่ง" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกแหล่ง</SelectItem><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem><SelectItem value="china">ทุนรัฐบาลจีน</SelectItem><SelectItem value="japan">ทุน MEXT</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">ประเทศ</Label>
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                      <SelectTrigger><SelectValue placeholder="ทุกประเทศ" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกประเทศ</SelectItem><SelectItem value="uk">สหราชอาณาจักร</SelectItem><SelectItem value="us">สหรัฐอเมริกา</SelectItem><SelectItem value="jp">ญี่ปุ่น</SelectItem><SelectItem value="au">ออสเตรเลีย</SelectItem><SelectItem value="de">เยอรมนี</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">สถานะชดใช้ทุน</Label>
                    <Select value={filterServiceStatus} onValueChange={setFilterServiceStatus}>
                      <SelectTrigger><SelectValue placeholder="ทุกสถานะ" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="studying">กำลังศึกษา</SelectItem><SelectItem value="serving">ชดใช้ทุน</SelectItem><SelectItem value="completed">ชดใช้ครบ</SelectItem><SelectItem value="defaulted">ผิดสัญญา</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">สถานะคำขอ</Label>
                    <Select value={filterRequestStatus} onValueChange={setFilterRequestStatus}>
                      <SelectTrigger><SelectValue placeholder="ทุกสถานะ" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="pending">รออนุมัติ</SelectItem><SelectItem value="approved">อนุมัติ</SelectItem><SelectItem value="rejected">ปฏิเสธ</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Templates Grid */}
            <div>
              <h3 className="text-base font-semibold mb-4">เลือกเทมเพลตรายงาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTemplates.map((template, index) => {
                  const Icon = template.icon;
                  const cm = colorMap[template.color] || colorMap.blue;
                  return (
                    <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className={`w-10 h-10 rounded-lg ${cm.bg} flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${cm.icon}`} />
                            </div>
                            <Badge variant="outline" className="text-[9px]">{template.category}</Badge>
                          </div>
                          <CardTitle className="text-sm mt-3">{template.name}</CardTitle>
                          <CardDescription className="text-xs">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-1 mb-3">
                            {template.features.map((f, idx) => (
                              <li key={idx} className="text-[11px] text-gray-500 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" />{f}</li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => openExportDialog(template)}><Download className="w-3.5 h-3.5 mr-1" />ส่งออก</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.info(`แสดงตัวอย่าง "${template.name}"`)}><Eye className="w-3.5 h-3.5" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ===== TAB: INDIVIDUAL ===== */}
          <TabsContent value="individual">
            <IndividualHistory />
          </TabsContent>

          {/* ===== TAB: TREND ===== */}
          <TabsContent value="trend">
            <TrendAnalysis />
          </TabsContent>

          {/* ===== TAB: AUDIT TRAIL ===== */}
          <TabsContent value="audit">
            <ExportAuditTrail />
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Export Dialog ===== */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Download className="w-5 h-5" />ส่งออกรายงาน: {selectedReport?.name}</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">เลือกตัวกรอง รูปแบบไฟล์ และการตั้งค่าความปลอดภัยก่อนส่งออก</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {/* Filters */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-600" />ตัวกรองข้อมูล</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">ช่วงเวลา</Label>
                  <Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="this-month">เดือนนี้</SelectItem><SelectItem value="this-quarter">ไตรมาสนี้</SelectItem><SelectItem value="this-year">ปีนี้</SelectItem><SelectItem value="custom">กำหนดเอง</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">ประเภททุน</Label>
                  <Select><SelectTrigger><SelectValue placeholder="ทุกประเภท" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกประเภท</SelectItem><SelectItem value="phd">ปริญญาเอก</SelectItem><SelectItem value="master">ปริญญาโท</SelectItem><SelectItem value="training">ฝึกอบรม</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">แหล่งทุน</Label>
                  <Select><SelectTrigger><SelectValue placeholder="ทุกแหล่ง" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกแหล่ง</SelectItem><SelectItem value="ocsc">ทุน ก.พ.</SelectItem><SelectItem value="ministry">ทุนกระทรวง</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">สถานะ</Label>
                  <Select><SelectTrigger><SelectValue placeholder="ทุกสถานะ" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="active">กำลังศึกษา</SelectItem><SelectItem value="completed">สำเร็จแล้ว</SelectItem><SelectItem value="serving">ชดใช้ทุน</SelectItem></SelectContent></Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Export Format */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-green-600" />รูปแบบไฟล์</h4>
              <div className="flex gap-3">
                {[
                  { id: 'pdf', label: 'PDF', desc: 'แนะนำ - พร้อมลายน้ำ' },
                  { id: 'excel', label: 'Excel', desc: 'แก้ไขข้อมูลได้' },
                  { id: 'csv', label: 'CSV', desc: 'ข้อมูลดิบ' },
                ].map(fmt => (
                  <div key={fmt.id} className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all ${exportFormat === fmt.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`} onClick={() => setExportFormat(fmt.id)}>
                    <div className="flex items-center gap-2"><input type="radio" checked={exportFormat === fmt.id} readOnly className="w-4 h-4" /><Label className="font-medium cursor-pointer">{fmt.label}</Label></div>
                    <p className="text-[10px] text-gray-500 ml-6">{fmt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Security */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-orange-600" />การรักษาความปลอดภัย</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-orange-600" />
                    <div><Label className="font-medium">ตั้งรหัสผ่านไฟล์ (Password Protection)</Label><p className="text-xs text-gray-500">ป้องกันการเปิดไฟล์โดยไม่ได้รับอนุญาต</p></div>
                  </div>
                  <Switch checked={passwordProtect} onCheckedChange={setPasswordProtect} />
                </div>
                {passwordProtect && (
                  <div className="ml-12 space-y-1.5"><Label className="text-xs">รหัสผ่าน</Label><Input type="password" placeholder="อย่างน้อย 8 ตัวอักษร" /></div>
                )}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div><Label className="font-medium">ใส่ลายน้ำ (Watermark)</Label><p className="text-xs text-gray-500">แสดงชื่อผู้ส่งออกและวันที่บนทุกหน้า</p></div>
                  </div>
                  <Switch checked={watermark} onCheckedChange={setWatermark} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Reason */}
            <div>
              <Label className="text-sm font-semibold text-red-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" />เหตุผลการส่งออก (บังคับ) *</Label>
              <Textarea placeholder="ระบุเหตุผลที่ต้องการส่งออกรายงานนี้..." className="mt-2 min-h-20 border-red-200" value={exportReason} onChange={(e) => setExportReason(e.target.value)} />
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><Shield className="w-3 h-3" />การส่งออกทุกครั้งจะถูกบันทึกใน Audit Log พร้อมเหตุผล ชื่อผู้ส่งออก IP และเวลา</p>
            </div>

            {/* Warning */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900 text-sm">คำเตือนด้านความปลอดภัย</p>
                  <ul className="text-xs text-orange-700 mt-1.5 space-y-1">
                    <li>• การส่งออกจะถูกบันทึกพร้อมตัวตนผู้ใช้ในระบบ Audit Trail</li>
                    <li>• ลายน้ำจะแสดงชื่อผู้ส่งออก วันที่ เวลา บนทุกหน้าอัตโนมัติ</li>
                    <li>• ห้ามเปิดเผยข้อมูลส่วนบุคคล (PII) หรือข้อมูลราชการลับ</li>
                    <li>• กรุณาลบไฟล์เมื่อใช้งานเสร็จแล้ว</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-cyan-600"><Download className="w-4 h-4 mr-2" />ยืนยันส่งออก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
