import { ArrowLeft, CheckCircle2, Clock, FileText, Download, User, Building } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

export default function MobileRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data based on the ID or just a generic one
  const isCompleted = id === "REQ-2025-4421" || id === "REQ-2026-0633";

  return (
    <div className="bg-[#f0f4f8] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200/60 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-slate-800 text-base leading-tight">รายละเอียดคำร้อง</h1>
          <p className="text-xs text-slate-500">{id || "REQ-2026-0892"}</p>
        </div>
        {isCompleted ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
            เสร็จสิ้น
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
            กำลังดำเนินการ
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Main Info */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">
              {id === "REQ-2025-4421" ? "แบบรายงานตัวไปศึกษา" : "ขอเปลี่ยนสาขาวิชาเรียน"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">นายสมชาย ใจดี • ทุนรัฐบาล (ก.พ.)</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">วันที่ยื่นคำร้อง</p>
                <p className="text-xs text-slate-800 font-medium">10/05/2026</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">ผู้รับเรื่อง</p>
                <p className="text-xs text-slate-800 font-medium">สนร. ลอนดอน</p>
              </div>
            </div>

            {id !== "REQ-2025-4421" && (
              <div className="pt-2">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">เหตุผลที่ขอเปลี่ยนสาขา</p>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  เพื่อให้สอดคล้องกับหัวข้องานวิจัยที่ได้รับมอบหมายจากอาจารย์ที่ปรึกษา ซึ่งเน้นไปทางด้าน Data Science มากกว่า Software Engineering
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Attached Files */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">เอกสารประกอบ (2)</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">transcript_term1.pdf</p>
                <p className="text-[10px] text-slate-500">1.2 MB</p>
              </div>
              <button className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                <Download size={14} />
              </button>
            </div>
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">advisor_approval_letter.pdf</p>
                <p className="text-[10px] text-slate-500">840 KB</p>
              </div>
              <button className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">ประวัติการดำเนินการ</h2>
          </div>
          <div className="p-5">
            <div className="relative pl-5 border-l-2 border-slate-100 space-y-6 ml-2">
              
              {isCompleted ? (
                <>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm" style={{ width: 20, height: 20 }}>
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-emerald-700">เสร็จสิ้นสมบูรณ์</p>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mt-2">
                      <p className="text-xs text-emerald-700 font-medium">สนร. แจ้งหน่วยงานที่เกี่ยวข้องและอัปเดตข้อมูลเข้าระบบเรียบร้อยแล้ว</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">15/04/2026 14:30 น. • ระบบ</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                    <p className="text-xs font-bold text-slate-700">สนร. อนุมัติ</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">ตรวจสอบเอกสารครบถ้วน ถูกต้องตามระเบียบ</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">15/04/2026 10:15 น. • สนร. ลอนดอน</p>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 3 - Pending */}
                  <div className="relative">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
                    <p className="text-xs font-bold text-slate-400">ศกศ. พิจารณาอนุมัติ</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">รอขั้นตอนก่อนหน้า</p>
                  </div>
                  {/* Step 2 - Current */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center shadow-md" style={{ width: 24, height: 24 }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                    </div>
                    <p className="text-sm font-bold text-blue-700">สนร. ส่งต่อเรื่องให้ ศกศ.</p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 mt-2">
                      <p className="text-xs text-blue-800">เรียน ศกศ. สนร.ลอนดอนได้ตรวจสอบเอกสารแนบแล้ว ครบถ้วนถูกต้อง เห็นควรพิจารณาอนุมัติ</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">12/05/2026 16:45 น. • สนร. ลอนดอน</p>
                  </div>
                </>
              )}
              
              {/* Step 1 - Done */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                <p className="text-xs font-bold text-slate-700">สนร. รับเรื่องแล้ว</p>
                <p className="text-[11px] text-slate-500 mt-0.5">ระบบได้รับเอกสารคำร้องจากนักเรียนทุน</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">10/05/2026 09:20 น. • ระบบ</p>
              </div>

              {/* Step 0 - Submitted */}
              <div className="relative">
                <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                <p className="text-xs font-bold text-slate-700">ยื่นคำร้องสำเร็จ</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">10/05/2026 09:20 น. • นายสมชาย ใจดี</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
