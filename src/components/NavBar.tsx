import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, username, roles, logout } = useAuth();

  const isAdmin = roles.includes("ROLE_ADMIN");

  return (
    <>
      <nav className="navbar sticky-top navbar-light bg-light shadow-lg mb-3">
        <div className="container-fluid">
          <div>
            <Link className="navbar-brand" to="/">
              🏠
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  className="btn text-primary btn-sm btn-outline"
                  to="/employee-list"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Tooltip on top"
                >
                  Employee List
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link
                  className="btn text-info btn-sm btn-outline"
                  to="/create-employee"
                >
                  New
                </Link>
              </>
            )}
            {isAdmin && <Link 
            className="btn text-warning btn-sm btn-outline"
            to="/admin/users">Manage Users</Link>}
          </div>

          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="me-2 fw-semibold">👤 {username}</span>
                <button
                  className="btn text-danger btn-outline"
                  type="submit"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn text-success btn-outline"
                  type="submit"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
                <button
                  className="btn text-info btn-outline"
                  type="submit"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
