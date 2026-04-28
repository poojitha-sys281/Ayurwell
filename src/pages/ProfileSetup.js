// src/pages/ProfileSetup.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CONDITIONS = ["Diabetes", "Blood Pressure", "Thyroid", "Asthma", "PCOD", "Heart Disease", "None"];

export default function ProfileSetup() {
  const { saveOptionalProfile, currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ age: "", gender: "", conditions: [] });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function toggleCondition(cond) {
    setForm((f) => ({
      ...f,
      conditions: f.conditions.includes(cond)
        ? f.conditions.filter((c) => c !== cond)
        : [...f.conditions, cond],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await saveOptionalProfile(form);
    navigate("/dosha-quiz");
  }

  function handleSkip() {
    navigate("/dosha-quiz");
  }

  return (
    <div className="auth-container">
      <div className="auth-card wide">
        <div className="leaf-icon">🌱</div>
        <h2>Tell us about yourself</h2>
        <p className="subtitle">Optional — helps us personalise your experience</p>

        <form onSubmit={handleSubmit}>
          <label>Age</label>
          <input name="age" type="number" placeholder="Your age" value={form.age} onChange={handleChange} min="1" max="120" />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>

          <label>Existing Health Conditions</label>
          <div className="chip-group">
            {CONDITIONS.map((c) => (
              <button
                type="button"
                key={c}
                className={`chip ${form.conditions.includes(c) ? "chip-active" : ""}`}
                onClick={() => toggleCondition(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save & Continue →"}
          </button>
        </form>

        <button className="btn-skip" onClick={handleSkip}>Skip for now</button>
      </div>
    </div>
  );
}
