import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  Users,
  FolderOpen,
  Plus,
  Search,
  RefreshCw,
  X,
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Upload,
  Save,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);
  const [newAppForm, setNewAppForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    scholarshipType: '',
    province: '',
    note: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for staff
  const myTasks = {
    today: 8,
    overdue: 3,
    thisWeek: 15,
    completed: 47
  };

  const pendingApplications = [
    {
      id: 'APP-2026-001',
      applicant: 'นายสมชาย ใจดี',
      type: 'ทุนการศึกษาระดับปริญญาโท',
      submittedDate: '2026-02-18',
      daysLeft: 2,
      priority: 'high',
      status: 'รอตรวจสอบเอกสาร'
    },
    {
      id: 'APP-2026-002',
      applicant: 'นางสาวสมหญิง รักเรียน',
      type: 'ทุนวิจัย',
      submittedDate: '2026-02-19',
      daysLeft: 4,
      priority: 'medium',
      status: 'รอยืนยันข้อมูล'
    },
    {
      id: 'APP-2026-003',
      applicant: 'นายประยุทธ์ ขยัน',
      type: 'ทุนฝึกอบรม',
      submittedDate: '2026-02-20',
      daysLeft: 5,
      priority: 'low',
      status: 'รอตรวจสอบคุณสมบัติ'
    }
  ];

  const workflowTasks = [
    { stage: 'ตรวจสอบเอกสาร', count: 12, color: 'bg-blue-500' },
    { stage: 'ยืนยันข้อมูล', count: 8, color: 'bg-cyan-500' },
    { stage: 'ตรวจสอบคุณสมบัติ', count: 5, color: 'bg-green-500' },
    { stage: 'รอข้อมูลเพิ่มเติม', count: 3, color: 'bg-yellow-500' }
  ];

  const recentActivities = [
    {
      action: 'ตรวจสอบเอกสารเสร็จสิ้น',
      application: 'APP-2026-045',
      time: '10 นาทีที่แล้ว',
      type: 'success'
    },
    {
      action: 'ส่งคำขอข้อมูลเพิ่มเติม',
      application: 'APP-2026-044',
      time: '25 นาทีที่แล้ว',
      type: 'info'
    },
    {
      action: 'อัพเดตสถานะ',
      application: 'APP-2026-043',
      time: '1 ชั่วโมงที่แล้ว',
      type: 'info'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
    toast.success('รีเฟรชข้อมูลเรียบร้อย', {
      description: 'ข้อมูลแดชบอร์ดอัพเดตล่าสุดแล้ว',
    });
  };

  const handleSaveNewApp = async () => {
    if (!newAppForm.applicantName || !newAppForm.email || !newAppForm.scholarshipType) {
      toast.error('กรุณากรอกข้อมูลให้ครบ', {
        description: 'ชื่อผู้สมัคร, อีเมล, และประเภททุน เป็นข้อมูลที่จำเป็น',
      });
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSaving(false);
    setShowNewAppDialog(false);
    setNewAppForm({ applicantName: '', email: '', phone: '', scholarshipType: '', province: '', note: '' });
    toast.success('สร้างใบสมัครใหม่สำเร็จ', {
      description: `ใบสมัครของ ${newAppForm.applicantName} ถูกสร้างเรียบร้อยแล้ว`,
      action: {
        label: 'ดูรายละเอียด',
        onClick: () => navigate('/applications/APP-2026-004'),
      },
    });
  };

  const handleViewApplication = (appId: string) => {
    navigate(`/applications/${appId}`);
  };

  return (
    <div className="space-y-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            แดชบอร์ดเจ้าหน้าที่
          </h1>
          <p className="text-gray-600 mt-1">
            สวัสดี {user?.name} - จัดการงานของคุณได้ที่นี่
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </motion.div>
            {isRefreshing ? 'กำลังรีเฟรช...' : 'รีเฟรช'}
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            onClick={() => setShowNewAppDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มใบสมัคร
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className="border-0 cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group relative bg-gradient-to-br from-blue-50 to-cyan-50"
            onClick={() => navigate('/applications')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                งานวันนี้
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">{myTasks.today}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3">
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 group-hover:translate-x-1 transition-transform"
                  onClick={(e) => { e.stopPropagation(); navigate('/applications'); }}
                >
                  ดูทั้งหมด →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="border-0 cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group relative bg-gradient-to-br from-red-50 to-orange-50"
            onClick={() => navigate('/applications')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                งานเกินกำหนด
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent">{myTasks.overdue}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3">
                <Button
                  variant="link"
                  className="p-0 h-auto text-red-600 group-hover:translate-x-1 transition-transform"
                  onClick={(e) => { e.stopPropagation(); navigate('/applications'); }}
                >
                  ดำเนินการด่วน →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                งานสัปดาห์นี้
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-yellow-600 to-amber-600 bg-clip-text text-transparent">{myTasks.thisWeek}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3">
                <Progress value={53} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            className="border-0 cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group relative bg-gradient-to-br from-green-50 to-emerald-50"
            onClick={() => navigate('/reports')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                งานที่เสร็จแล้ว
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">{myTasks.completed}</div>
              <p className="text-sm text-gray-600 mt-1">รายการเดือนนี้</p>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% จากเดือนก่อน
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  ใบสมัครที่ต้องตรวจสอบ
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/applications')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApplications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => handleViewApplication(app.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{app.id}</span>
                          <Badge
                            variant={
                              app.priority === 'high'
                                ? 'destructive'
                                : app.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {app.priority === 'high' ? 'เร่งด่วน' : app.priority === 'medium' ? 'ปานกลาง' : 'ปกติ'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{app.applicant}</p>
                        <p className="text-sm text-gray-600 mt-1">{app.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>ส่งเมื่อ: {app.submittedDate}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            เหลือ {app.daysLeft} วัน
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewApplication(app.id);
                        }}
                      >
                        ตรวจสอบ
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full px-3 py-1">
                        <p className="text-xs text-gray-700">{app.status}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/applications')}
                >
                  ดูใบสมัครทั้งหมด
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Workflow Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  งานตามขั้นตอน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflowTasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/applications')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${task.color}`} />
                        <span className="text-sm font-medium text-gray-700">{task.stage}</span>
                      </div>
                      <Badge variant="secondary">{task.count}</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-blue-600" />
                  กิจกรรมล่าสุด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 rounded p-2 -m-1 transition-colors"
                      onClick={() => handleViewApplication(activity.application)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                        <p className="text-xs text-blue-600 mt-0.5 hover:underline">{activity.application}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">การดำเนินการด่วน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col py-6 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all group hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                onClick={() => setShowNewAppDialog(true)}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center mb-3 transition-all group-hover:scale-110">
                  <Plus className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold">เพิ่มใบสมัคร</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col py-6 hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-700 transition-all group hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                onClick={() => navigate('/applications')}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 group-hover:bg-cyan-500 flex items-center justify-center mb-3 transition-all group-hover:scale-110">
                  <FileText className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold">ตรวจสอบเอกสาร</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col py-6 hover:bg-green-50 hover:border-green-500 hover:text-green-700 transition-all group hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                onClick={() => navigate('/tracking')}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-500 flex items-center justify-center mb-3 transition-all group-hover:scale-110">
                  <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold">อัพเดตสถานะ</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col py-6 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-700 transition-all group hover:shadow-lg hover:scale-105 active:scale-95 border-2"
                onClick={() => {
                  toast.info('ฟีเจอร์ "ติดต่อผู้สมัคร" กำลังพัฒนา', {
                    description: 'ระบบจะรองรับการส่งอีเมล/SMS โดยตรงในเวอร์ชันถัดไป',
                  });
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 group-hover:bg-purple-500 flex items-center justify-center mb-3 transition-all group-hover:scale-110">
                  <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold">ติดต่อผู้สมัคร</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* New Application Dialog */}
      <Dialog open={showNewAppDialog} onOpenChange={setShowNewAppDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              สร้างใบสมัครใหม่
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลพื้นฐานของผู้สมัคร ระบบจะสร้างใบสมัครฉบับร่างให้อัตโนมัติ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* ข้อมูลผู้สมัคร */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-blue-600" />
                ข้อมูลผู้สมัคร
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName" className="text-sm">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="applicantName"
                    placeholder="เช่น นายสมชาย ใจดี"
                    value={newAppForm.applicantName}
                    onChange={(e) => setNewAppForm({ ...newAppForm, applicantName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    อีเมล <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="pl-10"
                      value={newAppForm.email}
                      onChange={(e) => setNewAppForm({ ...newAppForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">หมายเลขโทรศัพท์</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="08X-XXX-XXXX"
                      className="pl-10"
                      value={newAppForm.phone}
                      onChange={(e) => setNewAppForm({ ...newAppForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm">จังหวัด</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="province"
                      placeholder="เช่น กรุงเทพมหานคร"
                      className="pl-10"
                      value={newAppForm.province}
                      onChange={(e) => setNewAppForm({ ...newAppForm, province: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ข้อมูลทุน */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                ข้อมูลทุนที่สมัคร
              </h4>
              <div className="space-y-2">
                <Label htmlFor="scholarshipType" className="text-sm">
                  ประเภททุน <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newAppForm.scholarshipType}
                  onValueChange={(value) => setNewAppForm({ ...newAppForm, scholarshipType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภททุน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phd">ทุนการศึกษาระดับปริญญาเอก</SelectItem>
                    <SelectItem value="master">ทุนการศึกษาระดับปริญญาโท</SelectItem>
                    <SelectItem value="research">ทุนวิจัย</SelectItem>
                    <SelectItem value="training">ทุนฝึกอบรม</SelectItem>
                    <SelectItem value="development">ทุนพัฒนาบุคลากร</SelectItem>
                    <SelectItem value="exchange">ทุนแลกเปลี่ยน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* หมายเหตุ */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm">หมายเหตุ (ถ้ามี)</Label>
              <Textarea
                id="note"
                placeholder="หมายเหตุเพิ่มเติมเกี่ยวกับใบสมัคร..."
                rows={3}
                value={newAppForm.note}
                onChange={(e) => setNewAppForm({ ...newAppForm, note: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowNewAppDialog(false)}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              ยกเลิก
            </Button>
            <Button
              onClick={handleSaveNewApp}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  สร้างใบสมัคร
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}