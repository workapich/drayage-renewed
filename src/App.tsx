import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './features/auth/components/LoginPage'
import { RegisterPage } from './features/auth/components/RegisterPage'
import { EmailConfirmationPage } from './features/auth/components/EmailConfirmationPage'
import { CitySelectionPage } from './features/vendor/components/CitySelectionPage'
import { BidSubmissionPage } from './features/vendor/components/BidSubmissionPage'
import { AdminDashboard } from './features/admin/components/AdminDashboard'
import { VendorManagement } from './features/admin/components/VendorManagement'
import { RateManagement } from './features/admin/components/RateManagement'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-email" element={<EmailConfirmationPage />} />
            
            {/* Vendor Routes */}
            <Route
              path="/vendor/cities"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <CitySelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/bid/:portCityId"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <BidSubmissionPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute requiredRole="admin">
                  <VendorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rates/:portCityId"
              element={
                <ProtectedRoute requiredRole="admin">
                  <RateManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

