import { ChevronRight, CheckCircle2, AlertCircle, Sparkles, BookOpen, GraduationCap, Bell } from "lucide-react";
import { Link } from "react-router";
import { CountryFlag } from "../../../components/ui/country-flag";

const AVATAR_URL = "/handsome_asian_student_avatar.png";
const LOGO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s";

export default function MobileHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4fa0ff] via-[#dcedff] to-[#f4f9ff] pb-6 font-['Inter','K2D',sans-serif]">
      {/* Top Header Floating Area */}
      <div className="pt-12 px-6 pb-6 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 opacity-90">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm overflow-hidden border border-white/40">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-white text-[11px] font-bold tracking-wide block leading-none">Scholarship Portal</span>
                <span className="text-white/80 text-[9px] font-medium tracking-wider block mt-1">บริการสำหรับนักเรียนทุนรัฐบาล</span>
              </div>
            </div>
            
            <Link to="/mobile/scholar/awards/AWD-001" className="block hover:opacity-80 transition-opacity">
              <h1 className="text-[28px] font-bold text-white mb-1 tracking-tight leading-tight drop-shadow-sm flex items-center gap-2">
                นายสมชาย ใจดี <ChevronRight size={20} className="text-white/60" />
              </h1>
              <p className="text-white/90 text-sm font-medium drop-shadow-sm">ทุนรัฐบาล (ก.พ.) · ระดับ ป.โท</p>
            </Link>
          </div>
          
          <div className="flex flex-col items-end gap-3 mt-1">
            <Link to="/mobile/scholar/profile" className="w-[52px] h-[52px] rounded-full border-2 border-white/60 overflow-hidden shadow-lg p-0.5 group bg-white/20 backdrop-blur-sm">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-200">
                <img src={AVATAR_URL} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </Link>
            <Link to="/mobile/scholar/inbox" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm relative">
              <Bell size={18} className="text-white" />
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 border-[#569aff]"></span>
            </Link>
          </div>
        </div>

        {/* Glassmorphic Grid Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/mobile/scholar/awards/AWD-001" className="bg-white/40 backdrop-blur-xl rounded-[24px] p-5 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/50 transition-colors">
            <div className="flex justify-center mb-2">
              <CountryFlag countryName="สหราชอาณาจักร" width="28px" height="20px" />
            </div>
            <p className="text-center text-[11px] text-slate-600 font-semibold uppercase tracking-wider mb-0.5">ประเทศ</p>
            <p className="text-center font-bold text-slate-800 text-[15px]">สหราชอาณาจักร</p>
          </Link>
          
          <Link to="/mobile/scholar/awards/AWD-001" className="bg-white/40 backdrop-blur-xl rounded-[24px] p-5 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center hover:bg-white/50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-white/50 flex items-center justify-center mb-2 text-blue-600">
              <GraduationCap size={16} />
            </div>
            <p className="text-center text-[11px] text-slate-600 font-semibold uppercase tracking-wider mb-0.5">สถานะ</p>
            <p className="text-center font-bold text-blue-700 text-[15px]">กำลังศึกษา</p>
          </Link>
        </div>

        {/* SOS Emergency Banner */}
        <Link to="/mobile/scholar/safety" className="mt-4 bg-white/40 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 flex items-center justify-between group hover:bg-white/50 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[14px] bg-red-50 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-105 group-hover:bg-red-100 transition-all shadow-sm border border-red-100/50">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-[14px] leading-tight">แจ้งสถานะความปลอดภัย (SOS)</p>
              <p className="text-slate-500 text-[11px] mt-0.5 font-medium">ในกรณีเกิดเหตุฉุกเฉิน/ภัยพิบัติ</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-white group-hover:text-red-500 transition-colors">
            <ChevronRight size={16} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Main Content Area (Solid White rounded container at bottom) */}
      <div className="px-3">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white min-h-[400px]">
          
          {/* Urgent To-Do */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">สิ่งที่ต้องดำเนินการ</h2>
              <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">1 รายการ</span>
            </div>
            
            <Link to="/mobile/scholar/forms" state={{ openForm: "PRE-06" }} className="block bg-slate-50/80 rounded-[20px] p-4 border border-slate-100 hover:bg-slate-100/80 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl">✈️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-[15px]">แบบรายงานตัวไปศึกษา</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">รายงานตัวพร้อมส่ง E-Ticket ให้ สนร.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white shadow-sm text-slate-400 flex items-center justify-center group-hover:text-blue-500 transition-colors duration-300 shrink-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* Upcoming To-Do */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">สิ่งที่จะต้องดำเนินการเร็วๆ นี้</h2>
            </div>
            
            <Link to="/mobile/scholar/awards/AWD-001" className="block bg-blue-50/50 rounded-[20px] p-4 border border-blue-100/60 hover:bg-blue-50 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 text-blue-500">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-blue-900 text-[15px]">รายงานผลการศึกษา ภาคเรียนที่ 1</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">ด่วน</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">ครบกำหนด 30 พ.ย. 2569</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white shadow-sm text-slate-400 flex items-center justify-center group-hover:text-blue-500 transition-colors duration-300 shrink-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Status */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">สถานะคำร้องล่าสุด</h2>
              <Link to="/mobile/scholar/tracking" className="text-[12px] font-bold text-blue-600">ดูทั้งหมด</Link>
            </div>
            
            <div className="divide-y divide-slate-200 flex flex-col">
              <Link to="/mobile/scholar/tracking/REQ-2026-0633" className="flex items-center gap-4 py-3.5 px-2 hover:bg-slate-50/50 transition-colors group rounded-xl">
                <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 truncate">ขออนุมัติเบิกค่าใช้จ่ายงวดที่ 1</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-emerald-600 font-semibold">อนุมัติเรียบร้อย</span>
                    <span className="text-[10px] text-slate-400">· 15/05/2026</span>
                  </div>
                </div>
              </Link>

              <Link to="/mobile/scholar/tracking/REQ-2026-0892" className="flex items-center gap-4 py-3.5 px-2 hover:bg-slate-50/50 transition-colors group rounded-xl">
                <div className="w-10 h-10 rounded-[14px] bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <ClockIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 truncate">ขอเปลี่ยนสาขาวิชาเรียน</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-amber-600 font-semibold">รอ ศกศ. พิจารณา</span>
                    <span className="text-[10px] text-slate-400">· 12/05/2026</span>
                  </div>
                </div>
              </Link>

              <Link to="/mobile/scholar/tracking/REQ-2026-1105" className="flex items-center gap-4 py-3.5 px-2 hover:bg-slate-50/50 transition-colors group rounded-xl">
                <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ClockIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 truncate">รายงานความก้าวหน้า ภาคเรียนที่ 2</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-blue-600 font-semibold">สนร. กำลังตรวจสอบ</span>
                    <span className="text-[10px] text-slate-400">· 01/05/2026</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
