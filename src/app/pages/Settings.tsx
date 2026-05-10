import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Search
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

const users = [
  {
    id: 1,
    name: 'นางสาวพิมพ์พร เจ้าหน้าที่',
    email: 'pimporn@example.com',
    role: 'staff',
    status: 'active',
    lastLogin: '20/02/2026 14:30',
    mfaEnabled: true,
  },
  {
    id: 2,
    name: 'นายสมชาย ผู้จัดการ',
    email: 'somchai.m@example.com',
    role: 'approver',
    status: 'active',
    lastLogin: '20/02/2026 09:15',
    mfaEnabled: true,
  },
  {
    id: 3,
    name: 'นางสาววิภา ผู้บริหาร',
    email: 'wipa@example.com',
    role: 'executive',
    status: 'active',
    lastLogin: '19/02/2026 16:45',
    mfaEnabled: false,
  },
  {
    id: 4,
    name: 'นายประยุทธ์ ผู้ดูแลระบบ',
    email: 'prayut.admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '20/02/2026 15:00',
    mfaEnabled: true,
  },
];

const roles = [
  {
    id: 'staff',
    name: 'เจ้าหน้าที่ทุน',
    description: 'จัดการใบสมัคร ตรวจเอกสาร ส่งพิจารณา',
    userCount: 24,
    permissions: {
      applications: ['view', 'create', 'edit'],
      awards: ['view'],
      payment: ['view'],
      reports: ['view', 'export'],
      masterData: ['view'],
      settings: [],
    },
  },
  {
    id: 'approver',
    name: 'ผู้อนุมัติ',
    description: 'พิจารณาและอนุมัติทุน',
    userCount: 8,
    permissions: {
      applications: ['view', 'edit', 'approve'],
      awards: ['view', 'create'],
      payment: ['view', 'approve'],
      reports: ['view', 'export'],
      masterData: ['view'],
      settings: [],
    },
  },
  {
    id: 'executive',
    name: 'ผู้บริหาร',
    description: 'ดูรายงานและภาพรวม',
    userCount: 3,
    permissions: {
      applications: ['view'],
      awards: ['view'],
      payment: ['view'],
      reports: ['view', 'export'],
      masterData: ['view'],
      settings: [],
    },
  },
  {
    id: 'admin',
    name: 'ผู้ดูแลระบบ',
    description: 'จัดการระบบและผู้ใช้งาน',
    userCount: 2,
    permissions: {
      applications: ['view', 'create', 'edit', 'delete'],
      awards: ['view', 'create', 'edit', 'delete'],
      payment: ['view', 'create', 'edit', 'approve'],
      reports: ['view', 'export', 'manage'],
      masterData: ['view', 'create', 'edit', 'delete'],
      settings: ['view', 'edit', 'manage'],
    },
  },
];

