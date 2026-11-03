import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leaves': 'My Leaves',
  '/approvals': 'Leave Approvals',
  '/employees': 'Employees',
  '/departments': 'Departments',
  '/calendar': 'Leave Calendar',
  '/reports': 'Reports & Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Leave Management System';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
