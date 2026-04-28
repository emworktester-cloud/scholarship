import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, BellRing, BellOff, Mail, Smartphone, Globe, Plus, Edit, Trash2,
  CheckCircle, XCircle, AlertCircle, Clock, Search, Eye, Send, Copy,
  Settings, Filter, Download, RefreshCw, MoreHorizontal, ChevronRight,
  ChevronDown, Play, Pause, Zap, Calendar, Timer, Users, UserCheck,
  Hash, ArrowRight, Info, AlertTriangle, FileText, Megaphone, Pin,
  PinOff, Image, Tag, ExternalLink, Archive, Star, CircleDot, Save,
  TestTube, Volume2, Layers, Shield, Award, DollarSign, TrendingUp,
  Plane, ClipboardCheck, BookOpen, MessageSquare,
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
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

// ===== Types =====
interface NotificationRule {
  id: string;
  name: string;
  description: string;
  eventType: string;
  eventCategory: string;
  eventIcon: React.ElementType;
  eventColor: string;
  channels: { web: boolean; mobile: boolean; email: boolean };
  timing: 'immediate' | 'advance';
  advanceDays?: number;
  advanceHours?: number;
  recipients: string[];
  recipientType: 'role' | 'group' | 'specific' | 'all';
  enabled: boolean;
  lastTriggered: string;
  triggerCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  template: string;
}

interface NotificationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  channel: 'web' | 'mobile' | 'email';
  recipient: string;
  title: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor: string;
  image: string;
  author: string;
  publishDate: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  pinned: boolean;
  targetAudience: string[];
  viewCount: number;
  tags: string[];
}

// ===== Mock Data: Notification Rules =====
const notificationRules: NotificationRule[] = [
  {
    id: 'NR-001', name: 'คำขอใหม่เข้าระบบ', description: 'แจ้งเตือนเมื่อมีใบสมัครหรือคำขอใหม่ถูกส่งเข้าระบบ',
    eventType: 'คำขอ/ใบสมัครใหม่', eventCategory: 'คำขอ', eventIcon: FileText, eventColor: 'text-blue-600',
    channels: { web: true, mobile: true, email: true }, timing: 'immediate',
    recipients: ['เจ้าหน้าที่ทุน', 'ผู้จัดการส่วน'], recipientType: 'role', enabled: true,
    lastTriggered: '24 ก.พ. 2569 14:30', triggerCount: 342, priority: 'high',
    template: 'มีคำขอใหม่ {{request_code}} จาก {{applicant_name}} รอดำเนินการ',
  },
  {
    id: 'NR-002', name: 'ครบกำหนดรับทุน', description: 'แจ้งเตือนล่วงหน้าเมื่อใกล้ครบกำหนดวันรับทุนหรือต่อสัญญา',
    eventType: 'ครบกำหนดรับทุน/ต่อสัญญา', eventCategory: 'ทุน/สัญญา', eventIcon: Award, eventColor: 'text-amber-600',
    channels: { web: true, mobile: true, email: true }, timing: 'advance', advanceDays: 30,
    recipients: ['นักเรียนทุน', 'เจ้าหน้าที่ทุน'], recipientType: 'role', enabled: true,
    lastTriggered: '20 ก.พ. 2569 08:00', triggerCount: 156, priority: 'high',
    template: 'ทุน {{scholarship_code}} ของ {{scholar_name}} จะครบกำหนดในอีก {{days_remaining}} วัน',
  },
  {
    id: 'NR-003', name: 'รายงานเดินทางไปศึกษา', description: 'แจ้งเตือนเมื่อนักเรียนทุนส่งรายงานการเดินทางไปศึกษาต่อต่างประเทศ',
    eventType: 'ส่งรายงานเดินทางไปศึกษา', eventCategory: 'รายงาน', eventIcon: Plane, eventColor: 'text-cyan-600',
    channels: { web: true, mobile: false, email: true }, timing: 'immediate',
    recipients: ['เจ้าหน้าที่ทุน', 'ผู้จัดการส่วน'], recipientType: 'role', enabled: true,
    lastTriggered: '18 ก.พ. 2569 10:15', triggerCount: 89, priority: 'medium',
    template: '{{scholar_name}} ส่งรายงานเดินทางไปศึกษา ณ {{destination_country}} เรียบร้อยแล้ว',
  },
  {
    id: 'NR-004', name: 'รายงานเดินทางกลับประเทศไทย', description: 'แจ้งเตือนเมื่อนักเรียนทุนส่งรายงานเดินทางกลับประเทศไทย',
    eventType: 'ส่งรายงานกลับประเทศไทย', eventCategory: 'รายงาน', eventIcon: Plane, eventColor: 'text-emerald-600',
    channels: { web: true, mobile: true, email: true }, timing: 'immediate',
    recipients: ['เจ้าหน้าที่ทุน', 'ผู้จัดการส่วน', 'ผู้บริหาร'], recipientType: 'role', enabled: true,
    lastTriggered: '15 ก.พ. 2569 14:00', triggerCount: 45, priority: 'medium',
    template: '{{scholar_name}} ส่งรายงานเดินทางกลับประเทศไทย วันที่ {{return_date}}',
  },
  {
    id: 'NR-005', name: 'ใกล้ครบกำหนดส่งรายงานผลการเรียน', description: 'แจ้งเตือนนักเรียนทุนล่วงหน้า 14 วัน ก่อนครบกำหนดส่งรายงานผลการเรียนประจำภาค',
    eventType: 'ครบกำหนดส่งรายงานผลการเรียน', eventCategory: 'ติดตามผล', eventIcon: TrendingUp, eventColor: 'text-purple-600',
    channels: { web: true, mobile: true, email: true }, timing: 'advance', advanceDays: 14,
    recipients: ['นักเรียนทุน'], recipientType: 'role', enabled: true,
    lastTriggered: '10 ก.พ. 2569 08:00', triggerCount: 210, priority: 'high',
    template: 'กรุณาส่งรายงานผลการเรียนประจำภาค {{semester}} ภายในวันที่ {{deadline}}',
  },
  {
    id: 'NR-006', name: 'การอนุมัติ/ปฏิเสธคำขอ', description: 'แจ้งเตือนเมื่อคำขอได้รับการอนุมัติหรือถูกปฏิเสธ',
    eventType: 'ผลการอนุมัติ', eventCategory: 'อนุมัติ', eventIcon: ClipboardCheck, eventColor: 'text-green-600',
    channels: { web: true, mobile: true, email: true }, timing: 'immediate',
    recipients: ['ผู้ยื่นคำขอ', 'เจ้าหน้าที่ที่รับผิดชอบ'], recipientType: 'specific', enabled: true,
    lastTriggered: '24 ก.พ. 2569 11:00', triggerCount: 567, priority: 'high',
    template: 'คำขอ {{request_code}} ได้รับ{{result}} โดย {{approver_name}}',
  },
  {
    id: 'NR-007', name: 'ใกล้ครบกำหนดเบิกจ่าย', description: 'แจ้งเตือนล่วงหน้า 7 วัน ก่อนครบรอบการเบิกจ่ายประจำเดือน',
    eventType: 'ครบกำหนดเบิกจ่าย', eventCategory: 'การเงิน', eventIcon: DollarSign, eventColor: 'text-green-600',
    channels: { web: true, mobile: false, email: true }, timing: 'advance', advanceDays: 7,
    recipients: ['เจ้าหน้าที่การเงิน', 'เจ้าหน้าที่ทุน'], recipientType: 'role', enabled: true,
    lastTriggered: '18 ก.พ. 2569 08:00', triggerCount: 120, priority: 'medium',
    template: 'ครบรอบเบิกจ่ายประจำเดือน {{month}} สำหรับนักเรียนทุน {{count}} ราย',
  },
  {
    id: 'NR-008', name: 'Traffic Light แดง', description: 'แจ้งเตือนทันทีเมื่อนักเรียนทุนเข้าสถานะ Traffic Light สีแดง (เฝ้าระวัง)',
    eventType: 'Traffic Light เปลี่ยนเป็นแดง', eventCategory: 'ติดตามผล', eventIcon: AlertTriangle, eventColor: 'text-red-600',
    channels: { web: true, mobile: true, email: true }, timing: 'immediate',
    recipients: ['เจ้าหน้าที่ทุน', 'ผู้จัดการส่วน', 'ผู้บริหาร'], recipientType: 'role', enabled: true,
    lastTriggered: '22 ก.พ. 2569 09:30', triggerCount: 28, priority: 'critical',
    template: '{{scholar_name}} เปลี่ยนเป็น Traffic Light สีแดง - หมวด: {{category}} เหตุ: {{reason}}',
  },
  {
    id: 'NR-009', name: 'ข่าวประชาสัมพันธ์ใหม่', description: 'แจ้งเตือนเมื่อมีข่าวประชาสัมพันธ์ใหม่จาก สำนักงาน ก.พ.',
    eventType: 'ข่าวประชาสัมพันธ์ใหม่', eventCategory: 'ประชาสัมพันธ์', eventIcon: Megaphone, eventColor: 'text-indigo-600',
    channels: { web: true, mobile: true, email: false }, timing: 'immediate',
    recipients: ['นักเรียนทุนทุกคน'], recipientType: 'all', enabled: true,
    lastTriggered: '23 ก.พ. 2569 10:00', triggerCount: 35, priority: 'low',
    template: 'ข่าวใหม่จาก สำนักงาน ก.พ.: {{announcement_title}}',
  },
  {
    id: 'NR-010', name: 'เอกสารใกล้หมดอายุ', description: 'แจ้งเตือนล่วงหน้า 60 วัน เมื่อเอกสารสำคัญ (Visa, หนังสือเดินทาง) ใกล้หมดอายุ',
    eventType: 'เอกสารใกล้หมดอายุ', eventCategory: 'เอกสาร', eventIcon: FileText, eventColor: 'text-orange-600',
    channels: { web: true, mobile: true, email: true }, timing: 'advance', advanceDays: 60,
    recipients: ['นักเรียนทุน', 'เจ้าหน้าที่ทุน'], recipientType: 'role', enabled: false,
    lastTriggered: '-', triggerCount: 0, priority: 'medium',
    template: 'เอกสาร {{document_type}} ของ {{scholar_name}} จะหมดอายุวันที่ {{expire_date}}',
  },
];

