"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngine, OnboardingData, TransportType, FoodType, ShoppingType, RecyclingType } from '../../store/useEngine';
import { useRouter } from 'next/navigation';
import InsightGenerator from '../../components/awareness/InsightGenerator';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { submitOnboarding, hasCompletedOnboarding, climateIdentity } = useEngine();
  
  const [step, setStep] = useState(1);
  const [isRevealing, setIsRevealing] = useState(false);
  
  // Form State
  const [data, setData] = useState<OnboardingData>({
    primaryTransport: 'car',
    dailyCommuteKm: 15,
    dietType: 'mixed_diet',
    monthlyElectricityKwh: 300,
    dailyAcHours: 4,
    shoppingHabit: 'moderate',
    domesticFlightsYearly: 2,
    internationalFlightsYearly: 0,
    recyclingHabit: 'recycle_sometimes',
    climateAwareness: 'beginner'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = () => {
    setIsRevealing(true);
    setTimeout(() => {
      submitOnboarding(data);
    }, 2500);
  };

  const handleEnterMissionControl = () => {
    router.push('/app');
  };

  if (hasCompletedOnboarding && climateIdentity) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', overflowY: 'auto' }}>
        <InsightGenerator onContinue={handleEnterMissionControl} />
      </div>
    );
  }

  if (isRevealing) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
        >
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#4ade80', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Generating Climate Identity...
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Analyzing your global impact.</p>
        </motion.div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { z: 0, x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradients */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '600px', zIndex: 10 }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Phase {step} of 5</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: '4px', borderRadius: '999px', transition: 'all 0.3s ease', width: i <= step ? '24px' : '8px', background: i <= step ? '#4ade80' : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', width: '100%' }}
            >
              
              {/* STEP 1: TRANSPORTATION */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700 }}>How do you get around?</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Primary Transport</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        {(['walk', 'bicycle', 'public_transport', 'motorcycle', 'car', 'cab'] as TransportType[]).map(t => (
                          <button aria-label={`Select ${t.replace('_', ' ')} as primary transport`}
                            key={t}
                            onClick={() => setData({ ...data, primaryTransport: t })}
                            className="glass-panel"
                            style={{ padding: '1rem', textAlign: 'left', textTransform: 'capitalize', cursor: 'pointer', background: data.primaryTransport === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', borderColor: data.primaryTransport === t ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.1)', color: data.primaryTransport === t ? '#4ade80' : '#fff' }}
                          >
                            {t.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dailyCommute" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Daily Commute (km)</label>
                      <input 
                        id="dailyCommute"
                        type="range" min="0" max="100" 
                        value={data.dailyCommuteKm}
                        onChange={(e) => setData({...data, dailyCommuteKm: parseInt(e.target.value)})}
                        style={{ width: '100%', accentColor: '#4ade80' }}
                      />
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#4ade80' }}>{data.dailyCommuteKm} km/day</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: FOOD */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700 }}>What fuels you?</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Diet Type</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                      {(['vegan', 'vegetarian', 'mixed_diet', 'meat_heavy'] as FoodType[]).map(t => (
                        <button aria-label={`Select ${t.replace('_', ' ')} diet`}
                          key={t}
                          onClick={() => setData({ ...data, dietType: t })}
                          className="glass-panel"
                          style={{ padding: '1.25rem', textAlign: 'left', textTransform: 'capitalize', fontSize: '1.125rem', cursor: 'pointer', background: data.dietType === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', borderColor: data.dietType === t ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.1)', color: data.dietType === t ? '#4ade80' : '#fff' }}
                        >
                          {t.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ENERGY */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700 }}>Powering your home</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label htmlFor="monthlyElectricity" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Monthly Electricity (kWh)</label>
                      <input 
                        id="monthlyElectricity"
                        type="range" min="50" max="1000" step="50"
                        value={data.monthlyElectricityKwh}
                        onChange={(e) => setData({...data, monthlyElectricityKwh: parseInt(e.target.value)})}
                        style={{ width: '100%', accentColor: '#4ade80' }}
                      />
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#4ade80' }}>{data.monthlyElectricityKwh} kWh</div>
                    </div>
                    <div>
                      <label htmlFor="dailyAcHours" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Daily AC Usage (Hours)</label>
                      <input 
                        id="dailyAcHours"
                        type="range" min="0" max="24" 
                        value={data.dailyAcHours}
                        onChange={(e) => setData({...data, dailyAcHours: parseInt(e.target.value)})}
                        style={{ width: '100%', accentColor: '#4ade80' }}
                      />
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#4ade80' }}>{data.dailyAcHours} hours/day</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: TRAVEL & SHOPPING */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700 }}>Travel & Consumption</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Shopping Habit</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                        {(['low', 'moderate', 'high'] as ShoppingType[]).map(t => (
                          <button aria-label={`Select ${t} shopping habit`}
                            key={t}
                            onClick={() => setData({ ...data, shoppingHabit: t })}
                            className="glass-panel"
                            style={{ padding: '0.75rem', textAlign: 'center', textTransform: 'capitalize', cursor: 'pointer', background: data.shoppingHabit === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', borderColor: data.shoppingHabit === t ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.1)', color: data.shoppingHabit === t ? '#4ade80' : '#fff' }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label htmlFor="domesticFlights" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Domestic Flights / Yr</label>
                        <input 
                          id="domesticFlights"
                          type="number" min="0" 
                          value={data.domesticFlightsYearly}
                          onChange={(e) => setData({...data, domesticFlightsYearly: parseInt(e.target.value) || 0})}
                          style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem', color: '#fff', fontSize: '1.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="internationalFlights" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Intl. Flights / Yr</label>
                        <input 
                          id="internationalFlights"
                          type="number" min="0" 
                          value={data.internationalFlightsYearly}
                          onChange={(e) => setData({...data, internationalFlightsYearly: parseInt(e.target.value) || 0})}
                          style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem', color: '#fff', fontSize: '1.25rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: WASTE */}
              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700 }}>Waste & Mindset</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Recycling Habits</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        {(['recycle_always', 'recycle_sometimes', 'never_recycle'] as RecyclingType[]).map(t => (
                          <button aria-label={`Select ${t.replace('_', ' ')} recycling habit`}
                            key={t}
                            onClick={() => setData({ ...data, recyclingHabit: t })}
                            className="glass-panel"
                            style={{ padding: '1rem', textAlign: 'left', textTransform: 'capitalize', cursor: 'pointer', background: data.recyclingHabit === t ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', borderColor: data.recyclingHabit === t ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.1)', color: data.recyclingHabit === t ? '#4ade80' : '#fff' }}
                          >
                            {t.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="climateAwareness" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem' }}>Climate Awareness Level</label>
                      <select 
                        id="climateAwareness"
                        value={data.climateAwareness}
                        onChange={(e) => setData({...data, climateAwareness: e.target.value as 'beginner' | 'intermediate' | 'expert'})}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', color: '#fff', fontSize: '1.125rem' }}
                      >
                        <option value="beginner">Beginner - Just starting to learn</option>
                        <option value="intermediate">Intermediate - Trying to make changes</option>
                        <option value="expert">Expert - Living a highly sustainable life</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button aria-label="Previous step"
            onClick={handlePrev}
            style={{ padding: '1rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.3s', opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
          >
            <ArrowLeft size={24} />
          </button>

          {step < 5 ? (
            <button aria-label="Next step"
              onClick={handleNext}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#000', padding: '1rem 2rem', borderRadius: '999px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Continue <ArrowRight size={20} />
            </button>
          ) : (
            <button aria-label="Analyze Identity"
              onClick={handleSubmit}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(90deg, #10b981, #06b6d4)', color: '#fff', padding: '1rem 2rem', borderRadius: '999px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
            >
              Analyze Identity <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
