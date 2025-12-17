import React, { useState, useEffect } from 'react';

// --- LÓGICA FIBA ---
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

  // Lógica FIBA (Puntos detienen reloj en últimos 2 min)
  const addScore = (team: 'HOME' | 'GUEST', points: number) => {
    if (team === 'HOME') setScoreHome(s => Math.max(0, s + points));
    else setScoreGuest(s => Math.max(0, s + points));

    if (points > 0) {
      const isCriticalPeriod = period >= 4; 
      const isLastTwoMinutes = time <= 120000; 
      if (isCriticalPeriod && isLastTwoMinutes) setIsRunning(false);
    }
  };

  // Lógica FIBA (Faltas detienen reloj)
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

  return {
    names: { home: nameHome, setHome: setNameHome, guest: nameGuest, setGuest: setNameGuest },
    time, isRunning, setIsRunning, adjustTime,
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
  const [showClockControls, setShowClockControls] = useState(false); // Estado para mostrar/ocultar panel de ajuste

  const handleClockClick = (e: React.MouseEvent) => {
    // Si toca el panel de ajuste o el botón de toggle, no hacer toggle del play/pause
    if ((e.target as HTMLElement).closest('.clock-adjust-panel') || (e.target as HTMLElement).closest('.clock-edit-toggle')) return;

    if (e.detail === 2) { 
        game.resetClock();
        game.setIsRunning(false);
    } else {
        game.setIsRunning(!game.isRunning);
    }
  };

  return (
    <>
      <div className="hint-text">FIBA MODE ON | DOBLE TOQUE RELOJ = RESET</div>
      
      <div className="scoreboard">
        
        {/* RELOJ TÁCTIL */}
        <div className="clock-section interactive" onClick={handleClockClick}>
          
          {/* Botón discreto para abrir/cerrar controles */}
          <button 
            className="clock-edit-toggle" 
            onClick={() => setShowClockControls(!showClockControls)}
            title="Ajustar Tiempo"
          >
            ⚙️
          </button>

          <div className="clock-digits" style={{ color: game.isRunning ? '#f00' : '#888' }}>
            {formatTime(game.time)}
          </div>
          
          {/* PANEL DE AJUSTE: SOLO VISIBLE SI TOCAS EL ENGRANAJE */}
          {showClockControls && (
            <div className="clock-adjust-panel">
               <button className="adjust-btn" onClick={() => game.adjustTime(60000)}>+1m</button>
               <button className="adjust-btn" onClick={() => game.adjustTime(1000)}>+1s</button>
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
              </div>
              <div className={`bonus-indicator ${game.fouls.home >= 5 ? 'active' : ''}`}>BONUS</div>
            </div>

            <div className="score-wrapper">
                <div className="score-container interactive" onClick={() => game.score.add('HOME', 2)}>
                    <span className="score-digit">{game.score.home}</span>
                </div>
                <div className="score-controls">
                    <button className="mini-btn btn-minus" onClick={() => game.score.add('HOME', -1)}>-1</button>
                    <button className="mini-btn" onClick={() => game.score.add('HOME', 1)}>+1</button>
                    <button className="mini-btn" onClick={() => game.score.add('HOME', 3)}>+3</button>
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
          </div>

          {/* VISITANTE */}
          <div className="team-section">
            <div className="fouls-container">
              <span className="fouls-label">FOULS</span>
              <div className="fouls-row">
                 <button className="mini-btn-foul interactive" onClick={() => game.fouls.add('GUEST', -1)}>-</button>
                 <span className="fouls-digit fouls-guest interactive" onClick={() => game.fouls.add('GUEST', 1)}>{game.fouls.guest}</span>
              </div>
              <div className={`bonus-indicator ${game.fouls.guest >= 5 ? 'active' : ''}`}>BONUS</div>
            </div>

            <div className="score-wrapper">
                <div className="score-container interactive" onClick={() => game.score.add('GUEST', 2)}>
                    <span className="score-digit">{game.score.guest}</span>
                </div>
                <div className="score-controls">
                    <button className="mini-btn btn-minus" onClick={() => game.score.add('GUEST', -1)}>-1</button>
                    <button className="mini-btn" onClick={() => game.score.add('GUEST', 1)}>+1</button>
                    <button className="mini-btn" onClick={() => game.score.add('GUEST', 3)}>+3</button>
                </div>
            </div>

            <input className="team-input interactive" value={game.names.guest} onChange={(e) => game.names.setGuest(e.target.value)} />
          </div>

        </div>
      </div>
    </>
  );
}

export default App;