// ===== Mock Data: Notification Logs =====
const notificationLogs: NotificationLog[] = [
  { id: 'NL-001', ruleId: 'NR-001', ruleName: 'คำขอใหม่เข้าระบบ', channel: 'web', recipient: 'นางสาวพิมพ์พร เจ้าหน้าที่', title: 'คำขอใหม่ APP-2569-0085', message: 'มีคำขอใหม่ APP-2569-0085 จาก นายสมชาย ใจดี รอดำเนินการ', sentAt: '24 ก.พ. 2569 14:30', status: 'read', priority: 'high' },
  { id: 'NL-002', ruleId: 'NR-001', ruleName: 'คำขอใหม่เข้าระบบ', channel: 'email', recipient: 'pimporn@scholarship.go.th', title: 'คำขอใหม่ APP-2569-0085', message: 'มีคำขอใหม่ APP-2569-0085 จาก นายสมชาย ใจดี รอดำเนินการ', sentAt: '24 ก.พ. 2569 14:30', status: 'delivered', priority: 'high' },
  { id: 'NL-003', ruleId: 'NR-001', ruleName: 'คำขอใหม่เข้าระบบ', channel: 'mobile', recipient: 'นางสาวพิมพ์พร เจ้าหน้าที่', title: 'คำขอใหม่ APP-2569-0085', message: 'มีคำขอใหม่รอดำเนินการ', sentAt: '24 ก.พ. 2569 14:30', status: 'delivered', priority: 'high' },
  { id: 'NL-004', ruleId: 'NR-006', ruleName: 'การอนุมัติ/ปฏิเสธ', channel: 'web', recipient: 'นายสมศักดิ์ ผู้จัดการ', title: 'อนุมัติคำขอ APP-2569-0080', message: 'คำขอ APP-2569-0080 ได้รับการอนุมัติโดย ผู้บริหาร', sentAt: '24 ก.พ. 2569 11:00', status: 'read', priority: 'high' },
  { id: 'NL-005', ruleId: 'NR-008', ruleName: 'Traffic Light แดง', channel: 'web', recipient: 'นายสมศักดิ์ ผู้จัดการ', title: 'Traffic Light แดง: น.ส.วิไล สมหวัง', message: 'น.ส.วิไล สมหวัง เปลี่ยนเป็น Traffic Light สีแดง - หมวด: ผลการเรียน', sentAt: '22 ก.พ. 2569 09:30', status: 'read', priority: 'critical' },
  { id: 'NL-006', ruleId: 'NR-008', ruleName: 'Traffic Light แดง', channel: 'email', recipient: 'somsak@scholarship.go.th', title: 'Traffic Light แดง: น.ส.วิไล สมหวัง', message: 'น.ส.วิไล สมหวัง เปลี่ยนเป็น Traffic Light สีแดง', sentAt: '22 ก.พ. 2569 09:30', status: 'delivered', priority: 'critical' },
  { id: 'NL-007', ruleId: 'NR-002', ruleName: 'ครบกำหนดรับทุน', channel: 'email', recipient: 'scholar001@mail.com', title: 'ทุนใกล้ครบกำหนด', message: 'ทุน SCH-2567-012 ของคุณจะครบกำหนดในอีก 30 วัน', sentAt: '20 ก.พ. 2569 08:00', status: 'delivered', priority: 'high' },
  { id: 'NL-008', ruleId: 'NR-005', ruleName: 'ครบกำหนดส่งรายงาน', channel: 'mobile', recipient: 'นายวิชัย นักเรียนทุน', title: 'ใกล้ครบกำหนดส่งรายงาน', message: 'กรุณาส่งรายงานผลการเรียนภายใน 14 วัน', sentAt: '10 ก.พ. 2569 08:00', status: 'sent', priority: 'high' },
  { id: 'NL-009', ruleId: 'NR-003', ruleName: 'รายงานเดินทางไปศึกษา', channel: 'web', recipient: 'นางสาวกนกวรรณ นักวิเคราะห์', title: 'รายงานเดินทาง: น.ส.พรพิมล', message: 'น.ส.พรพิมล ส่งรายงานเดินทางไปศึกษา ณ สหราชอาณาจักร', sentAt: '18 ก.พ. 2569 10:15', status: 'read', priority: 'medium' },
  { id: 'NL-010', ruleId: 'NR-007', ruleName: 'ครบกำหนดเบิกจ่าย', channel: 'email', recipient: 'rattana@scholarship.go.th', title: 'ครบรอบเบิกจ่าย มี.ค. 2569', message: 'ครบรอบเบิกจ่ายประจำเดือน มี.ค. 2569 สำหรับนักเรียนทุน 45 ราย', sentAt: '18 ก.พ. 2569 08:00', status: 'delivered', priority: 'medium' },
];

