import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Key,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Search,
  Filter,
  Download,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { RoleIndicator } from '../components/rbac/RoleIndicator';
import {
  PERMISSIONS,
  ROLES,
  RoleId,
  getPermissionsByCategory,
  PERMISSION_CATEGORIES,
} from '../lib/permissions';
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
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export default function MyPermissions() {
  const { user } = useAuth();
  const { permissions, roleInfo, roleName } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [compareRole, setCompareRole] = useState<RoleId | null>(null);

  // Group permissions by category
  const permissionsByCategory = getPermissionsByCategory(permissions);

  // Filter permissions based on search and category
  const filteredPermissions = permissions.filter((perm) => {
    const permName = PERMISSIONS[perm].toLowerCase();
    const permKey = perm.toLowerCase();
    const matchesSearch = permName.includes(searchQuery.toLowerCase()) || permKey.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || perm.startsWith(selectedCategory + ':');
    return matchesSearch && matchesCategory;
  });

  // Get all permissions for comparison
  const allPermissionsCount = Object.keys(PERMISSIONS).length;
  const userPermissionsCount = permissions.length;
  const permissionCoverage = Math.round((userPermissionsCount / allPermissionsCount) * 100);

  // Categories with counts
  const categoriesWithCount = Object.keys(PERMISSION_CATEGORIES).map((cat) => {
    const categoryPerms = permissions.filter((p) => p.startsWith(cat + ':'));
    const allCategoryPerms = (Object.keys(PERMISSIONS) as Array<keyof typeof PERMISSIONS>).filter((p) => p.startsWith(cat + ':'));
    return {
      id: cat,
      ...PERMISSION_CATEGORIES[cat as keyof typeof PERMISSION_CATEGORIES],
      count: categoryPerms.length,
      total: allCategoryPerms.length,
    };
  }).filter((cat) => cat.total > 0);

  return (
    <div className="min-h-full">
      <PageHeader
        title="สิทธิ์การใช้งานของฉัน"
        breadcrumbs={[
          { label: 'แดชบอร์ด', href: '/' },
          { label: 'สิทธิ์การใช้งานของฉัน' },
        ]}
      />

      <div className="p-8 space-y-6">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{user?.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RoleIndicator role={user?.role as RoleId} size="lg" />
                      <div className="text-sm text-gray-600">
                        {roleInfo?.description}
                      </div>
                    </div>
                  </div>
                </div>
                <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      ขอสิทธิ์เพิ่มเติม
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ขอสิทธิ์การใช้งานเพิ่มเติม</DialogTitle>
                      <DialogDescription>
                        กรอกรายละเอียดเพื่อขอสิทธิ์จากผู้ดูแลระบบ
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>สิทธิ์ที่ต้องการ</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสิทธิ์" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approval:approve">อนุมัติทุน</SelectItem>
                            <SelectItem value="payment:approve">อนุมัติการจ่ายเงิน</SelectItem>
                            <SelectItem value="users:create">สร้างผู้ใช้ใหม่</SelectItem>
                            <SelectItem value="reports:export">ส่งออกรายงาน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>เหตุผล</Label>
                        <Textarea
                          placeholder="อธิบายว่าทำไมต้องการสิทธิ์นี้..."
                          className="min-h-32"
                        />
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-900">
                          คำขอจะถูกส่งไปยังผู้ดูแลระบบเพื่อพิจารณา คุณจะได้รับแจ้งเตือนทางอีเมลเมื่อมีการอนุมัติ
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button
                        onClick={() => {
                          setRequestDialogOpen(false);
                          toast.success('ส่งคำขอสิทธิ์เรียบร้อย', {
                            description: 'ผู้ดูแลระบบจะพิจารณาภายใน 1-2 วันทำการ',
                          });
                        }}
                      >
                        ส่งคำขอ
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">สิทธิ์ที่มี</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                      {userPermissionsCount}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      จาก {allPermissionsCount} สิทธิ์ทั้งหมด
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">ความครอบคลุม</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
                      {permissionCoverage}%
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${permissionCoverage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-xl transition-all duration-300">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">หมวดหมู่</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent mt-1">
                      {Object.keys(permissionsByCategory).length}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      จาก {categoriesWithCount.length} หมวด
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                    <Key className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="permissions">
              <Key className="w-4 h-4" />
              สิทธิ์ของฉัน
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Filter className="w-4 h-4" />
              แยกตามหมวดหมู่
            </TabsTrigger>
            <TabsTrigger value="compare">
              <ArrowRight className="w-4 h-4" />
              เปรียบเทียบบทบาท
            </TabsTrigger>
          </TabsList>

          {/* Permissions List */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>สิทธิ์ทั้งหมดของคุณ</CardTitle>
                    <CardDescription>
                      รายการสิทธิ์การใช้งานที่คุณสามารถทำได้ในระบบ
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    ส่งออก PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาสิทธิ์..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Permissions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPermissions.map((perm, index) => (
                    <motion.div
                      key={perm}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-all group"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">
                          {PERMISSIONS[perm]}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {perm}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredPermissions.length === 0 && (
                  <div className="text-center py-12">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">ไม่พบสิทธิ์ที่ค้นหา</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesWithCount.map((category, index) => {
                const hasPermissions = category.count > 0;
                const percentage = Math.round((category.count / category.total) * 100);

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`${hasPermissions ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${hasPermissions ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                              {hasPermissions ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-base">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {category.count} / {category.total} สิทธิ์
                              </p>
                            </div>
                          </div>
                          <Badge variant={hasPermissions ? 'default' : 'secondary'} className={hasPermissions ? 'bg-green-100 text-green-700' : ''}>
                            {percentage}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Compare Roles */}
          <TabsContent value="compare" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>เปรียบเทียบสิทธิ์กับบทบาทอื่น</CardTitle>
                <CardDescription>
                  ดูความแตกต่างระหว่างบทบาทของคุณกับบทบาทอื่นๆ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>เลือกบทบาทเพื่อเปรียบเทียบ</Label>
                  <Select
                    value={compareRole || ''}
                    onValueChange={(value) => setCompareRole(value as RoleId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLES).map(([roleId, role]) => (
                        <SelectItem key={roleId} value={roleId} disabled={roleId === user?.role}>
                          {role.nameLocal} {roleId === user?.role && '(บทบาทปัจจุบัน)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {compareRole && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">บทบาทของคุณ</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RoleIndicator role={user?.role as RoleId} size="lg" />
                          <p className="text-sm text-gray-600 mt-2">
                            {userPermissionsCount} สิทธิ์
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 border-purple-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">เปรียบเทียบกับ</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RoleIndicator role={compareRole} size="lg" />
                          <p className="text-sm text-gray-600 mt-2">
                            {ROLES[compareRole].permissions.length} สิทธิ์
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900">
                        <strong>สิทธิ์ที่ {ROLES[compareRole].nameLocal} มีแต่คุณไม่มี:</strong> {
                          ROLES[compareRole].permissions.filter(p => !permissions.includes(p)).length
                        } สิทธิ์
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <h4 className="font-semibold mb-3">รายละเอียดความแตกต่าง</h4>
                      <div className="space-y-2">
                        {ROLES[compareRole].permissions.filter(p => !permissions.includes(p)).map((perm) => (
                          <div key={perm} className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-100">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-red-900">{PERMISSIONS[perm]}</p>
                              <p className="text-xs text-red-600 font-mono">{perm}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
