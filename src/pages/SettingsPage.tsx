import { useState, type FormEvent } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { showSuccessToast } from '../components/ui/toast';

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;

    if (name.trim().length === 0) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (email.trim().length === 0) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!isValid) {
      return;
    }

    showSuccessToast('Settings updated (demo)');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Settings</h1>

      <section className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
        <form onSubmit={handleSaveProfile}>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="settings-name"
              label="Name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (nameError) {
                  setNameError('');
                }
              }}
              error={nameError}
            />
            <Input
              id="settings-email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) {
                  setEmailError('');
                }
              }}
              error={emailError}
            />
            <Input
              id="settings-phone"
              label="Phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" className="transition-all duration-150 active:scale-95">
              Save Changes
            </Button>
          </div>
        </form>
      </section>

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

      <section className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setNotificationsEnabled((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                notificationsEnabled ? 'bg-black' : 'bg-gray-300'
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
                darkModeEnabled ? 'bg-black' : 'bg-gray-300'
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
