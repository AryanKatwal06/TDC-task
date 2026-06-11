import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthListener } from '@/hooks/useAuth'
import { useClientsLoader } from '@/hooks/useClients'
import ProtectedRoute      from '@/components/ProtectedRoute'
import LoginPage           from '@/pages/LoginPage'
import RegisterPage        from '@/pages/RegisterPage'
import DashboardPage       from '@/pages/DashboardPage'
import ClientDetailPage    from '@/pages/ClientDetailPage'
import AnalyticsPage       from '@/pages/AnalyticsPage'
import { ToastContainer }  from '@/components/ui/Toast'
import ScrollToTop         from '@/components/ScrollToTop'

export default function App() {
  useAuthListener()
  useClientsLoader()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:clientId"
          element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}