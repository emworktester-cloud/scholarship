import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Eye, CheckCircle, Shield, Stamp, FileText, Search,
  Plus, Send, Clock, AlertTriangle, User, Upload,
  ArrowRight, Info, ChevronRight, FileCheck,
  ThumbsUp, ShieldCheck, KeyRound, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

// ===== Action types (7.3) =====
interface ActionType {
  id: string;
  no: string;
  name: string;
  nameTH: string;
  definition: string;
  legalBasis: string;
  icon: typeof CheckCircle;
  color: string;
  bgColor: string;
  gradient: string;
  examples: string[];
  count: number;
}

const actionTypes: ActionType[] = [
  {
    id: 'acknowledge',
    no: '7.3.1',
    name: 'รับทราบ',
    nameTH: 'Acknowledge',
    definition: 'รับรู้และเข้าใจเรื่องที่รายงานเข้ามา',
    legalBasis: 'การรับทราบเป็นการแสดงว่าผู้มีอำนาจได้รับข้อมูลแล้ว ไม่ต้องมีคำสั่งอนุมัติหรืออนุญาตเพิ่มเติม',
    icon: Eye,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    gradient: 'from-blue-500 to-indigo-600',
    examples: [
      'รายงานผลการศึกษาประจำภาค',
      'แจ้งที่อยู่ปัจจุบันในต่างประเทศ',
      'รายงานตัวเมื่อเดินทางถึง',
      'แจ้งผลตรวจสุขภาพ',
      'รายงาน Watch List จาก สนร.',
    ],
    count: 85,
  },
  {
    id: 'permit',
    no: '7.3.2',
    name: 'อนุญาต',
    nameTH: 'Permit',
    definition: 'ยินยอมให้ทำตามเรื่องที่เสนอโดยอาศัยอำนาจตามระเบียบที่กำหนดไว้',
    legalBasis: 'การอนุญาตอาศัยอำนาจตามระเบียบ ก.พ. ว่าด้วยทุนรัฐบาล — ผู้มีอำนาจตามตำแหน่งเป็นผู้ยินยอม',
    icon: ShieldCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    gradient: 'from-green-500 to-emerald-600',
    examples: [
      'ขอกลับเยี่ยมบ้านชั่วคราว',
      'ขอไปทัศนศึกษานอกประเทศที่ศึกษา',
      'ขอผ่อนผันการเดินทางกลับไทย',
      'ขอเก็บข้อมูลวิทยานิพนธ์นอกประเทศที่ศึกษา',
      'ขอไปร่วมประชุม/สัมมนาทางวิชาการ',
    ],
    count: 42,
  },
  {
    id: 'approve',
    no: '7.3.3',
    name: 'อนุมัติ',
    nameTH: 'Approve',
    definition: 'ให้อำนาจกระทำการตามระเบียบที่กำหนดไว้',
    legalBasis: 'การอนุมัติเป็นการใช้อำนาจตามระเบียบ ก.พ. ว่าด้วยทุนรัฐบาล ต้องมีผู้มีอำนาจอนุมัติตามลำดับขั้น',
    icon: Stamp,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    gradient: 'from-amber-500 to-orange-600',
    examples: [
      'ขอขยายระยะเวลาศึกษา',
      'ขอศึกษาต่อในระดับที่สูงขึ้น',
      'ขอย้ายสถานศึกษา',
      'ขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา',
      'ขอย้ายประเทศศึกษา',
      'ขอพักการศึกษาชั่วคราว',
    ],
    count: 29,
  },
];

// ===== Mock action records =====
interface ActionRecord {
  id: string;
  type: string;
  actionType: string;
  scholarName: string;
  scholarId: string;
  requestTitle: string;
  requestDate: string;
  actionDate: string;
  actionBy: string;
  actionByRole: string;
  notes: string;
  status: 'pending' | 'completed';
}

