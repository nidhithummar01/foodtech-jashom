import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import BrandsPage from '../pages/BrandsPage';
import BrandDetailPage from '../pages/BrandDetailPage';
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
      <Route path="/brands" element={authed ? <BrandsPage /> : <Navigate to="/login" replace />} />
      <Route path="/brands/:id" element={authed ? <BrandDetailPage /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={authed ? <SettingsPage /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
