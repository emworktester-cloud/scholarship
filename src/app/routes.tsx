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
import WorkspaceTaskDetail from "./pages/workspace/WorkspaceTaskDetail";
import PublicLayout from "./pages/public/PublicLayout";
import PublicHome from "./pages/public/PublicHome";
import ApplicationSteps from "./pages/public/ApplicationSteps";

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
      { path: "analytics/reports", Component: Reports },
      { path: "analytics/progress", Component: Reports },
      { path: "analytics/trends", Component: Reports },
      // 1.3 ส่งออก & ตรวจสอบ
      { path: "analytics/export", Component: Reports },

      // ===== 2. Workspace (พื้นที่ปฏิบัติงาน) =====
      // 2.1 คิวงานของฉัน
      { path: "workspace", Component: Applications },
      { path: "workspace/all", Component: Applications },
      { path: "workspace/:id", Component: WorkspaceTaskDetail },
      // 2.2 ลายเซ็นอิเล็กทรอนิกส์
      { path: "workspace/e-sign", Component: Applications },

      // ===== 3. Scholar Hub (ทะเบียน นทร.) =====
      // 3.1 ข้อมูลส่วนบุคคล & สุขภาพ
      { path: "scholar-hub", Component: ScholarLifecycle },
      { path: "scholar-hub/during-study", Component: ScholarLifecycle },
      { path: "scholar-hub/post-graduation", Component: ScholarLifecycle },
      { path: "scholar-hub/profile", Component: ScholarProfileView },
      { path: "scholar-hub/profile/:id", Component: ScholarProfileView },
      // 3.2 ทุน & ประวัติการศึกษา
      { path: "scholar-hub/tracking", Component: Tracking },
      { path: "scholar-hub/status", Component: ScholarStatus },
      // 3.3 คลังเอกสาร & รูปภาพ
      { path: "scholar-hub/documents", Component: SupportTools },
      { path: "scholar-hub/photos", Component: SupportTools },
      // 3.4 ชดใช้ทุน & จัดสรรสังกัด
      { path: "scholar-hub/bond-calc", Component: Tracking },

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