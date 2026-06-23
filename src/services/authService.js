/**
 * authService.js
 * ---------------------------------------------------------
 * Placeholder for the real auth API client. Nothing here is
 * wired up yet — SignupForm.jsx currently just console.logs
 * the form values on submit.
 *
 * WHEN YOU ADD THE BACKEND, do this:
 *
 * 1. Set your API base URL as an env var so it's not
 *    hardcoded. Create a `.env` file at the project root:
 *
 *      VITE_API_BASE_URL=https://api.yourapp.com
 *
 *    (Vite only exposes vars prefixed with VITE_ to the
 *    client — see https://vite.dev/guide/env-and-mode)
 *
 * 2. Implement registerUser() below to call your real
 *    endpoint, e.g.:
 *
 *      export async function registerUser(formData) {
 *        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
 *          method: 'POST',
 *          headers: { 'Content-Type': 'application/json' },
 *          body: JSON.stringify({
 *            firstName: formData.firstName,
 *            lastName: formData.lastName,
 *            username: formData.username,
 *            email: formData.email,
 *            password: formData.password,
 *          }),
 *        });
 *
 *        if (!res.ok) {
 *          const body = await res.json().catch(() => ({}));
 *          throw new Error(body.message || 'Registration failed');
 *        }
 *
 *        return res.json(); // expect { token, user }
 *      }
 *
 * 3. In src/components/SignupForm.jsx, import this function
 *    and replace the TODO block inside handleSubmit with:
 *
 *      setSubmitting(true);
 *      try {
 *        const { token, user } = await registerUser(form);
 *        // store token (see notes below) and redirect
 *      } catch (err) {
 *        setError(err.message);
 *      } finally {
 *        setSubmitting(false);
 *      }
 *
 * 4. Token storage / session handling is a separate decision
 *    (httpOnly cookie set by the server is the safer option
 *    vs localStorage). Add that logic here once the backend
 *    contract is finalized — don't bolt it onto the form
 *    component directly, keep it in this service file.
 *
 * 5. Also add a matching loginUser() export here once the
 *    "Log in" page/flow exists, and a useAuth() hook or
 *    context if you need auth state available app-wide.
 */

export async function registerUser(formData) {
  throw new Error(
    'registerUser() is not implemented yet — see comments in authService.js'
  );
}
