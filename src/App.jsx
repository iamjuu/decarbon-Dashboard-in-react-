import { Route, Router, Routes } from "react-router-dom";
// import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalPage from "./pages/personDetails";
import ShafBillForm from "./pages/staff/form";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/Protectedroute";
import "./App.css";
import NotFound from "./pages/Notfound";
import Allregistration from "./pages/AllRegistration";
import Booking from "./pages/Bookings"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<NotFound />} />
      </Routes>

      <div className="  flex  bg-gray-900 text-gray-100 h-screen  ">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["Admin","User"]}>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-details"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <PersonalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staffs-bill-form"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <ShafBillForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrations"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <Allregistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={["Admin", "User"]}>
                <Booking />
              </ProtectedRoute>
            }
          />




          
        </Routes>
      </div>
    </>
  );
}
export default App;
