import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calculator, Calendar, Clock, CheckCircle, AlertTriangle,
  GraduationCap, Briefcase, ArrowRight, Info, RotateCcw,
  User, Award, Hash, CalendarDays, CalendarCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

interface CalculationResult {
  scholarName: string;
  scholarId: string;
  scholarshipType: string;
  degree: string;
  startDate: string;
  endDate: string;
  totalScholarshipDays: number;
  multiplier: number;
  totalServiceDays: number;
  serviceStartDate: string;
  serviceEndDate: string;
  daysServed: number;
  daysRemaining: number;
  percentComplete: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
}

const mockResults: CalculationResult[] = [
  { scholarName: 'น.ส.พรพิมล สุขใจ', scholarId: 'SCH-001', scholarshipType: 'ทุน ก.พ. (ศึกษาต่อ)', degree: 'Ph.D.', startDate: '1 ส.ค. 2566', endDate: '31 ก.ค. 2570', totalScholarshipDays: 1461, multiplier: 2, totalServiceDays: 2922, serviceStartDate: '-', serviceEndDate: '-', daysServed: 0, daysRemaining: 2922, percentComplete: 0, status: 'not-started' },
  { scholarName: 'นายธนกฤต ประสบผล', scholarId: 'SCH-008', scholarshipType: 'ทุน ก.พ. (ศึกษาต่อ)', degree: 'Ph.D.', startDate: '1 ต.ค. 2562', endDate: '30 ก.ย. 2567', totalScholarshipDays: 1827, multiplier: 2, totalServiceDays: 3654, serviceStartDate: '1 พ.ย. 2567', serviceEndDate: '31 ต.ค. 2577', daysServed: 482, daysRemaining: 3172, percentComplete: 13.2, status: 'in-progress' },
  { scholarName: 'นายกิตติพงษ์ เรียนดี', scholarId: 'SCH-015', scholarshipType: 'ทุน ก.พ. (ฝึกอบรม)', degree: 'ฝึกอบรม 6 เดือน', startDate: '1 มี.ค. 2566', endDate: '31 ส.ค. 2566', totalScholarshipDays: 184, multiplier: 2, totalServiceDays: 368, serviceStartDate: '1 ต.ค. 2566', serviceEndDate: '4 ต.ค. 2567', daysServed: 368, daysRemaining: 0, percentComplete: 100, status: 'completed' },
];

const conditionRules = [
  { type: 'ทุน ก.พ. (ศึกษาต่อ)', multiplier: 2, note: 'ชดใช้ทุน = จำนวนวันรับทุน × 2 เท่า' },
  { type: 'ทุน ก.พ. (ฝึกอบรม)', multiplier: 2, note: 'ชดใช้ทุน = จำนวนวันรับทุน × 2 เท่า' },
  { type: 'ทุนกระทรวง', multiplier: 2, note: 'ชดใช้ทุน = จำนวนวันรับทุน × 2 เท่า' },
  { type: 'ทุนรัฐบาลจีน', multiplier: 2, note: 'ชดใช้ทุน = จำนวนวันรับทุน × 2 เท่า (หรือตามสัญญา)' },
  { type: 'ทุน MEXT', multiplier: 2, note: 'ชดใช้ทุน = จำนวนวันรับทุน × 2 เท่า (หรือตามสัญญา)' },
];

