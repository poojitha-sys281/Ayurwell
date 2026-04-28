// src/pages/BookAppointment.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./BookAppointment.css";

const specializations = [
  "General Ayurveda", "Panchakarma Therapy", "Nadi Pariksha (Pulse Diagnosis)",
  "Ayurvedic Nutrition", "Marma Therapy", "Yoga & Pranayama", "Skin & Hair Care",
  "Women's Health (PCOD/Hormonal)", "Joint & Bone Care", "Digestive Disorders",
];

const doctors = [
  {
    id: 1, name: "Dr. Priya Sharma", title: "BAMS, MD (Ayurveda)",
    specialization: "General Ayurveda", experience: "14 years",
    location: "Bengaluru, Karnataka", clinic: "AyurVeda Wellness Centre",
    rating: 4.9, reviews: 312, fee: 500,
    available: ["Mon", "Wed", "Fri", "Sat"],
    times: ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
    about: "Specialist in Tridosha analysis, herbal formulations, and chronic lifestyle disease management using classical Ayurvedic protocols.",
    languages: ["English", "Kannada", "Hindi"],
    emoji: "👩‍⚕️", color: "#7B6FA0",
  },
  {
    id: 2, name: "Dr. Arjun Nair", title: "BAMS, PhD (Panchakarma)",
    specialization: "Panchakarma Therapy", experience: "18 years",
    location: "Bengaluru, Karnataka", clinic: "Shodhan Ayurveda Clinic",
    rating: 4.8, reviews: 487, fee: 700,
    available: ["Tue", "Thu", "Sat"],
    times: ["9:00 AM", "10:30 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
    about: "Expert in detoxification therapies — Vamana, Virechana, Basti, Nasya. Treats chronic conditions with authentic Panchakarma.",
    languages: ["English", "Malayalam", "Kannada"],
    emoji: "👨‍⚕️", color: "#2E7D6B",
  },
  {
    id: 3, name: "Dr. Meera Iyer", title: "BAMS, MS (Shalya Tantra)",
    specialization: "Women's Health (PCOD/Hormonal)", experience: "10 years",
    location: "Bengaluru, Karnataka", clinic: "Shakti Ayur Clinic",
    rating: 4.9, reviews: 228, fee: 600,
    available: ["Mon", "Tue", "Thu", "Sat"],
    times: ["10:00 AM", "11:30 AM", "1:00 PM", "4:00 PM", "5:30 PM"],
    about: "Specialises in women's health — PCOD, hormonal imbalances, menstrual disorders, and fertility support through Ayurvedic protocols.",
    languages: ["English", "Tamil", "Kannada"],
    emoji: "👩‍⚕️", color: "#C0622F",
  },
  {
    id: 4, name: "Dr. Suresh Patil", title: "BAMS, Diploma in Marma",
    specialization: "Marma Therapy", experience: "22 years",
    location: "Bengaluru, Karnataka", clinic: "Dhanvantari Ayur Centre",
    rating: 4.7, reviews: 391, fee: 800,
    available: ["Mon", "Wed", "Fri"],
    times: ["9:30 AM", "11:00 AM", "2:30 PM", "4:00 PM"],
    about: "Classical Marma therapy practitioner for pain management, paralysis recovery, and deep tissue healing. 22 years of authentic practice.",
    languages: ["English", "Kannada", "Marathi"],
    emoji: "👨‍⚕️", color: "#1a3a2a",
  },
  {
    id: 5, name: "Dr. Ananya Krishnan", title: "BAMS, MD (Skin & Hair)",
    specialization: "Skin & Hair Care", experience: "9 years",
    location: "Bengaluru, Karnataka", clinic: "Twak Ayurveda Skin Clinic",
    rating: 4.8, reviews: 175, fee: 550,
    available: ["Tue", "Wed", "Sat", "Sun"],
    times: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"],
    about: "Expert in Ayurvedic dermatology — eczema, psoriasis, acne, hair loss. Blends classical formulations with modern skin science.",
    languages: ["English", "Tamil", "Hindi"],
    emoji: "👩‍⚕️", color: "#52b788",
  },
  {
    id: 6, name: "Dr. Rakesh Gupta", title: "BAMS, PG Diploma (Nutrition)",
    specialization: "Ayurvedic Nutrition", experience: "12 years",
    location: "Bengaluru, Karnataka", clinic: "Ahara Ayur Wellness",
    rating: 4.6, reviews: 203, fee: 450,
    available: ["Mon", "Tue", "Thu", "Fri"],
    times: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    about: "Personalised Ayurvedic diet planning based on your Prakriti (body type). Specialises in diabetes, obesity, and digestive disorders through food as medicine.",
    languages: ["English", "Hindi", "Gujarati"],
    emoji: "👨‍⚕️", color: "#C0622F",
  },
];

const timeSlots = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

function getDatesFromToday(n) {
  const dates = [];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    dates.push({
      dayName: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      full: d.toDateString(),
      shortDay: days[d.getDay()],
    });
  }
  return dates;
}

