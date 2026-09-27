import { NavLink, Outlet } from 'react-router-dom';
import {
  Home, CheckSquare, PlusCircle, Sparkles, Bell, Flame, User,
  Bot,
} from 'lucide-react';
import { useApp } from '../context';
import NotificationPanel from './NotificationPanel';
import DesktopCompanionWidget from './DesktopCompanionWidget';

export default function Layout() {
  const {
    companion, getCompanionImage, logoImg,
    showNotifications, setShowNotifications, notifications, user,
  } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <img src={logoImg} alt="QuestMate Logo" className="sidebar-logo-img" />
          <h1 className="sidebar-logo-text">QuestMate</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Home size={19} />
            Home
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CheckSquare size={19} />
            Tasks & Quests
          </NavLink>
          <NavLink to="/add-task" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <PlusCircle size={19} />
            Add Task
          </NavLink>
          <NavLink to="/companion" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bot size={19} />
            Aero Robot & Shop
          </NavLink>
        </nav>

        {/* Companion Mini Card at Bottom */}
        <NavLink to="/companion" className="sidebar-companion-card" title="Open Aero's Wardrobe & Shop">
          <div className="sidebar-companion-avatar-wrap">
            <img
              src={getCompanionImage('idle')}
              alt={companion.name}
              className="sidebar-companion-img"
            />
          </div>
          <div className="sidebar-companion-text">
            <div className="sidebar-companion-name">{companion.name} (Robot)</div>
            <div className="sidebar-companion-status">{user.sparks || 180} Sparks available</div>
          </div>
        </NavLink>
      </aside>

      {/* Main content */}
      <main className="app-main">
        {/* Top bar */}
        <div className="top-nav-bar">
          <div className="top-nav-left">
            <span className="badge badge-primary top-nav-badge">
              MVP: Individual Tasks
            </span>
            <span className="badge badge-subtle top-nav-future">
              Future: Group Squad
            </span>
          </div>

          <div className="top-nav-right">
            {/* Sparks Currency (Reward Shop) */}
            <NavLink to="/companion" className="top-nav-stat top-nav-sparks" title="Sparks can be exchanged for robot accessories!">
              <Sparkles size={15} color="#A855F7" />
              <span>{user.sparks || 180} Sparks</span>
            </NavLink>

            {/* Streak Indicator */}
            <div className="top-nav-stat">
              <Flame size={16} color="var(--warning)" />
              <span>{user.streak} days</span>
            </div>

            {/* Level Pill */}
            <div className="top-nav-stat">
              <span className="top-nav-level">Lv. {user.level}</span>
              <span className="top-nav-xp">{user.xp}/{user.xpToNext} EXP</span>
            </div>

            {/* Notification Bell */}
            <button
              className="btn btn-ghost btn-icon top-nav-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && <span className="notification-dot" />}
            </button>

            {/* User Profile */}
            <div className="top-nav-user" title={`Logged in as ${user.name}`}>
              <div className="top-nav-avatar">
                <User size={15} color="var(--primary)" />
              </div>
              <span className="top-nav-username">{user.name}</span>
            </div>
          </div>
        </div>

        <Outlet />
      </main>

      {/* Roaming Desktop Companion Widget (Walks across desktop, shows timer, can be hidden) */}
      <DesktopCompanionWidget />

      {/* Notification Panel */}
      <NotificationPanel />
    </div>
  );
}
