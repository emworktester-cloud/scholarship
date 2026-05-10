import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  GraduationCap, Award, Globe, Users, ArrowRight,
  ChevronRight, Calendar, Clock, BookOpen, Building,
  TrendingUp, Star, MapPin, FileText, Phone, Mail,
  Download, ExternalLink, Search, Shield, Sparkles,
  Plane, CheckCircle, Heart, Lightbulb, Target,
  BookMarked, Landmark, BriefcaseBusiness,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { CountryFlag } from '../../components/ui/country-flag';

// Animation variants
const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };
const staggerItem = (delay: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay, duration: 0.5 } });

// ===== Data =====
const stats = [
  { label: 'ทุนรัฐบาลที่จัดสรร', value: '2,847', suffix: 'ทุน', icon: Award, color: 'from-blue-500 to-indigo-600' },
  { label: 'นักเรียนทุนปัจจุบัน', value: '1,247', suffix: 'ราย', icon: Users, color: 'from-emerald-500 to-teal-600' },
  { label: 'ประเทศที่ศึกษา', value: '45', suffix: 'ประเทศ', icon: Globe, color: 'from-purple-500 to-violet-600' },
  { label: 'สำเร็จการศึกษา', value: '15,340', suffix: 'ราย', icon: GraduationCap, color: 'from-amber-500 to-orange-600' },
];

