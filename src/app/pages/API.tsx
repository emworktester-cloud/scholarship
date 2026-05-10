import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Key, BookOpen, Activity, Plus, Search, Copy, Eye, EyeOff,
  RefreshCw, Trash2, Edit, CheckCircle, XCircle, AlertCircle,
  Clock, Globe, Lock, Webhook, Download, Settings, Filter,
  ExternalLink, Zap, Shield, BarChart3, Code, Layers,
  Server, Network, Gauge, Timer, Fingerprint, Building,
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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

// Sub-components
import InternalAPI from './api/InternalAPI';
import APIDocumentation from './api/APIDocumentation';
import APIMonitoring from './api/APIMonitoring';

// ===== External Connections (enhanced) =====
const connections = [
  { id: 1, name: 'ระบบ SEIS (สำนักงาน ก.พ.)', desc: 'ระบบ Scholarship Executive Information System', endpoint: 'https://api.seis.ocsc.go.th/v2', status: 'active', calls: 1250, lastCall: '25/02/2569 14:30', errorRate: '0.2%', avgLatency: '110ms', auth: 'OAuth 2.0', protocol: 'REST', category: 'internal' },
  { id: 2, name: 'ระบบ DPIS (สำนักงาน ก.พ.)', desc: 'ระบบฐานข้อมูลบุคลากรภาครัฐ', endpoint: 'https://api.dpis.ocsc.go.th/v1', status: 'active', calls: 680, lastCall: '25/02/2569 14:15', errorRate: '0.1%', avgLatency: '95ms', auth: 'OAuth 2.0', protocol: 'REST', category: 'internal' },
  { id: 3, name: 'Microsoft 365 (Identity Provider)', desc: 'SSO ด้วย Azure AD / Microsoft 365', endpoint: 'https://login.microsoftonline.com/tenant', status: 'active', calls: 2400, lastCall: '25/02/2569 15:00', errorRate: '0.05%', avgLatency: '45ms', auth: 'OpenID Connect', protocol: 'OIDC', category: 'identity' },
  { id: 4, name: 'ThaiID (กรมการปกครอง)', desc: 'ยืนยันตัวตนผ่านบัตรประชาชนดิจิทัล', endpoint: 'https://api.thaiid.dopa.go.th/v1', status: 'active', calls: 520, lastCall: '25/02/2569 13:45', errorRate: '0.3%', avgLatency: '280ms', auth: 'Mutual TLS + OAuth 2.0', protocol: 'REST', category: 'identity' },
  { id: 5, name: 'ระบบ GFMIS (กรมบัญชีกลาง)', desc: 'ระบบบริหารการเงินการคลังภาครัฐ', endpoint: 'https://api.gfmis.go.th/v2', status: 'active', calls: 340, lastCall: '25/02/2569 14:25', errorRate: '0.1%', avgLatency: '85ms', auth: 'OAuth 2.0', protocol: 'REST', category: 'finance' },
  { id: 6, name: 'ระบบทะเบียนนักศึกษา', desc: 'เชื่อมข้อมูลผลการเรียนจากสถาบันศึกษา', endpoint: 'https://api.studentreg.go.th/v1', status: 'active', calls: 248, lastCall: '25/02/2569 12:00', errorRate: '0.5%', avgLatency: '120ms', auth: 'API Key + OAuth 2.0', protocol: 'REST', category: 'education' },
  { id: 7, name: 'ระบบ Email (SMTP)', desc: 'ส่งอีเมลแจ้งเตือนอัตโนมัติ', endpoint: 'smtp://mail.scholarship.go.th:587', status: 'active', calls: 890, lastCall: '25/02/2569 15:00', errorRate: '0.3%', avgLatency: '50ms', auth: 'SMTP Auth', protocol: 'SMTP', category: 'notification' },
  { id: 8, name: 'ระบบ SMS Gateway', desc: 'ส่ง SMS แจ้งเตือน OTP', endpoint: 'https://api.sms.go.th/v1', status: 'active', calls: 150, lastCall: '25/02/2569 10:15', errorRate: '1.2%', avgLatency: '300ms', auth: 'API Key', protocol: 'REST', category: 'notification' },
  { id: 9, name: 'ระบบ HR ภาครัฐ', desc: 'ข้อมูลการชดใช้ทุนและการรับราชการ', endpoint: 'https://api.hr.go.th/v1', status: 'pending', calls: 0, lastCall: '-', errorRate: '-', avgLatency: '-', auth: 'OAuth 2.0', protocol: 'REST', category: 'internal' },
];

