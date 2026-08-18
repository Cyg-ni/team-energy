import { Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/Login'
import { DashboardPage } from '../pages/Dashboard'
import { BillLoggingPage } from '../pages/Bills/BillLogging'
import { BillHistoryPage } from '../pages/Bills/BillHistory'
import { BillDetailsPage } from '../pages/Bills/BillDetails'
import { SettingsPage } from '../pages/Settings'
import { OrganizationAccountsPage } from '../pages/OrganizationAccounts'
import { ApprovalsPage } from '../pages/Approvals'
import { NotFoundPage } from '../pages/NotFound'
import { useAuthStore } from '../store/authStore'

const ProtectedRoute = ({ children, requireAdmin = false, allowedRoles = ['Admin', 'Approver', 'Staff', 'Viewer'] }) => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const RootRedirect = () => {
  const user = useAuthStore((state) => state.user)
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
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
    path: '/bills/logging',
    element: (
      <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
        <BillLoggingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/approvals',
    element: (
      <ProtectedRoute allowedRoles={['Admin', 'Approver']}>
        <ApprovalsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bills/history',
    element: (
      <ProtectedRoute>
        <BillHistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bills/:id',
    element: (
      <ProtectedRoute>
        <BillDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/organization-accounts',
    element: (
      <ProtectedRoute requireAdmin>
        <OrganizationAccountsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
