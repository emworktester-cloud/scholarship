import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Eye, EarOff, Accessibility, Activity, Plus, Search,
  Edit, Trash2, CheckCircle, AlertTriangle, User,
  FileText, Upload, History, Info, Heart,
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
import { toast } from 'sonner';

// ===== Physical Status Types =====
interface PhysicalStatusType {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: typeof Eye;
  color: string;
  bgColor: string;
  count: number;
}

const physicalStatusTypes: PhysicalStatusType[] = [
  { id: 1, code: 'NORMAL', name: 'ปกติ', description: 'ไม่มีภาวะความพิการใดๆ', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', count: 1185 },
  { id: 2, code: 'VISUAL', name: 'พิการทางการมองเห็น', description: 'ตาบอด สายตาเลือนราง หรือมีปัญหาการมองเห็นที่แก้ไขไม่ได้', icon: Eye, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', count: 8 },
  { id: 3, code: 'HEARING', name: 'พิการทางการได้ยิน/การสื่อสาร', description: 'หูหนวก หูตึง หรือมีปัญหาในการสื่อสารด้วยเสียง', icon: EarOff, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', count: 3 },
  { id: 4, code: 'MOBILITY', name: 'พิการทางการเคลื่อนไหว', description: 'อัมพาต แขนขาขาด หรือมีปัญหาในการเคลื่อนไหวร่างกาย', icon: Accessibility, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', count: 5 },
  { id: 5, code: 'MENTAL', name: 'พิการทางจิตใจหรือพฤติกรรม', description: 'มีภาวะทางจิตเวชที่ส่งผลต่อการดำเนินชีวิต', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', count: 2 },
  { id: 6, code: 'INTELLECTUAL', name: 'พิการทางสติปัญญา', description: 'มีระดับสติปัญญาต่ำกว่ามาตรฐาน', icon: Activity, color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200', count: 0 },
  { id: 7, code: 'LEARNING', name: 'พิการทางการเรียนรู้', description: 'มีปัญหาในการอ่าน เขียน คำนวณ หรือเรียนรู้', icon: FileText, color: 'text-cyan-600', bgColor: 'bg-cyan-50 border-cyan-200', count: 1 },
  { id: 8, code: 'AUTISM', name: 'ออทิสติก', description: 'มีความบกพร่องทางพัฒนาการด้านสังคม การสื่อสาร และพฤติกรรม', icon: User, color: 'text-teal-600', bgColor: 'bg-teal-50 border-teal-200', count: 0 },
];

// ===== Mock scholar records with physical status =====
interface ScholarPhysicalRecord {
  id: string;
  scholarId: string;
  scholarName: string;
  physicalStatus: string;
  physicalStatusCode: string;
  detailDescription: string;
  certNo: string;
  certDate: string;
  updatedBy: string;
  updatedDate: string;
  hasDocument: boolean;
}

const scholarRecords: ScholarPhysicalRecord[] = [
  { id: 'PR-001', scholarId: 'SCH-2569-005', scholarName: 'นายจิรวัฒน์ แสงทอง', physicalStatus: 'พิการทางการมองเห็น', physicalStatusCode: 'VISUAL', detailDescription: 'สายตาเลือนราง ข้างซ้าย — ใช้แว่นขยายช่วยในการอ่าน', certNo: 'พก.0032/2568', certDate: '15/01/2568', updatedBy: 'เจ้าหน้าที่ ก.พ.', updatedDate: '10/02/2569', hasDocument: true },
  { id: 'PR-002', scholarId: 'SCH-2568-022', scholarName: 'น.ส.มณีรัตน์ รุ่งเรือง', physicalStatus: 'พิการทางการเคลื่อนไหว', physicalStatusCode: 'MOBILITY', detailDescription: 'อัมพาตขาข้างขวาจากอุบัติเหตุ — ใช้รถเข็น', certNo: 'พก.0081/2567', certDate: '20/03/2567', updatedBy: 'เจ้าหน้าที่ ก.พ.', updatedDate: '05/02/2569', hasDocument: true },
  { id: 'PR-003', scholarId: 'SCH-2569-010', scholarName: 'นายภูมิพัฒน์ ดีเลิศ', physicalStatus: 'พิการทางการได้ยิน/การสื่อสาร', physicalStatusCode: 'HEARING', detailDescription: 'หูตึงทั้งสองข้าง — ใช้เครื่องช่วยฟัง', certNo: 'พก.0045/2568', certDate: '08/06/2568', updatedBy: 'เจ้าหน้าที่ สนร.', updatedDate: '01/02/2569', hasDocument: true },
];

export function PhysicalStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const totalScholars = physicalStatusTypes.reduce((a, b) => a + b.count, 0);

  const filteredRecords = scholarRecords.filter(r => {
    if (filterStatus !== 'all' && r.physicalStatusCode !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.scholarName.toLowerCase().includes(q) || r.scholarId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900">7.2.1 สถานภาพทางกาย</h3>
              <p className="text-xs text-green-700 mt-1 leading-relaxed">
                สถานภาพทางด้านกายภาพของนักเรียนทุนแต่ละบุคคล ได้แก่ ปกติ, พิการทางการมองเห็น, พิการทางการได้ยิน/การสื่อสาร, พิการทางการเคลื่อนไหว เป็นต้น
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {physicalStatusTypes.map((st, i) => {
          const StIcon = st.icon;
          return (
            <motion.div key={st.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card
                className={`${st.bgColor} cursor-pointer hover:shadow-md transition-all ${filterStatus === st.code ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setFilterStatus(filterStatus === st.code ? 'all' : st.code)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border flex items-center justify-center shadow-sm">
                      <StIcon className={`w-4 h-4 ${st.color}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{st.count}</p>
                      <p className="text-[10px] text-gray-600 leading-tight">{st.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>นักเรียนทุนทั้งหมด: <strong>{totalScholars}</strong> ราย</span>
          <span>|</span>
          <span>ปกติ: <strong className="text-green-600">{physicalStatusTypes[0].count}</strong></span>
          <span>มีภาวะพิการ: <strong className="text-amber-600">{totalScholars - physicalStatusTypes[0].count}</strong></span>
        </div>
        <div className="flex gap-2">
          <Input placeholder="ค้นหาชื่อ/รหัส..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48 h-8" />
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="w-3.5 h-3.5 mr-1" />บันทึกสถานภาพ</Button>
        </div>
      </div>

      {/* Records for non-normal scholars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Accessibility className="w-5 h-5 text-blue-600" />บันทึกสถานภาพทางกาย (กรณีมีภาวะพิเศษ)</CardTitle>
          <CardDescription>รายการนักเรียนทุนที่มีสถานภาพทางกายที่ต้องดูแลเป็นพิเศษ</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>สถานภาพทางกาย</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>เลขที่ใบรับรอง</TableHead>
                <TableHead>ปรับปรุงล่าสุด</TableHead>
                <TableHead>เอกสาร</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(r => {
                const st = physicalStatusTypes.find(s => s.code === r.physicalStatusCode);
                return (
                  <TableRow key={r.id} className="hover:bg-blue-50/50">
                    <TableCell>
                      <p className="text-xs font-medium">{r.scholarName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] border ${st?.bgColor || ''}`}>{r.physicalStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[200px] truncate">{r.detailDescription}</TableCell>
                    <TableCell className="text-[10px] font-mono text-gray-500">{r.certNo}</TableCell>
                    <TableCell>
                      <p className="text-[10px] text-gray-500">{r.updatedDate}</p>
                      <p className="text-[9px] text-gray-400">{r.updatedBy}</p>
                    </TableCell>
                    <TableCell>
                      {r.hasDocument ? (
                        <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><FileText className="w-3 h-3 mr-0.5" />มี</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-500 text-[9px]">ไม่มี</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`ดูรายละเอียด ${r.scholarName}`)}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setDialogOpen(true)}><Edit className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setHistoryDialogOpen(true)}><History className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Activity className="w-5 h-5" />บันทึกสถานภาพทางกาย</DialogTitle>
            <DialogDescription className="text-green-100 mt-1">บันทึกหรือแก้ไขสถานภาพทางกายของนักเรียนทุน</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">นักเรียนทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="s1">SCH-2569-005 นายจิรวัฒน์</SelectItem><SelectItem value="s2">SCH-2568-022 น.ส.มณีรัตน์</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">สถานภาพทางกาย <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent>{physicalStatusTypes.map(s => <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">รายละเอียดเพิ่มเติม</Label><Textarea placeholder="อธิบายรายละเอียด..." className="min-h-[70px]" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">เลขที่ใบรับรองความพิการ</Label><Input placeholder="พก.xxxx/xxxx" /></div>
              <div className="space-y-1.5"><Label className="text-xs">วันที่ออกใบรับรอง</Label><Input type="date" /></div>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toast.info('อัปโหลดเอกสาร')}>
              <div className="flex items-center gap-2 text-xs text-gray-500"><Upload className="w-4 h-4 text-gray-400" /><span>อัปโหลดใบรับรองแพทย์/เอกสารประกอบ</span><Badge variant="outline" className="text-[8px] ml-auto">.pdf .jpg .png</Badge></div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setDialogOpen(false); toast.success('บันทึกสถานภาพทางกายเรียบร้อย'); }}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><History className="w-5 h-5" />ประวัติการเปลี่ยนแปลง</DialogTitle>
            <DialogDescription className="text-gray-300 mt-1">ประวัติการแก้ไขสถานภาพทางกาย</DialogDescription>
          </div>
          <div className="p-6 space-y-3">
            {[
              { date: '10/02/2569', action: 'อัปเดตรายละเอียด', by: 'เจ้าหน้าที่ ก.พ.', detail: 'เพิ่มข้อมูลเครื่องช่วยฟัง' },
              { date: '15/01/2568', action: 'บันทึกครั้งแรก', by: 'เจ้าหน้าที่ สนร.', detail: 'สถานภาพ: พิการทางการได้ยิน' },
            ].map((h, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[9px]">{h.action}</Badge>
                  <span className="text-[10px] text-gray-400">{h.date}</span>
                </div>
                <p className="text-xs text-gray-600">{h.detail}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">โดย: {h.by}</p>
              </div>
            ))}
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setHistoryDialogOpen(false)}>ปิด</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
