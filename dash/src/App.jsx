import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import Board from './components/Board';
import './styles.css';

const emptyBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {
  const [player1Img, setPlayer1Img] = useState(null);
  const [player2Img, setPlayer2Img] = useState(null);
  const [currPlayer, setCurrPlayer] = useState(1);
  const [board, setBoard] = useState(emptyBoard);
  const [gameOver, setGameOver] = useState(false);
   const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  useEffect(() => {
    document.body.className = theme; // apply theme class to <body>
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));


  const handleTileClick = (r, c) => {
    if (board[r][c] || gameOver) return;

    const newBoard = board.map(row => row.slice());
    newBoard[r][c] = currPlayer === 1 ? player1Img : player2Img;
    setBoard(newBoard);
    setCurrPlayer(currPlayer === 1 ? 2 : 1);
    checkWinner(newBoard);
  };

  const checkWinner = (b) => {
    const imgs = [player1Img, player2Img];
    for (let i = 0; i < 2; i++) {
      const p = imgs[i];
      const won = (
        [0,1,2].some(r => b[r].every(cell => cell === p)) ||
        [0,1,2].some(c => b.every(row => row[c] === p)) ||
        [0,1,2].every(i => b[i][i] === p) ||
        [0,1,2].every(i => b[i][2 - i] === p)
      );
      if (won) {
        alert(`Player ${i+1} wins!`);
        setGameOver(true);
        return;
      }
    }
    if (b.flat().every(Boolean)) {
      alert("Draw!");
      setGameOver(true);
    }
  };

  const restart = () => {
    setBoard(emptyBoard);
    setCurrPlayer(1);
    setGameOver(false);
  };

  return (
    <div className="App">
       <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      {!player1Img || !player2Img ? (
        <>
          <ImageUploader onSelectImage={setPlayer1Img} player={1} />
          <ImageUploader onSelectImage={setPlayer2Img} player={2} />
        </>
      ) : (
        <>
          <h2>Player {currPlayer}'s turn</h2>
          <Board board={board} onTileClick={handleTileClick} />
          <button onClick={restart}>Restart</button>
        </>
      )}
    </div>
  );
}

export default App;