// ===== Mock Data: Announcements =====
const announcements: Announcement[] = [
  {
    id: 'ANN-001', title: 'ประกาศรับสมัครทุนรัฐบาลประจำปี 2569', excerpt: 'สำนักงาน ก.พ. เปิดรับสมัครทุนรัฐบาลเพื่อศึกษาต่อระดับปริญญาโท-เอก ในต่างประเทศ ประจำปี 2569',
    content: 'รายละเอียดทุนและคุณสมบัติผู้สมัคร...', category: 'ทุนการศึกษา', categoryColor: 'text-blue-600',
    image: 'https://images.unsplash.com/photo-1686030323326-63991462052e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwc2Nob2xhcnNoaXAlMjBlZHVjYXRpb24lMjBhbm5vdW5jZW1lbnR8ZW58MXx8fHwxNzcxOTkzODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    author: 'สำนักงาน ก.พ.', publishDate: '20 ก.พ. 2569', status: 'published', pinned: true,
    targetAudience: ['นักเรียนทุนทุกคน', 'ผู้สนใจทั่วไป'], viewCount: 1250, tags: ['ทุนรัฐบาล', 'ปี2569', 'ต่างประเทศ'],
  },
  {
    id: 'ANN-002', title: 'กำหนดการปฐมนิเทศนักเรียนทุนรุ่นใหม่ ประจำปี 2569', excerpt: 'ขอเรียนเชิญนักเรียนทุนรุ่นใหม่ทุกท่านเข้าร่วมปฐมนิเทศ วันที่ 15 มี.ค. 2569 ณ สำนักงาน ก.พ.',
    content: 'กำหนดการและรายละเอียด...', category: 'กิจกรรม', categoryColor: 'text-green-600',
    image: 'https://images.unsplash.com/photo-1760420940953-3958ad9f6287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwc2VtaW5hciUyMHdvcmtzaG9wJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTk5MzgyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    author: 'ฝ่ายพัฒนาทรัพยากรบุคคล', publishDate: '18 ก.พ. 2569', status: 'published', pinned: true,
    targetAudience: ['นักเรียนทุนรุ่น 2569'], viewCount: 890, tags: ['ปฐมนิเทศ', 'รุ่นใหม่'],
  },
  {
    id: 'ANN-003', title: 'แจ้งเปลี่ยนแปลงระเบียบการเบิกจ่ายค่าใช้จ่ายประจำเดือน', excerpt: 'มีการปรับปรุงระเบียบการเบิกจ่ายค่าครองชีพและค่าเล่าเรียน มีผลตั้งแต่ 1 เม.ย. 2569 เป็นต้นไป',
    content: 'รายละเอียดการเปลี่ยนแปลง...', category: 'ระเบียบ/ข้อบังคับ', categoryColor: 'text-amber-600',
    image: '',
    author: 'ฝ่ายการเงิน', publishDate: '15 ก.พ. 2569', status: 'published', pinned: false,
    targetAudience: ['นักเรียนทุนทุกคน'], viewCount: 650, tags: ['ระเบียบ', 'เบิกจ่าย', 'ค่าใช้จ่าย'],
  },
  {
    id: 'ANN-004', title: 'ผลงานนักเรียนทุนดีเด่น ประจำปี 2568', excerpt: 'ขอแสดงความยินดีกับนักเรียนทุนดีเด่นที่ได้รับรางวัลจากงาน International Research Awards 2568',
    content: 'รายชื่อและผลงาน...', category: 'ข่าวสาร', categoryColor: 'text-purple-600',
    image: 'https://images.unsplash.com/photo-1660485345088-c398363c1f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzE5MzkxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    author: 'สำนักงาน ก.พ.', publishDate: '10 ก.พ. 2569', status: 'published', pinned: false,
    targetAudience: ['นักเรียนทุนทุกคน', 'ผู้สนใจทั่วไป'], viewCount: 1520, tags: ['ผลงาน', 'รางวัล', 'นักเรียนทุนดีเด่น'],
  },
  {
    id: 'ANN-005', title: 'แนวทางการส่งรายงานผลการเรียนภาคเรียนที่ 2/2568', excerpt: 'ขอให้นักเรียนทุนทุกท่านส่งรายงานผลการเรียนภายในกำหนด พร้อมแนบเอกสารตามรายการ',
    content: 'เอกสารที่ต้องแนบ...', category: 'คู่มือ/แนวทาง', categoryColor: 'text-teal-600',
    image: 'https://images.unsplash.com/photo-1767567469222-530e72995026?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGFicm9hZCUyMHVuaXZlcnNpdHklMjBjYW1wdXN8ZW58MXx8fHwxNzcxOTkzODE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    author: 'กองทุนการศึกษา', publishDate: '5 ก.พ. 2569', status: 'published', pinned: false,
    targetAudience: ['นักเรียนทุนทุกคน'], viewCount: 980, tags: ['รายงานผลการเรียน', 'แนวทาง'],
  },
  {
    id: 'ANN-006', title: 'งานสัมมนา "นักเรียนทุนกับการขับเคลื่อนประเทศ" ครั้งที่ 5', excerpt: 'เตรียมพบกับงานสัมมนาประจำปี มี.ค. 2569 (กำลังจัดเตรียม)',
    content: 'กำลังจัดเตรียม...', category: 'กิจกรรม', categoryColor: 'text-green-600',
    image: '',
    author: 'ฝ่ายพัฒนาทรัพยากรบุคคล', publishDate: '1 มี.ค. 2569', status: 'scheduled', pinned: false,
    targetAudience: ['นักเรียนทุนทุกคน', 'ศิษย์เก่าทุนรัฐบาล'], viewCount: 0, tags: ['สัมมนา'],
  },
  {
    id: 'ANN-007', title: '(ร่าง) ประกาศปรับหลักเกณฑ์การขยายเวลาการศึกษา', excerpt: 'ร่างระเบียบใหม่เกี่ยวกับการขอขยายเวลาศึกษา',
    content: 'ร่าง...', category: 'ระเบียบ/ข้อบังคับ', categoryColor: 'text-amber-600',
    image: '',
    author: 'ฝ่ายนโยบาย', publishDate: '-', status: 'draft', pinned: false,
    targetAudience: [], viewCount: 0, tags: ['ร่าง', 'ระเบียบ'],
  },
];

