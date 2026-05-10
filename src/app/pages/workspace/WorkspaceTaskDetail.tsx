import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, User, FileText, CheckCircle2, XCircle, Clock,
  Eye, History, Send, Loader2, ClipboardList, Pen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

// หมายเหตุ: เมื่อติดตั้ง @supabase/supabase-js แล้ว ให้ uncomment บรรทัดด้านล่าง:
// import { supabase } from '../../lib/supabase';

interface TaskDetail {
  id: string; form_type: string; form_type_label: string; current_status: string;
  scholar_name: string; scholar_id: string; submitted_at: string;
  submitted_by: string; zone: string; payload: Record<string, string | number | boolean | null>;
}
interface ApprovalLog { id: string; actor_name: string; action: string; comment: string; created_at: string; }

const mockTask: TaskDetail = {
  id: '42', form_type: 'EXTENSION', form_type_label: 'ขอขยายเวลาการศึกษา (EF-06)',
  current_status: 'PENDING', scholar_name: 'น.ส.พรพิมล สุขใจ', scholar_id: 'SCH-2569-001',
  submitted_at: '25/04/2569 10:30', submitted_by: 'น.ส.พรพิมล สุขใจ', zone: 'สนร. วอชิงตัน',
  payload: {
    เหตุผล: 'ต้องการขยายเวลาเพื่อเก็บข้อมูลวิจัยเพิ่มเติม เนื่องจากมีการเปลี่ยนแปลงหัวข้อวิทยานิพนธ์บางส่วน',
    จำนวนเดือนที่ขอขยาย: 6, วันสิ้นสุดเดิม: '31/07/2573', วันสิ้นสุดใหม่: '31/01/2574',
    อาจารย์ที่ปรึกษาอนุมัติ: true, ชื่ออาจารย์ที่ปรึกษา: 'Prof. Andrew Ng',
  },
};

const mockLogs: ApprovalLog[] = [
  { id: '1', actor_name: 'เจ้าหน้าที่ สนร. วอชิงตัน', action: 'ตรวจสอบเอกสาร', comment: 'ตรวจสอบเอกสารเรียบร้อย ส่งต่อส่วนกลาง', created_at: '26/04/2569 14:20' },
];

const statusCfg: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'รอดำเนินการ', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  REVIEWING: { label: 'กำลังพิจารณา', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  APPROVED: { label: 'อนุมัติแล้ว', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'ไม่อนุมัติ', cls: 'bg-red-50 text-red-700 border-red-200' },
};

const tabs = [
  { id: 'overview', label: 'ภาพรวม', icon: Eye },
  { id: 'form', label: 'แบบฟอร์มที่ส่ง', icon: ClipboardList },
  { id: 'documents', label: 'เอกสารแนบ', icon: FileText },
  { id: 'timeline', label: 'ไทม์ไลน์', icon: History },
  { id: 'review', label: 'พิจารณา/อนุมัติ', icon: CheckCircle2 },
];

