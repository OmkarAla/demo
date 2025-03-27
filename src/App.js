import { Routes, Route } from "react-router-dom";
import AuthRoute from "./protectedRoute"; // Importing fixed AuthRoute
import "./App.css";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import SelectionPage from "./components/Selection";
import AdminDashboard from "./components/AdminDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import Courses from "./components/Courses";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  return (
    <Routes>
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
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <AdminDashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <AuthRoute isAuthenticated={isAuthenticated} protect={false}>
            <FacultyDashboard />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
