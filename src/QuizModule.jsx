import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Volume2, CheckCircle2, XCircle, Award, Heart, RefreshCw,
  Languages, Lock, Play, Map, Star, Zap, Trophy, Flame,
  ChevronRight, Shield, PiggyBank, Landmark, TrendingUp
} from 'lucide-react';
import './QuizModule.scss';

const API_BASE = 'http://localhost:5000/api';

const LEVELS = [
  { num: 1, title: 'Security',   desc: 'Protect yourself from fraud', icon: <Shield size={28}/>,     color: '#ef4444', bg: 'linear-gradient(135deg,#ef4444,#dc2626)' },
  { num: 2, title: 'Banking',    desc: 'Master digital payments',      icon: <Landmark size={28}/>,   color: '#3b82f6', bg: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { num: 3, title: 'Savings',    desc: 'Build your money habit',       icon: <PiggyBank size={28}/>,  color: '#10b981', bg: 'linear-gradient(135deg,#10b981,#059669)' },
  { num: 4, title: 'Investment', desc: 'Grow your wealth safely',      icon: <TrendingUp size={28}/>, color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
];

const LANG_OPTIONS = [
  { code:'en', label:'English' },
  { code:'hi', label:'हिंदी' },
  { code:'mr', label:'मराठी' },
  { code:'kn', label:'ಕನ್ನಡ' },
  { code:'ta', label:'தமிழ்' },
  { code:'te', label:'తెలుగు' },
  { code:'bn', label:'বাংলা' },
  { code:'gu', label:'ગુજરાતી' },
];

const XP_PER_CORRECT  = 20;
const XP_PER_COMPLETE = 50;

export default function QuizModule({ lang = 'en-IN' }) {
  const initLang = lang.split('-')[0];
  const [localLang, setLocalLang]       = useState(LANG_OPTIONS.find(l=>l.code===initLang) ? initLang : 'en');
  const [activeLevel, setActiveLevel]   = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [totalXP, setTotalXP]           = useState(0);
  const [streak, setStreak]             = useState(0);

  const [questions, setQuestions]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore]               = useState(0);
  const [lives, setLives]               = useState(3);
  const [isFinished, setIsFinished]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [xpGained, setXpGained]         = useState(0);
  const [showXPPop, setShowXPPop]       = useState(false);
  const [answerAnim, setAnswerAnim]     = useState('');   // 'correct' | 'wrong'
  const timerRef = useRef(null);

  const fetchQuestions = async (lvl) => {
    setLoading(true);
    setActiveLevel(lvl);
    try {
      const res = await axios.get(`${API_BASE}/quiz/generate?lang=${localLang}&level=${lvl}`);
      setQuestions(res.data);
      setCurrentIndex(0);
      setSelectedOption(null);
      setScore(0);
      setLives(3);
      setIsFinished(false);
      setXpGained(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeLevel !== 0) fetchQuestions(activeLevel);
  }, [localLang]);

  const readAloud = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const langMap = { hi:'hi-IN', mr:'mr-IN', kn:'kn-IN', ta:'ta-IN', te:'te-IN', bn:'bn-IN', gu:'gu-IN' };
    u.lang = langMap[localLang] || 'en-IN';
    window.speechSynthesis.speak(u);
  };

  const triggerXPPop = () => {
    setShowXPPop(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowXPPop(false), 1200);
  };

  const handleSelect = (option) => {
    if (selectedOption || isFinished) return;
    setSelectedOption(option);

    if (option.isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      const gained = XP_PER_CORRECT + (streak >= 2 ? 10 : 0);
      setXpGained(g => g + gained);
      setTotalXP(x => x + gained);
      setAnswerAnim('correct');
      triggerXPPop();
    } else {
      setLives(l => l - 1);
      setStreak(0);
      setAnswerAnim('wrong');
    }
    setTimeout(() => setAnswerAnim(''), 600);
  };

  const handleNext = () => {
    if (lives <= 0) { setIsFinished(true); return; }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      // Completed!
      const bonus = XP_PER_COMPLETE;
      setTotalXP(x => x + bonus);
      setXpGained(g => g + bonus);
      setIsFinished(true);
      if (score >= Math.floor(questions.length / 2)) {
        setUnlockedLevel(prev => Math.max(prev, activeLevel + 1));
        if (!completedLevels.includes(activeLevel)) {
          setCompletedLevels(prev => [...prev, activeLevel]);
        }
      }
    }
  };

  // ── JOURNEY MAP ───────────────────────────────────────────────
  if (activeLevel === 0) {
    return (
      <div className="quiz-module">
        <div className="quiz-bg-orbs">
          <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
        </div>

        <div className="quiz-map-container">
          {/* Header */}
          <div className="quiz-map-header">
            <div className="map-title-wrap">
              <Trophy size={28} className="map-trophy"/>
              <div>
                <h1 className="map-title">Financial Mastery</h1>
                <p className="map-subtitle">Complete levels to earn XP &amp; unlock rewards</p>
              </div>
            </div>
            <div className="map-stats">
              <div className="xp-badge">
                <Zap size={16}/> {totalXP} XP
              </div>
              {streak > 0 && <div className="streak-badge"><Flame size={16}/> {streak} streak</div>}
              <div className="lang-selector-wrap">
                <Languages size={15}/>
                <select value={localLang} onChange={e=>setLocalLang(e.target.value)} className="lang-select-glass">
                  {LANG_OPTIONS.map(l=>(
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Journey Path */}
          <div className="journey-path-wrap">
            <div className="journey-line"/>
            {LEVELS.map((lv, i) => {
              const isLocked    = lv.num > unlockedLevel;
              const isCompleted = completedLevels.includes(lv.num);
              const isCurrent   = lv.num === unlockedLevel;
              return (
                <div key={lv.num} className={`journey-stop ${i%2===0?'stop-left':'stop-right'}`}>
                  <div className={`stop-node ${isLocked?'locked':isCompleted?'completed':isCurrent?'current':''}`}
                    style={!isLocked ? {'--level-color': lv.color, '--level-bg': lv.bg} : {}}
                    onClick={() => !isLocked && fetchQuestions(lv.num)}
                  >
                    {isLocked
                      ? <Lock size={24}/>
                      : isCompleted
                        ? <CheckCircle2 size={28}/>
                        : <div className="node-inner">{lv.icon}</div>
                    }
                    {isCurrent && <div className="pulse-ring"/>}
                  </div>

                  <div className={`stop-label ${i%2===0?'label-right':'label-left'}`}>
                    <span className="stop-level">Level {lv.num}</span>
                    <strong className="stop-title">{lv.title}</strong>
                    <span className="stop-desc">{isLocked ? '🔒 Locked' : lv.desc}</span>
                    {!isLocked && (
                      <button
                        className="stop-play-btn"
                        style={!isLocked ? {background: lv.bg} : {}}
                        onClick={() => fetchQuestions(lv.num)}
                      >
                        {isCompleted ? <><RefreshCw size={14}/> Replay</> : <><Play size={14} fill="white"/> Play</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP Progress Bar */}
          <div className="xp-progress-section">
            <div className="xp-progress-label">
              <Star size={14}/> Your Progress
              <span className="xp-total">{totalXP} / 400 XP</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{width: `${Math.min((totalXP/400)*100,100)}%`}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────
  if (loading) return (
    <div className="quiz-module">
      <div className="quiz-loading-screen">
        <div className="loading-spinner"/>
        <p>Loading Quiz...</p>
      </div>
    </div>
  );

  if (!questions.length) return (
    <div className="quiz-module">
      <div className="quiz-loading-screen">
        <p>No questions available. Try again.</p>
        <button className="quiz-pill-btn" onClick={() => setActiveLevel(0)}>← Back to Map</button>
      </div>
    </div>
  );

  const currentQ  = questions[currentIndex];
  const progress  = ((currentIndex) / questions.length) * 100;
  const levelInfo = LEVELS.find(l => l.num === activeLevel) || LEVELS[0];

  // ── RESULT SCREEN ─────────────────────────────────────────────
  if (isFinished) {
    const passed = score >= Math.floor(questions.length / 2);
    return (
      <div className="quiz-module">
        <div className="quiz-bg-orbs">
          <div className="orb orb-1"/><div className="orb orb-2"/>
        </div>
        <div className="quiz-result-card">
          <div className="result-trophy-wrap">
            {passed
              ? <div className="result-trophy win"><Trophy size={56}/></div>
              : <div className="result-trophy lose"><XCircle size={56}/></div>
            }
          </div>
          <h2 className="result-title">{passed ? '🎉 Level Complete!' : 'Keep Trying!'}</h2>
          <p className="result-subtitle">
            {passed
              ? `You answered ${score} of ${questions.length} correctly.`
              : `You scored ${score} of ${questions.length}. Need ${Math.floor(questions.length/2)+1} to pass.`
            }
          </p>

          <div className="result-stats-row">
            <div className="result-stat">
              <Star size={20} color="#f59e0b"/>
              <strong>+{xpGained} XP</strong>
              <span>Earned</span>
            </div>
            <div className="result-stat">
              <Heart size={20} color="#ef4444"/>
              <strong>{lives}</strong>
              <span>Lives Left</span>
            </div>
            <div className="result-stat">
              <CheckCircle2 size={20} color="#10b981"/>
              <strong>{score}/{questions.length}</strong>
              <span>Score</span>
            </div>
          </div>

          {passed && activeLevel < 4 && (
            <div className="result-unlock-banner">
              <Zap size={16}/> Level {activeLevel+1} unlocked!
            </div>
          )}

          <div className="result-actions">
            <button className="quiz-pill-btn primary" onClick={() => fetchQuestions(activeLevel)}>
              <RefreshCw size={16}/> Retry
            </button>
            <button className="quiz-pill-btn secondary" onClick={() => setActiveLevel(0)}>
              <Map size={16}/> Map
            </button>
            {passed && activeLevel < 4 && (
              <button className="quiz-pill-btn accent" onClick={() => fetchQuestions(activeLevel+1)}>
                Next Level <ChevronRight size={16}/>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ VIEW ─────────────────────────────────────────────────
  return (
    <div className={`quiz-module ${answerAnim}`}>
      <div className="quiz-bg-orbs">
        <div className="orb orb-1"/><div className="orb orb-2"/>
      </div>

      {/* XP Pop animation */}
      {showXPPop && (
        <div className="xp-pop">+{XP_PER_CORRECT + (streak >= 2 ? 10 : 0)} XP{streak >= 2 ? ' 🔥' : ''}</div>
      )}

      <div className="quiz-play-card">
        {/* Top Bar */}
        <div className="quiz-topbar">
          <button className="quiz-back-btn" onClick={() => setActiveLevel(0)}>
            <Map size={16}/> Map
          </button>

          <div className="quiz-lives">
            {[0,1,2].map(i => (
              <Heart key={i} size={22} className={`heart ${i < lives ? 'full' : 'empty'}`}/>
            ))}
          </div>

          <div className="quiz-xp-counter">
            <Zap size={14}/> {totalXP + xpGained} XP
          </div>

          <div className="lang-selector-wrap compact">
            <Languages size={14}/>
            <select value={localLang} onChange={e=>setLocalLang(e.target.value)} className="lang-select-glass">
              {LANG_OPTIONS.map(l=>(
                <option key={l.code} value={l.code}>{l.code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="quiz-progress-wrap">
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{width:`${progress}%`, background: levelInfo.bg}}/>
          </div>
          <span className="quiz-progress-label">{currentIndex+1}/{questions.length}</span>
        </div>

        {/* Category Pill */}
        <div className="quiz-category-pill" style={{background: levelInfo.bg}}>
          {levelInfo.icon} {currentQ.category}
        </div>

        {/* Question */}
        <div className="quiz-question-area">
          <button className="quiz-tts-btn" onClick={() => readAloud(currentQ.question)} title="Read aloud">
            <Volume2 size={20}/>
          </button>
          <p className="quiz-question-text">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="quiz-options-grid">
          {currentQ.options.map((opt, idx) => {
            let cls = '';
            if (selectedOption) {
              if (opt.isCorrect)                  cls = 'opt-correct';
              else if (selectedOption.id===opt.id) cls = 'opt-wrong';
            }
            return (
              <button
                key={opt.id}
                className={`quiz-option ${cls}`}
                onClick={() => handleSelect(opt)}
                disabled={!!selectedOption}
              >
                <span className="opt-letter">{String.fromCharCode(65+idx)}</span>
                <span className="opt-text">{opt.text}</span>
                {cls==='opt-correct' && <CheckCircle2 size={20} className="opt-icon"/>}
                {cls==='opt-wrong'   && <XCircle size={20} className="opt-icon"/>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selectedOption && (
          <div className={`quiz-feedback ${selectedOption.isCorrect ? 'fb-correct' : 'fb-wrong'}`}>
            <div className="fb-header">
              {selectedOption.isCorrect
                ? <><CheckCircle2 size={18}/> Correct!</>
                : <><XCircle size={18}/> Oops!</>
              }
            </div>
            <p className="fb-explanation">{selectedOption.explanation}</p>
            <button className="quiz-continue-btn" style={{background: levelInfo.bg}} onClick={handleNext}>
              {lives <= 1 && !selectedOption.isCorrect ? 'Game Over' : currentIndex === questions.length-1 ? 'See Results' : 'Continue'} <ChevronRight size={16}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
