import { useState, useEffect, useRef } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { simulateIntroNarration, simulateStationANarration, simulateStationBNarration, simulateStationCNarration } from '../utils/narration';

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

const A_ROUNDS = [
  { originalNumber: 63, target: 60, min: 0, max: 100, step: 10, roundTo: 10 },
  { originalNumber: 78, target: 80, min: 0, max: 100, step: 10, roundTo: 10 },
  { originalNumber: 340, target: 300, min: 300, max: 400, step: 10, roundTo: 100 },
  { originalNumber: 450, target: 500, min: 400, max: 500, step: 10, roundTo: 100 },
  { originalNumber: 289, target: 290, min: 200, max: 300, step: 10, roundTo: 10 }
];

const B_ROUNDS = [
  { text: "John has 423 stickers and buys 198 more. About how many total?", options: [500, 600, 700, 800], correctEstimate: 600, exact: 621 },
  { text: "Sarah had 347 coins and spent 112. About how many left?", options: [230, 240, 250, 260], correctEstimate: 240, exact: 235 },
  { text: "Mike wants to estimate 589 - 312. Which is a reasonable estimate?", options: [200, 300, 800, 900], correctEstimate: 300, exact: 277 },
  { text: "Is 420 a reasonable estimate for 387 + 44?", options: [420, 300, 500, 800], correctEstimate: 420, exact: 431 },
  { text: "If we estimate 289 + 115 as 300 + 100 = 400. The exact is 404. Our estimate is an:", options: ['Underestimate', 'Overestimate', 'Exact', 'Wrong'], correctEstimate: 'Underestimate', exact: 404 }
];

const C_ROUNDS = [
  { problem: "387 + 241", s1_target: "400", s2_target: "200", s3_target: "600", roundTo: 100, op: '+' },
  { problem: "462 - 88", s1_target: "460", s2_target: "90", s3_target: "370", roundTo: 10, op: '-' },
  { problem: "47 + 34", s1_target: "50", s2_target: "30", s3_target: "80", roundTo: 10, op: '+' },
  { problem: "812 - 489", s1_target: "800", s2_target: "500", s3_target: "300", roundTo: 100, op: '-' },
  { problem: "515 + 288", s1_target: "500", s2_target: "300", s3_target: "800", roundTo: 100, op: '+' }
];

