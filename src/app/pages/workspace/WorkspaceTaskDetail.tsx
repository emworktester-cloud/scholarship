import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, User, FileText, CheckCircle2, XCircle, Clock,
  Eye, MessageSquare, History, Shield, Send, ChevronRight,
  Loader2, CalendarClock, AlertTriangle, ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

// NOTE: When @supabase/supabase-js is installed, uncomment this:
// import { supabase } from '../../lib/supabase';

// ===== Types =====
interface TaskDetail {
  id: string;
  form_type: string;
  form_type_label: string;
  current_status: string;
  scholar_name: string;
  scholar_id: string;
  submitted_at: string;
  submitted_by: string;
  zone: string;
  payload: Record<string, any>;
}

interface ApprovalLog {
  id: string;
  actor_name: string;
  action: string;
  comment: string;
  created_at: string;
}

// ===== Mock data =====
const mockTask: TaskDetail = {
  id: '42',
  form_type: 'EXTENSION',
  form_type_label: 'ขอขยายเวลาการศึกษา (EF-06)',
  current_status: 'PENDING',
  scholar_name: 'น.ส.พรพิมล สุขใจ',
  scholar_id: 'SCH-2569-001',
  submitted_at: '25 เม.ย. 2569 10:30',
  submitted_by: 'น.ส.พรพิมล สุขใจ',
  zone: 'สนร. วอชิงตัน',
  payload: {
    reason: 'ต้องการขยายเวลาเพื่อเก็บข้อมูลวิจัยเพิ่มเติม เนื่องจากมีการเปลี่ยนแปลงหัวข้อวิทยานิพนธ์บางส่วนตามคำแนะนำของอาจารย์ที่ปรึกษา',
    requested_months: 6,
    current_end_date: '31 ก.ค. 2573',
    new_end_date: '31 ม.ค. 2574',
    advisor_approval: true,
    advisor_name: 'Prof. Andrew Ng',
    attached_file_url: null,
  },
};

const mockLogs: ApprovalLog[] = [
  {
    id: '1',
    actor_name: 'เจ้าหน้าที่ สนร. วอชิงตัน',
    action: 'REVIEW',
    comment: 'ตรวจสอบเอกสารเรียบร้อย ส่งต่อส่วนกลาง',
    created_at: '26 เม.ย. 2569 14:20',
  },
];

// ===== Tabs =====
const tabs = [
  { id: 'overview', label: 'ภาพรวม', icon: Eye },
  { id: 'form', label: 'แบบฟอร์ม', icon: ClipboardList },
  { id: 'documents', label: 'เอกสาร', icon: FileText },
  { id: 'timeline', label: 'ไทม์ไลน์', icon: History },
  { id: 'review', label: 'พิจารณา/อนุมัติ', icon: CheckCircle2 },
];

// ===== Status Config =====
const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  REVIEWING: { label: 'กำลังพิจารณา', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  APPROVED: { label: 'อนุมัติ', className: 'bg-green-50 text-green-700 border-green-200' },
  REJECTED: { label: 'ไม่อนุมัติ', className: 'bg-red-50 text-red-700 border-red-200' },
};

