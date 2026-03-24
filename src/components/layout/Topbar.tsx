import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/restaurants': 'Restaurants',
  '/orders': 'Orders',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

function Topbar() {
  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] ?? 'Admin Panel';
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6">
      <h1 className="text-lg font-semibold text-black">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Notifications" className="text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
              A
            </div>
            <span>Profile</span>
          </button>
          {isProfileMenuOpen ? (
            <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white py-1 shadow-sm">
              <button type="button" className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </button>
              <button type="button" className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
