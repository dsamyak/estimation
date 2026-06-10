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
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Estimation</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>Addition & Subtraction</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 2.5 · Make a smart close guess
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">⚡</div>
        <div className="speech-bubble">
          Let's explore estimation! 🎯
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to make <strong style={{ color: 'var(--gold)' }}>smart, close guesses</strong>, round numbers quickly, and solve math challenges in the real world!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🧠</div>
          <div className="feature-card-label">Smart Guesses</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
