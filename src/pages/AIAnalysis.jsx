import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Lightbulb, Clock, Check, ArrowRight, Edit3,
  Calendar, Layers, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context';

export default function AIAnalysis() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks } = useApp();

  const [activeTab, setActiveTab] = useState('quests');
  const [showAllQuests, setShowAllQuests] = useState(false);

  const task = tasks.find(t => t.id === taskId) || tasks[0];

  const quests = task.quests || [];
  const displayQuests = showAllQuests ? quests : quests.slice(0, 4);

  const handleAcceptPlan = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="ai-plan-ready-container animate-in">
        {/* Header */}
        <div className="ai-plan-ready-header">
          <h1 className="ai-plan-ready-title">AI Plan Ready!</h1>
          <p className="ai-plan-ready-sub">
            Here's what we found for your {task.name}:
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="ai-metrics-cards-row">
          <div className="ai-metric-card">
            <div className="ai-metric-label">Estimated Workload</div>
            <div className="ai-metric-val">{task.workload || '4h 20m'}</div>
          </div>

          <div className="ai-metric-card">
            <div className="ai-metric-label">Difficulty</div>
            <div className="ai-metric-val ai-metric-dot-val">
              <span className="dot-indicator dot-medium" />
              <span>{task.difficulty || 'Medium'}</span>
            </div>
          </div>

          <div className="ai-metric-card">
            <div className="ai-metric-label">Priority</div>
            <div className="ai-metric-val ai-metric-dot-val">
              <span className="dot-indicator dot-priority" />
              <span>{task.priority || 'Start Soon'}</span>
            </div>
          </div>
        </div>

        {/* Insight Box: Why this is prioritized? */}
        <div className="ai-priority-insight-box">
          <div className="ai-insight-icon-wrap">
            <Lightbulb size={20} color="var(--primary)" />
          </div>
          <div className="ai-insight-body">
            <div className="ai-insight-heading">Why this is prioritized?</div>
            <p className="ai-insight-text">
              {task.aiReasoning ||
                'Your deadline is 7 days away, but the estimated workload is high enough that starting early will reduce the pressure later.'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Edit Plan | Accept Plan */}
        <div className="ai-plan-actions-row">
          <button
            className="btn btn-secondary btn-plan-edit"
            onClick={() => navigate('/add-task')}
          >
            <Edit3 size={15} />
            <span>Edit Plan</span>
          </button>

          <button
            className="btn btn-primary btn-plan-accept"
            onClick={handleAcceptPlan}
          >
            <span>Accept Plan</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Tabs: Quests Generated | Suggested Schedule */}
        <div className="ai-plan-tabs-row">
          <button
            className={`ai-plan-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            {quests.length} Quests Generated
          </button>
          <button
            className={`ai-plan-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Suggested Schedule
          </button>
        </div>

        {/* Quests List */}
        {activeTab === 'quests' ? (
          <div className="ai-generated-quests-list">
            {displayQuests.map((quest, index) => (
              <div key={quest.id} className="ai-quest-list-item">
                <div className="ai-quest-num-bubble">{index + 1}</div>
                <div className="ai-quest-item-details">
                  <div className="ai-quest-item-title">{quest.title}</div>
                  {quest.subtasks && quest.subtasks.length > 0 && (
                    <div className="ai-quest-subtasks-preview">
                      {quest.subtasks.map(st => (
                        <span key={st.id} className="ai-subtask-chip">
                          {st.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ai-quest-item-duration">
                  <Clock size={13} />
                  <span>{quest.duration} min</span>
                </div>
              </div>
            ))}

            {quests.length > 4 && !showAllQuests && (
              <button
                className="btn-view-all-quests"
                onClick={() => setShowAllQuests(true)}
              >
                View all quests ({quests.length})
              </button>
            )}
          </div>
        ) : (
          /* Suggested Schedule View */
          <div className="ai-schedule-timeline">
            <div className="schedule-day-group">
              <div className="schedule-day-title">Today (Sep 27)</div>
              <div className="schedule-item-card">
                <span>Module 1: Cloud Concepts + Quiz</span>
                <span className="badge badge-primary">20 min</span>
              </div>
            </div>
            <div className="schedule-day-group">
              <div className="schedule-day-title">Tomorrow (Sep 28)</div>
              <div className="schedule-item-card">
                <span>Module 2: AWS Core Services</span>
                <span className="badge badge-primary">25 min</span>
              </div>
            </div>
            <div className="schedule-day-group">
              <div className="schedule-day-title">Oct 1 - Oct 3</div>
              <div className="schedule-item-card">
                <span>Module 3: IAM & Security & Compute Services</span>
                <span className="badge badge-primary">55 min</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
