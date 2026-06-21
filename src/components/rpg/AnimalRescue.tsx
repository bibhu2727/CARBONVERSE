'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles } from 'lucide-react';
import { useRPGStore, RescuedAnimal } from '@/store/useRPGStore';

const RARITY_COLORS = {
  Common: '#94a3b8',
  Rare: '#3b82f6',
  Epic: '#a855f7',
  Legendary: '#fbbf24'
};

export default function AnimalRescue() {
  const { rescueTickets = 0, rescuedAnimals = [], pullGacha } = useRPGStore();
  const [lastPull, setLastPull] = useState<RescuedAnimal | null>(null);
  const [isPulling, setIsPulling] = useState(false);

  const handlePull = () => {
    if (rescueTickets > 0) {
      setIsPulling(true);
      setTimeout(() => {
        const animal = pullGacha();
        setLastPull(animal);
        setIsPulling(false);
      }, 1000);
    }
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sanctuary</h3>
          <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>Endangered Rescue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#f43f5e' }}>
          <Ticket size={20} /> {rescueTickets}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {isPulling ? (
            <motion.div
              key="pulling"
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: '3rem' }}
            >
              ✨
            </motion.div>
          ) : lastPull ? (
            <motion.div
              key="result"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
            >
              <div style={{ fontSize: '4rem', filter: `drop-shadow(0 0 10px ${RARITY_COLORS[lastPull.rarity]})` }}>
                {lastPull.emoji}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{lastPull.name}</div>
              <div style={{ color: RARITY_COLORS[lastPull.rarity], fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lastPull.rarity}
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ fontSize: '3rem', opacity: 0.5 }}>🌍</div>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>Rescue animals by completing missions.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <button aria-label="Rescue Animal"
        onClick={handlePull}
        disabled={rescueTickets < 1 || isPulling}
        style={{ 
          background: rescueTickets >= 1 ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.05)', 
          border: `1px solid ${rescueTickets >= 1 ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`, 
          color: rescueTickets >= 1 ? '#fff' : 'rgba(255,255,255,0.5)', 
          padding: '0.8rem', borderRadius: '8px', cursor: rescueTickets >= 1 ? 'pointer' : 'not-allowed',
          fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
          transition: 'all 0.2s', marginTop: 'auto'
        }}
      >
        <Sparkles size={16} color={rescueTickets >= 1 ? '#f43f5e' : 'currentColor'} />
        <span>Rescue Animal (1 Ticket)</span>
      </button>

      {rescuedAnimals && rescuedAnimals.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {rescuedAnimals.map(a => (
            <div key={a.id} style={{ minWidth: '40px', height: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: `1px solid ${RARITY_COLORS[a.rarity]}40` }} title={`${a.name} (${a.rarity})`}>
              {a.emoji}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
