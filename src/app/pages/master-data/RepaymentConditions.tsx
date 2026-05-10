import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Search, Plus, Edit, Trash2, AlertTriangle, DollarSign,
  Calculator, Clock, Scale
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

const repaymentConditions = [
  {
    id: 1,
    code: 'RC-001',
    name: 'ชดใช้ทุน 2 เท่า (มาตรฐาน)',
    description: 'ผู้รับทุนต้องกลับมาปฏิบัติราชการเป็นเวลา 2 เท่าของระยะเวลาที่ได้รับทุน',
    multiplier: 2,
    type: 'ปฏิบัติราชการ',
    penaltyRate: 10,
    applicableScholarships: ['ทุน ก.พ.', 'ทุนพัฒนาข้าราชการ'],
    status: 'active',
    effectiveDate: '01/01/2550',
  },
  {
    id: 2,
    code: 'RC-002',
    name: 'ชดใช้ทุน 3 เท่า (โครงการพิเศษ)',
    description: 'ผู้รับทุนต้องกลับมาปฏิบัติราชการเป็นเวลา 3 เท่าของระยะเวลาที่ได้รับทุน',
    multiplier: 3,
    type: 'ปฏิบัติราชการ',
    penaltyRate: 15,
    applicableScholarships: ['ทุนโครงการพิเศษ AI'],
    status: 'active',
    effectiveDate: '01/01/2566',
  },
  {
    id: 3,
    code: 'RC-003',
    name: 'ชดใช้เงินคืนเต็มจำนวน',
    description: 'ต้องชดใช้เงินทุนคืนเต็มจำนวนที่ได้รับพร้อมดอกเบี้ยตามอัตราที่กำหนด',
    multiplier: 1,
    type: 'ชดใช้เงิน',
    penaltyRate: 7.5,
    applicableScholarships: ['กรณีผิดสัญญา'],
    status: 'active',
    effectiveDate: '01/01/2550',
  },
  {
    id: 4,
    code: 'RC-004',
    name: 'ชดใช้ทุน 2 เท่า + เบี้ยปรับ',
    description: 'ปฏิบัติราชการ 2 เท่า กรณีผิดสัญญาต้องชดใช้เงินพร้อมเบี้ยปรับ 1.5 เท่า',
    multiplier: 2,
    type: 'ผสม',
    penaltyRate: 12,
    applicableScholarships: ['ทุนกระทรวงวิทย์', 'ทุน สกอ.'],
    status: 'active',
    effectiveDate: '01/07/2555',
  },
  {
    id: 5,
    code: 'RC-005',
    name: 'ชดใช้ทุนฝึกอบรม',
    description: 'ปฏิบัติราชการ 1 เท่าของระยะเวลาฝึกอบรม สำหรับทุนระยะสั้น',
    multiplier: 1,
    type: 'ปฏิบัติราชการ',
    penaltyRate: 5,
    applicableScholarships: ['ทุนฝึกอบรมระยะสั้น'],
    status: 'active',
    effectiveDate: '01/01/2560',
  },
  {
    id: 6,
    code: 'RC-006',
    name: 'ยกเว้นชดใช้ (กรณีพิเศษ)',
    description: 'ยกเว้นการชดใช้ทุนตามเงื่อนไขพิเศษที่คณะกรรมการอนุมัติ',
    multiplier: 0,
    type: 'ยกเว้น',
    penaltyRate: 0,
    applicableScholarships: ['กรณีพิเศษ'],
    status: 'inactive',
    effectiveDate: '01/01/2560',
  },
];

const repaymentTracking = [
  { id: 1, scholarName: 'นายสมชาย วงศ์สุวรรณ', scholarship: 'ทุน ก.พ. ปริญญาโท', condition: 'RC-001', startDate: '01/07/2563', endDate: '30/06/2567', remaining: '1 ปี 5 เดือน', status: 'กำลังชดใช้' },
  { id: 2, scholarName: 'นางสาวสุภาพร เจริญศรี', scholarship: 'ทุนกระทรวงวิทย์', condition: 'RC-004', startDate: '01/01/2565', endDate: '31/12/2570', remaining: '4 ปี 10 เดือน', status: 'กำลังชดใช้' },
  { id: 3, scholarName: 'นายวีรพงษ์ ธนาพรรณ', scholarship: 'ทุนรัฐบาล ปริญญาเอก', condition: 'RC-001', startDate: '01/01/2560', endDate: '31/12/2565', remaining: '-', status: 'ชดใช้ครบแล้ว' },
  { id: 4, scholarName: 'นายธนากร พิทักษ์ธรรม', scholarship: 'ทุนพัฒนาข้าราชการ', condition: 'RC-003', startDate: '-', endDate: '-', remaining: '-', status: 'ผิดสัญญา' },
];

