import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle2, XCircle, Send, MessageSquare, 
  FileText, History, User, Building, MapPin, Phone, 
  Mail, GraduationCap, Calendar, Plane, CreditCard,
  Briefcase, ShieldCheck, Award, BookOpen, Clock, Activity, Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Dialog States
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);

  // Mock Form Data matching "แบบรายงานตัวไปศึกษา"
  const formData = {
    scholarshipType: 'ทุนรัฐบาล (ก.พ.)',
    scholarshipSubtype: 'ทุนทางด้านวิทยาศาสตร์ฯ',
    year: '2569',
    requirement: 'ตามความต้องการของ กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',
    
    personal: {
      titleTH: 'นาย', nameTH: 'สมชาย', surnameTH: 'รักเรียน',
      titleEN: 'Mr.', nameEN: 'Somchai', surnameEN: 'Rakrian',
      dob: '12 เมษายน 2542', age: '27',
      province: 'กรุงเทพมหานคร', idCard: '1-1009-99999-99-9',
      addressTH: '123/45 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท จ.กรุงเทพมหานคร 10400',
      phone: '081-234-5678'
    },
    
    employment: {
      isGovernment: true,
      position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
      department: 'ศูนย์เทคโนโลยีสารสนเทศ',
      division: 'สำนักงานปลัดกระทรวง',
      ministry: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม'
    },

    education: {
      highestDegree: 'ปริญญาโท',
      major: 'วิศวกรรมซอฟต์แวร์',
      institution: 'จุฬาลงกรณ์มหาวิทยาลัย',
      country: 'ไทย',
      yearGraduated: '2566',
      gpa: '3.85'
    },
    
    testScores: {
      toefl: '110', ielts: '-', greV: '160', greQ: '168', greA: '4.5', gmat: '-'
    },

    travel: {
      departureDate: '25 สิงหาคม 2569',
      arrivalAirport: 'San Francisco International Airport (SFO)',
      arrivalDate: '25 สิงหาคม 2569',
      transitNights: '0'
    },

    passport: {
      type: 'ราชการ',
      number: 'O1234567',
      issueDate: '15 พฤษภาคม 2568',
      expiryDate: '14 พฤษภาคม 2573'
    },
    
    visa: {
      hasVisa: true,
      type: 'F-1 Student Visa'
    },

    contacts: {
      guarantorName: 'นายสมศักดิ์ รักเรียน',
      guarantorJob: 'ข้าราชการบำนาญ',
      guarantorWorkplace: '-',
      guarantorAddress: '123/45 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท จ.กรุงเทพมหานคร 10400',
      guarantorPhone: '089-999-8888',
      
      emergencyName: 'นางสมหญิง รักเรียน',
      emergencyRelation: 'มารดา',
      emergencyAddress: '123/45 ถ.พหลโยธิน แขวงสามเสนใน เขตพญาไท จ.กรุงเทพมหานคร 10400',
      emergencyPhone: '088-777-6666',
      
      foreignAddress: '450 Serra Mall, Stanford, CA 94305, USA',
      email: 'somchai.r@example.com'
    }
  };

  const DataField = ({ label, value, colSpan = 1 }: { label: string, value: string | React.ReactNode, colSpan?: number }) => (
    <div className={`col-span-${colSpan} flex flex-col space-y-1`}>
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-[14px] font-medium text-slate-900">{value || '-'}</span>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-slate-200">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
        <Icon size={16} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
  );

  const handleAction = (actionName: string, setOpen: (open: boolean) => void) => {
    toast.success(`บันทึก ${actionName} เรียบร้อยแล้ว`);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-['Inter','K2D',sans-serif]">
      
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">REQ-2026-001</h1>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">รอการอนุมัติ สนร.</Badge>
            </div>
            <p className="text-sm text-slate-500">รายงานตัวไปศึกษา: {formData.personal.nameTH} {formData.personal.surnameTH}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'oea' ? (
            <>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-sm transition-all" onClick={() => setRejectOpen(true)}>
                <XCircle className="w-4 h-4 mr-2" /> ไม่อนุมัติ
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm transition-all" onClick={() => setRequestInfoOpen(true)}>
                <FileText className="w-4 h-4 mr-2" /> ขอข้อมูลเพิ่ม
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm transition-all" onClick={() => setForwardOpen(true)}>
                <Send className="w-4 h-4 mr-2" /> ส่งต่อ สนง. ก.พ.
              </Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm transition-all" onClick={() => setApproveOpen(true)}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> อนุมัติ
              </Button>
            </>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => toast.success('บันทึกเรียบร้อย')}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> ยืนยันการตรวจสอบ
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Document View */}
      <div className="flex-1 overflow-auto p-8 flex flex-col items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          {/* Enhanced Document Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 shadow-xl">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">แบบรายงานตัวไปศึกษา ณ ประเทศ สหรัฐอเมริกา</h2>
              <p className="text-blue-100 font-medium">ประเภททุนรัฐบาล (ก.พ.) / ทุนวิทยาศาสตร์ฯ</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            
            {/* 1. Scholarship Type */}
            <SectionTitle title="1. ข้อมูลทุนรัฐบาล" icon={GraduationCap} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <DataField label="ประเภทนักเรียนทุน" value={formData.scholarshipType} />
              <DataField label="หมวดหมู่ทุน" value={formData.scholarshipSubtype} />
              <DataField label="ประจำปี" value={formData.year} />
              <DataField label="ตามความต้องการของ" value={formData.requirement} />
            </div>

            {/* 2. Personal Info */}
            <SectionTitle title="2. ข้อมูลส่วนตัวผู้สมัคร" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              <DataField label="ชื่อ-สกุล (ภาษาไทย)" value={`${formData.personal.titleTH}${formData.personal.nameTH} ${formData.personal.surnameTH}`} colSpan={2} />
              <DataField label="เลขประจำตัวประชาชน" value={formData.personal.idCard} />
              
              <DataField label="ชื่อ-สกุล (ภาษาอังกฤษ)" value={`${formData.personal.titleEN} ${formData.personal.nameEN} ${formData.personal.surnameEN}`} colSpan={2} />
              <DataField label="เกิดวันที่" value={`${formData.personal.dob} (อายุ ${formData.personal.age} ปี)`} />
              
              <DataField label="ภูมิลำเนาจังหวัด" value={formData.personal.province} />
              <DataField label="โทรศัพท์" value={formData.personal.phone} />
              <div className="col-span-1"></div>

              <DataField label="ที่อยู่ในประเทศไทย" value={formData.personal.addressTH} colSpan={3} />
            </div>

            {/* 3. Employment (If Government) */}
            {formData.employment.isGovernment && (
              <>
                <SectionTitle title="3. สถานะข้าราชการ/พนักงาน" icon={Briefcase} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataField label="ตำแหน่ง" value={formData.employment.position} />
                  <DataField label="แผนก/ภาควิชา" value={formData.employment.department} />
                  <DataField label="กอง/คณะ" value={formData.employment.division} />
                  <DataField label="กระทรวง/ทบวง/กรม" value={formData.employment.ministry} />
                </div>
              </>
            )}

            {/* 4. Education & Scores */}
            <SectionTitle title="4. ประวัติการศึกษา และผลคะแนนสอบ" icon={BookOpen} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <DataField label="การศึกษาสูงสุดระดับ" value={formData.education.highestDegree} />
              <DataField label="วิชา" value={formData.education.major} />
              <DataField label="สถาบัน" value={formData.education.institution} />
              <DataField label="ประเทศ" value={formData.education.country} />
              <DataField label="ปีที่จบ (พ.ศ.)" value={formData.education.yearGraduated} />
              <DataField label="GPA" value={formData.education.gpa} />
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Award className="w-4 h-4"/> ผลคะแนนสอบ</h4>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <DataField label="TOEFL" value={formData.testScores.toefl} />
                <DataField label="IELTS" value={formData.testScores.ielts} />
                <DataField label="GRE (V)" value={formData.testScores.greV} />
                <DataField label="GRE (Q)" value={formData.testScores.greQ} />
                <DataField label="GRE (A)" value={formData.testScores.greA} />
                <DataField label="GMAT" value={formData.testScores.gmat} />
              </div>
            </div>

            {/* 5. Travel & Visa */}
            <SectionTitle title="5. กำหนดการเดินทาง และวีซ่า" icon={Plane} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
              <DataField label="ออกเดินทางจากกรุงเทพฯ วันที่" value={formData.travel.departureDate} />
              <DataField label="ถึงสนามบิน" value={formData.travel.arrivalAirport} />
              <DataField label="ค้างคืน (Transit)" value={`${formData.travel.transitNights} คืน`} />
              <DataField label="วันที่ถึงปลายทาง" value={formData.travel.arrivalDate} />
            </div>
            <Separator className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><CreditCard className="w-4 h-4"/> หนังสือเดินทาง (Passport)</h4>
                <DataField label="ประเภท" value={formData.passport.type} />
                <DataField label="เลขที่หนังสือเดินทาง" value={formData.passport.number} />
                <div className="flex gap-4">
                  <DataField label="วันออกบัตร" value={formData.passport.issueDate} />
                  <DataField label="วันหมดอายุ" value={formData.passport.expiryDate} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin className="w-4 h-4"/> วีซ่าเข้าประเทศ</h4>
                <DataField label="สถานะการได้รับวีซ่า" value={formData.visa.hasVisa ? 'ได้รับแล้ว' : 'ยังไม่ได้รับ'} />
                <DataField label="ประเภทวีซ่า" value={formData.visa.type} />
              </div>
            </div>

            {/* 6. Contacts */}
            <SectionTitle title="6. ข้อมูลติดต่อ และผู้ค้ำประกัน" icon={Phone} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-700">ผู้ค้ำประกัน / ผู้ฝาก</h4>
                <DataField label="ชื่อ-สกุล" value={formData.contacts.guarantorName} />
                <DataField label="อาชีพ" value={formData.contacts.guarantorJob} />
                <DataField label="โทรศัพท์" value={formData.contacts.guarantorPhone} />
                <DataField label="สถานที่ทำงาน / ที่อยู่" value={formData.contacts.guarantorAddress} />
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-700">ผู้ติดต่อฉุกเฉินในประเทศไทย</h4>
                <DataField label="ชื่อ-สกุล" value={formData.contacts.emergencyName} />
                <DataField label="ความสัมพันธ์" value={formData.contacts.emergencyRelation} />
                <DataField label="โทรศัพท์" value={formData.contacts.emergencyPhone} />
                <DataField label="ที่อยู่" value={formData.contacts.emergencyAddress} />
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <DataField label="ที่อยู่ที่ติดต่อได้ในต่างประเทศ" value={formData.contacts.foreignAddress} colSpan={2} />
              <DataField label="E-mail" value={formData.contacts.email} />
            </div>



          </div>
        </motion.div>

        {/* Supplementary Information Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-4xl space-y-6"
        >
          {/* Scholar and Award Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-500" /> ข้อมูลนักเรียนทุน
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => navigate('/scholars/SCH-2569-001?tab=personal')}>
                    ดูเพิ่มเติม
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">รหัสนักเรียนทุน</span>
                  <span className="text-sm font-bold text-slate-800">SCH-2569-001</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">สถานะปัจจุบัน</span>
                  <Badge className="bg-amber-100 text-amber-700 border-0">รอรายงานตัว</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">กลุ่มงานดูแล</span>
                  <span className="text-sm font-medium text-slate-800">นทร. 1</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-slate-500" /> ข้อมูลการรับทุน
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => navigate('/scholars/SCH-2569-001/awards/AWD-001')}>
                    ดูเพิ่มเติม
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">รหัสทุน</span>
                  <span className="text-sm font-bold text-slate-800">AWD-002</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">ระยะเวลารับทุน</span>
                  <span className="text-sm font-medium text-slate-800">ส.ค. 2569 - ก.ค. 2573</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">ประเทศเป้าหมาย</span>
                  <span className="text-sm font-medium text-slate-800">สหรัฐอเมริกา</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact History / Timeline */}
          <Card className="shadow-sm border border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-500" /> ประวัติการติดต่อและกิจกรรมคำขอ
              </CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8">
                <Plus className="w-4 h-4 mr-1" /> บันทึกการติดต่อใหม่
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {[
                  { id: 1, date: '15/08/2569 10:30', title: 'ผู้สมัครยื่นคำขอรายงานตัว', detail: 'ระบบได้รับแบบรายงานตัวเรียบร้อยแล้ว', staff: 'ระบบอัตโนมัติ', icon: FileText, color: 'text-blue-500 bg-blue-50 border-blue-200' },
                  { id: 2, date: '16/08/2569 09:15', title: 'เจ้าหน้าที่ตรวจสอบเอกสาร', detail: 'เอกสารครบถ้วน รอส่งพิจารณา', staff: 'สมหญิง รักงาน', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
                  { id: 3, date: '17/08/2569 11:00', title: 'ส่งเรื่องให้ สนร. อนุมัติ', detail: 'ส่งเรื่องรายงานตัวให้ สนร. พิจารณา', staff: 'สมชาย เจ้าหน้าที่', icon: Send, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' }
                ].map((log) => {
                  const LogIcon = log.icon;
                  return (
                    <div key={log.id} className="relative">
                      <div className={`absolute -left-[35px] w-8 h-8 rounded-full border flex items-center justify-center bg-white shadow-sm ${log.color}`}>
                        <LogIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-slate-800">{log.title}</h4>
                          <span className="text-[12px] font-medium text-slate-500">{log.date}</span>
                        </div>
                        <p className="text-[13px] text-slate-600 mb-2">{log.detail}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <User className="w-3 h-3" /> บันทึกโดย: {log.staff}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      
      {/* 1. Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600"><XCircle className="w-5 h-5"/> ไม่อนุมัติคำขอ</DialogTitle>
            <DialogDescription>
              กรุณาระบุเหตุผลที่ไม่อนุมัติคำขอนี้ เพื่อแจ้งให้ผู้สมัครทราบ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason" className="text-rose-600 font-semibold">เหตุผลการไม่อนุมัติ <span className="text-rose-500">*</span></Label>
              <Textarea id="reject-reason" placeholder="ระบุเหตุผล..." className="min-h-[100px] border-rose-200 focus-visible:ring-rose-500" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>ยกเลิก</Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => handleAction('การไม่อนุมัติ', setRejectOpen)}>ยืนยันไม่อนุมัติ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Request Info Dialog */}
      <Dialog open={requestInfoOpen} onOpenChange={setRequestInfoOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600"><FileText className="w-5 h-5"/> ขอข้อมูลเพิ่มเติม</DialogTitle>
            <DialogDescription>
              ระบุรายละเอียดเอกสารหรือข้อมูลที่ต้องการเพิ่มเติมจากผู้สมัคร
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="req-detail" className="font-semibold">รายละเอียดที่ต้องการ <span className="text-rose-500">*</span></Label>
              <Textarea id="req-detail" placeholder="เช่น ขอเอกสารใบรับรองแพทย์ฉบับจริง..." className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-date" className="font-semibold">กำหนดวันที่ต้องแจ้งกลับ <span className="text-rose-500">*</span></Label>
              <Input id="req-date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestInfoOpen(false)}>ยกเลิก</Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleAction('การขอข้อมูลเพิ่มเติม', setRequestInfoOpen)}>ส่งคำขอ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Forward Dialog */}
      <Dialog open={forwardOpen} onOpenChange={setForwardOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600"><Send className="w-5 h-5"/> ส่งต่อ สนง. ก.พ.</DialogTitle>
            <DialogDescription>
              ส่งเรื่องให้สำนักงาน ก.พ. ส่วนกลางพิจารณาเพิ่มเติม
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fwd-note" className="font-semibold">หมายเหตุ/เหตุผลที่ส่งต่อ <span className="text-rose-500">*</span></Label>
              <Textarea id="fwd-note" placeholder="ระบุสาเหตุที่ต้องส่งเรื่องให้ส่วนกลางพิจารณา..." className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForwardOpen(false)}>ยกเลิก</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction('การส่งต่อ', setForwardOpen)}>ยืนยันการส่งต่อ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="w-5 h-5"/> อนุมัติคำขอ</DialogTitle>
            <DialogDescription>
              ยืนยันการอนุมัติแบบรายงานตัวนี้
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approve-note" className="font-semibold">หมายเหตุ (ถ้ามี)</Label>
              <Textarea id="approve-note" placeholder="บันทึกย่อสำหรับการอนุมัตินี้..." className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>ยกเลิก</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleAction('การอนุมัติ', setApproveOpen)}>ยืนยันอนุมัติ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
