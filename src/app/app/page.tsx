'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import EcoBuilder from '@/components/rpg/EcoBuilder';
import AnimalRescue from '@/components/rpg/AnimalRescue';
import SkillTree from '@/components/rpg/SkillTree';
import CarbonShockCard from '@/components/impact/CarbonShockCard';
import MissionEngine from '@/components/rpg/MissionEngine';
import { useRPGStore } from '@/store/useRPGStore';
import { useEngine, getEarthStageFromFootprint } from '@/store/useEngine';
import { Trophy } from 'lucide-react';
import dynamic from 'next/dynamic';

const EarthTwin = dynamic(() => import('@/components/3d/EarthTwin'), { ssr: false });

export default function RPGDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { 
    level = 1, xp = 0, ecoCoins = 0, ecoKarma = 0, carbonSavedKg = 0, 
    currentStreak = 0, triggerDemoMode, 
    isInitialized = false, initializeFromEngine,
    activeGameMode = 'builder', setActiveGameMode
  } = useRPGStore();
  const { hasCompletedOnboarding, annualFootprintKg } = useEngine();

  const rank = level >= 15 ? 'Climate Master' : level >= 5 ? 'Eco Warrior' : 'Eco Novice';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [mounted, hasCompletedOnboarding, router]);

  useEffect(() => {
    if (mounted && hasCompletedOnboarding && !isInitialized) {
      const initialEarthStage = getEarthStageFromFootprint(annualFootprintKg);
      initializeFromEngine(initialEarthStage);
    }
  }, [mounted, hasCompletedOnboarding, isInitialized, annualFootprintKg, initializeFromEngine]);

  if (!mounted || !hasCompletedOnboarding) return null; // avoid hydration mismatch and block render before redirect

  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Background Earth */}
      <div style={{ position: 'fixed', right: '-20%', top: '10%', width: '60vw', height: '80vh', zIndex: -1, opacity: 0.5, pointerEvents: 'none' }}>
        <EarthTwin />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header HUD */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}
            >
              Mission Control
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel text-gradient" 
              style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600 }}
            >
              <Trophy size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} color="#fbbf24" />
              {rank} • Lvl {level}
            </motion.div>
            <button onClick={triggerDemoMode} style={{ display: 'block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
              🚀 Trigger Judge Demo
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Game Mode Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
              <button 
                onClick={() => setActiveGameMode('builder')}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: activeGameMode === 'builder' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeGameMode === 'builder' ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                City Builder
              </button>
              <button 
                onClick={() => setActiveGameMode('gacha')}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: activeGameMode === 'gacha' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeGameMode === 'gacha' ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                Animal Rescue
              </button>
              <button 
                onClick={() => setActiveGameMode('skilltree')}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: activeGameMode === 'skilltree' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeGameMode === 'skilltree' ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                Skill Tree
              </button>
            </div>
            
            {activeGameMode === 'builder' && <EcoBuilder />}
            {activeGameMode === 'gacha' && <AnimalRescue />}
            {activeGameMode === 'skilltree' && <SkillTree />}
          </div>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>XP Progress</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{xp} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>/ {level * 100}</span></div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Eco Coins</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa' }}>🪙 {ecoCoins}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Daily Streak</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316' }}>🔥 {currentStreak}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Eco Karma</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80' }}>{ecoKarma}</div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Carbon Saved</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{carbonSavedKg.toFixed(1)} kg</div>
          </div>
        </div>

        {/* Mission Engine */}
        <MissionEngine />

        {/* Impact Visualizer */}
        <CarbonShockCard kgCO2={Math.max(0, annualFootprintKg - carbonSavedKg)} />

      </div>
    </main>
  );
}
