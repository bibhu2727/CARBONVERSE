'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sun, Wind, Droplets, Package } from 'lucide-react';
import { useRPGStore } from '@/store/useRPGStore';

const ITEM_CONFIG = {
  tree: { icon: <Leaf size={20} color="#4ade80" />, label: 'Plant Tree', cost: 50 },
  solar: { icon: <Sun size={20} color="#fbbf24" />, label: 'Solar Panel', cost: 150 },
  wind: { icon: <Wind size={20} color="#60a5fa" />, label: 'Wind Turbine', cost: 200 },
  water: { icon: <Droplets size={20} color="#38bdf8" />, label: 'Water Filter', cost: 100 }
};

export default function EcoBuilder() {
  const { ecoMaterials = 0, placedItems = [], buyAndPlaceItem } = useRPGStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Eco Builder</h3>
          <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>Build your world</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>
          <Package size={20} /> {ecoMaterials}
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
        Active Structures: {placedItems?.length || 0}
      </div>

      {/* Grid of placed items (Mini Map) */}
      <div style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {(!placedItems || placedItems.length === 0) && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            Empty Plot
          </div>
        )}
        {(placedItems || []).map(item => (
          <motion.div 
            key={item.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ 
              position: 'absolute', 
              left: `${item.x}%`, 
              top: `${item.y}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {ITEM_CONFIG[item.type].icon}
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
        {(Object.keys(ITEM_CONFIG) as Array<keyof typeof ITEM_CONFIG>).map((type) => {
          const config = ITEM_CONFIG[type];
          const canAfford = ecoMaterials >= config.cost;

          return (
            <button aria-label={`Build ${config.label}`}
              key={type}
              onClick={() => buyAndPlaceItem(type)}
              disabled={!canAfford}
              style={{ 
                background: canAfford ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)', 
                border: `1px solid ${canAfford ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, 
                color: canAfford ? '#fff' : 'rgba(255,255,255,0.5)', 
                padding: '0.5rem', borderRadius: '8px', cursor: canAfford ? 'pointer' : 'not-allowed',
                fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                transition: 'all 0.2s'
              }}
            >
              {config.icon}
              <span style={{ fontSize: '0.8rem' }}>{config.label}</span>
              <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.1rem', color: canAfford ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>
                <Package size={10} /> {config.cost}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  );
}