const eventCategories = ['คำขอ', 'ทุน/สัญญา', 'รายงาน', 'ติดตามผล', 'อนุมัติ', 'การเงิน', 'ประชาสัมพันธ์', 'เอกสาร'];
const announcementCategories = ['ทุนการศึกษา', 'กิจกรรม', 'ระเบียบ/ข้อบังคับ', 'ข่าวสาร', 'คู่มือ/แนวทาง'];

const channelIcon = { web: Globe, mobile: Smartphone, email: Mail };
const channelLabel = { web: 'Web App', mobile: 'Mobile', email: 'อีเมล' };

const priorityConfig = {
  critical: { label: 'วิกฤต', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  high: { label: 'สูง', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  medium: { label: 'ปานกลาง', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { label: 'ต่ำ', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
};

const logStatusConfig = {
  sent: { label: 'ส่งแล้ว', bg: 'bg-blue-100', text: 'text-blue-700' },
  delivered: { label: 'ถึงแล้ว', bg: 'bg-green-100', text: 'text-green-700' },
  read: { label: 'อ่านแล้ว', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  failed: { label: 'ล้มเหลว', bg: 'bg-red-100', text: 'text-red-700' },
};

// ===== Component =====
export default function Notifications() {
  const [activeTab, setActiveTab] = useState('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [createRuleOpen, setCreateRuleOpen] = useState(false);
  const [ruleDetailOpen, setRuleDetailOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  const [createAnnOpen, setCreateAnnOpen] = useState(false);
  const [annDetailOpen, setAnnDetailOpen] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [logChannelFilter, setLogChannelFilter] = useState('all');
  const [annCategoryFilter, setAnnCategoryFilter] = useState('all');
  const [annStatusFilter, setAnnStatusFilter] = useState('all');

  const enabledRules = notificationRules.filter(r => r.enabled).length;
  const totalSent = notificationLogs.length;
  const publishedAnn = announcements.filter(a => a.status === 'published').length;

  return (
    <div className="min-h-full">
      <PageHeader
        title="การแจ้งเตือนและประชาสัมพันธ์"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'การแจ้งเตือนและประชาสัมพันธ์' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('ส่งออกรายงาน')}><Download className="w-4 h-4 mr-2" />ส่งออก</Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="การแจ้งเตือนและประชาสัมพันธ์"
          moduleName="notifications"
          defaultExpanded={false}
          permissions={[
            { permission: 'notifications:view', label: 'ดูการแจ้งเตือน', description: 'ดูรายการกฎแจ้งเตือนและประวัติ', uiLocation: 'หน้าหลัก' },
            { permission: 'notifications:manage', label: 'จัดการกฎแจ้งเตือน', description: 'สร้าง แก้ไข ปิด/เปิดกฎ', uiLocation: 'Tab "กฎการแจ้งเตือน"' },
            { permission: 'announcements:view', label: 'ดูข่าวประชาสัมพันธ์', description: 'ดูข่าวที่เผยแพร่แล้ว', uiLocation: 'Tab "ข่าวประชาสัมพันธ์"' },
            { permission: 'announcements:manage', label: 'จัดการข่าว', description: 'สร้าง แก้ไข เผยแพร่ข่าว', uiLocation: 'ปุ่ม "สร้างข่าวใหม่"' },
          ]}
        />

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'กฎแจ้งเตือน', value: notificationRules.length, sub: `เปิดใช้ ${enabledRules}`, icon: Zap, bg: 'from-blue-500 to-blue-600', bgLight: 'from-blue-50 to-blue-100' },
            { label: 'ส่งวันนี้', value: 6, sub: '24 ก.พ. 2569', icon: Send, bg: 'from-cyan-500 to-cyan-600', bgLight: 'from-cyan-50 to-cyan-100' },
            { label: 'ส่งทั้งหมด', value: `${totalSent}+`, sub: 'ประวัติรวม', icon: Bell, bg: 'from-indigo-500 to-indigo-600', bgLight: 'from-indigo-50 to-indigo-100' },
            { label: 'ข่าวประชาสัมพันธ์', value: publishedAnn, sub: `จากทั้งหมด ${announcements.length}`, icon: Megaphone, bg: 'from-green-500 to-emerald-500', bgLight: 'from-green-50 to-emerald-50' },
            { label: 'ข่าวปักหมุด', value: announcements.filter(a => a.pinned).length, sub: 'แสดงด้านบน', icon: Pin, bg: 'from-amber-500 to-orange-500', bgLight: 'from-amber-50 to-orange-50' },
            { label: 'ยอดเข้าชม', value: '5.3K', sub: 'เดือนนี้', icon: Eye, bg: 'from-purple-500 to-purple-600', bgLight: 'from-purple-50 to-purple-100' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`border-0 bg-gradient-to-br ${c.bgLight} hover:shadow-lg transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}><c.icon className="w-5 h-5 text-white" /></div>
                    <div><p className="text-xl font-bold">{c.value}</p><p className="text-[10px] text-gray-500">{c.label}</p><p className="text-[10px] text-gray-400">{c.sub}</p></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules"><Zap className="w-4 h-4 mr-1.5" />กฎการแจ้งเตือน <Badge variant="secondary" className="ml-1.5">{notificationRules.length}</Badge></TabsTrigger>
            <TabsTrigger value="history"><Clock className="w-4 h-4 mr-1.5" />ประวัติการแจ้งเตือน</TabsTrigger>
            <TabsTrigger value="announcements"><Megaphone className="w-4 h-4 mr-1.5" />ข่าวประชาสัมพันธ์ <Badge variant="secondary" className="ml-1.5">{announcements.length}</Badge></TabsTrigger>
            <TabsTrigger value="channels"><Settings className="w-4 h-4 mr-1.5" />ตั้งค่าช่องทาง</TabsTrigger>
          </TabsList>

          {/* ============ TAB: RULES ============ */}
          <TabsContent value="rules" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 flex-1 max-w-xl">
                <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="ค้นหากฎแจ้งเตือน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
              </div>
              <Button onClick={() => setCreateRuleOpen(true)}><Plus className="w-4 h-4 mr-1" /> สร้างกฎใหม่</Button>
            </div>

            <div className="space-y-3">
              {notificationRules.filter(r => !searchQuery || r.name.includes(searchQuery) || r.eventType.includes(searchQuery)).map((rule, i) => {
                const pc = priorityConfig[rule.priority];
                return (
                  <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={`hover:shadow-lg transition-all ${!rule.enabled ? 'opacity-60' : ''}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${rule.enabled ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            <rule.eventIcon className={`w-5 h-5 ${rule.enabled ? rule.eventColor : 'text-gray-400'}`} />
                          </div>
                          {/* Body */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{rule.name}</h4>
                              <Badge className={`text-[10px] ${pc.bg} ${pc.text} border ${pc.border}`}>{pc.label}</Badge>
                              <Badge variant="outline" className="text-[10px] font-mono">{rule.id}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{rule.description}</p>
                            {/* Channels & Timing */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400">ช่องทาง:</span>
                                {(['web', 'mobile', 'email'] as const).map(ch => {
                                  const Icon = channelIcon[ch];
                                  return rule.channels[ch] ? (
                                    <div key={ch} className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 rounded text-blue-700"><Icon className="w-3 h-3" /><span className="text-[10px]">{channelLabel[ch]}</span></div>
                                  ) : null;
                                })}
                              </div>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-1">
                                {rule.timing === 'immediate' ? (
                                  <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px]"><Zap className="w-3 h-3 mr-0.5" />แจ้งเตือนทันที</Badge>
                                ) : (
                                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px]"><Timer className="w-3 h-3 mr-0.5" />ล่วงหน้า {rule.advanceDays} วัน</Badge>
                                )}
                              </div>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /><span className="text-[10px] text-gray-500">{rule.recipients.join(', ')}</span></div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-xs text-gray-400">ส่งแล้ว</p>
                              <p className="text-sm font-bold">{rule.triggerCount.toLocaleString()}</p>
                            </div>
                            <Switch checked={rule.enabled} onCheckedChange={() => toast.success(`${rule.enabled ? 'ปิด' : 'เปิด'}กฎ "${rule.name}"`)} />
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedRule(rule); setRuleDetailOpen(true); }}><Eye className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.info(`ทดสอบส่งแจ้งเตือน "${rule.name}"`)}><TestTube className="w-4 h-4 text-purple-500" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ============ TAB: HISTORY ============ */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Clock className="w-5 h-5 text-purple-600" />ประวัติการแจ้งเตือน</CardTitle>
                  <div className="flex gap-2">
                    <Select value={logChannelFilter} onValueChange={setLogChannelFilter}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="ช่องทาง" /></SelectTrigger>
                      <SelectContent><SelectItem value="all">ทุกช่องทาง</SelectItem><SelectItem value="web">Web App</SelectItem><SelectItem value="mobile">Mobile</SelectItem><SelectItem value="email">อีเมล</SelectItem></SelectContent>
                    </Select>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />ส่งออก</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>เวลา</TableHead><TableHead>กฎ</TableHead><TableHead>ช่องทาง</TableHead><TableHead>ผู้รับ</TableHead><TableHead>ข้อความ</TableHead><TableHead>ความสำคัญ</TableHead><TableHead>สถานะ</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationLogs.filter(l => logChannelFilter === 'all' || l.channel === logChannelFilter).map(log => {
                      const ChIcon = channelIcon[log.channel];
                      const sc = logStatusConfig[log.status];
                      const pc = priorityConfig[log.priority];
                      return (
                        <TableRow key={log.id} className="hover:bg-blue-50/50">
                          <TableCell className="text-xs font-mono whitespace-nowrap"><Clock className="w-3 h-3 text-gray-400 inline mr-1" />{log.sentAt}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{log.ruleName}</Badge></TableCell>
                          <TableCell><div className="flex items-center gap-1"><ChIcon className="w-3.5 h-3.5 text-gray-500" /><span className="text-xs">{channelLabel[log.channel]}</span></div></TableCell>
                          <TableCell className="text-sm max-w-[150px] truncate">{log.recipient}</TableCell>
                          <TableCell className="text-sm max-w-[250px] truncate">{log.message}</TableCell>
                          <TableCell><Badge className={`text-[10px] ${pc.bg} ${pc.text} border ${pc.border}`}>{pc.label}</Badge></TableCell>
                          <TableCell><Badge className={`text-[10px] ${sc.bg} ${sc.text}`}>{sc.label}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ============ TAB: ANNOUNCEMENTS ============ */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="relative w-[300px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="ค้นหาข่าว..." className="pl-10" /></div>
                <Select value={annCategoryFilter} onValueChange={setAnnCategoryFilter}><SelectTrigger className="w-[160px]"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกหมวด</SelectItem>{announcementCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                <Select value={annStatusFilter} onValueChange={setAnnStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="published">เผยแพร่</SelectItem><SelectItem value="draft">ร่าง</SelectItem><SelectItem value="scheduled">ตั้งเวลา</SelectItem><SelectItem value="archived">เก็บถาวร</SelectItem></SelectContent></Select>
              </div>
              <Button onClick={() => setCreateAnnOpen(true)} className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-1" /> สร้างข่าวใหม่</Button>
            </div>

            {/* Pinned */}
            {announcements.filter(a => a.pinned && a.status === 'published').length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-1.5"><Pin className="w-4 h-4 text-amber-500" />ข่าวปักหมุด</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcements.filter(a => a.pinned && a.status === 'published').map((ann, i) => (
                    <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer overflow-hidden border-amber-200" onClick={() => { setSelectedAnn(ann); setAnnDetailOpen(true); }}>
                        <div className="flex">
                          {ann.image && (
                            <div className="w-48 shrink-0">
                              <ImageWithFallback src={ann.image} alt={ann.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pin className="w-3.5 h-3.5 text-amber-500" />
                              <Badge className={`text-[10px] bg-white ${ann.categoryColor} border`}>{ann.category}</Badge>
                              <span className="text-[10px] text-gray-400">{ann.publishDate}</span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{ann.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{ann.excerpt}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-[10px] text-gray-400">{ann.author}</span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Eye className="w-3 h-3" />{ann.viewCount.toLocaleString()}</span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Announcements */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-1.5"><Megaphone className="w-4 h-4 text-indigo-500" />ข่าวประชาสัมพันธ์ทั้งหมด</h3>
              <div className="space-y-3">
                {announcements
                  .filter(a => (annCategoryFilter === 'all' || a.category === annCategoryFilter) && (annStatusFilter === 'all' || a.status === annStatusFilter))
                  .map((ann, i) => {
                  const statusCfg = {
                    published: { label: 'เผยแพร่', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
                    draft: { label: 'ร่าง', bg: 'bg-gray-100', text: 'text-gray-600', icon: FileText },
                    scheduled: { label: 'ตั้งเวลา', bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar },
                    archived: { label: 'เก็บถาวร', bg: 'bg-gray-100', text: 'text-gray-500', icon: Archive },
                  }[ann.status];
                  return (
                    <motion.div key={ann.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <Card className={`hover:shadow-md transition-all cursor-pointer ${ann.status === 'draft' ? 'border-dashed' : ''}`} onClick={() => { setSelectedAnn(ann); setAnnDetailOpen(true); }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {ann.image ? (
                              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0"><ImageWithFallback src={ann.image} alt="" className="w-full h-full object-cover" /></div>
                            ) : (
                              <div className="w-20 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Megaphone className="w-6 h-6 text-gray-300" /></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {ann.pinned && <Pin className="w-3 h-3 text-amber-500" />}
                                <Badge className={`text-[10px] bg-white ${ann.categoryColor} border`}>{ann.category}</Badge>
                                <Badge className={`text-[10px] ${statusCfg.bg} ${statusCfg.text}`}><statusCfg.icon className="w-3 h-3 mr-0.5" />{statusCfg.label}</Badge>
                              </div>
                              <h4 className="font-semibold text-sm">{ann.title}</h4>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ann.excerpt}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] text-gray-400">{ann.author}</span>
                                <span className="text-[10px] text-gray-400">{ann.publishDate !== '-' ? ann.publishDate : 'ยังไม่กำหนด'}</span>
                                {ann.viewCount > 0 && <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Eye className="w-3 h-3" />{ann.viewCount.toLocaleString()}</span>}
                                <div className="flex gap-1">{ann.tags.map(t => <Badge key={t} variant="outline" className="text-[9px] py-0">{t}</Badge>)}</div>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast.success(ann.pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุดแล้ว'); }}>{ann.pinned ? <PinOff className="w-3.5 h-3.5 text-amber-500" /> : <Pin className="w-3.5 h-3.5" />}</Button>
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast.info('แก้ไขข่าว'); }}><Edit className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ============ TAB: CHANNEL SETTINGS ============ */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Web App */}
              <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-base"><Globe className="w-5 h-5 text-blue-600" />Web Application</CardTitle>
                  <CardDescription>แจ้งเตือนผ่าน Browser Push & In-App</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>เปิดใช้งาน Push Notification</Label><p className="text-xs text-gray-500">แจ้งเตือนผ่าน Browser</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>In-App Notification</Label><p className="text-xs text-gray-500">แจ้งเตือนในระบบ (Bell icon)</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Real-time Update</Label><p className="text-xs text-gray-500">อัปเดตข้อมูลทันทีบนหน้าจอ</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>เสียงแจ้งเตือน</Label><p className="text-xs text-gray-500">เล่นเสียงเมื่อมีแจ้งเตือนใหม่</p></div><Switch /></div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700"><Info className="w-4 h-4" /><p className="text-xs">ผู้ใช้ต้องอนุญาต Browser Notification ก่อนจึงจะได้รับ Push</p></div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile */}
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-base"><Smartphone className="w-5 h-5 text-green-600" />Mobile Application</CardTitle>
                  <CardDescription>แจ้งเตือนผ่าน Mobile Push (iOS/Android)</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Push Notification (iOS)</Label><p className="text-xs text-gray-500">แจ้งเตือนบน iPhone/iPad</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Push Notification (Android)</Label><p className="text-xs text-gray-500">แจ้งเตือนบน Android</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Badge Count</Label><p className="text-xs text-gray-500">แสดงจำนวนบน App Icon</p></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Quiet Hours</Label><p className="text-xs text-gray-500">ไม่แจ้งเตือน 22:00-07:00</p></div><Switch defaultChecked /></div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700"><Info className="w-4 h-4" /><p className="text-xs">ต้องติดตั้ง Mobile App และลงทะเบียนอุปกรณ์</p></div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-base"><Mail className="w-5 h-5 text-purple-600" />อีเมล</CardTitle>
                  <CardDescription>แจ้งเตือนผ่านอีเมลอัตโนมัติ</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>เปิดใช้งานอีเมลแจ้งเตือน</Label><p className="text-xs text-gray-500">ส่งอีเมลเมื่อมีการแจ้งเตือน</p></div><Switch defaultChecked /></div>
                  <div className="space-y-2"><Label>SMTP Server</Label><Input defaultValue="smtp.scholarship.go.th" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Port</Label><Input defaultValue="587" /></div>
                    <div className="space-y-2"><Label>Encryption</Label><Select defaultValue="tls"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tls">TLS</SelectItem><SelectItem value="ssl">SSL</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="space-y-2"><Label>From Address</Label><Input defaultValue="noreply@scholarship.go.th" /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Digest Mode</Label><p className="text-xs text-gray-500">รวมส่งวันละ 1 ฉบับ (08:00)</p></div><Switch /></div>
                  <Button size="sm" variant="outline" onClick={() => toast.success('ส่งอีเมลทดสอบเรียบร้อย')}><TestTube className="w-3.5 h-3.5 mr-1" />ส่งอีเมลทดสอบ</Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end"><Button onClick={() => toast.success('บันทึกการตั้งค่าช่องทางเรียบร้อย')}><Save className="w-4 h-4 mr-2" />บันทึกการตั้งค่า</Button></div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Create Rule Dialog ===== */}
      <Dialog open={createRuleOpen} onOpenChange={setCreateRuleOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Zap className="w-5 h-5" />สร้างกฎแจ้งเตือนใหม่</DialogTitle>
            <DialogDescription className="text-blue-100 mt-1">กำหนดเงื่อนไข ช่องทาง และระยะเวลาการแจ้งเตือนอัตโนมัติ</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Basic */}
            <div className="space-y-4">
              <div className="space-y-2"><Label>ชื่อกฎ <span className="text-red-500">*</span></Label><Input placeholder="เช่น แจ้งเตือนคำขอใหม่" /></div>
              <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea placeholder="อธิบายเงื่อนไขการแจ้งเตือน" rows={2} /></div>
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-blue-600" />เหตุการณ์ที่ทริกเกอร์</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>หมวดหมู่เหตุการณ์ <span className="text-red-500">*</span></Label>
                <Select><SelectTrigger><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger><SelectContent>{eventCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>ประเภทเหตุการณ์ <span className="text-red-500">*</span></Label>
                <Select><SelectTrigger><SelectValue placeholder="เลือกเหตุการณ์" /></SelectTrigger><SelectContent>
                  <SelectItem value="new_request">คำขอ/ใบสมัครใหม่</SelectItem><SelectItem value="deadline">ครบกำหนด</SelectItem><SelectItem value="travel_report">ส่งรายงานเดินทาง</SelectItem><SelectItem value="approval">ผลการอนุมัติ</SelectItem><SelectItem value="traffic_light">เปลี่ยน Traffic Light</SelectItem><SelectItem value="document_expire">เอกสารหมดอายุ</SelectItem><SelectItem value="custom">กำหนดเอง</SelectItem>
                </SelectContent></Select>
              </div>
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Timer className="w-4 h-4 text-amber-600" />ระยะเวลาการแจ้งเตือน</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg"><div className="flex items-center gap-2"><Checkbox id="timing-immediate" defaultChecked /><Label htmlFor="timing-immediate" className="font-normal cursor-pointer flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-cyan-600" />แจ้งเตือนทันที</Label></div><p className="text-[10px] text-gray-500 ml-6">เมื่อเกิดเหตุการณ์</p></div>
                <div className="p-3 border rounded-lg"><div className="flex items-center gap-2"><Checkbox id="timing-advance" /><Label htmlFor="timing-advance" className="font-normal cursor-pointer flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-amber-600" />แจ้งเตือนล่วงหน้า</Label></div><p className="text-[10px] text-gray-500 ml-6">ก่อนครบกำหนด</p></div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>จำนวนวัน</Label><Input type="number" placeholder="เช่น 30" /></div>
                  <div className="space-y-2"><Label>จำนวนชั่วโมง</Label><Input type="number" placeholder="เช่น 0" /></div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200"><p className="text-xs text-amber-700">เช่น กำหนด 30 วัน = แจ้งเตือน 30 วัน ก่อนครบกำหนด</p></div>
              </div>
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Volume2 className="w-4 h-4 text-green-600" />ช่องทางการแจ้งเตือน</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'web', label: 'Web Application', icon: Globe, desc: 'Push + In-App Notification', color: 'border-blue-200 bg-blue-50' },
                { id: 'mobile', label: 'Mobile Application', icon: Smartphone, desc: 'Push Notification (iOS/Android)', color: 'border-green-200 bg-green-50' },
                { id: 'email', label: 'อีเมล', icon: Mail, desc: 'ส่งอีเมลอัตโนมัติ', color: 'border-purple-200 bg-purple-50' },
              ].map(ch => (
                <div key={ch.id} className={`p-3 border rounded-lg ${ch.color}`}>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><ch.icon className="w-4 h-4" /><Label className="font-medium text-sm">{ch.label}</Label></div><Checkbox defaultChecked /></div>
                  <p className="text-[10px] text-gray-500 mt-1">{ch.desc}</p>
                </div>
              ))}
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" />ผู้รับการแจ้งเตือน</h4>
            <div className="space-y-3">
              <Select><SelectTrigger><SelectValue placeholder="ประเภทผู้รับ" /></SelectTrigger><SelectContent><SelectItem value="role">ตามบทบาท (Roles)</SelectItem><SelectItem value="group">ตามกลุ่มผู้ใช้ (Groups)</SelectItem><SelectItem value="specific">ผู้ใช้เฉพาะเจาะจง</SelectItem><SelectItem value="all">ทุกคนในระบบ</SelectItem></SelectContent></Select>
              <div className="grid grid-cols-2 gap-2">
                {['เจ้าหน้าที่ทุน', 'ผู้จัดการส่วน', 'ผู้บริหาร', 'กรรมการพิจารณา', 'นักเรียนทุน', 'เจ้าหน้าที่การเงิน'].map(r => (
                  <div key={r} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50"><Checkbox id={`r-${r}`} /><Label htmlFor={`r-${r}`} className="text-sm font-normal cursor-pointer">{r}</Label></div>
                ))}
              </div>
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" />ความสำคัญ</h4>
            <Select><SelectTrigger><SelectValue placeholder="เลือกระดับความสำคัญ" /></SelectTrigger><SelectContent>
              <SelectItem value="critical">วิกฤต (Critical)</SelectItem><SelectItem value="high">สูง (High)</SelectItem><SelectItem value="medium">ปานกลาง (Medium)</SelectItem><SelectItem value="low">ต่ำ (Low)</SelectItem>
            </SelectContent></Select>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-600" />เทมเพลตข้อความ</h4>
            <Textarea placeholder="เช่น มีคำขอใหม่ {{request_code}} จาก {{applicant_name}} รอดำเนินการ" rows={3} />
            <p className="text-xs text-gray-500">ใช้ {'{{variable}}'} สำหรับข้อมูลแบบไดนามิก เช่น {'{{request_code}}'}, {'{{scholar_name}}'}, {'{{deadline}}'}, {'{{days_remaining}}'}</p>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateRuleOpen(false)}>ยกเลิก</Button>
            <Button onClick={() => { setCreateRuleOpen(false); toast.success('สร้างกฎแจ้งเตือนใหม่เรียบร้อย'); }}><Zap className="w-4 h-4 mr-1" />สร้างกฎ</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Rule Detail Dialog ===== */}
      <Dialog open={ruleDetailOpen} onOpenChange={setRuleDetailOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          {selectedRule && (() => {
            const pc = priorityConfig[selectedRule.priority];
            return (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center"><selectedRule.eventIcon className="w-5 h-5 text-white" /></div>
                    <div>
                      <DialogTitle className="text-white text-lg">{selectedRule.name}</DialogTitle>
                      <DialogDescription className="text-indigo-100 mt-0.5">{selectedRule.id} - {selectedRule.eventCategory}</DialogDescription>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                  <p className="text-sm text-gray-600">{selectedRule.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400 uppercase">ประเภทเหตุการณ์</Label><p className="text-sm font-medium mt-1">{selectedRule.eventType}</p></div>
                    <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400 uppercase">ความสำคัญ</Label><div className="mt-1"><Badge className={`${pc.bg} ${pc.text} border ${pc.border}`}>{pc.label}</Badge></div></div>
                  </div>

                  <div className="p-4 border rounded-xl">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Timer className="w-4 h-4 text-amber-600" />ระยะเวลา</h4>
                    {selectedRule.timing === 'immediate' ? (
                      <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200"><Zap className="w-3 h-3 mr-1" />แจ้งเตือนทันทีเมื่อเกิดเหตุการณ์</Badge>
                    ) : (
                      <div className="space-y-2">
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200"><Timer className="w-3 h-3 mr-1" />แจ้งเตือนล่วงหน้า {selectedRule.advanceDays} วัน</Badge>
                        <p className="text-xs text-gray-500">ระบบจะส่งการแจ้งเตือนอัตโนมัติ {selectedRule.advanceDays} วัน ก่อนครบกำหนด</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border rounded-xl">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Volume2 className="w-4 h-4 text-green-600" />ช่องทาง</h4>
                    <div className="flex gap-3">
                      {(['web', 'mobile', 'email'] as const).map(ch => {
                        const Icon = channelIcon[ch];
                        const active = selectedRule.channels[ch];
                        return (
                          <div key={ch} className={`flex-1 p-3 rounded-lg border ${active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                            <div className="flex items-center gap-2"><Icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400'}`} /><span className="text-sm font-medium">{channelLabel[ch]}</span></div>
                            <p className="text-[10px] mt-1 text-gray-500">{active ? 'เปิดใช้งาน' : 'ปิด'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 border rounded-xl">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" />ผู้รับ</h4>
                    <div className="flex flex-wrap gap-2">{selectedRule.recipients.map(r => <Badge key={r} variant="outline">{r}</Badge>)}</div>
                  </div>

                  <div className="p-4 border rounded-xl bg-gray-50">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cyan-600" />เทมเพลต</h4>
                    <p className="text-sm font-mono text-gray-600 bg-white p-3 rounded border">{selectedRule.template}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center"><p className="text-2xl font-bold text-blue-600">{selectedRule.triggerCount.toLocaleString()}</p><p className="text-[10px] text-gray-500">ส่งทั้งหมด</p></div>
                    <div className="p-3 bg-slate-50 rounded-lg border text-center"><p className="text-sm font-medium text-gray-700">{selectedRule.lastTriggered}</p><p className="text-[10px] text-gray-500">ส่งล่าสุด</p></div>
                  </div>
                </div>
                <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
                  <Button size="sm" variant="outline" onClick={() => toast.info(`ทดสอบส่ง "${selectedRule.name}"`)}><TestTube className="w-3.5 h-3.5 mr-1" />ทดสอบส่ง</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setRuleDetailOpen(false)}>ปิด</Button>
                    <Button onClick={() => { setRuleDetailOpen(false); toast.success('บันทึกการแก้ไข'); }}><Save className="w-4 h-4 mr-1" />บันทึก</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ===== Announcement Detail Dialog ===== */}
      <Dialog open={annDetailOpen} onOpenChange={setAnnDetailOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          {selectedAnn && (
            <>
              {selectedAnn.image ? (
                <div className="h-48 overflow-hidden"><ImageWithFallback src={selectedAnn.image} alt={selectedAnn.title} className="w-full h-full object-cover" /></div>
              ) : (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-32 flex items-center justify-center"><Megaphone className="w-12 h-12 text-white/30" /></div>
              )}
              <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 260px)' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedAnn.pinned && <Badge className="bg-amber-100 text-amber-700 border border-amber-200"><Pin className="w-3 h-3 mr-0.5" />ปักหมุด</Badge>}
                  <Badge className={`bg-white ${selectedAnn.categoryColor} border`}>{selectedAnn.category}</Badge>
                  <Badge className={`text-[10px] ${selectedAnn.status === 'published' ? 'bg-green-100 text-green-700' : selectedAnn.status === 'draft' ? 'bg-gray-100 text-gray-600' : selectedAnn.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{selectedAnn.status === 'published' ? 'เผยแพร่' : selectedAnn.status === 'draft' ? 'ร่าง' : selectedAnn.status === 'scheduled' ? 'ตั้งเวลา' : 'เก็บถาวร'}</Badge>
                </div>
                <DialogTitle className="text-xl">{selectedAnn.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><UserCheck className="w-4 h-4" />{selectedAnn.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{selectedAnn.publishDate}</span>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{selectedAnn.viewCount.toLocaleString()} เข้าชม</span>
                </div>
                <Separator />
                <p className="text-sm text-gray-700 leading-relaxed">{selectedAnn.excerpt}</p>
                <p className="text-sm text-gray-500">{selectedAnn.content}</p>
                <Separator />
                <div>
                  <Label className="text-xs text-gray-400">กลุ่มเป้าหมาย</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">{selectedAnn.targetAudience.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">แท็ก</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">{selectedAnn.tags.map(t => <Badge key={t} className="bg-gray-100 text-gray-600 text-[10px]"><Tag className="w-3 h-3 mr-0.5" />{t}</Badge>)}</div>
                </div>
              </div>
              <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success(selectedAnn.pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุดแล้ว')}>{selectedAnn.pinned ? <PinOff className="w-3.5 h-3.5 mr-1" /> : <Pin className="w-3.5 h-3.5 mr-1" />}{selectedAnn.pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุด'}</Button>
                  {selectedAnn.status === 'draft' && <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toast.success('เผยแพร่ข่าวเรียบร้อย')}><Send className="w-3.5 h-3.5 mr-1" />เผยแพร่</Button>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setAnnDetailOpen(false)}>ปิด</Button>
                  <Button onClick={() => { setAnnDetailOpen(false); toast.info('แก้ไขข่าว'); }}><Edit className="w-4 h-4 mr-1" />แก้ไข</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Create Announcement Dialog ===== */}
      <Dialog open={createAnnOpen} onOpenChange={setCreateAnnOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><Megaphone className="w-5 h-5" />สร้างข่าวประชาสัมพันธ์ใหม่</DialogTitle>
            <DialogDescription className="text-green-100 mt-1">เผยแพร่ข่าวสารถึงนักเรียนทุนและผู้ใช้ระบบ</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="space-y-2"><Label>หัวข้อข่าว <span className="text-red-500">*</span></Label><Input placeholder="กรอกหัวข้อข่าว" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>หมวดหมู่ <span className="text-red-500">*</span></Label><Select><SelectTrigger><SelectValue placeholder="เลือกหมวด" /></SelectTrigger><SelectContent>{announcementCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>ผู้เผยแพร่</Label><Input defaultValue="สำนักงาน ก.พ." /></div>
            </div>
            <div className="space-y-2"><Label>ข้อความย่อ</Label><Textarea placeholder="สรุปเนื้อหาสั้นๆ" rows={2} /></div>
            <div className="space-y-2"><Label>เนื้อหาข่าว <span className="text-red-500">*</span></Label><Textarea placeholder="รายละเอียดข่าวประชาสัมพันธ์..." rows={5} /></div>
            <div className="space-y-2"><Label>URL รูปภาพประกอบ</Label><Input placeholder="https://..." /></div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" />กลุ่มเป้าหมาย</h4>
            <div className="grid grid-cols-2 gap-2">
              {['นักเรียนทุนทุกคน', 'นักเรียนทุนรุ่น 2569', 'ศิษย์เก่าทุนรัฐบาล', 'ผู้สนใจทั่วไป', 'เจ้าหน้าที่ สนง. ก.พ.'].map(a => (
                <div key={a} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50"><Checkbox id={`aud-${a}`} /><Label htmlFor={`aud-${a}`} className="text-sm font-normal cursor-pointer">{a}</Label></div>
              ))}
            </div>

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Tag className="w-4 h-4 text-teal-600" />แท็ก</h4>
            <Input placeholder="พิมพ์แท็กคั่นด้วยจุลภาค เช่น ทุนรัฐบาล, ปี2569" />

            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-600" />การเผยแพร่</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg"><div className="flex items-center gap-2"><Checkbox id="pub-now" defaultChecked /><Label htmlFor="pub-now" className="font-normal cursor-pointer">เผยแพร่ทันที</Label></div></div>
              <div className="p-3 border rounded-lg"><div className="flex items-center gap-2"><Checkbox id="pub-schedule" /><Label htmlFor="pub-schedule" className="font-normal cursor-pointer">ตั้งเวลาเผยแพร่</Label></div></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"><div className="flex items-center gap-2"><Pin className="w-4 h-4 text-amber-600" /><Label className="font-normal">ปักหมุดข่าวนี้</Label></div><Switch /></div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" /><Label className="font-normal">ส่งแจ้งเตือนถึงกลุ่มเป้าหมาย</Label></div><Switch defaultChecked /></div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
            <Button variant="outline" onClick={() => { setCreateAnnOpen(false); toast.info('บันทึกเป็นร่าง'); }}>บันทึกร่าง</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCreateAnnOpen(false)}>ยกเลิก</Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setCreateAnnOpen(false); toast.success('เผยแพร่ข่าวประชาสัมพันธ์เรียบร้อย'); }}><Send className="w-4 h-4 mr-1" />เผยแพร่</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
