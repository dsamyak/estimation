import { useState, useEffect, useRef } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { simulateIntroNarration } from '../utils/narration';

// --- Feedback Overlay Component (Matches Reference) ---
const FeedbackOverlay = ({ isCorrect, message, subMessage, onContinue }) => (
  <div className="feedback-overlay" onClick={onContinue}>
    <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`}>
      <div className="feedback-emoji">{isCorrect ? '🌟' : '🤔'}</div>
      <div className="feedback-message">{message}</div>
      {subMessage && <div className="feedback-sub">{subMessage}</div>}
      <div className="mt-4 text-sm opacity-80">(Tap anywhere to continue)</div>
    </div>
  </div>
);

// --- STATION A: Number Line Slider ---
const StationA = ({ onComplete }) => {
  const [value, setValue] = useState(300);
  const [showFeedback, setShowFeedback] = useState(false);
  const target = 350;
  const originalNumber = 347;

  const handleChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleCheck = () => {
    if (Math.abs(value - target) <= 10) {
      setValue(target);
      sounds.correct();
      setShowFeedback(true);
    }
  };

  return (
    <div className="glass-card max-w-md w-full">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station A: Number Line Slider</h3>
      <p className="text-center mb-4 text-secondary">
        Round <strong className="text-white">{originalNumber}</strong> to the nearest 100.
      </p>

      <div className="mt-4 mb-4 text-center" style={{fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', textShadow: '0 0 10px rgba(255,193,7,0.3)'}}>
        {value}
      </div>
      
      <input 
        type="range" 
        min="300" max="400" step="10"
        value={value}
        onChange={handleChange}
        onMouseUp={handleCheck}
        onTouchEnd={handleCheck}
        style={{width: '100%', marginBottom: '16px'}}
      />
      
      <div className="flex justify-between text-muted text-sm px-2 font-bold">
        <span>300</span>
        <span className="text-white">350</span>
        <span>400</span>
      </div>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Perfect Rounding!"
          subMessage={`${originalNumber} rounds to ${target}!`}
          onContinue={() => { setShowFeedback(false); onComplete(); }}
        />
      )}
    </div>
  );
};

// --- STATION B: Estimate-O-Meter ---
const StationB = ({ onComplete }) => {
  const [estimate, setEstimate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null); // 'correct' or 'wrong'
  const options = [100, 200, 600, 800];
  const exact = 225; // 423 - 198
  const correctEstimate = 200;

  const handleOption = (opt) => {
    setEstimate(opt);
    if (opt === correctEstimate) {
      sounds.correct();
      setTimeout(() => setShowFeedback('correct'), 1000);
    } else {
      sounds.wrong();
      setTimeout(() => {
        setShowFeedback('wrong');
      }, 1000);
    }
  };

  const handleFeedbackClose = () => {
    if (showFeedback === 'correct') {
      onComplete();
    } else {
      setShowFeedback(null);
      setEstimate(null); // reset
    }
  };

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station B: Estimate-O-Meter</h3>
      <p className="mb-4 text-secondary">John has 423 stickers. He gives away 198. About how many left?</p>

      <div className="gauge-container">
        <div className="gauge-arc"></div>
        <div className="gauge-inner"></div>
        <div 
          className="gauge-needle" 
          style={{
            transform: estimate ? `rotate(${(estimate / 1000) * 180 - 90}deg)` : 'rotate(-90deg)'
          }}
        ></div>
      </div>
      
      <div className="options-grid">
        {options.map(opt => (
          <button 
            key={opt}
            className={`option-btn ${estimate === opt ? (opt === correctEstimate ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleOption(opt)}
            disabled={estimate !== null}
          >
            {opt}
          </button>
        ))}
      </div>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={showFeedback === 'correct'}
          message={showFeedback === 'correct' ? "Great Estimate!" : "Not Quite!"}
          subMessage={showFeedback === 'correct' ? `Exact: ${exact}. Estimate: ${correctEstimate}. Very close!` : "Try rounding the numbers first!"}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// --- STATION C: Build the Estimate ---
const StationC = ({ onComplete }) => {
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const checkAnswer = () => {
    if (step1 === '400' && step2 === '200' && step3 === '600') {
      sounds.correct();
      setShowFeedback(true);
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station C: Build the Estimate</h3>
      <p className="mb-4 text-secondary">Problem: <strong className="text-white">387 + 241 = ?</strong> (Round to nearest 100)</p>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-white">387 →</span>
        <input 
          type="number" className={`blank-input text-center ${step1 === '400' ? 'correct' : ''}`} 
          value={step1} onChange={(e) => setStep1(e.target.value)} 
          placeholder="___"
        />
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-white">241 →</span>
        <input 
          type="number" className={`blank-input text-center ${step2 === '200' ? 'correct' : ''}`} 
          value={step2} onChange={(e) => setStep2(e.target.value)} 
          placeholder="___"
        />
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-gold">Sum =</span>
        <input 
          type="number" className={`blank-input text-center ${step3 === '600' ? 'correct' : ''}`} 
          value={step3} onChange={(e) => setStep3(e.target.value)} 
          placeholder="___"
        />
      </div>

      <button className="btn btn-primary mt-4" onClick={checkAnswer}>Check My Estimate</button>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Master Estimator!"
          subMessage="You built the estimate perfectly step by step."
          onContinue={() => { setShowFeedback(false); onComplete(); }}
        />
      )}
    </div>
  );
};

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled && station === 0) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(simulateIntroNarration(), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [audioEnabled, station]);

  const handleStationComplete = () => {
    if (station < 2) {
      setStation(prev => prev + 1);
    } else {
      sounds.badge(); // Earned simulation badge equivalent
      onComplete();
    }
  };

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h2 className="simulate-label">Interactive Sandbox</h2>
        <p className="simulate-sublabel">Complete all 3 stations to earn your badge!</p>
      </div>

      <div className="progress-dots mb-6">
        {[0, 1, 2].map(i => (
          <div key={i} className={`progress-dot ${i === station ? 'active' : ''} ${i < station ? 'completed' : ''}`} />
        ))}
      </div>

      <div className="simulate-tip">
        💡 <strong>Hint:</strong> Remember to look at the number line closely!
      </div>

      {station === 0 && <StationA onComplete={handleStationComplete} />}
      {station === 1 && <StationB onComplete={handleStationComplete} />}
      {station === 2 && <StationC onComplete={handleStationComplete} />}
    </div>
  );
}
