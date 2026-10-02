import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login.
    // We will connect this to MongoDB later.
    if (email && password) {
      navigate("/seller-dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          AdSpot
        </div>

        {/* Heading */}
        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to your AdSpot account
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember + Forgot password */}
          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#forgot">
              Forgot password?
            </a>

          </div>

          {/* Login button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>OR</span>
        </div>

        {/* Google button */}
        <button
          type="button"
          className="google-button"
          onClick={() =>
            alert("Google login will be connected later")
          }
        >
          Continue with Google
        </button>

        {/* Sign up */}
        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">
            Create an account
          </Link>
        </p>

        {/* Back home */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to AdSpot
        </Link>

      </div>
    </div>
  );
}

export default Login;