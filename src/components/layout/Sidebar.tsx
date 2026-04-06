import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, type ComponentType } from 'react';
import clsx from 'clsx';
import { MdDashboard } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import { IoStorefront, IoSettings } from 'react-icons/io5';

type IconProps = { className?: string };

const menuItems: Array<{ label: string; to: string; Icon: ComponentType<IconProps> }> = [
  { label: 'Dashboard', to: '/dashboard', Icon: MdDashboard },
  { label: 'Users', to: '/users', Icon: LuUsers },
  { label: 'Brands', to: '/brands', Icon: IoStorefront },
  { label: 'Settings', to: '/settings', Icon: IoSettings },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-emerald-100 bg-white text-emerald-900 md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden min-h-screen w-64 border-r border-emerald-100 bg-white md:block">
        <div className="border-b border-emerald-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-emerald-800">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded-md px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-emerald-600 font-medium text-white'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900',
                )
              }
            >
              <item.Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      {isOpen ? (
        <aside className="fixed left-0 top-0 z-50 min-h-screen w-64 border-r border-emerald-100 bg-white md:hidden">
          <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-emerald-800">Admin Panel</h2>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-emerald-900 hover:bg-emerald-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-md px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-emerald-600 font-medium text-white'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900',
                  )
                }
              >
                <item.Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      ) : null}
    </>
  );
}

export default Sidebar;
