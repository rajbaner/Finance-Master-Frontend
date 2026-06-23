import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080'; // 🔧 Change to your backend URL

const initialState = { email: '', password: '' };

export default function LoginForm() {
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('form'); // 'form' | 'success' | 'failed'

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        // 🔧 TODO: replace this block with the real API call:
        // const res = await fetch(`${BASE_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: form.email, password: form.password }),
        // });
        // const data = await res.json();
        // if (!res.ok) { setStep('failed'); setSubmitting(false); return; }
        // localStorage.setItem('fm_token', data.token);
        await new Promise((r) => setTimeout(r, 800));
        setSubmitting(false);
        setStep('success'); // change to 'failed' to test the error screen
    };

    if (step === 'success') {
        return (
            <ResultScreen
                success
                title="Login Successful!"
                message="Welcome back! Redirecting you to your dashboard…"
                actionLabel="Go to Dashboard"
                onAction={() => { window.location.href = '/dashboard'; }} // 🔧 Update path
            />
        );
    }

    if (step === 'failed') {
        return (
            <ResultScreen
                success={false}
                title="Login Failed"
                message="Invalid email or password. Please check your credentials and try again."
                actionLabel="Try Again"
                onAction={() => setStep('form')}
            />
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-fm-border bg-fm-bg-panel/80 p-6 backdrop-blur-sm sm:p-8 md:p-10"
        >
            <div className="mt-6 space-y-4">
                <Field
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    autoComplete="email"
                    required
                />
                <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={handleChange('password')}
                    visible={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    autoComplete="current-password"
                    required
                />
            </div>

            {error && (
                <p role="alert" className="mt-3 text-sm text-red-400 md:text-base">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-fm-orange py-3.5 text-base font-semibold text-fm-bg transition-opacity hover:opacity-90 disabled:opacity-60 sm:py-4 sm:text-lg md:text-xl"
            >
                {submitting ? 'Signing In…' : 'Sign In'}
                {!submitting && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            <p className="mt-5 text-center text-base text-fm-silver sm:text-lg md:text-xl">
                Don't have an account?{' '}
                <Link to="/" className="text-fm-orange hover:underline">
                    Create one
                </Link>
            </p>
        </form>
    );
}

/* ─── Result Screen ─── */
function ResultScreen({ success, title, message, actionLabel, onAction }) {
    return (
        <div className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-fm-border bg-fm-bg-panel/80 p-6 backdrop-blur-sm sm:p-8 md:p-10">
            <div className="flex flex-col items-center py-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${success
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    {success
                        ? <CheckCircle className="w-10 h-10 text-green-400" />
                        : <XCircle className="w-10 h-10 text-red-400" />
                    }
                </div>

                <h3 className={`text-2xl sm:text-3xl font-semibold text-center ${success ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {title}
                </h3>
                <p className="mt-3 text-fm-silver text-base sm:text-lg text-center max-w-sm">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onAction}
                    className={`mt-10 flex items-center gap-3 rounded-2xl px-10 py-4 text-lg font-semibold transition hover:opacity-90 ${success
                            ? 'bg-fm-orange text-fm-bg'
                            : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                        }`}
                >
                    {actionLabel}
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

/* ─── Shared sub-components ─── */

function Field({ label, type = 'text', value, ...props }) {
    const filled = Boolean(value);
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm text-fm-silver sm:text-base md:mb-2 md:text-lg">
                {label}
            </span>
            <input
                type={type}
                value={value}
                className={`w-full rounded-lg border border-fm-border px-4 py-3 text-base font-medium placeholder:font-normal placeholder:text-fm-silver/50 outline-none transition-colors focus:border-fm-orange sm:py-3.5 sm:text-lg md:py-4 md:text-xl ${filled ? 'bg-fm-input-filled text-white/80' : 'bg-fm-input text-fm-white'
                    }`}
                {...props}
            />
        </label>
    );
}

function PasswordField({ label, visible, onToggle, value, ...props }) {
    const filled = Boolean(value);
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm text-fm-silver sm:text-base md:mb-2 md:text-lg">
                {label}
            </span>
            <div className="relative">
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    className={`w-full rounded-lg border border-fm-border px-4 py-3 pr-11 text-base font-medium placeholder:font-normal placeholder:text-fm-silver/50 outline-none transition-colors focus:border-fm-orange sm:py-3.5 sm:pr-12 sm:text-lg md:py-4 md:text-xl ${filled ? 'bg-fm-input-filled text-white/80' : 'bg-fm-input text-fm-white'
                        }`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fm-orange"
                >
                    {visible ? (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                </button>
            </div>
        </label>
    );
}
