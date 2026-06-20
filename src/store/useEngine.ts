import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CARBON_FACTORS } from '../config/carbonFactors';
import { ActionConfig } from './useRPGStore';

export type TransportType = 'walk' | 'bicycle' | 'public_transport' | 'motorcycle' | 'car' | 'cab';
export type FoodType = 'vegan' | 'vegetarian' | 'mixed_diet' | 'meat_heavy';
export type ShoppingType = 'low' | 'moderate' | 'high';
export type RecyclingType = 'recycle_always' | 'recycle_sometimes' | 'never_recycle';

export interface OnboardingData {
  // Transport
  primaryTransport: TransportType;
  dailyCommuteKm: number;
  
  // Food
  dietType: FoodType;
  
  // Energy
  monthlyElectricityKwh: number;
  dailyAcHours: number;
  
  // Shopping & Travel
  shoppingHabit: ShoppingType;
  domesticFlightsYearly: number;
  internationalFlightsYearly: number;
  
  // Waste
  recyclingHabit: RecyclingType;
  climateAwareness: 'beginner' | 'intermediate' | 'expert';
}

export interface ClimateIdentity {
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  potentialAnnualReductionKg: number;
}

export interface EngineState {
  hasCompletedOnboarding: boolean;
  onboardingData: OnboardingData | null;
  
  // Calculated Metrics
  annualFootprintKg: number;
  monthlyFootprintKg: number;
  
  // Category Breakdown (Annual)
  categoryBreakdown: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
    travel: number;
  };
  
  climateIdentity: ClimateIdentity | null;
  
  // Actions
  submitOnboarding: (data: OnboardingData) => void;
  resetEngine: () => void;
}

// ----------------------------------------------------------------------------
// 1. EARTH EVOLUTION MAPPING ENGINE
// ----------------------------------------------------------------------------
/**
 * Maps the calculated annual footprint to the Earth's starting stage (1 to 5)
 * Global average is around 4000-5000kg.
 */
export const getEarthStageFromFootprint = (annualFootprintKg: number): number => {
  if (annualFootprintKg > 8000) return 1; // Polluted Earth (Very High)
  if (annualFootprintKg > 5000) return 2; // Recovering Earth (High)
  if (annualFootprintKg > 3000) return 3; // Balanced Earth (Average)
  if (annualFootprintKg > 1500) return 4; // Green Earth (Low)
  return 5; // Earth Paradise (Very Low)
};

// ----------------------------------------------------------------------------
// 2. MISSION RECOMMENDATION ENGINE
// ----------------------------------------------------------------------------
/**
 * Dynamically generates recommended missions based on the user's identified weaknesses.
 */
