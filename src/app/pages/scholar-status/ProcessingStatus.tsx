import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send, Clock, FileSearch, FileQuestion, CheckCircle, XCircle,
  RotateCcw, Trash2, CheckCheck, AlertTriangle, Search,
  Plus, Eye, Edit, Filter, ArrowRight, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import { toast } from 'sonner';

// ===== Processing Status Types (7.2.4) =====
interface ProcessingStatusType {
  no: number;
  code: string;
  name: string;
  description: string;
  icon: typeof Send;
  color: string;
  bgColor: string;
  textColor: string;
  count: number;
}

const processingStatuses: ProcessingStatusType[] = [
  { no: 1, code: 'NOT_SENT', name: 'ยังไม่ได้ส่ง', description: 'บันทึก/คำขอถูกสร้างแต่ยังไม่ได้ส่งเข้าระบบ', icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-100 border-gray-300', textColor: 'text-gray-600', count: 24 },
  { no: 2, code: 'SENT', name: 'ส่งแล้ว', description: 'ส่งบันทึก/คำขอเข้าสู่ระบบเรียบร้อยแล้ว', icon: Send, color: 'text-blue-600', bgColor: 'bg-blue-100 border-blue-200', textColor: 'text-blue-700', count: 35 },
  { no: 3, code: 'IN_PROGRESS', name: 'อยู่ระหว่างดำเนินการ', description: 'เจ้าหน้าที่กำลังตรวจสอบหรือพิจารณา', icon: FileSearch, color: 'text-yellow-600', bgColor: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-700', count: 18 },
  { no: 4, code: 'MORE_DOCS', name: 'ขอเอกสารเพิ่มเติม', description: 'ต้องการเอกสารหรือข้อมูลเพิ่มเติมจากผู้ยื่น', icon: FileQuestion, color: 'text-orange-600', bgColor: 'bg-orange-100 border-orange-200', textColor: 'text-orange-700', count: 12 },
  { no: 5, code: 'APPROVED', name: 'อนุมัติ/อนุญาต/รับทราบ', description: 'ผ่านการพิจารณาและได้รับการอนุมัติ อนุญาต หรือรับทราบ', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100 border-green-200', textColor: 'text-green-700', count: 156 },
  { no: 6, code: 'REJECTED', name: 'ไม่อนุมัติ/ไม่อนุญาต', description: 'ไม่ผ่านการพิจารณา', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100 border-red-200', textColor: 'text-red-700', count: 8 },
  { no: 7, code: 'RETURNED', name: 'ส่งกลับให้แก้ไข', description: 'ส่งกลับให้ผู้ยื่นแก้ไขข้อมูลหรือเอกสาร', icon: RotateCcw, color: 'text-purple-600', bgColor: 'bg-purple-100 border-purple-200', textColor: 'text-purple-700', count: 10 },
  { no: 8, code: 'CANCEL_REQUEST', name: 'แจ้งแก้ไข/ลบ/ยกเลิก', description: 'มีการแจ้งขอแก้ไข ลบ หรือยกเลิกบันทึก/คำขอ', icon: Trash2, color: 'text-rose-600', bgColor: 'bg-rose-100 border-rose-200', textColor: 'text-rose-700', count: 5 },
  { no: 9, code: 'CANCEL_ACCEPTED', name: 'ยอมรับการแก้ไข/ลบ/ยกเลิก', description: 'ยอมรับคำขอแก้ไข ลบ หรือยกเลิกเรียบร้อยแล้ว', icon: CheckCheck, color: 'text-teal-600', bgColor: 'bg-teal-100 border-teal-200', textColor: 'text-teal-700', count: 4 },
];

// ===== Mock processing records =====
interface ProcessingRecord {
  id: string;
  type: string;
  scholarName: string;
  scholarId: string;
  statusNo: number;
  statusName: string;
  description: string;
  submittedDate: string;
  lastUpdated: string;
  handler: string;
}

const processingRecords: ProcessingRecord[] = [
  { id: 'PRC-001', type: 'ขอขยายระยะเวลาศึกษา', scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-2568-010', statusNo: 3, statusName: 'อยู่ระหว่างดำเนินการ', description: 'ขอขยายเวลา 1 ภาคเรียน เพื่อแก้ไขวิทยานิพนธ์', submittedDate: '15/02/2569', lastUpdated: '20/02/2569', handler: 'สนร. วอชิงตัน' },
  { id: 'PRC-002', type: 'ขออนุมัติไปร่วมประชุมวิชาการ', scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-2569-001', statusNo: 5, statusName: 'อนุมัติ/อนุญาต/รับทราบ', description: 'ร่วม IEEE Conference ที่ San Francisco', submittedDate: '10/02/2569', lastUpdated: '18/02/2569', handler: 'เจ้าหน้าที่ ก.พ.' },
  { id: 'PRC-003', type: 'ขอเปลี่ยนสาขาวิชา', scholarName: 'น.ส.ปิยะดา เก่งกล้า', scholarId: 'SCH-2568-042', statusNo: 4, statusName: 'ขอเอกสารเพิ่มเติม', description: 'เปลี่ยนจาก Applied Physics เป็น Quantum Computing', submittedDate: '08/02/2569', lastUpdated: '22/02/2569', handler: 'สนร. โตเกียว' },
  { id: 'PRC-004', type: 'ขอกลับเยี่ยมบ้านชั่วคราว', scholarName: 'นายวิชัย สมบูรณ์', scholarId: 'SCH-2569-002', statusNo: 1, statusName: 'ยังไม่ได้ส่ง', description: 'ขอกลับเยี่ยมบ้านช่วงปิดเทอม Summer 2569', submittedDate: '-', lastUpdated: '25/02/2569', handler: '-' },
  { id: 'PRC-005', type: 'ขอย้ายสถานศึกษา', scholarName: 'นายภูมิพัฒน์ ดีเลิศ', scholarId: 'SCH-2569-010', statusNo: 6, statusName: 'ไม่อนุมัติ/ไม่อนุญาต', description: 'ย้ายจาก Oxford ไป Cambridge — ไม่อนุมัติเนื่องจากไม่ตรงสาขา', submittedDate: '01/02/2569', lastUpdated: '15/02/2569', handler: 'เจ้าหน้าที่ ก.พ.' },
  { id: 'PRC-006', type: 'รายงานผลการศึกษา', scholarName: 'น.ส.อรุณี ก้าวหน้า', scholarId: 'SCH-2567-005', statusNo: 7, statusName: 'ส่งกลับให้แก้ไข', description: 'Transcript ไม่ชัดเจน — ขอส่งใหม่', submittedDate: '12/02/2569', lastUpdated: '19/02/2569', handler: 'สนร. ลอนดอน' },
  { id: 'PRC-007', type: 'ขอยุติการศึกษา', scholarName: 'นายสุรเดช แข็งแกร่ง', scholarId: 'SCH-2568-030', statusNo: 8, statusName: 'แจ้งแก้ไข/ลบ/ยกเลิก', description: 'ขอยกเลิกคำขอยุติการศึกษา — จะศึกษาต่อ', submittedDate: '05/02/2569', lastUpdated: '23/02/2569', handler: 'สนร. ลอนดอน' },
  { id: 'PRC-008', type: 'ขอพักการศึกษาชั่วคราว', scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-2568-010', statusNo: 9, statusName: 'ยอมรับการแก้ไข/ลบ/ยกเลิก', description: 'ยอมรับการแก้ไขระยะเวลาพัก — จาก 1 เทอม เป็น 2 เทอม', submittedDate: '20/01/2569', lastUpdated: '24/02/2569', handler: 'เจ้าหน้าที่ ศกศ.' },
];

export function ProcessingStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRecords = processingRecords.filter(r => {
    if (statusFilter !== 'all' && r.statusNo.toString() !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.scholarName.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md shrink-0">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-900">7.2.4 สถานะการดำเนินการ</h3>
              <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                สถานะในการดำเนินการที่เกี่ยวกับบันทึก/คำขอ ทั้งหมด 9 สถานะ ตั้งแต่ยังไม่ได้ส่ง จนถึงยอมรับการแก้ไข/ลบ/ยกเลิก
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ขั้นตอนการดำเนินการ (Processing Flow)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {processingStatuses.map((st, i) => {
              const StIcon = st.icon;
              return (
                <div key={st.code} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`px-3 py-2 ${st.bgColor} border rounded-lg text-center min-w-[100px] cursor-pointer hover:shadow-md transition-all ${statusFilter === st.no.toString() ? 'ring-2 ring-purple-400' : ''}`}
                    onClick={() => setStatusFilter(statusFilter === st.no.toString() ? 'all' : st.no.toString())}
                  >
                    <StIcon className={`w-4 h-4 mx-auto ${st.color}`} />
                    <p className={`text-[9px] font-semibold mt-1 ${st.textColor}`}>{st.no}. {st.name}</p>
                    <Badge variant="outline" className="text-[8px] mt-1">{st.count}</Badge>
                  </motion.div>
                  {i < processingStatuses.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 mx-0.5 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Definition Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Info className="w-5 h-5 text-purple-600" />คำจำกัดความสถานะการดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50/50">
                <TableHead className="w-12 text-center">ลำดับ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>คำอธิบาย</TableHead>
                <TableHead className="text-center w-20">จำนวน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processingStatuses.map(st => {
                const StIcon = st.icon;
                return (
                  <TableRow key={st.no} className="hover:bg-purple-50/30">
                    <TableCell className="text-center text-sm font-semibold text-gray-500">{st.no}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${st.bgColor} flex items-center justify-center`}><StIcon className={`w-3.5 h-3.5 ${st.color}`} /></div>
                        <Badge className={`text-[9px] border ${st.bgColor} ${st.textColor}`}>{st.name}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{st.description}</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className="text-[9px]">{st.count}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Clock className="w-5 h-5 text-purple-600" />บันทึก/คำขอ ล่าสุด</CardTitle>
              <CardDescription>รายการบันทึกและคำขอพร้อมสถานะการดำเนินการปัจจุบัน</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="ค้นหา..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-44 h-8" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-8"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  {processingStatuses.map(s => <SelectItem key={s.no} value={s.no.toString()}>{s.no}. {s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ประเภทคำขอ</TableHead>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>วันที่ส่ง</TableHead>
                <TableHead>ผู้รับผิดชอบ</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(r => {
                const st = processingStatuses.find(s => s.no === r.statusNo);
                const StIcon = st?.icon || Clock;
                return (
                  <TableRow key={r.id} className="hover:bg-purple-50/30">
                    <TableCell className="text-[10px] font-mono text-gray-500">{r.id}</TableCell>
                    <TableCell className="text-xs font-medium">{r.type}</TableCell>
                    <TableCell>
                      <p className="text-xs">{r.scholarName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StIcon className={`w-3.5 h-3.5 ${st?.color || ''}`} />
                        <Badge className={`text-[9px] border ${st?.bgColor || ''} ${st?.textColor || ''}`}>{r.statusName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell className="text-[10px] text-gray-500 whitespace-nowrap">{r.submittedDate}</TableCell>
                    <TableCell className="text-[10px] text-gray-500">{r.handler}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`ดูรายละเอียด ${r.id}`)}><Eye className="w-3.5 h-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
