// =============================================================
// SimulationsPhase.jsx
// Three visual estimation simulations:
//   1. 🫙  Jar Estimation Challenge
//   2. 🎯  Number Line Target Adventure
//   3. 🗺️  Treasure Map Distance Estimation
//
// Reuses: sounds, narrate/stopNarration, .glass-card, .btn,
//         .options-grid, .option-btn, all CSS animations,
//         and every design token from index.css
// =============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';

// ─── Shared utility ──────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Shared sub-components ────────────────────────────────────
const StarRating = ({ stars, max = 3 }) => (
  <div style={{ fontSize: '2.2rem', letterSpacing: 2, textAlign: 'center', lineHeight: 1 }}>
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        style={{
          opacity: i < stars ? 1 : 0.2,
          filter: i < stars ? 'drop-shadow(0 0 8px rgba(255,215,0,0.9))' : 'none',
          display: 'inline-block',
          animation: i < stars ? `bounceIn 0.4s ease ${i * 0.15}s backwards` : 'none',
        }}
      >⭐</span>
    ))}
  </div>
);

const ResultBanner = ({ stars, messages }) => {
  const bg     = stars >= 3 ? 'rgba(76,175,80,0.15)'  : stars >= 2 ? 'rgba(255,193,7,0.12)'  : stars >= 1 ? 'rgba(255,87,34,0.10)'  : 'rgba(239,83,80,0.12)';
  const border = stars >= 3 ? 'rgba(76,175,80,0.40)'  : stars >= 2 ? 'rgba(255,193,7,0.40)'  : stars >= 1 ? 'rgba(255,87,34,0.30)'  : 'rgba(239,83,80,0.30)';
  return (
    <div style={{
      padding: '12px 16px', borderRadius: 12,
      background: bg, border: `1px solid ${border}`,
      color: 'white', fontSize: '0.95rem', textAlign: 'center',
      animation: 'bounceIn 0.5s ease', marginBottom: 16,
    }}>
      {messages[stars] ?? messages[0]}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIMULATION 1 — 🫙 JAR ESTIMATION CHALLENGE
// ═══════════════════════════════════════════════════════════════

const JAR_TYPES = [
  { name: 'Candies',     emoji: '🍬', color: '#ff6b9d' },
  { name: 'Marbles',     emoji: '🔵', color: '#4fc3f7' },
  { name: 'Gold Stars',  emoji: '⭐', color: '#ffd700' },
  { name: 'Coins',       emoji: '🪙', color: '#ffa726' },
  { name: 'Blueberries', emoji: '🫐', color: '#9c6dff' },
  { name: 'Cherries',    emoji: '🍒', color: '#e53935' },
  { name: 'Gems',        emoji: '💎', color: '#4dd0e1' },
];

const generateJar = () => {
  const type  = JAR_TYPES[Math.floor(Math.random() * JAR_TYPES.length)];
  const count = Math.floor(Math.random() * 38) + 12; // 12–49
  const positions = Array.from({ length: count }, () => ({
    x:      8 + Math.random() * 84,        // % horizontal within jar interior
    y:     10 + Math.random() * 82,         // % vertical within jar interior
    scale:  0.7 + Math.random() * 0.65,    // 0.7–1.35
    rotate: Math.random() * 50 - 25,       // -25° to +25°
  }));
  return { type, count, positions };
};

const JarEstimation = ({ onComplete }) => {
  const [jar, setJar]         = useState(generateJar);
  const [estimate, setEstimate] = useState('');
  const [phase, setPhase]     = useState('look');   // look → guess → reveal
  const [stars, setStars]     = useState(0);
  const [errorPct, setErrorPct] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  // Auto-advance look → guess after 2.5 s
  useEffect(() => {
    if (phase !== 'look') return;
    const t = setTimeout(() => setPhase('guess'), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'guess') setTimeout(() => inputRef.current?.focus(), 80);
  }, [phase]);

  const handleSubmit = useCallback(() => {
    const est = parseInt(estimate, 10);
    if (isNaN(est) || est <= 0) return;
    const err = (Math.abs(est - jar.count) / jar.count) * 100;
    setErrorPct(err);
    let s = 0;
    if (err <= 10) s = 3;
    else if (err <= 22) s = 2;
    else if (err <= 40) s = 1;
    setStars(s);
    if (s === 3) sounds.badge();
    else if (s >= 1) sounds.correct();
    else sounds.wrong();
    setPhase('reveal');
    setTimeout(() => setRevealed(true), 350);
  }, [estimate, jar.count]);

  const handlePlayAgain = () => {
    setJar(generateJar());
    setEstimate('');
    setPhase('look');
    setStars(0);
    setRevealed(false);
    setErrorPct(0);
  };

  const accuracyBarWidth = Math.max(4, 100 - Math.min(errorPct, 96));

  return (
    <div className="glass-card" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: '28px 24px' }}>
      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
        🫙 Jar Estimation Challenge
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16, minHeight: 18 }}>
        {phase === 'look'  ? '👀 Study the jar carefully…'
       : phase === 'guess' ? `How many ${jar.type.name} are in the jar?`
       :                     '🔍 Actual count revealed!'}
      </p>

      {/* ── JAR VISUAL ── */}
      <div style={{ position: 'relative', width: 180, height: 260, margin: '0 auto 20px', display: 'inline-block' }}>
        {/* SVG glass jar outline */}
        <svg viewBox="0 0 180 260"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
          {/* Lid */}
          <rect x="44" y="6" width="92" height="20" rx="7"
            fill="rgba(175,185,220,0.70)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
          <rect x="51" y="22" width="78" height="9" rx="3"
            fill="rgba(145,158,205,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          {/* Jar body */}
          <path d="M 54 31 Q 36 50 34 88 L 32 218 Q 32 242 56 244 L 124 244 Q 148 242 148 218 L 146 88 Q 144 50 126 31 Z"
            fill="rgba(180,215,255,0.07)"
            stroke="rgba(210,230,255,0.40)" strokeWidth="2"/>
          {/* Glass highlight left */}
          <path d="M 64 39 Q 52 88 50 158" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M 72 36 Q 66 70 65 104" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Bottom reflection */}
          <ellipse cx="90" cy="237" rx="43" ry="5" fill="rgba(255,255,255,0.05)"/>
          {/* Reveal glow ring */}
          {revealed && (
            <path d="M 54 31 Q 36 50 34 88 L 32 218 Q 32 242 56 244 L 124 244 Q 148 242 148 218 L 146 88 Q 144 50 126 31 Z"
              fill="rgba(255,193,7,0.10)" stroke="rgba(255,193,7,0.70)" strokeWidth="2.5"
              style={{ animation: 'pulse 1s ease' }}/>
          )}
        </svg>

        {/* Objects clipped inside jar body bounds */}
        <div style={{
          position: 'absolute', left: '19%', top: '12%', right: '19%', bottom: '7%',
          overflow: 'hidden', zIndex: 1,
        }}>
          {jar.positions.map((pos, i) => (
            <span
              key={`${jar.count}-${i}`}
              style={{
                position: 'absolute',
                left: `${pos.x}%`, top: `${pos.y}%`,
                transform: `translate(-50%,-50%) scale(${pos.scale}) rotate(${pos.rotate}deg)`,
                fontSize: '1rem', lineHeight: 1,
                display: 'block', userSelect: 'none',
                animation: revealed ? `bounceIn 0.3s ease ${i * 0.016}s backwards` : 'none',
              }}
            >{jar.type.emoji}</span>
          ))}
        </div>
      </div>

      {/* ── LOOK PHASE ── */}
      {phase === 'look' && (
        <p style={{ color: 'var(--gold-light)', fontSize: '0.9rem', animation: 'pulse 1.2s infinite' }}>
          ⏳ Memorise the jar… your turn is coming!
        </p>
      )}

      {/* ── GUESS PHASE ── */}
      {phase === 'guess' && (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          <p style={{ color: 'white', fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
            Enter your estimate for the{' '}
            <strong style={{ color: jar.type.color }}>{jar.type.name}</strong>:
          </p>
          <input
            ref={inputRef}
            type="number"
            min="1" max="300"
            className="sim-number-input"
            value={estimate}
            onChange={e => setEstimate(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && estimate && handleSubmit()}
            placeholder="e.g. 28"
            style={{
              width: 148, height: 60,
              border: '2px solid var(--gold)', borderRadius: 12,
              background: 'rgba(255,193,7,0.08)',
              color: 'var(--gold)', fontFamily: 'var(--font-display)',
              fontSize: '1.8rem', fontWeight: 700, textAlign: 'center',
              outline: 'none', display: 'block', margin: '0 auto 16px',
            }}
          />
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleSubmit}
            disabled={!estimate || parseInt(estimate, 10) <= 0}
          >
            🎯 Lock In My Estimate!
          </button>
        </div>
      )}

      {/* ── REVEAL PHASE ── */}
      {phase === 'reveal' && (
        <div style={{ animation: 'bounceIn 0.5s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Your Guess</div>
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.9rem' }}>{estimate}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Actual Count</div>
              <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.9rem' }}>{jar.count}</div>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 6 }}>
            Error:{' '}
            <strong style={{ color: errorPct <= 10 ? 'var(--green)' : errorPct <= 22 ? 'var(--gold)' : 'var(--red-light)' }}>
              {errorPct.toFixed(1)}%
            </strong>
          </div>

          {/* Accuracy bar */}
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 9, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${accuracyBarWidth}%`,
              background: errorPct <= 10 ? 'var(--green)' : errorPct <= 22 ? 'var(--gold)' : 'var(--red)',
              borderRadius: 6, transition: 'width 1.2s ease',
            }}/>
          </div>

          <StarRating stars={stars} />
          <div style={{ marginTop: 12 }}>
            <ResultBanner stars={stars} messages={{
              0: '🤔 Off the mark! Try grouping objects into clusters.',
              1: '👍 Not bad! Look for repeating patterns to estimate better.',
              2: '🎉 Great estimate! You have a sharp eye.',
              3: '🌟 Incredible accuracy! You\'re a Jar Estimation Expert!',
            }}/>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={handlePlayAgain}>🔄 New Jar</button>
            <button className="btn btn-primary" onClick={() => onComplete(stars)}>
              {stars > 0 ? 'Claim Stars ⭐' : 'Next Challenge →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIMULATION 2 — 🎯 NUMBER LINE TARGET ADVENTURE
// ═══════════════════════════════════════════════════════════════

const NL_LEVELS = [
  { label: '0 – 100',  min: 0, max: 100  },
  { label: '0 – 500',  min: 0, max: 500  },
  { label: '0 – 1000', min: 0, max: 1000 },
];

const NumberLineTarget = ({ onComplete }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [targets] = useState(() =>
    NL_LEVELS.map(l => Math.round(l.min + (0.15 + Math.random() * 0.70) * (l.max - l.min)))
  );
  const [markerValue, setMarkerValue] = useState(
    () => Math.round((NL_LEVELS[0].min + NL_LEVELS[0].max) / 2)
  );
  const [phase, setPhase]           = useState('place'); // place → reveal
  const [levelResults, setLevelResults] = useState([]);

  const level  = NL_LEVELS[levelIdx];
  const target = targets[levelIdx];
  const rangePct = v => ((v - level.min) / (level.max - level.min)) * 100;
  const ticks = Array.from({ length: 5 }, (_, i) =>
    Math.round(level.min + (i / 4) * (level.max - level.min))
  );
  const currentResult = phase === 'reveal' ? levelResults[levelResults.length - 1] : null;

  const handleSubmit = () => {
    const errorPct = (Math.abs(markerValue - target) / (level.max - level.min)) * 100;
    let s = 0;
    if (errorPct <= 4)  s = 3;
    else if (errorPct <= 9)  s = 2;
    else if (errorPct <= 16) s = 1;

    if (s === 3) sounds.badge();
    else if (s >= 1) sounds.correct();
    else sounds.wrong();

    const allResults = [...levelResults, { stars: s, guess: markerValue, target, errorPct }];
    setLevelResults(allResults);
    setPhase('reveal');

    setTimeout(() => {
      if (levelIdx < NL_LEVELS.length - 1) {
        const next = NL_LEVELS[levelIdx + 1];
        setLevelIdx(idx => idx + 1);
        setMarkerValue(Math.round((next.min + next.max) / 2));
        setPhase('place');
      } else {
        const avg = Math.round(allResults.reduce((a, r) => a + r.stars, 0) / allResults.length);
        onComplete(Math.max(avg, allResults.some(r => r.stars >= 1) ? 1 : 0));
      }
    }, 2400);
  };

  return (
    <div className="glass-card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '28px 24px' }}>
      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
        🎯 Number Line Target Adventure
      </h3>

      {/* Level progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        {NL_LEVELS.map((l, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i < levelIdx ? 'var(--green)' : i === levelIdx ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: i < levelIdx ? 'white' : i === levelIdx ? '#1a1a2e' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700,
              boxShadow: i === levelIdx ? '0 0 14px rgba(255,193,7,0.5)' : 'none',
              transition: 'all 0.4s',
            }}>
              {i < levelIdx ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.6rem', color: i === levelIdx ? 'var(--gold)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Target number display */}
      <div style={{
        background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)',
        borderRadius: 12, padding: '10px 20px', display: 'inline-block', marginBottom: 24,
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Place this number on the line:</div>
        <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.2rem', lineHeight: 1.1 }}>{target}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Range: {level.min} to {level.max}</div>
      </div>

      {/* ── NUMBER LINE ── */}
      <div style={{ position: 'relative', padding: '0 8px', marginBottom: 16 }}>
        {/* Track */}
        <div style={{
          position: 'relative', height: 8,
          background: 'rgba(255,255,255,0.13)', borderRadius: 4,
          margin: '40px 0 32px',
        }}>
          {/* Filled track */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 4,
            width: `${rangePct(markerValue)}%`,
            background: 'linear-gradient(90deg, var(--purple-light), var(--gold))',
            transition: 'width 0.05s',
          }}/>

          {/* Tick marks */}
          {ticks.map(tick => (
            <div key={tick} style={{ position: 'absolute', left: `${rangePct(tick)}%`, transform: 'translateX(-50%)', top: -24 }}>
              <div style={{ width: 2, height: 16, background: 'rgba(255,255,255,0.45)', margin: '0 auto', borderRadius: 1 }}/>
              <div style={{ position: 'absolute', top: 19, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                {tick}
              </div>
            </div>
          ))}

          {/* Player's marker */}
          <div style={{
            position: 'absolute',
            left: `${rangePct(markerValue)}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 22, height: 22, borderRadius: '50%',
            background: phase === 'reveal'
              ? (currentResult?.stars >= 2 ? 'var(--green)' : currentResult?.stars === 1 ? 'var(--gold)' : 'var(--red)')
              : 'var(--gold)',
            boxShadow: '0 0 12px rgba(255,193,7,0.70)', zIndex: 3,
            transition: 'background 0.5s',
          }}>
            <div style={{
              position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--gold)', color: '#1a1a2e', borderRadius: 6,
              padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
              border: '1px solid rgba(255,193,7,0.5)',
            }}>
              {markerValue}
            </div>
          </div>

          {/* Correct marker (reveal only) */}
          {phase === 'reveal' && (
            <div style={{
              position: 'absolute',
              left: `${rangePct(target)}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 14px rgba(76,175,80,0.90)', zIndex: 4,
              animation: 'bounceIn 0.4s ease',
            }}>
              <div style={{
                position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--green)', color: 'white', borderRadius: 6,
                padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                ✓ {target}
              </div>
            </div>
          )}
        </div>

        {/* Slider */}
        {phase === 'place' && (
          <input
            type="range"
            min={level.min} max={level.max} step={1}
            value={markerValue}
            onChange={e => setMarkerValue(Number(e.target.value))}
            style={{ width: '100%', marginTop: 4 }}
          />
        )}
      </div>

      {phase === 'place' && (
        <div style={{ animation: 'slideUp 0.3s ease' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>
            Drag the slider to place <strong style={{ color: 'var(--gold)' }}>{target}</strong> on the number line
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
            🎯 Lock In My Position!
          </button>
        </div>
      )}

      {phase === 'reveal' && currentResult && (
        <div style={{ animation: 'bounceIn 0.4s ease' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>
            Error:{' '}
            <strong style={{ color: currentResult.errorPct <= 9 ? 'var(--green)' : currentResult.errorPct <= 16 ? 'var(--gold)' : 'var(--red-light)' }}>
              {currentResult.errorPct.toFixed(1)}% of range
            </strong>
          </div>
          <StarRating stars={currentResult.stars} />
          <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: '0.88rem' }}>
            {levelIdx < NL_LEVELS.length - 1 ? '⏭ Next level loading…' : '🏁 All 3 levels complete!'}
          </p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIMULATION 3 — 🗺️ TREASURE MAP DISTANCE ESTIMATION
// ═══════════════════════════════════════════════════════════════

const CELL     = 40;
const MAP_COLS  = 9;
const MAP_ROWS  = 6;
const DECOR    = ['🌴', '⛰️', '🌊', '🌿', '🦜', '🐚', '🪨', '🐠'];

const generateMap = () => {
  const pirateRow   = Math.floor(Math.random() * MAP_ROWS);
  const pirateCol   = 0;
  const treasureCol = Math.floor(Math.random() * 6) + 3; // col 3–8
  const treasureRow = Math.floor(Math.random() * MAP_ROWS);

  const dx = treasureCol - pirateCol;
  const dy = Math.abs(treasureRow - pirateRow);
  const exactSteps   = Math.round(Math.sqrt(dx * dx + dy * dy) * 10);
  const roundedSteps = Math.max(10, Math.round(exactSteps / 10) * 10);

  // 4 unique MCQ options
  const spreadPool = shuffle([20, 30, 40, 50, -20, -30, -40, 60, -50, 70, -70]);
  const opts = [roundedSteps];
  for (const offset of spreadPool) {
    if (opts.length >= 4) break;
    const candidate = Math.max(10, roundedSteps + offset);
    if (!opts.includes(candidate)) opts.push(candidate);
  }
  let fill = 10;
  while (opts.length < 4) { if (!opts.includes(fill)) opts.push(fill); fill += 10; }

  const decorations = Array.from({ length: 10 }, () => ({
    col:   Math.floor(Math.random() * MAP_COLS),
    row:   Math.floor(Math.random() * MAP_ROWS),
    emoji: DECOR[Math.floor(Math.random() * DECOR.length)],
  })).filter(d =>
    !(d.col === pirateCol   && d.row === pirateRow)   &&
    !(d.col === treasureCol && d.row === treasureRow)
  );

  return { pirateRow, pirateCol, treasureCol, treasureRow, exactSteps, roundedSteps, options: shuffle(opts), decorations };
};

const TreasureMap = ({ onComplete }) => {
  const [map, setMap]           = useState(generateMap);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase]       = useState('guess'); // guess → reveal
  const [stars, setStars]       = useState(0);
  const [piratePos, setPiratePos] = useState({ col: map.pirateCol, row: map.pirateRow });
  const [showPath, setShowPath] = useState(false);

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const error = (Math.abs(opt - map.exactSteps) / Math.max(map.exactSteps, 1)) * 100;
    let s = 0;
    if (error <= 15) s = 3;
    else if (error <= 28) s = 2;
    else if (error <= 45) s = 1;
    setStars(s);
    if (s === 3) sounds.badge();
    else if (s >= 1) sounds.correct();
    else sounds.wrong();
    setPhase('reveal');
    setTimeout(() => setShowPath(true), 300);
    setTimeout(() => setPiratePos({ col: map.treasureCol, row: map.treasureRow }), 500);
  };

  const handlePlayAgain = () => {
    const m = generateMap();
    setMap(m);
    setSelected(null);
    setPhase('guess');
    setStars(0);
    setPiratePos({ col: m.pirateCol, row: m.pirateRow });
    setShowPath(false);
  };

  const px = col => col * CELL + CELL / 2;
  const py = row => row * CELL + CELL / 2;

  return (
    <div className="glass-card" style={{ maxWidth: 500, width: '100%', textAlign: 'center', padding: '28px 20px' }}>
      <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
        🗺️ Treasure Map Distance Estimation
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 14 }}>
        {phase === 'guess'
          ? 'Estimate the distance from the pirate to the treasure'
          : '🏴‍☠️ Avast! The pirate sets sail for the treasure!'}
      </p>

      {/* ── MAP GRID ── */}
      <div style={{
        position: 'relative',
        width: MAP_COLS * CELL, height: MAP_ROWS * CELL,
        margin: '0 auto 12px',
        background: 'linear-gradient(135deg, rgba(18,80,42,0.55), rgba(22,55,95,0.42))',
        border: '2px solid rgba(255,193,7,0.45)',
        borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        {/* Vertical grid lines */}
        {Array.from({ length: MAP_COLS - 1 }, (_, i) => (
          <div key={`v${i}`} style={{ position: 'absolute', left: (i + 1) * CELL, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.07)' }}/>
        ))}
        {/* Horizontal grid lines */}
        {Array.from({ length: MAP_ROWS - 1 }, (_, i) => (
          <div key={`h${i}`} style={{ position: 'absolute', top: (i + 1) * CELL, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
        ))}

        {/* Decorations */}
        {map.decorations.map((d, i) => (
          <div key={i} style={{
            position: 'absolute', left: px(d.col), top: py(d.row),
            transform: 'translate(-50%,-50%)',
            fontSize: '0.9rem', opacity: 0.4, userSelect: 'none', pointerEvents: 'none',
          }}>
            {d.emoji}
          </div>
        ))}

        {/* SVG: dotted path on reveal */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {showPath && (
            <line
              x1={px(map.pirateCol)} y1={py(map.pirateRow)}
              x2={px(map.treasureCol)} y2={py(map.treasureRow)}
              stroke="rgba(255,193,7,0.95)" strokeWidth="2.5"
              strokeDasharray="7 4" strokeLinecap="round"
              style={{ animation: 'fadeIn 0.5s ease' }}
            />
          )}
        </svg>

        {/* Distance label at midpoint */}
        {showPath && (
          <div style={{
            position: 'absolute',
            left: (px(map.pirateCol) + px(map.treasureCol)) / 2,
            top:  (py(map.pirateRow) + py(map.treasureRow)) / 2 - 22,
            transform: 'translate(-50%,-50%)',
            background: 'rgba(255,193,7,0.93)', color: '#1a1a2e',
            borderRadius: 6, padding: '2px 8px',
            fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
            animation: 'bounceIn 0.4s ease 0.3s backwards', zIndex: 4,
          }}>
            {map.roundedSteps} steps
          </div>
        )}

        {/* Treasure */}
        <div style={{
          position: 'absolute',
          left: px(map.treasureCol), top: py(map.treasureRow),
          transform: 'translate(-50%,-50%)',
          fontSize: '1.5rem', zIndex: 2,
          animation: phase === 'reveal' && stars >= 2 ? 'celebrate 0.7s ease' : 'pulse 2.2s infinite',
          filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.7))',
        }}>💎</div>

        {/* Pirate — CSS-transitions to treasure on reveal */}
        <div style={{
          position: 'absolute',
          left: px(piratePos.col), top: py(piratePos.row),
          transform: 'translate(-50%,-50%)',
          fontSize: '1.5rem', zIndex: 3,
          transition: 'left 2s cubic-bezier(0.4,0,0.2,1), top 2s cubic-bezier(0.4,0,0.2,1)',
          filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.6))',
        }}>🏴‍☠️</div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: 14 }}>
        📏 Each grid square = 10 steps &nbsp;|&nbsp; 🏴‍☠️ Pirate → 💎 Treasure
      </p>

      {/* MCQ options */}
      {phase === 'guess' && (
        <div className="options-grid" style={{ animation: 'slideUp 0.4s ease' }}>
          {map.options.map(opt => (
            <button
              key={opt}
              className="option-btn"
              onClick={() => handleSelect(opt)}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}
            >
              ≈ {opt} steps
            </button>
          ))}
        </div>
      )}

      {/* Reveal */}
      {phase === 'reveal' && (
        <div style={{ animation: 'bounceIn 0.5s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Your Estimate</div>
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem' }}>{selected} steps</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>Actual Distance</div>
              <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem' }}>{map.roundedSteps} steps</div>
            </div>
          </div>

          <StarRating stars={stars} />
          <div style={{ marginTop: 12 }}>
            <ResultBanner stars={stars} messages={{
              0: '🤔 The pirate had a long voyage! Count grid squares next time.',
              1: '👍 You were in the right area! Practice counting diagonals.',
              2: '🎉 Excellent navigation! Almost spot-on.',
              3: '🌟 Perfect bearing! You\'re a Master Navigator!',
            }}/>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={handlePlayAgain}>🔄 New Map</button>
            <button className="btn btn-primary" onClick={() => onComplete(stars)}>
              {stars > 0 ? 'Claim Stars ⭐' : 'Next Challenge →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SIMULATIONS HUB + MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

const SIM_CONFIG = [
  {
    id: 'jar',
    name: 'Jar Estimation',
    icon: '🫙',
    desc: 'Count hidden objects inside a mystery jar',
    gradient:    'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
    borderColor: '#9c27b0',
    glowColor:   'rgba(156,39,176,0.28)',
    Component:   JarEstimation,
  },
  {
    id: 'numline',
    name: 'Number Line Target',
    icon: '🎯',
    desc: 'Drag a marker to locate numbers on a line',
    gradient:    'linear-gradient(135deg, #b85c00 0%, #e07800 100%)',
    borderColor: '#ff9800',
    glowColor:   'rgba(255,152,0,0.25)',
    Component:   NumberLineTarget,
  },
  {
    id: 'treasure',
    name: 'Treasure Map',
    icon: '🗺️',
    desc: "Estimate the pirate's distance to the treasure",
    gradient:    'linear-gradient(135deg, #004d40 0%, #00796b 100%)',
    borderColor: '#009688',
    glowColor:   'rgba(0,150,136,0.25)',
    Component:   TreasureMap,
  },
];

export default function SimulationsPhase({ onComplete, audioEnabled }) {
  const [activeSimId, setActiveSimId] = useState(null);
  const [simResults, setSimResults]   = useState({}); // simId → stars (undefined = not attempted)
  const narrationRef = useRef(null);

  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  const handleSimComplete = (simId, stars) => {
    setSimResults(prev => ({ ...prev, [simId]: Math.max(prev[simId] ?? 0, stars) }));
    setActiveSimId(null);
    if (stars >= 3) sounds.badge();
    else if (stars >= 1) sounds.correct();
  };

  const allAttempted = SIM_CONFIG.every(s => simResults[s.id] !== undefined);
  const totalStars   = Object.values(simResults).reduce((a, b) => a + b, 0);

  // Active simulation
  const activeSim = SIM_CONFIG.find(s => s.id === activeSimId);
  if (activeSim) {
    const { Component } = activeSim;
    return (
      <div className="simulate-phase">
        <button
          className="skip-link"
          style={{ alignSelf: 'flex-start', marginBottom: 12 }}
          onClick={() => setActiveSimId(null)}
        >
          ← Back to Simulations Hub
        </button>
        <Component onComplete={stars => handleSimComplete(activeSimId, stars)} />
      </div>
    );
  }

  // Hub screen
  return (
    <div className="simulate-phase">
      {/* Header */}
      <div className="simulate-header">
        <h2 className="simulate-label">🔬 Estimation Simulations</h2>
        <p className="simulate-sublabel">
          {allAttempted
            ? 'All 3 simulations complete — great work! 🎉'
            : `Try all 3 challenges, then continue! (${Object.keys(simResults).length}/3 done)`}
        </p>
      </div>

      {/* Stars summary */}
      {Object.keys(simResults).length > 0 && (
        <div style={{
          display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '10px 28px', marginBottom: 16,
          maxWidth: 480, width: '100%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1 }}>
              {totalStars} / {SIM_CONFIG.length * 3}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>Stars Earned</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.12)' }}/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1 }}>
              {Object.keys(simResults).length} / {SIM_CONFIG.length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>Completed</div>
          </div>
        </div>
      )}

      {/* Simulation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 480 }}>
        {SIM_CONFIG.map((sim, idx) => {
          const result = simResults[sim.id];
          const isDone = result !== undefined;
          return (
            <button
              key={sim.id}
              onClick={() => { sounds.click(); setActiveSimId(sim.id); }}
              style={{
                background:   isDone ? sim.gradient : 'rgba(255,255,255,0.05)',
                border:       `2px solid ${isDone ? sim.borderColor : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 16, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer', textAlign: 'left', color: 'white',
                transition: 'all 0.3s ease',
                boxShadow:  isDone ? `0 4px 24px ${sim.glowColor}` : 'none',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: isDone ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.9rem',
              }}>
                {sim.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 2 }}>
                  {sim.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginBottom: isDone ? 6 : 0 }}>
                  {sim.desc}
                </div>
                {isDone && (
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 3 }, (_, i) => (
                      <span key={i} style={{ fontSize: '1rem', opacity: i < result ? 1 : 0.22, filter: i < result ? 'drop-shadow(0 0 4px gold)' : 'none' }}>⭐</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: isDone ? '1.4rem' : '1.1rem',
                color:    isDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                flexShrink: 0,
              }}>
                {isDone ? '✅' : `${idx + 1}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Proceed button */}
      {allAttempted && (
        <div style={{ marginTop: 28, textAlign: 'center', animation: 'bounceIn 0.6s ease' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
            You earned <strong style={{ color: 'var(--gold)' }}>{totalStars}</strong> out of {SIM_CONFIG.length * 3} stars!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => { sounds.badge(); onComplete(); }}
          >
            Continue to Play Phase 🚀
          </button>
        </div>
      )}
    </div>
  );
}