const apiKeys = [
  { id: 1, name: 'Production Web App', key: 'sk_prod_xxxx...7f4a', created: '01/01/2569', lastUsed: '25/02/2569 15:00', status: 'active', permissions: 'Full Access', scope: 'Web Application', expiresAt: '01/01/2570', createdBy: 'ADMIN' },
  { id: 2, name: 'Mobile App (iOS/Android)', key: 'sk_mob_xxxx...9d3e', created: '15/01/2569', lastUsed: '25/02/2569 14:30', status: 'active', permissions: 'Mobile Scope', scope: 'Mobile Application', expiresAt: '15/01/2570', createdBy: 'ADMIN' },
  { id: 3, name: 'SEIS Integration', key: 'sk_seis_xxxx...2b1c', created: '01/01/2569', lastUsed: '25/02/2569 14:15', status: 'active', permissions: 'SEIS Read/Write', scope: 'External System', expiresAt: '01/01/2570', createdBy: 'ADMIN' },
  { id: 4, name: 'DPIS Integration', key: 'sk_dpis_xxxx...4f2a', created: '01/01/2569', lastUsed: '25/02/2569 14:15', status: 'active', permissions: 'DPIS Read Only', scope: 'External System', expiresAt: '01/01/2570', createdBy: 'ADMIN' },
  { id: 5, name: 'Staging Key', key: 'sk_stag_xxxx...8c3d', created: '01/01/2569', lastUsed: '20/02/2569 16:00', status: 'active', permissions: 'Read Only', scope: 'Staging Environment', expiresAt: '01/04/2569', createdBy: 'ADMIN' },
  { id: 6, name: 'Old Integration Key', key: 'sk_old_xxxx...4a2f', created: '01/06/2568', lastUsed: '01/01/2569', status: 'revoked', permissions: 'Full Access', scope: 'Deprecated', expiresAt: '-', createdBy: 'ADMIN' },
];

const webhooks = [
  { id: 1, name: 'แจ้งเตือนอนุมัติทุน', url: 'https://hooks.slack.com/xxx', events: ['award.approved', 'award.rejected'], status: 'active', lastTriggered: '25/02/2569 12:00', successRate: '100%' },
  { id: 2, name: 'Sync ระบบ GFMIS', url: 'https://gfmis.go.th/webhook', events: ['payment.created', 'payment.completed'], status: 'active', lastTriggered: '24/02/2569 16:30', successRate: '98%' },
  { id: 3, name: 'Sync ระบบ SEIS', url: 'https://seis.ocsc.go.th/webhook', events: ['scholar.updated', 'application.status_changed'], status: 'active', lastTriggered: '25/02/2569 14:15', successRate: '99%' },
  { id: 4, name: 'แจ้งเตือน LINE Bot', url: 'https://api.line.me/v2/bot/xxx', events: ['application.submitted', 'application.status_changed'], status: 'active', lastTriggered: '25/02/2569 09:30', successRate: '95%' },
];

