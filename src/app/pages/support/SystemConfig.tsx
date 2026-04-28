import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings, Calendar, Database, ToggleRight, Globe, Eye,
  Save, RotateCcw, CheckCircle, Shield, Users, Layers,
  Monitor, Smartphone, Lock, Bell, Clock, Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: typeof Settings;
  enabled: boolean;
  groups: string[];
}

const modules: ModuleConfig[] = [
  { id: 'applications', name: 'คิวงาน/คำขอ', description: 'ระบบรับคำขอและพิจารณาอนุมัติ', icon: Layers, enabled: true, groups: ['ทุกกลุ่ม'] },
  { id: 'awards', name: 'ทุน/สัญญา', description: 'จัดการทุนการศึกษาและสัญญา', icon: Database, enabled: true, groups: ['ทุกกลุ่ม'] },
  { id: 'payment', name: 'การจ่ายเงิน', description: 'เบิกจ่ายงบประมาณทุน', icon: Database, enabled: true, groups: ['เจ้าหน้าที่', 'การเงิน', 'ผู้ดูแลระบบ'] },
  { id: 'tracking', name: 'ติดตามผลการศึกษา', description: 'รายงานผลการเรียนและ Traffic Light', icon: Monitor, enabled: true, groups: ['ทุกกลุ่ม'] },
  { id: 'reports', name: 'รายงาน/แดชบอร์ด', description: 'สร้างรายงานและวิเคราะห์ข้อมูล', icon: Database, enabled: true, groups: ['เจ้าหน้าที่', 'ผู้อนุมัติ', 'ผู้บริหาร', 'ผู้ดูแลระบบ'] },
  { id: 'workflows', name: 'Workflow/แบบฟอร์ม', description: 'จัดการขั้นตอนอนุมัติและ e-Form', icon: Layers, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'master-data', name: 'ข้อมูลหลัก', description: 'ข้อมูลพื้นฐาน Master Data', icon: Database, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'notifications', name: 'แจ้งเตือน/ประชาสัมพันธ์', description: 'กฎแจ้งเตือนและข่าวสาร', icon: Bell, enabled: true, groups: ['ทุกกลุ่ม'] },
  { id: 'support-tools', name: 'เครื่องมือสนับสนุน', description: 'คำนวณทุน, แฟ้มข้อมูล, ลายเซ็น', icon: Settings, enabled: true, groups: ['เจ้าหน้าที่', 'ผู้ดูแลระบบ'] },
  { id: 'api', name: 'API/การเชื่อมต่อ', description: 'จัดการ API และระบบภายนอก', icon: Globe, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'security', name: 'ความปลอดภัย/RBAC', description: 'สิทธิ์และบทบาท', icon: Shield, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'account-admin', name: 'จัดการบัญชีผู้ใช้', description: 'จัดการบัญชี Sessions กิจกรรม', icon: Users, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'audit', name: 'Audit Log', description: 'ประวัติการใช้งานระบบ', icon: Clock, enabled: true, groups: ['ผู้ดูแลระบบ'] },
  { id: 'safety-alerts', name: 'แจ้งความปลอดภัย', description: 'ระบบแจ้งเหตุฉุกเฉินจาก Mobile', icon: Shield, enabled: true, groups: ['ทุกกลุ่ม'] },
];

export default function SystemConfig() {
  const [dateFormat, setDateFormat] = useState('buddhist');
  const [language, setLanguage] = useState('th');
  const [timezone, setTimezone] = useState('asia-bangkok');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [maxUploadSize, setMaxUploadSize] = useState('50');
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map(m => [m.id, m.enabled]))
  );

  const toggleModule = (id: string) => {
    setModuleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" />การตั้งค่าทั่วไป</CardTitle>
          <CardDescription>กำหนดค่าเริ่มต้นของระบบ</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />รูปแบบการแสดงผลปี</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buddhist">พ.ศ. (ปีพุทธศักราช) — 2569</SelectItem>
                  <SelectItem value="gregorian">ค.ศ. (ปีคริสต์ศักราช) — 2026</SelectItem>
                  <SelectItem value="both">แสดงทั้งสอง — 2569 (2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" />ภาษา</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="th">ภาษาไทย</SelectItem><SelectItem value="en">English</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />เขตเวลา</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="asia-bangkok">Asia/Bangkok (UTC+7)</SelectItem><SelectItem value="utc">UTC (UTC+0)</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-gray-400" />Session Timeout (นาที)</Label>
              <Input type="number" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Database className="w-4 h-4 text-gray-400" />ขนาดไฟล์สูงสุด (MB)</Label>
              <Input type="number" value={maxUploadSize} onChange={e => setMaxUploadSize(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-gray-400" />รูปแบบวันที่</Label>
              <Select defaultValue="dd-mm-yyyy"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem><SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem><SelectItem value="dd-month-yyyy">DD เดือน YYYY</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast.success('บันทึกการตั้งค่าเรียบร้อย')}><Save className="w-4 h-4 mr-1.5" />บันทึก</Button>
            <Button variant="outline" onClick={() => toast.info('คืนค่าเริ่มต้น')}><RotateCcw className="w-4 h-4 mr-1.5" />คืนค่าเริ่มต้น</Button>
          </div>
        </CardContent>
      </Card>

      {/* Module Toggle */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2"><ToggleRight className="w-5 h-5 text-purple-600" />เปิด/ปิดโมดูลตามกลุ่มผู้ใช้</CardTitle>
          <CardDescription>ควบคุมการแสดงผลโมดูลสำหรับแต่ละกลุ่มผู้ใช้งาน</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-2">
            {modules.map((mod, i) => {
              const ModIcon = mod.icon;
              const isEnabled = moduleStates[mod.id];
              return (
                <motion.div key={mod.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <div className={`flex items-center justify-between p-3 border rounded-lg transition-all ${isEnabled ? '' : 'opacity-50 bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <ModIcon className={`w-5 h-5 ${isEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-medium">{mod.name}</p>
                        <p className="text-[10px] text-gray-500">{mod.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {mod.groups.map(g => <Badge key={g} variant="outline" className="text-[9px]">{g}</Badge>)}
                      </div>
                      <Switch checked={isEnabled} onCheckedChange={() => toggleModule(mod.id)} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Button className="mt-4" onClick={() => toast.success('บันทึกการตั้งค่าโมดูลเรียบร้อย')}><Save className="w-4 h-4 mr-1.5" />บันทึกการตั้งค่าโมดูล</Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2"><Info className="w-4 h-4 text-blue-600 mt-0.5" /><div>
            <p className="text-xs font-semibold text-blue-800">หมายเหตุ</p>
            <ul className="text-[11px] text-blue-700 mt-1 space-y-0.5">
              <li>• การเปลี่ยนรูปแบบปี พ.ศ./ค.ศ. จะมีผลกับทั้งระบบทันที</li>
              <li>• การปิดโมดูลจะซ่อนเมนูจาก Sidebar ของกลุ่มผู้ใช้ที่กำหนด</li>
              <li>• Master Data สามารถจัดการได้ที่หน้า "ข้อมูลหลัก" (/master-data)</li>
              <li>• การเปลี่ยนแปลงทุกครั้งจะถูกบันทึกใน Audit Log</li>
            </ul>
          </div></div>
        </CardContent>
      </Card>
    </div>
  );
}
