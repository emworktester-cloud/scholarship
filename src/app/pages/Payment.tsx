import { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  Plus,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Download,
  Upload,
  File,
  XCircle,
  Check,
  Filter
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { toast } from 'sonner';

const payments = [
  {
    id: 'PAY-2026-001',
    awardId: 'AWD-2026-001',
    recipient: 'นายสมชาย ใจดี',
    installment: 1,
    totalInstallments: 8,
    amount: 625000,
    dueDate: '31 มีนาคม 2026',
    status: 'paid',
    paidDate: '28 มีนาคม 2026',
    condition: 'ส่งรายงานภาคเรียนที่ 1',
    conditionMet: true,
  },
  {
    id: 'PAY-2026-002',
    awardId: 'AWD-2026-001',
    recipient: 'นายสมชาย ใจดี',
    installment: 2,
    totalInstallments: 8,
    amount: 625000,
    dueDate: '30 กันยายน 2026',
    status: 'pending',
    paidDate: null,
    condition: 'ส่งรายงานภาคเรียนที่ 2 + GPA >= 3.0',
    conditionMet: false,
  },
  {
    id: 'PAY-2026-003',
    awardId: 'AWD-2026-002',
    recipient: 'นางสาวสมหญิง รักเรียน',
    installment: 1,
    totalInstallments: 1,
    amount: 2000000,
    dueDate: '15 มิถุนายน 2026',
    status: 'approved',
    paidDate: null,
    condition: 'เริ่มโครงการวิจัย',
    conditionMet: true,
  },
  {
    id: 'PAY-2026-004',
    awardId: 'AWD-2026-001',
    recipient: 'นายสมชาย ใจดี',
    installment: 3,
    totalInstallments: 8,
    amount: 625000,
    dueDate: '31 มีนาคม 2027',
    status: 'scheduled',
    paidDate: null,
    condition: 'ส่งรายงานภาคเรียนที่ 3',
    conditionMet: false,
  },
];

export default function Payment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [planType, setPlanType] = useState('installment');
  const [numInstallments, setNumInstallments] = useState(4);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            จ่ายแล้ว
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Check className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            รอดำเนินการ
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <Calendar className="w-3 h-3 mr-1" />
            ตามแผน
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="แผนจ่ายเงิน/การจ่ายเงิน"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'การจ่ายเงิน' },
        ]}
        actions={
          <div className="flex gap-2">
            <Dialog open={createPlanOpen} onOpenChange={setCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  สร้างแผนจ่ายเงิน
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>สร้างแผนจ่ายเงิน (Payment Plan)</DialogTitle>
                  <DialogDescription>
                    กำหนดแผนการจ่ายเงินสำหรับทุนที่อนุมัติแล้ว
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Award Selection */}
                  <div className="space-y-2">
                    <Label>เลือกทุน</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกทุนที่ต้องการสร้างแผนจ่ายเงิน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awd1">AWD-2026-001 - นายสมชาย ใจดี (5,000,000 บาท)</SelectItem>
                        <SelectItem value="awd2">AWD-2026-002 - นางสาวสมหญิง รักเรียน (2,000,000 บาท)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Plan Type */}
                  <div className="space-y-2">
                    <Label>ประเภทการจ่าย</Label>
                    <Select value={planType} onValueChange={setPlanType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="installment">จ่ายเป็นงวด (Installment)</SelectItem>
                        <SelectItem value="lumpsum">จ่ายเหมาจ่าย (Lump Sum)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {planType === 'installment' && (
                    <>
                      {/* Number of Installments */}
                      <div className="space-y-2">
                        <Label>จำนวนงวด</Label>
                        <div className="flex gap-4 items-center">
                          <Input
                            type="number"
                            value={numInstallments}
                            onChange={(e) => setNumInstallments(Number(e.target.value))}
                            min={2}
                            max={20}
                            className="w-32"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Auto-divide logic
                            }}
                          >
                            แบ่งเท่าๆ กัน
                          </Button>
                        </div>
                      </div>

                      {/* Installment Table */}
                      <div className="space-y-2">
                        <Label>รายละเอียดแต่ละงวด</Label>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-20">งวดที่</TableHead>
                                <TableHead>จำนวนเงิน (บาท)</TableHead>
                                <TableHead>วันที่กำหนดจ่าย</TableHead>
                                <TableHead>เงื่อนไขก่อนจ่าย</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: numInstallments }).map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell className="text-center">{i + 1}</TableCell>
                                  <TableCell>
                                    <Input type="number" placeholder="625000" className="w-full" />
                                  </TableCell>
                                  <TableCell>
                                    <Input type="date" className="w-full" />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      placeholder="เช่น ส่งรายงานภาคเรียน, GPA >= 3.0"
                                      className="w-full"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">ยอดรวมทั้งหมด:</span>
                          <span className="text-xl font-bold text-blue-700">5,000,000 บาท</span>
                        </div>
                        <div className="mt-2 text-sm text-blue-700">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          ยอดรวมต้องเท่ากับวงเงินทุนที่อนุมัติ
                        </div>
                      </div>
                    </>
                  )}

                  {planType === 'lumpsum' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>จำนวนเงิน (บาท)</Label>
                          <Input type="number" placeholder="2000000" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>วันที่กำหนดจ่าย</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>เงื่อนไขก่อนจ่าย</Label>
                        <Textarea placeholder="ระบุเงื่อนไขที่ต้องผ่านก่อนจ่ายเงิน..." />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreatePlanOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={() => { setCreatePlanOpen(false); toast.success('สร้างแผนจ่ายเงินเรียบร้อย', { description: 'แผนจ่ายเงินถูกสร้างและรอการอนุมัติ' }); }}>
                    ยืนยันแผน
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="แผนจ่ายเงิน/การจ่ายเงิน"
          moduleName="payments"
          defaultExpanded={false}
          permissions={[
            {
              permission: 'payments:view',
              label: 'ดูแผนจ่ายเงิน',
              description: 'ดูรายการแผนและประวัติการจ่ายเงินทั้งหมด',
              uiLocation: 'หน้าการจ่ายเงินหลัก',
            },
            {
              permission: 'payments:create',
              label: 'สร้างแผนจ่าย',
              description: 'สร้างแผนการจ่ายเงินสำหรับทุน',
              uiLocation: 'ปุ่ม "สร้างแผนจ่ายเงิน"',
            },
            {
              permission: 'payments:approve',
              label: 'อนุมัติการจ่าย',
              description: 'อนุมัติการจ่ายเงินแต่ละงวด',
              uiLocation: 'ปุ่ม "อนุมัติ"',
            },
            {
              permission: 'payments:record',
              label: 'บันทึกการจ่าย',
              description: 'บันทึกว่าได้จ่ายเงินแล้ว พร้อมแนบหลักฐาน',
              uiLocation: 'ปุ่ม "บันทึกจ่าย"',
            },
            {
              permission: 'payments:edit',
              label: 'แก้ไขแผนจ่าย',
              description: 'แก้ไขแผนการจ่ายเงิน',
              uiLocation: 'ปุ่ม "แก้ไข"',
            },
            {
              permission: 'payments:view_proof',
              label: 'ดูหลักฐานการจ่าย',
              description: 'ดาวน์โหลดหลักฐานการโอนเงิน',
              uiLocation: 'ปุ่ม "หลักฐาน"',
            },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">งบประมาณทั้งหมด</p>
                    <p className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">1.2B</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 via-green-100 to-lime-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">จ่ายแล้ว</p>
                    <p className="text-2xl font-bold bg-gradient-to-br from-green-600 to-lime-600 bg-clip-text text-transparent mt-1">850M</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">70% ของงบประมาณ</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">รอจ่ายเดือนนี้</p>
                    <p className="text-2xl font-bold bg-gradient-to-br from-yellow-600 to-amber-600 bg-clip-text text-transparent mt-1">45M</p>
                    <p className="text-xs text-yellow-600">24 รายการ</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-red-50 via-red-100 to-rose-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">เกินกำหนด</p>
                    <p className="text-2xl font-bold bg-gradient-to-br from-red-600 to-rose-600 bg-clip-text text-transparent mt-1">3</p>
                    <p className="text-xs text-red-600">รายการ</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
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
                  placeholder="ค้นหาการจ่ายเงิน / ชื่อผู้รับทุน / รหัสทุน"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="paid">จ่ายแล้ว</SelectItem>
                  <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                ตัวกรองเพิ่มเติม
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              ทั้งหมด
              <Badge variant="secondary" className="ml-2">156</Badge>
            </TabsTrigger>
            <TabsTrigger value="due-this-month">
              ครบกำหนดเดือนนี้
              <Badge variant="secondary" className="ml-2">24</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              อนุมัติแล้ว
              <Badge variant="secondary" className="ml-2">12</Badge>
            </TabsTrigger>
            <TabsTrigger value="paid">
              จ่ายแล้ว
              <Badge variant="secondary" className="ml-2">98</Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue">
              <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
              เกินกำหนด
              <Badge variant="destructive" className="ml-2">3</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสการจ่าย</TableHead>
                      <TableHead>ผู้รับทุน</TableHead>
                      <TableHead>งวดที่</TableHead>
                      <TableHead>จำนวนเงิน</TableHead>
                      <TableHead>วันครบกำหนด</TableHead>
                      <TableHead>เงื่อนไข</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50"
                      >
                        <TableCell>
                          <span className="font-mono text-sm">{payment.id}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.recipient}</p>
                            <p className="text-xs text-gray-500">{payment.awardId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.installment}/{payment.totalInstallments}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {formatCurrency(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {payment.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1">
                            {payment.conditionMet ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            )}
                            <span className="text-xs text-gray-600">{payment.condition}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {payment.status === 'approved' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    บันทึกจ่าย
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>บันทึกการจ่ายเงิน</DialogTitle>
                                    <DialogDescription>
                                      บันทึกว่าได้จ่ายเงินงวดนี้เรียบร้อยแล้ว
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>วันที่จ่ายเงิน</Label>
                                      <Input type="date" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>แนบหลักฐานการโอนเงิน</Label>
                                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">คลิกเพื่ออัปโหลดไฟล์</p>
                                        <p className="text-xs text-gray-400 mt-1">รองรับ PDF, JPG, PNG</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>หมายเหตุ</Label>
                                      <Textarea placeholder="เพิ่มหมายเหตุ (ถ้ามี)..." />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">ยกเลิก</Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.success('บันทึกการจ่ายเงินเรียบร้อย', { description: 'หลักฐานการโอนเงินถูกบันทึกแล้ว' })}>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      ยืนยันการจ่าย
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {payment.status === 'paid' && (
                              <Button size="sm" variant="outline" onClick={() => toast.success('ดาวน์โหลดหลักฐานการจ่ายเงิน')}>
                                <Download className="w-4 h-4 mr-1" />
                                หลักฐาน
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}