// --- STATION A: Number Line Slider ---
const StationA = ({ onComplete }) => {
  const [roundIdx] = useState(Math.floor(Math.random() * A_ROUNDS.length));
  const currentRound = A_ROUNDS[roundIdx];
  
  // Initialize slider somewhere in the middle
  const initialVal = currentRound.min + (currentRound.max - currentRound.min) / 2;
  const [value, setValue] = useState(initialVal);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleCheck = () => {
    if (Math.abs(value - currentRound.target) <= 10) {
      setValue(currentRound.target);
      sounds.correct();
      setShowFeedback(true);
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="glass-card max-w-md w-full">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station A: Number Line Slider</h3>
      <p className="text-center mb-4 text-secondary">
        Round <strong className="text-white">{currentRound.originalNumber}</strong> to the nearest {currentRound.roundTo}.
      </p>

      <div className="mt-4 mb-4 text-center" style={{fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', textShadow: '0 0 10px rgba(255,193,7,0.3)'}}>
        {value}
      </div>
      
      <input 
        type="range" 
        min={currentRound.min} max={currentRound.max} step={currentRound.step}
        value={value}
        onChange={handleChange}
        onMouseUp={handleCheck}
        onTouchEnd={handleCheck}
        style={{width: '100%', marginBottom: '16px'}}
      />
      
      <div className="flex justify-between text-muted text-sm px-2 font-bold">
        <span>{currentRound.min}</span>
        <span className="text-white">{currentRound.target}</span>
        <span>{currentRound.max}</span>
      </div>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Perfect Rounding!"
          subMessage={`${currentRound.originalNumber} rounds to ${currentRound.target}!`}
          onContinue={() => { setShowFeedback(false); onComplete(); }}
        />
      )}
    </div>
  );
};

// --- STATION B: Estimate-O-Meter ---
const StationB = ({ onComplete }) => {
  const [roundIdx] = useState(Math.floor(Math.random() * B_ROUNDS.length));
  const currentRound = B_ROUNDS[roundIdx];

  const [estimate, setEstimate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null); // 'correct' or 'wrong'

  const handleOption = (opt) => {
    setEstimate(opt);
    if (opt === currentRound.correctEstimate) {
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

  // Convert estimate to rotation (0 to 1000 range gauge)
  let gaugeRotation = -90;
  if (estimate !== null) {
    if (typeof estimate === 'number') {
      gaugeRotation = (estimate / 1000) * 180 - 90;
    } else {
      // If strings like Underestimate/Overestimate, just swing to middle
      gaugeRotation = 0;
    }
  }

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station B: Estimate-O-Meter</h3>
      <p className="mb-4 text-secondary">{currentRound.text}</p>

      <div className="gauge-container">
        <div className="gauge-arc"></div>
        <div className="gauge-inner"></div>
        <div 
          className="gauge-needle" 
          style={{ transform: `rotate(${gaugeRotation}deg)` }}
        ></div>
      </div>
      
      <div className="options-grid">
        {currentRound.options.map(opt => (
          <button 
            key={opt}
            className={`option-btn ${estimate === opt ? (opt === currentRound.correctEstimate ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleOption(opt)}
            disabled={estimate !== null}
            style={typeof opt === 'string' ? { fontSize: '1rem' } : {}}
          >
            {opt}
          </button>
        ))}
      </div>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={showFeedback === 'correct'}
          message={showFeedback === 'correct' ? "Great Estimate!" : "Not Quite!"}
          subMessage={showFeedback === 'correct' ? `Exact: ${currentRound.exact}. Estimate: ${currentRound.correctEstimate}. Very close!` : "Try rounding the numbers first!"}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// --- STATION C: Build the Estimate ---
const StationC = ({ onComplete }) => {
  const [roundIdx] = useState(Math.floor(Math.random() * C_ROUNDS.length));
  const currentRound = C_ROUNDS[roundIdx];

  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const checkAnswer = () => {
    if (step1 === currentRound.s1_target && step2 === currentRound.s2_target && step3 === currentRound.s3_target) {
      sounds.correct();
      setShowFeedback(true);
    } else {
      sounds.wrong();
    }
  };

  const [n1, n2] = currentRound.problem.split(currentRound.op === '+' ? ' + ' : ' - ');

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-4 text-center text-xl">Station C: Build the Estimate</h3>
      <p className="mb-4 text-secondary">Problem: <strong className="text-white">{currentRound.problem} = ?</strong> (Round to nearest {currentRound.roundTo})</p>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-white w-16 text-right">{n1} →</span>
        <input 
          type="number" className={`blank-input text-center ${step1 === currentRound.s1_target ? 'correct' : ''}`} 
          value={step1} onChange={(e) => setStep1(e.target.value)} 
          placeholder="___"
        />
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-white w-16 text-right">{n2} →</span>
        <input 
          type="number" className={`blank-input text-center ${step2 === currentRound.s2_target ? 'correct' : ''}`} 
          value={step2} onChange={(e) => setStep2(e.target.value)} 
          placeholder="___"
        />
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <span className="font-bold text-xl text-gold w-16 text-right">{currentRound.op === '+' ? 'Sum =' : 'Diff ='}</span>
        <input 
          type="number" className={`blank-input text-center ${step3 === currentRound.s3_target ? 'correct' : ''}`} 
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
    if (audioEnabled) {
      narrationRef.current?.cancel();
      if (station === 0) {
        narrationRef.current = narrate(simulateStationANarration(), true);
      } else if (station === 1) {
        narrationRef.current = narrate(simulateStationBNarration(), true);
      } else if (station === 2) {
        narrationRef.current = narrate(simulateStationCNarration(), true);
      }
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
