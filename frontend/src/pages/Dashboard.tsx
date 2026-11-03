import { CalendarDays, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your leave status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Entitlement"
          value="—"
          icon={CalendarDays}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Used"
          value="—"
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Pending"
          value="—"
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          label="Available"
          value="—"
          icon={XCircle}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Recent Applications</h3>
          <p className="text-sm text-gray-500">No leave applications yet.</p>
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900">Upcoming Leaves</h3>
          <p className="text-sm text-gray-500">No upcoming leaves scheduled.</p>
        </div>
      </div>
    </div>
  );
}
