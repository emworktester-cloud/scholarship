import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Save,
  Play,
  History,
  Plus,
  Trash2,
  ArrowDown,
  ArrowRight,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Users,
  Mail,
  Bell,
  Eye,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Copy,
  Zap,
  GitBranch,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';

interface WorkflowState {
  id: string;
  name: string;
  type: 'start' | 'process' | 'decision' | 'notification' | 'end';
  description: string;
  assignee: string;
  slaHours: number;
  autoActions: string[];
  notifications: string[];
  color: string;
}

const defaultStates: WorkflowState[] = [
  { id: 's1', name: 'ส่งใบสมัคร', type: 'start', description: 'ผู้สมัครส่งใบสมัครผ่านระบบออนไลน์', assignee: 'ผู้สมัคร', slaHours: 0, autoActions: ['ส่ง email ยืนยัน', 'สร้างเลขที่ใบสมัคร'], notifications: ['email', 'sms'], color: '#3b82f6' },
  { id: 's2', name: 'ตรวจสอบเอกสาร', type: 'process', description: 'เจ้าหน้าที่ตรวจสอบเอกสารและคุณสมบัติ', assignee: 'เจ้าหน้าที่ทุน', slaHours: 48, autoActions: ['แจ้งเตือนเมื่อเกิน SLA'], notifications: ['email'], color: '#f59e0b' },
  { id: 's3', name: 'คุณสมบัติผ่าน?', type: 'decision', description: 'ตรวจสอบคุณสมบัติเบื้องต้น ผ่าน/ไม่ผ่าน', assignee: 'เจ้าหน้าที่ทุน', slaHours: 0, autoActions: [], notifications: [], color: '#8b5cf6' },
  { id: 's4', name: 'คณะกรรมการพิจารณา', type: 'process', description: 'คณะกรรมการให้คะแนนและพิจารณา', assignee: 'คณะกรรมการ', slaHours: 168, autoActions: ['แจ้งเตือนกรรมการ', 'รวมคะแนนอัตโนมัติ'], notifications: ['email'], color: '#0ea5e9' },
  { id: 's5', name: 'อนุมัติ/ไม่อนุมัติ', type: 'decision', description: 'ผู้มีอำนาจตัดสินอนุมัติ', assignee: 'ผู้อนุมัติ', slaHours: 72, autoActions: [], notifications: ['email', 'sms'], color: '#8b5cf6' },
  { id: 's6', name: 'แจ้งผลผู้สมัคร', type: 'notification', description: 'แจ้งผลการพิจารณาทุกช่องทาง', assignee: 'ระบบ', slaHours: 0, autoActions: ['ส่ง email แจ้งผล', 'ส่ง SMS แจ้งผล', 'อัปเดตหน้าตรวจสอบสถานะ'], notifications: ['email', 'sms', 'line'], color: '#10b981' },
  { id: 's7', name: 'สร้างสัญญา/แผนจ่ายเงิน', type: 'process', description: 'เจ้าหน้าที่สร้างสัญญาและแผนจ่ายเงิน', assignee: 'เจ้าหน้าที่ทุน', slaHours: 120, autoActions: ['สร้างรหัสทุน AWD อัตโนมัติ'], notifications: ['email'], color: '#f59e0b' },
  { id: 's8', name: 'ติดตามผลการศึกษา', type: 'process', description: 'ระบบติดตามรายงานและ GPA อัตโนมัติ', assignee: 'ระบบ + เจ้าหน้าที่', slaHours: 0, autoActions: ['แจ้งเตือนก่อนกำหนดส่งรายงาน', 'ระงับจ่ายเงินถ้าไม่ส่งรายงาน'], notifications: ['email', 'sms'], color: '#06b6d4' },
  { id: 's9', name: 'ปิดทุน', type: 'end', description: 'สำเร็จการศึกษาหรือปิดทุนด้วยเหตุอื่น', assignee: 'เจ้าหน้าที่ทุน', slaHours: 0, autoActions: ['สรุปข้อมูลทุน', 'เก็บประวัติ'], notifications: ['email'], color: '#64748b' },
];

