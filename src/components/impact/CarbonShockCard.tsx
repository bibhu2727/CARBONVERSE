'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Plane, Zap, Smartphone } from 'lucide-react';
import { useEngine } from '@/store/useEngine';

interface CarbonShockCardProps {
  kgCO2: number;
}

import { useRouter } from 'next/navigation';

export default function CarbonShockCard({ kgCO2 }: CarbonShockCardProps) {
  const router = useRouter();
  
  // Equivalents logic (mocked)
  const trees = Math.ceil(kgCO2 / 21); // ~21kg CO2 absorbed by a tree per year
  const flights = (kgCO2 / 500).toFixed(1); // mock estimate for short flight
  const electricityDays = Math.ceil(kgCO2 / 5); 
  const phoneCharges = Math.ceil(kgCO2 * 120);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: '2rem', marginTop: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
          <span className="text-gradient">Carbon Shock</span> Analysis
        </h2>
        <button aria-label="Update Profile Data"
          onClick={() => {
            useEngine.getState().resetEngine();
            router.push('/onboarding');
          }}
          style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Update Profile Data
        </button>
      </div>
      
      <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
        Your annual emissions equal <strong>{kgCO2} kg CO₂</strong>. This is equivalent to:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
          <TreePine size={32} color="#4ade80" />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{trees}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Trees required</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
          <Plane size={32} color="#3b82f6" />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{flights}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Intl Flights</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
          <Zap size={32} color="#fbbf24" />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{electricityDays}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Days Electricity</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
          <Smartphone size={32} color="#a855f7" />
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{phoneCharges.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Phone Charges</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
