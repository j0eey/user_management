const LoadingSpinner = () => (
  <div 
    className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" 
    style={{
      borderTopColor: 'var(--color-blue-500)',
      borderBottomColor: 'var(--color-blue-500)'
    }}
  ></div>
);

export default LoadingSpinner;