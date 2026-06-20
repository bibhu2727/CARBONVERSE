'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import FutureSimulator from '@/components/impact/FutureSimulator';

export default function QuestsPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Header */}
        <header>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <span className="text-gradient">Real World</span> Quests
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>Turn daily actions into collective impact.</p>
        </header>

        {/* Quest List & Future Simulator */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Zero Waste Weekend</h3>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>+50 XP</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Avoid single-use plastics for 48 hours. Upload a picture of your reusable alternatives.</p>
              <button style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Accept Quest</button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Carbon Crime Watch</h3>
                <span style={{ color: '#a855f7', fontWeight: 600 }}>Bounty</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Report open garbage burning or illegal dumping in your area to alert local authorities.</p>
              <button style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#f43f5e" /> Report Pollution
              </button>
            </div>
          </div>

          <div>
            <FutureSimulator />
          </div>

        </div>
      </div>
    </main>
  );
}
