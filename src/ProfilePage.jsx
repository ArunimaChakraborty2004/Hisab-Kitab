import React, { useEffect, useRef, useState } from "react";
import { t } from "./translations";
import { UserCircle, Settings, Camera, Save, X, Edit3, CheckCircle2 } from "lucide-react";
import "./ProfilePage.scss";

const STORAGE_KEY = "finsakhi_profile_v1";

const SAMPLE = {
  name: "Arunima",
  village: "Bengaluru Rural",
  language: "English",
  group: "Self Help Group A",
  phone: "+91 98765 43210",
  email: "arunima@example.com",
  avatarUrl: "",
  notifications: true,
  appLock: false,
  smsAlerts: true
};

export default function ProfilePage({ lang = 'en-IN' }) {
  const [profile, setProfile] = useState(SAMPLE);
  const [draft, setDraft] = useState(SAMPLE);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const merged = { ...SAMPLE, ...obj };
        setProfile(merged);
        setDraft(merged);
      }
    } catch {}
  }, []);

  function persist(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function startEdit() {
    setDraft(profile);
    setEditing(true);
    setError("");
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(profile);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function updateField(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function onAvatarPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 2 * 1024 * 1024) {
      setError("Image too large — pick under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => updateField("avatarUrl", ev.target.result);
    reader.readAsDataURL(f);
  }

  function saveProfile(e) {
    e?.preventDefault();
    if (!draft.name.trim() || !draft.village.trim()) {
      setError("Name and Village are required.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      persist(draft);
      setProfile(draft);
      setEditing(false);
      setLoading(false);
      setToast(lang.startsWith('hi') ? "प्रोफ़ाइल अपडेट की गई!" : "Profile & Settings Updated!");
      setTimeout(() => setToast(""), 3000);
    }, 600);
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <h1>
          <UserCircle size={32} color="#8b5cf6" />
          {t('Profile', lang) || "Profile & Settings"}
        </h1>
        <p>{lang.startsWith('hi') ? "अपनी व्यक्तिगत जानकारी और ऐप प्राथमिकताएं प्रबंधित करें।" : "Manage your personal information and app preferences."}</p>
      </div>

      {/* AVATAR & QUICK ACTIONS SECTION */}
      <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {profile.avatarUrl || draft.avatarUrl ? (
              <img
                src={editing ? draft.avatarUrl || profile.avatarUrl : profile.avatarUrl}
                className="avatar-img"
                alt="avatar"
              />
            ) : (
              <div className="avatar-fallback">
                {(draft.name || profile.name || "A")[0].toUpperCase()}
              </div>
            )}
            
            {editing && (
              <button className="avatar-upload-btn" onClick={() => fileRef.current?.click()}>
                <Camera size={16} />
                <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarPick} />
              </button>
            )}
          </div>

          <div className="profile-name">{editing ? draft.name : profile.name}</div>
          <div className="profile-sub">{editing ? draft.village : profile.village}</div>
        </div>

        <div style={{ marginTop: 24, width: '100%', maxWidth: 300 }}>
          {!editing ? (
            <button className="btn btn-primary" onClick={startEdit} style={{ width: '100%' }}>
              <Edit3 size={18} /> 
              {lang.startsWith('hi') ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: '100%' }}>
              <button className="btn btn-save" onClick={saveProfile}>
                {loading ? (lang.startsWith('hi') ? "सहेजा जा रहा है..." : "Saving...") : (
                  <><Save size={18} /> {lang.startsWith('hi') ? "परिवर्तन सहेजें" : "Save Changes"}</>
                )}
              </button>
              <button className="btn btn-secondary" onClick={cancelEdit}>
                <X size={18} /> {lang.startsWith('hi') ? "रद्द करें" : "Cancel"}
              </button>
            </div>
          )}
        </div>
        {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}
      </div>

      {/* PERSONAL INFORMATION SECTION */}
      <div className="profile-section">
        <div className="section-title">
          <UserCircle className="icon" size={20} color="#3b82f6" />
          {lang.startsWith('hi') ? "व्यक्तिगत जानकारी" : "Personal Information"}
        </div>
        
        <div className="form-grid">
          <label className="field">
            <span className="field-title">{lang.startsWith('hi') ? "पूरा नाम" : "Full Name"}</span>
            {!editing ? (
              <div className="field-read">{profile.name}</div>
            ) : (
              <input value={draft.name} onChange={(e) => updateField("name", e.target.value)} />
            )}
          </label>

          <label className="field">
            <span className="field-title">{lang.startsWith('hi') ? "फ़ोन नंबर" : "Phone Number"}</span>
            {!editing ? (
              <div className="field-read">{profile.phone || "-"}</div>
            ) : (
              <input value={draft.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91..." />
            )}
          </label>

          <label className="field">
            <span className="field-title">{lang.startsWith('hi') ? "गांव / जिला" : "Village / District"}</span>
            {!editing ? (
              <div className="field-read">{profile.village}</div>
            ) : (
              <input value={draft.village} onChange={(e) => updateField("village", e.target.value)} />
            )}
          </label>

          <label className="field">
            <span className="field-title">{lang.startsWith('hi') ? "एसएचजी समूह" : "SHG Group"}</span>
            {!editing ? (
              <div className="field-read">{profile.group || "-"}</div>
            ) : (
              <input value={draft.group} onChange={(e) => updateField("group", e.target.value)} />
            )}
          </label>
        </div>
      </div>

      {/* APP SETTINGS SECTION */}
      <div className="profile-section">
        <div className="section-title">
          <Settings className="icon" size={20} color="#10b981" />
          {lang.startsWith('hi') ? "ऐप सेटिंग्स" : "App Settings"}
        </div>
        
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <span>{lang.startsWith('hi') ? "पुश सूचनाएं" : "Push Notifications"}</span>
              <small>{lang.startsWith('hi') ? "नए ऋण और योजनाओं के लिए अलर्ट प्राप्त करें" : "Receive alerts for new loans and schemes"}</small>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                disabled={!editing}
                checked={draft.notifications} 
                onChange={(e) => updateField("notifications", e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span>{lang.startsWith('hi') ? "एसएमएस अलर्ट" : "SMS Alerts"}</span>
              <small>{lang.startsWith('hi') ? "महत्वपूर्ण लेनदेन के लिए एसएमएस प्राप्त करें" : "Get SMS for important transactions"}</small>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                disabled={!editing}
                checked={draft.smsAlerts} 
                onChange={(e) => updateField("smsAlerts", e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span>{lang.startsWith('hi') ? "ऐप लॉक (पिन)" : "App Lock (PIN)"}</span>
              <small>{lang.startsWith('hi') ? "ऐप खोलने के लिए पिन आवश्यक करें" : "Require PIN to open the app"}</small>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                disabled={!editing}
                checked={draft.appLock} 
                onChange={(e) => updateField("appLock", e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast">
          <CheckCircle2 size={20} />
          {toast}
        </div>
      )}
    </div>
  );
}
