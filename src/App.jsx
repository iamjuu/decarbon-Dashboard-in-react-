import { Route, Routes, Navigate } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalPage from "./pages/personDetails";
import ShafBillForm from "./pages/staff/form";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/Protectedroute";
import NotFound from "./pages/Notfound";
import Allregistration from "./pages/AllRegistration";
import Booking from "./pages/Bookings";
import DashboardLayout from "./components/DashboardLayout"; // ✅ Import Layout
import Invoice from "./pages/invoice";

// Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function App() {
  return (
    <Routes>
      {/* Default route: Redirect based on authentication */}
      <Route path="/" element={isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<NotFound />} />
      <Route path="/invoice" element={<Invoice />} /> {/* Moved outside DashboardLayout */}

      {/* ✅ Protected Routes wrapped in DashboardLayout */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "User"]}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/home" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/client-details" element={<PersonalPage />} />
        <Route path="/staffs-bill-form" element={<ShafBillForm />} />
        <Route path="/registrations" element={<Allregistration />} />
        <Route path="/bookings" element={<Booking />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

