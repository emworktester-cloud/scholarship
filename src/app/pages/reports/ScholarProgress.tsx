import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, GraduationCap, Clock, TrendingUp, Search, Calendar,
  CheckCircle, AlertTriangle, XCircle, BarChart3, Briefcase,
  ChevronDown, ChevronRight, Eye, Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface ScholarProgressItem {
  id: string;
  name: string;
  scholarshipType: string;
  country: string;
  university: string;
  field: string;
  degree: string;
  startDate: string;
  expectedEndDate: string;
  progressPercent: number;
  gpa: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  serviceDebt: { total: number; served: number; remaining: number };
  trafficLight: 'green' | 'yellow' | 'red';
}

const mockScholars: ScholarProgressItem[] = [
  { id: 'SCH-001', name: 'น.ส.พรพิมล สุขใจ', scholarshipType: 'ทุน ก.พ.', country: 'สหราชอาณาจักร', university: 'University of Oxford', field: 'วิศวกรรมเคมี', degree: 'Ph.D.', startDate: 'ส.ค. 2566', expectedEndDate: 'ก.ค. 2570', progressPercent: 55, gpa: 3.82, status: 'on-track', serviceDebt: { total: 730, served: 0, remaining: 730 }, trafficLight: 'green' },
  { id: 'SCH-002', name: 'นายวิชัย สมบูรณ์', scholarshipType: 'ทุน ก.พ.', country: 'สหรัฐอเมริกา', university: 'MIT', field: 'วิทยาการคอมพิวเตอร์', degree: 'Ph.D.', startDate: 'ก.ย. 2565', expectedEndDate: 'ส.ค. 2569', progressPercent: 78, gpa: 3.95, status: 'on-track', serviceDebt: { total: 730, served: 0, remaining: 730 }, trafficLight: 'green' },
  { id: 'SCH-003', name: 'น.ส.นภา รักเรียน', scholarshipType: 'ทุนกระทรวง', country: 'ญี่ปุ่น', university: 'University of Tokyo', field: 'ฟิสิกส์', degree: 'M.Sc.', startDate: 'เม.ย. 2568', expectedEndDate: 'มี.ค. 2570', progressPercent: 35, gpa: 3.45, status: 'on-track', serviceDebt: { total: 365, served: 0, remaining: 365 }, trafficLight: 'green' },
  { id: 'SCH-004', name: 'นายสมศักดิ์ มุ่งมั่น', scholarshipType: 'ทุน ก.พ.', country: 'เยอรมนี', university: 'TU Munich', field: 'วิศวกรรมเครื่องกล', degree: 'Ph.D.', startDate: 'ต.ค. 2564', expectedEndDate: 'ก.ย. 2568', progressPercent: 88, gpa: 3.60, status: 'at-risk', serviceDebt: { total: 730, served: 0, remaining: 730 }, trafficLight: 'yellow' },
  { id: 'SCH-005', name: 'น.ส.วิไล สมหวัง', scholarshipType: 'ทุน ก.พ.', country: 'ออสเตรเลีย', university: 'University of Melbourne', field: 'แพทยศาสตร์', degree: 'Ph.D.', startDate: 'ก.พ. 2565', expectedEndDate: 'ม.ค. 2569', progressPercent: 65, gpa: 2.85, status: 'delayed', serviceDebt: { total: 730, served: 0, remaining: 730 }, trafficLight: 'red' },
  { id: 'SCH-006', name: 'นายกิตติ ปัญญาดี', scholarshipType: 'ทุนกระทรวง', country: 'สหราชอาณาจักร', university: 'UCL', field: 'เศรษฐศาสตร์', degree: 'M.Sc.', startDate: 'ก.ย. 2567', expectedEndDate: 'ก.ย. 2569', progressPercent: 60, gpa: 3.70, status: 'on-track', serviceDebt: { total: 365, served: 0, remaining: 365 }, trafficLight: 'green' },
  { id: 'SCH-007', name: 'น.ส.สุภาพร เก่งกาจ', scholarshipType: 'ทุน ก.พ.', country: 'สหรัฐอเมริกา', university: 'Stanford University', field: 'ชีววิทยา', degree: 'Ph.D.', startDate: 'ก.ย. 2563', expectedEndDate: 'ส.ค. 2568', progressPercent: 95, gpa: 3.88, status: 'on-track', serviceDebt: { total: 730, served: 0, remaining: 730 }, trafficLight: 'green' },
  { id: 'SCH-008', name: 'นายธนกฤต ประสบผล', scholarshipType: 'ทุน ก.พ.', country: 'ฝรั่งเศส', university: 'Sorbonne University', field: 'นิติศาสตร์', degree: 'Ph.D.', startDate: 'ต.ค. 2562', expectedEndDate: 'ก.ย. 2567', progressPercent: 100, gpa: 3.72, status: 'completed', serviceDebt: { total: 730, served: 210, remaining: 520 }, trafficLight: 'green' },
];

