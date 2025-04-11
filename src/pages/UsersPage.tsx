import { useState } from 'react';
import { USERS } from '../constants/users';
import { UserCard } from '../features/users/UserCard';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const UsersPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[var(--color-gray-800)] text-[var(--color-white)]' : 'bg-[var(--color-gray-100)] text-[var(--color-black)]'}`}>
      {/* Navbar */}
      <nav className="bg-[var(--color-primary)] text-[var(--color-white)] py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-lg font-semibold">User Management</h1>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button className="bg-[var(--color-white)] text-[var(--color-primary)] px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base">
            Create User
          </button>
          <button className="bg-[var(--color-red-500)] text-[var(--color-white)] px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base">
            Logout
          </button>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </nav>

      {/* Search Bar */}
      <div className="p-4 sm:p-6 text-left">
        <input
          type="text"
          placeholder="Search users..."
          className={`w-full sm:w-1/2 md:w-1/3 p-2 border rounded-md 
            ${isDarkMode 
              ? 'bg-[var(--color-gray-700)] text-[var(--color-white)] placeholder-[var(--color-gray-300)] border-[var(--color-gray-600)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)]' 
              : 'bg-[var(--color-white)] text-[var(--color-gray-700)] placeholder-[var(--color-gray-500)] border-[var(--color-gray-300)] focus:ring-2 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)]'}`}
        />
      </div>

      {/* User Grid - Changed to 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6">
        {USERS.map((user) => (
          <UserCard key={user.id} user={user} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
};