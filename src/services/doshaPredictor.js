// src/services/doshaPredictor.js
// Uses the trained Random Forest model (dosha_model.json)
// to predict Dosha type from quiz answers

import modelData from "../data/dosha_model.json";

/**
 * Predict Dosha from 8 quiz answers
 * @param {number[]} answers - Array of 8 answers, each 0 (Vata), 1 (Pitta), 2 (Kapha)
 * @returns {{ dosha: string, confidence: number, scores: object }}
 */
export function predictDosha(answers) {
  if (answers.length !== 8) {
    throw new Error("Need exactly 8 answers");
  }

  // Find matching rule in the model
  const rule = modelData.rules.find(
    (r) => r.answers.every((val, i) => val === answers[i])
  );

  if (rule) {
    // Calculate scores from the model rules for this answer pattern
    // Get all rules that share same dominant dosha to build score breakdown
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    // Count how many answers map to each dosha
    answers.forEach((ans) => {
      if (ans === 0) scores.vata++;
      else if (ans === 1) scores.pitta++;
      else if (ans === 2) scores.kapha++;
    });

    return {
      dosha: rule.dosha,
      confidence: rule.confidence,
      scores,
      modelAccuracy: modelData.accuracy,
      method: "Random Forest ML Model",
    };
  }

  // Fallback — simple counting (should rarely happen)
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  answers.forEach((ans) => {
    if (ans === 0) scores.vata++;
    else if (ans === 1) scores.pitta++;
    else if (ans === 2) scores.kapha++;
  });

  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const confidence = Math.round((scores[dominant] / 8) * 100);

  return {
    dosha: dominant,
    confidence,
    scores,
    modelAccuracy: modelData.accuracy,
    method: "Fallback counter",
  };
}

/**
 * Get model info for display
 */
export function getModelInfo() {
  return {
    name: modelData.model_name,
    accuracy: modelData.accuracy,
    cvAccuracy: modelData.cv_accuracy,
    totalRules: modelData.total_rules,
    classes: modelData.classes,
  };
}
