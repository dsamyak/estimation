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
    image: "/images/story_p1.png",
    highlight: "318 + 253 = ?",
    narration: storyNarrationP1,
    bgColor: "linear-gradient(135deg, #1e3a8a, #4c1d95)",
    mascotMsg: "About how many? Let's find out!"
  },
  {
    title: "Introducing Rounding",
    text: "Sarah whispers to John: 'Remember what Emma taught us? Round first!'\n\n318 is close to 300. 253 is close to 250.\n\nLook at the number line — 318 is closer to 300 than to 350. So we round DOWN!",
    image: "/images/story_p2.png",
    highlight: "ROUND DOWN ↓",
    narration: storyNarrationP2,
    bgColor: "linear-gradient(135deg, #064e3b, #065f46)",
    mascotMsg: "Use the number line!"
  },
  {
    title: "Estimation in Action",
    text: "'300 + 250 = 550! Mike sold about 550 mangoes total!' 🎉\n\nThe exact answer? 318 + 253 = 571. Their estimate 550 is very close!",
    image: "/images/story_p3.png",
    highlight: "Estimate: 550 | Exact: 571 | Difference: only 21!",
    narration: storyNarrationP3,
    bgColor: "linear-gradient(135deg, #78350f, #9a3412)",
    mascotMsg: "That's the power of estimation!"
  },
  {
    title: "Subtraction Estimation",
    text: "Now Sarah has a problem: John brought 462 flyers. They gave out 179. About how many flyers are LEFT?\n\n'462 rounds to 500. 179 rounds to 200. So... 500 − 200 = 300!'",
    image: "/images/story_p4.png",
    highlight: "ROUND UP ↑  |  ESTIMATE DIFFERENCE",
    narration: storyNarrationP4,
    bgColor: "linear-gradient(135deg, #1e3a8a, #0369a1)",
    mascotMsg: "Round and subtract!"
  },
  {
    title: "Real Life Check",
    text: "'The exact answer is 462 − 179 = 283. Our estimate was 300. How close is that? Pretty good!'\n\nSarah: 'Estimation isn't about being perfect — it's about being SMART!'\n\nEstimators use this trick everywhere — in markets, airports, classrooms, and kitchens all over the world!",
    image: "/images/story_p5.png",
    highlight: "Estimation = Being SMART, not perfect!",
    narration: storyNarrationP5,
    bgColor: "linear-gradient(135deg, #4c1d95, #86198f)",
    mascotMsg: "Smart math for the real world!"
  },
  {
    title: "The 3-Step Secret",
    text: "STEP 1: ROUND each number  →  48 ≈ 50,  23 ≈ 20\nSTEP 2: ADD or SUBTRACT      →  50 + 20 = 70\nSTEP 3: CHECK reasonableness  →  Is 70 close to 71? YES! ✅",
    image: "/images/story_p6.png",
    highlight: "Round → Operate → Check ✅",
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
        
        <div className="story-image-section" style={{ background: panel.bgColor, position: 'relative', overflow: 'hidden' }}>
          <img 
            src={panel.image}
            alt={panel.title}
            className="story-image"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: animState === 'entering' ? 0 : 1,
              transform: animState === 'entering' ? 'scale(1.1)' : 'scale(1)',
              transition: 'opacity 0.8s ease, transform 0.8s ease'
            }}
          />
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
