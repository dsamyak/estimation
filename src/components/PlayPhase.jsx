import { useState, useEffect, useRef, useCallback } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { playIntroNarration } from '../utils/narration';

// ═══════════════════════════════════════════════════════════════
// WORLD DATA — Each world has its own theme, color, and items
// ═══════════════════════════════════════════════════════════════

const WORLD_DATA = [
  { id: 1,  name: 'School Supplies', icon: '✏️',  unlocked: true,  color: '#5c8fff', glow: 'rgba(92,143,255,0.35)',  gradient: 'linear-gradient(135deg,#1a237e,#3f51b5)', items: ['pencils','erasers','notebooks','crayons','rulers','stickers'] },
  { id: 2,  name: 'Fruit Market',    icon: '🍎',  unlocked: false, color: '#ff7043', glow: 'rgba(255,112,67,0.35)',  gradient: 'linear-gradient(135deg,#bf360c,#ff5722)', items: ['apples','mangoes','bananas','oranges','grapes','papayas'] },
  { id: 3,  name: 'Train Journey',   icon: '🚂',  unlocked: false, color: '#78909c', glow: 'rgba(120,144,156,0.35)', gradient: 'linear-gradient(135deg,#263238,#546e7a)', items: ['passengers','tickets','bags','seats','packages'] },
  { id: 4,  name: 'Beach Day',       icon: '🏖️', unlocked: false, color: '#00bcd4', glow: 'rgba(0,188,212,0.35)',   gradient: 'linear-gradient(135deg,#006064,#0097a7)', items: ['seashells','pebbles','fish','starfish','crabs'] },
  { id: 5,  name: 'Art Class',       icon: '🎨',  unlocked: false, color: '#e040fb', glow: 'rgba(224,64,251,0.35)', gradient: 'linear-gradient(135deg,#6a1b9a,#ab47bc)', items: ['paint tubes','brushes','sketches','colour pencils','canvases'] },
  { id: 6,  name: 'Sports Stadium',  icon: '🏟️', unlocked: false, color: '#ef5350', glow: 'rgba(239,83,80,0.35)',   gradient: 'linear-gradient(135deg,#b71c1c,#e53935)', items: ['fans','tickets','goals','jerseys','balls'] },
  { id: 7,  name: 'World Travel',    icon: '🌍',  unlocked: false, color: '#66bb6a', glow: 'rgba(102,187,106,0.35)',gradient: 'linear-gradient(135deg,#1b5e20,#388e3c)', items: ['souvenirs','photos','stamps','coins','miles'] },
  { id: 8,  name: 'Pizza Party',     icon: '🍕',  unlocked: false, color: '#ffa726', glow: 'rgba(255,167,38,0.35)', gradient: 'linear-gradient(135deg,#e65100,#fb8c00)', items: ['pizza slices','guests','toppings','drinks','balloons'] },
  { id: 9,  name: 'Space Mission',   icon: '🚀',  unlocked: false, color: '#7c4dff', glow: 'rgba(124,77,255,0.35)', gradient: 'linear-gradient(135deg,#1a237e,#4527a0)', items: ['stars','asteroids','satellites','fuel cans','space rocks'] },
  { id: 10, name: 'Grand Finale',    icon: '🎉',  unlocked: false, color: '#ffd700', glow: 'rgba(255,215,0,0.45)',  gradient: 'linear-gradient(135deg,#f57f17,#ffc107)', items: ['trophies','medals','prizes','points','confetti bags'] },
];

const CHARACTERS = ['John','Sarah','Mike','Emma','Arjun','Lena','Sofia','Tomás','Mei','Priya'];
const Q_TYPES    = ['R10','R100','SUM_MCQ','DIFF_MCQ','SUM_FILL','DIFF_FILL','WP_ADD','WP_SUB','REASON','OVER_UNDER'];

