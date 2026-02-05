import { useState } from "react";
import { loginApi } from "../services/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginApi({ username, password });

      // Store JWT
      // localStorage.setItem("token", response.token);

      login(response.token);

      // redirect or load protected page
      alert("Login successful!");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.status || "Login failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center">Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            User Name
          </label>
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="passsword" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-sm btn-outline-primary" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
