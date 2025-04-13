import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';

const ProtectedLayout = () => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (accessToken && !isAuthenticated()) {
      useAuthStore.getState().logout();
    }
  }, [accessToken, isAuthenticated]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-[var(--color-gray-800)] text-[var(--color-white)]'
        : 'bg-[var(--color-gray-100)] text-[var(--color-black)]'
    }`}>
      <Navbar />
      <main>
        <Outlet context={{ isDarkMode }} />
      </main>
    </div>
  );
};

export default ProtectedLayout;