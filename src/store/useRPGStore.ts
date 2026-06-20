import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EcoEvent {
  id: string;
  type: string;
  title: string;
  carbonSaved: number;
  xpEarned: number;
  coinsEarned: number;
  karmaEarned: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: number;
}

export interface ActionConfig {
  id: string;
  title: string;
  carbonSaved: number;
  xpReward: number;
  coinReward: number;
  karmaReward: number;
  energyCost: number;
  materialReward?: number; // Replaces energy cost for builder
}

export interface PlacedItem {
  id: string;
  type: 'tree' | 'solar' | 'wind' | 'water';
  x: number;
  y: number;
  placedAt: number;
}

export interface RescuedAnimal {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  emoji: string;
  pulledAt: number;
}

export interface RPGState {
  // Core Stats
  level: number;
  xp: number;
  ecoCoins: number;
  ecoKarma: number;
  carbonSavedKg: number;
  
  // Progression History
  eventHistory: EcoEvent[];
  achievements: Achievement[];
  currentStreak: number;
  lastActionTimestamp: number | null;

  // Active Game Mode
  activeGameMode: 'builder' | 'gacha' | 'skilltree';
  setActiveGameMode: (mode: 'builder' | 'gacha' | 'skilltree') => void;

  // City Builder System
  ecoMaterials: number;
  placedItems: PlacedItem[];

  // Gacha Rescue System
  rescueTickets: number;
  rescuedAnimals: RescuedAnimal[];
  pullGacha: () => RescuedAnimal | null;

  // Skill Tree System
  skillPoints: number;
  unlockedSkills: string[];
  unlockSkill: (skillId: string, cost: number) => boolean;

  // Earth System
  earthStage: number; // 1 to 6
  baseEarthStage: number;

  // Central Dispatcher
  dispatchAction: (action: ActionConfig) => void;
  buyAndPlaceItem: (type: 'tree' | 'solar' | 'wind' | 'water') => boolean;
  triggerDemoMode: () => void; // For judges
  
  // Initialization
  isInitialized: boolean;
  initializeFromEngine: (earthStage: number) => void;
}

// Logic helpers
const checkLevel = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;

const ITEM_COSTS = {
  tree: 50,
  solar: 150,
  wind: 200,
  water: 100
};

const checkEarthEvolution = (karma: number, baseStage: number = 1) => {
  // Now earth stage is influenced by the baseStage from Onboarding
  const stageBoost = Math.floor(karma / 500); // 1 stage per 500 karma
  return Math.min(6, baseStage + stageBoost);
};

