// src/pages/DoshaQuiz.js
// Now powered by trained Random Forest ML model (97.33% accuracy)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { predictDosha } from "../services/doshaPredictor";
import "./DoshaQuiz.css";

const questions = [
  { id: 1, category: "Body Type", emoji: "🧍", question: "How would you describe your body?",
    options: [
      { text: "Thin, light, difficulty gaining weight", dosha: "vata", code: 0 },
      { text: "Medium build, muscular", dosha: "pitta", code: 1 },
      { text: "Heavy, gains weight easily", dosha: "kapha", code: 2 },
    ]},
  { id: 2, category: "Skin Type", emoji: "✋", question: "What is your skin type?",
    options: [
      { text: "Dry, rough", dosha: "vata", code: 0 },
      { text: "Warm, oily, sensitive", dosha: "pitta", code: 1 },
      { text: "Smooth, soft, oily", dosha: "kapha", code: 2 },
    ]},
  { id: 3, category: "Appetite", emoji: "🍽️", question: "How is your appetite?",
    options: [
      { text: "Irregular, sometimes hungry", dosha: "vata", code: 0 },
      { text: "Strong, always hungry", dosha: "pitta", code: 1 },
      { text: "Slow, can skip meals", dosha: "kapha", code: 2 },
    ]},
  { id: 4, category: "Sleep Pattern", emoji: "🌙", question: "How do you sleep?",
    options: [
      { text: "Light sleep, easily disturbed", dosha: "vata", code: 0 },
      { text: "Moderate sleep", dosha: "pitta", code: 1 },
      { text: "Deep, long sleep", dosha: "kapha", code: 2 },
    ]},
  { id: 5, category: "Energy Level", emoji: "⚡", question: "How is your energy level?",
    options: [
      { text: "Active but gets tired quickly", dosha: "vata", code: 0 },
      { text: "Strong and steady", dosha: "pitta", code: 1 },
      { text: "Slow but long-lasting", dosha: "kapha", code: 2 },
    ]},
  { id: 6, category: "Reaction to Stress", emoji: "🧠", question: "How do you react to stress?",
    options: [
      { text: "Anxiety, worry", dosha: "vata", code: 0 },
      { text: "Anger, irritation", dosha: "pitta", code: 1 },
      { text: "Calm but may feel lazy", dosha: "kapha", code: 2 },
    ]},
  { id: 7, category: "Weather Preference", emoji: "🌤️", question: "Which weather do you prefer?",
    options: [
      { text: "Warm weather", dosha: "vata", code: 0 },
      { text: "Cool weather", dosha: "pitta", code: 1 },
      { text: "Dry, warm weather", dosha: "kapha", code: 2 },
    ]},
  { id: 8, category: "Food Preference", emoji: "🥗", question: "What type of food do you like?",
    options: [
      { text: "Warm, light food", dosha: "vata", code: 0 },
      { text: "Cold, spicy food", dosha: "pitta", code: 1 },
      { text: "Heavy, sweet food", dosha: "kapha", code: 2 },
    ]},
];

const doshaInfo = {
  vata:  { name: "Vata",  emoji: "🌬️", color: "#7B6FA0", bg: "#F3F0FA", element: "Air & Space",   diet: "Warm, oily, grounding foods",  avoid: "Cold, dry, raw foods",         herbs: "Ashwagandha, Shatavari, Triphala", description: "Vata types are creative and enthusiastic but prone to anxiety and irregular routines. You thrive with warmth, routine, and nourishing foods." },
  pitta: { name: "Pitta", emoji: "🔥", color: "#C0622F", bg: "#FDF3EE", element: "Fire & Water",  diet: "Cool, sweet, bitter foods",     avoid: "Spicy, oily, sour foods",      herbs: "Brahmi, Neem, Amalaki",           description: "Pitta types are natural leaders with sharp intellect but can be prone to anger and inflammation. Cool foods and relaxation keep you balanced." },
  kapha: { name: "Kapha", emoji: "🌊", color: "#2E7D6B", bg: "#EEF7F5", element: "Earth & Water", diet: "Light, spicy, warm foods",      avoid: "Heavy, sweet, oily foods",     herbs: "Trikatu, Guggulu, Tulsi",         description: "Kapha types are stable and compassionate but prone to weight gain and sluggishness. Light, stimulating foods and exercise keep you vibrant." },
};

