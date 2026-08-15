import { Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/Login'
import { DashboardPage } from '../pages/Dashboard'
import { UploadBillsPage } from '../pages/UploadBills'
import { AlertsPage } from '../pages/Alerts'
import { ProfilePage } from '../pages/Profile'
import { NotFoundPage } from '../pages/NotFound'
import { useAuthStore } from '../store/authStore'

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user)
  return user ? children : <Navigate to="/login" replace />
}

export const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/upload-bills',
    element: (
      <ProtectedRoute>
        <UploadBillsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/alerts',
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardPage /> {/* Placeholder - create settings page as needed */}
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
