import { useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, UserPlus, Edit, Trash2, CheckCircle, XCircle, AlertCircle,
  Clock, Search, Eye, EyeOff, Shield, Lock, Unlock, Mail, Phone,
  Building, Globe, Key, RefreshCw, Download, Upload, MoreHorizontal,
  ChevronRight, ChevronDown, Activity, AlertTriangle, Settings,
  UserCheck, UserX, Filter, Plus, Save, Copy, Ban, History,
  Smartphone, Monitor, MapPin, Calendar, FileText, Send, LogOut,
  Fingerprint, ShieldCheck, ShieldAlert, Info, ArrowUpDown,
  SquareUser, Briefcase, Hash, CircleDot,
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
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

// ===== Types =====
interface Account {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  roleCode: string;
  groups: string[];
  status: 'active' | 'suspended' | 'inactive' | 'pending' | 'locked';
  mfaEnabled: boolean;
  mfaMethod: string;
  avatar: string;
  createdDate: string;
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  passwordChangedDate: string;
  passwordExpireDate: string;
  failedLoginAttempts: number;
  activeSessions: number;
  loginCount: number;
  notes: string;
}

interface SessionInfo {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  status: 'active' | 'idle' | 'expired';
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  detail: string;
  ip: string;
  time: string;
  risk: 'low' | 'medium' | 'high';
}

// ===== Mock Data =====
const accounts: Account[] = [
  {
    id: 'ACC-001', employeeId: 'EMP-10045', name: 'นายประสิทธิ์ ผู้ดูแล', email: 'prasit@scholarship.go.th', phone: '02-123-4567 ต่อ 101',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ', position: 'ผู้ดูแลระบบอาวุโส', role: 'ผู้ดูแลระบบ', roleCode: 'ADMIN', groups: ['GRP-ADMIN', 'GRP-IT'],
    status: 'active', mfaEnabled: true, mfaMethod: 'TOTP (Google Authenticator)', avatar: '', createdDate: '15 ม.ค. 2567',
    lastLogin: '24 ก.พ. 2569 15:45', lastLoginIp: '192.168.1.100', lastLoginDevice: 'Chrome 120 / Windows 11',
    passwordChangedDate: '1 ก.พ. 2569', passwordExpireDate: '1 พ.ค. 2569', failedLoginAttempts: 0, activeSessions: 2, loginCount: 1245, notes: '',
  },
  {
    id: 'ACC-002', employeeId: 'EMP-10032', name: 'นางสาวพิมพ์พร เจ้าหน้าที่', email: 'pimporn@scholarship.go.th', phone: '02-123-4567 ต่อ 201',
    department: 'กองทุนการศึกษา', position: 'เจ้าหน้าที่ทุนอาวุโส', role: 'เจ้าหน้าที่ทุน', roleCode: 'STAFF', groups: ['GRP-STAFF', 'GRP-OVERSEAS'],
    status: 'active', mfaEnabled: true, mfaMethod: 'TOTP (Google Authenticator)', avatar: '', createdDate: '1 มี.ค. 2567',
    lastLogin: '24 ก.พ. 2569 14:30', lastLoginIp: '192.168.1.45', lastLoginDevice: 'Safari 17 / macOS Sonoma',
    passwordChangedDate: '15 ม.ค. 2569', passwordExpireDate: '15 เม.ย. 2569', failedLoginAttempts: 0, activeSessions: 1, loginCount: 890, notes: '',
  },
  {
    id: 'ACC-003', employeeId: 'EMP-10028', name: 'นายสมศักดิ์ ผู้จัดการ', email: 'somsak@scholarship.go.th', phone: '02-123-4567 ต่อ 301',
    department: 'กองทุนการศึกษา', position: 'ผู้จัดการส่วนทุนการศึกษา', role: 'ผู้จัดการส่วน', roleCode: 'MANAGER', groups: ['GRP-MANAGER'],
    status: 'active', mfaEnabled: true, mfaMethod: 'SMS OTP', avatar: '', createdDate: '10 ก.พ. 2567',
    lastLogin: '24 ก.พ. 2569 10:15', lastLoginIp: '192.168.1.50', lastLoginDevice: 'Chrome 120 / Windows 11',
    passwordChangedDate: '20 ธ.ค. 2568', passwordExpireDate: '20 มี.ค. 2569', failedLoginAttempts: 0, activeSessions: 1, loginCount: 1032, notes: '',
  },
  {
    id: 'ACC-004', employeeId: 'EMP-10055', name: 'ศ.ดร.วิภา นักวิชาการ', email: 'wipa@scholarship.go.th', phone: '02-123-4567 ต่อ 401',
    department: 'คณะกรรมการพิจารณาทุน', position: 'กรรมการพิจารณา', role: 'กรรมการพิจารณา', roleCode: 'REVIEWER', groups: ['GRP-COMMITTEE'],
    status: 'active', mfaEnabled: false, mfaMethod: '-', avatar: '', createdDate: '1 ก.ค. 2567',
    lastLogin: '19 ก.พ. 2569 16:00', lastLoginIp: '10.0.0.55', lastLoginDevice: 'Chrome 120 / macOS',
    passwordChangedDate: '5 พ.ย. 2568', passwordExpireDate: '5 ก.พ. 2569', failedLoginAttempts: 0, activeSessions: 0, loginCount: 156, notes: 'รหัสผ่านหมดอายุ ต้องเปลี่ยน',
  },
  {
    id: 'ACC-005', employeeId: 'EMP-10061', name: 'นายวิชัย สมบูรณ์', email: 'wichai@scholarship.go.th', phone: '02-123-4567 ต่อ 100',
    department: 'สำนักผู้บริหาร', position: 'รองผู้อำนวยการ', role: 'ผู้บริหาร', roleCode: 'EXEC', groups: ['GRP-EXEC'],
    status: 'active', mfaEnabled: true, mfaMethod: 'Hardware Key (YubiKey)', avatar: '', createdDate: '1 ม.ค. 2567',
    lastLogin: '18 ก.พ. 2569 11:30', lastLoginIp: '192.168.1.1', lastLoginDevice: 'Chrome 120 / Windows 11',
    passwordChangedDate: '10 ม.ค. 2569', passwordExpireDate: '10 เม.ย. 2569', failedLoginAttempts: 0, activeSessions: 0, loginCount: 420, notes: '',
  },
  {
    id: 'ACC-006', employeeId: 'EMP-10070', name: 'นางสาวกนกวรรณ นักวิเคราะห์', email: 'kanokwan@scholarship.go.th', phone: '02-123-4567 ต่อ 202',
    department: 'กองทุนวิจัย', position: 'นักวิเคราะห์นโยบาย', role: 'เจ้าหน้าที่ทุน', roleCode: 'STAFF', groups: ['GRP-STAFF', 'GRP-RESEARCH'],
    status: 'active', mfaEnabled: true, mfaMethod: 'TOTP (Google Authenticator)', avatar: '', createdDate: '15 เม.ย. 2567',
    lastLogin: '24 ก.พ. 2569 09:00', lastLoginIp: '192.168.1.78', lastLoginDevice: 'Firefox 122 / Ubuntu',
    passwordChangedDate: '28 ม.ค. 2569', passwordExpireDate: '28 เม.ย. 2569', failedLoginAttempts: 0, activeSessions: 1, loginCount: 645, notes: '',
  },
  {
    id: 'ACC-007', employeeId: 'EMP-10082', name: 'นางสมใจ ทดสอบ', email: 'somjai@scholarship.go.th', phone: '02-123-4567 ต่อ 203',
    department: 'กองทุนพัฒนา', position: 'เจ้าหน้าที่ทุน', role: 'เจ้าหน้าที่ทุน', roleCode: 'STAFF', groups: ['GRP-STAFF'],
    status: 'locked', mfaEnabled: false, mfaMethod: '-', avatar: '', createdDate: '1 มิ.ย. 2567',
    lastLogin: '10 ก.พ. 2569 08:00', lastLoginIp: '103.45.67.89', lastLoginDevice: 'Firefox 120 / Linux',
    passwordChangedDate: '1 ก.ย. 2568', passwordExpireDate: '1 ธ.ค. 2568', failedLoginAttempts: 5, activeSessions: 0, loginCount: 234, notes: 'บัญชีถูกล็อกเนื่องจากล็อกอินล้มเหลว 5 ครั้ง IP ต้นทางไม่ตรงกับปกติ',
  },
  {
    id: 'ACC-008', employeeId: 'EMP-10090', name: 'นายทดสอบ ระบบ', email: 'test@scholarship.go.th', phone: '-',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ', position: 'บัญชีทดสอบ', role: 'เจ้าหน้าที่ทุน', roleCode: 'STAFF', groups: [],
    status: 'inactive', mfaEnabled: false, mfaMethod: '-', avatar: '', createdDate: '1 ม.ค. 2569',
    lastLogin: '1 ม.ค. 2569 10:00', lastLoginIp: '127.0.0.1', lastLoginDevice: 'Chrome / Windows',
    passwordChangedDate: '1 ม.ค. 2569', passwordExpireDate: '1 เม.ย. 2569', failedLoginAttempts: 0, activeSessions: 0, loginCount: 5, notes: 'บัญชีทดสอบ ปิดใช้งานหลังเสร็จสิ้น UAT',
  },
  {
    id: 'ACC-009', employeeId: 'EMP-10095', name: 'นายธนกฤต พัฒนา', email: 'thanakrit@scholarship.go.th', phone: '02-123-4567 ต่อ 205',
    department: 'กองทุนพัฒนา', position: 'เจ้าหน้าที่ทุน', role: 'เจ้าหน้าที่ทุน', roleCode: 'STAFF', groups: ['GRP-STAFF'],
    status: 'pending', mfaEnabled: false, mfaMethod: '-', avatar: '', createdDate: '20 ก.พ. 2569',
    lastLogin: '-', lastLoginIp: '-', lastLoginDevice: '-',
    passwordChangedDate: '-', passwordExpireDate: '-', failedLoginAttempts: 0, activeSessions: 0, loginCount: 0, notes: 'บัญชีใหม่ รอผู้ใช้ยืนยันอีเมลและตั้งรหัสผ่าน',
  },
  {
    id: 'ACC-010', employeeId: 'EMP-10042', name: 'นางสาวรัตนา การเงิน', email: 'rattana@scholarship.go.th', phone: '02-123-4567 ต่อ 501',
    department: 'ฝ่ายการเงิน', position: 'หัวหน้าฝ่ายการเงิน', role: 'เจ้าหน้าที่การเงิน', roleCode: 'FINANCE', groups: ['GRP-FINANCE'],
    status: 'active', mfaEnabled: true, mfaMethod: 'TOTP (Microsoft Authenticator)', avatar: '', createdDate: '1 ม.ค. 2567',
    lastLogin: '24 ก.พ. 2569 08:45', lastLoginIp: '192.168.1.92', lastLoginDevice: 'Edge 120 / Windows 11',
    passwordChangedDate: '5 ก.พ. 2569', passwordExpireDate: '5 พ.ค. 2569', failedLoginAttempts: 0, activeSessions: 1, loginCount: 1100, notes: '',
  },
];

const mockSessions: SessionInfo[] = [
  { id: 'SES-001', userId: 'ACC-001', device: 'Desktop', browser: 'Chrome 120 / Windows 11', ip: '192.168.1.100', location: 'สำนักงาน กทม.', loginTime: '24 ก.พ. 2569 08:30', lastActivity: '24 ก.พ. 2569 15:45', status: 'active' },
  { id: 'SES-002', userId: 'ACC-001', device: 'Mobile', browser: 'Safari / iOS 17', ip: '10.0.0.15', location: 'สำนักงาน กทม. (Wi-Fi)', loginTime: '24 ก.พ. 2569 12:00', lastActivity: '24 ก.พ. 2569 14:20', status: 'idle' },
  { id: 'SES-003', userId: 'ACC-002', device: 'Desktop', browser: 'Safari 17 / macOS', ip: '192.168.1.45', location: 'สำนักงาน กทม.', loginTime: '24 ก.พ. 2569 09:00', lastActivity: '24 ก.พ. 2569 14:30', status: 'active' },
  { id: 'SES-004', userId: 'ACC-003', device: 'Desktop', browser: 'Chrome 120 / Windows', ip: '192.168.1.50', location: 'สำนักงาน กทม.', loginTime: '24 ก.พ. 2569 08:15', lastActivity: '24 ก.พ. 2569 10:15', status: 'idle' },
  { id: 'SES-005', userId: 'ACC-006', device: 'Desktop', browser: 'Firefox 122 / Ubuntu', ip: '192.168.1.78', location: 'สำนักงาน กทม.', loginTime: '24 ก.พ. 2569 08:55', lastActivity: '24 ก.พ. 2569 09:00', status: 'active' },
  { id: 'SES-006', userId: 'ACC-010', device: 'Desktop', browser: 'Edge 120 / Windows', ip: '192.168.1.92', location: 'สำนักงาน กทม.', loginTime: '24 ก.พ. 2569 08:40', lastActivity: '24 ก.พ. 2569 08:45', status: 'active' },
];

const mockActivityLogs: ActivityLog[] = [
  { id: 'AL-001', userId: 'ACC-001', action: 'เข้าสู่ระบบ', detail: 'เข้าสู่ระบบสำเร็จ (MFA: TOTP)', ip: '192.168.1.100', time: '24 ก.พ. 2569 08:30', risk: 'low' },
  { id: 'AL-002', userId: 'ACC-001', action: 'แก้ไขผู้ใช้', detail: 'เปลี่ยนบทบาท ACC-006 จาก STAFF เป็น SENIOR_STAFF', ip: '192.168.1.100', time: '24 ก.พ. 2569 09:15', risk: 'medium' },
  { id: 'AL-003', userId: 'ACC-001', action: 'สร้างบัญชี', detail: 'สร้างบัญชีใหม่ ACC-009 (นายธนกฤต พัฒนา)', ip: '192.168.1.100', time: '20 ก.พ. 2569 14:00', risk: 'medium' },
  { id: 'AL-004', userId: 'ACC-007', action: 'ล็อกอินล้มเหลว', detail: 'ล็อกอินล้มเหลว 5 ครั้งติดต่อกัน - บัญชีถูกล็อก', ip: '103.45.67.89', time: '10 ก.พ. 2569 08:00', risk: 'high' },
  { id: 'AL-005', userId: 'ACC-002', action: 'ดูข้อมูลผู้สมัคร', detail: 'เข้าดูข้อมูล APP-2569-0042 (ข้อมูล PII)', ip: '192.168.1.45', time: '24 ก.พ. 2569 10:30', risk: 'medium' },
  { id: 'AL-006', userId: 'ACC-003', action: 'อนุมัติทุน', detail: 'อนุมัติใบสมัครทุน AWD-2569-015', ip: '192.168.1.50', time: '24 ก.พ. 2569 10:00', risk: 'medium' },
  { id: 'AL-007', userId: 'ACC-001', action: 'ปลดล็อกบัญชี', detail: 'ปลดล็อกบัญชี ACC-007 (นางสมใจ ทดสอบ)', ip: '192.168.1.100', time: '24 ก.พ. 2569 11:00', risk: 'medium' },
  { id: 'AL-008', userId: 'ACC-005', action: 'ส่งออกรายงาน', detail: 'ส่งออกรายงานสรุปทุนประจำปี 2568', ip: '192.168.1.1', time: '18 ก.พ. 2569 11:30', risk: 'low' },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: 'bg-red-100', text: 'text-red-700' },
  EXEC: { bg: 'bg-purple-100', text: 'text-purple-700' },
  MANAGER: { bg: 'bg-blue-100', text: 'text-blue-700' },
  STAFF: { bg: 'bg-green-100', text: 'text-green-700' },
  REVIEWER: { bg: 'bg-amber-100', text: 'text-amber-700' },
  FINANCE: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  AUDITOR: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
};

