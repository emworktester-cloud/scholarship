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
  // ===== Public Routes =====
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
      // --- Redirect root to analytics ---
      { index: true, Component: Dashboard },

      // ===== Module 1: Analytics (แดชบอร์ด & รายงาน) =====
      { path: "analytics", Component: Dashboard },
      { path: "analytics/reports", Component: Reports },
      { path: "analytics/reports/progress", Component: Reports },
      { path: "analytics/reports/trends", Component: Reports },
      { path: "analytics/reports/individual", Component: Reports },
      { path: "analytics/reports/export", Component: Reports },

      // ===== Module 2: Workspace (พื้นที่ปฏิบัติงาน) =====
      { path: "workspace", Component: Applications },
      { path: "workspace/all", Component: Applications },
      { path: "workspace/broadcast", Component: Notifications },
      { path: "workspace/:id", Component: WorkspaceTaskDetail },

      // ===== Module 3: Scholar Hub (ทะเบียน นทร.) =====
      { path: "scholar-hub", Component: ScholarLifecycle },
      { path: "scholar-hub/during-study", Component: ScholarLifecycle },
      { path: "scholar-hub/post-graduation", Component: ScholarLifecycle },
      { path: "scholar-hub/tracking", Component: Tracking },
      { path: "scholar-hub/status", Component: ScholarStatus },
      { path: "scholar-hub/profile/:id", Component: ScholarProfileView },

      // ===== Module 4: Finance & Bond (สัญญาและการเงิน) =====
      { path: "finance", Component: Awards },
      { path: "finance/payment", Component: Payment },
      { path: "finance/budget", Component: Payment },
      { path: "finance/installments", Component: Payment },

      // ===== Module 5: Master Data (ข้อมูลหลัก & Workflow) =====
      { path: "master-data", Component: MasterData },
      { path: "master-data/gov-orgs", Component: MasterData },
      { path: "master-data/provinces", Component: MasterData },
      { path: "master-data/repayment", Component: MasterData },
      { path: "master-data/workflows", Component: Workflows },
      { path: "master-data/forms", Component: FormBuilder },
      { path: "master-data/forms/:id", Component: FormBuilder },
      { path: "master-data/builder/:id?", Component: WorkflowBuilder },

      // ===== Module 6: System Admin (ระบบและความปลอดภัย) =====
      { path: "admin", Component: AccountAdmin },
      { path: "admin/security", Component: Security },
      { path: "admin/api", Component: API },
      { path: "admin/cookie", Component: CookieManagement },
      { path: "admin/audit", Component: Audit },

      // ===== Global Items (accessible from Topbar dropdown) =====
      { path: "settings", Component: Settings },
      { path: "my-permissions", Component: MyPermissions },

      // ===== Legacy Redirects (old paths still work) =====
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
      { path: "master-data", Component: MasterData },
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