import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity, Clock, Zap, AlertTriangle, CheckCircle, TrendingUp,
  TrendingDown, BarChart3, Server, Globe, RefreshCw, Timer,
  ArrowUpRight, ArrowDownRight, XCircle, Gauge, Wifi, WifiOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

// Response Time Data (last 24h)
const responseTimeData = [
  { time: '00:00', avg: 95, p50: 75, p95: 180, p99: 350 },
  { time: '02:00', avg: 85, p50: 65, p95: 160, p99: 320 },
  { time: '04:00', avg: 80, p50: 60, p95: 150, p99: 280 },
  { time: '06:00', avg: 90, p50: 70, p95: 170, p99: 340 },
  { time: '08:00', avg: 145, p50: 110, p95: 280, p99: 520 },
  { time: '09:00', avg: 165, p50: 125, p95: 320, p99: 600 },
  { time: '10:00', avg: 180, p50: 140, p95: 350, p99: 680 },
  { time: '11:00', avg: 175, p50: 135, p95: 340, p99: 650 },
  { time: '12:00', avg: 150, p50: 115, p95: 290, p99: 540 },
  { time: '13:00', avg: 160, p50: 120, p95: 310, p99: 580 },
  { time: '14:00', avg: 170, p50: 130, p95: 330, p99: 620 },
  { time: '15:00', avg: 155, p50: 118, p95: 300, p99: 560 },
  { time: '16:00', avg: 140, p50: 105, p95: 270, p99: 500 },
  { time: '17:00', avg: 120, p50: 90, p95: 230, p99: 420 },
  { time: '18:00', avg: 110, p50: 85, p95: 210, p99: 380 },
  { time: '20:00', avg: 100, p50: 78, p95: 190, p99: 360 },
  { time: '22:00', avg: 92, p50: 72, p95: 175, p99: 340 },
];

// Request Volume Data
const requestVolumeData = [
  { time: '00:00', requests: 120, errors: 1 },
  { time: '02:00', requests: 80, errors: 0 },
  { time: '04:00', requests: 45, errors: 0 },
  { time: '06:00', requests: 180, errors: 2 },
  { time: '08:00', requests: 520, errors: 5 },
  { time: '09:00', requests: 780, errors: 8 },
  { time: '10:00', requests: 920, errors: 12 },
  { time: '11:00', requests: 880, errors: 9 },
  { time: '12:00', requests: 650, errors: 6 },
  { time: '13:00', requests: 750, errors: 7 },
  { time: '14:00', requests: 850, errors: 10 },
  { time: '15:00', requests: 720, errors: 6 },
  { time: '16:00', requests: 580, errors: 4 },
  { time: '17:00', requests: 420, errors: 3 },
  { time: '18:00', requests: 280, errors: 2 },
  { time: '20:00', requests: 180, errors: 1 },
  { time: '22:00', requests: 150, errors: 1 },
];

// Error Rate by Endpoint
const errorByEndpoint = [
  { endpoint: '/auth/login', total: 2500, errors: 85, rate: 3.4 },
  { endpoint: '/scholars', total: 4200, errors: 12, rate: 0.29 },
  { endpoint: '/applications', total: 3100, errors: 8, rate: 0.26 },
  { endpoint: '/payments', total: 1800, errors: 3, rate: 0.17 },
  { endpoint: '/reports/generate', total: 420, errors: 15, rate: 3.57 },
  { endpoint: '/notifications', total: 5600, errors: 5, rate: 0.09 },
];

