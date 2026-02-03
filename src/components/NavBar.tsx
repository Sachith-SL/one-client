import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            {" "}
            <button className="btn btn-info" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
          <div className="d-flex">
                        <button className="btn btn-outline-success" type="submit" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="btn btn-outline-success" type="submit" onClick={() => navigate("/login")}>
              Login
            </button>
                        <button className="btn btn-outline-success" type="submit" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
