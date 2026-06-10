import { useState, useEffect, useRef } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { simulateStationANarration, simulateStationBNarration, simulateStationCNarration } from '../utils/narration';

// --- Feedback Overlay ---
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

// ─────────────────────────────────────────────────────────
// STATION A — "The Number Line Slider" (CONCRETE)
// Builds directly on the story: Sarah used a number line to
// see that 318 is closer to 300. Now students do it themselves.
// 5 progressive rounds, each harder than the last.
// ─────────────────────────────────────────────────────────

const A_ROUNDS = [
  {
    originalNumber: 63,
    target: 60,
    min: 50, max: 70, step: 10,
    roundTo: 10,
    context: "Sarah counted 63 coins in her pocket.",
    hint: "Is 63 closer to 60 or 70?"
  },
  {
    originalNumber: 78,
    target: 80,
    min: 70, max: 90, step: 10,
    roundTo: 10,
    context: "John collected 78 mangoes from the tree.",
    hint: "Is 78 closer to 70 or 80?"
  },
  {
    originalNumber: 347,
    target: 350,
    min: 300, max: 400, step: 10,
    roundTo: 10,
    context: "Mike sold 347 mangoes at his stall — just like in the story!",
    hint: "Is 347 closer to 340 or 350?"
  },
  {
    originalNumber: 253,
    target: 300,
    min: 200, max: 300, step: 10,
    roundTo: 100,
    context: "Sarah counted 253 more mangoes today.",
    hint: "Is 253 closer to 200 or 300?"
  },
  {
    originalNumber: 462,
    target: 500,
    min: 400, max: 500, step: 10,
    roundTo: 100,
    context: "John brought 462 flyers to the market — remember?",
    hint: "Is 462 closer to 400 or 500?"
  }
];

