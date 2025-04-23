import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { accessToken, setAuth } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');  
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('/api/login', { email, password });

      const { status, result } = response.data;
      const { data, message } = result;

      if (status === 200 && data?.accessToken) {
        const { accessToken, expiresIn } = data;
        setAuth({ accessToken, expiresIn });
        navigate('/dashboard');
      } else {
        setError(data?.message || message || '');
      }
    } catch (err: any) {
      const fallbackMessage = err.response?.data?.result?.data?.message || err.response?.data?.result?.message || 'Something went wrong!';
      setError(fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-50)] px-4">
      <LoginForm loading={loading} error={error} onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
