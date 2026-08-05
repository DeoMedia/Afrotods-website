import { useState, type FormEvent } from 'react';
import { useAuth } from './AuthContext';

const baloo = "'Baloo 2', cursive";
const inputCls =
  'w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold';

/** Two-step email sign-in: request a code, then verify it. Sign-up is the same flow. */
export function SignInForm({ compact = false }: { compact?: boolean }) {
  const { requestCode, verifyCode } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await requestCode(email.trim());
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyCode(email.trim(), code.trim(), name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code was not accepted');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'email') {
    return (
      <form onSubmit={sendCode} className="flex flex-col gap-3">
        {!compact && (
          <p className="text-gray-600 font-semibold text-sm">
            Enter your email and we'll send you a 6-digit code. No password needed; new customers are signed up
            automatically.
          </p>
        )}
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold disabled:opacity-40"
          style={{ fontFamily: baloo }}
        >
          {busy ? 'Sending…' : 'Email me a sign-in code'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={confirm} className="flex flex-col gap-3">
      <p className="text-gray-600 font-semibold text-sm">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
      </p>
      <input
        required
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={`${inputCls} text-center text-2xl tracking-[0.5em]`}
        autoFocus
      />
      {error && <p className="text-red-600 font-bold text-sm">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold disabled:opacity-40"
        style={{ fontFamily: baloo }}
      >
        {busy ? 'Checking…' : 'Sign in'}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep('email');
          setCode('');
          setError(null);
        }}
        className="text-sm font-bold text-gray-400 hover:text-[#F97316]"
      >
        Use a different email or resend the code
      </button>
    </form>
  );
}
