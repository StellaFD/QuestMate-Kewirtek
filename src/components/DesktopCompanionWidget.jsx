import { useState, useEffect } from 'react';
import {
  Play, Pause, X, Eye, EyeOff, Sparkles, Clock,
  Footprints, Volume2, Shield, Bot,
} from 'lucide-react';
import { useApp } from '../context';

export default function DesktopCompanionWidget({ onStartQuickFocus }) {
  const {
    companion, getCompanionImage, user,
    showDesktopCompanion, setShowDesktopCompanion,
    isRoaming, setIsRoaming,
    activeFocusSeconds, isTimerRunning,
  } = useApp();

  const [speech, setSpeech] = useState(`Halo ${user.name}! Ada 3 microquest yang siap dicicil santai.`);
  const [isWaving, setIsWaving] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Cycle robot speeches periodically or when poked (Indonesian student tone)
  const robotSpeeches = [
    `Baterai 100%! Siap nemenin kamu cicil tugas AWS Cloud hari ini.`,
    "Ingat: sprint 20 menit jauh lebih baik daripada begadang panik!",
    `Kamu punya ${user.sparks || 180} Sparks! Yuk intip aksesori baru di Toko Aero.`,
    "Gak perlu selesaikan semua hari ini. Cukup 1 microquest lalu nikmati rehat!",
    "Lagi overthinking tugas? Biar aku yang atur langkah kecilnya untukmu!",
  ];

  const handlePoke = () => {
    setIsWaving(true);
    const nextSpeech = robotSpeeches[Math.floor(Math.random() * robotSpeeches.length)];
    setSpeech(nextSpeech);
    setTimeout(() => setIsWaving(false), 800);
  };

  const mins = Math.floor((activeFocusSeconds || 1182) / 60);
  const secs = (activeFocusSeconds || 1182) % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (!showDesktopCompanion) {
    return (
      <button
        className="desktop-companion-reopen-btn animate-in"
        onClick={() => setShowDesktopCompanion(true)}
        title="Summon Aero Desktop Companion"
      >
        <Bot size={15} color="var(--cyan)" />
        <span>Aero Companion</span>
        <span className="reopen-timer-pill">{timeFormatted}</span>
      </button>
    );
  }

  if (minimized) {
    return (
      <div className="desktop-companion-minimized-pill animate-in">
        <button
          className="minimized-inner-btn"
          onClick={() => setMinimized(false)}
          title="Expand Aero Companion"
        >
          <div className="mini-bot-avatar-wrap">
            <img
              src={getCompanionImage(isTimerRunning ? 'focus' : 'idle')}
              alt="Aero"
              className="mini-bot-img"
            />
          </div>
          <span className="mini-bot-name">Aero</span>
          <span className="mini-bot-timer">{timeFormatted}</span>
        </button>
        <button
          className="minimized-close-btn"
          onClick={() => setShowDesktopCompanion(false)}
          title="Hide completely"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`desktop-roaming-companion-wrap animate-in ${
        isRoaming ? 'roaming-mode' : 'docked-mode'
      }`}
    >
      {/* Timer Bubble on top of robot */}
      <div className="desktop-companion-timer-bubble">
        <Clock size={12} color="var(--cyan)" />
        <span className="companion-live-timer-digits">
          {timeFormatted}
        </span>
        <span className="companion-timer-tag">
          {isTimerRunning ? 'Focusing' : 'Ready'}
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="desktop-companion-speech-bubble" onClick={handlePoke}>
        <span>"{speech}"</span>
      </div>

      {/* Robot Mascot Body */}
      <div
        className={`desktop-companion-avatar-stage ${isWaving ? 'waving' : ''}`}
        onClick={handlePoke}
        title="Click Aero to interact!"
      >
        <img
          src={getCompanionImage(isTimerRunning ? 'focus' : 'idle')}
          alt={companion.name}
          className="desktop-companion-mascot-img"
        />

        {/* Thrust Glow / Roaming Particles */}
        <div className="desktop-companion-thruster-glow" />
      </div>

      {/* Floating Toolbar Controls */}
      <div className="desktop-companion-action-bar">
        {/* Roam Toggle */}
        <button
          className={`btn-widget-control ${isRoaming ? 'active' : ''}`}
          onClick={() => setIsRoaming(!isRoaming)}
          title={isRoaming ? 'Dock to corner' : 'Enable roaming walk'}
        >
          <Footprints size={13} />
          <span>{isRoaming ? 'Roaming' : 'Docked'}</span>
        </button>

        {/* Poke */}
        <button
          className="btn-widget-control"
          onClick={handlePoke}
          title="Cheer me on"
        >
          <Sparkles size={13} />
          <span>Poke</span>
        </button>

        {/* Minimize */}
        <button
          className="btn-widget-control"
          onClick={() => setMinimized(true)}
          title="Minimize"
        >
          <EyeOff size={13} />
          <span>Hide</span>
        </button>
      </div>
    </div>
  );
}
