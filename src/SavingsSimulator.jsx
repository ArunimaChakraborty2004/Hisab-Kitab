import React, { useMemo, useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Volume2, Share2 } from 'lucide-react';
import "./SavingsSimulator.scss";

// We use simplified translations, but bring back the chart
const translations = {
  "en-IN": {
    title: "Savings Simulator",
    subtitle: "Plan your future interactively.",
    q1: "How much can you save every month?",
    q2: "For how many years?",
    yourMoney: "Money You Put In",
    bankBonus: "Bank Bonus (7% p.a.)",
    total: "Total You Get!",
    rupees: "₹",
    years: "Years"
  },
  "hi-IN": {
    title: "बचत सिम्युलेटर",
    subtitle: "अंतःक्रियात्मक रूप से अपने भविष्य की योजना बनाएं।",
    q1: "आप हर महीने कितना बचा सकते हैं?",
    q2: "कितने साल के लिए?",
    yourMoney: "आपने जमा किये",
    bankBonus: "बैंक का बोनस (7% p.a.)",
    total: "आपको कुल मिलेंगे!",
    rupees: "₹",
    years: "साल"
  },
  "ta-IN": {
    title: "சேமிப்பு சிமுலேட்டர்",
    subtitle: "உங்கள் எதிர்காலத்தை ஊடாடும் முறையில் திட்டமிடுங்கள்.",
    q1: "ஒவ்வொரு மாதமும் எவ்வளவு சேமிக்க முடியும்?",
    q2: "எத்தனை வருடங்களுக்கு?",
    yourMoney: "நீங்கள் செலுத்திய பணம்",
    bankBonus: "வங்கி போனஸ் (7% p.a.)",
    total: "உங்களுக்கு கிடைக்கும் மொத்தம்!",
    rupees: "₹",
    years: "வருடங்கள்"
  }
};

