import { motion } from 'motion/react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileCheck,
  Send,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useAuth } from '../../contexts/AuthContext';

export default function ApproverDashboard() {
  const { user } = useAuth();

  // Mock data for approver
  const approvalStats = {
    pending: 24,
    overdue: 5,
    approvedToday: 12,
    totalBudget: 45600000
  };

  const pendingApprovals = [
    {
      id: 'APP-2026-055',
      applicant: 'นายวิชัย สมบูรณ์',
      type: 'ทุนปริญญาเอก',
      amount: 2500000,
      submittedDate: '2026-02-15',
      priority: 'high',
      daysOverdue: 2,
      requester: 'นางสาวพิมพ์ เจ้าหน้าที่',
      documents: 8,
      completeness: 95
    },
    {
      id: 'APP-2026-056',
      applicant: 'นางสาวกนกวรรณ ใจดี',
      type: 'ทุนวิจัย',
      amount: 1200000,
      submittedDate: '2026-02-16',
      priority: 'high',
      daysOverdue: 1,
      requester: 'นายสมชาย เจ้าหน้าที่',
      documents: 6,
      completeness: 100
    },
    {
      id: 'APP-2026-057',
      applicant: 'นายประสิทธิ์ เรียนดี',
      type: 'ทุนฝึกอบรม',
      amount: 450000,
      submittedDate: '2026-02-17',
      priority: 'medium',
      daysOverdue: 0,
      requester: 'นางสมหญิง เจ้าหน้าที่',
      documents: 5,
      completeness: 90
    }
  ];

  const approvalHistory = [
    {
      id: 'APP-2026-050',
      applicant: 'นายสุรชัย วิทยา',
      type: 'ทุนปริญญาโท',
      amount: 800000,
      decision: 'approved',
      time: '15 นาทีที่แล้ว',
      comment: 'อนุมัติตามเงื่อนไข'
    },
    {
      id: 'APP-2026-049',
      applicant: 'นางสาวมาลี รักษ์ดี',
      type: 'ทุนวิจัย',
      amount: 1500000,
      decision: 'approved',
      time: '1 ชั่วโมงที่แล้ว',
      comment: 'อนุมัติ'
    },
    {
      id: 'APP-2026-048',
      applicant: 'นายธนากร เก่งคิด',
      type: 'ทุนฝึกอบรม',
      amount: 300000,
      decision: 'rejected',
      time: '2 ชั่วโมงที่แล้ว',
      comment: 'ไม่ผ่านคุณสมบัติ'
    }
  ];

  const budgetAllocation = [
    { category: 'ปริญญาเอก', amount: 18500000, percentage: 40, color: 'bg-blue-500' },
    { category: 'ปริญญาโท', amount: 13680000, percentage: 30, color: 'bg-cyan-500' },
    { category: 'วิจัย', amount: 9120000, percentage: 20, color: 'bg-green-500' },
    { category: 'ฝึกอบรม', amount: 4560000, percentage: 10, color: 'bg-yellow-500' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            แดชบอร์ดผู้อนุมัติ
          </h1>
          <p className="text-gray-600 mt-1">
            สวัสดี {user?.name} - พิจารณาอนุมัติคำขอต่างๆ ได้ที่นี่
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            กรองข้อมูล
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            ส่งออกรายงาน
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
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center justify-between">
                รอการอนุมัติ
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">{approvalStats.pending}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3">
                <Button variant="link" className="p-0 h-auto text-orange-600 group-hover:translate-x-1 transition-transform">
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
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-red-50 to-rose-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center justify-between">
                เกินกำหนด SLA
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-rose-600 bg-clip-text text-transparent">{approvalStats.overdue}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3">
                <Button variant="link" className="p-0 h-auto text-red-600 group-hover:translate-x-1 transition-transform">
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
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
                อนุมัติวันนี้
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">{approvalStats.approvedToday}</div>
              <p className="text-sm text-gray-600 mt-1">รายการ</p>
              <div className="mt-3 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% จากเมื่อวาน
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 overflow-hidden relative bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
                งบประมาณอนุมัติ
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {formatCurrency(approvalStats.totalBudget)}
              </div>
              <p className="text-sm text-gray-600 mt-1">เดือนนี้</p>
              <div className="mt-3">
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
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
                  <FileCheck className="w-5 h-5 text-orange-600" />
                  รายการรอการอนุมัติ
                </CardTitle>
                <Badge variant="secondary">{approvalStats.pending} รายการ</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval, index) => (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-5 border-2 rounded-lg hover:border-orange-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">{approval.id}</span>
                          <Badge
                            variant={approval.priority === 'high' ? 'destructive' : 'default'}
                          >
                            {approval.priority === 'high' ? 'เร่งด่วน' : 'ปกติ'}
                          </Badge>
                          {approval.daysOverdue > 0 && (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              เกิน {approval.daysOverdue} วัน
                            </Badge>
                          )}
                        </div>
                        <p className="text-base font-semibold text-gray-800">{approval.applicant}</p>
                        <p className="text-sm text-gray-600 mt-1">{approval.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">จำนวนเงิน</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(approval.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ความสมบูรณ์</p>
                        <div className="flex items-center gap-2">
                          <Progress value={approval.completeness} className="flex-1 h-2" />
                          <span className="text-sm font-semibold">{approval.completeness}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <span>ส่งโดย: {approval.requester}</span>
                      <span>•</span>
                      <span>วันที่ส่ง: {approval.submittedDate}</span>
                      <span>•</span>
                      <span>เอกสาร: {approval.documents} ไฟล์</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        อนุมัติ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        ปฏิเสธ
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-2" />
                        ส่งกลับ
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Allocation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  การจัดสรรงบประมาณ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetAllocation.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{formatCurrency(item.amount)}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Approval History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-blue-600" />
                  ประวัติการอนุมัติ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {approvalHistory.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="pb-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        {item.decision === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">{item.id}</span>
                            <Badge
                              variant={item.decision === 'approved' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {item.decision === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700">{item.applicant}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(item.amount)}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}