export default function WorkspaceTaskDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const task = mockTask;
  const logs = mockLogs;
  const status = statusConfig[task.current_status] || statusConfig.PENDING;

  const handleWorkflowAction = async (action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true);
    try {
      const nextStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

      // INTEGRATION POINT: Call process_workflow_action RPC
      // When @supabase/supabase-js is installed, use:
      // const { error } = await supabase.rpc('process_workflow_action', {
      //   p_request_id: parseInt(task.id, 10),
      //   p_actor_id: 1,
      //   p_action: action,
      //   p_next_status: nextStatus,
      //   p_comment: comment,
      // });
      // if (error) throw error;

      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success(
        action === 'APPROVE' ? 'อนุมัติคำร้องเรียบร้อย' : 'ปฏิเสธคำร้องเรียบร้อย',
        { description: `Request #${task.id} → ${nextStatus}` }
      );
      setComment('');
    } catch {
      toast.error('เกิดข้อผิดพลาดในการดำเนินการ');
      setComment('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="px-8 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/workspace">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> กลับ Workspace
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-400">Request #{task.id}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                {task.form_type_label}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {task.scholar_name}
                </span>
                <span>•</span>
                <span className="font-mono text-xs">{task.scholar_id}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {task.submitted_at}
                </span>
              </div>
            </div>
            <Badge className={cn('border font-medium', status.className)}>
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="px-8 flex items-center gap-0 border-t border-gray-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors',
                  active
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="max-w-4xl"
        >
          {/* ===== Overview Tab ===== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-gray-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-gray-700">สรุปคำร้อง</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">ประเภท</p>
                        <p className="text-sm font-medium text-gray-800 mt-0.5">{task.form_type_label}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">โซน</p>
                        <p className="text-sm font-medium text-gray-800 mt-0.5">{task.zone}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">ส่งโดย</p>
                        <p className="text-sm font-medium text-gray-800 mt-0.5">{task.submitted_by}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">วันที่ส่ง</p>
                        <p className="text-sm font-medium text-gray-800 mt-0.5">{task.submitted_at}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Preview of payload */}
                <Card className="border-gray-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-gray-700">ข้อมูลสำคัญ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">เหตุผล</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{task.payload.reason}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">ขอขยาย</p>
                          <p className="text-lg font-bold text-blue-600">{task.payload.requested_months} <span className="text-sm font-normal text-gray-500">เดือน</span></p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">วันสิ้นสุดใหม่</p>
                          <p className="text-sm font-medium text-gray-800">{task.payload.new_end_date}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                {task.current_status === 'PENDING' && (
                  <Card className="border-gray-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-gray-700">ดำเนินการ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
                        disabled={isProcessing}
                        onClick={() => handleWorkflowAction('APPROVE')}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        อนุมัติ
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 font-medium"
                        disabled={isProcessing}
                        onClick={() => handleWorkflowAction('REJECT')}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                        ปฏิเสธ
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ===== Form Tab (Read-only FormBuilder render) ===== */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">แบบฟอร์มที่ส่ง</h2>
                <p className="text-sm text-gray-400">แสดงข้อมูลจาก e-Form ในโหมดอ่านอย่างเดียว</p>
              </div>
              {/* 
                INTEGRATION POINT: Render <FormBuilder payload={task.payload} readOnly={true} /> here.
                The existing FormBuilder component will be rendered in read-only mode.
              */}
              <Card className="border-gray-100">
                <CardContent className="p-6 space-y-5">
                  {Object.entries(task.payload).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-40 shrink-0">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {typeof value === 'boolean' ? (value ? '✓ ใช่' : '✗ ไม่ใช่') : String(value || '-')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== Documents Tab ===== */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">เอกสารแนบ</h2>
                <p className="text-sm text-gray-400">เอกสารที่ส่งมาพร้อมคำร้อง</p>
              </div>
              <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">ไม่มีเอกสารแนบสำหรับคำร้องนี้</p>
              </div>
            </div>
          )}

          {/* ===== Timeline Tab ===== */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">ไทม์ไลน์การดำเนินการ</h2>
                <p className="text-sm text-gray-400">ประวัติการอนุมัติและความเห็น</p>
              </div>
              <div className="relative ml-4 border-l-2 border-gray-100 space-y-6 pl-8">
                {/* Submission event */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white" />
                  <p className="text-sm font-medium text-gray-900">ส่งคำร้อง</p>
                  <p className="text-xs text-gray-500 mt-0.5">{task.submitted_by} • {task.submitted_at}</p>
                </div>
                {/* Approval log events */}
                {logs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.actor_name} • {log.created_at}</p>
                    {log.comment && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-700">{log.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Review/Approve Tab ===== */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-1">พิจารณาและอนุมัติ</h2>
                <p className="text-sm text-gray-400">ดำเนินการอนุมัติหรือปฏิเสธคำร้อง</p>
              </div>

              {task.current_status === 'PENDING' ? (
                <Card className="border-gray-100">
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <Label className="text-sm font-bold text-gray-700">ความเห็น / เหตุผล</Label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="ระบุความเห็นหรือเหตุผลประกอบการพิจารณา..."
                        className="mt-2 min-h-[120px]"
                        disabled={isProcessing}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Button
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium flex-1"
                        disabled={isProcessing}
                        onClick={() => handleWorkflowAction('APPROVE')}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        อนุมัติคำร้อง
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 font-medium flex-1"
                        disabled={isProcessing}
                        onClick={() => handleWorkflowAction('REJECT')}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                        ปฏิเสธ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
                  <p className="text-sm font-medium">คำร้องนี้ได้รับการดำเนินการแล้ว</p>
                  <Badge className={cn('mt-2 border', status.className)}>{status.label}</Badge>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
