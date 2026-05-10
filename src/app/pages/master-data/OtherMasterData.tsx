import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database, Search, Plus, Edit, Trash2, Settings, Tag,
  Banknote, Languages, BookOpen, Stethoscope, Heart
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
import { toast } from 'sonner';

type CategoryKey = 'educationLevels' | 'currencies' | 'languages' | 'healthConditions' | 'documentTypes' | 'tags';

const categories: { id: CategoryKey; label: string; icon: typeof BookOpen; color: string }[] = [
  { id: 'educationLevels', label: 'ระดับการศึกษา', icon: BookOpen, color: 'blue' },
  { id: 'currencies', label: 'สกุลเงิน', icon: Banknote, color: 'green' },
  { id: 'languages', label: 'ภาษา', icon: Languages, color: 'purple' },
  { id: 'healthConditions', label: 'ข้อมูลสุขภาพ', icon: Stethoscope, color: 'red' },
  { id: 'documentTypes', label: 'ประเภทเอกสาร', icon: Database, color: 'cyan' },
  { id: 'tags', label: 'แท็ก/ป้ายกำกับ', icon: Tag, color: 'amber' },
];

const dataMap: Record<CategoryKey, { id: number; code: string; name: string; description: string; active: boolean }[]> = {
  educationLevels: [
    { id: 1, code: 'BACHELOR', name: 'ปริญญาตรี', description: "Bachelor's Degree", active: true },
    { id: 2, code: 'MASTER', name: 'ปริญญาโท', description: "Master's Degree", active: true },
    { id: 3, code: 'DOCTORAL', name: 'ปริญญาเอก', description: 'Doctoral/Ph.D.', active: true },
    { id: 4, code: 'POSTDOC', name: 'หลังปริญญาเอก', description: 'Post-doctoral', active: true },
    { id: 5, code: 'CERT', name: 'ประกาศนียบัตร', description: 'Certificate', active: true },
    { id: 6, code: 'DIPLOMA', name: 'อนุปริญญา', description: 'Diploma', active: true },
    { id: 7, code: 'TRAINING', name: 'ฝึกอบรม', description: 'Training Program', active: true },
    { id: 8, code: 'RESEARCH', name: 'วิจัย', description: 'Research Program', active: true },
  ],
  currencies: [
    { id: 1, code: 'THB', name: 'บาทไทย', description: 'Thai Baht (฿)', active: true },
    { id: 2, code: 'USD', name: 'ดอลลาร์สหรัฐ', description: 'US Dollar ($)', active: true },
    { id: 3, code: 'GBP', name: 'ปอนด์สเตอร์ลิง', description: 'British Pound (£)', active: true },
    { id: 4, code: 'EUR', name: 'ยูโร', description: 'Euro (€)', active: true },
    { id: 5, code: 'JPY', name: 'เยนญี่ปุ่น', description: 'Japanese Yen (¥)', active: true },
    { id: 6, code: 'AUD', name: 'ดอลลาร์ออสเตรเลีย', description: 'Australian Dollar (A$)', active: true },
    { id: 7, code: 'CHF', name: 'ฟรังก์สวิส', description: 'Swiss Franc (CHF)', active: true },
    { id: 8, code: 'CAD', name: 'ดอลลาร์แคนาดา', description: 'Canadian Dollar (C$)', active: true },
    { id: 9, code: 'KRW', name: 'วอนเกาหลี', description: 'South Korean Won (₩)', active: true },
    { id: 10, code: 'SGD', name: 'ดอลลาร์สิงคโปร์', description: 'Singapore Dollar (S$)', active: true },
  ],
  languages: [
    { id: 1, code: 'TH', name: 'ภาษาไทย', description: 'Thai', active: true },
    { id: 2, code: 'EN', name: 'ภาษาอังกฤษ', description: 'English', active: true },
    { id: 3, code: 'JA', name: 'ภาษาญี่ปุ่น', description: 'Japanese', active: true },
    { id: 4, code: 'DE', name: 'ภาษาเยอรมัน', description: 'German', active: true },
    { id: 5, code: 'FR', name: 'ภาษาฝรั่งเศส', description: 'French', active: true },
    { id: 6, code: 'KO', name: 'ภาษาเกาหลี', description: 'Korean', active: true },
    { id: 7, code: 'ZH', name: 'ภาษาจีน', description: 'Chinese (Mandarin)', active: true },
  ],
  healthConditions: [
    { id: 1, code: 'BLOOD_A', name: 'หมู่โลหิต A', description: 'Blood Type A', active: true },
    { id: 2, code: 'BLOOD_B', name: 'หมู่โลหิต B', description: 'Blood Type B', active: true },
    { id: 3, code: 'BLOOD_O', name: 'หมู่โลหิต O', description: 'Blood Type O', active: true },
    { id: 4, code: 'BLOOD_AB', name: 'หมู่โลหิต AB', description: 'Blood Type AB', active: true },
    { id: 5, code: 'ALLERGY', name: 'ภูมิแพ้', description: 'Allergy conditions', active: true },
    { id: 6, code: 'CHRONIC', name: 'โรคเรื้อรัง', description: 'Chronic diseases', active: true },
    { id: 7, code: 'DISABILITY', name: 'ความพิการ', description: 'Disability types', active: true },
  ],
  documentTypes: [
    { id: 1, code: 'ID_CARD', name: 'บัตรประชาชน', description: 'Thai National ID Card', active: true },
    { id: 2, code: 'PASSPORT', name: 'หนังสือเดินทาง', description: 'Passport', active: true },
    { id: 3, code: 'TRANSCRIPT', name: 'ใบแสดงผลการศึกษา', description: 'Academic Transcript', active: true },
    { id: 4, code: 'DEGREE', name: 'ปริญญาบัตร', description: 'Degree Certificate', active: true },
    { id: 5, code: 'CONTRACT', name: 'สัญญารับทุน', description: 'Scholarship Contract', active: true },
    { id: 6, code: 'GUARANTEE', name: 'หนังสือค้ำประกัน', description: 'Guarantee Letter', active: true },
    { id: 7, code: 'MEDICAL', name: 'ใบรับรองแพทย์', description: 'Medical Certificate', active: true },
    { id: 8, code: 'ACCEPTANCE', name: 'หนังสือตอบรับจากสถาบัน', description: 'Admission Letter', active: true },
    { id: 9, code: 'REPORT', name: 'รายงานผลการศึกษา', description: 'Progress Report', active: true },
    { id: 10, code: 'INSURANCE', name: 'กรมธรรม์ประกัน', description: 'Insurance Policy', active: true },
  ],
  tags: [
    { id: 1, code: 'URGENT', name: 'เร่งด่วน', description: 'รายการเร่งด่วน', active: true },
    { id: 2, code: 'VIP', name: 'สำคัญพิเศษ', description: 'กรณีสำคัญพิเศษ', active: true },
    { id: 3, code: 'FOLLOW_UP', name: 'ติดตาม', description: 'ต้องติดตาม', active: true },
    { id: 4, code: 'PENDING_DOC', name: 'รอเอกสาร', description: 'รอเอกสารเพิ่มเติม', active: true },
    { id: 5, code: 'REVIEWED', name: 'ตรวจสอบแล้ว', description: 'ตรวจสอบเรียบร้อย', active: true },
  ],
};

