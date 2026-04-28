import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  GraduationCap, FileText, Search, UserCheck, PenTool,
  ClipboardCheck, Stethoscope, Shield, Plane, BookOpen,
  CheckCircle, ArrowRight, ChevronDown, ChevronRight,
  Calendar, Clock, AlertTriangle, Download, Phone,
  MapPin, Globe, Award, Star, FileCheck, Upload,
  Stamp, Eye, Heart, Languages, Building, FolderOpen,
  CreditCard, Fingerprint, Info, Target, Users, Mail,
  Sparkles, BookMarked,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { cn } from '../../components/ui/utils';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 } };
const stagger = (d: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.5 } });

// ===== Application Steps =====
interface Step {
  no: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: typeof FileText;
  color: string;
  gradient: string;
  duration: string;
  documents?: string[];
  tips?: string[];
}

const steps: Step[] = [
  {
    no: 1,
    title: 'ศึกษาข้อมูลและตรวจสอบคุณสมบัติ',
    subtitle: 'Research & Eligibility Check',
    description: 'ศึกษาประเภททุน เงื่อนไข คุณสมบัติ และรายละเอียดต่างๆ ก่อนตัดสินใจสมัคร',
    details: [
      'ศึกษาประเภททุนรัฐบาลที่เปิดรับสมัคร (ทุน ก.พ., ทุน กต., ทุนพิเศษ ฯลฯ)',
      'ตรวจสอบคุณสมบัติเบื้องต้น: อายุ สัญชาติ วุฒิการศึกษา ผลภาษาอังกฤษ',
      'ศึกษาแหล่งทุน ชื่อทุน ประเภททุน ปีที่รับทุน ระดับการศึกษาที่ได้รับทุนจัดสรร',
      'ศึกษาสาขาที่ทุนกำหนด ประเทศที่ศึกษา ระยะเวลารับทุน',
      'ศึกษาเงื่อนไขการชดใช้ทุน (โดยทั่วไป 2 เท่าของระยะเวลารับทุน)',
      'อ่านระเบียบ ก.พ. ว่าด้วยทุนรัฐบาล ฉบับล่าสุด',
    ],
    icon: Search,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500',
    duration: 'ก่อนสมัคร',
    tips: [
      'เตรียมสอบภาษาอังกฤษ (IELTS/TOEFL) ล่วงหน้าอย่างน้อย 6 เดือน',
      'ศึกษาหลักสูตรและสถาบันที่สนใจไว้ก่อน',
    ],
  },
  {
    no: 2,
    title: 'ยื่นใบสมัครและเอกสาร',
    subtitle: 'Application Submission',
    description: 'กรอกใบสมัครออนไลน์ พร้อมแนบเอกสารประกอบการสมัครให้ครบถ้วน',
    details: [
      'สมัครผ่านระบบออนไลน์ของสำนักงาน ก.พ.',
      'กรอกข้อมูลส่วนบุคคล: ประวัติส่วนตัว รูปถ่าย ประวัติการศึกษา ช่องทางติดต่อ',
      'กรอกข้อมูลการสมัครทุน: แหล่งทุน ชื่อทุน ประเภท ระดับการศึกษา สาขาวิชา',
      'ระบุประเทศ สถานศึกษา เมือง/รัฐที่ต้องการไปศึกษา',
      'แนบผลคะแนนภาษาอังกฤษ (IELTS, TOEFL iBT, TOEIC)',
      'แนบเอกสารประกอบตามที่กำหนด',
    ],
    icon: PenTool,
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-500',
    duration: 'ก.พ. - เม.ย.',
    documents: [
      'ใบสมัคร (กรอกผ่านระบบออนไลน์)',
      'รูปถ่ายหน้าตรง ขนาด 1 นิ้ว',
      'สำเนาบัตรประชาชน',
      'สำเนาทะเบียนบ้าน',
      'หลักฐานการศึกษา / Transcript',
      'ผลคะแนนภาษาอังกฤษ (IELTS/TOEFL/TOEIC)',
      'หนังสือรับรองจากหน่วยงาน (กรณีข้าราชการ)',
      'เอกสารอื่นๆ ตามประกาศกำหนด',
    ],
  },
  {
    no: 3,
    title: 'ตรวจสอบเอกสารและคุณสมบัติ',
    subtitle: 'Document Verification',
    description: 'เจ้าหน้าที่ ก.พ. ตรวจสอบเอกสาร คุณสมบัติ และความถูกต้องของข้อมูลทั้งหมด',
    details: [
      'เจ้าหน้าที่ตรวจสอบความครบถ้วนของเอกสาร',
      'ตรวจสอบคุณสมบัติตามเงื่อนไขของทุน',
      'กรณีเอกสารไม่ครบ — ระบบแจ้งให้ส่งเอกสารเพิ่มเติม (สถานะ "ขอเอกสารเพิ่มเติม")',
      'เจ้าหน้าที่ "รับทราบ" เอกสารที่ส่งเข้ามา',
      'ประกาศรายชื่อผู้มีสิทธิสอบข้อเขียน',
    ],
    icon: ClipboardCheck,
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-500',
    duration: 'ภายใน 2-4 สัปดาห์',
    tips: [
      'ตรวจสอบสถานะใบสมัครผ่านระบบเป็นประจำ',
      'เตรียมเอกสารสำรองไว้ กรณีถูกขอเพิ่มเติม',
    ],
  },
  {
    no: 4,
    title: 'สอบข้อเขียนและสัมภาษณ์',
    subtitle: 'Written Exam & Interview',
    description: 'สอบข้อเขียนวิชาที่เกี่ยวข้อง และสอบสัมภาษณ์โดยคณะกรรมการคัดเลือก',
    details: [
      'สอบข้อเขียนวิชาเฉพาะสาขา (ตามที่ทุนกำหนด)',
      'สอบข้อเขียนวิชาภาษาอังกฤษ (กรณียังไม่มีผลคะแนน)',
      'สอบสัมภาษณ์โดยคณะกรรมการผู้ทรงคุณวุฒิ',
      'พิจารณาผลงานวิชาการ ประสบการณ์ และแรงจูงใจ',
      'คณะกรรมการตัดสินผล — "อนุมัติ" หรือ "ไม่อนุมัติ"',
    ],
    icon: BookOpen,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-500',
    duration: 'พ.ค. - มิ.ย.',
    tips: [
      'เตรียมตัวนำเสนอแผนการศึกษาและเหตุผลที่เลือกสาขา/สถาบัน',
      'ศึกษาแนวข้อสอบย้อนหลัง',
    ],
  },
  {
    no: 5,
    title: 'ประกาศผลคัดเลือก',
    subtitle: 'Result Announcement',
    description: 'ประกาศรายชื่อผู้มีสิทธิ์ได้รับทุนรัฐบาล พร้อมรายชื่อตัวสำรอง',
    details: [
      'ประกาศรายชื่อผู้มีสิทธิ์ได้รับทุนรัฐบาล (ตัวจริงและตัวสำรอง)',
      'สถานะเปลี่ยนเป็น "สถานะการรับทุน" — ยืนยันรับทุน, สละสิทธิ, เพิกถอน',
      'ผู้ได้รับทุนยืนยันการรับทุนภายในระยะเวลาที่กำหนด',
      'กรณีสละสิทธิ — เรียกตัวสำรองตามลำดับ',
    ],
    icon: Award,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-violet-500',
    duration: 'ก.ค.',
  },
  {
    no: 6,
    title: 'ทำสัญญารับทุนและค้ำประกัน',
    subtitle: 'Contract Signing',
    description: 'ลงนามสัญญารับทุนและสัญญาค้ำประกัน กรอกเงื่อนไขระยะเวลาชดใช้ทุน',
    details: [
      'ลงนามสัญญารับทุนกับสำนักงาน ก.พ.',
      'จัดทำสัญญาค้ำประกัน (ผู้ค้ำประกัน)',
      'กรอกเงื่อนไขระยะเวลาชดใช้ทุน (ตัวคูณตามสัญญา)',
      'อัปโหลดไฟล์สัญญาเข้าสู่ระบบ (.pdf)',
      'ระบบคำนวณวันชดใช้ทุนอัตโนมัติตามเงื่อนไขสัญญา',
    ],
    icon: FileCheck,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-500',
    duration: 'ส.ค.',
    documents: [
      'สัญญารับทุนรัฐบาล',
      'สัญญาค้ำประกัน',
      'สำเนาบัตรประชาชนผู้ค้ำประกัน',
      'หลักฐานทางการเงินผู้ค้ำประกัน',
    ],
  },
  {
    no: 7,
    title: 'เตรียมตัวก่อนเดินทาง',
    subtitle: 'Pre-Departure Preparation',
    description: 'ดำเนินการเอกสาร ตรวจสุขภาพ ผ่อนผันทหาร วีซ่า และเตรียมการเดินทาง',
    details: [
      'ตรวจสุขภาพตามที่ ก.พ. กำหนด (ผลมีอายุ 1 ปี) — ตรวจร่างกายทั่วไป สายตา การได้ยิน เอกซเรย์ปอด เลือด ปัสสาวะ สุขภาพจิต',
      'การผ่อนผันทหาร (กรณีเพศชาย) — ระบบแจ้งเตือนรายปี (ครั้งแรก) และก่อน 6 เดือน (ครั้งต่อไป)',
      'จัดเตรียมเอกสาร: หนังสือรับรองทางการเงิน, หนังสือรับรองนักเรียนทุน, เอกสารวีซ่า',
      'เอกสารสถานศึกษา: CAS (อังกฤษ), COE (ญี่ปุ่น), JW (จีน), DS (สหรัฐอเมริกา)',
      'จัดเตรียมตั๋วโดยสาร พาสปอร์ต วีซ่า',
      'เข้าร่วมปฐมนิเทศ ณ สำนักงาน ก.พ.',
    ],
    icon: Plane,
    color: 'text-cyan-600',
    gradient: 'from-cyan-500 to-teal-500',
    duration: 'ส.ค. - ก.ย.',
    documents: [
      'ผลตรวจสุขภาพ (อายุไม่เกิน 1 ปี)',
      'หนังสือรับรองทางการเงิน',
      'หนังสือรับรองการเป็นนักเรียนทุน',
      'เอกสารประกอบการยื่นวีซ่า',
      'CAS / COE / JW / DS (ตามประเทศ)',
      'ตั๋วเครื่องบิน',
      'หนังสือเดินทาง (พาสปอร์ต)',
      'วีซ่า',
      'เอกสารผ่อนผันทหาร (กรณีเพศชาย)',
    ],
    tips: [
      'ยื่นวีซ่าล่วงหน้าอย่างน้อย 2-3 เดือน',
      'ตรวจสุขภาพที่โรงพยาบาลที่ ก.พ. รับรอง',
      'รองรับไฟล์: .jpg .pdf .png',
    ],
  },
  {
    no: 8,
    title: 'เดินทางไปศึกษาและรายงานตัว',
    subtitle: 'Departure & Enrollment',
    description: 'เดินทางไปประเทศที่ศึกษา รายงานตัวต่อ สนร./สอท. และเข้าศึกษาตามหลักสูตร',
    details: [
      'เดินทางไปถึงประเทศที่ศึกษา',
      'รายงานตัวถึง สนร. (สำนักงานผู้ดูแลนักเรียน) หรือ สอท. (สถานเอกอัครราชทูต)',
      'แจ้งที่อยู่ปัจจุบันในต่างประเทศ',
      'ลงทะเบียนเข้าศึกษาตามหลักสูตร',
      'สนร. ติดตามการศึกษาและความเป็นอยู่ ส่งรายงานแจ้ง ศกศ.',
      'รายงานผลการศึกษาประจำภาค / ยื่นคำขออนุมัติต่างๆ',
      'ระบบแจ้งเตือนดำเนินการในเรื่องที่เกี่ยวข้อง',
    ],
    icon: GraduationCap,
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-green-500',
    duration: 'ก.ย. เป็นต้นไป',
    tips: [
      'รายงานตัวกับ สนร./สอท. ทันทีเมื่อเดินทางถึง',
      'รายงานผลการศึกษาทุกภาคเรียนตรงเวลา',
    ],
  },
];

