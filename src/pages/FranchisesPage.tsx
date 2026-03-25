import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Inbox } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Table, { TableCell, TableRow } from '../components/ui/Table';
import { showInfoToast, showSuccessToast } from '../components/ui/toast';
import { franchisesMock } from '../data/franchises.mock';
import type { Franchise, FranchiseStatus } from '../types/franchise';

const PAGE_SIZE = 5;

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatInrToL(amount: number) {
  // Display like ₹2.5L for 2,50,000
  if (amount >= 100000) {
    const l = amount / 100000;
    const rounded = l.toFixed(1).replace(/\.0$/, '');
    return `₹${rounded}L`;
  }
  return formatInr(amount);
}

function statusVariant(status: FranchiseStatus) {
  if (status === 'Active') {
    return 'success';
  }
  if (status === 'Pending') {
    return 'warning';
  }
  return 'danger';
}

type LinkedRestaurantStatus = 'Active' | 'Pending' | 'Blocked';

type LinkedRestaurant = {
  id: string;
  name: string;
  city: string;
  status: LinkedRestaurantStatus;
};

const restaurantsByFranchiseId: Record<string, LinkedRestaurant[]> = {
  'FRA-001': [
    { id: 'R-001', name: 'Green Bites North - Outlet 1', city: 'Ahmedabad', status: 'Active' },
    { id: 'R-002', name: 'Green Bites North - Outlet 2', city: 'Ahmedabad', status: 'Pending' },
  ],
  'FRA-002': [{ id: 'R-003', name: 'Spice Route Central - Outlet 1', city: 'Surat', status: 'Active' }],
  'FRA-003': [],
};

function linkedRestaurantStatusVariant(status: LinkedRestaurantStatus) {
  if (status === 'Active') return 'success';
  if (status === 'Pending') return 'warning';
  return 'danger';
}

