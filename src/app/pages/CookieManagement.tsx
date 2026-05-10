import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cookie, Shield, Lock, CheckCircle, AlertTriangle, Clock,
  Settings, Search, Download, Eye, FileText, BarChart3,
  User, Globe, Filter, RefreshCw, Info, History,
  ShieldCheck, ShieldAlert, ToggleRight, ExternalLink,
  Fingerprint, Server, Database,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';

// ===== Cookie Definitions =====
interface CookieDefinition {
  name: string;
  category: 'necessary' | 'analytics' | 'functional' | 'marketing';
  purpose: string;
  domain: string;
  duration: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  type: 'Session' | 'Persistent';
}

const cookieDefinitions: CookieDefinition[] = [
  { name: 'SESSIONID', category: 'necessary', purpose: 'รหัส Session สำหรับยืนยันตัวตน', domain: '.scholarship.ocsc.go.th', duration: 'Session', httpOnly: true, secure: true, sameSite: 'Strict', type: 'Session' },
  { name: 'CSRF_TOKEN', category: 'necessary', purpose: 'Token ป้องกัน CSRF Attack', domain: '.scholarship.ocsc.go.th', duration: 'Session', httpOnly: true, secure: true, sameSite: 'Strict', type: 'Session' },
  { name: 'AUTH_TOKEN', category: 'necessary', purpose: 'JWT Access Token สำหรับ API', domain: '.scholarship.ocsc.go.th', duration: '1 ชั่วโมง', httpOnly: true, secure: true, sameSite: 'Strict', type: 'Session' },
  { name: 'REFRESH_TOKEN', category: 'necessary', purpose: 'Refresh Token สำหรับต่ออายุ', domain: '.scholarship.ocsc.go.th', duration: '30 วัน', httpOnly: true, secure: true, sameSite: 'Strict', type: 'Persistent' },
  { name: 'COOKIE_CONSENT', category: 'necessary', purpose: 'บันทึกสถานะความยินยอมคุกกี้', domain: '.scholarship.ocsc.go.th', duration: '1 ปี', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: '_ga', category: 'analytics', purpose: 'Google Analytics — ระบุผู้ใช้ไม่ซ้ำ', domain: '.scholarship.ocsc.go.th', duration: '2 ปี', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: '_ga_XXXXXXX', category: 'analytics', purpose: 'Google Analytics — สถานะ Session', domain: '.scholarship.ocsc.go.th', duration: '2 ปี', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: 'PREF_LANG', category: 'functional', purpose: 'จดจำภาษาที่เลือก', domain: '.scholarship.ocsc.go.th', duration: '6 เดือน', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: 'PREF_THEME', category: 'functional', purpose: 'จดจำธีมและการตั้งค่าแสดงผล', domain: '.scholarship.ocsc.go.th', duration: '6 เดือน', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: 'PREF_DATE_FORMAT', category: 'functional', purpose: 'จดจำรูปแบบวันที่ พ.ศ./ค.ศ.', domain: '.scholarship.ocsc.go.th', duration: '6 เดือน', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
  { name: 'PREF_VIEW', category: 'functional', purpose: 'จดจำมุมมอง Grid/List', domain: '.scholarship.ocsc.go.th', duration: '6 เดือน', httpOnly: false, secure: true, sameSite: 'Lax', type: 'Persistent' },
];

// ===== Consent Logs =====
interface ConsentLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const consentLogs: ConsentLog[] = [
  { id: 'CL-001', userId: 'USR-001', userName: 'นายประสิทธิ์ ผู้ดูแล', action: 'accepted_all', timestamp: '25/02/2569 15:30:12', ip: '192.168.1.100', userAgent: 'Chrome/122 Windows', necessary: true, analytics: true, functional: true, marketing: true },
  { id: 'CL-002', userId: 'USR-002', userName: 'น.ส.พิมพ์พร เจ้าหน้าที่', action: 'custom', timestamp: '25/02/2569 14:22:45', ip: '192.168.1.50', userAgent: 'Chrome/122 Windows', necessary: true, analytics: true, functional: true, marketing: false },
  { id: 'CL-003', userId: 'USR-003', userName: 'นายสมชาย ผู้จัดการ', action: 'rejected_optional', timestamp: '25/02/2569 13:15:30', ip: '192.168.1.75', userAgent: 'Safari/17 macOS', necessary: true, analytics: false, functional: false, marketing: false },
  { id: 'CL-004', userId: 'USR-004', userName: 'น.ส.วิภา ผู้บริหาร', action: 'accepted_all', timestamp: '24/02/2569 16:40:05', ip: '10.0.1.25', userAgent: 'Edge/122 Windows', necessary: true, analytics: true, functional: true, marketing: true },
  { id: 'CL-005', userId: 'USR-005', userName: 'นายวิชัย สมบูรณ์', action: 'withdrawn', timestamp: '24/02/2569 11:05:18', ip: '203.150.x.x', userAgent: 'Chrome/122 Android', necessary: true, analytics: false, functional: false, marketing: false },
  { id: 'CL-006', userId: 'USR-005', userName: 'นายวิชัย สมบูรณ์', action: 'custom', timestamp: '24/02/2569 11:10:22', ip: '203.150.x.x', userAgent: 'Chrome/122 Android', necessary: true, analytics: true, functional: false, marketing: false },
  { id: 'CL-007', userId: 'USR-006', userName: 'น.ส.รัตนา การเงิน', action: 'accepted_all', timestamp: '23/02/2569 09:30:55', ip: '192.168.1.92', userAgent: 'Firefox/123 Windows', necessary: true, analytics: true, functional: true, marketing: true },
  { id: 'CL-008', userId: 'USR-007', userName: 'นายสมศักดิ์ มุ่งมั่น', action: 'rejected_optional', timestamp: '22/02/2569 10:20:33', ip: '192.168.1.110', userAgent: 'Chrome/122 Windows', necessary: true, analytics: false, functional: false, marketing: false },
];

const actionLabels: Record<string, { text: string; color: string }> = {
  accepted_all: { text: 'ยอมรับทั้งหมด', color: 'bg-green-100 text-green-700 border-green-200' },
  rejected_optional: { text: 'ปฏิเสธคุกกี้เสริม', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  custom: { text: 'ตั้งค่าเอง', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  withdrawn: { text: 'ถอนความยินยอม', color: 'bg-red-100 text-red-700 border-red-200' },
};

const categoryColors: Record<string, string> = {
  necessary: 'bg-blue-100 text-blue-700 border-blue-200',
  analytics: 'bg-green-100 text-green-700 border-green-200',
  functional: 'bg-purple-100 text-purple-700 border-purple-200',
  marketing: 'bg-amber-100 text-amber-700 border-amber-200',
};
const categoryLabels: Record<string, string> = {
  necessary: 'จำเป็น',
  analytics: 'วิเคราะห์',
  functional: 'การใช้งาน',
  marketing: 'การตลาด',
};

export default function CookieManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('all');
  const [editPolicyOpen, setEditPolicyOpen] = useState(false);

  const filteredLogs = consentLogs.filter(l => {
    if (logFilter !== 'all' && l.action !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return l.userName.toLowerCase().includes(q) || l.userId.toLowerCase().includes(q);
    }
    return true;
  });

  // Stats
  const totalUsers = new Set(consentLogs.map(l => l.userId)).size;
  const acceptAllCount = consentLogs.filter(l => l.action === 'accepted_all').length;
  const consentRate = Math.round((consentLogs.filter(l => l.action !== 'withdrawn' && l.action !== 'rejected_optional').length / consentLogs.length) * 100);

  return (
    <div className="min-h-full">
      <PageHeader
        title="การบริหารจัดการคุกกี้"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'คุกกี้' }]}
        actions={
          <Button variant="outline" onClick={() => toast.info('ดูตัวอย่าง Cookie Banner')}>
            <Eye className="w-4 h-4 mr-2" />ดูตัวอย่าง Banner
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="Cookie Management"
          moduleName="cookie"
          defaultExpanded={false}
          permissions={[
            { permission: 'cookie:view', label: 'ดูการจัดการคุกกี้', description: 'ดูรายการคุกกี้และการตั้งค่า', uiLocation: 'หน้า Cookie Management' },
            { permission: 'cookie:manage', label: 'จัดการคุกกี้', description: 'แก้ไขรายการคุกกี้ Security Flags และนโยบาย', uiLocation: 'Tab "คุกกี้ & Security Flags"' },
            { permission: 'cookie:view_logs', label: 'ดู Consent Logs', description: 'ดูบันทึกความยินยอมของผู้ใช้', uiLocation: 'Tab "Consent Logs"' },
            { permission: 'cookie:export_logs', label: 'ส่งออก Consent Logs', description: 'ส่งออกข้อมูล Consent Logs', uiLocation: 'ปุ่มส่งออก' },
          ]}
        />

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'คุกกี้ทั้งหมด', value: cookieDefinitions.length, icon: Cookie, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
            { label: 'คุกกี้จำเป็น', value: cookieDefinitions.filter(c => c.category === 'necessary').length, icon: Shield, bg: 'from-indigo-500 to-indigo-600', bgL: 'from-indigo-50 to-indigo-100' },
            { label: 'คุกกี้เสริม', value: cookieDefinitions.filter(c => c.category !== 'necessary').length, icon: Settings, bg: 'from-purple-500 to-violet-500', bgL: 'from-purple-50 to-violet-50' },
            { label: 'ผู้ใช้ที่ยินยอม', value: totalUsers, icon: User, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
            { label: 'อัตราการยินยอม', value: `${consentRate}%`, icon: CheckCircle, bg: 'from-cyan-500 to-cyan-600', bgL: 'from-cyan-50 to-cyan-100' },
            { label: 'บันทึก Consent', value: consentLogs.length, icon: History, bg: 'from-amber-500 to-orange-500', bgL: 'from-amber-50 to-orange-50' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`border-0 bg-gradient-to-br ${c.bgL} hover:shadow-lg transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                    <div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview"><Cookie className="w-4 h-4 mr-1.5" />ภาพรวมคุกกี้</TabsTrigger>
            <TabsTrigger value="security"><ShieldCheck className="w-4 h-4 mr-1.5" />Security Flags</TabsTrigger>
            <TabsTrigger value="policy"><FileText className="w-4 h-4 mr-1.5" />นโยบายคุกกี้</TabsTrigger>
            <TabsTrigger value="consent-logs"><History className="w-4 h-4 mr-1.5" />Consent Logs <Badge variant="secondary" className="ml-1">{consentLogs.length}</Badge></TabsTrigger>
            <TabsTrigger value="banner-config"><ToggleRight className="w-4 h-4 mr-1.5" />ตั้งค่า Banner</TabsTrigger>
          </TabsList>

          {/* ===== TAB: Overview ===== */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Cookie className="w-5 h-5 text-blue-600" />รายการคุกกี้ทั้งหมดในระบบ</CardTitle>
                <CardDescription>คุกกี้ที่ใช้ในระบบบริหารจัดการทุนรัฐบาล ตามมาตรฐาน OpenAPI และ PDPA</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อคุกกี้</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วัตถุประสงค์</TableHead>
                      <TableHead>ระยะเวลา</TableHead>
                      <TableHead>Security Flags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cookieDefinitions.map((cookie, i) => (
                      <TableRow key={i} className="hover:bg-blue-50/50">
                        <TableCell>
                          <code className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{cookie.name}</code>
                          <p className="text-[10px] text-gray-400 mt-0.5">{cookie.domain}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[9px] border ${categoryColors[cookie.category]}`}>{categoryLabels[cookie.category]}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600 max-w-[250px]">{cookie.purpose}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[9px]">{cookie.type}</Badge>
                            <span className="text-xs text-gray-500">{cookie.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {cookie.httpOnly && <Badge className="bg-green-100 text-green-700 text-[8px] border border-green-200">HttpOnly</Badge>}
                            {cookie.secure && <Badge className="bg-blue-100 text-blue-700 text-[8px] border border-blue-200">Secure</Badge>}
                            <Badge className="bg-purple-100 text-purple-700 text-[8px] border border-purple-200">SameSite={cookie.sameSite}</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Category Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { cat: 'necessary', label: 'คุกกี้ที่จำเป็น', desc: 'Session, Auth, CSRF — ไม่สามารถปิดได้', icon: Shield, color: 'text-blue-600', borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
                { cat: 'analytics', label: 'คุกกี้เพื่อการวิเคราะห์', desc: 'Google Analytics — วิเคราะห์การใช้งาน', icon: BarChart3, color: 'text-green-600', borderColor: 'border-green-200', bgColor: 'bg-green-50' },
                { cat: 'functional', label: 'คุกกี้เพื่อการใช้งาน', desc: 'ภาษา, ธีม, มุมมอง — จดจำการตั้งค่า', icon: Settings, color: 'text-purple-600', borderColor: 'border-purple-200', bgColor: 'bg-purple-50' },
                { cat: 'marketing', label: 'คุกกี้เพื่อการตลาด', desc: 'ไม่มีการใช้งานในปัจจุบัน', icon: Globe, color: 'text-amber-600', borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
              ].map((item, i) => {
                const count = cookieDefinitions.filter(c => c.category === item.cat).length;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <Card className={`${item.borderColor} ${item.bgColor}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <h4 className="text-sm font-semibold">{item.label}</h4>
                        </div>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                        <p className="text-2xl font-bold mt-2">{count} <span className="text-xs font-normal text-gray-400">คุกกี้</span></p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ===== TAB: Security Flags ===== */}
          <TabsContent value="security" className="space-y-4">
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" />Security Flags ของคุกกี้</CardTitle>
                <CardDescription>คุณสมบัติด้านความปลอดภัยที่กำหนดให้คุกกี้ประเภท Session/Authentication</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {[
                  {
                    flag: 'HttpOnly',
                    status: true,
                    icon: Lock,
                    color: 'text-green-600',
                    bg: 'bg-green-50 border-green-200',
                    description: 'ป้องกันไม่ให้ Script ภายนอก (JavaScript) เข้าถึงคุกกี้ได้',
                    purpose: 'ป้องกัน Cross-Site Scripting (XSS) Attack',
                    appliesTo: 'SESSIONID, CSRF_TOKEN, AUTH_TOKEN, REFRESH_TOKEN',
                    standard: 'RFC 6265 Section 5.2.6',
                  },
                  {
                    flag: 'Secure',
                    status: true,
                    icon: ShieldCheck,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50 border-blue-200',
                    description: 'บังคับให้ส่งคุกกี้ผ่านโปรโตคอล HTTPS (TLS 1.2 ขึ้นไป) เท่านั้น',
                    purpose: 'ป้องกันการดักจับข้อมูลผ่านเครือข่ายที่ไม่เข้ารหัส',
                    appliesTo: 'คุกกี้ทุกตัวในระบบ',
                    standard: 'RFC 6265 Section 5.2.5 + TLS 1.2+ (RFC 5246)',
                  },
                  {
                    flag: 'SameSite (Strict/Lax)',
                    status: true,
                    icon: Shield,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50 border-purple-200',
                    description: 'ป้องกันไม่ให้เบราว์เซอร์ส่งคุกกี้พร้อม Request ที่มาจากเว็บไซต์อื่น',
                    purpose: 'ป้องกัน Cross-Site Request Forgery (CSRF) Attack',
                    appliesTo: 'Session Cookies = Strict, Others = Lax',
                    standard: 'RFC 6265bis Section 5.3.7',
                  },
                ].map((item, i) => {
                  const FlagIcon = item.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Card className={`${item.bg}`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center shadow-sm"><FlagIcon className={`w-5 h-5 ${item.color}`} /></div>
                              <div>
                                <div className="flex items-center gap-2"><h4 className="font-semibold">{item.flag}</h4><Badge className="bg-green-500 text-white text-[9px]">เปิดใช้</Badge></div>
                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="p-2 bg-white rounded-lg border"><Label className="text-[9px] text-gray-400">วัตถุประสงค์</Label><p className="text-gray-700 mt-0.5">{item.purpose}</p></div>
                            <div className="p-2 bg-white rounded-lg border"><Label className="text-[9px] text-gray-400">ใช้กับคุกกี้</Label><p className="text-gray-700 mt-0.5 font-mono text-[10px]">{item.appliesTo}</p></div>
                            <div className="p-2 bg-white rounded-lg border"><Label className="text-[9px] text-gray-400">มาตรฐาน</Label><p className="text-gray-700 mt-0.5">{item.standard}</p></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* Security Compliance */}
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2"><Info className="w-4 h-4 text-indigo-600 mt-0.5" /><div>
                      <p className="text-xs font-semibold text-indigo-800">ผลการตรวจสอบความปลอดภัย</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {[
                          { label: 'HttpOnly (Session)', pass: true },
                          { label: 'Secure Flag (All)', pass: true },
                          { label: 'SameSite (CSRF)', pass: true },
                          { label: 'TLS 1.2+', pass: true },
                        ].map((check, ci) => (
                          <div key={ci} className="flex items-center gap-1.5 text-xs">
                            {check.pass ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                            <span className={check.pass ? 'text-green-700' : 'text-red-600'}>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </div></div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: Cookie Policy ===== */}
          <TabsContent value="policy" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />นโยบายการใช้คุกกี้ (Cookie Policy)</CardTitle>
                    <CardDescription>เอกสารที่แสดงต่อผู้ใช้ — ปรับปรุงล่าสุด: 25 กุมภาพันธ์ 2569</CardDescription>
                  </div>
                  <Button onClick={() => setEditPolicyOpen(true)}>แก้ไขนโยบาย</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none border rounded-xl p-6 bg-white">
                  <h3 className="text-base text-gray-900">นโยบายการใช้คุกกี้ — ระบบบริหารจัดการทุนรัฐบาล สำนักงาน ก.พ.</h3>
                  <div className="text-xs text-gray-700 leading-relaxed space-y-3 mt-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">1. วัตถุประสงค์</h4>
                      <p>ระบบบริหารจัดการทุนรัฐบาล สำนักงานคณะกรรมการข้าราชการพลเรือน (ก.พ.) ใช้คุกกี้เพื่อให้บริการที่ดีขึ้น โดยปฏิบัติตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">2. ประเภทคุกกี้ที่ใช้</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-blue-50 rounded border border-blue-200"><strong>คุกกี้ที่จำเป็น ({cookieDefinitions.filter(c => c.category === 'necessary').length} ตัว):</strong> Session ID, CSRF Token, Auth Token — ไม่สามารถปิดได้ เก็บตลอด Session หรือ 30 วัน</div>
                        <div className="p-2 bg-green-50 rounded border border-green-200"><strong>คุกกี้วิเคราะห์ ({cookieDefinitions.filter(c => c.category === 'analytics').length} ตัว):</strong> Google Analytics — เก็บ 2 ปี ต้องได้รับความยินยอมก่อน</div>
                        <div className="p-2 bg-purple-50 rounded border border-purple-200"><strong>คุกกี้การใช้งาน ({cookieDefinitions.filter(c => c.category === 'functional').length} ตัว):</strong> ภาษา, ธีม, มุมมอง — เก็บ 6 เดือน ต้องได้รับความยินยอมก่อน</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">3. สิทธิ์ในการจัดการ</h4>
                      <p>ผู้ใช้สามารถเลือกยินยอม ปฏิเสธ หรือถอนความยินยอม (Withdraw Consent) ได้ตลอดเวลา ผ่าน Cookie Banner หรือเมนู "ตั้งค่าคุกกี้" ที่มุมล่างซ้ายของหน้าจอ</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">4. การบันทึกหลักฐาน</h4>
                      <p>ระบบบันทึก Consent Log ทุกครั้งที่ผู้ใช้ให้/แก้ไข/ถอนความยินยอม เพื่อใช้ในการตรวจสอบตามกฎหมาย PDPA</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p><strong>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO):</strong> สำนักงาน ก.พ. | อีเมล: dpo@ocsc.go.th</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Policy Dialog */}
            <Dialog open={editPolicyOpen} onOpenChange={setEditPolicyOpen}>
              <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                  <DialogTitle className="text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5" />แก้ไขนโยบายคุกกี้</DialogTitle>
                  <DialogDescription className="text-blue-100 mt-1">แก้ไขเนื้อหานโยบายที่แสดงต่อผู้ใช้</DialogDescription>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2"><Label>หัวข้อ</Label><Input defaultValue="นโยบายการใช้คุกกี้ — ระบบบริหารจัดการทุนรัฐบาล สำนักงาน ก.พ." /></div>
                  <div className="space-y-2"><Label>เนื้อหา (HTML)</Label><Textarea className="min-h-[200px] font-mono text-xs" defaultValue="<h3>นโยบายการใช้คุกกี้</h3>..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>อีเมล DPO</Label><Input defaultValue="dpo@ocsc.go.th" /></div>
                    <div className="space-y-2"><Label>วันที่ปรับปรุง</Label><Input type="date" defaultValue="2026-02-25" /></div>
                  </div>
                </div>
                <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditPolicyOpen(false)}>ยกเลิก</Button>
                  <Button onClick={() => { setEditPolicyOpen(false); toast.success('บันทึกนโยบายเรียบร้อย'); }}>บันทึก</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ===== TAB: Consent Logs ===== */}
          <TabsContent value="consent-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><History className="w-5 h-5 text-blue-600" />บันทึกความยินยอมคุกกี้ (Consent Logs)</CardTitle>
                    <CardDescription>บันทึกทุกการให้/แก้ไข/ถอนความยินยอม ตามกฎหมาย PDPA มาตรา 19</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="ค้นหาชื่อ/รหัสผู้ใช้..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="w-52" />
                    <Select value={logFilter} onValueChange={setLogFilter}><SelectTrigger className="w-[160px]"><SelectValue placeholder="ประเภท" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="accepted_all">ยอมรับทั้งหมด</SelectItem><SelectItem value="custom">ตั้งค่าเอง</SelectItem><SelectItem value="rejected_optional">ปฏิเสธเสริม</SelectItem><SelectItem value="withdrawn">ถอนความยินยอม</SelectItem></SelectContent></Select>
                    <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออก Consent Logs (CSV)')}><Download className="w-4 h-4 mr-1" />ส่งออก</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เวลา</TableHead>
                      <TableHead>ผู้ใช้</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                      <TableHead>จำเป็น</TableHead>
                      <TableHead>วิเคราะห์</TableHead>
                      <TableHead>การใช้งาน</TableHead>
                      <TableHead>การตลาด</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>เบราว์เซอร์</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const al = actionLabels[log.action] || actionLabels.custom;
                      return (
                        <TableRow key={log.id} className="hover:bg-blue-50/50">
                          <TableCell className="text-[10px] font-mono whitespace-nowrap"><Clock className="w-3 h-3 text-gray-400 inline mr-1" />{log.timestamp}</TableCell>
                          <TableCell><p className="text-xs font-medium">{log.userName}</p><p className="text-[10px] text-gray-400">{log.userId}</p></TableCell>
                          <TableCell><Badge className={`text-[9px] border ${al.color}`}>{al.text}</Badge></TableCell>
                          <TableCell><ConsentBadge value={log.necessary} /></TableCell>
                          <TableCell><ConsentBadge value={log.analytics} /></TableCell>
                          <TableCell><ConsentBadge value={log.functional} /></TableCell>
                          <TableCell><ConsentBadge value={log.marketing} /></TableCell>
                          <TableCell className="text-[10px] font-mono text-gray-400">{log.ip}</TableCell>
                          <TableCell className="text-[10px] text-gray-400 max-w-[100px] truncate">{log.userAgent}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2"><Shield className="w-4 h-4 text-blue-600 mt-0.5" /><div>
                <p className="text-xs font-semibold text-blue-800">การปฏิบัติตาม PDPA</p>
                <ul className="text-[11px] text-blue-700 mt-1 space-y-0.5">
                  <li>• Consent Log เก็บรักษาตลอดอายุการใช้งานระบบ + 10 ปีหลังสิ้นสุด</li>
                  <li>• บันทึก: วัน/เวลา, ประเภทความยินยอม, IP Address, User Agent</li>
                  <li>• สามารถส่งออกเป็น CSV/PDF สำหรับการตรวจสอบของเจ้าหน้าที่</li>
                  <li>• ผู้ใช้แต่ละรายสามารถถอนความยินยอม (Withdraw Consent) ได้ตลอดเวลา</li>
                </ul>
              </div></div>
            </div>
          </TabsContent>

          {/* ===== TAB: Banner Config ===== */}
          <TabsContent value="banner-config" className="space-y-4">
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2"><ToggleRight className="w-5 h-5 text-purple-600" />ตั้งค่า Cookie Consent Banner</CardTitle>
                <CardDescription>กำหนดรูปแบบและพฤติกรรมของ Banner แจ้งเตือนคุกกี้</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>ตำแหน่ง Banner</Label>
                    <Select defaultValue="bottom"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bottom">ด้านล่าง (แนะนำ)</SelectItem><SelectItem value="top">ด้านบน</SelectItem><SelectItem value="center">ตรงกลาง (Modal)</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-2"><Label>สี Theme</Label>
                    <Select defaultValue="white"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="white">ขาว (แนะนำ)</SelectItem><SelectItem value="dark">เข้ม</SelectItem><SelectItem value="blue">น้ำเงิน</SelectItem></SelectContent></Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">การแสดงผล</h4>
                  {[
                    { label: 'แสดง Banner เมื่อเข้าครั้งแรก', desc: 'แสดงอัตโนมัติเมื่อยังไม่เคยยินยอม', enabled: true },
                    { label: 'แสดงปุ่ม "ตั้งค่าคุกกี้" ถาวร', desc: 'แสดงปุ่มมุมล่างซ้ายตลอดเวลา', enabled: true },
                    { label: 'แสดงรายละเอียดคุกกี้แบบขยาย', desc: 'ให้ผู้ใช้ดูรายละเอียดแต่ละประเภทได้', enabled: true },
                    { label: 'บังคับเลือกก่อนใช้งาน', desc: 'ไม่ให้ใช้งานจนกว่าจะเลือกยินยอม (Blocking)', enabled: false },
                    { label: 'แจ้งเตือนซ้ำเมื่อมีการเปลี่ยนแปลง', desc: 'แสดง Banner อีกครั้งเมื่อนโยบายเปลี่ยน', enabled: true },
                  ].map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div><p className="text-sm font-medium">{opt.label}</p><p className="text-[10px] text-gray-500">{opt.desc}</p></div>
                      <Switch defaultChecked={opt.enabled} />
                    </div>
                  ))}
                </div>

                <Button onClick={() => toast.success('บันทึกการตั้งค่า Banner เรียบร้อย')}>บันทึกการตั้งค่า</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ConsentBadge({ value }: { value: boolean }) {
  return value ? (
    <Badge className="bg-green-100 text-green-700 text-[9px] border border-green-200"><CheckCircle className="w-3 h-3 mr-0.5" />ยินยอม</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-500 text-[9px] border border-gray-200">ปฏิเสธ</Badge>
  );
}
