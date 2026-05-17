import { useState, useEffect } from "react";
import { Plane, GraduationCap, Briefcase, ChevronRight, X, Upload, BookOpen, FileCheck, CalendarClock, Building, ScrollText, CreditCard, ArrowLeftRight, Shield, FilePlus, FileSearch } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useLocation } from "react-router";

type FormCategory = "pre" | "dur" | "pst";

interface FormItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  category: FormCategory;
}

const FORMS: FormItem[] = [
  // === ระยะก่อนเดินทางไปศึกษา (PRE) ===
  { id: "PRE-01", title: "ขอหนังสือนำตรวจสุขภาพทางร่างกายและสุขภาพทางจิตวิทยา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-02", title: "ขอหนังสือรับรองการเป็นนักเรียนทุน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-03", title: "ขอหนังสือรับรองทางการเงิน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-04", title: "ขอหนังสือรับรองเพื่อประกอบการขอวีซ่า", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-05", title: "ขอหนังสืออนุมัติตัวบุคคล", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-06", title: "ขอรายงานตัวไปศึกษา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-07", title: "การเรียนภาษาท้องถิ่นของนักเรียนทุนที่ไปศึกษาระดับปริญญา ณ ประเทศที่ไม่ใช้ภาษาอังกฤษเป็นภาษาราชการ", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-08", title: "การเรียนภาษาอังกฤษ (เชิงวิชาการ) ควบคู่กับการเรียนตามหลักสูตรระดับปริญญาที่ใช้ภาษาอังกฤษ (สำหรับทุนระดับปริญญาโทขึ้นไป)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-09", title: "ขอเบิกค่าใช้จ่ายก่อนเดินทาง", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-10", title: "ขอให้จัดซื้อตั๋วโดยสารเครื่องบิน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-11", title: "ขอเบิกค่าตั๋วโดยสารเครื่องบิน (กรณีซื้อตั๋วเครื่องบินเอง)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },
  { id: "PRE-12", title: "ขอให้ชำระค่าใช้จ่ายก่อนได้รับวีซ่า", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pre" },

  // === ระยะระหว่างศึกษาในต่างประเทศ (DUR) ===
  { id: "DUR-01", title: "ขอหนังสือรับรองทางการเงิน (F/S)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-02", title: "ขอหนังสือรับรองเพื่อประกอบการขอวีซ่า", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-03", title: "ขอหนังสือรับรองเพื่อประกอบการขอ Re-entry วีซ่า", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-04", title: "ขอรายงานตัวกลับประเทศไทย", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-05", title: "กิจกรรมการพัฒนาเสริมสร้างประสบการณ์ (รวมการฝึกงาน การเดินทางไปศึกษาโครงการแลกเปลี่ยน การเรียนภาษา)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-06", title: "ขอลงทะเบียนเรียนภาคฤดูร้อน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-07", title: "ขออนุมัติไปร่วมประชุมหรือสัมมนาทางวิชาการ", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-08", title: "ขอศึกษาต่อในระดับที่สูงขึ้น ตามโครงการที่ราชการกำหนด", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-09", title: "ขอศึกษาต่อในระดับที่สูงขึ้น นอกเหนือโครงการที่ราชการกำหนด (แหล่งทุนอื่น)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-10", title: "การเรียนภาษาท้องถิ่นของนักเรียนทุนที่ไปศึกษาระดับปริญญา ณ ประเทศที่ไม่ใช้ภาษาอังกฤษเป็นภาษาราชการ", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-11", title: "การเรียนภาษาอังกฤษ (เชิงวิชาการ) ควบคู่กับการเรียนตามหลักสูตรระดับปริญญาที่ใช้ภาษาอังกฤษ (สำหรับทุนระดับปริญญาโทขึ้นไป)", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-12", title: "การพิจารณาหลักสูตรกรณีศึกษาต่อสูงขึ้น และหลักสูตรไม่ตรงตามประกาศทุน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-13", title: "ขอสอบแก้ตัว", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-14", title: "การพักการศึกษาชั่วคราว", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-15", title: "การพักการศึกษาชั่วคราว เกิน 1 ปี", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-16", title: "การยุติการศึกษาในต่างประเทศ", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-17", title: "ขอเก็บข้อมูลเพื่อประกอบการทำวิทยานิพนธ์นอกประเทศที่ศึกษา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-18", title: "การกลับมาเยี่ยมบ้านชั่วคราว", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-19", title: "การขอไปทัศนศึกษานอกประเทศที่ศึกษาโดยไม่กลับประเทศไทย", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-20", title: "การย้ายสถานศึกษา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-21", title: "การขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา กรณีทุน ก.พ.", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-22", title: "การขอเปลี่ยนแนวการศึกษาหรือวิชาที่ศึกษา กรณีแหล่งทุนอื่น", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-23", title: "การขอย้ายประเทศศึกษา กรณีทุน ก.พ.", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-24", title: "การขอย้ายประเทศศึกษา กรณีแหล่งทุนอื่น", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-25", title: "ของดรับทุนรัฐบาลบางส่วน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-26", title: "ของดรับทุนรัฐบาลทั้งจำนวน", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-27", title: "การขอลาออกจากการเป็นนักเรียนทุนของรัฐบาล", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-28", title: "การขยายระยะเวลาศึกษาด้วยทุนรัฐบาลตามหลักเกณฑ์", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-29", title: "การขยายระยะเวลาศึกษาด้วยทุนส่วนตัว", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-30", title: "การขยายระยะเวลาศึกษาด้วยทุนส่วนตัวเกิน 2 ปี", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },
  { id: "DUR-31", title: "แบบรายงานผลการศึกษา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "dur" },

  // === ระยะสำเร็จการศึกษา (PST) ===
  { id: "PST-01", title: "ขอรายงานตัวกลับประเทศไทย", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-02", title: "ขอสำเร็จ/เสร็จสิ้นการศึกษา", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-03", title: "ขอฝึกอบรมวิจัยหลังสำเร็จการศึกษาระดับปริญญาเอก (Post-Doctoral) กรณีทุน ก.พ.", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-04", title: "ขอฝึกอบรมวิจัยหลังสำเร็จการศึกษาระดับปริญญาเอก (Post-Doctoral) กรณีแหล่งทุนอื่น", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-05", title: "ขออนุมัติฝึกงานหลังสำเร็จการศึกษา กรณีทุน ก.พ.", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-06", title: "ขออนุมัติฝึกงานหลังสำเร็จการศึกษา กรณีแหล่งทุนอื่น", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-07", title: "ขอผ่อนผันอยู่ในต่างประเทศเพื่อศึกษา หรือฝึกงานตามข้อกำหนดของหลักสูตรเพื่อสอบใบประกอบวิชาชีพ (Board) หรือฝึกงานหรือทำงานต่อด้วยทุนส่วนตัวหลังสำเร็จการศึกษาระดับปริญญาตรีด้วยทุนเล่าเรียนหลวง", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
  { id: "PST-08", title: "การขออนุมัติศึกษาต่อสูงขึ้นด้วยทุนรัฐบาลหลังสำเร็จการศึกษาระดับปริญญาตรีด้วยทุนเล่าเรียนหลวง", subtitle: "ยื่นให้ สนร.", icon: <FilePlus size={20} />, category: "pst" },
];

const CATEGORY_CONFIG = {
  pre: { id: "pre", label: "ก่อนเดินทาง", subLabel: "Pre-Departure", color: "from-amber-400 to-orange-500", icon: <Plane size={16} /> },
  dur: { id: "dur", label: "ระหว่างศึกษา", subLabel: "During Study", color: "from-blue-500 to-indigo-600", icon: <BookOpen size={16} /> },
  pst: { id: "pst", label: "จบการศึกษา", subLabel: "Post-Graduation", color: "from-emerald-500 to-teal-600", icon: <GraduationCap size={16} /> },
};

export default function MobileForms() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<FormCategory>("dur");
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);

  // Auto-open form if passed via router state
  useEffect(() => {
    if (location.state?.openForm) {
      const form = FORMS.find(f => f.id === location.state.openForm);
      if (form) {
        setActiveTab(form.category);
        setSelectedForm(form);
        // Clear state so it doesn't reopen if they close it and navigate back within the page
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  const activeForms = FORMS.filter(f => f.category === activeTab);

  // When a form opens, we want to prevent body scrolling
  useEffect(() => {
    if (selectedForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedForm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4fa0ff] via-[#dcedff] to-[#f4f9ff] font-['Inter','K2D',sans-serif]">
      {/* Top Header Floating Area */}
      <div className="pt-12 px-6 pb-6 relative z-10">
        <div className="flex items-center gap-3 mb-6 opacity-90">
          <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-white/40 text-white">
            <FilePlus size={20} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight drop-shadow-sm">ยื่นคำขอออนไลน์</h1>
            <p className="text-white/90 text-[13px] font-medium mt-0.5 drop-shadow-sm">เลือกแบบฟอร์มที่ต้องการยื่นคำขอ</p>
          </div>
        </div>

        {/* Custom Tabs (Pill Style) */}
        <div className="flex bg-white/40 backdrop-blur-xl rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 mb-2">
          {(["pre", "dur", "pst"] as FormCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all duration-300",
                  isActive ? "bg-white text-blue-600 shadow-sm font-bold" : "text-white/90 hover:bg-white/20 font-medium"
                )}
              >
                <div className={cn("transition-transform duration-300", isActive ? "scale-110" : "scale-100")}>
                  {config.icon}
                </div>
                <span className="text-[12px]">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area (Solid White rounded container at bottom) */}
      <div className="px-3 pb-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white min-h-[500px]">
          
          {/* Helper Note for active phase */}
          {activeTab === "dur" && (
            <div className="bg-blue-50/60 border border-blue-100/50 rounded-2xl p-4 mb-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold">i</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-blue-900">ระยะปัจจุบันของคุณ</p>
                <p className="text-[11px] text-blue-700/80 mt-0.5 leading-relaxed">คุณกำลังอยู่ในระยะ "ระหว่างศึกษา" ฟอร์มเหล่านี้คือฟอร์มที่คุณน่าจะต้องใช้งานมากที่สุด</p>
              </div>
            </div>
          )}

          {/* Render Forms List */}
          <div className="divide-y divide-slate-200 flex flex-col">
            {activeForms.map((form) => {
              const accentClass = 
                activeTab === "pre" ? "text-orange-500 bg-orange-50 border-orange-100" : 
                activeTab === "dur" ? "text-blue-500 bg-blue-50 border-blue-100" : 
                "text-emerald-500 bg-emerald-50 border-emerald-100";

              return (
                <button 
                  key={form.id} 
                  onClick={() => setSelectedForm(form)} 
                  className="w-full flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 transition-colors text-left group rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105", accentClass)}>
                      {form.icon}
                    </div>
                    <div className="min-w-0 pr-3">
                      <h3 className="font-bold text-slate-800 text-[13px] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{form.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{form.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 shrink-0 group-hover:text-blue-500 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unified Form Native Modal Overlay */}
      {selectedForm && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <div className="bg-gradient-to-r from-[#4fa0ff] to-[#6ab2ff] pt-12 px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative z-10 pr-4">
              <h2 className="font-bold text-white text-[17px] leading-snug line-clamp-2 drop-shadow-sm">{selectedForm.title}</h2>
              <p className="text-white/90 text-xs mt-1 drop-shadow-sm">{selectedForm.id} · ส่งให้ สนร.</p>
            </div>
            <button 
              onClick={() => setSelectedForm(null)} 
              className="relative z-10 w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-white/90 hover:bg-white/20 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fafc] hide-scrollbar pb-24">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 leading-relaxed shadow-sm">
              <strong className="text-blue-900 block mb-1">💡 ข้อมูลจำลอง:</strong> นี่คือหน้าต่างจำลองสำหรับรองรับคำร้องทุกประเภทในระบบ ไม่ว่าคุณจะกดฟอร์มไหน ก็จะแสดง UI นี้เพื่อลดความซ้ำซ้อนของการทำ Prototype
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700">วันที่ต้องการดำเนินการ <span className="text-red-500">*</span></label>
              <input type="text" placeholder="DD/MM/YYYY" className="w-full border border-slate-200 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700">รายละเอียดคำร้อง <span className="text-red-500">*</span></label>
              <textarea rows={3} placeholder="ระบุรายละเอียดเพิ่มเติม..." className="w-full border border-slate-200 rounded-xl p-4 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all resize-none"></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700">แนบเอกสาร (ถ้ามี)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <Upload size={24} className="text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="text-sm font-bold text-slate-700">แตะเพื่ออัปโหลดไฟล์</span>
                <span className="text-xs text-slate-400 mt-1">PDF / JPEG ไม่เกิน 10MB</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all duration-300 active:scale-[0.98] text-[15px]" 
              onClick={() => setSelectedForm(null)}
            >
              ยื่นคำร้องไปยัง สนร.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
