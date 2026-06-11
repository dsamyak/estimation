import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { reflectNarration } from '../utils/narration';

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [journalEntry, setJournalEntry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const narrationRef = useRef(null);

  // default stats if skipped
  const displayStats = stats || {
    xp: 450,
    bestStreak: 12,
    completedWorlds: 10,
    totalStars: 28,
    badges: ['Estimation Master']
  };

  useEffect(() => {
    if (audioEnabled && !submitted) {
      narrationRef.current = narrate(reflectNarration(), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [audioEnabled, submitted]);

  useEffect(() => {
    if (submitted) {
      sounds.badge();
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFC107', '#4CAF50', '#FF5722']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFC107', '#4CAF50', '#FF5722']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [submitted]);

  const handleSubmit = () => {
    sounds.click();
    narrationRef.current?.cancel();
    stopNarration();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="reflect-phase" style={{ justifyContent: 'center', minHeight: '100vh', overflowY: 'auto' }}>
        <div className="certificate-card" style={{ animation: 'bounceIn 0.8s ease', maxWidth: 500, width: '100%', margin: '0 auto' }}>
          <div className="cert-badge" style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
          <h2 className="cert-title" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--gold)',
            marginBottom: 8,
            textShadow: '0 3px 8px rgba(0,0,0,0.6)'
          }}>
            Estimation Expert
          </h2>
          <p className="cert-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            You have mastered the art of smart guesses!
          </p>

          <div className="cert-stats" style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(0,0,0,0.2)',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold)' }}>{displayStats.xp}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>XP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--green)' }}>{displayStats.totalStars}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Stars</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--coral)' }}>{displayStats.bestStreak}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Streak</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 800, marginBottom: 12, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>Badges Unlocked:</div>
            {displayStats.badges.length > 0 ? displayStats.badges.map(b => (
              <div key={b} className="cert-world-item" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>🏅</span> <span style={{ color: 'white', fontWeight: 700 }}>{b}</span>
              </div>
            )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Keep playing to earn badges!</div>}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={onRestart}>Play Again</button>
            <button className="btn btn-primary" onClick={onGoHome}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase" style={{ justifyContent: 'center', minHeight: '100vh', overflowY: 'auto' }}>
      <div className="reflect-header" style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: 'var(--gold)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '0 3px 8px rgba(0,0,0,0.6)'
        }}>
          📓 Reflection Time
        </h2>
      </div>

      <div className="reflect-card glass-card" style={{ maxWidth: 600, width: '100%', margin: '0 auto', padding: 32, animation: 'bounceIn 0.5s ease' }}>
        <div className="reflect-mascot-row" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div className="mascot thinking" style={{ fontSize: '2.5rem', flexShrink: 0 }}>⚡</div>
          <div className="speech-bubble" style={{ fontSize: '1.1rem', fontWeight: 700, padding: 20, lineHeight: 1.6, color: '#1a1a2e', maxWidth: 360 }}>
            Think of a time in real life when you might need to make an estimate instead of finding the exact answer.<br/><br/>
            (For example: buying groceries, planning a trip, or sharing treats!)
          </div>
        </div>

        <textarea 
          rows="5"
          placeholder="I would use estimation when..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          style={{
            width: '100%',
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            color: '#1a1a2e',
            background: 'white',
            border: '2px solid rgba(255,193,7,0.3)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            fontWeight: 600,
            resize: 'vertical',
            textShadow: 'none'
          }}
        />

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button 
            className="btn btn-primary btn-lg" 
            disabled={journalEntry.trim().length < 5}
            onClick={handleSubmit}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)'
            }}
          >
            Submit & Claim Badge 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
