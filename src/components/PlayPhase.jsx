import { useState, useEffect, useRef, useCallback } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import { playIntroNarration } from '../utils/narration';

const WORLDS = [
  { id: 1, name: "School Supplies", icon: "✏️", unlocked: true },
  { id: 2, name: "Fruit Market", icon: "🍎", unlocked: false },
  { id: 3, name: "Train Journey", icon: "🚂", unlocked: false },
  { id: 4, name: "Beach Day", icon: "🏖️", unlocked: false },
  { id: 5, name: "Art Class", icon: "🎨", unlocked: false },
  { id: 6, name: "Sports Stadium", icon: "🏟️", unlocked: false },
  { id: 7, name: "World Travel", icon: "🌍", unlocked: false },
  { id: 8, name: "Pizza Party", icon: "🍕", unlocked: false },
  { id: 9, name: "Space Mission", icon: "🚀", unlocked: false },
  { id: 10, name: "Grand Finale", icon: "🎉", unlocked: false },
];

const CHARACTERS = ["John", "Sarah", "Mike", "Emma", "Arjun", "Lena", "Sofia", "Tomás", "Mei", "Priya"];

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

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [worlds, setWorlds] = useState(WORLDS);
  const [currentWorld, setCurrentWorld] = useState(null);
  
  // Stats
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  
  // Game state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  
  // Input for FILL_BLANK
  const [inputValue, setInputValue] = useState('');

  const narrationRef = useRef(null);
  const lastChar = useRef('');
  const lastType = useRef(-1);

  // Keep track of which question types we've shown in this world to ensure all 10 types appear
  const [worldTypes, setWorldTypes] = useState([0,1,2,3,4,5,6,7,8,9]);

  useEffect(() => {
    if (audioEnabled && !currentWorld && xp === 0) {
      narrationRef.current = narrate(playIntroNarration(), true);
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [audioEnabled, currentWorld, xp]);

  const generateQuestion = useCallback(() => {
    if (worldTypes.length === 0) return;
    
    // Pick a random type from the remaining types for this world
    const typeIndex = Math.floor(Math.random() * worldTypes.length);
    const qTypeIndex = worldTypes[typeIndex];
    
    // Remove the chosen type from the pool
    setWorldTypes(prev => prev.filter((_, i) => i !== typeIndex));

    const types = ['R10', 'R100', 'SUM_MCQ', 'DIFF_MCQ', 'SUM_FILL', 'DIFF_FILL', 'WP_ADD', 'WP_SUB', 'REASON', 'OVER_UNDER'];
    const qType = types[qTypeIndex];

    let char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    if (lastChar.current === char) {
      char = CHARACTERS[(CHARACTERS.indexOf(char) + 1) % CHARACTERS.length];
    }
    lastChar.current = char;

    let q = {};
    const n1_3d = Math.floor(Math.random() * 800) + 100;
    const n2_3d = Math.floor(Math.random() * 800) + 100;
    const n1_2d = Math.floor(Math.random() * 80) + 10;
    const n2_2d = Math.floor(Math.random() * 80) + 10;

    if (qType === 'R10') {
      const num = n1_3d;
      const target = Math.round(num / 10) * 10;
      q = {
        format: 'MCQ',
        text: `${char} has ${num} items. Round ${num} to the nearest 10.`,
        correct: target,
        options: Array.from(new Set([target, target - 10, target + 10, target + 20])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'R100') {
      const num = n1_3d;
      const target = Math.round(num / 100) * 100;
      q = {
        format: 'MCQ',
        text: `Round ${num} to the nearest 100.`,
        correct: target,
        options: Array.from(new Set([target, target - 100, target + 100, target + 200])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'SUM_MCQ') {
      const target = Math.round(n1_3d/10)*10 + Math.round(n2_3d/10)*10;
      q = {
        format: 'MCQ',
        text: `Estimate the sum of ${n1_3d} + ${n2_3d} (round to nearest 10).`,
        correct: target,
        options: Array.from(new Set([target, target - 10, target + 10, target + 20])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'DIFF_MCQ') {
      const max = Math.max(n1_3d, n2_3d);
      const min = Math.min(n1_3d, n2_3d);
      const target = Math.round(max/100)*100 - Math.round(min/100)*100;
      q = {
        format: 'MCQ',
        text: `Estimate the difference: ${max} - ${min} (round to nearest 100).`,
        correct: target,
        options: Array.from(new Set([target, target - 100, target + 100, Math.abs(target - 200)])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'SUM_FILL') {
      const target = Math.round(n1_2d/10)*10 + Math.round(n2_2d/10)*10;
      q = {
        format: 'FILL_BLANK',
        text: `Estimate the sum (nearest 10): ${n1_2d} + ${n2_2d} ≈ ?`,
        correct: target,
      };
    } else if (qType === 'DIFF_FILL') {
      const max = Math.max(n1_2d, n2_2d);
      const min = Math.min(n1_2d, n2_2d);
      const target = Math.round(max/10)*10 - Math.round(min/10)*10;
      q = {
        format: 'FILL_BLANK',
        text: `Estimate the difference (nearest 10): ${max} - ${min} ≈ ?`,
        correct: target,
      };
    } else if (qType === 'WP_ADD') {
      const target = Math.round(n1_3d/100)*100 + Math.round(n2_3d/100)*100;
      q = {
        format: 'MCQ',
        text: `${char} read ${n1_3d} pages in June and ${n2_3d} pages in July. About how many pages did they read in both months?`,
        correct: target,
        options: Array.from(new Set([target, target - 100, target + 100, target + 200])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'WP_SUB') {
      const max = Math.max(n1_3d, n2_3d);
      const min = Math.min(n1_3d, n2_3d);
      const target = Math.round(max/10)*10 - Math.round(min/10)*10;
      q = {
        format: 'MCQ',
        text: `${char} has ${max} coins and spends ${min}. About how many coins are left?`,
        correct: target,
        options: Array.from(new Set([target, target - 10, target + 10, Math.abs(target - 20)])).sort(()=>Math.random()-0.5).slice(0, 4)
      };
    } else if (qType === 'REASON') {
      const target = Math.round(n1_3d/100)*100 + Math.round(n2_3d/100)*100;
      const isReasonable = Math.random() > 0.5;
      const displayedEstimate = isReasonable ? target : target + 200;
      q = {
        format: 'YES_NO',
        text: `${char} estimated ${n1_3d} + ${n2_3d} ≈ ${displayedEstimate}. Is this reasonable?`,
        correct: isReasonable ? 'YES' : 'NO'
      };
    } else if (qType === 'OVER_UNDER') {
      const num1 = n1_2d;
      const num2 = n2_2d;
      const r1 = Math.round(num1/10)*10;
      const r2 = Math.round(num2/10)*10;
      const exact = num1 + num2;
      const est = r1 + r2;
      let type = est > exact ? 'OVERESTIMATE' : (est < exact ? 'UNDERESTIMATE' : 'EXACT');
      
      if (type === 'EXACT') {
        type = 'OVERESTIMATE';
      }
      
      q = {
        format: 'OVER_UNDER',
        text: `${char} estimated ${num1} + ${num2} ≈ ${est + (type==='EXACT'?10:0)}. Is this an overestimate or underestimate?`,
        correct: type,
        options: ['OVERESTIMATE', 'UNDERESTIMATE']
      };
    }

    setQuestion(q);
    setInputValue('');
    setFeedback(null);
  }, [worldTypes]);

  useEffect(() => {
    if (currentWorld && !feedback && !question) {
      generateQuestion();
    }
  }, [currentWorld, questionIndex, generateQuestion, feedback, question]);

  const handleAnswer = (val) => {
    if (feedback) return;
    
    // Allow case-insensitive or numeric checks
    const isCorrect = String(val).trim().toUpperCase() === String(question.correct).trim().toUpperCase();
    
    if (isCorrect) {
      sounds.correct();
      setScore(s => s + 1);
      setXp(x => x + 10);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        if (newStreak === 10 && !badges.includes('Streak Champion')) setBadges(b => [...b, 'Streak Champion']);
        if (newStreak % 5 === 0) sounds.streak();
        return newStreak;
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
      let stars = 0;
      if (score >= 6) stars = 1;
      if (score >= 8) stars = 2;
      if (score === 10) stars = 3;

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
    if (currentWorld.id === 10 && score >= 6) {
      if (!badges.includes('Estimation Master')) setBadges(b => [...b, 'Estimation Master']);
    }
    
    const threeStarCount = worlds.filter(w => w.stars === 3).length + (score === 10 ? 1 : 0);
    if (threeStarCount >= 5 && !badges.includes('3-Star Superstar')) setBadges(b => [...b, '3-Star Superstar']);
    
    if (currentWorld.id === 10 && !badges.includes('Global Estimator')) setBadges(b => [...b, 'Global Estimator']);

    setCurrentWorld(null);
    setQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setQuestion(null);
    setWorldTypes([0,1,2,3,4,5,6,7,8,9]); // Reset types for the next world
  };

  const handleFinish = () => {
    sounds.click();
    onComplete({
      xp,
      bestStreak,
      completedWorlds: worlds.filter(w => w.score !== undefined).length,
      totalStars: worlds.reduce((acc, w) => acc + (w.stars || 0), 0),
      badges
    });
  };

  const allDone = worlds.every(w => w.score !== undefined && w.score >= 6);

  if (!currentWorld) {
    return (
      <div className="play-phase" style={{ height: '100%', overflowY: 'auto' }}>
        <div className="play-header">
          <h2 className="play-title text-gold" style={{textShadow: '0 0 10px rgba(255,193,7,0.5)'}}>IntelliPlay™</h2>
          <p className="play-subtitle">Select a world to start</p>
          <div className="play-xp-badge">
            ⚡ XP: {xp} | 🔥 Streak: {streak}
          </div>
        </div>

        <div className="world-map">
          {worlds.map(w => (
            <div 
              key={w.id} 
              className={`world-card ${w.unlocked ? 'unlocked' : 'locked'} ${w.score !== undefined ? 'completed' : ''}`}
              onClick={() => w.unlocked && setCurrentWorld(w)}
              style={{ '--world-color': 'var(--purple-light)' }}
            >
              <div className="world-icon">{w.icon}</div>
              <div className="world-name">{w.name}</div>
              {w.score !== undefined && (
                <div className="world-stars mt-2">
                  {'⭐'.repeat(w.stars)}{'☆'.repeat(3 - w.stars)}
                  <div className="text-sm opacity-80 mt-1">({w.score}/10)</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allDone && (
          <div className="text-center mt-6 mb-6">
            <button className="btn btn-green" onClick={handleFinish}>Proceed to Reflection ➔</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="play-phase" style={{justifyContent: 'center'}}>
      <div className="play-world-badge" style={{background: 'var(--purple-light)', marginBottom: '1rem'}}>
        {currentWorld.icon} {currentWorld.name} — Q{questionIndex + 1}/10
      </div>

      <div className="play-progress-bar" style={{ width: '100%', maxWidth: '400px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '2rem' }}>
        <div style={{ width: `${(questionIndex / 10) * 100}%`, height: '100%', background: 'var(--gold)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>

      {question && !feedback && (
        <div className="glass-card max-w-md w-full text-center" style={{ animation: 'bounceIn 0.4s ease' }}>
          <h3 className="text-white text-xl mb-6 font-bold">{question.text}</h3>
          
          {question.format === 'MCQ' && (
            <div className="options-grid">
              {question.options.map(opt => (
                <button 
                  key={opt}
                  className="option-btn"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.format === 'YES_NO' && (
            <div className="options-grid">
              <button className="option-btn" onClick={() => handleAnswer('YES')}>YES</button>
              <button className="option-btn" onClick={() => handleAnswer('NO')}>NO</button>
            </div>
          )}

          {question.format === 'OVER_UNDER' && (
            <div className="options-grid">
              {question.options.map(opt => (
                <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)} style={{fontSize: '1rem'}}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.format === 'FILL_BLANK' && (
            <div className="flex flex-col items-center gap-4">
              <input 
                type="number"
                className="blank-input text-center text-white"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{width: '120px', height: '60px', fontSize: '2rem'}}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue !== '') handleAnswer(inputValue);
                }}
              />
              <button 
                className="btn btn-primary mt-2" 
                onClick={() => handleAnswer(inputValue)}
                disabled={inputValue === ''}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}

      {feedback === 'correct' && (
        <FeedbackOverlay 
          isCorrect={true}
          message="Awesome!"
          subMessage="You made a smart estimate!"
          onContinue={nextQuestion}
        />
      )}

      {feedback === 'wrong' && (
        <FeedbackOverlay 
          isCorrect={false}
          message="Not quite!"
          subMessage={`The correct estimate was ${question.correct}.`}
          onContinue={nextQuestion}
        />
      )}

      {feedback === 'world_complete' && (
        <div className="world-complete-card glass-card text-center" style={{ animation: 'bounceIn 0.5s ease' }}>
          <h2 className="text-gold text-3xl font-bold mb-2">World Complete!</h2>
          <div className="text-5xl mb-4">{currentWorld.icon}</div>
          <p className="text-xl mb-4">You scored <strong className="text-white">{score}/10</strong></p>
          <div className="text-2xl text-gold mb-6 tracking-widest">
            {'⭐'.repeat(score >= 10 ? 3 : score >= 8 ? 2 : score >= 6 ? 1 : 0)}
          </div>
          <button className="btn btn-primary" onClick={closeWorld}>Back to Map</button>
        </div>
      )}
    </div>
  );
}
