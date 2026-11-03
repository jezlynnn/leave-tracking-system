import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-gray-200">403</p>
      <h1 className="text-xl font-semibold text-gray-900">Access denied</h1>
      <p className="text-sm text-gray-500">You don&apos;t have permission to view this page.</p>
      <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
}
