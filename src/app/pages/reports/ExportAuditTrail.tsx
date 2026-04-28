import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Clock, Download, Search, User, FileText, Eye, AlertTriangle,
  Lock, CheckCircle, XCircle, Filter, Calendar, Globe, Smartphone,
  Monitor, Hash, Info, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: 'view' | 'export' | 'print';
  reportName: string;
  reportType: string;
  format: string;
  dataScope: string;
  recordCount: number;
  hasPassword: boolean;
  hasWatermark: boolean;
  reason: string;
  ip: string;
  device: string;
  time: string;
  risk: 'low' | 'medium' | 'high';
}

const auditLogs: AuditLog[] = [
  { id: 'RA-001', user: 'นายประสิทธิ์ ผู้ดูแล', role: 'ADMIN', action: 'export', reportName: 'รายงานภาพรวมทุน', reportType: 'overview', format: 'PDF', dataScope: 'ทุกปีงบประมาณ', recordCount: 1200, hasPassword: true, hasWatermark: true, reason: 'จัดทำรายงานประจำปีเสนอผู้บริหาร', ip: '192.168.1.100', device: 'Chrome / Windows', time: '24 ก.พ. 2569 15:30', risk: 'low' },
  { id: 'RA-002', user: 'นางสาวพิมพ์พร เจ้าหน้าที่', role: 'STAFF', action: 'export', reportName: 'รายงานสถานะใบสมัคร', reportType: 'application', format: 'Excel', dataScope: 'ปี 2569', recordCount: 342, hasPassword: true, hasWatermark: true, reason: 'ตรวจสอบสถานะคำขอค้างรอ', ip: '192.168.1.45', device: 'Safari / macOS', time: '24 ก.พ. 2569 14:15', risk: 'low' },
  { id: 'RA-003', user: 'นายสมศักดิ์ ผู้จัดการ', role: 'MANAGER', action: 'export', reportName: 'รายงานประวัติรายบุคคล', reportType: 'individual', format: 'PDF', dataScope: 'ข้อมูลบุคคล (PII)', recordCount: 1, hasPassword: true, hasWatermark: true, reason: 'ตรวจสอบประวัติเพื่อพิจารณาต่อสัญญา', ip: '192.168.1.50', device: 'Chrome / Windows', time: '24 ก.พ. 2569 10:45', risk: 'medium' },
  { id: 'RA-004', user: 'นางสาวรัตนา การเงิน', role: 'FINANCE', action: 'export', reportName: 'รายงานการจ่ายเงิน', reportType: 'payment', format: 'Excel', dataScope: 'ปี 2569 Q1', recordCount: 450, hasPassword: true, hasWatermark: true, reason: 'จัดทำรายงานประจำไตรมาส', ip: '192.168.1.92', device: 'Edge / Windows', time: '24 ก.พ. 2569 09:00', risk: 'low' },
  { id: 'RA-005', user: 'นายสมศักดิ์ ผู้จัดการ', role: 'MANAGER', action: 'export', reportName: 'รายงานข้อมูลนักเรียนทุนทั้งหมด', reportType: 'bulk', format: 'Excel', dataScope: 'ข้อมูลส่วนบุคคลรวม (PII)', recordCount: 1200, hasPassword: false, hasWatermark: true, reason: 'จัดทำสถิติภายใน', ip: '192.168.1.50', device: 'Chrome / Windows', time: '23 ก.พ. 2569 16:00', risk: 'high' },
  { id: 'RA-006', user: 'ศ.ดร.วิภา นักวิชาการ', role: 'REVIEWER', action: 'view', reportName: 'รายงานติดตามผลการศึกษา', reportType: 'tracking', format: '-', dataScope: 'ปี 2568-2569', recordCount: 680, hasPassword: false, hasWatermark: false, reason: 'ดูข้อมูลเพื่อประกอบการพิจารณา', ip: '10.0.0.55', device: 'Chrome / macOS', time: '23 ก.พ. 2569 14:30', risk: 'low' },
  { id: 'RA-007', user: 'นายประสิทธิ์ ผู้ดูแล', role: 'ADMIN', action: 'export', reportName: 'รายงานการเข้าถึง (Audit)', reportType: 'audit', format: 'PDF', dataScope: 'เดือน ก.พ. 2569', recordCount: 250, hasPassword: true, hasWatermark: true, reason: 'ตรวจสอบ Compliance ประจำเดือน', ip: '192.168.1.100', device: 'Chrome / Windows', time: '23 ก.พ. 2569 11:00', risk: 'low' },
  { id: 'RA-008', user: 'นางสาวพิมพ์พร เจ้าหน้าที่', role: 'STAFF', action: 'print', reportName: 'ใบสมัครรายบุคคล', reportType: 'individual', format: 'PDF (Print)', dataScope: 'ข้อมูลบุคคล (PII)', recordCount: 1, hasPassword: false, hasWatermark: true, reason: 'พิมพ์เพื่อจัดเก็บตามระเบียบ', ip: '192.168.1.45', device: 'Safari / macOS', time: '22 ก.พ. 2569 15:00', risk: 'medium' },
  { id: 'RA-009', user: 'นายวิชัย สมบูรณ์', role: 'EXEC', action: 'view', reportName: 'แดชบอร์ดผู้บริหาร', reportType: 'overview', format: '-', dataScope: 'ภาพรวมทั้งหมด', recordCount: 0, hasPassword: false, hasWatermark: false, reason: 'ดูภาพรวมตัดสินใจ', ip: '192.168.1.1', device: 'Chrome / Windows', time: '22 ก.พ. 2569 09:30', risk: 'low' },
  { id: 'RA-010', user: 'นางสาวกนกวรรณ นักวิเคราะห์', role: 'STAFF', action: 'export', reportName: 'รายงานวิเคราะห์แนวโน้ม', reportType: 'trend', format: 'Excel', dataScope: '7 ปี (2563-2569)', recordCount: 850, hasPassword: true, hasWatermark: true, reason: 'จัดทำเอกสารนโยบาย', ip: '192.168.1.78', device: 'Firefox / Ubuntu', time: '21 ก.พ. 2569 10:00', risk: 'low' },
];

