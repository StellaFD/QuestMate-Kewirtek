import { useState, useEffect, useRef } from 'react';
import {
  Tv, Compass, Coffee, Gamepad2, Users, Sparkles,
  ArrowRight, Check, Play, Pause, RotateCcw, Clock,
  ShieldCheck, Heart,
} from 'lucide-react';
import { useApp } from '../context';

export default function BreakReward({ onDone }) {
  const { getCompanionImage, user } = useApp();
  const [selectedActivity, setSelectedActivity] = useState('watch');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [breakTimerActive, setBreakTimerActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const breakOptions = [
    {
      id: 'watch',
      label: 'Nonton YouTube / 1 Ep Anime',
      desc: 'Tonton video favorit tanpa merasa bersalah karena tugas sudah dicicil.',
      icon: Tv,
    },
    {
      id: 'game',
      label: 'Main 1 Match Game Santai',
      desc: 'Refreshing pikiran dengan game favorit tanpa was-was kepikiran deadline.',
      icon: Gamepad2,
    },
    {
      id: 'drink',
      label: 'Seduh Kopi / Jajan Boba',
      desc: 'Isi ulang amunisi kafein atau camilan segar untuk menyegarkan mata.',
      icon: Coffee,
    },
    {
      id: 'outside',
      label: 'Jalan Keluar / Cari Angin',
      desc: 'Renggangkan badan dan hirup udara segar setelah duduk di depan layar.',
      icon: Compass,
    },
    {
      id: 'hangout',
      label: 'Chat / Hangout Bareng Teman',
      desc: 'Ngobrol santai tanpa harus stres ngomongin beban kuliah.',
      icon: Users,
    },
    {
      id: 'other',
      label: 'Rebahan Santai & Dengar Musik',
      desc: 'Recharge energi murni di kasur dengan tenang tanpa overthinking.',
      icon: Sparkles,
    },
  ];

  const durationOptions = [15, 20, 30, 45];

  const handleSelectDuration = (mins) => {
    setBreakMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  // Start break countdown ONLY when user explicitly clicks "Mulai Rehat Sekarang"
  const handleStartBreak = () => {
    setSecondsRemaining(breakMinutes * 60);
    setBreakTimerActive(true);
    setTimerRunning(true);
  };

  useEffect(() => {
    if (!breakTimerActive || !timerRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breakTimerActive, timerRunning]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const currentActivityObj = breakOptions.find(o => o.id === selectedActivity) || breakOptions[0];
  const ActivityIcon = currentActivityObj.icon;

  if (breakTimerActive) {
    return (
      <div className="break-reward-modal-overlay animate-in">
        <div className="break-reward-card break-timer-active-card">
          <div className="break-active-header">
            <div className="break-active-badge">
              <ShieldCheck size={15} color="var(--success)" />
              <span>Rehat Bebas Rasa Bersalah Sedang Berjalan</span>
            </div>
            <h1 className="break-reward-title">Selamat Menikmati Rehat!</h1>
            <p className="break-reward-sub">
              Aktivitas: <strong>{currentActivityObj.label}</strong>. Nikmati sepenuhnya, tugasmu sudah aman dicicil.
            </p>
          </div>

          {/* Large Countdown Display */}
          <div className="break-active-countdown-box">
            <div className="break-timer-digits-large">{timeFormatted}</div>
            <div className="break-countdown-controls">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? (
                  <>
                    <Pause size={14} />
                    <span>Jeda Rehat</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Lanjutkan Rehat</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Relaxing Mascot in Cyber Lounge */}
          <div className="break-mascot-footer-wrap">
            <div className="break-mascot-speech-bubble">
              "Santai aja {user.name}! Nikmati tontonanmu tanpa kepikiran tugas."
            </div>
            <img
              src={getCompanionImage('break')}
              alt="Aero Santai di Lounge"
              className="break-mascot-img"
            />
          </div>

          <button
            className="btn btn-primary btn-break-cta"
            onClick={onDone}
            style={{ marginTop: 'var(--space-md)' }}
          >
            <span>Selesai Rehat & Kembali ke Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Pre-Break Selection Screen: Timer is paused until user presses "Mulai Rehat"
  return (
    <div className="break-reward-modal-overlay animate-in">
      <div className="break-reward-card">
        {/* Guilt-Free Permission Badge */}
        <div className="break-guilt-free-banner">
          <ShieldCheck size={18} color="var(--cyan)" />
          <div>
            <div className="break-guilt-free-title">Izin Rehat Resmi Terbuka!</div>
            <div className="break-guilt-free-sub">
              Tidak ada lagi rasa bersalah atau doomscrolling tanpa arah di kasur.
            </div>
          </div>
        </div>

        <h1 className="break-reward-title">
          Kamu Mendapatkan <span className="highlight-text">{breakMinutes} Menit Rehat Bebas Rasa Bersalah!</span>
        </h1>
        <p className="break-reward-sub">Pilih aktivitas santai yang ingin kamu nikmati sekarang:</p>

        {/* Duration Selector */}
        <div className="break-duration-pills-row">
          <span className="duration-label">
            <Clock size={13} />
            <span>Durasi:</span>
          </span>
          {durationOptions.map(d => (
            <button
              key={d}
              className={`btn-duration-pill ${breakMinutes === d ? 'active' : ''}`}
              onClick={() => handleSelectDuration(d)}
            >
              {d} Menit
            </button>
          ))}
        </div>

        {/* 6 Grid Options */}
        <div className="break-options-grid-ref">
          {breakOptions.map(opt => {
            const IconComp = opt.icon;
            const isSelected = selectedActivity === opt.id;
            return (
              <div
                key={opt.id}
                className={`break-option-card-ref ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedActivity(opt.id)}
              >
                <div className="break-option-icon-box">
                  <IconComp size={22} color={isSelected ? 'var(--primary)' : 'var(--text-secondary)'} />
                </div>
                <div className="break-option-content-col">
                  <div className="break-option-label-text">{opt.label}</div>
                  <div className="break-option-desc-text">{opt.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Relaxing Mascot Illustration */}
        <div className="break-mascot-footer-wrap">
          <div className="break-mascot-speech-bubble">
            "Pilih hiburanmu! Timer baru akan berjalan saat kamu menekan tombol di bawah."
          </div>
          <img
            src={getCompanionImage('break')}
            alt="Aero Santai"
            className="break-mascot-img"
          />
        </div>

        {/* Action Button: Starts the timer only on click */}
        <button
          className="btn btn-primary btn-break-cta"
          onClick={handleStartBreak}
        >
          <Play size={16} />
          <span>Mulai Rehat Sekarang ({breakMinutes} Menit)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