function FranchisesPage() {
  const [loading, setLoading] = useState(true);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  const [formFranchiseName, setFormFranchiseName] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formOutlets, setFormOutlets] = useState('');
  const [formInitialInvestment, setFormInitialInvestment] = useState('');
  const [formAgreementStartDate, setFormAgreementStartDate] = useState('');
  const [formStatus, setFormStatus] = useState<FranchiseStatus>('Pending');

  const [franchiseNameError, setFranchiseNameError] = useState('');
  const [ownerNameError, setOwnerNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');
  const [outletsError, setOutletsError] = useState('');
  const [agreementStartDateError, setAgreementStartDateError] = useState('');

  useEffect(() => {
    setLoading(true);
    const timeout = window.setTimeout(() => {
      setFranchises(franchisesMock);
      setLoading(false);
    }, Math.floor(Math.random() * 401) + 800);

    return () => window.clearTimeout(timeout);
  }, []);

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(franchises.map((item) => item.city))).sort();
    return [{ label: 'All Cities', value: '' }, ...cities.map((city) => ({ label: city, value: city }))];
  }, [franchises]);

  const normalizePhoneDigits = (phone: string) => phone.replace(/\D/g, '');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const openAddFranchiseModal = () => {
    setFormFranchiseName('');
    setFormOwnerName('');
    setFormEmail('');
    setFormPhone('');
    setFormCity('');
    setFormOutlets('');
    setFormInitialInvestment('');
    setFormAgreementStartDate('');
    setFormStatus('Pending');

    setFranchiseNameError('');
    setOwnerNameError('');
    setEmailError('');
    setPhoneError('');
    setCityError('');
    setOutletsError('');
    setAgreementStartDateError('');

    setIsEditMode(false);
    setEditTargetId(null);
    setIsAddOpen(true);
  };

  const closeAddFranchiseModal = () => {
    setIsAddOpen(false);
    setIsEditMode(false);
    setEditTargetId(null);
  };

  const openEditFranchiseModal = (franchise: Franchise) => {
    setFormFranchiseName(franchise.name);
    setFormOwnerName(franchise.owner);
    setFormEmail(franchise.email);
    setFormPhone(franchise.phone);
    setFormCity(franchise.city);
    setFormOutlets(String(franchise.outlets));
    setFormInitialInvestment(
      typeof franchise.initialInvestment === 'number' && Number.isFinite(franchise.initialInvestment)
        ? String(franchise.initialInvestment)
        : '',
    );
    setFormAgreementStartDate(franchise.agreementStartDate);
    setFormStatus(franchise.status);

    setFranchiseNameError('');
    setOwnerNameError('');
    setEmailError('');
    setPhoneError('');
    setCityError('');
    setOutletsError('');
    setAgreementStartDateError('');

    setIsEditMode(true);
    setEditTargetId(franchise.id);
    setIsAddOpen(true);
  };

  const handleAddFranchiseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;

    const nextFranchiseName = formFranchiseName.trim();
    const nextOwnerName = formOwnerName.trim();
    const nextEmail = formEmail.trim();
    const nextPhoneDigits = normalizePhoneDigits(formPhone);
    const nextCity = formCity.trim();
    const nextAgreementStartDate = formAgreementStartDate;
    const outletsNum = Number(formOutlets);
    const initialInvestmentNumRaw =
      formInitialInvestment.trim().length > 0 ? Number(formInitialInvestment) : undefined;
    const initialInvestmentNum = Number.isFinite(initialInvestmentNumRaw) ? initialInvestmentNumRaw : undefined;

    if (nextFranchiseName.length === 0) {
      setFranchiseNameError('Franchise Name is required');
      valid = false;
    } else {
      setFranchiseNameError('');
    }

    if (nextOwnerName.length === 0) {
      setOwnerNameError('Owner Name is required');
      valid = false;
    } else {
      setOwnerNameError('');
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

    if (nextPhoneDigits.length === 0) {
      setPhoneError('Phone is required');
      valid = false;
    } else if (nextPhoneDigits.length !== 10) {
      setPhoneError('Phone must be 10 digits');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (nextCity.length === 0) {
      setCityError('City is required');
      valid = false;
    } else {
      setCityError('');
    }

    if (!Number.isFinite(outletsNum) || outletsNum <= 0) {
      setOutletsError('Number of Outlets is required');
      valid = false;
    } else {
      setOutletsError('');
    }

    if (nextAgreementStartDate.trim().length === 0) {
      setAgreementStartDateError('Agreement Start Date is required');
      valid = false;
    } else {
      setAgreementStartDateError('');
    }

    if (!valid) {
      return;
    }

    const payload = {
      name: nextFranchiseName,
      owner: nextOwnerName,
      email: nextEmail,
      phone: nextPhoneDigits,
      city: nextCity,
      outlets: outletsNum,
      revenue: initialInvestmentNum ?? 0,
      status: formStatus,
      createdAt: nextAgreementStartDate,
      initialInvestment: initialInvestmentNum,
      agreementStartDate: nextAgreementStartDate,
    };

    if (isEditMode && editTargetId) {
      setFranchises((prev) =>
        prev.map((item) => (item.id === editTargetId ? { ...item, ...payload } : item)),
      );
      setIsAddOpen(false);
      setIsEditMode(false);
      setEditTargetId(null);
      setCurrentPage(1);
      showSuccessToast('Franchise updated (demo)');
      return;
    }

    const newFranchise: Franchise = {
      id: `FRA-${Date.now()}`,
      ...payload,
    };

    setFranchises((prev) => [newFranchise, ...prev]);
    setIsAddOpen(false);
    setCurrentPage(1);
    showSuccessToast('Franchise added successfully (demo)');
  };

  const filteredFranchises = useMemo(
    () =>
      franchises.filter((item) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          item.name.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q);
        const matchesStatus = statusFilter.length === 0 || item.status === statusFilter;
        const matchesCity = cityFilter.length === 0 || item.city === cityFilter;
        return matchesSearch && matchesStatus && matchesCity;
      }),
    [franchises, search, statusFilter, cityFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredFranchises.length / PAGE_SIZE));
  const paginatedFranchises = filteredFranchises.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, cityFilter]);

  const handleViewDetails = (franchise: Franchise) => {
    setSelectedFranchise(franchise);
  };

  const handleEdit = (franchise: Franchise) => {
    openEditFranchiseModal(franchise);
  };

  const closeDetailsModal = () => setSelectedFranchise(null);

  const handleApprove = (franchise: Franchise) => {
    setFranchises((prev) => prev.map((item) => (item.id === franchise.id ? { ...item, status: 'Active' } : item)));
    setSelectedFranchise((prev) => (prev && prev.id === franchise.id ? { ...prev, status: 'Active' } : prev));
    showInfoToast('Franchise approved');
  };

  const handleReject = (franchise: Franchise) => {
    setFranchises((prev) => prev.map((item) => (item.id === franchise.id ? { ...item, status: 'Rejected' } : item)));
    setSelectedFranchise((prev) => (prev && prev.id === franchise.id ? { ...prev, status: 'Rejected' } : prev));
    showInfoToast('Franchise rejected');
  };

  const handleDelete = (franchise: Franchise) => {
    showInfoToast(`Delete: ${franchise.name} (demo)`);
  };

  const linkedRestaurants = selectedFranchise ? restaurantsByFranchiseId[selectedFranchise.id] ?? [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">Franchises</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage franchise partners who own or operate multiple restaurants under your brand.
          </p>
        </div>
        <div>
          <Button onClick={openAddFranchiseModal} className="rounded-lg">
            Add Franchise
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader variant="skeleton" lines={8} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              label="Search"
              name="franchiseSearch"
              placeholder="Search by franchise name or owner"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              label="Status"
              name="franchiseStatus"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={[
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
            />
            <Select
              label="City"
              name="franchiseCity"
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              options={cityOptions}
            />
          </div>

          {filteredFranchises.length === 0 ? (
            <EmptyState
              title="No franchises found"
              message="Start by adding your first franchise partner."
              icon={<Inbox className="h-5 w-5" />}
              actionLabel="Add Franchise"
              onAction={openAddFranchiseModal}
            />
          ) : (
            <>
              <Table
                headers={[
                  'Franchise Name',
                  'Owner',
                  'City',
                  'Outlets',
                  'Revenue',
                  'Status',
                  'Created Date',
                  'Actions',
                ]}
              >
                {paginatedFranchises.map((franchise) => (
                  <TableRow key={franchise.id}>
                    <TableCell className="font-medium text-gray-800">{franchise.name}</TableCell>
                    <TableCell>{franchise.owner}</TableCell>
                    <TableCell>{franchise.city}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        {franchise.outlets} Outlets
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        {formatInrToL(franchise.revenue)} Revenue
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(franchise.status)}>{franchise.status}</Badge>
                    </TableCell>
                    <TableCell>{franchise.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex flex-nowrap items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleViewDetails(franchise)}>
                          View Details
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(franchise)}>
                          Edit
                        </Button>
                        {franchise.status === 'Pending' ? (
                          <>
                            <Button variant="primary" size="sm" onClick={() => handleApprove(franchise)}>
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleReject(franchise)}>
                              Reject
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(franchise)}>
                              Delete
                            </Button>
                          </>
                        ) : null}
                        {franchise.status !== 'Pending' ? (
                          <Button variant="danger" size="sm" onClick={() => handleDelete(franchise)}>
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              />
            </>
          )}
        </>
      )}

      <Modal
        isOpen={isAddOpen}
        title={isEditMode ? 'Edit Franchise' : 'Add Franchise'}
        onClose={closeAddFranchiseModal}
        className="max-w-3xl max-h-[95vh] overflow-y-auto p-3"
      >
        <form className="space-y-4 w-full" onSubmit={handleAddFranchiseSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="franchise-name"
              label="Franchise Name"
              type="text"
              value={formFranchiseName}
              onChange={(event) => setFormFranchiseName(event.target.value)}
              error={franchiseNameError}
            />

            <Input
              id="franchise-owner-name"
              label="Owner Name"
              type="text"
              value={formOwnerName}
              onChange={(event) => setFormOwnerName(event.target.value)}
              error={ownerNameError}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="franchise-email"
              label="Email"
              type="email"
              value={formEmail}
              onChange={(event) => setFormEmail(event.target.value)}
              error={emailError}
            />

            <Input
              id="franchise-phone"
              label="Phone"
              type="tel"
              value={formPhone}
              onChange={(event) => setFormPhone(event.target.value)}
              error={phoneError}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="franchise-city"
              label="City"
              value={formCity}
              onChange={(event) => setFormCity(event.target.value)}
              placeholder="Select City"
              options={cityOptions.filter((c) => c.value !== '')}
              error={cityError}
            />

            <Input
              id="franchise-outlets"
              label="Number of Outlets"
              type="number"
              value={formOutlets}
              onChange={(event) => setFormOutlets(event.target.value)}
              error={outletsError}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="franchise-initial-investment"
              label="Initial Investment (optional)"
              type="number"
              value={formInitialInvestment}
              onChange={(event) => setFormInitialInvestment(event.target.value)}
            />

            <Input
              id="franchise-agreement-start-date"
              label="Agreement Start Date"
              type="date"
              value={formAgreementStartDate}
              onChange={(event) => setFormAgreementStartDate(event.target.value)}
              error={agreementStartDateError}
            />
          </div>

          <Select
            id="franchise-status"
            label="Status"
            value={formStatus}
            onChange={(event) => setFormStatus(event.target.value as FranchiseStatus)}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Rejected', value: 'Rejected' },
            ]}
          />

          <div>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Franchise'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(selectedFranchise)} title="Franchise Details" onClose={closeDetailsModal}>
        {selectedFranchise ? (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="space-y-1">
              <p>
                <span className="font-medium text-emerald-900">Franchise Name:</span> {selectedFranchise.name}
              </p>
              <p>
                <span className="font-medium text-emerald-900">Owner Info:</span> {selectedFranchise.owner}
              </p>
              <p>
                <span className="font-medium text-emerald-900">Contact Details:</span> {selectedFranchise.email},{' '}
                {selectedFranchise.phone}
              </p>
              <p>
                <span className="font-medium text-emerald-900">City:</span> {selectedFranchise.city}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-900">Status:</span>
                <Badge variant={statusVariant(selectedFranchise.status)}>{selectedFranchise.status}</Badge>
              </div>
              <p>
                <span className="font-medium text-emerald-900">Total Outlets:</span> {selectedFranchise.outlets}
              </p>
              <p>
                <span className="font-medium text-emerald-900">Revenue:</span> {formatInr(selectedFranchise.revenue)}
              </p>
              <p>
                <span className="font-medium text-emerald-900">Joined Date:</span> {selectedFranchise.agreementStartDate}
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-emerald-900">List of Restaurants under this franchise (mock)</h3>
              {linkedRestaurants.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">No restaurants linked yet</p>
              ) : (
                <ul className="mt-2 divide-y divide-gray-100">
                  {linkedRestaurants.map((restaurant) => (
                    <li key={restaurant.id} className="flex items-center justify-between py-2">
                      <div className="pr-3">
                        <p className="font-medium text-gray-800">{restaurant.name}</p>
                        <p className="text-sm text-gray-500">{restaurant.city}</p>
                      </div>
                      <Badge variant={linkedRestaurantStatusVariant(restaurant.status)}>{restaurant.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default FranchisesPage;
