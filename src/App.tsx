import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GuestRoute } from './components/GuestRoute'

// Layouts
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyOTPPage from './pages/auth/VerifyOTPPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Protected pages
import DashboardPage from './pages/DashboardPage'
import { CustomerListPage } from './pages/customers/CustomerListPage'
import { CustomerDetailsPage } from './pages/customers/CustomerDetailsPage'
import InvoicesPage from './pages/InvoicesPage'
import CreditPage from './pages/credits/CreditPage'
import MaintenancePage from './pages/MaintenancePage'
import ReportsPage from './pages/ReportsPage'

// Role-based dashboards
import InvestorDashboard from './pages/dashboards/InvestorDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import ManagerDashboard from './pages/dashboards/ManagerDashboard'
import MaintenanceDashboard from './pages/dashboards/MaintenanceDashboard'
import AccountingDashboard from './pages/dashboards/AccountingDashboard'
import SalesDashboard from './pages/dashboards/SalesDashboard'

// Property management pages
import { BuildingsPage } from './pages/properties/BuildingsPage'
import { FloorsPage } from './pages/properties/FloorsPage'
import { SpacesPage } from './pages/properties/SpacesPage'

// Booking management pages
import {
  BookingListPage,
  BookingFormPage,
  BookingCalendarPage,
  BookingDetailPage,
  BookingStatusPage,
} from './pages/bookings'

// Contract management pages
import {
  ContractListPage,
  ContractDetailsPage,
  ContractFormPage,
  ContractTemplateListPage,
  ContractTemplateFormPage,
  TermsListPage,
  TermsFormPage,
} from './pages/contracts'

// Pricing & Promotions pages
import { PromotionsPage, VouchersPage, PricingCalculatorPage, ServicePricingPage } from './pages/pricing'

// Error pages
import NotFoundPage from './pages/NotFoundPage'
import ForbiddenPage from './pages/ForbiddenPage'

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth routes with AuthLayout */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/otp" element={<VerifyOTPPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>


      {/* Protected routes with DashboardLayout */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'sale', 'accountant', 'maintenance', 'investor']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/:customerId" element={<CustomerDetailsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/credits" element={<CreditPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Role-based dashboard routes */}
      <Route element={<ProtectedRoute allowedRoles={['investor']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['maintenance']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/maintenance" element={<MaintenanceDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['accountant']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/accounting" element={<AccountingDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['sale']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/sales" element={<SalesDashboard />} />
        </Route>
      </Route>

      {/* Property management routes - Admin & Manager only */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/properties/buildings" element={<BuildingsPage />} />
          <Route path="/properties/floors" element={<FloorsPage />} />
          <Route path="/properties/spaces" element={<SpacesPage />} />
        </Route>
      </Route>

      {/* Booking management routes - Admin, Manager & Sale */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'sale']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/bookings" element={<BookingListPage />} />
          <Route path="/bookings/calendar" element={<BookingCalendarPage />} />
          <Route path="/bookings/status" element={<BookingStatusPage />} />
          <Route path="/bookings/new" element={<BookingFormPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/bookings/:id/edit" element={<BookingFormPage />} />
        </Route>
      </Route>

      {/* Contract management routes - Admin, Manager & Sale */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'sale']} />}>
        <Route element={<DashboardLayout />}>
          {/* Contract routes */}
          <Route path="/contracts" element={<ContractListPage />} />
          <Route path="/contracts/new" element={<ContractFormPage />} />
          <Route path="/contracts/:id" element={<ContractDetailsPage />} />
          <Route path="/contracts/:id/edit" element={<ContractFormPage />} />
          
          {/* Contract template routes */}
          <Route path="/contracts/templates" element={<ContractTemplateListPage />} />
          <Route path="/contracts/templates/new" element={<ContractTemplateFormPage />} />
          <Route path="/contracts/templates/:id" element={<ContractTemplateFormPage />} />
          <Route path="/contracts/templates/:id/edit" element={<ContractTemplateFormPage />} />
          
          {/* Terms & Conditions routes */}
          <Route path="/contracts/terms" element={<TermsListPage />} />
          <Route path="/contracts/terms/new" element={<TermsFormPage />} />
          <Route path="/contracts/terms/:id" element={<TermsFormPage />} />
          <Route path="/contracts/terms/:id/edit" element={<TermsFormPage />} />
        </Route>
      </Route>

      {/* Pricing & Promotions routes - Admin, Manager, Accountant & Sale */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'accountant', 'sale']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/pricing/services" element={<ServicePricingPage />} />
          <Route path="/pricing/promotions" element={<PromotionsPage />} />
          <Route path="/pricing/vouchers" element={<VouchersPage />} />
          <Route path="/pricing/calculator" element={<PricingCalculatorPage />} />
        </Route>
      </Route>

      {/* Error pages */}
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