const scholarshipTypes = [
  { name: 'ทุนบุคคลทั่วไป', code: 'ทุน ก.พ.', desc: 'สำหรับบุคคลทั่วไปที่ผ่านการสอบแข่งขัน เพื่อศึกษาต่อระดับปริญญาโท-เอก ในต่างประเทศ', level: 'ป.โท - ป.เอก', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  { name: 'ทุนข้าราชการ/เจ้าหน้าที่รัฐ', code: 'ทุน ก.พ.', desc: 'สำหรับข้าราชการพลเรือนและเจ้าหน้าที่ของรัฐ เพื่อพัฒนาศักยภาพและความเชี่ยวชาญเฉพาะด้าน', level: 'ป.โท - ป.เอก', icon: Building, color: 'from-indigo-500 to-purple-500' },
  { name: 'ทุนกระทรวงการต่างประเทศ', code: 'ทุน กต.', desc: 'ทุนรัฐบาลสำหรับผู้สนใจด้านการต่างประเทศ ความสัมพันธ์ระหว่างประเทศ และการทูต', level: 'ป.โท - ป.เอก', icon: Globe, color: 'from-emerald-500 to-green-500' },
  { name: 'ทุนวิจัยและฝึกอบรม', code: 'ทุนพิเศษ', desc: 'สำหรับการทำวิจัย ฝึกอบรม ศึกษาดูงานระยะสั้น เพื่อนำความรู้มาพัฒนาประเทศ', level: 'ฝึกอบรม - วิจัย', icon: Lightbulb, color: 'from-amber-500 to-yellow-500' },
  { name: 'ทุนโครงการพิเศษ', code: 'ทุนนโยบาย', desc: 'ทุนตามนโยบายรัฐบาล เช่น ทุน AI, ทุน Digital, ทุนพัฒนาเมืองอัจฉริยะ ฯลฯ', level: 'ป.โท - ป.เอก', icon: Sparkles, color: 'from-rose-500 to-pink-500' },
  { name: 'ทุนแลกเปลี่ยน', code: 'Exchange', desc: 'โครงการแลกเปลี่ยนนักศึกษาและบุคลากรระหว่างประเทศ เพื่อเสริมสร้างเครือข่ายสากล', level: 'ระยะสั้น', icon: Heart, color: 'from-cyan-500 to-blue-500' },
];

const newsItems = [
  { id: 1, title: 'ประกาศรับสมัครทุนรัฐบาล ประจำปี 2569 (ทุน ก.พ.)', date: '25/02/2569', category: 'ประกาศรับสมัคร', hot: true, desc: 'เปิดรับสมัครแล้ว! ทุน ก.พ. บุคคลทั่วไป ปริญญาโท-เอก จำนวน 120 ทุน สมัครได้ถึง 30/04/2569' },
  { id: 2, title: 'ผลการคัดเลือกผู้รับทุนรัฐบาล ปี 2568 รอบสุดท้าย', date: '20/02/2569', category: 'ประกาศผล', hot: false, desc: 'ประกาศผลการคัดเลือกรอบสุดท้าย ทุน ก.พ. ปี 2568 จำนวน 95 ราย ตรวจสอบรายชื่อได้ที่นี่' },
  { id: 3, title: 'ปรับปรุงระเบียบการรับทุนรัฐบาล ฉบับใหม่ พ.ศ. 2569', date: '15/02/2569', category: 'ระเบียบ/ข้อบังคับ', hot: false, desc: 'ก.พ. ปรับปรุงระเบียบการรับทุน เพิ่มสิทธิประโยชน์ และปรับเงื่อนไขชดใช้ทุนให้สอดคล้องกับสถานการณ์ปัจจุบัน' },
  { id: 4, title: 'กำหนดการปฐมนิเทศนักเรียนทุนรัฐบาล รุ่นที่ 89', date: '10/02/2569', category: 'กิจกรรม', hot: false, desc: 'ปฐมนิเทศ นทร. ก่อนเดินทาง วันที่ 15-17/03/2569 ณ สำนักงาน ก.พ. จ.นนทบุรี' },
  { id: 5, title: 'สนร. วอชิงตัน จัดงาน Thai Scholars Networking 2569', date: '05/02/2569', category: 'กิจกรรม', hot: false, desc: 'เชิญ นทร. ในสหรัฐอเมริกาเข้าร่วมงาน Networking วันที่ 20/03/2569 ลงทะเบียนผ่านระบบ' },
  { id: 6, title: 'แนวทางการขอขยายเวลาศึกษา สำหรับ นทร. ที่ได้รับผลกระทบ', date: '01/02/2569', category: 'แนวทางปฏิบัติ', hot: false, desc: 'สำนักงาน ก.พ. ผ่อนผันการขอขยายเวลาศึกษาสำหรับ นทร. ที่ได้รับผลกระทบจากสถานการณ์ต่างๆ' },
];

const categoryColors: Record<string, string> = {
  'ประกาศรับสมัคร': 'bg-red-100 text-red-700 border-red-200',
  'ประกาศผล': 'bg-green-100 text-green-700 border-green-200',
  'ระเบียบ/ข้อบังคับ': 'bg-purple-100 text-purple-700 border-purple-200',
  'กิจกรรม': 'bg-blue-100 text-blue-700 border-blue-200',
  'แนวทางปฏิบัติ': 'bg-amber-100 text-amber-700 border-amber-200',
};

const scholarCountries = [
  { country: 'สหรัฐอเมริกา', flag: '🇺🇸', count: 312, top: 'MIT, Stanford, Harvard' },
  { country: 'สหราชอาณาจักร', flag: '🇬🇧', count: 245, top: 'Oxford, Cambridge, Imperial' },
  { country: 'ญี่ปุ่น', flag: '🇯🇵', count: 128, top: 'U-Tokyo, Kyoto, Osaka' },
  { country: 'ออสเตรเลีย', flag: '🇦🇺', count: 95, top: 'Melbourne, Sydney, ANU' },
  { country: 'เยอรมนี', flag: '🇩🇪', count: 78, top: 'TU Munich, Heidelberg' },
  { country: 'ฝรั่งเศส', flag: '🇫🇷', count: 65, top: 'Sorbonne, Sciences Po' },
  { country: 'จีน', flag: '🇨🇳', count: 52, top: 'Tsinghua, Peking, Fudan' },
  { country: 'สิงคโปร์', flag: '🇸🇬', count: 38, top: 'NUS, NTU, SMU' },
];

const faqs = [
  { q: 'ใครมีสิทธิ์สมัครทุนรัฐบาล?', a: 'บุคคลสัญชาติไทย อายุไม่เกินที่กำหนด มีคุณสมบัติตามประกาศแต่ละประเภททุน ทั้งบุคคลทั่วไปและข้าราชการ' },
  { q: 'ทุนรัฐบาลครอบคลุมค่าใช้จ่ายอะไรบ้าง?', a: 'ค่าเล่าเรียน ค่าครองชีพ ค่าเดินทาง ค่าหนังสือ ค่าประกันสุขภาพ และค่าใช้จ่ายอื่นๆ ตามระเบียบ ก.พ.' },
  { q: 'เงื่อนไขการชดใช้ทุนเป็นอย่างไร?', a: 'ต้องกลับมาปฏิบัติราชการตามระยะเวลาที่กำหนดในสัญญา (โดยทั่วไป 2 เท่าของระยะเวลารับทุน)' },
  { q: 'สมัครทุนได้ช่วงเวลาใด?', a: 'ประกาศรับสมัครช่วงต้นปีงบประมาณ (ก.พ.-เม.ย.) โปรดติดตามประกาศทางเว็บไซต์อย่างสม่ำเสมอ' },
];

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1d4d] via-[#1e3a8a] to-[#1d4ed8] text-white">
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-400 to-transparent rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-6 text-xs px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> เปิดรับสมัครแล้ว ประจำปี 2569
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                ทุนรัฐบาล
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  เพื่ออนาคตของประเทศ
                </span>
              </h1>
              <p className="text-lg text-blue-200 leading-relaxed mb-8 max-w-lg">
                สำนักงาน ก.พ. จัดสรรทุนรัฐบาลเพื่อพัฒนาบุคลากรภาครัฐ ศึกษาต่อในระดับสูงทั้งในประเทศและต่างประเทศ
                ครอบคลุมทุนปริญญาโท ปริญญาเอก ฝึกอบรม และวิจัย
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/public/apply-steps">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl shadow-amber-500/30 px-8">
                    <GraduationCap className="w-5 h-5 mr-2" />สมัครทุนรัฐบาล
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  <Download className="w-5 h-5 mr-2" />ดาวน์โหลดคู่มือ
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-blue-400/20 rounded-3xl blur-2xl" />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBjZWxlYnJhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc3MjAyNjUzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="นักเรียนทุนรัฐบาล"
                  className="relative rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                {/* Floating stats cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">อัตราสำเร็จการศึกษา</p>
                      <p className="text-lg font-bold text-gray-900">98.5%</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 border"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ประเทศที่ศึกษา</p>
                      <p className="text-lg font-bold text-gray-900">45+</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 25 1380 22L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, i) => {
            const StIcon = st.icon;
            return (
              <motion.div key={i} {...staggerItem(i * 0.1)}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                  <CardContent className="p-5 text-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${st.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <StIcon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{st.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{st.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== SCHOLARSHIP TYPES ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 mb-3">ประเภททุน</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">ทุนรัฐบาลที่เปิดรับสมัคร</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">ทุนรัฐบาลหลากหลายประเภท สำหรับบุคคลทั่วไปและข้าราชการ ครอบคลุมทั้งในประเทศและต่างประเทศ</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarshipTypes.map((st, i) => {
              const StIcon = st.icon;
              return (
                <motion.div key={i} {...staggerItem(i * 0.08)}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border border-gray-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${st.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow shrink-0`}>
                          <StIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{st.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-[9px]">{st.code}</Badge>
                            <Badge variant="outline" className="text-[9px]">{st.level}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{st.desc}</p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        ดูรายละเอียด <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== NEWS & ANNOUNCEMENTS ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="flex items-end justify-between mb-10">
            <div>
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200 mb-3">ข่าวสาร</Badge>
              <h2 className="text-3xl font-bold text-gray-900">ข่าวสารและประชาสัมพันธ์</h2>
            </div>
            <Button variant="outline" className="hidden md:flex">ดูข่าวทั้งหมด <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news, i) => (
              <motion.div key={news.id} {...staggerItem(i * 0.06)}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full overflow-hidden border border-gray-100">
                  <CardContent className="p-0">
                    {i === 0 && (
                      <div className="h-44 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        <GraduationCap className="w-16 h-16 text-white/30 absolute -bottom-2 -right-2" />
                        <div className="text-center text-white p-6 relative">
                          <Badge className="bg-red-500 text-white mb-2 animate-pulse">ด่วน!</Badge>
                          <p className="text-sm font-bold leading-snug">{news.title}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-[9px] border ${categoryColors[news.category] || 'bg-gray-100 text-gray-600'}`}>
                          {news.category}
                        </Badge>
                        {news.hot && <Badge className="bg-red-500 text-white text-[8px]">HOT</Badge>}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">{news.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{news.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{news.date}</span>
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">อ่านต่อ <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COUNTRIES SECTION ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 border border-purple-200 mb-3">ประเทศที่ศึกษา</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">นักเรียนทุนรัฐบาลทั่วโลก</h2>
            <p className="text-gray-500">เครือข่ายนักเรียนทุนรัฐบาลกระจายอยู่ใน 45+ ประเทศทั่วโลก</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scholarCountries.map((c, i) => (
              <motion.div key={i} {...staggerItem(i * 0.05)}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CountryFlag countryName={c.country} width="40px" height="30px" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{c.country}</p>
                        <p className="text-xl font-bold text-blue-700">{c.count} <span className="text-xs font-normal text-gray-400">ราย</span></p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400">สถาบันชั้นนำ: {c.top}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS OVERVIEW ===== */}
      <section className="py-20 bg-gradient-to-br from-[#0c1d4d] via-[#1e3a8a] to-[#1d4ed8] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">ขั้นตอน</Badge>
            <h2 className="text-3xl font-bold mb-3">วงจรชีวิตนักเรียนทุนรัฐบาล</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">ตั้งแต่การสมัคร คัดเลือก เตรียมตัว เดินทาง ศึกษา จนถึงสำเร็จและชดใช้ทุน</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'สมัครและคัดเลือก', desc: 'ยื่นใบสมัคร สอบข้อเขียน สัมภาษณ์ ประกาศผล', icon: FileText },
              { step: '02', title: 'เตรียมตัวก่อนเดินทาง', desc: 'ทำสัญญา ตรวจสุขภาพ วีซ่า เอกสาร', icon: Plane },
              { step: '03', title: 'ระหว่างศึกษา', desc: 'รายงานตัว ติดตามผล คำขออนุมัติ', icon: BookOpen },
              { step: '04', title: 'สำเร็จและชดใช้ทุน', desc: 'แจ้งสำเร็จ รายงานตัว ปฏิบัติราชการ', icon: Target },
            ].map((s, i) => {
              const SIcon = s.icon;
              return (
                <motion.div key={i} {...staggerItem(i * 0.1)}>
                  <div className="text-center group">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                      <SIcon className="w-9 h-9 text-amber-300" />
                    </div>
                    <div className="text-amber-400 text-sm font-bold mb-1">STEP {s.step}</div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-blue-200/80">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...fadeInUp} className="text-center mt-12">
            <Link to="/public/apply-steps">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 shadow-xl shadow-amber-500/30">
                ดูขั้นตอนการสมัครทั้งหมด <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 border border-green-200 mb-3">คำถามที่พบบ่อย</Badge>
            <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...staggerItem(i * 0.08)}>
                <Card className="hover:shadow-md transition-shadow border border-gray-100">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center shrink-0 mt-0.5">Q</span>
                      {faq.q}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed pl-8">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <GraduationCap className="w-14 h-14 text-amber-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-3">พร้อมเริ่มต้นอนาคตกับทุนรัฐบาลหรือยัง?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">สมัครทุนรัฐบาลได้แล้ววันนี้ ตรวจสอบคุณสมบัติและขั้นตอนการสมัครได้ที่หน้าขั้นตอนการยื่นขอทุน</p>
            <div className="flex justify-center gap-4">
              <Link to="/public/apply-steps">
                <Button size="lg" className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white px-10 shadow-xl">
                  <GraduationCap className="w-5 h-5 mr-2" />ดูขั้นตอนการสมัคร
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                <Phone className="w-5 h-5 mr-2" />ติดต่อสอบถาม
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
