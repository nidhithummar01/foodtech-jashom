import { useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Check,
  Cog,
  Lock,
  Moon,
  Store,
  User,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { showSuccessToast } from '../components/ui/toast';
import { settingsMock } from '../data/settings.mock';

function profileInitial(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 1) return p[0].slice(0, 1).toUpperCase();
  return 'A';
}

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settingsMock.preferences.notificationsEnabled,
  );
  const [darkModeEnabled, setDarkModeEnabled] = useState(settingsMock.preferences.darkModeEnabled);
  const [name, setName] = useState(settingsMock.profile.name);
  const [email, setEmail] = useState(settingsMock.profile.email);
  const [phone, setPhone] = useState(settingsMock.profile.phone);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [editName, setEditName] = useState(settingsMock.profile.name);
  const [editEmail, setEditEmail] = useState(settingsMock.profile.email);
  const [editPhone, setEditPhone] = useState(settingsMock.profile.phone);

  const [defaultCommissionPercent, setDefaultCommissionPercent] = useState(
    settingsMock.franchise.defaultCommissionPercent,
  );
  const [approvalRequired, setApprovalRequired] = useState(settingsMock.franchise.approvalRequired);
  const [maxOutletsPerFranchise, setMaxOutletsPerFranchise] = useState(
    settingsMock.franchise.maxOutletsPerFranchise,
  );

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

  const toggleClass = (on: boolean) =>
    `relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
      on ? 'bg-emerald-600' : 'bg-gray-300'
    }`;

  const toggleKnob = (on: boolean) =>
    `absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${
      on ? 'left-6' : 'left-0.5'
    }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile Settings */}
        <section className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-50 text-emerald-700">
                <User className="h-5 w-5" strokeWidth={2} />
              </span>
              <h2 className="text-base font-semibold text-emerald-900">Profile Settings</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              Active
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="relative mb-4">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-800 ring-2 ring-emerald-200"
                aria-hidden
              >
                {profileInitial(name)}
              </div>
              <span className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm ring-1 ring-gray-200">
                Profile
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">Name</p>
                <p className="mt-1.5 text-sm text-gray-700">{name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Phone</p>
                <p className="mt-1.5 text-sm text-gray-700">{phone}</p>
              </div>
            </div>
            <div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <p className="mt-1.5 text-sm text-gray-700">{email}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-emerald-100 pt-4">
            <Button
              type="button"
              variant="primary"
              onClick={openEditProfileModal}
              className="rounded-lg px-5 shadow-sm transition active:scale-[0.98]"
            >
              Edit Profile
            </Button>
          </div>
        </section>

        {/* Password Security */}
        <section className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Lock className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="text-base font-semibold text-emerald-900">Password Security</h2>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <Input id="settings-current-password" label="Current Password" type="password" />
            <Input id="settings-new-password" label="New Password" type="password" />
          </div>

          <div className="mt-6 border-t border-emerald-100 pt-4">
            <Button type="button" variant="primary" className="w-full rounded-lg py-2.5 shadow-sm active:scale-[0.99]">
              Update Password
            </Button>
          </div>
        </section>

        {/* System Preferences */}
        <section className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Cog className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="text-base font-semibold text-emerald-900">System Preferences</h2>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Enable Notifications</p>
                  <p className="mt-0.5 text-xs text-gray-500">Receive critical system alerts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled((prev) => !prev)}
                  className={toggleClass(notificationsEnabled)}
                  aria-pressed={notificationsEnabled}
                  aria-label="Toggle notifications"
                >
                  <span className={toggleKnob(notificationsEnabled)} />
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-emerald-700" strokeWidth={2} />
                  <p className="text-sm font-medium text-slate-800">Dark Mode</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkModeEnabled((prev) => !prev)}
                  className={toggleClass(darkModeEnabled)}
                  aria-pressed={darkModeEnabled}
                  aria-label="Toggle dark mode"
                >
                  <span className={toggleKnob(darkModeEnabled)} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Franchise Management */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <Store className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="text-base font-semibold text-emerald-900">Franchise Management</h2>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="default-commission"
            label="Default Commission (%)"
            type="number"
            value={defaultCommissionPercent}
            onChange={(event) => setDefaultCommissionPercent(event.target.value)}
          />
          <Input
            id="max-outlets"
            label="Max Outlets per Franchise"
            type="number"
            value={maxOutletsPerFranchise}
            onChange={(event) => setMaxOutletsPerFranchise(event.target.value)}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-emerald-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-100 bg-emerald-50/50 text-xs font-semibold uppercase tracking-wide text-emerald-800/70">
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Approval</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 text-slate-800">New Outlet</td>
                <td className="px-4 py-3 text-gray-600">Required when enabled below</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-emerald-100 pt-4">
          <span className="text-sm font-medium text-slate-700">Approval Required</span>
          <button
            type="button"
            onClick={() => setApprovalRequired((prev) => !prev)}
            className={toggleClass(approvalRequired)}
            aria-pressed={approvalRequired}
            aria-label="Toggle approval required"
          >
            <span className={toggleKnob(approvalRequired)} />
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50/90 p-5 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-emerald-900">Danger Zone</h2>
              <p className="mt-1 text-sm text-gray-600">
                Delete Account? This action is irreversible.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="danger"
            className="self-start rounded-lg px-5 shadow-sm"
          >
            Delete Account
          </Button>
        </div>
      </section>

      <Modal
        isOpen={isProfileEditOpen}
        title="Edit Profile"
        onClose={closeEditProfileModal}
        className="max-w-2xl max-h-[95vh] overflow-y-auto p-3"
      >
        <form className="w-full space-y-4" onSubmit={handleSaveProfile}>
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
    </div>
  );
}

export default SettingsPage;
