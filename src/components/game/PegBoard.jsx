import { useMemo } from 'react';

export function PegBoard({
  player1Score = 0,
  player2Score = 0,
  player1Name = 'Player 1',
  player2Name = 'Player 2',
}) {
  // Generate hole positions in S-shaped pattern
  const holes = useMemo(() => {
    const holePositions = [];
    const rowLength = 30; // holes per row
    const holeSpacing = 12;
    const rowSpacing = 30;
    const rows = 5; // 5 rows for 121+ holes

    for (let i = 0; i <= 121; i++) {
      const row = Math.floor(i / rowLength);
      const col = i % rowLength;

      // Alternate direction for S-shape
      const x = row % 2 === 0
        ? col * holeSpacing + 10
        : (rowLength - col - 1) * holeSpacing + 10;

      const y = row * rowSpacing + 20;

      holePositions.push({ x, y, number: i });
    }

    return holePositions;
  }, []);

  const player1Position = holes[Math.min(player1Score, 121)];
  const player2Position = holes[Math.min(player2Score, 121)];

  const boardStyle = {
    width: '100%',
    maxWidth: '500px',
    height: '120px',
    margin: '16px auto',
    display: 'block',
  };

  return (
    <div>
      <svg
        style={boardStyle}
        viewBox="0 0 400 150"
        className="peg-board"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Draw all holes */}
        {holes.slice(0, 122).map((hole) => (
          <circle
            key={hole.number}
            cx={hole.x}
            cy={hole.y}
            r="3"
            fill="#d4af37"
            stroke="#8B4513"
            strokeWidth="0.5"
            className="peg-board-hole"
          />
        ))}

        {/* Draw pegs */}
        {player1Position && (
          <circle
            cx={player1Position.x}
            cy={player1Position.y}
            r="5"
            fill="#2196F3"
            className="peg peg-player"
          />
        )}

        {player2Position && (
          <circle
            cx={player2Position.x}
            cy={player2Position.y}
            r="5"
            fill="#F44336"
            className="peg peg-opponent"
          />
        )}

        {/* Score labels */}
        <text
          x="10"
          y="140"
          fontSize="14"
          fontWeight="600"
          fill="#212529"
          className="peg-label"
        >
          {player1Name}: {player1Score}
        </text>

        <text
          x="250"
          y="140"
          fontSize="14"
          fontWeight="600"
          fill="#212529"
          className="peg-label"
        >
          {player2Name}: {player2Score}
        </text>

        {/* Finish line at 121 */}
        {holes[121] && (
          <>
            <line
              x1={holes[121].x - 5}
              y1={holes[121].y - 8}
              x2={holes[121].x - 5}
              y2={holes[121].y + 8}
              stroke="#4CAF50"
              strokeWidth="2"
            />
            <text
              x={holes[121].x + 3}
              y={holes[121].y + 4}
              fontSize="10"
              fill="#4CAF50"
              fontWeight="600"
            >
              WIN
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
