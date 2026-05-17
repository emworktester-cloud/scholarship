import { Mail, Phone, MapPin, Briefcase, GraduationCap, LogOut, Calendar, Globe, Edit3, ChevronRight } from "lucide-react";
import { CountryFlag } from "../../../components/ui/country-flag";
import { Link } from "react-router";

const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s";
const AVATAR_URL = "/handsome_asian_student_avatar.png";

export default function MobileProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4fa0ff] via-[#dcedff] to-[#f4f9ff] font-['Inter','K2D',sans-serif] pb-6">
      {/* Profile Header Floating Area */}
      <div className="pt-12 px-6 pb-6 relative z-10">
        
        {/* Top Actions removed as requested */}

        <div className="relative text-left mt-2">
          <div className="flex items-center gap-4">
            <div className="w-[84px] h-[84px] rounded-[24px] bg-white/20 border-2 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden relative group shrink-0 backdrop-blur-md p-1">
              <img src={AVATAR_URL} alt="Avatar" className="w-full h-full object-cover rounded-[18px] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-white tracking-tight leading-tight drop-shadow-sm">นายสมชาย ใจดี</h1>
              <p className="text-white/80 text-[13px] font-medium mt-0.5 drop-shadow-sm">Somchai Jaidee</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/40 backdrop-blur-md shadow-sm">
                  SCH-2023-001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 space-y-4 relative z-10 pb-8">
        {/* Scholarship List */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 py-4 bg-white/40 border-b border-blue-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ประวัติรับทุน</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {/* Active Scholarship */}
            <Link to="/mobile/scholar/awards/AWD-001" className="block p-5 hover:bg-slate-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h2 className="text-[14px] font-bold text-slate-800 leading-tight">ทุนรัฐบาล (ก.พ.) พัฒนา</h2>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> กำลังศึกษา (AWD-001)
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>

            {/* Completed Scholarship */}
            <Link to="/mobile/scholar/awards/AWD-002" className="block p-5 hover:bg-slate-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[14px] font-bold text-slate-800 leading-tight">ทุน ก.พ. (ระดับ ป.ตรี)</h2>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 mb-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ชดใช้ทุน (AWD-002)
                    </p>
                    {/* Repayment Progress inside Card */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex justify-between items-end mb-1.5">
                        <p className="text-[10px] text-slate-500">ชดใช้แล้ว <span className="font-bold text-slate-700">2 ปี 3 เดือน</span></p>
                        <p className="text-[10px] text-slate-500">เหลือ <span className="font-bold text-emerald-600">5 ปี 9 เดือน</span></p>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors shrink-0">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Info (Glassmorphic) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 py-4 bg-white/40 border-b border-blue-50/50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ข้อมูลติดต่อ</h2>
            <button className="flex items-center gap-1 text-blue-600 text-[11px] font-bold"><Edit3 size={12} />แก้ไข</button>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">อีเมล</p>
                <p className="text-sm text-slate-800 font-medium">somchai.j@example.com</p>
              </div>
            </div>
            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">เบอร์โทรศัพท์ (UK)</p>
                <p className="text-sm text-slate-800 font-medium">+44 7700 900077</p>
              </div>
            </div>
            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">ที่อยู่ในต่างประเทศ</p>
                <p className="text-sm text-slate-800 font-medium line-clamp-2">10 Downing Street, London, UK, SW1A 2AA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship Info (Glassmorphic) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 py-4 bg-white/40 border-b border-blue-50/50">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ทุนการศึกษา</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {/* Active Award */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-snug">ทุนรัฐบาล (ก.พ.) ป.โท</p>
                    <p className="text-xs text-slate-500 mt-1">University of Oxford</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  กำลังใช้งาน
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-medium">ประเทศ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CountryFlag countryName="สหราชอาณาจักร" width="16px" height="12px" />
                    <p className="text-[13px] font-semibold text-slate-700">สหราชอาณาจักร</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-medium">เริ่มเรียน</span>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-700">01/09/2025</p>
                </div>
              </div>
            </div>

            {/* Completed Award */}
            <div className="p-5 opacity-60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 leading-snug">ทุนเล่าเรียนหลวง ป.ตรี</p>
                    <p className="text-xs text-slate-500 mt-1">University of Cambridge</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  สำเร็จ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SNR Info (Glassmorphic) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-5 py-4 bg-white/40 border-b border-blue-50/50">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">สนร. ที่ดูแล</h2>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden shrink-0 p-1">
              <img src={LOGO_URL} alt="GSMS Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-800">สนร. ลอนดอน</p>
              <p className="text-xs text-slate-500 mt-1">สำนักงานผู้ดูแลนักเรียนในสหราชอาณาจักร</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button className="w-full flex items-center justify-center gap-2 bg-white/50 backdrop-blur-xl hover:bg-red-50 text-red-500 font-bold py-4 rounded-[24px] transition-all shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white active:scale-[0.98]">
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
