import React from 'react';
import Tile from './Tile';

const Board = ({ board, onTileClick, winningTiles = [] }) => {
  // Convert winningTiles array to a Set of "r,c" strings for fast lookup
  const winSet = new Set(winningTiles.map(([r, c]) => `${r},${c}`));
  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Tile
            key={`${r}-${c}`}
            value={cell}
            onClick={() => onTileClick(r, c)}
            highlight={winSet.has(`${r},${c}`)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
