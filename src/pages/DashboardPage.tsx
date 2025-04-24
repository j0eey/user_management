import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { getUsers } from '../api/users';
import { UserCard } from '../features/users/UserCard';
import { DashboardForm } from '../components/auth/DashboardForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

export const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const { accessToken } = useAuthStore();

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => clearTimeout(timer); 
  }, [searchTerm]);

  const {
    data: allUsers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', debouncedSearchTerm], 
    queryFn: () => getUsers(debouncedSearchTerm, accessToken),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });

  // Enhanced full name matching logic
  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName ?? ''}`.toLowerCase();
    const email = user.email.toLowerCase(); // Include email in search
    const searchWords = debouncedSearchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // If the search term ends with a space, enforce full-word matching
    const isStrictSearch = debouncedSearchTerm.endsWith(' ');

    return searchWords.every((word) => {
      if (isStrictSearch) {
        // Check for exact word matches in name OR exact email match
        return (
          fullName.split(/\s+/).some(nameWord => nameWord === word) ||
          email === word
        );
      } else {
        // Allow partial matches in name OR email
        return (
          fullName.includes(word) ||
          email.includes(word)
        );
      }
    });
  });

  return (
    <>
      <DashboardForm
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
          <span className="ml-2">Loading user data...</span>
        </div>
      )}

      {isError && (
        <div
          className={`p-4 mx-6 rounded-md ${
            isDarkMode ? 'bg-red-900' : 'bg-red-100'
          }`}
        >
          <p
            className={`text-center ${
              isDarkMode ? 'text-red-200' : 'text-red-700'
            }`}
          >
            Error: {(error as Error).message}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} isDarkMode={isDarkMode} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No users found
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
