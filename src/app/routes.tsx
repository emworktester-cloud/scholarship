import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthWrapper } from "./components/AuthWrapper";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Workflows from "./pages/Workflows";
import WorkflowBuilder from "./pages/WorkflowBuilder";
import FormBuilder from "./pages/FormBuilder";
import Tracking from "./pages/Tracking";
import Awards from "./pages/Awards";
import Payment from "./pages/Payment";
import Reports from "./pages/Reports";
import MasterData from "./pages/MasterData";
import Settings from "./pages/Settings";
import Audit from "./pages/Audit";
import API from "./pages/API";
import Security from "./pages/Security";
import AccountAdmin from "./pages/AccountAdmin";
import Notifications from "./pages/Notifications";
import SupportTools from "./pages/SupportTools";
import CookieManagement from "./pages/CookieManagement";
import ScholarLifecycle from "./pages/ScholarLifecycle";
import ScholarStatus from "./pages/ScholarStatus";
import MyPermissions from "./pages/MyPermissions";
import NotFound from "./pages/NotFound";
import ScholarProfileView from "./pages/scholar-hub/ScholarProfileView";
import ScholarList from "./pages/scholars/ScholarList";
import ScholarProfile from "./pages/scholars/ScholarProfile";
import AwardDetail from "./pages/scholars/AwardDetail";
import WorkspaceTaskDetail from "./pages/workspace/WorkspaceTaskDetail";
import PublicLayout from "./pages/public/PublicLayout";
import PublicHome from "./pages/public/PublicHome";
import ApplicationSteps from "./pages/public/ApplicationSteps";
import ScholarshipCalculator from "./pages/support/ScholarshipCalculator";
import DocumentManager from "./pages/support/DocumentManager";
import PhotoManager from "./pages/support/PhotoManager";
import ESignature from "./pages/support/ESignature";
import OverviewDashboard from "./pages/reports/OverviewDashboard";
import ScholarProgress from "./pages/reports/ScholarProgress";
import TrendAnalysis from "./pages/reports/TrendAnalysis";
import ExportAuditTrail from "./pages/reports/ExportAuditTrail";
import { PageHeader } from "./components/shared/PageHeader";

// Mobile Pages
import MobileLayout from "./pages/mobile/scholar/MobileLayout";
import MobileHome from "./pages/mobile/scholar/MobileHome";
import MobileForms from "./pages/mobile/scholar/MobileForms";
import MobileTracking from "./pages/mobile/scholar/MobileTracking";
import MobileInbox from "./pages/mobile/scholar/MobileInbox";
import MobileProfile from "./pages/mobile/scholar/MobileProfile";
import MobileRequestDetail from "./pages/mobile/scholar/MobileRequestDetail";
import MobileAwardDetail from "./pages/mobile/scholar/MobileAwardDetail";

const AnalyticsOverviewPage = () => (
  <div className="min-h-full">
    <PageHeader title="ภาพรวมรายงาน" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'วิเคราะห์ & แนวโน้ม' }, { label: 'ภาพรวมรายงาน' }]} />
    <div className="p-8"><OverviewDashboard /></div>
  </div>
);

const AnalyticsProgressPage = () => (
  <div className="min-h-full">
    <PageHeader title="ความก้าวหน้า นทร." breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'วิเคราะห์ & แนวโน้ม' }, { label: 'ความก้าวหน้า นทร.' }]} />
    <div className="p-8"><ScholarProgress /></div>
  </div>
);

const AnalyticsTrendsPage = () => (
  <div className="min-h-full">
    <PageHeader title="วิเคราะห์แนวโน้ม" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'วิเคราะห์ & แนวโน้ม' }, { label: 'วิเคราะห์แนวโน้ม' }]} />
    <div className="p-8"><TrendAnalysis /></div>
  </div>
);

const AnalyticsExportPage = () => (
  <div className="min-h-full">
    <PageHeader title="ส่งออกรายงาน" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'ส่งออก & ตรวจสอบ' }, { label: 'ส่งออกรายงาน' }]} />
    <div className="p-8"><ExportAuditTrail /></div>
  </div>
);

