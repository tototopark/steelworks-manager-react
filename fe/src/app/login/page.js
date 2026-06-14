"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const { login, changePassword } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requireChange, setRequireChange] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [devConfig, setDevConfig] = useState({ autoFill: false, devHints: false });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchDevConfig = async () => {
      try {
        const configRes = await apiClient.get('/api/config/dev_features');
        if (configRes.data && configRes.data.status === 'success') {
          const autoFill = configRes.data.auto_fill;
          const devHints = configRes.data.dev_hints;
          setDevConfig({ autoFill, devHints });
          
          if (autoFill) {
            setUsername('admin');
            setPassword('12345678');
          }
        }
      } catch (err) {
        console.error('Failed to fetch dev config', err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const empRes = await apiClient.get('/api/employees');
        if (empRes.data && empRes.data.status === 'success') {
          setEmployees(empRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    fetchDevConfig();
    fetchEmployees();
  }, []);

  const handleQuickFill = (userLogin, userPass) => {
    // If AUTO_FILL_ENABLED is active or we just want to override fields on user click
    setUsername(userLogin);
    setPassword(userPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (requireChange) {
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        setLoading(false);
        return;
      }
      if (newPassword === '12345678') {
        setError('New password cannot be the default password "12345678"');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match');
        setLoading(false);
        return;
      }
      const changeResult = await changePassword(tempToken, newPassword);
      setLoading(false);
      if (changeResult.success) {
        router.push('/dashboard');
      } else {
        setError(changeResult.message);
      }
      return;
    }

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else if (result.requireChange) {
      setRequireChange(true);
      setTempToken(result.tempToken);
      setError(result.message);
    } else {
      setError(result.message);
    }
  };



  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8 font-sans gap-6">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Steelworks Manager
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign in to your account
          </p>
          <div className="mt-4 flex justify-center">
            <a 
              href="/resume" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-900/50 hover:border-emerald-700 text-emerald-400 hover:text-white transition-all text-xs font-semibold"
            >
              💼 View Developer CV & Web Demo Info
            </a>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-900 p-4 text-sm text-red-200 text-center">
              {error}
            </div>
          )}
          {!requireChange ? (
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 px-4 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:text-sm"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 pl-4 pr-12 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:text-sm"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-md">
              <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg text-xs text-amber-255 text-center">
                You are logging in with the default password. You must change your password to secure your account.
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 pl-4 pr-12 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:text-sm"
                    placeholder="Enter at least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 pl-4 pr-12 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:text-sm"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-white py-3 px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : (requireChange ? 'Change Password & Sign In' : 'Sign in')}
            </button>
          </div>
        </form>
      </div>

      {devConfig.devHints && (
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
            <span>Developer Account Quick-Fill</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Click any account to automatically fill credentials (AUTO_FILL_ENABLED: {devConfig.autoFill ? 'ON' : 'OFF'})
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {/* Super Admin */}
            <div 
              onClick={() => handleQuickFill('admin', '12345678')}
              className="flex items-center justify-between p-2.5 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs cursor-pointer transition-all"
            >
              <div>
                <span className="font-semibold text-white">admin</span>
                <span className="text-zinc-500 ml-2">(Super Admin)</span>
              </div>
              <span className="text-zinc-400 font-mono">12345678</span>
            </div>
            {/* Database Users */}
            {[...employees].sort((a, b) => (a.login || '').localeCompare(b.login || '')).map((emp) => {
              const hash = emp.password || '';
              // Let's check if the hash has length 60 and starts with '$2b$'.
              // We can do a helper to detect whether it matches the default '12345678' hash
              // or the new 'dev12345' hash.
              // Note: Since bcrypt hashes have random salt, we can't do string equality on the hash itself
              // unless we know the exact hash we generated, but the reset script generates a fresh salt each time!
              // Wait! If the user ran 'reset_passwords' (Plain), the stored password is literal '12345678'.
              // If the user ran 'reset_passwords_hashed', the stored password is a bcrypt hash of 'dev12345'.
              // But wait, the password could also be a bcrypt hash of a custom password changed by the user.
              // How do we know if a hash in the DB is 'dev12345' or a custom user password?
              // In JavaScript we cannot easily verify bcrypt checkpw without a library.
              // But we can check if the value is literal '12345678'.
              // Wait, to make it extremely robust and clean:
              // If the password starts with '$2b$', it is a hashed password. If the database password was set via
              // the 'Reset to Hashed 12345678' button (which we changed to 'dev12345'), how do we log in?
              // The user said: "일괄 해시 변경할 시점의 임의의 플레인 비밀번호를 기억해서 이것을 로그인 화면에 보여주어야 겠다. 그래야지 이번호를 입력할 때 bcrypt.checkpw 연산은 그대로 진행해야지."
              // So, if we reset all passwords to hashed 'dev12345', we want to show 'dev12345' on the screen in plain text,
              // and autofill 'dev12345' in the password field, so that when they click submit, the plain 'dev12345' is sent to the backend,
              // and the backend verifies it using bcrypt.checkpw('dev12345', hashed_pw) -> TRUE!
              // Since the 'Reset to Hashed 12345678' button generates the hash using `bcrypt.hashpw(b"dev12345", bcrypt.gensalt())`,
              // we can mark these users. Or simply: if the user's password starts with '$2b$', we can check if it's the dev bypass one.
              // Wait, how do we distinguish between 'dev12345' hash and user's own changed password hash?
              // If a user changed their password, it is a custom hash, and they should manually type it.
              // If we want the Quick-Fill to display 'dev12345' for accounts that haven't been customized,
              // we can store a flag, or we can check if the password in DB is a hash, and since it's a test environment,
              // if it's a hash, we can let it be 'dev12345' if it's not a user-changed one.
              // But wait! If the user changed their password, they want the Quick-Fill to display that custom password?
              // "비밀번호 변경하면 Developer Account Quick-Fill 에는 db에서 가져온 비밀번호가 노출된다. 비밀번호가 12345678이 아니면 로그인 성공"
              // Ah! "비밀번호 변경하면 Developer Account Quick-Fill 에는 db에서 가져온 비밀번호가 노출된다."
              // That means they want the actual DB value (the hash string itself) to be displayed on the screen for custom changed passwords,
              // OR they want the plain text if they know it. But since DB only has the hash, they want the hash string displayed,
              // AND if it's '12345678' plain text, show '12345678'.
              // Wait, if it is reset to hashed 'dev12345', the DB has the hash of 'dev12345'.
              // If the DB has a hash, can we show the hash string itself, but when we reset to 'dev12345' hash, how do we know the plain text is 'dev12345'?
              // If we show 'dev12345' (Plain) for dev-reset accounts, that would be perfect.
              // Let's do this:
              // If the DB value is literal '12345678', we display '12345678' and autofill '12345678'.
              // If the DB value starts with '$2b$' (a bcrypt hash), how do we know if it was hashed from 'dev12345' or a custom user password?
              // Since the 일괄 리셋 button sets the password of all users to the SAME hash, all users will have the EXACT same hash value in DB if they haven't changed it!
              // Wait, `bcrypt.gensalt()` is called for each user, so they will have different salts and different hashes even for the same 'dev12345'!
              // To make it simple and perfectly matching:
              // Can we store the plain text 'dev12345' in a special way, or can the backend tell us if the password is the dev password?
              // Actually, since the backend '/api/employees' returns the list of employees, we can have the backend verify the hash of each employee against 'dev12345'
              // and return a flag or the plain text? No, the user said: "일괄 해시 변경할 시점의 임의의 플레인 비밀번호를 기억해서 이것을 로그인 화면에 보여주어야 겠다. 그래야지 이번호를 입력할 때 bcrypt.checkpw 연산은 그대로 진행해야지."
              // Yes! The user wants the FRONTEND to display the plain password (e.g. 'dev12345' or '12345678') if it is the reset password,
              // and fill it. If the user changed it to something else, they will see the hash or the actual password they changed it to.
              // Let's modify the backend `/api/employees` to check if `bcrypt.checkpw(b"dev12345", hash)` is true, and if so, return a field `is_dev_pass: true` or even return `password_display`!
              // That is extremely elegant and 100% robust! Let's check:
              // In api_router.py:
              // for emp in employees:
              //     if emp['password'] == '12345678':
              //         emp['password_display'] = '12345678'
              //         emp['autofill_password'] = '12345678'
              //     elif checkpw(b"dev12345", emp['password']):
              //         emp['password_display'] = 'dev12345'
              //         emp['autofill_password'] = 'dev12345'
              //     else:
              //         emp['password_display'] = emp['password'] # Show raw hash
              //         emp['autofill_password'] = emp['password']
              // This is perfect! Let's do this!
              const displayPass = emp.password_display || hash;
              const fillPass = emp.autofill_password || hash;
              return (
                <div 
                  key={emp.id}
                  onClick={() => handleQuickFill(emp.login, fillPass)}
                  className="flex items-center justify-between p-2.5 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs cursor-pointer transition-all"
                >
                  <div>
                    <span className="font-semibold text-white">{emp.login}</span>
                    <span className="text-zinc-500 ml-2">({emp.firstname} - {emp.role})</span>
                  </div>
                  <span className="text-zinc-400 font-mono select-all truncate max-w-[150px]" title={displayPass}>
                    {displayPass}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
