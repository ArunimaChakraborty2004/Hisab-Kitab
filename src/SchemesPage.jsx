import React, { useState, useEffect } from 'react'
import { t } from './translations'
import { Mic, Volume2, Share2 } from 'lucide-react'
import './SchemesPage.scss'

export default function SchemesPage({ lang = 'en-IN' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('./api/schemesApi').then(api => {
      api.getSchemes().then(data => {
        if (data && data.length > 0) setSchemes(data)
        setLoading(false)
      })
    })
  }, [])

  function open(url) {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (win) win.focus()
  }

  // Voice Search (Speech Recognition)
  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en-IN' ? 'en-IN' : lang; // Adjust as needed
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setSearchQuery(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Text-to-Speech
  const readAloud = (title, desc) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(`${title}. ${desc}`);
    
    // Sometimes strict language codes cause it to fail silently if the voice isn't installed.
    // Try to find a voice that matches the language, otherwise use default.
    const voices = window.speechSynthesis.getVoices();
    const targetLang = lang === 'en-IN' ? 'en-IN' : lang; // e.g. hi-IN
    
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.split('-')[0]));
      if (preferredVoice) utterance.voice = preferredVoice;
    }
    
    // Set some default properties to make it sound better
    utterance.rate = 0.9; 
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  // WhatsApp Share
  const shareToWhatsApp = (title, link) => {
    const text = encodeURIComponent(`Check out this Government Scheme: ${title}\nApply here: ${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = filterType === 'all' || s.category === filterType
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="schemes-page">
      <div className="sch-bg-animation"></div>

      <div className="sch-hero">
        <h2>{t('Schemes', lang)}</h2>
        <p>Discover government benefits, financial aids, and empowerment programs tailored for you.</p>
      </div>

      <div className="sch-controls">
        <div className="sch-search">
          <div className="sch-search-wrap" style={{ position: 'relative' }}>
            <span className="icon" style={{ position: 'absolute', left: 12, top: 10 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search schemes..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 40 }}
            />
            <button 
              className="icon-btn" 
              onClick={startListening}
              title="Voice Search"
              style={{ position: 'absolute', right: 8, top: 8, color: isListening ? 'red' : 'inherit' }}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>

        <div className="sch-filters">
          <button className={`sch-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Schemes</button>
          <button className={`sch-filter-btn ${filterType === 'business' ? 'active' : ''}`} onClick={() => setFilterType('business')}>Business & Loans</button>
          <button className={`sch-filter-btn ${filterType === 'health' ? 'active' : ''}`} onClick={() => setFilterType('health')}>Health & Safety</button>
          <button className={`sch-filter-btn ${filterType === 'savings' ? 'active' : ''}`} onClick={() => setFilterType('savings')}>Savings</button>
          <button className={`sch-filter-btn ${filterType === 'general' ? 'active' : ''}`} onClick={() => setFilterType('general')}>General</button>
        </div>
      </div>

      <div className="sch-grid">
        {loading ? (
          <div className="sch-empty">
            <h3>Loading schemes...</h3>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="sch-empty">
            <div className="icon">🔍</div>
            <h3>No schemes found</h3>
            <p>Try adjusting your filters or search for something else.</p>
          </div>
        ) : (
          filteredSchemes.map((s, index) => (
            <div className="sch-card" key={s._id || s.id || index} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="sch-card-header">
                <div className="sch-icon-wrap">{s.icon}</div>
                <div>
                  <h3 className="sch-title">{s.title}</h3>
                  <span className={`sch-badge ${s.category}`}>
                    {s.category === 'business' ? 'Business' : 
                     s.category === 'health' ? 'Health & Safety' : 
                     s.category === 'savings' ? 'Savings' : 'General'}
                  </span>
                </div>
              </div>
              <p className="sch-desc">{s.desc}</p>
              <div className="sch-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button className="secondary-btn" onClick={() => open(s.link)}>Details</button>
                <button className="primary-btn" onClick={() => open(s.link)}>{t('ApplyNow', lang)}</button>
                <button className="icon-btn" title="Read Aloud" onClick={() => readAloud(s.title, s.desc)}>
                  <Volume2 size={18} color="#3b82f6" />
                </button>
                <button className="icon-btn" title="Share to WhatsApp" onClick={() => shareToWhatsApp(s.title, s.link)}>
                  <Share2 size={18} color="#10b981" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
