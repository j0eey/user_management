interface DashboardFormProps {
  isDarkMode: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DashboardForm = ({
  isDarkMode,
  searchTerm,
  onSearchChange,
}: DashboardFormProps) => {
  return (
    <div className="p-4 sm:p-6">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full sm:w-1/2 md:w-1/3 p-2 border rounded-md transition ${
          isDarkMode
            ? 'bg-gray-700 !text-white placeholder-gray-300 border-gray-600 focus:ring-2 focus:ring-blue-500'
            : 'bg-white !text-[#213547] placeholder-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-500'
        }`}
      />
    </div>
  );
};