import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search, User, CreditCard, GraduationCap, Award, Briefcase,
  Calendar, Globe, BookOpen, DollarSign, Clock, FileText,
  CheckCircle, Plane, TrendingUp, Building, MapPin, Hash,
  ChevronRight, Download, Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { toast } from 'sonner';

interface ScholarDetail {
  id: string;
  idCard: string;
  prefix: string;
  firstName: string;
  lastName: string;
  scholarships: ScholarshipRecord[];
  serviceRecords: ServiceRecord[];
  timeline: TimelineEvent[];
}

interface ScholarshipRecord {
  code: string;
  type: string;
  source: string;
  degree: string;
  field: string;
  university: string;
  country: string;
  startDate: string;
  endDate: string;
  status: string;
  gpa: number;
  totalBudget: number;
}

interface ServiceRecord {
  agency: string;
  position: string;
  startDate: string;
  endDate: string;
  daysServed: number;
  daysRequired: number;
  status: string;
}

interface TimelineEvent {
  date: string;
  type: string;
  title: string;
  detail: string;
  icon: 'scholarship' | 'education' | 'travel' | 'service' | 'payment' | 'document';
}

const mockScholar: ScholarDetail = {
  id: 'SCH-001',
  idCard: '1-1001-XXXXX-XX-X',
  prefix: 'นางสาว',
  firstName: 'พรพิมล',
  lastName: 'สุขใจ',
  scholarships: [
    {
      code: 'AWD-2566-042', type: 'ทุนรัฐบาล ก.พ.', source: 'สำนักงาน ก.พ.', degree: 'ปริญญาเอก (Ph.D.)',
      field: 'วิศวกรรมเคมี (Chemical Engineering)', university: 'University of Oxford', country: 'สหราชอาณาจักร',
      startDate: 'ส.ค. 2566', endDate: 'ก.ค. 2570', status: 'กำลังศึกษา', gpa: 3.82, totalBudget: 8500000,
    },
  ],
  serviceRecords: [
    { agency: 'ยังไม่เริ่ม', position: '-', startDate: '-', endDate: '-', daysServed: 0, daysRequired: 730, status: 'รอ' },
  ],
  timeline: [
    { date: '15 ก.พ. 2569', type: 'report', title: 'ส่งรายงานผลการเรียน ภาค 1/2569', detail: 'GPA 3.85 ผ่านการตรวจสอบ', icon: 'education' },
    { date: '10 ม.ค. 2569', type: 'payment', title: 'เบิกจ่ายค่าเล่าเรียน Term 5', detail: '฿485,000', icon: 'payment' },
    { date: '20 ธ.ค. 2568', type: 'travel', title: 'รายงานเดินทางกลับไทยชั่วคราว', detail: 'เดินทางกลับ 15 ธ.ค. - 5 ม.ค.', icon: 'travel' },
    { date: '1 ก.ย. 2568', type: 'report', title: 'ส่งรายงานผลการเรียน ภาค 2/2568', detail: 'GPA 3.80 ผ่านการตรวจสอบ', icon: 'education' },
    { date: '15 ก.ค. 2568', type: 'payment', title: 'เบิกจ่ายค่าครองชีพ Q3/2568', detail: '฿240,000', icon: 'payment' },
    { date: '1 มี.ค. 2568', type: 'report', title: 'ส่งรายงานผลการเรียน ภาค 1/2568', detail: 'GPA 3.78 ผ่านการตรวจสอบ', icon: 'education' },
    { date: '5 ส.ค. 2566', type: 'travel', title: 'เดินทางไปศึกษา ณ สหราชอาณาจักร', detail: 'University of Oxford', icon: 'travel' },
    { date: '1 ก.ค. 2566', type: 'scholarship', title: 'ปฐมนิเทศนักเรียนทุน รุ่น 2566', detail: 'สำนักงาน ก.พ.', icon: 'scholarship' },
    { date: '15 พ.ค. 2566', type: 'scholarship', title: 'ได้รับอนุมัติทุน ก.พ.', detail: 'ทุนศึกษาต่อ Ph.D. Chemical Engineering', icon: 'scholarship' },
  ],
};

const timelineIconMap = {
  scholarship: { icon: Award, color: 'bg-blue-500' },
  education: { icon: GraduationCap, color: 'bg-green-500' },
  travel: { icon: Plane, color: 'bg-cyan-500' },
  service: { icon: Briefcase, color: 'bg-purple-500' },
  payment: { icon: DollarSign, color: 'bg-amber-500' },
  document: { icon: FileText, color: 'bg-gray-500' },
};

