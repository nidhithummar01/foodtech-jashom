import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Inbox } from 'lucide-react';
import { FcViewDetails } from 'react-icons/fc';
import { CiEdit } from 'react-icons/ci';
import { MdDisabledByDefault } from 'react-icons/md';
import Modal from '../components/ui/Modal';
import ViewDetailsModal, { emailPill, viewStatusPill } from '../components/ui/ViewDetailsModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { usersMock } from '../data/users.mock';
import { showSuccessToast } from '../components/ui/toast';
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

  const [selectedViewUser, setSelectedViewUser] = useState<UserRow | null>(null);
  const [selectedDisableUser, setSelectedDisableUser] = useState<UserRow | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStatus, setFormStatus] = useState<UserStatus>('Active');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');

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

  const userStatusOptions = [
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

  const editRoleOptions = useMemo(() => roleOptions.filter((opt) => opt.value !== ''), [roleOptions]);

  const openEditUserModal = (user: UserRow) => {
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setNameError('');
    setEmailError('');
    setRoleError('');
    setEditTargetId(user.id);
    setIsEditOpen(true);
  };

  const closeEditUserModal = () => {
    setIsEditOpen(false);
    setEditTargetId(null);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEditUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;
    const nextName = formName.trim();
    const nextEmail = formEmail.trim();

    if (nextName.length === 0) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (nextEmail.length === 0) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(nextEmail)) {
      setEmailError('Email format is invalid');
      valid = false;
    } else {
      setEmailError('');
    }

    if (formRole.trim().length === 0) {
      setRoleError('Role is required');
      valid = false;
    } else {
      setRoleError('');
    }

    if (!valid) return;
    if (!editTargetId) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editTargetId
          ? {
              ...u,
              name: nextName,
              email: nextEmail,
              role: formRole,
              status: formStatus,
            }
          : u,
      ),
    );

    setIsEditOpen(false);
    setEditTargetId(null);
    showSuccessToast('User updated (demo)');
  };

  const handleConfirmDisable = () => {
    if (!selectedDisableUser) return;
    const id = selectedDisableUser.id;

    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Disabled' } : u)));
    setSelectedDisableUser(null);
    showSuccessToast('User disabled');
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
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 w-7 min-w-0 shrink-0 !border-2 !border-emerald-400 p-0 hover:!border-emerald-500 hover:bg-emerald-50"
                          aria-label="View user"
                          onClick={() => setSelectedViewUser(user)}
                        >
                          <FcViewDetails className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => openEditUserModal(user)}
                        >
                          <CiEdit className="h-4 w-4 shrink-0" aria-hidden />
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setSelectedDisableUser(user)}
                        >
                          <MdDisabledByDefault className="h-4 w-4 shrink-0" aria-hidden />
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

      <ViewDetailsModal
        isOpen={Boolean(selectedViewUser)}
        onClose={() => setSelectedViewUser(null)}
        title="View Profile"
        compact
        initialsFrom={selectedViewUser?.name ?? ''}
        rows={
          selectedViewUser
            ? [
                {
                  label: 'Name:',
                  value: (
                    <span className="font-semibold text-slate-900">{selectedViewUser.name}</span>
                  ),
                },
                { label: 'Email:', value: emailPill(selectedViewUser.email, true) },
                {
                  label: 'Role:',
                  value: (
                    <span className="font-semibold text-slate-900">{selectedViewUser.role}</span>
                  ),
                },
                { label: 'Status:', value: viewStatusPill(selectedViewUser.status) },
                { label: 'Created Date:', value: selectedViewUser.createdDate },
              ]
            : []
        }
      />

      <Modal
        isOpen={Boolean(selectedDisableUser)}
        title="Disable"
        onClose={() => setSelectedDisableUser(null)}
        showCloseButton={false}
      >
        {selectedDisableUser ? (
          <div className="space-y-3 text-sm text-gray-700">
            <p>Disable action (demo mode)</p>
            <p>
              Are you sure you want to disable <span className="font-medium text-gray-900">{selectedDisableUser.name}</span>?
            </p>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSelectedDisableUser(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDisable}>
            <span className="inline-flex items-center gap-1.5">
              <MdDisabledByDefault className="h-4 w-4 shrink-0" aria-hidden />
              Disable
            </span>
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        title="Edit User"
        onClose={closeEditUserModal}
        className="max-w-2xl max-h-[95vh] overflow-y-auto p-3"
      >
        <form className="space-y-4 w-full" onSubmit={handleEditUserSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              id="user-name"
              type="text"
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
              error={nameError}
            />
            <Input
              label="Email"
              id="user-email"
              type="email"
              value={formEmail}
              onChange={(event) => setFormEmail(event.target.value)}
              error={emailError}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Role"
              id="user-role"
              value={formRole}
              onChange={(event) => setFormRole(event.target.value)}
              options={
                editRoleOptions.length > 0
                  ? editRoleOptions
                  : [
                      { label: 'Admin', value: 'Admin' },
                      { label: 'User', value: 'User' },
                    ]
              }
              error={roleError}
            />

            <Select
              label="Status"
              id="user-status"
              value={formStatus}
              onChange={(event) => setFormStatus(event.target.value as UserStatus)}
              options={userStatusOptions}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={closeEditUserModal}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersPage;
