import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle, XCircle, Eye, Edit, Plus, Search,
  Award, Heart, PhoneOff, Pause, GraduationCap,
  ShieldOff, Building, Plane, BookX, LogOut, Gavel,
  AlertTriangle, Info, Filter, Clock, User,
  Upload, FileText, History,
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
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import scholarStatusImage from '../../../assets/3bdd7891eaf88ab3a0918ede83fd760b7af0d380.png';

// ===== Status Matrix (from image 7.2.2) =====
interface ScholarStatusDef {
  no: number;
  name: string;
  detail: string;
  icon: typeof Award;
  color: string;
  bgColor: string;
  preDeparture: boolean;
  duringStudy: boolean;
  postGraduation: boolean;
  count: number;
}

const scholarStatuses: ScholarStatusDef[] = [
  { no: 1, name: 'สถานะการรับทุน', detail: 'ยืนยันรับทุน, สละสิทธิ, เพิกถอน', icon: Award, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', preDeparture: true, duringStudy: false, postGraduation: false, count: 145 },
  { no: 2, name: 'การมีชีวิต', detail: 'มีชีวิต / เสียชีวิต', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', preDeparture: true, duringStudy: true, postGraduation: true, count: 1247 },
  { no: 3, name: 'ขาดการติดต่อ', detail: 'ไม่สามารถติดต่อนักเรียนทุนได้', icon: PhoneOff, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200', preDeparture: true, duringStudy: true, postGraduation: false, count: 5 },
  { no: 4, name: 'พักการศึกษาชั่วคราว', detail: 'พักการศึกษาด้วยเหตุผลต่างๆ', icon: Pause, color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', preDeparture: false, duringStudy: true, postGraduation: false, count: 8 },
  { no: 5, name: 'สำเร็จการศึกษา / เสร็จสิ้นการศึกษา', detail: 'ส่งตัว, บรรจุเข้าทำงาน', icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', preDeparture: false, duringStudy: false, postGraduation: true, count: 320 },
  { no: 6, name: 'สิ้นสุดการดูแล', detail: 'ผิดข้อบังคับ, เสร็จสิ้นโครงการ', icon: ShieldOff, color: 'text-gray-600', bgColor: 'bg-gray-100 border-gray-300', preDeparture: false, duringStudy: true, postGraduation: true, count: 15 },
  { no: 7, name: 'รอจัดสรรสังกัด', detail: 'รอสำนักงาน ก.พ. จัดสรรหน่วยงาน', icon: Building, color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200', preDeparture: false, duringStudy: true, postGraduation: true, count: 12 },
  { no: 8, name: 'ผ่อนผันการเดินทางกลับไทย', detail: 'ขอผ่อนผันการเดินทางกลับประเทศไทย', icon: Plane, color: 'text-cyan-600', bgColor: 'bg-cyan-50 border-cyan-200', preDeparture: false, duringStudy: true, postGraduation: true, count: 6 },
  { no: 9, name: 'ยุติการศึกษา', detail: 'ป่วย, ผิดข้อบังคับ, กลับมาเขียนวิทยานิพนธ์, ไม่มีความก้าวหน้าทางการศึกษา', icon: BookX, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-200', preDeparture: false, duringStudy: false, postGraduation: true, count: 18 },
  { no: 10, name: 'ลาออก', detail: 'นักเรียนทุนลาออกจากทุน', icon: LogOut, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', preDeparture: false, duringStudy: true, postGraduation: true, count: 7 },
  { no: 11, name: 'อยู่ระหว่างฟ้องร้องบังคับคดี', detail: 'มีคดีความทางกฎหมายอยู่ระหว่างดำเนินการ', icon: Gavel, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', preDeparture: true, duringStudy: true, postGraduation: false, count: 3 },
];

// ===== Mock scholar status records =====
interface ScholarStatusRecord {
  id: string;
  scholarId: string;
  scholarName: string;
  statusNo: number;
  statusName: string;
  subStatus: string;
  phase: string;
  effectiveDate: string;
  notes: string;
  updatedBy: string;
  updatedDate: string;
}

const statusRecords: ScholarStatusRecord[] = [
  { id: 'SR-001', scholarId: 'SCH-2569-001', scholarName: 'น.ส.พรพิมล สุขใจ', statusNo: 1, statusName: 'สถานะการรับทุน', subStatus: 'ยืนยันรับทุน', phase: 'ก่อนเดินทาง', effectiveDate: '01/01/2569', notes: 'ยืนยันรับทุน ก.พ. ปี 2569', updatedBy: 'เจ้าหน้าที่ ศกศ.', updatedDate: '05/01/2569' },
  { id: 'SR-002', scholarId: 'SCH-2568-010', scholarName: 'นายธนกฤต ประสบผล', statusNo: 4, statusName: 'พักการศึกษาชั่วคราว', subStatus: 'พักเพื่อรักษาตัว', phase: 'ระหว่างศึกษา', effectiveDate: '15/02/2569', notes: 'พักการศึกษา 1 ภาคเรียน เพื่อรักษาสุขภาพจิต', updatedBy: 'สนร. วอชิงตัน', updatedDate: '15/02/2569' },
  { id: 'SR-003', scholarId: 'SCH-2567-005', scholarName: 'น.ส.อรุณี ก้าวหน้า', statusNo: 5, statusName: 'สำเร็จการศึกษา', subStatus: 'บรรจุเข้าทำงาน', phase: 'สำเร็จ/เสร็จสิ้น', effectiveDate: '30/09/2568', notes: 'สำเร็จ M.Sc. Data Science ส่งตัวเข้ารับราชการ', updatedBy: 'เจ้าหน้าที่ ก.พ.', updatedDate: '20/10/2568' },
  { id: 'SR-004', scholarId: 'SCH-2568-030', scholarName: 'นายสุรเดช แข็งแกร่ง', statusNo: 3, statusName: 'ขาดการติดต่อ', subStatus: 'ขาดการติดต่อ > 3 เดือน', phase: 'ระหว่างศึกษา', effectiveDate: '01/12/2568', notes: 'ไม่สามารถติดต่อได้ตั้งแต่ ธ.ค. 2568 — สนร. กำลังติดตาม', updatedBy: 'สนร. ลอนดอน', updatedDate: '10/02/2569' },
  { id: 'SR-005', scholarId: 'SCH-2566-015', scholarName: 'นายวิวัฒน์ พัฒนา', statusNo: 11, statusName: 'อยู่ระหว่างฟ้องร้องบังคับคดี', subStatus: 'ผิดสัญญาชดใช้ทุน', phase: 'ระหว่างศึกษา', effectiveDate: '20/01/2569', notes: 'ไม่กลับมาชดใช้ทุนตามสัญญา — อัยการยื่นฟ้อง', updatedBy: 'ฝ่ายกฎหมาย ก.พ.', updatedDate: '20/01/2569' },
  { id: 'SR-006', scholarId: 'SCH-2568-042', scholarName: 'น.ส.ปิยะดา เก่งกล้า', statusNo: 8, statusName: 'ผ่อนผันการเดินทางกลับไทย', subStatus: 'ผ่อนผัน 3 เดือน', phase: 'ระหว่างศึกษา', effectiveDate: '01/03/2569', notes: 'ขอผ่อนผันเดินทางกลับ เพื่อรอผลวิทยานิพนธ์', updatedBy: 'สนร. โตเกียว', updatedDate: '25/02/2569' },
];

export function ScholarStatusMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const filteredRecords = statusRecords.filter(r => {
    if (statusFilter !== 'all' && r.statusNo.toString() !== statusFilter) return false;
    if (phaseFilter !== 'all' && r.phase !== phaseFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.scholarName.toLowerCase().includes(q) || r.scholarId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">7.2.2 สถานะของนักเรียนทุนรัฐบาล</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                สถานะ 11 รายการ ครอบคลุม 3 ระยะ (ก่อนเดินทาง, ระหว่างศึกษา, สำเร็จ/เสร็จสิ้น)
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowImageDialog(true)} className="shrink-0">
              <Eye className="w-3.5 h-3.5 mr-1" />ดูตารางต้นฉบับ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" />ตารางสถานะนักเรียนทุนรัฐบาล — แยกตามระยะ</CardTitle>
          <CardDescription>สถานะ 11 รายการ ที่ใช้ได้ในแต่ละระยะของวงจรชีวิตนักเรียนทุน</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <TableHead className="w-12 text-center">ลำดับ</TableHead>
                <TableHead>รายการสถานะ</TableHead>
                <TableHead className="text-center w-28">ก่อนเดินทาง</TableHead>
                <TableHead className="text-center w-28">ระหว่างศึกษา</TableHead>
                <TableHead className="text-center w-28">สำเร็จ/เสร็จสิ้น</TableHead>
                <TableHead className="text-center w-20">จำนวน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholarStatuses.map((st, i) => {
                const StIcon = st.icon;
                return (
                  <TableRow key={st.no} className="hover:bg-blue-50/50">
                    <TableCell className="text-center text-sm font-semibold text-gray-500">{st.no}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${st.bgColor} flex items-center justify-center`}>
                          <StIcon className={`w-4 h-4 ${st.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{st.name}</p>
                          <p className="text-[10px] text-gray-500">{st.detail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {st.preDeparture ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-200">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {st.duringStudy ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-200">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {st.postGraduation ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-200">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[9px]">{st.count}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" />บันทึกสถานะนักเรียนทุนล่าสุด</CardTitle>
              <CardDescription>รายการเปลี่ยนแปลงสถานะของนักเรียนทุนรัฐบาล</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="ค้นหาชื่อ/รหัส..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-44 h-8" />
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-36 h-8"><SelectValue placeholder="ระยะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกระยะ</SelectItem>
                  <SelectItem value="ก่อนเดินทาง">ก่อนเดินทาง</SelectItem>
                  <SelectItem value="ระหว่างศึกษา">ระหว่างศึกษา</SelectItem>
                  <SelectItem value="สำเร็จ/เสร็จสิ้น">สำเร็จ/เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 h-8"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  {scholarStatuses.map(s => <SelectItem key={s.no} value={s.no.toString()}>{s.no}. {s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => setChangeDialogOpen(true)}><Plus className="w-3.5 h-3.5 mr-1" />เปลี่ยนสถานะ</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>สถานะย่อย</TableHead>
                <TableHead>ระยะ</TableHead>
                <TableHead>วันที่มีผล</TableHead>
                <TableHead>หมายเหตุ</TableHead>
                <TableHead>ปรับปรุงโดย</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(r => {
                const st = scholarStatuses.find(s => s.no === r.statusNo);
                const StIcon = st?.icon || Award;
                return (
                  <TableRow key={r.id} className="hover:bg-blue-50/50">
                    <TableCell>
                      <p className="text-xs font-medium">{r.scholarName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StIcon className={`w-3.5 h-3.5 ${st?.color || ''}`} />
                        <Badge className={`text-[9px] border ${st?.bgColor || ''}`}>{r.statusName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{r.subStatus}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[9px] ${r.phase === 'ก่อนเดินทาง' ? 'bg-blue-50' : r.phase === 'ระหว่างศึกษา' ? 'bg-green-50' : 'bg-amber-50'}`}>
                        {r.phase}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono text-gray-500">{r.effectiveDate}</TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[200px] truncate">{r.notes}</TableCell>
                    <TableCell>
                      <p className="text-[10px] text-gray-500">{r.updatedBy}</p>
                      <p className="text-[9px] text-gray-400">{r.updatedDate}</p>
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

      {/* Change Status Dialog */}
      <Dialog open={changeDialogOpen} onOpenChange={setChangeDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Award className="w-5 h-5" />เปลี่ยนสถานะนักเรียนทุน</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">บันทึกการเปลี่ยนแปลงสถานะตามตาราง 7.2.2</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">นักเรียนทุน <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก นทร." /></SelectTrigger><SelectContent><SelectItem value="s1">SCH-2569-001 น.ส.พรพิมล สุขใจ</SelectItem><SelectItem value="s2">SCH-2568-010 นายธนกฤต ประสบผล</SelectItem><SelectItem value="s3">SCH-2568-042 น.ส.ปิยะดา เก่งกล้า</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">สถานะใหม่ <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger><SelectContent>{scholarStatuses.map(s => <SelectItem key={s.no} value={s.no.toString()}>{s.no}. {s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ระยะ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="pre">ก่อนเดินทาง</SelectItem><SelectItem value="during">ระหว่างศึกษา</SelectItem><SelectItem value="post">สำเร็จ/เสร็จสิ้น</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">สถานะย่อย</Label><Input placeholder="เช่น ยืนยันรับทุน, สละสิทธิ, ป่วย ฯลฯ" /></div>
            <div className="space-y-1.5"><Label className="text-xs">วันที่มีผล <span className="text-red-500">*</span></Label><DatePicker /></div>
            <div className="space-y-1.5"><Label className="text-xs">หมายเหตุ</Label><Textarea placeholder="รายละเอียดเพิ่มเติม..." className="min-h-[60px]" /></div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toast.info('อัปโหลดเอกสาร')}>
              <div className="flex items-center gap-2 text-xs text-gray-500"><Upload className="w-4 h-4 text-gray-400" /><span>อัปโหลดเอกสารประกอบ</span><Badge variant="outline" className="text-[8px] ml-auto">.pdf .jpg .png</Badge></div>
            </div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setChangeDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setChangeDialogOpen(false); toast.success('เปลี่ยนสถานะเรียบร้อย'); }}>บันทึก</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Original Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 text-white">
            <DialogTitle className="text-white text-base">ตารางสถานะนักเรียนทุนรัฐบาล (ต้นฉบับ)</DialogTitle>
            <DialogDescription className="text-gray-300 mt-0.5">ข้อ 7.2.2 — ตามเอกสารข้อกำหนด</DialogDescription>
          </div>
          <div className="p-4">
            <img src={scholarStatusImage} alt="ตารางสถานะนักเรียนทุนรัฐบาล" className="w-full rounded-lg border" />
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowImageDialog(false)}>ปิด</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
