import { User } from '../../types/user';

interface UserCardProps {
  user: User;
  isDarkMode: boolean;
  onRender?: () => void;
}

export const UserCard = ({ user, isDarkMode }: UserCardProps) => {
  const userInitials = `${user.firstName[0]}${user.lastName?.[0] ?? ''}`;
  
  return (
    <div 
      className={`p-4 rounded-md shadow-md flex flex-col items-center transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-[var(--color-gray-700)] hover:bg-[var(--color-gray-600)]' 
          : 'bg-[var(--color-white)] hover:bg-[var(--color-gray-50)]'
      }`}
    >
      {/* Centered User Initial - Safely handles missing lastName */}
      <div className="w-12 h-12 bg-[var(--color-primary)] text-[var(--color-white)] flex items-center justify-center rounded-full text-lg font-semibold mb-3">
        {userInitials}
      </div>
    
      {/* User Info */}
      <div className="w-full text-left mt-2 space-y-1">
        <h2 className="text-lg font-semibold">
          {user.firstName} {user.lastName ?? ''}
        </h2>
        
        <div className={`text-sm ${isDarkMode ? 'text-[var(--color-gray-300)]' : 'text-[var(--color-gray-500)]'}`}>
          <span className="font-medium">Email: </span>{user.email}
        </div>
        
        <div className={`text-sm ${isDarkMode ? 'text-[var(--color-gray-300)]' : 'text-[var(--color-gray-500)]'}`}>
          <span className="font-medium">Status: </span>
          <span className={`${
            user.status === 'ACTIVE' 
              ? isDarkMode 
                ? 'text-green-400' 
                : 'text-green-600'
              : isDarkMode 
                ? 'text-red-400' 
                : 'text-red-600'
          }`}>
            {user.status}
          </span>
        </div>
        
        <div className={`text-sm ${isDarkMode ? 'text-[var(--color-gray-300)]' : 'text-[var(--color-gray-500)]'}`}>
          <span className="font-medium">Date of Birth: </span>
          {new Date(user.dateOfBirth).toLocaleDateString()}
        </div>
      </div>
    
      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-2 w-full">
        <button className={`px-3 py-1 rounded-md text-sm transition-colors ${
          isDarkMode 
            ? 'bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-[var(--color-white)]'
            : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-white)]'
        }`}>
          Edit
        </button>

        <button className={`px-3 py-1 rounded-md text-sm transition-colors ${
          isDarkMode 
            ? 'bg-[var(--color-red-600)] hover:bg-[var(--color-red-700)] text-[var(--color-white)]'
            : 'bg-[var(--color-red-500)] hover:bg-[var(--color-red-600)] text-[var(--color-white)]'
        }`}>
          Delete
        </button>
      </div>
    </div>
  );
};