import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award, Search, Plus, Edit, Trash2, Eye, DollarSign, Globe, Calendar,
  FileText, Building, ChevronRight, ExternalLink
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

const scholarshipSources = [
  {
    id: 'SRC-001',
    name: 'ทุน ก.พ.',
    fullName: 'ทุนรัฐบาลตามความต้องการของส่วนราชการ (สำนักงาน ก.พ.)',
    type: 'ทุนรัฐบาล',
    agency: 'สำนักงาน ก.พ.',
    budget: 150000000,
    activeScholars: 245,
    totalAwarded: 1850,
    status: 'เปิดรับสมัคร',
    levels: ['ปริญญาโท', 'ปริญญาเอก'],
    countries: ['สหรัฐอเมริกา', 'สหราชอาณาจักร', 'ญี่ปุ่น', 'ออสเตรเลีย', 'เยอรมนี'],
    repaymentCondition: 'ชดใช้ 2 เท่าของระยะเวลารับทุน',
    startYear: 2500,
    description: 'ทุนรัฐบาลที่จัดสรรโดยสำนักงานคณะกรรมการข้าราชการพลเรือน สำหรับส่งข้าราชการไปศึกษาต่อต่างประเทศ',
  },
  {
    id: 'SRC-002',
    name: 'ทุนพัฒนาข้าราชการ',
    fullName: 'ทุนพัฒนาข้าราชการเพื่อสนับสนุนยุทธศาสตร์ชาติ',
    type: 'ทุนรัฐบาล',
    agency: 'สำนักงาน ก.พ.',
    budget: 80000000,
    activeScholars: 120,
    totalAwarded: 890,
    status: 'เปิดรับสมัคร',
    levels: ['ปริญญาโท', 'ปริญญาเอก', 'ฝึกอบรม'],
    countries: ['สหรัฐอเมริกา', 'สหราชอาณาจักร', 'ฝรั่งเศส'],
    repaymentCondition: 'ชดใช้ 2 เท่าของระยะเวลารับทุน',
    startYear: 2545,
    description: 'ทุนพัฒนาข้าราชการภาครัฐเพื่อเสริมสร้างศักยภาพตามยุทธศาสตร์ชาติ',
  },
  {
    id: 'SRC-003',
    name: 'ทุนกระทรวงวิทย์',
    fullName: 'ทุนกระทรวงวิทยาศาสตร์และเทคโนโลยี',
    type: 'ทุนกระทรวง',
    agency: 'กระทรวงวิทยาศาสตร์ฯ',
    budget: 65000000,
    activeScholars: 88,
    totalAwarded: 560,
    status: 'ปิดรับสมัคร',
    levels: ['ปริญญาเอก', 'วิจัย'],
    countries: ['สหรัฐอเมริกา', 'เยอรมนี', 'สวิตเซอร์แลนด์'],
    repaymentCondition: 'ปฏิบัติราชการ 2 เท่าของระยะเวลาศึกษา',
    startYear: 2530,
    description: 'ทุนสำหรับพัฒนาบุคลากรด้านวิทยาศาสตร์และเทคโนโลยี',
  },
  {
    id: 'SRC-004',
    name: 'ทุนสกอ.',
    fullName: 'ทุนสำนักงานคณะกรรมการการอุดมศึกษา',
    type: 'ทุนรัฐบาล',
    agency: 'สกอ.',
    budget: 45000000,
    activeScholars: 65,
    totalAwarded: 420,
    status: 'เปิดรับสมัคร',
    levels: ['ปริญญาเอก'],
    countries: ['สหราชอาณาจักร', 'ญี่ปุ่น', 'เกาหลีใต้'],
    repaymentCondition: 'กลับมาปฏิบัติงาน 2 เท่าของระยะเวลารับทุน',
    startYear: 2540,
    description: 'ทุนเพื่อพัฒนาอาจารย์มหาวิทยาลัย',
  },
  {
    id: 'SRC-005',
    name: 'ทุนโครงการพิเศษ AI',
    fullName: 'ทุนโครงการพิเศษด้านปัญญาประดิษฐ์และวิทยาศาสตร์ข้อมูล',
    type: 'ทุนโครงการพิเศษ',
    agency: 'สำนักงาน ก.พ.',
    budget: 30000000,
    activeScholars: 25,
    totalAwarded: 25,
    status: 'เปิดรับสมัคร',
    levels: ['ปริญญาโท', 'ปริญญาเอก'],
    countries: ['สหรัฐอเมริกา', 'แคนาดา', 'สหราชอาณาจักร'],
    repaymentCondition: 'ชดใช้ 3 เท่าของระยะเวลารับทุน',
    startYear: 2566,
    description: 'ทุนใหม่เพื่อพัฒนาบุคลากรด้าน AI และ Data Science ตามนโยบายรัฐบาล',
  },
];

