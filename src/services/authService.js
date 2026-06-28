const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

async function get(path) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

async function postQuery(path, params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}${path}?${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export async function signupInitiate({ firstName, lastName, email, password }) {
  return post('/auth/signup/initiate', { firstName, lastName, email, password });
}
export async function signupVerify({ email, otp }) {
  return post('/auth/signup/verify', { email, otp });
}
export async function signupResend({ email }) {
  return post('/auth/signup/resend', { email });
}
export async function login({ email, password }) {
  return post('/auth/login', { email, password });
}
export async function getUserInfo() {
  return get('/auth/me');
}
export async function forgotPasswordInitiate({ email }) {
  return postQuery('/auth/forgot-password', { email });
}
export async function forgotPasswordVerifyOtp({ email, otp }) {
  return postQuery('/auth/forgot-password/verify-otp', { email, otp });
}
export async function forgotPasswordReset({ email, newPassword }) {
  return postQuery('/auth/forgot-password/reset', { email, newPassword });
}
export function saveToken(token) { localStorage.setItem('fm_token', token); }
export function getToken() { return localStorage.getItem('fm_token'); }
export function clearToken() { localStorage.removeItem('fm_token'); }
export function isLoggedIn() { return Boolean(getToken()); }