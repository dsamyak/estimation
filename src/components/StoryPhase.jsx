import { useState, useEffect, useRef } from 'react';
import { sounds, narrate, stopNarration } from '../utils/audio';
import {
  storyNarrationP1, storyNarrationP2, storyNarrationP3,
  storyNarrationP4, storyNarrationP5, storyNarrationP6
} from '../utils/narration';

const STORY_PANELS = [
  {
    title: "The Great Market Day Mix-Up",
    text: "John and Sarah are helping at Mike's fruit stall at the Saturday market. It's busy and there's no time to use paper and pencil!\n\nMike needs to know fast: 'I sold 318 mangoes yesterday and 253 today. About how many total?'",
    emoji: "🥭",
    highlight: "318 + 253 = ?",
    narration: storyNarrationP1,
    bgColor: "linear-gradient(135deg, #1e3a8a, #4c1d95)",
    mascotMsg: "About how many? Let's find out!"
  },
  {
    title: "Introducing Rounding",
    text: "Sarah whispers to John: 'Remember what Emma taught us? Round first!'\n\n318 is close to 300. 253 is close to 250.",
    emoji: "📏",
    highlight: "ROUND DOWN ↓",
    narration: storyNarrationP2,
    bgColor: "linear-gradient(135deg, #064e3b, #065f46)",
    mascotMsg: "Use the number line!"
  },
  {
    title: "Estimation in Action",
    text: "'300 + 250 = 550! Mike sold about 550 mangoes total!' 🎉\n\nThe exact answer? 318 + 253 = 571. Their estimate 550 is very close!",
    emoji: "💡",
    highlight: "Estimate: 550 | Exact: 571",
    narration: storyNarrationP3,
    bgColor: "linear-gradient(135deg, #78350f, #9a3412)",
    mascotMsg: "That's the power of estimation!"
  },
  {
    title: "Subtraction Estimation",
    text: "Now Sarah has a problem: John brought 462 flyers. They gave out 179. About how many flyers are LEFT?\n\n'462 rounds to 500. 179 rounds to 200. So... 500 − 200 = 300!'",
    emoji: "📄",
    highlight: "ROUND UP ↑",
    narration: storyNarrationP4,
    bgColor: "linear-gradient(135deg, #1e3a8a, #0369a1)",
    mascotMsg: "Round and subtract!"
  },
  {
    title: "Real Life Check",
    text: "'The exact answer is 462 − 179 = 283. Our estimate was 300. How close is that? Pretty good!'\n\nSarah: 'Estimation isn't about being perfect — it's about being SMART!'",
    emoji: "🌍",
    highlight: "Estimators use this trick everywhere!",
    narration: storyNarrationP5,
    bgColor: "linear-gradient(135deg, #4c1d95, #86198f)",
    mascotMsg: "Smart math for the real world!"
  },
  {
    title: "Summary (CPA Bridge)",
    text: "STEP 1: ROUND each number\nSTEP 2: ADD or SUBTRACT\nSTEP 3: CHECK reasonableness",
    emoji: "✅",
    highlight: "Is 70 close to 71? YES!",
    narration: storyNarrationP6,
    bgColor: "linear-gradient(135deg, #0f766e, #047857)",
    mascotMsg: "You've got the secret! Now let's try it yourself!"
  }
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [panelIdx, setPanelIdx] = useState(0);
  const [animState, setAnimState] = useState('entering'); // entering, idle, flipping
  const narrationRef = useRef(null);

  const panel = STORY_PANELS[panelIdx];

  // Animation and narration sequencer
  useEffect(() => {
    let t1, t2;
    if (animState === 'entering') {
      t1 = setTimeout(() => setAnimState('idle'), 600);
      
      if (audioEnabled) {
        narrationRef.current?.cancel();
        t2 = setTimeout(() => {
          narrationRef.current = narrate(panel.narration(), true);
        }, 800);
      }
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [panelIdx, animState, audioEnabled, panel]);

  const handleNext = () => {
    sounds.click();
    if (panelIdx < STORY_PANELS.length - 1) {
      setAnimState('flipping');
      narrationRef.current?.cancel();
      stopNarration();
      setTimeout(() => {
        setPanelIdx(prev => prev + 1);
        setAnimState('entering');
      }, 300);
    } else {
      narrationRef.current?.cancel();
      stopNarration();
      onComplete();
    }
  };

  const handleSkip = () => {
    sounds.click();
    narrationRef.current?.cancel();
    stopNarration();
    onComplete();
  };

  return (
    <div className="story-phase">
      
      {/* Progress Bar */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div 
            className="story-progress-fill" 
            style={{ width: `${((panelIdx + 1) / STORY_PANELS.length) * 100}%` }}
          />
        </div>
        <div className="story-progress-label">
          {panelIdx + 1} / {STORY_PANELS.length}
        </div>
      </div>

      {/* Main Story Card */}
      <div className={`story-card ${animState === 'flipping' ? 'flipping' : ''}`}>
        
        <div className="story-image-section" style={{ background: panel.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '6rem', transform: animState === 'entering' ? 'scale(0)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            {panel.emoji}
          </div>
          <div className="story-image-overlay" />
        </div>

        <div className="story-text-section">
          <h3 className="story-title">{panel.title}</h3>
          
          <div className={`story-text ${animState === 'idle' ? 'revealed' : ''}`} style={{ whiteSpace: 'pre-wrap' }}>
            {panel.text}
          </div>

          <div className={`story-highlight ${animState === 'idle' ? 'visible' : ''}`}>
            <span className="story-highlight-text">{panel.highlight}</span>
          </div>

          <div className={`story-mascot ${animState === 'idle' ? 'visible' : ''}`} style={{ opacity: animState === 'idle' ? 1 : 0, transition: 'opacity 0.5s ease 0.8s' }}>
            <div className="mascot happy" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>⚡</div>
            <div className="speech-bubble" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              {panel.mascotMsg}
            </div>
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="story-nav">
        <div className="story-dots">
          {STORY_PANELS.map((_, i) => (
            <div 
              key={i} 
              className={`story-dot ${i === panelIdx ? 'active' : ''} ${i < panelIdx ? 'completed' : ''}`} 
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleNext}>
          {panelIdx === STORY_PANELS.length - 1 ? 'Start Sandbox 🚀' : 'Next ➔'}
        </button>
      </div>

      <button className="skip-link" onClick={handleSkip}>
        Skip story
      </button>

    </div>
  );
}
