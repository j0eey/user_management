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
  
      const response = await axios.post('/api/login', {
        email,
        password, // ✅ fixed payload shape
      });
  
      if (response.data.status === 200) {
        const { accessToken, expiresIn } = response.data.result.data;
        setAuth({ accessToken, expiresIn });
        navigate('/dashboard');
      } else {
        setError(response.data.result.message || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.response?.data?.result?.message || 'Something went wrong!');
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