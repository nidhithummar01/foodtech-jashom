import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import FranchisesPage from '../pages/FranchisesPage';
import OrdersPage from '../pages/OrdersPage';
import ReportsPage from '../pages/ReportsPage';
import RestaurantsPage from '../pages/RestaurantsPage';
import NewPasswordPage from '../pages/NewPasswordPage';
import OtpPage from '../pages/OtpPage';
import ResetPage from '../pages/ResetPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';
import { isAuthenticated } from '../utils/auth';

function AppRoutes() {
  const authed = isAuthenticated();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authed ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={authed ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/reset" element={<ResetPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/new-password" element={<NewPasswordPage />} />
      <Route path="/dashboard" element={authed ? <DashboardPage /> : <Navigate to="/login" replace />} />
      <Route path="/users" element={authed ? <UsersPage /> : <Navigate to="/login" replace />} />
      <Route path="/restaurants" element={authed ? <RestaurantsPage /> : <Navigate to="/login" replace />} />
      <Route path="/orders" element={authed ? <OrdersPage /> : <Navigate to="/login" replace />} />
      <Route path="/reports" element={authed ? <ReportsPage /> : <Navigate to="/login" replace />} />
      <Route path="/franchises" element={authed ? <FranchisesPage /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={authed ? <SettingsPage /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
