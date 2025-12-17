import { useState, useEffect } from 'react';

type Period = 1 | 2 | 3 | 4 | 'OT';
type Possession = 'HOME' | 'GUEST' | 'NONE';

export const useGameLogic = () => {
  // --- ESTADO DEL JUEGO ---
  const [time, setTime] = useState(600000); // 10 minutos en ms
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState<Period>(1);
  
  // Marcador y Faltas
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreGuest, setScoreGuest] = useState(0);
  const [foulsHome, setFoulsHome] = useState(0);
  const [foulsGuest, setFoulsGuest] = useState(0);
  
  // Alternabilidad (Flecha de posesión)
  const [possession, setPossession] = useState<Possession>('NONE');

  // --- LÓGICA DEL RELOJ ---
  useEffect(() => {
    let interval: any;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => Math.max(0, prev - 100)); // Resta 100ms
      }, 100);
    } else if (time === 0) {
      setIsRunning(false); // Auto-stop al llegar a cero
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // --- ACCIONES ---

  // Alternabilidad
  const togglePossession = () => {
    setPossession((prev) => {
      if (prev === 'NONE' || prev === 'GUEST') return 'HOME';
      return 'GUEST';
    });
  };

  // Periodos y Reset de Faltas
  const nextPeriod = () => {
    setIsRunning(false);
    if (period === 4) {
      setPeriod('OT');
      setTime(300000); // 5 min prórroga
      // EN OT NO SE RESETEAN FALTAS
    } else {
      setPeriod((prev) => (prev !== 'OT' ? prev + 1 : 'OT') as Period);
      setTime(600000); // 10 min
      // Nuevo cuarto = Faltas a cero
      setFoulsHome(0);
      setFoulsGuest(0);
    }
  };

  return {
    time,
    isRunning,
    setIsRunning,
    period,
    score: { home: scoreHome, guest: scoreGuest },
    setScore: { home: setScoreHome, guest: setScoreGuest },
    fouls: { home: foulsHome, guest: foulsGuest },
    setFouls: { home: setFoulsHome, guest: setFoulsGuest },
    possession,
    togglePossession,
    nextPeriod,
    resetClock: () => setTime(period === 'OT' ? 300000 : 600000)
  };
};