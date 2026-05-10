import { useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Users, Key, Lock, UserPlus, Edit, Trash2, CheckCircle,
  XCircle, AlertCircle, Clock, Search, Eye, EyeOff, Activity,
  AlertTriangle, Settings, FileText, Download, RefreshCw, Copy,
  Plus, ToggleLeft, Globe, Smartphone, Mail, Filter, Layers,
  FolderOpen, ChevronRight, ChevronDown, Save, Info, Columns3,
  EyeIcon, PenLine, Ban, Unlock, ArrowRight, Hash, List,
  ClipboardList, UserCheck, UsersRound, Building, GitBranch,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

// ===== Users =====
const users = [
  { id: 1, name: 'นางสาวพิมพ์พร เจ้าหน้าที่', email: 'pimporn@scholarship.go.th', role: 'เจ้าหน้าที่ทุน', department: 'กองทุนการศึกษา', status: 'active', lastLogin: '20/02/2569 14:30', mfa: true, loginAttempts: 0, groups: ['GRP-STAFF', 'GRP-OVERSEAS'] },
  { id: 2, name: 'นายสมศักดิ์ ผู้จัดการ', email: 'somsak@scholarship.go.th', role: 'ผู้จัดการส่วน', department: 'กองทุนการศึกษา', status: 'active', lastLogin: '20/02/2569 10:15', mfa: true, loginAttempts: 0, groups: ['GRP-MANAGER'] },
  { id: 3, name: 'ศ.ดร.วิภา นักวิชาการ', email: 'wipa@scholarship.go.th', role: 'กรรมการพิจารณา', department: 'คณะกรรมการ', status: 'active', lastLogin: '19/02/2569 16:00', mfa: false, loginAttempts: 0, groups: ['GRP-COMMITTEE'] },
  { id: 4, name: 'นายประสิทธิ์ ผู้ดูแล', email: 'prasit@scholarship.go.th', role: 'ผู้ดูแลระบบ', department: 'IT', status: 'active', lastLogin: '20/02/2569 15:45', mfa: true, loginAttempts: 0, groups: ['GRP-ADMIN'] },
  { id: 5, name: 'นางสาวกนกวรรณ นักวิเคราะห์', email: 'kanokwan@scholarship.go.th', role: 'เจ้าหน้าที่ทุน', department: 'กองทุนวิจัย', status: 'active', lastLogin: '20/02/2569 09:00', mfa: true, loginAttempts: 0, groups: ['GRP-STAFF', 'GRP-RESEARCH'] },
  { id: 6, name: 'นายวิชัย สมบูรณ์', email: 'wichai@scholarship.go.th', role: 'ผู้บริหาร', department: 'ผู้บริหาร', status: 'active', lastLogin: '18/02/2569 11:30', mfa: true, loginAttempts: 0, groups: ['GRP-EXEC'] },
  { id: 7, name: 'นางสมใจ ทดสอบ', email: 'somjai@scholarship.go.th', role: 'เจ้าหน้าที่ทุน', department: 'กองทุนพัฒนา', status: 'suspended', lastLogin: '10/02/2569 08:00', mfa: false, loginAttempts: 5, groups: ['GRP-STAFF'] },
  { id: 8, name: 'นายทดสอบ ระบบ', email: 'test@scholarship.go.th', role: 'เจ้าหน้าที่ทุน', department: 'IT', status: 'inactive', lastLogin: '01/01/2569', mfa: false, loginAttempts: 0, groups: [] },
];

// ===== Roles =====
const roles = [
  { id: 1, name: 'ผู้ดูแลระบบ', code: 'ADMIN', userCount: 2, permissions: ['จัดการผู้ใช้', 'จัดการ Role', 'ตั้งค่าระบบ', 'ดู Audit Log', 'จัดการ API', 'จัดการ Workflow', 'จัดการ Master Data', 'ดูรายงาน', 'จัดการทุน', 'อนุมัติทุน'], description: 'สิทธิ์ทั้งหมดในระบบ' },
  { id: 2, name: 'ผู้บริหาร', code: 'EXEC', userCount: 1, permissions: ['ดูแดชบอร์ด Executive', 'ดูรายงาน', 'อนุมัติทุน', 'ดู Audit Log'], description: 'ดูภาพรวมและอนุมัติ' },
  { id: 3, name: 'ผู้จัดการส่วน', code: 'MANAGER', userCount: 1, permissions: ['ดูแดชบอร์ด', 'จัดการใบสมัคร', 'ตรวจเอกสาร', 'พิจารณาทุน', 'อนุมัติทุน', 'จัดการทุน/สัญญา', 'จ่ายเงิน', 'ติดตามผล', 'ดูรายงาน', 'ดู Audit Log'], description: 'จัดการทุนทั้งหมด + อนุมัติ' },
  { id: 4, name: 'เจ้าหน้าที่ทุน', code: 'STAFF', userCount: 3, permissions: ['ดูแดชบอร์ด', 'จัดการใบสมัคร', 'ตรวจเอกสาร', 'จ่ายเงิน', 'ติดตามผล', 'การสื่อสาร'], description: 'ดำเนินงานทุนประจำวัน' },
  { id: 5, name: 'กรรมการพิจารณา', code: 'REVIEWER', userCount: 1, permissions: ['ดูแดชบอร์ด Approver', 'พิจารณาทุน', 'ให้คะแนน', 'ดูข้อมูลผู้สมัคร'], description: 'พิจารณาและให้คะแนนใบสมัคร' },
  { id: 6, name: 'เจ้าหน้าที่การเงิน', code: 'FINANCE', userCount: 0, permissions: ['ดูแดชบอร์ด', 'จ่ายเงิน', 'ดูรายงาน'], description: 'จัดการด้านการเงินและการเบิกจ่าย' },
  { id: 7, name: 'ผู้ตรวจสอบ', code: 'AUDITOR', userCount: 0, permissions: ['ดูแดชบอร์ด', 'ดูรายงาน', 'ดู Audit Log'], description: 'ตรวจสอบและรายงาน (Read-Only)' },
];

const allPermissions = [
  { group: 'แดชบอร์ด', items: ['ดูแดชบอร์ด', 'ดูแดชบอร์ด Approver', 'ดูแดชบอร์ด Executive'] },
  { group: 'ใบสมัคร', items: ['จัดการใบสมัคร', 'ตรวจเอกสาร', 'ดูข้อมูลผู้สมัคร'] },
  { group: 'พิจารณา/อนุมัติ', items: ['พิจารณาทุน', 'ให้คะแนน', 'อนุมัติทุน'] },
  { group: 'ทุน/สัญญา', items: ['จัดการทุน/สัญญา', 'จ่ายเงิน', 'ติดตามผล'] },
  { group: 'รายงาน', items: ['ดูรายงาน', 'ส่งออกรายงาน'] },
  { group: 'ระบบ', items: ['จัดการผู้ใช้', 'จัดการ Role', 'ตั้งค่าระบบ', 'ดู Audit Log', 'จัดการ API', 'จัดการ Workflow', 'จัดการ Master Data'] },
  { group: 'อื่นๆ', items: ['การสื่อสาร'] },
];

// ===== Groups =====
interface UserGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  memberCount: number;
  roles: string[];
  conditions: string[];
  icon: React.ElementType;
  color: string;
  bgColor: string;
  status: 'active' | 'inactive';
}

