import { useState, useEffect } from "react";
import React from "react";

const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap";
document.head.appendChild(fl);

const ds = document.createElement("style");
ds.textContent = `@import url('https://cdn.jsdelivr.net/npm/dseg@0.46.0/css/dseg.css');`;
document.head.appendChild(ds);

const css = document.createElement("style");
css.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; overflow: hidden; }

  :root {
    --yellow: #FFE000;
    --white:  #FFFFFF;
    --dim-y:  #2a2400;
    --dim-w:  #151515;
    --red:    #FF2020;
    --dim-r:  #280000;
    --blue:   #3399FF;
  }

  /* ─── DSEG sin italic ─── */
  .seg {
    font-family: 'DSEG7 Classic', monospace;
    font-style: normal !important;
    font-weight: 700;
  }

  .sb {
    font-family: 'Barlow Condensed', sans-serif;
    background: #000;
    width: 100vw; height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    user-select: none;
  }

  /* ══════════════════════════
     PANTALLA DE CALENTAMIENTO
  ══════════════════════════ */
  .warmup-screen {
    width: 100vw; height: 100vh;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 4vh;
    user-select: none;
  }

  .warmup-logo-frame {
    width: 22vw;
    height: 22vw;
    border: 3px solid #FFE000;
    border-radius: 12px;
    box-shadow:
      0 0 0 1px #2a2400,
      0 0 30px #FFE00033,
      inset 0 0 20px #00000088;
    background: #0a0a00;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5vw;
    position: relative;
    overflow: hidden;
  }
  /* esquinas decorativas */
  .warmup-logo-frame::before,
  .warmup-logo-frame::after {
    content: '';
    position: absolute;
    width: 2.5vw; height: 2.5vw;
    border-color: #FFE000;
    border-style: solid;
  }
  .warmup-logo-frame::before {
    top: -3px; left: -3px;
    border-width: 4px 0 0 4px;
    border-radius: 10px 0 0 0;
  }
  .warmup-logo-frame::after {
    bottom: -3px; right: -3px;
    border-width: 0 4px 4px 0;
    border-radius: 0 0 10px 0;
  }
  .warmup-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .warmup-clock-wrap {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .warmup-bg {
    font-size: 22vw; line-height: 1;
    color: var(--dim-y);
    position: absolute; top: 0; left: 0; right: 0;
    text-align: center; pointer-events: none;
  }
  .warmup-digits {
    font-size: 22vw; line-height: 1;
    position: relative; text-align: center;
    transition: color .12s;
    min-width: 50vw;
  }
  .warmup-run  { color: var(--yellow); }
  .warmup-stop { color: #555; }

  .warmup-hint {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 1.6vw;
    letter-spacing: .2em; color: #333; text-transform: uppercase;
    text-align: center;
  }

  .warmup-actions {
    display: flex; gap: 2vw; margin-top: 1vh;
  }
  .warmup-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 1.6vw; letter-spacing: .1em;
    padding: .7vh 2.5vw; border-radius: 8px; border: none;
    cursor: pointer; transition: filter .15s;
  }
  .warmup-btn:hover { filter: brightness(1.25); }
  .btn-start-game { background: #00441a; color: #00FF41; border: 1px solid #005522; }
  .btn-reset-warmup { background: #1a1a00; color: #888; border: 1px solid #2a2a00; }

  /* ══════════════════════════
     SCOREBOARD PRINCIPAL
  ══════════════════════════ */
  .top-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 1.2vh 2.5vw 0;
    gap: 1vw;
  }

  .foul-block { display: flex; flex-direction: column; align-items: flex-start; gap: .4vh; }
  .foul-block.right { align-items: flex-end; }
  .foul-lbl { font-weight: 900; font-size: 1.8vw; letter-spacing: .18em; color: #444; }
  .foul-row { display: flex; align-items: center; gap: .7vw; }
  .foul-minus {
    font-size: 1.7vw; font-weight: 700; padding: .2vh .6vw;
    background: #0a0a0a; color: #333;
    border: 1px solid #1a1a1a; border-radius: 4px; cursor: pointer;
  }
  .foul-minus:hover { color: var(--blue); }

  .foul-seg-wrap { position: relative; }
  .foul-seg-bg {
    font-size: 5vw; line-height: 1; color: var(--dim-w);
    position: absolute; top: 0; left: 0; right: 0;
    text-align: center; pointer-events: none;
  }
  .foul-seg {
    font-size: 5vw; line-height: 1; color: var(--blue);
    position: relative; text-align: center;
    cursor: pointer; min-width: 4.5vw;
  }
  .foul-seg.bonus-on { color: #FF6600; }
  .bonus-tag {
    font-size: 1.05vw; font-weight: 900; letter-spacing: .1em;
    padding: .15vh .5vw; border-radius: 3px;
    border: 2px solid transparent; color: transparent; transition: all .2s;
  }
  .bonus-tag.on { border-color: #FF6600; color: #FF6600; background: #FF660012; }

  /* reloj */
  .clock-center {
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; position: relative;
  }
  .clock-seg-wrap { position: relative; display: inline-block; }
  .clock-bg { font-size: 12vw; line-height: 1; position: absolute; top: 0; left: 0; right: 0; text-align: center; pointer-events: none; }
  .clock-bg.ydim { color: var(--dim-y); }
  .clock-bg.rdim { color: var(--dim-r); }
  .clock-seg { font-size: 12vw; line-height: 1; position: relative; text-align: center; transition: color .12s; }
  .clock-stop { color: var(--yellow); }
  .clock-run  { color: var(--red); }

  .period-row {
    display: flex; align-items: center; gap: .8vw; margin-top: .3vh;
    cursor: pointer;
  }
  .pdot { width: 1.4vw; height: 1.4vw; border-radius: 50%; background: #1a1a1a; transition: background .2s; }
  .pdot.on { background: var(--yellow); }
  .period-txt { font-weight: 900; font-size: 1.3vw; letter-spacing: .15em; color: #333; }

  .gear-abs {
    position: absolute; right: -3vw; top: 50%; transform: translateY(-50%);
    font-size: 1.4vw; background: none; border: none;
    cursor: pointer; opacity: .12; transition: opacity .2s;
  }
  .gear-abs:hover { opacity: .8; }
  .adj-panel {
    position: absolute; right: -3vw; top: calc(50% + 4vh);
    z-index: 10; display: flex; flex-direction: column; gap: .35vh;
    background: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 7px; padding: .5vh .7vw;
  }
  .adj-btn {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1.3vw;
    padding: .25vh .9vw; background: #111; color: #555;
    border: 1px solid #222; border-radius: 4px; cursor: pointer;
  }
  .adj-btn:hover { color: var(--yellow); }

  /* scores */
  .scores-row {
    display: grid; grid-template-columns: 1fr 4px 1fr;
    align-items: center; padding: 0 2vw;
  }
  .team-col { display: flex; flex-direction: column; align-items: center; }

  .score-seg-wrap { position: relative; cursor: pointer; line-height: .82; }
  .score-bg {
    font-size: 30vw; line-height: .82; color: var(--dim-w);
    position: absolute; top: 0; left: 0; right: 0;
    text-align: center; pointer-events: none;
  }
  .score-seg {
    font-size: 30vw; line-height: .82; color: var(--white);
    position: relative; text-align: center; min-width: 14vw;
    transition: color .08s;
  }
  .score-seg-wrap:active .score-seg { color: #bbb; }

  .score-minus {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4vw; font-weight: 700; letter-spacing: .06em;
    padding: .22vh 1.4vw; margin-top: .3vh;
    background: #0a0a0a; color: #252525;
    border: 1px solid #111; border-radius: 4px; cursor: pointer;
  }
  .score-minus:hover { color: #666; }

  .team-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 4vw; letter-spacing: .08em; text-transform: uppercase;
    background: transparent; border: none; border-bottom: 2px solid #111;
    color: #888; text-align: center; width: 92%; outline: none;
    padding: .1vh 0; margin-top: .4vh; transition: color .2s, border-color .2s;
  }
  .team-name:focus { color: #fff; border-color: #444; }

  .divider { background: #0f0f0f; height: 50%; align-self: center; }

  .bottom-bar {
    display: flex; align-items: center; justify-content: center;
    gap: 3vw; padding: .4vh 3vw 1vh;
    border-top: 1px solid #080808;
  }
  .pos-wrap {
    display: flex; align-items: center; gap: 1.2vw; cursor: pointer;
    padding: .3vh 1.2vw; border: 2px solid #0f0f0f; border-radius: 6px;
    transition: border-color .2s;
  }
  .pos-wrap:hover { border-color: #222; }
  .pos-arrow { font-size: 2.4vw; color: #151515; transition: color .2s; }
  .pos-arrow.on { color: #fff; }
  .pos-lbl { font-size: 1.1vw; letter-spacing: .2em; color: #222; font-weight: 700; }

  .reset-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.2vw; font-weight: 700; letter-spacing: .1em;
    padding: .3vh 1.1vw; background: #0a0000; color: #330a0a;
    border: 1px solid #160505; border-radius: 5px; cursor: pointer; transition: color .15s;
  }
  .reset-btn:hover { color: #ff3333; }

  .warmup-toggle-btn {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.2vw; font-weight: 700; letter-spacing: .1em;
    padding: .3vh 1.1vw; background: #001a00; color: #225522;
    border: 1px solid #0a280a; border-radius: 5px; cursor: pointer; transition: color .15s;
  }
  .warmup-toggle-btn:hover { color: #44aa44; }
`;
document.head.appendChild(css);

const fmt = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const t = Math.floor((ms % 1000) / 100);
  if (m === 0 && s < 60) return `${sec}!${t}`;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
};

const LOGO = "https://i.postimg.cc/FKgNmFpv/Whats_App_Image_2026_01_25_at_12_07_36_AM.jpg";

export default function App() {
  const [screen, setScreen] = useState("warmup"); // "warmup" | "game"

  /* warmup state */
  const [wTime, setWTime] = useState(600000);
  const [wRun,  setWRun]  = useState(false);

  /* game state */
  const [nameH, setNameH] = useState(() => localStorage.getItem("sb_nameH") || "LOCAL");
  const [nameG, setNameG] = useState(() => localStorage.getItem("sb_nameG") || "VISITANTE");
  const [time, setTime]   = useState(600000);
  const [run, setRun]     = useState(false);
  const [period, setPeriod] = useState(1);
  const [sH, setSH] = useState(0);
  const [sG, setSG] = useState(0);
  const [fH, setFH] = useState(0);
  const [fG, setFG] = useState(0);
  const [pos, setPos]     = useState("HOME");
  const [showAdj, setShowAdj] = useState(false);

  useEffect(() => { localStorage.setItem("sb_nameH", nameH); }, [nameH]);
  useEffect(() => { localStorage.setItem("sb_nameG", nameG); }, [nameG]);

  /* warmup timer */
  useEffect(() => {
    if (!wRun || wTime <= 0) return;
    const id = setInterval(() => setWTime(t => {
      if (t <= 100) { setWRun(false); return 0; }
      return t - 100;
    }), 100);
    return () => clearInterval(id);
  }, [wRun, wTime]);

  /* game timer */
  useEffect(() => {
    if (!run || time <= 0) return;
    const id = setInterval(() => setTime(t => {
      if (t <= 100) { setRun(false); return 0; }
      return t - 100;
    }), 100);
    return () => clearInterval(id);
  }, [run, time]);

  const adjTime = (d: number) => setTime((t: number) => Math.max(0, t + d));

  const handleClock = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button,input")) return;
    if (e.detail === 2) { setTime(600000); setRun(false); }
    else setRun(r => !r);
  };

  const addFoul = (team: string, v: number) => {
    if (team === "H") setFH(f => Math.max(0, f + v));
    else              setFG(f => Math.max(0, f + v));
    if (v > 0) setRun(false);
  };

  const nextPeriod = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRun(false); setPeriod(p => p < 4 ? p + 1 : 1);
    setTime(600000); setFH(0); setFG(0);
  };

  const reset = () => {
    if (!window.confirm("¿Reiniciar partido completo?")) return;
    setRun(false); setTime(600000); setPeriod(1);
    setSH(0); setSG(0); setFH(0); setFG(0); setPos("HOME");
  };

  /* ── WARMUP SCREEN ── */
  if (screen === "warmup") {
    return (
      <div className="warmup-screen">
        <div className="warmup-logo-frame">
          <img src={LOGO} alt="Liga Logo" className="warmup-logo" />
        </div>

        <div
          className="warmup-clock-wrap"
          onClick={() => setWRun(r => !r)}
          onDoubleClick={() => { setWTime(600000); setWRun(false); }}
          title="Click = iniciar/pausar · Doble click = resetear"
        >
          <span className={`seg warmup-digits ${wRun ? "warmup-run" : "warmup-stop"}`}>
            {fmt(wTime)}
          </span>
        </div>

        <p className="warmup-hint">
          {wRun ? "▶ CALENTAMIENTO EN CURSO — click para pausar" : "click para iniciar · doble click para resetear"}
        </p>

        <div className="warmup-actions">
          <button className="warmup-btn btn-reset-warmup"
                  onClick={() => { setWTime(600000); setWRun(false); }}>
            RESETEAR RELOJ
          </button>
          <button className="warmup-btn btn-start-game"
                  onClick={() => { setWRun(false); setScreen("game"); }}>
            INICIAR PARTIDO ▶
          </button>
        </div>
      </div>
    );
  }

  /* ── GAME SCREEN ── */
  return (
    <div className="sb">

      {/* TOP */}
      <div className="top-bar">

        <div className="foul-block">
          <span className="foul-lbl">FOUL</span>
          <div className="foul-row">
            <button className="foul-minus" onClick={() => addFoul("H", -1)}>−</button>
            <div className="foul-seg-wrap">
              <span className={`seg foul-seg ${fH >= 5 ? "bonus-on" : ""}`}
                    onClick={() => addFoul("H", 1)}>{fH}</span>
            </div>
            <span className={`bonus-tag ${fH >= 5 ? "on" : ""}`}>BONUS</span>
          </div>
        </div>

        <div className="clock-center" onClick={handleClock}>
          <div className="clock-seg-wrap">
            <button className="gear-abs" onClick={e => { e.stopPropagation(); setShowAdj(v => !v); }}>⚙️</button>
            {showAdj && (
              <div className="adj-panel" onClick={e => e.stopPropagation()}>
                <button className="adj-btn" onClick={() => adjTime( 60000)}>+1 min</button>
                <button className="adj-btn" onClick={() => adjTime(  1000)}>+1 seg</button>
                <button className="adj-btn" onClick={() => adjTime( -1000)}>−1 seg</button>
                <button className="adj-btn" onClick={() => adjTime(-60000)}>−1 min</button>
              </div>
            )}
            <span className={`seg clock-seg ${run ? "clock-run" : "clock-stop"}`}>{fmt(time)}</span>
          </div>
          <div className="period-row" onClick={nextPeriod}>
            {[1,2,3,4].map(n => <div key={n} className={`pdot ${period >= n ? "on" : ""}`} />)}
            <span className="period-txt">PERIOD {period}</span>
          </div>
        </div>

        <div className="foul-block right">
          <span className="foul-lbl">FOUL</span>
          <div className="foul-row">
            <span className={`bonus-tag ${fG >= 5 ? "on" : ""}`}>BONUS</span>
            <div className="foul-seg-wrap">
              <span className={`seg foul-seg ${fG >= 5 ? "bonus-on" : ""}`}
                    onClick={() => addFoul("G", 1)}>{fG}</span>
            </div>
            <button className="foul-minus" onClick={() => addFoul("G", -1)}>−</button>
          </div>
        </div>
      </div>

      {/* SCORES */}
      <div className="scores-row">
        <div className="team-col">
          <div className="score-seg-wrap" onClick={() => setSH(s => s + 1)}>
            <span className="seg score-seg">{sH}</span>
          </div>
          <button className="score-minus" onClick={() => setSH(s => Math.max(0, s - 1))}>− 1 PTO</button>
          <input className="team-name" value={nameH} onChange={e => setNameH(e.target.value)} placeholder="LOCAL" />
        </div>

        <div className="divider" />

        <div className="team-col">
          <div className="score-seg-wrap" onClick={() => setSG(s => s + 1)}>
            <span className="seg score-seg">{sG}</span>
          </div>
          <button className="score-minus" onClick={() => setSG(s => Math.max(0, s - 1))}>− 1 PTO</button>
          <input className="team-name" value={nameG} onChange={e => setNameG(e.target.value)} placeholder="VISITANTE" />
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom-bar">
        <button className="warmup-toggle-btn" onClick={() => { setRun(false); setScreen("warmup"); }}>
          ← CALENTAMIENTO
        </button>
        <div className="pos-wrap" onClick={() => setPos(p => p === "HOME" ? "GUEST" : "HOME")}>
          <span className={`pos-arrow ${pos === "HOME" ? "on" : ""}`}>◄</span>
          <span className="pos-lbl">POSESIÓN</span>
          <span className={`pos-arrow ${pos === "GUEST" ? "on" : ""}`}>►</span>
        </div>
        <button className="reset-btn" onClick={reset}>RESET GAME</button>
      </div>

    </div>
  );
}