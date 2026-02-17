import { Card } from './Card.jsx';

export function PlayArea({
  playedCards = [],
  currentCount = 0,
  lastPoints = 0,
  showCount = true,
}) {
  const containerStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const countStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '16px',
  };

  const cardsContainerStyle = {
    display: 'flex',
    gap: '-30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
  };

  const pointsPopupStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#4CAF50',
    animation: 'score-popup 1.5s ease-out forwards',
  };

  return (
    <div style={containerStyle} className="play-area">
      {showCount && (
        <div style={countStyle} className="count-display">
          Count: {currentCount}
        </div>
      )}

      {lastPoints > 0 && (
        <div style={pointsPopupStyle} className="points-popup">
          +{lastPoints}
        </div>
      )}

      <div style={cardsContainerStyle} className="play-area-cards">
        {playedCards.length === 0 ? (
          <div style={{ color: '#6c757d', fontSize: '16px' }}>
            No cards played yet
          </div>
        ) : (
          playedCards.map((cardData, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                marginLeft: index > 0 ? '-30px' : '0',
                zIndex: index,
              }}
            >
              <Card
                suit={cardData.card?.suit || cardData.suit}
                rank={cardData.card?.rank || cardData.rank}
                faceUp={true}
                selectable={false}
              />
              {cardData.player && (
                <div
                  style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    marginTop: '4px',
                    color: '#6c757d',
                  }}
                >
                  {cardData.player}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {playedCards.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: '#6c757d',
          }}
        >
          {playedCards.length} card{playedCards.length !== 1 ? 's' : ''} played
        </div>
      )}
    </div>
  );
}
