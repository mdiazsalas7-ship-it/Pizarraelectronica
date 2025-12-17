import React, { useState, useEffect } from 'react';

// --- LÓGICA DEL JUEGO ---
const useGameLogic = () => {
  const [nameHome, setNameHome] = useState(() => localStorage.getItem('teamNameHome') || 'HOME');
  const [nameGuest, setNameGuest] = useState(() => localStorage.getItem('teamNameGuest') || 'GUEST');

  const [time, setTime] = useState(600000); 
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState(1);
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreGuest, setScoreGuest] = useState(0);
  const [foulsHome, setFoulsHome] = useState(0);
  const [foulsGuest, setFoulsGuest] = useState(0);
  const [possession, setPossession] = useState('HOME');

  useEffect(() => {
    localStorage.setItem('teamNameHome', nameHome);
    localStorage.setItem('teamNameGuest', nameGuest);
  }, [nameHome, nameGuest]);

  useEffect(() => {
    let interval: any;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => Math.max(0, prev - 100));
      }, 100);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const addScore = (team: 'HOME' | 'GUEST', points: number) => {
    if (team === 'HOME') setScoreHome(s => Math.max(0, s + points));
    else setScoreGuest(s => Math.max(0, s + points));

    if (points > 0) {
      if (period >= 4 && time <= 120000) setIsRunning(false);
    }
  };

  const addFoul = (team: 'HOME' | 'GUEST', delta: number) => {
    if (team === 'HOME') setFoulsHome(f => Math.max(0, f + delta));
    else setFoulsGuest(f => Math.max(0, f + delta));
    if (delta > 0) setIsRunning(false);
  };

  const nextPeriod = () => {
    setIsRunning(false);
    setPeriod((p) => (p < 4 ? p + 1 : 1));
    setTime(600000);
    setFoulsHome(0);
    setFoulsGuest(0);
  };

  const adjustTime = (ms: number) => {
    setTime(prev => Math.max(0, prev + ms));
  };

  const resetMatch = () => {
    if(window.confirm("¿REINICIAR TODO EL PARTIDO A CERO?")) {
        setIsRunning(false);
        setTime(600000);
        setPeriod(1);
        setScoreHome(0); setScoreGuest(0);
        setFoulsHome(0); setFoulsGuest(0);
        setPossession('HOME');
    }
  };

  const setBreakTime = (minutes: number) => {
      setIsRunning(false);
      setTime(minutes * 60 * 1000);
  };

  return {
    names: { home: nameHome, setHome: setNameHome, guest: nameGuest, setGuest: setNameGuest },
    time, isRunning, setIsRunning, adjustTime, setBreakTime, resetMatch,
    period, nextPeriod,
    score: { home: scoreHome, guest: scoreGuest, add: addScore },
    fouls: { home: foulsHome, guest: foulsGuest, add: addFoul },
    possession, 
    togglePossession: () => setPossession(p => p === 'HOME' ? 'GUEST' : 'HOME'),
    resetClock: () => setTime(600000)
  };
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  if (minutes === 0 && totalSeconds < 60) return `${seconds}.${tenths}`;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

