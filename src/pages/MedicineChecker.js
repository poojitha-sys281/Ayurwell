// src/pages/MedicineChecker.js
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  modernMedicines,
  ayurvedicHerbs,
  checkInteraction,
} from "../data/medicineDB";
import "./MedicineChecker.css";

const allMedicines = [
  ...modernMedicines.map((m) => ({ name: m, type: "modern" })),
  ...ayurvedicHerbs.map((h) => ({ name: h, type: "ayurvedic" })),
];

const statusConfig = {
  safe:    { icon: "✅", label: "Safe",    color: "#1a7a4a", bg: "#eaf7ef", border: "#52b788" },
  caution: { icon: "⚠️", label: "Caution", color: "#b45309", bg: "#fffbeb", border: "#f59e0b" },
  unsafe:  { icon: "❌", label: "Unsafe",  color: "#b91c1c", bg: "#fef2f2", border: "#ef4444" },
  unknown: { icon: "❓", label: "Unknown", color: "#4b5563", bg: "#f9fafb", border: "#9ca3af" },
};

function MedicineInput({ label, value, onChange, placeholder, index }) {
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(null); // clear selection
    if (val.length >= 2) {
      const filtered = allMedicines.filter((m) =>
        m.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }

  function handleSelect(med) {
    setQuery(med.name);
    onChange(med);
    setOpen(false);
  }

  function handleManual() {
    // Allow custom entry not in list
    if (query.trim().length >= 2) {
      onChange({ name: query.trim(), type: "custom" });
      setOpen(false);
    }
  }

  return (
    <div className="mc-input-wrap" ref={ref}>
      <label className="mc-label">{label}</label>
      <div className="mc-input-row">
        <span className="mc-input-num">{index}</span>
        <input
          className="mc-input"
          value={query}
          onChange={handleInput}
          onBlur={handleManual}
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <span className={`mc-type-badge mc-type-${value.type}`}>
            {value.type === "modern" ? "💊 Modern" : value.type === "ayurvedic" ? "🌿 Ayurvedic" : "✏️ Custom"}
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="mc-dropdown">
          {suggestions.map((m) => (
            <div
              key={m.name}
              className="mc-suggestion"
              onMouseDown={() => handleSelect(m)}
            >
              <span>{m.type === "modern" ? "💊" : "🌿"}</span>
              <span>{m.name}</span>
              <span className="mc-sug-type">{m.type === "modern" ? "Modern" : "Ayurvedic"}</span>
            </div>
          ))}
          {query.trim().length >= 2 && !suggestions.find(s => s.name.toLowerCase() === query.toLowerCase()) && (
            <div className="mc-suggestion mc-custom-entry" onMouseDown={handleManual}>
              <span>✏️</span>
              <span>Use "<strong>{query}</strong>" as custom entry</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MedicineChecker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [med1, setMed1] = useState(null);
  const [med2, setMed2] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [checking, setChecking] = useState(false);

  function handleCheck() {
    if (!med1 || !med2) return;
    setChecking(true);
    setTimeout(() => {
      const res = checkInteraction(med1.name, med2.name);
      setResult(res);
      const newEntry = { ...res, time: new Date().toLocaleTimeString() };
      setHistory((h) => [newEntry, ...h.slice(0, 4)]);

      // Save last 5 checks to Firebase
      if (currentUser) {
        const updatedHistory = [newEntry, ...history.slice(0, 4)];
        setDoc(
          doc(db, "users", currentUser.uid),
          {
            medicineChecks: updatedHistory.map(h => ({
              med1: h.med1, med2: h.med2, status: h.status, time: h.time,
            })),
            medicineChecksUpdatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      setChecking(false);
    }, 600);
  }

  function handleReset() {
    setMed1(null);
    setMed2(null);
    setResult(null);
  }

  const cfg = result ? statusConfig[result.status] : null;
  const canCheck = med1 && med2 && med1.name !== med2.name;

  return (
    <div className="mc-container">
      <div className="mc-wrapper">

        {/* Top bar */}
        <div className="mc-topbar">
          <button className="mc-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <div className="mc-logo">🌿 AyurWell</div>
        </div>

        {/* Header */}
        <div className="mc-header">
          <div className="mc-header-icon">💊</div>
          <h1 className="mc-title">Medicine Interaction Checker</h1>
          <p className="mc-subtitle">
            Check if your modern medicine and Ayurvedic herb are safe to take together
          </p>
        </div>

        {/* Input card */}
        <div className="mc-card">
          <MedicineInput
            label="Medicine / Drug 1"
            value={med1}
            onChange={setMed1}
            placeholder="e.g. Warfarin, Metformin, Aspirin..."
            index="1"
          />

          <div className="mc-vs">⟷</div>

          <MedicineInput
            label="Medicine / Herb 2"
            value={med2}
            onChange={setMed2}
            placeholder="e.g. Turmeric, Ashwagandha, Garlic..."
            index="2"
          />

          <div className="mc-actions">
            <button
              className={`mc-btn-check ${!canCheck ? "mc-btn-disabled" : ""}`}
              onClick={handleCheck}
              disabled={!canCheck || checking}
            >
              {checking ? "Checking..." : "🔍 Check Interaction"}
            </button>
            {result && (
              <button className="mc-btn-reset" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {result && cfg && (
          <div
            className="mc-result"
            style={{ background: cfg.bg, borderColor: cfg.border }}
          >
            <div className="mc-result-top">
              <span className="mc-result-icon">{cfg.icon}</span>
              <div>
                <div className="mc-result-status" style={{ color: cfg.color }}>
                  {cfg.label}
                </div>
                <div className="mc-result-combo">
                  {result.med1} + {result.med2}
                </div>
              </div>
            </div>
            <p className="mc-result-reason">{result.reason}</p>
            {result.recommendation && (
              <div className="mc-result-recommendation">
                💡 <strong>Recommendation:</strong> {result.recommendation}
              </div>
            )}
            {result.status !== "safe" && result.status !== "unknown" && (
              <div className="mc-result-warning">
                ⚕️ Always consult your doctor before combining medicines
              </div>
            )}
          </div>
        )}

        {/* Info cards */}
        <div className="mc-info-grid">
          {Object.entries(statusConfig).filter(([k]) => k !== "unknown").map(([key, s]) => (
            <div key={key} className="mc-info-card" style={{ borderColor: s.border + "80" }}>
              <span>{s.icon}</span>
              <div>
                <div className="mc-info-title" style={{ color: s.color }}>{s.label}</div>
                <div className="mc-info-desc">
                  {key === "safe" && "No known harmful interaction"}
                  {key === "caution" && "Monitor closely, consult doctor"}
                  {key === "unsafe" && "Avoid combining — serious risk"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mc-history">
            <h3 className="mc-history-title">Recent Checks</h3>
            {history.map((h, i) => {
              const c = statusConfig[h.status];
              return (
                <div key={i} className="mc-history-row">
                  <span>{c.icon}</span>
                  <span className="mc-history-combo">{h.med1} + {h.med2}</span>
                  <span className="mc-history-status" style={{ color: c.color }}>{c.label}</span>
                  <span className="mc-history-time">{h.time}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mc-disclaimer">
          ⚠️ This tool is for informational purposes only. It does not replace professional medical advice.
          Always consult a licensed doctor or pharmacist before changing your medications.
        </div>

      </div>
    </div>
  );
}
