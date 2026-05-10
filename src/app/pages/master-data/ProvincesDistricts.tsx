import { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin, Search, Plus, Edit, Trash2, ChevronRight, ChevronDown, Globe
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

const provinces = [
  { id: 1, code: '10', name: 'กรุงเทพมหานคร', region: 'ภาคกลาง', districts: 50, scholars: 345 },
  { id: 2, code: '11', name: 'สมุทรปราการ', region: 'ภาคกลาง', districts: 6, scholars: 25 },
  { id: 3, code: '12', name: 'นนทบุรี', region: 'ภาคกลาง', districts: 6, scholars: 42 },
  { id: 4, code: '13', name: 'ปทุมธานี', region: 'ภาคกลาง', districts: 7, scholars: 38 },
  { id: 5, code: '14', name: 'พระนครศรีอยุธยา', region: 'ภาคกลาง', districts: 16, scholars: 15 },
  { id: 6, code: '20', name: 'ชลบุรี', region: 'ภาคตะวันออก', districts: 11, scholars: 28 },
  { id: 7, code: '30', name: 'นครราชสีมา', region: 'ภาคตะวันออกเฉียงเหนือ', districts: 32, scholars: 22 },
  { id: 8, code: '40', name: 'ขอนแก่น', region: 'ภาคตะวันออกเฉียงเหนือ', districts: 26, scholars: 18 },
  { id: 9, code: '50', name: 'เชียงใหม่', region: 'ภาคเหนือ', districts: 25, scholars: 35 },
  { id: 10, code: '73', name: 'นครปฐม', region: 'ภาคกลาง', districts: 7, scholars: 30 },
  { id: 11, code: '90', name: 'สงขลา', region: 'ภาคใต้', districts: 16, scholars: 20 },
  { id: 12, code: '80', name: 'นครศรีธรรมราช', region: 'ภาคใต้', districts: 23, scholars: 12 },
];

const districts = [
  { id: 1, code: '1001', name: 'พระนคร', province: 'กรุงเทพมหานคร', subDistricts: 12, postalCode: '10200' },
  { id: 2, code: '1002', name: 'ดุสิต', province: 'กรุงเทพมหานคร', subDistricts: 5, postalCode: '10300' },
  { id: 3, code: '1003', name: 'หนองจอก', province: 'กรุงเทพมหานคร', subDistricts: 8, postalCode: '10530' },
  { id: 4, code: '1004', name: 'บางรัก', province: 'กรุงเทพมหานคร', subDistricts: 5, postalCode: '10500' },
  { id: 5, code: '1005', name: 'บางเขน', province: 'กรุงเทพมหานคร', subDistricts: 2, postalCode: '10220' },
  { id: 6, code: '1006', name: 'บางกะปิ', province: 'กรุงเทพมหานคร', subDistricts: 2, postalCode: '10240' },
  { id: 7, code: '1007', name: 'ปทุมวัน', province: 'กรุงเทพมหานคร', subDistricts: 4, postalCode: '10330' },
  { id: 8, code: '1008', name: 'ป้อมปราบศัตรูพ่าย', province: 'กรุงเทพมหานคร', subDistricts: 5, postalCode: '10100' },
  { id: 9, code: '1009', name: 'พระโขนง', province: 'กรุงเทพมหานคร', subDistricts: 3, postalCode: '10260' },
  { id: 10, code: '1010', name: 'มีนบุรี', province: 'กรุงเทพมหานคร', subDistricts: 2, postalCode: '10510' },
  { id: 11, code: '1024', name: 'จตุจักร', province: 'กรุงเทพมหานคร', subDistricts: 5, postalCode: '10900' },
  { id: 12, code: '1020', name: 'ลาดพร้าว', province: 'กรุงเทพมหานคร', subDistricts: 2, postalCode: '10230' },
];

const countries = [
  { id: 1, code: 'US', nameTh: 'สหรัฐอเมริกา', nameEn: 'United States', region: 'อเมริกาเหนือ', scholars: 185, universities: 45 },
  { id: 2, code: 'GB', nameTh: 'สหราชอาณาจักร', nameEn: 'United Kingdom', region: 'ยุโรป', scholars: 142, universities: 38 },
  { id: 3, code: 'JP', nameTh: 'ญี่ปุ่น', nameEn: 'Japan', region: 'เอเชีย', scholars: 88, universities: 22 },
  { id: 4, code: 'AU', nameTh: 'ออสเตรเลีย', nameEn: 'Australia', region: 'โอเชียเนีย', scholars: 65, universities: 18 },
  { id: 5, code: 'DE', nameTh: 'เยอรมนี', nameEn: 'Germany', region: 'ยุโรป', scholars: 52, universities: 15 },
  { id: 6, code: 'FR', nameTh: 'ฝรั่งเศส', nameEn: 'France', region: 'ยุโรป', scholars: 35, universities: 12 },
  { id: 7, code: 'CH', nameTh: 'สวิตเซอร์แลนด์', nameEn: 'Switzerland', region: 'ยุโรป', scholars: 28, universities: 8 },
  { id: 8, code: 'CA', nameTh: 'แคนาดา', nameEn: 'Canada', region: 'อเมริกาเหนือ', scholars: 22, universities: 10 },
  { id: 9, code: 'KR', nameTh: 'เกาหลีใต้', nameEn: 'South Korea', region: 'เอเชีย', scholars: 18, universities: 8 },
  { id: 10, code: 'NL', nameTh: 'เนเธอร์แลนด์', nameEn: 'Netherlands', region: 'ยุโรป', scholars: 15, universities: 6 },
  { id: 11, code: 'SG', nameTh: 'สิงคโปร์', nameEn: 'Singapore', region: 'เอเชีย', scholars: 12, universities: 4 },
  { id: 12, code: 'NZ', nameTh: 'นิวซีแลนด์', nameEn: 'New Zealand', region: 'โอเชียเนีย', scholars: 8, universities: 5 },
];

export function ProvincesDistricts() {
  const [activeTab, setActiveTab] = useState('provinces');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [expandedProvince, setExpandedProvince] = useState<number | null>(null);

  const filteredProvinces = provinces.filter(p => {
    const matchSearch = searchQuery === '' || p.name.includes(searchQuery) || p.code.includes(searchQuery);
    const matchRegion = regionFilter === 'all' || p.region === regionFilter;
    return matchSearch && matchRegion;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'จังหวัด', value: 77, icon: MapPin, color: 'blue' },
          { label: 'อำเภอ/เขต', value: 878, icon: ChevronRight, color: 'green' },
          { label: 'ประเทศที่รับทุน', value: 35, icon: Globe, color: 'purple' },
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

      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {[
              { id: 'provinces', label: 'จังหวัด', icon: MapPin },
              { id: 'districts', label: 'อำเภอ/เขต', icon: ChevronRight },
              { id: 'countries', label: 'ประเทศ', icon: Globe },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-6 py-3 text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {/* Provinces */}
            {activeTab === 'provinces' && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">จังหวัด (77 จังหวัด)</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มจังหวัด</Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-white text-lg">เพิ่มจังหวัด</DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลจังหวัด</DialogDescription>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2"><Label>ชื่อจังหวัด</Label><Input placeholder="ชื่อจังหวัด" /></div>
                        <div className="space-y-2"><Label>ภาค</Label><Input placeholder="ภาค" /></div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">บันทึก</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="ค้นหาจังหวัด..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="ภาค" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกภาค</SelectItem>
                      <SelectItem value="ภาคกลาง">ภาคกลาง</SelectItem>
                      <SelectItem value="ภาคเหนือ">ภาคเหนือ</SelectItem>
                      <SelectItem value="ภาคตะวันออกเฉียงเหนือ">ภาคตะวันออกเฉียงเหนือ</SelectItem>
                      <SelectItem value="ภาคตะวันออก">ภาคตะวันออก</SelectItem>
                      <SelectItem value="ภาคใต้">ภาคใต้</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">รหัส</TableHead>
                        <TableHead>จังหวัด</TableHead>
                        <TableHead>ภาค</TableHead>
                        <TableHead>จำนวนอำเภอ</TableHead>
                        <TableHead>นักเรียนทุน</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProvinces.map((prov, i) => (
                        <motion.tr key={prov.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                          <TableCell><Badge variant="outline" className="font-mono">{prov.code}</Badge></TableCell>
                          <TableCell className="font-medium">{prov.name}</TableCell>
                          <TableCell><Badge variant="outline">{prov.region}</Badge></TableCell>
                          <TableCell>{prov.districts} อำเภอ</TableCell>
                          <TableCell>{prov.scholars} คน</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {/* Districts */}
            {activeTab === 'districts' && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">อำเภอ/เขต</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มอำเภอ</Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-white text-lg">เพิ่มอำเภอ</DialogTitle>
                            <DialogDescription className="text-green-100 mt-1">กรอกข้อมูลอำเภอ</DialogDescription>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2"><Label>ชื่ออำเภอ</Label><Input placeholder="ชื่ออำเภอ" /></div>
                        <div className="space-y-2"><Label>จังหวัด</Label><Input placeholder="จังหวัด" /></div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                        <Button className="bg-green-600 hover:bg-green-700">บันทึก</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="ค้นหาอำเภอ/เขต..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="จังหวัด" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="bkk">กรุงเทพมหานคร</SelectItem>
                      <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>อำเภอ/เขต</TableHead>
                        <TableHead>จังหวัด</TableHead>
                        <TableHead>ตำบล/แขวง</TableHead>
                        <TableHead>รหัสไปรษณีย์</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {districts.filter(d => searchQuery === '' || d.name.includes(searchQuery)).map((dist, i) => (
                        <motion.tr key={dist.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                          <TableCell><Badge variant="outline" className="font-mono text-xs">{dist.code}</Badge></TableCell>
                          <TableCell className="font-medium">{dist.name}</TableCell>
                          <TableCell className="text-sm text-gray-600">{dist.province}</TableCell>
                          <TableCell>{dist.subDistricts} แขวง</TableCell>
                          <TableCell className="font-mono text-sm">{dist.postalCode}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {/* Countries */}
            {activeTab === 'countries' && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">ประเทศที่รับทุนศึกษา ({countries.length} ประเทศ)</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="w-4 h-4 mr-1" /> เพิ่มประเทศ</Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-white text-lg">เพิ่มประเทศ</DialogTitle>
                            <DialogDescription className="text-purple-100 mt-1">กรอกข้อมูลประเทศ</DialogDescription>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2"><Label>ชื่อประเทศ</Label><Input placeholder="ชื่อประเทศ" /></div>
                        <div className="space-y-2"><Label>ภูมิภาค</Label><Input placeholder="ภูมิภาค" /></div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                        <Button className="bg-purple-600 hover:bg-purple-700">บันทึก</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="ค้นหาประเทศ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="ภูมิภาค" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="europe">ยุโรป</SelectItem>
                      <SelectItem value="na">อเมริกาเหนือ</SelectItem>
                      <SelectItem value="asia">เอเชีย</SelectItem>
                      <SelectItem value="oceania">โอเชียเนีย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>ชื่อ (ไทย)</TableHead>
                        <TableHead>ชื่อ (อังกฤษ)</TableHead>
                        <TableHead>ภูมิภาค</TableHead>
                        <TableHead>นักเรียนทุน</TableHead>
                        <TableHead>สถาบัน</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {countries.filter(c => searchQuery === '' || c.nameTh.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())).map((country, i) => (
                        <motion.tr key={country.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                          <TableCell><Badge variant="outline" className="font-mono">{country.code}</Badge></TableCell>
                          <TableCell className="font-medium">{country.nameTh}</TableCell>
                          <TableCell className="text-sm text-gray-600">{country.nameEn}</TableCell>
                          <TableCell><Badge variant="outline">{country.region}</Badge></TableCell>
                          <TableCell>{country.scholars} คน</TableCell>
                          <TableCell>{country.universities} แห่ง</TableCell>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
