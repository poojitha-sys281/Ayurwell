// src/pages/Login.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getFriendlyError(err) {
  const code = err?.code || "";
  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
    return "Incorrect email or password. Please try again.";
  if (code === "auth/invalid-email")        return "Please enter a valid email address.";
  if (code === "auth/too-many-requests")    return "Too many failed attempts. Please wait and try again.";
  if (code === "auth/user-disabled")        return "This account has been disabled.";
  if (code === "auth/network-request-failed") return "Network error. Please check your internet connection.";
  return "Login failed. Please check your credentials and try again.";
}

export default function Login() {
  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await login(form.email, form.password);
      const profile  = await fetchUserProfile(userCred.user.uid);

      // Smart redirect — skip steps already completed
      if (profile?.dosha && profile?.healthProfile) {
        navigate("/dashboard");                  // fully set up
      } else if (profile?.dosha) {
        navigate("/health-profile");             // did dosha, not health
      } else if (profile?.optionalProfile) {
        navigate("/dosha-quiz");                 // did optional profile
      } else {
        navigate("/profile-setup");              // brand new user
      }
    } catch (err) {
      setError(getFriendlyError(err));
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="leaf-icon">🌿</div>
        <h1>AyurWell</h1>
        <p className="subtitle">Welcome back</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email ID</label>
          <input name="email" type="email" placeholder="you@email.com"
            value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input name="password" type="password" placeholder="Your password"
            value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