export function RepaymentConditions() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'conditions' | 'tracking'>('conditions');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'เงื่อนไขชดใช้ทุน', value: 6, icon: Scale, color: 'blue' },
          { label: 'กำลังชดใช้', value: 438, icon: Clock, color: 'amber' },
          { label: 'ชดใช้ครบแล้ว', value: 689, icon: FileText, color: 'green' },
          { label: 'ผิดสัญญา/ค้างชำระ', value: 23, icon: AlertTriangle, color: 'red' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-l-4" style={{ borderLeftColor: `var(--color-${stat.color}-500, #3b82f6)` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'conditions' ? 'default' : 'outline'}
          onClick={() => setActiveView('conditions')}
        >
          <Scale className="w-4 h-4 mr-2" /> เงื่อนไขชดใช้ทุน
        </Button>
        <Button
          variant={activeView === 'tracking' ? 'default' : 'outline'}
          onClick={() => setActiveView('tracking')}
        >
          <Clock className="w-4 h-4 mr-2" /> ติดตามการชดใช้
        </Button>
      </div>

      {activeView === 'conditions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                เงื่อนไขการชดใช้ทุน
              </CardTitle>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มเงื่อนไข</Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>เพิ่มเงื่อนไขชดใช้ทุน</DialogTitle>
                    <DialogDescription>กำหนดเงื่อนไขการชดใช้ทุนใหม่</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>รหัส</Label><Input placeholder="RC-XXX" /></div>
                      <div className="space-y-2"><Label>ชื่อเงื่อนไข</Label><Input placeholder="ชื่อเงื่อนไข" /></div>
                    </div>
                    <div className="space-y-2"><Label>รายละเอียด</Label><Textarea placeholder="อธิบายเงื่อนไข..." /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>ตัวคูณ (เท่า)</Label><Input type="number" placeholder="2" /></div>
                      <div className="space-y-2">
                        <Label>ประเภท</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="service">ปฏิบัติราชการ</SelectItem>
                            <SelectItem value="money">ชดใช้เงิน</SelectItem>
                            <SelectItem value="mixed">ผสม</SelectItem>
                            <SelectItem value="exempt">ยกเว้น</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>อัตราเบี้ยปรับ (%)</Label><Input type="number" placeholder="10" /></div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => { setAddDialogOpen(false); toast.success('เพิ่มเงื่อนไขชดใช้ทุนเรียบร้อย'); }}>บันทึก</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัส</TableHead>
                    <TableHead>ชื่อเงื่อนไข</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>ตัวคูณ</TableHead>
                    <TableHead>เบี้ยปรับ</TableHead>
                    <TableHead>ทุนที่ใช้</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repaymentConditions.map((cond, i) => (
                    <motion.tr key={cond.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-blue-50/50">
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{cond.code}</Badge></TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{cond.name}</p>
                          <p className="text-xs text-gray-500 max-w-[300px] truncate">{cond.description}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{cond.type}</Badge></TableCell>
                      <TableCell className="text-center font-medium">{cond.multiplier}x</TableCell>
                      <TableCell className="text-sm">{cond.penaltyRate}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {cond.applicableScholarships.slice(0, 2).map(s => (
                            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cond.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                          {cond.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === 'tracking' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              ติดตามการชดใช้ทุน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อนักเรียนทุน</TableHead>
                    <TableHead>ทุน</TableHead>
                    <TableHead>เงื่อนไข</TableHead>
                    <TableHead>เริ่มต้น</TableHead>
                    <TableHead>สิ้นสุด</TableHead>
                    <TableHead>เหลืออีก</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repaymentTracking.map((item, i) => (
                    <motion.tr key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">{item.scholarName}</TableCell>
                      <TableCell className="text-sm">{item.scholarship}</TableCell>
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{item.condition}</Badge></TableCell>
                      <TableCell className="text-sm">{item.startDate}</TableCell>
                      <TableCell className="text-sm">{item.endDate}</TableCell>
                      <TableCell className="text-sm font-medium">{item.remaining}</TableCell>
                      <TableCell>
                        <Badge className={
                          item.status === 'กำลังชดใช้' ? 'bg-amber-100 text-amber-700' :
                          item.status === 'ชดใช้ครบแล้ว' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
