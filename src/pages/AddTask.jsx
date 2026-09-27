import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Link as LinkIcon, Sparkles, X, CheckCircle2,
  Calendar, Check, ChevronDown, ArrowRight,
} from 'lucide-react';
import { useApp } from '../context';
import { TASK_TYPES } from '../data';

export default function AddTask() {
  const navigate = useNavigate();
  const { addTask, getCompanionImage } = useApp();

  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState({
    name: 'AWS Cloud Computing Course',
    course: 'Cloud Computing',
    type: 'Course / Learning',
    deadline: '2026-10-07',
    description: 'Complete all modules, quizzes and final assessment.',
    attachedFile: 'AWS_Module.pdf (2.4 MB)',
    link: 'https://classroom.google.com/c/aws-cloud-2026',
  });

  // State 2: Analyzing state (Screen 3)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(25);

  const steps = [
    'Reading course content',
    'Estimating workload',
    'Determining priority',
    'Creating micro-quests',
  ];

  const handleStartAnalysis = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisProgress(25);
  };

  useEffect(() => {
    if (!isAnalyzing) return;

    const timer1 = setTimeout(() => {
      setAnalysisStep(1);
      setAnalysisProgress(50);
    }, 700);

    const timer2 = setTimeout(() => {
      setAnalysisStep(2);
      setAnalysisProgress(75);
    }, 1400);

    const timer3 = setTimeout(() => {
      setAnalysisStep(3);
      setAnalysisProgress(95);
    }, 2100);

    const timer4 = setTimeout(() => {
      setAnalysisProgress(100);
      setTimeout(() => {
        navigate('/ai-analysis/t1');
      }, 500);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isAnalyzing, navigate]);

  return (
    <div className="page-container">
      {/* SCREEN 3: AI PLANNING / ANALYZING STATE */}
      {isAnalyzing ? (
        <div className="ai-planning-screen animate-in">
          <div className="ai-planning-header">
            <h1 className="ai-planning-title">
              <Sparkles size={24} className="ai-sparkle-icon" />
              Analyzing your task...
            </h1>
            <p className="ai-planning-sub">
              This might take a moment. We're looking at your course, deadline, and resources to create the best plan.
            </p>
          </div>

          <div className="ai-planning-mascot-wrap">
            <img
              src={getCompanionImage('focus')}
              alt="Analyzing Companion"
              className="ai-planning-mascot-img"
            />
          </div>

          {/* Sequential Checklist */}
          <div className="ai-planning-checklist">
            {steps.map((stepText, idx) => {
              const isDone = analysisStep >= idx;
              const isCurrent = analysisStep === idx;
              return (
                <div
                  key={idx}
                  className={`ai-planning-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="ai-step-indicator">
                    {isDone ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <span className="ai-step-dot" />
                    )}
                  </div>
                  <span className="ai-step-text">{stepText}</span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="ai-planning-progress-box">
            <div className="ai-progress-bar-wrap">
              <div
                className="ai-progress-bar-fill"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="ai-progress-label">{analysisProgress}%</div>
          </div>

          <div className="ai-planning-footer-badge">
            <Sparkles size={16} />
            <span>Almost there... This will be worth it!</span>
          </div>
        </div>
      ) : (
        /* SCREEN 2: ADD NEW TASK FORM */
        <div className="add-task-modal-card animate-in">
          {/* Header */}
          <div className="add-task-card-header">
            <h1 className="add-task-heading">Add New Task</h1>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => navigate('/')}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs: Basic | From Link / File */}
          <div className="add-task-tabs-row">
            <button
              className={`add-task-tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic
            </button>
            <button
              className={`add-task-tab ${activeTab === 'file' ? 'active' : ''}`}
              onClick={() => setActiveTab('file')}
            >
              From Link / File
            </button>
          </div>

          <form onSubmit={handleStartAnalysis} className="add-task-form-body">
            <div className="add-task-fields-grid">
              {/* Left Column: Form Fields */}
              <div className="add-task-fields-col">
                <div className="form-group">
                  <label className="form-label">Task Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. AWS Cloud Computing Course"
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Deadline *</label>
                    <div className="input-with-icon">
                      <input
                        type="date"
                        className="form-input"
                        value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                        required
                      />
                      <Calendar size={16} className="input-icon-right" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                    >
                      {TASK_TYPES.map(t => (
                        <option key={t.value} value={t.label}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Description <span className="label-opt">(optional)</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Complete all modules, quizzes and final assessment."
                  />
                </div>

                {/* Attach File Section */}
                <div className="form-group">
                  <label className="form-label">
                    Attach file <span className="label-opt">(optional)</span>
                  </label>
                  {form.attachedFile ? (
                    <div className="attached-file-pill">
                      <FileText size={16} color="var(--primary)" />
                      <span className="attached-file-name">{form.attachedFile}</span>
                      <button
                        type="button"
                        className="btn-remove-file"
                        onClick={() => setForm({ ...form, attachedFile: '' })}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="attach-dropzone-box"
                      onClick={() => setForm({ ...form, attachedFile: 'AWS_Module.pdf (2.4 MB)' })}
                    >
                      <span>Click to upload PDF, syllabus, or lecture slides</span>
                    </div>
                  )}
                </div>

                {/* Link Section */}
                <div className="form-group">
                  <label className="form-label">
                    Or add link <span className="label-opt">(optional)</span>
                  </label>
                  <div className="input-with-icon">
                    <LinkIcon size={16} className="input-icon-left" />
                    <input
                      type="url"
                      className="form-input form-input-with-icon"
                      value={form.link}
                      onChange={e => setForm({ ...form, link: e.target.value })}
                      placeholder="https://classroom.google.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Mascot Speech Callout */}
              <div className="add-task-companion-col">
                <div className="companion-callout-box">
                  <div className="companion-callout-speech">
                    I'll analyze this and create a plan for you!
                  </div>
                  <img
                    src={getCompanionImage('idle')}
                    alt="Study Companion"
                    className="companion-callout-img"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="add-task-actions-row">
              <button type="submit" className="btn btn-primary btn-analyze-cta">
                <Sparkles size={18} />
                <span>Analyze with AI</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
