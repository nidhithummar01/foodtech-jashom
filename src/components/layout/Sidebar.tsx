import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const menuItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/users' },
  { label: 'Restaurants', to: '/restaurants' },
  { label: 'Orders', to: '/orders' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden min-h-screen w-64 border-r bg-white md:block">
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold text-black">Admin Panel</h2>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'rounded-md px-3 py-2 transition-colors',
                isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
