import { useState, useEffect } from "react";
import { ChevronLeft, MapPin, CheckCircle2, AlertTriangle, ShieldAlert, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "../../../components/ui/utils";

type SafetyStatus = "safe" | "affected" | "sos" | null;

export default function MobileSafetyCheckin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SafetyStatus>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for dynamic header
  useEffect(() => {
    const mainElement = document.querySelector('main');
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 20);
    };
    
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter','K2D',sans-serif] flex flex-col">
      {/* Dynamic Header */}
      <div className={cn(
        "bg-white px-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300",
        scrolled ? "pt-4 pb-3 shadow-md" : "pt-12 pb-4 shadow-sm"
      )}>
        <button onClick={() => navigate(-1)} className={cn(
          "flex items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all",
          scrolled ? "w-8 h-8" : "w-10 h-10"
        )}>
          <ChevronLeft size={scrolled ? 20 : 24} />
        </button>
        <h1 className={cn(
          "font-bold text-slate-800 transition-all",
          scrolled ? "text-[16px]" : "text-lg"
        )}>แจ้งสถานะความปลอดภัย</h1>
        <div className={cn("transition-all", scrolled ? "w-8 h-8" : "w-10 h-10")}></div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Map Section */}
        <div className="relative w-full h-[220px] bg-slate-200 shrink-0">
          {/* Simulated Google Map Background */}
          <img 
            src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg" 
            alt="Map Location" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Map Overlay and Pin */}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="relative animate-bounce">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white relative z-10">
                <MapPin size={24} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rotate-45 z-0"></div>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
               <MapPin size={16} />
             </div>
             <div>
               <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">พิกัดปัจจุบัน (ดึงอัตโนมัติ)</p>
               <p className="text-[13px] font-medium text-slate-800 leading-tight mt-0.5">Stanford University, 450 Serra Mall, CA 94305, USA</p>
             </div>
          </div>
        </div>

        <div className="px-5 pt-6 space-y-6 pb-6">
          {/* Status Selection */}
          <div className="space-y-3">
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              1. สถานะของคุณตอนนี้เป็นอย่างไร? <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid gap-3">
              <button 
                onClick={() => setStatus("safe")}
                className={cn(
                  "p-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                  status === "safe" 
                    ? "border-emerald-500 bg-emerald-50" 
                    : "border-slate-200 bg-white hover:border-emerald-200"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors", status === "safe" ? "bg-emerald-500 text-white" : "bg-slate-100 text-emerald-500")}>
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-left">
                  <p className={cn("font-bold text-[16px]", status === "safe" ? "text-emerald-700" : "text-slate-700")}>ปลอดภัย (Safe)</p>
                  <p className={cn("text-[12px] mt-0.5", status === "safe" ? "text-emerald-600" : "text-slate-500")}>ฉันอยู่ในพื้นที่ปลอดภัย และไม่ได้รับผลกระทบ</p>
                </div>
              </button>

              <button 
                onClick={() => setStatus("affected")}
                className={cn(
                  "p-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                  status === "affected" 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-slate-200 bg-white hover:border-orange-200"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors", status === "affected" ? "bg-orange-500 text-white" : "bg-slate-100 text-orange-500")}>
                  <AlertTriangle size={24} />
                </div>
                <div className="text-left">
                  <p className={cn("font-bold text-[16px]", status === "affected" ? "text-orange-700" : "text-slate-700")}>ได้รับผลกระทบ (Affected)</p>
                  <p className={cn("text-[12px] mt-0.5", status === "affected" ? "text-orange-600" : "text-slate-500")}>ปลอดภัย แต่ที่พักอาศัย/การเรียนได้รับผลกระทบ</p>
                </div>
              </button>

              <button 
                onClick={() => setStatus("sos")}
                className={cn(
                  "p-4 rounded-2xl border-2 flex items-center gap-4 transition-all",
                  status === "sos" 
                    ? "border-red-500 bg-red-50" 
                    : "border-slate-200 bg-white hover:border-red-200"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors", status === "sos" ? "bg-red-500 text-white" : "bg-slate-100 text-red-500")}>
                  <ShieldAlert size={24} />
                </div>
                <div className="text-left">
                  <p className={cn("font-bold text-[16px]", status === "sos" ? "text-red-700" : "text-slate-700")}>ต้องการความช่วยเหลือด่วน (SOS)</p>
                  <p className={cn("text-[12px] mt-0.5", status === "sos" ? "text-red-600" : "text-slate-500")}>บาดเจ็บ ติดค้าง หรือตกอยู่ในสถานการณ์อันตราย</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form Selection */}
          <div className="space-y-3">
            <h2 className="text-[15px] font-bold text-slate-800">2. ประเภทของเหตุการณ์ <span className="text-red-500">*</span></h2>
            <select className="w-full bg-white border border-slate-200 rounded-xl p-4 text-[14px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none">
              <option value="" disabled selected>เลือกประเภทภัยพิบัติ/เหตุฉุกเฉิน</option>
              <option value="earthquake">แผ่นดินไหว (Earthquake)</option>
              <option value="flood">น้ำท่วม/สึนามิ (Flood/Tsunami)</option>
              <option value="fire">ไฟไหม้/ไฟป่า (Fire/Wildfire)</option>
              <option value="riot">เหตุความไม่สงบ/จลาจล (Riot/Protest)</option>
              <option value="pandemic">โรคระบาด (Pandemic)</option>
              <option value="other">อื่นๆ (Other)</option>
            </select>
            <div className="pointer-events-none absolute right-9 mt-[18px] text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-[15px] font-bold text-slate-800">3. รายละเอียดเพิ่มเติม (ถ้ามี)</h2>
            <textarea 
              rows={3} 
              placeholder="เช่น ต้องการอาหาร ยารักษาโรค หรือแจ้งเบอร์ติดต่อฉุกเฉิน" 
              className="w-full border border-slate-200 rounded-xl p-4 text-[14px] bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all resize-none"
            ></textarea>
          </div>
        </div>

        {/* Spacer to push button down if content is short */}
        <div className="flex-1"></div>

        {/* Massive Submit Button at Bottom of flow */}
        <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-8 mb-4">
          <button 
            disabled={!status}
            onClick={() => {
              alert('ข้อมูลของคุณถูกส่งไปยัง สนร. เรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
              navigate('/mobile/scholar');
            }}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[16px] font-bold shadow-lg transition-all duration-300",
              !status 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                : status === "sos"
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 active:scale-[0.98]"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 active:scale-[0.98]"
            )}
          >
            <Send size={20} />
            {status === "sos" ? "ส่งสัญญาณขอความช่วยเหลือ (SOS)" : "บันทึกสถานะความปลอดภัย"}
          </button>
        </div>
      </div>
    </div>
  );
}
