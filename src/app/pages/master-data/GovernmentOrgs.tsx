import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building, Search, Plus, Edit, Trash2, MapPin, Users,
  ChevronRight, ChevronDown, Landmark, Globe
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

const organizations = [
  { id: 1, code: 'OCSC', name: 'สำนักงาน ก.พ.', ministry: 'สำนักนายกรัฐมนตรี', type: 'ส่วนราชการ', province: 'นนทบุรี', scholars: 245, positions: 12, active: true },
  { id: 2, code: 'MHESI', name: 'กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม', ministry: '-', type: 'กระทรวง', province: 'กรุงเทพฯ', scholars: 188, positions: 18, active: true },
  { id: 3, code: 'NSTDA', name: 'สำนักงานพัฒนาวิทยาศาสตร์ฯ (สวทช.)', ministry: 'กระทรวงการอุดมศึกษาฯ', type: 'องค์การมหาชน', province: 'ปทุมธานี', scholars: 88, positions: 8, active: true },
  { id: 4, code: 'MOF', name: 'กระทรวงการคลัง', ministry: '-', type: 'กระทรวง', province: 'กรุงเทพฯ', scholars: 65, positions: 15, active: true },
  { id: 5, code: 'MDES', name: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม', ministry: '-', type: 'กระทรวง', province: 'กรุงเทพฯ', scholars: 42, positions: 10, active: true },
  { id: 6, code: 'DSS', name: 'กรมวิทยาศาสตร์บริการ', ministry: 'กระทรวงการอุดมศึกษาฯ', type: 'กรม', province: 'กรุงเทพฯ', scholars: 35, positions: 6, active: true },
  { id: 7, code: 'CU', name: 'จุฬาลงกรณ์มหาวิทยาลัย', ministry: 'กระทรวงการอุดมศึกษาฯ', type: 'สถาบันอุดมศึกษา', province: 'กรุงเทพฯ', scholars: 55, positions: 20, active: true },
  { id: 8, code: 'MU', name: 'มหาวิทยาลัยมหิดล', ministry: 'กระทรวงการอุดมศึกษาฯ', type: 'สถาบันอุดมศึกษา', province: 'นครปฐม', scholars: 48, positions: 18, active: true },
  { id: 9, code: 'DPSD', name: 'กรมพัฒนาทรัพยากรบุคคล', ministry: 'กระทรวงทรัพยากรธรรมชาติฯ', type: 'กรม', province: 'กรุงเทพฯ', scholars: 22, positions: 5, active: true },
  { id: 10, code: 'BOI', name: 'สำนักงานคณะกรรมการส่งเสริมการลงทุน', ministry: 'สำนักนายกรัฐมนตรี', type: 'ส่วนราชการ', province: 'กรุงเทพฯ', scholars: 15, positions: 7, active: true },
];

const positions = [
  { id: 1, name: 'นักวิชาการคอมพิวเตอร์', level: 'ปฏิบัติการ - ชำนาญการพิเศษ', category: 'วิชาการ', active: true },
  { id: 2, name: 'นักวิทยาศาสตร์', level: 'ปฏิบัติการ - เชี่ยวชาญ', category: 'วิชาการ', active: true },
  { id: 3, name: 'นักวิเคราะห์นโยบายและแผน', level: 'ปฏิบัติการ - ทรงคุณวุฒิ', category: 'วิชาการ', active: true },
  { id: 4, name: 'วิศวกร', level: 'ปฏิบัติการ - เชี่ยวชาญ', category: 'วิชาการ', active: true },
  { id: 5, name: 'นักวิจัย', level: 'ปฏิบัติการ - เชี่ยวชาญ', category: 'วิชาการ', active: true },
  { id: 6, name: 'เจ้าพนักงานธุรการ', level: 'ปฏิบัติงาน - อาวุโส', category: 'ทั่วไป', active: true },
  { id: 7, name: 'นักทรัพยากรบุคคล', level: 'ปฏิบัติการ - ชำนาญการพิเศษ', category: 'วิชาการ', active: true },
  { id: 8, name: 'นายแพทย์', level: 'ปฏิบัติการ - ทรงคุณวุฒิ', category: 'วิชาการ', active: true },
  { id: 9, name: 'อัยการ', level: 'ผู้ช่วย - สูงสุด', category: 'อัยการ', active: true },
  { id: 10, name: 'ผู้พิพากษา', level: 'ผู้ช่วย - อาวุโส', category: 'ตุลาการ', active: true },
];

const civilServiceLevels = [
  { id: 1, name: 'ปฏิบัติการ', abbr: 'ปก.', category: 'วิชาการ', salaryRange: '15,000-22,750', active: true },
  { id: 2, name: 'ชำนาญการ', abbr: 'ชก.', category: 'วิชาการ', salaryRange: '19,860-43,600', active: true },
  { id: 3, name: 'ชำนาญการพิเศษ', abbr: 'ชกพ.', category: 'วิชาการ', salaryRange: '24,400-59,770', active: true },
  { id: 4, name: 'เชี่ยวชาญ', abbr: 'ชช.', category: 'วิชาการ', salaryRange: '31,350-69,040', active: true },
  { id: 5, name: 'ทรงคุณวุฒิ', abbr: 'ทว.', category: 'วิชาการ', salaryRange: '42,830-76,800', active: true },
  { id: 6, name: 'ปฏิบัติงาน', abbr: 'ปง.', category: 'ทั่วไป', salaryRange: '11,500-22,750', active: true },
  { id: 7, name: 'ชำนาญงาน', abbr: 'ชง.', category: 'ทั่วไป', salaryRange: '15,000-36,020', active: true },
  { id: 8, name: 'อาวุโส', abbr: 'อว.', category: 'ทั่วไป', salaryRange: '22,140-50,550', active: true },
  { id: 9, name: 'ต้น', abbr: 'ต้น', category: 'บริหาร', salaryRange: '28,550-69,040', active: true },
  { id: 10, name: 'สูง', abbr: 'สูง', category: 'บริหาร', salaryRange: '53,690-76,800', active: true },
];

export function GovernmentOrgs() {
  const [orgTab, setOrgTab] = useState('organizations');
  const [searchQuery, setSearchQuery] = useState('');
  const [addOrgOpen, setAddOrgOpen] = useState(false);
  const [addPosOpen, setAddPosOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs value={orgTab} onValueChange={setOrgTab}>
        <TabsList>
          <TabsTrigger value="organizations">
            <Building className="w-4 h-4 mr-1" /> หน่วยงาน/ต้นสังกัด
          </TabsTrigger>
          <TabsTrigger value="positions">
            <Landmark className="w-4 h-4 mr-1" /> ตำแหน่งข้าราชการ
          </TabsTrigger>
          <TabsTrigger value="levels">
            <ChevronRight className="w-4 h-4 mr-1" /> ระดับตำแหน่ง
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-600" />
                  หน่วยงานและต้นสังกัด ({organizations.length} หน่วยงาน)
                </CardTitle>
                <Dialog open={addOrgOpen} onOpenChange={setAddOrgOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มหน่วยงาน</Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 gap-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-white text-lg">เพิ่มหน่วยงานใหม่</DialogTitle>
                          <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลหน่วยงานราชการ</DialogDescription>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 px-6 py-5 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>รหัสหน่วยงาน</Label>
                        <Input placeholder="รหัส" />
                      </div>
                      <div className="space-y-2">
                        <Label>ชื่อหน่วยงาน</Label>
                        <Input placeholder="ชื่อเต็ม" />
                      </div>
                      <div className="space-y-2">
                        <Label>ประเภท</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ministry">กระทรวง</SelectItem>
                            <SelectItem value="dept">กรม</SelectItem>
                            <SelectItem value="office">ส่วนราชการ</SelectItem>
                            <SelectItem value="public_org">องค์การมหาชน</SelectItem>
                            <SelectItem value="university">สถาบันอุดมศึกษา</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>สังกัดกระทรวง</Label>
                        <Input placeholder="ชื่อกระทรวง" />
                      </div>
                      <div className="space-y-2">
                        <Label>จังหวัด</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bkk">กรุงเทพฯ</SelectItem>
                            <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                            <SelectItem value="pathum">ปทุมธานี</SelectItem>
                            <SelectItem value="nakhon">นครปฐม</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>สถานะ</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">ใช้งาน</SelectItem>
                            <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                      <Button variant="outline" onClick={() => setAddOrgOpen(false)}>ยกเลิก</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setAddOrgOpen(false); toast.success('เพิ่มหน่วยงานใหม่เรียบร้อย'); }}>บันทึก</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="ค้นหาหน่วยงาน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="ประเภท" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="ministry">กระทรวง</SelectItem>
                      <SelectItem value="dept">กรม</SelectItem>
                      <SelectItem value="office">ส่วนราชการ</SelectItem>
                      <SelectItem value="public_org">องค์การมหาชน</SelectItem>
                      <SelectItem value="university">สถาบันอุดมศึกษา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>ชื่อหน่วยงาน</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>สังกัด</TableHead>
                        <TableHead>จังหวัด</TableHead>
                        <TableHead>ผู้รับทุน</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.filter(o => searchQuery === '' || o.name.includes(searchQuery) || o.code.toLowerCase().includes(searchQuery.toLowerCase())).map((org, i) => (
                        <motion.tr
                          key={org.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-blue-50/50"
                        >
                          <TableCell><Badge variant="outline" className="font-mono text-xs">{org.code}</Badge></TableCell>
                          <TableCell className="font-medium">{org.name}</TableCell>
                          <TableCell><Badge variant="outline">{org.type}</Badge></TableCell>
                          <TableCell className="text-sm text-gray-600">{org.ministry}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />{org.province}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="w-3 h-3 text-gray-400" />{org.scholars} คน
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={org.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                              {org.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-indigo-600" />
                  ตำแหน่งข้าราชการ ({positions.length} ตำแหน่ง)
                </CardTitle>
                <Dialog open={addPosOpen} onOpenChange={setAddPosOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มตำแหน่ง</Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 gap-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <Landmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-white text-lg">เพิ่มตำแหน่งข้าราชการ</DialogTitle>
                          <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลตำแหน่งและระดับ</DialogDescription>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2"><Label>ชื่อตำแหน่ง</Label><Input placeholder="ชื่อตำแหน่ง" /></div>
                      <div className="space-y-2">
                        <Label>ประเภทตำแหน่ง</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">วิชาการ</SelectItem>
                            <SelectItem value="general">ทั่วไป</SelectItem>
                            <SelectItem value="executive">บริหาร</SelectItem>
                            <SelectItem value="management">อำนวยการ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>ช่วงระดับ</Label><Input placeholder="เช่น ปฏิบัติการ - ชำนาญการพิเศษ" /></div>
                    </div>
                    <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                      <Button variant="outline" onClick={() => setAddPosOpen(false)}>ยกเลิก</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setAddPosOpen(false); toast.success('เพิ่มตำแหน่งเรียบร้อย'); }}>บันทึก</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อตำแหน่ง</TableHead>
                      <TableHead>ช่วงระดับ</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((pos, i) => (
                      <motion.tr key={pos.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">{pos.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{pos.level}</TableCell>
                        <TableCell><Badge variant="outline">{pos.category}</Badge></TableCell>
                        <TableCell>
                          <Badge className={pos.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                            {pos.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-teal-600" />
                ระดับตำแหน่งข้าราชการ ({civilServiceLevels.length} ระดับ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อระดับ</TableHead>
                      <TableHead>ตัวย่อ</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ช่วงเงินเดือน (บาท)</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {civilServiceLevels.map((lv, i) => (
                      <motion.tr key={lv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium">{lv.name}</TableCell>
                        <TableCell><Badge variant="outline" className="font-mono">{lv.abbr}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{lv.category}</Badge></TableCell>
                        <TableCell className="text-sm font-mono">{lv.salaryRange}</TableCell>
                        <TableCell>
                          <Badge className={lv.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                            {lv.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
