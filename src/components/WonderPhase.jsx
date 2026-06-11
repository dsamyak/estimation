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
          <div className="mascot thinking" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>🤔</div>
          <div className="speech-bubble wonder-bubble text-md text-bold text-blue-deep">
            Look at this scenario! Can you guess the answer?
          </div>
        </div>

        {/* Question Card */}
        <div className={`wonder-question-card ${step >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">📚</div>
          <h2 className="wonder-question-text text-display text-xl high-contrast-text">
            Sarah has 247 coins. A book costs 189 coins.<br/>
            Does she have enough?
          </h2>
          <p className="wonder-subtext text-lg text-bold text-white mb-4" style={{lineHeight: 1.5}}>
            "About 250 minus about 190... that's about 60! Yes!"
          </p>

          <div className="wonder-question-text text-display text-xl high-contrast-text text-gold" style={{marginTop: '16px'}}>
            Is 247 close to 250?
          </div>

          {step < 2 ? (
            <div className="options-grid mt-4">
              <button className="option-btn text-display text-xl high-contrast-text" onClick={() => handleAnswer(true)}>
                Yes!
              </button>
              <button className="option-btn text-display text-xl high-contrast-text" onClick={() => handleAnswer(false)}>
                No
              </button>
            </div>
          ) : (
            <div className="mt-4" style={{ animation: 'bounceIn 0.5s ease' }}>
              <div className="text-green text-display text-xl mb-2 high-contrast-text">You're already thinking like an estimator!</div>
              <p className="text-lg text-bold text-white">Let's learn how to make smart guesses.</p>
            </div>
          )}
        </div>

        {/* Proceed Button */}
        <button 
          className={`btn btn-wonder text-display text-xl high-contrast-text ${step === 2 ? 'visible' : ''}`}
          onClick={handleNext}
        >
          <span className="wonder-btn-sparkle" style={{ position: 'absolute', top: 10, left: 20 }}>✨</span>
          <span className="wonder-btn-sparkle" style={{ position: 'absolute', bottom: 10, right: 20, animationDelay: '0.5s' }}>✨</span>
          Let's discover how! →
        </button>

      </div>
    </div>
  );
}
