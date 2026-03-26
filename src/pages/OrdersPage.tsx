import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { FcViewDetails } from 'react-icons/fc';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import ViewDetailsModal, { emailPill, viewStatusPill } from '../components/ui/ViewDetailsModal';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { ordersMock } from '../data/orders.mock';
import type { Order } from '../types/order';

type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

type OrderWithMeta = Order & {
  customer?: string;
  restaurant?: string;
  amount?: number;
  date?: string;
};

type OrderRow = Order & {
  amount: number;
  date: string;
  status: OrderStatus;
};

function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalized: OrderRow[] = (ordersMock as OrderWithMeta[]).map((item, index) => {
        const fallbackStatus: OrderStatus =
          index % 3 === 0 ? 'Cancelled' : index % 2 === 0 ? 'Completed' : 'Pending';

        return {
          ...item,
          customerName: item.customerName ?? item.customer ?? 'N/A',
          restaurantName: item.restaurantName ?? item.restaurant ?? 'N/A',
          amount: item.amount ?? 0,
          date: item.date ?? ['2024-03-20', '2024-03-22', '2024-03-24'][index] ?? '2024-03-20',
          status: (item.status as OrderStatus) ?? fallbackStatus,
        };
      });

      setOrders(normalized);
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((item) => {
        const matchesStatus = statusFilter.length === 0 || item.status === statusFilter;
        const matchesDate = dateFilter.length === 0 || item.date === dateFilter;
        return matchesStatus && matchesDate;
      }),
    [orders, statusFilter, dateFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter]);

  if (loading) {
    return <Loader variant="skeleton" lines={6} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-emerald-900">Orders</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Select
          label="Status"
          name="orderStatus"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          options={[
            { label: 'All Status', value: '' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' },
          ]}
        />
        <Input
          label="Date"
          name="orderDate"
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders to display"
          message="Orders will appear here once activity starts."
          icon={<Inbox className="h-5 w-5" />}
          actionLabel="Refresh orders"
          onAction={() => undefined}
        />
      ) : (
        <Table headers={['Order ID', 'Customer', 'Restaurant', 'Amount', 'Status', 'Date', 'Actions']}>
          {paginatedOrders.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-800">{item.id}</TableCell>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{item.restaurantName}</TableCell>
              <TableCell>₹{item.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === 'Completed'
                      ? 'success'
                      : item.status === 'Pending'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  className="!border-2 !border-emerald-400 px-2 hover:!border-emerald-500 hover:bg-emerald-50"
                  aria-label="View details"
                  onClick={() => setSelectedOrder(item)}
                >
                  <FcViewDetails className="h-4 w-4 shrink-0" aria-hidden />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      {filteredOrders.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        />
      ) : null}

      <ViewDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        compact
        initialsFrom={selectedOrder?.customerName ?? ''}
        rows={
          selectedOrder
            ? [
                { label: 'Order ID:', value: emailPill(selectedOrder.id, true) },
                {
                  label: 'Customer:',
                  value: <span className="font-semibold text-slate-900">{selectedOrder.customerName}</span>,
                },
                { label: 'Restaurant:', value: selectedOrder.restaurantName },
                { label: 'Amount:', value: `₹${selectedOrder.amount.toFixed(2)}` },
                { label: 'Status:', value: viewStatusPill(selectedOrder.status) },
                { label: 'Date:', value: selectedOrder.date },
              ]
            : []
        }
      />
    </div>
  );
}

export default OrdersPage;
