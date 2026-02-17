import { SUIT_SYMBOLS, SUIT_COLORS } from '../../constants/gameConfig.js';

export function Card({
  suit,
  rank,
  faceUp = true,
  selectable = false,
  selected = false,
  onClick = () => {},
  style = {},
  animationDelay = 0,
}) {
  const cardColor = SUIT_COLORS[suit];
  const suitSymbol = SUIT_SYMBOLS[suit];

  const cardStyle = {
    width: '70px',
    height: '98px',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    background: faceUp ? 'white' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: faceUp ? '1px solid #ddd' : '1px solid #5a67d8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: faceUp ? '4px' : '0',
    cursor: selectable ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
    userSelect: 'none',
    animationDelay: `${animationDelay}ms`,
    ...style,
  };

  if (selected) {
    cardStyle.transform = 'translateY(-10px)';
    cardStyle.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.4)';
    cardStyle.border = '2px solid #2196F3';
  }

  const rankStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: cardColor === 'red' ? '#DC143C' : '#1a1a1a',
  };

  const suitStyle = {
    fontSize: '24px',
    color: cardColor === 'red' ? '#DC143C' : '#1a1a1a',
    textAlign: 'center',
  };

  const handleClick = () => {
    if (selectable && !selected) {
      onClick({ suit, rank, id: `${suit}_${rank}` });
    }
  };

  const handleMouseEnter = (e) => {
    if (selectable && !selected) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    if (selectable && !selected) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    }
  };

  if (!faceUp) {
    return (
      <div
        style={cardStyle}
        className="card card-back no-select"
        onClick={handleClick}
      >
        {/* Card back pattern */}
      </div>
    );
  }

  return (
    <div
      style={cardStyle}
      className="card no-select"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={rankStyle}>{rank}</div>
      <div style={suitStyle}>{suitSymbol}</div>
      <div style={{ ...rankStyle, textAlign: 'right', transform: 'rotate(180deg)' }}>
        {rank}
      </div>
    </div>
  );
}
