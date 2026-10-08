import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import "./Login.css";

function Login({ register = false }) {
  const isRegister = register;
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, establishSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <main className="login-page"><p role="status">Checking your session…</p></main>;
  if (user) return <Navigate to={user.role === "seller" ? "/seller-dashboard" : user.role === "admin" ? "/admin" : "/"} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await apiRequest(`/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(isRegister ? { name, email, password, role } : { email, password }),
      });
      establishSession(result);
      const destination = result.role === "seller" ? "/seller-dashboard" : result.role === "admin" ? "/admin" : "/";
      navigate(location.state?.from || destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
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
        <h1>{isRegister ? "Create your account" : "Welcome Back"}</h1>

        <p className="login-subtitle">
          {isRegister ? "Join AdSpot Rwanda" : "Login to your AdSpot account"}
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} required />
              <label htmlFor="role">Account type</label>
              <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </>
          )}

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
          {!isRegister && <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#forgot">
              Forgot password?
            </a>

          </div>}

          {error && <p className="login-error" role="alert">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="login-button"
            disabled={submitting}
          >
            {submitting ? "Please wait…" : isRegister ? "Create account" : "Login"}
          </button>

        </form>

        {/* Sign up */}
        <p className="signup-text">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <Link to={isRegister ? "/login" : "/signup"}>
            {isRegister ? "Login" : "Create an account"}
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