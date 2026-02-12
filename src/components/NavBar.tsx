import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, username, roles, logout } = useAuth();

  const isAdmin = roles.includes("ROLE_ADMIN");

  return (
    <>
      <nav className="navbar navbar-expand-md sticky-top navbar-light bg-light shadow-lg mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            🏠
          </Link>

          {/* Hamburger toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Left-side nav links */}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link text-primary" to="/employee-list">
                    Employee List
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/create-employee">
                    New
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin/users">
                    Manage Users
                  </Link>
                </li>
              )}
            </ul>

            {/* Right-side auth buttons */}
            <div className="d-flex align-items-center gap-2">
              {isLoggedIn ? (
                <>
                  <span className="fw-semibold">👤 {username}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-outline-success"
                    type="button"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                  <button
                    className="btn btn-sm btn-outline-info"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
