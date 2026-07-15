import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThemeToggle from './components/common/ThemeToggle';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import SubmissionsPage from './pages/admin/SubmissionsPage';
import TalentsPage from './pages/admin/TalentsPage';
import TalentDashboard from './pages/talent/TalentDashboard';
import MyTasksPage from './pages/talent/MyTasksPage';
import NotFoundPage from './pages/NotFoundPage';

// "Unauthorized" message — confusing UX for the user
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeToggle className="app-global-theme-toggle" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <PrivateRoute role="Admin">
                <AdminTasksPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <PrivateRoute role="Admin">
                <SubmissionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/talents"
            element={
              <PrivateRoute role="Admin">
                <TalentsPage />
              </PrivateRoute>
            }
          />

          {/* Talent */}
          <Route
            path="/talent/dashboard"
            element={
              <PrivateRoute role="Talent">
                <TalentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/talent/tasks"
            element={
              <PrivateRoute role="Talent">
                <MyTasksPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;