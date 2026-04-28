// src/pages/WellnessPlan.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./WellnessPlan.css";

const wellnessData = {
  vata: {
    color: "#7B6FA0", bg: "#F3F0FA", emoji: "🌬️", name: "Vata",
    overview: "Vata energy governs movement and communication. To stay balanced, focus on warmth, routine, and nourishment.",
    diet: {
      title: "Vata Pacifying Diet",
      description: "Favour warm, moist, and grounding foods. Eat at regular times each day.",
      eat: [
        { icon: "🍚", name: "Warm rice & khichdi", desc: "Easy to digest, grounding" },
        { icon: "🥛", name: "Warm milk with ghee", desc: "Nourishes nervous system" },
        { icon: "🍠", name: "Root vegetables", desc: "Sweet potato, carrot, beetroot" },
        { icon: "🍌", name: "Ripe sweet fruits", desc: "Banana, mango, avocado" },
        { icon: "🫚", name: "Healthy fats", desc: "Ghee, sesame oil, olive oil" },
        { icon: "🍲", name: "Warm soups & stews", desc: "Hearty, grounding meals" },
        { icon: "🧄", name: "Mildly spiced food", desc: "Ginger, cumin, cinnamon" },
        { icon: "🥜", name: "Soaked nuts", desc: "Almonds, cashews soaked overnight" },
      ],
      avoid: [
        "Raw salads & cold foods", "Cold or iced beverages",
        "Dry crackers & popcorn", "Beans & legumes (without spices)",
        "Bitter & astringent tastes", "Carbonated drinks",
      ],
    },
    yoga: [
      { name: "Surya Namaskar", sanskrit: "Sun Salutation", benefit: "Energises body, builds heat", duration: "12 rounds", emoji: "☀️" },
      { name: "Virabhadrasana", sanskrit: "Warrior Pose", benefit: "Builds strength and stability", duration: "Hold 30s each side", emoji: "⚔️" },
      { name: "Paschimottanasana", sanskrit: "Seated Forward Bend", benefit: "Calms mind, grounds Vata", duration: "1–2 min", emoji: "🧘" },
      { name: "Setu Bandhasana", sanskrit: "Bridge Pose", benefit: "Strengthens back, reduces anxiety", duration: "5 breaths", emoji: "🌉" },
      { name: "Shavasana", sanskrit: "Corpse Pose", benefit: "Deep rest, nervous system reset", duration: "10–15 min", emoji: "🌿" },
      { name: "Anulom Vilom", sanskrit: "Alternate Nostril Breathing", benefit: "Balances Vata, calms mind", duration: "10 min", emoji: "🌬️" },
    ],
    herbs: [
      { name: "Ashwagandha", benefit: "Reduces anxiety, builds strength", how: "1 tsp powder in warm milk at night", emoji: "🌰" },
      { name: "Shatavari", benefit: "Nourishes tissues, balances hormones", how: "1 tsp with warm water or milk", emoji: "🌱" },
      { name: "Triphala", benefit: "Gentle detox, aids digestion", how: "½ tsp in warm water at bedtime", emoji: "🍃" },
      { name: "Brahmi", benefit: "Calms nervous system, improves memory", how: "Brahmi tea or ½ tsp with honey", emoji: "🌿" },
    ],
    lifestyle: [
      { icon: "⏰", tip: "Wake up and sleep at the same time every day — routine is medicine for Vata." },
      { icon: "🛁", tip: "Warm sesame oil self-massage (Abhyanga) before shower, 3–4 times a week." },
      { icon: "🌅", tip: "Spend quiet time in morning — journaling, gentle stretching, no screens." },
      { icon: "🍵", tip: "Sip warm ginger-cinnamon tea throughout the day instead of cold water." },
      { icon: "😴", tip: "Sleep by 10 PM — quality sleep is the most powerful Vata balancer." },
      { icon: "🌿", tip: "Spend time in nature — walk barefoot on grass to ground excess Vata." },
    ],
  },
  pitta: {
    color: "#C0622F", bg: "#FDF3EE", emoji: "🔥", name: "Pitta",
    overview: "Pitta energy governs digestion and transformation. Stay balanced with cooling foods, relaxation, and avoiding overheating.",
    diet: {
      title: "Pitta Pacifying Diet",
      description: "Favour cool, sweet, and bitter foods. Avoid excessive spicy, sour, or salty foods.",
      eat: [
        { icon: "🥒", name: "Cooling vegetables", desc: "Cucumber, zucchini, leafy greens" },
        { icon: "🍈", name: "Sweet fruits", desc: "Grapes, melons, pears, coconut" },
        { icon: "🥛", name: "Dairy & cooling drinks", desc: "Milk, coconut water, buttermilk" },
        { icon: "🌾", name: "Whole grains", desc: "Basmati rice, oats, wheat" },
        { icon: "🫘", name: "Lentils & beans", desc: "Mung dal, chickpeas, tofu" },
        { icon: "🧊", name: "Room temperature water", desc: "Not ice cold, but never hot" },
        { icon: "🌿", name: "Fresh coriander & mint", desc: "Natural Pitta coolers" },
        { icon: "🍯", name: "Natural sweeteners", desc: "Honey, maple syrup, jaggery" },
      ],
      avoid: [
        "Chilli & very spicy food", "Sour fruits (lemon, grapefruit)",
        "Fermented foods & alcohol", "Red meat & fried foods",
        "Excessive caffeine & coffee", "Eating when angry or stressed",
      ],
    },
    yoga: [
      { name: "Chandra Namaskar", sanskrit: "Moon Salutation", benefit: "Cooling, calming counterpart to Sun Salutation", duration: "6–8 rounds", emoji: "🌙" },
      { name: "Sheetali Pranayama", sanskrit: "Cooling Breath", benefit: "Reduces body heat, calms Pitta", duration: "10 min", emoji: "❄️" },
      { name: "Trikonasana", sanskrit: "Triangle Pose", benefit: "Opens chest, reduces tension", duration: "5 breaths each side", emoji: "🔺" },
      { name: "Bhujangasana", sanskrit: "Cobra Pose", benefit: "Relieves back tension, heart opener", duration: "5 breaths", emoji: "🐍" },
      { name: "Yoga Nidra", sanskrit: "Yogic Sleep", benefit: "Deep stress relief, cools fire energy", duration: "20–30 min", emoji: "🌊" },
      { name: "Bhramari", sanskrit: "Humming Bee Breath", benefit: "Soothes anger and frustration", duration: "10 rounds", emoji: "🐝" },
    ],
    herbs: [
      { name: "Brahmi", benefit: "Cools the mind, reduces anger and irritability", how: "Brahmi tea or ½ tsp with coconut oil", emoji: "🌿" },
      { name: "Neem", benefit: "Purifies blood, reduces inflammation", how: "Neem capsules or juice (bitter — dilute well)", emoji: "🍀" },
      { name: "Amalaki (Amla)", benefit: "Richest natural Vitamin C, cools Pitta", how: "1 tsp amla powder in water daily", emoji: "🟢" },
      { name: "Shatavari", benefit: "Nourishing and cooling, reduces inflammation", how: "1 tsp with cool milk or water", emoji: "🌱" },
    ],
    lifestyle: [
      { icon: "🌊", tip: "Spend time near water — rivers, lakes, or ocean swimming deeply calms Pitta." },
      { icon: "🌙", tip: "Moonlight walks in the evening help release built-up heat and stress." },
      { icon: "🧘", tip: "Practise non-competitiveness — Pitta's biggest enemy is itself under pressure." },
      { icon: "💆", tip: "Coconut oil head massage weekly — deeply cooling for an overactive mind." },
      { icon: "🎨", tip: "Creative activities like painting, music, or gardening balance Pitta energy." },
      { icon: "😤", tip: "Pause before reacting in conflicts — breathe first, respond with cool clarity." },
    ],
  },
  kapha: {
    color: "#2E7D6B", bg: "#EEF7F5", emoji: "🌊", name: "Kapha",
    overview: "Kapha energy governs structure and stability. Stay energised with stimulating foods, regular exercise, and avoiding heaviness.",
    diet: {
      title: "Kapha Pacifying Diet",
      description: "Favour light, warm, and spicy foods. Avoid heavy, oily, or cold foods that increase sluggishness.",
      eat: [
        { icon: "🌶️", name: "Spiced warm foods", desc: "Ginger, black pepper, turmeric" },
        { icon: "🥬", name: "Light vegetables", desc: "Leafy greens, broccoli, asparagus" },
        { icon: "🫘", name: "Light legumes", desc: "Mung beans, red lentils, chickpeas" },
        { icon: "🍎", name: "Astringent fruits", desc: "Apples, pears, pomegranate" },
        { icon: "🍵", name: "Warm herbal teas", desc: "Ginger, tulsi, cinnamon teas" },
        { icon: "🌾", name: "Light grains", desc: "Barley, millet, buckwheat, quinoa" },
        { icon: "🐟", name: "Lean proteins", desc: "Fish, chicken, egg whites" },
        { icon: "🧅", name: "Pungent foods", desc: "Onion, garlic, radish, mustard" },
      ],
      avoid: [
        "Dairy products & cheese", "Heavy sweets & refined sugar",
        "Wheat & yeast breads", "Cold foods & iced drinks",
        "Excessive sleep & napping", "Emotional eating",
      ],
    },
    yoga: [
      { name: "Surya Namaskar", sanskrit: "Sun Salutation (fast)", benefit: "Burns sluggishness, generates heat", duration: "20+ rounds briskly", emoji: "☀️" },
      { name: "Kapalbhati", sanskrit: "Skull Shining Breath", benefit: "Clears mucus, stimulates metabolism", duration: "10 min", emoji: "💨" },
      { name: "Utkatasana", sanskrit: "Chair Pose", benefit: "Strengthens legs, builds heat", duration: "Hold 1 min", emoji: "🪑" },
      { name: "Dhanurasana", sanskrit: "Bow Pose", benefit: "Stimulates digestion, opens chest", duration: "5 breaths", emoji: "🏹" },
      { name: "Naukasana", sanskrit: "Boat Pose", benefit: "Strengthens core, reduces Kapha accumulation", duration: "30s holds", emoji: "⛵" },
      { name: "Bhastrika", sanskrit: "Bellows Breath", benefit: "Energises body, clears heaviness", duration: "5 min", emoji: "🔥" },
    ],
    herbs: [
      { name: "Trikatu", benefit: "Stimulates digestion and metabolism, burns Kapha", how: "¼ tsp with honey before meals", emoji: "🌶️" },
      { name: "Guggulu", benefit: "Reduces fat, detoxifies, supports thyroid", how: "Guggulu tablet as directed by Ayurvedic doctor", emoji: "🔴" },
      { name: "Tulsi (Holy Basil)", benefit: "Clears respiratory congestion, boosts immunity", how: "Tulsi tea 2x daily", emoji: "🌿" },
      { name: "Punarnava", benefit: "Reduces water retention and swelling", how: "Punarnava powder with warm water", emoji: "🌱" },
    ],
    lifestyle: [
      { icon: "⏰", tip: "Wake up before 6 AM — Kapha is heaviest from 6–10 AM. Rising early beats the heaviness." },
      { icon: "🏃", tip: "Daily vigorous exercise for at least 30–45 min. Kapha needs to move to stay balanced." },
      { icon: "🧹", tip: "Regular decluttering of your space reduces mental and physical heaviness." },
      { icon: "🌶️", tip: "Use warming spices in every meal — ginger, pepper, mustard seeds, and turmeric." },
      { icon: "🚿", tip: "Dry brushing (Garshana) before shower stimulates lymph and reduces Kapha buildup." },
      { icon: "🎯", tip: "Challenge yourself with new goals — Kapha thrives with purpose and stimulation." },
    ],
  },
};

