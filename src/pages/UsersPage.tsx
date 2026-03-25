import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { usersMock } from '../data/users.mock';
import type { User } from '../types/user';

type UserStatus = 'Active' | 'Disabled';

type UserWithMeta = User & {
  status?: UserStatus;
  createdAt?: string;
};

type UserRow = Omit<User, never> & {
  status: UserStatus;
  createdDate: string;
};

const PAGE_SIZE = 5;
const FAKE_TOTAL_PAGES = 5;

function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timeout = window.setTimeout(() => {
      const normalizedUsers: UserRow[] = (usersMock as UserWithMeta[]).map((user, index) => ({
        ...user,
        status: user.status ?? (index % 3 === 0 ? 'Disabled' : 'Active'),
        createdDate: user.createdAt ?? '2024-01-01',
      }));
      setUsers(normalizedUsers);
      setLoading(false);
    }, Math.floor(Math.random() * 401) + 800);

    return () => window.clearTimeout(timeout);
  }, []);

  const roleOptions = useMemo(
    () => [
      { label: 'All Roles', value: '' },
      ...Array.from(new Set(users.map((user) => user.role))).map((item) => ({
        label: item,
        value: item,
      })),
    ],
    [users],
  );

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Disabled', value: 'Disabled' },
  ];

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          search.trim().length === 0 ||
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter.length === 0 || user.role === roleFilter;
        const matchesStatus = statusFilter.length === 0 || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      }),
    [users, search, roleFilter, statusFilter],
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const handleUserAction = (action: 'View' | 'Edit' | 'Disable') => {
    alert(`${action} action (demo mode)`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-emerald-900">Users</h1>

      {loading ? (
        <Loader variant="skeleton" lines={6} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              label="Search"
              name="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              label="Role"
              name="roleFilter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              options={roleOptions}
            />
            <Select
              label="Status"
              name="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={statusOptions}
            />
          </div>

          {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          message="Try changing filters or add your first user."
          icon={<Inbox className="h-5 w-5" />}
          actionLabel="Add User"
          onAction={() => undefined}
        />
          ) : (
            <>
              <Table headers={['Name', 'Email', 'Role', 'Status', 'Created Date', 'Actions']}>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleUserAction('View')}>
                          View
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleUserAction('Edit')}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleUserAction('Disable')}>
                          Disable
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>

              <Pagination
                currentPage={currentPage}
                totalPages={FAKE_TOTAL_PAGES}
                onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                onNext={() => setCurrentPage((prev) => Math.min(FAKE_TOTAL_PAGES, prev + 1))}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default UsersPage;
