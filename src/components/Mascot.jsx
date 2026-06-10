const Mascot = ({ state = 'idle', text }) => {
  // state: idle, thinking, happy, celebrate, encourage
  const emoji = {
    idle: '⚡',
    thinking: '🤔',
    happy: '🎉',
    celebrate: '🎊',
    encourage: '💡'
  }[state] || '⚡';

  return (
    <div className="mascot-container">
      <div className={`mascot ${state}`}>{emoji}</div>
      {text && (
        <div className="speech-bubble">
          {text}
        </div>
      )}
    </div>
  );
};

export default Mascot;