// ===== Required qualifications =====
const qualifications = [
  { label: 'สัญชาติไทย', icon: Shield },
  { label: 'อายุไม่เกินตามที่กำหนด', icon: Calendar },
  { label: 'วุฒิปริญญาตรีขึ้นไป', icon: GraduationCap },
  { label: 'ผลภาษาอังกฤษตามเกณฑ์', icon: Languages },
  { label: 'สุขภาพแข็งแรง', icon: Heart },
  { label: 'ไม่อยู่ระหว่างรับทุนอื่น', icon: Award },
];

export default function ApplicationSteps() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1d4d] via-[#1e3a8a] to-[#2563eb] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-400 to-transparent rounded-full translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-5">
                <BookMarked className="w-3.5 h-3.5 mr-1.5" /> คู่มือสมัครทุนรัฐบาล
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                ขั้นตอนการยื่นขอ
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">ทุนรัฐบาล</span>
              </h1>
              <p className="text-lg text-blue-200 leading-relaxed mb-8 max-w-2xl">
                คู่มือฉบับสมบูรณ์ 8 ขั้นตอน ตั้งแต่เริ่มศึกษาข้อมูล ยื่นใบสมัคร สอบคัดเลือก
                ทำสัญญา เตรียมตัว จนถึงเดินทางไปศึกษา — ครอบคลุมทุกรายละเอียดตามระเบียบ ก.พ.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/30 px-8">
                  <Download className="w-5 h-5 mr-2" />ดาวน์โหลดคู่มือ PDF
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  <Phone className="w-5 h-5 mr-2" />สอบถามข้อมูลเพิ่มเติม
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Mini step nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 flex flex-wrap gap-2"
          >
            {steps.map((s, i) => (
              <a key={i} href={`#step-${s.no}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">{s.no}</span>
                {s.title.split('และ')[0]}
              </a>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none"><path d="M0 32L80 37C160 42 320 52 480 50C640 48 800 34 960 28C1120 22 1280 24 1360 25L1440 26V80H0V32Z" fill="white" /></svg>
        </div>
      </section>

      {/* ===== QUALIFICATIONS ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 mb-3">คุณสมบัติ</Badge>
            <h2 className="text-2xl font-bold text-gray-900">คุณสมบัติเบื้องต้นของผู้สมัคร</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {qualifications.map((q, i) => {
              const QIcon = q.icon;
              return (
                <motion.div key={i} {...stagger(i * 0.06)}>
                  <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                    <CardContent className="p-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-2">
                        <QIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{q.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE STEPS ===== */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <Badge className="bg-amber-100 text-amber-700 border border-amber-200 mb-3">8 ขั้นตอน</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">ขั้นตอนการยื่นขอทุนรัฐบาล</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">ดำเนินการตามลำดับ ครอบคลุมทุกรายละเอียดตั้งแต่ศึกษาข้อมูลจนถึงเดินทางไปศึกษาต่อ</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300 hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                const isExpanded = expandedStep === step.no;
                return (
                  <motion.div key={step.no} {...stagger(i * 0.06)} id={`step-${step.no}`} className="scroll-mt-24">
                    <div className="flex gap-6">
                      {/* Timeline dot */}
                      <div className="hidden md:flex flex-col items-center shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg z-10`}>
                          <StepIcon className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <Card className={cn(
                        'flex-1 overflow-hidden border transition-all duration-300',
                        isExpanded ? 'shadow-xl border-blue-200' : 'shadow-md hover:shadow-lg border-gray-100'
                      )}>
                        <CardContent className="p-0">
                          {/* Header */}
                          <div
                            className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                            onClick={() => setExpandedStep(isExpanded ? null : step.no)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className={`md:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md shrink-0`}>
                                  <StepIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={`bg-gradient-to-r ${step.gradient} text-white text-[10px] border-0 px-2`}>
                                      ขั้นตอนที่ {step.no}
                                    </Badge>
                                    <Badge variant="outline" className="text-[9px]">{step.duration}</Badge>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                                  <p className="text-xs text-gray-400 mt-0.5">{step.subtitle}</p>
                                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                                </div>
                              </div>
                              <ChevronDown className={cn(
                                'w-5 h-5 text-gray-400 transition-transform shrink-0 mt-1',
                                isExpanded && 'rotate-180'
                              )} />
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="border-t"
                            >
                              <div className="p-5 bg-gradient-to-b from-gray-50 to-white space-y-5">
                                {/* Details */}
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> รายละเอียดที่ต้องดำเนินการ
                                  </h4>
                                  <ul className="space-y-2">
                                    {step.details.map((d, di) => (
                                      <li key={di} className="flex items-start gap-2.5 text-sm text-gray-600">
                                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                                          <span className="text-[9px] font-bold text-white">{di + 1}</span>
                                        </div>
                                        {d}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Documents */}
                                {step.documents && (
                                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                      <FolderOpen className="w-4 h-4" /> เอกสารที่ต้องเตรียม
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                      {step.documents.map((doc, di) => (
                                        <div key={di} className="flex items-center gap-2 text-xs text-blue-700">
                                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                          {doc}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-[10px] text-blue-500 mt-2">รองรับไฟล์: .jpg .pdf .png</p>
                                  </div>
                                )}

                                {/* Tips */}
                                {step.tips && (
                                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4" /> เคล็ดลับ
                                    </h4>
                                    {step.tips.map((tip, ti) => (
                                      <div key={ti} className="flex items-start gap-2 text-xs text-amber-700 mb-1">
                                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                        {tip}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== AFTER STUDY ===== */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <Badge className="bg-green-100 text-green-700 border border-green-200 mb-3">หลังสำเร็จการศึกษา</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">เมื่อสำเร็จการศึกษาแล้ว</h2>
            <p className="text-gray-500 max-w-xl mx-auto">นักเรียนทุนต้องดำเนินการตามขั้นตอนเพื่อเสร็จสิ้นกระบวนการ</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'แจ้งสำเร็จการศึกษา', desc: 'แจ้ง สนร./สอท./สำนักงาน ก.พ. เมื่อสำเร็จหรือเสร็จสิ้นการศึกษา', icon: GraduationCap, color: 'from-green-500 to-emerald-500' },
              { title: 'รายงานตัว ก.พ.', desc: 'รายงานตัวกับสำนักงาน ก.พ. เมื่อเดินทางกลับถึงประเทศไทย พร้อมเอกสาร', icon: UserCheck, color: 'from-blue-500 to-indigo-500' },
              { title: 'พิจารณาคุณวุฒิ', desc: 'กรณีทุนบุคคลทั่วไป (ก.พ./กต.) — พิจารณาคุณวุฒิก่อนรายงานตัวเข้าปฏิบัติราชการ', icon: ClipboardCheck, color: 'from-purple-500 to-violet-500' },
              { title: 'จัดสรรสังกัด', desc: 'กรณีทุน ก.พ. ที่ไม่มีสังกัด — สำนักงาน ก.พ. จัดสรรสังกัดให้ นทร.', icon: Building, color: 'from-indigo-500 to-blue-500' },
              { title: 'คำนวณวันชดใช้ทุน', desc: 'สำนักงาน ก.พ. คำนวณวันชดใช้ทุนตามเงื่อนไขของสัญญารับทุน', icon: Target, color: 'from-amber-500 to-orange-500' },
              { title: 'เข้าปฏิบัติราชการ', desc: 'รายงานตัวเข้าปฏิบัติราชการตามหน่วยงานที่ได้รับการจัดสรร', icon: Star, color: 'from-teal-500 to-cyan-500' },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div key={i} {...stagger(i * 0.08)}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 h-full border border-gray-100">
                    <CardContent className="p-5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md mb-3`}>
                        <ItemIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== IMPORTANT NOTES ===== */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp}>
            <Card className="border-amber-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> ข้อควรทราบสำคัญ</h3>
              </div>
              <CardContent className="p-6 space-y-3">
                {[
                  'ผลการตรวจสุขภาพมีอายุ 1 ปี นับจากวันที่ตรวจ — ต้องตรวจที่โรงพยาบาลที่ ก.พ. รับรอง',
                  'การผ่อนผันทหาร (เพศชาย): ระบบแจ้งเตือนรายปี (ครั้งแรก) และก่อนครบกำหนดอย่างน้อย 6 เดือน (ครั้งต่อไป)',
                  'เอกสารทุกประเภทรองรับไฟล์ .jpg .pdf .png — อัปโหลดผ่านระบบออนไลน์',
                  'การชดใช้ทุน: ต้องกลับมาปฏิบัติราชการตามระยะเวลาที่กำหนดในสัญญา',
                  'ระหว่างศึกษา สามารถยื่นคำขออนุมัติ/อนุญาตต่างๆ ผ่าน สนร./สอท./สำนักงาน ก.พ.',
                  'ติดตามสถานะใบสมัครและเอกสารผ่านระบบได้ตลอดเวลา',
                ].map((note, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800">{note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-[#0c1d4d] to-[#1e3a8a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div {...fadeInUp}>
            <GraduationCap className="w-16 h-16 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl font-bold mb-4">พร้อมสมัครทุนรัฐบาลแล้วหรือยัง?</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อสอบถามได้ที่สำนักงาน ก.พ. หรือดาวน์โหลดคู่มือฉบับเต็ม</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 shadow-xl shadow-amber-500/30">
                <Download className="w-5 h-5 mr-2" />ดาวน์โหลดคู่มือ PDF
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                <Mail className="w-5 h-5 mr-2" /> scholarship@ocsc.go.th
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                <Phone className="w-5 h-5 mr-2" /> 02-547-1000
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
