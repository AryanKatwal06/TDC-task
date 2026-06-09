import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthListener } from '@/hooks/useAuth'
import ProtectedRoute      from '@/components/ProtectedRoute'
import LoginPage           from '@/pages/LoginPage'
import DashboardPage       from '@/pages/DashboardPage'
import ClientDetailPage    from '@/pages/ClientDetailPage'
import RegisterPage        from '@/pages/RegisterPage'
import { ToastContainer }  from '@/components/ui/Toast'

export default function App() {
  useAuthListener()

  return (
    <BrowserRouter>
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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}