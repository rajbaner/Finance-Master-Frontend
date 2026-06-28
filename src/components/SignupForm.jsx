import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signupInitiate, signupVerify, signupResend, saveToken } from '../services/authService';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validatePassword = (password) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

const isPasswordValid = (rules) => Object.values(rules).every(Boolean);

function PasswordRule({ satisfied, text }) {
  return (
    <div className={`flex items-center gap-2 text-sm md:text-base mt-1 ${satisfied ? 'text-green-400' : 'text-red-400'}`}>
      {satisfied ? <span className="font-bold">✓</span> : <span className="font-bold">✕</span>}
      <span>{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 1 — Signup Fields
───────────────────────────────────────── */
function SignupFields({ form, handleChange, showPassword, setShowPassword, showConfirm, setShowConfirm, error, submitting }) {
  const pwdRules = validatePassword(form.password);

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
        <div className="flex flex-col">
          <PasswordField
            label="Password"
            value={form.password}
            onChange={handleChange('password')}
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
            required
          />
          <div className="mt-3 flex flex-col gap-1 pl-2">
            <PasswordRule satisfied={pwdRules.length} text="Minimum 8 characters" />
            <PasswordRule satisfied={pwdRules.uppercase} text="At least 1 uppercase" />
            <PasswordRule satisfied={pwdRules.lowercase} text="At least 1 lowercase" />
            <PasswordRule satisfied={pwdRules.number} text="At least 1 number" />
            <PasswordRule satisfied={pwdRules.special} text="At least 1 special char" />
          </div>
        </div>
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
        type="button"
        onClick={() => onVerify(otpValue)}
        disabled={verifying || otpValue.length < 6}
        className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-fm-orange py-4 text-lg font-semibold text-fm-bg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {verifying ? 'Verifying…' : 'Verify & Sign Up'}
        {!verifying && <ArrowRight className="h-5 w-5" />}
      </button>

      <button
        type="button"
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
   STEP 3 — Result Screen
───────────────────────────────────────── */
function ResultScreen({ success, message, onBack, backLabel }) {
  return (
    <div className="mt-16 flex flex-col items-center py-8">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
        {success
          ? <CheckCircle className="w-10 h-10 text-green-400" />
          : <XCircle className="w-10 h-10 text-red-400" />
        }
      </div>

      <h3 className={`text-2xl sm:text-3xl font-semibold text-center ${success ? 'text-green-400' : 'text-red-400'
        }`}>
        {success ? 'Registration Successful!' : 'Verification Failed'}
      </h3>
      <p className="mt-3 text-fm-silver text-base sm:text-lg text-center max-w-sm">
        {message}
      </p>

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

/* ─────────────────────────────────────────
   Root Export
───────────────────────────────────────── */
export default function SignupForm() {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    if (form.password && form.confirmPassword) {
      setError(form.password !== form.confirmPassword ? 'Passwords do not match.' : null);
    } else {
      setError(null);
    }
  }, [form.password, form.confirmPassword]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /* STEP 1 — POST /auth/signup/initiate */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pwdRules = validatePassword(form.password);
    const passwordValid = isPasswordValid(pwdRules);

    if (!passwordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signupInitiate({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      setPendingEmail(form.email);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* STEP 2 — POST /auth/signup/verify */
  const handleVerify = async (otp) => {
    setVerifying(true);
    setOtpError(null);
    try {
      const data = await signupVerify({ email: pendingEmail, otp });
      saveToken(data.token);
      setResultMessage(data.message || 'User registered successfully!');
      setStep('success');
    } catch (err) {
      setOtpError(err.message);
      setResultMessage(err.message);
      setStep('failed');
    } finally {
      setVerifying(false);
    }
  };

  /* Resend OTP — POST /auth/signup/resend */
  const handleResend = async () => {
    setResending(true);
    setOtpError(null);
    try {
      await signupResend({ email: pendingEmail });
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setResending(false);
    }
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
          message={resultMessage}
          onBack={() => { window.location.href = '/login'; }}
          backLabel="Go to Login"
        />
      )}

      {step === 'failed' && (
        <ResultScreen
          success={false}
          message={resultMessage}
          onBack={() => { setStep('otp'); setOtpError(null); }}
          backLabel="Try Again"
        />
      )}
    </form>
  );
}

/* ─── Shared sub-components ─── */

function Field({ label, type = 'text', className = '', value, ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-3 block text-base md:text-lg lg:text-xl text-fm-silver">
        {label}
      </span>
      <input
        type={type}
        value={value}
        className={`w-full rounded-xl border border-fm-border px-6 py-5 text-lg md:text-xl placeholder:text-fm-silver/50 outline-none transition focus:border-fm-orange ${value ? 'bg-fm-input-filled text-white/80 font-medium' : 'bg-fm-input text-fm-white'
          }`}
        {...props}
      />
    </label>
  );
}

function PasswordField({ label, visible, onToggle, value, ...props }) {
  return (
    <label className="block">
      <span className="mb-3 block text-base md:text-lg lg:text-xl text-fm-silver">
        {label}
      </span>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          className={`w-full rounded-xl border border-fm-border px-6 py-5 pr-16 text-lg md:text-xl placeholder:text-fm-silver/50 outline-none transition focus:border-fm-orange ${value ? 'bg-fm-input-filled text-white/80 font-medium' : 'bg-fm-input text-fm-white'
            }`}
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