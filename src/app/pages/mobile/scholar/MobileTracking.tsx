import { CheckCircle2, Search, ChevronRight, FileText, ArrowUpRight, Activity } from "lucide-react";
import { Link } from "react-router";

export default function MobileTracking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4fa0ff] via-[#dcedff] to-[#f4f9ff] font-['Inter','K2D',sans-serif]">
      {/* Top Header Floating Area */}
      <div className="pt-12 px-6 pb-6 relative z-10">
        <div className="flex items-center gap-3 mb-6 opacity-90">
          <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-white/40 text-white">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight drop-shadow-sm">ติดตามคำร้อง</h1>
            <p className="text-white/90 text-[13px] font-medium mt-0.5 drop-shadow-sm">ตรวจสอบสถานะความคืบหน้าของท่าน</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-blue-500/60" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-white/60 rounded-full bg-white/50 backdrop-blur-xl placeholder-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/80 text-sm transition-all text-blue-900 font-medium"
            placeholder="ค้นหาจากเลขที่คำร้อง..."
          />
        </div>
      </div>

      <div className="px-3 pb-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white min-h-[500px] space-y-4">
        {/* Item 1: In Progress */}
        <Link to="/mobile/scholar/tracking/REQ-2026-0892" className="block bg-white border border-slate-200/80 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-all group relative">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500"></div>
          <div className="px-5 pt-5 pb-4 flex justify-between items-start border-b border-slate-50">
            <div className="flex-1 pr-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 mb-2.5 uppercase tracking-wide">
                กำลังดำเนินการ
              </span>
              <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-amber-600 transition-colors leading-snug">ขอเปลี่ยนสาขาวิชาเรียน</h3>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-slate-500">
                <span className="text-slate-400"><FileText size={12} className="inline mr-1" />REQ-2026-0892</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ยื่นเมื่อ 10/05/2026</span>
              </div>
            </div>
            <div className="mt-1 w-9 h-9 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200 transition-all shrink-0">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 pb-5 pt-4 bg-slate-50/50">
            <div className="relative pl-6 border-l-[3px] border-slate-200 space-y-6 ml-2.5">
              {/* Step 3 - Pending */}
              <div className="relative">
                <div className="absolute -left-[27.5px] top-0.5 w-4 h-4 rounded-full bg-slate-200 border-[3px] border-white shadow-sm"></div>
                <p className="text-[13px] font-bold text-slate-400">ศกศ. พิจารณาอนุมัติ</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">รอขั้นตอนก่อนหน้า</p>
              </div>
              {/* Step 2 - Current */}
              <div className="relative">
                <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-amber-100 border-[3px] border-white flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
                <p className="text-[13px] font-bold text-amber-600">สนร. ส่งต่อเรื่องให้ ศกศ.</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">สนร. ตรวจสอบเบื้องต้นและส่งต่อ · 12/05/2026</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Item 2: In Progress (SNR Reviewing) */}
        <Link to="/mobile/scholar/tracking/REQ-2026-1105" className="block bg-white border border-slate-200/80 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-md transition-all group relative">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
          <div className="px-5 pt-5 pb-4 flex justify-between items-start border-b border-slate-50">
            <div className="flex-1 pr-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 mb-2.5 uppercase tracking-wide">
                สนร. กำลังตรวจสอบ
              </span>
              <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-blue-600 transition-colors leading-snug">รายงานความก้าวหน้า ภาคเรียนที่ 2</h3>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-slate-500">
                <span className="text-slate-400"><FileText size={12} className="inline mr-1" />REQ-2026-1105</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ยื่นเมื่อ 01/05/2026</span>
              </div>
            </div>
            <div className="mt-1 w-9 h-9 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shrink-0">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
          <div className="px-5 pb-5 pt-4 bg-slate-50/50">
            <div className="relative pl-6 border-l-[3px] border-slate-200 space-y-6 ml-2.5">
              <div className="relative">
                <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-blue-100 border-[3px] border-white flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                </div>
                <p className="text-[13px] font-bold text-blue-700">สนร. กำลังตรวจรายงาน</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">อยู่ระหว่างการตรวจสอบ · 02/05/2026</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27.5px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-[3px] border-white shadow-sm"></div>
                <p className="text-[13px] font-bold text-slate-600">ยื่นรายงานเข้าระบบ</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">นักเรียนทุนส่งรายงาน · 01/05/2026</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Item 3: Completed */}
        <Link to="/mobile/scholar/tracking/REQ-2026-0633" className="block bg-white border border-emerald-100 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-md transition-all group relative opacity-90 hover:opacity-100">
          <div className="px-5 pt-5 pb-4 flex justify-between items-start border-b border-emerald-50">
            <div className="flex-1 pr-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2.5 uppercase tracking-wide">
                เสร็จสิ้น
              </span>
              <h3 className="font-bold text-slate-800 text-[15px] group-hover:text-emerald-600 transition-colors leading-snug">ขออนุมัติเบิกค่าใช้จ่ายงวดที่ 1</h3>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-slate-500">
                <span className="text-slate-400"><FileText size={12} className="inline mr-1" />REQ-2026-0633</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ยื่นเมื่อ 12/04/2026</span>
              </div>
            </div>
            <div className="mt-1 w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center transition-all shrink-0">
              <ChevronRight size={18} />
            </div>
          </div>
          <div className="px-5 pb-5 pt-4 bg-emerald-50/30">
            <div className="relative pl-6 border-l-[3px] border-emerald-100 space-y-6 ml-2.5">
              <div className="relative">
                <div className="absolute -left-[29px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <p className="text-[13px] font-bold text-slate-800">สนร. อนุมัติเรียบร้อย</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">ตรวจสอบเอกสารครบถ้วน · 15/04/2026</p>
              </div>
            </div>
          </div>
        </Link>
        </div>
      </div>
    </div>
  );
}
