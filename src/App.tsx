import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import NewUserPage from './pages/NewUserPage';
import EditUserPage from './pages/EditUserPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Configure query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Toast notifications provider - position can be adjusted */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              padding: '12px 16px',
            },
          }}
        />
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/new" element={<NewUserPage />} />
            <Route path="/dashboard/edit/:id" element={<EditUserPage />} />
            
            {/* Optional: Redirect from root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          {/* Optional: 404 handler */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;