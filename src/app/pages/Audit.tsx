import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Clock,
  Calendar
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const auditLogs = [
  {
    id: 1,
    timestamp: '20/02/2026 15:30:25',
    user: 'นางสาวพิมพ์พร เจ้าหน้าที่',
    action: 'export',
    target: 'รายงานภาพรวมทุน',
    details: 'ส่งออกรายงาน (PDF) เหตุผล: รายงานประจำเดือน',
    ipAddress: '192.168.1.45',
    status: 'success',
  },
  {
    id: 2,
    timestamp: '20/02/2026 14:15:10',
    user: 'นายสมชาย ผู้จัดการ',
    action: 'approve',
    target: 'APP-2026-001',
    details: 'อนุมัติใบสมัครทุน จำนวนเงิน 5,000,000 บาท',
    ipAddress: '192.168.1.32',
    status: 'success',
  },
  {
    id: 3,
    timestamp: '20/02/2026 13:45:30',
    user: 'นายประยุทธ์ ผู้ดูแลระบบ',
    action: 'edit',
    target: 'User Settings',
    details: 'แก้ไขสิทธิ์ผู้ใช้: เปลี่ยนบทบาทจาก Staff เป็น Approver',
    ipAddress: '192.168.1.10',
    status: 'success',
  },
  {
    id: 4,
    timestamp: '20/02/2026 12:20:15',
    user: 'นางสาววิภา ผู้บริหาร',
    action: 'view',
    target: 'AWD-2026-001',
    details: 'เปิดดูข้อมูลทุน',
    ipAddress: '192.168.1.55',
    status: 'success',
  },
  {
    id: 5,
    timestamp: '20/02/2026 11:30:00',
    user: 'Unknown',
    action: 'login',
    target: 'Authentication',
    details: 'ความพยายามเข้าสู่ระบบล้มเหลว - รหัสผ่านไม่ถูกต้อง',
    ipAddress: '203.154.89.123',
    status: 'failed',
  },
  {
    id: 6,
    timestamp: '20/02/2026 10:15:45',
    user: 'นางสาวพิมพ์พร เจ้าหน้าที่',
    action: 'download',
    target: 'Document-001.pdf',
    details: 'ดาวน์โหลดเอกสารประกอบใบสมัคร',
    ipAddress: '192.168.1.45',
    status: 'success',
  },
  {
    id: 7,
    timestamp: '20/02/2026 09:00:12',
    user: 'นายสมชาย ผู้จัดการ',
    action: 'login',
    target: 'Authentication',
    details: 'เข้าสู่ระบบสำเร็จ',
    ipAddress: '192.168.1.32',
    status: 'success',
  },
];

export default function Audit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'edit': return <Edit className="w-4 h-4 text-yellow-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'export': return <Download className="w-4 h-4 text-purple-600" />;
      case 'download': return <Download className="w-4 h-4 text-cyan-600" />;
      case 'upload': return <Upload className="w-4 h-4 text-green-600" />;
      case 'login': return <LogIn className="w-4 h-4 text-green-600" />;
      case 'logout': return <LogOut className="w-4 h-4 text-gray-600" />;
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const actionMap: any = {
      view: { label: 'ดู', color: 'bg-blue-100 text-blue-700' },
      edit: { label: 'แก้ไข', color: 'bg-yellow-100 text-yellow-700' },
      delete: { label: 'ลบ', color: 'bg-red-100 text-red-700' },
      export: { label: 'ส่งออก', color: 'bg-purple-100 text-purple-700' },
      download: { label: 'ดาวน์โหลด', color: 'bg-cyan-100 text-cyan-700' },
      upload: { label: 'อัปโหลด', color: 'bg-green-100 text-green-700' },
      login: { label: 'เข้าสู่ระบบ', color: 'bg-green-100 text-green-700' },
      logout: { label: 'ออกจากระบบ', color: 'bg-gray-100 text-gray-700' },
      approve: { label: 'อนุมัติ', color: 'bg-green-100 text-green-700' },
    };
    const a = actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-700' };
    return <Badge className={a.color}>{a.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            สำเร็จ
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            ล้มเหลว
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            คำเตือน
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="Audit Log / ตรวจสอบย้อนหลัง"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'Audit Log' },
        ]}
        actions={
          <Button variant="outline" onClick={() => toast.success('ส่งออก Audit Log เรียบร้อย', { description: 'ไฟล์ถูกดาวน์โหลดเรียบร้อยแล้ว' })}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออก Audit Log
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">กิจกรรมวันนี้</p>
                    <p className="text-3xl font-bold text-blue-600">324</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ผู้ใช้ออนไลน์</p>
                    <p className="text-3xl font-bold text-green-600">24</p>
                  </div>
                  <User className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">การส่งออก</p>
                    <p className="text-3xl font-bold text-purple-600">18</p>
                  </div>
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ความพยายามเข้าระบบล้มเหลว</p>
                    <p className="text-3xl font-bold text-red-600">3</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาผู้ใช้ / กิจกรรม / เป้าหมาย"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="ประเภทกิจกรรม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="view">ดู</SelectItem>
                  <SelectItem value="edit">แก้ไข</SelectItem>
                  <SelectItem value="delete">ลบ</SelectItem>
                  <SelectItem value="export">ส่งออก</SelectItem>
                  <SelectItem value="download">ดาวน์โหลด</SelectItem>
                  <SelectItem value="login">เข้าสู่ระบบ</SelectItem>
                  <SelectItem value="approve">อนุมัติ</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="success">สำเร็จ</SelectItem>
                  <SelectItem value="failed">ล้มเหลว</SelectItem>
                  <SelectItem value="warning">คำเตือน</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                ช่วงเวลา
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เวลา</TableHead>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>กิจกรรม</TableHead>
                  <TableHead>เป้าหมาย</TableHead>
                  <TableHead>รายละเอียด</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-blue-50/50">
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {log.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                          {log.user.charAt(3) || 'U'}
                        </div>
                        <span className="font-medium text-sm">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-700">{log.target}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{log.details}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">{log.ipAddress}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Warning Box */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">หมายเหตุความปลอดภัย</p>
                <p className="text-sm text-orange-700 mt-1">
                  Audit Log ถูกบันทึกและเก็บไว้อย่างปลอดภัย ไม่สามารถแก้ไขหรือลบได้
                  เฉพาะผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้นที่สามารถเข้าถึงข้อมูลนี้ได้
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}