import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import LoansPage from "@/pages/LoansPage";
import CreateLoanPage from "@/pages/CreateLoanPage";
import LoanDetailPage from "@/pages/LoanDetailPage";
import RepaymentsPage from "@/pages/RepaymentsPage";
import MembersPage from "@/pages/MembersPage";
import ReportsPage from "@/pages/ReportsPage";
import AuditLogPage from "@/pages/AuditLogPage";
import RiskFlagsPage from "@/pages/RiskFlagsPage";
import MapPage from "@/pages/MapPage";
import ExportsPage from "@/pages/ExportsPage";
import BackupPage from "@/pages/BackupPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/loans/create" element={<CreateLoanPage />} />
              <Route path="/loans/:id" element={<LoanDetailPage />} />
              <Route path="/repayments" element={<RepaymentsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/risk-flags" element={<RiskFlagsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/exports" element={<ExportsPage />} />
              <Route path="/backup" element={<BackupPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