export default function Settings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  const getRoleBadge = (role: string) => {
    const roleMap: any = {
      staff: { label: 'เจ้าหน้าที่', color: 'bg-blue-100 text-blue-700' },
      approver: { label: 'ผู้อนุมัติ', color: 'bg-green-100 text-green-700' },
      executive: { label: 'ผู้บริหาร', color: 'bg-purple-100 text-purple-700' },
      admin: { label: 'ผู้ดูแลระบบ', color: 'bg-red-100 text-red-700' },
    };
    const r = roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-700' };
    return <Badge className={r.color}>{r.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            ใช้งาน
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่ใช้งาน
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-full">
      <PageHeader
        title="การตั้งค่า"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'การตั้งค่า' },
        ]}
      />

      <div className="p-8 space-y-6">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="การตั้งค่า"
          moduleName="settings"
          defaultExpanded={false}
          permissions={[
            {
              permission: 'settings:view',
              label: 'ดูการตั้งค่า',
              description: 'ดูค่าตั้งค่าระบบทั้งหมด',
              uiLocation: 'หน้าการตั้งค่าหลัก',
            },
            {
              permission: 'users:manage',
              label: 'จัดการผู้ใช้',
              description: 'เพิ่ม แก้ไข ลบ ผู้ใช้',
              uiLocation: 'Tab "ผู้ใช้งาน"',
            },
            {
              permission: 'roles:manage',
              label: 'จัดการบทบาท',
              description: 'จัดการบทบาทและสิทธิ์',
              uiLocation: 'Tab "บทบาท & สิทธิ์"',
            },
            {
              permission: 'permissions:manage',
              label: 'จัดการสิทธิ์',
              description: 'กำหนดสิทธิ์ให้แต่ละบทบาท',
              uiLocation: 'หน้าจัดการสิทธิ์',
            },
            {
              permission: 'settings:edit_system',
              label: 'แก้ไขการตั้งค่าระบบ',
              description: 'แก้ไขการตั้งค่าระดับระบบ',
              uiLocation: 'Tab "ระบบ"',
            },
            {
              permission: 'settings:edit_notifications',
              label: 'แก้ไขแจ้งเตือน',
              description: 'จัดการเทมเพลตการแจ้งเตือน',
              uiLocation: 'Tab "การแจ้งเตือน"',
            },
          ]}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <ProtectedTabsTrigger value="users" permission="users:view">
              <Users className="w-4 h-4 mr-2" />
              ผู้ใช้งาน
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="roles" permission="roles:view">
              <Shield className="w-4 h-4 mr-2" />
              บทบาทและสิทธิ์
            </ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="security" permission="security:view">
              <Lock className="w-4 h-4 mr-2" />
              ความปลอดภัย
            </ProtectedTabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาผู้ใช้งาน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    เพิ่มผู้ใช้
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                    <DialogDescription>
                      กรอกข้อมูลผู้ใช้และกำหนดบทบาท
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ชื่อ</Label>
                        <Input placeholder="นาย/นาง/นางสาว" />
                      </div>
                      <div className="space-y-2">
                        <Label>นามสกุล</Label>
                        <Input />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>อีเมล</Label>
                      <Input type="email" placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>บทบาท</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกบทบาท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">เจ้าหน้าที่ทุน</SelectItem>
                          <SelectItem value="approver">ผู้อนุมัติ</SelectItem>
                          <SelectItem value="executive">ผู้บริหาร</SelectItem>
                          <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>รหัสผ่านชั่วคราว</Label>
                      <Input type="password" placeholder="ระบบจะส่งไปยังอีเมล" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="require-mfa" />
                      <Label htmlFor="require-mfa" className="font-normal">
                        บังคับใช้ MFA (Two-Factor Authentication)
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                      ยกเลิก
                    </Button>
                    <Button onClick={() => { setAddUserOpen(false); toast.success('เพิ่มผู้ใช้งานใหม่เรียบร้อย', { description: 'ระบบส่งอีเมลรหัสผ่านชั่วคราวไปแล้ว' }); }}>
                      เพิ่มผู้ใช้
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อ-นามสกุล</TableHead>
                      <TableHead>อีเมล</TableHead>
                      <TableHead>บทบาท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>เข้าใช้ล่าสุด</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50"
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {user.mfaEnabled ? (
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              <Shield className="w-3 h-3 mr-1" />
                              เปิด
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-200 text-gray-700">
                              ปิด
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            {user.lastLogin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => toast.info('เปิดแก้ไขข้อมูลผู้ใช้')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.error('ปิดการใช้งานผู้ใช้')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            {role.name}
                          </CardTitle>
                          <CardDescription className="mt-2">{role.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{role.userCount} คน</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">สิทธิ์การเข้าถึง:</Label>
                        <div className="mt-2 space-y-2">
                          {Object.entries(role.permissions).map(([module, perms]) => (
                            <div key={module} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">
                                {module === 'applications' && 'ใบสมัคร'}
                                {module === 'awards' && 'ทุน/สัญญา'}
                                {module === 'payment' && 'การจ่ายเงิน'}
                                {module === 'reports' && 'รายงาน'}
                                {module === 'masterData' && 'ข้อมูลหลัก'}
                                {module === 'settings' && 'การตั้งค่า'}
                              </span>
                              <div className="flex gap-1">
                                {(perms as string[]).map((perm) => (
                                  <Badge key={perm} variant="outline" className="text-xs">
                                    {perm === 'view' && 'ดู'}
                                    {perm === 'create' && 'สร้าง'}
                                    {perm === 'edit' && 'แก้ไข'}
                                    {perm === 'delete' && 'ลบ'}
                                    {perm === 'approve' && 'อนุมัติ'}
                                    {perm === 'export' && 'ส่งออก'}
                                    {perm === 'manage' && 'จัดการ'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('เปิดแก้ไขสิทธิ์...')}>
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไขสิทธิ์
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    นโยบายรหัสผ่าน
                  </CardTitle>
                  <CardDescription>
                    กำหนดข้อกำหนดความปลอดภัยของรหัสผ่าน
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>ความยาวขั้นต่ำ</Label>
                    <Input type="number" defaultValue={8} min={6} max={32} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ต้องมีตัวพิมพ์ใหญ่</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ต้องมีตัวเลข</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ต้องมีอักขระพิเศษ</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>อายุรหัสผ่าน (วัน)</Label>
                    <Input type="number" defaultValue={90} />
                  </div>
                  <Button className="w-full" onClick={() => toast.success('บันทึกนโยบายรหัสผ่านเรียบร้อย')}>บันทึกการตั้งค่า</Button>
                </CardContent>
              </Card>

              {/* Session Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    การจัดการเซสชัน
                  </CardTitle>
                  <CardDescription>
                    กำหนดระยะเวลาการเข้าใช้งาน
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>หมดอายุเซสชันหลัง (นาที)</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 นาที</SelectItem>
                        <SelectItem value="30">30 นาที</SelectItem>
                        <SelectItem value="60">1 ชั่วโมง</SelectItem>
                        <SelectItem value="120">2 ชั่วโมง</SelectItem>
                        <SelectItem value="480">8 ชั่วโมง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>บังคับออกจากระบบเมื่อหมดเซสชัน</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>อนุญาตเข้าใช้พร้อมกันหลายอุปกรณ์</Label>
                    <Switch />
                  </div>
                  <Button className="w-full" onClick={() => toast.success('บันทึกการตั้งค่าเซสชันเรียบร้อย')}>บันทึกการตั้งค่า</Button>
                </CardContent>
              </Card>

              {/* MFA Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    Multi-Factor Authentication (MFA)
                  </CardTitle>
                  <CardDescription>
                    ความปลอดภัยเพิ่มเติมด้วยการยืนยันตัวตน 2 ชั้น
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>บังคับใช้ MFA สำหรับทุกคน</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>บังคับ MFA สำหรับผู้ดูแลระบบ</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>วิธีการยืนยัน</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms" defaultChecked />
                        <Label htmlFor="sms" className="font-normal">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email" defaultChecked />
                        <Label htmlFor="email" className="font-normal">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="app" defaultChecked />
                        <Label htmlFor="app" className="font-normal">แอพยืนยันตัวตน (Google Authenticator)</Label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => toast.success('บันทึกการตั้งค่า MFA เรียบร้อย')}>บันทึกการตั้งค่า</Button>
                </CardContent>
              </Card>

              {/* Export Restrictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    การจำกัดการส่งออกข้อมูล
                  </CardTitle>
                  <CardDescription>
                    ควบคุมการส่งออกเอกสารและรายงาน
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>บังคับระบุเหตุผลการส่งออก</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>บังคับตั้งรหัสผ่านไฟล์ PDF</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>ใส่วอเตอร์มาร์กอัตโนมัติ</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>แจ้งเตือนเมื่อมีการส่งออก</Label>
                    <Switch defaultChecked />
                  </div>
                  <Button className="w-full" onClick={() => toast.success('บันทึกการตั้งค่าการส่งออกเรียบร้อย')}>บันทึกการตั้งค่า</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}