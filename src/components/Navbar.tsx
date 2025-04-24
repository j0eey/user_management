import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCreateUser = () => {
    navigate('/dashboard/new');
  };

  return (
    <nav className="bg-[var(--color-primary)] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">User Management</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateUser}
            className="bg-white text-[var(--color-primary)] hover:bg-gray-100 px-4 py-2 rounded-md transition"
            aria-label="Create new user"
          >
            Create User
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-[var(--color-red-500)] hover:bg-[var(--color-red-600)] px-4 py-2 rounded-md transition"
            aria-label="Logout"
          >
            Logout
          </button>
          
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;