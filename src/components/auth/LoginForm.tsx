import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  loading: boolean;
  error: string;
  onSubmit: (email: string, password: string) => void;
}

const LoginForm = ({ loading, error, onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-white)] p-8 rounded-xl shadow-sm w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-[var(--color-gray-800)]">Login</h2>

      {error && <div className="text-[var(--color-red-600)] text-sm text-center">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-3 border border-[var(--color-gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-white)] rounded-lg transition font-medium"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;