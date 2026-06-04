import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import EventsPage from "./pages/EventsPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AddEventPage from "./pages/AddEventPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import ScanTicketPage from "./pages/ScanTicketPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EventManagementPage from "./pages/EventManagementPage";
import SeatPricingSetupPage from "./pages/SeatPricingSetupPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import QueuePage from "./pages/QueuePage";
import ConcertDetailsPage from "./pages/ConcertDetailsPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

/* ─────────────────────────────────────────────
   ProtectedRoute
   Wraps any route that requires authentication.
───────────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const isMinimalLayout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/payment') || location.pathname.startsWith('/login');

  return (
    <div className="flex flex-col min-h-screen">
      {!isMinimalLayout && <Header />}
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<ConcertDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seats/:eventId"
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queue/:eventId"
          element={
            <ProtectedRoute>
              <QueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:eventId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-event"
          element={
            <ProtectedRoute>
              <AddEventPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanTicketPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seats"
          element={
            <ProtectedRoute>
              <SeatPricingSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrderManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-stage-black">
              <p className="font-display text-6xl font-bold text-amber-gradient">
                404
              </p>
              <p className="mt-3 text-stage-muted">Page not found.</p>
              <a
                href="/events"
                className="mt-6 text-sm text-stage-amber hover:underline"
              >
                ← Back to events
              </a>
            </div>
          }
        />
        </Routes>
      </div>
      {!isMinimalLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
