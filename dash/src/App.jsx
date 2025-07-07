import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import Board from './components/Board';
import './App.css';
import Confetti from 'react-confetti';

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
  const [showConfetti, setShowConfetti] = useState(false);

  // Animation state for board and winner
  const [animateWinner, setAnimateWinner] = useState(false);

  // Track winning tiles
  const [winningTiles, setWinningTiles] = useState([]);

  // Custom mouse state
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Loading state
  const [loading, setLoading] = useState(true);
  // Fade animation state
  const [fade, setFade] = useState('in');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const move = e => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Show loading screen for 1.2s on mount, then fade out
  useEffect(() => {
    const timer = setTimeout(() => setFade('out'), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Remove loading after fade out
  useEffect(() => {
    if (fade === 'out') {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [fade]);

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
    // All possible lines (rows, cols, diags)
    const lines = [
      // Rows
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      // Cols
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      // Diags
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
    ];
    for (let i = 0; i < 2; i++) {
      const p = imgs[i];
      for (const line of lines) {
        if (line.every(([r, c]) => b[r][c] === p)) {
          setGameOver(true);
          setScore((prev) => i === 0
            ? { ...prev, x: prev.x + 1 }
            : { ...prev, o: prev.o + 1 }
          );
          setShowConfetti(true);
          setAnimateWinner(true);
          setWinningTiles(line); // Set winning tiles
          setTimeout(() => {
            alert(`Player ${i+1} wins!`);
            setShowConfetti(false);
            setAnimateWinner(false);
          }, 100);
          return;
        }
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
    setWinningTiles([]); // Reset winning tiles
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#1a232c',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'none',
          opacity: fade === 'in' ? 1 : 0,
          transition: 'opacity 0.4s'
        }}
      >
        {/* Custom Mouse Cursor */}
        <div
          style={{
            position: 'fixed',
            left: mouse.x,
            top: mouse.y,
            width: 32,
            height: 32,
            pointerEvents: 'none',
            zIndex: 10001,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid #2ec4b6',
            background: 'rgba(46,196,182,0.12)',
            boxShadow: '0 2px 8px #2ec4b633',
            transition: 'background 0.15s, border 0.15s',
            mixBlendMode: 'exclusion'
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '5px solid #2ec4b6',
              borderTop: '5px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: 18
            }}
          />
          <div style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1
          }}>
            Loading...
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
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
        fontFamily: 'Inter, Arial, sans-serif',
        transition: 'background 0.5s, opacity 0.4s',
        cursor: 'none',
        opacity: fade === 'in' ? 0 : 1 // Fade in after loading
      }}
    >
      {/* Custom Mouse Cursor */}
      <div
        style={{
          position: 'fixed',
          left: mouse.x,
          top: mouse.y,
          width: 32,
          height: 32,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid #2ec4b6',
          background: 'rgba(46,196,182,0.12)',
          boxShadow: '0 2px 8px #2ec4b633',
          transition: 'background 0.15s, border 0.15s',
          mixBlendMode: 'exclusion'
        }}
      />
      {/* Confetti on win */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={250}
          recycle={false}
        />
      )}

      {/* Logo/Title with animation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
          transform: animateWinner ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)'
        }}
      >
        <span style={{
          fontWeight: 'bold',
          fontSize: 32,
          color: '#2ec4b6',
          letterSpacing: 2,
          transition: 'color 0.3s'
        }}>x</span>
        <span style={{
          fontWeight: 'bold',
          fontSize: 32,
          color: '#ffbe3b',
          letterSpacing: 2,
          transition: 'color 0.3s'
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
            gap: 18,
            animation: 'fadeInUp 0.7s'
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
            margin: '0 auto',
            animation: 'fadeInUp 0.7s'
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
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: animateWinner ? 'winnerPulse 0.7s' : 'fadeInUp 0.7s'
            }}
          >
            <Board board={board} onTileClick={handleTileClick} winningTiles={winningTiles} />
          </div>
          <button
            onClick={restart}
            className="restart-btn"
            aria-label="Restart"
            title="Restart"
            style={{
              animation: 'fadeInUp 0.7s'
            }}
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
        <div
          className="turn-indicator"
          style={{
            animation: 'fadeInUp 0.7s'
          }}
        >
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
        <div
          className="score-bar"
          style={{
            animation: 'fadeInUp 0.7s'
          }}
        >
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

      {/* Animation keyframes */}
      <style>
        {`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes winnerPulse {
          0% { transform: scale(1);}
          30% { transform: scale(1.15);}
          60% { transform: scale(0.95);}
          100% { transform: scale(1);}
        }
        `}
      </style>
    </div>
  );
}

export default App;
