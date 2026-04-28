import { useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Search, Filter, Calendar, CheckCircle, Clock,
  AlertCircle, XCircle, Edit, Eye, FileText, Download, Send, Award,
  Settings, Plus, Trash2, GripVertical, Save, RotateCcw, Palette,
  CircleDot, Shield, ChevronRight, Info, AlertTriangle, Activity,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

// ===== Status Symbol Configuration System =====
type SignalColor = 'green' | 'yellow' | 'red' | 'gray';

interface StatusRule {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  color: SignalColor;
  icon: string;
  enabled: boolean;
  priority: number;
  autoAction?: string;
}

interface SignalCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rules: StatusRule[];
}

const defaultSignalCategories: SignalCategory[] = [
  {
    id: 'academic',
    name: 'ผลการเรียน (GPA)',
    description: 'สัญลักษณ์สถานะตามเกรดเฉลี่ยสะสม',
    icon: Award,
    rules: [
      { id: 'gpa-green', name: 'ปกติ (เขียว)', description: 'ผลการเรียนอยู่ในเกณฑ์ดี', conditions: ['GPA >= 3.00'], color: 'green', icon: 'circle', enabled: true, priority: 1 },
      { id: 'gpa-yellow', name: 'เฝ้าระวัง (เหลือง)', description: 'ผลการเรียนต่ำกว่าเกณฑ์เล็กน้อย', conditions: ['GPA >= 2.50 และ < 3.00'], color: 'yellow', icon: 'triangle', enabled: true, priority: 2, autoAction: 'แจ้งเตือนเจ้าหน้าที่ทุน' },
      { id: 'gpa-red', name: 'วิกฤต (แดง)', description: 'ผลการเรียนต่ำกว่าเกณฑ์ขั้นต่ำ', conditions: ['GPA < 2.50'], color: 'red', icon: 'alert', enabled: true, priority: 3, autoAction: 'แจ้งเตือนเจ้าหน้าที่ทุน + หัวหน้างาน + พิจารณาระงับทุน' },
    ],
  },
  {
    id: 'report',
    name: 'การส่งรายงาน',
    description: 'สัญลักษณ์สถานะตามกำหนดส่งรายงาน',
    icon: FileText,
    rules: [
      { id: 'report-green', name: 'ส่งตรงเวลา (เขียว)', description: 'ส่งรายงานก่อนหรือตรงกำหนด', conditions: ['ส่งก่อนกำหนด >= 7 วัน'], color: 'green', icon: 'circle', enabled: true, priority: 1 },
      { id: 'report-yellow', name: 'ใกล้กำหนด (เหลือง)', description: 'ใกล้ถึงกำหนดส่งรายงาน', conditions: ['เหลือเวลา < 7 วัน', 'หรือส่งช้า 1-14 วัน'], color: 'yellow', icon: 'triangle', enabled: true, priority: 2, autoAction: 'ส่ง Email เตือนอัตโนมัติ' },
      { id: 'report-red', name: 'เกินกำหนด (แดง)', description: 'เกินกำหนดส่งรายงานเกิน 14 วัน', conditions: ['เกินกำหนด > 14 วัน'], color: 'red', icon: 'alert', enabled: true, priority: 3, autoAction: 'แจ้งเตือน SMS + Email + เข้า Watch List อัตโนมัติ' },
    ],
  },
  {
    id: 'finance',
    name: 'สถานะการเงิน',
    description: 'สัญลักษณ์สถานะการเบิกจ่ายเงินทุน',
    icon: Activity,
    rules: [
      { id: 'fin-green', name: 'ปกติ (เขียว)', description: 'เบิกจ่ายตามแผน ไม่มีค้างจ่าย', conditions: ['ไม่มียอดค้างจ่าย', 'เบิกจ่ายตรงกำหนด'], color: 'green', icon: 'circle', enabled: true, priority: 1 },
      { id: 'fin-yellow', name: 'ค้างจ่าย (เหลือง)', description: 'มียอดค้างจ่ายแต่ไม่เกิน 30 วัน', conditions: ['มียอดค้างจ่าย <= 30 วัน'], color: 'yellow', icon: 'triangle', enabled: true, priority: 2, autoAction: 'แจ้งเตือนฝ่ายการเงิน' },
      { id: 'fin-red', name: 'ค้างจ่ายนาน (แดง)', description: 'มียอดค้างจ่ายเกิน 30 วัน', conditions: ['มียอดค้างจ่าย > 30 วัน'], color: 'red', icon: 'alert', enabled: true, priority: 3, autoAction: 'แจ้งเตือนผู้บริหาร + ระงับการเบิกจ่ายถัดไป' },
    ],
  },
  {
    id: 'watchlist',
    name: 'Watch List / เฝ้าระวัง',
    description: 'สัญลักษณ์สถานะนักเรียนทุนในกลุ่มเฝ้าระวัง',
    icon: Shield,
    rules: [
      { id: 'wl-green', name: 'ปกติ (เขียว)', description: 'ไม่อยู่ในกลุ่มเฝ้าระวัง', conditions: ['ไม่มีรายการเฝ้าระวัง', 'ปฏิบัติตามเงื่อนไขครบ'], color: 'green', icon: 'circle', enabled: true, priority: 1 },
      { id: 'wl-yellow', name: 'เฝ้าระวัง (เหลือง)', description: 'อยู่ในกลุ่มเฝ้าระวังระดับ 1', conditions: ['มีรายการเฝ้าระวัง 1-2 เรื่อง', 'ยังไม่ผิดเงื่อนไขสัญญา'], color: 'yellow', icon: 'triangle', enabled: true, priority: 2, autoAction: 'ติดตามรายเดือน' },
      { id: 'wl-red', name: 'วิกฤต (แดง)', description: 'อยู่ในกลุ่มเฝ้าระวังระดับ 2 (เร่งด่วน)', conditions: ['มีรายการเฝ้าระวัง >= 3 เรื่อง', 'หรือผิดเงื่อนไขสัญญา', 'หรือขาดการติดต่อ > 30 วัน'], color: 'red', icon: 'alert', enabled: true, priority: 3, autoAction: 'เสนอคณะกรรมการพิจารณาระงับทุน' },
    ],
  },
  {
    id: 'contract',
    name: 'สัญญา / ชดใช้ทุน',
    description: 'สัญลักษณ์สถานะการชดใช้ทุนตามสัญญา',
    icon: FileText,
    rules: [
      { id: 'ctr-green', name: 'ปกติ (เขียว)', description: 'ชดใช้ทุนตามกำหนด', conditions: ['ปฏิบัติงานตามสัญญา', 'ไม่มีประเด็นค้างคา'], color: 'green', icon: 'circle', enabled: true, priority: 1 },
      { id: 'ctr-yellow', name: 'ต้องติดตาม (เหลือง)', description: 'มีประเด็นต้องติดตาม', conditions: ['ขอเปลี่ยนหน่วยงาน', 'หรือขอขยายเวลาชดใช้'], color: 'yellow', icon: 'triangle', enabled: true, priority: 2, autoAction: 'แจ้งเตือนเจ้าหน้าที่สัญญา' },
      { id: 'ctr-red', name: 'ผิดสัญญา (แดง)', description: 'ผิดเงื่อนไขสัญญาชดใช้ทุน', conditions: ['ไม่เข้ารายงานตัว', 'หรือลาออกก่อนครบกำหนด', 'หรือเปลี่ยนสัญชาติ'], color: 'red', icon: 'alert', enabled: true, priority: 3, autoAction: 'ดำเนินการทางกฎหมาย + เรียกเงินคืน' },
    ],
  },
];

