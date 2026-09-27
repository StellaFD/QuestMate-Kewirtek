import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Check, ShoppingBag, Eye, EyeOff, Footprints,
  Save, Zap, Shield, Award, Clock, ArrowRight,
} from 'lucide-react';
import { useApp } from '../context';
import { COMPANION_DATA } from '../data';

export default function CompanionPage() {
  const navigate = useNavigate();
  const {
    companion, setCompanion, getCompanionImage,
    user, accessoriesShop, buyAccessory, equipAccessory,
    showDesktopCompanion, setShowDesktopCompanion,
    isRoaming, setIsRoaming,
  } = useApp();

  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'appearance' | 'personality'
  const [successToast, setSuccessToast] = useState('');

  const handleUpdate = (key, value) => {
    setCompanion(prev => ({ ...prev, [key]: value }));
  };

  const handleBuyOrEquip = (acc) => {
    if (acc.owned) {
      equipAccessory(acc.id);
      setSuccessToast(`Equipped ${acc.name}!`);
    } else {
      if (user.sparks < acc.cost) {
        alert(`You need ${acc.cost - user.sparks} more Sparks to unlock this item. Complete more quests!`);
        return;
      }
      buyAccessory(acc.id);
      setSuccessToast(`Unlocked and equipped ${acc.name}!`);
    }

    setTimeout(() => setSuccessToast(''), 2200);
  };

  const currentColorHex = COMPANION_DATA.colors.find(c => c.id === companion.color)?.hex || '#6366F1';
  const currentPersonality = COMPANION_DATA.personalities.find(p => p.id === companion.personality);
  const equippedItem = accessoriesShop.find(a => a.id === companion.equippedAccessory);

  return (
    <div className="page-container">
      {/* Toast */}
      {successToast && (
        <div className="accessory-toast-banner animate-in">
          <Sparkles size={16} color="#A855F7" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="companion-customization-page animate-in">
        {/* Header */}
        <div className="customization-header">
          <div className="customization-header-row">
            <div>
              <h1 className="customization-title">
                {companion.name} · {companion.title}
              </h1>
              <p className="customization-sub">
                Your personal AI study buddy. Complete quests to earn Sparks and unlock accessories!
              </p>
            </div>

            {/* Sparks Balance Badge */}
            <div className="user-sparks-wallet-badge">
              <div className="sparks-wallet-icon">
                <Sparkles size={20} color="#A855F7" />
              </div>
              <div>
                <div className="sparks-wallet-amount">{user.sparks || 180} Sparks</div>
                <div className="sparks-wallet-sub">+35 earned per completed quest</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Roaming Companion Status Bar */}
        <div className="desktop-companion-settings-banner">
          <div className="desktop-banner-left">
            <Footprints size={18} color="var(--primary)" />
            <div>
              <div className="desktop-banner-title">Desktop Floating Companion</div>
              <div className="desktop-banner-desc">
                Aero floats across your workspace, displaying your live countdown timer.
              </div>
            </div>
          </div>
          <div className="desktop-banner-actions">
            <button
              className={`btn btn-sm ${isRoaming ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setIsRoaming(!isRoaming)}
            >
              <Footprints size={14} />
              <span>{isRoaming ? 'Roaming: Active' : 'Roaming: Docked'}</span>
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowDesktopCompanion(!showDesktopCompanion)}
            >
              {showDesktopCompanion ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showDesktopCompanion ? 'Hide from Desktop' : 'Show on Desktop'}</span>
            </button>
          </div>
        </div>

        <div className="customization-layout-grid">
          {/* Left Column: Tabs & Controls */}
          <div className="customization-controls-pane">
            {/* Segmented Navigation */}
            <div className="shop-tabs-row">
              <button
                className={`shop-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                <ShoppingBag size={16} />
                <span>Accessory Shop</span>
              </button>
              <button
                className={`shop-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('appearance')}
              >
                <Sparkles size={16} />
                <span>Colors & Glow</span>
              </button>
              <button
                className={`shop-tab-btn ${activeTab === 'personality' ? 'active' : ''}`}
                onClick={() => setActiveTab('personality')}
              >
                <Zap size={16} />
                <span>Personality</span>
              </button>
            </div>

            {/* TAB 1: ACCESSORY SHOP */}
            {activeTab === 'shop' && (
              <div className="shop-inventory-section animate-in">
                <div className="section-title-with-action">
                  <h3 className="customization-section-title">
                    Exchange Sparks for Cyber Accessories
                  </h3>
                  <span className="shop-balance-pill">
                    Balance: {user.sparks || 180} Sparks
                  </span>
                </div>

                <div className="accessories-shop-grid">
                  {accessoriesShop.map(acc => {
                    const isEquipped = companion.equippedAccessory === acc.id;
                    const canAfford = user.sparks >= acc.cost;

                    return (
                      <div
                        key={acc.id}
                        className={`accessory-shop-card ${acc.owned ? 'owned' : ''} ${
                          isEquipped ? 'equipped' : ''
                        }`}
                      >
                        <div className="accessory-card-header">
                          <span className="accessory-category-tag">{acc.category}</span>
                          {isEquipped ? (
                            <span className="badge badge-primary">Equipped</span>
                          ) : acc.owned ? (
                            <span className="badge badge-success">Owned</span>
                          ) : (
                            <span className="accessory-cost-tag">
                              <Sparkles size={12} color="#A855F7" />
                              {acc.cost} Sparks
                            </span>
                          )}
                        </div>

                        <div className="accessory-card-name">{acc.name}</div>
                        <p className="accessory-card-desc">{acc.desc}</p>

                        <button
                          className={`btn btn-sm ${
                            isEquipped
                              ? 'btn-secondary'
                              : acc.owned
                              ? 'btn-primary'
                              : canAfford
                              ? 'btn-cyan'
                              : 'btn-secondary'
                          } btn-accessory-action`}
                          onClick={() => handleBuyOrEquip(acc)}
                        >
                          {isEquipped
                            ? 'Currently Equipped'
                            : acc.owned
                            ? 'Equip'
                            : canAfford
                            ? `Exchange (${acc.cost} Sparks)`
                            : `Need ${acc.cost} Sparks`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: APPEARANCE & COLOR */}
            {activeTab === 'appearance' && (
              <div className="customization-section animate-in">
                <h3 className="customization-section-title">Cyber Armor & Visor Colors</h3>
                <div className="customization-colors-row">
                  {COMPANION_DATA.colors.map(col => {
                    const isSelected = companion.color === col.id;
                    return (
                      <button
                        key={col.id}
                        className={`color-palette-dot ${isSelected ? 'selected' : ''}`}
                        style={{ background: col.hex }}
                        onClick={() => handleUpdate('color', col.id)}
                        title={col.label}
                      />
                    );
                  })}
                </div>

                <div style={{ marginTop: 'var(--space-xl)' }}>
                  <h3 className="customization-section-title">Companion Name</h3>
                  <input
                    type="text"
                    className="form-input"
                    value={companion.name}
                    onChange={e => handleUpdate('name', e.target.value)}
                    style={{ maxWidth: 280 }}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PERSONALITY */}
            {activeTab === 'personality' && (
              <div className="customization-section animate-in">
                <h3 className="customization-section-title">Aero's Response Style</h3>
                <div className="customization-personality-list">
                  {COMPANION_DATA.personalities.map(pers => {
                    const isSelected = companion.personality === pers.id;
                    return (
                      <div
                        key={pers.id}
                        className={`personality-select-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleUpdate('personality', pers.id)}
                      >
                        <div className="personality-radio-bullet">
                          {isSelected && <span className="personality-radio-inner" />}
                        </div>
                        <div className="personality-text-content">
                          <div className="personality-title">{pers.label}</div>
                          <div className="personality-desc">{pers.desc}</div>
                          <div className="personality-quote">"{pers.sample}"</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Companion Preview Stage */}
          <div className="customization-preview-pane">
            <div className="preview-companion-stage-card">
              <div
                className="preview-companion-halo"
                style={{ background: currentColorHex }}
              />

              <div className="preview-companion-img-wrap">
                <img
                  src={getCompanionImage('idle')}
                  alt="Aero Robot"
                  className="preview-companion-mascot-img"
                />
              </div>

              <div className="preview-companion-info">
                <h2 className="preview-companion-name">{companion.name}</h2>
                <div className="preview-companion-tag">
                  Level {user.level} · {companion.title}
                </div>
              </div>

              {equippedItem && (
                <div className="preview-accessory-badge">
                  <Shield size={12} color="var(--primary)" />
                  <span>Equipped: {equippedItem.name}</span>
                </div>
              )}

              <div className="preview-speech-balloon">
                "{currentPersonality?.sample}"
              </div>

              <div className="preview-companion-timer-box">
                <Clock size={14} color="var(--cyan)" />
                <span>Live Desktop Timer: 19:42</span>
              </div>

              <button
                className="btn btn-primary btn-save-companion"
                onClick={() => navigate('/')}
              >
                <span>Return to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
