interface ThemeToggleProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
  }
  
  export const ThemeToggle = ({ isDarkMode, toggleTheme }: ThemeToggleProps) => {
    return (
      <button 
        onClick={toggleTheme}
        className="p-1.5 text-[var(--color-gray-300)]"
        aria-label="Toggle dark mode"
      >
        {/* Moon icon (shows in light mode) */}
        <svg
          className={`w-5 h-5 ${isDarkMode ? 'hidden' : 'block'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.5"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
  
        {/* Sun icon (shows in dark mode) */}
        <svg
          className={`w-5 h-5 ${isDarkMode ? 'block' : 'hidden'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.5"
            d="M12 18a6 6 0 100-12 6 6 0 000 12zM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1"
          />
        </svg>
      </button>
    );
  };