export default function IndividualHistory() {
  const [searchValue, setSearchValue] = useState('');
  const [searched, setSearched] = useState(false);
  const [scholar, setScholar] = useState<ScholarDetail | null>(null);

  const handleSearch = () => {
    if (!searchValue.trim()) { toast.error('กรุณากรอกข้อมูลสำหรับค้นหา'); return; }
    setSearched(true);
    setScholar(mockScholar);
    toast.success(`พบข้อมูลนักเรียนทุน: ${mockScholar.prefix}${mockScholar.firstName} ${mockScholar.lastName}`);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2"><Search className="w-5 h-5 text-blue-600" />ค้นหาประวัตินักเรียนทุนรายบุคคล</CardTitle>
          <CardDescription>สืบค้นจากเลขบัตรประชาชน หรือ ชื่อ-นามสกุล</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="เลขบัตรประชาชน 13 หลัก หรือ ชื่อ-นามสกุล..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="pl-10" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <Button onClick={handleSearch}><Search className="w-4 h-4 mr-1" />ค้นหา</Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-gray-100" onClick={() => { setSearchValue('1-1001-XXXXX-XX-X'); }}>ตัวอย่าง: 1-1001-XXXXX-XX-X</Badge>
            <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-gray-100" onClick={() => { setSearchValue('พรพิมล สุขใจ'); }}>ตัวอย่าง: พรพิมล สุขใจ</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {searched && scholar && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 rounded-t-xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-white/30"><AvatarFallback className="bg-white/20 text-white text-lg">{scholar.firstName.slice(0, 2)}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{scholar.prefix}{scholar.firstName} {scholar.lastName}</h3>
                    <div className="flex items-center gap-3 mt-1 text-blue-100 text-sm">
                      <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{scholar.id}</span>
                      <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" />{scholar.idCard}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-white/20 text-white border-white/30 text-[10px]">{scholar.scholarships[0]?.type}</Badge>
                      <Badge className="bg-green-500/30 text-white border-green-400/30 text-[10px]">{scholar.scholarships[0]?.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toast.success('ส่งออก PDF ประวัตินักเรียนทุน')}><Download className="w-3.5 h-3.5 mr-1" />PDF</Button>
                  <Button size="sm" variant="secondary" onClick={() => toast.success('พิมพ์รายงาน')}><Printer className="w-3.5 h-3.5 mr-1" />พิมพ์</Button>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Scholarship Info */}
              {scholar.scholarships.map((sch, i) => (
                <div key={i}>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-blue-600" />ข้อมูลทุนการศึกษา</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'รหัสทุน', value: sch.code, icon: Hash },
                      { label: 'ประเภททุน', value: sch.type, icon: Award },
                      { label: 'แหล่งทุน', value: sch.source, icon: Building },
                      { label: 'ระดับ', value: sch.degree, icon: GraduationCap },
                      { label: 'สาขาวิชา', value: sch.field, icon: BookOpen },
                      { label: 'สถาบัน', value: sch.university, icon: Building },
                      { label: 'ประเทศ', value: sch.country, icon: Globe },
                      { label: 'GPA ล่าสุด', value: sch.gpa.toFixed(2), icon: TrendingUp },
                    ].map((item, j) => (
                      <div key={j} className="p-3 bg-slate-50 rounded-lg border">
                        <Label className="text-[10px] text-gray-400 uppercase flex items-center gap-1"><item.icon className="w-3 h-3" />{item.label}</Label>
                        <p className="text-sm font-medium mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">ความก้าวหน้าการศึกษา</span>
                      <span className="text-sm font-bold">55%</span>
                    </div>
                    <Progress value={55} className="h-3" />
                    <div className="flex justify-between mt-1 text-xs text-gray-500"><span>{sch.startDate}</span><span>{sch.endDate}</span></div>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Label className="text-xs text-green-700 font-semibold flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />งบประมาณทุนรวม</Label>
                    <p className="text-lg font-bold text-green-700 mt-1">฿{sch.totalBudget.toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Service Debt */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-600" />การชดใช้ทุน</h4>
                {scholar.serviceRecords.map((sr, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div><Label className="text-[10px] text-gray-400">หน่วยงาน</Label><p className="text-sm">{sr.agency}</p></div>
                      <div><Label className="text-[10px] text-gray-400">ตำแหน่ง</Label><p className="text-sm">{sr.position}</p></div>
                      <div><Label className="text-[10px] text-gray-400">วันที่เริ่ม</Label><p className="text-sm">{sr.startDate}</p></div>
                      <div><Label className="text-[10px] text-gray-400">สถานะ</Label><Badge className="bg-yellow-100 text-yellow-700 text-[10px] border border-yellow-200">{sr.status}</Badge></div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>ชดใช้แล้ว {sr.daysServed} วัน</span><span>ต้องชดใช้ {sr.daysRequired} วัน</span></div>
                      <Progress value={sr.daysRequired > 0 ? (sr.daysServed / sr.daysRequired) * 100 : 0} className="h-2" />
                      <p className="text-xs text-orange-600 mt-1">เหลืออีก {sr.daysRequired - sr.daysServed} วัน ({((sr.daysRequired - sr.daysServed) / 365).toFixed(1)} ปี)</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-600" />ประวัติเหตุการณ์ (Timeline)</h4>
                <div className="relative pl-8 space-y-0">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200" />
                  {scholar.timeline.map((event, i) => {
                    const ic = timelineIconMap[event.icon];
                    const EventIcon = ic.icon;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pb-5">
                        <div className={`absolute -left-8 top-0 w-8 h-8 rounded-full ${ic.color} flex items-center justify-center z-10`}><EventIcon className="w-4 h-4 text-white" /></div>
                        <div className="ml-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{event.title}</p>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{event.detail}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!searched && (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-500">กรอกข้อมูลเพื่อค้นหาประวัตินักเรียนทุน</p>
          <p className="text-sm text-gray-400 mt-1">ค้นหาด้วยเลขบัตรประชาชน 13 หลัก หรือ ชื่อ-นามสกุล</p>
        </div>
      )}
    </div>
  );
}
