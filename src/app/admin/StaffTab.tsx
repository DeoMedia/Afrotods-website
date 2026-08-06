import { useEffect, useState, type FormEvent } from 'react';
import { KeyRound, Trash2 } from 'lucide-react';
import { adminApi, type StaffMember } from './api';

const baloo = "'Baloo 2', cursive";
const inputCls =
  'w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold text-sm';

export function StaffTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [staff, setStaff] = useState<StaffMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'staff' as 'staff' | 'super' });
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    adminApi
      .listStaff()
      .then(setStaff)
      .catch((e: Error) => (e.message === 'unauthorized' ? onUnauthorized() : setError(e.message)));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const created = await adminApi.createStaff(form.email.trim(), form.password, form.role);
      // The account exists either way; say plainly whether they were emailed,
      // because the password cannot be read back and resent later.
      setNotice(
        created.emailed
          ? `Account created. Sign-in details emailed to ${created.email}.`
          : `Account created, but the invite email could not be sent. Share the password with ${created.email} yourself.`,
      );
      setForm({ email: '', password: '', role: 'staff' });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the account');
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (member: StaffMember) => {
    setError(null);
    setNotice(null);
    try {
      await adminApi.setStaffActive(member.id, !member.active);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the account');
    }
  };

  const changePassword = async (member: StaffMember) => {
    const next = window.prompt(
      `Set a new password for ${member.email}.\n\n` +
        'It is emailed to them, and they are signed out everywhere. Minimum 8 characters.',
    );
    if (next === null) return;
    if (next.length < 8) {
      setError('That password is too short, it needs at least 8 characters.');
      return;
    }
    setError(null);
    setNotice(null);
    try {
      const updated = await adminApi.setStaffPassword(member.id, next);
      setNotice(
        updated.emailed
          ? `New password set and emailed to ${member.email}.`
          : `New password set, but the email could not be sent. Share it with ${member.email} yourself.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password');
    }
  };

  const remove = async (member: StaffMember) => {
    const warning =
      `Permanently delete ${member.email}?\n\n` +
      'Deactivating them instead keeps the account and can be undone. Deleting cannot.';
    if (!window.confirm(warning)) return;
    setError(null);
    setNotice(null);
    try {
      await adminApi.deleteStaff(member.id);
      setNotice(`${member.email} has been removed.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the account');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-[#2D0A6B] mb-6" style={{ fontFamily: baloo }}>
        Staff accounts
      </h2>

      <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="text-sm font-black text-[#2D0A6B] mb-3">Add a team member</div>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputCls}
          />
          <input
            required
            type="password"
            minLength={8}
            placeholder="Password (min 8 chars)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={inputCls}
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'staff' | 'super' }))}
            className={inputCls}
            title="Staff can manage products and orders. Super admins can also manage staff."
          >
            <option value="staff">Staff</option>
            <option value="super">Super admin</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-2.5 bg-[#2D0A6B] text-white rounded-full font-extrabold text-sm disabled:opacity-40"
            style={{ fontFamily: baloo }}
          >
            {busy ? 'Adding…' : 'Add member'}
          </button>
        </div>
        <p className="text-xs font-semibold text-gray-400 mt-3">
          Staff can update orders, stock, prices and customers, and download reports. Adding and deleting products,
          customers and team members is reserved for super admins. Sign-in details are emailed automatically, and
          anyone can reset their own password from the sign-in page.
        </p>
      </form>

      {notice && (
        <p
          className={`font-bold mb-4 ${
            notice.includes('could not be sent') ? 'text-orange-600' : 'text-green-600'
          }`}
        >
          {notice}
        </p>
      )}

      {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
      {staff === null && <div className="h-32 rounded-3xl bg-white animate-pulse" />}

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
        {/* Three action buttons plus four columns will not fit a phone */}
        <table className="w-full text-sm min-w-[42rem]">
          <thead>
            <tr className="text-left text-gray-400 font-bold">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Added</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {staff?.map((member) => (
              <tr key={member.id} className="border-t border-gray-100 font-semibold text-gray-700">
                <td className="py-3 pr-4">{member.email}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      member.role === 'super' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {member.role === 'super' ? 'Super admin' : 'Staff'}
                  </span>
                </td>
                <td className="py-3 pr-4"><span className="inline-flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-gray-300'}`} />{member.active ? 'Active' : 'Deactivated'}</span></td>
                <td className="py-3 pr-4 text-gray-400">{new Date(member.created_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => changePassword(member)}
                      title="Set a new password and email it to them"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316]"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Password
                    </button>
                    <button
                      onClick={() => toggleActive(member)}
                      className={`px-4 py-1.5 rounded-full text-xs font-extrabold border-2 ${
                        member.active
                          ? 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
                          : 'border-green-300 text-green-600'
                      }`}
                    >
                      {member.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button
                      onClick={() => remove(member)}
                      title="Delete this account for good"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border-2 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
