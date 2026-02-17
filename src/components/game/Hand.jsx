import { Card } from './Card.jsx';

export function Hand({
  cards = [],
  faceUp = true,
  selectable = false,
  selectedCards = [],
  onCardSelect = () => {},
  maxSelection = null,
  label = '',
}) {
  const isCardSelected = (card) => {
    return selectedCards.some(
      (selected) => selected.suit === card.suit && selected.rank === card.rank
    );
  };

  const handleCardClick = (card) => {
    if (!selectable) return;

    const alreadySelected = isCardSelected(card);

    if (alreadySelected) {
      // Deselect
      const newSelection = selectedCards.filter(
        (selected) => !(selected.suit === card.suit && selected.rank === card.rank)
      );
      onCardSelect(newSelection);
    } else {
      // Select (if under max limit)
      if (maxSelection === null || selectedCards.length < maxSelection) {
        onCardSelect([...selectedCards, card]);
      }
    }
  };

  const handStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: '16px',
    flexWrap: 'wrap',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: '8px',
    textAlign: 'center',
  };

  return (
    <div>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={handStyle} className="hand">
        {cards.map((card, index) => (
          <Card
            key={`${card.suit}_${card.rank}_${index}`}
            suit={card.suit}
            rank={card.rank}
            faceUp={faceUp}
            selectable={selectable && faceUp}
            selected={isCardSelected(card)}
            onClick={() => handleCardClick(card)}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}
