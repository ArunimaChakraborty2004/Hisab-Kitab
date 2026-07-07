import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Volume2, Share2, PlayCircle, BookOpen } from 'lucide-react';
import { t } from "./translations";
import "./EducationHub.scss";

export default function EducationHub({ lang = 'en-IN' }) {
  const [lessons, setLessons] = useState([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const langCode = lang.split('-')[0] === 'hi' ? 'hi' : 'en';
        const res = await axios.get(`${API_BASE}/education?lang=${langCode}`);
        setLessons(res.data);
      } catch (err) {
        console.error("Failed to load lessons", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lang]);

  const readAloud = (e, text) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const targetLang = lang === 'en-IN' ? 'en-IN' : lang;
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.split('-')[0]));
      if (preferredVoice) utterance.voice = preferredVoice;
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const shareToWhatsApp = (e, title, summary) => {
    e.stopPropagation();
    const text = encodeURIComponent(`*${title}*\n${summary}\n\nLearn more on Hisab-Kitab!`);
    window.open(`https://wa.me/?text=\${text}`, '_blank');
  };

  const filtered = lessons.filter(l => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (l.title + " " + l.summary + " " + l.category).toLowerCase().includes(q);
  });

  return (
    <div className="edu-page">
      <div className="edu-bg-animation"></div>

      <div className="edu-header">
        <h1>📚 {t('Education', lang)}</h1>
        <div className="edu-search">
          <Search size={20} color="var(--text-secondary)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics..."
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="kyc-loading-spinner" style={{ borderColor: "rgba(139, 92, 246, 0.2)", borderTopColor: "#8b5cf6" }}></div>
          <div style={{ fontWeight: 600 }}>Loading lessons...</div>
        </div>
      ) : (
        <div className="edu-grid">
          {filtered.length === 0 && <div>No lessons found.</div>}
          
          {filtered.map(lesson => (
            <div key={lesson.id} className="edu-card" onClick={() => setActive(lesson)}>
              
              <div className="edu-thumbnail" style={{ background: `linear-gradient(135deg, ${lesson.thumbnailColor}88, ${lesson.thumbnailColor})` }}>
                <div className="edu-play-btn">
                  <div className="edu-play-icon"></div>
                </div>
              </div>

              <div className="edu-content">
                <div className="edu-title">{lesson.title}</div>
                <div className="edu-summary">{lesson.summary}</div>
                
                <div className="edu-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} /> {lesson.category}</span>
                  <span>⏱️ {lesson.readTime}</span>
                </div>

                <div className="edu-actions">
                  <button className="edu-action-btn read" onClick={(e) => readAloud(e, `${lesson.title}. ${lesson.summary}`)}>
                    <Volume2 size={18} /> Read
                  </button>
                  <button className="edu-action-btn share" onClick={(e) => shareToWhatsApp(e, lesson.title, lesson.summary)}>
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal View */}
      {active && (
        <div className="edu-modal-overlay" onClick={() => { setActive(null); window.speechSynthesis.cancel(); }}>
          <div className="edu-modal" onClick={e => e.stopPropagation()}>
            
            <button className="edu-close-btn" onClick={() => { setActive(null); window.speechSynthesis.cancel(); }}>✖</button>
            
            <div className="edu-modal-hero" style={{ background: `linear-gradient(135deg, ${active.thumbnailColor}88, ${active.thumbnailColor})` }}>
              <div className="edu-play-btn" style={{ transform: 'scale(1.5)' }}>
                <div className="edu-play-icon" style={{ marginLeft: 8 }}></div>
              </div>
            </div>

            <div className="edu-modal-content">
              <h2>{active.title}</h2>
              
              <div className="edu-meta" style={{ marginBottom: 24, fontSize: 15, justifyContent: 'flex-start', gap: 16 }}>
                <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: 20 }}>{active.category}</span>
                <span>⏱️ {active.readTime}</span>
              </div>

              <div className="edu-modal-body">
                {active.content}
              </div>

              <div className="edu-actions" style={{ marginTop: 32, borderTop: 'none' }}>
                <button className="edu-action-btn read" onClick={(e) => readAloud(e, active.content)}>
                  <Volume2 size={20} /> Read Full Lesson
                </button>
                <button className="edu-action-btn share" onClick={(e) => shareToWhatsApp(e, active.title, active.content)}>
                  <Share2 size={20} /> Share to Family
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
