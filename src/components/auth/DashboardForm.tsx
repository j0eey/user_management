import { useState, useEffect, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchUsers = async () => {
      onLoadingChange(true);
      onError('');

      try {
        const searchQuery = searchTerm.trim();
        let url = '/api/users';
        
        if (searchQuery) {
          const searchParts = searchQuery.split(/\s+/).filter(Boolean);
          
          if (searchParts.length > 1) {
            const userPromises = searchParts.map(part => 
              fetch(`/api/users?search=${encodeURIComponent(part)}`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                signal: controller.signal
              })
            );

            const responses = await Promise.all(userPromises);
            const results = await Promise.all(responses.map(r => r.json()));
            
            // Combine all users from all responses
            let allUsers: User[] = [];
            results.forEach(result => {
              const users = result.result?.data?.users || [];
              allUsers = [...allUsers, ...users];
            });

            // Remove duplicates and filter for users that match all search parts
            const uniqueUsers = Array.from(new Map(allUsers.map(user => [user.id, user])).values());
            
            const filteredUsers = uniqueUsers.filter((user: User) => {
              const fullName = `${user.firstName} ${user.lastName || ''}`.toLowerCase();
              const email = user.email?.toLowerCase() || '';
              return searchParts.every(part => 
                fullName.includes(part.toLowerCase()) || 
                email.includes(part.toLowerCase())
              );
            });

            onUsersLoaded(filteredUsers);
            return;
          } else {
            url = `/api/users?search=${encodeURIComponent(searchQuery)}`;
          }
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const users = result.result?.data?.users || [];
        onUsersLoaded(users);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onError(err instanceof Error ? err.message : 'Failed to load users');
          onUsersLoaded([]);
        }
      } finally {
        onLoadingChange(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, accessToken, onError, onLoadingChange, onUsersLoaded]);

  return (
    <div className="p-4 sm:p-6">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full sm:w-1/2 md:w-1/3 p-2 border rounded-md transition ${
          isDarkMode
            ? 'bg-gray-700 text-white placeholder-gray-300 border-gray-600 focus:ring-2 focus:ring-blue-500'
            : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500'
        }`}
      />
    </div>
  );
};