const stateTypeConfig = {
  start: { label: 'เริ่มต้น', icon: Play, bg: 'bg-blue-500' },
  process: { label: 'กระบวนการ', icon: Settings, bg: 'bg-yellow-500' },
  decision: { label: 'ตัดสินใจ', icon: GitBranch, bg: 'bg-purple-500' },
  notification: { label: 'แจ้งเตือน', icon: Bell, bg: 'bg-green-500' },
  end: { label: 'สิ้นสุด', icon: CheckCircle, bg: 'bg-gray-500' },
};

export default function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('Workflow ทุนการศึกษาต่างประเทศ');
  const [states, setStates] = useState<WorkflowState[]>(defaultStates);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedStateData = states.find(s => s.id === selectedState);

  const handleSave = () => {
    toast.success('บันทึก Workflow เรียบร้อยแล้ว', { description: 'บันทึกเป็นฉบับร่าง' });
  };

  const handlePublish = () => {
    toast.success('เผยแพร่ Workflow เรียบร้อยแล้ว', { description: 'Workflow พร้อมใช้งานแล้ว' });
  };

  const handleAddState = () => {
    const newState: WorkflowState = {
      id: `s${Date.now()}`,
      name: `สถานะใหม่ ${states.length + 1}`,
      type: 'process',
      description: '',
      assignee: '',
      slaHours: 24,
      autoActions: [],
      notifications: [],
      color: '#3b82f6',
    };
    setStates([...states, newState]);
    setSelectedState(newState.id);
    toast.success('เพิ่มสถานะใหม่เรียบร้อย');
  };

  const handleRemoveState = (id: string) => {
    setStates(states.filter(s => s.id !== id));
    if (selectedState === id) setSelectedState(null);
    toast.success('ลบสถานะเรียบร้อย');
  };

  const handleDuplicateState = (id: string) => {
    const state = states.find(s => s.id === id);
    if (!state) return;
    const newState = { ...state, id: `s${Date.now()}`, name: `${state.name} (สำเนา)` };
    const index = states.findIndex(s => s.id === id);
    const updated = [...states];
    updated.splice(index + 1, 0, newState);
    setStates(updated);
    toast.success('สำเนาสถานะเรียบร้อย');
  };

  const moveState = (id: string, direction: 'up' | 'down') => {
    const index = states.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      const updated = [...states];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setStates(updated);
    } else if (direction === 'down' && index < states.length - 1) {
      const updated = [...states];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setStates(updated);
    }
  };

  const updateState = (id: string, updates: Partial<WorkflowState>) => {
    setStates(states.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const getStateShape = (type: string) => {
    switch (type) {
      case 'decision': return 'rotate-45';
      case 'start': return 'rounded-full';
      case 'end': return 'rounded-full';
      default: return 'rounded-xl';
    }
  };

  return (
    <div className="min-h-full bg-card">
      <PageHeader
        title="ออกแบบ Workflow"
        breadcrumbs={[
          { label: 'แดชบอร์ด', path: '/' },
          { label: 'Workflow', path: '/workflows' },
          { label: 'ออกแบบ Workflow' },
        ]}
        actions={
          <div className="flex gap-2">
            <Link to="/workflows">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              ดูตัวอย่าง
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              บันทึก
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handlePublish}>
              <Play className="h-4 w-4 mr-2" />
              เผยแพร่
            </Button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-144px)]">
        {/* Left Panel - State Types */}
        <div className="w-56 border-r bg-white p-4 overflow-y-auto">
          <h3 className="font-semibold mb-3 text-sm text-gray-700">ประเภทสถานะ</h3>
          <div className="space-y-1.5 mb-6">
            {Object.entries(stateTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 text-left transition-colors text-sm"
                  onClick={handleAddState}
                >
                  <div className={`w-6 h-6 ${config.bg} rounded flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">{config.label}</span>
                </motion.button>
              );
            })}
          </div>

          <Separator className="mb-4" />

          <h3 className="font-semibold mb-3 text-sm text-gray-700">ข้อมูล Workflow</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">ชื่อ</Label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>จำนวนสถานะ</span>
                <strong>{states.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>เวอร์ชัน</span>
                <strong>2.1</strong>
              </div>
              <div className="flex justify-between">
                <span>สถานะ</span>
                <Badge variant="outline" className="text-xs">ร่าง</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Workflow Canvas */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
          <div className="max-w-xl mx-auto">
            <AnimatePresence>
              {states.map((state, index) => {
                const config = stateTypeConfig[state.type];
                const Icon = config.icon;
                const isSelected = selectedState === state.id;

                return (
                  <div key={state.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`relative group cursor-pointer transition-all ${isSelected ? 'scale-[1.02]' : ''}`}
                      onClick={() => setSelectedState(state.id)}
                    >
                      {/* State Card */}
                      <div className={`relative bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all ${
                        isSelected ? 'border-blue-500 shadow-blue-100' : 'border-gray-200 hover:border-blue-300'
                      } ${state.type === 'decision' ? 'border-purple-300' : ''}`}>
                        {/* Color indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl" style={{ backgroundColor: state.color }} />

                        <div className="p-4 pl-5">
                          <div className="flex items-start gap-3">
                            {/* Controls */}
                            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); moveState(state.id, 'up'); }} className="p-0.5 hover:bg-gray-100 rounded" disabled={index === 0}>
                                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                              <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                              <button onClick={(e) => { e.stopPropagation(); moveState(state.id, 'down'); }} className="p-0.5 hover:bg-gray-100 rounded" disabled={index === states.length - 1}>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                            </div>

                            {/* Icon */}
                            <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm truncate">{state.name}</h4>
                                <Badge variant="outline" className="text-xs shrink-0">{config.label}</Badge>
                              </div>
                              {state.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{state.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                {state.assignee && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {state.assignee}
                                  </span>
                                )}
                                {state.slaHours > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    SLA: {state.slaHours}ชม.
                                  </span>
                                )}
                                {state.notifications.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Bell className="w-3 h-3" />
                                    {state.notifications.length} ช่องทาง
                                  </span>
                                )}
                                {state.autoActions.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {state.autoActions.length} อัตโนมัติ
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); handleDuplicateState(state.id); }} className="p-1.5 hover:bg-gray-100 rounded" title="สำเนา">
                                <Copy className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveState(state.id); }} className="p-1.5 hover:bg-red-50 rounded" title="ลบ">
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Step number */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                      </div>
                    </motion.div>

                    {/* Arrow between states */}
                    {index < states.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-4 bg-gray-300" />
                          <ArrowDown className="w-4 h-4 text-gray-400" />
                        </div>
                        {states[index].type === 'decision' && (
                          <div className="absolute right-0 flex items-center gap-1 text-xs text-gray-400">
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">ไม่ผ่าน → แจ้งผล</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </AnimatePresence>

            {/* Add State Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              onClick={handleAddState}
            >
              <Plus className="w-5 h-5" />
              เพิ่มสถานะใหม่
            </motion.button>
          </div>
        </div>

        {/* Right Panel - State Properties */}
        <div className="w-80 border-l bg-white p-5 overflow-y-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-gray-600" />
            ตั้งค่าสถานะ
          </h3>

          {selectedStateData ? (
            <motion.div
              key={selectedStateData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label className="text-sm">ชื่อสถานะ</Label>
                <Input
                  value={selectedStateData.name}
                  onChange={(e) => updateState(selectedStateData.id, { name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ประเภท</Label>
                <Select
                  value={selectedStateData.type}
                  onValueChange={(v) => updateState(selectedStateData.id, { type: v as WorkflowState['type'] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(stateTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">คำอธิบาย</Label>
                <Textarea
                  value={selectedStateData.description}
                  onChange={(e) => updateState(selectedStateData.id, { description: e.target.value })}
                  placeholder="อธิบายขั้นตอนนี้..."
                  className="min-h-16"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ผู้รับผิดชอบ</Label>
                <Select
                  value={selectedStateData.assignee}
                  onValueChange={(v) => updateState(selectedStateData.id, { assignee: v })}
                >
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ผู้สมัคร">ผู้สมัคร</SelectItem>
                    <SelectItem value="เจ้าหน้าที่ทุน">เจ้าหน้าที่ทุน</SelectItem>
                    <SelectItem value="คณะกรรมการ">คณะกรรมการ</SelectItem>
                    <SelectItem value="ผู้อนุมัติ">ผู้อนุมัติ</SelectItem>
                    <SelectItem value="ระบบ">ระบบ (อัตโนมัติ)</SelectItem>
                    <SelectItem value="ระบบ + เจ้าหน้าที่">ระบบ + เจ้าหน้าที่</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">SLA (ชั่วโมง)</Label>
                <Input
                  type="number"
                  value={selectedStateData.slaHours}
                  onChange={(e) => updateState(selectedStateData.id, { slaHours: Number(e.target.value) })}
                  placeholder="0 = ไม่กำหนด"
                />
                <p className="text-xs text-gray-400">0 = ไม่กำหนดเวลา</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">สี</Label>
                <div className="flex gap-2 flex-wrap">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#06b6d4', '#64748b'].map(c => (
                    <button
                      key={c}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${selectedStateData.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => updateState(selectedStateData.id, { color: c })}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm">ช่องทางแจ้งเตือน</Label>
                <div className="space-y-2">
                  {[
                    { key: 'email', label: 'อีเมล', icon: Mail },
                    { key: 'sms', label: 'SMS', icon: Bell },
                    { key: 'line', label: 'LINE', icon: Bell },
                  ].map(ch => (
                    <div key={ch.key} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <ch.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{ch.label}</span>
                      </div>
                      <Switch
                        checked={selectedStateData.notifications.includes(ch.key)}
                        onCheckedChange={(checked) => {
                          const notifs = checked
                            ? [...selectedStateData.notifications, ch.key]
                            : selectedStateData.notifications.filter(n => n !== ch.key);
                          updateState(selectedStateData.id, { notifications: notifs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Auto Actions ({selectedStateData.autoActions.length})</Label>
                <div className="space-y-1">
                  {selectedStateData.autoActions.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-xs">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <span className="flex-1">{action}</span>
                      <button onClick={() => {
                        const actions = selectedStateData.autoActions.filter((_, idx) => idx !== i);
                        updateState(selectedStateData.id, { autoActions: actions });
                      }} className="text-red-400 hover:text-red-600">
                        <XCircle className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  const action = prompt('ชื่อ Auto Action:');
                  if (action) {
                    updateState(selectedStateData.id, { autoActions: [...selectedStateData.autoActions, action] });
                  }
                }}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  เพิ่ม Action
                </Button>
              </div>

              <Separator />

              <Button
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50 border-red-200"
                onClick={() => handleRemoveState(selectedStateData.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ลบสถานะนี้
              </Button>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <GitBranch className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">เลือกสถานะเพื่อแก้ไข</p>
              <p className="text-xs text-gray-400 mt-1">หรือเพิ่มสถานะใหม่จากแผงด้านซ้าย</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{workflowName}</DialogTitle>
            <DialogDescription>สรุปขั้นตอนทั้งหมด {states.length} สถานะ</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {states.map((state, index) => {
              const config = stateTypeConfig[state.type];
              const Icon = config.icon;
              return (
                <div key={state.id}>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{state.name}</p>
                      <p className="text-xs text-gray-500">{state.description}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-400">
                        <span>{state.assignee}</span>
                        {state.slaHours > 0 && <span>SLA: {state.slaHours}ชม.</span>}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{config.label}</Badge>
                  </div>
                  {index < states.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
