// src/pages/HealthProfile.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import "./HealthProfile.css";

const sections = [
  {
    id: "sleep",
    title: "Sleep Pattern",
    emoji: "🌙",
    questions: [
      {
        id: "sleepHours",
        label: "How many hours do you sleep daily?",
        type: "radio",
        options: ["Less than 5 hours", "6–8 hours", "More than 8 hours"],
      },
      {
        id: "sleepQuality",
        label: "How is your sleep quality?",
        type: "radio",
        options: ["Poor (disturbed sleep)", "Average", "Good (deep sleep)"],
      },
    ],
  },
  {
    id: "stress",
    title: "Stress & Mental Health",
    emoji: "🧠",
    questions: [
      {
        id: "stressLevel",
        label: "What is your stress level?",
        type: "radio",
        options: ["Low", "Medium", "High"],
      },
    ],
  },
  {
    id: "activity",
    title: "Physical Activity",
    emoji: "🏃",
    questions: [
      {
        id: "exerciseFrequency",
        label: "How often do you exercise?",
        type: "radio",
        options: ["Rarely / Never", "2–3 times a week", "Daily"],
      },
      {
        id: "workType",
        label: "What is your daily work type?",
        type: "radio",
        options: ["Sitting (desk job / student)", "Moderate activity", "Physically active job"],
      },
    ],
  },
  {
    id: "screen",
    title: "Screen & Water",
    emoji: "💧",
    questions: [
      {
        id: "screenTime",
        label: "How many hours do you use mobile/laptop daily?",
        type: "radio",
        options: ["Less than 3 hours", "3–6 hours", "More than 6 hours"],
      },
      {
        id: "waterIntake",
        label: "How much water do you drink daily?",
        type: "radio",
        options: ["Less than 1 litre", "1–2 litres", "More than 2 litres"],
      },
    ],
  },
  {
    id: "diet",
    title: "Food & Diet",
    emoji: "🥗",
    questions: [
      {
        id: "foodHabit",
        label: "What type of food do you usually eat?",
        type: "radio",
        options: ["Junk / Fast food", "Mixed diet", "Healthy / Home food"],
      },
    ],
  },
  {
    id: "symptoms",
    title: "Current Symptoms",
    emoji: "🩺",
    questions: [
      {
        id: "symptoms",
        label: "Select any symptoms you currently have",
        type: "multiselect",
        options: [
          "Neck pain", "Back pain", "Headache", "Fatigue",
          "Poor digestion", "Anxiety", "Insomnia", "Eye strain",
          "Weight gain", "Low energy", "Skin issues", "None",
        ],
      },
      {
        id: "painLevel",
        label: "Overall pain / discomfort level",
        type: "radio",
        options: ["Low", "Medium", "High"],
      },
    ],
  },
];

export default function HealthProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const section = sections[currentSection];
  const progress = ((currentSection) / sections.length) * 100;

  function handleRadio(qId, value) {
    setAnswers((a) => ({ ...a, [qId]: value }));
  }

  function handleMultiselect(qId, value) {
    setAnswers((a) => {
      const current = a[qId] || [];
      if (value === "None") return { ...a, [qId]: ["None"] };
      const without = current.filter((v) => v !== "None");
      if (without.includes(value)) {
        return { ...a, [qId]: without.filter((v) => v !== value) };
      }
      return { ...a, [qId]: [...without, value] };
    });
  }

  function isSectionComplete() {
    return section.questions.every((q) => {
      const ans = answers[q.id];
      if (q.type === "radio") return !!ans;
      if (q.type === "multiselect") return ans && ans.length > 0;
      return true;
    });
  }

  async function handleNext() {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    } else {
      // Save to Firebase
      setSaving(true);
      try {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            healthProfile: answers,
            healthProfileCompletedAt: serverTimestamp(),
          },
          { merge: true }
        );
        navigate("/dashboard");
      } catch (e) {
        console.error(e);
      }
      setSaving(false);
    }
  }

  return (
    <div className="hp-container">
      <div className="hp-card">
        {/* Header */}
        <div className="hp-header">
          <div className="hp-step-info">
            <span className="hp-step-num">Section {currentSection + 1} of {sections.length}</span>
            <span className="hp-section-tag">{section.emoji} {section.title}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="hp-progress-bg">
          <div className="hp-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Section title */}
        <div className="hp-section-header">
          <span className="hp-section-emoji">{section.emoji}</span>
          <h2 className="hp-section-title">{section.title}</h2>
        </div>

        {/* Questions */}
        <div className="hp-questions">
          {section.questions.map((q) => (
            <div key={q.id} className="hp-question-block">
              <p className="hp-question-label">{q.label}</p>

              {q.type === "radio" && (
                <div className="hp-options">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      className={`hp-option ${answers[q.id] === opt ? "hp-option-selected" : ""}`}
                      onClick={() => handleRadio(q.id, opt)}
                    >
                      <span className="hp-option-dot" />
                      {opt}
                      {answers[q.id] === opt && <span className="hp-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "multiselect" && (
                <div className="hp-chips">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      className={`hp-chip ${(answers[q.id] || []).includes(opt) ? "hp-chip-selected" : ""}`}
                      onClick={() => handleMultiselect(q.id, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="hp-nav">
          {currentSection > 0 && (
            <button className="hp-btn-back" onClick={() => setCurrentSection(currentSection - 1)}>
              ← Back
            </button>
          )}
          <button
            className={`hp-btn-next ${!isSectionComplete() ? "hp-btn-disabled" : ""}`}
            onClick={handleNext}
            disabled={!isSectionComplete() || saving}
          >
            {saving ? "Saving..." : currentSection === sections.length - 1 ? "Complete Profile →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
