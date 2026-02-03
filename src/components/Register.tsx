import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/RegisterService";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password );

      // redirect or load protected page
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
        alert("Registration failed");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>


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

        <button className="btn btn-info" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default Register;
