import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InviteAcceptPage } from '../pages/InviteAcceptPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TeamDetailPage } from '../pages/TeamDetailPage';
import { TeamSetupPage } from '../pages/TeamSetupPage';
import { TeamsPage } from '../pages/TeamsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/invite/:token',
    element: (
      <ProtectedRoute>
        <InviteAcceptPage />
      </ProtectedRoute>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/teams', element: <TeamsPage /> },
          { path: '/teams/:teamId', element: <TeamDetailPage /> },
          { path: '/teams/:teamId/setup', element: <TeamSetupPage /> },
          { path: '/teams/:teamId/projects/new', element: <CreateProjectPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
        ],
      },
    ],
  },
]);