export const useRPGStore = create<RPGState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      ecoCoins: 0,
      ecoKarma: 0,
      carbonSavedKg: 0,

      eventHistory: [],
      achievements: [],
      currentStreak: 0,
      lastActionTimestamp: null,

      activeGameMode: 'builder',
      setActiveGameMode: (mode) => set({ activeGameMode: mode }),

      ecoMaterials: 100, // Start with some materials
      placedItems: [],

      rescueTickets: 5, // Start with a few tickets
      rescuedAnimals: [],

      skillPoints: 3, // Start with a few points
      unlockedSkills: [],

      baseEarthStage: 1, // Stored from onboarding
      earthStage: 1, // Current active stage
      isInitialized: false,

      initializeFromEngine: (earthStage: number) => set((state) => {
        if (state.isInitialized) return state; // Only run once
        return {
          isInitialized: true,
          baseEarthStage: earthStage,
          earthStage: earthStage,
        };
      }),

      dispatchAction: (action: ActionConfig) => set((state) => {
        const now = Date.now();
        
        // 1. Streak Logic
        let newStreak = state.currentStreak;
        if (state.lastActionTimestamp) {
          const daysSinceLast = (now - state.lastActionTimestamp) / (1000 * 60 * 60 * 24);
          if (daysSinceLast >= 1 && daysSinceLast < 2) newStreak += 1;
          else if (daysSinceLast >= 2) newStreak = 1;
        } else {
          newStreak = 1;
        }

        // 2. Core Numbers
        const newXp = state.xp + action.xpReward;
        const newCoins = state.ecoCoins + action.coinReward;
        const newKarma = state.ecoKarma + action.karmaReward;
        const newCarbon = state.carbonSavedKg + action.carbonSaved;

        // 3. Game Mechanics Resources
        const newMaterials = state.ecoMaterials + (action.materialReward || 10);
        const newTickets = state.rescueTickets + (action.karmaReward >= 10 ? 1 : 0); // 1 ticket for high-impact missions
        const newSkillPoints = state.skillPoints + (action.xpReward >= 100 ? 1 : 0); // 1 point for big XP missions

        // 4. Evolution Checks
        const newLevel = checkLevel(newXp);
        const newEarthStage = checkEarthEvolution(newKarma, state.baseEarthStage);

        // 5. Event History
        const event: EcoEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'mission',
          title: action.title,
          carbonSaved: action.carbonSaved,
          xpEarned: action.xpReward,
          coinsEarned: action.coinReward,
          karmaEarned: action.karmaReward,
          timestamp: now
        };

        // 6. Achievement Engine
        const newAchievements = [...state.achievements];
        if (state.eventHistory.length === 0) {
          newAchievements.push({ id: 'a1', title: 'First Step', description: 'Completed your first eco action.', unlockedAt: now });
        }
        if (newCarbon >= 100 && !state.achievements.find(a => a.id === 'a2')) {
          newAchievements.push({ id: 'a2', title: '100kg Carbon Saved', description: 'Prevented 100kg of CO2 emissions.', unlockedAt: now });
        }
        if (newStreak === 7 && !state.achievements.find(a => a.id === 'a3')) {
          newAchievements.push({ id: 'a3', title: '7 Day Streak', description: 'Completed actions 7 days in a row.', unlockedAt: now });
        }

        return {
          xp: newXp,
          level: newLevel,
          ecoCoins: newCoins,
          ecoKarma: newKarma,
          carbonSavedKg: newCarbon,
          currentStreak: newStreak,
          lastActionTimestamp: now,
          ecoMaterials: newMaterials,
          rescueTickets: newTickets,
          skillPoints: newSkillPoints,
          earthStage: newEarthStage,
          eventHistory: [event, ...state.eventHistory],
          achievements: newAchievements
        };
      }),

      buyAndPlaceItem: (type) => {
        const state = get();
        const cost = ITEM_COSTS[type];
        if (state.ecoMaterials >= cost) {
          const newItem: PlacedItem = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: Math.random() * 80 + 10, // random % position
            y: Math.random() * 80 + 10,
            placedAt: Date.now()
          };
          set({
            ecoMaterials: state.ecoMaterials - cost,
            placedItems: [...state.placedItems, newItem]
          });
          return true;
        }
        return false;
      },

      pullGacha: () => {
        const state = get();
        if (state.rescueTickets > 0) {
          const rand = Math.random();
          let rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' = 'Common';
          let emoji = '🐢';
          let name = 'Green Turtle';

          if (rand > 0.95) { rarity = 'Legendary'; emoji = '🐉'; name = 'Komodo Dragon'; }
          else if (rand > 0.8) { rarity = 'Epic'; emoji = '🐅'; name = 'Bengal Tiger'; }
          else if (rand > 0.5) { rarity = 'Rare'; emoji = '🦧'; name = 'Orangutan'; }
          else {
            const commons = [{e: '🐢', n: 'Green Turtle'}, {e: '🦋', n: 'Monarch'}, {e: '🐸', n: 'Tree Frog'}];
            const pick = commons[Math.floor(Math.random() * commons.length)];
            emoji = pick.e; name = pick.n;
          }

          const animal: RescuedAnimal = {
            id: Math.random().toString(36).substr(2, 9),
            name, rarity, emoji, pulledAt: Date.now()
          };

          set({
            rescueTickets: state.rescueTickets - 1,
            rescuedAnimals: [animal, ...state.rescuedAnimals]
          });
          return animal;
        }
        return null;
      },

      unlockSkill: (skillId, cost) => {
        const state = get();
        if (state.skillPoints >= cost && !state.unlockedSkills.includes(skillId)) {
          set({
            skillPoints: state.skillPoints - cost,
            unlockedSkills: [...state.unlockedSkills, skillId]
          });
          return true;
        }
        return false;
      },

      triggerDemoMode: () => set((state) => {
        // Fast-forwards progress for Judges
        return {
          level: 25,
          xp: 35000,
          ecoCoins: 5000,
          ecoKarma: 3000,
          carbonSavedKg: 1250.5,
          currentStreak: 90,
          ecoMaterials: 2500,
          placedItems: [],
          rescueTickets: 50,
          rescuedAnimals: [],
          skillPoints: 25,
          unlockedSkills: [],
          earthStage: 6,
          achievements: [
            ...state.achievements,
            { id: 'd1', title: 'Earth Guardian', description: 'Saved 1000kg of Carbon', unlockedAt: Date.now() },
            { id: 'd2', title: 'Community Hero', description: 'Reported 10 pollution zones', unlockedAt: Date.now() }
          ],
          eventHistory: [
            { id: 'demo1', type: 'demo', title: 'Demo Fast Forward', carbonSaved: 1250, xpEarned: 35000, coinsEarned: 5000, karmaEarned: 3000, timestamp: Date.now() },
            ...state.eventHistory
          ]
        };
      })
    }),
    {
      name: 'carbonverse-engine-storage',
    }
  )
);
