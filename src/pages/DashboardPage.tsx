import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { dashboardMock } from '../data/dashboard.mock';

type ActivityItem = {
  id: string;
  title: string;
  date: string;
  status: string;
};

type DashboardData = {
  totalUsers: number;
  totalBrands: number;
  revenue: number;
  recentActivity?: ActivityItem[];
};

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(dashboardMock as DashboardData);
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const kpis = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      { label: 'Total Users', value: data.totalUsers.toLocaleString() },
      { label: 'Total Brands', value: data.totalBrands.toLocaleString() },
      { label: 'Revenue', value: `₹${data.revenue.toLocaleString()}` },
    ];
  }, [data]);

  const recentActivity = data?.recentActivity ?? [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-300 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-emerald-900">Revenue Trend</h2>
          <div className="mt-3 h-48 rounded-lg border border-dashed bg-gray-50" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-emerald-900">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No activity yet"
            message="No activity yet"
            icon={<Inbox className="h-5 w-5" />}
            actionLabel="Refresh activity"
            onAction={() => undefined}
          />
        ) : (
          <div className="rounded-lg border border-emerald-100 bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span className="text-sm text-gray-600">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
