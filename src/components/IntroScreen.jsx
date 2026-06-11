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
      <h1 className="intro-title" style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        textShadow: '0 4px 12px rgba(0,0,0,0.7)',
        lineHeight: 1.2
      }}>
        <span style={{ color: 'var(--gold)' }}>Estimation</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Addition & Subtraction</span>
      </h1>

      <p style={{
        color: 'rgba(255,255,255,0.9)',
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        fontWeight: 800,
        marginTop: 8,
        fontFamily: 'var(--font-display)',
        textShadow: '0 2px 6px rgba(0,0,0,0.5)'
      }}>
        Lesson 2.5 · Make a smart close guess
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot" style={{ fontSize: '1.5rem' }}>⚡</div>
        <div className="speech-bubble" style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#1a1a2e',
          maxWidth: 240
        }}>
          Let's explore estimation! 🎯
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc" style={{
        fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
        lineHeight: 1.7,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.85)'
      }}>
        Learn to make <strong style={{ color: 'var(--gold)', fontWeight: 900 }}>smart, close guesses</strong>, round numbers quickly, and solve math challenges in the real world!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: 'var(--gold)',
          marginBottom: 16,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 800,
          textShadow: '0 2px 6px rgba(0,0,0,0.5)'
        }}>
          Your Learning Journey
        </h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label" style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.label}</div>
                <div className="intro-journey-desc" style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-lg intro-start-btn"
        onClick={handleStart}
        id="start-journey-btn"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label" style={{ fontWeight: 800, color: 'white' }}>100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🧠</div>
          <div className="feature-card-label" style={{ fontWeight: 800, color: 'white' }}>Smart Guesses</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label" style={{ fontWeight: 800, color: 'white' }}>Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
