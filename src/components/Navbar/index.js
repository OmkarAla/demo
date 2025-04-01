import { CiLogin, CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check authentication state when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth-status", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setUser({ name: data.name, role: data.role });
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate(user?.role === "admin" ? "/admin" : user?.role === "faculty" ? "/faculty" : "/profile");
  };

  return (
    <nav className="navbar nav-lo d-flex flex-row">
      {/* Logo */}
      <Link to="/">
        <img
          src="https://cdn.prod.website-files.com/63db9f4e62e0104e3b11c1f4/63dbb446a8286f60c309218e_Logo-Electives.svg"
          alt="logo"
          className="nav-logo"
        />
      </Link>
      {/* Navbar Links */}
      <ul className="nav-list">
        {user ? (
          <>
            {/* Student Links */}
            {user.role === "student" && (
              <>
                <Link to="/courses" className="nav-item">Courses</Link>
                <Link to="/selection" className="nav-item">Choose Your Elective</Link>
              </>
            )}

            {/* Faculty Links */}
            {user.role === "faculty" && (
              <Link to="/faculty" className="nav-item">Dashboard</Link>
            )}

            {/* Admin Links */}
            {user.role === "admin" && (
              <>
                <Link to="/admin" className="nav-item">Dashboard</Link>
              </>
            )}
            
            {/* Common Link for Logged-in Users */}
            <Link to="/faqs" className="nav-item">FAQs</Link>
          </>
        ) : (
          <>
            {/* Guest Links */}
            <Link to="/courses" className="nav-item">Courses</Link>
            <Link to="/faqs" className="nav-item">FAQs</Link>
            <Link to="/selection" className="nav-item">Choose Your Elective</Link>
          </>
        )}
      </ul>

      {/* Profile & Logout/Login Buttons */}
      {user ? (
        <div className="nav-actions d-flex gap-3">
          <button onClick={handleLogout} className="button">
            Logout <CiLogout className="nav-icon" />
          </button>
        </div>
      ) : (
        location.pathname !== "/login" && (
          <button onClick={() => navigate("/login")} className="button">
            Login <CiLogin className="nav-icon" />
          </button>
        )
      )}
    </nav>
  );
};

export default Navbar;
