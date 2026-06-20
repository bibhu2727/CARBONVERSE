/**
 * Awareness Engine Logic
 * Translates abstract kg of CO2 into emotional and relatable metrics.
 */

export interface RelatableMetrics {
  treesNeeded: number;
  smartphoneCharges: number;
  flightsEquivalent: number; // Short haul flights
  beefBurgers: number;
}

export interface NationalSimulation {
  totalCo2Mt: number; // Megatonnes
  treesNeededMillions: number;
  message: string;
}

// Global averages or reference points for translations
const METRICS = {
  treeAbsorptionAnnualKg: 21, // A mature tree absorbs ~21kg of CO2 per year
  smartphoneChargeKg: 0.008, // Very small amount per charge
  flightShortHaulKg: 150, 
  beefBurgerKg: 4, // Approx 4kg CO2e per burger
  indiaPopulationMillions: 1400,
};

export const generateRelatableMetrics = (annualFootprintKg: number): RelatableMetrics => {
  return {
    treesNeeded: Math.ceil(annualFootprintKg / METRICS.treeAbsorptionAnnualKg),
    smartphoneCharges: Math.floor(annualFootprintKg / METRICS.smartphoneChargeKg),
    flightsEquivalent: parseFloat((annualFootprintKg / METRICS.flightShortHaulKg).toFixed(1)),
    beefBurgers: Math.floor(annualFootprintKg / METRICS.beefBurgerKg),
  };
};

export const generateNationalSimulation = (annualFootprintKg: number): NationalSimulation => {
  // If everyone in India (1.4 billion) had this footprint
  const totalKg = annualFootprintKg * (METRICS.indiaPopulationMillions * 1000000);
  const totalMt = totalKg / 1000000000; // Convert kg to Megatonnes (Mt)
  
  const treesNeededTotal = totalKg / METRICS.treeAbsorptionAnnualKg;
  const treesNeededMillions = treesNeededTotal / 1000000;

  let message = "";
  if (annualFootprintKg < 2000) {
    message = "If everyone lived like you, we would reverse climate change rapidly! 🌍";
  } else if (annualFootprintKg < 4000) {
    message = "If everyone lived like you, global emissions would be stable and manageable. 🌱";
  } else if (annualFootprintKg < 7000) {
    message = "If everyone lived like you, we would need to plant massive new forests to cope. ⚠️";
  } else {
    message = "If everyone lived like you, the planet would face immediate ecological collapse. 🚨";
  }

  return {
    totalCo2Mt: parseFloat(totalMt.toFixed(2)),
    treesNeededMillions: parseFloat(treesNeededMillions.toFixed(1)),
    message,
  };
};
