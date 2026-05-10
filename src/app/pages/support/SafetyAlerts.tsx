import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle, Shield, Siren, MapPin, Phone, Clock, User,
  CheckCircle, XCircle, Eye, MessageSquare, Globe, Bell,
  Search, Filter, ChevronRight, Smartphone, Send, Heart,
  CloudLightning, Bomb, Waves, Flame, Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';

interface SafetyAlert {
  id: string;
  scholarId: string;
  scholarName: string;
  country: string;
  city: string;
  alertType: string;
  alertTypeIcon: typeof AlertTriangle;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved' | 'closed';
  message: string;
  reportedAt: string;
  lastUpdate: string;
  contactPhone: string;
  latitude: string;
  longitude: string;
  responseTeam: string;
}

const alerts: SafetyAlert[] = [
  { id: 'SA-001', scholarId: 'SCH-012', scholarName: 'น.ส.ปิยะดา เก่งกล้า', country: 'ญี่ปุ่น', city: 'Tokyo', alertType: 'แผ่นดินไหว', alertTypeIcon: Activity, severity: 'critical', status: 'active', message: 'แผ่นดินไหว M6.2 ในพื้นที่โตเกียว นักเรียนแจ้งว่าอยู่ในอาคารมหาวิทยาลัย ปลอดภัยเบื้องต้น', reportedAt: '25/02/2569 14:30', lastUpdate: '25/02/2569 15:15', contactPhone: '+81-90-xxxx-xxxx', latitude: '35.6762', longitude: '139.6503', responseTeam: 'สถานเอกอัครราชทูตไทย ณ กรุงโตเกียว' },
  { id: 'SA-002', scholarId: 'SCH-025', scholarName: 'นายภาคิน แข็งแรง', country: 'สหราชอาณาจักร', city: 'London', alertType: 'เหตุก่อการร้าย', alertTypeIcon: Siren, severity: 'high', status: 'acknowledged', message: 'มีรายงานเหตุการณ์ผิดปกติบริเวณ London Bridge นักเรียนอยู่ห่างจากพื้นที่ 2 กม. ปลอดภัย', reportedAt: '24/02/2569 22:15', lastUpdate: '25/02/2569 08:00', contactPhone: '+44-7xxx-xxxxxx', latitude: '51.5074', longitude: '-0.0878', responseTeam: 'สถานเอกอัครราชทูตไทย ณ กรุงลอนดอน' },
  { id: 'SA-003', scholarId: 'SCH-018', scholarName: 'น.ส.มนัสนันท์ สดใส', country: 'สหรัฐอเมริกา', city: 'Los Angeles', alertType: 'ไฟป่า', alertTypeIcon: Flame, severity: 'medium', status: 'resolved', message: 'ไฟป่าในพื้นที่ California อยู่ห่างจากที่พัก 15 ไมล์ ไม่มีผลกระทบโดยตรง', reportedAt: '22/02/2569 10:00', lastUpdate: '24/02/2569 16:00', contactPhone: '+1-310-xxx-xxxx', latitude: '34.0522', longitude: '-118.2437', responseTeam: 'สถานกงสุลใหญ่ ณ นครลอสแอนเจลิส' },
  { id: 'SA-004', scholarId: 'SCH-031', scholarName: 'นายอนุชา กล้าหาญ', country: 'ออสเตรเลีย', city: 'Sydney', alertType: 'น้ำท่วม', alertTypeIcon: Waves, severity: 'low', status: 'closed', message: 'น้ำท่วมในเขต Western Sydney ไม่อยู่ในพื้นที่เสี่ยง ยืนยันว่าปลอดภัย', reportedAt: '20/02/2569 08:00', lastUpdate: '21/02/2569 12:00', contactPhone: '+61-4xx-xxx-xxx', latitude: '-33.8688', longitude: '151.2093', responseTeam: 'สถานเอกอัครราชทูตไทย ณ กรุงแคนเบอร์รา' },
  { id: 'SA-005', scholarId: 'SCH-045', scholarName: 'น.ส.กัลยาณี ใจเย็น', country: 'เยอรมนี', city: 'Munich', alertType: 'พายุหิมะ', alertTypeIcon: CloudLightning, severity: 'medium', status: 'acknowledged', message: 'พายุหิมะรุนแรงในมิวนิก การเดินทางลำบาก แต่อยู่ในที่พักปลอดภัย', reportedAt: '23/02/2569 18:00', lastUpdate: '24/02/2569 10:00', contactPhone: '+49-176-xxxx-xxxx', latitude: '48.1351', longitude: '11.5820', responseTeam: 'สถานกงสุลใหญ่ ณ นครมิวนิก' },
];