const accessByDay = [
  { day: '18 ก.พ.', views: 15, exports: 5, prints: 2 },
  { day: '19 ก.พ.', views: 18, exports: 8, prints: 1 },
  { day: '20 ก.พ.', views: 22, exports: 6, prints: 3 },
  { day: '21 ก.พ.', views: 20, exports: 9, prints: 2 },
  { day: '22 ก.พ.', views: 25, exports: 7, prints: 4 },
  { day: '23 ก.พ.', views: 30, exports: 12, prints: 3 },
  { day: '24 ก.พ.', views: 28, exports: 10, prints: 2 },
];

const riskConfig = {
  low: { label: 'ต่ำ', bg: 'bg-green-100', text: 'text-green-700' },
  medium: { label: 'ปานกลาง', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  high: { label: 'สูง', bg: 'bg-red-100', text: 'text-red-700' },
};

const actionConfig = {
  view: { label: 'ดูรายงาน', bg: 'bg-blue-100', text: 'text-blue-700', icon: Eye },
  export: { label: 'ส่งออก', bg: 'bg-green-100', text: 'text-green-700', icon: Download },
  print: { label: 'พิมพ์', bg: 'bg-purple-100', text: 'text-purple-700', icon: FileText },
};

export default function ExportAuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(l => {
    if (riskFilter !== 'all' && l.risk !== riskFilter) return false;
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.user.toLowerCase().includes(q) || l.reportName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
    }
    return true;
  });

  const highRiskCount = auditLogs.filter(l => l.risk === 'high').length;
  const exportsToday = auditLogs.filter(l => l.time.includes('24 ก.พ.') && l.action === 'export').length;
  const piiAccess = auditLogs.filter(l => l.dataScope.includes('PII')).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'เข้าถึงวันนี้', value: 6, icon: Eye, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
          { label: 'ส่งออกวันนี้', value: exportsToday, icon: Download, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
          { label: 'เสี่ยงสูง', value: highRiskCount, icon: AlertTriangle, bg: 'from-red-500 to-rose-500', bgL: 'from-red-50 to-rose-50' },
          { label: 'เข้าถึง PII', value: piiAccess, icon: Shield, bg: 'from-orange-500 to-amber-500', bgL: 'from-orange-50 to-amber-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                  <div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Access Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600" />สถิติการเข้าถึงรายงาน (7 วันล่าสุด)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={accessByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" name="ดูรายงาน" fill="#3b82f6" />
              <Bar dataKey="exports" name="ส่งออก" fill="#10b981" />
              <Bar dataKey="prints" name="พิมพ์" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search/Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="ค้นหาผู้ใช้ รายงาน รหัส..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
            <Select value={actionFilter} onValueChange={setActionFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="การกระทำ" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="view">ดูรายงาน</SelectItem><SelectItem value="export">ส่งออก</SelectItem><SelectItem value="print">พิมพ์</SelectItem></SelectContent></Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="ความเสี่ยง" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="high">สูง</SelectItem><SelectItem value="medium">ปานกลาง</SelectItem><SelectItem value="low">ต่ำ</SelectItem></SelectContent></Select>
            <Button variant="outline" onClick={() => toast.success('ส่งออก Audit Log')}><Download className="w-4 h-4 mr-1" />ส่งออก</Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เวลา</TableHead>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>การกระทำ</TableHead>
                <TableHead>รายงาน/ขอบเขตข้อมูล</TableHead>
                <TableHead>รูปแบบ</TableHead>
                <TableHead>ความปลอดภัย</TableHead>
                <TableHead>เหตุผล</TableHead>
                <TableHead>ความเสี่ยง</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, i) => {
                const ac = actionConfig[log.action];
                const rc = riskConfig[log.risk];
                const ActionIcon = ac.icon;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`hover:bg-blue-50/50 ${log.risk === 'high' ? 'bg-red-50/30' : ''}`}>
                    <TableCell className="whitespace-nowrap"><p className="text-xs font-mono">{log.time}</p><p className="text-[10px] text-gray-400">{log.ip}</p></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7"><AvatarFallback className="bg-blue-500 text-white text-[8px]">{log.user.slice(0, 2)}</AvatarFallback></Avatar>
                        <div><p className="text-xs font-medium">{log.user}</p><Badge variant="outline" className="text-[9px]">{log.role}</Badge></div>
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`text-[10px] ${ac.bg} ${ac.text} border`}><ActionIcon className="w-3 h-3 mr-0.5" />{ac.label}</Badge></TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">{log.reportName}</p>
                      <p className="text-[10px] text-gray-500">{log.dataScope}</p>
                      {log.recordCount > 0 && <p className="text-[10px] text-gray-400">{log.recordCount.toLocaleString()} รายการ</p>}
                    </TableCell>
                    <TableCell>{log.format !== '-' ? <Badge variant="outline" className="text-[10px]">{log.format}</Badge> : <span className="text-[10px] text-gray-400">-</span>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {log.hasPassword ? <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><Lock className="w-3 h-3 mr-0.5" />รหัสผ่าน</Badge> : log.action === 'export' && <Badge className="bg-red-100 text-red-700 text-[9px] border border-red-200"><XCircle className="w-3 h-3 mr-0.5" />ไม่มี</Badge>}
                        {log.hasWatermark && <Badge className="bg-blue-100 text-blue-700 text-[9px] border border-blue-200"><FileText className="w-3 h-3 mr-0.5" />ลายน้ำ</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]"><p className="text-xs text-gray-600 truncate" title={log.reason}>{log.reason}</p></TableCell>
                    <TableCell><Badge className={`text-[10px] ${rc.bg} ${rc.text}`}>{rc.label}</Badge></TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3"><Shield className="w-5 h-5 text-orange-600 mt-0.5" /><div>
            <p className="text-sm font-semibold text-orange-800">นโยบายการส่งออกข้อมูล</p>
            <ul className="text-xs text-orange-700 mt-1.5 space-y-1">
              <li>• การส่งออกทุกครั้งจะถูกบันทึกพร้อมข้อมูลผู้ใช้ เวลา IP และเหตุผล</li>
              <li>• ไฟล์ที่ส่งออกจะมีลายน้ำ (Watermark) ระบุชื่อผู้ส่งออกและวันที่โดยอัตโนมัติ</li>
              <li>• การส่งออกข้อมูลที่มี PII ต้องตั้งรหัสผ่าน (Password Protection) เสมอ</li>
              <li>• การส่งออกที่เสี่ยงสูง (ข้อมูลจำนวนมาก หรือ PII โดยไม่ตั้งรหัสผ่าน) จะถูกแจ้งเตือนไปยังผู้ดูแลระบบ</li>
            </ul>
          </div></div>
        </CardContent>
      </Card>
    </div>
  );
}
