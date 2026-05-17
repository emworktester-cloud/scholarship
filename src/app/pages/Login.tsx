import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, FileText, CheckCircle2, ArrowRight, UserCog, User, Shield, GraduationCap, Fingerprint, Globe, Award, BookOpen } from 'lucide-react';



/* ─── animated particle ─── */
function Particle({ size, x, y, delay, duration }: { size: number; x: string; y: string; delay: number; duration: number }) {
    return (
        <div
            className="absolute rounded-full bg-white/10 pointer-events-none"
            style={{
                width: size,
                height: size,
                left: x,
                top: y,
                animation: `particleDrift ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
        />
    );
}
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cn } from '../components/ui/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Allow any username/password for demo purposes
    // Just open the role selection dialog
    setIsRoleDialogOpen(true);
  };

  const handleRoleSelect = async (role: string) => {
    setIsRoleDialogOpen(false);
    setIsLoading(true);

    try {
      await login(email, password, role);
      navigate('/');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <style>{`

          @keyframes particleDrift {
              0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
              50% { opacity: 0.25; }
              100% { transform: translate(30px, -40px) scale(1.5); opacity: 0.05; }
          }
          @keyframes shimmer {
              0% { transform: translateX(-100%) rotate(15deg); }
              100% { transform: translateX(200%) rotate(15deg); }
          }
          @keyframes waveMove {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(-25px) translateY(-10px); }
              100% { transform: translateX(0) translateY(0); }
          }
          @keyframes pulseGlow {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.1); }
          }
          @keyframes orbitSlow {
              0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
          }
          @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
          }
          .login-left-panel {
              background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 25%, #172554 50%, #1e3a8a 75%, #0f172a 100%);
              background-size: 200% 200%;
              animation: gradientShift 15s ease infinite;
          }
      `}</style>

      {/* Left Side - Institutional Premium Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-12 overflow-hidden login-left-panel"
      >
        {/* Subtle Institutional Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        {/* Radial glow spots */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.5) 0%, transparent 70%)', animation: 'pulseGlow 6s ease-in-out infinite' }} />
        <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', animation: 'pulseGlow 8s ease-in-out 2s infinite' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.3) 0%, transparent 70%)', animation: 'pulseGlow 10s ease-in-out 4s infinite' }} />

        {/* Wave shapes */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 320" style={{ animation: 'waveMove 8s ease-in-out infinite' }}>
            <path fill="rgba(255,255,255,0.03)" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 320" style={{ animation: 'waveMove 12s ease-in-out 2s infinite' }}>
            <path fill="rgba(255,255,255,0.02)" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>

        {/* Shimmer streak */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-[200px] h-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', animation: 'shimmer 8s ease-in-out infinite' }} />
        </div>



        {/* Orbiting element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div style={{ animation: 'orbitSlow 30s linear infinite' }}>
                <div className="w-3 h-3 rounded-full bg-white/10 blur-[1px]" />
            </div>
        </div>

        {/* Particles */}
        <Particle size={4} x="10%" y="20%" delay={0} duration={7} />
        <Particle size={6} x="30%" y="60%" delay={1} duration={9} />
        <Particle size={3} x="70%" y="30%" delay={2} duration={6} />
        <Particle size={5} x="50%" y="80%" delay={3} duration={8} />
        <Particle size={4} x="85%" y="45%" delay={1.5} duration={10} />
        <Particle size={3} x="20%" y="75%" delay={4} duration={7} />
        <Particle size={5} x="60%" y="15%" delay={2.5} duration={9} />
        <Particle size={4} x="40%" y="40%" delay={0.5} duration={11} />

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
                { icon: FileText, title: 'จัดการข้อมูลนักเรียนทุนแบบเบ็ดเสร็จ ณ จุดเดียว', desc: 'ยกระดับการจัดเก็บข้อมูลนักเรียนทุนดิจิทัลแบบครบวงจร' },
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
        {/* Removed decorative blobs for a cleaner look */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-blue-900/5 rounded-[2rem] border border-white"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 p-3 border border-gray-100 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-[#d4af37]/50 to-transparent rounded-2xl opacity-50"></div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s"
                alt="Government Logo"
                className="relative z-10 w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-normal font-k2d">GSMS</h2>
            <p className="text-sm text-slate-500 mt-2 font-k2d leading-normal">ระบบบริหารจัดการทุนรัฐบาล</p>
            <p className="text-[13px] text-slate-400 mt-4 font-k2d leading-relaxed max-w-[260px]">
              กรุณากรอก Username และ Password<br/>เพื่อเข้าใช้งานระบบ
            </p>
          </div>

          <div className="hidden lg:block mb-10 text-center">
            <h2 className="text-[28px] lg:text-[33px] font-bold text-[#0f172a] font-k2d leading-normal">เข้าสู่ระบบ</h2>
            <p className="text-slate-500 mt-4 text-sm font-k2d leading-normal">กรุณากรอกข้อมูลสำหรับลงชื่อเข้าใช้งานระบบ</p>
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

          <div className="mt-8 flex items-center justify-center">
            <div className="w-full h-px bg-slate-200"></div>
            <span className="px-4 text-sm text-slate-500 font-k2d whitespace-nowrap">หรือเข้าสู่ระบบด้วย</span>
            <div className="w-full h-px bg-slate-200"></div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-2xl transition-all flex items-center justify-center gap-2 font-k2d font-medium shadow-sm"
              onClick={() => setIsRoleDialogOpen(true)}
            >
              <img src="/thaid-logo.png" alt="ThaID Logo" className="w-6 h-6 object-cover rounded-full" />
              ThaID
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-2xl transition-all flex items-center justify-center gap-2 font-k2d font-medium shadow-sm"
              onClick={() => setIsRoleDialogOpen(true)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-5 h-5" />
              Microsoft Login
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100/60 text-center">
            <p className="text-sm text-slate-400 font-k2d">
              © {new Date().getFullYear()} Government Scholarship Management System.<br />All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Role Selection Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-k2d text-center text-slate-900">
              เลือกบทบาทการเข้าใช้งาน
            </DialogTitle>
            <DialogDescription className="text-center font-k2d">
              เพื่อความสะดวกในการทดสอบระบบ กรุณาเลือก Role ที่ต้องการ
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              variant="outline"
              className="h-14 justify-start px-6 hover:bg-blue-50 hover:text-[#1e3a8a] hover:border-[#1e3a8a]/30 transition-all font-k2d"
              onClick={() => handleRoleSelect('staff')}
            >
              <User className="w-5 h-5 mr-3 text-slate-500" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">เจ้าหน้าที่ (Staff)</span>
                <span className="text-xs text-slate-500">สำหรับงานธุรการและรับเรื่อง</span>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-14 justify-start px-6 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all font-k2d"
              onClick={() => handleRoleSelect('approver')}
            >
              <ShieldCheck className="w-5 h-5 mr-3 text-slate-500" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">ผู้อนุมัติ (Approver)</span>
                <span className="text-xs text-slate-500">พิจารณาและอนุมัติคำร้องต่างๆ</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-14 justify-start px-6 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all font-k2d"
              onClick={() => handleRoleSelect('executive')}
            >
              <UserCog className="w-5 h-5 mr-3 text-slate-500" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">ผู้บริหาร (Executive)</span>
                <span className="text-xs text-slate-500">ดูภาพรวมและ Dashboard</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-14 justify-start px-6 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all font-k2d"
              onClick={() => handleRoleSelect('scholar')}
            >
              <GraduationCap className="w-5 h-5 mr-3 text-slate-500" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">นักเรียนทุน (Scholar)</span>
                <span className="text-xs text-slate-500">ผู้รับทุน ส่งคำร้อง e-Form</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}