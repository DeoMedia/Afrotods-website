import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { KeyRound } from 'lucide-react';
import { adminApi, setAdminToken } from './api';
import afrotodLogo from '../../imports/afro-logo-1_(2).png';

const baloo = "'Baloo 2', cursive";
const inputCls =
  'w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold mb-4';

/** Landing page for the link in the reset email: /admin/reset?token=… */
export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Those two passwords do not match.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // The backend signs them in as part of the reset, so they land in the
      // dashboard instead of typing the new password straight back in.
      const result = await adminApi.resetPassword(token, password);
      setAdminToken(result.token, result.role);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That reset link is no longer valid');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D0A6B] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-[420px] text-center">
        <img src={afrotodLogo} alt="The Afrotods" className="h-14 w-auto mx-auto mb-2" />
        <h1 className="text-lg font-black text-[#2D0A6B] mb-2" style={{ fontFamily: baloo }}>
          Choose a new password
        </h1>

        {!token ? (
          <>
            <p className="text-sm font-semibold text-gray-500 mb-6">
              This link is missing its token. Open the link straight from your email, or ask for a new one.
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full px-8 py-3.5 bg-gray-100 text-[#2D0A6B] rounded-full font-extrabold"
              style={{ fontFamily: baloo }}
            >
              Back to sign in
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-500 mb-6">
              Pick something at least 8 characters long. You will be signed out on every other device.
            </p>
            <input
              required
              autoFocus
              type="password"
              minLength={8}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputCls}
            />
            {error && <p className="text-red-600 font-bold text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full px-8 py-3.5 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold disabled:opacity-40 inline-flex items-center justify-center gap-2"
              style={{ fontFamily: baloo }}
            >
              <KeyRound className="w-4 h-4" />
              {busy ? 'Saving…' : 'Save and sign in'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
