import { useState, useEffect } from "react";
import { ChevronLeft, GraduationCap, Building, Wallet, FileCheck, CheckCircle2, ChevronRight, Briefcase, Calculator } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { cn } from "../../../components/ui/utils";

export default function MobileAwardDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "study" | "contracts" | "progress" | "finance" | "requests" | "health" | "bond" | "workplace" | "documents">("overview");
  const [scrolled, setScrolled] = useState(false);
  
  // Simulate fetching data, checking if it's a completed scholarship
  const isCompleted = id === 'AWD-002'; // Let's pretend AWD-002 is completed for demo purposes
  
  // Effect to default to 'bond' tab if completed
  useEffect(() => {
    if (isCompleted) {
      setActiveTab("bond");
    }
  }, [isCompleted]);

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
    <div className="min-h-screen bg-slate-50 font-['Inter','K2D',sans-serif] pb-10">
      {/* Dynamic Header */}
      <div className={cn(
        "bg-white/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300",
        scrolled ? "pt-5 pb-3 shadow-md border-b border-slate-100" : "pt-12 pb-4 shadow-sm"
      )}>
        <button onClick={() => navigate(-1)} className={cn(
          "flex items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300",
          scrolled ? "w-8 h-8" : "w-10 h-10"
        )}>
          <ChevronLeft size={scrolled ? 20 : 24} />
        </button>
        <h1 className={cn(
          "font-bold text-slate-800 transition-all duration-300",
          scrolled ? "text-base" : "text-lg"
        )}>รายละเอียดทุน</h1>
        <div className={cn("transition-all duration-300", scrolled ? "w-8 h-8" : "w-10 h-10")}></div> {/* Spacer for centering */}
      </div>

      <div className="px-4 mt-6">
        {/* Scholarship Hero Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400">SCH-2569-001</span>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", isCompleted ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200")}>
                  {isCompleted ? "ชดใช้ทุน" : "กำลังศึกษา"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">ทุนรัฐบาล (ก.พ.) พัฒนา</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md">ป.เอก วิศวกรรมคอมพิวเตอร์</span>
            <span className="flex items-center gap-1"><Building size={12} className="text-slate-400" /> Stanford University</span>
          </div>
        </div>

        {/* Current Stage & Next Steps Banner */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4 px-1">สถานะและภาพรวม</h3>
          
          {/* Phase Overview Stepper */}
          <div className="flex items-center justify-between mb-5 px-2">
            {[
              { id: 'pre', label: 'ก่อนเดินทาง', status: 'completed' },
              { id: 'during', label: 'ระหว่างศึกษา', status: isCompleted ? 'completed' : 'active' },
              { id: 'post', label: 'สำเร็จ/ชดใช้ทุน', status: isCompleted ? 'active' : 'pending' }
            ].map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold z-10 transition-colors", 
                  step.status === 'completed' ? "bg-emerald-500 text-white shadow-sm" :
                  step.status === 'active' ? (isCompleted ? "bg-emerald-500 text-white ring-4 ring-emerald-100" : "bg-blue-600 text-white ring-4 ring-blue-100") :
                  "bg-slate-100 text-slate-400 border border-slate-200"
                )}>
                  {step.status === 'completed' ? <CheckCircle2 size={16} /> : (idx + 1)}
                </div>
                <p className={cn("text-[10px] mt-2 text-center", step.status === 'active' ? (isCompleted ? "text-emerald-700 font-bold" : "text-blue-700 font-bold") : step.status === 'completed' ? "text-slate-700 font-medium" : "text-slate-400")}>
                  {step.label}
                </p>
                {/* Connecting Line */}
                {idx < 2 && (
                  <div className={cn("absolute top-3.5 left-[50%] right-[-50%] h-[2px] -z-10", 
                    step.status === 'completed' ? "bg-emerald-500" : "bg-slate-100"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          {isCompleted ? (
            // Repayment Stage
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-emerald-100 text-[11px] font-medium tracking-wide uppercase">ระยะปัจจุบัน</p>
                  <p className="font-bold text-base">กำลังปฏิบัติราชการชดใช้ทุน</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <p className="text-[13px] text-emerald-50 mb-2">เริ่มนับเวลาชดใช้ทุนตั้งแต่ 27 ส.ค. 2574</p>
                <div className="flex justify-between items-end">
                  <div>
                     <p className="text-[11px] text-emerald-100">เวลาที่ชดใช้ไปแล้ว</p>
                     <p className="font-bold text-lg text-white">2 <span className="text-xs font-normal">ปี</span> 3 <span className="text-xs font-normal">เดือน</span></p>
                  </div>
                  <div className="text-right">
                     <p className="text-[11px] text-emerald-100">คงเหลือ</p>
                     <p className="font-bold text-lg text-white">5 <span className="text-xs font-normal">ปี</span> 9 <span className="text-xs font-normal">เดือน</span></p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                   <div className="bg-white h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          ) : (
            // Studying Stage
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <span className="font-bold text-lg text-white">2</span>
                </div>
                <div>
                  <p className="text-blue-100 text-[11px] font-medium tracking-wide uppercase">ระยะปัจจุบัน</p>
                  <p className="font-bold text-base">ระหว่างศึกษาในต่างประเทศ</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex gap-3">
                   <div className="w-1 h-full bg-white/30 rounded-full py-4 shrink-0 flex flex-col justify-between items-center relative">
                      <div className="w-3 h-3 bg-white rounded-full absolute top-0 -left-1"></div>
                      <div className="w-3 h-3 bg-blue-300 rounded-full absolute bottom-0 -left-1 opacity-50"></div>
                   </div>
                   <div className="space-y-4 flex-1">
                      <div>
                        <p className="text-[13px] font-bold text-white">รายงานผลการศึกษา ภาคเรียนที่ 1</p>
                        <p className="text-[11px] text-blue-100 mt-1">ครบกำหนด 30 พ.ย. 2569</p>
                        <Link to="/mobile/scholar/forms" state={{ openForm: "DUR-31" }} className="inline-block mt-2 bg-white text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-full">ยื่นแบบฟอร์ม</Link>
                      </div>
                      <div className="opacity-60">
                        <p className="text-[12px] font-medium text-white">ต่ออายุวีซ่า</p>
                        <p className="text-[11px] text-blue-100">มี.ค. 2570</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "overview" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            ข้อมูลทุน
          </button>
          <button 
            onClick={() => setActiveTab("study")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "study" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            สถานที่ศึกษา
          </button>
          <button 
            onClick={() => setActiveTab("contracts")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "contracts" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            สัญญา & ค้ำประกัน
          </button>
          <button 
            onClick={() => setActiveTab("progress")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "progress" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            ผลการศึกษา
          </button>
          <button 
            onClick={() => setActiveTab("finance")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "finance" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            การเงิน & เบิกจ่าย
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "requests" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            รายการคำขอ
          </button>
          <button 
            onClick={() => setActiveTab("health")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "health" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            สุขภาพ (กาย/จิต)
          </button>
          <button 
            onClick={() => setActiveTab("bond")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "bond" ? (isCompleted ? "bg-emerald-600 text-white border border-emerald-600" : "bg-blue-600 text-white border border-blue-600") : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            ชดใช้ทุน
          </button>
          <button 
            onClick={() => setActiveTab("workplace")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "workplace" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            สถานที่ทำงาน
          </button>
          <button 
            onClick={() => setActiveTab("documents")}
            className={cn("px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-colors shadow-sm", activeTab === "documents" ? "bg-blue-600 text-white border border-blue-600" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}
          >
            เอกสาร
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 min-h-[300px]">
          
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ประเภททุน</p>
                <p className="text-[14px] font-medium text-slate-800">ทุน ก.พ.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">แหล่งทุน</p>
                <p className="text-[14px] font-medium text-slate-800">สำนักงาน ก.พ.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ระยะเวลาทุนรัฐบาล</p>
                <p className="text-[14px] font-medium text-slate-800">5 ปี (27/08/2569 – 26/08/2574)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ต้นสังกัด</p>
                <p className="text-[14px] font-medium text-slate-800">ตามความต้องการของ ศกศ. ก.พ.</p>
              </div>
            </div>
          )}

          {activeTab === "study" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">มหาวิทยาลัย</p>
                <p className="text-[14px] font-medium text-slate-800">Stanford University</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ที่อยู่ปัจจุบัน</p>
                <p className="text-[14px] font-medium text-slate-800">450 Serra Mall, Stanford, CA 94305</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">อีเมลสถานศึกษา</p>
                <p className="text-[14px] font-medium text-blue-600">pornpimon@stanford.edu</p>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">เลขที่สัญญา</p>
                <p className="text-[14px] font-medium text-slate-800">กพ-2569-001</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ผู้ค้ำประกันคนที่ 1</p>
                <p className="text-[14px] font-medium text-slate-800">นายสมชาย ใจดี (บิดา)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ผู้ค้ำประกันคนที่ 2</p>
                <p className="text-[14px] font-medium text-slate-800">นางสมศรี ใจดี (มารดา)</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase mb-3">เอกสารสัญญา</h4>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase">PDF</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600">หนังสือสัญญาค้ำประกัน.pdf</p>
                      <p className="text-[11px] text-slate-400">เซ็นชื่อเมื่อ: 15/08/2569</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileCheck size={14} />
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ผลการเรียน</p>
                <p className="text-[20px] font-bold text-blue-600">3.85</p>
              </div>
              <div className="divide-y divide-slate-100 flex flex-col mt-4">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">รายงานผล Fall 2026</p>
                    <p className="text-[11px] text-slate-400">อัปเดตเมื่อ: 10/01/2570</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">ตรวจสอบแล้ว</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">ประวัติการเบิกจ่ายล่าสุด</h4>
              <div className="divide-y divide-slate-100 flex flex-col">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">ค่าใช้จ่ายประจำเดือน (ก.ย.)</p>
                    <p className="text-[11px] text-slate-400">01/09/2569</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-slate-800">15,000 ฿</p>
                    <p className="text-[10px] text-emerald-600 font-medium">โอนสำเร็จ</p>
                  </div>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">ค่าธรรมเนียม Fall 2026</p>
                    <p className="text-[11px] text-slate-400">15/08/2569</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-slate-800">124,500 ฿</p>
                    <p className="text-[10px] text-emerald-600 font-medium">โอนสำเร็จ</p>
                  </div>
                </div>
              </div>
              <button className="w-full text-center text-blue-600 text-[12px] font-bold pt-2">ดูประวัติทั้งหมด</button>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">คำขอล่าสุด</h4>
              <div className="divide-y divide-slate-100 flex flex-col">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">ขออนุมัติเบิกจ่ายค่าอุปกรณ์การศึกษา</p>
                    <p className="text-[11px] text-slate-400">แบบฟอร์ม DUR-32 • REQ-2026-0633</p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">รอตรวจสอบ</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-[13px] font-medium text-slate-800">รายงานผลการศึกษา ภาคเรียนที่ 1</p>
                    <p className="text-[11px] text-slate-400">แบบฟอร์ม DUR-31 • REQ-2026-0512</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">อนุมัติแล้ว</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">ประวัติสุขภาพ (กาย/จิต)</h4>
              <div className="space-y-3">
                {[
                  { title: 'ผลตรวจร่างกายประจำปี', date: '20/03/2569', hosp: 'รพ. ศิริราช', note: 'สุขภาพแข็งแรงดี ไม่มีโรคประจำตัว' },
                  { title: 'ประเมินสุขภาพจิตเบื้องต้น', date: '20/03/2569', hosp: 'คลินิกจิตเวช', note: 'ปกติ ไม่มีความเครียดสะสม' },
                ].map((h, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3 border-b border-slate-200/50 pb-2">
                      <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-slate-800">{h.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{h.date}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">สถานพยาบาล</span>
                        <span className="text-[13px] font-medium text-slate-700">{h.hosp}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">ผลการประเมิน</span>
                        <span className="text-[13px] font-medium text-slate-700">{h.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bond" && (
            <div className="space-y-5">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                <Calculator className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-amber-900">รวมต้องปฏิบัติงานชดใช้ทุน</h4>
                  <p className="text-2xl font-bold text-amber-700 mt-1">2,920 <span className="text-sm font-medium">วัน (8 ปี)</span></p>
                  <p className="text-[11px] text-amber-700/80 mt-1">ระยะเวลารับทุน 1,460 วัน × 2 เท่า</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">สถานที่ปฏิบัติงานชดใช้ทุน</p>
                {isCompleted ? (
                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                     <p className="text-[14px] font-bold text-slate-800">สำนักงานคณะกรรมการพัฒนาระบบราชการ (ก.พ.ร.)</p>
                     <p className="text-[12px] text-slate-500 mt-0.5">นักพัฒนาระบบราชการปฏิบัติการ</p>
                     <p className="text-[11px] text-emerald-600 font-medium mt-2">เริ่มปฏิบัติงาน: 27/08/2574</p>
                   </div>
                ) : (
                   <p className="text-[13px] text-slate-500 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                     ยังไม่ได้รับการจัดสรรสังกัด จะดำเนินการเมื่อสำเร็จการศึกษา
                   </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">เงื่อนไขพิเศษ</p>
                <p className="text-[13px] font-medium text-slate-800 leading-relaxed mt-1">
                  หากไม่ชดใช้ด้วยเวลา ต้องชดใช้เป็นเงิน 2 เท่าของเงินทุนทั้งหมด
                </p>
              </div>
            </div>
          )}

          {activeTab === "workplace" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">หน่วยงาน</p>
                <p className="text-[14px] font-medium text-slate-800">{isCompleted ? "สำนักงาน ก.พ.ร." : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">ตำแหน่ง</p>
                <p className="text-[14px] font-medium text-slate-800">{isCompleted ? "นักพัฒนาระบบราชการปฏิบัติการ" : "-"}</p>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="divide-y divide-slate-100 flex flex-col">
                <div className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-slate-800">สัญญารับทุน.pdf</p>
                      <p className="text-[11px] text-slate-400">1.2 MB</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">ดาวน์โหลด</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
