import Tile from './Tile';

const Board = ({ board, onTileClick }) => (
  <div className="board">
    {board.map((row, r) =>
      row.map((cell, c) => (
        <Tile key={`${r}-${c}`} value={cell} onClick={() => onTileClick(r, c)} />
      ))
    )}
  </div>
);

export default Board;
