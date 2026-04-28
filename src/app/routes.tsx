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
import PublicLayout from "./pages/public/PublicLayout";
import PublicHome from "./pages/public/PublicHome";
import ApplicationSteps from "./pages/public/ApplicationSteps";

export const router = createBrowserRouter([
  {
    path: "/public",
    Component: PublicLayout,
    children: [
      { index: true, Component: PublicHome },
      { path: "apply-steps", Component: ApplicationSteps },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthWrapper>
        <Login />
      </AuthWrapper>
    ),
  },
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
      { path: "my-permissions", Component: MyPermissions },
      { path: "settings", Component: Settings },
      { path: "audit", Component: Audit },
      { path: "api", Component: API },
      { path: "security", Component: Security },
      { path: "account-admin", Component: AccountAdmin },
      { path: "notifications", Component: Notifications },
      { path: "support-tools", Component: SupportTools },
      { path: "cookie-management", Component: CookieManagement },
      { path: "scholar-lifecycle", Component: ScholarLifecycle },
      { path: "scholar-status", Component: ScholarStatus },
      { path: "*", Component: NotFound },
    ],
  },
]);