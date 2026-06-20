'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Lock, Unlock, Zap, Leaf, ShieldAlert } from 'lucide-react';
import { useRPGStore } from '@/store/useRPGStore';

const SKILL_NODES = [
  { id: 's_solar', label: 'Solar Enthusiast', icon: <Zap size={16} />, cost: 2, parent: null },
  { id: 's_forest', label: 'Forest Guardian', icon: <Leaf size={16} />, cost: 2, parent: null },
  { id: 's_waste', label: 'Zero Waste', icon: <ShieldAlert size={16} />, cost: 2, parent: null },
  { id: 's_solar_2', label: 'Grid Master', icon: <Zap size={16} />, cost: 5, parent: 's_solar' },
  { id: 's_forest_2', label: 'Earth Warden', icon: <Leaf size={16} />, cost: 5, parent: 's_forest' },
];

export default function SkillTree() {
  const { skillPoints = 0, unlockedSkills = [], unlockSkill } = useRPGStore();

  const isUnlocked = (id: string) => unlockedSkills.includes(id);
  const canUnlock = (node: { id: string, cost: number, parent: string | null }) => {
    if (isUnlocked(node.id)) return false;
    if (skillPoints < node.cost) return false;
    if (node.parent && !isUnlocked(node.parent)) return false;
    return true;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px', minHeight: '300px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Skill Tree</h3>
          <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>Climate Masteries</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
          <BrainCircuit size={20} /> {skillPoints} SP
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto' }}>
        {SKILL_NODES.map(node => {
          const unlocked = isUnlocked(node.id);
          const available = canUnlock(node);
          const locked = !unlocked && !available;

          return (
            <motion.button 
              key={node.id}
              onClick={() => unlockSkill(node.id, node.cost)}
              disabled={!available}
              whileHover={available ? { scale: 1.02 } : {}}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem',
                background: unlocked ? 'rgba(16,185,129,0.2)' : available ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${unlocked ? '#10b981' : available ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px', color: unlocked ? '#10b981' : locked ? 'rgba(255,255,255,0.3)' : '#fff',
                cursor: available ? 'pointer' : 'not-allowed', textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {node.icon}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{node.label}</span>
                  {node.parent && <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Requires: {SKILL_NODES.find(n => n.id === node.parent)?.label}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                {unlocked ? <Unlock size={14} /> : locked ? <Lock size={14} /> : `${node.cost} SP`}
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  );
}
