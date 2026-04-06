import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { brandsMock } from '../data/brands.mock';
import type { Brand } from '../types/brand';

type BrandStatus = 'Active' | 'Pending' | 'Blocked';

type BrandWithMeta = Brand & {
  owner?: string;
  createdAt?: string;
};

type BrandRow = Brand & {
  owner: string;
  createdDate: string;
  status: BrandStatus;
};

function BrandsPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedData: BrandRow[] = (brandsMock as BrandWithMeta[]).map((item, index) => {
        const fallbackStatus: BrandStatus =
          index % 3 === 0 ? 'Blocked' : index % 2 === 0 ? 'Pending' : 'Active';

        return {
          ...item,
          owner: item.owner ?? 'N/A',
          createdDate: item.createdAt ?? '2024-01-01',
          status: (item.status as BrandStatus) ?? fallbackStatus,
        };
      });

      setBrands(normalizedData);
      setLoading(false);
    }, Math.floor(Math.random() * 401) + 800);

    return () => window.clearTimeout(timeout);
  }, []);

  const filteredBrands = useMemo(
    () =>
      brands.filter((item) => {
        const matchesSearch =
          search.trim().length === 0 ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.owner.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter.length === 0 || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [brands, search, statusFilter],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Loader variant="skeleton" lines={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Search"
          name="brandSearch"
          placeholder="Search by name, owner, or city"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Status"
          name="brandStatus"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          options={[
            { label: 'All Status', value: '' },
            { label: 'Active', value: 'Active' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Blocked', value: 'Blocked' },
          ]}
        />
      </div>

      {filteredBrands.length === 0 ? (
        <EmptyState
          title="No brands available yet"
          message="Try changing filters or add your first brand."
          icon={<Inbox className="h-5 w-5" />}
          actionLabel="Add Brand"
          onAction={() => undefined}
        />
      ) : (
        <Table headers={['Brand Name', 'Owner', 'City', 'Status', 'Created Date', 'Actions']}>
          {filteredBrands.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-800">{item.name}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === 'Active'
                      ? 'success'
                      : item.status === 'Pending'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.createdDate}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  size="sm"
                  className="!border-2 !border-emerald-400 px-3 hover:!border-emerald-500 hover:bg-emerald-50"
                  onClick={() => navigate(`/brands/${item.id}`)}
                >
                  View profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
}

export default BrandsPage;
