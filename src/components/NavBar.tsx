import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            <button className="btn btn-info" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
          <div className="d-flex">
            {isLoggedIn ? (
              <button
                className="btn btn-outline-success"
                type="submit"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
                <button
                  className="btn btn-outline-success"
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
