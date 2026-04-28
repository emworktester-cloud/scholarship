import { motion } from 'motion/react';
import {
  Users, GraduationCap, Globe, BookOpen, Award, DollarSign,
  TrendingUp, Calendar, Briefcase, Building, Flag, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Treemap,
} from 'recharts';
import { useState } from 'react';

// ===== Mock Data =====
const scholarBySource = [
  { name: 'ทุน ก.พ. (ศึกษาต่อ)', value: 520, color: '#3b82f6' },
  { name: 'ทุนกระทรวง', value: 310, color: '#06b6d4' },
  { name: 'ทุนรัฐบาลจีน', value: 85, color: '#10b981' },
  { name: 'ทุนรัฐบาลญี่ปุ่น (MEXT)', value: 72, color: '#8b5cf6' },
  { name: 'ทุน ก.พ. (ฝึกอบรม)', value: 145, color: '#f59e0b' },
  { name: 'ทุนอื่นๆ', value: 68, color: '#ef4444' },
];

const scholarByCountry = [
  { name: 'สหราชอาณาจักร', value: 285, flag: '🇬🇧' },
  { name: 'สหรัฐอเมริกา', value: 245, flag: '🇺🇸' },
  { name: 'ญี่ปุ่น', value: 130, flag: '🇯🇵' },
  { name: 'ออสเตรเลีย', value: 110, flag: '🇦🇺' },
  { name: 'เยอรมนี', value: 95, flag: '🇩🇪' },
  { name: 'ฝรั่งเศส', value: 65, flag: '🇫🇷' },
  { name: 'จีน', value: 85, flag: '🇨🇳' },
  { name: 'เนเธอร์แลนด์', value: 42, flag: '🇳🇱' },
  { name: 'สวีเดน', value: 28, flag: '🇸🇪' },
  { name: 'อื่นๆ', value: 115, flag: '🌍' },
];

const scholarByEducation = [
  { name: 'ปริญญาเอก', value: 420, color: '#3b82f6' },
  { name: 'ปริญญาโท', value: 580, color: '#06b6d4' },
  { name: 'ฝึกอบรม/ดูงาน', value: 145, color: '#10b981' },
  { name: 'วิจัยระยะสั้น', value: 55, color: '#f59e0b' },
];

const scholarByField = [
  { name: 'วิศวกรรมศาสตร์', total: 195, phd: 85, master: 110 },
  { name: 'วิทยาศาสตร์', total: 178, phd: 92, master: 86 },
  { name: 'แพทยศาสตร์', total: 155, phd: 78, master: 77 },
  { name: 'เศรษฐศาสตร์', total: 132, phd: 45, master: 87 },
  { name: 'นิติศาสตร์', total: 98, phd: 32, master: 66 },
  { name: 'รัฐศาสตร์', total: 85, phd: 28, master: 57 },
  { name: 'สังคมศาสตร์', total: 75, phd: 20, master: 55 },
  { name: 'ศึกษาศาสตร์', total: 62, phd: 18, master: 44 },
  { name: 'เทคโนโลยีสารสนเทศ', total: 120, phd: 55, master: 65 },
  { name: 'อื่นๆ', total: 100, phd: 30, master: 70 },
];

const scholarStatus = [
  { name: 'กำลังศึกษา', value: 680, color: '#3b82f6' },
  { name: 'สำเร็จการศึกษา', value: 320, color: '#10b981' },
  { name: 'ชดใช้ทุน', value: 145, color: '#8b5cf6' },
  { name: 'ชดใช้ครบแล้ว', value: 35, color: '#06b6d4' },
  { name: 'ระงับทุน', value: 12, color: '#ef4444' },
  { name: 'ลาออก/พ้นทุน', value: 8, color: '#6b7280' },
];

const yearFilter = ['ทุกปี', '2569', '2568', '2567', '2566', '2565'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
        <p className="font-semibold mb-1">{label || payload[0]?.name}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {p.value?.toLocaleString()} คน</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OverviewDashboard() {
  const [fiscalYear, setFiscalYear] = useState('ทุกปี');
  const totalScholars = 1200;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">ปีงบประมาณ:</span>
            </div>
            <Select value={fiscalYear} onValueChange={setFiscalYear}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>{yearFilter.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200">นักเรียนทุนทั้งหมด: {totalScholars.toLocaleString()} คน</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'นักเรียนทุนทั้งหมด', value: '1,200', icon: Users, bg: 'from-blue-500 to-blue-600', bgLight: 'from-blue-50 to-blue-100' },
          { label: 'กำลังศึกษา', value: '680', icon: GraduationCap, bg: 'from-cyan-500 to-cyan-600', bgLight: 'from-cyan-50 to-cyan-100' },
          { label: 'สำเร็จการศึกษา', value: '320', icon: Award, bg: 'from-green-500 to-emerald-500', bgLight: 'from-green-50 to-emerald-50' },
          { label: 'ชดใช้ทุนอยู่', value: '145', icon: Briefcase, bg: 'from-purple-500 to-violet-500', bgLight: 'from-purple-50 to-violet-50' },
          { label: 'ประเทศปลายทาง', value: '32', icon: Globe, bg: 'from-amber-500 to-orange-500', bgLight: 'from-amber-50 to-orange-50' },
          { label: 'แหล่งทุน', value: '6', icon: Building, bg: 'from-indigo-500 to-indigo-600', bgLight: 'from-indigo-50 to-indigo-100' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className={`border-0 bg-gradient-to-br ${kpi.bgLight} hover:shadow-lg transition-all`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center shadow-md`}>
                    <kpi.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{kpi.value}</p>
                    <p className="text-[10px] text-gray-500">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Source + Education Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Building className="w-5 h-5 text-blue-600" />สถิติแยกตามแหล่งทุน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={scholarBySource} cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {scholarBySource.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {scholarBySource.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                  <span className="font-semibold ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Education Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><GraduationCap className="w-5 h-5 text-cyan-600" />สถิติแยกตามระดับการศึกษา</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={scholarByEducation} cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {scholarByEducation.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {scholarByEducation.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                  <span className="font-semibold ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Country + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Country */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" />สถิติแยกตามประเทศ (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={scholarByCountry} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="จำนวน" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-600" />สถิติแยกตามสถานะ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {scholarStatus.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm w-32">{s.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(s.value / totalScholars) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full flex items-center justify-end pr-2" style={{ backgroundColor: s.color }}>
                      {(s.value / totalScholars) * 100 > 8 && <span className="text-[10px] text-white font-semibold">{s.value}</span>}
                    </motion.div>
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{s.value}</span>
                  <span className="text-[10px] text-gray-400 w-10 text-right">{((s.value / totalScholars) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: By Field of Study */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600" />สถิติแยกตามสาขาวิชา</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={scholarByField} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="phd" name="ปริญญาเอก" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="master" name="ปริญญาโท" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
