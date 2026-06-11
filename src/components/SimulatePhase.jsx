import { useState, useEffect, useRef, useCallback } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { simulateStationANarration, simulateStationBNarration, simulateStationCNarration } from '../utils/narration';

// ─────────────────────────────────────────────────────────
// UTILITY: Fisher-Yates shuffle + random pick
// ─────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

// ─────────────────────────────────────────────────────────
// PARTICLE BURST component
// ─────────────────────────────────────────────────────────
const ParticleBurst = ({ active, correct }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
      {particles.map(i => {
        const angle = (i / 12) * 360;
        const dist = 80 + Math.random() * 80;
        const tx = Math.cos((angle * Math.PI) / 180) * dist;
        const ty = Math.sin((angle * Math.PI) / 180) * dist;
        const color = correct
          ? ['#ffc107', '#4caf50', '#81c784', '#fff'][i % 4]
          : ['#ef5350', '#ff7043', '#ffb74d', '#fff'][i % 4];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 10, height: 10,
              borderRadius: '50%',
              background: color,
              animation: `particleFly 0.8s ease-out forwards`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animationDelay: `${i * 0.03}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// FEEDBACK OVERLAY
// ─────────────────────────────────────────────────────────
const FeedbackOverlay = ({ isCorrect, message, subMessage, onContinue }) => (
  <div className="feedback-overlay" onClick={onContinue}>
    <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        background: isCorrect
          ? 'radial-gradient(circle at 30% 30%, #fff 0%, transparent 60%)'
          : 'radial-gradient(circle at 70% 30%, #fff 0%, transparent 60%)',
      }} />
      <div className="feedback-emoji" style={{ fontSize: '4rem', marginBottom: 12, animation: 'bounceIn 0.5s ease' }}>
        {isCorrect ? '🌟' : '🤔'}
      </div>
      <div className="feedback-message" style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        {message}
      </div>
      {subMessage && (
        <div className="feedback-sub" style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: '0.95rem', opacity: 0.9 }}>
          {subMessage}
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.85rem', opacity: 0.7, animation: 'pulse 1.5s infinite' }}>
        Tap anywhere to continue
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// STATION A — "The Number Line Adventure" (CONCRETE)
// Interactive animated number line with drag mechanic
// Questions randomized each session
// ─────────────────────────────────────────────────────────

const ALL_A_ROUNDS = [
  { originalNumber: 63,  target: 60,  min: 50,  max: 70,  step: 10, roundTo: 10,  context: "Sarah counted 63 coins in her piggy bank.", hint: "Is 63 closer to 60 or 70?" },
  { originalNumber: 78,  target: 80,  min: 70,  max: 90,  step: 10, roundTo: 10,  context: "John collected 78 mangoes from the tree.", hint: "Is 78 closer to 70 or 80?" },
  { originalNumber: 347, target: 350, min: 300, max: 400, step: 10, roundTo: 10,  context: "Mike sold 347 mangoes — just like in the story!", hint: "Is 347 closer to 340 or 350?" },
  { originalNumber: 253, target: 300, min: 200, max: 300, step: 10, roundTo: 100, context: "Sarah counted 253 more mangoes today.", hint: "Is 253 closer to 200 or 300?" },
  { originalNumber: 462, target: 500, min: 400, max: 500, step: 10, roundTo: 100, context: "John brought 462 flyers to the market!", hint: "Is 462 closer to 400 or 500?" },
  { originalNumber: 38,  target: 40,  min: 30,  max: 50,  step: 10, roundTo: 10,  context: "Emma baked 38 cookies for the fair.", hint: "Is 38 closer to 30 or 40?" },
  { originalNumber: 124, target: 100, min: 100, max: 200, step: 10, roundTo: 100, context: "The school bought 124 books this year.", hint: "Is 124 closer to 100 or 200?" },
  { originalNumber: 865, target: 900, min: 800, max: 900, step: 10, roundTo: 100, context: "The stadium had 865 fans cheering!", hint: "Is 865 closer to 800 or 900?" },
  { originalNumber: 51,  target: 50,  min: 40,  max: 60,  step: 10, roundTo: 10,  context: "Priya has 51 stickers in her collection.", hint: "Is 51 closer to 50 or 60?" },
  { originalNumber: 389, target: 400, min: 300, max: 400, step: 10, roundTo: 100, context: "The library lent out 389 books last month.", hint: "Is 389 closer to 300 or 400?" },
];

const StationA = ({ onComplete }) => {
  const [rounds] = useState(() => pickRandom(ALL_A_ROUNDS, 5));
  const [roundIdx, setRoundIdx] = useState(0);
  const round = rounds[roundIdx];

  const midpoint = round.min + Math.floor((round.max - round.min) / 2);
  const [value, setValue] = useState(midpoint);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [burst, setBurst] = useState(false);

  // Markers on number line
  const markers = [];
  for (let v = round.min; v <= round.max; v += round.step) {
    markers.push(v);
  }

  const pct = (v) => ((v - round.min) / (round.max - round.min)) * 100;

  const handleCheck = useCallback(() => {
    if (locked) return;
    if (Math.abs(value - round.target) <= (round.step / 2)) {
      setValue(round.target);
      sounds.correct();
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
      setLocked(true);
      setTimeout(() => setShowFeedback(true), 600);
    } else {
      sounds.wrong();
      setAttempts(a => a + 1);
      if (attempts >= 1) setShowHint(true);
    }
  }, [locked, value, round, attempts]);

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setLocked(false);
    if (roundIdx < rounds.length - 1) {
      const nextRound = rounds[roundIdx + 1];
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
    <div className="glass-card max-w-md w-full" style={{ maxWidth: 520, width: '100%' }}>
      <ParticleBurst active={burst} correct={true} />

      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, textAlign: 'center', fontSize: '1.3rem', marginBottom: 4 }}>
        🎚️ The Number Line Adventure
      </h3>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
        Round {roundIdx + 1} of {rounds.length}
      </p>

      {/* Round progress pips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {rounds.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < roundIdx ? 'var(--green)' : i === roundIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            boxShadow: i === roundIdx ? '0 0 8px var(--gold)' : 'none',
          }} />
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 8, lineHeight: 1.5 }}>
        {round.context}
      </p>
      <p style={{ textAlign: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>
        Round <span style={{ color: 'var(--gold)', fontSize: '1.4rem' }}>{round.originalNumber}</span>{' '}
        to the nearest <span style={{ color: 'var(--gold)' }}>{round.roundTo}</span>
      </p>

      {/* Big value display */}
      <div className="station-value-display" style={{ transition: 'all 0.1s ease' }}>
        {value}
      </div>

      {/* Visual Number Line */}
      <div style={{ position: 'relative', height: 80, marginBottom: 8, padding: '0 16px' }}>
        {/* Track */}
        <div style={{
          position: 'absolute', top: 36, left: 16, right: 16, height: 6,
          background: 'rgba(255,255,255,0.15)', borderRadius: 3,
        }} />

        {/* Filled track */}
        <div style={{
          position: 'absolute', top: 36, left: 16,
          width: `calc(${pct(value)}% * (100% - 32px) / 100)`,
          height: 6,
          background: 'linear-gradient(90deg, var(--purple-light), var(--gold))',
          borderRadius: 3,
          transition: 'width 0.05s ease',
        }} />

        {/* Markers */}
        {markers.map(m => (
          <div key={m} style={{
            position: 'absolute',
            top: 30,
            left: `calc(16px + ${pct(m)}% * (100% - 32px) / 100)`,
            transform: 'translateX(-50%)',
          }}>
            <div style={{
              width: m === round.target ? 3 : 2,
              height: m === round.target ? 20 : 14,
              background: m === round.target ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              borderRadius: 2,
              boxShadow: m === round.target ? '0 0 8px var(--gold)' : 'none',
            }} />
            <div style={{
              position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
              fontSize: m === round.target ? '0.75rem' : '0.7rem',
              fontWeight: m === round.target ? 700 : 400,
              color: m === round.target ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
              whiteSpace: 'nowrap',
            }}>
              {m}
            </div>

            {/* "Target" label */}
            {m === round.target && (
              <div style={{
                position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 700,
                background: 'rgba(255,193,7,0.15)', padding: '2px 6px', borderRadius: 4,
                border: '1px solid rgba(255,193,7,0.3)',
                whiteSpace: 'nowrap',
              }}>
                TARGET
              </div>
            )}
          </div>
        ))}

        {/* Slider thumb visual */}
        <div style={{
          position: 'absolute',
          top: 22,
          left: `calc(16px + ${pct(value)}% * (100% - 32px) / 100)`,
          transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: '50%',
          background: 'var(--gold)',
          boxShadow: '0 0 12px rgba(255,193,7,0.7)',
          transition: 'left 0.05s ease',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </div>

      {/* Actual HTML range input */}
      <input
        type="range"
        min={round.min} max={round.max} step={round.step}
        value={value}
        disabled={locked}
        onChange={e => setValue(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 8, opacity: locked ? 0.5 : 1 }}
      />

      {showHint && (
        <div className="simulate-tip" style={{ marginBottom: 12 }}>
          💡 {round.hint}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleCheck}
        disabled={locked}
        style={{ width: '100%', marginTop: 8, opacity: locked ? 0.7 : 1 }}
      >
        {locked ? '✅ Correct!' : 'Check Answer'}
      </button>

      {showFeedback && (
        <FeedbackOverlay
          isCorrect={true}
          message="Perfect Rounding! 🎯"
          subMessage={`${round.originalNumber} rounds to ${round.target}!\n${round.hint}`}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STATION B — "Estimate-O-Meter" (PICTORIAL)
// Animated radial gauge + randomized questions
// ─────────────────────────────────────────────────────────

const ALL_B_ROUNDS = [
  { text: "Mike sold 318 mangoes yesterday and 253 today. About how many total?", emoji: "🥭", options: [400, 550, 700, 900], correctEstimate: 550, exact: 571, explanation: "318 ≈ 300, 253 ≈ 250 → 300 + 250 = 550" },
  { text: "John brought 462 flyers and gave out 179. About how many are left?", emoji: "📄", options: [100, 200, 300, 500], correctEstimate: 300, exact: 283, explanation: "462 ≈ 500, 179 ≈ 200 → 500 − 200 = 300" },
  { text: "Sarah saved 387 coins. Emma gave her 241 more. About how many coins now?", emoji: "💰", options: [400, 500, 600, 800], correctEstimate: 600, exact: 628, explanation: "387 ≈ 400, 241 ≈ 200 → 400 + 200 = 600" },
  { text: "The market had 715 apples. Customers bought 289. About how many remain?", emoji: "🍎", options: [200, 300, 400, 500], correctEstimate: 400, exact: 426, explanation: "715 ≈ 700, 289 ≈ 300 → 700 − 300 = 400" },
  { text: "Arjun read 156 pages Monday and 237 pages Tuesday. About how many total?", emoji: "📖", options: [300, 400, 500, 600], correctEstimate: 400, exact: 393, explanation: "156 ≈ 200, 237 ≈ 200 → 200 + 200 = 400" },
  { text: "A baker made 492 cookies. She sold 318. About how many are left?", emoji: "🍪", options: [100, 200, 300, 400], correctEstimate: 200, exact: 174, explanation: "492 ≈ 500, 318 ≈ 300 → 500 − 300 = 200" },
  { text: "A farmer harvested 634 tomatoes on Day 1 and 289 on Day 2. About how many total?", emoji: "🍅", options: [700, 800, 900, 1000], correctEstimate: 900, exact: 923, explanation: "634 ≈ 600, 289 ≈ 300 → 600 + 300 = 900" },
  { text: "A school collected 847 cans. Students donated 253 more. About how many total?", emoji: "🥫", options: [900, 1000, 1100, 1200], correctEstimate: 1100, exact: 1100, explanation: "847 ≈ 800, 253 ≈ 300 → 800 + 300 = 1100" },
  { text: "There were 563 people at the fair. 178 left early. About how many stayed?", emoji: "🎡", options: [200, 300, 400, 500], correctEstimate: 400, exact: 385, explanation: "563 ≈ 600, 178 ≈ 200 → 600 − 200 = 400" },
  { text: "A library has 724 fiction books and 368 non-fiction. About how many books total?", emoji: "📚", options: [900, 1000, 1100, 1200], correctEstimate: 1100, exact: 1092, explanation: "724 ≈ 700, 368 ≈ 400 → 700 + 400 = 1100" },
];

// Animated semicircle gauge
const GaugeMeter = ({ value, maxValue }) => {
  const angle = value !== null ? ((value / maxValue) * 180) - 90 : -90;
  return (
    <div className="gauge-meter">
      {[
        { color: '#ef5350', pct: '0deg 36deg' },
        { color: '#ff7043', pct: '36deg 72deg' },
        { color: '#ffc107', pct: '72deg 108deg' },
        { color: '#8bc34a', pct: '108deg 144deg' },
        { color: '#4caf50', pct: '144deg 180deg' },
      ].map((seg, i) => (
        <div key={i} className="gauge-meter-arc" style={{
          background: `conic-gradient(from 270deg, ${seg.color} ${seg.pct}, transparent ${seg.pct.split(' ')[1]} 360deg)`,
        }} />
      ))}
      <div className="gauge-meter-inner" />
      <div
        className="gauge-meter-needle"
        style={{
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }}
      >
        <div className="gauge-meter-hub" />
      </div>
      {value !== null && (
        <div className="gauge-meter-label">{value}</div>
      )}
    </div>
  );
};

const StationB = ({ onComplete }) => {
  const [rounds] = useState(() => pickRandom(ALL_B_ROUNDS, 5));
  const [roundIdx, setRoundIdx] = useState(0);
  const round = rounds[roundIdx];

  const [estimate, setEstimate] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);
  const [burst, setBurst] = useState(false);
  const [burstCorrect, setBurstCorrect] = useState(false);

  const maxVal = Math.max(...round.options) + 100;

  const handleOption = (opt) => {
    if (estimate !== null) return;
    setEstimate(opt);
    const correct = opt === round.correctEstimate;
    setBurstCorrect(correct);
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
    if (correct) {
      sounds.correct();
      setTimeout(() => setShowFeedback('correct'), 900);
    } else {
      sounds.wrong();
      setTimeout(() => setShowFeedback('wrong'), 900);
    }
  };

  const handleFeedbackClose = () => {
    if (showFeedback === 'correct') {
      setShowFeedback(null);
      setEstimate(null);
      if (roundIdx < rounds.length - 1) {
        setRoundIdx(r => r + 1);
      } else {
        onComplete();
      }
    } else {
      setShowFeedback(null);
      setEstimate(null);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
      <ParticleBurst active={burst} correct={burstCorrect} />

      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
        🔭 Estimate-O-Meter
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
        Round {roundIdx + 1} of {rounds.length}
      </p>

      {/* Round pips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {rounds.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < roundIdx ? 'var(--green)' : i === roundIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
            boxShadow: i === roundIdx ? '0 0 8px var(--gold)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{round.emoji}</div>
      <p style={{ color: 'white', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 16, padding: '0 8px' }}>
        {round.text}
      </p>

      {/* Animated Gauge */}
      <GaugeMeter value={estimate} maxValue={maxVal} />

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16, fontStyle: 'italic' }}>
        Pick the best estimate ↓
      </p>

      <div className="options-grid">
        {round.options.map(opt => {
          let cls = 'option-btn';
          if (estimate !== null) {
            if (opt === round.correctEstimate) cls += ' correct';
            else if (opt === estimate) cls += ' wrong';
            else cls += ' disabled';
          }
          return (
            <button
              key={opt}
              className={cls}
              onClick={() => handleOption(opt)}
              disabled={estimate !== null}
              style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              ≈ {opt}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <FeedbackOverlay
          isCorrect={showFeedback === 'correct'}
          message={showFeedback === 'correct' ? '🎉 Great Estimate!' : '🤔 Not Quite!'}
          subMessage={showFeedback === 'correct'
            ? `${round.explanation}\nExact: ${round.exact} — very close!`
            : `Try rounding each number first, then add or subtract.\n\nHint: ${round.explanation}`}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// STATION C — "Build the Estimate" (ABSTRACT)
// Step-by-step estimation construction with live preview
// Randomized questions each session
// ─────────────────────────────────────────────────────────

const ALL_C_ROUNDS = [
  { context: "Mike's mangoes — just like the story!", emoji: "🥭", num1: 318, num2: 253, op: '+', roundTo: 100, r1: "300", r2: "250", result: "550" },
  { context: "John's flyers at the market!", emoji: "📄", num1: 462, num2: 179, op: '-', roundTo: 100, r1: "500", r2: "200", result: "300" },
  { context: "Sarah's coin savings!", emoji: "💰", num1: 387, num2: 241, op: '+', roundTo: 100, r1: "400", r2: "200", result: "600" },
  { context: "Pencils at the school supply shop!", emoji: "✏️", num1: 47, num2: 34, op: '+', roundTo: 10, r1: "50", r2: "30", result: "80" },
  { context: "Pages Mei read this week!", emoji: "📖", num1: 812, num2: 489, op: '-', roundTo: 100, r1: "800", r2: "500", result: "300" },
  { context: "Cookies baked at the bakery!", emoji: "🍪", num1: 492, num2: 318, op: '-', roundTo: 100, r1: "500", r2: "300", result: "200" },
  { context: "Tomatoes harvested this week!", emoji: "🍅", num1: 634, num2: 289, op: '+', roundTo: 100, r1: "600", r2: "300", result: "900" },
  { context: "Books in the school library!", emoji: "📚", num1: 724, num2: 368, op: '+', roundTo: 100, r1: "700", r2: "400", result: "1100" },
  { context: "Fans at the cricket match!", emoji: "🏏", num1: 563, num2: 178, op: '-', roundTo: 100, r1: "600", r2: "200", result: "400" },
  { context: "Stars in two galaxy clusters!", emoji: "⭐", num1: 83, num2: 47, op: '+', roundTo: 10, r1: "80", r2: "50", result: "130" },
];

const StationC = ({ onComplete }) => {
  const [rounds] = useState(() => pickRandom(ALL_C_ROUNDS, 5));
  const [roundIdx, setRoundIdx] = useState(0);
  const round = rounds[roundIdx];

  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showError, setShowError] = useState('');
  const [burst, setBurst] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const exact = round.op === '+' ? round.num1 + round.num2 : round.num1 - round.num2;

  // Live preview: show computation as user types
  const liveResult = (() => {
    const a = parseInt(step1);
    const b = parseInt(step2);
    if (!isNaN(a) && !isNaN(b)) {
      return round.op === '+' ? a + b : a - b;
    }
    return null;
  })();

  const checkAnswer = () => {
    if (submitted) return;
    const s1ok = step1 === round.r1;
    const s2ok = step2 === round.r2;
    const s3ok = step3 === round.result;

    if (s1ok && s2ok && s3ok) {
      sounds.correct();
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
      setSubmitted(true);
      setTimeout(() => setShowFeedback(true), 500);
      setShowError('');
    } else {
      sounds.wrong();
      const msgs = [];
      if (!s1ok) msgs.push(`Round ${round.num1} to nearest ${round.roundTo} → should be ${round.r1}`);
      if (!s2ok) msgs.push(`Round ${round.num2} to nearest ${round.roundTo} → should be ${round.r2}`);
      if (s1ok && s2ok && !s3ok) msgs.push(`${round.r1} ${round.op} ${round.r2} = ${round.result}`);
      setShowError(msgs.join('\n'));
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setSubmitted(false);
    if (roundIdx < rounds.length - 1) {
      setRoundIdx(r => r + 1);
      setStep1(''); setStep2(''); setStep3('');
      setShowError('');
    } else {
      onComplete();
    }
  };

  const inputStyle = (val, correct) => ({
    width: 90, height: 52, border: `2px dashed ${val === correct ? 'var(--green)' : 'var(--gold)'}`,
    borderRadius: 12,
    background: val === correct ? 'rgba(76,175,80,0.15)' : 'rgba(255,193,7,0.05)',
    color: val === correct ? 'var(--green)' : 'var(--gold)',
    fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700,
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <div className="glass-card" style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
      <ParticleBurst active={burst} correct={true} />

      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
        🏗️ Build the Estimate
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
        Round {roundIdx + 1} of {rounds.length}
      </p>

      {/* Round pips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {rounds.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < roundIdx ? 'var(--green)' : i === roundIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
            boxShadow: i === roundIdx ? '0 0 8px var(--gold)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ fontSize: '2rem', marginBottom: 4 }}>{round.emoji}</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 8 }}>{round.context}</p>

      {/* The problem */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'inline-block',
      }}>
        <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>
          {round.num1}{' '}
          <span style={{ color: 'var(--gold)' }}>{round.op}</span>{' '}
          {round.num2} = ?
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginTop: 4 }}>
          Round to nearest {round.roundTo}
        </span>
      </div>

      {/* Step-by-step inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, marginBottom: 2 }}>STEP 1</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{round.num1} →</div>
          </div>
          <input
            type="number"
            value={step1}
            onChange={e => setStep1(e.target.value)}
            placeholder="?"
            disabled={submitted}
            style={inputStyle(step1, round.r1)}
          />
          {step1 === round.r1 && <span style={{ color: 'var(--green)', fontSize: '1.4rem' }}>✓</span>}
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, marginBottom: 2 }}>STEP 2</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{round.num2} →</div>
          </div>
          <input
            type="number"
            value={step2}
            onChange={e => setStep2(e.target.value)}
            placeholder="?"
            disabled={submitted}
            style={inputStyle(step2, round.r2)}
          />
          {step2 === round.r2 && <span style={{ color: 'var(--green)', fontSize: '1.4rem' }}>✓</span>}
        </div>

        {/* Live preview line */}
        {liveResult !== null && (
          <div style={{
            color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic',
            background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '4px 12px',
          }}>
            {step1} {round.op} {step2} = <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>{liveResult}</span>
          </div>
        )}

        {/* Step 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, marginBottom: 2 }}>STEP 3</div>
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
              {round.op === '+' ? 'Sum' : 'Diff'} =
            </div>
          </div>
          <input
            type="number"
            value={step3}
            onChange={e => setStep3(e.target.value)}
            placeholder="?"
            disabled={submitted}
            style={inputStyle(step3, round.result)}
          />
          {step3 === round.result && <span style={{ color: 'var(--green)', fontSize: '1.4rem' }}>✓</span>}
        </div>
      </div>

      {showError && (
        <div style={{
          background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)',
          borderRadius: 10, padding: '10px 16px', marginBottom: 12,
          color: 'var(--red-light)', fontSize: '0.85rem', textAlign: 'left',
          whiteSpace: 'pre-wrap',
        }}>
          🤔 {showError}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={checkAnswer}
        disabled={submitted}
        style={{ width: '100%', opacity: submitted ? 0.7 : 1 }}
      >
        {submitted ? '✅ Correct!' : 'Check My Estimate'}
      </button>

      {showFeedback && (
        <FeedbackOverlay
          isCorrect={true}
          message="🧠 Master Estimator!"
          subMessage={`${round.r1} ${round.op} ${round.r2} = ${round.result}\nExact: ${exact} — your estimate is spot on!`}
          onContinue={handleFeedbackClose}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN SIMULATE PHASE
// CPA: Concrete → Pictorial → Abstract
// ─────────────────────────────────────────────────────────

const STATION_INFO = [
  { name: "The Number Line Adventure", icon: "🎚️", desc: "Drag to find the nearest round number", approach: "Concrete", color: '#8b5cf6' },
  { name: "Estimate-O-Meter",          icon: "🔭", desc: "Choose the best estimate for real problems", approach: "Pictorial", color: '#f59e0b' },
  { name: "Build the Estimate",        icon: "🏗️", desc: "Construct estimates step by step", approach: "Abstract", color: '#10b981' },
];

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      narrationRef.current?.cancel();
      if (station === 0) narrationRef.current = narrate(simulateStationANarration(), true);
      else if (station === 1) narrationRef.current = narrate(simulateStationBNarration(), true);
      else if (station === 2) narrationRef.current = narrate(simulateStationCNarration(), true);
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
      {/* Inject particle keyframe */}
      <style>{`
        @keyframes particleFly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>

      <div className="simulate-header">
        <h2 className="simulate-label">🧪 Interactive Sandbox</h2>
        <p className="simulate-sublabel">Complete all 3 stations to earn your Estimation Explorer badge! 🎯</p>
      </div>

      {/* Station progress */}
      <div className="station-progress">
        {STATION_INFO.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: i === station
                  ? `linear-gradient(135deg, ${s.color}, ${s.color}aa)`
                  : i < station ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                border: i === station ? `2px solid ${s.color}` : '2px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i < station ? '1rem' : '1.2rem',
                boxShadow: i === station ? `0 0 16px ${s.color}55` : 'none',
                transition: 'all 0.4s ease',
              }}>
                {i < station ? '✓' : s.icon}
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600,
                color: i === station ? s.color : i < station ? 'var(--green-light)' : 'var(--text-muted)',
                transition: 'color 0.4s',
              }}>
                {s.approach}
              </span>
            </div>
            {i < 2 && (
              <div className="station-connector" style={{
                width: 40, height: 2, marginBottom: 20,
                background: i < station ? 'var(--green)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.4s',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Active station tip */}
      <div className="simulate-tip" style={{ maxWidth: 520, width: '100%', textAlign: 'center', marginBottom: 16 }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{info.icon} {info.name}</span>
        {' — '}
        <span style={{ color: 'var(--text-secondary)' }}>{info.desc}</span>
      </div>

      {station === 0 && <StationA onComplete={handleStationComplete} />}
      {station === 1 && <StationB onComplete={handleStationComplete} />}
      {station === 2 && <StationC onComplete={handleStationComplete} />}
    </div>
  );
}