const StationA = ({ onComplete }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const round = A_ROUNDS[roundIdx];
  
  const midpoint = round.min + Math.floor((round.max - round.min) / 2);
  const [value, setValue] = useState(midpoint);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleChange = (e) => setValue(Number(e.target.value));

  const handleCheck = () => {
    if (Math.abs(value - round.target) <= 5) {
      setValue(round.target);
      sounds.correct();
      setShowFeedback(true);
    } else {
      sounds.wrong();
      setAttempts(a => a + 1);
      if (attempts >= 1) setShowHint(true);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    if (roundIdx < A_ROUNDS.length - 1) {
      const nextRound = A_ROUNDS[roundIdx + 1];
      const nextMid = nextRound.min + Math.floor((nextRound.max - nextRound.min) / 2);
      setRoundIdx(r => r + 1);
      setValue(nextMid);
      setShowHint(false);
      setAttempts(0);
    } else {
      onComplete();
    }
  };

  return (
    <div className="glass-card max-w-md w-full">
      <h3 className="text-gold font-bold mb-2 text-center text-xl">🎚️ The Number Line Slider</h3>
      <p className="text-center mb-1 text-secondary" style={{fontSize: '0.8rem'}}>
        Round {roundIdx + 1} of {A_ROUNDS.length}
      </p>

      <p className="text-center mb-2 text-secondary" style={{fontSize: '0.95rem', lineHeight: 1.5}}>
        {round.context}
      </p>
      <p className="text-center mb-4 text-white font-bold" style={{fontSize: '1.1rem'}}>
        Round <span style={{color: 'var(--gold)'}}>{round.originalNumber}</span> to the nearest <span style={{color: 'var(--gold)'}}>{round.roundTo}</span>.
      </p>

      <div className="mt-4 mb-4 text-center" style={{fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', textShadow: '0 0 10px rgba(255,193,7,0.3)'}}>
        {value}
      </div>
      
      <input 
        type="range" 
        min={round.min} max={round.max} step={round.step}
        value={value}
        onChange={handleChange}
        onMouseUp={handleCheck}
        onTouchEnd={handleCheck}
        style={{width: '100%', marginBottom: '16px'}}
      />
      
      <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0 8px', fontWeight: 700}}>
        <span>{round.min}</span>
        <span style={{color: 'white'}}>{round.target}</span>
        <span>{round.max}</span>
      </div>

      {showHint && (
        <div className="simulate-tip" style={{marginTop: '12px'}}>
          💡 {round.hint}
        </div>
      )}

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Perfect Rounding!"
          subMessage={`${round.originalNumber} rounds to ${round.target}!`}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STATION B — "Estimate-O-Meter" (PICTORIAL)
// Now students apply rounding to real estimation problems.
// The scenarios connect to the story characters and market.
// ─────────────────────────────────────────────────────────

const B_ROUNDS = [
  {
    text: "Mike sold 318 mangoes yesterday and 253 today. About how many total?",
    emoji: "🥭",
    options: [400, 550, 700, 900],
    correctEstimate: 550,
    exact: 571,
    explanation: "318 ≈ 300, 253 ≈ 250, so 300 + 250 = 550"
  },
  {
    text: "John brought 462 flyers and gave out 179. About how many are left?",
    emoji: "📄",
    options: [100, 200, 300, 500],
    correctEstimate: 300,
    exact: 283,
    explanation: "462 ≈ 500, 179 ≈ 200, so 500 − 200 = 300"
  },
  {
    text: "Sarah saved 387 coins. Emma gave her 241 more. About how many coins now?",
    emoji: "💰",
    options: [400, 500, 600, 800],
    correctEstimate: 600,
    exact: 628,
    explanation: "387 ≈ 400, 241 ≈ 200, so 400 + 200 = 600"
  },
  {
    text: "The market had 715 apples. Customers bought 289. About how many remain?",
    emoji: "🍎",
    options: [200, 300, 400, 500],
    correctEstimate: 400,
    exact: 426,
    explanation: "715 ≈ 700, 289 ≈ 300, so 700 − 300 = 400"
  },
  {
    text: "Arjun read 156 pages Monday and 237 pages Tuesday. About how many total?",
    emoji: "📖",
    options: [300, 400, 500, 600],
    correctEstimate: 400,
    exact: 393,
    explanation: "156 ≈ 200, 237 ≈ 200, so 200 + 200 = 400"
  }
];

const StationB = ({ onComplete }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const round = B_ROUNDS[roundIdx];

  const [estimate, setEstimate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);

  const handleOption = (opt) => {
    setEstimate(opt);
    if (opt === round.correctEstimate) {
      sounds.correct();
      setTimeout(() => setShowFeedback('correct'), 800);
    } else {
      sounds.wrong();
      setTimeout(() => setShowFeedback('wrong'), 800);
    }
  };

  const handleFeedbackClose = () => {
    if (showFeedback === 'correct') {
      setShowFeedback(null);
      setEstimate(null);
      if (roundIdx < B_ROUNDS.length - 1) {
        setRoundIdx(r => r + 1);
      } else {
        onComplete();
      }
    } else {
      setShowFeedback(null);
      setEstimate(null);
    }
  };

  let gaugeRotation = -90;
  if (estimate !== null) {
    gaugeRotation = (estimate / 1000) * 180 - 90;
  }

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-2 text-center text-xl">🔭 Estimate-O-Meter</h3>
      <p className="text-center mb-1 text-secondary" style={{fontSize: '0.8rem'}}>
        Round {roundIdx + 1} of {B_ROUNDS.length}
      </p>

      <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>{round.emoji}</div>
      <p className="mb-4 text-white" style={{fontSize: '1.05rem', lineHeight: 1.5}}>{round.text}</p>

      <div className="gauge-container">
        <div className="gauge-arc"></div>
        <div className="gauge-inner"></div>
        <div 
          className="gauge-needle" 
          style={{ transform: `rotate(${gaugeRotation}deg)` }}
        ></div>
      </div>
      
      <div className="options-grid">
        {round.options.map(opt => (
          <button 
            key={opt}
            className={`option-btn ${estimate === opt ? (opt === round.correctEstimate ? 'correct' : 'wrong') : ''}`}
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
          subMessage={showFeedback === 'correct' 
            ? `${round.explanation}\nExact: ${round.exact} — very close!` 
            : "Try rounding each number first, then add or subtract!"}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STATION C — "Build the Estimate" (ABSTRACT)
// Students now construct estimates step-by-step, using the
// same story numbers to reinforce the connection.
// ─────────────────────────────────────────────────────────

const C_ROUNDS = [
  {
    context: "Mike's mangoes — just like the story!",
    emoji: "🥭",
    num1: 318, num2: 253, op: '+', roundTo: 100,
    r1: "300", r2: "250", result: "550"
  },
  {
    context: "John's flyers at the market!",
    emoji: "📄",
    num1: 462, num2: 179, op: '-', roundTo: 100,
    r1: "500", r2: "200", result: "300"
  },
  {
    context: "Sarah's coin savings!",
    emoji: "💰",
    num1: 387, num2: 241, op: '+', roundTo: 100,
    r1: "400", r2: "200", result: "600"
  },
  {
    context: "Pencils at the school supply shop!",
    emoji: "✏️",
    num1: 47, num2: 34, op: '+', roundTo: 10,
    r1: "50", r2: "30", result: "80"
  },
  {
    context: "Pages Mei read this week!",
    emoji: "📖",
    num1: 812, num2: 489, op: '-', roundTo: 100,
    r1: "800", r2: "500", result: "300"
  }
];

const StationC = ({ onComplete }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const round = C_ROUNDS[roundIdx];

  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showError, setShowError] = useState(false);

  const exact = round.op === '+' ? round.num1 + round.num2 : round.num1 - round.num2;

  const checkAnswer = () => {
    if (step1 === round.r1 && step2 === round.r2 && step3 === round.result) {
      sounds.correct();
      setShowFeedback(true);
      setShowError(false);
    } else {
      sounds.wrong();
      setShowError(true);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    if (roundIdx < C_ROUNDS.length - 1) {
      setRoundIdx(r => r + 1);
      setStep1(''); setStep2(''); setStep3('');
      setShowError(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="glass-card max-w-md w-full text-center">
      <h3 className="text-gold font-bold mb-2 text-center text-xl">🏗️ Build the Estimate</h3>
      <p className="text-center mb-1 text-secondary" style={{fontSize: '0.8rem'}}>
        Round {roundIdx + 1} of {C_ROUNDS.length}
      </p>
      
      <div style={{fontSize: '2rem', marginBottom: '4px'}}>{round.emoji}</div>
      <p className="mb-2 text-secondary" style={{fontSize: '0.9rem'}}>{round.context}</p>
      <p className="mb-4 text-white font-bold" style={{fontSize: '1.1rem'}}>
        {round.num1} {round.op} {round.num2} = ? <span style={{color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem'}}>(Round to nearest {round.roundTo})</span>
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '16px'}}>
        {/* Step 1: Round first number */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center'}}>
          <span style={{fontWeight: 700, fontSize: '1.1rem', color: 'white', minWidth: '60px', textAlign: 'right'}}>{round.num1} →</span>
          <input 
            type="number" 
            className={`blank-input text-center ${step1 === round.r1 ? 'correct' : ''}`}
            value={step1} 
            onChange={(e) => setStep1(e.target.value)} 
            placeholder="?"
            style={{width: '80px', height: '50px', fontSize: '1.3rem'}}
          />
        </div>

        {/* Step 2: Round second number */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center'}}>
          <span style={{fontWeight: 700, fontSize: '1.1rem', color: 'white', minWidth: '60px', textAlign: 'right'}}>{round.num2} →</span>
          <input 
            type="number" 
            className={`blank-input text-center ${step2 === round.r2 ? 'correct' : ''}`}
            value={step2} 
            onChange={(e) => setStep2(e.target.value)} 
            placeholder="?"
            style={{width: '80px', height: '50px', fontSize: '1.3rem'}}
          />
        </div>

        {/* Step 3: Result */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center'}}>
          <span style={{fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)', minWidth: '60px', textAlign: 'right'}}>
            {round.op === '+' ? 'Sum =' : 'Diff ='}
          </span>
          <input 
            type="number" 
            className={`blank-input text-center ${step3 === round.result ? 'correct' : ''}`}
            value={step3} 
            onChange={(e) => setStep3(e.target.value)} 
            placeholder="?"
            style={{width: '80px', height: '50px', fontSize: '1.3rem'}}
          />
        </div>
      </div>

      {showError && (
        <div className="simulate-tip" style={{marginBottom: '12px', borderColor: 'rgba(239,83,80,0.3)', background: 'rgba(239,83,80,0.1)', color: 'var(--red-light)'}}>
          🤔 Not quite! Round {round.num1} to the nearest {round.roundTo}, then round {round.num2}, then {round.op === '+' ? 'add' : 'subtract'}.
        </div>
      )}

      <button className="btn btn-primary" onClick={checkAnswer}>Check My Estimate</button>

      {showFeedback && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Master Estimator!"
          subMessage={`${round.r1} ${round.op} ${round.r2} = ${round.result}\nExact answer: ${exact} — your estimate is spot on!`}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN SIMULATE PHASE
// Pedagogical flow: Concrete → Pictorial → Abstract (CPA)
// ─────────────────────────────────────────────────────────

const STATION_INFO = [
  { name: "The Number Line Slider", icon: "🎚️", desc: "Drag to find the nearest round number", approach: "Concrete" },
  { name: "Estimate-O-Meter", icon: "🔭", desc: "Choose the best estimate for real problems", approach: "Pictorial" },
  { name: "Build the Estimate", icon: "🏗️", desc: "Construct estimates step by step", approach: "Abstract" },
];

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
      sounds.badge();
      onComplete();
    }
  };

  const info = STATION_INFO[station];

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h2 className="simulate-label">Interactive Sandbox</h2>
        <p className="simulate-sublabel">Complete all 3 stations to earn your Estimation Explorer badge! 🎯</p>
      </div>

      {/* Station progress with labels */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px'}}>
        {STATION_INFO.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <div 
              className={`progress-dot ${i === station ? 'active' : ''} ${i < station ? 'completed' : ''}`} 
              style={{width: '16px', height: '16px'}}
            />
            <span style={{
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: i === station ? 'var(--gold)' : i < station ? 'var(--green-light)' : 'var(--text-muted)'
            }}>
              {s.approach}
            </span>
            {i < 2 && <span style={{color: 'var(--text-muted)', margin: '0 4px'}}>→</span>}
          </div>
        ))}
      </div>

      <div className="simulate-tip">
        {info.icon} <strong>{info.name}</strong> — {info.desc}
      </div>

      {station === 0 && <StationA onComplete={handleStationComplete} />}
      {station === 1 && <StationB onComplete={handleStationComplete} />}
      {station === 2 && <StationC onComplete={handleStationComplete} />}
    </div>
  );
}