const progressByDegree = [
  { name: 'ปริญญาเอก', onTrack: 280, atRisk: 45, delayed: 15, completed: 80 },
  { name: 'ปริญญาโท', onTrack: 420, atRisk: 30, delayed: 8, completed: 122 },
  { name: 'ฝึกอบรม', onTrack: 110, atRisk: 10, delayed: 2, completed: 23 },
];

const statusConfig = {
  'on-track': { label: 'ตามแผน', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  'at-risk': { label: 'เสี่ยง', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertTriangle },
  'delayed': { label: 'ล่าช้า', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  'completed': { label: 'สำเร็จ', color: 'text-blue-700', bg: 'bg-blue-100', icon: GraduationCap },
};

const tlConfig = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

export default function ScholarProgress() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockScholars.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.field.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ตามแผน', value: 810, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
          { label: 'เสี่ยง', value: 85, icon: AlertTriangle, color: 'from-yellow-500 to-amber-500', bgL: 'from-yellow-50 to-amber-50' },
          { label: 'ล่าช้า', value: 25, icon: XCircle, color: 'from-red-500 to-rose-500', bgL: 'from-red-50 to-rose-50' },
          { label: 'สำเร็จ', value: 225, icon: GraduationCap, color: 'from-blue-500 to-cyan-500', bgL: 'from-blue-50 to-cyan-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                  <div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-600" />ความก้าวหน้าแยกตามระดับการศึกษา</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progressByDegree}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTrack" name="ตามแผน" stackId="a" fill="#22c55e" />
              <Bar dataKey="atRisk" name="เสี่ยง" stackId="a" fill="#eab308" />
              <Bar dataKey="delayed" name="ล่าช้า" stackId="a" fill="#ef4444" />
              <Bar dataKey="completed" name="สำเร็จ" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="ค้นหาชื่อ, รหัส, สาขา..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="on-track">ตามแผน</SelectItem><SelectItem value="at-risk">เสี่ยง</SelectItem><SelectItem value="delayed">ล่าช้า</SelectItem><SelectItem value="completed">สำเร็จ</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scholar Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>นักเรียนทุน</TableHead>
                <TableHead>ทุน/ประเทศ/สถาบัน</TableHead>
                <TableHead>สาขา/ระดับ</TableHead>
                <TableHead>ความก้าวหน้า</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การชดใช้ทุน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s, i) => {
                const sc = statusConfig[s.status];
                const servicePercent = s.serviceDebt.total > 0 ? Math.round((s.serviceDebt.served / s.serviceDebt.total) * 100) : 0;
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-blue-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${tlConfig[s.trafficLight]}`} />
                        <div><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-gray-400 font-mono">{s.id}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-gray-600">{s.scholarshipType}</p>
                      <p className="text-xs text-gray-500">{s.country} - {s.university}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{s.degree}</Badge>
                      <p className="text-xs text-gray-600 mt-0.5">{s.field}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[10px]"><span>{s.startDate}</span><span>{s.expectedEndDate}</span></div>
                        <Progress value={s.progressPercent} className="h-2" />
                        <p className="text-[10px] text-center font-semibold">{s.progressPercent}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${s.gpa >= 3.5 ? 'text-green-600' : s.gpa >= 3.0 ? 'text-blue-600' : 'text-orange-600'}`}>{s.gpa.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${sc.bg} ${sc.color} border`}><sc.icon className="w-3 h-3 mr-0.5" />{sc.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {s.serviceDebt.served > 0 || s.status === 'completed' ? (
                        <div className="space-y-1 w-28">
                          <Progress value={servicePercent} className="h-2" />
                          <p className="text-[10px] text-gray-500">{s.serviceDebt.served}/{s.serviceDebt.total} วัน ({servicePercent}%)</p>
                          <p className="text-[10px] text-orange-600">เหลือ {s.serviceDebt.remaining} วัน</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">ยังไม่เริ่มชดใช้</span>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
