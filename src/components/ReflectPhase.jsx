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
      <div className="reflect-phase" style={{justifyContent: 'center', height: '100%', overflowY: 'auto', padding: '2rem'}}>
        <div className="certificate-card" style={{animation: 'bounceIn 0.8s ease', maxWidth: '500px', width: '100%', margin: '0 auto'}}>
          <div className="cert-badge" style={{fontSize: '4rem', marginBottom: '1rem'}}>🏆</div>
          <h2 className="cert-title text-gold" style={{fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)'}}>Estimation Expert</h2>
          <p className="cert-subtitle text-secondary mb-6">You have mastered the art of smart guesses!</p>

          <div className="cert-stats" style={{display: 'flex', justifyContent: 'space-around', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem'}}>
            <div className="cert-stat text-center">
              <div className="cert-stat-value text-gold text-2xl font-bold">{displayStats.xp}</div>
              <div className="cert-stat-label text-sm text-secondary uppercase tracking-wider">XP</div>
            </div>
            <div className="cert-stat text-center">
              <div className="cert-stat-value text-green text-2xl font-bold">{displayStats.totalStars}</div>
              <div className="cert-stat-label text-sm text-secondary uppercase tracking-wider">Stars</div>
            </div>
            <div className="cert-stat text-center">
              <div className="cert-stat-value text-coral text-2xl font-bold">{displayStats.bestStreak}</div>
              <div className="cert-stat-label text-sm text-secondary uppercase tracking-wider">Streak</div>
            </div>
          </div>

          <div className="cert-worlds text-left mb-6" style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px'}}>
            <div className="font-bold mb-3 text-gold">Badges Unlocked:</div>
            {displayStats.badges.length > 0 ? displayStats.badges.map(b => (
              <div key={b} className="cert-world-item mb-2 flex items-center gap-2">
                <span className="text-xl">🏅</span> <span className="text-white">{b}</span>
              </div>
            )) : <div className="text-muted text-sm italic">Keep playing to earn badges!</div>}
          </div>

          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary" onClick={onRestart}>Play Again</button>
            <button className="btn btn-primary" onClick={onGoHome}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase" style={{justifyContent: 'center', height: '100%', overflowY: 'auto', padding: '2rem'}}>
      <div className="reflect-header text-center mb-8">
        <h2 className="reflect-label text-gold text-3xl font-bold font-display tracking-wide uppercase">Reflection Time</h2>
      </div>

      <div className="reflect-card glass-card max-w-2xl w-full mx-auto p-8" style={{animation: 'bounceIn 0.5s ease'}}>
        <div className="reflect-mascot-row flex items-center gap-6 mb-6">
          <div className="mascot thinking" style={{fontSize: '3rem'}}>⚡</div>
          <div className="speech-bubble" style={{fontSize: '1.2rem', padding: '1.5rem', lineHeight: 1.5}}>
            Think of a time in real life when you might need to make an estimate instead of finding the exact answer.<br/><br/>
            (For example: buying groceries, planning a trip, or sharing treats!)
          </div>
        </div>

        <textarea 
          className="w-full mt-4 p-4 rounded-xl text-gray-900 bg-white border-2 border-transparent focus:border-gold outline-none transition-colors"
          rows="5"
          placeholder="I would use estimation when..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          style={{fontFamily: 'var(--font-body)', fontSize: '1.1rem', resize: 'vertical'}}
        />

        <div className="text-center mt-8">
          <button 
            className="btn btn-primary btn-lg px-12" 
            disabled={journalEntry.trim().length < 5}
            onClick={handleSubmit}
            style={{fontSize: '1.2rem'}}
          >
            Submit & Claim Badge 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