const CORRECT_MSGS = ['🎯 Spot on!','🌟 Brilliant!','✨ Perfect!','🏆 Nailed it!','🎉 Amazing!','🔥 Excellent!','💡 Great thinking!'];
const WRONG_MSGS   = ['🤔 Not quite…','💪 Keep going!','📚 Almost there!','🧠 Good try!'];

// ─── Pure helpers ────────────────────────────────────────────
const pick   = arr => arr[Math.floor(Math.random() * arr.length)];
const rnd    = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function makeOpts(nums) {
  const pos    = nums.map(n => Math.max(0, n));
  const unique = [...new Set(pos)];
  let filler   = (unique[0] || 10) + 10;
  while (unique.length < 4) { if (!unique.includes(filler)) unique.push(filler); filler += 10; }
  return unique.slice(0, 4).sort(() => Math.random() - 0.5);
}

function buildQuestion(world) {
  // Pick a random question type fresh each call
  // (type rotation is managed in component via worldTypes state)
  const qType = pick(Q_TYPES);
  return buildQuestionOfType(qType, world);
}

function buildQuestionOfType(qType, world) {
  const item   = pick(world.items);
  const char   = pick(CHARACTERS);
  const n1_3d  = rnd(102, 898);
  const n2_3d  = rnd(102, 898);
  const n1_2d  = rnd(11, 89);
  const n2_2d  = rnd(11, 89);

  switch (qType) {
    case 'R10': {
      const num    = n1_3d;
      const target = Math.round(num / 10) * 10;
      return {
        format: 'MCQ', correct: target,
        label: 'Round to 10',
        text: pick([
          `${char} counted ${num} ${item}. Round ${num} to the nearest 10.`,
          `There are ${num} ${item} at the ${world.name}. Round to the nearest 10.`,
          `What is ${num} rounded to the nearest 10?`,
        ]),
        options: makeOpts([target, target - 10, target + 10, target + 20]),
        hint: `Look at the ones digit of ${num}.`,
      };
    }

    case 'R100': {
      const num    = n1_3d;
      const target = Math.round(num / 100) * 100;
      return {
        format: 'MCQ', correct: target,
        label: 'Round to 100',
        text: pick([
          `${char} found ${num} ${item}. Round to the nearest 100.`,
          `Estimate ${num} ${item} to the nearest 100.`,
          `What is ${num} rounded to the nearest 100?`,
        ]),
        options: makeOpts([target, target - 100, target + 100, target + 200]),
        hint: `Look at the tens digit of ${num}.`,
      };
    }

    case 'SUM_MCQ': {
      const target = Math.round(n1_3d / 10) * 10 + Math.round(n2_3d / 10) * 10;
      return {
        format: 'MCQ', correct: target,
        label: 'Estimate Sum',
        text: pick([
          `Estimate: ${n1_3d} + ${n2_3d} (round each to nearest 10).`,
          `${char} has ${n1_3d} ${item} and ${n2_3d} more. About how many in total?`,
          `About how much is ${n1_3d} + ${n2_3d}?`,
        ]),
        options: makeOpts([target, target - 10, target + 10, target + 20]),
        hint: `Round both numbers to the nearest 10, then add.`,
      };
    }

    case 'DIFF_MCQ': {
      const hi = Math.max(n1_3d, n2_3d), lo = Math.min(n1_3d, n2_3d);
      const target = Math.round(hi / 100) * 100 - Math.round(lo / 100) * 100;
      return {
        format: 'MCQ', correct: target,
        label: 'Estimate Difference',
        text: pick([
          `Estimate: ${hi} − ${lo} (round each to nearest 100).`,
          `${char} had ${hi} ${item} and used ${lo}. About how many remain?`,
          `What is the approximate difference between ${hi} and ${lo}?`,
        ]),
        options: makeOpts([target, target - 100, target + 100, Math.abs(target - 200)]),
        hint: `Round both numbers to the nearest 100, then subtract.`,
      };
    }

    case 'SUM_FILL': {
      const target = Math.round(n1_2d / 10) * 10 + Math.round(n2_2d / 10) * 10;
      return {
        format: 'FILL_BLANK', correct: target,
        label: 'Fill the Blank',
        text: pick([
          `${n1_2d} + ${n2_2d} ≈ ? (nearest 10)`,
          `${char} has ${n1_2d} ${item} and gets ${n2_2d} more. Estimate the total (nearest 10).`,
          `Estimate: ${n1_2d} + ${n2_2d} ≈ ___`,
        ]),
        hint: `Round ${n1_2d} to the nearest 10, then ${n2_2d}.`,
      };
    }

    case 'DIFF_FILL': {
      const hi = Math.max(n1_2d, n2_2d), lo = Math.min(n1_2d, n2_2d);
      const target = Math.round(hi / 10) * 10 - Math.round(lo / 10) * 10;
      return {
        format: 'FILL_BLANK', correct: target,
        label: 'Fill the Blank',
        text: pick([
          `${hi} − ${lo} ≈ ? (nearest 10)`,
          `${char} had ${hi} ${item} and gave away ${lo}. Estimate what's left.`,
          `Estimate the difference: ${hi} − ${lo} ≈ ___`,
        ]),
        hint: `Round ${hi} and ${lo} to the nearest 10, then subtract.`,
      };
    }

    case 'WP_ADD': {
      const target = Math.round(n1_3d / 100) * 100 + Math.round(n2_3d / 100) * 100;
      return {
        format: 'MCQ', correct: target,
        label: 'Word Problem',
        text: pick([
          `${char} collected ${n1_3d} ${item} in Week 1 and ${n2_3d} in Week 2. About how many in total?`,
          `Box A has ${n1_3d} ${item} and Box B has ${n2_3d}. Estimate the combined total.`,
          `${char} counted ${n1_3d} ${item} on Day 1 and ${n2_3d} on Day 2. About how many altogether?`,
        ]),
        options: makeOpts([target, target - 100, target + 100, target + 200]),
        hint: `Round each to the nearest 100, then add.`,
      };
    }

    case 'WP_SUB': {
      const hi = Math.max(n1_3d, n2_3d), lo = Math.min(n1_3d, n2_3d);
      const target = Math.round(hi / 10) * 10 - Math.round(lo / 10) * 10;
      return {
        format: 'MCQ', correct: target,
        label: 'Word Problem',
        text: pick([
          `${char} started with ${hi} ${item} and used ${lo}. About how many are left?`,
          `A store had ${hi} ${item} and sold ${lo}. Estimate the remaining stock.`,
          `${char} had ${hi} ${item} and gave ${lo} away. Roughly how many remain?`,
        ]),
        options: makeOpts([target, target - 10, target + 10, Math.abs(target - 20)]),
        hint: `Round both numbers to the nearest 10, then subtract.`,
      };
    }

    case 'REASON': {
      const trueEst    = Math.round(n1_3d / 100) * 100 + Math.round(n2_3d / 100) * 100;
      const isReasonable = Math.random() > 0.5;
      const badOffset  = (Math.random() > 0.5 ? 1 : -1) * rnd(200, 400);
      const displayEst = isReasonable ? trueEst : Math.max(100, trueEst + badOffset);
      return {
        format: 'YES_NO', correct: isReasonable ? 'YES' : 'NO',
        label: 'Is It Reasonable?',
        text: pick([
          `${char} said ${n1_3d} + ${n2_3d} ≈ ${displayEst}. Is this a reasonable estimate?`,
          `Someone claims ${n1_3d} ${item} + ${n2_3d} ${item} is about ${displayEst}. Reasonable?`,
          `Is ${displayEst} a good estimate for ${n1_3d} + ${n2_3d}?`,
        ]),
        hint: `The actual rounded total is ${trueEst}.`,
      };
    }

    case 'OVER_UNDER': {
      const r1    = Math.round(n1_2d / 10) * 10;
      const r2    = Math.round(n2_2d / 10) * 10;
      const exact = n1_2d + n2_2d;
      const est   = r1 + r2;
      // Ensure it's not exact
      const isOver = est >= exact;
      return {
        format: 'OVER_UNDER', correct: isOver ? 'OVERESTIMATE' : 'UNDERESTIMATE',
        options: ['OVERESTIMATE', 'UNDERESTIMATE'],
        label: 'Over or Under?',
        text: pick([
          `${char} estimated ${n1_2d} + ${n2_2d} ≈ ${est}. Is this an over- or underestimate? (Actual: ${exact})`,
          `Rounding ${n1_2d}→${r1} and ${n2_2d}→${r2} gives ${est}. Does this over- or underestimate ${exact}?`,
          `The estimate for ${n1_2d}+${n2_2d} is ${est}. Is it an over- or underestimate of the real total (${exact})?`,
        ]),
        hint: `The actual sum is ${exact}; the estimate is ${est}.`,
      };
    }

    default: return null;
  }
}

