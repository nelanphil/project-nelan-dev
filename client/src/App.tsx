import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ContactPage } from "./pages/ContactPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ClientPortalPage } from "./pages/ClientPortalPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ControlPanelPage } from "./pages/ControlPanelPage";
import { UsersPage } from "./pages/UsersPage";
import { RolesPage } from "./pages/RolesPage";
import { AdminDashboardLayout } from "./components/admin/AdminDashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./utils/theme-context";
import { useEffect } from "react";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MarketingLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <ScrollToTop />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
      </Route>

      <Route path="/client-portal" element={<ClientPortalPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="control-panel" element={<ControlPanelPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <div className="bg-background text-foreground relative min-h-screen">
          <AppRoutes />
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