// External System Health
const systemHealth = [
  { name: 'ระบบ SEIS (สำนักงาน ก.พ.)', status: 'healthy', uptime: 99.95, avgLatency: 120, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ระบบ DPIS (สำนักงาน ก.พ.)', status: 'healthy', uptime: 99.90, avgLatency: 95, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ระบบ GFMIS (กรมบัญชีกลาง)', status: 'healthy', uptime: 99.85, avgLatency: 85, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'Microsoft 365 (Identity)', status: 'healthy', uptime: 99.99, avgLatency: 45, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ThaiID (กรมการปกครอง)', status: 'degraded', uptime: 98.50, avgLatency: 350, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ระบบ SMS Gateway', status: 'healthy', uptime: 99.70, avgLatency: 200, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ระบบ Email (SMTP)', status: 'healthy', uptime: 99.80, avgLatency: 50, lastCheck: '5 วินาทีที่แล้ว' },
  { name: 'ระบบตรวจสอบบัตรประชาชน', status: 'down', uptime: 95.00, avgLatency: 0, lastCheck: '2 นาทีที่แล้ว' },
];

const statusConfig = {
  healthy: { label: 'ปกติ', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle, dot: 'bg-green-500' },
  degraded: { label: 'ช้า', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertTriangle, dot: 'bg-yellow-400' },
  down: { label: 'ล่ม', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle, dot: 'bg-red-500' },
};

export default function APIMonitoring() {
  const [period, setPeriod] = useState('24h');
  const healthyCount = systemHealth.filter(s => s.status === 'healthy').length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Requests วันนี้', value: '12.4K', sub: '+8.5% จากเมื่อวาน', icon: Zap, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100', trend: 'up' },
          { label: 'Avg Response Time', value: '142ms', sub: 'เฉลี่ย 24 ชม.', icon: Timer, bg: 'from-cyan-500 to-cyan-600', bgL: 'from-cyan-50 to-cyan-100', trend: 'down' },
          { label: 'Error Rate', value: '0.42%', sub: 'ภายใน SLA', icon: AlertTriangle, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50', trend: 'down' },
          { label: 'Uptime', value: '99.92%', sub: '30 วันล่าสุด', icon: Activity, bg: 'from-purple-500 to-violet-500', bgL: 'from-purple-50 to-violet-50', trend: 'up' },
          { label: 'ระบบภายนอก', value: `${healthyCount}/${systemHealth.length}`, sub: 'ปกติ', icon: Globe, bg: 'from-amber-500 to-orange-500', bgL: 'from-amber-50 to-orange-50', trend: 'neutral' },
          { label: 'P95 Latency', value: '310ms', sub: 'SLA < 500ms', icon: Gauge, bg: 'from-indigo-500 to-indigo-600', bgL: 'from-indigo-50 to-indigo-100', trend: 'down' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className={`border-0 bg-gradient-to-br ${kpi.bgL} hover:shadow-lg transition-all`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center shadow-md`}><kpi.icon className="w-5 h-5 text-white" /></div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold">{kpi.value}</p>
                      {kpi.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                      {kpi.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-green-500" />}
                    </div>
                    <p className="text-[10px] text-gray-500">{kpi.label}</p>
                    <p className="text-[9px] text-gray-400">{kpi.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">Performance Monitoring</h3>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1h">1 ชั่วโมง</SelectItem><SelectItem value="6h">6 ชั่วโมง</SelectItem><SelectItem value="24h">24 ชั่วโมง</SelectItem><SelectItem value="7d">7 วัน</SelectItem><SelectItem value="30d">30 วัน</SelectItem></SelectContent></Select>
          <Button size="sm" variant="outline" onClick={() => toast.success('รีเฟรชข้อมูล')}><RefreshCw className="w-3.5 h-3.5 mr-1" />รีเฟรช</Button>
        </div>
      </div>

      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Timer className="w-5 h-5 text-blue-600" />อัตราการตอบสนอง (Response Time)</CardTitle>
          <CardDescription>Avg, P50, P95, P99 latency (milliseconds) ช่วง 24 ชม.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="ms" />
              <Tooltip formatter={(value: number) => `${value}ms`} />
              <Legend />
              <Area type="monotone" dataKey="p99" name="P99" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} />
              <Area type="monotone" dataKey="p95" name="P95" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              <Area type="monotone" dataKey="avg" name="Average" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              <Line type="monotone" dataKey="p50" name="P50 (Median)" stroke="#10b981" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Request Volume + Error Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600" />จำนวนการเรียกใช้งาน (Requests/hour)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={requestVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" name="Requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="errors" name="Errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-600" />Error Rate แยกตาม Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errorByEndpoint.map((ep, i) => (
                <div key={i} className="flex items-center gap-3">
                  <code className="text-xs font-mono w-40 truncate text-gray-600">{ep.endpoint}</code>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-0.5"><span>{ep.errors} errors / {ep.total.toLocaleString()} req</span><span className={ep.rate > 1 ? 'text-red-600 font-semibold' : 'text-green-600'}>{ep.rate}%</span></div>
                    <Progress value={Math.min(ep.rate * 10, 100)} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External System Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" />สถานะระบบภายนอก (Health Check)</CardTitle>
              <CardDescription>ตรวจสอบสถานะเชื่อมต่อระบบภายนอกแบบ Real-time</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success('Health check ทุกระบบ')}><RefreshCw className="w-3.5 h-3.5 mr-1" />Check All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systemHealth.map((sys, i) => {
              const sc = statusConfig[sys.status as keyof typeof statusConfig];
              const StatusIcon = sc.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <div className={`p-4 border rounded-xl hover:shadow-md transition-all ${sys.status === 'down' ? 'border-red-200 bg-red-50/30' : sys.status === 'degraded' ? 'border-yellow-200 bg-yellow-50/30' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${sc.dot} animate-pulse`} />
                        <h4 className="text-sm font-medium">{sys.name}</h4>
                      </div>
                      <Badge className={`text-[10px] ${sc.bg} ${sc.color} border`}><StatusIcon className="w-3 h-3 mr-0.5" />{sc.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Uptime: <strong className={sys.uptime >= 99 ? 'text-green-600' : sys.uptime >= 98 ? 'text-yellow-600' : 'text-red-600'}>{sys.uptime}%</strong></span>
                      <span>Latency: <strong>{sys.status === 'down' ? '-' : `${sys.avgLatency}ms`}</strong></span>
                      <span className="text-gray-400">{sys.lastCheck}</span>
                    </div>
                    <div className="mt-2"><Progress value={sys.uptime} className="h-1.5" /></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
