import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h1 className="text-xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </div>
  );
}
