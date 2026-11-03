import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { getErrorMessage } from '@/services/api';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title ?? 'Leave Management System'}</h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-5 w-px bg-gray-200" />

        <span className="text-sm text-gray-600">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </span>

        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