function App() {
  const game = useGameLogic();
  const [showClockControls, setShowClockControls] = useState(false);

  const handleClockClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    if (e.detail === 2) { 
        game.resetClock();
        game.setIsRunning(false);
    } else {
        game.setIsRunning(!game.isRunning);
    }
  };

  return (
    <div className="scoreboard">
      
      {/* --- RELOJ --- */}
      <div className="clock-section interactive" onClick={handleClockClick}>
        
        <button 
          className="clock-edit-toggle" 
          onClick={() => setShowClockControls(!showClockControls)}
        >⚙️</button>

        {showClockControls && (
          <div className="side-controls side-left">
             <button className="adjust-btn" onClick={() => game.adjustTime(60000)}>+1m</button>
             <button className="adjust-btn" onClick={() => game.adjustTime(1000)}>+1s</button>
          </div>
        )}

        <div className="clock-digits" style={{ color: game.isRunning ? '#f00' : '#888' }}>
          {formatTime(game.time)}
        </div>
        
        {showClockControls && (
          <div className="side-controls side-right">
             <button className="adjust-btn" onClick={() => game.adjustTime(-1000)}>-1s</button>
             <button className="adjust-btn" onClick={() => game.adjustTime(-60000)}>-1m</button>
          </div>
        )}
      </div>

      <div className="main-section">
        
        {/* LOCAL */}
        <div className="team-section">
          <div className="fouls-container">
            <span className="fouls-label">FOULS</span>
            <div className="fouls-row">
               <button className="mini-btn-foul interactive" onClick={() => game.fouls.add('HOME', -1)}>-</button>
               <span className="fouls-digit fouls-home interactive" onClick={() => game.fouls.add('HOME', 1)}>{game.fouls.home}</span>
               {/* BONUS A LA DERECHA DEL NÚMERO */}
               <div className={`bonus-indicator ${game.fouls.home >= 5 ? 'active' : ''}`}>BONUS</div>
            </div>
          </div>

          <div className="score-wrapper">
              <div className="score-container interactive" onClick={() => game.score.add('HOME', 1)}>
                  <span className="score-digit">{game.score.home}</span>
              </div>
              <div className="score-controls">
                  <button className="mini-btn btn-minus" onClick={() => game.score.add('HOME', -1)}>-1</button>
              </div>
          </div>
          <input className="team-input interactive" value={game.names.home} onChange={(e) => game.names.setHome(e.target.value)} />
        </div>

        {/* CENTRO */}
        <div className="center-section">
          <div className="pos-section interactive" onClick={game.togglePossession}>
            <span className={`pos-arrow ${game.possession === 'HOME' ? 'active' : ''}`}>◄</span>
            <span className="pos-label">POS</span>
            <span className={`pos-arrow ${game.possession === 'GUEST' ? 'active' : ''}`}>►</span>
          </div>
          
          <div className="period-section interactive" onClick={game.nextPeriod}>
            <span className="period-label">PERIOD</span>
            <span className="period-digit">{game.period}</span>
          </div>
          
          <img src="https://i.postimg.cc/sDgyKfr4/nuevo_logo.png" alt="Liga Logo" className="league-logo" />

          <div className="global-controls">
               <button className="game-btn btn-break" onClick={() => game.setBreakTime(2)}>2:00 BREAK</button>
               <button className="game-btn btn-break" onClick={() => game.setBreakTime(5)}>5:00 MITAD</button>
               <button className="game-btn btn-reset" onClick={game.resetMatch}>RESET GAME</button>
          </div>
        </div>

        {/* VISITANTE */}
        <div className="team-section">
          <div className="fouls-container">
            <span className="fouls-label">FOULS</span>
            <div className="fouls-row">
               {/* BONUS A LA IZQUIERDA DEL NÚMERO (Espejo) */}
               <div className={`bonus-indicator ${game.fouls.guest >= 5 ? 'active' : ''}`}>BONUS</div>
               <span className="fouls-digit fouls-guest interactive" onClick={() => game.fouls.add('GUEST', 1)}>{game.fouls.guest}</span>
               <button className="mini-btn-foul interactive" onClick={() => game.fouls.add('GUEST', -1)}>-</button>
            </div>
          </div>

          <div className="score-wrapper">
              <div className="score-container interactive" onClick={() => game.score.add('GUEST', 1)}>
                  <span className="score-digit">{game.score.guest}</span>
              </div>
              <div className="score-controls">
                  <button className="mini-btn btn-minus" onClick={() => game.score.add('GUEST', -1)}>-1</button>
              </div>
          </div>
          <input className="team-input interactive" value={game.names.guest} onChange={(e) => game.names.setGuest(e.target.value)} />
        </div>

      </div>
    </div>
  );
}

export default App;