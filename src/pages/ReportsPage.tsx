import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { showInfoToast } from '../components/ui/toast';
import { reportsMock } from '../data/reports.mock';

type ReportType = 'Sales' | 'Users' | 'Orders';
type ReportStatus = 'Ready' | 'Generating' | 'Failed';

type ReportItem = {
  id: string;
  name: string;
  type: ReportType;
  generatedAt: string;
  status: ReportStatus;
};

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === 'Ready') {
    return (
      <Badge variant="success" className="px-2 py-1 rounded-full text-xs font-medium">
        Ready
      </Badge>
    );
  }
  if (status === 'Generating') {
    return (
      <Badge variant="warning" className="px-2 py-1 rounded-full text-xs font-medium">
        Generating
      </Badge>
    );
  }
  return (
    <Badge variant="danger" className="px-2 py-1 rounded-full text-xs font-medium">
      Failed
    </Badge>
  );
}

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('');
  const [reportType, setReportType] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, []);

  const reports = useMemo<ReportItem[]>(
    () =>
      reportsMock.map((item) => ({
        id: item.id,
        name: item.title,
        type: item.type as ReportType,
        generatedAt: item.createdAt,
        status: item.status as ReportStatus,
      })),
    [],
  );

  const filteredReports = useMemo(
    () =>
      reports.filter((item) => {
        const matchesType = reportType.length === 0 || item.type === reportType;
        const matchesDate = dateRange.length === 0 || item.generatedAt === dateRange;
        return matchesType && matchesDate;
      }),
    [reports, reportType, dateRange],
  );

  const reportCards = [
    { label: 'Revenue', value: '$12,500' },
    { label: 'Orders', value: '320' },
    { label: 'Growth', value: '+12%' },
    { label: 'Cancellations', value: '18' },
  ];

  const handleExport = () => {
    showInfoToast('Export started (demo mode)');
  };

  const handleResetFilters = () => {
    setDateRange('');
    setReportType('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reports</h1>
        <Loader variant="skeleton" lines={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reports</h1>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Select
            id="report-date"
            label="Date Range"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            options={[
              { label: 'Last 7 days', value: 'last-7-days' },
              { label: 'Last 30 days', value: 'last-30-days' },
              { label: 'Last 90 days', value: 'last-90-days' },
            ]}
            placeholder="All Dates"
          />

          <Select
            id="report-type"
            label="Report Type"
            value={reportType}
            onChange={(event) => setReportType(event.target.value)}
            options={[
              { label: 'Sales', value: 'Sales' },
              { label: 'Users', value: 'Users' },
              { label: 'Orders', value: 'Orders' },
            ]}
            placeholder="All Types"
          />

          <div className="lg:col-span-2 lg:flex lg:items-end lg:justify-end">
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                className="rounded-lg bg-black px-4 py-2 text-white transition-all duration-150 hover:bg-black/80 active:scale-95"
              >
                Export CSV
              </Button>
              <Button
                onClick={handleExport}
                className="rounded-lg bg-black px-4 py-2 text-white transition-all duration-150 hover:bg-black/80 active:scale-95"
              >
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700">Performance Trend</h2>
          <div className="mt-3 h-40 rounded-lg border border-dashed bg-gray-50" />
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700">Channel Split</h2>
          <div className="mt-3 h-40 rounded-lg border border-dashed bg-gray-50" />
        </div>
      </section>

      {filteredReports.length === 0 ? (
        <EmptyState
          title="No report data for selected range"
          icon={<Inbox className="h-5 w-5" />}
          actionLabel="Reset filters"
          onAction={handleResetFilters}
        />
      ) : (
        <Table headers={['Report Name', 'Type', 'Date Generated', 'Status', 'Action']}>
          {filteredReports.map((report) => (
            <TableRow key={report.id} className="hover:bg-gray-50 transition">
              <TableCell className="font-medium text-gray-800">{report.name}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.generatedAt}</TableCell>
              <TableCell>
                <StatusBadge status={report.status} />
              </TableCell>
              <TableCell>
                <Button variant="secondary" size="sm" className="transition-all duration-150">
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
}

export default ReportsPage;
