// src/pages/Dashboard.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const doshaInfo = {
  vata:  { emoji: "🌬️", color: "#7B6FA0", bg: "#F3F0FA", element: "Air & Space" },
  pitta: { emoji: "🔥", color: "#C0622F", bg: "#FDF3EE", element: "Fire & Water" },
  kapha: { emoji: "🌊", color: "#2E7D6B", bg: "#EEF7F5", element: "Earth & Water" },
};

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const dosha = userProfile?.dosha;
  const info = dosha ? doshaInfo[dosha] : null;
  const health = userProfile?.healthProfile;
  const scores = userProfile?.doshaScores;
  const confidence = userProfile?.doshaConfidence;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const totalScore = scores ? scores.vata + scores.pitta + scores.kapha : 0;

  return (
    <div className="dash-container">
      <div className="dash-wrapper">

        {/* Top bar */}
        <div className="dash-topbar">
          <div className="dash-logo">🌿 AyurWell</div>
          <button className="dash-logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* Welcome */}
        <div className="dash-welcome">
          <h1>Welcome, {userProfile?.name || "User"} 👋</h1>
          <p>Your Ayurvedic health profile is ready</p>
        </div>

        {/* Dosha card */}
        {info && (
          <div className="dash-dosha-card" style={{ background: info.bg, borderColor: info.color + "40" }}>
            <div className="dash-dosha-left">
              <div className="dash-dosha-emoji">{info.emoji}</div>
              <div>
                <div className="dash-dosha-label">Your Dosha Type</div>
                <div className="dash-dosha-name" style={{ color: info.color }}>
                  {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                </div>
                <div className="dash-dosha-element">{info.element}</div>
                {confidence && (
                  <div className="dash-dosha-conf" style={{ color: info.color }}>
                    {confidence}% confidence
                  </div>
                )}
              </div>
            </div>
            <button className="dash-retake" onClick={() => navigate("/dosha-quiz")}>Retake</button>

            {/* Score bars */}
            {scores && totalScore > 0 && (
              <div className="dash-score-bars">
                {[
                  { key: "vata", label: "Vata", color: "#7B6FA0" },
                  { key: "pitta", label: "Pitta", color: "#C0622F" },
                  { key: "kapha", label: "Kapha", color: "#2E7D6B" },
                ].map(({ key, label, color }) => {
                  const pct = Math.round((scores[key] / totalScore) * 100);
                  return (
                    <div key={key} className="dash-bar-row">
                      <span className="dash-bar-label">{label}</span>
                      <div className="dash-bar-track">
                        <div
                          className="dash-bar-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                      <span className="dash-bar-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Health summary */}
        {health && (
          <div className="dash-section">
            <h2 className="dash-section-title">Your Health Summary</h2>
            <div className="dash-grid">
              {[
                { icon: "🌙", label: "Sleep", value: health.sleepHours },
                { icon: "⭐", label: "Sleep Quality", value: health.sleepQuality },
                { icon: "🧠", label: "Stress", value: health.stressLevel },
                { icon: "🏃", label: "Exercise", value: health.exerciseFrequency },
                { icon: "💻", label: "Screen Time", value: health.screenTime },
                { icon: "💧", label: "Water Intake", value: health.waterIntake },
                { icon: "🥗", label: "Food Habit", value: health.foodHabit },
                { icon: "⚡", label: "Pain Level", value: health.painLevel },
              ].map((item) => item.value && (
                <div key={item.label} className="dash-stat">
                  <span className="dash-stat-icon">{item.icon}</span>
                  <div>
                    <div className="dash-stat-label">{item.label}</div>
                    <div className="dash-stat-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {health.symptoms && health.symptoms.length > 0 && (
              <div className="dash-symptoms">
                <div className="dash-sym-label">🩺 Current Symptoms</div>
                <div className="dash-sym-chips">
                  {health.symptoms.map((s) => (
                    <span key={s} className="dash-sym-chip">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature cards */}
        <div className="dash-coming">
          <h2 className="dash-section-title">Health Tools</h2>
          <div className="dash-coming-grid">
            {[
              { emoji: "💊", title: "Medicine Checker", desc: "Check Ayurvedic + modern drug interactions", link: "/medicine-checker", badge: "Live" },
              { emoji: "🩺", title: "Symptom Checker", desc: "Identify conditions with ML-powered analysis", link: "/symptom-checker", badge: "Live" },
              { emoji: "✨", title: "Wellness Plan", desc: "Personalised diet & yoga suggestions", link: "/wellness-plan", badge: "Live" },
              { emoji: "🏥", title: "Book Appointment", desc: "Find nearby Ayurvedic doctors", link: "/book-appointment", badge: "Live" },
            ].map((item) => (
              <div
                key={item.title}
                className={`dash-coming-card ${item.link ? "dash-coming-card--active" : ""}`}
                onClick={() => item.link && navigate(item.link)}
                style={{ cursor: item.link ? "pointer" : "default" }}
              >
                <div className="dash-coming-emoji">{item.emoji}</div>
                <div className="dash-coming-title">{item.title}</div>
                <div className="dash-coming-desc">{item.desc}</div>
                <span className={`dash-coming-badge ${item.badge === "Live" ? "dash-coming-badge--live" : ""}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
