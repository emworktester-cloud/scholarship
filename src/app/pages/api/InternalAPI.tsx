import { motion } from 'motion/react';
import {
  Server, Smartphone, Globe, Database, ArrowRight, ArrowLeftRight,
  Shield, Zap, Layers, Monitor, Lock, CheckCircle, Code, GitBranch,
  Cloud, Cpu, HardDrive, Network, Workflow, Box,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';

const internalEndpoints = [
  { group: 'Authentication', prefix: '/api/v1/auth', endpoints: [
    { method: 'POST', path: '/login', desc: 'เข้าสู่ระบบด้วย Username/Password', auth: 'Public' },
    { method: 'POST', path: '/login/microsoft', desc: 'เข้าสู่ระบบผ่าน Microsoft 365 (SSO)', auth: 'Public' },
    { method: 'POST', path: '/login/thaiid', desc: 'เข้าสู่ระบบผ่าน ThaiID', auth: 'Public' },
    { method: 'POST', path: '/refresh', desc: 'ต่ออายุ Token', auth: 'Bearer Token' },
    { method: 'POST', path: '/logout', desc: 'ออกจากระบบ', auth: 'Bearer Token' },
  ]},
  { group: 'Scholars', prefix: '/api/v1/scholars', endpoints: [
    { method: 'GET', path: '/', desc: 'รายการนักเรียนทุนทั้งหมด (paginated)', auth: 'Bearer Token' },
    { method: 'GET', path: '/:id', desc: 'รายละเอียดนักเรียนทุนรายบุคคล', auth: 'Bearer Token' },
    { method: 'POST', path: '/', desc: 'สร้างข้อมูลนักเรียนทุนใหม่', auth: 'Bearer Token + Role' },
    { method: 'PUT', path: '/:id', desc: 'อัปเดตข้อมูลนักเรียนทุน', auth: 'Bearer Token + Role' },
    { method: 'GET', path: '/:id/progress', desc: 'ความก้าวหน้าการศึกษา', auth: 'Bearer Token' },
    { method: 'GET', path: '/:id/service-debt', desc: 'ข้อมูลการชดใช้ทุน', auth: 'Bearer Token' },
  ]},
  { group: 'Applications', prefix: '/api/v1/applications', endpoints: [
    { method: 'GET', path: '/', desc: 'รายการคำขอทั้งหมด', auth: 'Bearer Token' },
    { method: 'POST', path: '/', desc: 'ส่งคำขอใหม่', auth: 'Bearer Token' },
    { method: 'PUT', path: '/:id/approve', desc: 'อนุมัติคำขอ', auth: 'Bearer Token + Approver' },
    { method: 'PUT', path: '/:id/reject', desc: 'ปฏิเสธคำขอ', auth: 'Bearer Token + Approver' },
  ]},
  { group: 'Payments', prefix: '/api/v1/payments', endpoints: [
    { method: 'GET', path: '/', desc: 'รายการเบิกจ่ายทั้งหมด', auth: 'Bearer Token' },
    { method: 'POST', path: '/', desc: 'สร้างรายการเบิกจ่าย', auth: 'Bearer Token + Finance' },
    { method: 'GET', path: '/summary', desc: 'สรุปงบประมาณ', auth: 'Bearer Token' },
  ]},
  { group: 'Reports', prefix: '/api/v1/reports', endpoints: [
    { method: 'POST', path: '/generate', desc: 'สร้างรายงาน (async)', auth: 'Bearer Token' },
    { method: 'GET', path: '/templates', desc: 'รายการเทมเพลตรายงาน', auth: 'Bearer Token' },
    { method: 'GET', path: '/:id/download', desc: 'ดาวน์โหลดรายงาน (PDF/Excel)', auth: 'Bearer Token' },
  ]},
  { group: 'Notifications', prefix: '/api/v1/notifications', endpoints: [
    { method: 'GET', path: '/', desc: 'รายการแจ้งเตือนของผู้ใช้', auth: 'Bearer Token' },
    { method: 'PUT', path: '/:id/read', desc: 'ทำเครื่องหมายอ่านแล้ว', auth: 'Bearer Token' },
    { method: 'GET', path: '/announcements', desc: 'ข่าวประชาสัมพันธ์กลาง', auth: 'Bearer Token' },
  ]},
];

const methodColor: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  PATCH: 'bg-purple-100 text-purple-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function InternalAPI() {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600" />สถาปัตยกรรม API-Driven Architecture</CardTitle>
          <CardDescription>ระบบพัฒนาแบบแยก Backend (API) และ Frontend อย่างสมบูรณ์ การรับส่งข้อมูลทุกอย่างผ่าน RESTful API</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          {/* Architecture Diagram */}
          <div className="flex items-center justify-center gap-4 flex-wrap py-6">
            {/* Clients */}
            <div className="space-y-3 text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase">Frontend Clients</p>
              {[
                { label: 'Web Application', sublabel: 'React + TypeScript', icon: Monitor, color: 'from-blue-500 to-blue-600' },
                { label: 'Mobile App', sublabel: 'iOS / Android', icon: Smartphone, color: 'from-green-500 to-emerald-500' },
                { label: 'External Systems', sublabel: 'SEIS / DPIS', icon: Globe, color: 'from-purple-500 to-violet-500' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-3 border rounded-xl bg-white">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                  <div className="text-left"><p className="text-sm font-medium">{c.label}</p><p className="text-[10px] text-gray-400">{c.sublabel}</p></div>
                </motion.div>
              ))}
            </div>

            {/* Arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-1 px-4">
              <ArrowLeftRight className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-100 text-blue-700 text-[9px] border border-blue-200">HTTPS / REST API</Badge>
              <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200">OAuth 2.0 / JWT</Badge>
            </motion.div>

            {/* API Gateway */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
              <div className="p-4 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/50">
                <p className="text-[10px] font-semibold text-blue-500 uppercase mb-2">API Gateway</p>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg mx-auto"><Network className="w-8 h-8 text-white" /></div>
                <p className="text-xs font-medium mt-2">API Gateway</p>
                <div className="flex flex-col gap-1 mt-2">
                  <Badge className="bg-white text-gray-600 text-[8px] border">Rate Limiting</Badge>
                  <Badge className="bg-white text-gray-600 text-[8px] border">Auth Validation</Badge>
                  <Badge className="bg-white text-gray-600 text-[8px] border">Request Logging</Badge>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="px-4">
              <ArrowRight className="w-8 h-8 text-indigo-400" />
            </motion.div>

            {/* Backend */}
            <div className="space-y-3 text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase">Backend Services</p>
              {[
                { label: 'Application Service', icon: Cpu, color: 'from-indigo-500 to-indigo-600' },
                { label: 'Notification Service', icon: Zap, color: 'from-amber-500 to-orange-500' },
                { label: 'Report Service', icon: GitBranch, color: 'from-cyan-500 to-cyan-600' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3 p-3 border rounded-xl bg-white">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                  <p className="text-sm font-medium">{c.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="px-4">
              <ArrowRight className="w-8 h-8 text-green-400" />
            </motion.div>

            {/* Database */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="text-center">
              <div className="p-4 border-2 border-dashed border-green-300 rounded-2xl bg-green-50/50">
                <p className="text-[10px] font-semibold text-green-500 uppercase mb-2">Data Layer</p>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-lg mx-auto"><Database className="w-8 h-8 text-white" /></div>
                <p className="text-xs font-medium mt-2">ฐานข้อมูลหลัก</p>
                <Badge className="bg-white text-gray-600 text-[8px] border mt-1">PostgreSQL</Badge>
              </div>
            </motion.div>
          </div>

          {/* Key Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              { title: 'Stateless API', desc: 'ทุก Request ต้องพกพา Token ไม่มี Session บน Server', icon: Cloud, color: 'text-blue-600' },
              { title: 'JSON Standard', desc: 'ข้อมูลรับส่งในรูปแบบ JSON ทั้งหมด Content-Type: application/json', icon: Code, color: 'text-green-600' },
              { title: 'Security First', desc: 'ทุก Endpoint ต้องผ่าน Auth ยกเว้น /auth/login เท่านั้น', icon: Shield, color: 'text-orange-600' },
            ].map((p, i) => (
              <div key={i} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-2"><p.icon className={`w-5 h-5 ${p.color}`} /><h4 className="text-sm font-semibold">{p.title}</h4></div>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Internal Endpoint Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Code className="w-5 h-5 text-indigo-600" />รายการ Internal API Endpoints</CardTitle>
          <CardDescription>Endpoint ทั้งหมดสำหรับ Web Application และ Mobile Application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {internalEndpoints.map((group, gi) => (
            <motion.div key={gi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}>
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-sm font-semibold">{group.group}</h4>
                    <Badge variant="outline" className="text-[10px] font-mono">{group.prefix}</Badge>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-[10px]">{group.endpoints.length} endpoints</Badge>
                </div>
                <div className="divide-y">
                  {group.endpoints.map((ep, ei) => (
                    <div key={ei} className="px-4 py-2.5 flex items-center gap-4 hover:bg-blue-50/50 transition-colors">
                      <Badge className={`text-[10px] font-mono w-14 justify-center ${methodColor[ep.method]}`}>{ep.method}</Badge>
                      <code className="text-xs font-mono text-gray-700 w-48">{group.prefix}{ep.path}</code>
                      <span className="text-xs text-gray-500 flex-1">{ep.desc}</span>
                      <Badge variant="outline" className="text-[9px]"><Lock className="w-3 h-3 mr-0.5" />{ep.auth}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
