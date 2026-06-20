'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FutureSimulator() {
  const [sustainability, setSustainability] = useState(50); // 0 to 100

  // Derive future states based on slider
  const tempIncrease = (3 - (sustainability / 50)).toFixed(1);
  const cityState = sustainability > 70 ? 'Thriving, Green, Breathable' : sustainability > 40 ? 'Struggling, Moderate Smog' : 'Severe Pollution, Heatwaves';
  const imgColor = sustainability > 70 ? '#4ade80' : sustainability > 40 ? '#fbbf24' : '#f43f5e';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '2rem', marginTop: '2rem' }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}><span className="text-gradient">Future Self 2035</span> Simulator</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Adjust your current lifestyle sustainability to forecast your future environment.</p>

      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sustainability} 
        onChange={(e) => setSustainability(Number(e.target.value))}
        style={{ width: '100%', marginBottom: '2rem', cursor: 'pointer' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Global Temp Increase</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: imgColor }}>+{tempIncrease}°C</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>2035 City Forecast</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: imgColor }}>{cityState}</div>
        </div>
      </div>
      
      {sustainability > 70 && (
        <p style={{ marginTop: '2rem', color: '#4ade80', fontStyle: 'italic' }}>
          &quot;Because you actively reduced your footprint, your future city is cleaner and greener.&quot; - Climate Legacy
        </p>
      )}
    </motion.div>
  );
}
