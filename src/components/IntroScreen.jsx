import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'An estimation mystery!' },
  { icon: '📖', label: 'Story', desc: 'See estimation in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Build estimations' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨  · Grade 3 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title text-display text-huge high-contrast-text">
        <span style={{ color: 'var(--gold)' }}>Estimation</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Addition & Subtraction</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', fontWeight: 800, marginTop: 8, fontFamily: 'var(--font-display)' }}>
        Lesson 2.5 · Make a smart close guess
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot" style={{fontSize: '1.5rem'}}>⚡</div>
        <div className="speech-bubble text-md text-bold text-blue-deep">
          Let's explore estimation! 🎯
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc text-lg text-white" style={{lineHeight: 1.6, fontWeight: 700}}>
        Learn to make <strong style={{ color: 'var(--gold)', fontWeight: 900 }}>smart, close guesses</strong>, round numbers quickly, and solve math challenges in the real world!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title text-display text-xl text-gold high-contrast-text">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label text-md text-bold">{p.label}</div>
                <div className="intro-journey-desc text-white" style={{fontWeight: 600}}>{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn text-display text-xl high-contrast-text" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label text-bold text-white">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🧠</div>
          <div className="feature-card-label text-bold text-white">Smart Guesses</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label text-bold text-white">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
