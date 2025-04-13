import { useState } from 'react';
import { UserCard } from '../features/users/UserCard';
import { useOutletContext } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardForm } from '../components/auth/DashboardForm';
import { User } from '../types/user';

export const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  return (
    <>
      <DashboardForm
        isDarkMode={isDarkMode}
        onUsersLoaded={setUsers}
        onError={setError}
        onLoadingChange={setLoading}
      />

      {loading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
          <span className="ml-2">Loading user data...</span>
        </div>
      )}

      {error && (
        <div className={`p-4 mx-6 rounded-md ${
          isDarkMode ? 'bg-[var(--color-red-900)]' : 'bg-[var(--color-red-100)]'
        }`}>
          <p className={`text-center ${
            isDarkMode ? 'text-[var(--color-red-200)]' : 'text-[var(--color-red-700)]'
          }`}>
            Error: {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6">
          {users.length > 0 ? (
            users.map((user) => (
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