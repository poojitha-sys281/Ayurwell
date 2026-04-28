// src/services/symptomChecker.js
// Uses trained Random Forest model (symptom_model.json) from Kaggle dataset

import modelData from "../data/symptom_model.json";

/**
 * Predict disease from selected symptoms
 * @param {string[]} selectedSymptoms
 * @returns {{ disease, confidence, remedy, topMatches, description, precautions, herbs }}
 */
export function predictDisease(selectedSymptoms) {
  if (!selectedSymptoms || selectedSymptoms.length === 0) return null;

  const symptomToDisease = modelData.symptom_to_disease;
  const remedies = modelData.remedies;
  const diseaseVotes = {};

  selectedSymptoms.forEach((sym) => {
    const cleanSym = sym.toLowerCase().trim();
    const matches = symptomToDisease[cleanSym] || [];
    matches.forEach((d) => {
      diseaseVotes[d] = (diseaseVotes[d] || 0) + 1;
    });
  });

  const sorted = Object.entries(diseaseVotes).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return {
      disease: "Unknown",
      confidence: 0,
      remedy: null,
      topMatches: [],
      message: "Could not identify disease from selected symptoms. Please select more symptoms or consult a doctor.",
    };
  }

  const totalVotes = sorted.reduce((s, [, v]) => s + v, 0);

  const topMatches = sorted.slice(0, 3).map(([d, votes]) => ({
    disease: d,
    confidence: Math.min(Math.round((votes / totalVotes) * 100 * 1.2), 99),
    votes,
  }));

  const topDisease = topMatches[0].disease;
  const confidence = topMatches[0].confidence;
  const remedy = remedies[topDisease] || null;

  return {
    disease: topDisease,
    confidence,
    remedy,
    topMatches,
    totalSymptoms: selectedSymptoms.length,
    source: modelData.dataset_source,
  };
}

/**
 * Get all available symptoms grouped by category
 */
export function getSymptomsByCategory() {
  return {
    "Skin & Hair": [
      "itching", "skin_rash", "nodal_skin_eruptions", "dischromic _patches",
      "yellowish_skin", "skin_peeling", "silver_like_dusting", "small_dents_in_nails",
      "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze",
      "bruising", "puffy_face_and_eyes",
    ],
    "Head & Neurological": [
      "headache", "dizziness", "loss_of_balance", "lack_of_concentration",
      "visual_disturbances", "altered_sensorium", "slurred_speech",
      "spinning_movements", "unsteadiness", "neck_pain",
    ],
    "Digestive": [
      "stomach_pain", "acidity", "vomiting", "nausea", "loss_of_appetite",
      "stomach_bleeding", "distention_of_abdomen", "pain_during_swallowing",
      "passage_of_gases", "internal_itching", "indigestion", "constipation",
      "diarrhoea", "belly_pain", "abdominal_pain",
    ],
    "Respiratory": [
      "cough", "breathlessness", "phlegm", "throat_irritation",
      "sinus_pressure", "runny_nose", "congestion", "chest_pain",
      "blood_in_sputum", "mucoid_sputum", "rusty_sputum", "loss_of_smell",
    ],
    "Body & Muscles": [
      "fatigue", "joint_pain", "muscle_pain", "muscle_weakness", "back_pain",
      "knee_pain", "hip_joint_pain", "stiff_neck", "swelling_joints",
      "movement_disorder", "painful_walking", "weakness_in_limbs",
      "muscle_wasting", "cramps",
    ],
    "Mental & Sleep": [
      "anxiety", "depression", "irritability", "mood_swings", "restlessness",
      "lethargy", "dehydration", "sweating", "chills", "shivering", "malaise",
    ],
    "Urinary & Reproductive": [
      "burning_micturition", "spotting_ urination", "bladder_discomfort",
      "foul_smell_of urine", "continuous_feel_of_urine", "yellow_urine",
      "abnormal_menstruation", "polyuria",
    ],
    "Eyes & Vision": [
      "redness_of_eyes", "watering_from_eyes", "blurred_and_distorted_vision",
      "pain_behind_the_eyes", "yellowing_of_eyes",
    ],
  };
}

/**
 * Get model info for display
 */
export function getModelInfo() {
  return {
    accuracy: modelData.accuracy,
    cvAccuracy: modelData.cv_accuracy,
    totalSamples: modelData.total_samples,
    diseases: modelData.diseases?.length,
    symptoms: modelData.symptoms?.length,
    source: modelData.dataset_source,
  };
}
