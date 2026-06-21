'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Globe2, Activity } from 'lucide-react';

// Dynamically import 3D component to avoid SSR issues
const EarthTwin = dynamic(() => import('@/components/3d/EarthTwin'), { ssr: false });

export default function LandingPage() {
  return (
    <main style={{ position: 'relative', minHeight: '200vh', overflow: 'hidden' }}>
      <EarthTwin />
      
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20vh' }}>
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60vh' }}
        >
          <h1 style={{ fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.05em', marginBottom: '1rem' }}>
            <span className="text-gradient">CARBON</span>VERSE
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
            The Climate RPG. Play for the planet. Level up your life.
          </p>
          <Link aria-label="Enter the Verse application" href="/app" className="glass-panel" style={{ padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 600, display: 'inline-block', transition: 'all 0.3s ease' }}>
            Enter the Verse
          </Link>
        </motion.div>

        {/* Scroll Story Section */}
        <div style={{ width: '100%', maxWidth: '1200px', padding: '0 2rem' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="glass-panel"
            style={{ padding: '4rem', marginBottom: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}
          >
            <Globe2 size={64} color="#3b82f6" />
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Digital Twin</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Every action you take in the real world visibly changes your personal digital Earth. Grow forests, clean oceans, and watch your planet thrive.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="glass-panel"
            style={{ padding: '4rem', marginBottom: '10rem', display: 'flex', gap: '2rem', alignItems: 'center', flexDirection: 'row-reverse' }}
          >
            <Activity size={64} color="#4ade80" />
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Future Simulator</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Travel to 2035. See exactly how your current habits will shape your future city, wealth, and environment. Experience the impact before it happens.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
