/* Login & Register — client-side validation mirroring the Zod schemas
 * used on the real backend, with one-click demo role accounts. */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/ui';

const demoAccounts = [
  { role: 'Admin', email: 'admin@estatehub.com', color: 'from-rose-500 to-pink-500', icon: 'shield' },
  { role: 'Agent', email: 'agent@estatehub.com', color: 'from-brand-500 to-indigo-500', icon: 'building' },
  { role: 'Customer', email: 'customer@estatehub.com', color: 'from-emerald-500 to-teal-500', icon: 'user' },
];

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-14">
      {/* decorative gradients */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="anim-fade-up card relative w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30">
            <Icon name="home" className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = (em: string, pw: string) => {
    setLoading(true); setError('');
    setTimeout(() => {
      const res = login(em, pw);
      setLoading(false);
      if (!res.ok) { setError(res.error!); return; }
      navigate('/');
    }, 500); // simulated network latency
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your properties and bookings">
      {/* demo accounts */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {demoAccounts.map((d) => (
          <button key={d.role} type="button" onClick={() => doLogin(d.email, 'demo123')}
            className={`group rounded-xl bg-gradient-to-br ${d.color} p-[1.5px] transition hover:-translate-y-0.5`}>
            <span className="flex flex-col items-center gap-1 rounded-[10px] bg-white px-2 py-2.5 text-xs font-bold text-slate-700 transition group-hover:bg-transparent group-hover:text-white dark:bg-slate-900 dark:text-slate-200">
              <Icon name={d.icon} className="h-4 w-4" />{d.role}
            </span>
          </button>
        ))}
      </div>
      <p className="mb-5 text-center text-[11px] text-slate-400">One-click demo login · password <code className="font-bold">demo123</code></p>

      <form onSubmit={(e) => { e.preventDefault(); doLogin(email, password); }} className="space-y-4">
        {error && <p className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-500">{error}</p>}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">Password</label>
          <div className="relative">
            <input id="password" type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input pr-11" />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500"><Icon name="eye" className="h-4.5 w-4.5" /></button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-medium text-slate-500"><input type="checkbox" className="accent-brand-600" /> Remember me</label>
          <button type="button" className="font-bold text-brand-600 hover:underline dark:text-brand-300">Forgot password?</button>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'} {!loading && <Icon name="key" className="h-4 w-4" />}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to EstateHub? <Link to="/register" className="font-bold text-brand-600 hover:underline dark:text-brand-300">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  /* validation mirroring the server-side Zod schema */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s()-]{6,}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const res = register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || '—', password: form.password });
      setLoading(false);
      if (!res.ok) { setErrors({ email: res.error! }); return; }
      navigate('/dashboard');
    }, 600);
  };

  return (
    <AuthShell title="Create your account" subtitle="Save properties, book visits and track everything in one place">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {([
          ['name', 'Full name', 'text', 'Jane Cooper'],
          ['email', 'Email', 'email', 'you@example.com'],
          ['phone', 'Phone (optional)', 'tel', '+1 555 000 0000'],
          ['password', 'Password', 'password', 'Min. 6 characters'],
          ['confirm', 'Confirm password', 'password', 'Repeat password'],
        ] as const).map(([k, label, type, ph]) => (
          <div key={k}>
            <label htmlFor={k} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">{label}</label>
            <input id={k} type={type} value={form[k]} onChange={set(k)} placeholder={ph}
              className={`input ${errors[k] ? '!border-rose-400 !ring-rose-400/20' : ''}`} />
            {errors[k] && <p className="mt-1 text-xs font-semibold text-rose-500">{errors[k]}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account…' : 'Create account'}</button>
        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          Passwords are hashed with bcrypt on the API. By signing up you agree to our Terms & Privacy Policy.
        </p>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="font-bold text-brand-600 hover:underline dark:text-brand-300">Sign in</Link>
      </p>
    </AuthShell>
  );
}