const statusColorMap: Record<string, string> = {
  'เปิดรับสมัคร': 'bg-green-100 text-green-700',
  'ปิดรับสมัคร': 'bg-gray-100 text-gray-600',
  'ระงับชั่วคราว': 'bg-amber-100 text-amber-700',
};

export function ScholarshipSources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<typeof scholarshipSources[0] | null>(null);
  const [sourceTab, setSourceTab] = useState('info');

  const filtered = scholarshipSources.filter(s =>
    searchQuery === '' || `${s.name} ${s.fullName} ${s.agency} ${s.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'แหล่งทุนทั้งหมด', value: 28, icon: Award, color: 'blue' },
          { label: 'เปิดรับสมัคร', value: 15, icon: Globe, color: 'green' },
          { label: 'งบประมาณรวม (ล้าน)', value: '370', icon: DollarSign, color: 'cyan' },
          { label: 'นักเรียนทุนปัจจุบัน', value: 543, icon: Building, color: 'purple' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-l-4" style={{ borderLeftColor: `var(--color-${stat.color}-500, #3b82f6)` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              ข้อมูลแหล่งทุน / ข้อมูลการรับทุน
            </CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มแหล่งทุน</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>เพิ่มแหล่งทุนใหม่</DialogTitle>
                  <DialogDescription>กรอกข้อมูลแหล่งทุนและเงื่อนไข</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>รหัสแหล่งทุน</Label>
                    <Input placeholder="SRC-XXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>ชื่อย่อ</Label>
                    <Input placeholder="ชื่อย่อทุน" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>ชื่อเต็ม</Label>
                    <Input placeholder="ชื่อเต็มของแหล่งทุน" />
                  </div>
                  <div className="space-y-2">
                    <Label>ประเภททุน</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="เลือกประเภท" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gov">ทุนรัฐบาล</SelectItem>
                        <SelectItem value="ministry">ทุนกระทรวง</SelectItem>
                        <SelectItem value="special">ทุนโครงการพิเศษ</SelectItem>
                        <SelectItem value="exchange">ทุนแลกเปลี่ยน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>หน่วยงานที่ดูแล</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">สำนักงาน ก.พ.</SelectItem>
                        <SelectItem value="2">กระทรวงวิทยาศาสตร์ฯ</SelectItem>
                        <SelectItem value="3">สกอ.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>งบประมาณ (บาท)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>ระดับการศึกษา</Label>
                    <Input placeholder="ปริญญาโท, ปริญญาเอก" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>เงื่อนไขการชดใช้ทุน</Label>
                    <Textarea placeholder="ระบุเงื่อนไขการชดใช้ทุน..." />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>รายละเอียด</Label>
                    <Textarea placeholder="รายละเอียดเพิ่มเติม..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>ยกเลิก</Button>
                  <Button onClick={() => { setAddDialogOpen(false); toast.success('เพิ่มแหล่งทุนใหม่เรียบร้อย'); }}>บันทึก</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="ค้นหาแหล่งทุน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="ประเภททุน" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="gov">ทุนรัฐบาล</SelectItem>
                  <SelectItem value="ministry">ทุนกระทรวง</SelectItem>
                  <SelectItem value="special">ทุนโครงการพิเศษ</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="open">เปิดรับสมัคร</SelectItem>
                  <SelectItem value="closed">ปิดรับสมัคร</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัส</TableHead>
                    <TableHead>ชื่อทุน</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>หน่วยงาน</TableHead>
                    <TableHead>งบประมาณ</TableHead>
                    <TableHead>ผู้รับทุน</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((src, i) => (
                    <motion.tr
                      key={src.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-blue-50/50 cursor-pointer"
                      onClick={() => { setSelectedSource(src); setDetailOpen(true); setSourceTab('info'); }}
                    >
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{src.id}</Badge></TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{src.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[250px]">{src.fullName}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{src.type}</Badge></TableCell>
                      <TableCell className="text-sm text-gray-600">{src.agency}</TableCell>
                      <TableCell className="text-sm font-medium">{(src.budget / 1000000).toFixed(0)} ล้าน</TableCell>
                      <TableCell className="text-sm">{src.activeScholars} คน</TableCell>
                      <TableCell><Badge className={statusColorMap[src.status] || ''}>{src.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          <Button size="sm" variant="ghost" onClick={() => { setSelectedSource(src); setDetailOpen(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedSource && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {selectedSource.fullName}
                </DialogTitle>
              </DialogHeader>
              <Tabs value={sourceTab} onValueChange={setSourceTab}>
                <TabsList>
                  <TabsTrigger value="info">ข้อมูลทั่วไป</TabsTrigger>
                  <TabsTrigger value="conditions">เงื่อนไขทุน</TabsTrigger>
                  <TabsTrigger value="history">ประวัติการให้ทุน</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div><p className="text-xs text-gray-500">รหัส</p><p className="text-sm font-medium">{selectedSource.id}</p></div>
                    <div><p className="text-xs text-gray-500">ประเภท</p><p className="text-sm font-medium">{selectedSource.type}</p></div>
                    <div><p className="text-xs text-gray-500">หน่วยงานที่ดูแล</p><p className="text-sm font-medium">{selectedSource.agency}</p></div>
                    <div><p className="text-xs text-gray-500">ปีที่เริ่ม</p><p className="text-sm font-medium">พ.ศ. {selectedSource.startYear}</p></div>
                    <div><p className="text-xs text-gray-500">งบประมาณ</p><p className="text-sm font-medium">{selectedSource.budget.toLocaleString()} บาท</p></div>
                    <div><p className="text-xs text-gray-500">สถานะ</p><Badge className={statusColorMap[selectedSource.status]}>{selectedSource.status}</Badge></div>
                    <div><p className="text-xs text-gray-500">ระดับการศึกษา</p><div className="flex gap-1 flex-wrap">{selectedSource.levels.map(l => <Badge key={l} variant="outline" className="text-xs">{l}</Badge>)}</div></div>
                    <div><p className="text-xs text-gray-500">ประเทศที่รับทุน</p><div className="flex gap-1 flex-wrap">{selectedSource.countries.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div></div>
                    <div className="col-span-2"><p className="text-xs text-gray-500">คำอธิบาย</p><p className="text-sm">{selectedSource.description}</p></div>
                  </div>
                </TabsContent>
                <TabsContent value="conditions" className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">เงื่อนไขการชดใช้ทุน</h4>
                    <p className="text-sm text-amber-700">{selectedSource.repaymentCondition}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-700">เงื่อนไขเพิ่มเติม</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />ผู้รับทุนต้องกลับมาปฏิบัติราชการตามระยะเวลาที่กำหนด</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />หากไม่สามารถปฏิบัติตามสัญญาต้องชดใช้เงินทุนคืนพร้อมเบี้ยปรับ</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />ต้องรายงานผลการศึกษาทุก 6 เดือน</li>
                      <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 text-gray-400" />ต้องสำเร็จการศึกษาภายในระยะเวลาที่กำหนด</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ปี พ.ศ.</TableHead>
                        <TableHead>จำนวนทุน</TableHead>
                        <TableHead>งบที่จัดสรร</TableHead>
                        <TableHead>สำเร็จ</TableHead>
                        <TableHead>กำลังศึกษา</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[2569, 2568, 2567, 2566, 2565].map(y => (
                        <TableRow key={y}>
                          <TableCell className="font-medium">{y}</TableCell>
                          <TableCell>{Math.floor(Math.random() * 30 + 10)} ทุน</TableCell>
                          <TableCell>{Math.floor(Math.random() * 50 + 20)} ล้านบาท</TableCell>
                          <TableCell>{y < 2568 ? Math.floor(Math.random() * 15 + 5) : '-'}</TableCell>
                          <TableCell>{y >= 2567 ? Math.floor(Math.random() * 20 + 5) : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