const apiLogs = [
  { time: '25/02/2569 15:00:15', caller: 'Web App', user: 'นายประสิทธิ์', endpoint: 'GET /api/v1/scholars?page=1', status: 200, duration: '120ms', size: '2.3KB', ip: '192.168.1.100' },
  { time: '25/02/2569 14:55:42', caller: 'SEIS', user: 'system', endpoint: 'POST /api/v1/scholars/sync', status: 201, duration: '85ms', size: '1.1KB', ip: '10.0.1.50' },
  { time: '25/02/2569 14:50:18', caller: 'Mobile App', user: 'น.ส.พิมพ์พร', endpoint: 'GET /api/v1/notifications', status: 200, duration: '65ms', size: '0.8KB', ip: '203.150.x.x' },
  { time: '25/02/2569 14:45:33', caller: 'Web App', user: 'นายสมศักดิ์', endpoint: 'POST /api/v1/applications', status: 201, duration: '180ms', size: '1.5KB', ip: '192.168.1.50' },
  { time: '25/02/2569 14:40:21', caller: 'ThaiID', user: 'system', endpoint: 'POST /api/v1/auth/verify-thaiid', status: 200, duration: '280ms', size: '0.5KB', ip: '10.100.x.x' },
  { time: '25/02/2569 14:35:08', caller: 'Web App', user: 'นายประสิทธิ์', endpoint: 'POST /api/v1/reports/generate', status: 202, duration: '50ms', size: '0.3KB', ip: '192.168.1.100' },
  { time: '25/02/2569 14:30:55', caller: 'DPIS', user: 'system', endpoint: 'GET /api/v1/scholars/SCH-001/service-debt', status: 200, duration: '95ms', size: '0.7KB', ip: '10.0.1.55' },
  { time: '25/02/2569 14:25:12', caller: 'Mobile App', user: 'นายวิชัย', endpoint: 'GET /api/v1/announcements', status: 200, duration: '55ms', size: '2.1KB', ip: '203.155.x.x' },
  { time: '25/02/2569 14:20:45', caller: 'MS365', user: 'system', endpoint: 'POST /api/v1/auth/callback/microsoft', status: 200, duration: '45ms', size: '0.4KB', ip: '13.107.x.x' },
  { time: '25/02/2569 14:15:30', caller: 'Web App', user: 'น.ส.รัตนา', endpoint: 'GET /api/v1/payments/summary', status: 401, duration: '15ms', size: '0.2KB', ip: '192.168.1.92' },
];

