import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionPanel } from '../../components/rbac/PermissionPanel';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ExecutiveDashboard() {
  const { user } = useAuth();

  // Mock data for executive
  const kpiData = {
    totalApplications: 1284,
    applicationGrowth: 15.3,
    totalBudget: 245800000,
    budgetUtilization: 68.5,
    approvalRate: 87.2,
    approvalChange: 2.4,
    avgProcessingTime: 12.5,
    timeReduction: -8.2
  };

  const monthlyTrend = [
    { month: 'ส.ค. 25', applications: 98, approved: 85, budget: 18500000 },
    { month: 'ก.ย. 25', applications: 105, approved: 91, budget: 19800000 },
    { month: 'ต.ค. 25', applications: 112, approved: 98, budget: 21200000 },
    { month: 'พ.ย. 25', applications: 108, approved: 94, budget: 20100000 },
    { month: 'ธ.ค. 25', applications: 125, approved: 109, budget: 24300000 },
    { month: 'ม.ค. 26', applications: 132, approved: 115, budget: 25800000 },
    { month: 'ก.พ. 26', applications: 145, approved: 127, budget: 28400000 }
  ];

  const scholarshipTypes = [
    { name: 'ปริญญาเอก', value: 42, amount: 103236000, color: '#3b82f6' },
    { name: 'ปริญญาโท', value: 31, amount: 76198000, color: '#06b6d4' },
    { name: 'วิจัย', value: 18, amount: 44244000, color: '#10b981' },
    { name: 'ฝึกอบรม', value: 9, amount: 22122000, color: '#f59e0b' }
  ];

  const departmentPerformance = [
    { department: 'วิศวกรรมศาสตร์', applications: 245, approved: 218, rate: 89 },
    { department: 'แพทยศาสตร์', applications: 198, approved: 175, rate: 88 },
    { department: 'วิทยาศาสตร์', applications: 187, approved: 159, rate: 85 },
    { department: 'เศรษฐศาสตร์', applications: 156, approved: 131, rate: 84 },
    { department: 'สังคมศาสตร์', applications: 134, approved: 108, rate: 81 }
  ];

  const teamPerformance = [
    {
      team: 'ทีม A',
      lead: 'นายสมชาย',
      processed: 342,
      avgTime: 10.2,
      satisfaction: 4.5,
      status: 'excellent'
    },
    {
      team: 'ทีม B',
      lead: 'นางสาวพิมพ์',
      processed: 318,
      avgTime: 11.8,
      satisfaction: 4.3,
      status: 'good'
    },
    {
      team: 'ทีม C',
      lead: 'นายวิชัย',
      processed: 289,
      avgTime: 13.5,
      satisfaction: 4.1,
      status: 'good'
    }
  ];

  const alerts = [
    {
      type: 'critical',
      message: 'งบประมาณทุนปริญญาเอกใกล้หมด (เหลือ 8%)',
      action: 'ดูรายละเอียด'
    },
    {
      type: 'warning',
      message: 'มีใบสมัคร 12 รายการเกิน SLA 3 วัน',
      action: 'ดำเนินการ'
    },
    {
      type: 'info',
      message: 'อัตราการอนุมัติเพิ่มขึ้น 5% เทียบเดือนก่อน',
      action: 'ดูรายงาน'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6 min-h-full">
      {/* Permission Panel */}
      <PermissionPanel
        pageName="Dashboard"
        moduleName="dashboard"
        defaultExpanded={true}
        permissions={[
          {
            permission: 'reports:view',
            label: 'ดู Dashboard',
            description: 'Dashboard ภาพรวมระดับผู้บริหาร',
            uiLocation: 'หน้า Dashboard หลัก',
          },
          {
            label: 'ดู KPI Summary',
            description: 'ดูตัวชี้วัดภาพรวมโครงการ',
            uiLocation: 'KPI Cards',
          },
          {
            label: 'ดู Portfolio Status',
            description: 'ดูสถานะ Portfolio',
            uiLocation: 'Portfolio Overview',
          },
          {
            permission: 'reports:export',
            label: 'อนุมัติโครงการ',
            description: 'อนุมัติแผนโครงการระดับ Executive',
            uiLocation: 'ปุ่ม "อนุมัติ"',
          },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-k2d">
            แดชบอร์ด
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 font-k2d">
            สวัสดี {user?.name} - ภาพรวมระบบทั้งหมด Real-time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            เลือกช่วงเวลา
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกรายงาน Executive
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'critical'
                          ? 'bg-red-500'
                          : alert.type === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-blue-600">
                    {alert.action}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
                ใบสมัครทั้งหมด
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {kpiData.totalApplications.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{kpiData.applicationGrowth}%
                </span>
                <span className="text-sm text-gray-500">เทียบเดือนก่อน</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
                งบประมาณ
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ฿{formatCurrency(kpiData.totalBudget)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">ใช้ไป {kpiData.budgetUtilization}%</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${kpiData.budgetUtilization}%` }}
                    />
                  </div>
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
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-cyan-50 via-sky-50 to-cyan-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-cyan-700 flex items-center justify-between">
                อัตราการอนุมัติ
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-cyan-600 to-sky-600 bg-clip-text text-transparent">
                {kpiData.approvalRate}%
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{kpiData.approvalChange}%
                </span>
                <span className="text-sm text-gray-500">เทียบเดือนก่อน</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
                เวลาเฉลี่ย
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent">
                {kpiData.avgProcessingTime} วัน
              </div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {kpiData.timeReduction}%
                </span>
                <span className="text-sm text-gray-500">เร็วขึ้น</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="trends">แนวโน้ม</TabsTrigger>
          <TabsTrigger value="distribution">การกระจาย</TabsTrigger>
          <TabsTrigger value="performance">ประสิทธิภาพ</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  แนวโน้มการสมัครและอนุมัติ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorApplications)"
                      name="ใบสมัครทั้งหมด"
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorApproved)"
                      name="อนุมัติแล้ว"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  งบประมาณที่ใช้ไปแต่ละเดือน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => formatCurrencyFull(value)}
                    />
                    <Bar dataKey="budget" fill="#10b981" radius={[8, 8, 0, 0]} name="งบประมาณ" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    สัดส่วนประเภททุน
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scholarshipTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scholarshipTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {scholarshipTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-700">{type.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrencyFull(type.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    อัตราการอนุมัติตามคณะ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentPerformance.map((dept, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {dept.department}
                          </span>
                          <span className="text-sm font-bold text-gray-900">{dept.rate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${dept.rate}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {dept.approved} / {dept.applications} รายการ
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  ประสิทธิภาพทีมงาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.map((team, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{team.team}</h4>
                            <Badge
                              variant={
                                team.status === 'excellent' ? 'default' : 'secondary'
                              }
                            >
                              {team.status === 'excellent' ? 'ยอดเยี่ยม' : 'ดี'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">หัวหน้าทีม: {team.lead}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">คะแนนความพึงพอใจ</p>
                            <p className="text-lg font-bold text-gray-900">{team.satisfaction}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">จำนวนงานที่ดำเนินการ</p>
                          <p className="text-xl font-bold text-blue-600">{team.processed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">เวลาเฉลี่ย (วัน)</p>
                          <p className="text-xl font-bold text-green-600">{team.avgTime}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}