export default function BookAppointment() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultType, setConsultType] = useState("clinic");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState("list"); // list | doctor | booking | confirm
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const dates = getDatesFromToday(7);
  const dosha = userProfile?.dosha;

  const filteredDoctors = selectedSpec === "All"
    ? doctors
    : doctors.filter((d) => d.specialization === selectedSpec);

  function openDoctor(doc) {
    setSelectedDoctor(doc);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep("doctor");
  }

  function goBooking() {
    setStep("booking");
  }

  async function confirmBooking() {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    const appointment = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      clinic: selectedDoctor.clinic,
      date: selectedDate.full,
      time: selectedTime,
      consultType,
      reason,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    };
    try {
      if (currentUser) {
        await setDoc(
          doc(db, "users", currentUser.uid),
          { lastAppointment: appointment, appointmentUpdatedAt: serverTimestamp() },
          { merge: true }
        );
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setBooked(true);
    setStep("confirm");
  }

  // ── Confirmation screen ────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="ba-container">
        <div className="ba-wrapper">
          <div className="ba-confirm-card">
            <div className="ba-confirm-tick">✅</div>
            <h2 className="ba-confirm-title">Appointment Booked!</h2>
            <p className="ba-confirm-sub">Your appointment has been confirmed</p>
            <div className="ba-confirm-details">
              <div className="ba-confirm-row"><span>Doctor</span><strong>{selectedDoctor.name}</strong></div>
              <div className="ba-confirm-row"><span>Clinic</span><strong>{selectedDoctor.clinic}</strong></div>
              <div className="ba-confirm-row"><span>Date</span><strong>{selectedDate?.date} {selectedDate?.month}</strong></div>
              <div className="ba-confirm-row"><span>Time</span><strong>{selectedTime}</strong></div>
              <div className="ba-confirm-row"><span>Mode</span><strong>{consultType === "clinic" ? "🏥 In-clinic" : "📹 Video call"}</strong></div>
              <div className="ba-confirm-row"><span>Fee</span><strong>₹{selectedDoctor.fee}</strong></div>
            </div>
            <div className="ba-confirm-note">📱 Confirmation details saved to your profile. Please arrive 10 minutes early for in-clinic visits.</div>
            <button className="ba-confirm-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking screen ─────────────────────────────────────────
  if (step === "booking") {
    return (
      <div className="ba-container">
        <div className="ba-wrapper">
          <div className="ba-topbar">
            <button className="ba-back" onClick={() => setStep("doctor")}>← Back</button>
            <div className="ba-logo">🌿 AyurWell</div>
          </div>
          <div className="ba-booking-header">
            <div className="ba-booking-emoji">{selectedDoctor.emoji}</div>
            <div>
              <div className="ba-booking-dname">{selectedDoctor.name}</div>
              <div className="ba-booking-clinic">{selectedDoctor.clinic}</div>
            </div>
          </div>

          {/* Consult type */}
          <div className="ba-section-card">
            <div className="ba-section-label">Consultation Type</div>
            <div className="ba-consult-row">
              {[["clinic","🏥","In-Clinic Visit"],["video","📹","Video Consultation"]].map(([val,ic,lbl])=>(
                <button key={val} className={`ba-consult-btn ${consultType===val?"ba-consult-btn--active":""}`} onClick={()=>setConsultType(val)}>
                  <span>{ic}</span><span>{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div className="ba-section-card">
            <div className="ba-section-label">Select Date</div>
            <div className="ba-date-row">
              {dates.map((d) => {
                const avail = selectedDoctor.available.includes(d.shortDay);
                return (
                  <button
                    key={d.full}
                    className={`ba-date-btn ${selectedDate?.full === d.full ? "ba-date-btn--active" : ""} ${!avail ? "ba-date-btn--disabled" : ""}`}
                    onClick={() => avail && setSelectedDate(d)}
                    disabled={!avail}
                  >
                    <span className="ba-date-day">{d.dayName}</span>
                    <span className="ba-date-num">{d.date}</span>
                    <span className="ba-date-mon">{d.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time picker */}
          {selectedDate && (
            <div className="ba-section-card">
              <div className="ba-section-label">Select Time</div>
              <div className="ba-time-grid">
                {selectedDoctor.times.map((t) => (
                  <button
                    key={t}
                    className={`ba-time-btn ${selectedTime === t ? "ba-time-btn--active" : ""}`}
                    onClick={() => setSelectedTime(t)}
                  >{t}</button>
                ))}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="ba-section-card">
            <div className="ba-section-label">Reason for Visit (optional)</div>
            <textarea
              className="ba-reason-input"
              placeholder="Describe your symptoms or reason for consultation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Fee & confirm */}
          <div className="ba-fee-row">
            <div><div className="ba-fee-label">Consultation Fee</div><div className="ba-fee-amount">₹{selectedDoctor.fee}</div></div>
            <button
              className="ba-confirm-booking-btn"
              disabled={!selectedDate || !selectedTime || loading}
              onClick={confirmBooking}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Doctor detail screen ───────────────────────────────────
  if (step === "doctor") {
    const d = selectedDoctor;
    return (
      <div className="ba-container">
        <div className="ba-wrapper">
          <div className="ba-topbar">
            <button className="ba-back" onClick={() => setStep("list")}>← Back</button>
            <div className="ba-logo">🌿 AyurWell</div>
          </div>

          <div className="ba-doc-detail-card" style={{ borderColor: d.color + "30" }}>
            <div className="ba-doc-detail-top">
              <div className="ba-doc-big-emoji">{d.emoji}</div>
              <div className="ba-doc-detail-info">
                <div className="ba-doc-detail-name">{d.name}</div>
                <div className="ba-doc-detail-title">{d.title}</div>
                <div className="ba-doc-detail-spec" style={{ color: d.color }}>{d.specialization}</div>
                <div className="ba-doc-detail-meta">
                  <span>📍 {d.location}</span>
                  <span>⭐ {d.rating} ({d.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="ba-doc-stats">
              {[["🏥", d.clinic],["⏱️", `${d.experience} experience`],["💰", `₹${d.fee} / visit`]].map(([ic, val]) => (
                <div key={val} className="ba-doc-stat"><span>{ic}</span><span>{val}</span></div>
              ))}
            </div>

            <div className="ba-doc-about">
              <div className="ba-doc-about-title">About</div>
              <p className="ba-doc-about-text">{d.about}</p>
            </div>

            <div className="ba-doc-langs">
              <span className="ba-doc-langs-label">Languages:</span>
              {d.languages.map((l) => <span key={l} className="ba-lang-chip">{l}</span>)}
            </div>

            <div className="ba-doc-avail">
              <span className="ba-doc-avail-label">Available:</span>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                <span key={day} className={`ba-day-chip ${d.available.includes(day) ? "ba-day-chip--active" : ""}`}
                  style={d.available.includes(day) ? { background: d.color + "20", color: d.color, borderColor: d.color + "40" } : {}}>
                  {day}
                </span>
              ))}
            </div>
          </div>

          <button className="ba-book-btn" style={{ background: d.color }} onClick={goBooking}>
            Book Appointment →
          </button>
        </div>
      </div>
    );
  }

  // ── Doctor list screen ─────────────────────────────────────
  return (
    <div className="ba-container">
      <div className="ba-wrapper">
        <div className="ba-topbar">
          <button className="ba-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <div className="ba-logo">🌿 AyurWell</div>
        </div>

        <div className="ba-header">
          <h1 className="ba-title">Book Appointment</h1>
          <p className="ba-subtitle">Find verified Ayurvedic doctors near you</p>
          {dosha && (
            <div className="ba-dosha-tag">
              Your dosha: <strong>{dosha.charAt(0).toUpperCase() + dosha.slice(1)}</strong>
            </div>
          )}
        </div>

        {/* Specialization filter */}
        <div className="ba-filter-scroll">
          {["All", ...specializations].map((s) => (
            <button
              key={s}
              className={`ba-filter-chip ${selectedSpec === s ? "ba-filter-chip--active" : ""}`}
              onClick={() => setSelectedSpec(s)}
            >{s}</button>
          ))}
        </div>

        {/* Doctor cards */}
        <div className="ba-doc-list">
          {filteredDoctors.map((d) => (
            <div key={d.id} className="ba-doc-card" onClick={() => openDoctor(d)}>
              <div className="ba-doc-card-top">
                <div className="ba-doc-emoji-wrap" style={{ background: d.color + "15" }}>
                  <span className="ba-doc-card-emoji">{d.emoji}</span>
                </div>
                <div className="ba-doc-card-info">
                  <div className="ba-doc-card-name">{d.name}</div>
                  <div className="ba-doc-card-title">{d.title}</div>
                  <div className="ba-doc-card-spec" style={{ color: d.color }}>{d.specialization}</div>
                </div>
                <div className="ba-doc-card-rating">
                  <span className="ba-rating-star">⭐</span>
                  <span className="ba-rating-num">{d.rating}</span>
                </div>
              </div>
              <div className="ba-doc-card-bottom">
                <span className="ba-doc-card-exp">🏅 {d.experience}</span>
                <span className="ba-doc-card-loc">📍 {d.location.split(",")[0]}</span>
                <span className="ba-doc-card-fee">₹{d.fee}</span>
              </div>
              <div className="ba-doc-card-avail">
                Available: {d.available.join(" · ")}
              </div>
            </div>
          ))}
        </div>

        <div className="ba-disclaimer">
          🌿 All doctors listed are verified BAMS practitioners. Appointments are for consultation purposes. Always follow your doctor's advice for treatment.
        </div>
      </div>
    </div>
  );
}
