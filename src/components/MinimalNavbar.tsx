import { ThemeToggle } from './ui/ThemeToggle';
import { useThemeStore } from '../store/themeStore';

export const MinimalNavbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <nav className="bg-[var(--color-primary)] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">User Management</h1>
        <ThemeToggle 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      </div>
    </nav>
  );
};