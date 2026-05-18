import { useState, useEffect } from "react";
import { ChevronLeft, Share2, Calendar, FileText, Download, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "../../../components/ui/utils";

export default function MobileNewsDetail() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for dynamic header
  useEffect(() => {
    const mainElement = document.querySelector('main');
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 50);
    };
    
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Inter','K2D',sans-serif] flex flex-col relative pb-10">
      {/* Header Image (Parallax-ish background) */}
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800')] mix-blend-overlay opacity-30 object-cover w-full h-full"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
      </div>

      {/* Dynamic Header */}
      <div className={cn(
        "px-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300",
        scrolled ? "pt-12 pb-3 bg-white shadow-sm border-b border-slate-100" : "pt-12 pb-4 bg-transparent"
      )}>
        <button onClick={() => navigate(-1)} className={cn(
          "flex items-center justify-center rounded-full transition-all",
          scrolled ? "w-10 h-10 bg-slate-100 text-slate-700" : "w-10 h-10 bg-black/20 backdrop-blur-md text-white border border-white/20"
        )}>
          <ChevronLeft size={24} />
        </button>
        
        <h1 className={cn(
          "font-bold transition-all truncate px-4",
          scrolled ? "text-slate-800 text-[16px] opacity-100" : "text-white text-lg opacity-0"
        )}>
          ประกาศ สนร.
        </h1>
        
        <button className={cn(
          "flex items-center justify-center rounded-full transition-all",
          scrolled ? "w-10 h-10 bg-slate-100 text-slate-700" : "w-10 h-10 bg-black/20 backdrop-blur-md text-white border border-white/20"
        )}>
          <Share2 size={18} />
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-5 pt-12 flex-1">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
            ประกาศสำคัญ
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
            การเงิน/เบิกจ่าย
          </span>
        </div>

        {/* Title & Meta */}
        <h1 className="text-[22px] font-bold text-slate-900 leading-tight mb-4">
          ระเบียบการเบิกจ่ายเงินทุนและค่าใช้จ่ายที่เกี่ยวข้อง ฉบับปรับปรุงใหม่ ปี 2569
        </h1>
        
        <div className="flex items-center gap-4 text-slate-500 mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-1.5 text-[13px] font-medium">
            <Calendar size={14} className="text-blue-500" />
            18 พ.ค. 2569
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-medium">
            <div className="w-4 h-4 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzzlznCNplmnHso-nCCJ9P6iGRJMDTdSeiw&s" alt="OEA Logo" className="w-full h-full object-cover" />
            </div>
            สนร. ลอนดอน
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-sm prose-slate max-w-none mb-10">
          <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
            สำนักงานผู้ดูแลนักเรียนในต่างประเทศ (สนร.) ขอแจ้งการปรับปรุงระเบียบการเบิกจ่ายเงินทุนการศึกษาและค่าใช้จ่ายอื่นๆ ที่เกี่ยวข้อง เพื่อให้สอดคล้องกับสภาวะเศรษฐกิจในปัจจุบัน และเพิ่มความสะดวกรวดเร็วในการพิจารณาอนุมัติคำร้อง
          </p>
          
          <h3 className="text-[16px] font-bold text-slate-800 mt-6 mb-3">สาระสำคัญที่มีการเปลี่ยนแปลง:</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[14px] text-slate-700 leading-normal">
                <strong>การเบิกจ่ายค่าอุปกรณ์การศึกษา:</strong> ปรับเพิ่มวงเงินสูงสุดเป็น 2,000 ปอนด์ต่อปีการศึกษา
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[14px] text-slate-700 leading-normal">
                <strong>ระยะเวลาพิจารณาคำร้อง:</strong> ลดระยะเวลาตรวจสอบเอกสารการเบิกจ่ายจาก 15 วันทำการ เหลือเพียง 7 วันทำการ (หากเอกสารครบถ้วน)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[14px] text-slate-700 leading-normal">
                <strong>ใบเสร็จรับเงิน:</strong> สามารถใช้เอกสารอิเล็กทรอนิกส์ (e-Receipt) ในการตั้งเบิกได้ทุกกรณี โดยไม่ต้องส่งเอกสารตัวจริงทางไปรษณีย์
              </span>
            </li>
          </ul>

          <p className="text-[15px] leading-relaxed text-slate-700 mb-4">
            ทั้งนี้ ระเบียบฉบับใหม่จะมีผลบังคับใช้ตั้งแต่วันที่ <strong>1 มิถุนายน 2569</strong> เป็นต้นไป สำหรับคำร้องที่ยื่นก่อนหน้านี้ จะยังคงได้รับการพิจารณาตามระเบียบฉบับเดิม
          </p>
          
          <p className="text-[15px] leading-relaxed text-slate-700">
            นักเรียนทุนสามารถดาวน์โหลดเอกสารประกาศฉบับเต็ม และคู่มือการเบิกจ่ายแบบใหม่ได้จากลิงก์ด้านล่าง หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อฝ่ายการเงิน สนร. ได้ตามช่องทางปกติ
          </p>
        </div>

        {/* Attachments Section */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            เอกสารแนบ (Attachments)
          </h3>
          
          <div className="space-y-3">
            <a href="#" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                </div>
                <div className="truncate pr-4">
                  <p className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600 truncate transition-colors">ประกาศระเบียบการเบิกจ่าย_2569.pdf</p>
                  <p className="text-[11px] text-slate-400">1.2 MB</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Download size={14} />
              </div>
            </a>
            
            <a href="#" className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                </div>
                <div className="truncate pr-4">
                  <p className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600 truncate transition-colors">คู่มือการตั้งเบิก_ผ่านแอป.pdf</p>
                  <p className="text-[11px] text-slate-400">3.5 MB</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Download size={14} />
              </div>
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
}
