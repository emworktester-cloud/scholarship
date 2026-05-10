import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart, HeartOff, User, Users, Plus, Search, Edit, Eye,
  Upload, FileText, CheckCircle, History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
import { DatePicker } from '../../components/ui/date-picker';
import { toast } from 'sonner';

// ===== Marital Status Types =====
interface MaritalStatusType {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: typeof Heart;
  color: string;
  bgColor: string;
  count: number;
}

const maritalStatusTypes: MaritalStatusType[] = [
  { id: 1, code: 'SINGLE', name: 'โสด', description: 'ยังไม่ได้สมรส', icon: User, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', count: 892 },
  { id: 2, code: 'MARRIED', name: 'สมรส', description: 'จดทะเบียนสมรสแล้ว', icon: Users, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', count: 310 },
  { id: 3, code: 'DIVORCED', name: 'หย่า', description: 'จดทะเบียนหย่าแล้ว', icon: HeartOff, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', count: 32 },
  { id: 4, code: 'WIDOWED', name: 'หม้าย', description: 'คู่สมรสเสียชีวิต', icon: Heart, color: 'text-gray-600', bgColor: 'bg-gray-100 border-gray-300', count: 13 },
];

// ===== Mock records =====
interface MaritalRecord {
  id: string;
  scholarId: string;
  scholarName: string;
  maritalStatus: string;
  maritalCode: string;
  spouseName: string;
  changeDate: string;
  updatedBy: string;
  updatedDate: string;
  hasDocument: boolean;
}

const maritalRecords: MaritalRecord[] = [
  { id: 'MR-001', scholarId: 'SCH-2569-001', scholarName: 'น.ส.พรพิมล สุขใจ', maritalStatus: 'โสด', maritalCode: 'SINGLE', spouseName: '-', changeDate: '-', updatedBy: 'ระบบ', updatedDate: '01/01/2569', hasDocument: false },
  { id: 'MR-002', scholarId: 'SCH-2568-015', scholarName: 'นายกิตติพงษ์ เรียนดี', maritalStatus: 'สมรส', maritalCode: 'MARRIED', spouseName: 'น.ส.ปรียา รักดี', changeDate: '14/02/2568', updatedBy: 'เจ้าหน้าที่ ก.พ.', updatedDate: '20/02/2568', hasDocument: true },
  { id: 'MR-003', scholarId: 'SCH-2567-030', scholarName: 'น.ส.นวลจันทร์ ผ่องใส', maritalStatus: 'หย่า', maritalCode: 'DIVORCED', spouseName: 'นายสมชาย (อดีตคู่สมรส)', changeDate: '10/08/2568', updatedBy: 'เจ้าหน้าที่ ก.พ.', updatedDate: '15/08/2568', hasDocument: true },
  { id: 'MR-004', scholarId: 'SCH-2566-020', scholarName: 'นายวีระ กล้าหาญ', maritalStatus: 'หม้าย', maritalCode: 'WIDOWED', spouseName: 'น.ส.สุดา (ผู้วายชนม์)', changeDate: '05/03/2567', updatedBy: 'เจ้าหน้าที่ สนร.', updatedDate: '10/03/2567', hasDocument: true },
];

export function MaritalStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCode, setFilterCode] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalScholars = maritalStatusTypes.reduce((a, b) => a + b.count, 0);

  const filteredRecords = maritalRecords.filter(r => {
    if (filterCode !== 'all' && r.maritalCode !== filterCode) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.scholarName.toLowerCase().includes(q) || r.scholarId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-pink-900">7.2.3 สถานภาพสมรส</h3>
              <p className="text-xs text-pink-700 mt-1 leading-relaxed">
                สถานะการสมรสของนักเรียนทุนแต่ละบุคคล ได้แก่ 1) โสด 2) สมรส 3) หย่า 4) หม้าย
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        {maritalStatusTypes.map((st, i) => {
          const StIcon = st.icon;
          const pct = totalScholars > 0 ? Math.round((st.count / totalScholars) * 100) : 0;
          return (
            <motion.div key={st.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className={`${st.bgColor} cursor-pointer hover:shadow-md transition-all ${filterCode === st.code ? 'ring-2 ring-pink-400' : ''}`}
                onClick={() => setFilterCode(filterCode === st.code ? 'all' : st.code)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm">
                      <StIcon className={`w-5 h-5 ${st.color}`} />
                    </div>
                    <Badge variant="outline" className="text-[9px]">{pct}%</Badge>
                  </div>
                  <p className="text-2xl font-bold">{st.count}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{st.name}</p>
                  <p className="text-[10px] text-gray-400">{st.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Users className="w-5 h-5 text-pink-600" />บันทึกสถานภาพสมรส</CardTitle>
              <CardDescription>รายการสถานภาพสมรสของนักเรียนทุน (แสดงเฉพาะตัวอย่าง)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="ค้นหา..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48 h-8" />
              <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="w-3.5 h-3.5 mr-1" />บันทึก/แก้ไข</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>สถานภาพสมรส</TableHead>
                <TableHead>คู่สมรส/อดีตคู่สมรส</TableHead>
                <TableHead>วันที่เปลี่ยนแปลง</TableHead>
                <TableHead>ปรับปรุงโดย</TableHead>
                <TableHead>เอกสาร</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(r => {
                const st = maritalStatusTypes.find(s => s.code === r.maritalCode);
                return (
                  <TableRow key={r.id} className="hover:bg-pink-50/50">
                    <TableCell>
                      <p className="text-xs font-medium">{r.scholarName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] border ${st?.bgColor || ''}`}>{r.maritalStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{r.spouseName}</TableCell>
                    <TableCell className="text-[10px] text-gray-500">{r.changeDate}</TableCell>
                    <TableCell className="text-[10px] text-gray-500">{r.updatedBy}<br /><span className="text-gray-400">{r.updatedDate}</span></TableCell>
                    <TableCell>
                      {r.hasDocument ? <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><FileText className="w-3 h-3 mr-0.5" />มี</Badge> : <Badge className="bg-gray-100 text-gray-400 text-[9px]">ไม่มี</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost"><Eye className="w-3.5 h-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Heart className="w-5 h-5" />บันทึกสถานภาพสมรส</DialogTitle>
            <DialogDescription className="text-pink-100 mt-1">บันทึกหรือแก้ไขสถานภาพสมรสของนักเรียนทุน</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">นักเรียนทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="s1">SCH-2569-001 น.ส.พรพิมล</SelectItem><SelectItem value="s2">SCH-2568-015 นายกิตติพงษ์</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">สถานภาพสมรส <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent>{maritalStatusTypes.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่เปลี่ยนแปลง</Label><DatePicker /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">ชื่อคู่สมรส/อดีตคู่สมรส</Label><Input placeholder="ชื่อ-นามสกุล" /></div>
            <div className="space-y-1.5"><Label className="text-xs">หมายเหตุ</Label><Textarea placeholder="รายละเอียดเพิ่มเติม..." className="min-h-[50px]" /></div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-pink-300 transition-colors cursor-pointer" onClick={() => toast.info('อัปโหลดเอกสาร')}>
              <div className="flex items-center gap-2 text-xs text-gray-500"><Upload className="w-4 h-4 text-gray-400" /><span>อัปโหลดเอกสาร (ทะเบียนสมรส/หย่า)</span><Badge variant="outline" className="text-[8px] ml-auto">.pdf .jpg .png</Badge></div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setDialogOpen(false); toast.success('บันทึกสถานภาพสมรสเรียบร้อย'); }}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
