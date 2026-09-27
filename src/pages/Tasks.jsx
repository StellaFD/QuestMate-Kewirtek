import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Check, Play } from 'lucide-react';
import { useApp } from '../context';
import FocusSession from '../components/FocusSession';
import QuestComplete from '../components/QuestComplete';
import BreakReward from '../components/BreakReward';

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, completeQuest } = useApp();
  const [filter, setFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [showCompletion, setShowCompletion] = useState(null);
  const [showBreak, setShowBreak] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return t.completedQuests < t.totalQuests;
    if (filter === 'completed') return t.completedQuests >= t.totalQuests && t.totalQuests > 0;
    return true;
  });

  const handleStartQuest = (quest, task) => {
    setActiveQuest({ ...quest, taskId: task.id, taskName: task.name, course: task.course });
  };

  const handleQuestComplete = useCallback(() => {
    if (activeQuest) {
      completeQuest(activeQuest.taskId, activeQuest.id);
      setShowCompletion(activeQuest);
      setActiveQuest(null);
    }
  }, [activeQuest, completeQuest]);

  return (
    <>
      {activeQuest && (
        <FocusSession
          quest={activeQuest}
          taskId={activeQuest.taskId}
          onComplete={handleQuestComplete}
          onClose={() => setActiveQuest(null)}
        />
      )}
      {showCompletion && (
        <QuestComplete
          quest={showCompletion}
          onContinue={() => { setShowCompletion(null); setShowBreak(true); }}
        />
      )}
      {showBreak && <BreakReward onDone={() => setShowBreak(false)} />}

      <div className="page-container">
        <div className="tasks-header animate-in">
          <div>
            <h1>My Tasks</h1>
            <p className="page-header-sub">{tasks.length} tasks across your courses</p>
          </div>
          <div className="tasks-filters">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {filteredTasks.map((task, i) => {
            const isExpanded = expandedTask === task.id;
            const isComplete = task.completedQuests >= task.totalQuests && task.totalQuests > 0;
            const progress = task.totalQuests > 0 ? (task.completedQuests / task.totalQuests) * 100 : 0;

            return (
              <div
                key={task.id}
                className="animate-in"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div
                  className="task-list-item"
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                  style={isExpanded ? { borderColor: 'var(--lavender)', boxShadow: 'var(--shadow-md)' } : {}}
                >
                  <div className={`task-list-priority ${task.priority}`} />
                  <div className="task-list-body">
                    <div className="task-list-name">{task.name}</div>
                    <div className="task-list-course">{task.course}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div className="task-list-deadline">
                      {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {task.totalQuests > 0 && (
                      <div className="task-list-quests">
                        {task.completedQuests}/{task.totalQuests} quests
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded quest list */}
                {isExpanded && task.quests.length > 0 && (
                  <div style={{
                    marginTop: -1,
                    background: 'var(--card)',
                    border: '1px solid var(--lavender)',
                    borderTop: 'none',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    padding: 'var(--space-md) var(--space-lg)',
                  }}>
                    {/* Progress bar */}
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-xs)',
                      }}>
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-bar-fill ${isComplete ? 'cyan' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quests */}
                    {task.quests.map(quest => (
                      <div key={quest.id} className="quest-card" style={{ marginBottom: 'var(--space-xs)' }}>
                        <div className={`quest-card-check ${quest.done ? 'done' : ''}`}>
                          {quest.done && <Check size={14} />}
                        </div>
                        <div className="quest-card-body">
                          <div className="quest-card-title" style={quest.done ? { textDecoration: 'line-through', color: 'var(--text-tertiary)' } : {}}>
                            {quest.title}
                          </div>
                          <div className="quest-card-meta">
                            <Clock size={12} />
                            <span>{quest.duration} min</span>
                            <span>·</span>
                            <span>{quest.date}</span>
                          </div>
                        </div>
                        {!quest.done && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartQuest(quest, task);
                            }}
                          >
                            <Play size={14} /> Start
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: 32, display: 'flex', justifyContent: 'center' }}>
              <CheckSquare size={36} color="var(--primary)" />
            </div>
            <h3>No tasks here</h3>
            <p>
              {filter === 'completed'
                ? 'No completed tasks yet. Keep going!'
                : 'Add a task to get started.'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/add-task')}>
              Add Task
            </button>
          </div>
        )}
      </div>
    </>
  );
}
