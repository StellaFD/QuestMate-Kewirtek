import { useMemo } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Ticket, Gift, Zap, Coffee } from 'lucide-react';
import { useApp } from '../context';

export default function QuestComplete({ quest, onContinue, onContinueDirectly }) {
  const { getCompanionImage, user, lastReward } = useApp();

  // Floating confetti particles
  const confetti = useMemo(() => {
    const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899'];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.8}s`,
      size: 7 + Math.random() * 6,
    }));
  }, []);

  const earnedSparks = lastReward?.totalSparks || 45;
  const luckyRoll = lastReward?.luckyRoll || 10;
  const mysteryLoot = lastReward?.dropItem || 'Token Santai Bebas Cemas';
  const xpPercent = Math.min(100, Math.round(((user.xp) / user.xpToNext) * 100));

  return (
    <div className="quest-complete-celebration-overlay animate-in">
      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="confetti-particle"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            background: c.color,
            animationDelay: c.delay,
          }}
        />
      ))}

      <div className="quest-complete-card">
        {/* Celebration Mascot Image */}
        <div className="quest-complete-mascot-wrap">
          <img
            src={getCompanionImage('celebrate')}
            alt="Perayaan Quest Selesai"
            className="quest-complete-mascot-img"
          />
        </div>

        <h1 className="quest-complete-title">Quest Berhasil Diselesaikan!</h1>
        <p className="quest-complete-sub">
          Kamu telah melangkah dan mencicil tugas tanpa harus kelelahan menyelesaikan semuanya sekaligus.
        </p>

        {/* Variable Reward Grid: XP & Sparks Loot Drop */}
        <div className="quest-rewards-summary-grid">
          {/* EXP */}
          <div className="reward-chip-card">
            <div className="reward-chip-icon">
              <Sparkles size={18} color="var(--primary)" />
            </div>
            <div className="reward-chip-info">
              <span className="reward-chip-label">EXP Karakter</span>
              <span className="reward-chip-value">+50 EXP</span>
            </div>
          </div>

          {/* Variable Sparks with Lucky Drop */}
          <div className="reward-chip-card highlight-sparks">
            <div className="reward-chip-icon">
              <Gift size={18} color="#A855F7" />
            </div>
            <div className="reward-chip-info">
              <span className="reward-chip-label">Sparks & Lucky Roll</span>
              <span className="reward-chip-value">+{earnedSparks} Sparks</span>
            </div>
          </div>
        </div>

        {/* Lucky Drop Badge */}
        <div className="mystery-drop-pill">
          <Zap size={14} color="#06B6D4" />
          <span>Loot Drop: <strong>{mysteryLoot}</strong> (+{luckyRoll} Bonus Sparks)</span>
        </div>

        {/* Guilt-Free Leisure Permission Voucher (Solves the doomscrolling paralysis!) */}
        <div className="guilt-free-voucher-card animate-in">
          <div className="voucher-header-bar">
            <div className="voucher-stamp">
              <ShieldCheck size={16} />
              <span>TERVERIFIKASI QUESTMATE</span>
            </div>
            <span className="voucher-serial">NO. QM-2026-CHILL</span>
          </div>

          <div className="voucher-body">
            <div className="voucher-icon-badge">
              <Ticket size={28} />
            </div>
            <div className="voucher-text-content">
              <h3 className="voucher-title">VOUCHER HIBURAN 100% BEBAS RASA BERSALAH</h3>
              <p className="voucher-desc">
                Tugasmu hari ini sudah resmi dicicil! Sekarang kamu berhak menonton YouTube/anime
                atau santai <strong>tanpa rasa bersalah, tanpa cemas deadline, dan tanpa doomscrolling di kasur</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="quest-complete-level-box">
          <div className="quest-complete-level-header">
            <span className="quest-complete-level-title">Level {user.level} · {user.levelName || 'Cyber Scholar'}</span>
            <span className="quest-complete-level-xp">
              {user.xp}/{user.xpToNext} EXP
            </span>
          </div>
          <div className="quest-complete-bar-wrap">
            <div
              className="quest-complete-bar-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Dual Actions: Take Break or Continue Flow */}
        <div className="complete-action-buttons-stack">
          <button
            className="btn btn-primary btn-complete-continue"
            onClick={onContinue}
          >
            <Coffee size={16} />
            <span>Klaim Voucher & Ambil Rehat</span>
            <ArrowRight size={16} />
          </button>

          {onContinueDirectly && (
            <button
              className="btn-complete-view-progress"
              onClick={onContinueDirectly}
            >
              <Zap size={14} />
              <span>Lanjut ke Microquest Berikutnya</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