const seasonalTips = {
  vata: { season: "Autumn & Early Winter", tip: "Vata peaks in autumn. Increase warm sesame oil massages, eat more root vegetables, and reduce travel and over-stimulation." },
  pitta: { season: "Summer & Late Spring", tip: "Pitta peaks in summer. Stay cool, swim, eat cooling foods, avoid midday sun, and practice Sheetali breathing." },
  kapha: { season: "Late Winter & Spring", tip: "Kapha peaks in spring. This is the best time for fasting, detox (Panchakarma), vigorous exercise, and spring cleaning." },
};

export default function WellnessPlan() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const dosha = userProfile?.dosha?.toLowerCase() || "vata";
  const plan = wellnessData[dosha] || wellnessData.vata;
  const seasonal = seasonalTips[dosha];

  return (
    <div className="wp-container">
      <div className="wp-wrapper">

        {/* Top bar */}
        <div className="wp-topbar">
          <button className="wp-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <div className="wp-logo">🌿 AyurWell</div>
        </div>

        {/* Header */}
        <div className="wp-header" style={{ background: plan.bg, borderColor: plan.color + "30" }}>
          <div className="wp-header-emoji">{plan.emoji}</div>
          <div>
            <h1 className="wp-title">Your Wellness Plan</h1>
            <p className="wp-subtitle" style={{ color: plan.color }}>
              Personalised for <strong>{plan.name} Dosha</strong>
            </p>
            <p className="wp-overview">{plan.overview}</p>
          </div>
        </div>

        {/* Seasonal tip */}
        <div className="wp-seasonal" style={{ borderColor: plan.color }}>
          <span className="wp-seasonal-icon">📅</span>
          <div>
            <div className="wp-seasonal-title" style={{ color: plan.color }}>Best Season for You — {seasonal.season}</div>
            <div className="wp-seasonal-text">{seasonal.tip}</div>
          </div>
        </div>

        {/* Diet Section */}
        <div className="wp-section">
          <h2 className="wp-section-title">🥗 {plan.diet.title}</h2>
          <p className="wp-section-desc">{plan.diet.description}</p>

          <div className="wp-food-grid">
            {plan.diet.eat.map((item) => (
              <div key={item.name} className="wp-food-card">
                <span className="wp-food-emoji">{item.icon}</span>
                <div>
                  <div className="wp-food-name">{item.name}</div>
                  <div className="wp-food-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="wp-avoid-box">
            <div className="wp-avoid-title">🚫 Avoid These</div>
            <div className="wp-avoid-chips">
              {plan.diet.avoid.map((a) => (
                <span key={a} className="wp-avoid-chip">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Yoga Section */}
        <div className="wp-section">
          <h2 className="wp-section-title">🧘 Yoga & Pranayama</h2>
          <p className="wp-section-desc">Practices specifically chosen to balance your {plan.name} dosha.</p>
          <div className="wp-yoga-list">
            {plan.yoga.map((pose) => (
              <div key={pose.name} className="wp-yoga-card">
                <div className="wp-yoga-emoji">{pose.emoji}</div>
                <div className="wp-yoga-info">
                  <div className="wp-yoga-name">{pose.name}</div>
                  <div className="wp-yoga-sanskrit">{pose.sanskrit}</div>
                  <div className="wp-yoga-benefit">{pose.benefit}</div>
                </div>
                <div className="wp-yoga-duration" style={{ color: plan.color }}>{pose.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Herbs Section */}
        <div className="wp-section">
          <h2 className="wp-section-title">🌿 Recommended Herbs</h2>
          <div className="wp-herb-grid">
            {plan.herbs.map((herb) => (
              <div key={herb.name} className="wp-herb-card" style={{ borderColor: plan.color + "30" }}>
                <div className="wp-herb-top">
                  <span className="wp-herb-emoji">{herb.emoji}</span>
                  <div className="wp-herb-name">{herb.name}</div>
                </div>
                <div className="wp-herb-benefit">{herb.benefit}</div>
                <div className="wp-herb-how">
                  <span className="wp-herb-how-label">How to take:</span> {herb.how}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Section */}
        <div className="wp-section">
          <h2 className="wp-section-title">✨ Daily Lifestyle Tips</h2>
          <div className="wp-lifestyle-list">
            {plan.lifestyle.map((item, i) => (
              <div key={i} className="wp-lifestyle-card">
                <span className="wp-lifestyle-icon">{item.icon}</span>
                <p className="wp-lifestyle-text">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="wp-disclaimer">
          🌿 This wellness plan is based on traditional Ayurvedic principles for your dosha type. It is for general wellbeing guidance only and does not replace professional medical advice.
        </div>

      </div>
    </div>
  );
}
