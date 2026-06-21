'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRPGStore, ActionConfig } from '@/store/useRPGStore';
import { useEngine, getRecommendedMissions } from '@/store/useEngine';
import { Leaf } from 'lucide-react';

export default function MissionEngine() {
  const dispatchAction = useRPGStore(state => state.dispatchAction);
  const climateIdentity = useEngine(state => state.climateIdentity);
  
  // Dynamically load missions based on weaknesses, or fallback to generic
  const weaknesses = climateIdentity?.weaknesses || [];
  const missions: ActionConfig[] = getRecommendedMissions(weaknesses);

  const handleMission = (mission: ActionConfig) => {
    dispatchAction(mission);
    // Future: trigger global toast notification showing exactly what evolved
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Recommended Missions</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Tailored to your climate identity and identified focus areas.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {missions.map(mission => (
          <motion.div 
            key={mission.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel"
            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleMission(mission)}
          >
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{mission.title}</h4>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Leaf size={12} color="#4ade80" /> {mission.carbonSaved}kg CO₂</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24' }}>★ {mission.xpReward} XP</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#60a5fa' }}>🪙 {mission.coinReward} Coins</span>
              </div>
            </div>
            <button aria-label={`Complete ${mission.title}`} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Complete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
