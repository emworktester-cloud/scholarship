import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Plus,
  Search,
  Filter,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Send,
  File,
  User,
  Building
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { DatePicker } from '../components/ui/date-picker';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

const awards = [
  {
    id: 'AWD-2026-001',
    recipient: 'นายสมชาย ใจดี',
    scholarshipType: 'ทุนการศึกษาระดับปริญญาเอก',
    amount: 5000000,
    duration: '4 ปี',
    startDate: '1 สิงหาคม 2026',
    endDate: '31 กรกฎาคม 2030',
    status: 'active',
    paymentType: 'installment',
    contractStatus: 'signed',
    university: 'Stanford University',
    createdDate: '15/02/2569',
  },
  {
    id: 'AWD-2026-002',
    recipient: 'นางสาวสมหญิง รักเรียน',
    scholarshipType: 'ทุนวิจัย',
    amount: 2000000,
    duration: '2 ปี',
    startDate: '1 มิถุนายน 2026',
    endDate: '31 พฤษภาคม 2028',
    status: 'active',
    paymentType: 'lumpsum',
    contractStatus: 'pending',
    university: 'MIT',
    createdDate: '10/02/2569',
  },
  {
    id: 'AWD-2026-003',
    recipient: 'นายประยุทธ์ ขยัน',
    scholarshipType: 'ทุนฝึกอบรม',
    amount: 500000,
    duration: '6 เดือน',
    startDate: '1 มีนาคม 2026',
    endDate: '31 สิงหาคม 2026',
    status: 'completed',
    paymentType: 'lumpsum',
    contractStatus: 'signed',
    university: 'University of Oxford',
    createdDate: '05/02/2569',
  },
];

