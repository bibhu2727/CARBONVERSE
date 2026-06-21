"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, Variants } from 'framer-motion';
import { generateRelatableMetrics, generateNationalSimulation } from '../../utils/awarenessEngine';
import { useEngine } from '../../store/useEngine';
import { TreePine, BatteryCharging, Plane, Globe2, AlertTriangle, ArrowRight, Zap, Target, Sparkles } from 'lucide-react';

// Counter component for animated statistics
function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const animation = animate(count, value, { duration: 2, ease: "easeOut" });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const floatVariant: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

interface InsightGeneratorProps {
  onContinue?: () => void;
}

export default function InsightGenerator({ onContinue }: InsightGeneratorProps) {
  const annualFootprintKg = useEngine((state) => state.annualFootprintKg);
  const identity = useEngine((state) => state.climateIdentity);

  if (!identity) return null;

  const metrics = generateRelatableMetrics(annualFootprintKg);
  const simulation = generateNationalSimulation(annualFootprintKg);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 20 } }
  };

  return (
    <motion.div 
      style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: '3rem' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Cinematic Header */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', paddingTop: '2rem' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'rgba(74, 222, 128, 0.2)', borderRadius: '50%', filter: 'blur(120px)', zIndex: -1 }} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="glass-panel"
          style={{ display: 'inline-flex', padding: '1rem', marginBottom: '1rem', borderRadius: '50%' }}
        >
          <Sparkles size={32} color="#4ade80" />
        </motion.div>

        <h2 style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '0.875rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1rem' }}>Climate Identity Diagnosed</h2>
        <h1 className="text-gradient" style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.1 }}>
          {identity.title}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '800px', margin: '0 auto', fontWeight: 300, lineHeight: 1.6 }}>{identity.description}</p>
      </motion.div>

      {/* Core Stats - Glassmorphism Cards */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '160px', height: '160px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(244, 63, 94, 0.8)', fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '1rem' }}>
            <AlertTriangle size={20} />
            Annual Footprint
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <AnimatedNumber value={annualFootprintKg} />
            <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>kg CO₂</span>
          </div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>This is your calculated baseline impact on the global climate ecosystem over 12 months.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '160px', height: '160px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(74, 222, 128, 0.8)', fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '1rem' }}>
            <Target size={20} />
            Reduction Potential
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#4ade80', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <AnimatedNumber value={identity.potentialAnnualReductionKg} />
            <span style={{ fontSize: '1.5rem', color: 'rgba(74, 222, 128, 0.4)', fontWeight: 500 }}>kg CO₂</span>
          </div>
          <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>By forming new habits through CarbonVerse, this is the amount of emissions you can realistically eliminate.</p>
        </div>
      </motion.div>

      {/* Relatable Metrics */}
      <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '200px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '50%', filter: 'blur(120px)', zIndex: -1 }} />
        
        <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Translating Your Impact</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.125rem' }}>Abstract numbers don&apos;t change behavior. Here is what your footprint looks like in the physical world.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}>
            <motion.div variants={floatVariant} animate="animate">
              <TreePine size={40} color="#4ade80" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(52,211,153,0.5))' }} />
            </motion.div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}><AnimatedNumber value={metrics.treesNeeded} /></div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, lineHeight: 1.4 }}>Mature trees growing for a full year to absorb this CO₂.</div>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}>
            <motion.div variants={floatVariant} animate="animate">
              <BatteryCharging size={40} color="#22d3ee" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(34,211,238,0.5))' }} />
            </motion.div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}><AnimatedNumber value={metrics.smartphoneCharges} /></div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, lineHeight: 1.4 }}>Smartphones fully charged from 0 to 100%.</div>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}>
            <motion.div variants={floatVariant} animate="animate">
              <Plane size={40} color="#c084fc" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(192,132,252,0.5))' }} />
            </motion.div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}><AnimatedNumber value={metrics.flightsEquivalent} /></div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, lineHeight: 1.4 }}>Equivalent short-haul flights taken.</div>
          </motion.div>
        </div>
      </motion.div>

      {/* National Simulation */}
      <motion.div variants={itemVariants} className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '3rem', background: 'linear-gradient(135deg, rgba(49, 46, 129, 0.4) 0%, rgba(88, 28, 135, 0.2) 100%)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)', flexShrink: 0 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              <Globe2 size={80} color="#818cf8" />
            </motion.div>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              <Zap size={12} />
              Global Simulation
            </div>
            <h3 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>The Butterfly Effect</h3>
            <p style={{ color: 'rgba(199, 210, 254, 0.7)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '600px' }}>If everyone in India (1.4 Billion people) adopted your exact lifestyle, the national emissions would be:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ color: 'rgba(129, 140, 248, 0.8)', fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Output</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}><AnimatedNumber value={simulation.totalCo2Mt} /> <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>Mt CO₂</span></div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ color: 'rgba(52, 211, 153, 0.8)', fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Forest Needed</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}><AnimatedNumber value={simulation.treesNeededMillions} /> <span style={{ fontSize: '1.125rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>M Trees</span></div>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem', background: annualFootprintKg > 4000 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(52, 211, 153, 0.1)', borderColor: annualFootprintKg > 4000 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(52, 211, 153, 0.2)' }}>
              <AlertTriangle size={24} color={annualFootprintKg > 4000 ? '#fbbf24' : '#4ade80'} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.9)' }}>{simulation.message}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      {onContinue && (
        <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingTop: '2rem', paddingBottom: '4rem', flexWrap: 'wrap' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              useEngine.getState().resetEngine();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', color: '#fff', padding: '1.25rem 2.5rem', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}
          >
            <span>Retake Diagnosis</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', color: '#000', padding: '1.25rem 2.5rem', borderRadius: '999px', fontWeight: 900, fontSize: '1.125rem', cursor: 'pointer', border: 'none', boxShadow: '0 0 40px rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}
          >
            <span>Initialize Mission Control</span>
            <ArrowRight size={24} />
          </motion.button>
        </motion.div>
      )}

    </motion.div>
  );
}