// ===== Tracking Data =====
const trackingReports = [
  {
    id: 'TRK-2026-001', awardId: 'AWD-2026-001', recipient: 'นายสมชาย ใจดี',
    period: 'ภาคเรียนที่ 1/2026', periodType: 'semester', gpa: 3.85,
    dueDate: '31 มีนาคม 2026', submittedDate: '28 มีนาคม 2026', status: 'approved',
    reviewedBy: 'นางสาวพิมพ์พร เจ้าหน้าที่', reviewedDate: '30 มีนาคม 2026',
    documents: ['Transcript', 'รายงานความก้าวหน้า'],
    notes: 'ผลการเรียนดีมาก มีส่วนร่วมในกิจกรรมวิจัยของคณะ',
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-002', awardId: 'AWD-2026-001', recipient: 'นายสมชาย ใจดี',
    period: 'ภาคเรียนที่ 2/2026', periodType: 'semester', gpa: null,
    dueDate: '30 กันยายน 2026', submittedDate: null, status: 'pending',
    reviewedBy: null, reviewedDate: null, documents: [], notes: null,
    signals: { academic: 'green' as SignalColor, report: 'yellow' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-003', awardId: 'AWD-2026-002', recipient: 'นางสาวสมหญิง รักเรียน',
    period: 'ไตรมาสที่ 1/2026', periodType: 'quarter', gpa: null,
    dueDate: '15 มิถุนายน 2026', submittedDate: '10 มิถุนายน 2026', status: 'submitted',
    reviewedBy: null, reviewedDate: null,
    documents: ['รายงานความก้าวหน้าโครงการ', 'บทความวิจัย'], notes: null,
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'yellow' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-004', awardId: 'AWD-2026-003', recipient: 'นายประยุทธ์ ขยัน',
    period: 'สิ้นสุดการฝึกอบรม', periodType: 'final', gpa: null,
    dueDate: '10 มิถุนายน 2026', submittedDate: null, status: 'overdue',
    reviewedBy: null, reviewedDate: null, documents: [], notes: null,
    signals: { academic: 'gray' as SignalColor, report: 'red' as SignalColor, finance: 'red' as SignalColor, watchlist: 'red' as SignalColor, contract: 'yellow' as SignalColor },
  },
  {
    id: 'TRK-2026-005', awardId: 'AWD-2026-004', recipient: 'นางสาวกนกวรรณ ดี',
    period: 'ภาคเรียนที่ 1/2026', periodType: 'semester', gpa: 3.92,
    dueDate: '25 มีนาคม 2026', submittedDate: '23 มีนาคม 2026', status: 'approved',
    reviewedBy: 'นายวิชัย เจ้าหน้าที่', reviewedDate: '26 มีนาคม 2026',
    documents: ['Transcript', 'รายงานความก้าวหน้า', 'ใบรับรองการลงทะเบียน'],
    notes: 'ผลการเรียนดีเยี่ยม',
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-006', awardId: 'AWD-2026-005', recipient: 'นายวิทยา นักเรียน',
    period: 'ภาคเรียนที่ 2/2025', periodType: 'semester', gpa: 3.67,
    dueDate: '15 ธันวาคม 2025', submittedDate: '12 ธันวาคม 2025', status: 'approved',
    reviewedBy: 'นางสาวพิมพ์พร เจ้าหน้าที่', reviewedDate: '18 ธันวาคม 2025',
    documents: ['Transcript', 'หนังสือรับรองจากอาจารย์ที่ปรึกษา'],
    notes: 'ผลการเรียนดี มีความก้าวหน้าในการทำวิจัย',
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-007', awardId: 'AWD-2026-006', recipient: 'นางสาวอารียา สุขใจ',
    period: 'รายปี 2026', periodType: 'year', gpa: 3.45,
    dueDate: '30 มกราคม 2026', submittedDate: '28 มกราคม 2026', status: 'approved',
    reviewedBy: 'นายวิชัย เจ้าหน้าที่', reviewedDate: '5 กุมภาพันธ์ 2026',
    documents: ['รายงานผลงานประจำปี', 'หลักฐานการนำเสนอผลงาน'],
    notes: 'มีการนำเสนอผลงานในที่ประชุมระดับนานาชาติ',
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-008', awardId: 'AWD-2026-007', recipient: 'นายธนา วิจัยดี',
    period: 'ไตรมาสที่ 2/2026', periodType: 'quarter', gpa: null,
    dueDate: '20 มิถุนายน 2026', submittedDate: '15 มิถุนายน 2026', status: 'submitted',
    reviewedBy: null, reviewedDate: null,
    documents: ['รายงานความก้าวหน้าโครงการ', 'บันทึกการทดลอง'], notes: null,
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-009', awardId: 'AWD-2026-008', recipient: 'นางสาวมานี ขยันเรียน',
    period: 'ภาคเรียนที่ 1/2026', periodType: 'semester', gpa: 2.98,
    dueDate: '30 มีนาคม 2026', submittedDate: '29 มีนาคม 2026', status: 'request-revision',
    reviewedBy: 'นางสาวพิมพ์พร เจ้าหน้าที่', reviewedDate: '5 เมษายน 2026',
    documents: ['Transcript'], notes: 'GPA ต่ำกว่าเกณฑ์ ต้องแนบแผนการปรับปรุง',
    signals: { academic: 'yellow' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'yellow' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-010', awardId: 'AWD-2026-009', recipient: 'นายสมศักดิ์ เก่ง',
    period: 'ภาคเรียนที่ 2/2026', periodType: 'semester', gpa: null,
    dueDate: '15 สิงหาคม 2026', submittedDate: null, status: 'pending',
    reviewedBy: null, reviewedDate: null, documents: [], notes: null,
    signals: { academic: 'green' as SignalColor, report: 'yellow' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-011', awardId: 'AWD-2026-010', recipient: 'นางสาววิภา ใฝ่หา',
    period: 'ภาคเรียนที่ 1/2026', periodType: 'semester', gpa: 3.78,
    dueDate: '25 มีนาคม 2026', submittedDate: '20 มีนาคม 2026', status: 'approved',
    reviewedBy: 'นายวิชัย เจ้าหน้าที่', reviewedDate: '28 มีนาคม 2026',
    documents: ['Transcript', 'รายงานความก้าวหน้า'], notes: 'ผลการเรียนดีมาก',
    signals: { academic: 'green' as SignalColor, report: 'green' as SignalColor, finance: 'green' as SignalColor, watchlist: 'green' as SignalColor, contract: 'green' as SignalColor },
  },
  {
    id: 'TRK-2026-012', awardId: 'AWD-2026-011', recipient: 'นายปรีชา นักวิชา',
    period: 'รายปี 2025', periodType: 'year', gpa: null,
    dueDate: '1 มีนาคม 2026', submittedDate: null, status: 'overdue',
    reviewedBy: null, reviewedDate: null, documents: [], notes: null,
    signals: { academic: 'red' as SignalColor, report: 'red' as SignalColor, finance: 'yellow' as SignalColor, watchlist: 'red' as SignalColor, contract: 'red' as SignalColor },
  },
];

// ===== Signal color helpers =====
const signalColorMap: Record<SignalColor, { bg: string; dot: string; text: string; label: string; ring: string }> = {
  green: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700', label: 'ปกติ', ring: 'ring-green-300' },
  yellow: { bg: 'bg-yellow-100', dot: 'bg-yellow-500', text: 'text-yellow-700', label: 'เฝ้าระวัง', ring: 'ring-yellow-300' },
  red: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700', label: 'วิกฤต', ring: 'ring-red-300' },
  gray: { bg: 'bg-gray-100', dot: 'bg-gray-400', text: 'text-gray-500', label: 'ไม่ระบุ', ring: 'ring-gray-300' },
};

function TrafficLight({ signals }: { signals: Record<string, SignalColor> }) {
  const worstColor = getWorstSignal(signals);
  return (
    <div className="flex items-center gap-1.5">
      {Object.entries(signals).map(([key, color]) => (
        <div
          key={key}
          className={`w-3 h-3 rounded-full ${signalColorMap[color].dot} ring-2 ring-offset-1 ${signalColorMap[color].ring} transition-all`}
          title={`${getCategoryLabel(key)}: ${signalColorMap[color].label}`}
        />
      ))}
    </div>
  );
}

function TrafficLightLarge({ color }: { color: SignalColor }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${signalColorMap[color].bg}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${signalColorMap[color].dot} animate-pulse`} />
      <span className={`text-xs font-medium ${signalColorMap[color].text}`}>{signalColorMap[color].label}</span>
    </div>
  );
}

function getWorstSignal(signals: Record<string, SignalColor>): SignalColor {
  const vals = Object.values(signals);
  if (vals.includes('red')) return 'red';
  if (vals.includes('yellow')) return 'yellow';
  if (vals.includes('green')) return 'green';
  return 'gray';
}

function getCategoryLabel(id: string): string {
  const map: Record<string, string> = {
    academic: 'ผลการเรียน', report: 'การส่งรายงาน', finance: 'การเงิน',
    watchlist: 'เฝ้าระวัง', contract: 'สัญญา',
  };
  return map[id] || id;
}

// ===== Main Component =====
export default function Tracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [signalCategories, setSignalCategories] = useState(defaultSignalCategories);
  const [editingRule, setEditingRule] = useState<StatusRule | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [signalFilter, setSignalFilter] = useState<SignalColor | 'all'>('all');

  const filteredReports = trackingReports.filter((report) => {
    if (activeTab !== 'all' && activeTab !== 'signals' && report.status !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!report.id.toLowerCase().includes(query) && !report.recipient.toLowerCase().includes(query) && !report.awardId.toLowerCase().includes(query)) return false;
    }
    if (periodFilter !== 'all' && report.periodType !== periodFilter) return false;
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (signalFilter !== 'all') {
      const worst = getWorstSignal(report.signals);
      if (worst !== signalFilter) return false;
    }
    return true;
  });

  const tabCounts = {
    all: trackingReports.length,
    pending: trackingReports.filter(r => r.status === 'pending').length,
    submitted: trackingReports.filter(r => r.status === 'submitted').length,
    'request-revision': trackingReports.filter(r => r.status === 'request-revision').length,
    approved: trackingReports.filter(r => r.status === 'approved').length,
    overdue: trackingReports.filter(r => r.status === 'overdue').length,
  };

  // Signal distribution counts
  const signalDistribution = {
    green: trackingReports.filter(r => getWorstSignal(r.signals) === 'green').length,
    yellow: trackingReports.filter(r => getWorstSignal(r.signals) === 'yellow').length,
    red: trackingReports.filter(r => getWorstSignal(r.signals) === 'red').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />อนุมัติแล้ว</Badge>;
      case 'submitted': return <Badge className="bg-blue-100 text-blue-700"><Send className="w-3 h-3 mr-1" />ส่งแล้วรอตรวจ</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />รอส่ง</Badge>;
      case 'request-revision': return <Badge className="bg-orange-100 text-orange-700"><AlertCircle className="w-3 h-3 mr-1" />ขอแก้ไข</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />เกินกำหนด</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getGPABadge = (gpa: number | null) => {
    if (gpa === null) return <span className="text-gray-400">-</span>;
    if (gpa >= 3.5) return <Badge className="bg-green-100 text-green-700">{gpa.toFixed(2)}</Badge>;
    if (gpa >= 3.0) return <Badge className="bg-blue-100 text-blue-700">{gpa.toFixed(2)}</Badge>;
    if (gpa >= 2.5) return <Badge className="bg-yellow-100 text-yellow-700">{gpa.toFixed(2)}</Badge>;
    return <Badge className="bg-red-100 text-red-700">{gpa.toFixed(2)}</Badge>;
  };

  const handleToggleRule = (catId: string, ruleId: string) => {
    setSignalCategories(prev => prev.map(cat =>
      cat.id === catId ? { ...cat, rules: cat.rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r) } : cat
    ));
    toast.success('อัปเดตสถานะเงื่อนไขเรียบร้อย');
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="ติดตามผลการศึกษา"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'ติดตามผลการศึกษา' },
        ]}
      />

      <div className="p-8 space-y-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="ติดตามผล"
          moduleName="tracking"
          defaultExpanded={false}
          permissions={[
            { permission: 'tracking:view', label: 'ดูรายงานติดตามผล', description: 'ดูรายงานทั้งหมดของผู้รับทุน', uiLocation: 'หน้าติดตามผลหลัก' },
            { permission: 'tracking:review', label: 'ตรวจสอบรายงาน', description: 'ตรวจสอบและให้ความเห็นรายงาน', uiLocation: 'ปุ่ม "ตรวจสอบ"' },
            { permission: 'tracking:approve', label: 'อนุมัติรายงาน', description: 'อนุมัติหรือปฏิเสธรายงานติดตาม', uiLocation: 'ปุ่ม "อนุมัติ"' },
            { permission: 'tracking:request_revision', label: 'ขอแก้ไข', description: 'ขอให้ผู้รับทุนแก้ไขรายงาน', uiLocation: 'ปุ่ม "ขอแก้ไข"' },
            { permission: 'tracking:send_reminder', label: 'ส่งแจ้งเตือน', description: 'ส่งแจ้งเตือนผู้รับทุนที่ค้างส่ง', uiLocation: 'ปุ่ม "แจ้งเตือน"' },
            { permission: 'tracking:export', label: 'ส่งออกรายงาน', description: 'ส่งออกข้อมูลสรุปติดตามผล', uiLocation: 'ปุ่ม "Export"' },
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">รอส่งรายงาน</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent mt-1">42</p>
                    <p className="text-xs text-blue-600 mt-1">ภายใน 30 วัน</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-cyan-50 to-cyan-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-700">ส่งแล้วรอตรวจ</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-700 bg-clip-text text-transparent mt-1">18</p>
                    <p className="text-xs text-cyan-600 mt-1">ต้องตรวจภายใน 7 วัน</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">อนุมัติแล้ว</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">156</p>
                    <p className="text-xs text-green-600 mt-1">GPA เฉลี่ย 3.42</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-red-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">เกินกำหนด</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent mt-1">5</p>
                    <p className="text-xs text-red-700 font-medium mt-1">ต้องติดตามด่วน!</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Signal Distribution Summary */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">สรุปสัญลักษณ์สถานะ (Traffic Light)</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                {/* Clickable signal filters */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSignalFilter(signalFilter === 'all' ? 'all' : 'all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${signalFilter === 'all' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    ทั้งหมด <span className="font-bold">{trackingReports.length}</span>
                  </button>
                  {([['green', signalDistribution.green], ['yellow', signalDistribution.yellow], ['red', signalDistribution.red]] as [SignalColor, number][]).map(([color, count]) => (
                    <button
                      key={color}
                      onClick={() => setSignalFilter(signalFilter === color ? 'all' : color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        signalFilter === color
                          ? `${signalColorMap[color].bg} ${signalColorMap[color].text} ring-2 ${signalColorMap[color].ring}`
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${signalColorMap[color].dot}`} />
                      {signalColorMap[color].label}
                      <span className="font-bold">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="w-48 h-3 rounded-full bg-gray-100 overflow-hidden flex">
                  <div className="bg-green-500 h-full transition-all" style={{ width: `${(signalDistribution.green / trackingReports.length) * 100}%` }} />
                  <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(signalDistribution.yellow / trackingReports.length) * 100}%` }} />
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${(signalDistribution.red / trackingReports.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="ค้นหารายงาน / ชื่อผู้รับทุน / รหัสทุน" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="รอบรายงาน" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกรอบ</SelectItem>
                  <SelectItem value="semester">รายภาค</SelectItem>
                  <SelectItem value="year">รายปี</SelectItem>
                  <SelectItem value="quarter">รายไตรมาส</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="pending">รอส่ง</SelectItem>
                  <SelectItem value="submitted">ส่งแล้วรอตรวจ</SelectItem>
                  <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="overdue">เกินกำหนด</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v !== 'all') setSignalFilter('all'); }} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              <FileText className="w-4 h-4" /> ทั้งหมด
              <Badge variant="secondary" className="ml-2">{tabCounts.all}</Badge>
            </TabsTrigger>
            <ProtectedTabsTrigger value="pending" permission="tracking:view">
              <Clock className="w-4 h-4" /> รอส่ง
              <Badge variant="secondary" className="ml-2">{tabCounts.pending}</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="submitted" permission="tracking:review">
              <Send className="w-4 h-4" /> ส่งแล้วรอตรวจ
              <Badge variant="secondary" className="ml-2">{tabCounts.submitted}</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="request-revision" permission="tracking:request_revision">
              <Edit className="w-4 h-4" /> ขอแก้ไข
              <Badge variant="secondary" className="ml-2">{tabCounts['request-revision']}</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="approved" permission="tracking:approve">
              <CheckCircle className="w-4 h-4" /> อนุมัติแล้ว
              <Badge variant="secondary" className="ml-2">{tabCounts.approved}</Badge>
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="overdue" permission="tracking:view">
              <AlertCircle className="w-4 h-4 text-red-500" /> เกินกำหนด
              <Badge variant="destructive" className="ml-2">{tabCounts.overdue}</Badge>
            </ProtectedTabsTrigger>
            <TabsTrigger value="signals">
              <Palette className="w-4 h-4" /> จัดการสัญลักษณ์สถานะ
            </TabsTrigger>
          </TabsList>

          {/* ===== Main Tracking Table (all tabs except signals) ===== */}
          {['all', 'pending', 'submitted', 'request-revision', 'approved', 'overdue'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสรายงาน</TableHead>
                        <TableHead>ผู้รับทุน</TableHead>
                        <TableHead>รอบรายงาน</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>สัญลักษณ์สถานะ</TableHead>
                        <TableHead>วันครบกำหนด</TableHead>
                        <TableHead>วันที่ส่ง</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report, index) => {
                        const worst = getWorstSignal(report.signals);
                        return (
                          <motion.tr
                            key={report.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`hover:bg-blue-50/50 ${worst === 'red' ? 'bg-red-50/30' : worst === 'yellow' ? 'bg-yellow-50/20' : ''}`}
                          >
                            <TableCell><span className="font-mono text-sm">{report.id}</span></TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {/* Overall traffic light dot */}
                                <div className={`w-3 h-3 rounded-full ${signalColorMap[worst].dot} ring-2 ring-offset-1 ${signalColorMap[worst].ring} shrink-0`} />
                                <div>
                                  <p className="font-medium">{report.recipient}</p>
                                  <p className="text-xs text-gray-500">{report.awardId}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{report.period}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getGPABadge(report.gpa)}</TableCell>
                            <TableCell>
                              <TrafficLight signals={report.signals} />
                            </TableCell>
                            <TableCell><span className="text-sm text-gray-600">{report.dueDate}</span></TableCell>
                            <TableCell>
                              {report.submittedDate ? (
                                <span className="text-sm text-gray-600">{report.submittedDate}</span>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {report.status === 'submitted' && (
                                  <Dialog open={reviewDialogOpen && selectedReport?.id === report.id} onOpenChange={(open) => { setReviewDialogOpen(open); if (open) setSelectedReport(report); }}>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />ตรวจ</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden max-h-[90vh]">
                                      {/* Review Dialog Header */}
                                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Eye className="w-5 h-5" /></div>
                                          <div>
                                            <DialogTitle className="text-white text-lg">ตรวจรายงานการศึกษา</DialogTitle>
                                            <DialogDescription className="text-blue-100 mt-0.5">ตรวจสอบและอนุมัติรายงานความก้าวหน้าของผู้รับทุน</DialogDescription>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                        {/* Signal Status */}
                                        <div className="p-4 bg-gray-50 rounded-xl border">
                                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">สัญลักษณ์สถานะปัจจุบัน</p>
                                          <div className="flex gap-3">
                                            {Object.entries(report.signals).map(([key, color]) => (
                                              <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${signalColorMap[color].bg}`}>
                                                <div className={`w-3 h-3 rounded-full ${signalColorMap[color].dot}`} />
                                                <div>
                                                  <p className="text-[10px] text-gray-500">{getCategoryLabel(key)}</p>
                                                  <p className={`text-xs font-medium ${signalColorMap[color].text}`}>{signalColorMap[color].label}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        {/* Summary */}
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="p-4 bg-slate-50 rounded-lg border">
                                            <Label className="text-gray-500 text-xs uppercase tracking-wide">ผู้รับทุน</Label>
                                            <p className="font-medium mt-1">{report.recipient}</p>
                                          </div>
                                          <div className="p-4 bg-slate-50 rounded-lg border">
                                            <Label className="text-gray-500 text-xs uppercase tracking-wide">รอบรายงาน</Label>
                                            <p className="font-medium mt-1">{report.period}</p>
                                          </div>
                                          <div className="p-4 bg-slate-50 rounded-lg border">
                                            <Label className="text-gray-500 text-xs uppercase tracking-wide">วันที่ส่ง</Label>
                                            <p className="font-medium mt-1">{report.submittedDate}</p>
                                          </div>
                                          <div className="p-4 bg-slate-50 rounded-lg border">
                                            <Label className="text-gray-500 text-xs uppercase tracking-wide">วันครบกำหนด</Label>
                                            <p className="font-medium mt-1">{report.dueDate}</p>
                                          </div>
                                        </div>
                                        {/* Documents */}
                                        <div className="space-y-2">
                                          <Label>เอกสารประกอบ</Label>
                                          <div className="space-y-2">
                                            {report.documents.map((doc: string, idx: number) => (
                                              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="w-4 h-4 text-blue-600" />
                                                  <span className="text-sm">{doc}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4 mr-1" />ดู</Button>
                                                  <Button size="sm" variant="ghost"><Download className="w-4 h-4 mr-1" />ดาวน์โหลด</Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>GPA (ถ้ามี)</Label>
                                          <Input type="number" step="0.01" min="0" max="4" placeholder="เช่น 3.85" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>ความเห็นของเจ้าหน้าที่</Label>
                                          <Textarea placeholder="ระบุความเห็น / ข้อสังเกต / คำแนะนำ..." className="min-h-32" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>ตัดสิน</Label>
                                          <Select>
                                            <SelectTrigger><SelectValue placeholder="เลือกการตัดสิน" /></SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="approve">อนุมัติ - ปลดล็อกการจ่ายเงินงวดถัดไป</SelectItem>
                                              <SelectItem value="approve-no-payment">อนุมัติ - แต่ไม่ปลดล็อกการจ่าย</SelectItem>
                                              <SelectItem value="request-more">ขอข้อมูล/เอกสารเพิ่มเติม</SelectItem>
                                              <SelectItem value="reject">ไม่อนุมัติ - พิจารณาระงับทุน</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                              <p className="font-medium text-blue-900">ผลกระทบต่อการจ่ายเงิน</p>
                                              <p className="text-sm text-blue-700 mt-1">หากอนุมัติ ระบบจะปลดล็อกการจ่ายเงินงวดที่ 2 จำนวน 625,000 บาท</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>ยกเลิก</Button>
                                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setReviewDialogOpen(false); toast.success('บันทึกผลการตรวจรายงานเรียบร้อย', { description: 'ผลการตรวจถูกบันทึกและปลดล็อกการจ่ายเงินงวดถัดไป' }); }}>
                                          <CheckCircle className="w-4 h-4 mr-2" />ยืนยันการตรวจ
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                                {report.status === 'approved' && (
                                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4 mr-1" />ดู</Button>
                                )}
                                {report.status === 'overdue' && (
                                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => toast.warning(`ส่งแจ้งเตือนถึง ${report.recipient}`, { description: 'แจ้งเตือนผ่านอีเมลและ SMS' })}>
                                    <Send className="w-4 h-4 mr-1" />แจ้งเตือน
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {/* ===== TAB: Signal Management ===== */}
          <TabsContent value="signals">
            <div className="space-y-6">
              {/* Header Info */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Palette className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">ระบบจัดการสัญลักษณ์สถานะ (Traffic Light System)</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        กำหนดเงื่อนไขสัญลักษณ์สี <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> เขียว</span>,{' '}
                        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> เหลือง</span>,{' '}
                        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> แดง</span>{' '}
                        ตามสถานะที่กำหนดได้ แต่ละหมวดสามารถตั้งเงื่อนไขและ Auto-Action ได้อิสระ
                      </p>
                    </div>
                    <Button variant="outline" className="shrink-0" onClick={() => { setSignalCategories(defaultSignalCategories); toast.success('รีเซ็ตค่าเริ่มต้นเรียบร้อย'); }}>
                      <RotateCcw className="w-4 h-4 mr-1" /> รีเซ็ตค่าเริ่มต้น
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Signal Legend */}
              <div className="grid grid-cols-3 gap-4">
                {(['green', 'yellow', 'red'] as SignalColor[]).map(color => (
                  <Card key={color} className={`border-l-4`} style={{ borderLeftColor: color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#ef4444' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${signalColorMap[color].bg} flex items-center justify-center`}>
                          <div className={`w-5 h-5 rounded-full ${signalColorMap[color].dot}`} />
                        </div>
                        <div>
                          <p className={`font-semibold ${signalColorMap[color].text}`}>
                            {color === 'green' ? 'เขียว - ปกติ' : color === 'yellow' ? 'เหลือง - เฝ้าระวัง' : 'แดง - วิกฤต'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {color === 'green' ? 'ดำเนินการตามปกติ ไม่มีประเด็น' : color === 'yellow' ? 'ต้องติดตามใกล้ชิด แจ้งเตือนเจ้าหน้าที่' : 'ต้องดำเนินการเร่งด่วน เสนอผู้บริหาร'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Category Rules */}
              {signalCategories.map((cat, catIndex) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.08 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                            <cat.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-base">{cat.name}</span>
                            <p className="text-xs text-gray-400 font-normal mt-0.5">{cat.description}</p>
                          </div>
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {/* Preview dots */}
                          <div className="flex items-center gap-1 mr-2">
                            {cat.rules.map(r => (
                              <div key={r.id} className={`w-4 h-4 rounded-full ${signalColorMap[r.color].dot} ${!r.enabled ? 'opacity-30' : ''}`} />
                            ))}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => toast.info(`เพิ่มเงื่อนไขใหม่ใน "${cat.name}"`)}>
                            <Plus className="w-3 h-3 mr-1" /> เพิ่มเงื่อนไข
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {cat.rules.map((rule) => (
                          <div key={rule.id} className={`p-5 hover:bg-gray-50/50 transition-colors ${!rule.enabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-4">
                              {/* Color indicator */}
                              <div className="flex flex-col items-center gap-1 pt-1">
                                <div className={`w-6 h-6 rounded-full ${signalColorMap[rule.color].dot} ring-4 ring-offset-2 ${signalColorMap[rule.color].ring}`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm text-gray-800">{rule.name}</h4>
                                  <Badge className={`text-[10px] border ${signalColorMap[rule.color].bg} ${signalColorMap[rule.color].text}`}>
                                    {signalColorMap[rule.color].label}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px]">ลำดับ {rule.priority}</Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{rule.description}</p>

                                {/* Conditions */}
                                <div className="space-y-1.5 mb-3">
                                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">เงื่อนไข:</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {rule.conditions.map((cond, i) => (
                                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-700 border border-gray-200">
                                        {cond}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Auto Action */}
                                {rule.autoAction && (
                                  <div className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                                    rule.color === 'red' ? 'bg-red-50 border-red-100' :
                                    rule.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' :
                                    'bg-green-50 border-green-100'
                                  }`}>
                                    <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${signalColorMap[rule.color].text}`} />
                                    <div>
                                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Auto-Action:</p>
                                      <p className={`text-xs ${signalColorMap[rule.color].text} font-medium`}>{rule.autoAction}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-gray-500">เปิด/ปิด</Label>
                                  <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(cat.id, rule.id)} />
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setEditingRule(rule);
                                  setEditDialogOpen(true);
                                }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Save Button */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <p className="text-sm text-gray-500">การเปลี่ยนแปลงจะมีผลกับนักเรียนทุนทั้งระบบ</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.info('ยกเลิกการเปลี่ยนแปลง')}>ยกเลิก</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.success('บันทึกการตั้งค่าสัญลักษณ์สถานะเรียบร้อย')}>
                    <Save className="w-4 h-4 mr-1" /> บันทึกการตั้งค่า
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Rule Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          {editingRule && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${signalColorMap[editingRule.color].bg} flex items-center justify-center`}>
                    <div className={`w-5 h-5 rounded-full ${signalColorMap[editingRule.color].dot}`} />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-lg">แก้ไขเงื่อนไขสัญลักษณ์</DialogTitle>
                    <DialogDescription className="text-blue-100 mt-0.5">{editingRule.name}</DialogDescription>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">ชื่อเงื่อนไข</Label>
                    <Input defaultValue={editingRule.name} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">สี</Label>
                    <Select defaultValue={editingRule.color}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> เขียว (ปกติ)</div></SelectItem>
                        <SelectItem value="yellow"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> เหลือง (เฝ้าระวัง)</div></SelectItem>
                        <SelectItem value="red"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> แดง (วิกฤต)</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">คำอธิบาย</Label>
                  <Input defaultValue={editingRule.description} />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">เงื่อนไข</Label>
                  <div className="space-y-2">
                    {editingRule.conditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input defaultValue={cond} className="flex-1" />
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input placeholder="เพิ่มเงื่อนไขใหม่..." value={newCondition} onChange={e => setNewCondition(e.target.value)} className="flex-1" />
                      <Button variant="outline" size="sm" onClick={() => { if (newCondition.trim()) { toast.success('เพิ่มเงื่อนไขใหม่เรียบร้อย'); setNewCondition(''); } }}>
                        <Plus className="w-4 h-4 mr-1" /> เพิ่ม
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">Auto-Action (ดำเนินการอัตโนมัติ)</Label>
                  <Textarea defaultValue={editingRule.autoAction || ''} placeholder="ระบุการกระทำอัตโนมัติเมื่อเข้าเงื่อนไข เช่น ส่ง Email แจ้งเตือน, เข้า Watch List" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">ลำดับความสำคัญ</Label>
                    <Input type="number" defaultValue={editingRule.priority} min={1} max={10} />
                  </div>
                  <div className="flex items-end gap-3 pb-1">
                    <Label className="text-gray-600">เปิดใช้งาน</Label>
                    <Switch defaultChecked={editingRule.enabled} />
                  </div>
                </div>
              </div>
              <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>ยกเลิก</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditDialogOpen(false); toast.success('บันทึกเงื่อนไขเรียบร้อย'); }}>
                  <Save className="w-4 h-4 mr-1" /> บันทึก
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
