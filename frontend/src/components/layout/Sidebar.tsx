import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Settings,
  Building2,
  BarChart3,
  Bell,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
  { to: '/leaves', label: 'My Leaves', icon: ClipboardList, roles: ['employee', 'manager'] },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList, roles: ['manager'] },
  { to: '/employees', label: 'Employees', icon: Users, roles: ['admin', 'manager'] },
  { to: '/departments', label: 'Departments', icon: Building2, roles: ['admin'] },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, roles: ['admin', 'manager', 'employee'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'manager', 'employee'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role ?? 'employee';

  const visible = navItems.filter((item) => item.roles.includes(role as UserRole));

  return (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
        <CalendarDays className="h-6 w-6 text-primary-600" />
        <span className="text-lg font-bold text-gray-900">LMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {visible.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </p>
            <p className="truncate text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
