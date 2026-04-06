import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AppRoutes from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const hideChromeOnPaths = new Set(['/login', '/reset', '/otp', '/new-password']);
  const shouldHideChrome = hideChromeOnPaths.has(location.pathname);

  if (shouldHideChrome) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <main className="min-h-screen">
          <AppRoutes />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-64">
        <Topbar />
        <main className="flex-1 p-3 sm:p-6">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