// ─── FeedbackOverlay ─────────────────────────────────────────
const FeedbackOverlay = ({ isCorrect, message, hint, onContinue }) => (
  <div className="feedback-overlay" onClick={onContinue}>
    <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`} style={{ animation: 'bounceIn 0.4s ease' }}>
      <div className="feedback-emoji" style={{ fontSize: '3rem' }}>{isCorrect ? '🌟' : '🤔'}</div>
      <div className="feedback-message">{message}</div>
      {hint && <div className="feedback-sub" style={{ marginTop: 8, fontSize: '0.9rem', opacity: 0.85 }}>💡 {hint}</div>}
      <div className="mt-4 text-sm opacity-70" style={{ marginTop: 12 }}>Tap anywhere to continue</div>
    </div>
  </div>
);

// ─── XP Pop ──────────────────────────────────────────────────
const XPPop = ({ animKey }) => (
  <div key={animKey} style={{
    position: 'fixed', top: '20%', right: '10%', zIndex: 999,
    color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem',
    pointerEvents: 'none',
    animation: 'xpFloat 1.4s ease forwards',
  }}>+10 XP ⚡</div>
);

// ─── Star Row ─────────────────────────────────────────────────
const StarRow = ({ stars, animated }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
    {[1, 2, 3].map(i => (
      <span key={i} style={{
        fontSize: '2.8rem',
        opacity: i <= stars ? 1 : 0.2,
        filter: i <= stars ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'none',
        animation: animated && i <= stars ? `bounceIn 0.5s ease ${(i - 1) * 0.2}s backwards` : 'none',
        display: 'inline-block',
      }}>⭐</span>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [worlds, setWorlds]           = useState(() => WORLD_DATA.map(w => ({ ...w })));
  const [currentWorld, setCurrentWorld] = useState(null);

  // Stats
  const [xp, setXp]               = useState(0);
  const [streak, setStreak]        = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [badges, setBadges]        = useState([]);
  const [xpAnimKey, setXpAnimKey]  = useState(0);
  const [showXP, setShowXP]        = useState(false);

  // Game state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore]                 = useState(0);
  const [question, setQuestion]           = useState(null);
  const [feedback, setFeedback]           = useState(null);
  const [inputValue, setInputValue]       = useState('');
  const [worldTypes, setWorldTypes]       = useState([...Q_TYPES]);
  const [showHint, setShowHint]           = useState(false);

  const narrationRef = useRef(null);
  const xpTimerRef   = useRef(null);

  // Intro narration
  useEffect(() => {
    if (audioEnabled && !currentWorld && xp === 0) {
      narrationRef.current = narrate(playIntroNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); stopNarration(); };
  }, [audioEnabled, currentWorld, xp]);

  // Cleanup XP timer
  useEffect(() => () => clearTimeout(xpTimerRef.current), []);

  // Generate next question when needed
  useEffect(() => {
    if (!currentWorld || feedback || question) return;
    if (worldTypes.length === 0) { setWorldTypes([...Q_TYPES]); return; }

    // Pick from remaining types and remove it
    const idx   = Math.floor(Math.random() * worldTypes.length);
    const qType = worldTypes[idx];
    setWorldTypes(prev => prev.filter((_, i) => i !== idx));

    const q = buildQuestionOfType(qType, currentWorld);
    if (q) { setQuestion(q); setInputValue(''); setShowHint(false); }
  }, [currentWorld, questionIndex, feedback, question, worldTypes]);

  // ─── Answer handling ──────────────────────────────────────
  const handleAnswer = (val) => {
    if (feedback) return;
    const isCorrect = String(val).trim().toUpperCase() === String(question.correct).trim().toUpperCase();

    if (isCorrect) {
      sounds.correct();
      setScore(s => s + 1);
      setXp(x => x + 10);
      setXpAnimKey(k => k + 1);
      setShowXP(true);
      clearTimeout(xpTimerRef.current);
      xpTimerRef.current = setTimeout(() => setShowXP(false), 1500);

      setStreak(s => {
        const ns = s + 1;
        if (ns > bestStreak) setBestStreak(ns);
        if (ns === 10 && !badges.includes('Streak Champion')) setBadges(b => [...b, 'Streak Champion']);
        if (ns % 5 === 0) sounds.streak();
        return ns;
      });
      setFeedback('correct');
    } else {
      sounds.wrong();
      setStreak(0);
      setFeedback('wrong');
    }
  };

  const nextQuestion = () => {
    if (questionIndex < 9) {
      setQuestionIndex(i => i + 1);
      setQuestion(null);
      setFeedback(null);
    } else {
      // World complete
      const stars = score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0;
      if (stars === 3) setXp(x => x + 25);

      setWorlds(prev => prev.map(w => {
        if (w.id === currentWorld.id) return { ...w, score, stars };
        if (w.id === currentWorld.id + 1 && score >= 6) return { ...w, unlocked: true };
        return w;
      }));
      sounds.badge();
      setFeedback('world_complete');
    }
  };

  const closeWorld = () => {
    const threeStarCount = worlds.filter(w => w.stars === 3).length + (score === 10 ? 1 : 0);
    if (threeStarCount >= 5 && !badges.includes('3-Star Superstar')) setBadges(b => [...b, '3-Star Superstar']);
    if (currentWorld.id === 10) {
      if (!badges.includes('Estimation Master')) setBadges(b => [...b, 'Estimation Master']);
      if (!badges.includes('Global Estimator'))  setBadges(b => [...b, 'Global Estimator']);
    }
    setCurrentWorld(null);
    setQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setQuestion(null);
    setWorldTypes([...Q_TYPES]);
    setShowHint(false);
  };

  const handleFinish = () => {
    sounds.click();
    onComplete({
      xp,
      bestStreak,
      completedWorlds: worlds.filter(w => w.score !== undefined).length,
      totalStars: worlds.reduce((acc, w) => acc + (w.stars || 0), 0),
      badges,
    });
  };

  const allDone = worlds.every(w => w.score !== undefined && w.score >= 6);
  const worldScore = question ? score : 0;

  // ─── WORLD MAP ────────────────────────────────────────────
  if (!currentWorld) {
    return (
      <div className="play-phase" style={{ height: '100%', overflowY: 'auto' }}>
        {/* Header */}
        <div className="play-header">
          <h2 className="play-title text-gold text-display text-huge high-contrast-text">
            🎮 IntelliPlay™
          </h2>
          <p className="play-subtitle text-lg text-bold text-white">Select a world and start estimating!</p>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <div style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: 20, padding: '4px 16px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)' }}>
              ⚡ {xp} XP
            </div>
            <div style={{ background: 'rgba(255,87,34,0.12)', border: '1px solid rgba(255,87,34,0.3)', borderRadius: 20, padding: '4px 16px', fontSize: '0.9rem', fontWeight: 700, color: '#ff8a65' }}>
              🔥 Best Streak: {bestStreak}
            </div>
            <div style={{ background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 20, padding: '4px 16px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--green)' }}>
              ⭐ {worlds.reduce((a, w) => a + (w.stars || 0), 0)} Stars
            </div>
          </div>
        </div>

        {/* World grid */}
        <div className="world-map">
          {worlds.map(w => (
            <div
              key={w.id}
              className={`world-card ${w.unlocked ? 'unlocked' : 'locked'} ${w.score !== undefined ? 'completed' : ''}`}
              onClick={() => { if (w.unlocked) { sounds.click(); setCurrentWorld(w); } }}
              style={{
                background: w.score !== undefined ? w.gradient : undefined,
                borderColor: w.unlocked && w.score === undefined ? w.color : undefined,
                boxShadow: w.score !== undefined ? `0 4px 24px ${w.glow}` : undefined,
                cursor: w.unlocked ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="world-icon" style={{fontSize: '2.5rem'}}>{w.unlocked ? w.icon : '🔒'}</div>
              <div className="world-name text-display text-bold text-md">{w.name}</div>
              {w.score !== undefined && (
                <div className="world-stars mt-2">
                  {'⭐'.repeat(w.stars)}{'☆'.repeat(3 - w.stars)}
                  <div className="text-md text-bold opacity-90 mt-1">({w.score}/10)</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div style={{ maxWidth: 480, width: '100%', padding: '0 16px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Badges Earned</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {badges.map(b => (
                <span key={b} style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: 16, padding: '4px 12px', fontSize: '0.78rem', color: 'var(--gold)' }}>
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {allDone && (
          <div className="text-center" style={{ marginBottom: 24, animation: 'bounceIn 0.6s ease' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
              You mastered all 10 worlds! 🏆
            </p>
            <button className="btn btn-green" onClick={handleFinish}>
              Proceed to Reflection ➔
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── QUESTION SCREEN ──────────────────────────────────────
  const progressPct = (questionIndex / 10) * 100;
  const worldStars  = score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0;

  return (
    <div className="play-phase" style={{ justifyContent: 'flex-start', paddingTop: 16 }}>
      {/* XP Popup */}
      {showXP && <XPPop animKey={xpAnimKey} />}

      {/* World banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', maxWidth: 480, marginBottom: 12, padding: '10px 16px',
        background: currentWorld.gradient, borderRadius: 14,
        boxShadow: `0 4px 20px ${currentWorld.glow}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.6rem' }}>{currentWorld.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{currentWorld.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>Q{questionIndex + 1} of 10</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>⚡ {xp} XP</div>
          <div style={{ color: '#ff8a65', fontWeight: 700, fontSize: '0.9rem' }}>
            {streak >= 3 ? '🔥'.repeat(Math.min(streak, 5)) : `🔥 ${streak}`}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            width: i === questionIndex ? 18 : 10, height: 10, borderRadius: 5,
            background: i < questionIndex
              ? currentWorld.color
              : i === questionIndex
              ? 'var(--gold)'
              : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s ease',
            boxShadow: i === questionIndex ? `0 0 8px ${currentWorld.color}` : 'none',
          }}/>
        ))}
      </div>

      {/* Score */}
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
        ✅ {score} correct so far
      </div>

      {/* Question card */}
      {question && !feedback && (
        <div className="glass-card" style={{
          maxWidth: 480, width: '100%', textAlign: 'center',
          animation: 'bounceIn 0.4s ease',
          borderTop: `3px solid ${currentWorld.color}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Question type badge */}
          <div style={{
            display: 'inline-block', marginBottom: 12,
            background: `${currentWorld.color}22`, border: `2px solid ${currentWorld.color}99`,
            borderRadius: 20, padding: '6px 16px',
            fontSize: '1rem', color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5,
          }}>
            {question.label || 'Estimation'}
          </div>

          <h3 className="text-display text-xl high-contrast-text text-white" style={{ marginBottom: 24, lineHeight: 1.4 }}>
            {question.text}
          </h3>

          {/* MCQ */}
          {question.format === 'MCQ' && (
            <div className="options-grid">
              {question.options.map(opt => (
                <button key={opt} className="option-btn text-display text-xl high-contrast-text" onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* YES / NO */}
          {question.format === 'YES_NO' && (
            <div className="options-grid">
              <button className="option-btn text-display text-xl high-contrast-text" onClick={() => handleAnswer('YES')}>
                ✅ YES
              </button>
              <button className="option-btn text-display text-xl high-contrast-text" onClick={() => handleAnswer('NO')}>
                ❌ NO
              </button>
            </div>
          )}

          {/* OVER / UNDER */}
          {question.format === 'OVER_UNDER' && (
            <div className="options-grid">
              <button className="option-btn text-display text-lg high-contrast-text" onClick={() => handleAnswer('OVERESTIMATE')}>
                📈 OVERESTIMATE
              </button>
              <button className="option-btn text-display text-lg high-contrast-text" onClick={() => handleAnswer('UNDERESTIMATE')}>
                📉 UNDERESTIMATE
              </button>
            </div>
          )}

          {/* FILL BLANK */}
          {question.format === 'FILL_BLANK' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <input
                type="number"
                className="blank-input sim-number-input text-display text-huge high-contrast-text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && inputValue !== '' && handleAnswer(inputValue)}
                style={{ width: 160, height: 80, textAlign: 'center', color: 'white',
                  borderColor: currentWorld.color, boxShadow: `0 0 16px ${currentWorld.glow}` }}
                autoFocus
                placeholder="?"
              />
              <button className="btn btn-primary text-display text-lg" onClick={() => handleAnswer(inputValue)} disabled={inputValue === ''} style={{ width: '100%' }}>
                Submit Answer ✓
              </button>
            </div>
          )}

          {/* Hint toggle */}
          {question.hint && (
            <div style={{ marginTop: 16 }}>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 14px', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  💡 Show hint
                </button>
              ) : (
                <div style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 10, padding: '8px 14px', color: 'var(--gold-light)', fontSize: '0.82rem', animation: 'slideUp 0.3s ease' }}>
                  💡 {question.hint}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Feedback overlays */}
      {feedback === 'correct' && (
        <FeedbackOverlay
          isCorrect={true}
          message={pick(CORRECT_MSGS)}
          onContinue={nextQuestion}
        />
      )}

      {feedback === 'wrong' && (
        <FeedbackOverlay
          isCorrect={false}
          message={pick(WRONG_MSGS)}
          hint={`The correct answer was ${question.correct}.${question.hint ? ' ' + question.hint : ''}`}
          onContinue={nextQuestion}
        />
      )}

      {/* World complete card */}
      {feedback === 'world_complete' && (
        <div className="world-complete-card glass-card text-center" style={{ animation: 'bounceIn 0.5s ease', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8, animation: 'celebrate 0.8s ease' }}>{currentWorld.icon}</div>
          <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', marginBottom: 4 }}>
            World Complete!
          </h2>
          <p style={{ color: currentWorld.name, color: 'var(--text-secondary)', marginBottom: 12, fontSize: '1rem' }}>
            {currentWorld.name}
          </p>

          <StarRow stars={score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0} animated />

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20,
          }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Score</div>
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem' }}>{score}/10</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>XP Earned</div>
              <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem' }}>+{score * 10}</div>
            </div>
          </div>

          {score < 6 ? (
            <p style={{ color: 'var(--red-light)', fontSize: '0.9rem', marginBottom: 16 }}>
              Score 6 or more to unlock the next world. Try again!
            </p>
          ) : (
            <p style={{ color: 'var(--green-light)', fontSize: '0.9rem', marginBottom: 16 }}>
              {currentWorld.id < 10 ? '🔓 Next world unlocked!' : '🏆 All worlds complete!'}
            </p>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeWorld}>
            Back to Map 🗺️
          </button>
        </div>
      )}
    </div>
  );
}