export const getRecommendedMissions = (weaknesses: string[]): ActionConfig[] => {
  const missions: ActionConfig[] = [];
  
  // Fallback / Base missions everyone gets
  missions.push({
    id: 'm_generic_1', title: 'Use a reusable water bottle today', carbonSaved: 0.5, xpReward: 50, coinReward: 5, karmaReward: 5, energyCost: 5
  });
  missions.push({
    id: 'm_generic_2', title: 'Take a 5-minute shorter shower', carbonSaved: 0.3, xpReward: 40, coinReward: 4, karmaReward: 5, energyCost: 5
  });
  missions.push({
    id: 'm_generic_3', title: 'Unplug devices when fully charged', carbonSaved: 0.2, xpReward: 30, coinReward: 3, karmaReward: 5, energyCost: 5
  });

  // Dynamically inject missions based on weaknesses
  if (weaknesses.includes('transport')) {
    missions.push({
      id: 'm_trans_1', title: 'Cycle or walk for a short trip instead of driving', carbonSaved: 1.5, xpReward: 150, coinReward: 15, karmaReward: 20, energyCost: 15
    });
    missions.push({
      id: 'm_trans_2', title: 'Take public transport to work/school', carbonSaved: 2.5, xpReward: 200, coinReward: 20, karmaReward: 25, energyCost: 20
    });
    missions.push({
      id: 'm_trans_3', title: 'Carpool with a friend or colleague', carbonSaved: 2.0, xpReward: 180, coinReward: 18, karmaReward: 25, energyCost: 15
    });
    missions.push({
      id: 'm_trans_4', title: 'Ensure your car tires are properly inflated', carbonSaved: 1.0, xpReward: 100, coinReward: 10, karmaReward: 15, energyCost: 10
    });
  }
  
  if (weaknesses.includes('energy')) {
    missions.push({
      id: 'm_nrg_1', title: 'Reduce AC usage by 2 hours today', carbonSaved: 1.2, xpReward: 120, coinReward: 10, karmaReward: 15, energyCost: 10
    });
    missions.push({
      id: 'm_nrg_2', title: 'Switch all lights to LED or turn off unused lights', carbonSaved: 0.8, xpReward: 100, coinReward: 10, karmaReward: 10, energyCost: 5
    });
    missions.push({
      id: 'm_nrg_3', title: 'Wash clothes in cold water today', carbonSaved: 0.9, xpReward: 110, coinReward: 11, karmaReward: 15, energyCost: 10
    });
    missions.push({
      id: 'm_nrg_4', title: 'Line-dry clothes instead of using the dryer', carbonSaved: 1.5, xpReward: 150, coinReward: 15, karmaReward: 20, energyCost: 15
    });
  }

  if (weaknesses.includes('food')) {
    missions.push({
      id: 'm_food_1', title: 'Eat a fully plant-based meal today', carbonSaved: 3.5, xpReward: 250, coinReward: 25, karmaReward: 30, energyCost: 10
    });
    missions.push({
      id: 'm_food_2', title: 'Compost your food scraps today', carbonSaved: 0.8, xpReward: 100, coinReward: 10, karmaReward: 15, energyCost: 10
    });
    missions.push({
      id: 'm_food_3', title: 'Buy local produce from a farmers market', carbonSaved: 1.2, xpReward: 120, coinReward: 12, karmaReward: 20, energyCost: 15
    });
  }

  if (weaknesses.includes('shopping') || weaknesses.includes('waste')) {
    missions.push({
      id: 'm_shop_1', title: 'Avoid single-use plastics for 24 hours', carbonSaved: 1.0, xpReward: 150, coinReward: 15, karmaReward: 20, energyCost: 10
    });
    missions.push({
      id: 'm_shop_2', title: 'Buy a second-hand item instead of new', carbonSaved: 5.0, xpReward: 300, coinReward: 30, karmaReward: 40, energyCost: 20
    });
    missions.push({
      id: 'm_shop_3', title: 'Repair an old item instead of replacing it', carbonSaved: 3.0, xpReward: 200, coinReward: 20, karmaReward: 30, energyCost: 25
    });
  }

  return missions;
};

