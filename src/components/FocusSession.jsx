import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, X, Bell, BellOff, Eye, EyeOff,
  CheckSquare, Square, Check, RotateCcw, Shield,
  Coffee, Zap, Sparkles, FastForward, Clock,
} from 'lucide-react';
import { useApp } from '../context';

export default function FocusSession({ quest, taskId, onComplete, onContinueWithoutBreak, onClose }) {
  const { getCompanionImage, logoImg, companion, dndEnabled, setDndEnabled } = useApp();

  const totalSeconds = (quest.duration || 20) * 60;
  // Start at 19:42 (1182 seconds) to match reference board
  const [seconds, setSeconds] = useState(Math.min(totalSeconds, 1182));
  const [running, setRunning] = useState(true);
  const [hideCompanion, setHideCompanion] = useState(false);

  // Flow State / Lock-in state
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  const [subtasks, setSubtasks] = useState(
    quest.subtasks || [
      { id: 'st1', label: 'Tonton video materi inti (12 mnt)', done: true },
      { id: 'st2', label: 'Kerjakan latihan/kuis singkat (8 mnt)', done: false },
    ]
  );

  const intervalRef = useRef(null);

  // Main timer tick
  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!isOvertime) {
        setSeconds(prev => {
          if (prev <= 1) {
            // When countdown reaches 0, enter Flow State / Lock-in overtime!
            // Do NOT stop abruptly! Let the user keep flowing.
            setIsOvertime(true);
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Counting UP in lock-in flow state
        setOvertimeSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, isOvertime]);

  const toggleTimer = () => setRunning(prev => !prev);

  // Fast-forward to test lock-in mode immediately
  const triggerFastForwardToLockIn = () => {
    setSeconds(3);
    setIsOvertime(false);
    setOvertimeSeconds(0);
    setRunning(true);
  };

  const handleTakeBreak = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    const overtimeMins = Math.floor(overtimeSeconds / 60);
    onComplete(overtimeMins);
  };

  const handleContinueFlow = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    const overtimeMins = Math.floor(overtimeSeconds / 60);
    if (onContinueWithoutBreak) {
      onContinueWithoutBreak(overtimeMins);
    } else {
      onComplete(overtimeMins);
    }
  };

  const toggleSubtask = (id) => {
    setSubtasks(prev =>
      prev.map(st => (st.id === id ? { ...st, done: !st.done } : st))
    );
  };

  // Timer calculations
  const mins = isOvertime
    ? Math.floor(overtimeSeconds / 60)
    : Math.floor(seconds / 60);
  const secs = isOvertime
    ? overtimeSeconds % 60
    : seconds % 60;

  const displayTime = isOvertime
    ? `+${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progressPercent = isOvertime
    ? 100
    : ((totalSeconds - seconds) / totalSeconds) * 100;

  // Circular timer parameters
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="focus-night-overlay animate-in">
      <div className="focus-night-ambient-glow" />

      {/* Top Header */}
      <div className="focus-night-top-bar">
        <div className="focus-night-logo-wrap">
          <img src={logoImg} alt="QuestMate" className="focus-night-logo-img" />
          <span className="focus-night-logo-title">QuestMate</span>
        </div>

        <div className="focus-night-header-actions">
          {/* Lock-in or Normal badge */}
          {isOvertime ? (
            <div className="focus-lockin-badge animate-pulse">
              <Zap size={14} color="#06B6D4" />
              <span>Lock-in Mode (Flow State)</span>
            </div>
          ) : (
            <div className="focus-mode-badge-pill">
              <span className="focus-live-dot" />
              <span>Focus Session</span>
            </div>
          )}

          {/* DND Indicator */}
          {dndEnabled && (
            <div className="focus-dnd-status-pill">
              <Shield size={13} color="var(--cyan)" />
              <span>DND Aktif</span>
            </div>
          )}

          <button
            className="btn btn-ghost focus-exit-btn"
            onClick={onClose}
            aria-label="Keluar dari mode fokus"
          >
            <X size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Focus Content */}
      <div className="focus-night-main-content">
        {/* Left Column: Quest Details & Subtasks */}
        <div className="focus-quest-info-pane">
          <div className="focus-quest-meta-tag">
            {quest.course || 'Akademik'} · Quest 1/8
          </div>
          <h2 className="focus-quest-heading">
            {quest.title || 'Modul 1: AWS Cloud Concepts'}
          </h2>
          <p className="focus-quest-subdesc">
            Cicil 20 menit tugas ini tanpa memikirkan seluruh materi sekaligus.
          </p>

          <div className="focus-subtasks-box">
            <div className="focus-subtasks-header">Langkah Kecil Quest Ini:</div>
            {subtasks.map(st => (
              <div
                key={st.id}
                className={`focus-subtask-item ${st.done ? 'done' : ''}`}
                onClick={() => toggleSubtask(st.id)}
              >
                <div className="focus-subtask-checkbox">
                  {st.done ? (
                    <CheckSquare size={17} color="var(--cyan)" />
                  ) : (
                    <Square size={17} color="var(--text-on-dark-secondary)" />
                  )}
                </div>
                <span className="focus-subtask-label">{st.label}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Lock-in shortcut */}
          <button
            className="btn-test-lockin"
            onClick={triggerFastForwardToLockIn}
            title="Klik untuk menguji transisi Pomodoro Lock-in Flow State ke 00:00"
          >
            <FastForward size={13} />
            <span>Simulasi Cepat: Lompat ke 3 Detik Terakhir</span>
          </button>
        </div>

        {/* Center Column: Circular Timer */}
        <div className="focus-timer-pane">
          {/* Overtime Banner */}
          {isOvertime && (
            <div className="lockin-flow-banner animate-in">
              <Zap size={16} color="var(--cyan)" />
              <div>
                <div className="lockin-flow-title">Kamu sedang Lock-in!</div>
                <div className="lockin-flow-desc">
                  Momentum fokus terjaga. Timer bertambah (+detik) tanpa memaksa rehat.
                </div>
              </div>
            </div>
          )}

          <div className={`focus-circular-timer-wrap ${isOvertime ? 'overtime-pulse' : ''}`}>
            <svg className="focus-circular-svg" width="240" height="240">
              <circle
                className="focus-circle-bg"
                cx="120"
                cy="120"
                r={radius}
                strokeWidth="7"
              />
              <circle
                className={`focus-circle-progress ${isOvertime ? 'overtime-circle' : ''}`}
                cx="120"
                cy="120"
                r={radius}
                strokeWidth="7"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: isOvertime ? 0 : strokeDashoffset,
                }}
              />
            </svg>

            <div className="focus-timer-text-overlay">
              <div className={`focus-timer-digits ${isOvertime ? 'overtime-text' : ''}`}>
                {displayTime}
              </div>
              <div className="focus-timer-sub">
                {isOvertime ? 'Lembur Fokus' : `${quest.duration || 20} mnt`}
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="focus-controls-primary-stack">
            {isOvertime ? (
              // Flow State / Overtime Decision Actions
              <div className="lockin-decision-actions animate-in">
                <button
                  className="btn btn-primary btn-lockin-break"
                  onClick={handleTakeBreak}
                >
                  <Coffee size={18} />
                  <span>Ambil Rehat Bebas Rasa Bersalah</span>
                </button>

                <button
                  className="btn btn-secondary btn-lockin-continue"
                  onClick={handleContinueFlow}
                >
                  <Zap size={16} />
                  <span>Lanjut Tanpa Istirahat (+Sparks)</span>
                </button>
              </div>
            ) : (
              // Standard Countdown Controls
              <div className="focus-controls-row">
                <button
                  className="btn btn-focus-control"
                  onClick={toggleTimer}
                >
                  {running ? (
                    <>
                      <Pause size={16} />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Lanjut</span>
                    </>
                  )}
                </button>

                <button
                  className="btn btn-focus-control btn-focus-early"
                  onClick={handleTakeBreak}
                >
                  <Check size={16} />
                  <span>Selesai Lebih Cepat</span>
                </button>
              </div>
            )}
          </div>

          {/* Do Not Disturb Toggle */}
          <button
            className={`focus-dnd-toggle-btn ${dndEnabled ? 'active' : ''}`}
            onClick={() => setDndEnabled(!dndEnabled)}
          >
            {dndEnabled ? (
              <Bell size={15} color="var(--cyan)" />
            ) : (
              <BellOff size={15} />
            )}
            <span>
              {dndEnabled
                ? 'Do Not Disturb: Aktif (Distraksi Dibisukan)'
                : 'Do Not Disturb: Nonaktif'}
            </span>
          </button>
        </div>

        {/* Right Column: Desk Companion Mascot with Hide Button */}
        <div className="focus-companion-pane">
          {!hideCompanion ? (
            <div className="focus-companion-desk-wrap">
              <div className="focus-companion-speech">
                {isOvertime
                  ? "Keren banget! Kamu masih lock-in. Aku temani terus sampai kamu siap rehat!"
                  : "Fokus pada satu langkah kecil ini saja. Kamu pasti bisa!"}
              </div>
              <img
                src={getCompanionImage('focus')}
                alt="Companion Studying"
                className="focus-companion-desk-img"
              />
              <button
                className="btn-hide-companion"
                onClick={() => setHideCompanion(true)}
              >
                <EyeOff size={14} />
                <span>Sembunyikan Companion</span>
              </button>
            </div>
          ) : (
            <div className="focus-companion-hidden-wrap">
              <button
                className="btn-hide-companion btn-show-companion"
                onClick={() => setHideCompanion(false)}
              >
                <Eye size={14} />
                <span>Tampilkan Aero</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
