// src/data/medicineDB.js
// Medicine Interaction Database
// Each entry defines what happens when two substances are combined
// Status: "safe" | "caution" | "unsafe"

export const modernMedicines = [
  "Aspirin", "Ibuprofen", "Paracetamol", "Metformin", "Atorvastatin",
  "Amlodipine", "Omeprazole", "Cetirizine", "Azithromycin", "Amoxicillin",
  "Metronidazole", "Ciprofloxacin", "Pantoprazole", "Losartan", "Atenolol",
  "Levothyroxine", "Insulin", "Warfarin", "Clopidogrel", "Prednisolone",
  "Dexamethasone", "Hydroxychloroquine", "Ranitidine", "Domperidone",
  "Ondansetron", "Diazepam", "Alprazolam", "Sertraline", "Fluoxetine",
  "Montelukast", "Salbutamol", "Folic Acid", "Vitamin D", "Calcium",
];

export const ayurvedicHerbs = [
  "Ashwagandha", "Turmeric (Curcumin)", "Triphala", "Brahmi", "Neem",
  "Tulsi", "Shatavari", "Guggulu", "Trikatu", "Amalaki (Amla)",
  "Haritaki", "Bibhitaki", "Ginger", "Garlic", "Fenugreek",
  "Bitter Melon", "Boswellia", "Moringa", "Licorice Root", "Guduchi",
  "Shankhpushpi", "Arjuna", "Pushkarmool", "Dashamula", "Vidanga",
];

