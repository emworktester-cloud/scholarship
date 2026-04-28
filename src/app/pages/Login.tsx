import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cn } from '../components/ui/utils';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Left Side - Institutional Premium Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[55%] relative bg-[#0f172a] items-center justify-center p-12 overflow-hidden"
      >
        {/* Subtle Institutional Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#1e3a8a]/80 to-[#0f172a]/90"></div>

        <div className="relative z-10 w-full max-w-[800px] flex flex-col justify-center h-full">
          {/* Logo & Identity */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-10 p-4 border border-white/10 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-[#d4af37] to-transparent rounded-2xl opacity-50"></div>
              <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center p-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s"
                  alt="Government Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight font-k2d">
              ระบบบริหารจัดการ
              <span className="text-[#d4af37]">ทุนรัฐบาล</span>
            </h1>
            <p className="text-blue-100 text-lg lg:text-xl mb-12 font-light border-l-2 border-[#d4af37] pl-4 font-k2d opacity-90">
              Government Scholarship Management System
            </p>

            {/* Core Features */}
            <div className="space-y-8">
              {[
                { icon: FileText, title: 'ยกระดับการจัดการใบสมัคร', desc: 'บริหารจัดการเอกสารในรูปแบบดิจิทัลเต็มรูปแบบ มั่นคง ปลอดภัย' },
                { icon: CheckCircle2, title: 'ติดตามสถานะเรียลไทม์', desc: 'ระบบตรวจสอบผลการพิจารณาที่มีความแม่นยำและโปร่งใส' },
                { icon: ShieldCheck, title: 'มาตรฐานความปลอดภัยระดับสูง', desc: 'ปกป้องข้อมูลส่วนบุคคลตามมาตรฐานความปลอดภัยทางไซเบอร์ของภาครัฐ' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg backdrop-blur-sm">
                    <item.icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-white font-semibold text-lg font-k2d">{item.title}</h3>
                    <p className="text-blue-200 text-sm mt-1 leading-relaxed font-k2d">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Redesigned Clean Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle decorative elements for the right side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-blue-900/5 rounded-[2rem] border border-white"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 p-3 border border-gray-100 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-[#d4af37]/50 to-transparent rounded-2xl opacity-50"></div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s"
                alt="Government Logo"
                className="relative z-10 w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight font-k2d">GSMS</h2>
            <p className="text-sm text-slate-500 mt-1 font-k2d">ระบบบริหารจัดการทุนรัฐบาล</p>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-[27px] lg:text-[33px] font-bold text-[#0f172a] tracking-tight font-k2d">เข้าสู่ระบบ</h2>
            <p className="text-slate-500 mt-3 text-sm font-k2d leading-relaxed">กรุณากรอกข้อมูลสำหรับลงชื่อเข้าใช้งานระบบ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 font-k2d">
                อีเมล (Email Address)
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-white/50 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#1e3a8a]/20 focus-visible:border-[#1e3a8a] rounded-2xl transition-all font-k2d text-base"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 font-k2d">
                  รหัสผ่าน (Password)
                </Label>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#1e3a8a] hover:text-[#d4af37] transition-colors font-k2d"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1e3a8a] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 bg-white/50 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#1e3a8a]/20 focus-visible:border-[#1e3a8a] rounded-2xl transition-all font-k2d text-base tracking-widest placeholder:tracking-normal"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-k2d"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-4 bg-[#1e3a8a] hover:bg-[#0f172a] text-white rounded-2xl shadow-xl shadow-[#1e3a8a]/20 transition-all flex items-center justify-center gap-2 group text-lg font-medium font-k2d"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100/60 text-center">
            <p className="text-sm text-slate-400 font-k2d">
              © {new Date().getFullYear()} Government Scholarship Management System.<br />All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}