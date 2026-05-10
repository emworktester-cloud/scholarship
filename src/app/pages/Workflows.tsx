import { useState } from 'react';
import type React from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from '../components/ui/dialog';
import { StatusBadge } from '../components/shared/StatusBadge';
import {
  Plus, Copy, History, Edit, FileText, GitBranch, Settings,
  Search, Eye, Clock, CheckCircle2, AlertTriangle, FileWarning,
  GraduationCap, Briefcase, DollarSign, Shield, UserCheck,
  ArrowLeftRight, MapPin, Pause, PlayCircle, RefreshCw, XCircle,
  FileCheck, Send, Filter, LayoutGrid, List, ChevronRight,
  ClipboardList, BookOpen, Users, Plane, HeartPulse, Scale,
  Building, CalendarClock, RotateCcw, Wallet, Receipt, Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { Separator } from '../components/ui/separator';

// ===== Workflows Data =====
const workflows = [
  {
    id: 1,
    name: 'Workflow ทุนการศึกษาต่างประเทศ',
    type: 'ทุนการศึกษาต่างประเทศ',
    version: '2.1',
    status: 'active' as const,
    states: 9,
    updatedDate: '15/02/2569',
    updatedBy: 'admin',
  },
  {
    id: 2,
    name: 'Workflow ทุนวิจัย',
    type: 'ทุนวิจัย',
    version: '1.5',
    status: 'active' as const,
    states: 7,
    updatedDate: '10/02/2569',
    updatedBy: 'admin',
  },
  {
    id: 3,
    name: 'Workflow ทุนพัฒนาบุคลากร',
    type: 'ทุนพัฒนาบุคลากร',
    version: '1.0',
    status: 'draft' as const,
    states: 5,
    updatedDate: '05/02/2569',
    updatedBy: 'admin',
  },
  {
    id: 4,
    name: 'Workflow คำขอเปลี่ยนแปลง',
    type: 'คำขอเปลี่ยนแปลง',
    version: '1.2',
    status: 'active' as const,
    states: 6,
    updatedDate: '18/02/2569',
    updatedBy: 'admin',
  },
  {
    id: 5,
    name: 'Workflow ระงับ/ปิดทุน',
    type: 'ระงับ/ปิดทุน',
    version: '1.0',
    status: 'active' as const,
    states: 4,
    updatedDate: '12/02/2569',
    updatedBy: 'admin',
  },
];

// ===== Preset e-Form Categories & Items (18+ types) =====
type FormCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
};

type PresetForm = {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  categoryId: string;
  fields: number;
  status: 'active' | 'draft' | 'archived';
  version: string;
  linkedWorkflow: string;
  approvalSteps: number;
  usageCount: number;
  lastUsed: string;
  updatedDate: string;
  description: string;
};