export default function SavingsSimulator({ lang = "en-IN" }) {
  const [pageLang, setPageLang] = useState(lang || "en-IN");
  
  useEffect(() => {
    setPageLang(lang || "en-IN");
  }, [lang]);

  const t = translations[pageLang] || translations["en-IN"] || translations["hi-IN"];
  
  // Hybrid Inputs state
  const [monthlySave, setMonthlySave] = useState(2000);
  const [years, setYears] = useState(5);
  const rate = 7.0; 

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const simulationData = useMemo(() => {
    const monthsCount = Number(years) * 12;
    const monthlyRate = (rate / 100) / 12;

    let balance = 0;
    let totalInvested = 0;
    const chartLabels = [];
    const chartInvested = [];
    const chartBalance = [];

    for (let i = 1; i <= monthsCount; i++) {
      balance += Number(monthlySave);
      totalInvested += Number(monthlySave);
      balance = balance * (1 + monthlyRate);

      if (i % 12 === 0 || i === monthsCount || i === 1) {
        chartLabels.push(`Year ${Math.ceil(i/12)}`);
        chartInvested.push(totalInvested);
        chartBalance.push(balance);
      }
    }

    return {
      invested: totalInvested,
      total: balance,
      bonus: balance - totalInvested,
      chartLabels,
      chartInvested,
      chartBalance
    };
  }, [monthlySave, years, rate]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: simulationData.chartLabels,
        datasets: [
          {
            label: t.total,
            data: simulationData.chartBalance,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: t.yourMoney,
            data: simulationData.chartInvested,
            borderColor: "#94a3b8",
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'Inter', size: 13 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Inter', size: 14 },
            bodyFont: { family: 'Inter', size: 13 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => `₹${context.parsed.y.toLocaleString('en-IN', {maximumFractionDigits: 0})}`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { 
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: (value) => `₹${(value/1000)}k` }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [simulationData, t]);

  const readAloud = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const textToRead = `${t.total} is ${simulationData.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Rupees. ${t.yourMoney} is ${simulationData.invested.toLocaleString('en-IN')} Rupees. ${t.bankBonus} is ${simulationData.bonus.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Rupees.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    const voices = window.speechSynthesis.getVoices();
    const targetLang = pageLang === 'en-IN' ? 'en-IN' : pageLang;
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.split('-')[0]));
      if (preferredVoice) utterance.voice = preferredVoice;
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`I'm planning my savings using Hisab-Kitab!\nIf I save ${t.rupees}${monthlySave} every month for ${years} years, I will get ${t.rupees}${simulationData.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}!\nStart planning your future today!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="sim-page">
      <div className="sim-bg-animation"></div>

      <div className="sim-hero">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        
        <div className="sim-lang-switch">
          <select value={pageLang} onChange={e => setPageLang(e.target.value)}>
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="ta-IN">தமிழ்</option>
          </select>
        </div>
      </div>

      <div className="sim-main">
        {/* Left Side: Hybrid Controls */}
        <div className="sim-card">
          
          <div style={{ marginBottom: 40 }}>
            <div className="sim-question-title">{t.q1}</div>
            <div className="sim-input-row">
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>{t.rupees}</span>
              <input 
                type="number" 
                className="sim-number-input"
                value={monthlySave}
                onChange={e => setMonthlySave(Number(e.target.value) || 0)}
              />
            </div>
            <div className="sim-btn-grid">
              {[500, 1000, 2000, 5000].map(amt => (
                <button 
                  key={amt} 
                  className={`sim-quick-btn ${monthlySave === amt ? 'selected' : ''}`}
                  onClick={() => setMonthlySave(amt)}
                >
                  {t.rupees}{amt}
                </button>
              ))}
            </div>
            <input 
              type="range" 
              className="sim-range-slider" 
              min="500" max="50000" step="500"
              value={monthlySave} 
              onChange={e => setMonthlySave(Number(e.target.value))} 
            />
          </div>

          <div>
            <div className="sim-question-title">{t.q2}</div>
            <div className="sim-input-row">
              <input 
                type="number" 
                className="sim-number-input"
                value={years}
                onChange={e => setYears(Number(e.target.value) || 1)}
              />
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>{t.years}</span>
            </div>
            <div className="sim-btn-grid">
              {[1, 3, 5, 10].map(yr => (
                <button 
                  key={yr} 
                  className={`sim-quick-btn ${years === yr ? 'selected' : ''}`}
                  onClick={() => setYears(yr)}
                >
                  {yr} {t.years}
                </button>
              ))}
            </div>
            <input 
              type="range" 
              className="sim-range-slider" 
              min="1" max="40" step="1"
              value={years} 
              onChange={e => setYears(Number(e.target.value))} 
            />
          </div>

        </div>

        {/* Right Side: Visuals & Chart */}
        <div>
          <div className="sim-result-box">
            <div className="sim-result-row">
              <span>{t.yourMoney}:</span>
              <span style={{color: '#64748b'}}>{t.rupees}{simulationData.invested.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="sim-result-row">
              <span>{t.bankBonus}:</span>
              <span style={{color: '#3b82f6'}}>+{t.rupees}{simulationData.bonus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            
            <div className="sim-result-row total">
              <span>{t.total}:</span>
              <span>{t.rupees}{simulationData.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="sim-action-bar">
              <button className="icon-btn" title="Read Aloud" onClick={readAloud} style={{background:'rgba(255,255,255,0.8)', padding:8, borderRadius:8}}>
                <Volume2 size={24} color="#3b82f6" />
              </button>
              <button className="icon-btn" title="Share on WhatsApp" onClick={shareToWhatsApp} style={{background:'rgba(255,255,255,0.8)', padding:8, borderRadius:8}}>
                <Share2 size={24} color="#10b981" />
              </button>
            </div>
          </div>

          <div className="sim-card" style={{ marginTop: 24, padding: 16 }}>
            <div className="sim-chart-container">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
