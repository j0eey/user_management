import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import ProtectedLayout from './layouts/ProtectedLayout';

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Wrap your app with the QueryClientProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
