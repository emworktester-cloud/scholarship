import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, BookOpen, GraduationCap, BarChart3,
  Calendar, Target, Globe, Award, Users, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const fieldTrend = [
  { year: '2563', engineering: 38, science: 35, medicine: 30, economics: 25, it: 18, law: 15 },
  { year: '2564', engineering: 42, science: 37, medicine: 32, economics: 26, it: 22, law: 16 },
  { year: '2565', engineering: 45, science: 40, medicine: 35, economics: 28, it: 28, law: 17 },
  { year: '2566', engineering: 48, science: 42, medicine: 36, economics: 30, it: 35, law: 18 },
  { year: '2567', engineering: 50, science: 44, medicine: 38, economics: 32, it: 42, law: 19 },
  { year: '2568', engineering: 52, science: 45, medicine: 40, economics: 35, it: 48, law: 20 },
  { year: '2569', engineering: 55, science: 47, medicine: 42, economics: 37, it: 55, law: 21 },
];

const successRate = [
  { year: '2560', rate: 82, graduated: 65, total: 79 },
  { year: '2561', rate: 84, graduated: 72, total: 86 },
  { year: '2562', rate: 83, graduated: 78, total: 94 },
  { year: '2563', rate: 86, graduated: 85, total: 99 },
  { year: '2564', rate: 87, graduated: 92, total: 106 },
  { year: '2565', rate: 89, graduated: 98, total: 110 },
  { year: '2566', rate: 90, graduated: 105, total: 117 },
  { year: '2567', rate: 91, graduated: 112, total: 123 },
  { year: '2568', rate: 88, graduated: 95, total: 108 },
];

const countryTrend = [
  { year: '2563', uk: 55, us: 48, japan: 22, australia: 18, germany: 15, others: 25 },
  { year: '2564', uk: 58, us: 50, japan: 24, australia: 20, germany: 17, others: 28 },
  { year: '2565', uk: 60, us: 52, japan: 26, australia: 22, germany: 20, others: 32 },
  { year: '2566', uk: 62, us: 55, japan: 28, australia: 24, germany: 22, others: 35 },
  { year: '2567', uk: 65, us: 58, japan: 30, australia: 26, germany: 24, others: 38 },
  { year: '2568', uk: 68, us: 60, japan: 32, australia: 28, germany: 26, others: 42 },
  { year: '2569', uk: 70, us: 62, japan: 34, australia: 30, germany: 28, others: 45 },
];

const servicePaybackTrend = [
  { year: '2560', completed: 42, inProgress: 55, pending: 12, defaulted: 3 },
  { year: '2561', completed: 50, inProgress: 60, pending: 15, defaulted: 2 },
  { year: '2562', completed: 58, inProgress: 68, pending: 18, defaulted: 4 },
  { year: '2563', completed: 65, inProgress: 75, pending: 20, defaulted: 3 },
  { year: '2564', completed: 72, inProgress: 82, pending: 22, defaulted: 2 },
  { year: '2565', completed: 80, inProgress: 90, pending: 25, defaulted: 3 },
  { year: '2566', completed: 88, inProgress: 95, pending: 28, defaulted: 2 },
  { year: '2567', completed: 95, inProgress: 100, pending: 30, defaulted: 3 },
  { year: '2568', completed: 35, inProgress: 108, pending: 32, defaulted: 2 },
];

const topGrowthFields = [
  { field: 'เทคโนโลยีสารสนเทศ', growth: '+205%', trend: 'up', count: 55 },
  { field: 'วิศวกรรมศาสตร์', growth: '+45%', trend: 'up', count: 55 },
  { field: 'วิทยาศาสตร์ข้อมูล', growth: '+180%', trend: 'up', count: 28 },
  { field: 'แพทยศาสตร์', growth: '+40%', trend: 'up', count: 42 },
  { field: 'พลังงานและสิ่งแวดล้อม', growth: '+120%', trend: 'up', count: 18 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.stroke }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendAnalysis() {
  const [period, setPeriod] = useState('7years');

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topGrowthFields.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-green-100 text-green-700 text-[10px] border border-green-200"><ArrowUpRight className="w-3 h-3 mr-0.5" />{f.growth}</Badge>
                  <span className="text-lg font-bold text-green-700">{f.count}</span>
                </div>
                <p className="text-xs font-medium text-gray-700">{f.field}</p>
                <p className="text-[10px] text-gray-400">สาขาเติบโตสูง (2563-2569)</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Field Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" />แนวโน้มสาขาวิชา (จำนวนนักเรียนทุนใหม่/ปี)</CardTitle>
              <CardDescription>วิเคราะห์สาขาที่ได้รับความนิยมเพิ่มขึ้นและลดลง</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="5years">5 ปีล่าสุด</SelectItem><SelectItem value="7years">7 ปีล่าสุด</SelectItem><SelectItem value="10years">10 ปี</SelectItem></SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={fieldTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="engineering" name="วิศวกรรม" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="science" name="วิทยาศาสตร์" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="medicine" name="แพทยศาสตร์" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="economics" name="เศรษฐศาสตร์" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="it" name="ไอที" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="law" name="นิติศาสตร์" stroke="#6b7280" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Target className="w-5 h-5 text-green-600" />อัตราความสำเร็จในการศึกษา (Graduation Rate)</CardTitle>
          <CardDescription>เปรียบเทียบจำนวนผู้สำเร็จการศึกษาตามกำหนดเวลากับจำนวนนักเรียนทุนทั้งหมด</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={successRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[70, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="total" name="นักเรียนทุนทั้งหมด" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              <Area yAxisId="left" type="monotone" dataKey="graduated" name="สำเร็จการศึกษา" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Line yAxisId="right" type="monotone" dataKey="rate" name="อัตราสำเร็จ (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-green-600" /><span className="text-sm text-green-700">อัตราสำเร็จล่าสุด <strong>88%</strong> (2568)</span></div>
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm text-green-700">เพิ่มขึ้นจาก 82% ใน 2560 (+6%)</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Country Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-600" />แนวโน้มประเทศปลายทาง</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="uk" name="สหราชอาณาจักร" stackId="a" fill="#3b82f6" />
              <Bar dataKey="us" name="สหรัฐอเมริกา" stackId="a" fill="#ef4444" />
              <Bar dataKey="japan" name="ญี่ปุ่น" stackId="a" fill="#f59e0b" />
              <Bar dataKey="australia" name="ออสเตรเลีย" stackId="a" fill="#10b981" />
              <Bar dataKey="germany" name="เยอรมนี" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="others" name="อื่นๆ" stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Payback Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-600" />แนวโน้มการชดใช้ทุน</CardTitle>
          <CardDescription>จำนวนนักเรียนทุนที่ชดใช้ครบ / กำลังชดใช้ / รอชดใช้ / ผิดสัญญา</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servicePaybackTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="completed" name="ชดใช้ครบ" stackId="a" fill="#10b981" />
              <Bar dataKey="inProgress" name="กำลังชดใช้" stackId="a" fill="#3b82f6" />
              <Bar dataKey="pending" name="รอชดใช้" stackId="a" fill="#f59e0b" />
              <Bar dataKey="defaulted" name="ผิดสัญญา" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