export default function WorkspaceTaskDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const task = mockTask;
  const logs = mockLogs;
  const st = statusCfg[task.current_status] || statusCfg.PENDING;

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true);
    try {
      // จุดเชื่อมต่อ Supabase RPC: เมื่อติดตั้ง @supabase/supabase-js
      // const { error } = await supabase.rpc('process_workflow_action', {
      //   p_request_id: parseInt(task.id, 10), p_actor_id: 1,
      //   p_action: action, p_next_status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
      //   p_comment: comment,
      // });
      // if (error) throw error;
      await new Promise(r => setTimeout(r, 800));
      toast.success(action === 'APPROVE' ? 'อนุมัติคำร้องเรียบร้อย' : 'ตีกลับคำร้องเรียบร้อย', { description: `คำร้อง #${task.id}` });
      setComment('');
    } catch {
      toast.error('เกิดข้อผิดพลาดในการดำเนินการ');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* ===== ส่วนหัว ===== */}
      <div className="border-b border-gray-100">
        <div className="px-8 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/workspace"><Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900"><ArrowLeft className="w-4 h-4 mr-1.5" />กลับพื้นที่ปฏิบัติงาน</Button></Link>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-400">คำร้อง #{task.id}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1">{task.form_type_label}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{task.scholar_name}</span>
                <span>•</span><span className="font-mono text-xs">{task.scholar_id}</span>
                <span>•</span><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{task.submitted_at}</span>
              </div>
            </div>
            <Badge className={cn('border font-medium', st.cls)}>{st.label}</Badge>
          </div>
        </div>
        {/* แถบ Tab */}
        <div className="px-8 flex items-center gap-0 border-t border-gray-50">
          {tabs.map((t) => { const Icon = t.icon; const active = activeTab === t.id; return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn('flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors',
                active ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700')}>
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ); })}
        </div>
      </div>

      {/* ===== เนื้อหา ===== */}
      <div className="p-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }} className="max-w-4xl">

          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <Card className="border-gray-100"><CardHeader className="pb-3"><CardTitle className="text-sm font-bold text-gray-700">สรุปคำร้อง</CardTitle></CardHeader>
                  <CardContent><div className="grid grid-cols-2 gap-4">
                    {[['ประเภท', task.form_type_label], ['โซน', task.zone], ['ส่งโดย', task.submitted_by], ['วันที่ส่ง', task.submitted_at]].map(([l, v]) => (
                      <div key={l}><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{l}</p><p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p></div>
                    ))}
                  </div></CardContent>
                </Card>
                <Card className="border-gray-100"><CardHeader className="pb-3"><CardTitle className="text-sm font-bold text-gray-700">ข้อมูลสำคัญ</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg"><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">เหตุผล</p><p className="text-sm text-gray-700 leading-relaxed">{String(task.payload['เหตุผล'])}</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">ขอขยาย</p><p className="text-lg font-bold text-blue-600">{String(task.payload['จำนวนเดือนที่ขอขยาย'])} <span className="text-sm font-normal text-gray-500">เดือน</span></p></div>
                      <div><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">วันสิ้นสุดใหม่</p><p className="text-sm font-medium text-gray-800">{String(task.payload['วันสิ้นสุดใหม่'])}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {task.current_status === 'PENDING' && (
                <Card className="border-gray-100 h-fit"><CardHeader className="pb-3"><CardTitle className="text-sm font-bold text-gray-700">ดำเนินการ</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium" disabled={isProcessing} onClick={() => handleAction('APPROVE')}>
                      {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}อนุมัติ
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 font-medium" disabled={isProcessing} onClick={() => handleAction('REJECT')}>
                      {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}ตีกลับ
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'form' && (<div className="space-y-6">
            <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">แบบฟอร์มที่ส่ง</h2><p className="text-sm text-gray-400 mt-0.5">แสดงข้อมูลจาก e-Form ในโหมดอ่านอย่างเดียว — จุดเชื่อมต่อ FormBuilder (Sub-Module 5.1)</p></div>
            <Card className="border-gray-100"><CardContent className="p-6 space-y-4">
              {Object.entries(task.payload).map(([key, val]) => (
                <div key={key} className="flex items-start gap-4 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-44 shrink-0"><p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{key}</p></div>
                  <div className="flex-1"><p className="text-sm font-medium text-gray-800">{typeof val === 'boolean' ? (val ? '✓ ใช่' : '✗ ไม่ใช่') : String(val ?? '-')}</p></div>
                </div>
              ))}
            </CardContent></Card>
          </div>)}

          {activeTab === 'documents' && (<div className="space-y-6">
            <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">เอกสารแนบ</h2></div>
            <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center text-gray-400"><FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" /><p className="text-sm font-medium">ไม่มีเอกสารแนบสำหรับคำร้องนี้</p></div>
          </div>)}

          {activeTab === 'timeline' && (<div className="space-y-6">
            <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">ไทม์ไลน์การดำเนินการ</h2></div>
            <div className="relative ml-4 border-l-2 border-gray-100 space-y-6 pl-8">
              <div className="relative"><div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white" /><p className="text-sm font-medium text-gray-900">ส่งคำร้อง</p><p className="text-xs text-gray-500 mt-0.5">{task.submitted_by} • {task.submitted_at}</p></div>
              {logs.map(l => (<div key={l.id} className="relative"><div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-white" /><p className="text-sm font-medium text-gray-900">{l.action}</p><p className="text-xs text-gray-500 mt-0.5">{l.actor_name} • {l.created_at}</p>{l.comment && <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100"><p className="text-sm text-gray-700">{l.comment}</p></div>}</div>))}
            </div>
          </div>)}

          {activeTab === 'review' && (<div className="space-y-6">
            <div><h2 className="text-lg font-bold text-gray-900 tracking-tight">พิจารณาและอนุมัติ</h2></div>
            {task.current_status === 'PENDING' ? (
              <Card className="border-gray-100"><CardContent className="p-6 space-y-5">
                <div><Label className="text-sm font-bold text-gray-700">ความเห็น / เหตุผลประกอบ</Label>
                  <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="ระบุความเห็นหรือเหตุผลประกอบการพิจารณา..." className="mt-2 min-h-[120px]" disabled={isProcessing} />
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium flex-1" disabled={isProcessing} onClick={() => handleAction('APPROVE')}>
                    {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}อนุมัติคำร้อง
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 font-medium flex-1" disabled={isProcessing} onClick={() => handleAction('REJECT')}>
                    {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}ตีกลับ
                  </Button>
                </div>
                {/* จุดเชื่อมต่อ E-Signature (Sub-Module 2.2): ลงนามอิเล็กทรอนิกส์ก่อนอนุมัติ */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <Pen className="w-5 h-5 text-gray-400" />
                  <div><p className="text-sm font-medium text-gray-700">ลายเซ็นอิเล็กทรอนิกส์</p><p className="text-xs text-gray-400">ฝัง E-Signature Engine ตรงนี้ก่อนกดอนุมัติ (Sub-Module 2.2)</p></div>
                </div>
              </CardContent></Card>
            ) : (
              <div className="p-6 text-center text-gray-400"><CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-400" /><p className="text-sm font-medium">คำร้องนี้ได้รับการดำเนินการแล้ว</p><Badge className={cn('mt-2 border', st.cls)}>{st.label}</Badge></div>
            )}
          </div>)}

        </motion.div>
      </div>
    </div>
  );
}
