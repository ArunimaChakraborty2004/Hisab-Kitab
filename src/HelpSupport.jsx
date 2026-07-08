import React, { useState } from "react";
import { t } from "./translations";
import { 
  PhoneCall, MessageCircle, HeartPulse, ShieldAlert, 
  Ambulance, ChevronDown, ChevronUp, Stethoscope, 
  HelpCircle, Headset, Info
} from "lucide-react";
import "./HelpSupport.scss";

export default function HelpSupport({ lang = 'en-IN' }) {
  const [openFaq, setOpenFaq] = useState(null);

  const volunteerNumber = "+911234567890";
  const whatsappNumber = "911234567890";
  const defaultMessage = "Hello, I need assistance regarding the Hisab-Kitab app.";

  const faqs = [
    {
      q: { en: "How do I reset my PIN?", hi: "मैं अपना पिन कैसे रीसेट करूं?" },
      a: { en: "Go to Profile → Settings → Reset PIN. You will receive an OTP to verify.", hi: "प्रोफ़ाइल → सेटिंग → पिन रीसेट करें पर जाएं। आपको सत्यापित करने के लिए एक ओटीपी प्राप्त होगा।" }
    },
    {
      q: { en: "How do I add a new expense?", hi: "मैं नया खर्च कैसे जोड़ूं?" },
      a: { en: "Navigate to the Transactions tab and tap the + icon at the bottom.", hi: "लेनदेन टैब पर जाएं और नीचे + आइकन पर टैप करें।" }
    },
    {
      q: { en: "Is my data safe?", hi: "क्या मेरा डेटा सुरक्षित है?" },
      a: { en: "Yes, all your financial data is securely stored and encrypted.", hi: "हां, आपका सभी वित्तीय डेटा सुरक्षित रूप से संग्रहीत और एन्क्रिप्टेड है।" }
    },
    {
      q: { en: "How do I apply for a loan?", hi: "मैं ऋण के लिए कैसे आवेदन करूं?" },
      a: { en: "Check the 'Schemes' section to explore Mudra and other government loans.", hi: "मुद्रा और अन्य सरकारी ऋणों का पता लगाने के लिए 'योजनाएं' अनुभाग देखें।" }
    }
  ];

  function handleWhatsApp() {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  }

  function handleCall(number) {
    window.location.href = `tel:${number}`;
  }

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>
          <HeartPulse size={32} color="#f472b6" />
          {t('Health & Support', lang) || "Health & Support"}
        </h1>
        <p>{lang.startsWith('hi') ? "आपातकालीन हेल्पलाइन, स्वास्थ्य योजनाएं और ऐप समर्थन।" : "Emergency helplines, health schemes, and app support."}</p>
      </div>

      {/* Emergency Helplines Section */}
      <div className="help-section">
        <div className="section-title">
          <ShieldAlert className="icon" size={20} color="#ef4444" />
          {lang.startsWith('hi') ? "आपातकालीन हेल्पलाइन" : "Emergency Helplines"}
        </div>
        <div className="grid-cards">
          <div className="action-card emergency" onClick={() => handleCall('1091')}>
            <PhoneCall size={28} />
            <span>Women Helpline</span>
            <small>Dial 1091</small>
          </div>
          <div className="action-card emergency" onClick={() => handleCall('108')}>
            <Ambulance size={28} />
            <span>Ambulance</span>
            <small>Dial 108</small>
          </div>
          <div className="action-card emergency" onClick={() => handleCall('1930')}>
            <ShieldAlert size={28} />
            <span>Cyber Crime</span>
            <small>Dial 1930</small>
          </div>
        </div>
      </div>

      {/* Health Info Section */}
      <div className="help-section">
        <div className="section-title">
          <Stethoscope className="icon" size={20} color="#f472b6" />
          {lang.startsWith('hi') ? "स्वास्थ्य योजनाएं" : "Health Schemes & Info"}
        </div>
        
        <a 
          href="https://pmjay.gov.in/" 
          target="_blank" 
          rel="noreferrer" 
          className="health-info-card" 
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <h3>{lang.startsWith('hi') ? "आयुष्मान भारत योजना" : "Ayushman Bharat Yojana"}</h3>
          <p>{lang.startsWith('hi') ? "गरीब और कमजोर परिवारों के लिए ₹5 लाख तक का मुफ्त स्वास्थ्य बीमा कवर।" : "Free health insurance cover of up to ₹5 Lakhs for poor and vulnerable families."}</p>
        </a>
        
        <a 
          href="https://nhm.gov.in/" 
          target="_blank" 
          rel="noreferrer" 
          className="health-info-card" 
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <h3>{lang.startsWith('hi') ? "जननी सुरक्षा योजना (JSY)" : "Janani Suraksha Yojana (JSY)"}</h3>
          <p>{lang.startsWith('hi') ? "संस्थागत प्रसव को बढ़ावा देने के लिए गर्भवती महिलाओं को नकद सहायता।" : "Cash assistance for pregnant women to promote institutional delivery and healthcare."}</p>
        </a>
      </div>

      {/* App Support Section */}
      <div className="help-section">
        <div className="section-title">
          <Headset className="icon" size={20} color="#3b82f6" />
          {lang.startsWith('hi') ? "ऐप समर्थन" : "App Support"}
        </div>
        <div className="grid-cards">
          <div className="action-card primary" onClick={() => handleCall(volunteerNumber)}>
            <PhoneCall size={28} />
            <span>Call Volunteer</span>
            <small>Instant Help</small>
          </div>
          <div className="action-card whatsapp" onClick={handleWhatsApp}>
            <MessageCircle size={28} />
            <span>WhatsApp Support</span>
            <small>Chat with us</small>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="help-section">
        <div className="section-title">
          <HelpCircle className="icon" size={20} color="#eab308" />
          {lang.startsWith('hi') ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
        </div>
        
        <div>
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            const qText = lang.startsWith('hi') ? f.q.hi : f.q.en;
            const aText = lang.startsWith('hi') ? f.a.hi : f.a.en;
            
            return (
              <div key={idx} className="faq-item">
                <div 
                  className="faq-question" 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{qText}</span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    {aText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
