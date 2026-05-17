import { Info, AlertTriangle, CheckCircle, MailOpen, Calendar, ChevronRight, BellRing } from "lucide-react";
import { Link } from "react-router";

export default function MobileInbox() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4fa0ff] via-[#dcedff] to-[#f4f9ff] font-['Inter','K2D',sans-serif]">
      {/* Top Header Floating Area */}
      <div className="pt-12 px-6 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4 opacity-90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-white/40 text-white relative">
              <BellRing size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#4fa0ff]"></span>
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight drop-shadow-sm">กล่องจดหมาย</h1>
              <p className="text-white/90 text-[13px] font-medium mt-0.5 drop-shadow-sm">ข้อความและคำแนะนำจาก สนร.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-600 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            2 ใหม่
          </span>
          <span className="text-xs font-medium text-white/80 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">ทั้งหมด 5 รายการ</span>
        </div>
      </div>

      <div className="px-3 pb-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white min-h-[500px] space-y-3">
        {/* Unread 1 - Action Required (Red) */}
        <Link to="#" className="block bg-white rounded-2xl border border-red-200 shadow-sm p-4 relative overflow-hidden hover:shadow-md transition-all group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600"></div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white shadow-sm"></div>
          
          <div className="flex gap-4">
            <div className="mt-1 w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle size={22} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">ด่วนมาก</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar size={10} /> 15/05/2026
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1.5 group-hover:text-red-600 transition-colors">แจ้งเตือน: กำหนดส่งรายงานความก้าวหน้า</h3>
              <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed">
                กรุณาส่งรายงานความก้าวหน้าการศึกษาประจำภาคเรียนที่ 2 ภายในวันที่ 31/05/2026 มายัง สนร. เพื่อเบิกจ่ายค่าใช้จ่ายงวดถัดไป
              </p>
              <div className="flex items-center text-red-600 text-[11px] font-semibold mt-1">
                อ่านเพิ่มเติม <ChevronRight size={14} className="ml-0.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Unread 2 - Info (Blue with Red dot) */}
        <Link to="#" className="block bg-white rounded-2xl border border-blue-200/60 shadow-sm p-4 relative overflow-hidden hover:shadow-md transition-all group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white shadow-sm"></div>
          
          <div className="flex gap-4">
            <div className="mt-1 w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Info size={22} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">ประกาศ</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar size={10} /> 17/05/2026
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">ข้อแนะนำการเลือกสังกัดเพื่อชดใช้ทุน</h3>
              <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed">
                สนร. ขอแจ้งกำหนดการและข้อปฏิบัติสำหรับการยื่นความประสงค์เลือกสังกัด 5 อันดับ กรุณาศึกษารายละเอียดก่อนดำเนินการ
              </p>
              <div className="flex items-center text-blue-600 text-[11px] font-semibold mt-1">
                อ่านเพิ่มเติม <ChevronRight size={14} className="ml-0.5" />
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 pt-3 pb-1">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">อ่านแล้ว</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        {/* Read - Success */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex gap-4">
            <div className="mt-1 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-700 text-sm leading-snug pr-2">อนุมัติ: เบิกค่าใช้จ่ายงวดที่ 1</h3>
                <MailOpen size={14} className="text-slate-300 shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
                สนร. ตรวจสอบเอกสารเบิกค่าใช้จ่ายของท่านเรียบร้อยแล้ว และได้แจ้งข้อมูลไปยัง ศกศ. และกองคลังเพื่อดำเนินการเบิกจ่ายต่อไป
              </p>
              <span className="text-[10px] text-slate-400 font-medium">15/05/2026</span>
            </div>
          </div>
        </div>

        {/* Read - Alert */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex gap-4">
            <div className="mt-1 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-700 text-sm leading-snug pr-2">แจ้งเตือน: ตรวจสอบสถานะวีซ่า</h3>
                <MailOpen size={14} className="text-slate-300 shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
                กรุณาอัปเดตหน้าวีซ่าของท่านในระบบ เนื่องจากวีซ่าเดิมจะหมดอายุในอีก 30 วัน
              </p>
              <span className="text-[10px] text-slate-400 font-medium">10/05/2026</span>
            </div>
          </div>
        </div>

        {/* Read - Success old */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 opacity-70 hover:opacity-100 transition-opacity mb-4">
          <div className="flex gap-4">
            <div className="mt-1 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-700 text-sm leading-snug pr-2">อนุมัติ: รายงานตัวไปศึกษา</h3>
                <MailOpen size={14} className="text-slate-300 shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
                สนร. ตรวจสอบเอกสารรายงานตัวเรียบร้อยแล้ว แจ้งข้อมูลไปยัง ศกศ. เรียบร้อย
              </p>
              <span className="text-[10px] text-slate-400 font-medium">03/09/2025</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
