import { useAuth } from '../contexts/AuthContext';
import StaffDashboard from './dashboards/StaffDashboard';
import ApproverDashboard from './dashboards/ApproverDashboard';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'executive') {
    return <ExecutiveDashboard />;
  }

  if (user?.role === 'approver') {
    return <ApproverDashboard />;
  }

  // Default to staff dashboard
  return <StaffDashboard />;
}