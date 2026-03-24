import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { restaurantsMock } from '../data/restaurants.mock';
import type { Restaurant } from '../types/restaurant';

type RestaurantStatus = 'Active' | 'Pending' | 'Blocked';

type RestaurantWithMeta = Restaurant & {
  owner?: string;
  createdAt?: string;
};

type RestaurantRow = Restaurant & {
  owner: string;
  createdDate: string;
  status: RestaurantStatus;
};

function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantRow | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedData: RestaurantRow[] = (restaurantsMock as RestaurantWithMeta[]).map((item, index) => {
        const fallbackStatus: RestaurantStatus =
          index % 3 === 0 ? 'Blocked' : index % 2 === 0 ? 'Pending' : 'Active';

        return {
          ...item,
          owner: item.owner ?? 'N/A',
          createdDate: item.createdAt ?? '2024-01-01',
          status: (item.status as RestaurantStatus) ?? fallbackStatus,
        };
      });

      setRestaurants(normalizedData);
      setLoading(false);
    }, Math.floor(Math.random() * 401) + 800);

    return () => window.clearTimeout(timeout);
  }, []);

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter((item) => {
        const matchesSearch =
          search.trim().length === 0 ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.owner.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter.length === 0 || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [restaurants, search, statusFilter],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Restaurants</h1>
        <Loader variant="skeleton" lines={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Restaurants</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Search"
          name="restaurantSearch"
          placeholder="Search by name, owner, or city"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Status"
          name="restaurantStatus"
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

      {filteredRestaurants.length === 0 ? (
        <EmptyState
          title="No restaurants available yet"
          message="Try changing filters or add your first restaurant."
          icon={<Inbox className="h-5 w-5" />}
          actionLabel="Add Restaurant"
          onAction={() => undefined}
        />
      ) : (
        <Table headers={['Restaurant Name', 'Owner', 'City', 'Status', 'Created Date', 'Actions']}>
          {filteredRestaurants.map((item) => (
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
                <Button variant="secondary" size="sm" onClick={() => setSelectedRestaurant(item)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal
        isOpen={Boolean(selectedRestaurant)}
        title="Restaurant Details"
        onClose={() => setSelectedRestaurant(null)}
      >
        {selectedRestaurant ? (
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium text-gray-900">Name:</span> {selectedRestaurant.name}
            </p>
            <p>
              <span className="font-medium text-gray-900">Owner:</span> {selectedRestaurant.owner}
            </p>
            <p>
              <span className="font-medium text-gray-900">City:</span> {selectedRestaurant.city}
            </p>
            <p>
              <span className="font-medium text-gray-900">Status:</span> {selectedRestaurant.status}
            </p>
            <p>
              <span className="font-medium text-gray-900">Created Date:</span>{' '}
              {selectedRestaurant.createdDate}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default RestaurantsPage;
