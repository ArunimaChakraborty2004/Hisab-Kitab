// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'
import TextFallback from './TextFallback'
import TTSControls from './TTSControls'
import SchemesPage from './SchemesPage'
import TransactionsPage from './TransactionsPage'
import SavingsSimulator from './SavingsSimulator'
import KYCPage from './KYCPage'
import EducationHub from './EducationHub'
import QuizModule from './QuizModule'
import HelpSupport from './HelpSupport'
import ProfilePage from './ProfilePage'
import AppShell from './AppShell'
import Chatbot from './Chatbot' // Chatbot (mock/demo) imported
import { ArrowUpRight, BadgeCheck, Landmark, Mic, ShieldCheck, TrendingUp, UserCircle, WalletCards } from 'lucide-react'
import { t } from './translations'

function AppLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-color)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeOut 0.5s ease 1.5s forwards'
    }}>
      <img src="/assets/logo.png?v=2" alt="Hisab-Kitab logo" onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ width: 80, height: 80, borderRadius: 20, animation: 'pulseLogo 1.5s ease-in-out', border: '1px solid var(--glass-border)', objectFit: 'cover', background: '#fff' }} />
      <div style={{ marginTop: 24, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Hisab-Kitab</div>
      <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>{t('Tagline1', 'en-IN')}</div>
    </div>
  )
}

