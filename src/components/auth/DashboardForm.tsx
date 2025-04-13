import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types/user';

interface DashboardFormProps {
  isDarkMode: boolean;
  onUsersLoaded: (users: User[]) => void;
  onError: (message: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export const DashboardForm = ({ 
  isDarkMode,
  onUsersLoaded,
  onError,
  onLoadingChange
}: DashboardFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchUsers = async () => {
      onLoadingChange(true);
      onError('');
      
      try {
        const response = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
    
        const result = await response.json();
    
        if (!result.result?.data?.users) {
          throw new Error('Response missing result.data.users');
        }
    
        onUsersLoaded(result.result.data.users);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to load users');
        onUsersLoaded([]);
      } finally {
        onLoadingChange(false);
      }
    };

    fetchUsers();
    
    return () => controller.abort();
  }, [searchTerm, accessToken]);

  return (
    <div className="p-4 sm:p-6">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full sm:w-1/2 md:w-1/3 p-2 border rounded-md transition ${
          isDarkMode
            ? 'bg-[var(--color-gray-700)] text-[var(--color-white)] placeholder-[var(--color-gray-300)] border-[var(--color-gray-600)] focus:ring-2 focus:ring-[var(--color-blue-500)]'
            : 'bg-[var(--color-white)] text-[var(--color-gray-800)] placeholder-[var(--color-gray-500)] border-[var(--color-gray-300)] focus:ring-2 focus:ring-[var(--color-blue-500)]'
        }`}
      />
    </div>
  );
};