// src/pages/SymptomChecker.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { predictDisease, getSymptomsByCategory, getModelInfo } from "../services/symptomChecker";
import "./SymptomChecker.css";

export default function SymptomChecker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const categories = getSymptomsByCategory();

  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [activeCategory, setActiveCategory] = useState(Object.keys(categories)[0]);

  function toggleSymptom(sym) {
    setSelected((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
    setResult(null);
  }

  function formatSymptom(sym) {
    return sym.replace(/_/g, " ").replace(/\s+/g, " ").trim()
      .split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  async function handleCheck() {
    if (selected.length < 2) return;
    setChecking(true);
    setTimeout(async () => {
      const prediction = predictDisease(selected);
      setResult(prediction);

      // Save to Firebase
      if (currentUser && prediction?.disease) {
        try {
          await setDoc(doc(db, "users", currentUser.uid), {
            lastSymptomCheck: {
              symptoms: selected,
              disease: prediction.disease,
              confidence: prediction.confidence,
              checkedAt: serverTimestamp(),
            },
          }, { merge: true });
        } catch (e) { console.error(e); }
      }
      setChecking(false);
    }, 800);
  }

  function handleReset() {
    setSelected([]);
    setResult(null);
  }

  return (
    <div className="sc-container">
      <div className="sc-wrapper">

        {/* Top bar */}
        <div className="sc-topbar">
          <button className="sc-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <div className="sc-logo">🌿 AyurWell</div>
        </div>

        {/* Header */}
        <div className="sc-header">
          <div className="sc-header-icon">🩺</div>
          <h1 className="sc-title">Symptom Checker</h1>
          <p className="sc-subtitle">Select your symptoms to identify possible conditions and get Ayurvedic remedies</p>

        </div>

        {/* Selected symptoms */}
        {selected.length > 0 && (
          <div className="sc-selected-box">
            <div className="sc-selected-label">
              Selected Symptoms ({selected.length})
              <button className="sc-clear" onClick={handleReset}>Clear all</button>
            </div>
            <div className="sc-selected-chips">
              {selected.map((s) => (
                <span key={s} className="sc-selected-chip" onClick={() => toggleSymptom(s)}>
                  {formatSymptom(s)} ✕
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="sc-tabs">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              className={`sc-tab ${activeCategory === cat ? "sc-tab-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Symptom chips */}
        <div className="sc-card">
          <div className="sc-category-title">{activeCategory}</div>
          <div className="sc-chips">
            {categories[activeCategory].map((sym) => (
              <button
                key={sym}
                className={`sc-chip ${selected.includes(sym) ? "sc-chip-selected" : ""}`}
                onClick={() => toggleSymptom(sym)}
              >
                {selected.includes(sym) && <span className="sc-chip-check">✓ </span>}
                {formatSymptom(sym)}
              </button>
            ))}
          </div>
        </div>

        {/* Check button */}
        <button
          className={`sc-btn-check ${selected.length < 2 ? "sc-btn-disabled" : ""}`}
          onClick={handleCheck}
          disabled={selected.length < 2 || checking}
        >
          {checking ? "Analysing symptoms..." : selected.length < 2
            ? "Select at least 2 symptoms"
            : `🔍 Analyse ${selected.length} Symptoms`}
        </button>

        {/* Result */}
        {result && result.disease !== "Unknown" && (
          <div className="sc-result">

            {/* Disease prediction */}
            <div className="sc-result-header">
              <div className="sc-result-icon">🔬</div>
              <div>
                <div className="sc-result-label">Possible Condition</div>
                <div className="sc-result-disease">{result.disease}</div>
                <div className="sc-result-conf">
                  Model confidence: <strong>{result.confidence}%</strong>
                </div>
              </div>
            </div>

            {/* Top matches */}
            {result.topMatches && result.topMatches.length > 1 && (
              <div className="sc-top-matches">
                <div className="sc-matches-label">Other possible conditions:</div>
                {result.topMatches.slice(1).map((m) => (
                  <div key={m.disease} className="sc-match-row">
                    <span>{m.disease}</span>
                    <span className="sc-match-conf">{m.confidence}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Remedy */}
            {result.remedy && (
              <div className="sc-remedy">
                <h3 className="sc-remedy-title">🌿 Ayurvedic Remedy</h3>

                {/* Description */}
                {result.remedy.description && (
                  <div className="sc-remedy-section">
                    <div className="sc-remedy-section-title">About this condition</div>
                    <p className="sc-remedy-text">{result.remedy.description}</p>
                  </div>
                )}

                {/* Herbs */}
                {result.remedy.herbs && result.remedy.herbs.length > 0 && (
                  <div className="sc-remedy-section">
                    <div className="sc-remedy-section-title">🌱 Ayurvedic Herbs</div>
                    <div className="sc-herb-chips">
                      {result.remedy.herbs.map((h) => (
                        <span key={h} className="sc-herb-chip">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                
                {result.remedy.precautions && result.remedy.precautions.length > 0 && (
                  <div className="sc-remedy-section">
                    <div className="sc-remedy-section-title">⚠️ Precautions</div>
                    <div className="sc-precautions">
                      {result.remedy.precautions.map((p, i) => (
                        <div key={i} className="sc-precaution-row">
                          <span className="sc-prec-num">{i + 1}</span>
                          <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diet & Yoga */}
                <div className="sc-remedy-grid">
                  <div className="sc-remedy-card">
                    <div className="sc-remedy-card-icon">🥗</div>
                    <div className="sc-remedy-card-title">Diet</div>
                    <div className="sc-remedy-card-text">{result.remedy.diet}</div>
                  </div>
                  <div className="sc-remedy-card">
                    <div className="sc-remedy-card-icon">🧘</div>
                    <div className="sc-remedy-card-title">Yoga</div>
                    <div className="sc-remedy-card-text">{result.remedy.yoga}</div>
                  </div>
                </div>

                <div className="sc-data-source">
                  📊 Data source: {result.source}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="sc-disclaimer">
              ⚕️ This is not a medical diagnosis. Please consult a doctor for proper diagnosis and treatment.
            </div>
          </div>
        )}

        {/* No result */}
        {result && result.disease === "Unknown" && (
          <div className="sc-no-result">
            ❓ {result.message}
          </div>
        )}

      </div>
    </div>
  );
}
