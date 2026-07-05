/* App entry — router, providers, protected role-based routes */
import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Footer, Navbar } from './components/Layout';
import { ToastStack } from './components/ui';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import { Login, Register } from './pages/Auth';
import { AboutPage, AgentsPage } from './pages/Misc';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import type { Role } from './types';

/* Scroll to top on navigation */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

/* Role-based route guard — mirrors the server's authorize() middleware */
function Protected({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    const home = user.role === 'ADMIN' ? '/admin' : user.role === 'AGENT' ? '/agent' : '/dashboard';
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-7xl font-black text-brand-500/20">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist or was moved.</p>
      <a href="#/" className="btn-primary mt-6">Back to home</a>
    </div>
  );
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Listings />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected roles={['CUSTOMER']}><CustomerDashboard /></Protected>} />
          <Route path="/agent" element={<Protected roles={['AGENT']}><AgentDashboard /></Protected>} />
          <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppProvider>
  );
}