export default function DoshaQuiz() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  function handleSelect(code) { setSelected(code); }

  async function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (current < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const prediction = predictDosha(newAnswers);
      setResult(prediction);
      setSaving(true);
      try {
        await setDoc(doc(db, "users", currentUser.uid), {
          dosha: prediction.dosha,
          doshaScores: prediction.scores,
          doshaConfidence: prediction.confidence,
          doshaMethod: prediction.method,
          doshaCompletedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) { console.error(e); }
      setSaving(false);
    }
  }

  if (result) {
    const info = doshaInfo[result.dosha];
    return (
      <div className="dq-container" style={{ "--dosha-color": info.color, "--dosha-bg": info.bg }}>
        <div className="dq-result-card">
          <div className="dq-result-emoji">{info.emoji}</div>
          <div className="dq-result-label">Your Dosha Type</div>
          <h1 className="dq-result-title" style={{ color: info.color }}>{info.name}</h1>
          <div className="dq-result-element">✦ {info.element}</div>
          <div className="dq-confidence">
            <div className="dq-confidence-label">Model Confidence: <strong>{result.confidence}%</strong></div>
            <div className="dq-confidence-bar-bg">
              <div className="dq-confidence-bar-fill" style={{ width: `${result.confidence}%`, background: info.color }} />
            </div>
          </div>
          <p className="dq-result-desc">{info.description}</p>
          <div className="dq-scores">
            {Object.entries(result.scores).map(([d, c]) => (
              <div key={d} className="dq-score-row">
                <span className="dq-score-label">{doshaInfo[d].emoji} {doshaInfo[d].name}</span>
                <div className="dq-score-bar-bg">
                  <div className="dq-score-bar-fill" style={{ width: `${(c / questions.length) * 100}%`, background: doshaInfo[d].color }} />
                </div>
                <span className="dq-score-num">{c}/{questions.length}</span>
              </div>
            ))}
          </div>
          <div className="dq-recs">
            {[["🥗","Recommended Diet",info.diet],["🚫","Avoid",info.avoid],["🌿","Ayurvedic Herbs",info.herbs]].map(([icon,title,text]) => (
              <div key={title} className="dq-rec-item">
                <span className="dq-rec-icon">{icon}</span>
                <div><div className="dq-rec-title">{title}</div><div className="dq-rec-text">{text}</div></div>
              </div>
            ))}
          </div>
          <button className="dq-btn" style={{ background: info.color }} onClick={() => navigate("/health-profile")}>
            Continue to Health Profile →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dq-container">
      <div className="dq-card">
        <div className="dq-header">
          <div className="dq-step">Question {current + 1} of {questions.length}</div>
          <div className="dq-category">{q.emoji} {q.category}</div>
        </div>
        <div className="dq-progress-bg">
          <div className="dq-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <h2 className="dq-question">{q.question}</h2>
        <div className="dq-options">
          {q.options.map((opt, i) => (
            <button key={i} className={`dq-option ${selected === opt.code ? "dq-option-selected" : ""}`} onClick={() => handleSelect(opt.code)}>
              <span className="dq-option-letter">{["A","B","C"][i]}</span>
              <span className="dq-option-text">{opt.text}</span>
              {selected === opt.code && <span className="dq-option-check">✓</span>}
            </button>
          ))}
        </div>
        <button className={`dq-btn ${selected === null ? "dq-btn-disabled" : ""}`} onClick={handleNext} disabled={selected === null}>
          {current === questions.length - 1 ? "Get My Dosha →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
