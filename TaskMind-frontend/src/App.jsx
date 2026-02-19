import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/MiseEnPage';
import { LoginPage } from './features/auth/ConnexionPage';
import { DashboardPage } from './features/dashboard/TableauDeBordPage';
import { ProjectsPage } from './features/projects/ProjetsPage';
import { TasksPage } from './features/tasks/TachesPage';
import { TeamsPage } from './features/teams/EquipesPage';
import { useAuth } from './features/auth/AuthContexte';

function Protected({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