const formCategories: FormCategory[] = [
  { id: 'application', name: 'การสมัครทุน', icon: GraduationCap, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', description: 'แบบฟอร์มสำหรับกระบวนการสมัครรับทุน' },
  { id: 'study', name: 'ระหว่างศึกษา', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', description: 'แบบฟอร์มสำหรับช่วงระหว่างศึกษา' },
  { id: 'change', name: 'คำขอเปลี่ยนแปลง', icon: ArrowLeftRight, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', description: 'แบบฟอร์มขอเปลี่ยนแปลงเงื่อนไขทุน' },
  { id: 'finance', name: 'การเงิน/ค่าใช้จ่าย', icon: Wallet, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', description: 'แบบฟอร์มเบิก-จ่ายเงิน' },
  { id: 'monitoring', name: 'ติดตาม/เฝ้าระวัง', icon: Shield, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', description: 'แบบฟอร์มติดตามและเฝ้าระวัง' },
  { id: 'completion', name: 'สำเร็จ/ชดใช้ทุน', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', description: 'แบบฟอร์มหลังสำเร็จการศึกษา' },
];

const presetForms: PresetForm[] = [
  // === การสมัครทุน ===
  {
    id: 'EF-01', code: 'EF-01', name: 'แบบฟอร์มสมัครทุนการศึกษาต่างประเทศ', nameEn: 'Overseas Scholarship Application',
    categoryId: 'application', fields: 24, status: 'active', version: '3.0', linkedWorkflow: 'Workflow ทุนการศึกษาต่างประเทศ',
    approvalSteps: 5, usageCount: 342, lastUsed: '24/02/2569', updatedDate: '15/02/2569',
    description: 'แบบฟอร์มหลักสำหรับสมัครทุนการศึกษาระดับปริญญาโท/เอก ในต่างประเทศ ครอบคลุมข้อมูลส่วนบุคคล ประวัติการศึกษา แผนการศึกษา',
  },
  {
    id: 'EF-02', code: 'EF-02', name: 'แบบฟอร์มสมัครทุนวิจัยระยะสั้น', nameEn: 'Short-term Research Grant Application',
    categoryId: 'application', fields: 18, status: 'active', version: '2.1', linkedWorkflow: 'Workflow ทุนวิจัย',
    approvalSteps: 4, usageCount: 128, lastUsed: '22/02/2569', updatedDate: '10/02/2569',
    description: 'แบบฟอร์มสำหรับทุนวิจัยระยะสั้น 3-12 เดือน รวมแผนวิจัย งบประมาณ สถาบันปลายทาง',
  },
  {
    id: 'EF-03', code: 'EF-03', name: 'แบบฟอร์มสมัครทุนพัฒนาบุคลากรภาครัฐ', nameEn: 'Government Personnel Development Application',
    categoryId: 'application', fields: 20, status: 'active', version: '1.5', linkedWorkflow: 'Workflow ทุนพัฒนาบุคลากร',
    approvalSteps: 4, usageCount: 215, lastUsed: '20/02/2569', updatedDate: '05/02/2569',
    description: 'แบบฟอร์มสำหรับข้าราชการที่ต้องการขอทุนพัฒนาบุคลากร ฝึกอบรม หรือดูงานต่างประเทศ',
  },

  // === ระหว่างศึกษา ===
  {
    id: 'EF-04', code: 'EF-04', name: 'แบบฟอร์มรายงานผลการศึกษาประจำภาค', nameEn: 'Semester Academic Report',
    categoryId: 'study', fields: 14, status: 'active', version: '2.0', linkedWorkflow: '-',
    approvalSteps: 2, usageCount: 876, lastUsed: '24/02/2569', updatedDate: '01/02/2569',
    description: 'แบบฟอร์มรายงานผลการเรียนประจำภาคการศึกษา รายวิชา เกรด ผลงานวิจัย และแผนการศึกษาภาคถัดไป',
  },
  {
    id: 'EF-05', code: 'EF-05', name: 'แบบฟอร์มรายงานความก้าวหน้าวิทยานิพนธ์', nameEn: 'Thesis/Dissertation Progress Report',
    categoryId: 'study', fields: 12, status: 'active', version: '1.8', linkedWorkflow: '-',
    approvalSteps: 2, usageCount: 534, lastUsed: '23/02/2569', updatedDate: '08/02/2569',
    description: 'แบบฟอร์มรายงานความก้าวหน้าของวิทยานิพนธ์/ดุษฎีนิพนธ์ รวมถึงเอกสารรับรองจากอาจารย์ที่ปรึกษา',
  },
  {
    id: 'EF-06', code: 'EF-06', name: 'แบบฟอร์มขอขยายเวลาการศึกษา', nameEn: 'Study Period Extension Request',
    categoryId: 'study', fields: 10, status: 'active', version: '2.2', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 4, usageCount: 89, lastUsed: '18/02/2569', updatedDate: '12/02/2569',
    description: 'แบบฟอร์มสำหรับนักเรียนทุนที่ต้องการขยายเวลาการศึกษาเกินกว่าระยะเวลาที่กำหนด พร้อมเหตุผลและแผนที่ปรับปรุง',
  },
  {
    id: 'EF-07', code: 'EF-07', name: 'แบบฟอร์มขอลาพักการศึกษา', nameEn: 'Leave of Absence Request',
    categoryId: 'study', fields: 8, status: 'active', version: '1.3', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 3, usageCount: 45, lastUsed: '15/02/2569', updatedDate: '10/02/2569',
    description: 'แบบฟอร์มขอลาพักการศึกษาชั่วคราว เนื่องจากเหตุสุขภาพ ครอบครัว หรือเหตุจำเป็นอื่นๆ',
  },
  {
    id: 'EF-08', code: 'EF-08', name: 'แบบฟอร์มขอกลับมาศึกษาต่อ', nameEn: 'Return to Study Request',
    categoryId: 'study', fields: 8, status: 'active', version: '1.1', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 3, usageCount: 32, lastUsed: '10/02/2569', updatedDate: '08/02/2569',
    description: 'แบบฟอร์มแจ้งขอกลับเข้าศึกษาต่อหลังจากลาพักการศึกษา',
  },

  // === คำขอเปลี่ยนแปลง ===
  {
    id: 'EF-09', code: 'EF-09', name: 'แบบฟอร์มขอเปลี่ยนสาขาวิชา/สถาบัน', nameEn: 'Change of Major/Institution Request',
    categoryId: 'change', fields: 14, status: 'active', version: '1.4', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 5, usageCount: 56, lastUsed: '19/02/2569', updatedDate: '14/02/2569',
    description: 'แบบฟอร์มขอเปลี่ยนแปลงสาขาวิชา หลักสูตร หรือสถาบันการศึกษา พร้อมเหตุผลและการเปรียบเทียบ',
  },
  {
    id: 'EF-10', code: 'EF-10', name: 'แบบฟอร์มขอเปลี่ยนประเทศศึกษา', nameEn: 'Change of Study Country Request',
    categoryId: 'change', fields: 12, status: 'active', version: '1.2', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 5, usageCount: 23, lastUsed: '14/02/2569', updatedDate: '10/02/2569',
    description: 'แบบฟอร์มขอเปลี่ยนประเทศที่ศึกษา พร้อมสถาบันใหม่ เหตุผล และผลกระทบด้านงบประมาณ',
  },
  {
    id: 'EF-11', code: 'EF-11', name: 'แบบฟอร์มขอเปลี่ยนอาจารย์ที่ปรึกษา', nameEn: 'Change of Advisor Request',
    categoryId: 'change', fields: 10, status: 'active', version: '1.0', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 3, usageCount: 18, lastUsed: '12/02/2569', updatedDate: '05/02/2569',
    description: 'แบบฟอร์มขอเปลี่ยนอาจารย์ที่ปรึกษาวิทยานิพนธ์/ดุษฎีนิพนธ์ พร้อมเหตุผลและหนังสือยินยอม',
  },
  {
    id: 'EF-12', code: 'EF-12', name: 'แบบฟอร์มขอเดินทางกลับประเทศไทยชั่วคราว', nameEn: 'Temporary Return to Thailand Request',
    categoryId: 'change', fields: 9, status: 'active', version: '1.5', linkedWorkflow: '-',
    approvalSteps: 2, usageCount: 267, lastUsed: '24/02/2569', updatedDate: '15/02/2569',
    description: 'แบบฟอร์มแจ้งขอเดินทางกลับประเทศไทยชั่วคราว ระบุวันเดินทาง เหตุผล และผลกระทบต่อการศึกษา',
  },

  // === การเงิน/ค่าใช้จ่าย ===
  {
    id: 'EF-13', code: 'EF-13', name: 'แบบฟอร์มขอเบิกค่าใช้จ่ายประจำเดือน', nameEn: 'Monthly Allowance Claim',
    categoryId: 'finance', fields: 11, status: 'active', version: '2.0', linkedWorkflow: '-',
    approvalSteps: 3, usageCount: 1245, lastUsed: '24/02/2569', updatedDate: '01/02/2569',
    description: 'แบบฟอร์มเบิกค่าใช้จ่ายประจำเดือน ค่าเล่าเรียน ค่าครองชีพ ค่าที่พัก ค่าประกันสุขภาพ',
  },
  {
    id: 'EF-14', code: 'EF-14', name: 'แบบฟอร์มขอเบิกค่าใช้จ่ายพิเศษ', nameEn: 'Special Expense Claim',
    categoryId: 'finance', fields: 13, status: 'active', version: '1.6', linkedWorkflow: '-',
    approvalSteps: 4, usageCount: 198, lastUsed: '21/02/2569', updatedDate: '10/02/2569',
    description: 'แบบฟอร์มเบิกค่าใช้จ่ายพิเศษ เช่น ค่าเดินทางไปประชุมวิชาการ ค่าอุปกรณ์วิจัย ค่าตีพิมพ์ผลงาน',
  },
  {
    id: 'EF-15', code: 'EF-15', name: 'แบบฟอร์มขอต่อสัญญารับทุน', nameEn: 'Scholarship Contract Renewal',
    categoryId: 'finance', fields: 10, status: 'active', version: '1.3', linkedWorkflow: 'Workflow คำขอเปลี่ยนแปลง',
    approvalSteps: 4, usageCount: 67, lastUsed: '16/02/2569', updatedDate: '12/02/2569',
    description: 'แบบฟอร์มขอต่ออายุสัญญารับทุน สำหรับกรณีที่ต้องขยายระยะเวลาการรับทุนตามสัญญา',
  },

  // === ติดตาม/เฝ้าระวัง ===
  {
    id: 'EF-16', code: 'EF-16', name: 'แบบฟอร์มรายงานการเฝ้าระวัง (Watch List)', nameEn: 'Watch List Monitoring Report',
    categoryId: 'monitoring', fields: 15, status: 'active', version: '2.0', linkedWorkflow: '-',
    approvalSteps: 3, usageCount: 156, lastUsed: '24/02/2569', updatedDate: '18/02/2569',
    description: 'แบบฟอร์มรายงานผลการเฝ้าระวังนักเรียนทุนที่อยู่ในกลุ่มเสี่ยง เช่น ผลการเรียนต่ำกว่าเกณฑ์ ขาดการติดต่อ พฤติกรรมผิดปกติ',
  },
  {
    id: 'EF-17', code: 'EF-17', name: 'แบบฟอร์มขอยุติการศึกษา', nameEn: 'Study Termination Request',
    categoryId: 'monitoring', fields: 12, status: 'active', version: '1.4', linkedWorkflow: 'Workflow ระงับ/ปิดทุน',
    approvalSteps: 5, usageCount: 34, lastUsed: '10/02/2569', updatedDate: '08/02/2569',
    description: 'แบบฟอร์มสำหรับแจ้งยุติการศึกษาก่อนกำหนด พร้อมเหตุผล ผลกระทบ และแผนการชดใช้ทุน',
  },
  {
    id: 'EF-18', code: 'EF-18', name: 'แบบฟอร์มขอระงับทุนการศึกษา', nameEn: 'Scholarship Suspension Request',
    categoryId: 'monitoring', fields: 11, status: 'active', version: '1.2', linkedWorkflow: 'Workflow ระงับ/ปิดทุน',
    approvalSteps: 5, usageCount: 28, lastUsed: '08/02/2569', updatedDate: '05/02/2569',
    description: 'แบบฟอร์มขอระงับการให้ทุนชั่วคราว กรณีนักเรียนทุนผิดเงื่อนไข หรือมีปัญหาที่ต้องสอบสวน',
  },
  {
    id: 'EF-19', code: 'EF-19', name: 'แบบฟอร์มแจ้งเตือนผิดเงื่อนไขสัญญา', nameEn: 'Contract Violation Notice',
    categoryId: 'monitoring', fields: 14, status: 'active', version: '1.1', linkedWorkflow: 'Workflow ระงับ/ปิดทุน',
    approvalSteps: 4, usageCount: 42, lastUsed: '15/02/2569', updatedDate: '12/02/2569',
    description: 'แบบฟอร์มแจ้งเตือนกรณีนักเรียนทุนผิดเงื่อนไขสัญญา เช่น ไม่รายงานตัว ผลการเรียนไม่ถึงเกณฑ์ ทำกิจกรรมนอกเงื่อนไข',
  },

  // === สำเร็จ/ชดใช้ทุน ===
  {
    id: 'EF-20', code: 'EF-20', name: 'แบบฟอร์มแจ้งสำเร็จการศึกษา', nameEn: 'Graduation Notification',
    categoryId: 'completion', fields: 10, status: 'active', version: '2.0', linkedWorkflow: '-',
    approvalSteps: 2, usageCount: 312, lastUsed: '22/02/2569', updatedDate: '15/02/2569',
    description: 'แบบฟอร์มแจ้งสำเร็จการศึกษา แนบเอกสารจบการศึกษา ใบปริญญา ผลการเรียนสุดท้าย',
  },
  {
    id: 'EF-21', code: 'EF-21', name: 'แบบฟอร์มรายงานตัวกลับเข้าทำงาน', nameEn: 'Return to Work Report',
    categoryId: 'completion', fields: 12, status: 'active', version: '1.8', linkedWorkflow: '-',
    approvalSteps: 3, usageCount: 278, lastUsed: '20/02/2569', updatedDate: '14/02/2569',
    description: 'แบบฟอร์มรายงานตัวเข้าปฏิบัติราชการ/ทำงานในหน่วยงานต้นสังกัดหลังสำเร็จการศึกษา ตามเงื่อนไขสัญญาทุน',
  },
  {
    id: 'EF-22', code: 'EF-22', name: 'แบบฟอร์มรายงานการชดใช้ทุน', nameEn: 'Scholarship Repayment Report',
    categoryId: 'completion', fields: 15, status: 'active', version: '1.5', linkedWorkflow: '-',
    approvalSteps: 3, usageCount: 187, lastUsed: '18/02/2569', updatedDate: '10/02/2569',
    description: 'แบบฟอร์มรายงานสถานะการชดใช้ทุน ระยะเวลาที่ปฏิบัติงาน จำนวนปีที่เหลือ และหลักฐานการปฏิบัติงาน',
  },
  {
    id: 'EF-23', code: 'EF-23', name: 'แบบฟอร์มขอคืนเงินทุน', nameEn: 'Scholarship Refund Request',
    categoryId: 'completion', fields: 13, status: 'active', version: '1.0', linkedWorkflow: 'Workflow ระงับ/ปิดทุน',
    approvalSteps: 5, usageCount: 15, lastUsed: '05/02/2569', updatedDate: '01/02/2569',
    description: 'แบบฟอร์มกรณีนักเรียนทุนต้องชดใช้เงินทุนคืน เนื่องจากไม่ปฏิบัติตามเงื่อนไข พร้อมแผนการชำระเงิน',
  },
  {
    id: 'EF-24', code: 'EF-24', name: 'แบบฟอร์มขอปิดทุนการศึกษา', nameEn: 'Scholarship Closure Request',
    categoryId: 'completion', fields: 8, status: 'active', version: '1.2', linkedWorkflow: 'Workflow ระงับ/ปิดทุน',
    approvalSteps: 4, usageCount: 145, lastUsed: '19/02/2569', updatedDate: '14/02/2569',
    description: 'แบบฟอร์มขอปิดทุนอย่างเป็นทางการ เมื่อนักเรียนทุนชดใช้ทุนครบตามสัญญาแล้ว',
  },
];

// ===== Custom forms (existing) =====
const customForms = [
  { id: 1, name: 'แบบฟอร์มประเมินความพร้อมก่อนเดินทาง', fields: 15, status: 'active' as const, linkedWorkflow: '-', updatedDate: '15/02/2569' },
  { id: 2, name: 'แบบสอบถามความพึงพอใจนักเรียนทุน', fields: 20, status: 'active' as const, linkedWorkflow: '-', updatedDate: '10/02/2569' },
  { id: 3, name: 'แบบฟอร์มขอข้อมูลเพิ่มเติม (กรณีพิเศษ)', fields: 8, status: 'draft' as const, linkedWorkflow: '-', updatedDate: '05/02/2569' },
];

// ===== Status helpers =====
const formStatusConfig = {
  active: { label: 'ใช้งาน', className: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'ฉบับร่าง', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  archived: { label: 'เก็บถาวร', className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export default function Workflows() {
  const [eformSearch, setEformSearch] = useState('');
  const [eformCategory, setEformCategory] = useState('all');
  const [eformView, setEformView] = useState<'grid' | 'list'>('grid');
  const [selectedForm, setSelectedForm] = useState<PresetForm | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredForms = presetForms.filter(f => {
    const matchSearch = eformSearch === '' ||
      `${f.name} ${f.nameEn} ${f.code} ${f.description}`.toLowerCase().includes(eformSearch.toLowerCase());
    const matchCategory = eformCategory === 'all' || f.categoryId === eformCategory;
    return matchSearch && matchCategory;
  });

  const activeForms = presetForms.filter(f => f.status === 'active').length;
  const totalUsage = presetForms.reduce((sum, f) => sum + f.usageCount, 0);

  const openFormDetail = (form: PresetForm) => {
    setSelectedForm(form);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="Workflow และแบบฟอร์ม"
        breadcrumbs={[
          { label: 'แดชบอร์ด', path: '/' },
          { label: 'Workflow และแบบฟอร์ม' },
        ]}
        actions={
          <div className="flex gap-2">
            <Link to="/workflows/forms">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                สร้างแบบฟอร์มใหม่
              </Button>
            </Link>
            <Link to="/workflows/builder">
              <Button className="gap-2 bg-[#1e3a8a] hover:bg-[#1e40af]">
                <Plus className="h-4 w-4" />
                สร้าง Workflow ใหม่
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="Workflows"
          moduleName="workflows"
          defaultExpanded={false}
          permissions={[
            { permission: 'workflows:view', label: 'ดู Workflows', description: 'ดูรายการ Workflow ทั้งหมด', uiLocation: 'หน้า Workflows หลัก' },
            { permission: 'workflows:create', label: 'สร้าง Workflow', description: 'สร้าง Workflow ใหม่', uiLocation: 'ปุ่ม "สร้าง Workflow ใหม่"' },
            { permission: 'workflows:edit', label: 'แก้ไข Workflow', description: 'แก้ไข Workflow ที่มีอยู่', uiLocation: 'ปุ่ม "แก้ไข"' },
            { permission: 'workflows:delete', label: 'ลบ Workflow', description: 'ลบ Workflow ออกจากระบบ', uiLocation: 'เมนู Actions > ลบ' },
            { permission: 'workflows:activate', label: 'เปิดใช้งาน Workflow', description: 'เปิดหรือปิดใช้งาน Workflow', uiLocation: 'ปุ่ม "เปิดใช้/ปิดใช้"' },
            { permission: 'workflows:view_history', label: 'ดูประวัติ Workflow', description: 'ดูประวัติการเปลี่ยนแปลง Workflow', uiLocation: 'ปุ่ม "ประวัติ"' },
          ]}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Workflows', value: workflows.length, sub: `ใช้งาน ${workflows.filter(w => w.status === 'active').length}`, icon: GitBranch, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Preset e-Forms', value: presetForms.length, sub: `ใช้งาน ${activeForms}`, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Custom Forms', value: customForms.length, sub: `ใช้งาน ${customForms.filter(f => f.status === 'active').length}`, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'จำนวนการใช้งานรวม', value: totalUsage.toLocaleString(), sub: 'ครั้ง (ทุก e-Form)', icon: Send, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{card.value}</p>
                      <p className="text-xs text-gray-500">{card.label}</p>
                      <p className="text-xs text-gray-400">{card.sub}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="eforms" className="space-y-6">
          <TabsList>
            <ProtectedTabsTrigger value="eforms" permission="workflow:view">
              <ClipboardList className="w-4 h-4 mr-2" />Preset e-Forms ({presetForms.length})
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="workflows" permission="workflow:view">
              <GitBranch className="w-4 h-4 mr-2" />Workflows
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="custom" permission="forms:view">
              <FileText className="w-4 h-4 mr-2" />Custom Forms
            </ProtectedTabsTrigger>
          </TabsList>

          {/* ===== TAB: Preset e-Forms ===== */}
          <TabsContent value="eforms">
            <div className="space-y-5">
              {/* Search & Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="ค้นหา e-Form ตามชื่อ รหัส หรือคำอธิบาย..."
                        value={eformSearch}
                        onChange={(e) => setEformSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <button
                        onClick={() => setEformView('grid')}
                        className={`p-2 rounded transition-colors ${eformView === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEformView('list')}
                        className={`p-2 rounded transition-colors ${eformView === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500 mr-1">หมวดหมู่:</span>
                    <button
                      onClick={() => setEformCategory('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        eformCategory === 'all'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ทั้งหมด ({presetForms.length})
                    </button>
                    {formCategories.map(cat => {
                      const count = presetForms.filter(f => f.categoryId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setEformCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            eformCategory === cat.id
                              ? `${cat.bgColor} ${cat.color} shadow-sm border ${cat.borderColor}`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <cat.icon className="w-3 h-3" />
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  แสดง <span className="font-medium text-gray-800">{filteredForms.length}</span> จาก {presetForms.length} แบบฟอร์ม
                </p>
                <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออกรายการ e-Form เรียบร้อย')}>
                  <Download className="w-4 h-4 mr-1" /> ส่งออกรายการ
                </Button>
              </div>

              {/* Grid / List View */}
              {eformView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredForms.map((form, i) => {
                      const cat = formCategories.find(c => c.id === form.categoryId)!;
                      const statusCfg = formStatusConfig[form.status];
                      return (
                        <motion.div
                          key={form.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Card
                            className="hover:shadow-lg transition-all cursor-pointer group border-l-4 h-full"
                            style={{ borderLeftColor: `var(--color-${cat.color.replace('text-', '').replace('-600', '-500')}, #3b82f6)` }}
                            onClick={() => openFormDetail(form)}
                          >
                            <CardContent className="p-5 flex flex-col h-full">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                                  </div>
                                  <div>
                                    <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">{form.code}</Badge>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{cat.name}</p>
                                  </div>
                                </div>
                                <Badge className={`text-[10px] px-2 border ${statusCfg.className}`}>
                                  {statusCfg.label}
                                </Badge>
                              </div>

                              {/* Title */}
                              <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                                {form.name}
                              </h4>
                              <p className="text-[11px] text-gray-400 mb-3">{form.nameEn}</p>

                              {/* Description */}
                              <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">{form.description}</p>

                              {/* Stats */}
                              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                <div className="text-center">
                                  <p className="text-sm font-bold text-gray-700">{form.fields}</p>
                                  <p className="text-[10px] text-gray-400">ฟิลด์</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-gray-700">{form.approvalSteps}</p>
                                  <p className="text-[10px] text-gray-400">ขั้นอนุมัติ</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold text-blue-600">{form.usageCount.toLocaleString()}</p>
                                  <p className="text-[10px] text-gray-400">ครั้งใช้งาน</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                /* List View */
                <Card>
                  <CardContent className="p-0">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-[90px]">รหัส</TableHead>
                            <TableHead>ชื่อแบบฟอร์ม</TableHead>
                            <TableHead>หมวดหมู่</TableHead>
                            <TableHead className="text-center">ฟิลด์</TableHead>
                            <TableHead className="text-center">ขั้นอนุมัติ</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead>เวอร์ชัน</TableHead>
                            <TableHead>Workflow</TableHead>
                            <TableHead className="text-center">ใช้งาน</TableHead>
                            <TableHead className="text-center">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredForms.map((form) => {
                            const cat = formCategories.find(c => c.id === form.categoryId)!;
                            const statusCfg = formStatusConfig[form.status];
                            return (
                              <TableRow key={form.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => openFormDetail(form)}>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">{form.code}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-sm">{form.name}</p>
                                    <p className="text-xs text-gray-400">{form.nameEn}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                                    <span className="text-xs">{cat.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center text-sm">{form.fields}</TableCell>
                                <TableCell className="text-center text-sm">{form.approvalSteps}</TableCell>
                                <TableCell>
                                  <Badge className={`text-[10px] px-2 border ${statusCfg.className}`}>{statusCfg.label}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">v{form.version}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-gray-500 max-w-[150px] truncate">{form.linkedWorkflow}</TableCell>
                                <TableCell className="text-center text-sm font-medium text-blue-600">{form.usageCount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                                    <Button size="sm" variant="ghost" onClick={() => openFormDetail(form)}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Link to={`/workflows/forms/${form.id}`}>
                                      <Button size="sm" variant="ghost">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" onClick={() => toast.success(`สำเนา "${form.code}" เรียบร้อย`)}>
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ===== TAB: Workflows ===== */}
          <TabsContent value="workflows">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  รายการ Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ Workflow</TableHead>
                        <TableHead>ประเภททุน</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>เวอร์ชัน</TableHead>
                        <TableHead>จำนวนขั้นตอน</TableHead>
                        <TableHead>e-Forms เชื่อมต่อ</TableHead>
                        <TableHead>อัปเดตล่าสุด</TableHead>
                        <TableHead className="text-center">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workflows.map((workflow) => {
                        const linkedCount = presetForms.filter(f => f.linkedWorkflow === workflow.name).length;
                        return (
                          <TableRow key={workflow.id} className="hover:bg-blue-50/50">
                            <TableCell className="font-medium">{workflow.name}</TableCell>
                            <TableCell>{workflow.type}</TableCell>
                            <TableCell><StatusBadge status={workflow.status} /></TableCell>
                            <TableCell><Badge variant="outline">v{workflow.version}</Badge></TableCell>
                            <TableCell className="text-center">{workflow.states}</TableCell>
                            <TableCell>
                              {linkedCount > 0 ? (
                                <Badge className="bg-blue-100 text-blue-700 border border-blue-200">{linkedCount} ฟอร์ม</Badge>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{workflow.updatedDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Link to={`/workflows/builder/${workflow.id}`}>
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <Edit className="h-4 w-4" /> แก้ไข
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => toast.success(`สำเนา "${workflow.name}" เรียบร้อย`)}>
                                  <Copy className="h-4 w-4" /> สำเนา
                                </Button>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => toast.info(`ประวัติเวอร์ชัน: ${workflow.name} (v${workflow.version})`)}>
                                  <History className="h-4 w-4" /> ประวัติ
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: Custom Forms ===== */}
          <TabsContent value="custom">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Custom Forms (แบบฟอร์มกำหนดเอง)
                  </CardTitle>
                  <Link to="/workflows/forms">
                    <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4" /> สร้างแบบฟอร์มใหม่
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อแบบฟอร์ม</TableHead>
                        <TableHead>จำนวนฟิลด์</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>เชื่อมกับ Workflow</TableHead>
                        <TableHead>อัปเดตล่าสุด</TableHead>
                        <TableHead className="text-center">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customForms.map((form) => (
                        <TableRow key={form.id} className="hover:bg-blue-50/50">
                          <TableCell className="font-medium">{form.name}</TableCell>
                          <TableCell>{form.fields} ฟิลด์</TableCell>
                          <TableCell><StatusBadge status={form.status} /></TableCell>
                          <TableCell className="text-sm text-gray-600">{form.linkedWorkflow}</TableCell>
                          <TableCell className="text-sm text-gray-600">{form.updatedDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Link to={`/workflows/forms/${form.id}`}>
                                <Button size="sm" variant="outline" className="gap-2">
                                  <Edit className="h-4 w-4" /> แก้ไข
                                </Button>
                              </Link>
                              <Button size="sm" variant="outline" className="gap-2" onClick={() => toast.success(`สำเนาแบบฟอร์ม "${form.name}" เรียบร้อย`)}>
                                <Copy className="h-4 w-4" /> สำเนา
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== e-Form Detail Dialog ===== */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          {selectedForm && (() => {
            const cat = formCategories.find(c => c.id === selectedForm.categoryId)!;
            const statusCfg = formStatusConfig[selectedForm.status];
            return (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0`}>
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 font-mono text-xs">{selectedForm.code}</Badge>
                        <Badge className={`border text-xs ${statusCfg.className}`}>{statusCfg.label}</Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">v{selectedForm.version}</Badge>
                      </div>
                      <DialogTitle className="text-white text-lg leading-snug">{selectedForm.name}</DialogTitle>
                      <p className="text-blue-200 text-sm mt-1">{selectedForm.nameEn}</p>
                    </div>
                  </div>
                  <DialogDescription className="sr-only">รายละเอียด e-Form</DialogDescription>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                  {/* Description */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-800">{selectedForm.description}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'จำนวนฟิลด์', value: selectedForm.fields, icon: FileText, color: 'blue' },
                      { label: 'ขั้นตอนอนุมัติ', value: selectedForm.approvalSteps, icon: CheckCircle2, color: 'green' },
                      { label: 'จำนวนการใช้งาน', value: selectedForm.usageCount.toLocaleString(), icon: Send, color: 'purple' },
                      { label: 'ใช้งานล่าสุด', value: selectedForm.lastUsed, icon: Clock, color: 'amber' },
                    ].map((stat) => (
                      <div key={stat.label} className={`p-4 rounded-xl border bg-${stat.color}-50 border-${stat.color}-100`}>
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                          <p className={`text-[11px] text-${stat.color}-600 font-medium uppercase tracking-wide`}>{stat.label}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        ข้อมูลทั่วไป
                      </h4>
                      <div className="space-y-3">
                        <DetailRow label="หมวดหมู่" value={cat.name} />
                        <DetailRow label="เวอร์ชัน" value={`v${selectedForm.version}`} />
                        <DetailRow label="อัปเดตล่าสุด" value={selectedForm.updatedDate} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-gray-400" />
                        Workflow ที่เชื่อมต่อ
                      </h4>
                      <div className="space-y-3">
                        <DetailRow label="Workflow" value={selectedForm.linkedWorkflow} />
                        <DetailRow label="ขั้นตอนอนุมัติ" value={`${selectedForm.approvalSteps} ขั้นตอน`} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Approval Flow Preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      ลำดับการอนุมัติ (ตัวอย่าง)
                    </h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {getApprovalSteps(selectedForm.approvalSteps).map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 whitespace-nowrap">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                              {i + 1}
                            </div>
                            <span className="text-xs text-gray-700">{step}</span>
                          </div>
                          {i < selectedForm.approvalSteps - 1 && (
                            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">อัปเดตล่าสุด: {selectedForm.updatedDate}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { toast.success(`สำเนา "${selectedForm.code}" เรียบร้อย`); }}>
                      <Copy className="w-4 h-4 mr-1" /> สำเนา
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDetailOpen(false)}>ปิด</Button>
                    <Link to={`/workflows/forms/${selectedForm.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="w-4 h-4 mr-1" /> แก้ไขแบบฟอร์ม
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Helper Components =====
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <p className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}

function getApprovalSteps(count: number): string[] {
  const allSteps = [
    'ผู้ยื่นคำขอ',
    'หัวหน้างาน',
    'เจ้าหน้าที่ทุน',
    'คณะกรรมการ',
    'ผู้อำนวยการ',
    'เลขาธิการ ก.พ.',
  ];
  return allSteps.slice(0, count);
}