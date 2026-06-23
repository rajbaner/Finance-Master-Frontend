import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080'; // 🔧 Change to your backend URL

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/* ─────────────────────────────────────────
   STEP 1 — Signup Form
───────────────────────────────────────── */
function SignupFields({ form, handleChange, showPassword, setShowPassword, showConfirm, setShowConfirm, error, submitting }) {
  return (
    <>
      <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-7 xl:grid-cols-2">
        <Field
          label="First Name"
          placeholder="John"
          value={form.firstName}
          onChange={handleChange('firstName')}
          autoComplete="given-name"
          required
        />
        <Field
          label="Last Name"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange('lastName')}
          autoComplete="family-name"
          required
        />
        <Field
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
          className="xl:col-span-2"
        />
        <PasswordField
          label="Password"
          value={form.password}
          onChange={handleChange('password')}
          visible={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          autoComplete="new-password"
          required
        />
        <PasswordField
          label="Re-Enter Password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          visible={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          autoComplete="new-password"
          required
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 text-red-400 text-lg font-medium">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !!error}
        className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-fm-orange py-5 text-xl md:text-2xl font-semibold text-fm-bg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Sending OTP…' : 'Create Account'}
        {!submitting && <ArrowRight className="h-6 w-6" />}
      </button>

      <p className="mt-5 text-center text-base text-fm-silver sm:text-lg md:text-xl">
        Already have an account?{' '}
        <Link to="/login" className="text-fm-orange hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}

/* ─────────────────────────────────────────
   STEP 2 — OTP Screen
───────────────────────────────────────── */
function OTPScreen({ email, onVerify, onResend, verifying, resending, error }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleInput = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputs.current[lastFilled]?.focus();
  };

  const otpValue = otp.join('');

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-fm-orange/10 border border-fm-orange/30 flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-fm-orange" />
      </div>

      <h3 className="text-2xl sm:text-3xl font-semibold text-fm-white text-center">
        Verify Your Email
      </h3>
      <p className="mt-3 text-fm-silver text-base sm:text-lg text-center max-w-sm">
        We sent a 6-digit code to{' '}
        <span className="text-fm-orange font-medium">{email}</span>. Enter it below.
      </p>

      {/* OTP Boxes */}
      <div className="mt-10 flex gap-3 sm:gap-4" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border outline-none transition-colors
              ${digit ? 'bg-fm-input-filled text-white border-fm-orange' : 'bg-fm-input text-fm-white border-fm-border'}
              focus:border-fm-orange`}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-5 text-red-400 text-base font-medium text-center">
          {error}
        </p>
      )}

      <button
        onClick={() => onVerify(otpValue)}
        disabled={verifying || otpValue.length < 6}
        className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-fm-orange py-4 text-lg font-semibold text-fm-bg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {verifying ? 'Verifying…' : 'Verify & Sign Up'}
        {!verifying && <ArrowRight className="h-5 w-5" />}
      </button>

      <button
        onClick={onResend}
        disabled={resending}
        className="mt-4 flex items-center gap-2 text-fm-silver hover:text-fm-orange transition text-sm sm:text-base disabled:opacity-50"
      >
        <RotateCcw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
        {resending ? 'Resending…' : "Didn't get it? Resend OTP"}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Root Export
───────────────────────────────────────── */
export default function SignupForm() {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // OTP step state
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success' | 'failed'
  const [pendingEmail, setPendingEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState(null);

  /* Live password match validation */
  useEffect(() => {
    if (form.password && form.confirmPassword) {
      setError(form.password !== form.confirmPassword ? 'Passwords do not match.' : null);
    } else {
      setError(null);
    }
  }, [form.password, form.confirmPassword]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /* STEP 1 — Initiate signup (MOCKED — swap in real fetch when backend is ready) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    // 🔧 TODO: replace this timeout with the real API call below
    // const res = await fetch(`${BASE_URL}/auth/signup/initiate`, { ... });
    await new Promise((r) => setTimeout(r, 600)); // simulate network delay
    setPendingEmail(form.email);
    setStep('otp');
    setSubmitting(false);
  };

  /* STEP 2 — Verify OTP (MOCKED — swap in real fetch when backend is ready) */
  const handleVerify = async (otp) => {
    setVerifying(true);
    setOtpError(null);
    // 🔧 TODO: replace this block with the real API call:
    // const res = await fetch(`${BASE_URL}/auth/signup/verify`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: pendingEmail, otp }),
    // });
    // const data = await res.json();
    // if (!res.ok) { setStep('failed'); setVerifying(false); return; }
    // localStorage.setItem('fm_token', data.token);
    await new Promise((r) => setTimeout(r, 800));
    setVerifying(false);
    setStep('success'); // change to 'failed' to test the error screen
  };

  /* Resend OTP (MOCKED) */
  const handleResend = async () => {
    setResending(true);
    setOtpError(null);
    // 🔧 TODO: replace with real fetch(`${BASE_URL}/auth/signup/resend`, { ... })
    await new Promise((r) => setTimeout(r, 600));
    setResending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 mx-auto w-full max-w-full md:max-w-[94vw] lg:max-w-[90vw] xl:max-w-[1400px] 2xl:max-w-[1450px] rounded-3xl border border-fm-border bg-fm-bg-panel/80 backdrop-blur-md px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 xl:px-20"
    >
      {step === 'form' && (
        <>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-fm-white">
            Create Your Account
          </h2>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-fm-silver">
            Join thousands of smart investors today.
          </p>
          <SignupFields
            form={form}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            error={error}
            submitting={submitting}
          />
        </>
      )}

      {step === 'otp' && (
        <>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-fm-white">
            Almost There!
          </h2>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-fm-silver">
            Just one more step to secure your account.
          </p>
          <OTPScreen
            email={pendingEmail}
            onVerify={handleVerify}
            onResend={handleResend}
            verifying={verifying}
            resending={resending}
            error={otpError}
          />
        </>
      )}

      {step === 'success' && (
        <ResultScreen
          success
          message="User registered successfully!"
          onBack={() => { window.location.href = '/login'; }}
          backLabel="Go to Login"
        />
      )}

      {step === 'failed' && (
        <ResultScreen
          success={false}
          message="OTP verification failed. Please try again."
          onBack={() => setStep('otp')}
          backLabel="Try Again"
        />
      )}
    </form>
  );
}

/* ─────────────────────────────────────────
   STEP 3 — Result Screen (success / failed)
───────────────────────────────────────── */
function ResultScreen({ success, message, onBack, backLabel }) {
  return (
    <div className="mt-16 flex flex-col items-center py-8">
      {/* Icon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${success
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
        }`}>
        {success
          ? <CheckCircle className="w-10 h-10 text-green-400" />
          : <XCircle className="w-10 h-10 text-red-400" />
        }
      </div>

      {/* Message */}
      <h3 className={`text-2xl sm:text-3xl font-semibold text-center ${success ? 'text-green-400' : 'text-red-400'
        }`}>
        {success ? 'Registration Successful!' : 'Verification Failed'}
      </h3>
      <p className="mt-3 text-fm-silver text-base sm:text-lg text-center max-w-sm">
        {message}
      </p>

      {/* Back / next action */}
      <button
        type="button"
        onClick={onBack}
        className={`mt-10 flex items-center gap-3 rounded-2xl px-10 py-4 text-lg font-semibold transition hover:opacity-90 ${success
            ? 'bg-fm-orange text-fm-bg'
            : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
          }`}
      >
        {backLabel}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ─── Shared sub-components ─── */

function Field({ label, type = 'text', className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-3 block text-base md:text-lg lg:text-xl text-fm-silver">
        {label}
      </span>
      <input
        type={type}
        className="w-full rounded-xl border border-fm-border bg-fm-input px-6 py-5 text-lg md:text-xl text-fm-white placeholder:text-fm-silver/50 outline-none transition focus:border-fm-orange"
        {...props}
      />
    </label>
  );
}

function PasswordField({ label, visible, onToggle, ...props }) {
  return (
    <label className="block">
      <span className="mb-3 block text-base md:text-lg lg:text-xl text-fm-silver">
        {label}
      </span>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className="w-full rounded-xl border border-fm-border bg-fm-input px-6 py-5 pr-16 text-lg md:text-xl text-fm-white placeholder:text-fm-silver/50 outline-none transition focus:border-fm-orange"
          {...props}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-fm-orange"
        >
          {visible ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
        </button>
      </div>
    </label>
  );
}