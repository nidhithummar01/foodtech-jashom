const AUTH_KEY = 'admin_is_authenticated';

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function setAuthenticated(value: boolean) {
  if (typeof window === 'undefined') return;
  if (value) {
    window.sessionStorage.setItem(AUTH_KEY, 'true');
    return;
  }
  window.sessionStorage.removeItem(AUTH_KEY);
}

