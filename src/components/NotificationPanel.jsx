import { X, Sparkles, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';

export default function NotificationPanel() {
  const navigate = useNavigate();
  const {
    notifications, showNotifications, setShowNotifications,
    setNotifications, tasks,
  } = useApp();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleStartFromNotif = () => {
    setShowNotifications(false);
    navigate('/');
  };

  return (
    <>
      {showNotifications && (
        <div
          className="notification-panel-backdrop"
          onClick={() => setShowNotifications(false)}
        />
      )}
      <div className={`notification-panel ${showNotifications ? 'open' : ''}`}>
        <div className="notification-panel-header">
          <h3 className="notification-panel-title">Notifications</h3>
          <div className="notification-panel-header-actions">
            <button className="btn btn-sm btn-ghost" onClick={markAllRead}>
              Mark all read
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowNotifications(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="notification-panel-body">
          {/* Panel 9: Hook Model Trigger Highlight */}
          <div className="notification-hook-card">
            <div className="notification-hook-badge">
              <Sparkles size={13} color="var(--primary)" />
              <span>Smart Focus Trigger</span>
            </div>
            <h4 className="notification-hook-title">Your next AWS quest is ready!</h4>
            <p className="notification-hook-text">
              You usually focus well around 8 PM. 20 minutes is all you need to make progress without pressure.
            </p>
            <button
              className="btn btn-primary btn-sm notification-hook-btn"
              onClick={handleStartFromNotif}
            >
              <span>Start Quest</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* List of Other Notifications */}
          {notifications.map(n => (
            <div
              key={n.id}
              className={`notification-item ${n.read ? 'read' : 'unread'}`}
            >
              <div className="notification-item-icon-box">
                {n.type === 'trigger' ? (
                  <Sparkles size={16} color="var(--primary)" />
                ) : n.type === 'deadline' ? (
                  <Clock size={16} color="var(--warning)" />
                ) : (
                  <AlertTriangle size={16} color="var(--cyan)" />
                )}
              </div>
              <div className="notification-item-body">
                <div className="notification-item-headline">{n.title}</div>
                <div className="notification-item-text">{n.text}</div>
                <div className="notification-item-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