const DocumentManagerPage = () => (
  <div className="min-h-full">
    <PageHeader title="คลังเอกสาร" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'ทะเบียน นทร.' }, { label: 'คลังเอกสาร' }]} />
    <div className="p-8"><DocumentManager /></div>
  </div>
);

const PhotoManagerPage = () => (
  <div className="min-h-full">
    <PageHeader title="จัดการรูปภาพ" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'ทะเบียน นทร.' }, { label: 'จัดการรูปภาพ' }]} />
    <div className="p-8"><PhotoManager /></div>
  </div>
);

const ESignaturePage = () => (
  <div className="min-h-full">
    <PageHeader title="ลงนามเอกสาร (e-Sign)" breadcrumbs={[{ label: 'แดชบอร์ด', href: '/' }, { label: 'งานของฉัน' }, { label: 'ลงนามเอกสาร' }]} />
    <div className="p-8"><ESignature /></div>
  </div>
);

const BondCalcPage = () => (
  <div className="min-h-full">
    <PageHeader 
      title="คำนวณวันรับทุน/ชดใช้ทุน" 
      breadcrumbs={[
        { label: 'แดชบอร์ด', href: '/' },
        { label: 'ทะเบียน นทร.', href: '/scholar-hub' },
        { label: 'คำนวณชดใช้ทุน' }
      ]} 
    />
    <div className="p-8">
      <ScholarshipCalculator />
    </div>
  </div>
);