// inside src/App.jsx (add near top, below imports)
// put this near the top of src/App.jsx (below imports)
// MiniChat component - paste below imports in src/App.jsx
function MiniChat({ lang = 'en-IN', speak = false }) {
  // wrapper
  const outer = {
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
    marginTop: 16,
  };

  // card
  const card = {
    width: 360,
    maxWidth: '92vw',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
    border: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'Inter, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  // header
  const header = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'var(--bg-color)',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--glass-border)'
  };

  const avatarWrap = {
    width: 46,
    height: 46,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--glass-hover)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    flex: '0 0 46px'
  };

  const title = { fontWeight: 800, fontSize: 15, lineHeight: 1 };
  const subtitle = { fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 };

  // body: clamp & scroll
  const bodyWrap = {
    padding: 12,
    background: 'var(--bg-color)',
    minHeight: 160,
    maxHeight: 320,       // adjust as needed
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  // ensure inner chat doesn't overflow horizontally
  const innerChatWrapper = {
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
  };

  const footer = {
    padding: '8px 12px',
    borderTop: '1px solid var(--glass-border)',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-color)'
  };

  return (
    <div style={outer}>
      <div style={card} role="region" aria-label="Mini Chatbot">
        <div style={header}>
          <div style={avatarWrap} aria-hidden>
            <span style={{ fontSize: 20 }}>🤖</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={title}>{t('AskMe', lang)}</div>
            <div style={subtitle}>{t('Conversation', lang)} • {lang}</div>
          </div>

          <div>
            <button
              onClick={() => {
                // placeholder: you can hook this up to reset Chatbot via refs/context
                console.log('MiniChat: reset pressed');
                // optional: dispatch a custom event if Chatbot listens for it:
                // window.dispatchEvent(new CustomEvent('miniChatReset'));
              }}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: "var(--text-primary)",
                border: 'none',
                padding: '6px 10px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12
              }}
              title={t('Reset', lang)}
            >
              {t('Reset', lang)}
            </button>
          </div>
        </div>

        <div style={bodyWrap}>
          <div style={innerChatWrapper}>
            {/* Wrap Chatbot to constrain its layout.
                Pass compact=true so Chatbot can render a slim UI (if it supports that prop).
                If Chatbot doesn't support 'compact', it will still render — wrapper prevents overflow.
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Chatbot lang={lang} speak={speak} compact={true} />
            </div>
          </div>
        </div>

        <div style={footer}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('OfflineDemo', lang)}</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigator.clipboard?.writeText(t('SampleCommandText', lang))}
              style={{
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)',
                padding: '6px 10px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              {t('CopySample', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const SAMPLE_COMMANDS = {
  "en-IN": ["balance", "send 200 to Sita", "which schemes are for me"],
  "hi-IN": ["पैसे भेजो", "बैलेंस बताओ", "कौन सा योजना मिल सकती है"],
  "kn-IN": ["ಹಣ ಕಳುಹಿಸಿ", "ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಸಿ", "ಯೋಜನೆಗಳಿವ"],
  "ta-IN": ["பணம் அனுப்பு", "பண விவரம்", "யோஜனைகள் என்ன"],
  "mr-IN": ["पैसे पाठवा", "बॅलन्स सांगा", "कोणती योजना मिळेल"],
  "bn-IN": ["টাকা দাও", "ব্যালেন্স জানাও", "কোনো স্কিম আছে"]
}

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'bn-IN', label: 'Bengali' },
];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function App(){
  const [isLoading, setIsLoading] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const [lang, setLang] = useState('en-IN')
  const [ttsRate, setTtsRate] = useState(1)
  const [route, setRoute] = useState('home')

  const lastBotRef = useRef('')
  const recognitionRef = useRef(null)
  const autoStopTimerRef = useRef(null)

  function addMessage(text, who='bot'){
    setMessages(m => [...m, {who, text}])
    if(who==='bot') lastBotRef.current = text
  }

  function speakText(text){
    if(!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = ttsRate || 1
    window.speechSynthesis.speak(u)
  }

  function handleRepeat(){
    if(lastBotRef.current) speakText(lastBotRef.current)
  }

  function toggleListen(){
    setIsListening(l => {
      const next = !l
      // If starting, start auto-stop timer (safety)
      if(next) {
        if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current)
        autoStopTimerRef.current = setTimeout(() => setIsListening(false), 12000) // auto-stop after 12s
      } else {
        if (autoStopTimerRef.current) { clearTimeout(autoStopTimerRef.current); autoStopTimerRef.current = null }
      }
      return next
    })
  }

  // EFFECT HOOK TO MANAGE SPEECH RECOGNITION LIFECYCLE
  useEffect(() => {
    // Dismiss loader after 1.8 seconds
    const loaderTimer = setTimeout(() => setIsLoading(false), 1800);

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return () => clearTimeout(loaderTimer);
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang; // Recognition language is set by state
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage(transcript, 'user');
      processText(transcript);
      setIsListening(false); 
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
         addMessage("Microphone access denied. Please enable it in your browser settings.", 'bot');
      } else {
         addMessage("I couldn't hear you. Please try again.", 'bot');
      }
    };

    recognition.onend = () => {
      // ensure listening state remains consistent
      if(isListening) {
          setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition; 

    return () => {
      try { recognition.stop(); } catch(e) {}
      clearTimeout(loaderTimer);
    };
  }, [lang]); // Re-initialize recognition when language changes

  // EFFECT HOOK TO START/STOP LISTENING BASED ON STATE
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        if (e.message !== 'recognition has already started') {
          console.error("Error starting recognition:", e);
        }
      }
    } else {
      try { recognition.stop(); } catch(e) {}
    }
  }, [isListening]); 


  async function processText(text){
    const t = text.toLowerCase()
    const balanceKeywords = ['balance','बैलेंस','ಬ್ಯಾಲೆನ್ಸ್','பண','ব্যালেন্স','बॅलन्स']
    const sendKeywords = ['send','transfer','pay','पैसे','ಕಳುಹಿಸಿ','पाठवा','টাকা','ಅನುಪ್ಪು']
    const schemeKeywords = ['scheme','योजना','ಯೋಜನೆ','யோஜனை','স্কিম','कोण']
    const kycKeywords = ['kyc','aadhar','id','verify','सत्यापित','ನವೀಕರಣ','உறுতিசெய்']

    if(balanceKeywords.some(k=>t.includes(k))){
      const rep = `${t('YourBalanceIs', lang)} ${new Intl.NumberFormat(lang, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(5000)}`
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(sendKeywords.some(k=>t.includes(k)) && /\d+/.test(t)){
      const amount = t.match(/(\d+)/)[1]
      const beneficiary = 'saved contact'
      const confirm = `${t('ConfirmSend', lang)} ${new Intl.NumberFormat(lang, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount))} ${t('To', lang)} ${beneficiary}?`
      addMessage(confirm,'bot'); speakText(confirm); return
    }
    if(schemeKeywords.some(k=>t.includes(k))){
      const rep = `${t('EligibleForSchemes', lang)} ${new Intl.NumberFormat(lang).format(2)}: PMJDY and Sukanya Samriddhi`
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(kycKeywords.some(k=>t.includes(k))){
      const rep = t('KycUploadAadhaar', lang)
      addMessage(rep,'bot'); speakText(rep); return
    }

    const def = {
      "en-IN":"I didn't understand fully. Try 'balance' or 'send 200 to Sita'.",
      "hi-IN":"मैं समझा नहीं। कहें: 'बैलेंस' या 'पैसे भेजो'।",
      "kn-IN":"ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. 'ಬ್ಯಾಲೆನ್ಸ್' ಅಥವಾ 'ಹಣ ಕಳುಹಿಸಿ' ಹೇಳಿ.",
      "ta-IN":"நான் புரிந்துகொள்ளவில்லை. 'பண விவரம்' அல்லது 'பணம் அனுப்பு' என்று சொல்.",
      "mr-IN":"मला समजले नाही। 'बॅलन्स' किंवा 'पैसे पाठवा' म्हणा।",
      "bn-IN":"আমি বুঝতে পারিনি। বলুন: 'ব্যালেন্স' বা 'টাকা দাও'।"
    }
    const reply = def[lang]||def['en-IN']
    addMessage(reply,'bot'); speakText(reply)
  }

  function renderSamples(){
    const list = SAMPLE_COMMANDS[lang] || SAMPLE_COMMANDS['en-IN']
    return list.map((s,i)=> <div key={i} className='sample-pill' onClick={() => { addMessage(s, 'user'); processText(s); }}>{s}</div>)
  }

  const dashboardStats = [
    { labelKey: 'AvailableBalance', valueType: 'currency', value: 5000, metaKey: 'MonthlyUp12', icon: <WalletCards size={20} /> },
    { labelKey: 'SavingsGoal', valueType: 'percent', value: 68, metaKey: 'SavingsLeft', metaValue: 1600, icon: <TrendingUp size={20} /> },
    { labelKey: 'SchemeMatches', valueType: 'count', value: 2, metaKey: 'ReadyToApply', icon: <Landmark size={20} /> },
    { labelKey: 'KYCStatus', valueType: 'text', valueKey: 'Secure', metaKey: 'VerifiedProfile', icon: <BadgeCheck size={20} /> }
  ]

  const formatMoney = (value) => new Intl.NumberFormat(lang, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
  const formatPercent = (value) => new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 0 }).format(value / 100)
  const formatCount = (value) => new Intl.NumberFormat(lang).format(value)

  function DiagnosticsPanel({ onTestTranscript, lang }) {
    const [txt, setTxt] = useState('')
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('Diagnostics', lang)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={txt}
            onChange={e => setTxt(e.target.value)}
            placeholder={t('TypeTest', lang)}
          />
          <button
            className="primary-btn"
            onClick={() => { if (txt.trim()) { onTestTranscript(txt.trim()); setTxt('') } }}
          >
            {t('SendBtn', lang)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <AppLoader />}
      <div className="app">
      
      <AppShell route={route} setRoute={setRoute} lang={lang}>
        
        {/* Render selected page */}
        {route === 'home' ? (
          <>
          <section className="dashboard-hero">
            <div className="hero-copy">
              <div className="hero-kicker"><ShieldCheck size={16} /> {t('VoiceFirstMoneySupport', lang)}</div>
              <h2>{t('DailyMoneyView', lang)}</h2>
              <p>{t('AskBalanceTransfer', lang)}</p>
            </div>
            <div className="hero-balance">
              <span>{t('Today', lang)}</span>
              <strong>{formatMoney(5000)}</strong>
              <small>{t('HealthySpendingPace', lang)}</small>
            </div>
          </section>

          <section className="stat-grid" aria-label="Dashboard summary">
            {dashboardStats.map((stat) => (
              <div className="stat-card" key={stat.labelKey}>
                <div className="stat-icon">{stat.icon}</div>
                <div>
                  <div className="stat-label">{t(stat.labelKey, lang)}</div>
                  <div className="stat-value">
                    {stat.valueType === 'currency' ? formatMoney(stat.value) : stat.valueType === 'percent' ? formatPercent(stat.value) : stat.valueType === 'count' ? formatCount(stat.value) : t(stat.valueKey, lang)}
                  </div>
                  <div className="stat-meta">
                    <ArrowUpRight size={13} />
                    {stat.metaKey === 'SavingsLeft'
                      ? `${formatMoney(stat.metaValue)} ${t('SavingsLeft', lang)}`
                      : t(stat.metaKey, lang)}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="dashboard-grid">
            
            {/* LEFT COLUMN: Main Interactions */}
            <div className="dashboard-column">
              <section className="card conversation-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 480 }}>
                <div className="section-heading">
                  <div>
                    <p>{t('Assistant', lang)}</p>
                    <h2>{t('Conversation', lang)}</h2>
                  </div>
                  <span className="live-badge">{t('Live', lang)}</span>
                </div>
                <div className="conversation" aria-live="polite" style={{ flex: 1, marginBottom: 16 }}>
                  <div className="messages">
                    {messages.length === 0 && (
                      <div className="empty-chat">
                        <Mic size={24} />
                        <strong>{t('StartWithVoice', lang)}</strong>
                        <span>{t('TrySample', lang)}</span>
                      </div>
                    )}
                    {messages.map((m, i)=>(<div key={i} className={`msg ${m.who==='user'?'user':'bot'}`}>{m.text}</div>))}
                  </div>
                </div>
                
                {/* Unified text input attached directly to the main conversation */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
                  <TextFallback templates={SAMPLE_COMMANDS[lang]} onSubmit={(txt) => { addMessage(txt, 'user'); processText(txt); }} lang={lang} />
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Controls & Setup */}
            <div className="dashboard-column">
              <section className="card action-card">
                <div className="actions-header" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="avatar" style={{ background: "var(--glass-hover)", border: "1px solid var(--glass-border)", boxShadow: "none" }}><UserCircle size={32} color="var(--text-primary)" /></div>
                    <div>
                      <div className="instructions" style={{ fontWeight: 600, fontSize: 18 }}>{t('AskMe', lang)}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('AboutMoney', lang)}</div>
                    </div>
                  </div>
                  
                  <div className="samples" aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {renderSamples()}
                  </div>
                  
                  {/* Language Selector UI */}
                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('SelectLanguage', lang)}</label>
                    <select 
                      value={lang} 
                      onChange={(e) => setLang(e.target.value)}
                      style={{ marginTop: 8 }}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <DiagnosticsPanel onTestTranscript={(txt) => { addMessage(txt, 'user'); processText(txt); }} lang={lang} />

                  <TTSControls rate={ttsRate} onChangeRate={(r) => setTtsRate(r)} onRepeat={handleRepeat} lang={lang} />
                </div>
              </section>
            </div>

          </div>
          </>
        ) : route === 'transactions' ? (
          <TransactionsPage lang={lang} /> // ✅ lang prop added
        ) : route === 'schemes' ? (
          <SchemesPage lang={lang} />      // ✅ lang prop added
        ) : route === 'savings' ? (
          <SavingsSimulator lang={lang} /> // ✅ lang prop added
        ) : route === 'kyc' ? (
          <KYCPage lang={lang} />          // ✅ lang prop added
        ) : route === 'education' ? (
          <EducationHub lang={lang} />     // ✅ lang prop added
        ) : route === 'quiz' ? (
          <QuizModule lang={lang} />       // ✅ lang prop added
        ) : route === 'help' ? (
          <HelpSupport lang={lang} />      // KEEP HelpSupport intact
        ) : route === 'profile' ? (
          <ProfilePage lang={lang} />      // ✅ lang prop added
        ) : null}

      </AppShell>

      {/* ---------- Floating Mic Button (FAB) ---------- */}
      <div className="fab-mic-container" aria-hidden={false}>
        <button
          role="button"
          title="Toggle voice input"
          aria-pressed={isListening ? "true" : "false"}
          className={`mic-btn ${isListening ? "listening" : ""}`}
          style={{ margin: 0 }}
          onClick={toggleListen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleListen();
            }
          }}
        >
          {/* animated waves (behind) */}
          <span className="mic-waves" aria-hidden="true" />

          {/* mic icon */}
          <Mic size={22} color="#fff" strokeWidth={2.5} style={{ zIndex: 2 }} aria-hidden="true" />

          {/* label */}
          <span>{isListening ? t('Listening', lang) : t('Speak', lang)}</span>
        </button>
      </div>
    </div>
    </>
  )
}