const statusConfig = {
  'not-started': { label: 'ยังไม่เริ่ม', color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock },
  'in-progress': { label: 'กำลังชดใช้', color: 'text-blue-700', bg: 'bg-blue-100', icon: Briefcase },
  'completed': { label: 'ชดใช้ครบ', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  'overdue': { label: 'เลยกำหนด', color: 'text-red-700', bg: 'bg-red-100', icon: AlertTriangle },
};

export default function ScholarshipCalculator() {
  const [searchQuery, setSearchQuery] = useState('');
  const [calcMode, setCalcMode] = useState<'lookup' | 'manual'>('lookup');
  const [results, setResults] = useState<CalculationResult[]>([]);

  // Manual calc state
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [manualType, setManualType] = useState('');
  const [manualResult, setManualResult] = useState<{ days: number; serviceDays: number; serviceEndDate: string } | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) { toast.error('กรุณากรอกข้อมูลค้นหา'); return; }
    setResults(mockResults);
    toast.success(`พบข้อมูล ${mockResults.length} รายการ`);
  };

  const handleManualCalc = () => {
    if (!manualStartDate || !manualEndDate) { toast.error('กรุณากรอกวันที่'); return; }
    const start = new Date(manualStartDate);
    const end = new Date(manualEndDate);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) { toast.error('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น'); return; }
    const multiplier = 2;
    const serviceDays = days * multiplier;
    const serviceEnd = new Date(end);
    serviceEnd.setDate(serviceEnd.getDate() + serviceDays);
    setManualResult({ days, serviceDays, serviceEndDate: serviceEnd.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) });
    toast.success('คำนวณเรียบร้อย');
  };

  return (
    <div className="space-y-6">
      {/* Calc Mode */}
      <div className="flex gap-3">
        <Button variant={calcMode === 'lookup' ? 'default' : 'outline'} onClick={() => setCalcMode('lookup')}><User className="w-4 h-4 mr-1.5" />ค้นหารายบุคคล</Button>
        <Button variant={calcMode === 'manual' ? 'default' : 'outline'} onClick={() => setCalcMode('manual')}><Calculator className="w-4 h-4 mr-1.5" />คำนวณเอง</Button>
      </div>

      {calcMode === 'lookup' ? (
        <>
          {/* Search */}
          <Card className="border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="text-base flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-600" />คำนวณวันรับทุนและวันชดใช้ทุน</CardTitle>
              <CardDescription>ค้นหาจากรหัสนักเรียนทุน, ชื่อ-นามสกุล หรือเลขบัตรประชาชน</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Input placeholder="SCH-001 หรือ ชื่อ-นามสกุล หรือ เลขบัตรประชาชน..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <Button onClick={handleSearch}>ค้นหาและคำนวณ</Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((r, i) => {
                const sc = statusConfig[r.status];
                const StatusIcon = sc.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md"><GraduationCap className="w-6 h-6 text-white" /></div>
                            <div>
                              <h4 className="font-semibold">{r.scholarName}</h4>
                              <div className="flex gap-2 mt-0.5"><Badge variant="outline" className="text-[10px] font-mono">{r.scholarId}</Badge><Badge variant="outline" className="text-[10px]">{r.scholarshipType}</Badge><Badge variant="outline" className="text-[10px]">{r.degree}</Badge></div>
                            </div>
                          </div>
                          <Badge className={`${sc.bg} ${sc.color} border`}><StatusIcon className="w-3.5 h-3.5 mr-1" />{sc.label}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Label className="text-[10px] text-blue-500 uppercase flex items-center gap-1"><CalendarDays className="w-3 h-3" />ช่วงรับทุน</Label>
                            <p className="text-xs font-medium mt-1">{r.startDate} — {r.endDate}</p>
                            <p className="text-lg font-bold text-blue-700 mt-0.5">{r.totalScholarshipDays.toLocaleString()} <span className="text-xs font-normal">วัน</span></p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <Label className="text-[10px] text-purple-500 uppercase flex items-center gap-1"><Calculator className="w-3 h-3" />ตัวคูณ</Label>
                            <p className="text-lg font-bold text-purple-700 mt-1">× {r.multiplier}</p>
                            <p className="text-[10px] text-purple-500">ตามเงื่อนไขทุน</p>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <Label className="text-[10px] text-amber-500 uppercase flex items-center gap-1"><Briefcase className="w-3 h-3" />วันชดใช้ทุนทั้งหมด</Label>
                            <p className="text-lg font-bold text-amber-700 mt-1">{r.totalServiceDays.toLocaleString()} <span className="text-xs font-normal">วัน</span></p>
                            <p className="text-[10px] text-amber-500">≈ {(r.totalServiceDays / 365).toFixed(1)} ปี</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <Label className="text-[10px] text-green-500 uppercase flex items-center gap-1"><CalendarCheck className="w-3 h-3" />สิ้นสุดชดใช้</Label>
                            <p className="text-xs font-medium mt-1">{r.serviceStartDate !== '-' ? r.serviceStartDate : 'รอเริ่ม'}</p>
                            <p className="text-xs font-medium">{r.serviceEndDate !== '-' ? `ถึง ${r.serviceEndDate}` : ''}</p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600">ความคืบหน้าการชดใช้ทุน</span>
                            <span className="text-xs font-bold">{r.percentComplete.toFixed(1)}%</span>
                          </div>
                          <Progress value={r.percentComplete} className="h-3" />
                          <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
                            <span>ชดใช้แล้ว: {r.daysServed.toLocaleString()} วัน</span>
                            <span>คงเหลือ: {r.daysRemaining.toLocaleString()} วัน ({(r.daysRemaining / 365).toFixed(1)} ปี)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Manual Calculator */
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl">
            <CardTitle className="text-base flex items-center gap-2"><Calculator className="w-5 h-5 text-purple-600" />เครื่องคำนวณวันชดใช้ทุน</CardTitle>
            <CardDescription>กรอกวันที่เริ่ม-สิ้นสุดรับทุนเพื่อคำนวณจำนวนวันชดใช้ทุน</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>วันที่เริ่มรับทุน</Label><Input type="date" value={manualStartDate} onChange={e => setManualStartDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>วันที่สิ้นสุดรับทุน</Label><Input type="date" value={manualEndDate} onChange={e => setManualEndDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>ประเภททุน</Label>
                <Select value={manualType} onValueChange={setManualType}><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent>{conditionRules.map(c => <SelectItem key={c.type} value={c.type}>{c.type} (×{c.multiplier})</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="flex gap-2"><Button onClick={handleManualCalc}><Calculator className="w-4 h-4 mr-1" />คำนวณ</Button><Button variant="outline" onClick={() => { setManualStartDate(''); setManualEndDate(''); setManualResult(null); }}><RotateCcw className="w-4 h-4 mr-1" />ล้าง</Button></div>

            {manualResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" />ผลการคำนวณ</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border"><p className="text-[10px] text-gray-500">จำนวนวันรับทุน</p><p className="text-2xl font-bold text-blue-700">{manualResult.days.toLocaleString()}</p><p className="text-[10px] text-gray-400">วัน ({(manualResult.days / 365).toFixed(1)} ปี)</p></div>
                  <div className="text-center p-3 bg-white rounded-lg border"><p className="text-[10px] text-gray-500">จำนวนวันชดใช้ทุน (×2)</p><p className="text-2xl font-bold text-purple-700">{manualResult.serviceDays.toLocaleString()}</p><p className="text-[10px] text-gray-400">วัน ({(manualResult.serviceDays / 365).toFixed(1)} ปี)</p></div>
                  <div className="text-center p-3 bg-white rounded-lg border"><p className="text-[10px] text-gray-500">วันสิ้��สุดชดใช้ทุน</p><p className="text-sm font-bold text-green-700 mt-2">{manualResult.serviceEndDate}</p></div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Condition Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Info className="w-5 h-5 text-gray-500" />เงื่อนไขการคำนวณวันชดใช้ทุน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conditionRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg"><Award className="w-4 h-4 text-blue-500" /><span className="text-sm font-medium w-48">{rule.type}</span><Badge className="bg-purple-100 text-purple-700 border border-purple-200">×{rule.multiplier}</Badge><span className="text-xs text-gray-500">{rule.note}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