const categoryConfig: Record<string, { label: string; color: string }> = {
  internal: { label: 'ระบบ ก.พ.', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  identity: { label: 'ยืนยันตัวตน', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  finance: { label: 'การเงิน', color: 'bg-green-100 text-green-700 border-green-200' },
  education: { label: 'การศึกษา', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  notification: { label: 'แจ้งเตือน', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export default function API() {
  const [activeTab, setActiveTab] = useState('internal');
  const [addConnectionOpen, setAddConnectionOpen] = useState(false);
  const [addKeyOpen, setAddKeyOpen] = useState(false);
  const [addWebhookOpen, setAddWebhookOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [logFilter, setLogFilter] = useState('all');
  const [connCategoryFilter, setConnCategoryFilter] = useState('all');

  return (
    <div className="min-h-full">
      <PageHeader
        title="API / การเชื่อมต่อและบูรณาการข้อมูล"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'API/การเชื่อมต่อ' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('docs')}><BookOpen className="w-4 h-4 mr-2" />เอกสาร API</Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="API Management"
          moduleName="api"
          defaultExpanded={false}
          permissions={[
            { permission: 'api:view', label: 'ดู API', description: 'ดูรายการระบบเชื่อมต่อและ API Keys', uiLocation: 'หน้า API หลัก' },
            { permission: 'api:manage_connections', label: 'จัดการ External Connections', description: 'เพิ่ม/แก้ไข/ลบการเชื่อมต่อระบบภายนอก', uiLocation: 'Tab "ระบบภายนอก"' },
            { permission: 'api:create_keys', label: 'สร้าง API Keys', description: 'สร้าง API Key / Access Token ใหม่', uiLocation: 'Tab "API Keys & Security"' },
            { permission: 'api:revoke_keys', label: 'เพิกถอน API Keys', description: 'ยกเลิก/เพิกถอน API Key', uiLocation: 'ปุ่ม "เพิกถอน"' },
            { permission: 'api:manage_webhooks', label: 'จัดการ Webhooks', description: 'สร้าง แก้ไข ลบ Webhooks', uiLocation: 'Tab "Webhooks"' },
            { permission: 'api:view_logs', label: 'ดู API Logs', description: 'ดูบันทึกการเรียกใช้ API ทุกรายการ', uiLocation: 'Tab "API Logs"' },
            { permission: 'api:view_docs', label: 'ดู API Documentation', description: 'ดูเอกสาร API (OpenAPI Spec)', uiLocation: 'Tab "เอกสาร API"' },
            { permission: 'api:monitoring', label: 'ดู Monitoring', description: 'ดูสถานะและประสิทธิภาพ API', uiLocation: 'Tab "Monitoring"' },
          ]}
        />

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'ระบบเชื่อมต่อ', value: `${connections.filter(c => c.status === 'active').length}/${connections.length}`, icon: Globe, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
            { label: 'API Calls วันนี้', value: '12.4K', icon: Zap, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
            { label: 'API Keys (Active)', value: `${apiKeys.filter(k => k.status === 'active').length}`, icon: Key, bg: 'from-purple-500 to-violet-500', bgL: 'from-purple-50 to-violet-50' },
            { label: 'Webhooks', value: `${webhooks.length}`, icon: Webhook, bg: 'from-cyan-500 to-cyan-600', bgL: 'from-cyan-50 to-cyan-100' },
            { label: 'Avg Latency', value: '142ms', icon: Timer, bg: 'from-amber-500 to-orange-500', bgL: 'from-amber-50 to-orange-50' },
            { label: 'Uptime', value: '99.92%', icon: Activity, bg: 'from-indigo-500 to-indigo-600', bgL: 'from-indigo-50 to-indigo-100' },
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
            <TabsTrigger value="internal"><Layers className="w-4 h-4 mr-1.5" />API ภายในระบบ</TabsTrigger>
            <TabsTrigger value="external"><Globe className="w-4 h-4 mr-1.5" />ระบบภายนอก <Badge variant="secondary" className="ml-1">{connections.length}</Badge></TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-1.5" />Keys & Security</TabsTrigger>
            <TabsTrigger value="webhooks"><Webhook className="w-4 h-4 mr-1.5" />Webhooks</TabsTrigger>
            <TabsTrigger value="docs"><BookOpen className="w-4 h-4 mr-1.5" />เอกสาร API</TabsTrigger>
            <TabsTrigger value="monitoring"><Gauge className="w-4 h-4 mr-1.5" />Monitoring</TabsTrigger>
            <TabsTrigger value="logs"><Activity className="w-4 h-4 mr-1.5" />API Logs</TabsTrigger>
          </TabsList>

          {/* ===== TAB: Internal API ===== */}
          <TabsContent value="internal"><InternalAPI /></TabsContent>

          {/* ===== TAB: External Connections ===== */}
          <TabsContent value="external" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Select value={connCategoryFilter} onValueChange={setConnCategoryFilter}><SelectTrigger className="w-[160px]"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกหมวด</SelectItem><SelectItem value="internal">ระบบ ก.พ.</SelectItem><SelectItem value="identity">ยืนยันตัวตน</SelectItem><SelectItem value="finance">การเงิน</SelectItem><SelectItem value="education">การศึกษา</SelectItem><SelectItem value="notification">แจ้งเตือน</SelectItem></SelectContent></Select>
              </div>
              <Dialog open={addConnectionOpen} onOpenChange={setAddConnectionOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />เชื่อมต่อระบบใหม่</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                    <DialogTitle className="text-white text-lg flex items-center gap-2"><Globe className="w-5 h-5" />เชื่อมต่อระบบภายนอก</DialogTitle>
                    <DialogDescription className="text-blue-100 mt-1">ตั้งค่า RESTful API / Web Service เชื่อมต่อระบบสารสนเทศภายนอก</DialogDescription>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="space-y-2"><Label>ชื่อระบบ <span className="text-red-500">*</span></Label><Input placeholder="เช่น ระบบ SEIS" /></div>
                    <div className="space-y-2"><Label>Endpoint URL <span className="text-red-500">*</span></Label><Input placeholder="https://api.example.go.th/v1" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2"><Label>โปรโตคอล</Label><Select><SelectTrigger><SelectValue placeholder="REST" /></SelectTrigger><SelectContent><SelectItem value="rest">RESTful API</SelectItem><SelectItem value="soap">SOAP</SelectItem><SelectItem value="grpc">gRPC</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2"><Label>การยืนยันตัวตน</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="oauth2">OAuth 2.0</SelectItem><SelectItem value="oidc">OpenID Connect</SelectItem><SelectItem value="apikey">API Key</SelectItem><SelectItem value="mtls">Mutual TLS</SelectItem><SelectItem value="basic">Basic Auth</SelectItem></SelectContent></Select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2"><Label>หมวดหมู่</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="internal">ระบบ ก.พ.</SelectItem><SelectItem value="identity">ยืนยันตัวตน</SelectItem><SelectItem value="finance">การเงิน</SelectItem><SelectItem value="education">การศึกษา</SelectItem><SelectItem value="notification">แจ้งเตือน</SelectItem></SelectContent></Select></div>
                      <div className="space-y-2"><Label>Rate Limit (req/min)</Label><Input type="number" placeholder="100" /></div>
                    </div>
                    <div className="space-y-2"><Label>Client ID (OAuth 2.0)</Label><Input placeholder="client_id" /></div>
                    <div className="space-y-2"><Label>Client Secret</Label><Input placeholder="client_secret" type="password" /></div>
                    <div className="space-y-2"><Label>หมายเหตุ</Label><Textarea placeholder="รายละเอียดเพิ่มเติม..." rows={2} /></div>
                  </div>
                  <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddConnectionOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => { setAddConnectionOpen(false); toast.success('เพิ่มการเชื่อมต่อเรียบร้อย'); }}><Zap className="w-4 h-4 mr-1" />ทดสอบและบันทึก</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {connections.filter(c => connCategoryFilter === 'all' || c.category === connCategoryFilter).map((conn, index) => {
                const cat = categoryConfig[conn.category];
                return (
                  <motion.div key={conn.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                    <Card className={`hover:shadow-lg transition-all ${conn.status === 'pending' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${conn.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                              {conn.status === 'active' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-yellow-600" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-sm">{conn.name}</h4>
                                <Badge className={`text-[9px] ${cat?.color} border`}>{cat?.label}</Badge>
                                <Badge variant="outline" className="text-[9px] font-mono">{conn.protocol}</Badge>
                              </div>
                              <p className="text-xs text-gray-500">{conn.desc}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-1">{conn.endpoint}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Auth: <Badge variant="outline" className="text-[10px] ml-0.5">{conn.auth}</Badge></span>
                                <span>Calls: <strong>{conn.calls.toLocaleString()}</strong></span>
                                <span>Error: <strong className={conn.errorRate !== '-' && parseFloat(conn.errorRate) > 1 ? 'text-red-600' : 'text-green-600'}>{conn.errorRate}</strong></span>
                                <span>Latency: <strong>{conn.avgLatency}</strong></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={conn.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{conn.status === 'active' ? 'เชื่อมต่อ' : 'รอตั้งค่า'}</Badge>
                            <Button size="sm" variant="outline" onClick={() => toast.info(`ทดสอบ ${conn.name}`)}><Zap className="w-4 h-4 mr-1" />ทดสอบ</Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.info(`ตั้งค่า ${conn.name}`)}><Settings className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ===== TAB: Keys & Security ===== */}
          <TabsContent value="security" className="space-y-6">
            {/* OAuth 2.0 / OIDC Config */}
            <Card className="border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2"><Shield className="w-5 h-5 text-purple-600" />การรักษาความปลอดภัย API (OAuth 2.0 / OpenID Connect)</CardTitle>
                <CardDescription>การเข้าถึง API ทั้งหมดต้องผ่านการยืนยันตัวตนตามมาตรฐาน OAuth 2.0 หรือ OpenID Connect</CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'OAuth 2.0 Authorization Server', desc: 'จัดการ Access Token สำหรับ API ภายใน', items: ['Grant Types: Authorization Code, Client Credentials', 'Token Lifetime: Access 1hr, Refresh 30d', 'Scopes: scholars:read, scholars:write, applications:*, payments:*', 'PKCE: Enabled for public clients'], icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
                    { title: 'OpenID Connect (Identity)', desc: 'ยืนยันตัวตนผ่าน Microsoft 365 และ ThaiID', items: ['Provider: Azure AD (Microsoft 365)', 'Provider: ThaiID (กรมการปกครอง)', 'ID Token: RS256 signed JWT', 'Claims: sub, email, name, role, org'], icon: Fingerprint, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
                  ].map((config, i) => (
                    <Card key={i} className={`${config.border}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3"><config.icon className={`w-5 h-5 ${config.color}`} /><div><h4 className="text-sm font-semibold">{config.title}</h4><p className="text-[10px] text-gray-500">{config.desc}</p></div></div>
                        <ul className="space-y-1.5">
                          {config.items.map((item, j) => (
                            <li key={j} className="text-xs text-gray-600 flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2"><Shield className="w-4 h-4 text-orange-600 mt-0.5" /><div>
                    <p className="text-xs font-semibold text-orange-800">นโยบายความปลอดภัย</p>
                    <ul className="text-[11px] text-orange-700 mt-1 space-y-0.5">
                      <li>• API Key / Access Token จำกัดสิทธิ์การเข้าถึงฟิลด์ข้อมูลตามบทบาทผู้ใช้</li>
                      <li>• ทุก Request ต้องมี Authorization header (Bearer Token หรือ API Key)</li>
                      <li>• Rate Limiting บังคับทุก endpoint เพื่อป้องกัน DDoS</li>
                      <li>• ข้อมูลส่วนบุคคล (PII) ต้องใช้ scope พิเศษในการเข้าถึง</li>
                    </ul>
                  </div></div>
                </div>
              </CardContent>
            </Card>

            {/* API Keys Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><Key className="w-5 h-5 text-purple-600" />API Keys / Access Tokens</CardTitle>
                    <CardDescription className="mt-1">จัดการ API Keys และ Token สำหรับการเข้าถึงระบบ</CardDescription>
                  </div>
                  <Dialog open={addKeyOpen} onOpenChange={setAddKeyOpen}>
                    <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />สร้าง API Key</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-violet-700 px-6 py-5 text-white">
                        <DialogTitle className="text-white text-lg flex items-center gap-2"><Key className="w-5 h-5" />สร้าง API Key ใหม่</DialogTitle>
                        <DialogDescription className="text-purple-100 mt-1">API Key จะแสดงเพียงครั้งเดียว กรุณาคัดลอกเก็บไว้อย่างปลอดภัย</DialogDescription>
                      </div>
                      <div className="px-6 py-5 space-y-4">
                        <div className="space-y-2"><Label>ชื่อ Key <span className="text-red-500">*</span></Label><Input placeholder="เช่น Production Web App Key" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2"><Label>ขอบเขต (Scope)</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="web">Web Application</SelectItem><SelectItem value="mobile">Mobile Application</SelectItem><SelectItem value="external">External System</SelectItem><SelectItem value="staging">Staging/Test</SelectItem></SelectContent></Select></div>
                          <div className="space-y-2"><Label>สิทธิ์</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="full">Full Access</SelectItem><SelectItem value="read">Read Only</SelectItem><SelectItem value="mobile">Mobile Scope</SelectItem><SelectItem value="webhook">Webhook Only</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>หมดอายุ</Label><Select><SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger><SelectContent><SelectItem value="30">30 วัน</SelectItem><SelectItem value="90">90 วัน</SelectItem><SelectItem value="365">1 ปี</SelectItem><SelectItem value="never">ไม่หมดอายุ</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>จำกัดฟิลด์ข้อมูล (Field-Level ACL)</Label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['scholars:read', 'scholars:write', 'applications:read', 'applications:write', 'payments:read', 'reports:generate', 'pii:access', 'admin:all'].map(s => (
                              <div key={s} className="flex items-center gap-2 p-1.5 border rounded"><Checkbox id={`scope-${s}`} /><Label htmlFor={`scope-${s}`} className="text-[10px] font-mono font-normal cursor-pointer">{s}</Label></div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddKeyOpen(false)}>ยกเลิก</Button>
                        <Button onClick={() => { setAddKeyOpen(false); toast.success('สร้าง API Key เรียบร้อย'); }}>สร้าง Key</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>ชื่อ Key</TableHead><TableHead>API Key</TableHead><TableHead>สิทธิ์/Scope</TableHead><TableHead>สร้างเมื่อ</TableHead><TableHead>หมดอายุ</TableHead><TableHead>สถานะ</TableHead><TableHead></TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id} className="hover:bg-blue-50/50">
                        <TableCell><p className="text-sm font-medium">{apiKey.name}</p><p className="text-[10px] text-gray-400">{apiKey.scope}</p></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{showKeys[apiKey.id] ? apiKey.key.replace('xxxx...', '1a2b3c4d5e6f') : apiKey.key}</code>
                            <button onClick={() => setShowKeys(p => ({ ...p, [apiKey.id]: !p[apiKey.id] }))} className="text-gray-400 hover:text-gray-600">{showKeys[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                            <button onClick={() => toast.success('คัดลอก API Key')} className="text-gray-400 hover:text-gray-600"><Copy className="w-3.5 h-3.5" /></button>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{apiKey.permissions}</Badge></TableCell>
                        <TableCell className="text-xs text-gray-600">{apiKey.created}</TableCell>
                        <TableCell className="text-xs text-gray-600">{apiKey.expiresAt}</TableCell>
                        <TableCell><Badge className={apiKey.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{apiKey.status === 'active' ? 'ใช้งาน' : 'ยกเลิก'}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => toast.success(`Rotate "${apiKey.name}"`)}><RefreshCw className="w-3.5 h-3.5" /></Button>
                            {apiKey.status === 'active' && <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning(`ยกเลิก "${apiKey.name}"`)}><XCircle className="w-3.5 h-3.5" /></Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: Webhooks ===== */}
          <TabsContent value="webhooks" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold flex items-center gap-2"><Webhook className="w-5 h-5 text-cyan-600" />Webhooks</h3>
                <p className="text-xs text-gray-500 mt-0.5">ส่งข้อมูลอัตโนมัติผ่าน HTTP POST เมื่อเกิดเหตุการณ์ในระบบ</p>
              </div>
              <Dialog open={addWebhookOpen} onOpenChange={setAddWebhookOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />เพิ่ม Webhook</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-600 to-teal-700 px-6 py-5 text-white">
                    <DialogTitle className="text-white text-lg flex items-center gap-2"><Webhook className="w-5 h-5" />เพิ่ม Webhook</DialogTitle>
                    <DialogDescription className="text-cyan-100 mt-1">กำหนด URL ปลายทางและเหตุการณ์ที่ต้องการ</DialogDescription>
                  </div>
                  <div className="px-6 py-5 space-y-4">
                    <div className="space-y-2"><Label>ชื่อ Webhook</Label><Input placeholder="เช่น Sync GFMIS" /></div>
                    <div className="space-y-2"><Label>URL ปลายทาง</Label><Input placeholder="https://hooks.example.com/callback" /></div>
                    <div className="space-y-2"><Label>เหตุการณ์ที่ส่ง</Label>
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto border rounded-lg p-2">
                        {['application.submitted', 'application.status_changed', 'award.approved', 'award.rejected', 'payment.created', 'payment.completed', 'scholar.updated', 'tracking.report_submitted', 'notification.sent'].map(event => (
                          <div key={event} className="flex items-center gap-2 p-1"><Checkbox id={event} /><Label htmlFor={event} className="text-[10px] font-mono font-normal cursor-pointer">{event}</Label></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2"><Label>Secret (verify signature)</Label><Input placeholder="whsec_..." type="password" /></div>
                  </div>
                  <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddWebhookOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => { setAddWebhookOpen(false); toast.success('เพิ่ม Webhook เรียบร้อย'); }}>บันทึก</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {webhooks.map((wh, index) => (
                <motion.div key={wh.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2"><h4 className="font-semibold text-sm">{wh.name}</h4><Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge></div>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">{wh.url}</p>
                          <div className="flex gap-1.5 mt-2 flex-wrap">{wh.events.map(e => <Badge key={e} variant="outline" className="text-[10px] font-mono">{e}</Badge>)}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>ส่งล่าสุด: {wh.lastTriggered}</span>
                            <span>สำเร็จ: <strong className="text-green-600">{wh.successRate}</strong></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => toast.info('ส่ง test payload...')}><Zap className="w-3.5 h-3.5 mr-1" />ทดสอบ</Button>
                          <Button size="sm" variant="ghost"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ===== TAB: API Documentation ===== */}
          <TabsContent value="docs"><APIDocumentation /></TabsContent>

          {/* ===== TAB: Monitoring ===== */}
          <TabsContent value="monitoring"><APIMonitoring /></TabsContent>

          {/* ===== TAB: API Logs ===== */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" />บันทึกการเรียกใช้ API (API Logs)</CardTitle>
                    <CardDescription>ทุกการเรียกใช้ API ถูกบันทึกสำหรับตรวจสอบย้อนหลัง</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={logFilter} onValueChange={setLogFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="ผู้เรียก" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="web">Web App</SelectItem><SelectItem value="mobile">Mobile App</SelectItem><SelectItem value="external">External</SelectItem></SelectContent></Select>
                    <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออก API Logs')}><Download className="w-4 h-4 mr-1" />ส่งออก</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>เวลา</TableHead><TableHead>ผู้เรียก</TableHead><TableHead>ผู้ใช้</TableHead><TableHead>Endpoint</TableHead><TableHead>Status</TableHead><TableHead>Duration</TableHead><TableHead>Size</TableHead><TableHead>IP</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiLogs.map((log, index) => (
                      <TableRow key={index} className={`hover:bg-blue-50/50 ${log.status >= 400 ? 'bg-red-50/30' : ''}`}>
                        <TableCell className="text-[10px] font-mono whitespace-nowrap"><Clock className="w-3 h-3 text-gray-400 inline mr-1" />{log.time}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[9px]">{log.caller}</Badge></TableCell>
                        <TableCell className="text-xs">{log.user}</TableCell>
                        <TableCell className="font-mono text-[10px] text-gray-700 max-w-[280px] truncate">{log.endpoint}</TableCell>
                        <TableCell><Badge className={log.status < 400 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} >{log.status}</Badge></TableCell>
                        <TableCell className="text-xs text-gray-600">{log.duration}</TableCell>
                        <TableCell className="text-xs text-gray-600">{log.size}</TableCell>
                        <TableCell className="text-[10px] font-mono text-gray-400">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2"><Shield className="w-4 h-4 text-blue-600 mt-0.5" /><div>
                <p className="text-xs font-semibold text-blue-800">นโยบาย API Logging</p>
                <ul className="text-[11px] text-blue-700 mt-1 space-y-0.5">
                  <li>• ทุกการเรียกใช้ API บันทึก Log อัตโนมัติ: ผู้เรียก, Endpoint, Status, Duration, IP</li>
                  <li>• Log เก็บรักษา 1 ปี สำหรับ Compliance และการตรวจสอบย้อนหลัง</li>
                  <li>• การเรียกที่ผิดพลาด (4xx/5xx) จะถูกแจ้งเตือนไปยังผู้ดูแลระบบ</li>
                  <li>• สามารถ Query log ตาม IP, User, Endpoint, เวลา ได้</li>
                </ul>
              </div></div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