export function OtherMasterData() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('educationLevels');
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const currentData = dataMap[selectedCategory] || [];
  const currentCategory = categories.find(c => c.id === selectedCategory);
  const filteredData = currentData.filter(d =>
    searchQuery === '' || d.name.includes(searchQuery) || d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === cat.id
                  ? 'ring-2 ring-blue-500 bg-blue-50/50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto rounded-lg bg-${cat.color}-100 flex items-center justify-center mb-2`}>
                  <cat.icon className={`w-5 h-5 text-${cat.color}-600`} />
                </div>
                <p className="text-xs font-medium">{cat.label}</p>
                <p className="text-lg font-bold text-gray-700">{dataMap[cat.id].length}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {currentCategory && <currentCategory.icon className={`w-5 h-5 text-${currentCategory.color}-600`} />}
              {currentCategory?.label} ({currentData.length} รายการ)
            </CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มข้อมูล</Button>
              </DialogTrigger>
              <DialogContent className="p-0 gap-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {currentCategory && <currentCategory.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <DialogTitle className="text-white text-lg">เพิ่ม{currentCategory?.label}ใหม่</DialogTitle>
                      <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลที่ต้องการเพิ่ม</DialogDescription>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2"><Label>รหัส</Label><Input placeholder="รหัส" /></div>
                  <div className="space-y-2"><Label>ชื่อ</Label><Input placeholder="ชื่อ" /></div>
                  <div className="space-y-2"><Label>คำอธิบาย</Label><Input placeholder="คำอธิบาย" /></div>
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
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>ยกเลิก</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setAddDialogOpen(false); toast.success(`เพิ่ม${currentCategory?.label}ใหม่เรียบร้อย`); }}>บันทึก</Button>
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
                <Input placeholder={`ค้นหา${currentCategory?.label}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">รหัส</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>คำอธิบาย</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-blue-50/50"
                    >
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{item.code}</Badge></TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.description}</TableCell>
                      <TableCell>
                        <Badge className={item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                          {item.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
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
    </div>
  );
}