const userGroups: UserGroup[] = [
  { id: 'GRP-ADMIN', name: 'ผู้ดูแลระบบ', code: 'GRP-ADMIN', description: 'กลุ่มผู้ดูแลระบบและ IT', memberCount: 2, roles: ['ADMIN'], conditions: ['department = IT'], icon: Settings, color: 'text-red-600', bgColor: 'bg-red-50', status: 'active' },
  { id: 'GRP-EXEC', name: 'ผู้บริหาร', code: 'GRP-EXEC', description: 'กลุ่มผู้บริหารระดับสูง', memberCount: 1, roles: ['EXEC'], conditions: ['position_level >= ผู้อำนวยการ'], icon: Building, color: 'text-purple-600', bgColor: 'bg-purple-50', status: 'active' },
  { id: 'GRP-MANAGER', name: 'ผู้จัดการส่วน', code: 'GRP-MANAGER', description: 'กลุ่มหัวหน้างานและผู้จัดการ', memberCount: 1, roles: ['MANAGER'], conditions: ['position_level = ผู้จัดการ'], icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', status: 'active' },
  { id: 'GRP-STAFF', name: 'เจ้าหน้าที่ทุน', code: 'GRP-STAFF', description: 'เจ้าหน้าที่ปฏิบัติงานทุนทุกกอง', memberCount: 4, roles: ['STAFF'], conditions: ['role = เจ้าหน้าที่ทุน'], icon: Users, color: 'text-green-600', bgColor: 'bg-green-50', status: 'active' },
  { id: 'GRP-COMMITTEE', name: 'คณะกรรมการ', code: 'GRP-COMMITTEE', description: 'คณะกรรมการพิจารณาทุน', memberCount: 1, roles: ['REVIEWER'], conditions: ['department = คณะกรรมการ', 'appointment_date <= today'], icon: UsersRound, color: 'text-amber-600', bgColor: 'bg-amber-50', status: 'active' },
  { id: 'GRP-OVERSEAS', name: 'ทุนต่างประเทศ', code: 'GRP-OVERSEAS', description: 'เจ้าหน้าที่รับผิดชอบทุนต่างประเทศ', memberCount: 2, roles: ['STAFF', 'MANAGER'], conditions: ['scholarship_type = ทุนต่างประเทศ'], icon: Globe, color: 'text-cyan-600', bgColor: 'bg-cyan-50', status: 'active' },
  { id: 'GRP-RESEARCH', name: 'ทุนวิจัย', code: 'GRP-RESEARCH', description: 'เจ้าหน้าที่รับผิดชอบทุนวิจัย', memberCount: 1, roles: ['STAFF', 'MANAGER'], conditions: ['scholarship_type = ทุนวิจัย'], icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50', status: 'active' },
  { id: 'GRP-FINANCE', name: 'การเงิน', code: 'GRP-FINANCE', description: 'เจ้าหน้าที่ด้านการเงินและเบิกจ่าย', memberCount: 0, roles: ['FINANCE'], conditions: ['department = การเงิน'], icon: Key, color: 'text-emerald-600', bgColor: 'bg-emerald-50', status: 'active' },
];

// ===== Form & Field Level ACL =====
type FieldAccess = 'full' | 'read' | 'hidden';

interface FormField {
  id: string;
  name: string;
  type: string;
  sensitive: boolean;
}

interface FormACL {
  id: string;
  formCode: string;
  formName: string;
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  fields: FormField[];
  roleAccess: Record<string, { formAccess: 'full' | 'read' | 'none'; fieldOverrides: Record<string, FieldAccess> }>;
  conditionalRules: { id: string; name: string; condition: string; effect: string; enabled: boolean }[];
}

const formACLs: FormACL[] = [
  {
    id: 'acl-ef01',
    formCode: 'EF-01',
    formName: 'แบบฟอร์มสมัครทุนการศึกษาต่างประเทศ',
    category: 'การสมัครทุน',
    categoryIcon: ClipboardList,
    categoryColor: 'text-blue-600',
    fields: [
      { id: 'f1', name: 'ชื่อ-นามสกุล', type: 'text', sensitive: false },
      { id: 'f2', name: 'เลขบัตรประชาชน', type: 'id', sensitive: true },
      { id: 'f3', name: 'ที่อยู่', type: 'address', sensitive: true },
      { id: 'f4', name: 'เบอร์โทรศัพท์', type: 'phone', sensitive: true },
      { id: 'f5', name: 'อีเมล', type: 'email', sensitive: false },
      { id: 'f6', name: 'สถาบันที่ต้องการศึกษา', type: 'text', sensitive: false },
      { id: 'f7', name: 'สาขาวิชา', type: 'text', sensitive: false },
      { id: 'f8', name: 'ประเทศ', type: 'select', sensitive: false },
      { id: 'f9', name: 'ผลการเรียน (GPA)', type: 'number', sensitive: false },
      { id: 'f10', name: 'แผนการศึกษา', type: 'textarea', sensitive: false },
      { id: 'f11', name: 'จดหมายแนะนำ', type: 'file', sensitive: false },
      { id: 'f12', name: 'เอกสารทางการเงิน', type: 'file', sensitive: true },
    ],
    roleAccess: {
      ADMIN: { formAccess: 'full', fieldOverrides: {} },
      EXEC: { formAccess: 'read', fieldOverrides: { f2: 'hidden', f3: 'hidden', f12: 'hidden' } },
      MANAGER: { formAccess: 'full', fieldOverrides: { f2: 'read' } },
      STAFF: { formAccess: 'full', fieldOverrides: { f2: 'read', f12: 'read' } },
      REVIEWER: { formAccess: 'read', fieldOverrides: { f2: 'hidden', f3: 'hidden', f4: 'hidden', f12: 'hidden' } },
      FINANCE: { formAccess: 'read', fieldOverrides: { f2: 'hidden', f3: 'hidden', f10: 'hidden', f11: 'hidden' } },
      AUDITOR: { formAccess: 'read', fieldOverrides: {} },
    },
    conditionalRules: [
      { id: 'cr1', name: 'ซ่อน PII สำหรับกรรมการ', condition: 'role = REVIEWER', effect: 'ซ่อนฟิลด์ข้อมูลส่วนบุคคล (เลขบัตร, ที่อยู่, เบอร์โทร)', enabled: true },
      { id: 'cr2', name: 'เปิดแก้ไขเฉพาะช่วงรับสมัคร', condition: 'application_period = open AND role IN (STAFF, MANAGER)', effect: 'อนุญาตแก้ไขทุกฟิลด์ (ยกเว้นเลขบัตร)', enabled: true },
      { id: 'cr3', name: 'ล็อกหลังส่งใบสมัคร', condition: 'application_status = submitted', effect: 'ล็อกทุกฟิลด์เป็น Read-only สำหรับทุก Role', enabled: true },
    ],
  },
  {
    id: 'acl-ef06',
    formCode: 'EF-06',
    formName: 'แบบฟอร์มขอขยายเวลาการศึกษา',
    category: 'ระหว่างศึกษา',
    categoryIcon: FileText,
    categoryColor: 'text-indigo-600',
    fields: [
      { id: 'f1', name: 'ชื่อนักเรียนทุน', type: 'text', sensitive: false },
      { id: 'f2', name: 'รหัสทุน', type: 'code', sensitive: false },
      { id: 'f3', name: 'ระยะเวลาขอขยาย', type: 'select', sensitive: false },
      { id: 'f4', name: 'เหตุผลการขอขยาย', type: 'textarea', sensitive: false },
      { id: 'f5', name: 'แผนการศึกษาที่ปรับปรุง', type: 'file', sensitive: false },
      { id: 'f6', name: 'หนังสือรับรองอาจารย์ที่ปรึกษา', type: 'file', sensitive: false },
      { id: 'f7', name: 'ผลกระทบด้านงบประมาณ', type: 'number', sensitive: false },
      { id: 'f8', name: 'ความเห็นเจ้าหน้าที่', type: 'textarea', sensitive: false },
    ],
    roleAccess: {
      ADMIN: { formAccess: 'full', fieldOverrides: {} },
      EXEC: { formAccess: 'read', fieldOverrides: {} },
      MANAGER: { formAccess: 'full', fieldOverrides: {} },
      STAFF: { formAccess: 'full', fieldOverrides: { f7: 'read' } },
      REVIEWER: { formAccess: 'read', fieldOverrides: { f7: 'hidden' } },
      FINANCE: { formAccess: 'read', fieldOverrides: { f4: 'hidden', f5: 'hidden' } },
      AUDITOR: { formAccess: 'read', fieldOverrides: {} },
    },
    conditionalRules: [
      { id: 'cr1', name: 'อนุมัติได้เฉพาะผู้จัดการขึ้นไป', condition: 'role IN (MANAGER, EXEC, ADMIN)', effect: 'เปิดปุ่มอนุมัติ/ปฏิเสธ', enabled: true },
      { id: 'cr2', name: 'ต้องแนบเอกสารครบ', condition: 'attachments_count < 2', effect: 'ไม่อนุญาตให้ส่งฟอร์ม แสดง Warning', enabled: true },
    ],
  },
  {
    id: 'acl-ef13',
    formCode: 'EF-13',
    formName: 'แบบฟอร์มขอเบิกค่าใช้จ่ายประจำเดือน',
    category: 'การเงิน/ค่าใช้จ่าย',
    categoryIcon: Key,
    categoryColor: 'text-green-600',
    fields: [
      { id: 'f1', name: 'ชื่อนักเรียนทุน', type: 'text', sensitive: false },
      { id: 'f2', name: 'เลขที่บัญชีธนาคาร', type: 'bank', sensitive: true },
      { id: 'f3', name: 'จำนวนเงินค่าเล่าเรียน', type: 'currency', sensitive: false },
      { id: 'f4', name: 'จำนวนเงินค่าครองชีพ', type: 'currency', sensitive: false },
      { id: 'f5', name: 'จำนวนเงินค่าที่พัก', type: 'currency', sensitive: false },
      { id: 'f6', name: 'ค่าประกันสุขภาพ', type: 'currency', sensitive: false },
      { id: 'f7', name: 'ใบเสร็จ/หลักฐาน', type: 'file', sensitive: false },
      { id: 'f8', name: 'หมายเหตุ', type: 'textarea', sensitive: false },
    ],
    roleAccess: {
      ADMIN: { formAccess: 'full', fieldOverrides: {} },
      EXEC: { formAccess: 'read', fieldOverrides: { f2: 'hidden' } },
      MANAGER: { formAccess: 'full', fieldOverrides: { f2: 'read' } },
      STAFF: { formAccess: 'full', fieldOverrides: { f2: 'hidden' } },
      REVIEWER: { formAccess: 'none', fieldOverrides: {} },
      FINANCE: { formAccess: 'full', fieldOverrides: {} },
      AUDITOR: { formAccess: 'read', fieldOverrides: { f2: 'hidden' } },
    },
    conditionalRules: [
      { id: 'cr1', name: 'ซ่อนเลขบัญชีสำหรับ Non-Finance', condition: 'role NOT IN (ADMIN, FINANCE, MANAGER)', effect: 'ซ่อนฟิลด์เลขที่บัญชีธนาคาร', enabled: true },
      { id: 'cr2', name: 'ต้องอนุมัติโดยการเงิน', condition: 'amount > 50000', effect: 'ต้องผ่านการอนุมัติจากเจ้าหน้าที่การเงินก่อน', enabled: true },
      { id: 'cr3', name: 'จำกัดวงเงินต่อเดือน', condition: 'total_monthly > budget_limit', effect: 'แสดง Warning + ต้องอนุมัติพิเศษจากผู้บริหาร', enabled: true },
    ],
  },
  {
    id: 'acl-ef16',
    formCode: 'EF-16',
    formName: 'แบบฟอร์มรายงานการเฝ้าระวัง (Watch List)',
    category: 'ติดตาม/เฝ้าระวัง',
    categoryIcon: Shield,
    categoryColor: 'text-red-600',
    fields: [
      { id: 'f1', name: 'ชื่อนักเรียนทุน', type: 'text', sensitive: false },
      { id: 'f2', name: 'ระดับเฝ้าระวัง', type: 'select', sensitive: false },
      { id: 'f3', name: 'เหตุผลการเข้า Watch List', type: 'textarea', sensitive: false },
      { id: 'f4', name: 'ผลการเรียนล่าสุด', type: 'number', sensitive: false },
      { id: 'f5', name: 'สถานะการส่งรายงาน', type: 'select', sensitive: false },
      { id: 'f6', name: 'ประวัติการติดต่อ', type: 'textarea', sensitive: false },
      { id: 'f7', name: 'แผนปรับปรุง', type: 'file', sensitive: false },
      { id: 'f8', name: 'ข้อเสนอแนะ', type: 'textarea', sensitive: false },
      { id: 'f9', name: 'มติคณะกรรมการ', type: 'textarea', sensitive: false },
    ],
    roleAccess: {
      ADMIN: { formAccess: 'full', fieldOverrides: {} },
      EXEC: { formAccess: 'read', fieldOverrides: {} },
      MANAGER: { formAccess: 'full', fieldOverrides: {} },
      STAFF: { formAccess: 'full', fieldOverrides: { f9: 'read' } },
      REVIEWER: { formAccess: 'read', fieldOverrides: { f9: 'hidden' } },
      FINANCE: { formAccess: 'none', fieldOverrides: {} },
      AUDITOR: { formAccess: 'read', fieldOverrides: {} },
    },
    conditionalRules: [
      { id: 'cr1', name: 'เข้าถึงเฉพาะทุนที่รับผิดชอบ', condition: 'user.assigned_scholarships CONTAINS scholarship_id', effect: 'กรองแสดงเฉพาะนักเรียนทุนที่ตนรับผิดชอบ', enabled: true },
      { id: 'cr2', name: 'มติคณะกรรมการแก้ไขเฉพาะ EXEC', condition: 'role IN (EXEC, ADMIN)', effect: 'เปิดแก้ไขฟิลด์มติคณะกรรมการ', enabled: true },
    ],
  },
  {
    id: 'acl-ef21',
    formCode: 'EF-21',
    formName: 'แบบฟอร์มรายงานตัวกลับเข้าทำงาน',
    category: 'สำเร็จ/ชดใช้ทุน',
    categoryIcon: CheckCircle,
    categoryColor: 'text-emerald-600',
    fields: [
      { id: 'f1', name: 'ชื่อนักเรียนทุน', type: 'text', sensitive: false },
      { id: 'f2', name: 'เลขบัตรประชาชน', type: 'id', sensitive: true },
      { id: 'f3', name: 'หน่วยงานต้นสังกัด', type: 'text', sensitive: false },
      { id: 'f4', name: 'ตำแหน่ง', type: 'text', sensitive: false },
      { id: 'f5', name: 'วันเริ่มปฏิบัติงาน', type: 'date', sensitive: false },
      { id: 'f6', name: 'หนังสือรับรองจากหน่วยงาน', type: 'file', sensitive: false },
      { id: 'f7', name: 'ระยะเวลาชดใช้ทุนที่เหลือ', type: 'text', sensitive: false },
    ],
    roleAccess: {
      ADMIN: { formAccess: 'full', fieldOverrides: {} },
      EXEC: { formAccess: 'read', fieldOverrides: { f2: 'hidden' } },
      MANAGER: { formAccess: 'full', fieldOverrides: {} },
      STAFF: { formAccess: 'full', fieldOverrides: { f2: 'read' } },
      REVIEWER: { formAccess: 'none', fieldOverrides: {} },
      FINANCE: { formAccess: 'read', fieldOverrides: { f2: 'hidden' } },
      AUDITOR: { formAccess: 'read', fieldOverrides: { f2: 'hidden' } },
    },
    conditionalRules: [
      { id: 'cr1', name: 'ต้องแนบหนังสือรับรอง', condition: 'file_f6 = null', effect: 'ไม่อนุญาตให้ส่งฟอร์ม', enabled: true },
    ],
  },
];

// ===== Security Logs =====
const securityLogs = [
  { id: 1, time: '20/02/2569 15:45', event: 'เข้าสู่ระบบสำเร็จ', user: 'นายประสิทธิ์ ผู้ดูแล', ip: '192.168.1.100', device: 'Chrome / Windows', risk: 'low' },
  { id: 2, time: '20/02/2569 14:30', event: 'เข้าสู่ระบบสำเร็จ', user: 'นางสาวพิมพ์พร เจ้าหน้าที่', ip: '192.168.1.45', device: 'Safari / macOS', risk: 'low' },
  { id: 3, time: '20/02/2569 12:15', event: 'เปลี่ยนรหัสผ่าน', user: 'นายสมศักดิ์ ผู้จัดการ', ip: '192.168.1.50', device: 'Chrome / Windows', risk: 'medium' },
  { id: 4, time: '20/02/2569 10:00', event: 'ล็อกอินล้มเหลว (5 ครั้ง)', user: 'นางสมใจ ทดสอบ', ip: '103.45.67.89', device: 'Firefox / Linux', risk: 'high' },
  { id: 5, time: '20/02/2569 09:30', event: 'บัญชีถูกระงับอัตโนมัติ', user: 'นางสมใจ ทดสอบ', ip: '103.45.67.89', device: 'ระบบ', risk: 'high' },
  { id: 6, time: '19/02/2569 16:00', event: 'เข้าสู่ระบบสำเร็จ (MFA)', user: 'ศ.ดร.วิภา นักวิชาการ', ip: '10.0.0.55', device: 'Chrome / macOS', risk: 'low' },
  { id: 7, time: '19/02/2569 14:20', event: 'แก้ไขสิทธิ์ผู้ใช้', user: 'นายประสิทธิ์ ผู้ดูแล', ip: '192.168.1.100', device: 'Chrome / Windows', risk: 'medium' },
  { id: 8, time: '19/02/2569 11:00', event: 'เพิ่มผู้ใช้ใหม่', user: 'นายประสิทธิ์ ผู้ดูแล', ip: '192.168.1.100', device: 'Chrome / Windows', risk: 'medium' },
];

const defaultPolicies = {
  passwordMinLength: 12, passwordRequireUppercase: true, passwordRequireLowercase: true,
  passwordRequireNumber: true, passwordRequireSpecial: true, passwordExpireDays: 90,
  mfaRequired: true, sessionTimeoutMinutes: 30, maxLoginAttempts: 5,
  lockoutDurationMinutes: 30, ipWhitelistEnabled: false, auditLogRetentionDays: 365,
};

// ===== Field Access Icons =====
const fieldAccessConfig: Record<FieldAccess, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  full: { icon: PenLine, label: 'อ่าน+แก้ไข', color: 'text-green-700', bg: 'bg-green-100' },
  read: { icon: EyeIcon, label: 'อ่านอย่างเดียว', color: 'text-blue-700', bg: 'bg-blue-100' },
  hidden: { icon: EyeOff, label: 'ซ่อน', color: 'text-gray-500', bg: 'bg-gray-100' },
};

const formAccessConfig = {
  full: { label: 'เต็มสิทธิ์', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  read: { label: 'อ่านอย่างเดียว', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  none: { label: 'ไม่มีสิทธิ์', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
};

// ===== Main Component =====
export default function Security() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [policies, setPolicies] = useState(defaultPolicies);
  const [selectedACLForm, setSelectedACLForm] = useState<string | null>(formACLs[0]?.id || null);
  const [aclSelectedRole, setAclSelectedRole] = useState<string>('STAFF');
  const [expandedACLFields, setExpandedACLFields] = useState(true);
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [addCondRuleOpen, setAddCondRuleOpen] = useState(false);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return <Badge className="bg-red-100 text-red-700">สูง</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700">ปานกลาง</Badge>;
      default: return <Badge className="bg-green-100 text-green-700">ต่ำ</Badge>;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />ใช้งาน</Badge>;
      case 'suspended': return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />ระงับ</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700"><Clock className="w-3 h-3 mr-1" />ปิดใช้</Badge>;
    }
  };

  const currentACL = formACLs.find(f => f.id === selectedACLForm);

  return (
    <div className="min-h-full">
      <PageHeader
        title="ความปลอดภัยและสิทธิ์ (RBAC)"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'ความปลอดภัยและสิทธิ์' }]}
        actions={
          <Button variant="outline" onClick={() => toast.success('ส่งออกรายงานความปลอดภัย')}>
            <Download className="w-4 h-4 mr-2" />ส่งออกรายงาน
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="ความปลอดภัย & RBAC"
          moduleName="security"
          defaultExpanded={false}
          permissions={[
            { permission: 'security:view', label: 'ดูความปลอดภัย', description: 'ดูข้อมูลความปลอดภัยระบบ', uiLocation: 'หน้าความปลอดภัยหลัก' },
            { permission: 'roles:view', label: 'ดูบทบาท', description: 'ดูรายการบทบาททั้งหมด', uiLocation: 'Tab "บทบาท"' },
            { permission: 'roles:create', label: 'สร้างบทบาท', description: 'สร้างบทบาทใหม่', uiLocation: 'ปุ่ม "สร้างบทบาทใหม่"' },
            { permission: 'roles:edit', label: 'แก้ไขบทบาท', description: 'แก้ไขข้อมูลบทบาท', uiLocation: 'ปุ่ม "แก้ไข"' },
            { permission: 'roles:delete', label: 'ลบบทบาท', description: 'ลบบทบาทออกจากระบบ', uiLocation: 'ปุ่ม "ลบ"' },
            { permission: 'permissions:view', label: 'ดูสิทธิ์', description: 'ดูรายการสิทธิ์ทั้งหมด', uiLocation: 'Tab "สิทธิ์"' },
            { permission: 'permissions:assign', label: 'กำหนดสิทธิ์', description: 'กำหนดสิทธิ์ให้บทบาท', uiLocation: 'Matrix สิทธิ์' },
            { permission: 'audit:view', label: 'ดู Audit Log', description: 'ดูประวัติการใช้งานระบบ', uiLocation: 'Tab "Audit Log"' },
            { permission: 'security:configure', label: 'ตั้งค่าความปลอดภัย', description: 'กำหนดค่าระบบความปลอดภัย', uiLocation: 'Tab "Security Settings"' },
          ]}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'ผู้ใช้', value: `${users.length}`, sub: `ใช้งาน ${users.filter(u => u.status === 'active').length}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'บทบาท', value: `${roles.length}`, sub: 'กลุ่มสิทธิ์', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'กลุ่มผู้ใช้', value: `${userGroups.length}`, sub: `ใช้งาน ${userGroups.filter(g => g.status === 'active').length}`, icon: UsersRound, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Form ACL', value: `${formACLs.length}`, sub: 'แบบฟอร์มที่กำหนดสิทธิ์', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'MFA เปิดใช้', value: `${Math.round(users.filter(u => u.mfa).length / users.length * 100)}%`, sub: `${users.filter(u => u.mfa).length}/${users.length}`, icon: Lock, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'ภัยคุกคาม', value: '2', sub: '24 ชม. ล่าสุด', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{card.value}</p>
                      <p className="text-[10px] text-gray-500">{card.label}</p>
                      <p className="text-[10px] text-gray-400">{card.sub}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ===== Main Tabs ===== */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <ProtectedTabsTrigger value="users" permission="users:view"><Users className="w-4 h-4 mr-1.5" />ผู้ใช้</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="roles" permission="roles:view"><Shield className="w-4 h-4 mr-1.5" />บทบาท/สิทธิ์</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="groups" permission="roles:view"><UsersRound className="w-4 h-4 mr-1.5" />กลุ่มผู้ใช้</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="form-acl" permission="permissions:view"><Layers className="w-4 h-4 mr-1.5" />สิทธิ์ฟอร์ม/ฟิลด์</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="logs" permission="audit:view"><Activity className="w-4 h-4 mr-1.5" />Security Log</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="policies" permission="security:view"><Settings className="w-4 h-4 mr-1.5" />นโยบาย</ProtectedTabsTrigger>
          </TabsList>

          {/* ==================== USERS TAB ==================== */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" />รายการผู้ใช้งานระบบ ({users.length} คน)</CardTitle>
                  <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                    <DialogTrigger asChild><Button><UserPlus className="w-4 h-4 mr-2" />เพิ่มผู้ใช้</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                        <DialogTitle className="text-white text-lg flex items-center gap-2"><UserPlus className="w-5 h-5" />เพิ่มผู้ใช้ใหม่</DialogTitle>
                        <DialogDescription className="text-blue-100 mt-1">กรอกข้อมูลผู้ใช้ที่ต้องการเพิ่มเข้าระบบ</DialogDescription>
                      </div>
                      <div className="px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>ชื่อ-นามสกุล</Label><Input placeholder="กรอกชื่อ-นามสกุล" /></div>
                          <div className="space-y-2"><Label>อีเมล</Label><Input type="email" placeholder="user@scholarship.go.th" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>บทบาท</Label><Select><SelectTrigger><SelectValue placeholder="เลือกบทบาท" /></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.code}>{r.name}</SelectItem>)}</SelectContent></Select></div>
                          <div className="space-y-2"><Label>กลุ่มผู้ใช้</Label><Select><SelectTrigger><SelectValue placeholder="เลือกกลุ่ม" /></SelectTrigger><SelectContent>{userGroups.map(g => <SelectItem key={g.id} value={g.code}>{g.name}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="space-y-2"><Label>หน่วยงาน</Label><Select><SelectTrigger><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger><SelectContent><SelectItem value="scholarship">กองทุนการศึกษา</SelectItem><SelectItem value="research">กองทุนวิจัย</SelectItem><SelectItem value="dev">กองทุนพัฒนา</SelectItem><SelectItem value="committee">คณะกรรมการ</SelectItem><SelectItem value="it">IT</SelectItem><SelectItem value="exec">ผู้บริหาร</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>รหัสผ่านเริ่มต้น</Label><Input type="password" placeholder="อย่างน้อย 12 ตัวอักษร" /><p className="text-xs text-gray-500">ต้องประกอบด้วย ตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ ตัวเลข อักขระพิเศษ</p></div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"><div className="flex items-center gap-2"><Lock className="w-4 h-4 text-purple-600" /><Label className="font-normal">บังคับเปิด MFA</Label></div><Switch defaultChecked /></div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddUserOpen(false)}>ยกเลิก</Button>
                        <Button onClick={() => { setAddUserOpen(false); toast.success('เพิ่มผู้ใช้ใหม่เรียบร้อย'); }}><UserPlus className="w-4 h-4 mr-2" />เพิ่มผู้ใช้</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="ค้นหาชื่อ อีเมล หรือบทบาท..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
                  <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="สถานะ" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="active">ใช้งาน</SelectItem><SelectItem value="suspended">ระงับ</SelectItem></SelectContent></Select>
                  <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="กลุ่ม" /></SelectTrigger><SelectContent><SelectItem value="all">ทุกกลุ่ม</SelectItem>{userGroups.map(g => <SelectItem key={g.id} value={g.code}>{g.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ผู้ใช้</TableHead><TableHead>บทบาท</TableHead><TableHead>กลุ่ม</TableHead><TableHead>หน่วยงาน</TableHead><TableHead>สถานะ</TableHead><TableHead>MFA</TableHead><TableHead>เข้าสู่ระบบล่าสุด</TableHead><TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-blue-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm">{user.name.slice(0, 2)}</div>
                              <div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{user.role}</Badge></TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.groups.length > 0 ? user.groups.map(g => {
                                const grp = userGroups.find(ug => ug.code === g);
                                return grp ? <Badge key={g} className={`text-[10px] ${grp.bgColor} ${grp.color} border`}>{grp.name}</Badge> : null;
                              }) : <span className="text-xs text-gray-400">-</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{user.department}</TableCell>
                          <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.mfa ? <div className="flex items-center gap-1 text-green-600"><Lock className="w-3.5 h-3.5" /><span className="text-xs">เปิด</span></div> : <div className="flex items-center gap-1 text-orange-500"><AlertCircle className="w-3.5 h-3.5" /><span className="text-xs">ปิด</span></div>}</TableCell>
                          <TableCell className="text-sm text-gray-600">{user.lastLogin}{user.loginAttempts > 0 && <p className="text-xs text-red-600 mt-0.5">ล้มเหลว {user.loginAttempts} ครั้ง</p>}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => toast.info(`แก้ไขผู้ใช้ ${user.name}`)}><Edit className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => toast.success(`รีเซ็ตรหัสผ่าน ${user.name}`)}><RefreshCw className="w-4 h-4" /></Button>
                              {user.status === 'suspended' ? <Button size="sm" variant="ghost" className="text-green-600" onClick={() => toast.success(`ปลดล็อก ${user.name}`)}><CheckCircle className="w-4 h-4" /></Button> : user.status === 'active' ? <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning(`ระงับ ${user.name}`)}><XCircle className="w-4 h-4" /></Button> : null}
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

          {/* ==================== ROLES TAB ==================== */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">บทบาท ({roles.length})</CardTitle>
                      <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
                        <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />เพิ่ม</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
                            <DialogTitle className="text-white text-lg">เพิ่มบทบาทใหม่</DialogTitle>
                            <DialogDescription className="text-green-100 mt-1">สร้างกลุ่มสิทธิ์ใหม่สำหรับผู้ใช้งาน</DialogDescription>
                          </div>
                          <div className="px-6 py-5 space-y-4">
                            <div className="space-y-2"><Label>ชื่อบทบาท</Label><Input placeholder="เช่น เจ้าหน้าที่การเงิน" /></div>
                            <div className="space-y-2"><Label>รหัส</Label><Input placeholder="เช่น FINANCE" /></div>
                            <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea placeholder="อธิบายหน้าที่และขอบเขตสิทธิ์" /></div>
                          </div>
                          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setAddRoleOpen(false)}>ยกเลิก</Button>
                            <Button onClick={() => { setAddRoleOpen(false); toast.success('สร้างบทบาทใหม่เรียบร้อย'); }}>สร้าง</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {roles.map((role) => (
                      <motion.button key={role.id} whileHover={{ x: 2 }} className={`w-full text-left p-3 rounded-lg border transition-all ${selectedRole === role.code ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`} onClick={() => setSelectedRole(role.code)}>
                        <div className="flex items-center justify-between">
                          <div><p className="font-medium text-sm">{role.name}</p><p className="text-xs text-gray-500 mt-0.5">{role.description}</p></div>
                          <div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">{role.userCount} คน</Badge><ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${selectedRole === role.code ? 'rotate-90' : ''}`} /></div>
                        </div>
                      </motion.button>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Key className="w-5 h-5 text-purple-600" />เมทริกซ์สิทธิ์</CardTitle>
                    <CardDescription>{selectedRole ? `กำลังแก้ไขสิทธิ์: ${roles.find(r => r.code === selectedRole)?.name}` : 'เลือกบทบาททางซ้ายเพื่อดู/แก้ไขสิทธิ์'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedRole ? (
                      <div className="space-y-6">
                        {allPermissions.map((group) => (
                          <div key={group.group}>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" />{group.group}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {group.items.map((perm) => {
                                const hasPermission = roles.find(r => r.code === selectedRole)?.permissions.includes(perm);
                                return (
                                  <div key={perm} className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${hasPermission ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <span className="text-sm">{perm}</span>
                                    <Switch checked={hasPermission} onCheckedChange={() => toast.success(`สิทธิ์ "${perm}" ${hasPermission ? 'ปิด' : 'เปิด'} แล้ว`)} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex gap-2">
                          <Button onClick={() => toast.success('บันทึกสิทธิ์เรียบร้อย')}><CheckCircle className="w-4 h-4 mr-2" />บันทึกสิทธิ์</Button>
                          <Button variant="outline" onClick={() => toast.info('รีเซ็ตเป็นค่าเริ่มต้น')}><RefreshCw className="w-4 h-4 mr-2" />รีเซ็ต</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500"><Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" /><p className="text-sm">เลือกบทบาทจากรายการทางซ้าย</p></div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ==================== GROUPS TAB ==================== */}
          <TabsContent value="groups" className="space-y-6">
            {/* Info Card */}
            <Card className="border-indigo-200 bg-indigo-50/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0"><UsersRound className="w-6 h-6 text-indigo-600" /></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-indigo-900">กลุ่มผู้ใช้งาน (User Groups)</h3>
                    <p className="text-sm text-indigo-700 mt-1">จัดกลุ่มผู้ใช้ตามหน้าที่ ประเภททุน หรือเงื่อนไขที่กำหนด แต่ละกลุ่มสามารถกำหนดบทบาทและเงื่อนไขการเป็นสมาชิกอัตโนมัติได้</p>
                  </div>
                  <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
                    <DialogTrigger asChild><Button className="shrink-0 bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-1" /> สร้างกลุ่มใหม่</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white">
                        <DialogTitle className="text-white text-lg">สร้างกลุ่มผู้ใช้ใหม่</DialogTitle>
                        <DialogDescription className="text-indigo-100 mt-1">กำหนดชื่อ บทบาท และเงื่อนไขสมาชิกภาพ</DialogDescription>
                      </div>
                      <div className="px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>ชื่อกลุ่ม</Label><Input placeholder="เช่น ทุนในประเทศ" /></div>
                          <div className="space-y-2"><Label>รหัส</Label><Input placeholder="เช่น GRP-DOMESTIC" /></div>
                        </div>
                        <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea placeholder="อธิบายวัตถุประสงค์ของกลุ่ม" /></div>
                        <div className="space-y-2"><Label>บทบาทที่กำหนด</Label>
                          <div className="grid grid-cols-2 gap-2">{roles.map(r => (
                            <div key={r.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50"><Checkbox id={`grp-role-${r.code}`} /><Label htmlFor={`grp-role-${r.code}`} className="text-sm font-normal cursor-pointer">{r.name}</Label></div>
                          ))}</div>
                        </div>
                        <div className="space-y-2"><Label>เงื่อนไขสมาชิกอัตโนมัติ</Label><Textarea placeholder="เช่น department = การเงิน&#10;scholarship_type = ทุนในประเทศ" rows={3} /><p className="text-xs text-gray-500">แต่ละบรรทัดคือ 1 เงื่อนไข ผู้ใช้จะเข้ากลุ่มอัตโนมัติเมื่อตรงเงื่อนไข</p></div>
                      </div>
                      <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddGroupOpen(false)}>ยกเลิก</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { setAddGroupOpen(false); toast.success('สร้างกลุ่มผู้ใช้ใหม่เรียบร้อย'); }}>สร้างกลุ่ม</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {userGroups.map((group, i) => (
                <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-lg transition-all h-full">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${group.bgColor} flex items-center justify-center`}><group.icon className={`w-5 h-5 ${group.color}`} /></div>
                          <div>
                            <h4 className="font-semibold text-sm">{group.name}</h4>
                            <Badge variant="outline" className="text-[10px] font-mono mt-0.5">{group.code}</Badge>
                          </div>
                        </div>
                        <Badge className={`text-[10px] ${group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{group.status === 'active' ? 'ใช้งาน' : 'ปิด'}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{group.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-[10px] text-gray-400 mr-1">บทบาท:</span>
                        {group.roles.map(rc => <Badge key={rc} variant="outline" className="text-[10px]">{roles.find(r => r.code === rc)?.name || rc}</Badge>)}
                      </div>
                      <div className="space-y-1 mb-3 flex-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">เงื่อนไขสมาชิก:</p>
                        {group.conditions.map((c, ci) => (
                          <div key={ci} className="flex items-center gap-1.5 text-xs text-gray-600"><ChevronRight className="w-3 h-3 text-gray-300" />{c}</div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-gray-500"><span className="font-bold text-gray-700">{group.memberCount}</span> สมาชิก</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setSelectedGroup(group); setEditGroupOpen(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.info(`ดูสมาชิกกลุ่ม "${group.name}"`)}><Users className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ==================== FORM & FIELD ACL TAB ==================== */}
          <TabsContent value="form-acl" className="space-y-6">
            {/* Info */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><Layers className="w-6 h-6 text-amber-600" /></div>
                  <div>
                    <h3 className="font-semibold text-amber-900">สิทธิ์ระดับแบบฟอร์มและฟิลด์ (Form & Field-Level ACL)</h3>
                    <p className="text-sm text-amber-700 mt-1">ตรวจสอบสิทธิ์และอนุญาตให้ผู้ใช้เข้าถึงข้อมูลในระดับ<strong>แบบฟอร์ม</strong>และ<strong>ระดับฟิลด์</strong>ตามบทบาท กลุ่มผู้ใช้ หรือเงื่อนไขที่กำหนด</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Form Selector */}
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><FolderOpen className="w-4 h-4 text-blue-600" />เลือกแบบฟอร์ม</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5 max-h-[600px] overflow-y-auto">
                    {formACLs.map((form) => (
                      <button key={form.id} onClick={() => setSelectedACLForm(form.id)} className={`w-full text-left p-3 rounded-lg border transition-all ${selectedACLForm === form.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <form.categoryIcon className={`w-4 h-4 ${form.categoryColor} shrink-0`} />
                          <div className="min-w-0">
                            <Badge variant="outline" className="text-[9px] font-mono px-1">{form.formCode}</Badge>
                            <p className="text-xs font-medium mt-0.5 truncate">{form.formName}</p>
                            <p className="text-[10px] text-gray-400">{form.category}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* ACL Detail */}
              <div className="lg:col-span-3 space-y-4">
                {currentACL ? (
                  <>
                    {/* Form Header */}
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center`}><currentACL.categoryIcon className={`w-5 h-5 ${currentACL.categoryColor}`} /></div>
                            <div>
                              <div className="flex items-center gap-2"><Badge variant="outline" className="font-mono text-xs">{currentACL.formCode}</Badge><Badge className="text-[10px] bg-blue-100 text-blue-700">{currentACL.fields.length} ฟิลด์</Badge><Badge className="text-[10px] bg-purple-100 text-purple-700">{currentACL.conditionalRules.length} เงื่อนไข</Badge></div>
                              <p className="font-semibold text-sm mt-1">{currentACL.formName}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => toast.success('บันทึก ACL เรียบร้อย')}><Save className="w-4 h-4 mr-1" /> บันทึก</Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Form-Level Access Matrix */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" />สิทธิ์ระดับแบบฟอร์ม (Form-Level)</CardTitle>
                        <CardDescription>กำหนดว่าแต่ละบทบาทสามารถเข้าถึงฟอร์มนี้ได้อย่างไร</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(currentACL.roleAccess).map(([roleCode, access]) => {
                            const role = roles.find(r => r.code === roleCode);
                            const cfg = formAccessConfig[access.formAccess];
                            return (
                              <div key={roleCode} className={`p-3 rounded-xl border ${cfg.border} ${cfg.bg} cursor-pointer transition-all hover:shadow-sm ${aclSelectedRole === roleCode ? 'ring-2 ring-blue-400 shadow-md' : ''}`} onClick={() => setAclSelectedRole(roleCode)}>
                                <p className="font-medium text-xs">{role?.name || roleCode}</p>
                                <Badge className={`mt-1.5 text-[10px] ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</Badge>
                                {Object.keys(access.fieldOverrides).length > 0 && (
                                  <p className="text-[10px] text-gray-500 mt-1">{Object.keys(access.fieldOverrides).length} ฟิลด์ปรับแต่ง</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Field-Level Access */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Columns3 className="w-4 h-4 text-purple-600" />
                              สิทธิ์ระดับฟิลด์ (Field-Level) — {roles.find(r => r.code === aclSelectedRole)?.name || aclSelectedRole}
                            </CardTitle>
                            <CardDescription>กำหนดสิทธิ์แต่ละฟิลด์สำหรับบทบาทที่เลือก</CardDescription>
                          </div>
                          <button onClick={() => setExpandedACLFields(!expandedACLFields)} className="text-gray-400 hover:text-gray-600">
                            {expandedACLFields ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </button>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedACLFields && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <CardContent className="pt-0">
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-gray-50">
                                      <TableHead className="w-10">#</TableHead>
                                      <TableHead>ชื่อฟิลด์</TableHead>
                                      <TableHead>ประเภท</TableHead>
                                      <TableHead>ข้อมูลอ่อนไหว</TableHead>
                                      <TableHead>สิทธิ์การเข้าถึง</TableHead>
                                      <TableHead className="text-center">เปลี่ยน</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {currentACL.fields.map((field, fi) => {
                                      const roleAccess = currentACL.roleAccess[aclSelectedRole];
                                      const formAcc = roleAccess?.formAccess || 'none';
                                      let fieldAcc: FieldAccess = formAcc === 'none' ? 'hidden' : formAcc === 'read' ? 'read' : 'full';
                                      if (roleAccess?.fieldOverrides[field.id]) fieldAcc = roleAccess.fieldOverrides[field.id];
                                      const cfg = fieldAccessConfig[fieldAcc];
                                      return (
                                        <TableRow key={field.id} className={`${fieldAcc === 'hidden' ? 'opacity-50 bg-gray-50' : ''}`}>
                                          <TableCell className="text-xs text-gray-400 font-mono">{fi + 1}</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              {field.sensitive && <Lock className="w-3 h-3 text-red-400" />}
                                              <span className="text-sm font-medium">{field.name}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell><Badge variant="outline" className="text-[10px]">{field.type}</Badge></TableCell>
                                          <TableCell>{field.sensitive ? <Badge className="text-[10px] bg-red-100 text-red-600 border border-red-200">อ่อนไหว</Badge> : <span className="text-xs text-gray-400">-</span>}</TableCell>
                                          <TableCell>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg}`}>
                                              <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
                                              <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Select defaultValue={fieldAcc} onValueChange={(v) => toast.success(`เปลี่ยนสิทธิ์ฟิลด์ "${field.name}" เป็น "${fieldAccessConfig[v as FieldAccess].label}"`)}>
                                              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="full"><div className="flex items-center gap-1.5"><PenLine className="w-3 h-3 text-green-600" /> อ่าน+แก้ไข</div></SelectItem>
                                                <SelectItem value="read"><div className="flex items-center gap-1.5"><EyeIcon className="w-3 h-3 text-blue-600" /> อ่านอย่างเดียว</div></SelectItem>
                                                <SelectItem value="hidden"><div className="flex items-center gap-1.5"><EyeOff className="w-3 h-3 text-gray-400" /> ซ่อน</div></SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>

                    {/* Conditional Rules */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm flex items-center gap-2"><GitBranch className="w-4 h-4 text-amber-600" />เงื่อนไขพิเศษ (Conditional Rules)</CardTitle>
                            <CardDescription>กฎเงื่อนไขที่ Override สิทธิ์เริ่มต้นตามสถานการณ์</CardDescription>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setAddCondRuleOpen(true)}><Plus className="w-3 h-3 mr-1" />เพิ่มเงื่อนไข</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {currentACL.conditionalRules.map((rule, ri) => (
                          <motion.div key={rule.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ri * 0.05 }} className={`p-4 rounded-xl border ${rule.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200">เงื่อนไข #{ri + 1}</Badge>
                                  <span className="text-sm font-semibold text-gray-800">{rule.name}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-[10px] text-blue-500 uppercase tracking-wide font-medium mb-1">เมื่อ (Condition)</p>
                                    <p className="text-xs text-blue-800 font-mono">{rule.condition}</p>
                                  </div>
                                  <div className="p-2.5 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-[10px] text-green-500 uppercase tracking-wide font-medium mb-1">ผลลัพธ์ (Effect)</p>
                                    <p className="text-xs text-green-800">{rule.effect}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4 shrink-0">
                                <Switch checked={rule.enabled} onCheckedChange={() => toast.success(`${rule.enabled ? 'ปิด' : 'เปิด'}เงื่อนไข "${rule.name}"`)} />
                                <Button size="sm" variant="ghost"><Edit className="w-3.5 h-3.5" /></Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card><CardContent className="py-16 text-center text-gray-500"><Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" /><p className="text-sm">เลือกแบบฟอร์มจากรายการทางซ้าย</p></CardContent></Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ==================== SECURITY LOGS TAB ==================== */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-purple-600" />Security Log</CardTitle>
                  <div className="flex gap-2">
                    <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="ระดับความเสี่ยง" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="high">สูง</SelectItem><SelectItem value="medium">ปานกลาง</SelectItem><SelectItem value="low">ต่ำ</SelectItem></SelectContent></Select>
                    <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออก Security Log')}><Download className="w-4 h-4 mr-2" />ส่งออก</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader><TableRow><TableHead>เวลา</TableHead><TableHead>เหตุการณ์</TableHead><TableHead>ผู้ใช้</TableHead><TableHead>IP Address</TableHead><TableHead>อุปกรณ์</TableHead><TableHead>ความเสี่ยง</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {securityLogs.map((log) => (
                        <TableRow key={log.id} className={`hover:bg-blue-50/50 ${log.risk === 'high' ? 'bg-red-50/30' : ''}`}>
                          <TableCell className="text-xs font-mono whitespace-nowrap"><div className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{log.time}</div></TableCell>
                          <TableCell><div className="flex items-center gap-2">{log.risk === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}<span className="text-sm font-medium">{log.event}</span></div></TableCell>
                          <TableCell className="text-sm">{log.user}</TableCell>
                          <TableCell className="text-xs font-mono text-gray-600">{log.ip}</TableCell>
                          <TableCell className="text-xs text-gray-600">{log.device}</TableCell>
                          <TableCell>{getRiskBadge(log.risk)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500 flex items-center gap-1"><Lock className="w-3 h-3" />Security Log ถูกบันทึกอัตโนมัติ ไม่สามารถแก้ไขหรือลบ เก็บรักษา {policies.auditLogRetentionDays} วัน</p></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== POLICIES TAB ==================== */}
          <TabsContent value="policies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Key className="w-5 h-5 text-blue-600" />นโยบายรหัสผ่าน</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>ความยาวขั้นต่ำ</Label><p className="text-xs text-gray-500">จำนวนตัวอักษรขั้นต่ำ</p></div><Input type="number" className="w-20 text-center" value={policies.passwordMinLength} onChange={(e) => setPolicies({...policies, passwordMinLength: Number(e.target.value)})} /></div>
                  {[{ key: 'passwordRequireUppercase', label: 'ต้องมีตัวพิมพ์ใหญ่ (A-Z)' }, { key: 'passwordRequireLowercase', label: 'ต้องมีตัวพิมพ์เล็ก (a-z)' }, { key: 'passwordRequireNumber', label: 'ต้องมีตัวเลข (0-9)' }, { key: 'passwordRequireSpecial', label: 'ต้องมีอักขระพิเศษ (!@#$)' }].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg"><Label className="font-normal">{item.label}</Label><Switch checked={policies[item.key as keyof typeof policies] as boolean} onCheckedChange={(v) => setPolicies({...policies, [item.key]: v})} /></div>
                  ))}
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>หมดอายุ (วัน)</Label><p className="text-xs text-gray-500">บังคับเปลี่ยนรหัสผ่านทุก</p></div><Input type="number" className="w-20 text-center" value={policies.passwordExpireDays} onChange={(e) => setPolicies({...policies, passwordExpireDays: Number(e.target.value)})} /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Lock className="w-5 h-5 text-green-600" />การยืนยันตัวตนและเซสชัน</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50 border-purple-200"><div><Label>บังคับ MFA ทุกผู้ใช้</Label><p className="text-xs text-gray-500">Two-Factor Authentication</p></div><Switch checked={policies.mfaRequired} onCheckedChange={(v) => setPolicies({...policies, mfaRequired: v})} /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>Session Timeout (นาที)</Label><p className="text-xs text-gray-500">ออกจากระบบเมื่อไม่ใช้งาน</p></div><Input type="number" className="w-20 text-center" value={policies.sessionTimeoutMinutes} onChange={(e) => setPolicies({...policies, sessionTimeoutMinutes: Number(e.target.value)})} /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>จำนวนล็อกอินล้มเหลวสูงสุด</Label><p className="text-xs text-gray-500">ก่อนระงับบัญชีอัตโนมัติ</p></div><Input type="number" className="w-20 text-center" value={policies.maxLoginAttempts} onChange={(e) => setPolicies({...policies, maxLoginAttempts: Number(e.target.value)})} /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>ระยะเวลาล็อก (นาที)</Label><p className="text-xs text-gray-500">ระงับชั่วคราวเมื่อล็อกอินล้มเหลว</p></div><Input type="number" className="w-20 text-center" value={policies.lockoutDurationMinutes} onChange={(e) => setPolicies({...policies, lockoutDurationMinutes: Number(e.target.value)})} /></div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>IP Whitelist</Label><p className="text-xs text-gray-500">อนุญาตเฉพาะ IP ที่กำหนด</p></div><Switch checked={policies.ipWhitelistEnabled} onCheckedChange={(v) => setPolicies({...policies, ipWhitelistEnabled: v})} /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="w-5 h-5 text-cyan-600" />สถานะระบบ</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {['API Gateway', 'Database', 'Authentication Service', 'Email Service', 'SMS Gateway'].map((svc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100"><div><p className="font-medium text-sm">{svc}</p><p className="text-xs text-gray-500">ทำงานปกติ</p></div><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" /></div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="w-5 h-5 text-orange-600" />Monitoring</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg text-center"><p className="text-xl font-bold text-green-600">99.9%</p><p className="text-xs text-gray-600">Uptime</p></div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center"><p className="text-xl font-bold text-blue-600">120ms</p><p className="text-xs text-gray-600">Avg Response</p></div>
                    <div className="p-3 bg-green-50 rounded-lg text-center"><p className="text-xl font-bold text-green-600">0.02%</p><p className="text-xs text-gray-600">Error Rate</p></div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg"><div><Label>เก็บ Audit Log (วัน)</Label><p className="text-xs text-gray-500">ระยะเวลาเก็บรักษา</p></div><Input type="number" className="w-20 text-center" value={policies.auditLogRetentionDays} onChange={(e) => setPolicies({...policies, auditLogRetentionDays: Number(e.target.value)})} /></div>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setPolicies(defaultPolicies); toast.info('รีเซ็ตนโยบายเป็นค่าเริ่มต้น'); }}><RefreshCw className="w-4 h-4 mr-2" />รีเซ็ต</Button>
              <Button onClick={() => toast.success('บันทึกนโยบายความปลอดภัยเรียบร้อย')}><CheckCircle className="w-4 h-4 mr-2" />บันทึกนโยบาย</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Edit Group Dialog ===== */}
      <Dialog open={editGroupOpen} onOpenChange={setEditGroupOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          {selectedGroup && (
            <>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedGroup.bgColor} flex items-center justify-center`}><selectedGroup.icon className={`w-5 h-5 ${selectedGroup.color}`} /></div>
                  <div><DialogTitle className="text-white text-lg">แก้ไขกลุ่ม: {selectedGroup.name}</DialogTitle><DialogDescription className="text-indigo-100 mt-0.5">{selectedGroup.code}</DialogDescription></div>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>ชื่อกลุ่ม</Label><Input defaultValue={selectedGroup.name} /></div>
                  <div className="space-y-2"><Label>รหัส</Label><Input defaultValue={selectedGroup.code} disabled /></div>
                </div>
                <div className="space-y-2"><Label>คำอธิบาย</Label><Textarea defaultValue={selectedGroup.description} /></div>
                <div className="space-y-2"><Label>บทบาทที่กำหนด</Label>
                  <div className="grid grid-cols-2 gap-2">{roles.map(r => (
                    <div key={r.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50"><Checkbox id={`eg-${r.code}`} defaultChecked={selectedGroup.roles.includes(r.code)} /><Label htmlFor={`eg-${r.code}`} className="text-sm font-normal cursor-pointer">{r.name}</Label></div>
                  ))}</div>
                </div>
                <div className="space-y-2"><Label>เงื่อนไขสมาชิกอัตโนมัติ</Label><Textarea defaultValue={selectedGroup.conditions.join('\n')} rows={3} /><p className="text-xs text-gray-500">แต่ละบรรทัดคือ 1 เงื่อนไข</p></div>
                <div className="flex items-center justify-between p-3 border rounded-lg"><Label className="font-normal">เปิดใช้งานกลุ่ม</Label><Switch defaultChecked={selectedGroup.status === 'active'} /></div>
              </div>
              <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
                <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => { setEditGroupOpen(false); toast.warning(`ลบกลุ่ม "${selectedGroup.name}"`); }}><Trash2 className="w-4 h-4 mr-1" />ลบกลุ่ม</Button>
                <div className="flex gap-2"><Button variant="outline" onClick={() => setEditGroupOpen(false)}>ยกเลิก</Button><Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { setEditGroupOpen(false); toast.success('บันทึกการแก้ไขกลุ่มเรียบร้อย'); }}><Save className="w-4 h-4 mr-1" />บันทึก</Button></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Add Conditional Rule Dialog ===== */}
      <Dialog open={addCondRuleOpen} onOpenChange={setAddCondRuleOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><GitBranch className="w-5 h-5" />เพิ่มเงื่อนไขพิเศษใหม่</DialogTitle>
            <DialogDescription className="text-amber-100 mt-1">กำหนดเงื่อนไขที่ Override สิทธิ์เริ่มต้น</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2"><Label>ชื่อเงื่อนไข</Label><Input placeholder="เช่น ซ่อนข้อมูลอ่อนไหวสำหรับ REVIEWER" /></div>
            <div className="space-y-2"><Label>เงื่อนไข (Condition)</Label><Textarea placeholder="เช่น role = REVIEWER AND status = submitted" rows={2} /><p className="text-xs text-gray-500">รองรับ: role, status, department, scholarship_type, application_period, amount, date operators</p></div>
            <div className="space-y-2"><Label>ผลลัพธ์ (Effect)</Label><Textarea placeholder="เช่น ซ่อนฟิลด์ข้อมูลส่วนบุคคล" rows={2} /></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><Label className="font-normal">เปิดใช้งานทันที</Label><Switch defaultChecked /></div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddCondRuleOpen(false)}>ยกเลิก</Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => { setAddCondRuleOpen(false); toast.success('เพิ่มเงื่อนไขพิเศษเรียบร้อย'); }}><Plus className="w-4 h-4 mr-1" />เพิ่มเงื่อนไข</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
