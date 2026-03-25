import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import FranchisesPage from '../pages/FranchisesPage';
import OrdersPage from '../pages/OrdersPage';
import ReportsPage from '../pages/ReportsPage';
import RestaurantsPage from '../pages/RestaurantsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/franchises" element={<FranchisesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default AppRoutes;
