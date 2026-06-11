import { useState, useEffect, useRef } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { wonderNarration } from '../utils/narration';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [step, setStep] = useState(0); // 0=hidden, 1=show elements, 2=answered
  const narrationRef = useRef(null);

  useEffect(() => {
    // Initial appearance animation
    const timer1 = setTimeout(() => setStep(1), 500);
    
    // Start narration
    let timer2;
    if (audioEnabled) {
      timer2 = setTimeout(() => {
        narrationRef.current = narrate(wonderNarration(), true);
      }, 1000);
    }
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [audioEnabled]);

  const handleAnswer = (isYes) => {
    setStep(2);
    sounds.click();
    if (isYes) {
      setTimeout(() => sounds.correct(), 300);
    }
  };

  const handleNext = () => {
    sounds.click();
    narrationRef.current?.cancel();
    stopNarration();
    onComplete();
  };

  return (
    <div className="wonder-phase">
      {/* Background Particles */}
      <div className="wonder-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="wonder-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          >
            {['🎯', '✨', '💡', '🤔'][i % 4]}
          </div>
        ))}
      </div>

      <div className="wonder-content">
        
        {/* Main mysterious object */}
        <div className={`wonder-qmark ${step >= 1 ? 'revealed' : ''}`}>
          <div className="wonder-qmark-glow" />
          <div className="wonder-qmark-icon">🧠</div>
        </div>

        {/* Mascot reaction */}
        <div className={`mascot-container wonder-mascot ${step >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking" style={{ width: 60, height: 60, fontSize: '1.8rem', flexShrink: 0 }}>🤔</div>
          <div className="speech-bubble wonder-bubble" style={{ fontSize: '1.1rem', fontWeight: 700, maxWidth: 280, color: '#1a1a2e' }}>
            Look at this scenario! Can you guess the answer?
          </div>
        </div>

        {/* Question Card */}
        <div className={`wonder-question-card ${step >= 1 ? 'visible' : ''}`} style={{ width: '100%', maxWidth: 560 }}>
          <div className="wonder-emoji">📚</div>
          <h2 className="wonder-question-text" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            fontWeight: 800,
            lineHeight: 1.4,
            color: 'white',
            textShadow: '0 3px 8px rgba(0,0,0,0.6)',
            marginBottom: 16
          }}>
            Sarah has <span style={{ color: 'var(--gold)', fontWeight: 900 }}>247</span> coins. A book costs <span style={{ color: 'var(--gold)', fontWeight: 900 }}>189</span> coins.<br/>
            <span style={{ color: 'var(--green-light)' }}>Does she have enough?</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--gold-light)',
            lineHeight: 1.5,
            marginBottom: 20,
            textShadow: '0 2px 6px rgba(0,0,0,0.5)'
          }}>
            "About 250 minus about 190... that's about 60! Yes!"
          </p>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            fontWeight: 800,
            color: 'var(--gold)',
            textShadow: '0 2px 8px rgba(255,193,7,0.4)',
            marginBottom: 20
          }}>
            Is 247 close to 250?
          </div>

          {step < 2 ? (
            <div className="options-grid" style={{ marginTop: 8 }}>
              <button className="option-btn" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }} onClick={() => handleAnswer(true)}>
                ✅ Yes!
              </button>
              <button className="option-btn" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }} onClick={() => handleAnswer(false)}>
                ❌ No
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 16, animation: 'bounceIn 0.5s ease' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--green-light)',
                fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                marginBottom: 8,
                fontWeight: 800,
                textShadow: '0 3px 8px rgba(0,0,0,0.6)'
              }}>
                🎉 You're already thinking like an estimator!
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white'
              }}>
                Let's learn how to make smart guesses.
              </p>
            </div>
          )}
        </div>

        {/* Proceed Button */}
        <button 
          className={`btn btn-wonder ${step === 2 ? 'visible' : ''}`}
          onClick={handleNext}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}
        >
          <span className="wonder-btn-sparkle" style={{ position: 'absolute', top: 10, left: 20 }}>✨</span>
          <span className="wonder-btn-sparkle" style={{ position: 'absolute', bottom: 10, right: 20, animationDelay: '0.5s' }}>✨</span>
          Let's discover how! →
        </button>

      </div>
    </div>
  );
}