export default function Awards() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/guarantor')) return 'guarantor';
    return 'all';
  });
  
  useEffect(() => {
    if (location.pathname.includes('/guarantor')) {
      setActiveTab('guarantor');
    } else {
      setActiveTab('all');
    }
  }, [location.pathname]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (val === 'guarantor') navigate('/finance/guarantor', { replace: true });
    else navigate('/finance', { replace: true });
  };
  
  const [paymentType, setPaymentType] = useState('installment');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">กำลังศึกษา</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">สำเร็จการศึกษา</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700">ระงับ</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getContractBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return (
          <Badge variant="outline" className="border-green-200 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            ลงนามแล้ว
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-200 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            รอลงนาม
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="ทุน/สัญญา"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'ทุน/สัญญา' },
        ]}
        actions={
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                สร้างทุนใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl">
              {/* Sticky Header with Premium Design Pattern */}
              <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-slate-50/80 to-white sticky top-0 z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 backdrop-blur-md">
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-2xl"></div>
                    <div className="relative w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-blue-100 shadow-sm">
                      <Award className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-3">
                      <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                        สร้างทุนใหม่ (Award Setup)
                      </DialogTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        ร่าง (Draft)
                      </Badge>
                    </div>
                    <DialogDescription className="text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                      กำหนดรายละเอียดและเงื่อนไขของทุนการศึกษาที่ได้รับการอนุมัติอย่างครบถ้วน
                    </DialogDescription>
                  </div>
                </div>
                
                <div className="flex items-center self-start">
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 shadow-sm bg-white hover:bg-slate-50 rounded-lg">
                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                    คู่มือการกรอก
                  </Button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto bg-slate-50/50 space-y-8">
                {/* Section 1: Recipient Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg">ข้อมูลผู้รับทุน</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">รหัสใบสมัคร</Label>
                      <Input placeholder="เช่น APP-2026-001" className="h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">ชื่อ-นามสกุล</Label>
                      <Input placeholder="ระบุโดยอัตโนมัติจากใบสมัคร" disabled className="h-11 border-slate-300 bg-slate-50 text-slate-700 shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Award Details */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg">รายละเอียดทุนการศึกษา</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">ประเภททุน <span className="text-red-500">*</span></Label>
                      <Select>
                        <SelectTrigger className="h-11 border-slate-300 bg-white shadow-sm focus:ring-blue-600">
                          <SelectValue placeholder="เลือกประเภททุน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phd">ทุนการศึกษาระดับปริญญาเอก</SelectItem>
                          <SelectItem value="master">ทุนการศึกษาระดับปริญญาโท</SelectItem>
                          <SelectItem value="research">ทุนวิจัย</SelectItem>
                          <SelectItem value="training">ทุนฝึกอบรม</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">สถาบันการศึกษา</Label>
                      <Input placeholder="เช่น Stanford University" className="h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">วงเงินรวม (บาท) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="number" placeholder="5000000" className="pl-9 h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">ระยะเวลาทุน (ปี/เดือน)</Label>
                      <Input placeholder="เช่น 4 ปี" className="h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">วันที่เริ่มต้น</Label>
                      <DatePicker className="h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">วันที่สิ้นสุด</Label>
                      <DatePicker className="h-11 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Payment & Tracking */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg">การเบิกจ่ายและรอบติดตาม</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">ประเภทการจ่ายเงิน</Label>
                      <Select value={paymentType} onValueChange={setPaymentType}>
                        <SelectTrigger className="h-11 border-slate-300 bg-white shadow-sm focus:ring-blue-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="installment">จ่ายเป็นงวด (Installment)</SelectItem>
                          <SelectItem value="lumpsum">จ่ายเหมาจ่าย (Lump Sum)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">รอบติดตามผลการศึกษา</Label>
                      <Select>
                        <SelectTrigger className="h-11 border-slate-300 bg-white shadow-sm focus:ring-blue-600">
                          <SelectValue placeholder="เลือกรอบติดตาม" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semester">รายภาค (Semester)</SelectItem>
                          <SelectItem value="year">รายปี (Yearly)</SelectItem>
                          <SelectItem value="quarter">รายไตรมาส (Quarterly)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Move alert box outside of the grid to span full width */}
                  {paymentType === 'installment' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-5 bg-indigo-50/80 rounded-xl border border-indigo-200 flex items-start gap-4 mt-4"
                    >
                      <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-indigo-900 leading-relaxed">
                        <span className="font-semibold block mb-1">สร้างแผนการเบิกจ่ายทีหลัง</span>
                        เมื่อเลือกแบบ "จ่ายเป็นงวด" ระบบจะนำคุณไปสู่หน้าจอสร้างตารางเบิกจ่ายหลังจากที่ทุนนี้ถูกบันทึกเรียบร้อยแล้ว
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Section 4: Conditions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg">เงื่อนไขสำคัญเพิ่มเติม</h3>
                  </div>
                  <Textarea
                    placeholder="ระบุเงื่อนไขพิเศษของทุน เช่น ต้องรักษาระดับผลการเรียนเฉลี่ย (GPA) ไม่ต่ำกว่า 3.00, มีภาระผูกพันการทำงานชดใช้ทุน, ข้อกำหนดอื่นๆ..."
                    className="min-h-32 border-slate-300 bg-white shadow-sm focus-visible:ring-blue-600 resize-y p-4 text-sm"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-3 justify-end items-center">
                <Button variant="ghost" onClick={() => setCreateDialogOpen(false)} className="text-slate-600 hover:text-slate-900 font-medium h-11 px-6 rounded-xl">
                  ยกเลิก
                </Button>
                <Button 
                  onClick={() => { setCreateDialogOpen(false); toast.success('สร้างทุนใหม่เรียบร้อย', { description: 'รหัสทุน AWD-2026-004 ถูกสร้างเรียบร้อยแล้ว' }); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-medium h-11 px-8 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  บันทึกข้อมูลทุน
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-8 space-y-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="ทุน/สัญญา"
          moduleName="awards"
          defaultExpanded={false}
          permissions={[
            {
              permission: 'awards:view',
              label: 'ดูรายการทุน',
              description: 'ดูรายการทุนที่กำลังดำเนินการทั้งหมด',
              uiLocation: 'หน้าทุน/สัญญาหลัก',
            },
            {
              permission: 'awards:create',
              label: 'สร้างทุนใหม่',
              description: 'สร้างทุนใหม่สำหรับผู้สมัครที่ผ่านการอนุมัติ',
              uiLocation: 'ปุ่ม "สร้างทุนใหม่"',
            },
            {
              permission: 'awards:edit',
              label: 'แก้ไขทุน',
              description: 'แก้ไขข้อมูลทุน/สัญญา',
              uiLocation: 'ปุ่ม "แก้ไข"',
            },
            {
              permission: 'awards:suspend',
              label: 'ระงับทุน',
              description: 'ระงับทุนชั่วคราวหรือถาวร',
              uiLocation: 'เมนู Actions > ระงับ',
            },
            {
              permission: 'contracts:view',
              label: 'ดูสัญญา',
              description: 'ดูเอกสารสัญญาทุน',
              uiLocation: 'Tab "รอลงนามสัญญา"',
            },
            {
              permission: 'contracts:create',
              label: 'สร้างสัญญา',
              description: 'สร้างเอกสารสัญญาใหม่',
              uiLocation: 'ปุ่ม "สร้างสัญญา"',
            },
            {
              permission: 'payments:view',
              label: 'ดูแผนจ่ายเงิน',
              description: 'ดูแผนการจ่ายเงินทุน',
              uiLocation: 'หน้ารายละเอียดทุน > Tab จ่ายเงิน',
            },
            {
              permission: 'payments:create',
              label: 'สร้างแผนจ่าย',
              description: 'สร้างแผนการจ่ายเงินทุน',
              uiLocation: 'ปุ่ม "สร้างแผนจ่าย"',
            },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">ทุนที่กำลังศึกษา</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">245</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">งบประมาณรวม</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">1.2B</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">รอลงนามสัญญา</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-yellow-600 to-amber-600 bg-clip-text text-transparent mt-1">12</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/40">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-4 border-l-gray-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">สำเร็จการศึกษา</p>
                    <p className="text-3xl font-bold text-gray-600">89</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาทุน / ชื่อผู้รับทุน / รหัสทุน"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="ประเภททุน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="phd">ปริญญาเอก</SelectItem>
                  <SelectItem value="master">ปริญญาโท</SelectItem>
                  <SelectItem value="research">วิจัย</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="active">กำลังศึกษา</SelectItem>
                  <SelectItem value="suspended">ระงับ</SelectItem>
                  <SelectItem value="completed">สำเร็จ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              ทั้งหมด
              <Badge variant="secondary" className="ml-2">346</Badge>
            </TabsTrigger>
            <ProtectedTabsTrigger value="active" permission="awards:view">
              กำลังศึกษา
              <Badge variant="secondary" className="ml-2">245</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="pending-contract" permission="contracts:view">
              รอลงนามสัญญา
              <Badge variant="secondary" className="ml-2">12</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="completed" permission="awards:view">
              สำเร็จการศึกษา
              <Badge variant="secondary" className="ml-2">89</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="guarantor" permission="contracts:view">
              ข้อมูลผู้ค้ำประกัน
              <Badge variant="secondary" className="ml-2">120</Badge>
            </ProtectedTabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสทุน</TableHead>
                      <TableHead>ผู้รับทุน</TableHead>
                      <TableHead>ประเภททุน</TableHead>
                      <TableHead>สถาบัน</TableHead>
                      <TableHead>วงเงิน</TableHead>
                      <TableHead>ระยะเวลา</TableHead>
                      <TableHead>สถานะทุน</TableHead>
                      <TableHead>สัญญา</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awards.map((award, index) => (
                      <motion.tr
                        key={award.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50"
                      >
                        <TableCell>
                          <span className="font-mono font-medium">{award.id}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                              {award.recipient.charAt(3)}
                            </div>
                            <span className="font-medium">{award.recipient}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{award.scholarshipType}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Building className="w-3 h-3" />
                            {award.university}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {formatCurrency(award.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{award.duration}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(award.status)}</TableCell>
                        <TableCell>{getContractBadge(award.contractStatus)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/awards/${award.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                ดู
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="guarantor">
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                <User className="w-10 h-10 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">ข้อมูลผู้ค้ำประกัน</h3>
                <p className="mt-2">ฟังก์ชันนี้อยู่ระหว่างการพัฒนา จะแสดงรายชื่อผู้ค้ำประกัน สัญญา และสถานะการค้ำประกันทั้งหมด</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}