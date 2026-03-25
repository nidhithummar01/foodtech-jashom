import { useState, type FormEvent } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { showSuccessToast } from '../components/ui/toast';

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phone);

  const [defaultCommissionPercent, setDefaultCommissionPercent] = useState('10');
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [maxOutletsPerFranchise, setMaxOutletsPerFranchise] = useState('50');

  const openEditProfileModal = () => {
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setNameError('');
    setEmailError('');
    setIsProfileEditOpen(true);
  };

  const closeEditProfileModal = () => {
    setIsProfileEditOpen(false);
    setNameError('');
    setEmailError('');
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;

    if (editName.trim().length === 0) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (editEmail.trim().length === 0) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!isValid) {
      return;
    }

    setName(editName.trim());
    setEmail(editEmail.trim());
    setPhone(editPhone.trim());
    setIsProfileEditOpen(false);

    showSuccessToast('Settings updated (demo)');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">Settings</h1>

      <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-emerald-900">Profile Settings</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="settings-name" label="Name" type="text" value={name} disabled />
          <Input id="settings-email" label="Email" type="email" value={email} disabled />
          <Input id="settings-phone" label="Phone" type="tel" value={phone} disabled />
        </div>
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            onClick={openEditProfileModal}
            className="transition-all duration-150 active:scale-95"
          >
            Edit
          </Button>
        </div>
      </section>

      <Modal
        isOpen={isProfileEditOpen}
        title="Edit Profile"
        onClose={closeEditProfileModal}
        className="max-w-2xl max-h-[95vh] overflow-y-auto p-3"
      >
        <form className="space-y-4 w-full" onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="settings-name-edit"
              label="Name"
              type="text"
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);
                if (nameError) setNameError('');
              }}
              error={nameError}
            />
            <Input
              id="settings-email-edit"
              label="Email"
              type="email"
              value={editEmail}
              onChange={(event) => {
                setEditEmail(event.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
            />
            <Input
              id="settings-phone-edit"
              label="Phone"
              type="tel"
              value={editPhone}
              onChange={(event) => setEditPhone(event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeEditProfileModal}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <section className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Password</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="settings-current-password" label="Current Password" type="password" />
          <Input id="settings-new-password" label="New Password" type="password" />
        </div>
        <div className="mt-4">
          <Button className="transition-all duration-150 active:scale-95">Update Password</Button>
        </div>
      </section>

      <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-emerald-900">System Settings</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setNotificationsEnabled((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                notificationsEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              aria-pressed={notificationsEnabled}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ${
                  notificationsEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium text-gray-700">Dark Mode</span>
            <button
              type="button"
              onClick={() => setDarkModeEnabled((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                darkModeEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              aria-pressed={darkModeEnabled}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ${
                  darkModeEnabled ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-emerald-900">Franchise Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="default-commission"
              label="Default commission (%)"
              type="number"
              value={defaultCommissionPercent}
              onChange={(event) => setDefaultCommissionPercent(event.target.value)}
            />
            <Input
              id="max-outlets"
              label="Max outlets per franchise"
              type="number"
              value={maxOutletsPerFranchise}
              onChange={(event) => setMaxOutletsPerFranchise(event.target.value)}
            />
          </div>

          <label className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium text-gray-700">Approval required</span>
            <button
              type="button"
              onClick={() => setApprovalRequired((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                approvalRequired ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              aria-pressed={approvalRequired}
              aria-label="Toggle approval required"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ${
                  approvalRequired ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
        <p className="mt-1 text-sm text-gray-600">This action is irreversible.</p>
        <div className="mt-4">
          <Button className="bg-red-500 text-white transition-all duration-150 hover:bg-red-600 active:scale-95">
            Delete Account
          </Button>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
