import React, { useState } from "react";
import axios from "axios";
import { Volume2, MessageCircle } from 'lucide-react';
import { t } from "./translations";
import "./KYCPage.scss";

const simpleTranslations = {
  "en-IN": {
    title: "KYC Verification",
    subtitle: "Securely verify your identity in 2 minutes.",
    step1: "Select Document Type",
    step2: "Upload Clear Photo",
    step3: "Verifying...",
    success: "Verification Submitted!",
    aadhar: "Aadhar Card",
    pan: "PAN Card",
    voter: "Voter ID",
    uploadBtn: "Submit & Verify",
    tapToUpload: "Tap here to choose a photo",
    helpMsg: "Need help? Chat with us on WhatsApp!"
  },
  "hi-IN": {
    title: "केवाईसी सत्यापन",
    subtitle: "2 मिनट में सुरक्षित रूप से अपनी पहचान सत्यापित करें।",
    step1: "दस्तावेज़ का प्रकार चुनें",
    step2: "साफ़ फोटो अपलोड करें",
    step3: "सत्यापन हो रहा है...",
    success: "सत्यापन सबमिट किया गया!",
    aadhar: "आधार कार्ड",
    pan: "पैन कार्ड",
    voter: "वोटर आईडी",
    uploadBtn: "सबमिट और सत्यापित करें",
    tapToUpload: "फोटो चुनने के लिए यहाँ टैप करें",
    helpMsg: "मदद चाहिए? व्हाट्सएप पर चैट करें!"
  },
  "ta-IN": {
    title: "KYC சரிபார்ப்பு",
    subtitle: "உங்கள் அடையாளத்தை 2 நிமிடங்களில் பாதுகாப்பாக சரிபார்க்கவும்.",
    step1: "ஆவண வகையைத் தேர்ந்தெடுக்கவும்",
    step2: "தெளிவான புகைப்படத்தை பதிவேற்றவும்",
    step3: "சரிபார்க்கப்படுகிறது...",
    success: "சரிபார்ப்பு சமர்ப்பிக்கப்பட்டது!",
    aadhar: "ஆதார் அட்டை",
    pan: "பான் அட்டை",
    voter: "வாக்காளர் அட்டை",
    uploadBtn: "சமர்ப்பிக்கவும் சரிபார்க்கவும்",
    tapToUpload: "புகைப்படத்தை தேர்ந்தெடுக்க இங்கே தட்டவும்",
    helpMsg: "உதவி தேவையா? வாட்ஸ்அப்பில் அரட்டையடிக்கவும்!"
  }
};

export default function KYCPage({ lang = 'en-IN' }) {
  const dict = simpleTranslations[lang] || simpleTranslations["en-IN"];
  const [step, setStep] = useState(1);
  
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const readAloud = (text) => {
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

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Hi Hisab-Kitab Support,\nI need help with my KYC Verification.`);
    window.open(`https://wa.me/?text=\${text}`, '_blank');
  };

  const handleDocSelect = (type) => {
    setDocumentType(type);
    setStep(2);
    readAloud(dict.step2);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setErrorMsg("");
    if (!f) return setFile(null);
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) {
      setErrorMsg("Only JPG/PNG images and PDF allowed");
      e.target.value = null;
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) return setErrorMsg("Please choose a file first");
    
    setStep(3);
    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("documentType", documentType);

    try {
      const res = await axios.post(`${API_BASE}/kyc/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        }
      });

      const { receiptUrl } = res.data || {};
      
      setTimeout(() => {
        setStep(4);
        readAloud(dict.success);
        setUploading(false);
        
        if (receiptUrl) {
          const fullUrl = `${window.location.origin}${receiptUrl}`;
          const a = document.createElement("a");
          a.href = fullUrl;
          a.download = `kyc-receipt.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }, 1000); // Artificial delay for smooth UX

    } catch (err) {
      console.error("Upload failed:", err);
      const message = err?.response?.data?.error || err?.message || "Upload failed";
      setErrorMsg(message);
      setStep(2);
      setUploading(false);
    }
  };

  return (
    <div className="kyc-page">
      <div className="kyc-bg-animation"></div>

      <div className="kyc-hero">
        <h1>{dict.title}</h1>
        <p>{dict.subtitle}</p>
      </div>

      <div className="kyc-main-card">
        
        <div className="kyc-action-bar">
          <button className="icon-btn" title="Read Instructions" onClick={() => readAloud(step === 1 ? dict.step1 : step === 2 ? dict.step2 : dict.success)} style={{background:'rgba(59,130,246,0.1)', padding:8, borderRadius:8}}>
            <Volume2 size={24} color="#3b82f6" />
          </button>
          <button className="icon-btn" title="Get Help on WhatsApp" onClick={shareToWhatsApp} style={{background:'rgba(16,185,129,0.1)', padding:8, borderRadius:8}}>
            <MessageCircle size={24} color="#10b981" />
          </button>
        </div>

        <div className="kyc-stepper">
          {[1, 2, 3].map(i => (
            <div key={i} className={`kyc-step-dot ${step >= i ? 'active' : ''}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="kyc-step-title">{dict.step1}</div>
            <div className="kyc-doc-grid">
              <div className="kyc-doc-btn" onClick={() => handleDocSelect('aadhar')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
                {dict.aadhar}
              </div>
              <div className="kyc-doc-btn" onClick={() => handleDocSelect('pan')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
                {dict.pan}
              </div>
              <div className="kyc-doc-btn" onClick={() => handleDocSelect('voter')}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🗳️</div>
                {dict.voter}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div className="kyc-step-title">{dict.step2}</div>
            
            <input
              id="kyc-file"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="kyc-file">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="kyc-preview-img" />
              ) : (
                <div className="kyc-upload-area">
                  <div className="kyc-upload-icon">📸</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{dict.tapToUpload}</div>
                  {file && <div style={{ marginTop: 12 }}>{file.type === "application/pdf" ? "PDF Document Ready" : file.name}</div>}
                </div>
              )}
            </label>

            {errorMsg && <div style={{ color: "#ef4444", marginBottom: 16, fontWeight: 600 }}>{errorMsg}</div>}

            <button className="kyc-primary-btn" onClick={handleUpload} disabled={!file}>
              {dict.uploadBtn}
            </button>
            <div style={{ marginTop: 16 }}>
              <button className="secondary-btn" onClick={() => { setStep(1); setFile(null); setPreviewUrl(""); }}>Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="kyc-step-title">{dict.step3}</div>
            <div className="kyc-loading-spinner"></div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>{progress}%</div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="kyc-success-icon">✅</div>
            <div className="kyc-step-title">{dict.success}</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your document has been securely submitted and is pending verification. A receipt has been downloaded.</p>
            <button className="kyc-primary-btn" onClick={() => { setStep(1); setFile(null); setPreviewUrl(""); setDocumentType(""); }}>Submit Another</button>
          </div>
        )}

      </div>
    </div>
  );
}