export const router = createBrowserRouter([
  // ===== Public =====
  {
    path: "/public",
    Component: PublicLayout,
    children: [
      { index: true, Component: PublicHome },
      { path: "apply-steps", Component: ApplicationSteps },
    ],
  },
  // ===== Mobile Prototype =====
  {
    path: "/mobile/scholar",
    Component: MobileLayout,
    children: [
      { index: true, Component: MobileHome },
      { path: "forms", Component: MobileForms },
      { path: "tracking", Component: MobileTracking },
      { path: "tracking/:id", Component: MobileRequestDetail },
      { path: "inbox", Component: MobileInbox },
      { path: "profile", Component: MobileProfile },
      { path: "awards/:id", Component: MobileAwardDetail },
    ],
  },
  // ===== Login =====
  {
    path: "/login",
    element: (
      <AuthWrapper>
        <Login />
      </AuthWrapper>
    ),
  },
  // ===== Protected App Shell =====
  {
    path: "/",
    element: (
      <AuthWrapper>
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      </AuthWrapper>
    ),
    children: [
      { index: true, Component: Dashboard },

      // ===== 1. Analytics (แดชบอร์ด & รายงาน) =====
      // 1.1 แดชบอร์ดผู้บริหาร
      { path: "analytics", Component: Dashboard },
      // 1.2 วิเคราะห์ & แนวโน้ม
      { path: "analytics/reports", Component: AnalyticsOverviewPage },
      { path: "analytics/progress", Component: AnalyticsProgressPage },
      { path: "analytics/trends", Component: AnalyticsTrendsPage },
      // 1.3 ส่งออก & ตรวจสอบ
      { path: "analytics/export", Component: AnalyticsExportPage },

      // ===== 2. Workspace (พื้นที่ปฏิบัติงาน) =====
      // 2.1 คิวงานของฉัน
      { path: "workspace", Component: Applications },
      { path: "workspace/all", Component: Applications },
      { path: "workspace/:id", Component: WorkspaceTaskDetail },
      // 2.2 ลายเซ็นอิเล็กทรอนิกส์
      { path: "workspace/e-sign", Component: ESignaturePage },

      // ===== 3. Scholar Hub (ทะเบียน นทร.) — Person-Centric =====
      // 3.0 รายการนักเรียนทุน (มุมมองคน)
      { path: "scholars", Component: ScholarList },
      { path: "scholars/:personId", Component: ScholarProfile },
      { path: "scholars/:personId/awards/:awardId", Component: AwardDetail },
      // 3.1 Legacy Phase-based views (still functional)
      { path: "scholar-hub", Component: ScholarList },
      { path: "scholar-hub/pre-departure", Component: ScholarLifecycle },
      { path: "scholar-hub/during-study", Component: ScholarLifecycle },
      { path: "scholar-hub/post-graduation", Component: ScholarLifecycle },
      { path: "scholar-hub/profile", Component: ScholarProfileView },
      { path: "scholar-hub/profile/:id", Component: ScholarProfileView },
      // 3.2 ทุน & ประวัติการศึกษา
      { path: "scholar-hub/tracking", Component: Tracking },
      { path: "scholar-hub/status", Component: ScholarStatus },
      // 3.3 คลังเอกสาร & รูปภาพ
      { path: "scholar-hub/documents", Component: DocumentManagerPage },
      { path: "scholar-hub/photos", Component: PhotoManagerPage },
      { path: "scholar-hub/calculator", Component: SupportTools },
      { path: "scholar-hub/esignature", Component: SupportTools },
      { path: "scholar-hub/config", Component: SupportTools },
      { path: "scholar-hub/safety", Component: SupportTools },
      // 3.4 ชดใช้ทุน & จัดสรรสังกัด
      { path: "scholar-hub/bond-calc", Component: BondCalcPage },

      // ===== 4. Finance & Bond (สัญญาและการเงิน) =====
      // 4.1 สัญญา & ผู้ค้ำประกัน
      { path: "finance", Component: Awards },
      { path: "finance/guarantor", Component: Awards },
      // 4.2 การจ่ายเงิน & โลจิสติกส์
      { path: "finance/payment", Component: Payment },
      { path: "finance/budget", Component: Payment },
      { path: "finance/logistics", Component: Payment },

      // ===== 5. Master Data (ข้อมูลหลัก & เวิร์กโฟลว์) =====
      // 5.1 ตัวสร้างแบบฟอร์ม & Workflow
      { path: "master-data/workflows", Component: Workflows },
      { path: "master-data/forms", Component: FormBuilder },
      { path: "master-data/forms/:id", Component: FormBuilder },
      { path: "master-data/builder/:id?", Component: WorkflowBuilder },
      // 5.2 ตารางข้อมูลอ้างอิง
      { path: "master-data", Component: MasterData },

      // ===== 6. System Admin (ระบบและความปลอดภัย) =====
      // 6.1 สิทธิ์ผู้ใช้ & โซนภูมิศาสตร์
      { path: "admin", Component: AccountAdmin },
      { path: "admin/security", Component: Security },
      // 6.2 เชื่อมต่อระบบภายนอก
      { path: "admin/api", Component: API },
      // 6.3 PDPA & บันทึกระบบ
      { path: "admin/cookie", Component: CookieManagement },
      { path: "admin/audit", Component: Audit },

      // ===== Global (Topbar dropdown) =====
      { path: "settings", Component: Settings },
      { path: "my-permissions", Component: MyPermissions },

      // ===== Legacy backward-compat =====
      { path: "applications", Component: Applications },
      { path: "applications/:id", Component: ApplicationDetail },
      { path: "workflows", Component: Workflows },
      { path: "workflows/builder/:id?", Component: WorkflowBuilder },
      { path: "workflows/forms/:id?", Component: FormBuilder },
      { path: "tracking", Component: Tracking },
      { path: "awards", Component: Awards },
      { path: "awards/:id", Component: ApplicationDetail },
      { path: "payment", Component: Payment },
      { path: "reports", Component: Reports },
      { path: "audit", Component: Audit },
      { path: "api", Component: API },
      { path: "security", Component: Security },
      { path: "account-admin", Component: AccountAdmin },
      { path: "notifications", Component: Notifications },
      { path: "support-tools", Component: SupportTools },
      { path: "cookie-management", Component: CookieManagement },
      { path: "scholar-lifecycle", Component: ScholarLifecycle },
      { path: "scholar-status", Component: ScholarStatus },

      // ===== 404 =====
      { path: "*", Component: NotFound },
    ],
  },
]);