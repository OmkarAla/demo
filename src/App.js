import { Routes, Route } from "react-router-dom";
import AuthRoute from "./protectedRoute"; // Import the updated AuthRoute
import "./App.css";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import SelectionPage from "./components/Selection";
import AdminDashboard from "./components/AdminDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import ProfilePage from "./components/Profile";
import Courses from "./components/Courses";
import FAQs from "./components/FAQs";

// Retrieve authentication and role from local storage
const token = localStorage.getItem("token");
const role = localStorage.getItem("role"); // Assuming role is stored in localStorage

function App() {
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <HomePage />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <Register />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/selection"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <SelectionPage />
          </AuthRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false} role={role} allowedRoles={["admin"]}>
            <AdminDashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false} role={role} allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <ProfilePage />
          </AuthRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <Courses />
          </AuthRoute>
        }
      />
      <Route
        path="/faqs"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <FAQs />
          </AuthRoute>
        }
      />

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