const actionRecords: ActionRecord[] = [
  { id: 'ACT-001', type: 'รับทราบ', actionType: 'acknowledge', scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-2569-001', requestTitle: 'รายงานผลการศึกษา Fall 2568', requestDate: '10/02/2569', actionDate: '18/02/2569', actionBy: 'นายประสิทธิ์ ผู้ดูแล', actionByRole: 'ผอ.ศกศ.', notes: 'GPA 3.85 — รับทราบผลการศึกษาปกติ', status: 'completed' },
  { id: 'ACT-002', type: 'อนุญาต', actionType: 'permit', scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-2569-001', requestTitle: 'ขอไปร่วม IEEE Conference', requestDate: '10/02/2569', actionDate: '18/02/2569', actionBy: 'นายประสิทธิ์ ผู้ดูแล', actionByRole: 'ผอ.ศกศ.', notes: 'อนุญาตให้เข้าร่วมตามที่เสนอ', status: 'completed' },
  { id: 'ACT-003', type: 'อนุมัติ', actionType: 'approve', scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-2568-010', requestTitle: 'ขอขยายระยะเวลาศึกษา 1 ภาคเรียน', requestDate: '15/02/2569', actionDate: '-', actionBy: '-', actionByRole: '-', notes: 'รอพิจารณาจาก ผอ.ศกศ.', status: 'pending' },
  { id: 'ACT-004', type: 'อนุญาต', actionType: 'permit', scholarName: 'นายวิชัย สมบูรณ์', scholarId: 'SCH-2569-002', requestTitle: 'ขอกลับเยี่ยมบ้านชั่วคราว', requestDate: '20/02/2569', actionDate: '-', actionBy: '-', actionByRole: '-', notes: 'รอพิจารณา — ส่งผ่าน สนร. ลอนดอน', status: 'pending' },
  { id: 'ACT-005', type: 'อนุมัติ', actionType: 'approve', scholarName: 'น.ส.ปิยะดา เก่งกล้า', scholarId: 'SCH-2568-042', requestTitle: 'ขอเปลี่ยนสาขาวิชา', requestDate: '08/02/2569', actionDate: '-', actionBy: '-', actionByRole: '-', notes: 'ขอเอกสารเพิ่มเติม — หนังสือรับรองจากสถานศึกษา', status: 'pending' },
  { id: 'ACT-006', type: 'รับทราบ', actionType: 'acknowledge', scholarName: 'น.ส.มณีรัตน์ รุ่งเรือง', scholarId: 'SCH-2568-022', requestTitle: 'แจ้งที่อยู่ปัจจุบันในต่างประเทศ', requestDate: '22/02/2569', actionDate: '23/02/2569', actionBy: 'เจ้าหน้าที่ สนร.', actionByRole: 'เจ้าหน้าที่', notes: 'รับทราบที่อยู่ใหม่', status: 'completed' },
];

export function RecordsAndRequests() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  const filteredRecords = actionRecords.filter(r => {
    if (filterType !== 'all' && r.actionType !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.scholarName.toLowerCase().includes(q) || r.requestTitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shrink-0">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">7.3 การดำเนินการด้านบันทึกและคำขอ</h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                การดำเนินการ 3 ประเภท: <strong>รับทราบ</strong> (รับรู้เรื่องที่รายงาน), <strong>อนุญาต</strong> (ยินยอมตามระเบียบ), <strong>อนุมัติ</strong> (ให้อำนาจกระทำการตามระเบียบ)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3 Action Types — Definition Cards */}
      <div className="grid grid-cols-3 gap-5">
        {actionTypes.map((at, i) => {
          const AtIcon = at.icon;
          return (
            <motion.div key={at.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`${at.bgColor} hover:shadow-lg transition-all h-full`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${at.gradient} flex items-center justify-center shadow-md`}>
                      <AtIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Badge className="text-[8px] bg-white/80 text-gray-600 border mb-0.5">{at.no}</Badge>
                      <h4 className="text-lg font-bold">{at.name}</h4>
                      <p className="text-[10px] text-gray-500">{at.nameTH}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white/70 rounded-lg border mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">คำจำกัดความ:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{at.definition}</p>
                  </div>

                  <div className="p-3 bg-white/50 rounded-lg border mb-3">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1">หลักการ/ระเบียบ:</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{at.legalBasis}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">ตัวอย่างการใช้งาน:</p>
                    <ul className="space-y-1">
                      {at.examples.map((ex, ei) => (
                        <li key={ei} className="text-[10px] text-gray-600 flex items-start gap-1">
                          <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />{ex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px]">{at.count} รายการ</Badge>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedAction(at); setActionDialogOpen(true); }}>
                      ดำเนินการ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Info className="w-5 h-5 text-blue-600" />เปรียบเทียบประเภทการดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-36">หัวข้อ</TableHead>
                <TableHead className="text-center bg-blue-50">รับทราบ (7.3.1)</TableHead>
                <TableHead className="text-center bg-green-50">อนุญาต (7.3.2)</TableHead>
                <TableHead className="text-center bg-amber-50">อนุมัติ (7.3.3)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-xs font-semibold">ความหมาย</TableCell>
                <TableCell className="text-xs text-center text-gray-600">รับรู้และเข้าใจเรื่องที่รายงาน</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ยินยอมให้ทำตามเรื่องที่เสนอ</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ให้อำนาจกระทำการ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs font-semibold">อำนาจ</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ไม่ต้องใช้อำนาจพิเศษ</TableCell>
                <TableCell className="text-xs text-center text-gray-600">อำนาจตามระเบียบที่กำหนด</TableCell>
                <TableCell className="text-xs text-center text-gray-600">อำนาจตามระเบียบที่กำหนด</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs font-semibold">ผลลัพธ์</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ข้อมูลถูกบันทึก</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ผู้ยื่นสามารถดำเนินการได้</TableCell>
                <TableCell className="text-xs text-center text-gray-600">ผู้ยื่นได้รับอำนาจกระทำการ</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs font-semibold">ระดับการพิจารณา</TableCell>
                <TableCell className="text-xs text-center"><Badge className="bg-blue-100 text-blue-700 text-[9px] border border-blue-200">ต่ำ</Badge></TableCell>
                <TableCell className="text-xs text-center"><Badge className="bg-yellow-100 text-yellow-700 text-[9px] border border-yellow-200">กลาง</Badge></TableCell>
                <TableCell className="text-xs text-center"><Badge className="bg-red-100 text-red-700 text-[9px] border border-red-200">สูง</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Clock className="w-5 h-5 text-amber-600" />บันทึกการดำเนินการล่าสุด</CardTitle>
              <CardDescription>รายการรับทราบ/อนุญาต/อนุมัติ ที่ดำเนินการแล้วและรอดำเนินการ</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="ค้นหา..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-44 h-8" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36 h-8"><SelectValue placeholder="ประเภท" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="acknowledge">รับทราบ</SelectItem>
                  <SelectItem value="permit">อนุญาต</SelectItem>
                  <SelectItem value="approve">อนุมัติ</SelectItem>
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
                <TableHead>ประเภท</TableHead>
                <TableHead>คำขอ/บันทึก</TableHead>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>วันที่ส่ง</TableHead>
                <TableHead>ผู้ดำเนินการ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(r => {
                const at = actionTypes.find(a => a.id === r.actionType);
                const AtIcon = at?.icon || CheckCircle;
                return (
                  <TableRow key={r.id} className="hover:bg-amber-50/30">
                    <TableCell className="text-[10px] font-mono text-gray-500">{r.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <AtIcon className={`w-3.5 h-3.5 ${at?.color || ''}`} />
                        <Badge className={`text-[9px] border ${at?.bgColor || ''}`}>{r.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium max-w-[200px] truncate">{r.requestTitle}</TableCell>
                    <TableCell>
                      <p className="text-xs">{r.scholarName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{r.scholarId}</p>
                    </TableCell>
                    <TableCell className="text-[10px] text-gray-500 whitespace-nowrap">{r.requestDate}</TableCell>
                    <TableCell>
                      {r.status === 'completed' ? (
                        <div><p className="text-[10px]">{r.actionBy}</p><p className="text-[9px] text-gray-400">{r.actionByRole}</p></div>
                      ) : (
                        <span className="text-[10px] text-gray-400">รอดำเนินการ</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><CheckCircle className="w-3 h-3 mr-0.5" />ดำเนินการแล้ว</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 text-[9px] border border-yellow-200"><Clock className="w-3 h-3 mr-0.5" />รอดำเนินการ</Badge>
                      )}
                    </TableCell>
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

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        {selectedAction && (
          <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
            <div className={`bg-gradient-to-r ${selectedAction.gradient} px-6 py-5 text-white`}>
              <DialogTitle className="text-white text-lg flex items-center gap-2">
                <selectedAction.icon className="w-5 h-5" />
                ดำเนินการ: {selectedAction.name}
              </DialogTitle>
              <DialogDescription className="text-white/80 mt-1">{selectedAction.definition}</DialogDescription>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="space-y-1.5"><Label className="text-xs">เลือกบันทึก/คำขอ <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent>{actionRecords.filter(r => r.actionType === selectedAction.id && r.status === 'pending').map(r => <SelectItem key={r.id} value={r.id}>{r.id} — {r.requestTitle}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">ผู้ดำเนินการ</Label><Input placeholder="ชื่อ-ตำแหน่ง" /></div>
              <div className="space-y-1.5"><Label className="text-xs">ความเห็น/หมายเหตุ</Label><Textarea placeholder="ระบุความเห็น..." className="min-h-[70px]" /></div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => toast.info('อัปโหลดเอกสาร')}>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Upload className="w-4 h-4 text-gray-400" /><span>อัปโหลดเอกสารประกอบ</span><Badge variant="outline" className="text-[8px] ml-auto">.pdf .jpg .png</Badge></div>
              </div>
            </div>
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>ยกเลิก</Button>
              <Button onClick={() => { setActionDialogOpen(false); toast.success(`ดำเนินการ "${selectedAction.name}" เรียบร้อย`); }}>
                <selectedAction.icon className="w-4 h-4 mr-1" />{selectedAction.name}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
