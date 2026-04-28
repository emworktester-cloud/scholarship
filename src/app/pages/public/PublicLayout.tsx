import { Outlet, Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Phone, Mail, MapPin, Facebook, Globe,
  ChevronUp, Menu, X, ExternalLink, Clock, Shield,
} from 'lucide-react';
import { cn } from '../../components/ui/utils';

const navLinks = [
  { label: 'หน้าหลัก', path: '/public' },
  { label: 'ขั้นตอนการยื่นขอทุน', path: '/public/apply-steps' },
];

export default function PublicLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 20);
      setShowScrollTop(target.scrollTop > 400);
    };
    const main = document.getElementById('public-main');
    main?.addEventListener('scroll', handler);
    return () => main?.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    const main = document.getElementById('public-main');
    if (main) main.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-[#0c1d4d] to-[#1e3a8a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 02-547-1000</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> scholarship@ocsc.go.th</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> จ-ศ 08:30-16:30 น.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="flex items-center gap-1 hover:text-amber-300 transition-colors">
              <Shield className="w-3 h-3" /> เข้าสู่ระบบสำหรับเจ้าหน้าที่
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg border-gray-200' : 'bg-white border-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/public" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1e3a8a] leading-tight">สำนักงาน ก.พ.</p>
              <p className="text-[10px] text-gray-500 leading-tight">ระบบทุนรัฐบาล</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <div className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#1e3a8a] text-white shadow-md'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-[#1e3a8a]'
                  )}>
                    {link.label}
                  </div>
                </Link>
              );
            })}
            <div className="ml-3 pl-3 border-l border-gray-200">
              <Link to="/public/apply-steps">
                <div className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                  สมัครทุนรัฐบาล
                </div>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t bg-white overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path} className="block px-4 py-3 rounded-lg text-sm hover:bg-blue-50">
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <main id="public-main" className="flex-1 overflow-y-auto scroll-smooth">
        <Outlet />

        {/* Footer */}
        <footer className="bg-gradient-to-b from-[#0c1d4d] to-[#060e29] text-white">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* About */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">สำนักงานคณะกรรมการข้าราชการพลเรือน</h3>
                    <p className="text-xs text-blue-300">Office of the Civil Service Commission (OCSC)</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-md">
                  ระบบบริหารจัดการทุนรัฐบาล สำหรับการจัดสรร ติดตาม และดูแลนักเรียนทุนรัฐบาลอย่างครบวงจร
                  ตั้งแต่ระยะก่อนเดินทาง ระหว่างศึกษา จนถึงสำเร็จการศึกษาและชดใช้ทุน
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-bold mb-4 text-amber-400">ลิงก์ด่วน</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'หน้าหลัก', path: '/public' },
                    { label: 'ขั้นตอนการยื่นขอทุน', path: '/public/apply-steps' },
                    { label: 'ประเภททุนรัฐบาล', path: '#' },
                    { label: 'ข่าวประชาสัมพันธ์', path: '#' },
                    { label: 'คำถามที่พบบ่อย', path: '#' },
                  ].map((link, i) => (
                    <li key={i}>
                      <Link to={link.path} className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1">
                        <ChevronUp className="w-3 h-3 rotate-90" />{link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-bold mb-4 text-amber-400">ติดต่อเรา</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>47/111 ถนนติวานนท์ ตำบลตลาดขวัญ อำเภอเมือง จังหวัดนนทบุรี 11000</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>02-547-1000</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>scholarship@ocsc.go.th</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>จันทร์-ศุกร์ 08:30-16:30 น.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                &copy; 2569 สำนักงาน ก.พ. สงวนลิขสิทธิ์ทุกประการ
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
                <a href="#" className="hover:text-white transition-colors">นโยบายคุกกี้</a>
                <a href="#" className="hover:text-white transition-colors">เงื่อนไขการใช้งาน</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              const main = document.getElementById('public-main');
              if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-shadow"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