const severityConfig = {
  critical: { label: 'วิกฤต', bg: 'bg-red-500', text: 'text-white', border: 'border-red-500', light: 'bg-red-50', lightText: 'text-red-700' },
  high: { label: 'สูง', bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500', light: 'bg-orange-50', lightText: 'text-orange-700' },
  medium: { label: 'กลาง', bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-400', light: 'bg-yellow-50', lightText: 'text-yellow-700' },
  low: { label: 'ต่ำ', bg: 'bg-blue-400', text: 'text-white', border: 'border-blue-400', light: 'bg-blue-50', lightText: 'text-blue-700' },
};

const statusConfig = {
  active: { label: 'กำลังดำเนินการ', bg: 'bg-red-100', color: 'text-red-700', icon: Siren },
  acknowledged: { label: 'รับทราบแล้ว', bg: 'bg-yellow-100', color: 'text-yellow-700', icon: Eye },
  resolved: { label: 'แก้ไขแล้ว', bg: 'bg-green-100', color: 'text-green-700', icon: CheckCircle },
  closed: { label: 'ปิดเคส', bg: 'bg-gray-100', color: 'text-gray-600', icon: XCircle },
};

export default function SafetyAlerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);

  const filtered = alerts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.scholarName.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.alertType.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const acknowledgedCount = alerts.filter(a => a.status === 'acknowledged').length;

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {activeCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse"><Siren className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm font-bold text-red-800">มี {activeCount} เหตุการณ์ฉุกเฉินที่กำลังดำเนินการ</p><p className="text-xs text-red-600">กรุณาตรวจสอบและตอบรับแจ้งเตือนโดยเร็ว</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'เหตุการณ์ทั้งหมด', value: alerts.length, icon: AlertTriangle, bg: 'from-blue-500 to-blue-600', bgL: 'from-blue-50 to-blue-100' },
          { label: 'กำลังดำเนินการ', value: activeCount, icon: Siren, bg: 'from-red-500 to-rose-500', bgL: 'from-red-50 to-rose-50' },
          { label: 'รับทราบแล้ว', value: acknowledgedCount, icon: Eye, bg: 'from-yellow-500 to-amber-500', bgL: 'from-yellow-50 to-amber-50' },
          { label: 'นักเรียนปลอดภัย', value: `${alerts.filter(a => a.status === 'resolved' || a.status === 'closed').length}/${alerts.length}`, icon: Heart, bg: 'from-green-500 to-emerald-500', bgL: 'from-green-50 to-emerald-50' },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-0 bg-gradient-to-br ${c.bgL}`}>
              <CardContent className="p-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div><div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p></div></div></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Input placeholder="ค้นหาชื่อ/ประเทศ/ประเภท..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-64" />
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[160px]"><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="active">กำลังดำเนินการ</SelectItem><SelectItem value="acknowledged">รับทราบแล้ว</SelectItem><SelectItem value="resolved">แก้ไขแล้ว</SelectItem><SelectItem value="closed">ปิดเคส</SelectItem></SelectContent></Select>
        </div>
        <Button variant="outline" onClick={() => toast.info('ส่งข้อความถึงนักเรียนทุนทุกคน')}><Send className="w-4 h-4 mr-1.5" />ส่งข้อความกลุ่ม</Button>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert, i) => {
          const sev = severityConfig[alert.severity];
          const st = statusConfig[alert.status];
          const StatusIcon = st.icon;
          const AlertIcon = alert.alertTypeIcon;
          return (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${sev.border}`} onClick={() => { setSelectedAlert(alert); setDetailOpen(true); }}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${sev.bg} flex items-center justify-center shadow-md`}><AlertIcon className={`w-6 h-6 ${sev.text}`} /></div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{alert.alertType}</h4>
                          <Badge className={`text-[10px] ${sev.light} ${sev.lightText} border`}>{sev.label}</Badge>
                          <Badge className={`text-[10px] ${st.bg} ${st.color} border`}><StatusIcon className="w-3 h-3 mr-0.5" />{st.label}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{alert.scholarName} ({alert.scholarId})</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.city}, {alert.country}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.reportedAt}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile info */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3"><Smartphone className="w-5 h-5 text-green-600 mt-0.5" /><div>
            <p className="text-sm font-semibold text-green-800">ระบบแจ้งเหตุจาก Mobile Application</p>
            <ul className="text-xs text-green-700 mt-1.5 space-y-1">
              <li>• นักเรียนทุนสามารถกดปุ่ม <strong>"แจ้งความปลอดภัย"</strong> บน Mobile App เพื่อส่งสถานะและตำแหน่ง GPS</li>
              <li>• ระบบจะส่ง Push Notification ไปยังเจ้าหน้าที่รับผิดชอบทันที</li>
              <li>• รองรับ: เหตุภัยธรรมชาติ, เหตุก่อการร้าย, เหตุฉุกเฉินอื่นๆ</li>
              <li>• เจ้าหน้าที่สามารถตอบกลับและติดตามสถานะผ่านหน้าจอนี้</li>
            </ul>
          </div></div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        {selectedAlert && (
          <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
            <div className={`${severityConfig[selectedAlert.severity].bg} px-6 py-5 text-white`}>
              <DialogTitle className="text-white text-lg flex items-center gap-2"><selectedAlert.alertTypeIcon className="w-5 h-5" />{selectedAlert.alertType} — {selectedAlert.city}, {selectedAlert.country}</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">รหัสเหตุการณ์: {selectedAlert.id} | แจ้งเมื่อ: {selectedAlert.reportedAt}</DialogDescription>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">นักเรียนทุน</Label><p className="text-sm font-medium">{selectedAlert.scholarName}</p><p className="text-[10px] text-gray-500">{selectedAlert.scholarId}</p></div>
                <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">พิกัด</Label><p className="text-xs font-mono">{selectedAlert.latitude}, {selectedAlert.longitude}</p><p className="text-[10px] text-gray-500">{selectedAlert.city}, {selectedAlert.country}</p></div>
                <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">เบอร์ติดต่อ</Label><p className="text-sm font-medium">{selectedAlert.contactPhone}</p></div>
                <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">ทีมรับผิดชอบ</Label><p className="text-sm font-medium">{selectedAlert.responseTeam}</p></div>
              </div>
              <div className="p-3 border rounded-lg"><Label className="text-[10px] text-gray-400">รายละเอียด</Label><p className="text-sm mt-1">{selectedAlert.message}</p></div>
              <div className="space-y-2"><Label>ส่งข้อความถึงนักเรียน</Label><Textarea placeholder="พิมพ์ข้อความ..." /><Button size="sm" onClick={() => toast.success('ส่งข้อความเรียบร้อย')}><Send className="w-3.5 h-3.5 mr-1" />ส่ง</Button></div>
            </div>
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
              <div className="flex gap-2">
                {selectedAlert.status === 'active' && <Button variant="outline" onClick={() => { setDetailOpen(false); toast.success('รับทราบเหตุการณ์แล้ว'); }}><Eye className="w-4 h-4 mr-1" />รับทราบ</Button>}
                {(selectedAlert.status === 'active' || selectedAlert.status === 'acknowledged') && <Button onClick={() => { setDetailOpen(false); toast.success('ปิดเคสเรียบร้อย'); }} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-1" />แก้ไขแล้ว / ปิดเคส</Button>}
              </div>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>ปิด</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
