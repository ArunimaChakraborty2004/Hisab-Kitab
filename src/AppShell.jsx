import React from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { Bell, Search, UserCircle } from 'lucide-react'

import { t } from './translations'

// Accept route and setRoute as props
export default function AppShell({ children, route, setRoute, lang = 'en-IN' }) {
  // Title mapping for the top bar
  const routeTitles = {
    home: 'Dashboard',
    transactions: 'Transactions',
    schemes: 'Schemes',
    savings: 'Savings',
    kyc: 'KYC',
    education: 'Education Hub',
    help: 'Help & Support',
    profile: 'Profile'
  };

  return (
    <div className="app-layout">
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar route={route} setRoute={setRoute} lang={lang} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content-wrapper">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-eyebrow">{t('HisabKitabWorkspace', lang)}</div>
            <h1 className="dashboard-title">{t(routeTitles[route] || 'Dashboard', lang)}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn" type="button" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="icon-btn notification-btn" type="button" aria-label="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="user-profile-sm">
              <span className="user-avatar-sm" style={{display: 'flex', alignItems: 'center'}}><UserCircle size={20} color="var(--text-secondary)" /></span>
              <span className="user-name-sm">Arunima</span>
            </div>
          </div>
        </header>
        
        <main className="dashboard-main" style={{ paddingBottom: '80px' }}>
          {children}
        </main>
      </div>
      <BottomNav route={route} setRoute={setRoute} lang={lang} />
    </div>
  )
}