// ===== Main =====
export default function AccountAdmin() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('info');

  const filteredAccounts = accounts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (roleFilter !== 'all' && a.roleCode !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.employeeId.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const statusCounts = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    locked: accounts.filter(a => a.status === 'locked').length,
    suspended: accounts.filter(a => a.status === 'suspended').length,
    inactive: accounts.filter(a => a.status === 'inactive').length,
    pending: accounts.filter(a => a.status === 'pending').length,
  };

  const mfaStats = {
    enabled: accounts.filter(a => a.mfaEnabled).length,
    disabled: accounts.filter(a => !a.mfaEnabled).length,
    rate: Math.round((accounts.filter(a => a.mfaEnabled).length / accounts.length) * 100),
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { label: 'ใช้งาน', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' };
      case 'locked': return { label: 'ถูกล็อก', icon: Lock, color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500' };
      case 'suspended': return { label: 'ระงับ', icon: Ban, color: 'text-orange-700', bg: 'bg-orange-100', dot: 'bg-orange-500' };
      case 'inactive': return { label: 'ปิดใช้', icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
      case 'pending': return { label: 'รอยืนยัน', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' };
      default: return { label: status, icon: CircleDot, color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' };
    }
  };

  const toggleSelectAccount = (id: string) => {
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) setSelectedAccounts([]);
    else setSelectedAccounts(filteredAccounts.map(a => a.id));
  };

  const openDetail = (account: Account) => {
    setSelectedAccount(account);
    setDetailTab('info');
    setDetailOpen(true);
  };

  const accountSessions = selectedAccount ? mockSessions.filter(s => s.userId === selectedAccount.id) : [];
  const accountLogs = selectedAccount ? mockActivityLogs.filter(l => l.userId === selectedAccount.id) : [];

  return (
    <div className="min-h-full">
      <PageHeader
        title="จัดการบัญชีผู้ใช้ (Account Admin)"
        breadcrumbs={[{ label: 'แดชบอร์ด', path: '/' }, { label: 'จัดการบัญชีผู้ใช้' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('ส่งออกรายชื่อผู้ใช้')}><Download className="w-4 h-4 mr-2" />ส่งออก</Button>
            <Button variant="outline" onClick={() => toast.info('นำเข้ารายชื่อผู้ใช้จากไฟล์')}><Upload className="w-4 h-4 mr-2" />นำเข้า</Button>
            <Button onClick={() => setCreateOpen(true)}><UserPlus className="w-4 h-4 mr-2" />สร้างบัญชีใหม่</Button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        <PermissionPanel
          pageName="จัดการบัญชีผู้ใช้"
          moduleName="account-admin"
          defaultExpanded={false}
          permissions={[
            { permission: 'accounts:view', label: 'ดูบัญชีผู้ใช้', description: 'ดูรายการบัญชีทั้งหมด', uiLocation: 'ตารางบัญชี' },
            { permission: 'accounts:create', label: 'สร้างบัญชี', description: 'สร้างบัญชีผู้ใช้ใหม่', uiLocation: 'ปุ่ม "สร้างบัญชีใหม่"' },
            { permission: 'accounts:edit', label: 'แก้ไขบัญชี', description: 'แก้ไขข้อมูลบัญชีผู้ใช้', uiLocation: 'ปุ่ม "แก้ไข"' },
            { permission: 'accounts:delete', label: 'ลบบัญชี', description: 'ลบบัญชีผู้ใช้ออกจากระบบ', uiLocation: 'ปุ่ม "ลบ"' },
            { permission: 'accounts:suspend', label: 'ระงับ/ปลดล็อก', description: 'ระงับหรือปลดล็อกบัญชี', uiLocation: 'ปุ่ม "ระงับ/ปลดล็อก"' },
            { permission: 'accounts:reset_password', label: 'รีเซ็ตรหัสผ่าน', description: 'รีเซ็ตรหัสผ่านให้ผู้ใช้', uiLocation: 'ปุ่ม "รีเซ็ตรหัสผ่าน"' },
            { permission: 'accounts:manage_mfa', label: 'จัดการ MFA', description: 'เปิด/ปิด/รีเซ็ต MFA', uiLocation: 'ส่วนจัดการ MFA' },
            { permission: 'accounts:manage_sessions', label: 'จัดการ Session', description: 'ดูและบังคับออกจากระบบ', uiLocation: 'Tab "Sessions"' },
            { permission: 'accounts:view_activity', label: 'ดูประวัติกิจกรรม', description: 'ดูประวัติกิจกรรมผู้ใช้', uiLocation: 'Tab "ประวัติ"' },
            { permission: 'accounts:bulk_action', label: 'ดำเนินการกลุ่ม', description: 'ดำเนินการกับหลายบัญชีพร้อมกัน', uiLocation: 'Bulk Actions Bar' },
          ]}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'บัญชีทั้งหมด', value: statusCounts.total, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100' },
            { label: 'ใช้งาน', value: statusCounts.active, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
            { label: 'ถูกล็อก', value: statusCounts.locked, icon: Lock, color: 'from-red-500 to-rose-500', bg: 'from-red-50 to-rose-50' },
            { label: 'รอยืนยัน', value: statusCounts.pending, icon: Clock, color: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50' },
            { label: 'ปิดใช้', value: statusCounts.inactive, icon: XCircle, color: 'from-gray-400 to-gray-500', bg: 'from-gray-50 to-gray-100' },
            { label: 'MFA เปิด', value: `${mfaStats.rate}%`, icon: ShieldCheck, color: 'from-purple-500 to-indigo-500', bg: 'from-purple-50 to-indigo-50' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`border-0 overflow-hidden bg-gradient-to-br ${card.bg} hover:shadow-lg transition-all group`}>
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{card.value}</p>
                      <p className="text-[10px] text-gray-500">{card.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts"><Users className="w-4 h-4 mr-1.5" />บัญชีผู้ใช้ <Badge variant="secondary" className="ml-1.5">{accounts.length}</Badge></TabsTrigger>
            <TabsTrigger value="sessions"><Monitor className="w-4 h-4 mr-1.5" />Sessions ที่ใช้งาน <Badge variant="secondary" className="ml-1.5">{mockSessions.filter(s => s.status === 'active').length}</Badge></TabsTrigger>
            <TabsTrigger value="activity"><Activity className="w-4 h-4 mr-1.5" />ประวัติกิจกรรม</TabsTrigger>
          </TabsList>

          {/* ===== ACCOUNTS TAB ===== */}
          <TabsContent value="accounts" className="space-y-4">
            {/* Filters & Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="ค้นหาชื่อ, อีเมล, รหัสบัญชี, รหัสพนักงาน..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="สถานะ" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสถานะ</SelectItem>
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="locked">ถูกล็อก</SelectItem>
                      <SelectItem value="suspended">ระงับ</SelectItem>
                      <SelectItem value="inactive">ปิดใช้</SelectItem>
                      <SelectItem value="pending">รอยืนยัน</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="บทบาท" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกบทบาท</SelectItem>
                      <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                      <SelectItem value="EXEC">ผู้บริหาร</SelectItem>
                      <SelectItem value="MANAGER">ผู้จัดการส่วน</SelectItem>
                      <SelectItem value="STAFF">เจ้าหน้าที่ทุน</SelectItem>
                      <SelectItem value="REVIEWER">กรรมการพิจารณา</SelectItem>
                      <SelectItem value="FINANCE">เจ้าหน้าที่การเงิน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedAccounts.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="border-blue-300 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-600 text-white">{selectedAccounts.length} บัญชี</Badge>
                          <span className="text-sm text-blue-700">เลือกแล้ว</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { toast.success(`ส่งอีเมลถึง ${selectedAccounts.length} บัญชี`); setSelectedAccounts([]); }}><Mail className="w-3.5 h-3.5 mr-1" />ส่งอีเมล</Button>
                          <Button size="sm" variant="outline" onClick={() => { toast.success(`รีเซ็ตรหัสผ่าน ${selectedAccounts.length} บัญชี`); setSelectedAccounts([]); }}><RefreshCw className="w-3.5 h-3.5 mr-1" />รีเซ็ตรหัสผ่าน</Button>
                          <Button size="sm" variant="outline" onClick={() => { toast.success(`บังคับเปิด MFA ${selectedAccounts.length} บัญชี`); setSelectedAccounts([]); }}><ShieldCheck className="w-3.5 h-3.5 mr-1" />บังคับ MFA</Button>
                          <Button size="sm" variant="outline" className="text-orange-600" onClick={() => { toast.warning(`ระงับ ${selectedAccounts.length} บัญชี`); setSelectedAccounts([]); }}><Ban className="w-3.5 h-3.5 mr-1" />ระงับ</Button>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedAccounts([])}>ยกเลิก</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accounts Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"><Checkbox checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                        <TableHead>ผู้ใช้</TableHead>
                        <TableHead>บทบาท/กลุ่ม</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>MFA</TableHead>
                        <TableHead>รหัสผ่าน</TableHead>
                        <TableHead>เข้าใช้งานล่าสุด</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.map((acc, i) => {
                        const sc = getStatusConfig(acc.status);
                        const rc = roleColors[acc.roleCode] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                        const isSelected = selectedAccounts.includes(acc.id);
                        const isPasswordExpired = acc.passwordExpireDate !== '-' && acc.passwordExpireDate < '24 ก.พ. 2569';
                        return (
                          <motion.tr key={acc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className={`hover:bg-blue-50/50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''} ${acc.status === 'locked' ? 'bg-red-50/30' : ''}`}>
                            <TableCell><Checkbox checked={isSelected} onCheckedChange={() => toggleSelectAccount(acc.id)} /></TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs">{acc.name.slice(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${sc.dot} ring-2 ring-white`} />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{acc.name}</p>
                                  <p className="text-[11px] text-gray-500">{acc.email}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">{acc.id} / {acc.employeeId}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              <div className="space-y-1">
                                <Badge className={`text-[10px] ${rc.bg} ${rc.text} border`}>{acc.role}</Badge>
                                <div className="flex flex-wrap gap-0.5">
                                  {acc.groups.slice(0, 2).map(g => <Badge key={g} variant="outline" className="text-[9px] py-0">{g}</Badge>)}
                                  {acc.groups.length > 2 && <Badge variant="outline" className="text-[9px] py-0">+{acc.groups.length - 2}</Badge>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              <Badge className={`text-[10px] ${sc.bg} ${sc.color} border`}>
                                <sc.icon className="w-3 h-3 mr-0.5" />{sc.label}
                              </Badge>
                              {acc.failedLoginAttempts > 0 && <p className="text-[10px] text-red-600 mt-0.5">ล้มเหลว {acc.failedLoginAttempts} ครั้ง</p>}
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              {acc.mfaEnabled ? (
                                <div className="flex items-center gap-1 text-green-600"><ShieldCheck className="w-3.5 h-3.5" /><span className="text-[11px]">เปิด</span></div>
                              ) : (
                                <div className="flex items-center gap-1 text-orange-500"><ShieldAlert className="w-3.5 h-3.5" /><span className="text-[11px]">ปิด</span></div>
                              )}
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              {isPasswordExpired ? (
                                <Badge className="bg-red-100 text-red-700 text-[10px] border border-red-200"><AlertTriangle className="w-3 h-3 mr-0.5" />หมดอายุ</Badge>
                              ) : acc.passwordExpireDate === '-' ? (
                                <span className="text-[11px] text-gray-400">-</span>
                              ) : (
                                <span className="text-[11px] text-gray-500">หมดอายุ {acc.passwordExpireDate}</span>
                              )}
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              <div>
                                <p className="text-[11px] text-gray-600">{acc.lastLogin}</p>
                                {acc.lastLoginIp !== '-' && <p className="text-[10px] text-gray-400 font-mono">{acc.lastLoginIp}</p>}
                              </div>
                            </TableCell>
                            <TableCell onClick={() => openDetail(acc)}>
                              {acc.activeSessions > 0 ? (
                                <Badge className="bg-green-100 text-green-700 text-[10px]"><CircleDot className="w-3 h-3 mr-0.5 animate-pulse" />{acc.activeSessions} active</Badge>
                              ) : (
                                <span className="text-[11px] text-gray-400">0</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-0.5">
                                <Button size="sm" variant="ghost" onClick={() => openDetail(acc)}><Eye className="w-3.5 h-3.5" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => toast.success(`รีเซ็ตรหัสผ่าน ${acc.name}`)}><RefreshCw className="w-3.5 h-3.5" /></Button>
                                {acc.status === 'locked' ? (
                                  <Button size="sm" variant="ghost" className="text-green-600" onClick={() => toast.success(`ปลดล็อก ${acc.name}`)}><Unlock className="w-3.5 h-3.5" /></Button>
                                ) : acc.status === 'active' ? (
                                  <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning(`ระงับ ${acc.name}`)}><Ban className="w-3.5 h-3.5" /></Button>
                                ) : null}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-500">แสดง {filteredAccounts.length} จาก {accounts.length} บัญชี</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" disabled>ก่อนหน้า</Button>
                    <Button size="sm" variant="outline" className="bg-blue-600 text-white">1</Button>
                    <Button size="sm" variant="outline" disabled>ถัดไป</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== SESSIONS TAB ===== */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Badge className="bg-green-100 text-green-700 border border-green-200">Active: {mockSessions.filter(s => s.status === 'active').length}</Badge>
                <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200">Idle: {mockSessions.filter(s => s.status === 'idle').length}</Badge>
              </div>
              <Button variant="outline" className="text-red-600" onClick={() => toast.warning('บังคับออกจากระบบทุก Session')}><LogOut className="w-4 h-4 mr-2" />Force Logout ทั้งหมด</Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้ใช้</TableHead><TableHead>อุปกรณ์/เบราว์เซอร์</TableHead><TableHead>IP / ตำแหน่ง</TableHead><TableHead>เข้าใช้งาน</TableHead><TableHead>กิจกรรมล่าสุด</TableHead><TableHead>สถานะ</TableHead><TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((ses) => {
                      const user = accounts.find(a => a.id === ses.userId);
                      return (
                        <TableRow key={ses.id} className="hover:bg-blue-50/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-[10px]">{user?.name.slice(0, 2)}</AvatarFallback></Avatar>
                              <div><p className="text-sm font-medium">{user?.name}</p><p className="text-[10px] text-gray-400 font-mono">{ses.userId}</p></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {ses.device === 'Desktop' ? <Monitor className="w-4 h-4 text-gray-400" /> : <Smartphone className="w-4 h-4 text-gray-400" />}
                              <span className="text-sm">{ses.browser}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs font-mono text-gray-600">{ses.ip}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{ses.location}</p>
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">{ses.loginTime}</TableCell>
                          <TableCell className="text-xs text-gray-600">{ses.lastActivity}</TableCell>
                          <TableCell>
                            {ses.status === 'active' ? (
                              <Badge className="bg-green-100 text-green-700 text-[10px]"><CircleDot className="w-3 h-3 mr-0.5 animate-pulse" />Active</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700 text-[10px]"><Clock className="w-3 h-3 mr-0.5" />Idle</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning(`Force Logout: ${user?.name} (${ses.device})`)}><LogOut className="w-3.5 h-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== ACTIVITY TAB ===== */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base"><Activity className="w-5 h-5 text-purple-600" />ประวัติกิจกรรมผู้ใช้ทั้งระบบ</CardTitle>
                  <div className="flex gap-2">
                    <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="ความเสี่ยง" /></SelectTrigger><SelectContent><SelectItem value="all">ทั้งหมด</SelectItem><SelectItem value="high">สูง</SelectItem><SelectItem value="medium">ปานกลาง</SelectItem><SelectItem value="low">ต่ำ</SelectItem></SelectContent></Select>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />ส่งออก</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>เวลา</TableHead><TableHead>ผู้ใช้</TableHead><TableHead>กิจกรรม</TableHead><TableHead>รายละเอียด</TableHead><TableHead>IP</TableHead><TableHead>ความเสี่ยง</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mockActivityLogs.map((log) => {
                      const user = accounts.find(a => a.id === log.userId);
                      return (
                        <TableRow key={log.id} className={`hover:bg-blue-50/50 ${log.risk === 'high' ? 'bg-red-50/30' : ''}`}>
                          <TableCell className="text-xs font-mono whitespace-nowrap"><Clock className="w-3 h-3 text-gray-400 inline mr-1" />{log.time}</TableCell>
                          <TableCell><div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="bg-blue-500 text-white text-[8px]">{user?.name.slice(0, 2)}</AvatarFallback></Avatar><span className="text-sm">{user?.name}</span></div></TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{log.action}</Badge></TableCell>
                          <TableCell className="text-sm max-w-[300px] truncate">{log.detail}</TableCell>
                          <TableCell className="text-xs font-mono text-gray-500">{log.ip}</TableCell>
                          <TableCell>
                            {log.risk === 'high' ? <Badge className="bg-red-100 text-red-700 text-[10px]">สูง</Badge> :
                             log.risk === 'medium' ? <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">ปานกลาง</Badge> :
                             <Badge className="bg-green-100 text-green-700 text-[10px]">ต่ำ</Badge>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Account Detail Dialog ===== */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden max-h-[92vh]">
          {selectedAccount && (() => {
            const sc = getStatusConfig(selectedAccount.status);
            const rc = roleColors[selectedAccount.roleCode] || { bg: 'bg-gray-100', text: 'text-gray-700' };
            return (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-white/30"><AvatarFallback className="bg-white/20 text-white text-lg">{selectedAccount.name.slice(0, 2)}</AvatarFallback></Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${sc.dot} ring-2 ring-white`} />
                      </div>
                      <div>
                        <DialogTitle className="text-white text-lg">{selectedAccount.name}</DialogTitle>
                        <DialogDescription className="text-blue-100 mt-0.5">{selectedAccount.email}</DialogDescription>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge className={`text-[10px] ${rc.bg} ${rc.text} border`}>{selectedAccount.role}</Badge>
                          <Badge className={`text-[10px] ${sc.bg} ${sc.color} border`}>{sc.label}</Badge>
                          <Badge variant="outline" className="text-[10px] text-white/80 border-white/30">{selectedAccount.id}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => toast.success(`รีเซ็ตรหัสผ่าน ${selectedAccount.name}`)}><RefreshCw className="w-3.5 h-3.5 mr-1" />รีเซ็ตรหัสผ่าน</Button>
                      {selectedAccount.status === 'locked' ? (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => toast.success(`ปลดล็อก ${selectedAccount.name}`)}><Unlock className="w-3.5 h-3.5 mr-1" />ปลดล็อก</Button>
                      ) : selectedAccount.status === 'active' ? (
                        <Button size="sm" variant="destructive" onClick={() => toast.warning(`ระงับ ${selectedAccount.name}`)}><Ban className="w-3.5 h-3.5 mr-1" />ระงับ</Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Detail Tabs */}
                <div className="border-b bg-gray-50">
                  <div className="flex px-6">
                    {[
                      { id: 'info', label: 'ข้อมูลบัญชี', icon: SquareUser },
                      { id: 'security', label: 'ความปลอดภัย', icon: Shield },
                      { id: 'sessions', label: 'Sessions', icon: Monitor },
                      { id: 'history', label: 'ประวัติกิจกรรม', icon: History },
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setDetailTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-all ${detailTab === tab.id ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon className="w-4 h-4" />{tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 230px)' }}>
                  {/* ===== Info Tab ===== */}
                  {detailTab === 'info' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'รหัสบัญชี', value: selectedAccount.id, icon: Hash },
                          { label: 'รหัสพนักงาน', value: selectedAccount.employeeId, icon: Briefcase },
                          { label: 'ชื่อ-นามสกุล', value: selectedAccount.name, icon: SquareUser },
                          { label: 'อีเมล', value: selectedAccount.email, icon: Mail },
                          { label: 'โทรศัพท์', value: selectedAccount.phone, icon: Phone },
                          { label: 'หน่วยงาน', value: selectedAccount.department, icon: Building },
                          { label: 'ตำแหน่ง', value: selectedAccount.position, icon: Briefcase },
                          { label: 'วันที่สร้างบัญชี', value: selectedAccount.createdDate, icon: Calendar },
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border">
                            <Label className="text-[10px] text-gray-400 uppercase tracking-wide flex items-center gap-1"><item.icon className="w-3 h-3" />{item.label}</Label>
                            <p className="text-sm font-medium mt-1">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />
                      <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" />บทบาทและกลุ่ม</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${rc.bg} ${rc.text} border`}>{selectedAccount.role} ({selectedAccount.roleCode})</Badge>
                          {selectedAccount.groups.map(g => <Badge key={g} variant="outline">{g}</Badge>)}
                        </div>
                      </div>

                      {selectedAccount.notes && (
                        <>
                          <Separator />
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" /><div><p className="text-xs font-medium text-amber-800">หมายเหตุ</p><p className="text-sm text-amber-700 mt-0.5">{selectedAccount.notes}</p></div></div>
                          </div>
                        </>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => toast.success('บันทึกข้อมูลบัญชีเรียบร้อย')}><Save className="w-4 h-4 mr-1" />บันทึก</Button>
                        <Button variant="outline" onClick={() => toast.info('ส่งอีเมลยืนยัน')}><Mail className="w-4 h-4 mr-1" />ส่งอีเมล</Button>
                      </div>
                    </div>
                  )}

                  {/* ===== Security Tab ===== */}
                  {detailTab === 'security' && (
                    <div className="space-y-5">
                      {/* MFA */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2"><Fingerprint className="w-4 h-4 text-purple-600" />การยืนยันตัวตนสองชั้น (MFA)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {selectedAccount.mfaEnabled ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <ShieldAlert className="w-5 h-5 text-orange-500" />}
                              <div>
                                <p className="text-sm font-medium">{selectedAccount.mfaEnabled ? 'เปิดใช้งาน MFA' : 'ยังไม่เปิดใช้ MFA'}</p>
                                <p className="text-xs text-gray-500">{selectedAccount.mfaMethod}</p>
                              </div>
                            </div>
                            <Switch checked={selectedAccount.mfaEnabled} onCheckedChange={() => toast.success(`${selectedAccount.mfaEnabled ? 'ปิด' : 'เปิด'} MFA สำหรับ ${selectedAccount.name}`)} />
                          </div>
                          {selectedAccount.mfaEnabled && (
                            <Button variant="outline" size="sm" onClick={() => toast.success('รีเซ็ต MFA สำเร็จ ผู้ใช้ต้องตั้งค่าใหม่')}><RefreshCw className="w-3.5 h-3.5 mr-1" />รีเซ็ต MFA</Button>
                          )}
                        </CardContent>
                      </Card>

                      {/* Password */}
                      <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Key className="w-4 h-4 text-blue-600" />รหัสผ่าน</CardTitle></CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">เปลี่ยนล่าสุด</Label><p className="text-sm font-medium mt-1">{selectedAccount.passwordChangedDate}</p></div>
                            <div className={`p-3 rounded-lg border ${selectedAccount.passwordExpireDate !== '-' && selectedAccount.passwordExpireDate < '24 ก.พ. 2569' ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                              <Label className="text-[10px] text-gray-400">หมดอายุ</Label>
                              <p className={`text-sm font-medium mt-1 ${selectedAccount.passwordExpireDate !== '-' && selectedAccount.passwordExpireDate < '24 ก.พ. 2569' ? 'text-red-600' : ''}`}>{selectedAccount.passwordExpireDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => toast.success(`รีเซ็ตรหัสผ่านและส่งอีเมลถึง ${selectedAccount.email}`)}><RefreshCw className="w-3.5 h-3.5 mr-1" />รีเซ็ตรหัสผ่าน</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.info('บังคับเปลี่ยนรหัสผ่านเมื่อล็อกอินครั้งถัดไป')}><Lock className="w-3.5 h-3.5 mr-1" />บังคับเปลี่ยน</Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Login Stats */}
                      <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-600" />สถิติการเข้าใช้งาน</CardTitle></CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-100"><p className="text-xl font-bold text-blue-600">{selectedAccount.loginCount}</p><p className="text-[10px] text-gray-500">เข้าใช้ทั้งหมด</p></div>
                            <div className="p-3 bg-green-50 rounded-lg text-center border border-green-100"><p className="text-xl font-bold text-green-600">{selectedAccount.activeSessions}</p><p className="text-[10px] text-gray-500">Sessions Active</p></div>
                            <div className={`p-3 rounded-lg text-center border ${selectedAccount.failedLoginAttempts > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}><p className={`text-xl font-bold ${selectedAccount.failedLoginAttempts > 0 ? 'text-red-600' : 'text-gray-400'}`}>{selectedAccount.failedLoginAttempts}</p><p className="text-[10px] text-gray-500">ล็อกอินล้มเหลว</p></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">เข้าใช้ล่าสุด</Label><p className="text-sm mt-1">{selectedAccount.lastLogin}</p></div>
                            <div className="p-3 bg-slate-50 rounded-lg border"><Label className="text-[10px] text-gray-400">อุปกรณ์ล่าสุด</Label><p className="text-sm mt-1">{selectedAccount.lastLoginDevice}</p></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* ===== Sessions Tab ===== */}
                  {detailTab === 'sessions' && (
                    <div className="space-y-4">
                      {accountSessions.length > 0 ? (
                        <>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{accountSessions.length} session(s) พบ</p>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => toast.warning('Force Logout ทุก Session')}><LogOut className="w-3.5 h-3.5 mr-1" />Force Logout ทั้งหมด</Button>
                          </div>
                          {accountSessions.map(ses => (
                            <Card key={ses.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {ses.device === 'Desktop' ? <Monitor className="w-8 h-8 text-gray-400" /> : <Smartphone className="w-8 h-8 text-gray-400" />}
                                    <div>
                                      <p className="text-sm font-medium">{ses.browser}</p>
                                      <p className="text-xs text-gray-500">{ses.ip} - {ses.location}</p>
                                      <p className="text-[10px] text-gray-400">Login: {ses.loginTime} | Last: {ses.lastActivity}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {ses.status === 'active' ? <Badge className="bg-green-100 text-green-700 text-[10px]">Active</Badge> : <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Idle</Badge>}
                                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning('Force Logout session นี้')}><LogOut className="w-3.5 h-3.5" /></Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-12 text-gray-500"><Monitor className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-sm">ไม่มี Session ที่ใช้งานอยู่</p></div>
                      )}
                    </div>
                  )}

                  {/* ===== History Tab ===== */}
                  {detailTab === 'history' && (
                    <div className="space-y-3">
                      {accountLogs.length > 0 ? accountLogs.map(log => (
                        <div key={log.id} className={`p-3 border rounded-lg ${log.risk === 'high' ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {log.risk === 'high' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Activity className="w-4 h-4 text-gray-400" />}
                              <Badge variant="outline" className="text-[10px]">{log.action}</Badge>
                              <span className="text-sm">{log.detail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500"><Clock className="w-3 h-3" />{log.time}</div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 ml-6 font-mono">IP: {log.ip}</p>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-gray-500"><History className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-sm">ไม่มีประวัติกิจกรรม</p></div>
                      )}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ===== Create Account Dialog ===== */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh]">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 text-white">
            <DialogTitle className="text-white text-lg flex items-center gap-2"><UserPlus className="w-5 h-5" />สร้างบัญชีผู้ใช้ใหม่</DialogTitle>
            <DialogDescription className="text-green-100 mt-1">กรอกข้อมูลสำหรับสร้างบัญชีผู้ใช้ในระบบ</DialogDescription>
          </div>
          <div className="px-6 py-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>รหัสพนักงาน <span className="text-red-500">*</span></Label><Input placeholder="เช่น EMP-10100" /></div>
              <div className="space-y-2"><Label>ชื่อ-นามสกุล <span className="text-red-500">*</span></Label><Input placeholder="กรอกชื่อ-นามสกุล" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>อีเมล <span className="text-red-500">*</span></Label><Input type="email" placeholder="user@scholarship.go.th" /></div>
              <div className="space-y-2"><Label>โทรศัพท์</Label><Input placeholder="02-xxx-xxxx ต่อ xxx" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>หน่วยงาน <span className="text-red-500">*</span></Label>
                <Select><SelectTrigger><SelectValue placeholder="เลือกหน่วยงาน" /></SelectTrigger><SelectContent>
                  {['กองทุนการศึกษา', 'กองทุนวิจัย', 'กองทุนพัฒนา', 'ฝ่ายการเงิน', 'คณะกรรมการพิจารณาทุน', 'สำนักผู้บริหาร', 'ศูนย์เทคโนโลยีสารสนเทศ'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>ตำแหน่ง <span className="text-red-500">*</span></Label><Input placeholder="เช่น เจ้าหน้าที่ทุน" /></div>
            </div>
            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" />บทบาทและกลุ่ม</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>บทบาท <span className="text-red-500">*</span></Label>
                <Select><SelectTrigger><SelectValue placeholder="เลือกบทบาท" /></SelectTrigger><SelectContent>
                  <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem><SelectItem value="EXEC">ผู้บริหาร</SelectItem><SelectItem value="MANAGER">ผู้จัดการส่วน</SelectItem><SelectItem value="STAFF">เจ้าหน้าที่ทุน</SelectItem><SelectItem value="REVIEWER">กรรมการพิจารณา</SelectItem><SelectItem value="FINANCE">เจ้าหน้าที่การเงิน</SelectItem><SelectItem value="AUDITOR">ผู้ตรวจสอบ</SelectItem>
                </SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>กลุ่มผู้ใช้</Label>
                <Select><SelectTrigger><SelectValue placeholder="เลือกกลุ่ม" /></SelectTrigger><SelectContent>
                  {['GRP-ADMIN', 'GRP-EXEC', 'GRP-MANAGER', 'GRP-STAFF', 'GRP-COMMITTEE', 'GRP-OVERSEAS', 'GRP-RESEARCH', 'GRP-FINANCE'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent></Select>
              </div>
            </div>
            <Separator />
            <h4 className="text-sm font-semibold flex items-center gap-2"><Lock className="w-4 h-4 text-purple-600" />ความปลอดภัย</h4>
            <div className="space-y-2"><Label>รหัสผ่านเริ่มต้น</Label><Input type="password" placeholder="อย่างน้อย 12 ตัวอักษร" /><p className="text-xs text-gray-500">ต้องประกอบด้วย ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข อักขระพิเศษ</p></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"><div className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-purple-600" /><Label className="font-normal">บังคับเปิด MFA</Label></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /><Label className="font-normal">ส่งอีเมลแจ้งรหัสผ่าน</Label></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"><div className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-600" /><Label className="font-normal">บังคับเปลี่ยนรหัสผ่านเมื่อล็อกอินครั้งแรก</Label></div><Switch defaultChecked /></div>
            </div>
            <Separator />
            <div className="space-y-2"><Label>หมายเหตุ</Label><Textarea placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" rows={2} /></div>
          </div>
          <div className="border-t bg-gray-50 px-6 py-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>ยกเลิก</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setCreateOpen(false); toast.success('สร้างบัญชีใหม่เรียบร้อย ระบบส่งอีเมลแจ้งผู้ใช้แล้ว'); }}><UserPlus className="w-4 h-4 mr-1" />สร้างบัญชี</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
