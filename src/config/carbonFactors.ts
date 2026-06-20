/**
 * Global Configuration for Carbon Emission Factors
 * Values represent average kg of CO2 equivalent (kg CO2e)
 */

export const CARBON_FACTORS = {
  // TRANSPORTATION (kg CO2 per km)
  transport: {
    walk: 0,
    bicycle: 0,
    public_transport: 0.04, // e.g., bus/train average
    motorcycle: 0.11,
    car: 0.20, // average combustion engine
    cab: 0.25, // accounts for deadheading
  },
  
  // FOOD (kg CO2 per day)
  food: {
    vegan: 2.9,
    vegetarian: 3.8,
    mixed_diet: 5.6,
    meat_heavy: 7.2,
  },
  
  // ELECTRICITY (kg CO2 per kWh)
  // Assuming a mixed grid (coal, gas, renewables). Average global is ~0.45 kg/kWh.
  electricity: {
    per_kwh: 0.45,
    ac_hours_multiplier: 1.5, // kWh per hour of AC
  },
  
  // TRAVEL (kg CO2 per flight)
  travel: {
    domestic_flight: 150, // Short haul
    international_flight: 800, // Long haul
  },
  
  // SHOPPING & CONSUMPTION (kg CO2 per month based on purchasing habits)
  shopping: {
    low: 50,
    moderate: 150,
    high: 300,
  },
  
  // WASTE (Reduction percentage based on recycling habits, represented as absolute kg offset per month)
  waste: {
    recycle_always: -20, // saves 20 kg per month
    recycle_sometimes: -5,
    never_recycle: 10, // penalty
  }
};
