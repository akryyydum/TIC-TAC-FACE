import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import Board from './components/Board';
import './App.css';

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
  const [theme, setTheme] = useState('dark');
  const [score, setScore] = useState({ x: 0, o: 0, tie: 0 });
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [namesSubmitted, setNamesSubmitted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
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
        setGameOver(true);
        setScore((prev) => i === 0
          ? { ...prev, x: prev.x + 1 }
          : { ...prev, o: prev.o + 1 }
        );
        setTimeout(() => alert(`Player ${i+1} wins!`), 100);
        return;
      }
    }
    if (b.flat().every(Boolean)) {
      setGameOver(true);
      setScore((prev) => ({ ...prev, tie: prev.tie + 1 }));
      setTimeout(() => alert("Draw!"), 100);
    }
  };

  const restart = () => {
    setBoard(emptyBoard);
    setCurrPlayer(1);
    setGameOver(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a232c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 8px',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* Logo/Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{
          fontWeight: 'bold',
          fontSize: 32,
          color: '#2ec4b6',
          letterSpacing: 2
        }}>x</span>
        <span style={{
          fontWeight: 'bold',
          fontSize: 32,
          color: '#ffbe3b',
          letterSpacing: 2
        }}>o</span>
      </div>

      {/* Player Name Inputs */}
      {!namesSubmitted && (
        <form
          onSubmit={e => {
            e.preventDefault();
            setNamesSubmitted(true);
          }}
          style={{
            background: '#222e39',
            borderRadius: 18,
            boxShadow: '0 2px 12px #0003',
            padding: '28px 18px 22px 18px',
            width: '100%',
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto 28px auto',
            gap: 18
          }}
        >
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Enter Player Names</div>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1Name}
            onChange={e => setPlayer1Name(e.target.value)}
            required
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #2ec4b6',
              marginBottom: 10,
              width: '100%',
              fontSize: 16,
              color: '#fff',           // Make input text white
              background: '#222e39',   // Match card background
            }}
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2Name}
            onChange={e => setPlayer2Name(e.target.value)}
            required
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #ffbe3b',
              marginBottom: 10,
              width: '100%',
              fontSize: 16,
              color: '#fff',           // Make input text white
              background: '#222e39',   // Match card background
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2ec4b6',
              color: '#1a232c',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Continue
          </button>
        </form>
      )}

      {/* Uploaders or Board */}
      {namesSubmitted && (!player1Img || !player2Img) ? (
        <div
          className="space-y-6 w-full max-w-md"
          style={{
            width: '100%',
            maxWidth: 400,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          {[1, 2].map((player) => (
            <div
              key={player}
              style={{
                background: '#222e39',
                borderRadius: 18,
                boxShadow: '0 2px 12px #0003',
                padding: '28px 18px 22px 18px',
                width: '100%',
                maxWidth: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 auto'
              }}
            >
              <div style={{
                fontWeight: 700,
                fontSize: 22,
                color: player === 1 ? '#2ec4b6' : '#ffbe3b',
                marginBottom: 4,
                letterSpacing: 1,
                textAlign: 'center',
                width: '100%',
                wordBreak: 'break-word'
              }}>
                {player === 1 ? (player1Name || 'Player 1') : (player2Name || 'Player 2')}
              </div>
              <div style={{
                color: '#fff',
                fontSize: 16,
                marginBottom: 12,
                opacity: 0.85,
                fontWeight: 600,
                textAlign: 'center',
                width: '100%'
              }}>
                Upload or Capture your face
              </div>
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ImageUploader onSelectImage={player === 1 ? setPlayer1Img : setPlayer2Img} player={player} />
              </div>
            </div>
          ))}
        </div>
      ) : namesSubmitted ? (
        <>
          <Board board={board} onTileClick={handleTileClick} />
          <button
            onClick={restart}
            className="restart-btn"
            aria-label="Restart"
            title="Restart"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" style={{ verticalAlign: 'middle', marginRight: 6 }}>
              <path d="M11 2v2.5a6.5 6.5 0 1 1-6.5 6.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <polyline points="4 7 11 2 11 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            </svg>
            Restart
          </button>
        </>
      ) : null}

      {/* Turn Indicator */}
      {namesSubmitted && player1Img && player2Img && (
        <div className="turn-indicator">
          <span style={{
            color: currPlayer === 1 ? '#2ec4b6' : '#ffbe3b',
            fontWeight: 'bold',
            fontSize: 20,
            marginRight: 8
          }}>
            {currPlayer === 1 ? (player1Name || 'X') : (player2Name || 'O')}
          </span>
          TURN
        </div>
      )}

      {/* Score Bar */}
      {namesSubmitted && player1Img && player2Img && (
        <div className="score-bar">
          <div className="score-box score-x">
            {(player1Name || 'X').toUpperCase()}
            <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 2 }}>{score.x}</div>
          </div>
          <div className="score-box score-tie">
            TIES
            <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 2 }}>{score.tie}</div>
          </div>
          <div className="score-box score-o">
            {(player2Name || 'O').toUpperCase()}
            <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 2 }}>{score.o}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
