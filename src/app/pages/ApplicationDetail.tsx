import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Star,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle,
  Send,
  MessageSquare,
  History,
  Shield,
  DollarSign,
  Award,
  TrendingUp,
  Eye,
  Download,
  Upload,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Paperclip,
  Bell,
  Pen,
  Hash,
  Globe,
  BookOpen,
  Briefcase,
  Scale,
  Ban,
  Lock,
  Printer,
  Copy,
  ExternalLink,
  Plus
} from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { PermissionPanel } from '../components/rbac/PermissionPanel';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProtectedTabsTrigger } from '../components/rbac/ProtectedTabsTrigger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
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
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner';

export default function ApplicationDetail() {
  const { id } = useParams();
  const [watched, setWatched] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);

  // Checklist state
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, item: 'เอกสารครบถ้วน', checked: false, note: '' },
    { id: 2, item: 'คุณสมบัติขั้นต่ำ (GPA >= 3.25)', checked: false, note: '' },
    { id: 3, item: 'อายุไม่เกินเกณฑ์', checked: false, note: '' },
    { id: 4, item: 'เอกสารสำคัญถูกต้อง', checked: false, note: '' },
    { id: 5, item: 'ไม่เคยถูกยกเลิกทุนมาก่อน', checked: false, note: '' },
  ]);

  // Review state
  const [reviewScores, setReviewScores] = useState({
    academic: '',
    research: '',
    plan: '',
    motivation: '',
    overall: '',
  });
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDecision, setReviewDecision] = useState('');

  // Approval state
  const [approvalDecision, setApprovalDecision] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalConditions, setApprovalConditions] = useState('');

  // Communication state
  const [newMessage, setNewMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');

  // Mock data
  const application = {
    id: id || 'APP-2026-001',
    applicant: {
      name: 'นายสมชาย ใจดี',
      idCard: '1-1234-56789-01-2',
      birthDate: '15 มกราคม 2540',
      age: 29,
      phone: '08-1234-5678',
      email: 'somchai@example.com',
      address: '123 ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      currentPosition: 'นักวิจัย',
      department: 'สถาบันวิจัยวิทยาศาสตร์',
      organization: 'จุฬาลงกรณ์มหาวิทยาลัย',
      gpa: 3.85,
      degree: 'วิศวกรรมศาสตรบัณฑิต',
      graduatedFrom: 'จุฬาลงกรณ์มหาวิทยาลัย',
      graduatedYear: 2563,
    },
    scholarship: {
      type: 'ทุนการศึกษาระดับปริญญาเอก',
      field: 'วิศวกรรมคอมพิวเตอร์',
      university: 'Stanford University',
      country: 'สหรัฐอเมริกา',
      duration: '4 ปี',
      amount: 5000000,
      startDate: 'สิงหาคม 2026',
      program: 'Ph.D. in Computer Science',
      advisor: 'Prof. Andrew Ng',
    },
    status: 'รอตรวจเอกสาร',
    priority: 'high',
    sla: {
      remaining: '2 ชั่วโมง',
      status: 'critical',
      dueDate: '20 ก.พ. 2026 17:00',
    },
    assignee: 'คุณ',
    submittedDate: '18 ก.พ. 2026 09:30',
    updatedDate: '20 ก.พ. 2026 14:30',
  };

  const documents = [
    { id: 1, name: 'ใบสมัคร', status: 'complete', uploadDate: '18 ก.พ. 2026', size: '2.3 MB' },
    { id: 2, name: 'สำเนาบัตรประชาชน', status: 'complete', uploadDate: '18 ก.พ. 2026', size: '1.1 MB' },
    { id: 3, name: 'ระเบียนแสดงผลการเรียน', status: 'complete', uploadDate: '18 ก.พ. 2026', size: '0.8 MB' },
    { id: 4, name: 'จดหมายตอบรับจากสถาบัน', status: 'pending', uploadDate: null, size: null },
    { id: 5, name: 'แผนการศึกษา', status: 'complete', uploadDate: '18 ก.พ. 2026', size: '1.5 MB' },
    { id: 6, name: 'หนังสือรับรอง GPA', status: 'complete', uploadDate: '18 ก.พ. 2026', size: '0.5 MB' },
  ];

  const timeline = [
    { date: '20 ก.พ. 2026 14:30', event: 'เจ้าหน้าที่เปิดดูเคส', user: 'นางสาวพิมพ์พร เจ้าหน้าที่', type: 'view' },
    { date: '19 ก.พ. 2026 16:20', event: 'ผู้สมัครอัปโหลดเอกสารเพิ่มเติม', user: 'นายสมชาย ใจดี', type: 'upload' },
    { date: '19 ก.พ. 2026 10:15', event: 'ระบบแจ้งเตือนผู้สมัครเอกสารไม่ครบ', user: 'ระบบ', type: 'notification' },
    { date: '18 ก.พ. 2026 09:30', event: 'ส่งใบสมัครเข้าระบบ', user: 'นายสมชาย ใจดี', type: 'submit' },
  ];

  const communications = [
    { id: 1, type: 'email', direction: 'out', subject: 'แจ้งเตือน: เอกสารไม่ครบถ้วน', to: 'somchai@example.com', date: '19 ก.พ. 2026 10:15', status: 'sent', body: 'เรียนผู้สมัคร กรุณาจัดส่งจดหมายตอบรับจากสถาบัน...' },
    { id: 2, type: 'sms', direction: 'out', subject: 'แจ้งเตือน SMS', to: '08-1234-5678', date: '19 ก.พ. 2026 10:16', status: 'sent', body: 'ระบบทุนรัฐบาล: กรุณาจัดส่งเอกสารเพิ่มเติมภายใน 3 วัน' },
    { id: 3, type: 'internal', direction: 'in', subject: 'หมายเหตุภายใน', to: 'ทีมงาน', date: '19 ก.พ. 2026 11:00', status: 'read', body: 'ผู้สมัครแจ้งว่าจดหมายตอบรับอยู่ระหว่างจัดส่ง คาดว่าจะได้ภายใน 2 วัน' },
    { id: 4, type: 'email', direction: 'in', subject: 'ตอบกลับ: เอกสารไม่ครบถ้วน', to: 'staff@scholarship.go.th', date: '19 ก.พ. 2026 15:30', status: 'read', body: 'เรียนเจ้าหน้าที่ ผมได้จัดส่งจดหมายตอบรับแล้วครับ กรุณาตรวจสอบ...' },
  ];

  const casePayments = [
    { id: 1, installment: 1, amount: 625000, dueDate: '31 มี.ค. 2027', condition: 'ลงทะเบียนเรียน + ส่งรายงาน', status: 'scheduled' },
    { id: 2, installment: 2, amount: 625000, dueDate: '30 ก.ย. 2027', condition: 'GPA >= 3.0 + ส่งรายงาน', status: 'scheduled' },
    { id: 3, installment: 3, amount: 625000, dueDate: '31 มี.ค. 2028', condition: 'ส่งรายงานความก้าวหน้า', status: 'scheduled' },
    { id: 4, installment: 4, amount: 625000, dueDate: '30 ก.ย. 2028', condition: 'GPA >= 3.0 + ส่งรายงาน', status: 'scheduled' },
    { id: 5, installment: 5, amount: 625000, dueDate: '31 มี.ค. 2029', condition: 'ส่งรายงานความก้าวหน้า', status: 'scheduled' },
    { id: 6, installment: 6, amount: 625000, dueDate: '30 ก.ย. 2029', condition: 'GPA >= 3.0 + Qualifying Exam', status: 'scheduled' },
    { id: 7, installment: 7, amount: 625000, dueDate: '31 มี.ค. 2030', condition: 'ส่งรายงานวิทยานิพนธ์', status: 'scheduled' },
    { id: 8, installment: 8, amount: 625000, dueDate: '31 ก.ค. 2030', condition: 'สำเร็จการศึกษา', status: 'scheduled' },
  ];

  const caseTrackingHistory = [
    { period: 'ภาคเรียนที่ 1/2026', gpa: null, status: 'pending', dueDate: '31 มี.ค. 2027', submittedDate: null },
  ];

  const auditLogs = [
    { timestamp: '20 ก.พ. 2026 14:30:25', user: 'นางสาวพิมพ์พร', action: 'เปิดดูเคส', detail: 'เปิดดูข้อมูลใบสมัคร', ip: '192.168.1.45' },
    { timestamp: '19 ก.พ. 2026 16:20:10', user: 'นายสมชาย ใจดี', action: 'อัปโหลดเอกสาร', detail: 'อัปโหลดจดหมายตอบรับจากสถาบัน', ip: '103.45.67.89' },
    { timestamp: '19 ก.พ. 2026 10:16:00', user: 'ระบบ', action: 'ส่ง SMS', detail: 'แจ้งเตือนเอกสารไม่ครบ → 08-1234-5678', ip: '-' },
    { timestamp: '19 ก.พ. 2026 10:15:30', user: 'ระบบ', action: 'ส่งอีเมล', detail: 'แจ้งเตือนเอกสารไม่ครบ → somchai@example.com', ip: '-' },
    { timestamp: '18 ก.พ. 2026 09:30:00', user: 'นายสมชาย ใจดี', action: 'ส่งใบสมัคร', detail: 'ส่งใบสมัครทุนปริญญาเอก', ip: '103.45.67.89' },
  ];

  const reviewCommittee = [
    { name: 'ศ.ดร.สมศักดิ์ วิชาการ', role: 'ประธานกรรมการ', score: null, status: 'pending' },
    { name: 'รศ.ดร.วิภา นักวิจัย', role: 'กรรมการ', score: null, status: 'pending' },
    { name: 'ดร.ประยุทธ์ ผู้เชี่ยวชาญ', role: 'กรรมการ', score: null, status: 'pending' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const handleChecklistChange = (itemId: number, checked: boolean) => {
    setChecklistItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, checked } : item
    ));
  };

  const handleChecklistNote = (itemId: number, note: string) => {
    setChecklistItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, note } : item
    ));
  };

  const handlePassChecklist = () => {
    const allChecked = checklistItems.every(item => item.checked);
    if (!allChecked) {
      toast.error('กรุณาตรวจสอบรายการให้ครบทุกข้อก่อน');
      return;
    }
    toast.success('ผ่านการตรวจเอกสาร → ส่งพิจารณาเรียบร้อย');
  };

  const handleSubmitReview = () => {
    if (!reviewDecision) {
      toast.error('กรุณาเลือกผลการพิจารณา');
      return;
    }
    toast.success('บันทึกผลการพิจารณาเรียบร้อย');
  };

  const handleSubmitApproval = () => {
    if (!approvalDecision) {
      toast.error('กรุณาเลือกมติอนุมัติ');
      return;
    }
    toast.success(approvalDecision === 'approve' ? 'อนุมัติทุนเรียบร้อย' : 'บันทึกมติเรียบร้อย');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success('ส่งข้อความถึงผู้สมัครเรียบร้อย');
    setNewMessage('');
  };

  const handleSaveInternalNote = () => {
    if (!internalNote.trim()) return;
    toast.success('บันทึกหมายเหตุภายในเรียบร้อย');
    setInternalNote('');
  };

  const checkedCount = checklistItems.filter(item => item.checked).length;

  return (
    <div className="min-h-full">
      {/* Header with Case Info */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/applications">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">คิวงาน</span>
              <span className="opacity-60">/</span>
              <span className="font-medium">{application.id}</span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{application.applicant.name}</h1>
                <button
                  onClick={() => setWatched(!watched)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Star className={`w-6 h-6 ${watched ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span>{application.id}</span>
                <span>•</span>
                <span>{application.scholarship.type}</span>
                <span>•</span>
                <span>ส่งเมื่อ {application.submittedDate}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  {application.status}
                </Badge>
                <Badge className="bg-red-500/90 hover:bg-red-600 text-white">
                  เร่งด่วน
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>SLA: {application.sla.remaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-8 py-3 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="flex items-center gap-2">
            <Dialog open={requestInfoOpen} onOpenChange={setRequestInfoOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Send className="w-4 h-4 mr-2" />
                  ขอข้อมูลเพิ่ม
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>ขอข้อมูล/เอกสารเพิ่มเติม</DialogTitle>
                  <DialogDescription>
                    กรุณาระบุรายการและเหตุผลที่ต้องการขอข้อมูลเพิ่มเติมจากผู้สมัคร
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>เหตุผลหลัก</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเหตุผล" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incomplete">เอกสารไม่ครบถ้วน</SelectItem>
                        <SelectItem value="unclear">เอกสารไม่ชัดเจน</SelectItem>
                        <SelectItem value="mismatch">ข้อมูลไม่ตรงกัน</SelectItem>
                        <SelectItem value="other">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>รายการเอกสาร/ข้อมูลที่ต้องการ</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                      {['จดหมายตอบรับจากสถาบัน (เอกสารต้นฉบับ)', 'หนังสือรับรอง GPA แบบเต็มรูปแบบ', 'ใบรับรองแพทย์'].map((doc, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Checkbox id={`doc${i}`} />
                          <Label htmlFor={`doc${i}`} className="font-normal">{doc}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>กำหนดส่ง</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>ข้อความถึงผู้สมัคร</Label>
                    <Textarea placeholder="เพื่อให้การพิจารณาเป็นไปโดยถูกต้องครบถ้วน..." className="min-h-32" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRequestInfoOpen(false)}>ยกเลิก</Button>
                  <Button onClick={() => { setRequestInfoOpen(false); toast.success('ส่งคำขอข้อมูลเพิ่มเติมเรียบร้อย'); }}>
                    <Send className="w-4 h-4 mr-2" />
                    ส่งคำขอ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="secondary" onClick={() => toast.success('ส่งพิจารณาเรียบร้อย')}>
              <CheckCircle className="w-4 h-4 mr-2" />
              ส่งพิจารณา
            </Button>
            <Button size="sm" variant="secondary" onClick={() => toast.success('ส่งอนุมัติเรียบร้อย')}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              ส่งอนุมัติ
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/30" />
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setActiveTab('communication')}>
              <MessageSquare className="w-4 h-4 mr-2" />
              หมายเหตุภายใน
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => { toast.info('พิมพ์เอกสาร...'); }}>
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Permission Panel */}
        <PermissionPanel
          pageName="รายละเอียดใบสมัคร"
          moduleName="application_detail"
          defaultExpanded={false}
          permissions={[
            {
              permission: 'applications:view',
              label: 'ดูรายละเอียดใบสมัคร',
              description: 'ดูข้อมูลทั้งหมดของใบสมัคร',
              uiLocation: 'หน้ารายละเอียดหลัก',
            },
            {
              permission: 'documents:view',
              label: 'ดูเอกสาร',
              description: 'ดูเอกสารแนบทั้งหมด',
              uiLocation: 'Tab "เอกสาร"',
            },
            {
              permission: 'applications:check_documents',
              label: 'ตรวจเอกสาร',
              description: 'ตรวจสอบความครบถ้วนของเอกสาร',
              uiLocation: 'Tab "ตรวจเอกสาร"',
            },
            {
              permission: 'applications:request_info',
              label: 'ขอข้อมูลเพิ่ม',
              description: 'ขอข้อมูล/เอกสารเพิ่มเติมจากผู้สมัคร',
              uiLocation: 'ปุ่ม "ขอข้อมูลเพิ่ม"',
            },
            {
              permission: 'applications:review',
              label: 'พิจารณา',
              description: 'พิจารณาและให้คะแนนใบสมัคร',
              uiLocation: 'Tab "พิจารณา"',
            },
            {
              permission: 'applications:approve',
              label: 'อนุมัติ',
              description: 'อนุมัติหรือไม่อนุมัติใบสมัคร',
              uiLocation: 'Tab "อนุมัติ"',
            },
            {
              permission: 'applications:edit',
              label: 'แก้ไขใบสมัคร',
              description: 'แก้ไขข้อมูลใบสมัคร',
              uiLocation: 'ปุ่ม "แก้ไข"',
            },
            {
              permission: 'comments:view',
              label: 'ดูความคิดเห็น',
              description: 'ดูความคิดเห็นจากทีม',
              uiLocation: 'Tab "ความคิดเห็น"',
            },
            {
              permission: 'comments:create',
              label: 'แสดงความคิดเห็น',
              description: 'เพิ่มความคิดเห็นในใบสมัคร',
              uiLocation: 'แบบฟอร์มความคิดเห็น',
            },
            {
              permission: 'audit:view',
              label: 'ดูประวัติ',
              description: 'ดูประวัติการเปลี่ยนแปลงทั้งหมด',
              uiLocation: 'Tab "ประวัติ"',
            },
          ]}
          className="mb-6"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <ProtectedTabsTrigger value="application" permission="applications:view">ใบสมัคร</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="documents" permission="applications:view">เอกสาร</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="checklist" permission="applications:check-documents">ตรวจเอกสาร</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="review" permission="review:view">พิจารณา</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="approval" permission="approval:view">อนุมัติ</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="award" permission="awards:view">ทุน/สัญญา</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="payment" permission="payment:view">จ่ายเงิน</ProtectedTabsTrigger>
            <ProtectedTabsTrigger value="tracking" permission="tracking:view">ติดตามผล</ProtectedTabsTrigger>
            <TabsTrigger value="timeline">ไทม์ไลน์</TabsTrigger>
            <TabsTrigger value="communication">การสื่อสาร</TabsTrigger>
            <ProtectedTabsTrigger value="audit" permission="audit:view">Audit</ProtectedTabsTrigger>
          </TabsList>

          {/* ====================== OVERVIEW TAB ====================== */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      ข้อมูลผู้สมัคร
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 text-sm">ชื่อ-นามสกุล</Label>
                        <p className="font-medium mt-1">{application.applicant.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">เลขบัตรประชาชน</Label>
                        <p className="font-medium mt-1">{application.applicant.idCard}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">วัน/เดือน/ปี เกิด</Label>
                        <p className="font-medium mt-1">{application.applicant.birthDate} (อายุ {application.applicant.age} ปี)</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">เบอร์โทรศัพท์</Label>
                        <p className="font-medium mt-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {application.applicant.phone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-gray-500 text-sm">อีเมล</Label>
                        <p className="font-medium mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {application.applicant.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      ข้อมูลทุนที่สมัคร
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 text-sm">ประเภททุน</Label>
                        <p className="font-medium mt-1">{application.scholarship.type}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">สาขาวิชา</Label>
                        <p className="font-medium mt-1">{application.scholarship.field}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">สถาบันที่ศึกษา</Label>
                        <p className="font-medium mt-1">{application.scholarship.university}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-sm">วงเงินทุน</Label>
                        <p className="font-medium mt-1 text-green-600">{formatCurrency(application.scholarship.amount)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-base">การดำเนินการถัดไป</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700">ตรวจสอบเอกสารและคุณสมบัติ จากนั้นดำเนินการ:</p>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => setActiveTab('checklist')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ผ่านการตรวจ → ส่งพิจารณา
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setRequestInfoOpen(true)}>
                      <Send className="w-4 h-4 mr-2" />
                      ขอข้อมูลเพิ่มเติม
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      ความเสี่ยง/ธงเตือน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">เกิน SLA</p>
                        <p className="text-xs text-red-700">เหลือเวลา {application.sla.remaining}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                      <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">เอกสารไม่ครบ</p>
                        <p className="text-xs text-yellow-700">ขาดจดหมายตอบรับจากสถาบัน</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">สรุปเอกสาร</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <Progress value={(documents.filter(d => d.status === 'complete').length / documents.length) * 100} className="h-2" />
                      <span className="text-sm font-medium">{documents.filter(d => d.status === 'complete').length}/{documents.length}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('documents')}>
                      ดูเอกสารทั้งหมด
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ====================== APPLICATION TAB ====================== */}
          <TabsContent value="application" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    ข้อมูลส่วนบุคคล
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'ชื่อ-นามสกุล', value: application.applicant.name, icon: User },
                      { label: 'เลขบัตรประชาชน', value: application.applicant.idCard, icon: Hash },
                      { label: 'วันเกิด / อายุ', value: `${application.applicant.birthDate} (${application.applicant.age} ปี)`, icon: Calendar },
                      { label: 'โทรศัพท์', value: application.applicant.phone, icon: Phone },
                      { label: 'อีเมล', value: application.applicant.email, icon: Mail },
                      { label: 'ที่อยู่ปัจจุบัน', value: application.applicant.address, icon: MapPin },
                      { label: 'ตำแหน่งปัจจุบัน', value: application.applicant.currentPosition, icon: Briefcase },
                      { label: 'หน่วยงาน / สังกัด', value: `${application.applicant.department}, ${application.applicant.organization}`, icon: Building },
                    ].map((field, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                        <field.icon className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{field.label}</p>
                          <p className="text-sm font-medium mt-0.5">{field.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      ประวัติการศึกษา
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'วุฒิการศึกษา', value: application.applicant.degree },
                        { label: 'สถาบัน', value: application.applicant.graduatedFrom },
                        { label: 'ปีที่จบ', value: `${application.applicant.graduatedYear}` },
                        { label: 'GPA', value: `${application.applicant.gpa}` },
                      ].map((field, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                          <span className="text-sm text-gray-600">{field.label}</span>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-600" />
                      ข้อมูลทุนที่สมัคร
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'ประเภททุน', value: application.scholarship.type },
                        { label: 'หลักสูตร', value: application.scholarship.program },
                        { label: 'สาขาวิชา', value: application.scholarship.field },
                        { label: 'สถาบัน', value: application.scholarship.university },
                        { label: 'ประเทศ', value: application.scholarship.country },
                        { label: 'อาจารย์ที่ปรึกษา', value: application.scholarship.advisor },
                        { label: 'ระยะเวลา', value: application.scholarship.duration },
                        { label: 'วงเงิน', value: formatCurrency(application.scholarship.amount) },
                        { label: 'เริ่มศึกษา', value: application.scholarship.startDate },
                      ].map((field, i) => (
                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                          <span className="text-sm text-gray-600">{field.label}</span>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ====================== DOCUMENTS TAB ====================== */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>เอกสารแนบทั้งหมด</span>
                  <Badge variant="secondary">{documents.filter(d => d.status === 'complete').length} / {documents.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {doc.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.status === 'complete' && (
                            <p className="text-xs text-gray-500">อัปโหลดเมื่อ {doc.uploadDate} • {doc.size}</p>
                          )}
                          {doc.status === 'pending' && (
                            <p className="text-xs text-red-600">ยังไม่ได้อัปโหลด</p>
                          )}
                        </div>
                      </div>
                      {doc.status === 'complete' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => toast.info('เปิดดูเอกสาร...')}>
                            <Eye className="w-4 h-4 mr-2" />ดู
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toast.success('ดาวน์โหลดเอกสารเรียบร้อย')}>
                            <Download className="w-4 h-4 mr-2" />ดาวน์โหลด
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== CHECKLIST TAB ====================== */}
          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ตรวจสอ��เอกสารและคุณสมบัติ</CardTitle>
                  <Badge variant={checkedCount === checklistItems.length ? 'default' : 'secondary'}
                    className={checkedCount === checklistItems.length ? 'bg-green-100 text-green-700' : ''}>
                    {checkedCount}/{checklistItems.length} รายการ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={(checkedCount / checklistItems.length) * 100} className="h-3" />

                {checklistItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg space-y-3 transition-colors ${item.checked ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`check-${item.id}`} className={`font-medium cursor-pointer ${item.checked ? 'line-through text-green-700' : ''}`}>
                          {item.item}
                        </Label>
                        {!item.checked && (
                          <Textarea
                            placeholder="หมายเหตุ (ถ้าไม่ผ่าน)"
                            className="mt-2 text-sm"
                            value={item.note}
                            onChange={(e) => handleChecklistNote(item.id, e.target.value)}
                          />
                        )}
                      </div>
                      {item.checked && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                  </motion.div>
                ))}

                <Separator />
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handlePassChecklist}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ผ่านการตรวจ → ส่งพิจารณา
                  </Button>
                  <Button variant="outline" onClick={() => setRequestInfoOpen(true)}>
                    <Send className="w-4 h-4 mr-2" />
                    ขอข้อมูลเพิ่มเติม
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => toast.error('บันทึกไม่ผ่านการตรวจ')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    ไม่ผ่าน
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== REVIEW TAB ====================== */}
          <TabsContent value="review" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-purple-600" />
                      แบบให้คะแนนพิจารณา
                    </CardTitle>
                    <CardDescription>กรุณาให้คะแนนในแต่ละหัวข้อ (1-10 คะแนน)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { key: 'academic', label: 'ผลการเรียน / GPA', weight: '30%', desc: 'GPA ปัจจุบัน: 3.85' },
                      { key: 'research', label: 'ประสบการณ์วิจัย / ผลงาน', weight: '25%', desc: 'ตีพิมพ์บทความ 3 ฉบับ' },
                      { key: 'plan', label: 'แผนการศึกษา / Research Proposal', weight: '25%', desc: 'Ph.D. in Computer Science' },
                      { key: 'motivation', label: 'แรงจูงใจ / ความมุ่งมั่น', weight: '20%', desc: 'จากจดหมายสมัคร' },
                    ].map((criteria) => (
                      <div key={criteria.key} className="p-4 border rounded-lg space-y-3 hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{criteria.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{criteria.desc}</p>
                          </div>
                          <Badge variant="outline">น้ำหนัก {criteria.weight}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="1-10"
                            className="w-24"
                            value={reviewScores[criteria.key as keyof typeof reviewScores]}
                            onChange={(e) => setReviewScores({ ...reviewScores, [criteria.key]: e.target.value })}
                          />
                          <div className="flex-1">
                            <Progress
                              value={Number(reviewScores[criteria.key as keyof typeof reviewScores] || 0) * 10}
                              className="h-2"
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {reviewScores[criteria.key as keyof typeof reviewScores] || '-'}/10
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">คะแนนรวมถ่วงน้ำหนัก</span>
                        <span className="text-2xl font-bold text-blue-700">
                          {(() => {
                            const weights = { academic: 0.3, research: 0.25, plan: 0.25, motivation: 0.2 };
                            let total = 0;
                            let hasScore = false;
                            for (const [key, weight] of Object.entries(weights)) {
                              const score = Number(reviewScores[key as keyof typeof reviewScores] || 0);
                              if (score > 0) hasScore = true;
                              total += score * weight;
                            }
                            return hasScore ? total.toFixed(2) : '-';
                          })()}
                          /10
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ความเห็น / ข้อเสนอแนะ</Label>
                      <Textarea
                        placeholder="ระบุความเห็นประกอบการพิจารณา..."
                        className="min-h-32"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ผลการพิจารณา</Label>
                      <Select value={reviewDecision} onValueChange={setReviewDecision}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกผลการพิจารณา" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommend">แนะนำอนุมัติ</SelectItem>
                          <SelectItem value="conditional">แนะนำอนุมัติแบบมีเงื่อนไข</SelectItem>
                          <SelectItem value="not-recommend">ไม่แนะนำอนุมัติ</SelectItem>
                          <SelectItem value="defer">ขอเลื่อนการพิจารณา</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmitReview}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        บันทึกผลพิจารณา → ส่งอนุมัติ
                      </Button>
                      <Button variant="outline" onClick={() => toast.success('บันทึกฉบับร่างแล้ว')}>
                        บันทึกฉบับร่าง
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">คณะกรรมการพิจารณา</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reviewCommittee.map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          รอ
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">สรุปข้อมูลที่เกี่ยวข้อง</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPA</span>
                      <span className="font-medium text-green-600">{application.applicant.gpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">สถาบัน</span>
                      <span className="font-medium">{application.scholarship.university}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">วงเงิน</span>
                      <span className="font-medium">{formatCurrency(application.scholarship.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">เอกสาร</span>
                      <span className="font-medium">{documents.filter(d => d.status === 'complete').length}/{documents.length}</span>
                    </div>
                    <Separator className="my-2" />
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('application')}>
                      ดูข้อมูลใบสมัครทั้งหมด
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ====================== APPROVAL TAB ====================== */}
          <TabsContent value="approval" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      อนุมัติ / มติ
                    </CardTitle>
                    <CardDescription>ตัดสินใจอนุมัติทุนการศึกษาสำหรับผู้สมัครรายนี้</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Summary from review */}
                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        สรุปผลจากขั้นตอนพิจารณา
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">คะแนนรวม</span>
                          <span className="font-medium">8.25/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">มติคณะกรรมการ</span>
                          <Badge className="bg-green-100 text-green-700">แนะนำอนุมัติ 3/3</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold">มติอนุมัติ</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: 'approve', label: 'อนุมัติ', icon: ThumbsUp, color: 'border-green-500 bg-green-50 hover:bg-green-100', textColor: 'text-green-700' },
                          { value: 'conditional', label: 'อนุมัติแบบมีเงื่อนไข', icon: AlertCircle, color: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100', textColor: 'text-yellow-700' },
                          { value: 'reject', label: 'ไม่อนุมัติ', icon: ThumbsDown, color: 'border-red-500 bg-red-50 hover:bg-red-100', textColor: 'text-red-700' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setApprovalDecision(opt.value)}
                            className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${approvalDecision === opt.value ? opt.color : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <opt.icon className={`w-6 h-6 ${approvalDecision === opt.value ? opt.textColor : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${approvalDecision === opt.value ? opt.textColor : 'text-gray-600'}`}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {approvalDecision === 'conditional' && (
                      <div className="space-y-2">
                        <Label>เงื่อนไขที่กำหนด</Label>
                        <Textarea
                          placeholder="ระบุเงื่อนไขที่ผู้รับทุนต้องปฏิบัติ เช่น ต้องส่งจดหมายตอบรับภายใน 30 วัน..."
                          className="min-h-24"
                          value={approvalConditions}
                          onChange={(e) => setApprovalConditions(e.target.value)}
                        />
                      </div>
                    )}

                    {approvalDecision === 'reject' && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-900 font-medium">เหตุผลที่ไม่อนุมัติ (บังคับ)</p>
                        <Textarea
                          placeholder="ระบุเหตุผลที่ไม่อนุมัติอย่างละเอียด..."
                          className="min-h-24 mt-2 border-red-200"
                          value={approvalComment}
                          onChange={(e) => setApprovalComment(e.target.value)}
                        />
                      </div>
                    )}

                    {approvalDecision !== 'reject' && (
                      <div className="space-y-2">
                        <Label>หมายเหตุ (ถ้ามี)</Label>
                        <Textarea
                          placeholder="หมายเหตุประกอบมติ..."
                          value={approvalComment}
                          onChange={(e) => setApprovalComment(e.target.value)}
                        />
                      </div>
                    )}

                    {approvalDecision === 'approve' && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900">ขั้นตอนหลังอนุมัติ</p>
                            <ul className="text-sm text-green-700 mt-2 space-y-1">
                              <li>1. ระบบจะสร้างรหัสทุน (AWD) อัตโนมัติ</li>
                              <li>2. แจ้งผู้สมัครทราบผลการอนุมัติทางอีเมลและ SMS</li>
                              <li>3. เจ้าหน้าที่สร้างสัญญาและแผนจ่ายเงิน</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className={approvalDecision === 'approve' ? 'bg-green-600 hover:bg-green-700' : approvalDecision === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
                        onClick={handleSubmitApproval}
                        disabled={!approvalDecision}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ยืนยันมติ
                      </Button>
                      <Button variant="outline" onClick={() => toast.success('บันทึกฉบับร่างแล้ว')}>
                        บันทึกฉบับร่าง
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ประวัติมติ / ความเห็น</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviewCommittee.map((member, i) => (
                        <div key={i} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{member.name}</p>
                            <Badge variant="outline" className="text-xs">{member.role}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">แนะนำอนุมัติ</span>
                          </div>
                          <p className="text-xs text-gray-500">คะแนน: 8.5/10</p>
                          <p className="text-xs text-gray-600 italic">"ผู้สมัครมีคุณสมบัติดี ผลการเรียนเด่น"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ====================== AWARD TAB ====================== */}
          <TabsContent value="award" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    ทุน/สัญญา
                  </CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Clock className="w-3 h-3 mr-1" />
                    รอสร้างสัญญา
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">ข้อมูลทุน</h4>
                    {[
                      { label: 'รหัสทุน', value: 'AWD-2026-001 (รอสร้าง)' },
                      { label: 'ประเภท', value: application.scholarship.type },
                      { label: 'วงเงิน', value: formatCurrency(application.scholarship.amount) },
                      { label: 'ระยะเวลา', value: application.scholarship.duration },
                      { label: 'เริ่ม', value: application.scholarship.startDate },
                      { label: 'สิ้นสุด', value: 'กรกฎาคม 2030' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">ข้อมูลสัญญา</h4>
                    <div className="p-4 border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg text-center space-y-3">
                      <FileText className="w-12 h-12 text-yellow-500 mx-auto" />
                      <p className="text-sm text-yellow-700 font-medium">ยังไม่ได้สร้างสัญญา</p>
                      <p className="text-xs text-yellow-600">สร้างสัญญาหลังจากได้รับอนุมัติแล้ว</p>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" onClick={() => toast.success('สร้างสัญญาใหม่...')}>
                        <Plus className="w-4 h-4 mr-2" />
                        สร้างสัญญา
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>เงื่อนไขสำคัญ</Label>
                      <Textarea
                        placeholder="ระบุเงื่อนไขของทุน..."
                        defaultValue="1. GPA ไม่ต่ำกว่า 3.0 ทุกภาค&#10;2. ส่งรายงานความก้าวหน้าทุก 6 เดือน&#10;3. กลับมาชดใช้ทุนตามระยะเวลาที่กำหนด&#10;4. ห้ามเปลี่ยนสาขาโดยไม่ได้รับอนุญาต"
                        className="min-h-32"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-600" />
                    การระงับ/ปิดทุน
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" className="text-orange-600 hover:bg-orange-50 border-orange-200" onClick={() => toast.warning('ส่งคำเตือนถึงผู้รับทุน')}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      ส่งคำเตือน
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => toast.error('ระงับทุน (ต้องระบุเหตุผล)')}>
                      <Ban className="w-4 h-4 mr-2" />
                      ระงับทุน
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== PAYMENT TAB ====================== */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-cyan-600" />
                    แผนจ่ายเงิน
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">วงเงินรวม</p>
                      <p className="text-xl font-bold text-cyan-600">{formatCurrency(application.scholarship.amount)}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">จ่ายแล้ว</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(0)}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">รอจ่าย</p>
                    <p className="text-xl font-bold text-yellow-600">{formatCurrency(5000000)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">จำนวนงวด</p>
                    <p className="text-xl font-bold text-blue-600">8 งวด</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">งวดที่</TableHead>
                        <TableHead>จำนวนเงิน</TableHead>
                        <TableHead>วันครบกำหนด</TableHead>
                        <TableHead>เงื่อนไข</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {casePayments.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-blue-50/50">
                          <TableCell className="text-center font-medium">{payment.installment}</TableCell>
                          <TableCell className="font-medium text-green-600">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {payment.dueDate}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{payment.condition}</TableCell>
                          <TableCell>
                            <Badge className="bg-gray-100 text-gray-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              ตามแผน
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" onClick={() => toast.info(`แก้ไขงวดที่ ${payment.installment}`)}>
                              <Pen className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== TRACKING TAB ====================== */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  ติดตามผลการศึกษา
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">รอบรายงานปัจจุบัน</p>
                    <p className="font-medium mt-1">ภาคเรียนที่ 1/2026</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">GPA ล่าสุด</p>
                    <p className="text-xl font-bold text-green-600 mt-1">-</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">ส่งรายงานแล้ว</p>
                    <p className="text-xl font-bold text-yellow-600 mt-1">0/1</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">ระยะเวลาคงเหลือ</p>
                    <p className="font-medium mt-1">4 ปี</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รอบรายงาน</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>วันครบกำหนด</TableHead>
                        <TableHead>วันที่ส่ง</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseTrackingHistory.map((track, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{track.period}</TableCell>
                          <TableCell>{track.gpa || '-'}</TableCell>
                          <TableCell className="text-sm">{track.dueDate}</TableCell>
                          <TableCell className="text-sm">{track.submittedDate || '-'}</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Clock className="w-3 h-3 mr-1" />
                              รอส่ง
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => toast.info('ส่งแจ้งเตือนรายงาน')}>
                              <Bell className="w-4 h-4 mr-1" />
                              แจ้งเตือน
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">หมายเหตุ</p>
                      <p className="text-sm text-blue-700 mt-1">
                        ระบบจะส่งแจ้งเตือนผู้รับทุนอัตโนมัติก่อนครบกำหนดส่งรายงาน 30, 14, 7 และ 3 วัน
                        หากไม่ส่งรายงานตามกำหนด การจ่ายเงินงวดถัดไปจะถูกระงับอัตโนมัติ
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== TIMELINE TAB ====================== */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  ไทม์ไลน์การดำเนินการ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {event.type === 'submit' && <Send className="w-4 h-4 text-blue-600" />}
                          {event.type === 'view' && <Eye className="w-4 h-4 text-blue-600" />}
                          {event.type === 'upload' && <Upload className="w-4 h-4 text-blue-600" />}
                          {event.type === 'notification' && <Bell className="w-4 h-4 text-blue-600" />}
                        </div>
                        {index < timeline.length - 1 && <div className="w-0.5 h-12 bg-gray-200" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-600">โดย {event.user}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== COMMUNICATION TAB ====================== */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      ประวัติการสื่อสาร
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {communications.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg ${msg.direction === 'out' ? 'border-blue-200 bg-blue-50/30' : 'border-green-200 bg-green-50/30'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={msg.type === 'email' ? 'border-blue-200 text-blue-700' : msg.type === 'sms' ? 'border-green-200 text-green-700' : 'border-purple-200 text-purple-700'}>
                              {msg.type === 'email' ? <Mail className="w-3 h-3 mr-1" /> : msg.type === 'sms' ? <Phone className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                              {msg.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={msg.direction === 'out' ? 'border-blue-200 text-blue-600' : 'border-green-200 text-green-600'}>
                              {msg.direction === 'out' ? '→ ส่งออก' : '← เข้ามา'}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{msg.date}</span>
                        </div>
                        <p className="font-medium text-sm">{msg.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">ถึง: {msg.to}</p>
                        <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded">{msg.body}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-600" />
                      ส่งข้อความถึงผู้สมัคร
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="ช่องทาง" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">อีเมล</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">ทั้งอีเมลและ SMS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกเทมเพลต (ถ้ามี)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="request-doc">ขอเอกสารเพิ่มเติม</SelectItem>
                        <SelectItem value="status-update">แจ้งอัพเดตสถานะ</SelectItem>
                        <SelectItem value="reminder">แจ้งเตือนทั่วไป</SelectItem>
                        <SelectItem value="custom">เขียนเอง</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="พิมพ์ข้อความ..."
                      className="min-h-24"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleSendMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      ส่งข้อความ
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-600" />
                      หมายเหตุภายใน
                    </CardTitle>
                    <CardDescription>เฉพาะเจ้าหน้าที่ ผู้สมัครไม่เห็น</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="บันทึกหมายเหตุภายใน..."
                      className="min-h-24"
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                    />
                    <Button variant="outline" className="w-full" onClick={handleSaveInternalNote}>
                      <Pen className="w-4 h-4 mr-2" />
                      บันทึกหมายเหตุ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ====================== AUDIT TAB ====================== */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Audit Log - เคส {application.id}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => toast.success('ส่งออก Audit Log')}>
                    <Download className="w-4 h-4 mr-2" />
                    ส่งออก
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>เวลา</TableHead>
                        <TableHead>ผู้ใช้</TableHead>
                        <TableHead>กิจกรรม</TableHead>
                        <TableHead>รายละเอียด</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log, index) => (
                        <TableRow key={index} className="hover:bg-blue-50/50">
                          <TableCell className="text-xs font-mono whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {log.timestamp}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{log.detail}</TableCell>
                          <TableCell className="font-mono text-xs text-gray-500">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Audit Log ถูกบันทึกอัตโนมัติและไม่สามารถแก้ไขหรือลบได้
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