// ----------------------------------------------------------------------------
// 3. AI CLIMATE IDENTITY ENGINE
// ----------------------------------------------------------------------------
const generateIdentity = (breakdown: Record<string, number>, total: number): ClimateIdentity => {
  const categories = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const highestCategory = categories[0][0]; // Most emissions
  const lowestCategory = categories[categories.length - 1][0]; // Least emissions

  let title = "Eco Explorer";
  let description = "You are beginning your journey towards a greener future.";
  
  if (total < 2000) {
    title = "Green Warrior";
    description = "You have an exceptionally low carbon footprint. You are leading the charge!";
  } else if (highestCategory === 'transport') {
    title = "Conscious Commuter";
    description = "Transportation makes up the largest part of your footprint.";
  } else if (highestCategory === 'energy') {
    title = "Energy Saver";
    description = "Home electricity and AC usage is your primary carbon source.";
  } else if (highestCategory === 'food') {
    title = "The Foodie";
    description = "Your dietary choices have a significant environmental impact.";
  } else if (highestCategory === 'travel') {
    title = "Frequent Flyer";
    description = "Air travel significantly elevates your carbon emissions.";
  } else if (highestCategory === 'shopping') {
    title = "High Consumer";
    description = "Purchasing habits are currently driving your footprint.";
  }

  // Generate Strengths / Weaknesses (Using string IDs that the Mission Engine can map)
  const strengths = [];
  const weaknesses = [];

  if (lowestCategory === 'transport') strengths.push("transport");
  if (lowestCategory === 'food') strengths.push("food");
  if (lowestCategory === 'energy') strengths.push("energy");

  if (highestCategory === 'transport') weaknesses.push("transport");
  if (highestCategory === 'food') weaknesses.push("food");
  if (highestCategory === 'energy') weaknesses.push("energy");
  if (highestCategory === 'shopping') weaknesses.push("shopping");

  return {
    title,
    description,
    strengths,
    weaknesses,
    potentialAnnualReductionKg: Math.round(total * 0.25), // 25% reduction goal
  };
};

export const useEngine = create<EngineState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      onboardingData: null,
      annualFootprintKg: 0,
      monthlyFootprintKg: 0,
      categoryBreakdown: {
        transport: 0,
        food: 0,
        energy: 0,
        shopping: 0,
        travel: 0,
      },
      climateIdentity: null,

      submitOnboarding: (data: OnboardingData) => {
        // Calculate Transport (Annual)
        const transportDaily = data.dailyCommuteKm * CARBON_FACTORS.transport[data.primaryTransport];
        const transportAnnual = transportDaily * 365;

        // Calculate Food (Annual)
        const foodAnnual = CARBON_FACTORS.food[data.dietType] * 365;

        // Calculate Energy (Annual)
        const energyMonthly = (data.monthlyElectricityKwh * CARBON_FACTORS.electricity.per_kwh) + 
                              (data.dailyAcHours * 30 * CARBON_FACTORS.electricity.ac_hours_multiplier * CARBON_FACTORS.electricity.per_kwh);
        const energyAnnual = energyMonthly * 12;

        // Calculate Shopping (Annual)
        const shoppingAnnual = CARBON_FACTORS.shopping[data.shoppingHabit] * 12;

        // Calculate Travel (Annual)
        const travelAnnual = (data.domesticFlightsYearly * CARBON_FACTORS.travel.domestic_flight) + 
                             (data.internationalFlightsYearly * CARBON_FACTORS.travel.international_flight);

        // Waste adjustment (Annual)
        const wasteAnnualAdjustment = CARBON_FACTORS.waste[data.recyclingHabit] * 12;

        const totalAnnual = transportAnnual + foodAnnual + energyAnnual + shoppingAnnual + travelAnnual + wasteAnnualAdjustment;
        const totalMonthly = totalAnnual / 12;

        const breakdown = {
          transport: transportAnnual,
          food: foodAnnual,
          energy: energyAnnual,
          shopping: shoppingAnnual,
          travel: travelAnnual,
        };

        const identity = generateIdentity(breakdown, totalAnnual);

        set({
          hasCompletedOnboarding: true,
          onboardingData: data,
          annualFootprintKg: Math.round(totalAnnual),
          monthlyFootprintKg: Math.round(totalMonthly),
          categoryBreakdown: {
            transport: Math.round(transportAnnual),
            food: Math.round(foodAnnual),
            energy: Math.round(energyAnnual),
            shopping: Math.round(shoppingAnnual),
            travel: Math.round(travelAnnual),
          },
          climateIdentity: identity,
        });
      },

      resetEngine: () => set({
        hasCompletedOnboarding: false,
        onboardingData: null,
        annualFootprintKg: 0,
        monthlyFootprintKg: 0,
        climateIdentity: null,
      })
    }),
    {
      name: 'carbonverse-engine-state',
    }
  )
);
