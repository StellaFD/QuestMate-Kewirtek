import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, ArrowRight, Flame, Sparkles, BookOpen,
  Calendar, Layers, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context';
import FocusSession from '../components/FocusSession';
import QuestComplete from '../components/QuestComplete';
import BreakReward from '../components/BreakReward';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user, tasks, getCompanionImage,
    completeQuest,
  } = useApp();

  const [activeQuest, setActiveQuest] = useState(null);
  const [showCompletion, setShowCompletion] = useState(null);
  const [showBreak, setShowBreak] = useState(false);

  // Target AWS Cloud Computing Module 1
  const awsTask = tasks.find(t => t.id === 't1') || tasks[0];
  const todaysQuest = awsTask?.quests?.[0] || {
    id: 'q1',
    taskId: awsTask?.id || 't1',
    title: 'AWS Cloud Computing',
    taskName: 'Complete Module 1 Quiz',
    course: 'Cloud Computing',
    duration: 20,
    priority: 'high',
  };

  const upcomingDeadlines = tasks.map(t => ({
    id: t.id,
    name: t.name,
    deadline: t.deadlineFormatted || t.deadline,
    workload: t.workload,
    priority: t.priority,
    priorityBadge: t.priorityBadge,
    completed: t.completedQuests,
    total: t.totalQuests,
  }));

  const handleStartQuest = useCallback((quest) => {
    setActiveQuest({
      ...quest,
      taskId: quest.taskId || awsTask?.id,
    });
  }, [awsTask]);

  const handleQuestComplete = useCallback((overtimeMinutes = 0) => {
    if (activeQuest) {
      const bonusSparks = overtimeMinutes * 5;
      completeQuest(activeQuest.taskId, activeQuest.id, bonusSparks, overtimeMinutes);
      setShowCompletion(activeQuest);
      setActiveQuest(null);
    }
  }, [activeQuest, completeQuest]);

  const handleContinueWithoutBreak = useCallback((overtimeMinutes = 0) => {
    if (activeQuest) {
      const bonusSparks = overtimeMinutes * 5;
      completeQuest(activeQuest.taskId, activeQuest.id, bonusSparks, overtimeMinutes);
      setActiveQuest(null);
    }
  }, [activeQuest, completeQuest]);

  const handleClaimReward = useCallback(() => {
    setShowCompletion(null);
    setShowBreak(true);
  }, []);

  const handleBreakDone = useCallback(() => {
    setShowBreak(false);
  }, []);

  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNext) * 100));

  return (
    <>
      {/* Focus Mode Overlay (Screen 5) */}
      {activeQuest && (
        <FocusSession
          quest={activeQuest}
          taskId={activeQuest.taskId}
          onComplete={handleQuestComplete}
          onContinueWithoutBreak={handleContinueWithoutBreak}
          onClose={() => setActiveQuest(null)}
        />
      )}

      {/* Quest Complete Overlay (Screen 6) */}
      {showCompletion && (
        <QuestComplete
          quest={showCompletion}
          onContinue={handleClaimReward}
          onContinueDirectly={() => setShowCompletion(null)}
        />
      )}

      {/* Variable Break Reward Overlay (Screen 7) */}
      {showBreak && <BreakReward onDone={handleBreakDone} />}

      <div className="page-container">
        {/* Header Greeting */}
        <div className="dashboard-hero-header animate-in">
          <div>
            <div className="dashboard-greeting-title">
              Good evening, {user.name}
              <Sparkles size={22} className="dashboard-greeting-icon" />
            </div>
            <p className="dashboard-greeting-sub">
              Ready to make a little progress today?
            </p>
          </div>

          <div className="dashboard-hero-speech-badge">
            <span className="dashboard-hero-speech-text">
              "Small steps create big results!"
            </span>
            <img
              src={getCompanionImage('idle')}
              alt="Companion"
              className="dashboard-hero-avatar-mini"
            />
          </div>
        </div>

        {/* Dashboard 2-column layout */}
        <div className="dashboard-ref-grid">
          {/* Main Column */}
          <div className="dashboard-ref-main">
            {/* Today's Quest Card */}
            <div className="dashboard-card-wrap animate-in" style={{ animationDelay: '0.05s' }}>
              <div className="section-label-row">
                <span className="section-label-main">Today's Quest</span>
                <span className="badge badge-high-priority">High Priority</span>
              </div>

              <div className="todays-quest-card">
                <div className="todays-quest-content">
                  <div className="todays-quest-icon-wrap">
                    <BookOpen size={24} color="var(--primary)" />
                  </div>
                  <div className="todays-quest-details">
                    <h3 className="todays-quest-title">
                      {todaysQuest.title}
                    </h3>
                    <div className="todays-quest-subtitle">
                      Complete Module 1 Quiz
                    </div>
                    <div className="todays-quest-meta">
                      <Clock size={14} />
                      <span>{todaysQuest.duration} min</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-start-quest"
                  onClick={() => handleStartQuest(todaysQuest)}
                >
                  <span>Start Quest</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines Card */}
            <div className="dashboard-card-wrap animate-in" style={{ animationDelay: '0.1s' }}>
              <div className="section-label-row">
                <span className="section-label-main">Upcoming Deadlines</span>
                <button className="section-link-btn" onClick={() => navigate('/tasks')}>
                  View all
                </button>
              </div>

              <div className="deadlines-list-card">
                {upcomingDeadlines.map((item) => (
                  <div key={item.id} className="deadline-row-item">
                    <div className="deadline-icon-wrap">
                      <Calendar size={18} color="var(--primary)" />
                    </div>
                    <div className="deadline-row-info">
                      <div className="deadline-row-name">{item.name}</div>
                      <div className="deadline-row-meta">
                        <span>{item.deadline}</span>
                        <span>·</span>
                        <span>{item.workload}</span>
                      </div>
                    </div>
                    <div className="deadline-row-tag">
                      <span className={`badge badge-${item.priorityBadge || 'primary'}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="dashboard-ref-sidebar">
            {/* Your Progress */}
            <div className="progress-summary-card animate-in" style={{ animationDelay: '0.08s' }}>
              <div className="section-label-row">
                <span className="section-label-main">Your Progress</span>
              </div>

              <div className="level-progress-box">
                <div className="level-progress-header">
                  <span className="level-title">Level {user.level}</span>
                  <span className="level-xp-text">{user.xp}/{user.xpToNext} EXP</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>

              {/* Streak Card */}
              <div className="streak-badge-card">
                <div className="streak-badge-icon">
                  <Flame size={22} color="var(--warning)" />
                </div>
                <div className="streak-badge-text">
                  <div className="streak-badge-days">{user.streak} days</div>
                  <div className="streak-badge-label">Current Streak</div>
                </div>
              </div>

              {/* Motivational Card with Companion Illustration */}
              <div className="motivational-companion-box">
                <div className="motivational-quote-speech">
                  "You don't have to finish it today. Just make a little progress."
                </div>
                <div className="motivational-mascot-wrap">
                  <img
                    src={getCompanionImage('idle')}
                    alt="Study Companion"
                    className="motivational-mascot-img"
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Button to Add Task */}
            <button
              className="btn btn-secondary btn-full-width"
              onClick={() => navigate('/add-task')}
            >
              <Layers size={16} />
              Add Assignment or Syllabus
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