// Interaction rules — [medicine1, medicine2, status, reason]
// medicine1 and medicine2 are lowercase for matching
export const interactions = [
  // UNSAFE combinations
  ["warfarin", "turmeric (curcumin)", "unsafe", "Turmeric significantly increases bleeding risk when combined with Warfarin (blood thinner). Can cause dangerous internal bleeding."],
  ["warfarin", "garlic", "unsafe", "Garlic has blood-thinning properties that dangerously amplify Warfarin's effect, raising risk of severe bleeding."],
  ["warfarin", "ginger", "unsafe", "Ginger inhibits platelet aggregation, which combined with Warfarin can lead to uncontrolled bleeding."],
  ["warfarin", "guggulu", "unsafe", "Guggulu can increase Warfarin metabolism, causing unpredictable anticoagulation levels."],
  ["warfarin", "amalaki (amla)", "unsafe", "Amla has significant Vitamin C content that can alter Warfarin's blood-thinning effect unpredictably."],
  ["aspirin", "garlic", "unsafe", "Both have blood-thinning effects. Combining increases risk of bleeding, especially in the stomach."],
  ["aspirin", "ginger", "unsafe", "Ginger inhibits platelet aggregation similar to Aspirin — combined effect greatly increases bleeding risk."],
  ["clopidogrel", "garlic", "unsafe", "Additive antiplatelet effect — significantly increases bleeding risk."],
  ["metformin", "bitter melon", "unsafe", "Bitter Melon has strong blood-sugar-lowering effects. Combined with Metformin, can cause dangerous hypoglycemia."],
  ["insulin", "bitter melon", "unsafe", "Bitter Melon dramatically lowers blood sugar. Combined with Insulin can cause life-threatening hypoglycemia."],
  ["insulin", "fenugreek", "unsafe", "Fenugreek significantly lowers blood sugar — dangerous hypoglycemia risk when combined with Insulin."],
  ["diazepam", "ashwagandha", "unsafe", "Ashwagandha enhances CNS depressant effects — combined with Diazepam can cause excessive sedation."],
  ["alprazolam", "ashwagandha", "unsafe", "Ashwagandha amplifies sedative effects of Alprazolam, risking over-sedation and respiratory depression."],
  ["levothyroxine", "guggulu", "unsafe", "Guggulu can alter thyroid hormone levels, directly interfering with Levothyroxine therapy."],
  ["prednisolone", "licorice root", "unsafe", "Licorice Root slows metabolism of Prednisolone, increasing steroid side effects significantly."],
  ["dexamethasone", "licorice root", "unsafe", "Licorice Root increases Dexamethasone retention in the body, intensifying steroid effects."],

  // CAUTION combinations
  ["metformin", "fenugreek", "caution", "Fenugreek has mild blood-sugar-lowering effect. Monitor blood sugar closely when combining with Metformin."],
  ["metformin", "bitter melon", "caution", "Bitter Melon has glucose-lowering properties — monitor blood sugar carefully."],
  ["metformin", "turmeric (curcumin)", "caution", "Some studies show Turmeric may enhance Metformin's glucose-lowering effect. Monitor blood sugar."],
  ["atorvastatin", "guggulu", "caution", "Guggulu may affect cholesterol-related pathways — combined effect with Atorvastatin needs monitoring."],
  ["amlodipine", "arjuna", "caution", "Arjuna has cardiac and blood pressure effects — may enhance Amlodipine's action. Monitor BP."],
  ["atenolol", "arjuna", "caution", "Arjuna may lower heart rate and BP, potentially amplifying Atenolol's beta-blocking effects."],
  ["losartan", "arjuna", "caution", "Both lower blood pressure — combined use may lead to hypotension. Monitor BP regularly."],
  ["aspirin", "turmeric (curcumin)", "caution", "Turmeric has mild antiplatelet properties — slightly increases bleeding risk with Aspirin. Use cautiously."],
  ["ibuprofen", "ginger", "caution", "Both have anti-inflammatory effects. Ginger may slightly increase bleeding risk when combined with Ibuprofen."],
  ["sertraline", "ashwagandha", "caution", "Ashwagandha may have mild serotonergic activity — monitor for serotonin syndrome symptoms."],
  ["fluoxetine", "ashwagandha", "caution", "Potential additive serotonergic effects. Monitor for agitation, confusion, or rapid heartbeat."],
  ["fluoxetine", "brahmi", "caution", "Brahmi may enhance serotonin activity — use with caution alongside SSRIs like Fluoxetine."],
  ["sertraline", "brahmi", "caution", "Brahmi has mild serotonergic properties — monitor when combining with Sertraline."],
  ["omeprazole", "triphala", "caution", "Triphala affects gut motility and may alter absorption of Omeprazole. Space doses apart."],
  ["omeprazole", "licorice root", "caution", "Licorice has ulcer-protecting properties but may interact with acid-reducing medications."],
  ["amoxicillin", "garlic", "caution", "Garlic may have mild antibacterial effects but generally safe — monitor for GI side effects."],
  ["ciprofloxacin", "calcium", "caution", "Calcium can bind to Ciprofloxacin and reduce its absorption. Take at least 2 hours apart."],
  ["levothyroxine", "calcium", "caution", "Calcium reduces Levothyroxine absorption significantly. Take 4 hours apart."],
  ["levothyroxine", "fenugreek", "caution", "Fenugreek may affect thyroid function — monitor thyroid levels when combining."],
  ["hydroxychloroquine", "neem", "caution", "Neem has immunomodulatory properties — may interact with Hydroxychloroquine's immune effects."],
  ["prednisolone", "ashwagandha", "caution", "Ashwagandha has immunomodulatory effects that may partially counteract or interact with steroid therapy."],
  ["montelukast", "boswellia", "caution", "Both affect leukotriene pathways — monitor for enhanced or reduced effect."],
  ["salbutamol", "ginger", "caution", "Ginger may mildly affect bronchodilation — generally safe but monitor in severe asthma."],
  ["ibuprofen", "boswellia", "caution", "Both are anti-inflammatory — generally safe together but GI side effects may increase."],
  ["paracetamol", "fenugreek", "caution", "Fenugreek may slightly affect liver enzymes — monitor with prolonged Paracetamol use."],
  ["pantoprazole", "triphala", "caution", "Triphala affects gastric motility and may alter Pantoprazole absorption timing."],

  // SAFE combinations (common queries people want reassurance on)
  ["vitamin d", "ashwagandha", "safe", "No known interaction. Both can be taken together safely."],
  ["vitamin d", "turmeric (curcumin)", "safe", "No known interaction. Turmeric may actually help Vitamin D absorption."],
  ["folic acid", "shatavari", "safe", "No known interaction. Both support nutritional health and can be taken together."],
  ["folic acid", "ashwagandha", "safe", "No known interaction. Safe to use together."],
  ["cetirizine", "tulsi", "safe", "No significant interaction known. Can be taken together."],
  ["domperidone", "ginger", "safe", "Ginger also helps with nausea — complementary and safe to combine."],
  ["ondansetron", "ginger", "safe", "Ginger is complementary to antiemetics. No significant interaction."],
  ["calcium", "ashwagandha", "safe", "No known interaction. Safe to take together."],
  ["paracetamol", "turmeric (curcumin)", "safe", "No significant interaction. Turmeric has anti-inflammatory properties that may be complementary."],
  ["azithromycin", "turmeric (curcumin)", "safe", "No significant interaction known."],
  ["amoxicillin", "turmeric (curcumin)", "safe", "No significant interaction. Turmeric's anti-inflammatory properties may be complementary."],
];

// Lookup function — returns interaction or null
const recommendations = {
  unsafe:  "Do NOT combine these. Consult your doctor immediately and inform them of all medicines you are taking.",
  caution: "Use with caution. Inform your doctor and monitor for side effects regularly.",
  safe:    "Generally safe to combine. Continue your regular medication schedule.",
  unknown: "No interaction data available. Always consult your doctor or pharmacist before combining.",
};

export function checkInteraction(med1, med2) {
  const a = med1.toLowerCase().trim();
  const b = med2.toLowerCase().trim();
  const result = interactions.find(
    ([m1, m2]) =>
      (m1 === a && m2 === b) || (m1 === b && m2 === a)
  );
  if (result) {
    return {
      status: result[2],
      reason: result[3],
      recommendation: recommendations[result[2]],
      med1,
      med2,
    };
  }
  return {
    status: "unknown",
    reason: "No interaction data found for this combination in our database. Please consult your doctor or pharmacist for accurate advice.",
    recommendation: recommendations.unknown,
    med1,
    med2,
  };
}
