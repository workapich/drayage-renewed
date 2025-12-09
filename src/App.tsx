import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './features/auth/context/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './features/auth/components/LoginPage'
import { RegisterPage } from './features/auth/components/RegisterPage'
import { EmailConfirmationPage } from './features/auth/components/EmailConfirmationPage'
import { PortRampRegionSelectionPage } from './features/vendor/components/PortRampRegionSelectionPage'
import { BidSubmissionPage } from './features/vendor/components/BidSubmissionPage'
import { VendorWhitelistPage } from './features/vendor/components/VendorWhitelistPage'
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
                  <PortRampRegionSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/bid/:portRampRegionId"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <BidSubmissionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/vendors"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorWhitelistPage />
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
              path="/admin/rates/:portRampRegionId"
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

