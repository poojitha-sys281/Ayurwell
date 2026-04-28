// src/pages/Signup.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ───────────────────────────────────────────
// Sign up free at https://emailjs.com → get these 3 values:
const EMAILJS_SERVICE_ID  = "service_s75cuzr";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_2uc8zfa";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "P2_wmapNKHwPC40kt";   // e.g. "abcDEFghiJKL"
// ─────────────────────────────────────────────────────────────

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getFriendlyError(err) {
  const code = err?.code || "";
  if (code === "auth/email-already-in-use") return "This email is already registered. Please login instead.";
  if (code === "auth/invalid-email")        return "Please enter a valid email address.";
  if (code === "auth/weak-password")        return "Password must be at least 6 characters.";
  if (code === "auth/network-request-failed") return "Network error. Please check your internet connection.";
  if (code === "auth/too-many-requests")    return "Too many attempts. Please try again later.";
  if (err?.message) return err.message.replace("Firebase: ", "").replace(/\s*\(auth\/[^)]+\)\.?/, "").trim();
  return "Something went wrong. Please try again.";
}

export default function Signup() {
  const { signup } = useAuth();

  const [step, setStep] = useState("form");       // form → otp → done
  const [form, setForm]   = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
  const [otp, setOtp]     = useState("");          // what user types
  const [sentOtp, setSentOtp] = useState("");      // what we generated
  const [error, setError] = useState("");
  const [info, setInfo]   = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  // ── Step 1: validate form → send OTP ──────────────────────
  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim())              return setError("Please enter your full name.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6)       return setError("Password must be at least 6 characters.");

    setLoading(true);
    const code = generateOTP();
    setSentOtp(code);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name:  form.name,
          to_email: form.email,
          otp_code: code,
          app_name: "AyurWell",
        },
        EMAILJS_PUBLIC_KEY
      );
      setStep("otp");
      setInfo(`A 6-digit OTP has been sent to ${form.email}`);
      startResendTimer();
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send OTP. Please check your email address and try again.");
    }
    setLoading(false);
  }

  function startResendTimer() {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(""); setInfo("");
    setLoading(true);
    const code = generateOTP();
    setSentOtp(code);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_name: form.name, to_email: form.email, otp_code: code, app_name: "AyurWell" },
        EMAILJS_PUBLIC_KEY
      );
      setInfo("New OTP sent to " + form.email);
      startResendTimer();
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
    setLoading(false);
  }

  // ── Step 2: verify OTP → create Firebase account ──────────
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    if (otp.trim() !== sentOtp) {
      return setError("Incorrect OTP. Please check and try again.");
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name, form.mobile);
      setStep("done");
    } catch (err) {
      setError(getFriendlyError(err));
    }
    setLoading(false);
  }

  // ── Done screen ───────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontFamily: "Lora, serif", color: "#1a3a2a" }}>Account Created!</h2>
          <p className="subtitle">Welcome to AyurWell, <strong>{form.name}</strong>.</p>
          <Link to="/login" className="btn-primary" style={{ display: "block", marginTop: 20, textAlign: "center" }}>
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  // ── OTP entry screen ──────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="leaf-icon">🌿</div>
          <h2 style={{ fontFamily: "Lora, serif", color: "#1a3a2a", marginBottom: 4 }}>Verify Your Email</h2>
          <p className="subtitle" style={{ marginBottom: 20 }}>
            Enter the 6-digit OTP sent to <strong>{form.email}</strong>
          </p>

          {error && <div className="error-box">{error}</div>}
          {info  && <div className="info-box">{info}</div>}

          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP *</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); if (error) setError(""); }}
              style={{ letterSpacing: 10, fontSize: 22, textAlign: "center", fontWeight: 700 }}
              required
            />

            <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{ background: "none", border: "none", color: resendCooldown > 0 ? "#aaa" : "#2d6a4f", cursor: resendCooldown > 0 ? "default" : "pointer", fontSize: 13, fontWeight: 600 }}
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#888" }}>
            Wrong email?{" "}
            <button onClick={() => { setStep("form"); setError(""); setInfo(""); setOtp(""); }}
              style={{ background: "none", border: "none", color: "#2d6a4f", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Signup form ───────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="leaf-icon">🌿</div>
        <h1>AyurWell</h1>
        <p className="subtitle">Create your account</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSendOtp}>
          <label>Full Name *</label>
          <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />

          <label>Email ID *</label>
          <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />

          <label>Mobile Number (optional)</label>
          <input name="mobile" type="tel" placeholder="+91 XXXXXXXXXX" value={form.mobile} onChange={handleChange} />

          <label>Password *</label>
          <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />

          <label>Confirm Password *</label>
          <input name="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP & Continue →"}
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
