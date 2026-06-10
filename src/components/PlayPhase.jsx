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

// Reusing FeedbackOverlay from SimulatePhase logic for consistency
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
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', 'world_complete'
  
  const narrationRef = useRef(null);

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
    // Generate an estimation question
    const num1 = Math.floor(Math.random() * 800) + 100;
    const num2 = Math.floor(Math.random() * 800) + 100;
    const isAddition = Math.random() > 0.5;

    const rounded1 = Math.round(num1 / 100) * 100;
    const rounded2 = Math.round(num2 / 100) * 100;

    let target, text;
    if (isAddition) {
      target = rounded1 + rounded2;
      text = `Estimate the sum: ${num1} + ${num2} (round to nearest 100)`;
    } else {
      // Ensure num1 > num2
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      const rMax = Math.round(max / 100) * 100;
      const rMin = Math.round(min / 100) * 100;
      target = rMax - rMin;
      text = `Estimate the difference: ${max} - ${min} (round to nearest 100)`;
    }

    const distractors = [
      target + 100,
      Math.abs(target - 100),
      target + 200
    ];

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    setQuestion({ text, options, correct: target, exact: target });
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (currentWorld && !feedback) {
      generateQuestion();
    }
  }, [currentWorld, questionIndex, generateQuestion, feedback]);

  const handleAnswer = (opt) => {
    if (feedback) return;
    
    const isCorrect = opt === question.correct;
    if (isCorrect) {
      sounds.correct();
      setScore(s => s + 1);
      setXp(x => x + 10);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
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
      setFeedback(null);
    } else {
      // World complete
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
    setCurrentWorld(null);
    setQuestionIndex(0);
    setScore(0);
    setFeedback(null);
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

  // Inside a world
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
